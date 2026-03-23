import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { RiBarChartLine, RiTwitterLine, RiTelegramLine, RiDiscordLine } from 'react-icons/ri'

export default function Footer() {
  const { isDark } = useTheme()

  return (
    <footer className={`border-t ${isDark ? 'bg-dark-800 border-white/5' : 'bg-white border-black/8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-gradient flex items-center justify-center">
                <RiBarChartLine className="text-white text-base" />
              </div>
              <span className="font-display font-bold text-lg">
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Signal</span>
                <span className="text-orange-500">Pro</span>
              </span>
            </div>
            <p className={`text-sm leading-relaxed max-w-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              AI-powered trading signals with expert analysis. Step into the future of crypto trading.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[RiTwitterLine, RiTelegramLine, RiDiscordLine].map((Icon, i) => (
                <a key={i} href="#" className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isDark ? 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10' : 'bg-black/5 text-gray-500 hover:text-gray-900'
                }`}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`font-display font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Platform</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Signals', 'TradingView'].map(item => (
                <li key={item}>
                  <a href="#" className={`text-sm transition-colors ${isDark ? 'text-white/50 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-display font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Account</h4>
            <ul className="space-y-2">
              {[['Login', '/login'], ['Register', '/register'], ['Dashboard', '/dashboard']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className={`text-sm transition-colors ${isDark ? 'text-white/50 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-white/5' : 'border-black/6'}`}>
          <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            © 2025 SignalPro. All rights reserved.
          </p>
          <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  )
}
