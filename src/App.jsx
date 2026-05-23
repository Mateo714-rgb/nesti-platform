import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoom from './routes/GuestRoom'
import Reception from './routes/Reception'
import QRPreview from './routes/QRPreview'
import AdminPanel from './routes/AdminPanel'
import Login from './routes/Login'
import BetaRegister from './routes/BetaRegister'
import BetaRegistrations from './routes/BetaRegistrations'
import Affiliate from './routes/Affiliate'
import AffiliateDashboard from './routes/AffiliateDashboard'
import Landing from './Landing'

export default function App() {
  const { user, perfil, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      {user && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="glass rounded-2xl px-4 py-2 shadow-glass flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-xs text-gray-500">{user.email}</span>
            {perfil && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                perfil.rol === 'owner'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-brand-50 text-brand-700 border border-brand-200'
              }`}>
                {perfil.rol === 'owner' ? 'Dueño' : 'Recepción'}
              </span>
            )}
            {perfil?.rol === 'owner' && (
              <button onClick={() => navigate('/admin')}
                className="text-xs text-gray-400 hover:text-brand-600 transition-colors">
                Admin
              </button>
            )}
            {perfil?.rol === 'recepcion' && (
              <button onClick={() => navigate('/reception')}
                className="text-xs text-gray-400 hover:text-brand-600 transition-colors">
                Recepción
              </button>
            )}
            <button onClick={signOut}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1">
              Salir
            </button>
          </div>
        </div>
      )}

      <main className={user ? 'pt-16' : ''}>
        <Routes>
          <Route path="/r/:uuid" element={<GuestRoom />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/reception"
            element={
              <ProtectedRoute rolRequerido="recepcion">
                <Reception />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute rolRequerido="owner">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr"
            element={
              <ProtectedRoute>
                <QRPreview />
              </ProtectedRoute>
            }
          />
          <Route path="/beta-register" element={<BetaRegister />} />
          <Route
            path="/admin/beta-registrations"
            element={
              <ProtectedRoute rolRequerido="owner">
                <BetaRegistrations />
              </ProtectedRoute>
            }
          />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route
            path="/affiliate/dashboard"
            element={
              <ProtectedRoute>
                <AffiliateDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
    </>
  )
}
