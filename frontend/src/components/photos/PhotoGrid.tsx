import { Eye, Trash2, Calendar, ImageOff } from "lucide-react";
import { Photo } from "../../types";
import { assetUrl, formatBytes, formatDate } from "../../utils/format";

interface Props {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  onDelete?: (photo: Photo) => void;
}

export function PhotoGrid({ photos, onSelect, onDelete }: Props) {
  if (photos.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-muted/10 flex items-center justify-center mx-auto mb-4">
          <ImageOff size={28} className="text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma foto ainda</h3>
        <p className="text-muted-foreground">
          Adicione fotos para preencher este álbum.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="group card p-0 overflow-hidden">
          {/* Image */}
          <div 
            className="relative aspect-square bg-card-hover cursor-pointer overflow-hidden"
            onClick={() => onSelect(photo)}
          >
            <img
              src={assetUrl(photo.file_path)}
              alt={photo.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <div className="flex flex-col items-center text-white">
                <Eye size={24} />
                <span className="text-sm mt-1">Visualizar</span>
              </div>
            </div>
            {photo.predominant_color && (
              <div
                className="absolute bottom-2 left-2 w-6 h-6 rounded-full border-2 border-white shadow-lg"
                style={{ background: photo.predominant_color }}
                title={photo.predominant_color}
              />
            )}
          </div>

          {/* Body */}
          <div className="p-3">
            <h4 className="font-medium text-foreground truncate">{photo.title}</h4>
            <p className="text-sm text-muted-foreground truncate">
              {photo.description || "Sem descrição"}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(photo.acquisition_date)}
              </span>
              <span>{formatBytes(photo.size_bytes)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex border-t border-border">
            <button
              className={`${onDelete ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors`}
              onClick={() => onSelect(photo)}
              title="Abrir foto"
            >
              <Eye size={16} />
              {!onDelete && <span>Visualizar</span>}
            </button>
            {onDelete && (
              <>
                <div className="w-px bg-border" />
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                  onClick={() => onDelete(photo)}
                  title="Excluir foto"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
