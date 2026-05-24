import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Toast({ message, visible, onDismiss, duration = 4000 }) {
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [visible, duration, onDismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm"
        >
          <div className="glass rounded-2xl px-5 py-4 shadow-float border border-brand-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
              <span className="text-lg">🛎️</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Nueva solicitud</p>
              <p className="text-xs text-gray-500 truncate">{message}</p>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none shrink-0"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function useNotificationSound() {
  const play = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch {
      // Audio not available
    }
  }
  return play
}
