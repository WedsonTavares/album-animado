import { Calendar, HardDrive, Palette } from "lucide-react";
import { Photo } from "../../types";
import { assetUrl, formatBytes, formatDate } from "../../utils/format";
import { Modal } from "../ui/Modal";

interface Props {
  photo?: Photo | null;
  onClose: () => void;
}

export function PhotoPreview({ photo, onClose }: Props) {
  if (!photo) return null;

  return (
    <Modal open={Boolean(photo)} onClose={onClose} title={photo.title} size="large">
      <div className="space-y-3 sm:space-y-4">
        {/* Image */}
        <div className="rounded-lg sm:rounded-xl overflow-hidden bg-card-hover">
          <img
            src={assetUrl(photo.file_path)}
            alt={photo.title}
            className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain mx-auto"
          />
        </div>
        
        {/* Description */}
        {photo.description && (
          <p className="text-sm sm:text-base text-muted-foreground">{photo.description}</p>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-card-hover/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar size={16} className="sm:w-[18px] sm:h-[18px] text-primary" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs text-muted-foreground">Data</span>
              <span className="text-xs sm:text-sm font-medium text-foreground truncate">{formatDate(photo.acquisition_date)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-card-hover/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <HardDrive size={16} className="sm:w-[18px] sm:h-[18px] text-accent" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs text-muted-foreground">Tamanho</span>
              <span className="text-xs sm:text-sm font-medium text-foreground truncate">{formatBytes(photo.size_bytes)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-card-hover/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
              <Palette size={16} className="sm:w-[18px] sm:h-[18px] text-success" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs text-muted-foreground">Cor</span>
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {photo.predominant_color ? (
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <span
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-border flex-shrink-0"
                      style={{ background: photo.predominant_color }}
                    />
                    <span className="truncate">{photo.predominant_color}</span>
                  </span>
                ) : (
                  "Sem cor"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
