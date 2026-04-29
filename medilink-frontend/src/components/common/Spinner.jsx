function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-sm text-medilink-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-medilink-border border-t-medilink-mint" />
      <span>{label}</span>
    </div>
  );
}

export default Spinner;
