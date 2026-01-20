import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Edit3,
  ImagePlus,
  Trash2,
  Image,
  FolderOpen,
  Share2,
  Check,
  Copy,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Album, Photo, ViewMode, SortOrder } from "../types";
import {
  deleteAlbum,
  deletePhoto,
  fetchAlbum,
  updateAlbum,
  uploadPhotos,
  toggleShareAlbum,
} from "../services/albums";
import { ViewToggle } from "../components/ViewToggle";
import { PhotoGrid } from "../components/photos/PhotoGrid";
import { PhotoTable } from "../components/photos/PhotoTable";
import { Modal } from "../components/ui/Modal";
import { PhotoPreview } from "../components/photos/PhotoPreview";
import { AlbumForm, AlbumFormValues } from "../components/albums/AlbumForm";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { DropZone } from "../components/ui/DropZone";
import { SortSelect } from "../components/ui/SortSelect";
import { Pagination } from "../components/ui/Pagination";
import { converterCor } from "../utils/cores";
import StarBorder from "../components/ui/StarBorder";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

const uploadSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  acquisitionDate: z.string().optional(),
  predominantColor: z.string().optional(),
});

type UploadValues = z.infer<typeof uploadSchema>;

const ITEMS_PER_PAGE = 12;

export function AlbumDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const albumId = params.id as string;
  const queryClient = useQueryClient();
  const [view, setView] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [deleteAlbumConfirm, setDeleteAlbumConfirm] = useState(false);
  const [deletePhotoConfirm, setDeletePhotoConfirm] = useState<Photo | null>(null);

  const {
    data: album,
    isLoading,
    error,
  } = useQuery<Album>({
    queryKey: ["album", albumId, sortOrder],
    queryFn: () => fetchAlbum(albumId, sortOrder),
    enabled: Boolean(albumId),
  });

  const updateMutation = useMutation({
    mutationFn: (values: AlbumFormValues) => updateAlbum(albumId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setShowEdit(false);
    },
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: () => deleteAlbum(albumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      navigate("/albums");
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: string) => deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album", albumId, sortOrder] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });

  const shareMutation = useMutation({
    mutationFn: () => toggleShareAlbum(albumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album", albumId, sortOrder] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (payload: UploadValues & { files: File[] }) =>
      uploadPhotos(albumId, {
        files: payload.files,
        title: payload.title,
        description: payload.description,
        acquisitionDate: payload.acquisitionDate,
        predominantColor: payload.predominantColor ? converterCor(payload.predominantColor) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album", albumId, sortOrder] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setShowUpload(false);
      setSelectedFiles([]);
      uploadForm.reset();
    },
  });

  const uploadForm = useForm<UploadValues>({
    resolver: zodResolver(uploadSchema),
  });

  // ============================================
  // 🔴 useMemo DEVE estar ANTES de qualquer return condicional
  // ============================================
  const photoCount = useMemo(() => {
    return album?.photos?.length ?? 0;
  }, [album?.photos]);

  const totalPages = useMemo(() => {
    return Math.ceil(photoCount / ITEMS_PER_PAGE);
  }, [photoCount]);

  const paginatedPhotos = useMemo(() => {
    if (!album?.photos || album.photos.length === 0) {
      return [];
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return album.photos.slice(start, start + ITEMS_PER_PAGE);
  }, [album?.photos, currentPage]);

  const shareUrl = useMemo(() => {
    if (!album?.share_token) return null;
    return `${window.location.origin}/public/album/${album.share_token}`;
  }, [album?.share_token]);

  // ============================================
  // 🟢 Funções auxiliares (não são hooks)
  // ============================================
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const copyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteAlbum = () => {
    setDeleteAlbumConfirm(true);
  };

  const confirmDeleteAlbum = () => {
    deleteAlbumMutation.mutate();
  };

  const handleDeletePhoto = (photo: Photo) => {
    setDeletePhotoConfirm(photo);
  };

  const confirmDeletePhoto = () => {
    if (deletePhotoConfirm) {
      deletePhotoMutation.mutate(deletePhotoConfirm.id);
    }
  };

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  // ============================================
  // 🟢 AGORA SIM podemos ter returns condicionais
  // 🟢 Todos os hooks já foram chamados acima
  // ============================================

  if (!albumId) {
    return (
      <div className="card text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <FolderOpen size={28} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Álbum inválido</h3>
        <p className="text-muted-foreground">Não foi possível identificar o álbum solicitado.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-muted-foreground">Carregando álbum...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <FolderOpen size={28} className="text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar</h3>
        <p className="text-muted-foreground">Não foi possível carregar o álbum. Tente novamente.</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="card text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <FolderOpen size={28} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Álbum não encontrado</h3>
        <p className="text-muted-foreground">O álbum que você procura não existe ou foi removido.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Breadcrumb / Navigation */}
      <Link to="/albums" className="inline-flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="hidden sm:inline">Voltar aos álbuns</span>
        <span className="sm:hidden">Voltar</span>
      </Link>

      {/* Album Header */}
      <div className="card space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">{album.title}</h1>
            {album.description && (
              <p className="text-sm sm:text-base text-muted-foreground">{album.description}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-sm text-primary whitespace-nowrap w-fit">
              <Image size={16} />
              {photoCount} {photoCount === 1 ? "foto" : "fotos"}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <StarBorder 
                as="button" 
                onClick={() => setShowShare(true)} 
                className="p-2.5"
                title={album.is_public ? "Compartilhado" : "Compartilhar"}
              >
                <Share2 size={18} />
              </StarBorder>
              <StarBorder 
                as="button" 
                onClick={() => setShowEdit(true)} 
                className="p-2.5"
                title="Editar álbum"
              >
                <Edit3 size={18} />
              </StarBorder>
              <button 
                onClick={() => setShowUpload(true)} 
                className="btn btn-primary text-sm px-4 py-2 flex-1 sm:flex-initial min-w-0"
              >
                <ImagePlus size={16} /> 
                <span className="hidden sm:inline">Adicionar fotos</span>
                <span className="sm:hidden truncate">Adicionar fotos</span>
              </button>
              {photoCount === 0 && (
                <button 
                  onClick={handleDeleteAlbum} 
                  className="btn btn-danger text-sm px-4 py-2"
                >
                  <Trash2 size={16} /> 
                  <span className="hidden sm:inline">Excluir</span>
                  <span className="sm:hidden">Excluir</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle & Sort */}
      {photoCount > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 order-2 sm:order-1">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Visualização:</span>
            <ViewToggle value={view} onChange={setView} />
          </div>
          <div className="order-1 sm:order-2">
            <SortSelect value={sortOrder} onChange={handleSortChange} />
          </div>
        </div>
      )}

      {/* Photos Content */}
      {view === "grid" ? (
        <PhotoGrid photos={paginatedPhotos} onSelect={setSelectedPhoto} onDelete={handleDeletePhoto} />
      ) : (
        <PhotoTable photos={paginatedPhotos} onSelect={setSelectedPhoto} onDelete={handleDeletePhoto} />
      )}

      {/* Pagination */}
      {photoCount > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={photoCount}
        />
      )}

      {/* Photo Preview Modal */}
      <PhotoPreview 
        photo={selectedPhoto} 
        photos={album.photos ?? []}
        currentIndex={selectedPhoto && album.photos ? album.photos.findIndex(p => p.id === selectedPhoto.id) : undefined}
        onClose={() => setSelectedPhoto(null)}
        onNavigate={(index) => setSelectedPhoto(album.photos?.[index] ?? null)}
      />

      {/* Upload Modal */}
      <Modal
        open={showUpload}
        onClose={() => {
          setShowUpload(false);
          setSelectedFiles([]);
          uploadForm.reset();
        }}
        title="Adicionar novas fotos"
        size="large"
      >
        <form
          className="space-y-6"
          onSubmit={uploadForm.handleSubmit((values) => {
            if (selectedFiles.length === 0) return;
            uploadMutation.mutate({ ...values, files: selectedFiles });
          })}
        >
          <DropZone onFilesSelected={handleFilesSelected} selectedCount={selectedFiles.length} />

          {selectedFiles.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-card-hover rounded-lg">
              <span className="text-sm text-foreground">
                {selectedFiles.length} {selectedFiles.length === 1 ? "arquivo selecionado" : "arquivos selecionados"}
              </span>
              <button
                type="button"
                onClick={() => setSelectedFiles([])}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Limpar seleção
              </button>
            </div>
          )}

          <div className="border-top border-border" />

          <p className="text-sm text-muted-foreground">
            Os campos abaixo são opcionais e serão aplicados a todas as fotos enviadas.
          </p>

          <Input
            label="Título"
            placeholder="Nome das fotos"
            hint="Se vazio, usa o nome do arquivo"
            {...uploadForm.register("title")}
          />

          <Textarea
            label="Descrição"
            placeholder="Descreva o contexto das imagens..."
            rows={2}
            {...uploadForm.register("description")}
          />

          <Input
            label="Cor predominante"
            type="text"
            placeholder="Ex: azul, vermelho, #00ffc2"
            hint="Use nomes em português ou código hexadecimal"
            {...uploadForm.register("predominantColor")}
          />

          <div className="flex justify-end gap-3">
            <StarBorder
              as="button"
              type="button"
              onClick={() => {
                setShowUpload(false);
                setSelectedFiles([]);
                uploadForm.reset();
              }}
            >
              Cancelar
            </StarBorder>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploadMutation.isPending || selectedFiles.length === 0}
            >
              {uploadMutation.isPending ? "Enviando..." : "Adicionar fotos"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Share Modal */}
      <Modal open={showShare} onClose={() => setShowShare(false)} title="Compartilhar álbum">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            {album.is_public
              ? "Este álbum está público. Qualquer pessoa com o link pode visualizá-lo."
              : "Torne este álbum público para compartilhar com outras pessoas."}
          </p>

          {album.is_public && shareUrl && (
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-card-hover rounded-lg border border-border text-sm text-foreground truncate">
                {shareUrl}
              </div>
              <button onClick={copyShareLink} className="btn btn-secondary" title="Copiar link">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <StarBorder as="button" type="button" onClick={() => setShowShare(false)}>
              Fechar
            </StarBorder>
            <button
              onClick={() => shareMutation.mutate()}
              className={`btn ${album.is_public ? "btn-danger" : "btn-primary"}`}
              disabled={shareMutation.isPending}
            >
              {shareMutation.isPending
                ? "Processando..."
                : album.is_public
                ? "Tornar privado"
                : "Tornar público"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Album Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Editar álbum">
        <AlbumForm
          defaultValues={{
            title: album.title,
            description: album.description,
          }}
          submitting={updateMutation.isPending}
          onSubmit={async (values) => {
            await updateMutation.mutateAsync(values);
          }}
        />
      </Modal>

      {/* Delete Album Confirmation */}
      <ConfirmDialog
        open={deleteAlbumConfirm}
        onClose={() => setDeleteAlbumConfirm(false)}
        onConfirm={confirmDeleteAlbum}
        title="Excluir álbum?"
        message={
          photoCount > 0
            ? "Não é possível excluir um álbum que contém fotos. Remova todas as fotos primeiro."
            : `Tem certeza que deseja excluir o álbum "${album.title}"? Esta ação não pode ser desfeita e todas as configurações de compartilhamento serão perdidas.`
        }
        confirmText="Excluir álbum"
        variant={photoCount > 0 ? "warning" : "danger"}
        isLoading={deleteAlbumMutation.isPending}
      />

      {/* Delete Photo Confirmation */}
      <ConfirmDialog
        open={!!deletePhotoConfirm}
        onClose={() => setDeletePhotoConfirm(null)}
        onConfirm={confirmDeletePhoto}
        title="Excluir foto?"
        message={
          deletePhotoConfirm
            ? `Tem certeza que deseja excluir a foto "${deletePhotoConfirm.title}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmText="Excluir foto"
        variant="danger"
        isLoading={deletePhotoMutation.isPending}
      />
    </div>
  );
}
