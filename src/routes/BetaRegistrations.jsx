import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function BetaRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('beta_registrations')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRegistrations(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-1 via-white to-brand-50/40 px-4 py-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-gray-400 tracking-widest uppercase font-medium mb-1">Admin</p>
        <h1 className="font-display text-2xl font-semibold text-gray-900">Registros Beta</h1>
        <p className="text-sm text-gray-400 mt-1">
          {registrations.length} registro{registrations.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
          <p className="text-sm text-gray-400">Cargando registros...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-sm text-gray-400">Aún no hay registros beta.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-3">
                <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Fecha</th>
                <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Nombre</th>
                <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Email</th>
                <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Hotel</th>
                <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Teléfono</th>
                <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 pr-4">Tamaño</th>
                <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3">Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-b border-surface-3 hover:bg-surface-1/50 transition-colors">
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString('es-EC', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">{r.nombre}</td>
                  <td className="py-3 pr-4 text-brand-600 whitespace-nowrap">
                    <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                  </td>
                  <td className="py-3 pr-4 text-gray-700 whitespace-nowrap">{r.hotel}</td>
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                    {r.telefono || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                    {r.hotel_size || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 text-gray-500 max-w-xs truncate">
                    {r.mensaje || <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
