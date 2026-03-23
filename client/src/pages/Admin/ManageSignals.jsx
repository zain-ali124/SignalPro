import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import { RiAddLine, RiEditLine, RiDeleteBin6Line, RiCloseLine, RiCheckLine } from 'react-icons/ri'

const empty = { pair: '', entryPrice: '', stopLoss: '', takeProfit: '', signalType: 'BUY', description: '', visibleTo: ['bronze','silver','gold','diamond'] }

export default function ManageSignals() {
  const { isDark } = useTheme()
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSignals() }, [])

  const fetchSignals = async () => {
    setLoading(true)
    try {
      const res = await api.get('/signals/all')
      setSignals(res.data.data || [])
    } catch { } finally { setLoading(false) }
  }

  const openCreate = () => { setForm(empty); setEditId(null); setModal(true) }
  const openEdit = (s) => {
    setForm({ pair: s.pair, entryPrice: s.entryPrice, stopLoss: s.stopLoss, takeProfit: s.takeProfit, signalType: s.signalType, description: s.description || '', visibleTo: s.visibleTo || ['bronze','silver','gold','diamond'] })
    setEditId(s._id)
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/signals/${editId}`, form)
        toast.success('Signal updated!')
      } else {
        await api.post('/signals', form)
        toast.success('Signal created!')
      }
      setModal(false)
      fetchSignals()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this signal?')) return
    try {
      await api.delete(`/signals/${id}`)
      toast.success('Deleted.')
      fetchSignals()
    } catch { toast.error('Failed to delete.') }
  }

  const toggleVisible = (pkg) => {
    setForm(f => ({
      ...f,
      visibleTo: f.visibleTo.includes(pkg) ? f.visibleTo.filter(p => p !== pkg) : [...f.visibleTo, pkg]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Signals</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>{signals.length} total signals</p>
        </div>
        <button onClick={openCreate} className="btn-orange text-sm py-2.5 px-5 flex items-center gap-2">
          <RiAddLine /> New Signal
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className={`rounded-2xl h-48 shimmer ${isDark ? 'bg-dark-700' : 'bg-white'}`} />
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Pair</th><th>Type</th><th>Entry</th><th>SL</th><th>TP</th><th>Result</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {signals.length === 0 ? (
                <tr><td colSpan={8} className={`text-center py-10 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>No signals yet. Create one!</td></tr>
              ) : signals.map((s, i) => (
                <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td className={`font-display font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.pair}</td>
                  <td><span className={s.signalType === 'BUY' ? 'badge-buy' : 'badge-sell'}>{s.signalType}</span></td>
                  <td className={isDark ? 'text-white/70' : 'text-gray-700'}>{Number(s.entryPrice).toLocaleString()}</td>
                  <td className="text-red-400">{Number(s.stopLoss).toLocaleString()}</td>
                  <td className="text-green-400">{Number(s.takeProfit).toLocaleString()}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.result === 'WIN' ? 'bg-green-500/15 text-green-400' :
                      s.result === 'LOSS' ? 'bg-red-500/15 text-red-400' :
                      'bg-orange-500/15 text-orange-400'
                    }`}>{s.result}</span>
                  </td>
                  <td className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-white/40 hover:text-white hover:bg-white/8' : 'text-gray-400 hover:text-gray-700'}`}><RiEditLine /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-colors"><RiDeleteBin6Line /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg rounded-2xl border p-6 ${isDark ? 'bg-dark-700 border-white/8' : 'bg-white border-black/8'}`}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {editId ? 'Edit Signal' : 'Create Signal'}
                </h3>
                <button onClick={() => setModal(false)} className={`p-1.5 rounded-lg ${isDark ? 'text-white/40 hover:text-white hover:bg-white/8' : 'text-gray-400 hover:text-gray-700'}`}><RiCloseLine className="text-xl" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-display font-semibold block mb-1 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>Pair</label>
                    <input className={isDark ? 'input-dark' : 'input-light'} placeholder="BTC/USDT" value={form.pair} onChange={e => setForm({...form, pair: e.target.value})} required />
                  </div>
                  <div>
                    <label className={`text-xs font-display font-semibold block mb-1 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>Type</label>
                    <select value={form.signalType} onChange={e => setForm({...form, signalType: e.target.value})} className={isDark ? 'input-dark' : 'input-light'}>
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                  {[['entryPrice','Entry Price'],['stopLoss','Stop Loss'],['takeProfit','Take Profit']].map(([key, label]) => (
                    <div key={key}>
                      <label className={`text-xs font-display font-semibold block mb-1 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>{label}</label>
                      <input type="number" step="any" className={isDark ? 'input-dark' : 'input-light'} placeholder="0.00" value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} required />
                    </div>
                  ))}
                </div>

                <div>
                  <label className={`text-xs font-display font-semibold block mb-1 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>Description (optional)</label>
                  <textarea rows={2} className={`${isDark ? 'input-dark' : 'input-light'} resize-none`} placeholder="Signal analysis..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div>
                  <label className={`text-xs font-display font-semibold block mb-2 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>Visible To</label>
                  <div className="flex flex-wrap gap-2">
                    {['bronze','silver','gold','diamond'].map(pkg => (
                      <button type="button" key={pkg} onClick={() => toggleVisible(pkg)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                          form.visibleTo.includes(pkg) ? 'bg-orange-gradient text-white' : isDark ? 'bg-white/8 text-white/50' : 'bg-black/8 text-gray-500'
                        }`}
                      >
                        {form.visibleTo.includes(pkg) && <RiCheckLine className="inline mr-1" />}{pkg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-orange flex-1 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiCheckLine />}
                    {editId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
