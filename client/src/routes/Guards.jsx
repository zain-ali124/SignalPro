import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Spinner
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-900">
    <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

// ── Requires login ────────────────────────────────
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? children : <Navigate to="/" replace />
}

// ── Public route: redirect logged-in users away from public pages ──
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? <Navigate to="/dashboard" replace /> : children
}

// ── Requires admin role ───────────────────────────
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}
