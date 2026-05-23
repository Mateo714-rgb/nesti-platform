import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { requests as initialRequests, hotel } from '../data/hotel'

const STATUS = {
  pending: { label: 'Pendiente', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  accepted: { label: 'En proceso', bg: 'bg-brand-50', text: 'text-brand-700', border: 'border-brand-200', dot: 'bg-brand-500' },
  done: { label: 'Completado', bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-300' },
}

const FILTERS = ['todas', 'pending', 'accepted', 'done']

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`flex-1 rounded-2xl p-4 border ${accent || 'bg-white border-surface-3'} shadow-[0_1px_4px_rgba(0,0,0,0.04)]`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-display font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function ReceptionView() {
  const [reqs, setReqs] = useState(initialRequests)
  const [filter, setFilter] = useState('todas')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'todas' ? reqs : reqs.filter(r => r.status === filter)
  const pending = reqs.filter(r => r.status === 'pending').length
  const inProgress = reqs.filter(r => r.status === 'accepted').length

  const advance = (id) => {
    setReqs(prev => prev.map(r => {
      if (r.id !== id) return r
      const next = r.status === 'pending' ? 'accepted' : r.status === 'accepted' ? 'done' : 'done'
      return { ...r, status: next }
    }))
    setSelected(null)
  }

  const now = new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-1 via-white to-brand-50/40 px-4 py-6 max-w-2xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">Panel de Recepción</p>
            <h1 className="font-display text-xl font-semibold text-gray-900 mt-0.5">{hotel.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-xs text-gray-400 font-mono">{now}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        className="flex gap-3 mb-6">
        <StatCard label="Solicitudes hoy" value={reqs.length} sub="total recibidas" />
        <StatCard label="Pendientes" value={pending}
          sub="requieren atención"
          accent={pending > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-surface-3'} />
        <StatCard label="En proceso" value={inProgress} sub="siendo atendidas" />
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.14 }}
        className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-1">
        {FILTERS.map(f => {
          const s = STATUS[f]
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all duration-200 ${
                filter === f
                  ? 'bg-gray-900 text-white'
                  : 'bg-surface-2 text-gray-500 hover:bg-surface-3'
              }`}>
              {f === 'todas' ? 'Todas' : s?.label}
              {f !== 'todas' && (
                <span className="ml-1.5 opacity-70">
                  {reqs.filter(r => r.status === f).length}
                </span>
              )}
            </button>
          )
        })}
      </motion.div>

      {/* Requests list */}
      <div className="space-y-2.5 pb-24">
        <AnimatePresence>
        {filtered.map((req, i) => {
          const st = STATUS[req.status]
          return (
            <motion.div
              key={req.id}
              layout
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              onClick={() => setSelected(req.id === selected ? null : req.id)}
              className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
                req.status === 'done'
                  ? 'bg-surface-1 border-surface-3 opacity-60 hover:opacity-80'
                  : 'bg-white border-surface-3 hover:border-brand-200 hover:shadow-glass shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
              } ${selected === req.id ? 'border-brand-300 shadow-glass' : ''}`}>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1 mt-0.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${st.bg} ${st.text} border ${st.border}`}>
                      {req.room}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{req.service}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.text} border ${st.border}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{req.guest}</p>
                    {req.note && (
                      <p className="text-xs text-gray-500 mt-1.5 bg-surface-1 rounded-lg px-2.5 py-1.5 italic">"{req.note}"</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  <span className="text-xs font-mono text-gray-400">{req.time}</span>
                </div>
              </div>

              <AnimatePresence>
              {selected === req.id && req.status !== 'done' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden">
                  <div className="flex gap-2 mt-4 pt-3 border-t border-surface-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); advance(req.id) }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                        req.status === 'pending'
                          ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                      }`}>
                      {req.status === 'pending' ? '✓ Aceptar solicitud' : '✓ Marcar completado'}
                    </button>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🎉</p>
            <p className="text-sm font-medium text-gray-500">No hay solicitudes {filter !== 'todas' ? `con estado "${STATUS[filter]?.label}"` : ''}</p>
          </div>
        )}
      </div>

      {/* New request badge */}
      {pending > 0 && (
        <div className="fixed bottom-6 right-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="bg-amber-400 text-amber-900 rounded-2xl px-4 py-3 shadow-float flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
            <span className="text-sm font-semibold">{pending} pendiente{pending > 1 ? 's' : ''}</span>
          </motion.div>
        </div>
      )}
    </div>
  )
}
