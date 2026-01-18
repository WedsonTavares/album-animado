import fs from "fs/promises";
import path from "path";
import { prisma } from "../prisma";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { extractPredominantColor } from "../utils/color";
import { extractAcquisitionDate } from "../utils/exif";
import { HttpError } from "../utils/httpError";
import { supabase, supabaseBucket } from "../utils/supabase";
import env from "../config/env";

const getUserId = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new HttpError(401, "Não autorizado");
  }
  return req.user.id;
};

export const addPhotos = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = getUserId(req);
  const albumId = Number(req.params.albumId);

  const album = await prisma.album.findFirst({ where: { id: albumId, userId } });
  if (!album) {
    throw new HttpError(404, "Álbum não encontrado");
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    throw new HttpError(400, "Envie ao menos uma foto");
  }

  const results = [];
  for (const file of files) {
    const buffer = await fs.readFile(file.path);

    const acquisitionInput = req.body.acquisitionDate
      ? new Date(req.body.acquisitionDate)
      : null;
    const acquisitionFromExif = await extractAcquisitionDate(buffer);
    const acquisitionDate =
      acquisitionInput && !isNaN(acquisitionInput.getTime())
        ? acquisitionInput
        : acquisitionFromExif || new Date();

    const predominantColor =
      (req.body.predominantColor as string | undefined) ||
      (await extractPredominantColor(file.path));

    const title =
      (req.body.title as string | undefined) || path.parse(file.originalname).name;
    const description = (req.body.description as string | undefined) || null;

    // Upload para Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(supabaseBucket)
      .upload(fileName, buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw new HttpError(500, `Erro ao fazer upload: ${uploadError.message}`);
    }

    // Gerar URL pública
    const { data: urlData } = supabase.storage
      .from(supabaseBucket)
      .getPublicUrl(fileName);

    const created = await prisma.photo.create({
      data: {
        title,
        description,
        fileName,
        filePath: urlData.publicUrl,
        sizeBytes: file.size,
        acquisitionDate,
        predominantColor,
        albumId,
      },
    });

    // Remover arquivo temporário local
    await fs.unlink(file.path).catch(() => null);

    results.push(created);
  }

  res.status(201).json(results);
});

export const deletePhoto = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = getUserId(req);
    const photoId = Number(req.params.id);

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { album: { select: { userId: true } } },
    });

    if (!photo || photo.album.userId !== userId) {
      throw new HttpError(404, "Foto não encontrada");
    }

    await prisma.photo.delete({ where: { id: photoId } });

    // Deletar do Supabase Storage
    await supabase.storage
      .from(supabaseBucket)
      .remove([photo.fileName])
      .catch(() => null);

    res.status(204).send();
  },
);
