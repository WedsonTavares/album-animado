import { Modal } from "./Modal";
import StarBorder from "./StarBorder";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "warning",
  isLoading = false,
}: Props) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: "text-destructive",
    warning: "text-amber-500",
    info: "text-primary",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <StarBorder as="button" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </StarBorder>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
          >
            {isLoading ? "Processando..." : confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            variant === "danger"
              ? "bg-destructive/10"
              : variant === "warning"
              ? "bg-amber-500/10"
              : "bg-primary/10"
          }`}
        >
          <svg
            className={`w-5 h-5 sm:w-6 sm:h-6 ${variantStyles[variant]}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {variant === "danger" || variant === "warning" ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base text-foreground">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
