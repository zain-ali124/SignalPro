import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import { RiWalletLine, RiEyeLine } from 'react-icons/ri'

export default function PaymentHistory() {
  const { isDark } = useTheme()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    api.get('/payments/my')
      .then(r => setPayments(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusClass = {
    approved: 'badge-active',
    pending:  'badge-pending',
    rejected: 'badge-rejected',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment History</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>Track your subscription payments and their status.</p>
      </div>

      {loading ? (
        <div className={`rounded-2xl h-48 shimmer ${isDark ? 'bg-dark-700' : 'bg-white'}`} />
      ) : payments.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8'}`}>
          <RiWalletLine className="text-4xl text-orange-500/30 mx-auto mb-3" />
          <p className={isDark ? 'text-white/45' : 'text-gray-500'}>No payment records found.</p>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-dark-700 border-white/6' : 'bg-white border-black/8 shadow-sm'}`}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Proof</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td>
                    <span className={`font-display font-semibold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {p.package}
                    </span>
                  </td>
                  <td className="text-orange-400 font-display font-semibold">${p.amount}</td>
                  <td><span className={statusClass[p.status] || 'badge-pending'}>{p.status}</span></td>
                  <td className={`text-xs ${isDark ? 'text-white/45' : 'text-gray-400'}`}>
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <button
                      onClick={() => setPreview(p.screenshot?.url)}
                      className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 transition-colors"
                    >
                      <RiEyeLine /> View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image preview modal */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={preview}
            alt="Payment proof"
            className="max-w-lg w-full rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
