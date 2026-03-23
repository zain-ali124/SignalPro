import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { RiCheckLine } from 'react-icons/ri'

const packageColors = {
  bronze:  { hex: '#cd7f32', glow: 'rgba(205,127,50,0.3)',  label: '🥉' },
  silver:  { hex: '#c0c0c0', glow: 'rgba(192,192,192,0.25)', label: '🥈' },
  gold:    { hex: '#f97316', glow: 'rgba(249,115,22,0.35)',  label: '🥇' },
  diamond: { hex: '#b9f2ff', glow: 'rgba(185,242,255,0.3)',  label: '💎' },
}

export default function PricingCard({ pkg, index = 0 }) {
  const { isDark } = useTheme()
  const c = packageColors[pkg.name] || packageColors.gold
  const isPopular = pkg.isPopular

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col ${
        isPopular
          ? 'border-orange-500/50 shadow-orange-glow'
          : isDark
            ? 'border-white/8'
            : 'border-black/8 shadow-card'
      } ${isDark ? 'bg-dark-700' : 'bg-white'}`}
      style={isPopular ? { boxShadow: `0 0 30px ${c.glow}` } : {}}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-display font-bold text-white bg-orange-gradient shadow-orange-glow-sm">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{c.label}</span>
          <h3 className={`font-display font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {pkg.displayName}
          </h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-bold text-4xl" style={{ color: c.hex }}>
            ${pkg.price}
          </span>
          <span className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>/month</span>
        </div>
        <p className={`text-sm mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
          {pkg.signalsPerDay >= 999999 ? 'Unlimited' : `${pkg.signalsPerDay} signals`} per day
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-6">
        {pkg.features?.map((feat, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
              style={{ background: `${c.hex}22`, border: `1px solid ${c.hex}44` }}>
              <RiCheckLine className="text-[10px]" style={{ color: c.hex }} />
            </div>
            <span className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{feat}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        to={`/register?package=${pkg.name}`}
        className={`w-full py-3 rounded-xl font-display font-semibold text-sm text-center transition-all duration-300 ${
          isPopular
            ? 'btn-orange'
            : isDark
              ? 'border border-white/10 text-white/80 hover:border-orange-500/40 hover:text-white hover:bg-white/4'
              : 'border border-black/10 text-gray-700 hover:border-orange-500/40 hover:text-orange-500'
        }`}
      >
        Get {pkg.displayName}
      </Link>
    </motion.div>
  )
}
