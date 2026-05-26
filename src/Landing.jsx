import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useAuth } from './lib/AuthContext'

const svgs = {
  hotel: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="20" width="36" height="24" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M6 24h36" stroke="currentColor" strokeWidth="2"/>
      <rect x="12" y="28" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="28" y="28" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M24 4L4 20h40L24 4z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <path d="M20 12h8v6h-8z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  qr: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="7" y="7" width="6" height="6" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="28" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="31" y="7" width="6" height="6" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="4" y="28" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="7" y="31" width="6" height="6" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="17" y="17" width="4" height="4" rx="1" fill="currentColor"/>
      <rect x="27" y="27" width="4" height="4" rx="1" fill="currentColor"/>
      <rect x="34" y="27" width="4" height="4" rx="1" fill="currentColor"/>
      <rect x="27" y="34" width="4" height="4" rx="1" fill="currentColor"/>
      <rect x="34" y="34" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="37" y="37" width="4" height="4" rx="1" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  service: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6a4 4 0 0 0-4 4v2h8v-2a4 4 0 0 0-4-4z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M12 18a12 12 0 0 0 24 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M18 14h12l1 2H17l1-2z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M10 28l2-10h24l2 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <path d="M4 32c4-4 8-4 12 0 4 4 8 4 16 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M6 36h36v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="20" cy="40" r="1" fill="currentColor" opacity="0.4"/>
      <circle cx="28" cy="40" r="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  reception: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="40" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="10" y="14" width="28" height="26" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="16" y="20" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <rect x="16" y="28" width="16" height="2" rx="1" fill="currentColor" opacity="0.3"/>
      <circle cx="24" cy="36" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M18 6v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="40" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M14 34V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 34V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M34 34V26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="14" cy="20" r="2" fill="currentColor"/>
      <circle cx="24" cy="12" r="2" fill="currentColor"/>
      <circle cx="34" cy="24" r="2" fill="currentColor"/>
    </svg>
  ),
  smartphone: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="2" width="24" height="44" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="16" y="8" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M16 20h16" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <circle cx="24" cy="36" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M20 36.5h8" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2z" fill="currentColor" opacity="0.3"/>
      <path d="M12 28c0-8 4-14 12-14s12 6 12 14v8l3 3v1H9v-1l3-3v-8z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <path d="M18 32h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M24 39a3 3 0 0 1-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M16 24l6 6 10-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4l3 10 10 3-10 3-3 10-3-10-10-3 10-3 3-10z" fill="currentColor" opacity="0.8"/>
      <path d="M40 28l1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5 1.5-5z" fill="currentColor" opacity="0.5"/>
      <path d="M10 34l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M20 16l12 8-12 8V16z" fill="currentColor"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4l5.5 11.5L41 17l-9 8.5 2.5 12L24 31.5 13.5 37.5 16 25.5 7 17l11.5-1.5L24 4z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    </svg>
  ),
  gift: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="22" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M8 22h32v4H8z" fill="currentColor" opacity="0.15"/>
      <path d="M24 22V12" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 12a6 6 0 0 1 6-6c4 0 6 4 6 4s2-4 6-4a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M12 30h24" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    </svg>
  ),
  arrow_right: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  minus: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  x_circle: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

const STAGGER = 0.06

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 8 + 2 + 'px',
            height: Math.random() * 8 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            background: `radial-gradient(circle, rgba(20,116,116,${Math.random() * 0.2 + 0.04}), transparent)`,
          }}
          animate={{
            y: [0, -40, 0, -20, 0],
            x: [0, 20, -10, 10, 0],
            opacity: [0.2, 0.6, 0.3, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 10,
          }}
        />
      ))}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-brand-200/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-200/10 blur-[100px]" />
    </div>
  )
}

function SmoothLink({ href, children, className }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      {children}
    </a>
  )
}

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const ids = ['features', 'how-it-works', 'testimonials']
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id)
      })
    }, { rootMargin: '-40% 0px -55% 0px' })
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
  return active
}

function SectionHeading({ label, title, desc, light }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={`text-center mb-14 ${light ? 'text-white' : ''}`}
    >
      <span className={`inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full border ${
        light ? 'text-white/80 border-white/20 bg-white/5' : 'text-brand-600 border-brand-200 bg-brand-50'
      }`}>
        {label}
      </span>
      <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-balance mb-4 ${
        light ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h2>
      {desc && (
        <p className={`text-base sm:text-lg max-w-2xl mx-auto text-balance ${
          light ? 'text-white/60' : 'text-gray-500'
        }`}>
          {desc}
        </p>
      )}
    </motion.div>
  )
}

