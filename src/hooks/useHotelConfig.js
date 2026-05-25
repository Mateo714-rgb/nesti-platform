import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULT_CONFIG = {
  name: 'Casa del Árbol',
  tagline: 'Boutique Lodge · Mindo, Ecuador',
  guest_name: 'Sebastián',
  wifi_name: 'CasaArbol_Guest',
  wifi_password: 'orquidea2024',
  breakfast_info: 'Incluido. Buffet de 7:00 – 10:30 AM en el comedor principal',
  pool_info: 'Abierta de 8 AM a 8 PM. Toallas disponibles en recepción',
  parking_info: 'Gratuito. Zona vigilada 24h, sótano nivel B1',
  reception_info: 'Disponible 24 horas. Llama al ext. 0 desde el teléfono de tu habitación',
  check_out_info: 'Hasta las 12:00 PM. Extensión disponible según disponibilidad (cobro extra)',
  address: 'Av. Quito km 4.5, Mindo, Ecuador',
  modulo_comida_activo: true,
  menu_del_dia_texto: '',
  horario_cocina: '7:00 - 22:00',
}

export function useHotelConfig() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('hotel_config')
      .select('*')
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setConfig(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const updateConfig = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('hotel_config')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', config.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating config:', error.message)
        return
      }
      if (data) setConfig(data)
      else setConfig((prev) => ({ ...prev, ...updates }))
    } catch (err) {
      console.error('Error updating config:', err)
    }
  }

  return { config, loading, updateConfig }
}

export function getInfoItems(config) {
  return [
    { icon: '📶', title: 'Wi-Fi', detail: `${config.wifi_name || '—'} · Clave: ${config.wifi_password || '—'}` },
    { icon: '🍳', title: 'Desayuno', detail: config.breakfast_info },
    { icon: '🏊', title: 'Piscina', detail: config.pool_info },
    { icon: '🅿️', title: 'Estacionamiento', detail: config.parking_info },
    { icon: '📞', title: 'Recepción', detail: config.reception_info },
    { icon: '🔑', title: 'Check-out', detail: config.check_out_info },
    { icon: '📍', title: 'Dirección', detail: config.address },
  ]
}
