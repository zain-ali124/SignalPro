import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import SignalCard from '../../components/ui/SignalCard'
import api from '../../services/api'
import { RiSignalTowerLine, RiRefreshLine, RiFilterLine } from 'react-icons/ri'

export default function Signals() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetchSignals()
    if (user?.accountStatus === 'active') {
      api.get('/users/signal-status').then(r => setStatus(r.data.data)).catch(() => {})
    }
  }, [])

  const fetchSignals = async () => {
    setLoading(true)
    try {
      const res = await api.get('/signals/all')
      setSignals(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'ALL' ? signals : signals.filter(s => s.signalType === filter)

  if (user?.accountStatus !== 'active') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <RiSignalTowerLine className="text-5xl text-orange-500/40 mb-4" />
        <h3 className={`font-display font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Account Pending</h3>
        <p className={`text-sm max-w-xs ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
          Your account needs to be approved by an admin before you can view signals.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Trading Signals</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
            {user?.package?.charAt(0).toUpperCase() + user?.package?.slice(1)} plan — {status?.signalsPerDay >= 999999 ? 'Unlimited' : `${status?.signalsPerDay} signals/day`}
          </p>
        </div>
        <button onClick={fetchSignals} className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
          <RiRefreshLine /> Refresh
        </button>
      </div>

      {/* Signal usage bar */}
      {status && status.signalsPerDay < 999999 && (
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8'}`}>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className={isDark ? 'text-white/60' : 'text-gray-600'}>Daily Signal Usage</span>
            <span className="text-orange-400 font-display font-semibold">{status.signalsUsedToday} / {status.signalsPerDay}</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/8' : 'bg-black/8'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(status.signalsUsedToday / status.signalsPerDay) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-orange-gradient"
            />
          </div>
          <p className={`text-xs mt-1.5 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
            {status.remaining} remaining today. Resets at midnight.
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'BUY', 'SELL'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-display font-semibold transition-all duration-200 ${
              filter === f
                ? 'bg-orange-gradient text-white shadow-orange-glow-sm'
                : isDark ? 'bg-white/6 text-white/50 hover:bg-white/10' : 'bg-black/6 text-gray-500 hover:bg-black/10'
            }`}
          >
            {f}
          </button>
        ))}
        <span className={`ml-auto text-xs ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
          {filtered.length} signal{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Signals grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`rounded-2xl h-52 ${isDark ? 'bg-dark-700' : 'bg-white'} shimmer`} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <RiSignalTowerLine className="text-4xl text-orange-500/30 mb-3" />
          <p className={`text-sm ${isDark ? 'text-white/45' : 'text-gray-500'}`}>No signals available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s, i) => <SignalCard key={s._id} signal={s} index={i} />)}
        </div>
      )}
    </div>
  )
}
