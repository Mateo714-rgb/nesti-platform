import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hotel, room, services } from '../data/hotel'

const CATEGORIES = ['todos', 'habitación', 'alimentos', 'logística']

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] },
})

function RequestModal({ service, onClose, onSubmit }) {
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  const handle = () => {
    setSent(true)
    setTimeout(() => { onSubmit(); onClose() }, 1600)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm glass rounded-3xl p-6 shadow-float"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}>

        {sent ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <motion.div
              className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-3xl"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
              ✓
            </motion.div>
            <p className="font-display font-semibold text-lg text-gray-900">¡Solicitud enviada!</p>
            <p className="text-sm text-gray-500 text-center">Recepción fue notificada. Te confirmarán en breve.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center text-2xl">{service.icon}</div>
              <div>
                <p className="font-medium text-gray-900">{service.title}</p>
                <p className="text-xs text-gray-400">Tiempo estimado: {service.eta}</p>
              </div>
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Detalles adicionales (opcional)..."
              rows={3}
              className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 resize-none border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-surface-2 hover:bg-surface-3 transition-colors">
                Cancelar
              </button>
              <button onClick={handle}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm">
                Solicitar
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function GuestView() {
  const [activeCategory, setActiveCategory] = useState('todos')
  const [selected, setSelected] = useState(null)
  const [sentIds, setSentIds] = useState([])
  const [tab, setTab] = useState('services')

  const filtered = activeCategory === 'todos'
    ? services
    : services.filter(s => s.category === activeCategory)

  const handleSubmit = () => {
    if (selected) setSentIds(p => [...p, selected.id])
  }

  const today = new Date().toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-b from-brand-50/60 via-white to-surface-1">
      {/* Mobile frame */}
      <div className="w-full max-w-sm relative">

        {/* Header / Hero */}
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 pt-14 pb-10 noise"
          {...fadeUp(0)}>
          {/* subtle pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)' }} />
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-brand-200 text-xs font-medium tracking-widest uppercase mb-1">Bienvenido</p>
                <h1 className="font-display text-2xl font-semibold text-white leading-tight">{hotel.guestName} 👋</h1>
                <p className="text-brand-200 text-sm mt-0.5">{today}</p>
              </div>
              <div className="text-right">
                <p className="text-brand-200 text-xs">Habitación</p>
                <p className="font-display text-3xl font-semibold text-white">{room.number}</p>
              </div>
            </div>

            {/* Room card inside header */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-brand-900">{room.name}</p>
                <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-medium">{room.type}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{room.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {room.features.map(f => (
                  <span key={f} className="text-xs bg-white/70 text-brand-700 px-2 py-0.5 rounded-full border border-white/60">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stay info strip */}
        <motion.div {...fadeUp(0.08)} className="mx-4 -mt-1">
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
              <p className="text-xs text-gray-400 mb-0.5">Noches</p>
              <p className="text-sm font-semibold text-gray-800">3</p>
            </div>
          </div>
        </motion.div>

        {/* Tab switcher */}
        <motion.div {...fadeUp(0.12)} className="mx-4 mt-5 mb-4">
          <div className="flex bg-surface-2 rounded-2xl p-1 gap-1">
            {[{ id: 'services', label: 'Servicios' }, { id: 'info', label: 'Info del Hotel' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  tab === t.id ? 'bg-white text-brand-700 shadow-glass' : 'text-gray-400 hover:text-gray-600'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
        {tab === 'services' && (
          <motion.div key="services"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}>

            {/* Category filter */}
            <div className="px-4 mb-4 overflow-x-auto scrollbar-none">
              <div className="flex gap-2 w-max">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setActiveCategory(c)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200 whitespace-nowrap ${
                      activeCategory === c
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-surface-2 text-gray-500 hover:bg-surface-3'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Service grid */}
            <div className="px-4 grid grid-cols-2 gap-3 pb-10">
              {filtered.map((s, i) => {
                const done = sentIds.includes(s.id)
                return (
                  <motion.button
                    key={s.id}
                    {...fadeUp(0.04 * i)}
                    onClick={() => !done && setSelected(s)}
                    className={`relative text-left p-4 rounded-2xl border transition-all duration-200 group ${
                      done
                        ? 'bg-brand-50 border-brand-200'
                        : 'bg-white border-surface-3 hover:border-brand-200 hover:shadow-glass active:scale-95 shadow-[0_1px_4px_rgba(0,0,0,0.04)]'
                    }`}>
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <p className={`text-sm font-semibold leading-tight mb-1 ${done ? 'text-brand-700' : 'text-gray-800'}`}>{s.title}</p>
                    <p className="text-xs text-gray-400 leading-snug line-clamp-2">{s.desc}</p>
                    {done && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {!done && (
                      <p className="text-xs text-brand-500 mt-2 font-medium">≈ {s.eta}</p>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {tab === 'info' && (
          <motion.div key="info"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="px-4 pb-10 space-y-3">
            {[
              { icon: '📶', title: 'Wi-Fi', detail: 'CasaArbol_Guest · Clave: orquidea2024' },
              { icon: '🍳', title: 'Desayuno', detail: 'Incluido. Buffet de 7:00 – 10:30 AM en el comedor principal' },
              { icon: '🏊', title: 'Piscina', detail: 'Abierta de 8 AM a 8 PM. Toallas disponibles en recepción' },
              { icon: '🅿️', title: 'Estacionamiento', detail: 'Gratuito. Zona vigilada 24h, sótano nivel B1' },
              { icon: '📞', title: 'Recepción', detail: 'Disponible 24 horas. Llama al ext. 0 desde el teléfono de tu habitación' },
              { icon: '🔑', title: 'Check-out', detail: 'Hasta las 12:00 PM. Extensión disponible según disponibilidad (cobro extra)' },
              { icon: '📍', title: 'Dirección', detail: 'Av. Quito km 4.5, Mindo, Ecuador. Coordenadas disponibles en recepción' },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp(0.04 * i)}
                className="flex items-start gap-4 bg-white rounded-2xl px-4 py-4 border border-surface-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
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

        {/* Floating hotel name */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="glass rounded-full px-5 py-2.5 shadow-glass flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
            <span className="text-xs font-medium text-brand-700">{hotel.name}</span>
            <span className="text-xs text-gray-400">{hotel.tagline.split('·')[0]}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <RequestModal
            service={selected}
            onClose={() => setSelected(null)}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
