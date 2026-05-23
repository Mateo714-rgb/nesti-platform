import { motion } from 'framer-motion'
import { useStaff, getRoleIcon, getRoleLabel } from '../hooks/useStaff'

export default function StaffAssigner({ requestId, onAssign, onClose }) {
  const { staff, loading } = useStaff()

  const handleSelect = async (member) => {
    await onAssign(requestId, member.id)
    onClose()
  }

  const groups = {}
  staff.forEach((m) => {
    if (!groups[m.rol]) groups[m.rol] = []
    groups[m.rol].push(m)
  })

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full max-w-sm glass rounded-3xl p-6 shadow-float max-h-[80vh] overflow-y-auto"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-semibold text-lg text-gray-900">
            Asignar personal
          </p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 rounded-xl bg-brand-100 animate-pulse mx-auto mb-2" />
            <p className="text-xs text-gray-400">Cargando personal...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groups).map(([rol, members]) => (
              <div key={rol}>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
                  <span>{getRoleIcon(rol)}</span>
                  {getRoleLabel(rol)}
                </p>
                <div className="space-y-1.5">
                  {members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelect(m)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-white border border-surface-3 hover:border-brand-200 hover:shadow-glass transition-all active:scale-[0.98] flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-sm font-semibold text-brand-700">
                        {m.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.nombre}</p>
                        <p className="text-xs text-gray-400">{getRoleLabel(m.rol)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
