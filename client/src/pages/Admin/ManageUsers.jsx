import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import { RiSearchLine, RiUserLine, RiRefreshLine } from 'react-icons/ri'

export default function ManageUsers() {
  const { isDark } = useTheme()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => { fetchUsers() }, [search, statusFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)
      const res = await api.get(`/admin/users?${params}`)
      setUsers(res.data.data || [])
    } catch { } finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status })
      toast.success(`User ${status}`)
      fetchUsers()
    } catch { toast.error('Failed.') }
  }

  const updatePackage = async (id, pkg) => {
    try {
      await api.put(`/admin/users/${id}/package`, { package: pkg })
      toast.success('Package updated!')
      fetchUsers()
    } catch { toast.error('Failed.') }
  }

  const statusClass = { active: 'badge-active', pending: 'badge-pending', rejected: 'badge-rejected', suspended: 'badge-suspended' }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Users</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>{users.length} users found</p>
        </div>
        <button onClick={fetchUsers} className="btn-ghost text-sm py-2 px-4 flex items-center gap-2"><RiRefreshLine /> Refresh</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <RiSearchLine className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-sm ${isDark ? 'text-white/35' : 'text-gray-400'}`} />
          <input
            placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className={`${isDark ? 'input-dark' : 'input-light'} pl-9`}
          />
        </div>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className={`${isDark ? 'input-dark' : 'input-light'} sm:w-44`}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className={`rounded-2xl h-48 shimmer ${isDark ? 'bg-dark-700' : 'bg-white'}`} />
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}>
          <table className="data-table">
            <thead>
              <tr><th>User</th><th>Package</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} className={`text-center py-10 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>No users found</td></tr>
              ) : users.map((u, i) => (
                <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-gradient flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{u.name}</p>
                        <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      value={u.package}
                      onChange={e => updatePackage(u._id, e.target.value)}
                      className={`text-xs rounded-lg px-2 py-1.5 capitalize outline-none cursor-pointer ${isDark ? 'bg-white/8 text-white border border-white/10' : 'bg-black/5 text-gray-700 border border-black/10'}`}
                    >
                      {['none','bronze','silver','gold','diamond'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  <td><span className={statusClass[u.accountStatus] || 'badge-pending'}>{u.accountStatus}</span></td>
                  <td className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {u.accountStatus !== 'active' && (
                        <button onClick={() => updateStatus(u._id, 'active')} className="text-xs px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors">Activate</button>
                      )}
                      {u.accountStatus !== 'suspended' && (
                        <button onClick={() => updateStatus(u._id, 'suspended')} className="text-xs px-2.5 py-1 rounded-lg bg-red-500/12 text-red-400 hover:bg-red-500/20 transition-colors">Suspend</button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
