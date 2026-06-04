import { useId, useEffect } from 'react';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();

  // Close on Escape
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  // Render selalu, tapi kontrol visibilitas dengan class CSS
  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        // Wrapper: transisikan opacity dan pointer-events
        open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
        'transition-all duration-200 ease-out'
      ].join(' ')}
    >
      {/* Backdrop dengan transisi blur dan opacity */}
      <div
        className={[
          'absolute inset-0 bg-[#0d1117]/80 backdrop-blur-sm',
          open ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-0',
          'transition-all duration-200 ease-out'
        ].join(' ')}
        aria-hidden="true"
        onClick={onCancel}
      />

      {/* Dialog box dengan transisi scale dan opacity */}
      <div
        className={[
          'relative bg-[#161b22] border border-[#30363d] shadow-xl rounded-lg',
          'w-full max-w-sm p-6 flex flex-col gap-4',
          // Scale dari 0.95 ke 1, opacity 0 ke 1
          open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2',
          'transition-all duration-200 ease-out'
        ].join(' ')}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        aria-hidden={!open}
      >
        <header>
          <h2 id={titleId} className="text-lg font-semibold text-[#e6edf3] m-0">
            {title}
          </h2>
        </header>

        <div id={descId} className="text-sm text-[#8b949e] leading-relaxed">
          {description}
        </div>

        <footer className="flex items-center justify-end gap-3 mt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </footer>
      </div>
    </div>
  );
}