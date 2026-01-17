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
      <div className="space-y-4">
        {/* Image */}
        <div className="rounded-xl overflow-hidden bg-card-hover">
          <img
            src={assetUrl(photo.filePath)}
            alt={photo.title}
            className="w-full h-auto max-h-[60vh] object-contain mx-auto"
          />
        </div>
        
        {/* Description */}
        {photo.description && (
          <p className="text-muted-foreground">{photo.description}</p>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card-hover/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar size={18} className="text-primary" />
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Data</span>
              <span className="text-sm font-medium text-foreground">{formatDate(photo.acquisitionDate)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-card-hover/50">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <HardDrive size={18} className="text-accent" />
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Tamanho</span>
              <span className="text-sm font-medium text-foreground">{formatBytes(photo.sizeBytes)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-card-hover/50">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Palette size={18} className="text-success" />
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Cor</span>
              <span className="text-sm font-medium text-foreground">
                {photo.predominantColor ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ background: photo.predominantColor }}
                    />
                    {photo.predominantColor}
                  </span>
                ) : (
                  "N/A"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
