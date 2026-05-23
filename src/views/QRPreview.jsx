import { motion } from 'framer-motion'
import { hotel, room } from '../data/hotel'

const rooms = [
  { number: '101', name: 'Habitación Estándar' },
  { number: '204', name: 'Suite Orquídea' },
  { number: '305', name: 'Suite Panorámica' },
  { number: '112', name: 'Cabaña del Bosque' },
]

function QRCard({ roomNum, roomName, index }) {
  // SVG QR placeholder that looks like real QR
  const cells = []
  const seed = roomNum.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const size = 21
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Corner markers
      const isTopLeft = r < 7 && c < 7
      const isTopRight = r < 7 && c >= size - 7
      const isBottomLeft = r >= size - 7 && c < 7
      const isCorner = isTopLeft || isTopRight || isBottomLeft
      // Corner finder pattern
      if (isCorner) {
        const lr = isTopLeft ? r : isTopRight ? r : r - (size - 7)
        const lc = isTopLeft ? c : isTopRight ? c - (size - 7) : c
        const isEdge = lr === 0 || lr === 6 || lc === 0 || lc === 6
        const isInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4
        if (isEdge || isInner) cells.push({ r, c, dark: true })
        else cells.push({ r, c, dark: false })
      } else {
        // Pseudo-random data based on room number
        const hash = (seed * (r * 31 + c * 17 + 7)) % 100
        cells.push({ r, c, dark: hash > 45 })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-3xl p-6 border border-surface-3 shadow-glass text-center"
      style={{ breakInside: 'avoid' }}>

      {/* Hotel name */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">N</span>
        </div>
        <span className="font-display text-sm font-semibold text-brand-700 tracking-wide">Nesti</span>
      </div>

      {/* QR */}
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-2xl bg-white border-2 border-surface-3 inline-block">
          <svg width="100" height="100" viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
            {cells.map(({ r, c, dark }) =>
              dark ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0e5858" /> : null
            )}
          </svg>
        </div>
      </div>

      {/* Room info */}
      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Habitación</p>
      <p className="font-display text-4xl font-semibold text-gray-900 mb-1">{roomNum}</p>
      <p className="text-sm text-gray-500">{roomName}</p>

      {/* CTA */}
      <div className="mt-4 pt-4 border-t border-surface-2">
        <p className="text-xs text-gray-400 leading-relaxed">
          Escanea para acceder<br />a los servicios del hotel
        </p>
        <p className="text-xs text-brand-600 font-mono mt-1">nesti.app/r/{roomNum.toLowerCase()}</p>
      </div>
    </motion.div>
  )
}

export default function QRPreview() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center">
        <p className="text-xs text-gray-400 tracking-widest uppercase font-medium mb-1">Imprimir & Pegar</p>
        <h1 className="font-display text-2xl font-semibold text-gray-900">QR por Habitación</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto text-balance">
          Cada tarjeta se imprime en A5, se plastifica y se pega en la habitación. Listo.
        </p>
      </motion.div>

      {/* How it works strip */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: '🖨️', step: '1', label: 'Imprimir en A5' },
          { icon: '📌', step: '2', label: 'Pegar en habitación' },
          { icon: '📱', step: '3', label: 'Huésped escanea' },
        ].map(s => (
          <div key={s.step} className="bg-white rounded-2xl p-3 border border-surface-3 text-center shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="flex items-center justify-center gap-1">
              <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">{s.step}</span>
              <p className="text-xs text-gray-600 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* QR grid */}
      <div className="grid grid-cols-2 gap-4">
        {rooms.map((r, i) => (
          <QRCard key={r.number} roomNum={r.number} roomName={r.name} index={i} />
        ))}
      </div>

      {/* Generate more hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-4 flex items-center gap-3">
        <div className="text-xl">⚡</div>
        <div>
          <p className="text-sm font-semibold text-brand-800">Generación automática</p>
          <p className="text-xs text-brand-600">En el panel admin puedes generar QRs para todas las habitaciones en un click y descargarlos como PDF.</p>
        </div>
      </motion.div>
    </div>
  )
}
