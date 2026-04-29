import Button from './Button.jsx';

function Toast({ title, message, variant, onDismiss }) {
  const accentClass = {
    success: 'border-medilink-mint/20 bg-white',
    error: 'border-medilink-coral/25 bg-white',
    info: 'border-medilink-gold/25 bg-white',
  };

  return (
    <div
      className={[
        'pointer-events-auto rounded-3xl border px-4 py-4 shadow-panel',
        accentClass[variant] || accentClass.info,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-medilink-ink">{title}</p>
          <p className="text-sm text-medilink-muted">{message}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}

export default Toast;
