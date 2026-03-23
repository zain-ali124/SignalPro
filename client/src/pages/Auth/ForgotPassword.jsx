import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import { RiBarChartLine, RiMailLine, RiArrowLeftLine } from 'react-icons/ri'

export default function ForgotPassword() {
  const { isDark } = useTheme()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Reset link sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-dark-900' : 'bg-[#f8f7f4]'}`}>
      <div className="glow-orb w-80 h-80 top-0 left-1/2 -translate-x-1/2 opacity-30 fixed" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-orange-gradient flex items-center justify-center shadow-orange-glow">
            <RiBarChartLine className="text-white" />
          </div>
          <span className="font-display font-bold text-xl">
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Signal</span>
            <span className="text-orange-500">Pro</span>
          </span>
        </div>

        <div className={`rounded-2xl border p-8 ${isDark ? 'bg-dark-700 border-white/8' : 'bg-white border-black/8 shadow-card'}`}>
          {!sent ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/12 border border-orange-500/20 flex items-center justify-center mb-5">
                <RiMailLine className="text-orange-500 text-2xl" />
              </div>
              <h2 className={`font-display font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Forgot Password?</h2>
              <p className={`text-sm mb-6 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email" required placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className={isDark ? 'input-dark' : 'input-light'}
                />
                <button type="submit" disabled={loading} className="btn-orange w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-500/12 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className={`font-display font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Check Your Email</h3>
              <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                A reset link has been sent to <strong className="text-orange-400">{email}</strong>
              </p>
            </div>
          )}

          <Link to="/login" className={`flex items-center justify-center gap-2 mt-5 text-sm ${isDark ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-700'} transition-colors`}>
            <RiArrowLeftLine /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
