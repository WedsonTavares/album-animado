import { Album, Photo, SortOrder } from "../types";
import { supabase, STORAGE_BUCKET, DbAlbum, DbPhoto } from "../lib/supabase";

export const fetchAlbums = async (): Promise<Album[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: albums, error } = await supabase
    .from("albums")
    .select(`
      *,
      photos (id)
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  // Contar fotos e pegar primeira foto para thumbnail
  const albumsWithCount = await Promise.all(
    ((albums as (DbAlbum & { photos: { id: string }[] })[]) || []).map(async (album) => {
      const { data: firstPhoto } = await supabase
        .from("photos")
        .select("*")
        .eq("album_id", album.id)
        .order("created_at", { ascending: false})
        .limit(1)
        .maybeSingle();

      return {
        ...album,
        photo_count: album.photos?.length || 0,
        photos: firstPhoto ? [firstPhoto as DbPhoto] : [],
      } as Album;
    })
  );

  return albumsWithCount;
};

export const fetchAlbum = async (id: string, sort: SortOrder = "desc"): Promise<Album> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: album, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  if (!album) throw new Error("Álbum não encontrado");

  const { data: photos, error: photosError } = await supabase
    .from("photos")
    .select("*")
    .eq("album_id", id)
    .order("acquisition_date", { ascending: sort === "asc" });

  if (photosError) throw photosError;

  return { ...(album as DbAlbum), photos: (photos as DbPhoto[]) || [] } as Album;
};

export const fetchPublicAlbum = async (
  token: string,
  sort: SortOrder = "desc"
): Promise<Album & { user?: { name?: string; email: string } }> => {
  const { data: album, error } = await supabase
    .from("albums")
    .select("*")
    .eq("share_token", token)
    .eq("is_public", true)
    .single();

  if (error) throw error;
  if (!album) throw new Error("Álbum não encontrado ou não está público");

  const typedAlbum = album as DbAlbum;

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("album_id", typedAlbum.id)
    .order("acquisition_date", { ascending: sort === "asc" });

  return { ...typedAlbum, photos: (photos as DbPhoto[]) || [] } as Album;
};

export const createAlbum = async (payload: {
  title: string;
  description: string;
}): Promise<Album> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("albums")
    .insert({
      title: payload.title,
      description: payload.description,
      user_id: user.id,
    } as Partial<DbAlbum>)
    .select()
    .single();

  if (error) throw error;
  return data as Album;
};

export const updateAlbum = async (
  id: string,
  payload: { title: string; description: string }
): Promise<Album> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("albums")
    .update({
      title: payload.title,
      description: payload.description,
      updated_at: new Date().toISOString(),
    } as Partial<DbAlbum>)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Album;
};

export const deleteAlbum = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // Verificar se tem fotos
  const { data: photos } = await supabase
    .from("photos")
    .select("id")
    .eq("album_id", id);

  if (photos && photos.length > 0) {
    throw new Error("Não é possível excluir um álbum que contém fotos");
  }

  const { error } = await supabase
    .from("albums")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
};

export const toggleShareAlbum = async (
  id: string
): Promise<{
  is_public: boolean;
  share_token: string | null;
  shareUrl: string | null;
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // Buscar álbum atual
  const { data: album, error: fetchError } = await supabase
    .from("albums")
    .select("is_public, share_token")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError) throw fetchError;
  if (!album) throw new Error("Álbum não encontrado");

  const typedAlbum = album as Pick<DbAlbum, "is_public" | "share_token">;
  const newIsPublic = !typedAlbum.is_public;
  let shareToken = typedAlbum.share_token;

  // Gerar token se habilitando compartilhamento
  if (newIsPublic && !shareToken) {
    shareToken = crypto.randomUUID();
  }

  // Remover token se desabilitando
  if (!newIsPublic) {
    shareToken = null;
  }

  const { data, error } = await supabase
    .from("albums")
    .update({
      is_public: newIsPublic,
      share_token: shareToken,
      updated_at: new Date().toISOString(),
    } as Partial<DbAlbum>)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  const result = data as DbAlbum;
  return {
    is_public: result.is_public,
    share_token: result.share_token,
    shareUrl: result.share_token
      ? `${window.location.origin}/album/${result.share_token}`
      : null,
  };
};

export const uploadPhotos = async (
  albumId: string,
  payload: {
    files: FileList | File[];
    title?: string;
    description?: string;
    acquisitionDate?: string;
    predominantColor?: string;
  }
): Promise<Photo[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const filesArray = Array.from(payload.files);
  const results: Photo[] = [];

  for (const file of filesArray) {
    const fileName = `${user.id}/${albumId}/${Date.now()}-${file.name}`;

    // Upload para Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw new Error(`Erro ao fazer upload: ${uploadError.message}`);

    // Gerar URL pública
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    const acquisitionDate =
      payload.acquisitionDate || new Date().toISOString();

    const title = payload.title || file.name.replace(/\.[^/.]+$/, "");

    // Inserir no banco
    const { data: photo, error: insertError } = await supabase
      .from("photos")
      .insert({
        title,
        description: payload.description || null,
        file_name: fileName,
        file_path: urlData.publicUrl,
        size_bytes: file.size,
        acquisition_date: acquisitionDate,
        predominant_color: payload.predominantColor || null,
        album_id: albumId,
      } as Partial<DbPhoto>)
      .select()
      .single();

    if (insertError) throw insertError;
    results.push(photo as Photo);
  }

  // Atualizar updated_at do álbum
  await supabase
    .from("albums")
    .update({ updated_at: new Date().toISOString() } as Partial<DbAlbum>)
    .eq("id", albumId);

  return results;
};

export const deletePhoto = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // Buscar foto para pegar o fileName
  const { data: photo, error: fetchError } = await supabase
    .from("photos")
    .select("file_name, album_id")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;
  if (!photo) throw new Error("Foto não encontrada");

  const typedPhoto = photo as Pick<DbPhoto, "file_name" | "album_id">;

  // Verificar se o álbum pertence ao usuário
  const { data: album } = await supabase
    .from("albums")
    .select("user_id")
    .eq("id", typedPhoto.album_id)
    .single();

  const typedAlbum = album as Pick<DbAlbum, "user_id"> | null;
  if (!typedAlbum || typedAlbum.user_id !== user.id) {
    throw new Error("Foto não encontrada");
  }

  // Deletar do banco
  const { error: deleteError } = await supabase
    .from("photos")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;

  // Deletar do Storage
  await supabase.storage.from(STORAGE_BUCKET).remove([typedPhoto.file_name]);
};
