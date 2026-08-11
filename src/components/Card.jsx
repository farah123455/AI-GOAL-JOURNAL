export default function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`rounded-card border border-line bg-white/70 p-5 shadow-soft ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
