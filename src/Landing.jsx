import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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

const testimonials = [
  {
    initials: 'MR',
    hotel: 'Hotel Paraíso del Mar',
    flag: '🇲🇽',
    rating: 5,
    quote: 'Nesti transformó la experiencia de nuestros huéspedes. Ahora todo lo solicitan desde el QR sin pasar por recepción.',
  },
  {
    initials: 'CL',
    hotel: 'Lodge Bosque Nublado',
    flag: '🇨🇷',
    rating: 5,
    quote: 'Implementarlo fue increíblemente fácil. En 30 minutos ya estábamos funcionando. Nuestros huéspedes aman la comodidad.',
  },
  {
    initials: 'AV',
    hotel: 'Hotel Boutique Central',
    flag: '🇪🇨',
    rating: 5,
    quote: 'El panel de recepción en tiempo real nos permite gestionar el servicio mucho más rápido. Recomendado al 100%.',
  },
]

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
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-brand-800/85 to-gray-900/90 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,116,116,0.3),transparent_70%),radial-gradient(ellipse_at_bottom_left,_rgba(245,158,11,0.15),transparent_60%)] z-0" />
        <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-20 z-0" />
        <div className="absolute inset-0 backdrop-blur-[3px] z-0" />

        {/* Floating decorative shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-brand-400/10 blur-[60px]"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-amber-400/10 blur-[80px]"
        />
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-brand-300/40"
        />
        <motion.div
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-300/40"
        />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left max-w-xl" style={{ y: heroY, opacity: heroOpacity }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                  <span className="text-xs font-medium text-white/90 tracking-wide">Guest Experience Platform</span>
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] text-balance mb-6"
              >
                La experiencia del huésped,
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                  redefinida
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-base sm:text-lg text-white/60 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10 text-balance"
              >
                Asistente digital inteligente para hoteles. Tus huéspedes acceden a todos los servicios desde su habitación con solo escanear un código QR.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                {user ? (
                  <>
                    <a href="/admin" className="group px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 transition-all shadow-xl shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-0.5 flex items-center gap-2">
                      Ir al panel
                      <Icon name="arrow_right" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <a href="/reception" className="px-8 py-3.5 rounded-2xl text-sm font-medium text-white/80 border border-white/20 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm">
                      Recepción
                    </a>
                  </>
                ) : (
                  <>
                    <a href="/beta-register" className="group px-8 py-3.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2">
                      Comenzar ahora
                      <Icon name="arrow_right" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <SmoothLink href="#features" className="px-8 py-3.5 rounded-2xl text-sm font-medium text-white/80 border border-white/20 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm flex items-center gap-2">
                      <Icon name="play" className="w-4 h-4" />
                      Ver más
                    </SmoothLink>
                  </>
                )}
              </motion.div>
            </div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 max-w-sm lg:max-w-none flex justify-center"
            >
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-[32px] blur-[80px] scale-110 bg-gradient-to-b from-brand-400/30 via-brand-500/20 to-amber-400/20" />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative bg-white/95 backdrop-blur-2xl rounded-[24px] p-6 sm:p-7 shadow-2xl border border-white/40"
                    style={{ width: 320 }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                          <path d="M12 2L2 10h4v10h12V10h4L12 2z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Habitación 204</p>
                        <p className="text-xs text-gray-400">Bienvenida, María</p>
                      </div>
                      <div className="ml-auto flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                        <span className="w-2 h-2 rounded-full bg-amber-300 shadow-sm" />
                        <span className="w-2 h-2 rounded-full bg-red-300 shadow-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: 'Limpieza', icon: '🧹' },
                        { label: 'Room Service', icon: '🍽️' },
                        { label: 'Toallas', icon: '🧴' },
                        { label: 'Desayuno', icon: '☕' },
                      ].map((item) => (
                        <motion.div
                          key={item.label}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="rounded-xl px-3.5 py-3 text-center cursor-pointer bg-gradient-to-b from-brand-50 to-white border border-brand-100 hover:border-brand-200 hover:shadow-md transition-all"
                        >
                          <span className="text-sm mb-1 block">{item.icon}</span>
                          <p className="text-[11px] font-medium text-brand-700">{item.label}</p>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="rounded-xl p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20"
                    >
                      <div>
                        <p className="text-xs text-white/70">Solicitar ahora</p>
                        <p className="text-sm font-semibold text-white">Asistencia en habitación</p>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Icon name="bell" className="text-white w-5 h-5" />
                      </div>
                    </motion.div>
                  </motion.div>
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

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Testimonios"
            title="Lo que dicen nuestros primeros usuarios"
            desc="Hoteles que ya están usando Nesti durante la beta."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.hotel}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i * 0.12}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="glass rounded-3xl p-7 hover:shadow-glass-lg transition-all duration-500 border border-white/60"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-sm font-semibold text-brand-700 shrink-0 shadow-sm">
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.hotel}</p>
                    <p className="text-xs text-gray-400">{t.flag}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <motion.svg
                      key={s}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + s * 0.05 }}
                      viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400"
                    >
                      <path d="M10 1l2.39 4.84L17.6 6.7l-3.8 3.7.9 5.24L10 13.2l-4.7 2.44.9-5.24-3.8-3.7 5.21-.86L10 1z"/>
                    </motion.svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-50/30 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <SectionHeading
            label="Funcionalidades"
            title="Todo lo que tu hotel necesita"
            desc="Una plataforma completa para gestionar la experiencia de tus huéspedes desde el check-in hasta el check-out."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: 'hotel', title: 'Portal del huésped',
                desc: 'Cada habitación tiene su propio portal accesible vía QR. Los huéspedes solicitan servicios al instante.',
                gradient: 'from-brand-50 to-brand-100/50',
              },
              {
                icon: 'reception', title: 'Panel de recepción',
                desc: 'Gestiona solicitudes en tiempo real. Asigna personal, actualiza estados y recibe notificaciones al instante.',
                gradient: 'from-brand-50 to-brand-100/50',
              },
              {
                icon: 'analytics', title: 'Analytics e informes',
                desc: 'Visualiza métricas clave, servicios más solicitados, horas pico y tendencias de ocupación.',
                gradient: 'from-amber-50 to-amber-100/50',
              },
              {
                icon: 'service', title: 'Catálogo de servicios',
                desc: 'Configura servicios ilimitados por categoría: limpieza, alimentos, logística y más.',
                gradient: 'from-brand-50 to-brand-100/50',
              },
              {
                icon: 'qr', title: 'Códigos QR únicos',
                desc: 'Genera códigos QR personalizados para cada habitación. Listos para imprimir y colocar.',
                gradient: 'from-brand-50 to-brand-100/50',
              },
              {
                icon: 'smartphone', title: 'Sin instalación',
                desc: 'Experiencia mobile-first que funciona desde el navegador. Sin descargas ni configuraciones.',
                gradient: 'from-amber-50 to-amber-100/50',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i * STAGGER}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`glass rounded-3xl p-7 hover:shadow-glass-lg transition-all duration-500 border border-white/60 bg-gradient-to-br ${f.gradient}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 border border-brand-200/50 flex items-center justify-center mb-5 shadow-sm">
                  <Icon name={f.icon} className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
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
      <footer className="relative z-10 border-t border-surface-3/80 bg-white/50 backdrop-blur-sm py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                <path d="M12 2L2 10h4v10h12V10h4L12 2z" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-display text-sm font-semibold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">Nesti</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            2026 Nesti — Guest Experience Platform. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-300 text-center">
            Desarrollado por <a href="https://verticedigital.ec" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600 transition-colors font-medium">Vértice Digital</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
