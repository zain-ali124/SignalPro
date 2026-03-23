import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import { RiEditLine, RiCheckLine, RiCloseLine } from 'react-icons/ri'

const PKG_ICONS = { bronze: '🥉', silver: '🥈', gold: '🥇', diamond: '💎' }

export default function AdminPackages() {
  const { isDark } = useTheme()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/admin/packages').then(r => setPackages(r.data.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const startEdit = (pkg) => {
    setEditId(pkg._id)
    setEditForm({ price: pkg.price, signalsPerDay: pkg.signalsPerDay, features: pkg.features?.join('\n') || '', isPopular: pkg.isPopular })
  }

  const cancelEdit = () => { setEditId(null); setEditForm({}) }

  const saveEdit = async (id) => {
    setSaving(true)
    try {
      await api.put(`/admin/packages/${id}`, {
        price: Number(editForm.price),
        signalsPerDay: Number(editForm.signalsPerDay),
        features: editForm.features.split('\n').filter(Boolean),
        isPopular: editForm.isPopular,
      })
      toast.success('Package updated!')
      const res = await api.get('/admin/packages')
      setPackages(res.data.data)
      cancelEdit()
    } catch { toast.error('Failed to update.') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Packages</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>Edit pricing, features, and limits.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_,i) => <div key={i} className={`h-64 rounded-2xl shimmer ${isDark ? 'bg-dark-700' : 'bg-white'}`} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{PKG_ICONS[pkg.name]}</span>
                  <h3 className={`font-display font-bold text-lg capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>{pkg.displayName}</h3>
                </div>
                {editId !== pkg._id ? (
                  <button onClick={() => startEdit(pkg)} className={`p-1.5 rounded-lg ${isDark ? 'text-white/40 hover:text-white hover:bg-white/8' : 'text-gray-400 hover:text-gray-700'}`}>
                    <RiEditLine />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button onClick={() => saveEdit(pkg._id)} disabled={saving} className="p-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25">
                      {saving ? <span className="w-3 h-3 border border-green-400/30 border-t-green-400 rounded-full animate-spin block" /> : <RiCheckLine />}
                    </button>
                    <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><RiCloseLine /></button>
                  </div>
                )}
              </div>

              {editId === pkg._id ? (
                <div className="space-y-3">
                  <div>
                    <label className={`text-xs font-display font-semibold block mb-1 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>Price ($/month)</label>
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className={isDark ? 'input-dark' : 'input-light'} />
                  </div>
                  <div>
                    <label className={`text-xs font-display font-semibold block mb-1 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>Signals/Day</label>
                    <input type="number" value={editForm.signalsPerDay} onChange={e => setEditForm({...editForm, signalsPerDay: e.target.value})} className={isDark ? 'input-dark' : 'input-light'} />
                  </div>
                  <div>
                    <label className={`text-xs font-display font-semibold block mb-1 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>Features (one per line)</label>
                    <textarea rows={4} value={editForm.features} onChange={e => setEditForm({...editForm, features: e.target.value})} className={`${isDark ? 'input-dark' : 'input-light'} resize-none text-xs`} />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editForm.isPopular} onChange={e => setEditForm({...editForm, isPopular: e.target.checked})} className="accent-orange-500" />
                    <span className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Mark as Popular</span>
                  </label>
                </div>
              ) : (
                <>
                  <p className="text-orange-400 font-display font-bold text-3xl mb-1">${pkg.price}<span className={`text-sm font-normal ${isDark ? 'text-white/35' : 'text-gray-400'}`}>/mo</span></p>
                  <p className={`text-xs mb-4 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
                    {pkg.signalsPerDay >= 999999 ? '∞ Unlimited' : `${pkg.signalsPerDay} signals`}/day
                  </p>
                  <ul className="space-y-2">
                    {pkg.features?.slice(0,4).map((f, i) => (
                      <li key={i} className={`text-xs flex items-start gap-1.5 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>
                        <span className="text-orange-400 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  {pkg.isPopular && <div className="mt-3 text-xs text-center text-orange-400 font-semibold bg-orange-500/8 rounded-lg py-1">⭐ Most Popular</div>}
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
