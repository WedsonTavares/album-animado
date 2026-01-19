import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { SortOrder } from "../../types";

interface Props {
  value: SortOrder;
  onChange: (order: SortOrder) => void;
  label?: string;
}

export function SortSelect({ value, onChange, label = "Data de aquisição" }: Props) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <div className="inline-flex gap-1">
        <button
          type="button"
          onClick={() => onChange("asc")}
          className={`p-2 rounded-lg transition-colors ${
            value === "asc"
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
          }`}
          title="Mais antigas primeiro"
        >
          <ArrowUpAZ size={18} />
        </button>
        <button
          type="button"
          onClick={() => onChange("desc")}
          className={`p-2 rounded-lg transition-colors ${
            value === "desc"
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
          }`}
          title="Mais recentes primeiro"
        >
          <ArrowDownAZ size={18} />
        </button>
      </div>
    </div>
  );
}
