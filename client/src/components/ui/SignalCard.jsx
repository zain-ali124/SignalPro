import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { RiArrowUpLine, RiArrowDownLine, RiTimeLine } from 'react-icons/ri'

export default function SignalCard({ signal, index = 0 }) {
  const { isDark } = useTheme()
  const isBuy = signal.signalType === 'BUY'

  const formatPrice = (p) => Number(p).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })

  const resultColors = {
    WIN:       { bg: 'rgba(34,197,94,0.1)',   text: '#22c55e' },
    LOSS:      { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444' },
    PENDING:   { bg: 'rgba(249,115,22,0.1)',  text: '#f97316' },
    CANCELLED: { bg: 'rgba(107,114,128,0.1)', text: '#9ca3af' },
  }

  const rc = resultColors[signal.result] || resultColors.PENDING

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${
        isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {signal.pair}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={isBuy ? 'badge-buy' : 'badge-sell'}>
              {isBuy ? '▲' : '▼'} {signal.signalType}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: rc.bg, color: rc.text }}>
              {signal.result}
            </span>
          </div>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${isBuy ? 'bg-green-500/12' : 'bg-red-500/12'}`}
        >
          {isBuy
            ? <RiArrowUpLine className="text-green-400 text-xl" />
            : <RiArrowDownLine className="text-red-400 text-xl" />
          }
        </div>
      </div>

      {/* Price grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Entry',       value: formatPrice(signal.entryPrice), color: isDark ? 'text-white' : 'text-gray-900' },
          { label: 'Stop Loss',   value: formatPrice(signal.stopLoss),   color: 'text-red-400' },
          { label: 'Take Profit', value: formatPrice(signal.takeProfit), color: 'text-green-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`p-2.5 rounded-xl text-center ${isDark ? 'bg-white/4' : 'bg-black/4'}`}>
            <p className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{label}</p>
            <p className={`text-sm font-display font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Target levels */}
      {signal.targetLevels?.length > 0 && (
        <div className="mb-3">
          <p className={`text-xs mb-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Target Levels</p>
          <div className="flex flex-wrap gap-2">
            {signal.targetLevels.map((t, i) => (
              <span
                key={i}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                  t.hit
                    ? 'bg-green-500/15 text-green-400'
                    : isDark ? 'bg-white/6 text-white/60' : 'bg-black/5 text-gray-600'
                }`}
              >
                {t.level}: {formatPrice(t.price)} {t.hit && '✓'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {signal.description && (
        <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
          {signal.description}
        </p>
      )}

      {/* Footer */}
      <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
        <RiTimeLine />
        {new Date(signal.createdAt).toLocaleString('en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })}
        {signal.profitPercent != null && (
          <span className={`ml-auto font-semibold ${signal.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
            {signal.result === 'WIN' ? '+' : ''}{signal.profitPercent}%
          </span>
        )}
      </div>
    </motion.div>
  )
}
