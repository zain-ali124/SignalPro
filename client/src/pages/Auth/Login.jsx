import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { RiBarChartLine, RiEyeLine, RiEyeOffLine, RiSunLine, RiMoonLine } from 'react-icons/ri'

export default function Login() {
  const { login } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}!`)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-dark-900' : 'bg-[#f8f7f4]'}`}>
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-dark-800">
        <div className="glow-orb w-96 h-96 top-1/3 left-1/2 -translate-x-1/2 opacity-60" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 rounded-xl bg-orange-gradient flex items-center justify-center shadow-orange-glow">
              <RiBarChartLine className="text-white text-lg" />
            </div>
            <span className="font-display font-bold text-2xl text-white">Signal<span className="text-orange-500">Pro</span></span>
          </Link>

          <h2 className="font-display font-bold text-4xl text-white mb-4 leading-tight">
            Welcome Back,<br />
            <span className="text-orange-gradient">Trader</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Access your personalized trading signals, live charts, and market analysis.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-12">
            {[
              { label: 'Active Traders', value: '2,400+' },
              { label: 'Win Rate',       value: '78%'    },
              { label: 'Daily Signals',  value: '30+'    },
              { label: 'Pairs Covered',  value: '50+'    },
            ].map((s, i) => (
              <div key={i} className="glass-card p-4">
                <p className="text-2xl font-display font-bold text-orange-400">{s.value}</p>
                <p className="text-xs text-white/45 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Theme toggle */}
        <button onClick={toggleTheme} className={`absolute top-6 right-6 w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'text-white/60 hover:bg-white/8' : 'text-gray-500 hover:bg-black/6'}`}>
          {isDark ? <RiSunLine /> : <RiMoonLine />}
        </button>

        {/* Mobile logo */}
        <Link to="/" className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-orange-gradient flex items-center justify-center">
            <RiBarChartLine className="text-white text-base" />
          </div>
          <span className="font-display font-bold text-lg">
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Signal</span>
            <span className="text-orange-500">Pro</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className={`font-display font-bold text-3xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sign In
          </h1>
          <p className={`text-sm mb-8 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-500 hover:text-orange-400 font-medium">Create one</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-xs font-display font-semibold mb-1.5 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className={isDark ? 'input-dark' : 'input-light'}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-xs font-display font-semibold ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Password</label>
                <Link to="/forgot-password" className="text-xs text-orange-500 hover:text-orange-400">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className={`${isDark ? 'input-dark' : 'input-light'} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/35 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-orange w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
