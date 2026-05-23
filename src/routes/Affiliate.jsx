import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

function genRefCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code
}

export default function Affiliate() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', payout_email: '' })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!user) { setChecking(false); return }
    supabase.from('affiliates').select('id').eq('user_id', user.id).maybeSingle().then(({ data }) => {
      if (data) navigate('/affiliate/dashboard', { replace: true })
      else setChecking(false)
    })
  }, [user])

  if (checking) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)

    if (!user) {
      const { error: signUpErr } = await supabase.auth.signUp({
        email: form.email,
        password: crypto.randomUUID().slice(0, 12) + 'Aa1!',
      })
      if (signUpErr) {
        setError(signUpErr.message === 'User already registered'
          ? 'Ya existe una cuenta con ese email. Inicia sesión primero.'
          : signUpErr.message
        )
        setSending(false)
        return
      }
    }

    const refCode = genRefCode()
    const email = user ? user.email : form.email
    const nombre = user ? (user.user_metadata?.nombre || form.nombre || user.email?.split('@')[0]) : form.nombre

    if (!nombre.trim()) {
      setError('El nombre es requerido.')
      setSending(false)
      return
    }

    const { error: insertErr } = await supabase.from('affiliates').insert({
      user_id: user?.id || null,
      nombre: nombre.trim(),
      email: email.trim(),
      ref_code: refCode,
      payout_email: form.payout_email.trim() || email.trim(),
    })

    if (insertErr) {
      setError(insertErr.code === '23505'
        ? 'Ya estás registrado como afiliado. Redirigiendo al dashboard...'
        : 'Error al registrarte. Intenta de nuevo.')
      setSending(false)
      return
    }

    setSuccess(true)
    setSending(false)
    setTimeout(() => navigate('/affiliate/dashboard', { replace: true }), 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-surface-2 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-emerald-500">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-gray-900 mb-2">Afiliado registrado</h2>
          <p className="text-sm text-gray-500">Redirigiendo a tu dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-surface-2">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-xs font-semibold text-brand-600 tracking-widest uppercase mb-3">Afiliados</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 text-balance mb-3">
            Gana comisiones recurrentes
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-balance">
            Refiere hoteles a Nesti y gana el <strong className="text-brand-600">30% recurrente</strong> de lo que paguen cada mes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            { value: '30%', label: 'comisión recurrente', desc: 'de cada pago mensual del hotel que refieras' },
            { value: '$14.70', label: 'por hotel/mes', desc: 'con un plan de $49/mes. Más hoteles = más ingresos' },
            { value: 'Sin límite', label: 'de hoteles', desc: 'refiere todos los que puedas, sin topes' },
            { value: 'De por vida', label: 'mientras el hotel pague', desc: 'comisiones activas mientras el cliente siga suscrito' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-3xl p-6 text-center hover:shadow-glass-lg transition-all">
              <p className="font-display text-2xl font-bold text-brand-600 mb-1">{s.value}</p>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">{s.label}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto">
          <div className="glass rounded-3xl p-8 shadow-float">
            <h2 className="font-display text-lg font-semibold text-gray-900 text-center mb-6">
              {user ? 'Completá tu registro' : 'Creá tu cuenta de afiliado'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {user ? (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
                  <input type="text" value={form.nombre} onChange={(e) => setForm(p => ({ ...p, nombre: e.target.value }))}
                    placeholder={user.email?.split('@')[0]}
                    className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nombre completo <span className="text-red-400">*</span></label>
                    <input type="text" value={form.nombre} onChange={(e) => setForm(p => ({ ...p, nombre: e.target.value }))} required
                      placeholder="Tu nombre"
                      className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email <span className="text-red-400">*</span></label>
                    <input type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email para pagos</label>
                <input type="email" value={form.payout_email} onChange={(e) => setForm(p => ({ ...p, payout_email: e.target.value }))}
                  placeholder={user?.email || 'micuenta@pago.com'}
                  className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300" />
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-2.5 border border-red-100">
                  {error}
                </motion.p>
              )}
              <button type="submit" disabled={sending}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm disabled:opacity-50">
                {sending ? 'Registrando...' : (user ? 'Activar cuenta de afiliado' : 'Crear cuenta y activar')}
              </button>
            </form>
            <p className="text-xs text-gray-400 text-center mt-4">
              {user ? 'Usaremos tu cuenta actual.' : 'Te crearemos una cuenta. Luego podés iniciar sesión.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
