const VARIANTS = {
  primary: 'bg-moss-600 text-paper hover:bg-moss-700 disabled:bg-moss-300',
  secondary: 'bg-transparent text-moss-700 border border-moss-300 hover:bg-moss-50',
  ghost: 'bg-transparent text-ink hover:bg-line/60',
  danger: 'bg-ember text-paper hover:bg-ember/90',
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-card px-4 py-2.5 text-sm font-medium
        transition-colors duration-150 disabled:cursor-not-allowed
        focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2
        ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
