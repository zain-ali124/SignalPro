import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import { RiCheckLine, RiCloseLine, RiEyeLine } from 'react-icons/ri'

export default function AdminPayments() {
  const { isDark } = useTheme()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [preview, setPreview] = useState(null)

  useEffect(() => { fetchPayments() }, [filter])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/payments${filter ? `?status=${filter}` : ''}`)
      setPayments(res.data.data || [])
    } catch { } finally { setLoading(false) }
  }

  const approve = async (id) => {
    try {
      await api.put(`/payments/${id}/approve`)
      toast.success('Payment approved! User activated.')
      fetchPayments()
    } catch { toast.error('Failed.') }
  }

  const reject = async (id) => {
    const reason = prompt('Rejection reason (optional):')
    try {
      await api.put(`/payments/${id}/reject`, { reason: reason || 'Payment could not be verified.' })
      toast.success('Payment rejected.')
      fetchPayments()
    } catch { toast.error('Failed.') }
  }

  const statusClass = { approved: 'badge-active', pending: 'badge-pending', rejected: 'badge-rejected' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment Verification</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>Review and approve payment proofs.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['pending','approved','rejected',''].map((s, i) => (
          <button key={i} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-display font-semibold capitalize transition-all ${
              filter === s ? 'bg-orange-gradient text-white' : isDark ? 'bg-white/6 text-white/50 hover:bg-white/10' : 'bg-black/6 text-gray-500'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={`rounded-2xl h-48 shimmer ${isDark ? 'bg-dark-700' : 'bg-white'}`} />
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}>
          <table className="data-table">
            <thead>
              <tr><th>User</th><th>Package</th><th>Amount</th><th>Status</th><th>Date</th><th>Proof</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={7} className={`text-center py-10 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>No payments found</td></tr>
              ) : payments.map((p, i) => (
                <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.userId?.name || 'Unknown'}</p>
                      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{p.userId?.email}</p>
                    </div>
                  </td>
                  <td><span className={`capitalize text-sm font-semibold text-orange-400`}>{p.package}</span></td>
                  <td className={`font-display font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>${p.amount}</td>
                  <td><span className={statusClass[p.status]}>{p.status}</span></td>
                  <td className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <button onClick={() => setPreview(p.screenshot?.url)} className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400">
                      <RiEyeLine /> View
                    </button>
                  </td>
                  <td>
                    {p.status === 'pending' && (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => approve(p._id)} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors">
                          <RiCheckLine /> Approve
                        </button>
                        <button onClick={() => reject(p._id)} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-red-500/12 text-red-400 hover:bg-red-500/20 transition-colors">
                          <RiCloseLine /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div onClick={() => setPreview(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={preview} alt="Payment proof"
            className="max-w-lg w-full rounded-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
