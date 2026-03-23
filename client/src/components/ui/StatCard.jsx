import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function StatCard({ icon: Icon, label, value, sub, color = 'orange', delay = 0 }) {
  const { isDark } = useTheme()

  const colors = {
    orange: { bg: 'rgba(249,115,22,0.12)', text: '#f97316', border: 'rgba(249,115,22,0.2)' },
    green:  { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e', border: 'rgba(34,197,94,0.2)'  },
    blue:   { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', border: 'rgba(59,130,246,0.2)' },
    purple: { bg: 'rgba(168,85,247,0.12)', text: '#a855f7', border: 'rgba(168,85,247,0.2)' },
    red:    { bg: 'rgba(239,68,68,0.12)',  text: '#ef4444', border: 'rgba(239,68,68,0.2)'  },
  }

  const c = colors[color] || colors.orange

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5 ${
        isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-card'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-body font-medium mb-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            {label}
          </p>
          <p className={`text-2xl font-display font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {sub && (
            <p className={`text-xs mt-1 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>{sub}</p>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <Icon style={{ color: c.text }} className="text-xl" />
        </div>
      </div>
    </motion.div>
  )
}
