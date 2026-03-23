import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import StatCard from '../../components/ui/StatCard'
import api from '../../services/api'
import {
  RiSignalTowerLine, RiBarChart2Line, RiWalletLine,
  RiArrowRightLine, RiCheckboxCircleLine, RiTimeLine,
  RiAlertLine
} from 'react-icons/ri'

export default function DashboardHome() {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const [signalStatus, setSignalStatus] = useState(null)
  const [recentSignals, setRecentSignals] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    if (user?.accountStatus !== 'active') return
    api.get('/users/signal-status').then(r => setSignalStatus(r.data.data)).catch(() => {})
    api.get('/signals/all?limit=3').then(r => setRecentSignals(r.data.data || [])).catch(() => {})
    api.get('/payments/my').then(r => setPayments(r.data.data || [])).catch(() => {})
  }, [user])

  const statusMessages = {
    pending:   { icon: RiTimeLine,          color: 'yellow', msg: 'Your account is pending admin approval. This usually takes a few hours.' },
    rejected:  { icon: RiAlertLine,          color: 'red',    msg: 'Your payment was rejected. Please contact support or resubmit proof.'    },
    suspended: { icon: RiAlertLine,          color: 'red',    msg: 'Your account has been suspended. Contact support for assistance.'        },
    active:    { icon: RiCheckboxCircleLine, color: 'green',  msg: 'Your account is active.'                                                },
  }

  const statusInfo = statusMessages[user?.accountStatus] || statusMessages.pending

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Account status banner (if not active) */}
      {user?.accountStatus !== 'active' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-xl border"
          style={{
            background: statusInfo.color === 'yellow' ? 'rgba(234,179,8,0.08)' : 'rgba(239,68,68,0.08)',
            borderColor: statusInfo.color === 'yellow' ? 'rgba(234,179,8,0.25)' : 'rgba(239,68,68,0.25)',
          }}
        >
          <statusInfo.icon className={`text-xl mt-0.5 flex-shrink-0 ${statusInfo.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`} />
          <div>
            <p className={`text-sm font-semibold mb-0.5 ${statusInfo.color === 'yellow' ? 'text-yellow-300' : 'text-red-300'}`}>
              Account {user?.accountStatus?.charAt(0).toUpperCase() + user?.accountStatus?.slice(1)}
            </p>
            <p className={`text-xs ${isDark ? 'text-white/55' : 'text-gray-600'}`}>{statusInfo.msg}</p>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={RiSignalTowerLine} label="Signals Today"   value={signalStatus?.signalsUsedToday ?? '—'} sub={signalStatus ? `of ${signalStatus.signalsPerDay === 999999 ? '∞' : signalStatus.signalsPerDay} limit` : 'Not active'} color="orange" delay={0}   />
        <StatCard icon={RiBarChart2Line}   label="Remaining Today" value={signalStatus ? (signalStatus.signalsPerDay >= 999999 ? '∞' : signalStatus.remaining) : '—'} sub="Resets at midnight" color="green"  delay={0.1} />
        <StatCard icon={RiWalletLine}      label="Active Package"  value={user?.package ? user.package.charAt(0).toUpperCase() + user.package.slice(1) : 'None'} sub={`Status: ${user?.accountStatus}`} color="blue"   delay={0.2} />
        <StatCard icon={RiCheckboxCircleLine} label="Payments"    value={payments.filter(p => p.status === 'approved').length} sub={`${payments.filter(p => p.status === 'pending').length} pending`} color="purple" delay={0.3} />
      </div>

      {/* Recent signals */}
      {user?.accountStatus === 'active' && recentSignals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-display font-semibold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Signals</h2>
            <Link to="/dashboard/signals" className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-1">
              View all <RiArrowRightLine />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentSignals.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-xl border p-4 ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.pair}</span>
                  <span className={s.signalType === 'BUY' ? 'badge-buy' : 'badge-sell'}>{s.signalType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><p className={isDark ? 'text-white/35' : 'text-gray-400'}>Entry</p><p className={isDark ? 'text-white/80' : 'text-gray-700'} >{Number(s.entryPrice).toLocaleString()}</p></div>
                  <div><p className="text-red-400/60">SL</p><p className="text-red-400">{Number(s.stopLoss).toLocaleString()}</p></div>
                  <div><p className="text-green-400/60">TP</p><p className="text-green-400">{Number(s.takeProfit).toLocaleString()}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links for inactive accounts */}
      {user?.accountStatus !== 'active' && (
        <div className={`rounded-2xl border p-6 ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8'}`}>
          <h3 className={`font-display font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/dashboard/payments" className="btn-ghost text-sm py-3 text-center">View Payment Status</Link>
            <Link to="/dashboard/profile" className="btn-orange text-sm py-3 text-center">Update Profile</Link>
          </div>
        </div>
      )}
    </div>
  )
}
