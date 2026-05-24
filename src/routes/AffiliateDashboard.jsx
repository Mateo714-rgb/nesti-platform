import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

export default function AffiliateDashboard() {
  const { user } = useAuth()
  const [affiliate, setAffiliate] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setLoading(true)

      const { data: affData } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!affData) {
        setLoading(false)
        return
      }

      setAffiliate(affData)

      const { data: refData } = await supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affData.id)
        .order('created_at', { ascending: false })

      if (refData) {
        setReferrals(refData)
      }

      setLoading(false)
    }

    loadData()
  }, [user])

  const baseUrl = window.location.origin
  const refLink = affiliate ? `${baseUrl}/beta-register?ref=${affiliate.ref_code}` : ''

  const stats = {
    total: referrals.length,
    active: referrals.filter(r => r.status === 'active').length,
    pending: referrals.filter(r => r.status === 'pending').length,
    paid: referrals.filter(r => r.status === 'paid').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-1 via-white to-brand-50/40">
        <div className="text-center">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
          <p className="text-sm text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-1 via-white to-brand-50/40 p-4">
        <div className="glass rounded-3xl p-10 text-center max-w-sm">
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-2">No sos afiliado</h2>
          <p className="text-sm text-gray-500 mb-5">Registrate como afiliado para obtener tu link de referido.</p>
          <a href="/affiliate"
            className="inline-flex px-6 py-3 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-all">
            Quiero ser afiliado
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-1 via-white to-brand-50/40 px-4 py-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-gray-400 tracking-widest uppercase font-medium mb-1">Panel de Afiliado</p>
        <h1 className="font-display text-2xl font-semibold text-gray-900">Bienvenido, {affiliate.nombre}</h1>
      </motion.div>

      {/* Referral link */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 mb-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Tu link de referido</p>
        <div className="flex items-center gap-2">
          <input readOnly value={refLink}
            className="flex-1 text-sm bg-surface-1 rounded-xl px-4 py-3 border border-surface-3 text-gray-700 select-all" />
          <button onClick={() => navigator.clipboard.writeText(refLink)}
            className="px-4 py-3 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:scale-95 transition-all shadow-sm shrink-0">
            Copiar
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Totales', value: stats.total, color: '' },
          { label: 'Activos', value: stats.active, color: 'bg-emerald-50 border-emerald-200' },
          { label: 'Pendientes', value: stats.pending, color: stats.pending > 0 ? 'bg-amber-50 border-amber-200' : '' },
          { label: 'Pagados', value: stats.paid, color: 'bg-brand-50 border-brand-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 border text-center ${s.color || 'bg-white border-surface-3'}`}>
            <p className="text-2xl font-display font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Estimated earnings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 mb-6 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ganancia estimada por hoteles activos</p>
        <p className="font-display text-3xl font-bold text-brand-600">
          ${(stats.active * 14.70).toFixed(2)}<span className="text-sm text-gray-400 font-normal">/mes</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">30% de $49/mes por hotel activo</p>
      </motion.div>

      {/* Referrals table */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-surface-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Hoteles referidos</p>
        </div>
        {referrals.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-gray-400">Aún no has referido ningún hotel.</p>
            <p className="text-xs text-gray-300 mt-1">Compartí tu link para empezar a ganar comisiones.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-3">
                  <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 px-5 pt-2">Hotel</th>
                  <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 px-5 pt-2">Fecha</th>
                  <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider pb-3 px-5 pt-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map(r => (
                  <tr key={r.id} className="border-b border-surface-3 last:border-0 hover:bg-surface-1/50 transition-colors">
                    <td className="py-3 px-5 text-gray-900 font-medium">{r.hotel_name}</td>
                    <td className="py-3 px-5 text-gray-500">
                      {new Date(r.created_at).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-5">
                      <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        r.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                        r.status === 'paid' ? 'bg-brand-50 text-brand-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {r.status === 'active' ? 'Activo' : r.status === 'paid' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
