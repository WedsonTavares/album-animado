import { Plus, FolderOpen } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Album, ViewMode } from "../types";
import { fetchAlbums, createAlbum, deleteAlbum } from "../services/albums";
import { AlbumCard } from "../components/albums/AlbumCard";
import { AlbumTable } from "../components/albums/AlbumTable";
import { ViewToggle } from "../components/ViewToggle";
import { Modal } from "../components/ui/Modal";
import { AlbumForm, AlbumFormValues } from "../components/albums/AlbumForm";
import StarBorder from "../components/ui/StarBorder";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

export function AlbumListPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; album: Album | null }>({
    open: false,
    album: null,
  });
  const queryClient = useQueryClient();
  const { data: albums = [], isLoading } = useQuery<Album[]>({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
  });

  const createMutation = useMutation({
    mutationFn: (data: AlbumFormValues) => createAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAlbum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      setDeleteConfirm({ open: false, album: null });
    },
  });

  const handleDelete = (album: Album) => {
    if ((album.photo_count ?? 0) > 0) {
      setDeleteConfirm({ open: true, album: null });
      return;
    }
    setDeleteConfirm({ open: true, album });
  };

  const confirmDelete = () => {
    if (deleteConfirm.album) {
      deleteMutation.mutate(deleteConfirm.album.id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Summary Header */}
      <div className="card space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">Meus Álbuns de Fotos</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Organize suas memórias em álbuns, adicione fotos e compartilhe com quem você ama.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <ViewToggle value={viewMode} onChange={setViewMode} />
            <button onClick={() => setOpen(true)} className="btn btn-primary text-sm sm:text-base flex-shrink-0">
              <Plus size={16} /> <span className="hidden sm:inline">Criar novo álbum</span><span className="sm:hidden">Novo</span>
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-muted-foreground">Carregando seus álbuns...</span>
        </div>
      ) : albums.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={28} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum álbum ainda</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Comece criando seu primeiro álbum para organizar suas fotos favoritas.
          </p>
          <button onClick={() => setOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Criar primeiro álbum
          </button>
        </div>
      ) : (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <AlbumTable albums={albums} onDelete={handleDelete} />
        )
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Criar novo álbum"
        footer={
          <StarBorder as="button" onClick={() => setOpen(false)}>
            Cancelar
          </StarBorder>
        }
      >
        <AlbumForm
          submitting={createMutation.isPending}
          onSubmit={async (values) => {
            await createMutation.mutateAsync(values);
          }}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, album: null })}
        onConfirm={confirmDelete}
        title={
          deleteConfirm.album ? "Excluir álbum?" : "Não é possível excluir"
        }
        message={
          deleteConfirm.album
            ? `Tem certeza que deseja excluir o álbum "${deleteConfirm.album.title}"? Esta ação não pode ser desfeita.`
            : "Não é possível excluir um álbum que contém fotos. Remova todas as fotos primeiro."
        }
        confirmText="Excluir"
        variant={deleteConfirm.album ? "danger" : "warning"}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
