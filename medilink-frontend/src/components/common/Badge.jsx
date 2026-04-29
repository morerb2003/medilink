function Badge({ children, tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'bg-medilink-goldSoft text-medilink-ink',
    success: 'bg-medilink-mintSoft text-medilink-mint',
    danger: 'bg-medilink-coralSoft text-medilink-coral',
    pending: 'bg-medilink-goldSoft text-medilink-gold',
  };

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        toneClasses[tone] || toneClasses.neutral,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export default Badge;
