import { LayoutGrid, List } from "lucide-react";
import { ViewMode } from "../types";

interface Props {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex gap-1">
      <button
        className={`p-2.5 rounded-lg transition-colors cursor-pointer ${value === "grid" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("grid")}
        type="button"
        title="Visualizar em grade"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        className={`p-2.5 rounded-lg transition-colors cursor-pointer ${value === "table" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("table")}
        type="button"
        title="Visualizar em lista"
      >
        <List size={18} />
      </button>
    </div>
  );
}
