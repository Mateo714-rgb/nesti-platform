import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useRoom } from '../hooks/useRoom'
import { useGuestRequests } from '../hooks/useGuestRequests'
import { useSessionMonitor } from '../hooks/useSessionMonitor'
import { useHotelConfig, getInfoItems } from '../hooks/useHotelConfig'
import RequestModal from '../components/RequestModal'
import ServiceCard from '../components/ServiceCard'
import GlassCard from '../components/GlassCard'
import { services as fallbackServices } from '../data/hotel'

const CATEGORIES = ['todos', 'habitación', 'alimentos', 'logística']

const STATUS = {
  pendiente: { label: 'Pendiente', dot: 'bg-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  aceptado: { label: 'En proceso', dot: 'bg-brand-500', bg: 'bg-brand-50', text: 'text-brand-700', border: 'border-brand-200' },
  completado: { label: 'Listo', dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
}

export default function GuestRoom() {
  const { uuid } = useParams()
  const { room, loading, error } = useRoom(uuid)
  const { requests: guestRequests } = useGuestRequests(room?.id)
  const sessionExpired = useSessionMonitor(room?.id)
  const { config: hotelConfig, loading: configLoading } = useHotelConfig()

  const [services, setServices] = useState(fallbackServices)
  const [hotel, setHotel] = useState({ name: 'Hotel', tagline: '', guestName: '' })
  const [activeCategory, setActiveCategory] = useState('todos')
  const [selectedService, setSelectedService] = useState(null)
  const [tab, setTab] = useState('services')
  const [showCustom, setShowCustom] = useState(false)

  useEffect(() => {
    supabase
      .from('servicios')
      .select('*')
      .order('orden')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setServices(
            data.map((s) => ({
              id: s.id,
              category: s.categoria,
              icon: s.icono,
              title: s.titulo,
              desc: s.descripcion,
              eta: s.tiempo_estimado,
            }))
          )
        }
      })
  }, [])

  useEffect(() => {
    if (hotelConfig) {
      setHotel({
        name: hotelConfig.name || 'Hotel',
        tagline: hotelConfig.tagline || '',
        guestName: hotelConfig.guest_name || 'Huésped',
      })
    }
  }, [hotelConfig])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50/60 via-white to-surface-1">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-4" />
          <p className="text-sm text-gray-400">Cargando habitación...</p>
        </div>
      </div>
    )
  }

  if (error || sessionExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50/60 via-white to-surface-1 p-4">
        <GlassCard className="p-8 max-w-sm mx-auto text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-2">
            {sessionExpired ? 'Sesión finalizada' : 'Acceso restringido'}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {sessionExpired
              ? 'El check-out de tu habitación fue procesado por recepción. Gracias por tu estadía.'
              : error}
          </p>
        </GlassCard>
      </div>
    )
  }

  const filtered =
    activeCategory === 'todos'
      ? services
      : services.filter((s) => s.category === activeCategory)

  const today = new Date().toLocaleDateString('es-EC', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-b from-brand-50/60 via-white to-surface-1">
      <div className="w-full max-w-sm relative">
        {/* Hero header */}
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 pt-14 pb-10 noise"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)',
            }}
          />
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-brand-200 text-xs font-medium tracking-widest uppercase mb-1">Bienvenido</p>
                <h1 className="font-display text-2xl font-semibold text-white leading-tight">{hotel.guestName} 👋</h1>
                <p className="text-brand-200 text-sm mt-0.5">{today}</p>
              </div>
              <div className="text-right">
                <p className="text-brand-200 text-xs">Habitación</p>
                <p className="font-display text-3xl font-semibold text-white">{room?.numero}</p>
              </div>
            </div>

            <GlassCard className="p-4 !bg-white/80">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-brand-900">{room?.nombre}</p>
                <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-medium">{room?.tipo}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{room?.descripcion}</p>
            </GlassCard>
          </div>
        </motion.div>

        {/* Stay info strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="mx-4 -mt-1"
        >
          <div className="glass-dark rounded-2xl px-5 py-3.5 shadow-glass flex items-center justify-around">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Check-in</p>
              <p className="text-sm font-semibold text-gray-800">Hoy, 3 PM</p>
            </div>
            <div className="w-px h-8 bg-surface-3" />
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Check-out</p>
              <p className="text-sm font-semibold text-gray-800">Mar 18, 12 PM</p>
            </div>
            <div className="w-px h-8 bg-surface-3" />
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Solicitudes</p>
              <p className="text-sm font-semibold text-gray-800">{guestRequests.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Tab switcher — 3 tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="mx-4 mt-5 mb-4"
        >
          <div className="flex bg-surface-2 rounded-2xl p-1 gap-1">
            {[
              { id: 'services', label: 'Servicios' },
              { id: 'requests', label: 'Mis Solicitudes' },
              { id: 'info', label: 'Info Hotel' },
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
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* === SERVICIOS === */}
          {tab === 'services' && (
            <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <div className="px-4 mb-4 overflow-x-auto scrollbar-none">
                <div className="flex gap-2 w-max">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200 whitespace-nowrap ${
                        activeCategory === c
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-surface-2 text-gray-500 hover:bg-surface-3'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 grid grid-cols-2 gap-3 pb-4">
                {filtered.map((s, i) => (
                  <ServiceCard key={s.id} {...s} index={i} onClick={() => setSelectedService(s)} />
                ))}
              </div>

              <div className="px-4 pb-10">
                <button
                  onClick={() => { setSelectedService(null); setShowCustom(true) }}
                  className="w-full py-3.5 rounded-2xl border-2 border-dashed border-surface-4 text-sm font-medium text-gray-400 hover:text-brand-600 hover:border-brand-300 transition-all bg-white/50 hover:bg-white active:scale-[0.98]"
                >
                  + Pedido personalizado
                </button>
              </div>
            </motion.div>
          )}

          {/* === MIS SOLICITUDES === */}
          {tab === 'requests' && (
            <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="px-4 pb-10 space-y-2">
              {guestRequests.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-3xl mb-3">📋</p>
                  <p className="text-sm font-medium text-gray-500">Aún no has hecho solicitudes</p>
                  <p className="text-xs text-gray-400 mt-1">Ve a la pestaña Servicios para pedir algo</p>
                </div>
              ) : (
                guestRequests.map((req, i) => {
                  const st = STATUS[req.estado] || STATUS.pendiente
                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.35 }}
                      className={`bg-white rounded-2xl border p-4 transition-all ${
                        req.estado === 'completado' ? 'border-emerald-200 bg-emerald-50/30' : 'border-surface-3'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{req.tipo_servicio}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(req.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {req.nota && (
                            <p className="text-xs text-gray-500 mt-1.5 bg-surface-1 rounded-lg px-2.5 py-1.5 italic">
                              &ldquo;{req.nota}&rdquo;
                            </p>
                          )}
                        </div>
                        <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium border ${st.bg} ${st.text} ${st.border}`}>
                          {st.label}
                        </span>
                      </div>
                      {req.staff && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                          <span>👤 {req.staff.nombre}</span>
                          <span className="text-surface-4">·</span>
                          <span className="capitalize">{req.staff.rol}</span>
                        </div>
                      )}
                      <div className="mt-3 flex gap-1">
                        <div className={`h-1 flex-1 rounded-full ${req.estado === 'pendiente' || req.estado === 'aceptado' || req.estado === 'completado' ? 'bg-brand-400' : 'bg-surface-3'}`} />
                        <div className={`h-1 flex-1 rounded-full ${req.estado === 'aceptado' || req.estado === 'completado' ? 'bg-brand-500' : 'bg-surface-3'}`} />
                        <div className={`h-1 flex-1 rounded-full ${req.estado === 'completado' ? 'bg-emerald-400' : 'bg-surface-3'}`} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-400">Recibido</span>
                        <span className="text-[10px] text-gray-400">En proceso</span>
                        <span className="text-[10px] text-gray-400">Completado</span>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          )}

          {/* === INFO HOTEL === */}
          {tab === 'info' && (
            <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="px-4 pb-10 space-y-3">
              {(hotelConfig ? getInfoItems(hotelConfig) : []).map((item, i) => (
                <motion.div
                  key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.4 }}
                  className="flex items-start gap-4 bg-white rounded-2xl px-4 py-4 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                >
                  <div className="text-xl mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating badge */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <GlassCard className="rounded-full px-5 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
            <span className="text-xs font-medium text-brand-700">{hotel.name}</span>
            <span className="text-xs text-gray-400">{hotel.tagline.split('·')[0]}</span>
          </GlassCard>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedService && !showCustom && (
          <RequestModal
            roomId={room?.id}
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onSuccess={() => setSelectedService(null)}
          />
        )}
        {showCustom && (
          <RequestModal
            roomId={room?.id}
            onClose={() => setShowCustom(false)}
            onSuccess={() => setShowCustom(false)}
            isCustom
          />
        )}
      </AnimatePresence>
    </div>
  )
}
