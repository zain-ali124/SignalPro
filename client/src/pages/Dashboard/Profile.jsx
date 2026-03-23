import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import { RiUser3Line, RiLockLine, RiEditLine, RiCheckLine } from 'react-icons/ri'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { isDark } = useTheme()
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', name)
      const res = await api.put('/users/profile', fd)
      updateUser(res.data.data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwdForm.newPassword !== pwdForm.confirm) { toast.error('Passwords do not match.'); return }
    if (pwdForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await api.put('/users/change-password', { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword })
      toast.success('Password changed!')
      setPwdForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Settings</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>Manage your account details and password.</p>
      </div>

      {/* Avatar */}
      <div className={`flex items-center gap-4 p-5 rounded-2xl border ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}>
        <div className="w-16 h-16 rounded-2xl bg-orange-gradient flex items-center justify-center text-2xl font-display font-bold text-white shadow-orange-glow-sm">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
          <p className={`text-sm ${isDark ? 'text-white/45' : 'text-gray-500'}`}>{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`badge-${user?.accountStatus}`}>{user?.accountStatus}</span>
            <span className="text-xs text-orange-400 font-semibold capitalize">{user?.package} plan</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
        {[
          { id: 'profile', label: 'Profile Info', icon: RiUser3Line },
          { id: 'password', label: 'Change Password', icon: RiLockLine },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-display font-semibold transition-all duration-200 ${
              tab === t.id
                ? 'bg-orange-gradient text-white shadow-orange-glow-sm'
                : isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <t.icon /> {t.label}
          </button>
        ))}
      </div>

      {/* Profile form */}
      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleUpdateProfile} className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}>
            <div>
              <label className={`block text-xs font-display font-semibold mb-1.5 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className={isDark ? 'input-dark' : 'input-light'} />
            </div>
            <div>
              <label className={`block text-xs font-display font-semibold mb-1.5 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Email Address</label>
              <input value={user?.email} disabled className={`${isDark ? 'input-dark' : 'input-light'} opacity-50 cursor-not-allowed`} />
              <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Email cannot be changed.</p>
            </div>
            <button type="submit" disabled={loading} className="btn-orange py-3 px-6 flex items-center gap-2 disabled:opacity-50">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiCheckLine />}
              Save Changes
            </button>
          </form>
        </motion.div>
      )}

      {/* Password form */}
      {tab === 'password' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleChangePassword} className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}>
            {[
              { label: 'Current Password', key: 'currentPassword', placeholder: '••••••••' },
              { label: 'New Password',     key: 'newPassword',     placeholder: 'Min 6 characters' },
              { label: 'Confirm Password', key: 'confirm',         placeholder: 'Repeat new password' },
            ].map(f => (
              <div key={f.key}>
                <label className={`block text-xs font-display font-semibold mb-1.5 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{f.label}</label>
                <input
                  type="password" placeholder={f.placeholder}
                  value={pwdForm[f.key]}
                  onChange={e => setPwdForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className={isDark ? 'input-dark' : 'input-light'}
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-orange py-3 px-6 flex items-center gap-2 disabled:opacity-50">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiLockLine />}
              Change Password
            </button>
          </form>
        </motion.div>
      )}
    </div>
  )
}
