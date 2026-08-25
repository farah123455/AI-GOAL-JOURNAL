export default function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-150 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
