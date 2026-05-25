import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TOKEN_KEY = 'nesti_session_token'

export function useRoom(uuid) {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uuid) return

    let cancelled = false

    async function fetchRoom() {
      setLoading(true)
      setError(null)

      const { data, error: err } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', uuid)
        .maybeSingle()

      if (cancelled) return

      if (err) {
        setError('Error al cargar la habitación.')
        setLoading(false)
        return
      }

      if (!data) {
        setError('Habitación no encontrada. Verifica el enlace.')
        setLoading(false)
        return
      }

      const roomData = data
      const dbToken = roomData.token_sesion_actual

      if (!dbToken) {
        setError('Esta habitación no está activa. Consulta en recepción.')
        setLoading(false)
        return
      }

      const localToken = localStorage.getItem(TOKEN_KEY)

      if (!localToken) {
        localStorage.setItem(TOKEN_KEY, dbToken)
      } else if (localToken !== dbToken) {
        setError(
          'Tu sesión ha expirado. Visita recepción para reactivar tu habitación.'
        )
        setLoading(false)
        return
      }

      setRoom(roomData)
      setLoading(false)
    }

    fetchRoom()

    return () => {
      cancelled = true
    }
  }, [uuid])

  return { room, loading, error }
}
