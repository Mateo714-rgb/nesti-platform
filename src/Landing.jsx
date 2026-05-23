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
  )
}

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            background: `rgba(20, 116, 116, ${Math.random() * 0.15 + 0.03})`,
            animation: `floatParticle ${Math.random() * 20 + 15}s ease-in-out infinite`,
            animationDelay: Math.random() * 10 + 's',
            opacity: Math.random() * 0.5 + 0.1
          }}
        />
      ))}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(15px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-40px) translateX(20px); }
        }
      `}</style>
    </div>
  )
}

function FadeIn({ children, delay, className }) {
  return (
    <div
      className={className}
      style={{
        animation: `fade-up 0.6s ease both`,
        animationDelay: (delay || 0) + 's'
      }}
    >
      {children}
    </div>
  )
}

function Icon({ name, className }) {
  return (
    <span className={className}>
      {svgs[name]}
    </span>
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

function BetaBanner() {
  return (
    <div className="relative z-10 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="relative max-w-6xl mx-auto px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <div className="flex items-center gap-2">
          <Icon name="gift" className="w-5 h-5 text-white/90" />
          <span className="text-sm sm:text-base font-semibold text-white">
            Acceso Anticipado — Beta Cerrada
          </span>
        </div>
        <span className="text-white/80 text-xs sm:text-sm leading-relaxed">
          Registrate durante la beta y obten acceso <strong className="text-white">GRATIS de por vida</strong> para tu hotel.
        </span>
      </div>
    </div>
  )
}

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-0 via-brand-50/30 to-surface-2 relative">
      <Particles />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-surface-3">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                <path d="M12 2L2 10h4v10h12V10h4L12 2z" fill="currentColor"/>
                <rect x="9" y="12" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
              </svg>
            </div>
            <span className="font-display font-semibold text-gray-900">Nesti</span>
          </a>
          <div className="hidden sm:flex items-center gap-8">
            <SmoothLink href="#video" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Video</SmoothLink>
            <SmoothLink href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Funcionalidades</SmoothLink>
            <SmoothLink href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Como funciona</SmoothLink>
            <a href="/affiliate" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Afiliados</a>
            {user ? (
              <a href="/admin" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">Panel</a>
            ) : (
              <a href="/login" className="text-sm font-semibold bg-brand-600 text-white px-4 py-1.5 rounded-xl hover:bg-brand-700 transition-all">Acceder</a>
            )}
          </div>
        </div>
      </nav>

      {/* Beta Banner */}
      <BetaBanner />

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" />
                <span className="text-xs font-medium text-brand-700 tracking-wide">Guest Experience Platform</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight text-balance mb-4">
                La experiencia del huesped,{' '}
                <span className="text-brand-600">redefinida</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8 text-balance">
                Asistente digital inteligente para hoteles. Tus huespedes acceden a todos los servicios del hotel desde su habitacion con solo escanear un codigo QR.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                {user ? (
                  <>
                    <a href="/admin" className="px-6 py-3 rounded-2xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20">
                      Ir al panel
                    </a>
                    <a href="/reception" className="px-6 py-3 rounded-2xl text-sm font-medium bg-surface-2 text-gray-600 hover:bg-surface-3 transition-all">
                      Recepcion
                    </a>
                  </>
                ) : (
                  <>
                    <a href="/login" className="px-6 py-3 rounded-2xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 hover:-translate-y-0.5 active:translate-y-0">
                      Acceder al panel
                    </a>
                    <SmoothLink href="#video" className="px-6 py-3 rounded-2xl text-sm font-medium bg-surface-2 text-gray-600 hover:bg-surface-3 transition-all flex items-center gap-2">
                      <Icon name="play" className="w-4 h-4" />
                      Ver video
                    </SmoothLink>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
          <div className="flex-1 max-w-md lg:max-w-none">
            <FadeIn delay={0.3}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-200/40 to-brand-400/10 rounded-4xl blur-3xl transition-all duration-700 group-hover:scale-110" />
                <div className="relative glass rounded-4xl p-6 sm:p-8 shadow-float transition-all duration-500 group-hover:shadow-float group-hover:-translate-y-1">
                  <div className="bg-surface-0 rounded-3xl p-6 sm:p-8 border border-surface-3">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                          <path d="M12 2L2 10h4v10h12V10h4L12 2z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Habitacion 204</p>
                        <p className="text-xs text-gray-400">Bienvenido, Maria</p>
                      </div>
                      <div className="ml-auto flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="w-2 h-2 rounded-full bg-amber-300" />
                        <span className="w-2 h-2 rounded-full bg-red-300" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {['Limpieza', 'Room Service', 'Toallas', 'Desayuno'].map((item) => (
                        <div key={item} className="rounded-2xl bg-brand-50 border border-brand-100 px-4 py-3 text-center hover:bg-brand-100 transition-colors">
                          <p className="text-xs font-medium text-brand-700">{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl bg-brand-600 p-4 flex items-center justify-between transition-all hover:bg-brand-700">
                      <div>
                        <p className="text-xs text-white/70">Solicitar ahora</p>
                        <p className="text-sm font-semibold text-white">Asistencia en habitacion</p>
                      </div>
                      <Icon name="bell" className="text-white/80 w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn delay={0.1}>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold text-brand-600 tracking-widest uppercase mb-3">Video</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 text-balance mb-3">
                Mira como funciona Nesti
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto text-balance">
                Un recorrido completo por la plataforma: desde la llegada del huesped hasta la gestion en recepcion.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-200/30 rounded-4xl blur-2xl transition-all duration-500 group-hover:scale-105" />
              <div className="relative glass rounded-3xl p-2 sm:p-3 shadow-glass-lg overflow-hidden">
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900">
                  <iframe
                    src="https://www.youtube.com/embed/d1UM0bwigLI?rel=0"
                    title="Nesti - Guest Experience Platform"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Beta CTA */}
      <section className="relative z-10 -mt-4 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn delay={0.1}>
            <div className="glass rounded-4xl p-8 sm:p-10 shadow-glass-lg border border-brand-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-100/40 rounded-full blur-3xl" />
              <div className="relative flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Icon name="gift" className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">
                    Acceso gratuito de por vida
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed text-balance">
                    Todos los que se registren durante la beta cerrada obtendran una licencia <strong className="text-brand-600">gratuita de por vida</strong> para su hotel. Sin cargos, sin sorpresas.
                  </p>
                </div>
                {!user && (
                  <a href="/beta-register" className="shrink-0 px-6 py-3 rounded-2xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5">
                    Reclamar acceso
                  </a>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0.1}>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-brand-600 tracking-widest uppercase mb-3">Funcionalidades</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 text-balance mb-3">
                Todo lo que tu hotel necesita
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto text-balance">
                Una plataforma completa para gestionar la experiencia de tus huespedes desde el check-in hasta el check-out.
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: 'hotel',
                title: 'Portal del huesped',
                desc: 'Cada habitacion tiene su propio portal accesible via QR. Los huespedes solicitan servicios al instante.'
              },
              {
                icon: 'reception',
                title: 'Panel de recepcion',
                desc: 'Gestiona solicitudes en tiempo real. Asigna personal, actualiza estados y recibe notificaciones al instante.'
              },
              {
                icon: 'analytics',
                title: 'Analytics e informes',
                desc: 'Visualiza metricas clave, servicios mas solicitados, horas pico y tendencias de ocupacion.'
              },
              {
                icon: 'service',
                title: 'Catalogo de servicios',
                desc: 'Configura servicios ilimitados por categoria: limpieza, alimentos, logistica y mas.'
              },
              {
                icon: 'qr',
                title: 'Codigos QR unicos',
                desc: 'Genera codigos QR personalizados para cada habitacion. Listos para imprimir y colocar.'
              },
              {
                icon: 'smartphone',
                title: 'Sin instalacion',
                desc: 'Experiencia mobile-first que funciona desde el navegador. Sin descargas ni configuraciones.'
              }
            ].map((f, i) => (
              <FadeIn key={f.title} delay={0.1 + i * 0.05}>
                <div className="glass rounded-3xl p-6 hover:shadow-glass-lg transition-all duration-300 group hover:-translate-y-0.5">
                  <Icon name={f.icon} className="w-10 h-10 text-brand-500 block mb-4 group-hover:text-brand-600 transition-colors group-hover:scale-110 transition-transform" />
                  <h3 className="font-display font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0.1}>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-brand-600 tracking-widest uppercase mb-3">Como funciona</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 text-balance mb-3">
                De cero a funcionando en minutos
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto text-balance">
                Configura tu hotel, imprime los QR codes, y tus huespedes empiezan a disfrutar al instante.
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-12 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />
            {[
              { step: '01', icon: 'sparkle', title: 'Configura tu hotel', desc: 'Anade habitaciones, personaliza servicios, y define la informacion de tu hotel en el panel de administracion.' },
              { step: '02', icon: 'qr', title: 'Genera los QR codes', desc: 'Imprime los codigos QR unicos para cada habitacion y colocarlos en lugares visibles.' },
              { step: '03', icon: 'check', title: 'Tus huespedes disfrutan', desc: 'Al escanear el QR acceden al portal de servicios. Solicitudes en tiempo real, sin friccion.' }
            ].map((s, i) => (
              <FadeIn key={s.step} delay={0.2 + i * 0.1}>
                <div className="text-center relative group">
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-5 relative z-10 group-hover:bg-brand-100 group-hover:border-brand-200 transition-all group-hover:scale-110 duration-300">
                    <Icon name={s.icon} className="w-8 h-8 text-brand-500" />
                  </div>
                  <p className="text-xs font-mono font-semibold text-brand-400 mb-2">{s.step}</p>
                  <h3 className="font-display font-semibold text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-5">
            {[
              { value: '30 seg', label: 'en configurar tu hotel', icon: 'sparkle' },
              { value: '100%', label: 'sin instalacion para huespedes', icon: 'smartphone' },
              { value: '24/7', label: 'disponible desde cualquier dispositivo', icon: 'bell' },
              { value: '0$', label: 'durante la beta. Gratis de por vida', icon: 'gift' }
            ].map((s, i) => (
              <FadeIn key={s.label} delay={0.1 + i * 0.08}>
                <div className="glass rounded-3xl p-5 text-center hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-0.5">
                  <p className="font-display text-2xl sm:text-3xl font-bold text-brand-600 mb-1">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn delay={0.1}>
            <div className="glass rounded-4xl p-10 sm:p-14 shadow-float relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <Icon name="sparkle" className="w-12 h-12 text-brand-400 block mx-auto mb-5" />
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 text-balance">
                  Listo para transformar la experiencia de tus huespedes?
                </h2>
                <p className="text-gray-500 mb-4 max-w-md mx-auto text-balance">
                  Configura tu hotel en minutos y ofrece un servicio digital moderno y eficiente.
                </p>
                <p className="text-xs text-amber-600 font-semibold mb-8">
                  Recuerda: durante la beta el acceso es gratuito de por vida.
                </p>
                {user ? (
                  <a href="/admin" className="inline-flex px-8 py-3.5 rounded-2xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 hover:-translate-y-0.5">
                    Ir al panel de administracion
                  </a>
                ) : (
                  <a href="/beta-register" className="inline-flex px-8 py-3.5 rounded-2xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 hover:-translate-y-0.5">
                    Comenzar ahora
                  </a>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-surface-3 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white">
                <path d="M12 2L2 10h4v10h12V10h4L12 2z" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-display text-sm font-semibold text-gray-700">Nesti</span>
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
