import { Image, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Album, Photo, ViewMode, SortOrder } from "../types";
import { fetchPublicAlbum } from "../services/albums";
import { ViewToggle } from "../components/ViewToggle";
import { PhotoGrid } from "../components/photos/PhotoGrid";
import { PhotoTable } from "../components/photos/PhotoTable";
import { PhotoPreview } from "../components/photos/PhotoPreview";
import { SortSelect } from "../components/ui/SortSelect";
import { Pagination } from "../components/ui/Pagination";
import GradientText from "../components/ui/GradientText";

const ITEMS_PER_PAGE = 12;

export function PublicAlbumPage() {
  const { token } = useParams();
  const [view, setView] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: album, isLoading, error } = useQuery<
    Album & { user?: { name?: string; email: string } }
  >({
    queryKey: ["public-album", token, sortOrder],
    queryFn: () => fetchPublicAlbum(token!, sortOrder),
    enabled: Boolean(token),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-muted-foreground">Carregando álbum...</span>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="card text-center py-16 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Image size={28} className="text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Álbum não encontrado</h3>
          <p className="text-muted-foreground">
            Este álbum não existe, foi removido ou não está mais público.
          </p>
        </div>
      </div>
    );
  }

  const photoCount = album.photos?.length ?? 0;
  const totalPages = Math.ceil(photoCount / ITEMS_PER_PAGE);
  
  const paginatedPhotos = useMemo(() => {
    const photos = album.photos || [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return photos.slice(start, start + ITEMS_PER_PAGE);
  }, [album.photos, currentPage]);

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Dr. TIS" className="h-8 w-8" />
            <GradientText className="text-xl font-bold">Dr. TIS</GradientText>
          </div>
          <span className="text-sm text-muted-foreground">Álbum compartilhado</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Album Info */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{album.title}</h1>
          {album.description && (
            <p className="text-muted-foreground max-w-2xl">{album.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Image size={14} />
              {photoCount} {photoCount === 1 ? "foto" : "fotos"}
            </span>
            {album.user && (
              <span className="inline-flex items-center gap-1.5">
                <User size={14} />
                Por {album.user.name || album.user.email}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        {photoCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SortSelect value={sortOrder} onChange={handleSortChange} />
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Visualização:</span>
              <ViewToggle value={view} onChange={setView} />
            </div>
          </div>
        )}

        {/* Photos */}
        {photoCount === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Image size={28} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Álbum vazio</h3>
            <p className="text-muted-foreground">
              Este álbum ainda não possui fotos.
            </p>
          </div>
        ) : view === "grid" ? (
          <PhotoGrid photos={paginatedPhotos} onSelect={setSelectedPhoto} />
        ) : (
          <PhotoTable photos={paginatedPhotos} onSelect={setSelectedPhoto} />
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
      </main>

      {/* Photo Preview */}
      <PhotoPreview photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}
