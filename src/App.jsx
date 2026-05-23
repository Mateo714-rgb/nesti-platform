// Nesti — Guest Experience App
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoom from './routes/GuestRoom'
import Reception from './routes/Reception'
import QRPreview from './routes/QRPreview'
import AdminPanel from './routes/AdminPanel'
import Login from './routes/Login'
import Landing from './Landing'

export default function App() {
  const { user, signOut } = useAuth()

  return (
    <>
      {/* Session bar */}
      {user && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="glass rounded-2xl px-4 py-2 shadow-glass flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-xs text-gray-500">{user.email}</span>
            <button
              onClick={signOut}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1"
            >
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
              <ProtectedRoute>
                <Reception />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
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
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
    </>
  )
}
""  
