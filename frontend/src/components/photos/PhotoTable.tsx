import { Eye, Trash2, ImageOff } from "lucide-react";
import { Photo } from "../../types";
import { assetUrl, formatBytes, formatDate } from "../../utils/format";

interface Props {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  onDelete?: (photo: Photo) => void;
}

export function PhotoTable({ photos, onSelect, onDelete }: Props) {
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
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card-hover/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20">Foto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tamanho</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {photos.map((photo) => (
              <tr key={photo.id} className="hover:bg-card-hover/30 transition-colors">
                <td className="px-4 py-3">
                  <div
                    className="w-12 h-12 rounded-lg overflow-hidden bg-card-hover cursor-pointer"
                    onClick={() => onSelect(photo)}
                  >
                    <img
                      src={assetUrl(photo.file_path)}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{photo.title}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">
                    {photo.description || "Sem descrição"}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatBytes(photo.size_bytes)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(photo.acquisition_date)}</td>
                <td className="px-4 py-3">
                  {photo.predominant_color ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ background: photo.predominant_color }}
                      />
                      <span className="text-sm text-muted-foreground">{photo.predominant_color}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => onSelect(photo)}
                      title="Abrir"
                    >
                      <Eye size={16} />
                    </button>
                    {onDelete && (
                      <button
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => onDelete(photo)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
