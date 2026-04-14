import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute, AdminRoute, PublicRoute } from './routes/Guards'

// Layout
import DashboardLayout from './components/layout/DashboardLayout'

// Pages
import Home           from './pages/Landing/Home'
import Login          from './pages/Auth/Login'
import Register       from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'

import DashboardHome  from './pages/Dashboard/DashboardHome'
import Signals        from './pages/Dashboard/Signals'
import TradingViewChart from './pages/Dashboard/TradingView'
import PaymentHistory from './pages/Dashboard/PaymentHistory'
import Profile        from './pages/Dashboard/Profile'

import AdminDashboard from './pages/Admin/AdminDashboard'
import ManageSignals  from './pages/Admin/ManageSignals'
import ManageUsers    from './pages/Admin/ManageUsers'
import AdminPayments  from './pages/Admin/AdminPayments'
import AdminPackages  from './pages/Admin/AdminPackages'

function ToasterWrapper() {
  const { isDark } = useTheme()
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: isDark ? '#12121e' : '#fff',
          color: isDark ? '#f1f1f1' : '#111',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          borderRadius: '12px',
          fontSize: '14px',
          fontFamily: 'DM Sans, sans-serif',
        },
        success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
      }}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToasterWrapper />
          <Routes>
            {/* Public */}
            <Route path="/"                 element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/login"            element={<Login />} />
            <Route path="/register"         element={<Register />} />
            <Route path="/forgot-password"  element={<ForgotPassword />} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route index                  element={<DashboardHome />} />
              <Route path="signals"         element={<Signals />} />
              <Route path="chart"           element={<TradingViewChart />} />
              <Route path="payments"        element={<PaymentHistory />} />
              <Route path="profile"         element={<Profile />} />
            </Route>

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
              <Route index                  element={<AdminDashboard />} />
              <Route path="signals"         element={<ManageSignals />} />
              <Route path="users"           element={<ManageUsers />} />
              <Route path="payments"        element={<AdminPayments />} />
              <Route path="packages"        element={<AdminPackages />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
