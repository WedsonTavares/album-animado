import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, ...props }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
        {props.required && <span className="text-primary"> *</span>}
      </label>
      <input 
        className="input-field" 
        {...props} 
      />
      {hint && !error && (
        <span className="text-xs text-muted-foreground">{hint}</span>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
