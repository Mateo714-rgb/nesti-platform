import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatMessages } from '../hooks/useChatMessages'

export default function ChatPanel({ roomId, roomNumero, senderName, isStaff }) {
  const { messages, loading, sendMessage } = useChatMessages()
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    const ok = await sendMessage({
      room_id: isStaff ? '00000000-0000-0000-0000-000000000000' : roomId,
      room_numero: isStaff ? '👤 Recepción' : roomNumero,
      nombre_emisor: senderName || 'Huésped',
      mensaje: text.trim(),
    })
    if (ok) setText('')
    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 rounded-xl bg-brand-100 animate-pulse" />
      </div>
    )
  }

  const timeStr = (d) =>
    new Date(d).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto px-1 space-y-2 pb-3">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">💬</p>
            <p className="text-sm font-medium text-gray-500">Sé el primero en escribir</p>
            <p className="text-xs text-gray-400 mt-1">¡Comparte algo con la comunidad del hotel!</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMine = !isStaff && msg.room_id === roomId
            const isStaffMsg = msg.room_numero === '👤 Recepción'
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    isMine
                      ? 'bg-brand-600 text-white rounded-br-md'
                      : isStaffMsg
                      ? 'bg-amber-50 border border-amber-200 rounded-bl-md'
                      : 'bg-surface-2 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      isMine ? 'text-brand-200' : isStaffMsg ? 'text-amber-700' : 'text-gray-400'
                    }`}>
                      {isStaffMsg ? '👤 Recepción' : `Hab. ${msg.room_numero}`}
                    </span>
                    <span className={`text-[9px] ${isMine ? 'text-brand-300' : 'text-gray-400'}`}>
                      {timeStr(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.mensaje}</p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 pt-3 border-t border-surface-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Escribe un mensaje..."
          className="flex-1 text-sm bg-surface-1 rounded-xl px-4 py-2.5 border border-surface-3 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:active:scale-100"
        >
          {sending ? '···' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}
