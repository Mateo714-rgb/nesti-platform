import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../lib/supabase'

const MOCK_ROOMS = [
  { id: '00000000-0000-0000-0000-000000000101', numero: '101', nombre: 'Habitación Estándar', tipo: 'Estándar' },
  { id: '00000000-0000-0000-0000-000000000204', numero: '204', nombre: 'Suite Orquídea', tipo: 'Suite Junior' },
  { id: '00000000-0000-0000-0000-000000000305', numero: '305', nombre: 'Suite Panorámica', tipo: 'Suite' },
  { id: '00000000-0000-0000-0000-000000000112', numero: '112', nombre: 'Cabaña del Bosque', tipo: 'Cabaña' },
]

export default function QRPreview() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    setLoading(true)
    const { data, error } = await supabase.from('rooms').select('*').order('numero')
    if (error || !data || data.length === 0) {
      setRooms(MOCK_ROOMS)
    } else {
      setRooms(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-1 via-white to-brand-50/40">
        <div className="text-center">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
          <p className="text-sm text-gray-400">Cargando habitaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-1 via-white to-brand-50/40 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <p className="text-xs text-gray-400 tracking-widest uppercase font-medium mb-1">
            Imprimir & Pegar
          </p>
          <h1 className="font-display text-2xl font-semibold text-gray-900">
            Códigos QR por Habitación
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto text-balance">
            Cada tarjeta contiene un código QR único que lleva al huésped
            directamente a su habitación en la app. Imprime, plastifica y pega.
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Imprimir tarjetas
          </button>
          <span className="text-xs text-gray-400">
            {rooms.length} habitación{rooms.length !== 1 ? 'es' : ''}
          </span>
        </motion.div>

        {/* QR Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-20 print-grid">
          {rooms.map((room, i) => {
            const url = `${window.location.origin}/r/${room.id}`
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="qr-card bg-white rounded-3xl p-5 border border-surface-3 shadow-glass text-center"
              >
                {/* Brand */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">N</span>
                  </div>
                  <span className="font-display text-sm font-semibold text-brand-700 tracking-wide">
                    Nesti
                  </span>
                </div>

                {/* QR */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-2xl bg-white border-2 border-surface-3 inline-block">
                    <QRCodeSVG
                      value={url}
                      size={120}
                      bgColor="#ffffff"
                      fgColor="#0e5858"
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                </div>

                {/* Room info */}
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">
                  Habitación
                </p>
                <p className="font-display text-3xl font-semibold text-gray-900 mb-1">
                  {room.numero}
                </p>
                <p className="text-sm text-gray-500 mb-3">{room.nombre}</p>

                {/* URL */}
                <div className="pt-3 border-t border-surface-2">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Escanea para acceder<br />a los servicios del hotel
                  </p>
                  <p className="text-xs text-brand-600 font-mono mt-1 truncate">
                    {url}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          @page { margin: 0.5cm; }
          .qr-card {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #e9ecef !important;
            margin: 0;
          }
          button, .toolbar, .text-center p:first-child,
          .text-center h1, .text-center p:last-child,
          .flex-wrap, .text-gray-400:not(.qr-card *) {
            display: none !important;
          }
          .print-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.5cm !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
