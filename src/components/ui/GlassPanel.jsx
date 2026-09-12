export function GlassPanel({ children, className = '', ...props }) {
  return (
    <div
      className={`
        glass-panel rounded-xl border border-slate-800 shadow-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}