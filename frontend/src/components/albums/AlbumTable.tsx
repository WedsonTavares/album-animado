import { Eye, Trash2, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Album } from "../../types";
import { assetUrl } from "../../utils/format";

interface Props {
  albums: Album[];
  onDelete: (album: Album) => void;
}

export function AlbumTable({ albums, onDelete }: Props) {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card-hover/50">
              <th className="text-left p-4 font-medium text-muted-foreground">Capa</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Título</th>
              <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Descrição</th>
              <th className="text-center p-4 font-medium text-muted-foreground">Fotos</th>
              <th className="text-center p-4 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => {
              const cover = album.photos?.[0];
              const photoCount = album._count?.photos ?? album.photos?.length ?? 0;
              const canDelete = photoCount === 0;

              return (
                <tr key={album.id} className="border-b border-border last:border-0 hover:bg-card-hover/30 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-card-hover overflow-hidden flex items-center justify-center">
                      {cover ? (
                        <img
                          src={assetUrl(cover.filePath)}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageOff size={20} className="text-muted" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-foreground">{album.title}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-muted-foreground line-clamp-1">
                      {album.description || "-"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-muted-foreground">
                      {photoCount} {photoCount === 1 ? "foto" : "fotos"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/albums/${album.id}`}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Visualizar álbum"
                      >
                        <Eye size={18} />
                      </Link>
                      {canDelete && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onDelete(album);
                          }}
                          className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Excluir álbum"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
