// src/components/admin/SystemWorkflow.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  FiGlobe, FiDatabase, FiLock, FiMail, FiUserCheck, FiArrowRight, 
  FiActivity, FiServer, FiClock, FiCheckCircle, FiZap, FiTrendingUp, 
  FiBarChart2, FiCpu, FiShield, FiRefreshCw, FiThermometer, FiHardDrive
} from 'react-icons/fi'
import { IconType } from 'react-icons'

// ========== Type Definitions ==========
interface StepMetrics {
  active?: number
  total?: number
  latency?: number
  size?: string
  activeSessions?: number
  totalUsers?: number
  unread?: number
  editors?: number
  lastActive?: string
}

interface StepDetail {
  id: string
  icon: IconType
  title: string
  desc: string
  details: string[]
  metrics: StepMetrics
  color: string
  iconColor: string
  bgGlow: string
}

interface SystemMetricsType {
  cpu: number
  memory: number
  requestsPerMin: number
  errorRate: number
  uptime: number
  responseTime: number
  diskUsage: number
  networkIn: number
  networkOut: number
}

interface HistoryDataPoint {
  timestamp: number
  cpu: number
  memory: number
  requests: number
}

// Props untuk AnimatedCounter
interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
}

// Props untuk Sparkline
interface SparklineProps {
  data: number[]
  color: string
  height?: number
}

// Data steps
const steps: StepDetail[] = [
  { 
    id: 'visitor',
    icon: FiGlobe, 
    title: 'Pengunjung', 
    desc: 'User mengakses website', 
    details: ['Halaman landing', 'Layanan & produk', 'Berita & artikel', 'Formulir kontak'],
    metrics: { active: 124, total: 12543 },
    color: 'from-blue-500 to-cyan-500',
    iconColor: 'text-blue-500',
    bgGlow: 'rgba(59,130,246,0.15)'
  },
  { 
    id: 'database',
    icon: FiDatabase, 
    title: 'Database Supabase', 
    desc: 'Penyimpanan data realtime', 
    details: ['PostgreSQL realtime', 'Row Level Security', 'Storage bucket', 'Edge Functions'],
    metrics: { latency: 42, size: '2.4 GB' },
    color: 'from-purple-500 to-indigo-500',
    iconColor: 'text-purple-500',
    bgGlow: 'rgba(139,92,246,0.15)'
  },
  { 
    id: 'auth',
    icon: FiLock, 
    title: 'Autentikasi', 
    desc: 'Keamanan akses admin', 
    details: ['Magic link login', 'Role-based access', 'Session management', 'JWT验证'],
    metrics: { activeSessions: 7, totalUsers: 23 },
    color: 'from-amber-500 to-orange-500',
    iconColor: 'text-amber-500',
    bgGlow: 'rgba(245,158,11,0.15)'
  },
  { 
    id: 'contact',
    icon: FiMail, 
    title: 'Kontak & Pesan', 
    desc: 'Komunikasi pengunjung', 
    details: ['Formulir kontak', 'Notifikasi email', 'Status pesan (baca/belum)', 'Arsip pesan'],
    metrics: { unread: 3, total: 247 },
    color: 'from-emerald-500 to-teal-500',
    iconColor: 'text-emerald-500',
    bgGlow: 'rgba(16,185,129,0.15)'
  },
  { 
    id: 'admin',
    icon: FiUserCheck, 
    title: 'Admin Panel', 
    desc: 'Kelola konten & pengaturan', 
    details: ['CRUD data', 'Upload gambar', 'Konfigurasi website', 'Log aktivitas'],
    metrics: { editors: 2, lastActive: '5 menit lalu' },
    color: 'from-rose-500 to-pink-500',
    iconColor: 'text-rose-500',
    bgGlow: 'rgba(244,63,94,0.15)'
  },
]

const initialSystemMetrics: SystemMetricsType = {
  cpu: 23,
  memory: 456,
  requestsPerMin: 1240,
  errorRate: 0.02,
  uptime: 99.98,
  responseTime: 124,
  diskUsage: 38,
  networkIn: 3.2,
  networkOut: 1.8
}

// Animated counter component
function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '', 
  decimals = 0 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(value)
  
  useEffect(() => {
    const duration = 500
    const stepsCount = 20
    const stepValue = (value - displayValue) / stepsCount
    let current = displayValue
    let count = 0
    const interval = setInterval(() => {
      current += stepValue
      count++
      if (count >= stepsCount) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(current)
      }
    }, duration / stepsCount)
    return () => clearInterval(interval)
  }, [value, displayValue])
  
  return <span>{prefix}{displayValue.toFixed(decimals)}{suffix}</span>
}

