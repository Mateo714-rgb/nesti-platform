import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const REQUEST_SELECT = '*, rooms(numero), staff(id, nombre, rol)'

export function useRealtimeRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('solicitudes_servicio')
      .select(REQUEST_SELECT)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setRequests(data)
        }
        setLoading(false)
      })

    const channel = supabase
      .channel('solicitudes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solicitudes_servicio',
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
      supabase.removeChannel(channel)
    }
  }, [])

  return { requests, loading }
}
