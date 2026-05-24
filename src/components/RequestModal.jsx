import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function RequestModal({
  roomId,
  service = null,
  onClose,
  onSuccess,
  isCustom = false,
}) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [customText, setCustomText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setSending(true)
    setError('')

    const tipo = isCustom ? customText.trim() : service.title

    const { error: submitError } = await supabase.from('solicitudes_servicio').insert({
      room_id: roomId,
      tipo_servicio: tipo,
      nota: '',
      estado: 'pendiente',
    })

    if (submitError) {
      setError(submitError.message)
      setSending(false)
      return
    }

    setSent(true)
    setSending(false)
    onSuccess?.()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-sm glass rounded-3xl p-6 shadow-float"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      >
        {sent ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <motion.div
              className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-3xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              ✓
            </motion.div>
            <p className="font-display font-semibold text-lg text-gray-900 text-center">
              ¡Solicitud enviada!
            </p>
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              Tu solicitud ha sido enviada. En unos momentos recibirás un
              mensaje o una llamada de confirmación de recepción en tu
              habitación para validar tu pedido.
            </p>
            <button
              onClick={onClose}
              className="mt-2 py-2.5 px-6 rounded-xl text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors active:scale-95"
            >
              Entendido
            </button>
          </div>
        ) : (
          <>
            {!isCustom && service && (
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center text-2xl">
                  {service.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{service.title}</p>
                  <p className="text-xs text-gray-400">
                    Tiempo estimado: {service.eta}
                  </p>
                </div>
              </div>
            )}

            {isCustom && (
              <div className="mb-5">
                <p className="font-medium text-gray-900 mb-2">
                  Pedido personalizado
                </p>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Describe lo que necesitas..."
                  rows={3}
                  className="w-full text-sm bg-surface-1 rounded-xl px-4 py-3 resize-none border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder:text-gray-300"
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-2 border border-red-100 mt-3">{error}</p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-surface-2 hover:bg-surface-3 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  sending || (isCustom && !customText.trim())
                }
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Enviando...' : 'Solicitar'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
