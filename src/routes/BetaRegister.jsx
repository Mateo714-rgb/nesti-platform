import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function BetaRegister() {
  const [searchParams] = useSearchParams()
  const refCode = searchParams.get('ref') || null

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    hotel: '',
    telefono: '',
    hotel_size: '',
    mensaje: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)

    const { error: err } = await supabase.from('beta_registrations').insert({
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      hotel: form.hotel.trim(),
      telefono: form.telefono.trim(),
      hotel_size: form.hotel_size.trim(),
      mensaje: form.mensaje.trim(),
      ref_code: refCode,
    })

    if (err) {
      setError(err.message || 'Error al enviar. Intenta de nuevo.')
      setSending(false)
      return
    }

    // Track referral if refCode exists
    if (refCode) {
      try {
        const { data: affData } = await supabase
          .from('affiliates')
          .select('id')
          .eq('ref_code', refCode)
          .maybeSingle()

        if (affData) {
          const { error: refErr } = await supabase.from('referrals').insert({
            affiliate_id: affData.id,
            hotel_name: form.hotel.trim(),
            status: 'pending',
          })
          if (refErr) console.error('Error al registrar referral:', refErr.message)
        }
      } catch (refErr) {
        console.error('Error al procesar referral:', refErr)
      }
    }

    setSubmitted(true)
    setSending(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-surface-2 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="glass rounded-4xl p-10 shadow-float">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-emerald-500">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-2">
              Registro completado
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed text-balance">
              Gracias por registrarte en la beta de Nesti. Te contactaremos pronto a{' '}
              <strong className="text-brand-600">{form.email}</strong>.
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-surface-2 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="glass rounded-3xl p-8 shadow-float">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="font-display text-lg font-semibold text-brand-700 tracking-wide">
              Nesti
            </span>
          </div>

          <h2 className="font-display text-xl font-semibold text-gray-900 text-center mb-1">
            Acceso anticipado
          </h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            Registra tu hotel en la beta cerrada y obten acceso gratuito de por vida.
          </p>
          {refCode && (
            <div className="flex items-center justify-center gap-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-600 font-medium">
                Recomendado por un afiliado
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Nombre completo <span className="text-red-400">*</span>
              </label>
              <input
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tucorreo@hotel.com"
                required
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Nombre del hotel <span className="text-red-400">*</span>
              </label>
              <input
                name="hotel"
                type="text"
                value={form.hotel}
                onChange={handleChange}
                placeholder="Hotel Paraíso"
                required
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Teléfono
              </label>
              <input
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={handleChange}
                placeholder="+593 99 999 9999"
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Tamaño del hotel (habitaciones)
              </label>
              <select
                name="hotel_size"
                value={form.hotel_size}
                onChange={handleChange}
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              >
                <option value="">Selecciona...</option>
                <option value="1-10">1 - 10 habitaciones</option>
                <option value="11-30">11 - 30 habitaciones</option>
                <option value="31-60">31 - 60 habitaciones</option>
                <option value="61-100">61 - 100 habitaciones</option>
                <option value="100+">Más de 100 habitaciones</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Mensaje o comentario
              </label>
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                placeholder="Cuéntanos más sobre tu hotel..."
                rows={3}
                className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300 resize-none"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-2.5 border border-red-100"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Enviando...' : 'Solicitar acceso beta'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
