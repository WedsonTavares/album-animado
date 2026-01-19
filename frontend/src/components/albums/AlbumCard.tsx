import { ArrowRight, Eye, ImageOff, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Album } from "../../types";
import { assetUrl } from "../../utils/format";

interface Props {
  album: Album;
  onDelete: (album: Album) => void;
}

export function AlbumCard({ album, onDelete }: Props) {
  const cover = album.photos?.[0];
  const photoCount = album.photo_count ?? album.photos?.length ?? 0;
  const canDelete = photoCount === 0;

  return (
    <Link 
      to={`/albums/${album.id}`} 
      className="group card p-0 overflow-hidden hover:border-primary/50 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative aspect-4/3 bg-card-hover overflow-hidden">
        {cover ? (
          <img
            src={assetUrl(cover.file_path)}
            alt={cover.title || album.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <ImageOff size={40} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <div className="flex flex-col items-center text-white">
            <Eye size={24} />
            <span className="text-sm mt-1">Visualizar</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {album.title}
        </h3>
        {album.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {album.description}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
        <span>{photoCount} {photoCount === 1 ? "foto" : "fotos"}</span>
        <div className="flex items-center gap-2">
          {canDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(album);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Excluir álbum"
            >
              <Trash2 size={14} />
            </button>
          )}
          <div className="text-primary group-hover:translate-x-1 transition-transform">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
