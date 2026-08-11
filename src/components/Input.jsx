export default function Input({
  label,
  id,
  error,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink/80">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`rounded-card border bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40
          focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500
          ${error ? 'border-ember' : 'border-line'} ${className}`}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="text-xs text-ember">
          {error}
        </span>
      )}
    </div>
  );
}
