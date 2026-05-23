import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useRealtimeRequests } from '../hooks/useRealtimeRequests'
import Toast, { useNotificationSound } from '../components/Toast'
import StaffAssigner from '../components/StaffAssigner'
import { getRoomPrice, getServicePrice, formatPrice } from '../data/prices'

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
    <div className={`flex-1 rounded-2xl p-4 border ${accent || 'bg-white border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'}`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-display font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function RoomStatusBadge({ room }) {
  if (room.token_sesion_actual) {
    return (
      <span className="text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
        Ocupada
      </span>
    )
  }
  if (room.estado_limpieza === 'sucia') {
    return (
      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        Por limpiar
      </span>
    )
  }
  if (room.estado_limpieza === 'mantenimiento') {
    return (
      <span className="text-[10px] font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
        Mantenimiento
      </span>
    )
  }
  return (
    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
      Disponible
    </span>
  )
}

function CheckInModal({ room, onClose, onConfirm }) {
  const [form, setForm] = useState({
    huesped_nombre: '',
    huesped_identificacion: '',
    huesped_telefono: '',
    check_in: new Date().toISOString().split('T')[0],
    check_out: '',
  })
  const [saving, setSaving] = useState(false)

  const pricePerNight = getRoomPrice(room)
  const nights = form.check_in && form.check_out
    ? Math.max(1, Math.round((new Date(form.check_out) - new Date(form.check_in)) / (1000 * 60 * 60 * 24)))
    : 1
  const total = pricePerNight * nights

  const handleSubmit = async () => {
    if (!form.huesped_nombre.trim() || !form.huesped_identificacion.trim() || !form.check_out) return
    setSaving(true)
    await onConfirm({
      ...form,
      precio_noche: pricePerNight,
      total_estimado: total,
    })
    setSaving(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-3xl w-full max-w-md mx-4 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Check-In</p>
            <h2 className="font-display text-xl font-semibold text-gray-900 mt-0.5">
              Hab. {room.numero} — {room.nombre}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">{formatPrice(pricePerNight)}/noche</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nombre del huésped *</label>
            <input
              value={form.huesped_nombre}
              onChange={e => setForm(p => ({ ...p, huesped_nombre: e.target.value }))}
              placeholder="Ej: Juan Pérez"
              className="w-full text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Identificación *</label>
              <input
                value={form.huesped_identificacion}
                onChange={e => setForm(p => ({ ...p, huesped_identificacion: e.target.value }))}
                placeholder="Cédula / Pasaporte"
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
              <input
                value={form.huesped_telefono}
                onChange={e => setForm(p => ({ ...p, huesped_telefono: e.target.value }))}
                placeholder="+593..."
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Check-In</label>
              <input
                type="date"
                value={form.check_in}
                onChange={e => setForm(p => ({ ...p, check_in: e.target.value }))}
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Check-Out *</label>
              <input
                type="date"
                value={form.check_out}
                onChange={e => setForm(p => ({ ...p, check_out: e.target.value }))}
                min={form.check_in}
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Price summary */}
        <div className="bg-brand-50 rounded-2xl p-4 mb-5 border border-brand-100">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{formatPrice(pricePerNight)} x {nights} noche{nights > 1 ? 's' : ''}</span>
            <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {nights} noche{nights > 1 ? 's' : ''} de hospedaje
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-surface-2 hover:bg-surface-3 transition-all">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={saving || !form.huesped_nombre.trim() || !form.huesped_identificacion.trim() || !form.check_out}
            className="flex-[2] py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm disabled:opacity-50">
            {saving ? 'Registrando...' : 'Confirmar Check-In'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CheckOutModal({ room, requests, onClose, onConfirm }) {
  const [saving, setSaving] = useState(false)

  const pricePerNight = getRoomPrice(room)
  const checkIn = room.check_in ? new Date(room.check_in) : new Date()
  const checkOut = new Date()
  const nights = Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)))
  const roomTotal = pricePerNight * nights

  const roomRequests = requests.filter(r => r.room_id === room.id)
  const serviceCharges = roomRequests
    .filter(r => r.estado === 'completado')
    .reduce((sum, r) => sum + getServicePrice({ titulo: r.tipo_servicio }), 0)
  const grandTotal = roomTotal + serviceCharges

  const handleCheckOut = async () => {
    setSaving(true)
    await onConfirm()
    setSaving(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-3xl w-full max-w-md mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Check-Out</p>
            <h2 className="font-display text-xl font-semibold text-gray-900 mt-0.5">Hab. {room.numero}</h2>
          </div>
        </div>

        {/* Guest info */}
        <div className="bg-surface-1 rounded-2xl p-4 mb-4 space-y-1">
          <p className="text-sm font-semibold text-gray-900">{room.huesped_nombre || 'Huésped'}</p>
          {room.huesped_identificacion && (
            <p className="text-xs text-gray-500">ID: {room.huesped_identificacion}</p>
          )}
          {room.huesped_telefono && (
            <p className="text-xs text-gray-500">Tel: {room.huesped_telefono}</p>
          )}
        </div>

        {/* Bill detail */}
        <div className="space-y-3 mb-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Resumen de cuenta</p>

          <div className="bg-white rounded-2xl border border-surface-3 p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Alojamiento ({nights} noche{nights > 1 ? 's' : ''})</span>
              <span className="font-semibold text-gray-900">{formatPrice(roomTotal)}</span>
            </div>
            <div className="text-xs text-gray-400 mb-3">
              {formatPrice(pricePerNight)}/noche · {new Date(room.check_in).toLocaleDateString()} → {checkOut.toLocaleDateString()}
            </div>

            {serviceCharges > 0 && (
              <>
                <div className="border-t border-surface-3 pt-3 mb-2">
                  <p className="text-xs text-gray-400 mb-2">Servicios consumidos</p>
                  {roomRequests.filter(r => r.estado === 'completado').map(r => (
                    <div key={r.id} className="flex justify-between text-sm py-1">
                      <span className="text-gray-600">{r.tipo_servicio}</span>
                      <span className="text-gray-700">{formatPrice(getServicePrice({ titulo: r.tipo_servicio }))}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="border-t border-surface-3 pt-3 mt-2">
              <div className="flex justify-between text-base font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-brand-700">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          {roomRequests.filter(r => r.estado !== 'completado').length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
              <p className="text-xs text-amber-800 font-medium">
                ⚠️ {roomRequests.filter(r => r.estado !== 'completado').length} solicitud(es) pendiente(s) sin completar
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-surface-2 hover:bg-surface-3 transition-all">
            Cancelar
          </button>
          <button onClick={handleCheckOut} disabled={saving}
            className="flex-[2] py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm disabled:opacity-50">
            {saving ? 'Procesando...' : `Finalizar estadía — ${formatPrice(grandTotal)}`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Reception() {
  const { requests, loading: reqsLoading } = useRealtimeRequests()
  const [filter, setFilter] = useState('todas')
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('rooms')
  const [rooms, setRooms] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [checkInRoom, setCheckInRoom] = useState(null)
  const [checkOutRoom, setCheckOutRoom] = useState(null)

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

  useEffect(() => {
    supabase.from('rooms').select('*').order('numero').then(({ data }) => {
      if (data) setRooms(data)
      setLoadingRooms(false)
    })
  }, [])

  const handleCheckIn = async (form) => {
    const token = crypto.randomUUID()
    const { error } = await supabase.from('rooms').update({
      token_sesion_actual: token,
      huesped_nombre: form.huesped_nombre,
      huesped_identificacion: form.huesped_identificacion,
      huesped_telefono: form.huesped_telefono,
      check_in: new Date(form.check_in).toISOString(),
      check_out: form.check_out ? new Date(form.check_out).toISOString() : null,
    }).eq('id', checkInRoom.id)

    if (!error) {
      setRooms(prev => prev.map(r =>
        r.id === checkInRoom.id ? {
          ...r,
          token_sesion_actual: token,
          huesped_nombre: form.huesped_nombre,
          huesped_identificacion: form.huesped_identificacion,
          huesped_telefono: form.huesped_telefono,
          check_in: new Date(form.check_in).toISOString(),
          check_out: form.check_out ? new Date(form.check_out).toISOString() : null,
        } : r
      ))
    }
    setCheckInRoom(null)
  }

  const handleCheckOut = async () => {
    await supabase.from('rooms').update({
      token_sesion_actual: null,
      huesped_nombre: null,
      huesped_identificacion: null,
      huesped_telefono: null,
      check_in: null,
      check_out: null,
      estado_limpieza: 'sucia',
    }).eq('id', checkOutRoom.id)

    setRooms(prev => prev.map(r =>
      r.id === checkOutRoom.id ? {
        ...r,
        token_sesion_actual: null,
        huesped_nombre: null,
        huesped_identificacion: null,
        huesped_telefono: null,
        check_in: null,
        check_out: null,
        estado_limpieza: 'sucia',
      } : r
    ))
    setCheckOutRoom(null)
  }

  const handleCleanRoom = async (roomId) => {
    await supabase.from('rooms').update({ estado_limpieza: 'limpia' }).eq('id', roomId)
    setRooms(prev => prev.map(r =>
      r.id === roomId ? { ...r, estado_limpieza: 'limpia' } : r
    ))
  }

  const handleToggleMaintenance = async (roomId, current) => {
    const next = current === 'mantenimiento' ? 'limpia' : 'mantenimiento'
    await supabase.from('rooms').update({ estado_limpieza: next }).eq('id', roomId)
    setRooms(prev => prev.map(r =>
      r.id === roomId ? { ...r, estado_limpieza: next } : r
    ))
  }

  // Computations
  const occupiedRooms = rooms.filter(r => r.token_sesion_actual).length
  const availableRooms = rooms.filter(r => !r.token_sesion_actual && r.estado_limpieza === 'limpia').length
  const dirtyRooms = rooms.filter(r => r.estado_limpieza === 'sucia').length
  const maintenanceRooms = rooms.filter(r => r.estado_limpieza === 'mantenimiento').length
  const occupancy = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0

  // Request computations
  const filtered = filter === 'todas'
    ? requests
    : requests.filter(r => r.estado === filter)
  const pending = requests.filter(r => r.estado === 'pendiente').length
  const inProgress = requests.filter(r => r.estado === 'aceptado').length
  const completedCount = requests.filter(r => r.estado === 'completado').length
  const topService = useMemo(() => {
    if (requests.length === 0) return null
    const counts = {}
    requests.forEach(r => { counts[r.tipo_servicio] = (counts[r.tipo_servicio] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  }, [requests])

  const historyByDate = useMemo(() => {
    const groups = {}
    requests.filter(r => r.estado === 'completado').forEach(r => {
      const date = new Date(r.created_at).toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      if (!groups[date]) groups[date] = []
      groups[date].push(r)
    })
    return Object.entries(groups)
  }, [requests])

  // Realtime listeners for rooms
  useEffect(() => {
    const channel = supabase.channel('rooms-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setRooms(prev => prev.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r))
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const [assigning, setAssigning] = useState(null)

  const advance = async (id, staffId) => {
    const req = requests.find(r => r.id === id)
    if (!req) return
    const next = req.estado === 'pendiente' ? 'aceptado' : req.estado === 'aceptado' ? 'completado' : 'completado'
    const updates = { estado: next }
    if (staffId) updates.asignado_a = staffId
    await supabase.from('solicitudes_servicio').update(updates).eq('id', id)
    setSelected(null)
  }

  const handleAccept = (id) => setAssigning(id)

  const now = new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
  const today = new Date().toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-1 via-white to-brand-50/40">
      <Toast message={toast.message} visible={toast.visible} onDismiss={() => setToast({ visible: false, message: '' })} />

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">Panel de Recepción</p>
              <h1 className="font-display text-xl font-semibold text-gray-900 mt-0.5 capitalize">{today}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
              <span className="text-xs text-gray-400 font-mono">{now}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }} className="flex gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
          <StatCard label="Ocupadas" value={occupiedRooms} sub={`${occupancy}%`} accent={occupiedRooms > 0 ? 'bg-blue-50 border-blue-200' : ''} />
          <StatCard label="Disponibles" value={availableRooms} sub="limpias" accent={availableRooms > 0 ? 'bg-emerald-50 border-emerald-200' : ''} />
          <StatCard label="Por limpiar" value={dirtyRooms} sub="check-out" accent={dirtyRooms > 0 ? 'bg-amber-50 border-amber-200' : ''} />
          <StatCard label="Pendientes" value={pending} sub="solicitudes" accent={pending > 0 ? 'bg-rose-50 border-rose-200' : ''} />
        </motion.div>

        {/* Tab switcher */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }} className="flex bg-surface-2 rounded-2xl p-1 gap-1 mb-5">
          {[
            { id: 'rooms', label: 'Habitaciones' },
            { id: 'solicitudes', label: 'Solicitudes' },
            { id: 'reportes', label: 'Reportes' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.id ? 'bg-white text-brand-700 shadow-glass' : 'text-gray-400 hover:text-gray-600'
              }`}>{t.label}</button>
          ))}
        </motion.div>

        {/* ===== HABITACIONES ===== */}
        {tab === 'rooms' && (
          <div className="pb-20">
            {loadingRooms ? (
              <div className="text-center py-16">
                <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
                <p className="text-sm text-gray-400">Cargando habitaciones...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-3xl mb-3">🏨</p>
                <p className="text-sm text-gray-500">No hay habitaciones registradas</p>
                <p className="text-xs text-gray-400 mt-1">Ejecuta el seed de rooms en Supabase</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {rooms.map((room, i) => {
                  const occupied = !!room.token_sesion_actual
                  const dirty = room.estado_limpieza === 'sucia'
                  const maintenance = room.estado_limpieza === 'mantenimiento'
                  const price = getRoomPrice(room)

                  return (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      className={`rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.97] ${
                        occupied
                          ? 'bg-blue-50 border-blue-300 shadow-glass'
                          : dirty
                          ? 'bg-amber-50 border-amber-300'
                          : maintenance
                          ? 'bg-red-50 border-red-300'
                          : 'bg-white border-emerald-300 hover:border-emerald-400 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                      }`}
                      onClick={() => occupied ? setCheckOutRoom(room) : (!dirty && !maintenance) ? setCheckInRoom(room) : null}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-2xl font-display font-bold ${
                          occupied ? 'text-blue-800' : dirty ? 'text-amber-800' : maintenance ? 'text-red-800' : 'text-emerald-800'
                        }`}>
                          {room.numero}
                        </span>
                        <RoomStatusBadge room={room} />
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-2">{room.tipo}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">{formatPrice(price)}</span>
                        {occupied && room.huesped_nombre && (
                          <span className="text-[10px] text-blue-600 truncate max-w-[100px]">{room.huesped_nombre}</span>
                        )}
                      </div>

                      {/* Quick actions for non-occupied rooms */}
                      {!occupied && (
                        <div className="flex gap-1 mt-2 pt-2 border-t border-white/50">
                          {dirty && (
                            <button onClick={(e) => { e.stopPropagation(); handleCleanRoom(room.id) }}
                              className="flex-1 text-[10px] py-1 rounded-lg font-medium bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition-all">
                              Limpiar
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); handleToggleMaintenance(room.id, room.estado_limpieza) }}
                            className={`flex-1 text-[10px] py-1 rounded-lg font-medium transition-all border ${
                              maintenance
                                ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                            }`}>
                            {maintenance ? 'Activar' : 'Mantenim.'}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== SOLICITUDES ===== */}
        {tab === 'solicitudes' && (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-1">
              {FILTERS.map(f => {
                const s = STATUS[f]
                return (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all duration-200 ${
                      filter === f ? 'bg-gray-900 text-white' : 'bg-surface-2 text-gray-500 hover:bg-surface-3'
                    }`}>
                    {f === 'todas' ? 'Todas' : s?.label}
                    {f !== 'todas' && (
                      <span className="ml-1.5 opacity-70">{requests.filter(r => r.estado === f).length}</span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="space-y-2.5 pb-24">
              <AnimatePresence>
                {filtered.map((req, i) => {
                  const st = STATUS[req.estado]
                  const roomNum = req.rooms?.numero || '—'
                  return (
                    <motion.div key={req.id} layout initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ delay: i * 0.04, duration: 0.35 }}
                      onClick={() => setSelected(req.id === selected ? null : req.id)}
                      className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
                        req.estado === 'completado'
                          ? 'bg-surface-1 border-surface-3 opacity-60 hover:opacity-80'
                          : 'bg-white border-surface-3 hover:border-brand-200 hover:shadow-glass shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                      } ${selected === req.id ? 'border-brand-300 shadow-glass' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${st.bg} ${st.text} border ${st.border}`}>
                            {roomNum}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900">{req.tipo_servicio}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.text} border ${st.border}`}>{st.label}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">Hab. {roomNum}</p>
                            {req.nota && (
                              <p className="text-xs text-gray-500 mt-1.5 bg-surface-1 rounded-lg px-2.5 py-1.5 italic">&ldquo;{req.nota}&rdquo;</p>
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
                            {new Date(req.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selected === req.id && req.estado !== 'completado' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                            <div className="flex gap-2 mt-4 pt-3 border-t border-surface-3">
                              <button onClick={(e) => { e.stopPropagation(); if (req.estado === 'pendiente') handleAccept(req.id); else advance(req.id) }}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                                  req.estado === 'pendiente'
                                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
                                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                                }`}>
                                {req.estado === 'pendiente' ? '👤 Asignar y aceptar' : '✓ Marcar completado'}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {!reqsLoading && filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-3xl mb-3">🎉</p>
                  <p className="text-sm font-medium text-gray-500">
                    No hay solicitudes {filter !== 'todas' ? `con estado "${STATUS[filter]?.label}"` : ''}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== REPORTES ===== */}
        {tab === 'reportes' && (
          <motion.div key="reportes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-24 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Servicio más solicitado</p>
              {topService ? (
                <>
                  <p className="text-2xl font-display font-semibold text-gray-900">{topService[0]}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{topService[1]} solicitud{topService[1] !== 1 ? 'es' : ''}</p>
                </>
              ) : <p className="text-sm text-gray-400">Sin datos aún</p>}
            </div>

            {requests.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">Distribución por servicio</p>
                <div className="space-y-2">
                  {Object.entries(requests.reduce((acc, r) => { acc[r.tipo_servicio] = (acc[r.tipo_servicio] || 0) + 1; return acc }, {}))
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => {
                      const total = requests.length
                      const pct = Math.round((count / total) * 100)
                      return (
                        <div key={name} className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 w-24 truncate shrink-0">{name}</span>
                          <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 font-mono w-10 text-right">{count}</span>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {historyByDate.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Historial completado</p>
                {historyByDate.map(([date, items]) => (
                  <div key={date} className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                    <p className="text-sm font-semibold text-gray-800 mb-3 capitalize">{date}</p>
                    <div className="space-y-2">
                      {items.map(req => {
                        const roomNum = req.rooms?.numero || '—'
                        return (
                          <div key={req.id} className="flex items-center justify-between py-1.5 border-b border-surface-2 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-400 w-8">{roomNum}</span>
                              <span className="text-sm text-gray-700">{req.tipo_servicio}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-mono">
                              {new Date(req.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {requests.length === 0 && !reqsLoading && (
              <div className="text-center py-16">
                <p className="text-3xl mb-3">📊</p>
                <p className="text-sm font-medium text-gray-500">No hay datos para mostrar aún</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Check-In Modal */}
      <AnimatePresence>
        {checkInRoom && (
          <CheckInModal room={checkInRoom} onClose={() => setCheckInRoom(null)} onConfirm={handleCheckIn} />
        )}
      </AnimatePresence>

      {/* Check-Out Modal */}
      <AnimatePresence>
        {checkOutRoom && (
          <CheckOutModal room={checkOutRoom} requests={requests} onClose={() => setCheckOutRoom(null)} onConfirm={handleCheckOut} />
        )}
      </AnimatePresence>

      {/* Staff assigner */}
      <AnimatePresence>
        {assigning && (
          <StaffAssigner requestId={assigning} onAssign={(id, staffId) => advance(id, staffId)} onClose={() => setAssigning(null)} />
        )}
      </AnimatePresence>

      {/* Pending badge */}
      {pending > 0 && tab === 'solicitudes' && (
        <div className="fixed bottom-6 right-6">
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}
            className="bg-amber-400 text-amber-900 rounded-2xl px-4 py-3 shadow-float flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
            <span className="text-sm font-semibold">{pending} pendiente{pending > 1 ? 's' : ''}</span>
          </motion.div>
        </div>
      )}
    </div>
  )
}
