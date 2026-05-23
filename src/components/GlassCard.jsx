export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`glass rounded-2xl border border-white/60 shadow-glass ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
