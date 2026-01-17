import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'default' | 'large';
}

export function Modal({ open, onClose, title, children, footer, size = 'default' }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={`bg-card border border-border rounded-2xl shadow-2xl w-full ${size === 'large' ? 'max-w-2xl' : 'max-w-md'}`}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <button
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors"
                onClick={onClose}
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">{children}</div>
            {footer && (
              <div className="flex justify-end gap-3 p-6 pt-0">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
