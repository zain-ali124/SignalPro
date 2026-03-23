import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import {
  RiMoonLine, RiSunLine, RiMenuLine, RiCloseLine,
  RiBarChartLine, RiUser3Line, RiLogoutBoxLine
} from 'react-icons/ri'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing',  href: '/#pricing'  },
    { label: 'Signals',  href: '/#signals'  },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-dark-800/90 backdrop-blur-xl border-b border-white/5 shadow-glass'
            : 'bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-orange-gradient flex items-center justify-center shadow-orange-glow-sm group-hover:shadow-orange-glow transition-all duration-300">
              <RiBarChartLine className="text-white text-base" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Signal</span>
              <span className="text-orange-500">Pro</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
                  isDark
                    ? 'text-white/60 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isDark ? 'text-white/60 hover:text-white hover:bg-white/8' : 'text-gray-500 hover:text-gray-900 hover:bg-black/6'
              }`}
            >
              {isDark ? <RiSunLine className="text-lg" /> : <RiMoonLine className="text-lg" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200"
                  style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.07)' }}
                >
                  <div className="w-7 h-7 rounded-full bg-orange-gradient flex items-center justify-center text-xs font-display font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-glass overflow-hidden z-50 ${
                        isDark ? 'bg-dark-700 border-white/8' : 'bg-white border-black/8'
                      }`}
                    >
                      <Link
                        to={user.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setDropOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          isDark ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-black/4'
                        }`}
                      >
                        <RiUser3Line /> {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm w-full text-left text-red-400 hover:bg-red-500/8 transition-colors"
                      >
                        <RiLogoutBoxLine /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-orange text-sm py-2 px-4">Get Started</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden w-9 h-9 rounded-lg flex items-center justify-center ${
                isDark ? 'text-white/70 hover:bg-white/8' : 'text-gray-600 hover:bg-black/6'
              }`}
            >
              {mobileOpen ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${isDark ? 'bg-dark-800 border-white/5' : 'bg-white border-black/8'}`}
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isDark ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {!user && (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost text-sm text-center mt-2">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-orange text-sm text-center">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
