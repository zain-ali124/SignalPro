import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useTheme } from '../../context/ThemeContext'
import { RiMenuLine, RiSunLine, RiMoonLine } from 'react-icons/ri'

export default function DashboardLayout() {
  const { isDark, toggleTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <Sidebar collapsed={collapsed} />

      {/* Main content area */}
      <div className={`transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top bar */}
        <div className={`sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b backdrop-blur-xl ${
          isDark ? 'bg-dark-900/80 border-white/5' : 'bg-white/80 border-black/8'
        }`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isDark ? 'text-white/60 hover:text-white hover:bg-white/8' : 'text-gray-500 hover:text-gray-900 hover:bg-black/6'
            }`}
          >
            <RiMenuLine />
          </button>

          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isDark ? 'text-white/60 hover:text-white hover:bg-white/8' : 'text-gray-500 hover:text-gray-900 hover:bg-black/6'
            }`}
          >
            {isDark ? <RiSunLine /> : <RiMoonLine />}
          </button>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
