import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  RiBarChartLine, RiDashboardLine, RiSignalTowerLine,
  RiLineChartLine, RiWalletLine, RiUser3Line,
  RiLogoutBoxLine, RiAdminLine, RiGroupLine,
  RiMoneyDollarCircleLine, RiPriceTagLine
} from 'react-icons/ri'

const userLinks = [
  { to: '/dashboard',            icon: RiDashboardLine,          label: 'Dashboard'    },
  { to: '/dashboard/signals',    icon: RiSignalTowerLine,         label: 'Signals'      },
  { to: '/dashboard/chart',      icon: RiLineChartLine,           label: 'Live Chart'   },
  { to: '/dashboard/payments',   icon: RiWalletLine,              label: 'Payments'     },
  { to: '/dashboard/profile',    icon: RiUser3Line,               label: 'Profile'      },
]

const adminLinks = [
  { to: '/admin',                icon: RiDashboardLine,           label: 'Dashboard'    },
  { to: '/admin/signals',        icon: RiSignalTowerLine,         label: 'Signals'      },
  { to: '/admin/users',          icon: RiGroupLine,               label: 'Users'        },
  { to: '/admin/payments',       icon: RiMoneyDollarCircleLine,   label: 'Payments'     },
  { to: '/admin/packages',       icon: RiPriceTagLine,            label: 'Packages'     },
]

export default function Sidebar({ collapsed = false }) {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const links = user?.role === 'admin' ? adminLinks : userLinks

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const base = isDark
    ? 'bg-dark-800 border-white/5'
    : 'bg-white border-black/8 shadow-sm'

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed left-0 top-0 h-full z-40 border-r flex flex-col transition-all duration-300 ${base} ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b ${isDark ? 'border-white/5' : 'border-black/6'}`}>
        <div className="w-8 h-8 rounded-lg bg-orange-gradient flex items-center justify-center shadow-orange-glow-sm flex-shrink-0">
          <RiBarChartLine className="text-white text-base" />
        </div>
        {!collapsed && (
          <span className="font-display font-bold text-lg">
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Signal</span>
            <span className="text-orange-500">Pro</span>
          </span>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className={`mx-3 mt-4 p-3 rounded-xl ${isDark ? 'bg-white/4 border border-white/6' : 'bg-black/4 border border-black/6'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-gradient flex items-center justify-center text-sm font-display font-bold text-white flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-display font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user?.name}
              </p>
              <p className="text-xs capitalize" style={{ color: '#f97316' }}>
                {user?.role === 'admin' ? '👑 Admin' : `📦 ${user?.package || 'No Package'}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${isDark ? '' : 'text-gray-600 hover:text-gray-900'}`
            }
          >
            <Icon className="text-lg flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className={`p-3 border-t ${isDark ? 'border-white/5' : 'border-black/6'}`}>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:bg-red-500/8 hover:text-red-400"
        >
          <RiLogoutBoxLine className="text-lg flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}
