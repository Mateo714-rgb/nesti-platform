import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const MOCK_STAFF = [
  { id: 's-001', nombre: 'María Gómez', rol: 'mucama', activo: true },
  { id: 's-002', nombre: 'Carlos Ruiz', rol: 'mucama', activo: true },
  { id: 's-003', nombre: 'Pedro Martínez', rol: 'botones', activo: true },
  { id: 's-004', nombre: 'Ana López', rol: 'cocina', activo: true },
  { id: 's-005', nombre: 'Luis Vega', rol: 'cocina', activo: true },
  { id: 's-006', nombre: 'Sofía Torres', rol: 'recepcion', activo: true },
  { id: 's-007', nombre: 'Jorge Mora', rol: 'mantenimiento', activo: true },
]

const ROLE_ICONS = {
  mucama: '🧹',
  botones: '💼',
  cocina: '👨‍🍳',
  recepcion: '🛎️',
  mantenimiento: '🔧',
}

export function useStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('staff')
      .select('*')
      .eq('activo', true)
      .order('nombre')
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setStaff(MOCK_STAFF)
        } else {
          setStaff(data)
        }
        setLoading(false)
      })
  }, [])

  return { staff, loading }
}

export function getRoleIcon(rol) {
  return ROLE_ICONS[rol] || '👤'
}

export function getRoleLabel(rol) {
  const labels = {
    mucama: 'Mucama',
    botones: 'Botones',
    cocina: 'Cocina',
    recepcion: 'Recepción',
    mantenimiento: 'Mantenimiento',
  }
  return labels[rol] || rol
}
