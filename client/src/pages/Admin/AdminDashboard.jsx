import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import StatCard from '../../components/ui/StatCard'
import api from '../../services/api'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { RiGroupLine, RiUserLine, RiTimeLine, RiMoneyDollarCircleLine, RiSignalTowerLine } from 'react-icons/ri'

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const PKG_COLORS = { bronze: '#cd7f32', silver: '#c0c0c0', gold: '#f97316', diamond: '#b9f2ff', none: '#374151' }

export default function AdminDashboard() {
  const { isDark } = useTheme()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const monthlyData = stats?.monthlyUsers?.map(m => ({
    month: MONTH_NAMES[m._id - 1],
    users: m.count
  })) || []

  const pkgData = stats?.packageStats?.map(p => ({
    name: p._id || 'none',
    value: p.count,
    color: PKG_COLORS[p._id] || '#374151'
  })) || []

  const tooltipStyle = {
    backgroundColor: isDark ? '#12121e' : '#fff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    borderRadius: '12px',
    color: isDark ? '#fff' : '#111',
    fontSize: '12px',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>Overview of your platform performance.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className={`h-28 rounded-2xl shimmer ${isDark ? 'bg-dark-700' : 'bg-white'}`} />)}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            <StatCard icon={RiGroupLine}             label="Total Users"      value={stats?.totalUsers ?? 0}      color="blue"   delay={0}    />
            <StatCard icon={RiUserLine}         label="Active Users"     value={stats?.activeUsers ?? 0}     color="green"  delay={0.05} />
            <StatCard icon={RiTimeLine}              label="Pending Payments" value={stats?.pendingPayments ?? 0} color="orange" delay={0.1}  />
            <StatCard icon={RiSignalTowerLine}       label="Signals Today"    value={stats?.totalSignalsToday ?? 0} color="purple" delay={0.15} />
            <StatCard icon={RiMoneyDollarCircleLine} label="Total Revenue"    value={`$${stats?.totalRevenue ?? 0}`} color="green" delay={0.2} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area chart */}
            <div className={`lg:col-span-2 rounded-2xl border p-5 ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}>
              <h3 className={`font-display font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>User Growth (Last 6 Months)</h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="users" stroke="#f97316" strokeWidth={2} fill="url(#userGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>No data yet</p>
                </div>
              )}
            </div>

            {/* Pie chart */}
            <div className={`rounded-2xl border p-5 ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}>
              <h3 className={`font-display font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Package Distribution</h3>
              {pkgData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={pkgData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={3}>
                        {pkgData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">
                    {pkgData.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                          <span className={`capitalize ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{p.name}</span>
                        </div>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>No data yet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
