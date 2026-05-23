import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const TOKEN_KEY = 'nesti_session_token'

export function useSessionMonitor(roomId) {
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!roomId) return

    const channel = supabase
      .channel(`session-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const newToken = payload.new.token_sesion_actual
          const localToken = localStorage.getItem(TOKEN_KEY)

          if (!newToken) {
            localStorage.removeItem(TOKEN_KEY)
            setExpired(true)
          } else if (localToken && localToken !== newToken) {
            localStorage.removeItem(TOKEN_KEY)
            setExpired(true)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  return expired
}
