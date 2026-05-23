import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const REQUEST_SELECT = '*, staff(id, nombre, rol)'

export function useGuestRequests(roomId) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return

    let cancelled = false

    supabase
      .from('solicitudes_servicio')
      .select(REQUEST_SELECT)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data) {
          setRequests(data)
        }
        setLoading(false)
      })

    const channel = supabase
      .channel(`guest-requests-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solicitudes_servicio',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            supabase
              .from('solicitudes_servicio')
              .select(REQUEST_SELECT)
              .eq('id', payload.new.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setRequests((prev) => [data, ...prev])
                }
              })
          } else if (payload.eventType === 'UPDATE') {
            supabase
              .from('solicitudes_servicio')
              .select(REQUEST_SELECT)
              .eq('id', payload.new.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setRequests((prev) =>
                    prev.map((r) => (r.id === data.id ? data : r))
                  )
                }
              })
          } else if (payload.eventType === 'DELETE') {
            setRequests((prev) =>
              prev.filter((r) => r.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [roomId])

  return { requests, loading }
}
