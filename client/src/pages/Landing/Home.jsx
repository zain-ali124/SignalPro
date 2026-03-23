import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import PricingCard from '../../components/ui/PricingCard'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import {
  RiArrowRightLine, RiSwapLine, RiFocus2Line,
  RiCoinLine, RiPulseLine, RiShieldStarLine, RiBarChartBoxLine,
  RiFlashlightLine, RiStackLine, RiExchangeFundsLine
} from 'react-icons/ri'

// --- Data ---
const floatingBadges = [
  { text: 'Bitora', top: '20%', left: '15%', delay: 0, icon: RiCoinLine },
  { text: 'Chainly', top: '32%', left: '22%', delay: 1.5, icon: RiPulseLine },
  { text: 'Coinza', top: '22%', right: '15%', delay: 0.5, icon: RiFocus2Line },
  { text: 'Nexbit', top: '35%', right: '20%', delay: 2, icon: RiShieldStarLine },
]

// --- Leaderboard Data (from image) ---
const leaderboardUsers = [
  { name: 'Robert Brien', balance: '$28,659.35', btc: '$26,650.95', eth: '$25,651.25', neo: '$25,651.25' },
  { name: 'Country Henry', balance: '$1,856.20', btc: '$1,856.20', eth: '$1,856.20', neo: '$1,856.20' },
  { name: 'Cody Fisher', balance: '$0.51', btc: '$0.51', eth: '$0.51', neo: '$0.51' },
  { name: 'Dianne Robertson', balance: '$300.75', btc: '$300.75', eth: '$300.75', neo: '$300.75' },
]

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function Home() {
  const { isDark } = useTheme()
  const [packages, setPackages] = useState([])
  const { scrollYProgress } = useScroll()
  
  // Parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacityBg = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.3])

  // Refs for scroll-triggered animations
  const featuresRef = useRef(null)
  const leaderboardRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })
  const leaderboardInView = useInView(leaderboardRef, { once: true, amount: 0.2 })

  useEffect(() => {
    api.get('/admin/packages').then(r => setPackages(r.data.data)).catch(() => {
      setPackages([
        { _id: '1', name: 'bronze',  displayName: 'Bronze',  price: 29,  features: ['3 Signals/Day','Live Charts','Email Support'] },
        { _id: '2', name: 'silver',  displayName: 'Silver',  price: 49,  features: ['6 Signals/Day','Live Charts','Daily Analysis'] },
        { _id: '3', name: 'gold',    displayName: 'Gold',    price: 99,  isPopular: true, features: ['10 Signals/Day','Live Charts','Premium Analysis','Priority Support'] },
        { _id: '4', name: 'diamond', displayName: 'Diamond', price: 199, features: ['Unlimited Signals','VIP Analysis','24/7 Support','Telegram VIP'] },
      ])
    })
  }, [])

  return (
    <div className={`min-h-screen font-sans selection:bg-orange-500/30 overflow-x-hidden ${isDark ? 'bg-[#050505]' : 'bg-[#f9f8f6]'}`}>
      <Navbar />

      {/* ── HERO SECTION ──────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden">
        
        {/* Prominent Orange Background Element - Made More Visible */}
        <motion.div 
          style={{ y: yBg, opacity: opacityBg }} 
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        >
          {/* Main orange vortex - larger and more prominent */}
          <motion.div 
            animate={{ 
              rotate: 360, 
              scale: [1, 1.3, 1],
            }}
            transition={{ 
              duration: 50, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-[1200px] h-[1200px] rounded-full border-[150px] border-orange-500/20 blur-[100px] top-[-30%] opacity-80"
          />
          
          {/* Secondary orange glow - more intense */}
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1], 
              opacity: [0.4, 0.7, 0.4] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-[900px] h-[900px] bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded-full blur-[150px] top-[-10%] mix-blend-screen"
          />
          
          {/* Additional orange accent rings */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute w-[1500px] h-[1500px] rounded-full border border-orange-500/10 top-[-40%]"
          />
        </motion.div>

        {/* Floating Badges with smooth animation */}
        {floatingBadges.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
            transition={{ 
              opacity: { delay: badge.delay, duration: 1 },
              scale: { delay: badge.delay, duration: 0.8 },
              y: { repeat: Infinity, duration: 8 + i, ease: "easeInOut", delay: badge.delay }
            }}
            className={`hidden lg:flex absolute items-center gap-2 px-5 py-2.5 rounded-full border backdrop-blur-md z-10 text-sm font-medium shadow-xl ${
              isDark ? 'bg-black/30 border-white/15 text-white/70' : 'bg-white/30 border-black/10 text-black/70'
            }`}
            style={{ top: badge.top, left: badge.left, right: badge.right }}
            whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}
          >
            <badge.icon className="text-orange-500 text-lg" />
            {badge.text}
          </motion.div>
        ))}

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center flex flex-col items-center">
          
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col items-center w-full">
            
            {/* Main Title - SMALLER TEXT VERSION */}
            <motion.h1 variants={fadeUp} className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.2] ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Step Into The Future Of<br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Crypto Trading</span>
            </motion.h1>

            {/* Subtitle - Smaller */}
            <motion.p variants={fadeUp} className={`text-sm md:text-base mb-8 font-medium max-w-xl ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              AI-optimized sales teams with human-grade decision-making
            </motion.p>

            {/* CTA with hover effect */}
            <motion.div variants={fadeUp} className="mb-16">
              <Link 
                to="/register" 
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all rounded-full text-white font-semibold text-sm shadow-2xl shadow-orange-500/30"
              >
                Get Started 
                <RiArrowRightLine className="text-lg group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Hero Cards - 3D Floating Effect (Positioned Slightly Higher) */}
            <motion.div 
              variants={fadeUp} 
              className="relative w-full max-w-5xl h-[360px] md:h-[420px] flex justify-center items-center mt-4"
            >
              {/* Left Card: Markets */}
              <motion.div 
                initial={{ opacity: 0, x: -100, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`absolute left-0 md:left-[5%] z-10 w-[260px] p-5 rounded-2xl border backdrop-blur-xl shadow-2xl hidden md:block transform-gpu ${
                  isDark ? 'bg-[#111111]/90 border-white/10' : 'bg-white/90 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-5">
                  <h3 className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>Markets</h3>
                  <motion.span 
                    whileHover={{ x: 5 }}
                    className="text-orange-500 text-[10px] font-medium cursor-pointer"
                  >
                    See All →
                  </motion.span>
                </div>
                <div className="space-y-3">
                  {[
                    { sym: 'BTC', val: '$28,659.35', color: 'bg-indigo-500', change: '+2.4%' },
                    { sym: 'ETH', val: '$26,650.95', color: 'bg-orange-500', change: '+1.8%' },
                    { sym: 'NEO', val: '$25,651.25', color: 'bg-blue-500', change: '-0.3%' }
                  ].map((coin, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[8px] text-white font-bold ${coin.color}`}
                        >
                          {coin.sym[0]}
                        </motion.div>
                        <div>
                          <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{coin.sym}</p>
                          <p className={`text-[8px] ${coin.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{coin.change}</p>
                        </div>
                      </div>
                      <p className={`text-xs font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>{coin.val}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white/50">Total Balance</span>
                    <span className="text-[10px] font-medium text-green-500">+$432.49 (+12%)</span>
                  </div>
                </div>
              </motion.div>

              {/* Center Card: Main Chart (Highest Z-Index) - Slightly Smaller */}
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className={`absolute z-30 w-full max-w-[360px] p-5 rounded-2xl border backdrop-blur-2xl shadow-2xl transform-gpu ${
                  isDark ? 'bg-[#161616]/95 border-white/10 shadow-black/50' : 'bg-white border-gray-200 shadow-gray-200/50'
                }`}
              >
                <div className={`flex items-center gap-4 mb-6 text-[10px] font-medium border-b pb-3 ${isDark ? 'border-white/10 text-white/50' : 'border-gray-100 text-gray-400'}`}>
                  {['Home', 'Leverage', 'Earn', 'NFT'].map((item, i) => (
                    <motion.span 
                      key={i}
                      whileHover={{ scale: 1.1, color: '#f97316' }}
                      className={i === 0 ? (isDark ? 'text-white' : 'text-gray-900') : ''}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
                <h2 className={`text-2xl font-bold font-mono tracking-tight mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  $15,475<span className="text-xs text-gray-500 ml-1">.00 USD</span>
                </h2>
                
                {/* Animated Chart */}
                <motion.div 
                  className="h-24 w-full mt-4 relative"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                >
                  <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                    <motion.path 
                      d="M0,45 C20,35 40,50 60,30 C80,10 100,35 120,20 C140,5 160,25 180,15 C190,8 200,12 200,12" 
                      fill="none" 
                      stroke="url(#gradientChart)" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                    />
                    <motion.circle 
                      cx="200" 
                      cy="12" 
                      r="3" 
                      fill="#f97316"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2.5 }}
                    />
                    <defs>
                      <linearGradient id="gradientChart" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="flex justify-between items-center mt-3"
                >
                  <span className={`text-[10px] ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Your balance: 0.000003 ETH</span>
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[10px] font-medium text-green-500"
                  >
                    +$432.49 (+12%)
                  </motion.span>
                </motion.div>
              </motion.div>

              {/* Right Card: Exchange - Slightly Smaller */}
              <motion.div 
                initial={{ opacity: 0, x: 100, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`absolute right-0 md:right-[5%] z-20 w-[270px] p-5 rounded-2xl border backdrop-blur-xl shadow-2xl hidden lg:block transform-gpu ${
                  isDark ? 'bg-[#111111]/90 border-white/10' : 'bg-white/90 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>Crypto Exchange</h3>
                  <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                    <RiSwapLine className={isDark ? 'text-white/50' : 'text-gray-400'} />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  {[
                    { from: 'USDT', to: 'BTC', fromVal: '40.679', toVal: '1230.365' },
                    { from: 'BTC', to: 'NEX', fromVal: '1230.365', toVal: '90.343' }
                  ].map((exchange, idx) => (
                    <div key={idx}>
                      <motion.div 
                        whileHover={{ scale: 1.02, backgroundColor: isDark ? '#222' : '#f0f0f0' }}
                        className={`p-3 rounded-xl flex justify-between items-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[6px] text-white">
                            {exchange.from[0]}
                          </div>
                          <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{exchange.from}</span>
                        </div>
                        <span className={`font-mono text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{exchange.fromVal}</span>
                      </motion.div>
                      
                      {idx === 0 && (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="flex justify-center -my-2 relative z-10"
                        >
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isDark ? 'bg-[#222] border-[#333] text-white' : 'bg-white border-gray-200 text-gray-600'}`}>
                            <RiSwapLine className="rotate-90 text-xs" />
                          </div>
                        </motion.div>
                      )}
                      
                      {idx === 1 && (
                        <motion.div 
                          whileHover={{ scale: 1.02, backgroundColor: isDark ? '#222' : '#f0f0f0' }}
                          className={`p-3 rounded-xl flex justify-between items-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[6px] text-white">
                              {exchange.to[0]}
                            </div>
                            <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{exchange.to}</span>
                          </div>
                          <span className={`font-mono text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{exchange.toVal}</span>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Smaller */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <div className={`w-5 h-8 rounded-full border flex justify-center ${isDark ? 'border-white/20' : 'border-gray-300'}`}>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-1 h-1.5 rounded-full mt-2 ${isDark ? 'bg-white/50' : 'bg-gray-400'}`}
            />
          </div>
        </motion.div>
      </section>

      {/* ── LOGO STRIP ──────────────────────────────── */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`py-10 border-y relative z-10 ${isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100'}`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-xs uppercase tracking-widest font-medium mb-8 ${isDark ? 'text-white/40' : 'text-gray-400'}`}
          >
            Simplifying Blockchain Workflows For <span className={isDark ? 'text-white' : 'text-gray-800'}>2,500+ Organizations</span>
          </motion.p>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 hover:opacity-100 transition-all duration-500"
          >
            {['Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum', 'Logoipsum'].map((logo, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`flex items-center gap-2 font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <RiShieldStarLine className="text-2xl text-orange-500" /> 
                {logo}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── FEATURES BENTO GRID ─────────────────────── */}
      <section ref={featuresRef} id="features" className={`py-32 relative z-10 ${isDark ? 'bg-[#050505]' : 'bg-[#f9f8f6]'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial="hidden"
            animate={featuresInView ? "show" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Powerful Features <br/> For <span className="text-orange-500">Smarter</span> Crypto Trading
            </motion.h2>
            <motion.p variants={fadeUp} className={`text-base max-w-2xl mx-auto ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              AI-optimized sales teams with human-grade decision-making
            </motion.p>
          </motion.div>

          {/* Premium Bento Grid */}
          <motion.div 
            initial="hidden"
            animate={featuresInView ? "show" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Feature Card 1 - Tools */}
            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className={`col-span-1 md:col-span-2 p-8 md:p-10 rounded-3xl border overflow-hidden relative group cursor-pointer ${
                isDark ? 'bg-gradient-to-br from-[#111] to-[#1a1a1a] border-white/5' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
              }`}
            >
              <motion.div 
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 5 }}
                className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"
              />
              
              <div className="relative z-10">
                <RiBarChartBoxLine className="text-4xl text-orange-500 mb-6" />
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Tools For Better<br/>Cryptocurrency Trading
                </h3>
                <p className={`text-sm max-w-sm mb-6 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  Smart platforms designed to help you analyze markets and make informed decisions.
                </p>
                <motion.button 
                  whileHover={{ x: 10 }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold rounded-full flex items-center gap-2 group"
                >
                  Get Started 
                  <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Decorative Chart */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-64 h-32 opacity-20"
              >
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path d="M0,80 L30,60 L60,70 L90,40 L120,50 L150,20 L180,30 L200,10" 
                    stroke="url(#gradientLine)" strokeWidth="3" fill="none" />
                  <defs>
                    <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </motion.div>

            {/* Feature Card 2 - Advanced Routing */}
            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className={`p-8 rounded-3xl border overflow-hidden relative group cursor-pointer ${
                isDark ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'
              }`}
            >
              <RiExchangeFundsLine className="text-4xl text-orange-500 mb-6" />
              <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Advanced Routing</h3>
              <p className={`text-sm mb-8 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                Execute trades across multiple liquidity pools instantly.
              </p>
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto"
              >
                <div className="w-full h-full rounded-full border-4 border-orange-500/30 border-t-orange-500" />
              </motion.div>
            </motion.div>

            {/* Feature Card 3 - Smart Analytics */}
            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className={`p-8 rounded-3xl border overflow-hidden relative group cursor-pointer ${
                isDark ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'
              }`}
            >
              <RiFlashlightLine className="text-4xl text-orange-500 mb-6" />
              <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Smart Analytics</h3>
              <p className={`text-sm mb-8 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                Real-time market insights and predictive indicators.
              </p>
              
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex gap-2 justify-center"
              >
                {[1,2,3].map(i => (
                  <div key={i} className="w-2 h-8 bg-orange-500/30 rounded-full" style={{ height: `${i * 10 + 10}px` }} />
                ))}
              </motion.div>
            </motion.div>

            {/* Feature Card 4 - Portfolio Management */}
            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className={`col-span-1 md:col-span-2 p-8 rounded-3xl border overflow-hidden relative group cursor-pointer ${
                isDark ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'
              }`}
            >
              <RiStackLine className="text-4xl text-orange-500 mb-6" />
              <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Portfolio Management</h3>
              <p className={`text-sm max-w-md ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                Track your assets with professional-grade tools and analytics.
              </p>
              
              {/* Mini portfolio preview */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {['BTC', 'ETH', 'NEO', 'USDT'].map((coin, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-xl flex justify-between ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}
                  >
                    <span className="font-medium">{coin}</span>
                    <span className="text-green-500">+{i+2}.{i*3}%</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Feature Card 5 - Security */}
            <motion.div 
              variants={scaleIn}
              whileHover={{ y: -10 }}
              className={`p-8 rounded-3xl border overflow-hidden relative group cursor-pointer ${
                isDark ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'
              }`}
            >
              <RiShieldStarLine className="text-4xl text-orange-500 mb-6" />
              <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Bank-Grade Security</h3>
              <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                Your assets are protected with multi-layer encryption.
              </p>
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mt-8 w-16 h-16 mx-auto rounded-full border-4 border-orange-500 border-t-transparent"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── LEADERBOARD SECTION (from image) ────────────────── */}
      <section ref={leaderboardRef} className={`py-24 relative z-10 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f4f3f0]'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={leaderboardInView ? "show" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Top <span className="text-orange-500">Traders</span> This Week
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={leaderboardInView ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {leaderboardUsers.map((user, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`p-6 rounded-2xl border backdrop-blur-sm cursor-pointer ${
                  isDark ? 'bg-[#111]/80 border-white/10' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg`}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                    <p className="text-xs text-green-500">+{Math.floor(Math.random() * 30 + 10)}%</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Balance</span>
                    <span className={`font-mono font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.balance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">BTC</span>
                    <span className="font-mono">{user.btc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">ETH</span>
                    <span className="font-mono">{user.eth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">NEO</span>
                    <span className="font-mono">{user.neo}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────── */}
      <section id="pricing" className={`py-24 border-t ${isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-[#f4f3f0] border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Choose Your <span className="text-orange-500">Journey</span>
            </h2>
            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              Select the perfect plan for your trading needs
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {packages.map((pkg, i) => (
              <motion.div key={pkg._id || i} variants={scaleIn}>
                <PricingCard pkg={pkg} index={i} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}