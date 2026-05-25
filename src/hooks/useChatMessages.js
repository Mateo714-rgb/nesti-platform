import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useChatMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('chat_mensajes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) {
          setMessages(data.reverse())
        }
        setLoading(false)
      })

    const channel = supabase
      .channel('chat-mensajes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_mensajes' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendMessage = async ({ room_id, room_numero, nombre_emisor, mensaje }) => {
    const { error } = await supabase.from('chat_mensajes').insert({
      room_id,
      room_numero,
      nombre_emisor,
      mensaje,
    })
    if (error) {
      console.error('Error al enviar mensaje:', error.message)
      return false
    }
    return true
  }

  return { messages, loading, sendMessage }
}
