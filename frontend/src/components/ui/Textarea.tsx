import { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, ...props }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
        {props.required && <span className="text-primary"> *</span>}
      </label>
      <textarea 
        className="input-field resize-none" 
        rows={4} 
        {...props} 
      />
      {hint && !error && (
        <span className="text-xs text-muted-foreground">{hint}</span>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
