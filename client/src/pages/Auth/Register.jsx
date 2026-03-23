import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import {
  RiBarChartLine, RiEyeLine, RiEyeOffLine,
  RiUploadCloud2Line, RiCheckLine, RiArrowRightLine, RiArrowLeftLine
} from 'react-icons/ri'

const packages = [
  { name: 'bronze',  label: 'Bronze',  price: 29,  signals: 3,      icon: '🥉', color: '#cd7f32' },
  { name: 'silver',  label: 'Silver',  price: 49,  signals: 6,      icon: '🥈', color: '#c0c0c0' },
  { name: 'gold',    label: 'Gold',    price: 99,  signals: 10,     icon: '🥇', color: '#f97316', popular: true },
  { name: 'diamond', label: 'Diamond', price: 199, signals: '∞',   icon: '💎', color: '#b9f2ff' },
]

export default function Register() {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    package: params.get('package') || 'gold',
    transactionId: '', paymentProof: null
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5MB'); return }
    set('paymentProof', file)
  }

  const handleSubmit = async () => {
    if (!form.paymentProof) { toast.error('Please upload payment proof.'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('password', form.password)
      fd.append('package', form.package)
      fd.append('transactionId', form.transactionId)
      fd.append('paymentProof', form.paymentProof)

      await api.post('/auth/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Registration submitted! Awaiting admin approval.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const selectedPkg = packages.find(p => p.name === form.package)

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? 'bg-dark-900' : 'bg-[#f8f7f4]'}`}>
      <div className="glow-orb w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-30 fixed" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-orange-gradient flex items-center justify-center shadow-orange-glow">
            <RiBarChartLine className="text-white text-base" />
          </div>
          <span className="font-display font-bold text-xl">
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Signal</span>
            <span className="text-orange-500">Pro</span>
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {['Account', 'Package', 'Payment'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold transition-all duration-300 ${
                step > i + 1 ? 'bg-orange-gradient text-white' :
                step === i + 1 ? 'bg-orange-gradient text-white shadow-orange-glow-sm' :
                isDark ? 'bg-white/8 text-white/30' : 'bg-black/8 text-gray-400'
              }`}>
                {step > i + 1 ? <RiCheckLine /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? 'text-orange-500' : isDark ? 'text-white/30' : 'text-gray-400'}`}>
                {s}
              </span>
              {i < 2 && <div className={`w-8 h-px ${step > i + 1 ? 'bg-orange-500' : isDark ? 'bg-white/10' : 'bg-black/10'}`} />}
            </div>
          ))}
        </div>

        <div className={`rounded-2xl border p-8 ${isDark ? 'bg-dark-700 border-white/8' : 'bg-white border-black/8 shadow-card'}`}>
          <AnimatePresence mode="wait">

            {/* ── Step 1: Account info ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className={`font-display font-bold text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Account</h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  Already have one? <Link to="/login" className="text-orange-500 hover:text-orange-400">Sign in</Link>
                </p>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-display font-semibold mb-1.5 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Full Name</label>
                    <input className={isDark ? 'input-dark' : 'input-light'} placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div>
                    <label className={`block text-xs font-display font-semibold mb-1.5 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Email Address</label>
                    <input type="email" className={isDark ? 'input-dark' : 'input-light'} placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  <div>
                    <label className={`block text-xs font-display font-semibold mb-1.5 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Password</label>
                    <div className="relative">
                      <input type={showPwd ? 'text' : 'password'} className={`${isDark ? 'input-dark' : 'input-light'} pr-11`} placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
                        {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                      </button>
                    </div>
                  </div>
                  <button onClick={() => { if (!form.name || !form.email || !form.password) { toast.error('All fields required'); return } setStep(2) }} className="btn-orange w-full py-3.5 flex items-center justify-center gap-2">
                    Continue <RiArrowRightLine />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Package selection ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className={`font-display font-bold text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Choose Package</h2>
                <p className={`text-sm mb-6 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Select the plan that fits your needs.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {packages.map(p => (
                    <button
                      key={p.name}
                      onClick={() => set('package', p.name)}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                        form.package === p.name
                          ? 'border-orange-500/60 bg-orange-500/8'
                          : isDark ? 'border-white/8 hover:border-white/15' : 'border-black/8 hover:border-black/20'
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2 left-2 text-[10px] font-bold text-white bg-orange-gradient px-2 py-0.5 rounded-full">Popular</span>
                      )}
                      <span className="text-xl">{p.icon}</span>
                      <p className={`font-display font-bold text-sm mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.label}</p>
                      <p className="text-orange-500 font-display font-semibold text-lg">${p.price}<span className="text-xs text-gray-400">/mo</span></p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-white/45' : 'text-gray-400'}`}>{p.signals} signals/day</p>
                      {form.package === p.name && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-gradient flex items-center justify-center">
                          <RiCheckLine className="text-white text-[10px]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost flex items-center gap-1 py-3 px-5"><RiArrowLeftLine /> Back</button>
                  <button onClick={() => setStep(3)} className="btn-orange flex-1 py-3 flex items-center justify-center gap-2">Continue <RiArrowRightLine /></button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Payment proof ── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className={`font-display font-bold text-2xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment Proof</h2>
                <p className={`text-sm mb-4 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Upload your payment screenshot for verification.</p>

                {/* Payment info */}
                <div className="p-4 rounded-xl mb-5 border" style={{ background: 'rgba(249,115,22,0.07)', borderColor: 'rgba(249,115,22,0.2)' }}>
                  <p className="text-xs text-orange-400 font-semibold mb-1">Payment Instructions</p>
                  <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-700'}`}>
                    Send <strong className="text-orange-400">${selectedPkg?.price}</strong> to our wallet and upload the screenshot below.
                  </p>
                  <p className={`text-xs mt-2 font-mono ${isDark ? 'text-white/45' : 'text-gray-400'}`}>
                    USDT (TRC20): TXxxxxxxxxxxxxxxxxxxxx
                  </p>
                </div>

                {/* File upload */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                  onClick={() => document.getElementById('proof-input').click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-4 ${
                    dragOver
                      ? 'border-orange-500 bg-orange-500/8'
                      : form.paymentProof
                        ? 'border-green-500/50 bg-green-500/6'
                        : isDark ? 'border-white/12 hover:border-orange-500/40 hover:bg-orange-500/4' : 'border-black/12 hover:border-orange-400/40'
                  }`}
                >
                  <input id="proof-input" type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                  {form.paymentProof ? (
                    <>
                      <RiCheckLine className="text-green-400 text-3xl mx-auto mb-2" />
                      <p className="text-sm text-green-400 font-medium">{form.paymentProof.name}</p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>Click to change</p>
                    </>
                  ) : (
                    <>
                      <RiUploadCloud2Line className={`text-3xl mx-auto mb-2 ${isDark ? 'text-white/30' : 'text-gray-300'}`} />
                      <p className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Drop image here or click to browse</p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>JPG, PNG, WEBP — max 5MB</p>
                    </>
                  )}
                </div>

                <div className="mb-5">
                  <label className={`block text-xs font-display font-semibold mb-1.5 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>Transaction ID (optional)</label>
                  <input className={isDark ? 'input-dark' : 'input-light'} placeholder="e.g. TXN123456" value={form.transactionId} onChange={e => set('transactionId', e.target.value)} />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost flex items-center gap-1 py-3 px-5"><RiArrowLeftLine /> Back</button>
                  <button onClick={handleSubmit} disabled={loading} className="btn-orange flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : <>Submit Registration <RiCheckLine /></>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
