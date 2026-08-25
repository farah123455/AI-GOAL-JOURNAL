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
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`input-field px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl
          transition-colors duration-150 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
          ${error ? 'border-red-500 focus:ring-red-100' : 'border-slate-200'} ${className}`}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className="text-xs font-medium text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
