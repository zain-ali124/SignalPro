import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

const PAIRS = [
  { label: 'BTC/USDT', symbol: 'BINANCE:BTCUSDT' },
  { label: 'ETH/USDT', symbol: 'BINANCE:ETHUSDT' },
  { label: 'BNB/USDT', symbol: 'BINANCE:BNBUSDT' },
  { label: 'SOL/USDT', symbol: 'BINANCE:SOLUSDT' },
  { label: 'XRP/USDT', symbol: 'BINANCE:XRPUSDT' },
  { label: 'EUR/USD',  symbol: 'FX:EURUSD'        },
  { label: 'GBP/USD',  symbol: 'FX:GBPUSD'        },
  { label: 'GOLD',     symbol: 'TVC:GOLD'          },
]

export default function TradingViewChart() {
  const { isDark } = useTheme()
  const containerRef = useRef(null)
  const [selected, setSelected] = useState(PAIRS[0])

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: selected.symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: isDark ? 'dark' : 'light',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      backgroundColor: isDark ? 'rgba(13,13,21,1)' : 'rgba(255,255,255,1)',
      gridColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
      support_host: 'https://www.tradingview.com',
    })
    containerRef.current.appendChild(script)
  }, [selected, isDark])

  return (
    <div className="space-y-4 h-full">
      <div>
        <h1 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Live Chart</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>Professional TradingView charts with real-time data</p>
      </div>

      {/* Pair selector */}
      <div className="flex flex-wrap gap-2">
        {PAIRS.map(p => (
          <button
            key={p.symbol}
            onClick={() => setSelected(p)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-display font-semibold transition-all duration-200 ${
              selected.symbol === p.symbol
                ? 'bg-orange-gradient text-white shadow-orange-glow-sm'
                : isDark ? 'bg-white/6 text-white/55 hover:bg-white/10' : 'bg-black/6 text-gray-600 hover:bg-black/10'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chart container */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-white/6 bg-dark-700' : 'border-black/8 bg-white shadow-card'}`} style={{ height: '600px' }}>
        <div
          className="tradingview-widget-container"
          ref={containerRef}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  )
}
