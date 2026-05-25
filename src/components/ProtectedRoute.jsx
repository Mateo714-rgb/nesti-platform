import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function ProtectedRoute({ children, rolRequerido }) {
  const { user, perfil, loading, perfilLoading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-surface-2">
        <div className="text-center">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
          <p className="text-sm text-gray-400">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  // If perfil is still loading (user exists but we don't know their role yet), keep waiting
  if (perfilLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-surface-2">
        <div className="text-center">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 animate-pulse mx-auto mb-3" />
          <p className="text-sm text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (rolRequerido && perfil?.rol !== rolRequerido) {
    // Redirect to the correct panel based on their role
    if (perfil?.rol === 'owner') return <Navigate to="/admin" replace />
    if (perfil?.rol === 'recepcion') return <Navigate to="/reception" replace />
    // No perfil — redirect to login
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return children
}
