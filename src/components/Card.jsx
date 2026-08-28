export default function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
