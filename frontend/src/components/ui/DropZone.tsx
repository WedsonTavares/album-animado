import { ImagePlus, FolderOpen, Upload } from "lucide-react";
import { useState, useCallback, DragEvent, ChangeEvent, useRef } from "react";

interface Props {
  onFilesSelected: (files: File[]) => void;
  selectedCount?: number;
  accept?: string;
  multiple?: boolean;
  allowFolder?: boolean;
}

export function DropZone({
  onFilesSelected,
  selectedCount = 0,
  accept = "image/*",
  multiple = true,
  allowFolder = true,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    
    const files = Array.from(fileList).filter(file => 
      file.type.startsWith("image/")
    );
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    const files: File[] = [];

    // Handle files and folders from drag and drop
    const processEntry = async (entry: FileSystemEntry): Promise<File[]> => {
      const result: File[] = [];
      
      if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry;
        return new Promise((resolve) => {
          fileEntry.file((file) => {
            if (file.type.startsWith("image/")) {
              resolve([file]);
            } else {
              resolve([]);
            }
          });
        });
      } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;
        const reader = dirEntry.createReader();
        
        return new Promise((resolve) => {
          reader.readEntries(async (entries) => {
            for (const subEntry of entries) {
              const subFiles = await processEntry(subEntry);
              result.push(...subFiles);
            }
            resolve(result);
          });
        });
      }
      
      return result;
    };

    // Process all dragged items
    const processItems = async () => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const entry = item.webkitGetAsEntry?.();
        
        if (entry) {
          const entryFiles = await processEntry(entry);
          files.push(...entryFiles);
        } else if (item.kind === "file") {
          const file = item.getAsFile();
          if (file && file.type.startsWith("image/")) {
            files.push(file);
          }
        }
      }
      
      if (files.length > 0) {
        onFilesSelected(files);
      }
    };

    processItems();
  }, [onFilesSelected]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border bg-card/50 hover:bg-card hover:border-primary/50"
      }`}
    >
      <div className={`transition-transform ${isDragging ? "scale-110" : ""}`}>
        {isDragging ? (
          <Upload size={40} className="text-primary mb-3" />
        ) : (
          <ImagePlus size={40} className="text-primary mb-3" />
        )}
      </div>

      <span className="text-foreground font-medium text-center">
        {isDragging
          ? "Solte as imagens aqui"
          : selectedCount > 0
          ? `${selectedCount} ${selectedCount === 1 ? "foto selecionada" : "fotos selecionadas"}`
          : "Arraste imagens ou pastas aqui"}
      </span>
      
      <span className="text-sm text-muted-foreground mt-1">
        ou clique para selecionar
      </span>

      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-card-hover transition-colors"
        >
          <ImagePlus size={16} />
          Arquivos
        </button>
        
        {allowFolder && (
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-card-hover transition-colors"
          >
            <FolderOpen size={16} />
            Pasta
          </button>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {allowFolder && (
        <input
          ref={folderInputRef}
          type="file"
          // @ts-expect-error - webkitdirectory is not in the types
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      <span className="text-xs text-muted mt-3">PNG, JPG, WEBP • Máx. 10 arquivos por vez</span>
    </div>
  );
}
