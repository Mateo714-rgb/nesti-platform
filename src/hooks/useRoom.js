import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TOKEN_KEY = 'nesti_session_token'

const MOCK_ROOM = {
  id: '00000000-0000-0000-0000-000000000101',
  numero: '101',
  nombre: 'Mock Habitación',
  tipo: 'Estándar',
  descripcion:
    'Habitación de prueba con vista al jardín, cama queen y baño privado.',
  token_sesion_actual: crypto.randomUUID(),
  created_at: new Date().toISOString(),
}

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
        .single()

      if (cancelled) return

      const roomData = err || !data ? MOCK_ROOM : data
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
