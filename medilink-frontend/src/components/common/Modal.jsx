import { createPortal } from 'react-dom';
import Button from './Button.jsx';

function Modal({
  open,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
}) {
  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-medilink-ink/35 px-4">
      <div className="surface-card w-full max-w-lg p-6">
        <div className="space-y-2">
          <h3 className="section-title">{title}</h3>
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
        <div className="mt-5">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
