function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...rest
}) {
  const variantClasses = {
    primary: 'bg-medilink-mint text-white hover:bg-medilink-mint/90',
    danger: 'bg-medilink-coral text-white hover:bg-medilink-coral/90',
    ghost: 'bg-transparent text-medilink-ink hover:bg-medilink-mintSoft',
    secondary: 'bg-medilink-goldSoft text-medilink-ink hover:bg-medilink-goldSoft/80',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-medilink-mint/25 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
