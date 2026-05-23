import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useRealtimeRequests } from '../hooks/useRealtimeRequests'
import Toast, { useNotificationSound } from '../components/Toast'
import StaffAssigner from '../components/StaffAssigner'

const STATUS = {
  pendiente: {
    label: 'Pendiente',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  aceptado: {
    label: 'En proceso',
    bg: 'bg-brand-50',
    text: 'text-brand-700',
    border: 'border-brand-200',
    dot: 'bg-brand-500',
  },
  completado: {
    label: 'Completado',
    bg: 'bg-gray-50',
    text: 'text-gray-500',
    border: 'border-gray-200',
    dot: 'bg-gray-300',
  },
}

const FILTERS = ['todas', 'pendiente', 'aceptado', 'completado']

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      className={`flex-1 rounded-2xl p-4 border ${
        accent || 'bg-white border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
      }`}
    >
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-display font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function Reception() {
  const { requests, loading } = useRealtimeRequests()
  const [filter, setFilter] = useState('todas')
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('solicitudes')

  // Toast notification for new requests
  const [toast, setToast] = useState({ visible: false, message: '' })
  const prevCount = useRef(0)
  const playSound = useNotificationSound()

  useEffect(() => {
    const count = requests.length
    if (prevCount.current > 0 && count > prevCount.current) {
      const latest = requests[0]
      const roomNum = latest?.rooms?.numero || ''
      setToast({ visible: true, message: `Hab. ${roomNum} — ${latest.tipo_servicio}` })
      playSound()
    }
    prevCount.current = count
  }, [requests, playSound])

  const filtered =
    filter === 'todas'
      ? requests
      : requests.filter((r) => r.estado === filter)

  const pending = requests.filter((r) => r.estado === 'pendiente').length
  const inProgress = requests.filter((r) => r.estado === 'aceptado').length

  // Analytics
  const completedCount = requests.filter((r) => r.estado === 'completado').length

  const topService = useMemo(() => {
    if (requests.length === 0) return null
    const counts = {}
    requests.forEach((r) => {
      counts[r.tipo_servicio] = (counts[r.tipo_servicio] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  }, [requests])

  const historyByDate = useMemo(() => {
    const groups = {}
    requests
      .filter((r) => r.estado === 'completado')
      .forEach((r) => {
        const date = new Date(r.created_at).toLocaleDateString('es-EC', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        if (!groups[date]) groups[date] = []
        groups[date].push(r)
      })
    return Object.entries(groups)
  }, [requests])

  const [assigning, setAssigning] = useState(null)

  const advance = async (id, staffId) => {
    const req = requests.find((r) => r.id === id)
    if (!req) return

    const next =
      req.estado === 'pendiente'
        ? 'aceptado'
        : req.estado === 'aceptado'
        ? 'completado'
        : 'completado'

    const updates = { estado: next }
    if (staffId) updates.asignado_a = staffId

    await supabase
      .from('solicitudes_servicio')
      .update(updates)
      .eq('id', id)

    setSelected(null)
  }

  const handleAccept = (id) => {
    setAssigning(id)
  }

  const now = new Date().toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-1 via-white to-brand-50/40 px-4 py-6 max-w-2xl mx-auto">
      {/* Toast notification */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onDismiss={() => setToast({ visible: false, message: '' })}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">
              Panel de Recepción
            </p>
            <h1 className="font-display text-xl font-semibold text-gray-900 mt-0.5">
              Casa del Árbol
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-xs text-gray-400 font-mono">{now}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        className="flex gap-3 mb-6"
      >
        <StatCard label="Recibidas hoy" value={requests.length} sub="total" />
        <StatCard
          label="Pendientes"
          value={pending}
          sub="requieren atención"
          accent={
            pending > 0
              ? 'bg-amber-50 border-amber-200'
              : 'bg-white border-surface-3'
          }
        />
        <StatCard label="En proceso" value={inProgress} sub="siendo atendidas" />
        <StatCard label="Completadas" value={completedCount} sub="finalizadas" />
      </motion.div>

      {/* Tab switcher */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex bg-surface-2 rounded-2xl p-1 gap-1 mb-5"
      >
        {[
          { id: 'solicitudes', label: 'Solicitudes' },
          { id: 'reportes', label: 'Reportes' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              tab === t.id
                ? 'bg-white text-brand-700 shadow-glass'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </motion.div>

      {tab === 'solicitudes' && (
        <>
          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.14 }}
            className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-1"
          >
            {FILTERS.map((f) => {
              const s = STATUS[f]
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all duration-200 ${
                    filter === f
                      ? 'bg-gray-900 text-white'
                      : 'bg-surface-2 text-gray-500 hover:bg-surface-3'
                  }`}
                >
                  {f === 'todas' ? 'Todas' : s?.label}
                  {f !== 'todas' && (
                    <span className="ml-1.5 opacity-70">
                      {requests.filter((r) => r.estado === f).length}
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
                const st = STATUS[req.estado]
                const roomNum = req.rooms?.numero || '—'
                return (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    onClick={() =>
                      setSelected(req.id === selected ? null : req.id)
                    }
                    className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
                      req.estado === 'completado'
                        ? 'bg-surface-1 border-surface-3 opacity-60 hover:opacity-80'
                        : 'bg-white border-surface-3 hover:border-brand-200 hover:shadow-glass shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                    } ${
                      selected === req.id ? 'border-brand-300 shadow-glass' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${st.bg} ${st.text} border ${st.border}`}
                        >
                          {roomNum}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900">
                              {req.tipo_servicio}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.text} border ${st.border}`}
                            >
                              {st.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Hab. {roomNum}
                          </p>
                          {req.nota && (
                            <p className="text-xs text-gray-500 mt-1.5 bg-surface-1 rounded-lg px-2.5 py-1.5 italic">
                              &ldquo;{req.nota}&rdquo;
                            </p>
                          )}
                          {req.staff && (
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                              <span>👤</span>
                              <span>{req.staff.nombre} · {req.staff.rol}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        <span className="text-xs font-mono text-gray-400">
                          {new Date(req.created_at).toLocaleTimeString('es-EC', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selected === req.id && req.estado !== 'completado' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-2 mt-4 pt-3 border-t border-surface-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (req.estado === 'pendiente') {
                                  handleAccept(req.id)
                                } else {
                                  advance(req.id)
                                }
                              }}
                              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                                req.estado === 'pendiente'
                                  ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
                                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                              }`}
                            >
                              {req.estado === 'pendiente'
                                ? '👤 Asignar y aceptar'
                                : '✓ Marcar completado'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {!loading && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-3xl mb-3">🎉</p>
                <p className="text-sm font-medium text-gray-500">
                  No hay solicitudes{' '}
                  {filter !== 'todas'
                    ? `con estado "${STATUS[filter]?.label}"`
                    : ''}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'reportes' && (
        <motion.div
          key="reportes"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-24 space-y-6"
        >
          {/* Top service */}
          <div className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">
              Servicio más solicitado
            </p>
            {topService ? (
              <>
                <p className="text-2xl font-display font-semibold text-gray-900">
                  {topService[0]}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {topService[1]} solicitud{topService[1] !== 1 ? 'es' : ''}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Sin datos aún</p>
            )}
          </div>

          {/* Service distribution */}
          {requests.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">
                Distribución por servicio
              </p>
              <div className="space-y-2">
                {Object.entries(
                  requests.reduce((acc, r) => {
                    acc[r.tipo_servicio] = (acc[r.tipo_servicio] || 0) + 1
                    return acc
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => {
                    const total = requests.length
                    const pct = Math.round((count / total) * 100)
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 w-24 truncate shrink-0">
                          {name}
                        </span>
                        <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 font-mono w-10 text-right">
                          {count}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* History by date */}
          {historyByDate.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                Historial completado
              </p>
              {historyByDate.map(([date, items]) => (
                <div key={date} className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                  <p className="text-sm font-semibold text-gray-800 mb-3 capitalize">
                    {date}
                  </p>
                  <div className="space-y-2">
                    {items.map((req) => {
                      const roomNum = req.rooms?.numero || '—'
                      return (
                        <div
                          key={req.id}
                          className="flex items-center justify-between py-1.5 border-b border-surface-2 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 w-8">
                              {roomNum}
                            </span>
                            <span className="text-sm text-gray-700">
                              {req.tipo_servicio}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(req.created_at).toLocaleTimeString('es-EC', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {requests.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">📊</p>
              <p className="text-sm font-medium text-gray-500">
                No hay datos para mostrar aún
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Staff assigner modal */}
      <AnimatePresence>
        {assigning && (
          <StaffAssigner
            requestId={assigning}
            onAssign={(id, staffId) => advance(id, staffId)}
            onClose={() => setAssigning(null)}
          />
        )}
      </AnimatePresence>

      {/* Pending badge */}
      {pending > 0 && tab === 'solicitudes' && (
        <div className="fixed bottom-6 right-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="bg-amber-400 text-amber-900 rounded-2xl px-4 py-3 shadow-float flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
            <span className="text-sm font-semibold">
              {pending} pendiente{pending > 1 ? 's' : ''}
            </span>
          </motion.div>
        </div>
      )}
    </div>
  )
}
