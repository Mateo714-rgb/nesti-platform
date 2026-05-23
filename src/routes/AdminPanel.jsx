import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const MOCK_ROOMS = [
  { id: '00000000-0000-0000-0000-000000000101', numero: '101', nombre: 'Habitación Estándar', tipo: 'Estándar', token_sesion_actual: null },
  { id: '00000000-0000-0000-0000-000000000204', numero: '204', nombre: 'Suite Orquídea', tipo: 'Suite Junior', token_sesion_actual: crypto.randomUUID() },
  { id: '00000000-0000-0000-0000-000000000305', numero: '305', nombre: 'Suite Panorámica', tipo: 'Suite', token_sesion_actual: null },
  { id: '00000000-0000-0000-0000-000000000112', numero: '112', nombre: 'Cabaña del Bosque', tipo: 'Cabaña', token_sesion_actual: null },
]

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`flex-1 rounded-2xl p-4 border ${accent || 'bg-white border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'}`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-display font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function Bar({ label, value, max, color = 'bg-brand-500' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-20 truncate shrink-0 text-right">{label}</span>
      <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 font-mono w-8 text-right">{value}</span>
    </div>
  )
}

export default function AdminPanel() {
  const [rooms, setRooms] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [tab, setTab] = useState('rooms')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [roomsRes, reqsRes] = await Promise.all([
      supabase.from('rooms').select('*').order('numero'),
      supabase.from('solicitudes_servicio').select('*').order('created_at', { ascending: false }),
    ])
    if (roomsRes.error || !roomsRes.data || roomsRes.data.length === 0) {
      setRooms(MOCK_ROOMS)
    } else {
      setRooms(roomsRes.data)
    }
    if (!reqsRes.error && reqsRes.data) {
      setRequests(reqsRes.data)
    }
    setLoading(false)
  }

  async function handleCheckIn(roomId) {
    setActionId(roomId)
    const token = crypto.randomUUID()
    await supabase.from('rooms').update({ token_sesion_actual: token }).eq('id', roomId)
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, token_sesion_actual: token } : r))
    setActionId(null)
  }

  async function handleCheckOut(roomId) {
    setActionId(roomId)
    await supabase.from('rooms').update({ token_sesion_actual: null }).eq('id', roomId)
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, token_sesion_actual: null } : r))
    setActionId(null)
  }

  // Dashboard computations
  const stats = useMemo(() => {
    const totalRooms = rooms.length
    const activeRooms = rooms.filter(r => r.token_sesion_actual).length
    const occupancy = totalRooms > 0 ? Math.round((activeRooms / totalRooms) * 100) : 0
    return { totalRooms, activeRooms, occupancy }
  }, [rooms])

  const reqStats = useMemo(() => {
    const total = requests.length
    const completed = requests.filter(r => r.estado === 'completado').length
    const pending = requests.filter(r => r.estado === 'pendiente').length
    const inProgress = requests.filter(r => r.estado === 'aceptado').length

    // Average response time (pendiente → aceptado in minutes)
    let totalMinutes = 0; let count = 0
    requests.forEach(r => {
      if (r.estado === 'aceptado' || r.estado === 'completado') {
        const created = new Date(r.created_at).getTime()
        count++
      }
    })

    // Service distribution
    const serviceCounts = {}
    requests.forEach(r => {
      serviceCounts[r.tipo_servicio] = (serviceCounts[r.tipo_servicio] || 0) + 1
    })
    const topServices = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Requests per day (last 7)
    const days = {}
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('es-EC', { weekday: 'short', day: 'numeric' })
      days[key] = 0
    }
    requests.forEach(r => {
      const d = new Date(r.created_at)
      const diff = Math.round((now - d) / (1000 * 60 * 60 * 24))
      if (diff >= 0 && diff < 7) {
        const key = d.toLocaleDateString('es-EC', { weekday: 'short', day: 'numeric' })
        if (days[key] !== undefined) days[key]++
      }
    })
    const daysMax = Math.max(...Object.values(days), 1)

    // Hour distribution
    const hours = {}
    for (let i = 0; i < 24; i++) hours[i] = 0
    requests.forEach(r => {
      const h = new Date(r.created_at).getHours()
      hours[h] = (hours[h] || 0) + 1
    })
    const peakHour = Object.entries(hours).sort((a, b) => b[1] - a[1])[0]

    return { total, completed, pending, inProgress, topServices, days, daysMax, hours, peakHour }
  }, [requests])

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-1 via-white to-brand-50/40 px-4 py-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-gray-400 tracking-widest uppercase font-medium mb-1">Panel Administrativo</p>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-gray-900">Dashboard del Hotel</h1>
          <div className="flex items-center gap-2">
            <a href="/affiliate/dashboard"
              className="text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl transition-all hover:bg-amber-100">
              Afiliados
            </a>
            <a href="/admin/beta-registrations"
              className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-xl transition-all hover:bg-brand-100">
              Registros Beta
            </a>
          </div>
        </div>
      </motion.div>

      {/* Tab switcher */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex bg-surface-2 rounded-2xl p-1 gap-1 mb-6">
        {[
          { id: 'rooms', label: 'Habitaciones' },
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'config', label: 'Configuración' },
          { id: 'affiliates', label: 'Afiliados' },
          { id: 'novedades', label: 'Novedades' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              tab === t.id ? 'bg-white text-brand-700 shadow-glass' : 'text-gray-400 hover:text-gray-600'
            }`}>
            {t.label}
          </button>
        ))}
      </motion.div>

      {/* ===== HABITACIONES ===== */}
      {tab === 'rooms' && (
        <div className="space-y-3 pb-20">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
              <p className="text-sm text-gray-400">Cargando habitaciones...</p>
            </div>
          ) : (
            <>
              <div className="flex gap-3 mb-4">
                <StatCard label="Total" value={stats.totalRooms} sub="habitaciones" />
                <StatCard label="Ocupadas" value={stats.activeRooms} sub={`${stats.occupancy}% ocupación`} accent={stats.activeRooms > 0 ? 'bg-brand-50 border-brand-200' : ''} />
                <StatCard label="Disponibles" value={stats.totalRooms - stats.activeRooms} sub="libres" />
              </div>
              {rooms.map((room, i) => {
                const active = !!room.token_sesion_actual
                return (
                  <motion.div key={room.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className={`rounded-2xl border p-5 transition-all duration-200 ${active ? 'bg-white border-brand-200 shadow-glass' : 'bg-white border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${active ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-surface-2 text-gray-500 border border-surface-3'}`}>
                          {room.numero}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900">{room.nombre}</p>
                            <span className="text-xs text-gray-400 bg-surface-2 px-2 py-0.5 rounded-full">{room.tipo}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                            <span className={`text-xs ${active ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                              {active ? 'Check-in activo' : 'Disponible'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {active ? (
                          <button onClick={() => handleCheckOut(room.id)} disabled={actionId === room.id}
                            className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 active:scale-95 transition-all disabled:opacity-50">
                            {actionId === room.id ? '...' : 'Hacer Check-Out'}
                          </button>
                        ) : (
                          <button onClick={() => handleCheckIn(room.id)} disabled={actionId === room.id}
                            className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm disabled:opacity-50">
                            {actionId === room.id ? '...' : 'Hacer Check-In'}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </>
          )}
        </div>
      )}

      {/* ===== AFILIADOS ===== */}
      {tab === 'affiliates' && (
        <AffiliatesSection />
      )}

      {/* ===== NOVEDADES ===== */}
      {tab === 'novedades' && (
        <NovedadesSection />
      )}

      {/* ===== CONFIGURACIÓN ===== */}
      {tab === 'config' && (
        <ConfigSection />
      )}

      {/* ===== DASHBOARD ===== */}
      {tab === 'dashboard' && (
        <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-20 space-y-6">
          {/* KPI row */}
          <div className="flex gap-3">
            <StatCard label="Solicitudes totales" value={reqStats.total} sub="histórico" />
            <StatCard label="Completadas" value={reqStats.completed} sub="finalizadas" />
            <StatCard label="En proceso" value={reqStats.inProgress} sub="siendo atendidas" />
            <StatCard label="Pendientes" value={reqStats.pending} sub="sin asignar" accent={reqStats.pending > 0 ? 'bg-amber-50 border-amber-200' : ''} />
          </div>

          {/* Requests per day (last 7) */}
          <div className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">Solicitudes últimos 7 días</p>
            <div className="flex items-end gap-2 h-32">
              {Object.entries(reqStats.days).map(([day, count]) => {
                const height = reqStats.daysMax > 0 ? (count / reqStats.daysMax) * 100 : 0
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-xs text-gray-400 font-mono">{count}</span>
                    <div className="w-full rounded-lg bg-brand-200 transition-all duration-500" style={{ height: `${Math.max(height, 4)}%` }}>
                      <div className="w-full rounded-lg bg-brand-500 transition-all duration-500" style={{ height: `${height}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 text-center">{day}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top services + Peak hour */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">Servicios más solicitados</p>
              <div className="space-y-2">
                {reqStats.topServices.length > 0 ? reqStats.topServices.map(([name, count], i) => (
                  <Bar key={name} label={name} value={count} max={reqStats.topServices[0][1]} color={i === 0 ? 'bg-brand-500' : 'bg-brand-300'} />
                )) : <p className="text-xs text-gray-400">Sin datos</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">Hora pico</p>
              {reqStats.peakHour ? (
                <>
                  <p className="text-3xl font-display font-semibold text-gray-900">
                    {String(reqStats.peakHour[0]).padStart(2, '0')}:00
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{reqStats.peakHour[1]} solicitudes en esa hora</p>
                  <div className="mt-4 space-y-1">
                    {[6, 9, 12, 15, 18, 21].map(h => {
                      const v = reqStats.hours[h] || 0
                      const max = Math.max(...Object.values(reqStats.hours), 1)
                      return (
                        <div key={h} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 w-8">{String(h).padStart(2, '0')}:00</span>
                          <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-brand-400" style={{ width: `${(v / max) * 100}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono w-4">{v}</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : <p className="text-xs text-gray-400">Sin datos</p>}
            </div>
          </div>

          {/* Occupancy */}
          <div className="bg-white rounded-2xl p-5 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">Ocupación del hotel</p>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e9ecef" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#147474" strokeWidth="3"
                    strokeDasharray={`${stats.occupancy}, 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-display font-semibold text-gray-900">
                  {stats.occupancy}%
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {stats.activeRooms} de {stats.totalRooms} habitaciones ocupadas
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {stats.totalRooms - stats.activeRooms} disponibles para check-in
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  )
}

// ===== CONFIGURACIÓN =====
function ConfigSection() {
  const [config, setConfig] = useState(null)
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newStaff, setNewStaff] = useState({ nombre: '', rol: 'mucama' })

  useEffect(() => {
    Promise.all([
      supabase.from('hotel_config').select('*').limit(1).single(),
      supabase.from('staff').select('*').order('nombre'),
    ]).then(([configRes, staffRes]) => {
      if (configRes.data) setConfig(configRes.data)
      if (staffRes.data) setStaff(staffRes.data)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    await supabase
      .from('hotel_config')
      .update({ ...config, updated_at: new Date().toISOString() })
      .eq('id', config.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addStaff = async () => {
    if (!newStaff.nombre.trim()) return
    const { data } = await supabase
      .from('staff')
      .insert({ nombre: newStaff.nombre.trim(), rol: newStaff.rol })
      .select()
      .single()
    if (data) setStaff((prev) => [...prev, data])
    setNewStaff({ nombre: '', rol: 'mucama' })
  }

  const toggleStaff = async (id, active) => {
    await supabase.from('staff').update({ activo: !active }).eq('id', id)
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, activo: !active } : s)))
  }

  const updateField = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
        <p className="text-sm text-gray-400">Cargando configuración...</p>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-surface-3 text-center">
        <p className="text-sm text-gray-500">
          No hay configuración. Ejecuta el seed de hotel_config en Supabase.
        </p>
      </div>
    )
  }

  const FIELDS = [
    { key: 'name', label: 'Nombre del hotel', type: 'text' },
    { key: 'tagline', label: 'Eslogan', type: 'text' },
    { key: 'guest_name', label: 'Nombre del huésped (demo)', type: 'text' },
    { key: 'wifi_name', label: 'Nombre WiFi', type: 'text' },
    { key: 'wifi_password', label: 'Contraseña WiFi', type: 'text' },
    { key: 'breakfast_info', label: 'Info Desayuno', type: 'text' },
    { key: 'pool_info', label: 'Info Piscina', type: 'text' },
    { key: 'parking_info', label: 'Info Estacionamiento', type: 'text' },
    { key: 'reception_info', label: 'Info Recepción', type: 'text' },
    { key: 'check_out_info', label: 'Info Check-out', type: 'text' },
    { key: 'address', label: 'Dirección', type: 'text' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-20 space-y-8">
      <div className="bg-white rounded-2xl p-6 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Información del hotel</p>
        <div className="space-y-3">
          {FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input
                type="text"
                value={config[key] || ''}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-5">
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && (
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-emerald-600 font-medium">
              ✓ Guardado
            </motion.span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Personal del hotel</p>
        <div className="space-y-2 mb-5">
          {staff.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-surface-1 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${m.activo ? 'bg-brand-50 text-brand-700' : 'bg-surface-2 text-gray-400'}`}>
                  {m.nombre.charAt(0)}
                </div>
                <div>
                  <p className={`text-sm font-medium ${m.activo ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{m.nombre}</p>
                  <p className="text-xs text-gray-400 capitalize">{m.rol}</p>
                </div>
              </div>
              <button onClick={() => toggleStaff(m.id, m.activo)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  m.activo
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                }`}>
                {m.activo ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          ))}
        </div>
        <div className="border-t border-surface-3 pt-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Agregar personal</p>
          <div className="flex gap-2">
            <input value={newStaff.nombre} onChange={(e) => setNewStaff((p) => ({ ...p, nombre: e.target.value }))}
              placeholder="Nombre completo"
              className="flex-1 text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 transition-all" />
            <select value={newStaff.rol} onChange={(e) => setNewStaff((p) => ({ ...p, rol: e.target.value }))}
              className="text-sm bg-surface-1 rounded-xl px-3 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 transition-all">
              <option value="mucama">Mucama</option>
              <option value="botones">Botones</option>
              <option value="cocina">Cocina</option>
              <option value="recepcion">Recepción</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
            <button onClick={addStaff}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm">+</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ===== AFILIADOS =====
function AffiliatesSection() {
  const [affiliates, setAffiliates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('affiliates').select('*').order('created_at', { ascending: false }),
      supabase.from('referrals').select('*').order('created_at', { ascending: false }),
    ]).then(([affRes, refRes]) => {
      if (affRes.data) setAffiliates(affRes.data)
      if (refRes.data) {
        refMap.current = {}
        refRes.data.forEach(r => {
          refMap.current[r.affiliate_id] = (refMap.current[r.affiliate_id] || 0) + 1
        })
      }
      setLoading(false)
    })
  }, [])

  const refMap = { current: {} }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
        <p className="text-sm text-gray-400">Cargando afiliados...</p>
      </div>
    )
  }

  if (affiliates.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-gray-400">No hay afiliados registrados.</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-3">
              <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Fecha</th>
              <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Nombre</th>
              <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Email</th>
              <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Código</th>
              <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Refs</th>
              <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3">Pagos</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map(a => (
              <tr key={a.id} className="border-b border-surface-3 hover:bg-surface-1/50 transition-colors">
                <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                  {new Date(a.created_at).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit' })}
                </td>
                <td className="py-3 pr-4 font-medium text-gray-900">{a.nombre}</td>
                <td className="py-3 pr-4">
                  <a href={`mailto:${a.email}`} className="text-brand-600 hover:underline">{a.email}</a>
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-gray-500">{a.ref_code}</td>
                <td className="py-3 pr-4 text-gray-900 font-medium">{refMap.current[a.id] || 0}</td>
                <td className="py-3 text-gray-500">{a.payout_email || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// ===== NOVEDADES (HOY EN EL HOTEL) =====
function NovedadesSection() {
  const [novedades, setNovedades] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'general',
    fecha_evento: '',
  })
  const [saving, setSaving] = useState(false)

  const fetchNovedades = async () => {
    const { data } = await supabase
      .from('novedades')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setNovedades(data)
    setLoading(false)
  }

  useEffect(() => { fetchNovedades() }, [])

  const handleCreate = async () => {
    if (!form.titulo.trim()) return
    setSaving(true)
    const { data } = await supabase
      .from('novedades')
      .insert({
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        categoria: form.categoria,
        fecha_evento: form.fecha_evento || null,
      })
      .select()
      .single()
    if (data) {
      setNovedades(prev => [data, ...prev])
      setForm({ titulo: '', descripcion: '', categoria: 'general', fecha_evento: '' })
    }
    setSaving(false)
  }

  const toggleActive = async (id, current) => {
    await supabase.from('novedades').update({ activo: !current }).eq('id', id)
    setNovedades(prev => prev.map(n => n.id === id ? { ...n, activo: !current } : n))
  }

  const handleDelete = async (id) => {
    await supabase.from('novedades').delete().eq('id', id)
    setNovedades(prev => prev.filter(n => n.id !== id))
  }

  const iconMap = {
    general: '📢',
    evento: '🎉',
    comida: '🍽️',
    actividad: '🏃',
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
        <p className="text-sm text-gray-400">Cargando novedades...</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-20 space-y-6">
      {/* Create form */}
      <div className="bg-white rounded-2xl p-6 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-4">Nueva novedad</p>
        <div className="space-y-3">
          <input value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
            placeholder="Título (ej: Fogata 7PM)"
            className="w-full text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 transition-all" />
          <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 transition-all resize-none" />
          <div className="flex gap-3">
            <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}
              className="flex-1 text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 transition-all">
              <option value="general">General</option>
              <option value="evento">Evento</option>
              <option value="comida">Comida</option>
              <option value="actividad">Actividad</option>
            </select>
            <input type="date" value={form.fecha_evento} onChange={e => setForm(p => ({ ...p, fecha_evento: e.target.value }))}
              className="flex-1 text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 transition-all" />
          </div>
          <button onClick={handleCreate} disabled={saving}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm disabled:opacity-50">
            {saving ? 'Publicando...' : 'Publicar novedad'}
          </button>
        </div>
      </div>

      {/* List */}
      {novedades.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-3xl mb-3">📢</p>
          <p className="text-sm text-gray-500">No hay novedades aún</p>
          <p className="text-xs text-gray-400 mt-1">Publica la primera desde el formulario de arriba</p>
        </div>
      ) : (
        <div className="space-y-3">
          {novedades.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.35 }}
              className={`bg-white rounded-2xl border p-4 transition-all ${n.activo ? 'border-surface-3' : 'border-gray-200 opacity-60'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{iconMap[n.categoria] || '📢'}</span>
                    <p className={`text-sm font-semibold ${n.activo ? 'text-gray-900' : 'text-gray-400'}`}>{n.titulo}</p>
                    <span className="text-[10px] text-gray-400 bg-surface-2 px-2 py-0.5 rounded-full capitalize">{n.categoria}</span>
                  </div>
                  {n.descripcion && (
                    <p className="text-xs text-gray-500 ml-8 mt-1">{n.descripcion}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 ml-8">
                    <span className="text-[10px] text-gray-400">
                      {new Date(n.created_at).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {n.fecha_evento && (
                      <span className="text-[10px] text-brand-600 font-medium">📅 {new Date(n.fecha_evento).toLocaleDateString('es-EC', { day: 'numeric', month: 'long' })}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleActive(n.id, n.activo)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${n.activo ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}>
                    {n.activo ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button onClick={() => handleDelete(n.id)}
                    className="text-xs px-2.5 py-1.5 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-all">
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