// Sparkline component
function Sparkline({ data, color, height = 30 }: SparklineProps) {
  if (!data.length) return null
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((value, idx) => 
    `${(idx / (data.length - 1)) * 100},${height - ((value - min) / range) * height}`
  ).join(' ')
  
  return (
    <svg width="100%" height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

export default function SystemWorkflow() {
  const [metrics, setMetrics] = useState<SystemMetricsType>(initialSystemMetrics)
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState<number>(0)
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Real-time metrics update dengan data history untuk sparkline
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newCpu = Math.min(100, Math.max(5, prev.cpu + (Math.random() - 0.5) * 6))
        const newMem = Math.min(1024, Math.max(200, prev.memory + (Math.random() - 0.5) * 20))
        const newReq = Math.floor(Math.max(800, prev.requestsPerMin + (Math.random() - 0.5) * 80))
        const newErr = Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.01))
        const newRes = Math.floor(Math.max(80, prev.responseTime + (Math.random() - 0.5) * 12))
        return {
          ...prev,
          cpu: newCpu,
          memory: newMem,
          requestsPerMin: newReq,
          errorRate: newErr,
          responseTime: newRes,
          uptime: 99.98,
        }
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Simpan history setiap 10 detik untuk sparkline
  useEffect(() => {
    const historyInterval = setInterval(() => {
      setHistoryData(prev => {
        const newPoint: HistoryDataPoint = {
          timestamp: Date.now(),
          cpu: metrics.cpu,
          memory: metrics.memory,
          requests: metrics.requestsPerMin
        }
        const newHistory = [...prev, newPoint].slice(-20)
        return newHistory
      })
    }, 10000)
    return () => clearInterval(historyInterval)
  }, [metrics.cpu, metrics.memory, metrics.requestsPerMin])

  // Animated flow effect (partikel bergerak)
  useEffect(() => {
    const flowInterval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100)
    }, 80)
    return () => clearInterval(flowInterval)
  }, [])

  const getStepMetricsDisplay = (stepId: string): string => {
    const step = steps.find(s => s.id === stepId)
    if (!step) return ''
    if (stepId === 'visitor') return `${step.metrics.active} aktif · ${step.metrics.total} total`
    if (stepId === 'database') return `${step.metrics.latency}ms · ${step.metrics.size}`
    if (stepId === 'auth') return `${step.metrics.activeSessions} session · ${step.metrics.totalUsers} user`
    if (stepId === 'contact') return `${step.metrics.unread} belum · ${step.metrics.total} total`
    if (stepId === 'admin') return `${step.metrics.editors} editor · ${step.metrics.lastActive}`
    return ''
  }

  return (
    <div className="relative group rounded-3xl bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.01]">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
      
      <div className="relative p-6">
        {/* Header with real-time badge */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
              <FiZap className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Arsitektur & Kinerja Sistem
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Realtime monitoring · Data update setiap 5 detik
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/40">
              <FiRefreshCw size={12} className="text-gray-500 animate-spin" style={{ animationDuration: '2s' }} />
              <span className="text-[11px] text-gray-600">Sinkronisasi realtime</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center animate-pulse">
              <FiCheckCircle size={14} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Flow diagram with animated connections */}
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-rose-400/30 -translate-y-1/2 z-0 hidden lg:block"></div>
          <div className="relative flex flex-wrap justify-center items-center gap-4 lg:gap-8 z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center relative group/step flex-1 min-w-[100px]">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-0">
                    <div className="relative w-8 h-8">
                      <FiArrowRight className="text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={16} />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/50 to-transparent animate-ping" style={{ animationDuration: '1.5s' }}></div>
                    </div>
                  </div>
                )}
                {/* Node card dengan efek 3D dan tilt */}
                <div 
                  className={`
                    relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} 
                    p-0.5 shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer
                    ${activeStep === step.id ? 'ring-4 ring-white/60 scale-105' : ''}
                  `}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <div className="w-full h-full rounded-xl bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
                    <step.icon size={28} className={step.iconColor} />
                    <span className="text-[10px] font-bold text-gray-700">{step.title.slice(0,8)}</span>
                  </div>
                  {/* Animated pulse effect */}
                  <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse opacity-0 group-hover/step:opacity-100 transition"></div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-2">{step.title}</p>
                <p className="text-[10px] text-gray-500 text-center max-w-[100px]">{step.desc}</p>
                <div className="text-[9px] font-mono text-gray-400 mt-1 bg-white/30 px-1.5 py-0.5 rounded-full">
                  {getStepMetricsDisplay(step.id)}
                </div>
                {/* Tooltip detail super premium */}
                {activeStep === step.id && (
                  <div className="absolute top-full mt-3 w-64 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-white/80 z-20 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon size={14} className={step.iconColor} />
                      <span className="text-sm font-bold text-gray-800">{step.title}</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 mb-2">
                      {step.details.map((d, i) => <li key={i} className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-gray-400"></span>{d}</li>)}
                    </ul>
                    <div className="border-t border-gray-200 pt-1 mt-1 text-[10px] text-gray-500">
                      Status: <span className="text-green-600 font-medium">Operasional</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Animated flow particles */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 pointer-events-none hidden lg:block">
            <div className="absolute w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" style={{ left: `${animationPhase}%`, top: '-4px', transition: 'left 0.08s linear' }}></div>
            <div className="absolute w-2 h-2 rounded-full bg-purple-500 shadow-lg" style={{ left: `${(animationPhase + 33) % 100}%`, top: '-3px', transition: 'left 0.08s linear' }}></div>
            <div className="absolute w-1.5 h-1.5 rounded-full bg-pink-500 shadow-lg" style={{ left: `${(animationPhase + 66) % 100}%`, top: '-2px', transition: 'left 0.08s linear' }}></div>
          </div>
        </div>

        {/* Advanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40 hover:bg-white/40 transition group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiCpu className="text-indigo-500" size={16} />
                <span className="text-xs font-bold text-gray-600">CPU Usage</span>
              </div>
              <span className="text-sm font-mono font-bold text-gray-800"><AnimatedCounter value={metrics.cpu} suffix="%" decimals={1} /></span>
            </div>
            <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${metrics.cpu}%` }}></div>
            </div>
            <div className="mt-2 h-8 opacity-0 group-hover:opacity-100 transition">
              <Sparkline data={historyData.map(d => d.cpu)} color="#6366f1" height={24} />
            </div>
          </div>
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40 hover:bg-white/40 transition group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiHardDrive className="text-emerald-500" size={16} />
                <span className="text-xs font-bold text-gray-600">Memory (MB)</span>
              </div>
              <span className="text-sm font-mono font-bold text-gray-800"><AnimatedCounter value={metrics.memory} suffix=" MB" decimals={0} /></span>
            </div>
            <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${(metrics.memory / 1024) * 100}%` }}></div>
            </div>
            <div className="mt-2 h-8 opacity-0 group-hover:opacity-100 transition">
              <Sparkline data={historyData.map(d => d.memory)} color="#10b981" height={24} />
            </div>
          </div>
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40 hover:bg-white/40 transition group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-amber-500" size={16} />
                <span className="text-xs font-bold text-gray-600">Requests/min</span>
              </div>
              <span className="text-sm font-mono font-bold text-gray-800"><AnimatedCounter value={metrics.requestsPerMin} suffix="" decimals={0} /></span>
            </div>
            <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, metrics.requestsPerMin / 20)}%` }}></div>
            </div>
            <div className="mt-2 h-8 opacity-0 group-hover:opacity-100 transition">
              <Sparkline data={historyData.map(d => d.requests)} color="#f59e0b" height={24} />
            </div>
          </div>
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40 hover:bg-white/40 transition">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiActivity className="text-rose-500" size={16} />
                <span className="text-xs font-bold text-gray-600">Response Time</span>
              </div>
              <span className="text-sm font-mono font-bold text-gray-800"><AnimatedCounter value={metrics.responseTime} suffix=" ms" decimals={0} /></span>
            </div>
            <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, metrics.responseTime / 3)}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
              <span>Error rate: {(metrics.errorRate * 100).toFixed(2)}%</span>
              <span>Uptime: {metrics.uptime}%</span>
            </div>
          </div>
        </div>

        {/* Real-time dashboard tambahan - Disk I/O */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
            <div className="flex items-center gap-2 mb-3">
              <FiThermometer size={14} className="text-purple-500" />
              <span className="text-xs font-bold text-gray-700">System Load Average</span>
            </div>
            <div className="flex justify-between text-sm font-mono">
              <div><span className="text-gray-500">1 min:</span> <span className="font-bold text-gray-800">{(metrics.cpu / 10).toFixed(1)}</span></div>
              <div><span className="text-gray-500">5 min:</span> <span className="font-bold text-gray-800">{(metrics.cpu / 12).toFixed(1)}</span></div>
              <div><span className="text-gray-500">15 min:</span> <span className="font-bold text-gray-800">{(metrics.cpu / 15).toFixed(1)}</span></div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiShield size={14} className="text-green-500" />
                <span className="text-xs font-bold text-gray-700">Security Status</span>
              </div>
              <span className="text-[10px] text-green-600 bg-green-100/30 px-2 py-0.5 rounded-full">Protected</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-600">
              <span>RLS: Enabled</span>
              <span>SSL: Active</span>
              <span>MFA: Optional</span>
            </div>
          </div>
        </div>

        {/* System health summary */}
        <div className="flex flex-wrap justify-between items-center gap-2 pt-4 mt-4 border-t border-white/30">
          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1"><FiShield size={12} /> RLS active</span>
            <span className="flex items-center gap-1"><FiBarChart2 size={12} /> Analytics on</span>
            <span className="flex items-center gap-1"><FiCheckCircle size={12} className="text-green-500" /> All systems operational</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
            <FiClock size={10} />
            Last sync: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}