function GlassCard({ children, className, hover = true }) {
  return (
    <div className={`glass rounded-3xl ${hover ? 'hover:shadow-glass-lg hover:-translate-y-0.5' : ''} transition-all duration-500 ${className || ''}`}>
      {children}
    </div>
  )
}

function Icon({ name, className }) {
  return <span className={className}>{svgs[name]}</span>
}

const images = {
  hero: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920',
  roomService: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
  reception: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800',
  guest: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
  qrAction: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=800',
}

const testimonials = [
  {
    name: 'Mateo Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150',
    hotel: 'Hotel Paraíso del Mar',
    flag: '🇲🇽',
    rating: 5,
    quote: 'Nesti transformó la experiencia de nuestros huéspedes. Ahora todo lo solicitan desde el QR sin pasar por recepción.',
  },
  {
    name: 'Carla López',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&h=150',
    hotel: 'Lodge Bosque Nublado',
    flag: '🇨🇷',
    rating: 5,
    quote: 'Implementarlo fue increíblemente fácil. En 30 minutos ya estábamos funcionando. Nuestros huéspedes aman la comodidad.',
  },
  {
    name: 'Andrés Valencia',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=150&h=150',
    hotel: 'Hotel Boutique Central',
    flag: '🇪🇨',
    rating: 5,
    quote: 'El panel de recepción en tiempo real nos permite gestionar el servicio mucho más rápido. Recomendado al 100%.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: '¿Necesitan los huéspedes descargar una app?', a: 'No. Nesti funciona directamente en el navegador de cualquier smartphone al escanear el código QR. Sin descargas, sin registros, sin fricción.' },
    { q: '¿Cuánto tiempo toma configurar un hotel?', a: 'Literalmente minutos. Solo necesitas registrar tus habitaciones y servicios básicos para empezar a operar. Los códigos QR se generan automáticamente.' },
    { q: '¿Es realmente gratis de por vida?', a: 'Sí. Todos los hoteles que se unan durante nuestra fase beta obtendrán una licencia vitalicia gratuita como agradecimiento por ayudarnos a mejorar el producto.' },
    { q: '¿Cómo recibe el personal las notificaciones?', a: 'El panel de recepción funciona en tiempo real en cualquier dispositivo (tablet, PC o móvil). Cada nueva solicitud genera una alerta visual y sonora inmediata.' },
    { q: '¿Puedo personalizar los servicios que ofrezco?', a: 'Totalmente. Puedes crear categorías personalizadas, añadir fotos, precios y descripciones para que el portal se adapte perfectamente a tu hotel.' },
  ]

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <SectionHeading 
          label="FAQ" 
          title="Preguntas frecuentes" 
          desc="Todo lo que necesitas saber para empezar con Nesti."
        />
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-gray-100 rounded-3xl overflow-hidden"
            >
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between bg-white hover:bg-surface-1 transition-colors text-left"
              >
                <span className="font-semibold text-gray-900">{f.q}</span>
                <Icon name={open === i ? 'minus' : 'plus'} className={`w-5 h-5 ${open === i ? 'text-brand-600' : 'text-gray-400'}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-gray-500 text-sm leading-relaxed">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  const { user } = useAuth()
  const activeSection = useActiveSection()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3])

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-0 via-brand-50/20 to-surface-2 relative">
      <Particles />

      {/* ===== NAVIGATION ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-surface-3/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path d="M12 2L2 10h4v10h12V10h4L12 2z" fill="currentColor"/>
                <rect x="9" y="12" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
              </svg>
            </div>
            <span className="font-display font-semibold text-lg bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
              Nesti
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-8">
            {[
              { href: '#features', label: 'Funcionalidades' },
              { href: '#how-it-works', label: 'Cómo funciona' },
              { href: '#testimonials', label: 'Testimonios' },
            ].map((l) => (
              <SmoothLink key={l.href} href={l.href}
                className={`relative text-sm transition-colors ${
                  activeSection === l.href.slice(1)
                    ? 'text-brand-600 font-semibold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}>
                {l.label}
                {activeSection === l.href.slice(1) && (
                  <motion.span layoutId="nav-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-600" />
                )}
              </SmoothLink>
            ))}
            <a href="/affiliate" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Afiliados</a>
            {user ? (
              <a href="/admin" className="text-sm font-semibold px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all">
                Panel
              </a>
            ) : (
              <a href="/login" className="text-sm font-semibold px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all">
                Acceder
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-900/90 to-gray-900/95 z-0" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay z-0" 
          style={{ backgroundImage: `url(${images.hero})` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,116,116,0.4),transparent_70%),radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.2),transparent_60%)] z-0" />
        <div className="absolute inset-0 backdrop-blur-[2px] z-0" />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left max-w-2xl" style={{ y: heroY, opacity: heroOpacity }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white tracking-widest uppercase">Intelligent Guest Experience</span>
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-8"
              >
                Tu hotel en la palma de 
                <span className="block bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200 bg-clip-text text-transparent italic">
                  su mano
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-lg sm:text-xl text-white/70 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-12"
              >
                Sin descargas ni registros. Un ecosistema digital completo que conecta a tus huéspedes con todos tus servicios mediante un simple escaneo QR.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start"
              >
                {user ? (
                  <a href="/admin" className="group px-10 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 transition-all shadow-2xl shadow-brand-500/30 hover:-translate-y-1 flex items-center gap-3">
                    Acceder al Panel
                    <Icon name="arrow_right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <>
                    <a href="/beta-register" className="group px-10 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all shadow-2xl shadow-amber-500/30 hover:-translate-y-1 flex items-center gap-3">
                      Empezar Gratis
                      <Icon name="arrow_right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <SmoothLink href="#features" className="px-10 py-4 rounded-2xl text-base font-semibold text-white border border-white/30 hover:bg-white/10 transition-all backdrop-blur-md">
                      Explorar
                    </SmoothLink>
                  </>
                )}
              </motion.div>
            </div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 max-w-sm lg:max-w-none flex justify-center relative"
            >
              <div className="absolute inset-0 bg-brand-400/20 blur-[120px] rounded-full" />
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
                className="relative z-10"
              >
                <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-[8px] border-gray-800">
                  <div className="bg-white rounded-[2.2rem] overflow-hidden w-[280px] h-[580px] relative flex flex-col">
                    {/* Phone Header */}
                    <div className="h-6 bg-gray-900 w-1/3 mx-auto rounded-b-2xl mb-4" />
                    
                    <div className="px-5 pt-2 pb-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">N</div>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                        </div>
                      </div>
                      
                      <h4 className="font-display font-bold text-xl text-gray-900 mb-1">¡Hola, Maria! 👋</h4>
                      <p className="text-xs text-gray-400 mb-6">Habitación 402 • Gran Plaza Hotel</p>
                      
                      <div className="space-y-3 mb-8">
                        {[
                          { l: 'Room Service', i: '🍽️', c: 'bg-orange-50 text-orange-600' },
                          { l: 'Limpieza', i: '✨', c: 'bg-blue-50 text-blue-600' },
                          { l: 'Spa & Wellness', i: '💆‍♀️', c: 'bg-emerald-50 text-emerald-600' },
                        ].map(item => (
                          <div key={item.l} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.c}`}>{item.i}</span>
                            <span className="text-sm font-semibold text-gray-700">{item.l}</span>
                            <div className="ml-auto w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Icon name="arrow_right" className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-brand-600 rounded-3xl p-5 text-white shadow-lg shadow-brand-600/30">
                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">Tu Asistente</p>
                        <p className="text-sm font-bold mb-4">¿Necesitas algo más?</p>
                        <button className="w-full py-2 bg-white text-brand-600 rounded-xl text-xs font-bold shadow-sm">
                          Chatear con Recepción
                        </button>
                      </div>
                    </div>
                    
                    {/* Bottom Bar */}
                    <div className="mt-auto h-16 border-t border-gray-100 flex items-center justify-around px-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/30 tracking-widest uppercase font-medium">Descubre</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-1.5 rounded-full bg-white/40"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== TRUSTED BY ===== */}
      <section className="relative z-10 py-12 border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-10">
            Impulsando la transformación digital en
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {['Marriott', 'Hilton', 'Sheraton', 'Hyatt', 'Ibis'].map(brand => (
              <span key={brand} className="font-display text-xl md:text-2xl font-black text-gray-900 tracking-tighter cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARISON SECTION ===== */}
      <section className="relative z-10 py-32 px-6 bg-surface-1">
        <div className="max-w-5xl mx-auto">
          <SectionHeading 
            label="El Cambio" 
            title="¿Por qué elegir Nesti?" 
            desc="Comparamos la experiencia tradicional con la nueva era digital."
          />
          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm opacity-60 grayscale-[0.5]"
            >
              <h3 className="font-display text-xl font-bold text-gray-400 mb-8 flex items-center gap-3">
                <Icon name="x_circle" className="w-6 h-6" />
                Método Tradicional
              </h3>
              <ul className="space-y-6">
                {[
                  'Llamadas constantes a recepción',
                  'Esperas innecesarias para servicios simples',
                  'Menús impresos desactualizados o sucios',
                  'Falta de seguimiento en las solicitudes',
                  'Huéspedes con miedo a barreras lingüísticas',
                ].map(text => (
                  <li key={text} className="flex items-start gap-3 text-sm text-gray-400 line-through">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-2 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Nesti */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-[2.5rem] p-10 shadow-2xl shadow-brand-900/20 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="font-display text-xl font-bold text-emerald-400 mb-8 flex items-center gap-3 relative z-10">
                <Icon name="check" className="w-6 h-6" />
                Con Nesti
              </h3>
              <ul className="space-y-6 relative z-10">
                {[
                  'Autogestión total desde el smartphone',
                  'Pedidos en 2 clics, confirmación instantánea',
                  'Menú digital interactivo siempre al día',
                  'Seguimiento en tiempo real del estado',
                  'Interfaz multi-idioma automática',
                ].map(text => (
                  <li key={text} className="flex items-start gap-4 text-sm text-white/90 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                      <Icon name="check" className="w-3 h-3 text-emerald-400" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 relative z-10">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Resultado</p>
                <p className="text-2xl font-display font-bold">+45% de satisfacción del cliente</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative z-10 -mt-16 mb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-6 sm:p-8 shadow-glass-lg border border-white/60 grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {[
              { value: '30 seg', label: 'en configurar tu hotel' },
              { value: '100%', label: 'sin instalación para huéspedes' },
              { value: '24/7', label: 'disponible cualquier dispositivo' },
              { value: '0$', label: 'beta — gratis de por vida' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent mb-1">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES BENTO GRID ===== */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto relative">
          <SectionHeading
            label="Ecosistema"
            title="Diseñado para la excelencia"
            desc="Una suite de herramientas integradas que modernizan cada interacción entre tu hotel y el huésped."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Feature - QR Portal */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="md:col-span-2 relative group overflow-hidden glass rounded-4xl p-10 border border-white/60 bg-gradient-to-br from-brand-50 to-white"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mb-8 shadow-lg shadow-brand-600/20">
                  <Icon name="qr" className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-3xl font-bold text-gray-900 mb-4">Portal del Huésped vía QR</h3>
                <p className="text-gray-500 text-lg leading-relaxed max-w-md mb-8">
                  Sin fricción. Sin apps. Tus huéspedes acceden instantáneamente a servicios, menús y asistencia con un simple escaneo desde su propio móvil.
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <span className="px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-bold">Mobile First</span>
                  <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">Zero Friction</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <img src={images.qrAction} alt="QR Scan" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />
            </motion.div>

            {/* Reception Panel */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative group overflow-hidden glass rounded-4xl p-10 border border-white/60 bg-white"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mb-8 shadow-lg shadow-amber-500/20">
                  <Icon name="reception" className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">Panel de Recepción</h3>
                <p className="text-gray-500 leading-relaxed">
                  Gestión centralizada en tiempo real. Responde a solicitudes en segundos y mejora la eficiencia operativa.
                </p>
              </div>
              <div className="mt-8 h-40 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${images.reception})` }} />
              </div>
            </motion.div>

            {/* Room Service / Services */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative group overflow-hidden glass rounded-4xl p-10 border border-white/60 bg-white"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mb-8 shadow-lg shadow-brand-600/20">
                  <Icon name="service" className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">Servicios Ilimitados</h3>
                <p className="text-gray-500 leading-relaxed">
                  Desde gastronomía hasta spa. Configura todo tu catálogo y permite pedidos instantáneos.
                </p>
              </div>
              <div className="mt-8 h-40 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${images.roomService})` }} />
              </div>
            </motion.div>

            {/* Analytics & Reports */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="md:col-span-2 relative group overflow-hidden glass rounded-4xl p-10 border border-white/60 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
            >
              <div className="relative z-10 flex flex-col md:flex-row gap-10 h-full">
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20">
                    <Icon name="analytics" className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-3xl font-bold mb-4">Analytics Avanzado</h3>
                  <p className="text-white/60 text-lg leading-relaxed">
                    Entiende el comportamiento de tus huéspedes. Identifica servicios populares, horas pico y cuellos de botella antes de que ocurran.
                  </p>
                </div>
                <div className="flex-1 flex items-end justify-center pt-8">
                  <div className="flex items-end gap-2 w-full h-32">
                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className="flex-1 bg-brand-400 rounded-t-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="relative z-10 py-32 px-6 bg-surface-1">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Confianza"
            title="Lo que dicen nuestros aliados"
            desc="Hoteles que ya están transformando su operación con Nesti."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.hotel}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i * 0.12}
                className="glass rounded-4xl p-8 hover:shadow-float transition-all duration-500 border border-white relative group"
              >
                <div className="absolute top-8 right-8 text-brand-100 group-hover:text-brand-200 transition-colors">
                  <svg width="40" height="30" viewBox="0 0 40 30" fill="currentColor">
                    <path d="M0 18.5C0 8.2 8.3 0 18.5 0v6.2c-6.8 0-12.3 5.5-12.3 12.3h12.3v11.5H0V18.5zm21.5 0C21.5 8.2 29.8 0 40 0v6.2c-6.8 0-12.3 5.5-12.3 12.3H40v11.5H21.5V18.5z"/>
                  </svg>
                </div>
                
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400">
                      <path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.7.9 5.24L10 13.2l-4.7 2.44.9-5.24-3.8-3.7 5.21-.86L10 1z"/>
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed text-lg mb-8 italic relative z-10">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      {t.hotel} <span>{t.flag}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Cómo funciona"
            title="De cero a funcionando en minutos"
            desc="Configura tu hotel, imprime los QR codes, y tus huéspedes empiezan a disfrutar al instante."
          />
          <div className="grid sm:grid-cols-3 gap-10 relative">
            <div className="hidden sm:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent" />
            {[
              { step: '01', icon: 'sparkle', title: 'Configura tu hotel', desc: 'Añade habitaciones, personaliza servicios, y define la información de tu hotel en el panel de administración.' },
              { step: '02', icon: 'qr', title: 'Genera los QR codes', desc: 'Imprime los códigos QR únicos para cada habitación y colócalos en lugares visibles.' },
              { step: '03', icon: 'check', title: 'Tus huéspedes disfrutan', desc: 'Al escanear el QR acceden al portal de servicios. Solicitudes en tiempo real, sin fricción.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i * 0.15}
                className="text-center relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: -5 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/30 transition-all duration-300"
                >
                  <Icon name={s.icon} className="w-9 h-9 text-white" />
                </motion.div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-brand-400/20 blur-xl group-hover:blur-2xl transition-all" />
                <p className="text-sm font-mono font-bold text-brand-400 mb-3">{s.step}</p>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BETA CTA ===== */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="glass rounded-4xl p-8 sm:p-10 shadow-glass-lg border border-amber-100/80 relative overflow-hidden bg-gradient-to-br from-white to-amber-50/30"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-100/20 rounded-full blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-sm">
                <Icon name="gift" className="w-8 h-8 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-1">
                  Acceso gratuito de por vida
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed text-balance">
                  Todos los que se registren durante la beta cerrada obtendrán una licencia <strong className="text-brand-600">gratuita de por vida</strong> para su hotel. Sin cargos, sin sorpresas.
                </p>
              </div>
              {!user && (
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="/beta-register"
                  className="shrink-0 px-7 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
                >
                  Reclamar acceso
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-md mx-auto">
          <SectionHeading
            label="Precios"
            title="Sin costo durante la beta"
          />
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="glass rounded-4xl p-8 sm:p-10 shadow-float border border-brand-100/80 relative overflow-hidden bg-gradient-to-br from-white to-brand-50/30"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100/20 rounded-full blur-3xl" />
            <div className="relative text-center">
              <p className="text-lg text-gray-400 line-through font-medium mb-1">$49 / mes</p>
              <p className="font-display text-5xl sm:text-6xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent mb-2">GRATIS</p>
              <p className="text-sm text-gray-500 mb-8">durante la beta — licencia de por vida incluida</p>
              <ul className="text-left space-y-4 mb-10 max-w-xs mx-auto">
                {[
                  'Portal del huésped vía QR',
                  'Panel de recepción en tiempo real',
                  'Catálogo de servicios ilimitado',
                  'Analytics e informes de ocupación',
                  'Soporte técnico prioritario',
                ].map((f) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-brand-600">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                      </svg>
                    </span>
                    {f}
                  </motion.li>
                ))}
              </ul>
              {!user && (
                <motion.a
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="/beta-register"
                  className="inline-flex w-full justify-center px-8 py-3.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 transition-all shadow-lg shadow-brand-600/20"
                >
                  Reclamar acceso gratuito
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== AFFILIATES ===== */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            label="Afiliados"
            title="Gana mientras ayudas a hoteles"
            desc="Refiere hoteles a Nesti y recibe el 30% recurrente de cada pago mensual. Sin límites, sin topes."
          />
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {[
              { icon: 'sparkle', value: '30%', label: 'comisión recurrente', gradient: 'from-brand-50 to-brand-100/50' },
              { icon: 'star', value: '$14.70', label: 'por hotel activo / mes', gradient: 'from-amber-50 to-amber-100/50' },
              { icon: 'gift', value: 'De por vida', label: 'mientras el hotel pague', gradient: 'from-emerald-50 to-emerald-100/50' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i * 0.1}
                whileHover={{ y: -4 }}
                className={`glass rounded-3xl p-7 text-center hover:shadow-glass-lg transition-all duration-500 border border-white/60 bg-gradient-to-br ${s.gradient}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 border border-brand-200/50 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Icon name={s.icon} className="w-6 h-6 text-brand-600" />
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="/affiliate"
              className="inline-flex px-8 py-3.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
            >
              Quiero ser afiliado
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <FAQ />

      {/* ===== FINAL CTA ===== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="glass rounded-4xl p-10 sm:p-14 shadow-float relative overflow-hidden border border-white/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-white to-amber-50/30" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-brand-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon name="sparkle" className="w-14 h-14 text-brand-400 block mx-auto mb-6" />
              </motion.div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 mb-4 text-balance">
                ¿Listo para transformar la experiencia de tus huéspedes?
              </h2>
              <p className="text-gray-500 mb-4 max-w-lg mx-auto text-balance text-lg">
                Configura tu hotel en minutos y ofrece un servicio digital moderno y eficiente.
              </p>
              <p className="text-sm text-amber-600 font-semibold mb-10">
                Recuerda: durante la beta el acceso es gratuito de por vida.
              </p>
              {user ? (
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="/admin"
                  className="inline-flex px-10 py-4 rounded-2xl text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 transition-all shadow-xl shadow-brand-500/20"
                >
                  Ir al panel de administración
                </motion.a>
              ) : (
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="/beta-register"
                  className="inline-flex px-10 py-4 rounded-2xl text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 transition-all shadow-xl shadow-brand-500/20"
                >
                  Comenzar ahora
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-gray-100 bg-white pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <a href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
                    <path d="M12 2L2 10h4v10h12V10h4L12 2z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="font-display font-bold text-xl text-gray-900">Nesti</span>
              </a>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
                Revolucionando la hospitalidad a través de tecnología invisible que potencia la conexión humana.
              </p>
              <div className="flex gap-4">
                {['twitter', 'instagram', 'linkedin'].map(social => (
                  <div key={social} className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-all cursor-pointer">
                    <span className="text-xs font-bold uppercase tracking-tighter">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-widest">Producto</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-brand-600 transition-colors">Funcionalidades</a></li>
                <li><a href="#how-it-works" className="hover:text-brand-600 transition-colors">Cómo funciona</a></li>
                <li><a href="/pricing" className="hover:text-brand-600 transition-colors">Precios</a></li>
                <li><a href="/beta" className="hover:text-brand-600 transition-colors">Beta Cerrada</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-widest">Compañía</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="/about" className="hover:text-brand-600 transition-colors">Sobre nosotros</a></li>
                <li><a href="/blog" className="hover:text-brand-600 transition-colors">Blog</a></li>
                <li><a href="/affiliate" className="hover:text-brand-600 transition-colors">Afiliados</a></li>
                <li><a href="mailto:hola@nesti.app" className="hover:text-brand-600 transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="/privacy" className="hover:text-brand-600 transition-colors">Privacidad</a></li>
                <li><a href="/terms" className="hover:text-brand-600 transition-colors">Términos</a></li>
                <li><a href="/cookies" className="hover:text-brand-600 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-gray-400">
              © 2026 Nesti · Hecho con ❤️ para la hotelería moderna.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Sistemas Operativos
              </span>
              <p className="text-xs text-gray-300">
                Desarrollado por <a href="https://verticedigital.ec" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-brand-600 transition-colors font-bold">Vértice Digital</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
