import { motion } from 'framer-motion'

export default function ServiceCard({
  icon,
  title,
  desc,
  eta,
  disabled = false,
  onClick,
  index = 0,
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={onClick}
      disabled={disabled}
      className={`relative text-left p-4 rounded-2xl border transition-all duration-200 group ${
        disabled
          ? 'bg-brand-50 border-brand-200 opacity-75'
          : 'bg-white border-surface-3 hover:border-brand-200 hover:shadow-glass active:scale-95 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <p
        className={`text-sm font-semibold leading-tight mb-1 ${
          disabled ? 'text-brand-700' : 'text-gray-800'
        }`}
      >
        {title}
      </p>
      <p className="text-xs text-gray-400 leading-snug line-clamp-2">{desc}</p>
      {disabled && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
      {!disabled && (
        <p className="text-xs text-brand-500 mt-2 font-medium">≈ {eta}</p>
      )}
    </motion.button>
  )
}
