import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  
  // Always show first page
  pages.push(1);
  
  if (currentPage > 3) {
    pages.push("...");
  }
  
  // Show pages around current
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }
  
  if (currentPage < totalPages - 2) {
    pages.push("...");
  }
  
  // Always show last page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4">
      {totalItems !== undefined && itemsPerPage !== undefined && (
        <span className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} a{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} itens
        </span>
      )}
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Página anterior"
        >
          <ChevronLeft size={18} />
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Próxima página"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
