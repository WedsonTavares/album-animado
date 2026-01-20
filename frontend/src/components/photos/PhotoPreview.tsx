import { Calendar, HardDrive, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Photo } from "../../types";
import { assetUrl, formatBytes, formatDate } from "../../utils/format";
import { Modal } from "../ui/Modal";
import PixelTransition from "../ui/PixelTransition";

interface Props {
  photo?: Photo | null;
  photos?: Photo[];
  currentIndex?: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export function PhotoPreview({ photo, photos, currentIndex, onClose, onNavigate }: Props) {
  const [showTransition, setShowTransition] = useState(false);
  const [previousPhoto, setPreviousPhoto] = useState<Photo | null>(null);

  const hasNavigation = photos && photos.length > 1 && currentIndex !== undefined && onNavigate;
  const canGoPrev = hasNavigation && currentIndex > 0;
  const canGoNext = hasNavigation && currentIndex < photos.length - 1;

  const handlePrev = useCallback(() => {
    if (canGoPrev && onNavigate && photo) {
      setPreviousPhoto(photo);
      setShowTransition(true);
      setTimeout(() => {
        onNavigate(currentIndex - 1);
        setTimeout(() => {
          setShowTransition(false);
          setPreviousPhoto(null);
        }, 50);
      }, 400);
    }
  }, [canGoPrev, currentIndex, onNavigate, photo]);

  const handleNext = useCallback(() => {
    if (canGoNext && onNavigate && photo) {
      setPreviousPhoto(photo);
      setShowTransition(true);
      setTimeout(() => {
        onNavigate(currentIndex + 1);
        setTimeout(() => {
          setShowTransition(false);
          setPreviousPhoto(null);
        }, 50);
      }, 400);
    }
  }, [canGoNext, currentIndex, onNavigate, photo]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (photo) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [photo, handlePrev, handleNext]);

  if (!photo) return null;

  return (
    <Modal open={Boolean(photo)} onClose={onClose} title={photo.title} size="large">
      <div className="space-y-3 sm:space-y-4">
        {/* Image with Navigation */}
        <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-card-hover group">
          {showTransition && previousPhoto ? (
            <PixelTransition
              firstContent={
                <img
                  src={assetUrl(previousPhoto.file_path)}
                  alt={previousPhoto.title}
                  className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain mx-auto"
                />
              }
              secondContent={
                <img
                  src={assetUrl(photo.file_path)}
                  alt={photo.title}
                  className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain mx-auto"
                />
              }
              gridSize={10}
              pixelColor="#8b5cf6"
              animationStepDuration={0.4}
              once={true}
            />
          ) : (
            <img
              src={assetUrl(photo.file_path)}
              alt={photo.title}
              className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain mx-auto"
            />
          )}

          {/* Navigation Arrows */}
          {hasNavigation && (
            <>
              {/* Previous Button */}
              {canGoPrev && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary z-10"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Next Button */}
              {canGoNext && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary z-10"
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Photo Counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {currentIndex + 1} / {photos.length}
              </div>
            </>
          )}
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
