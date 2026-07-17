// src/app/(public)/innovation/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  FiArrowRight, FiArrowUp, FiChevronLeft, FiChevronRight, FiChevronDown,
  FiMessageSquare, FiClipboard, FiCalendar, FiFileText, FiImage,
  FiBriefcase, FiUsers, FiGlobe, FiShield, FiStar, FiDroplet, FiWifi, FiBattery,
  FiUploadCloud, FiEye, FiX, FiPlay, FiCloud, FiMonitor, FiSmartphone,
  FiDatabase, FiZap, FiTrendingUp, FiCheckCircle, FiLoader,
  FiBarChart2, FiClock, FiAward
} from 'react-icons/fi'

// ========== STYLE GLOBAL ==========
const globalStyles = `
  .perspective-1000 { perspective: 1000px; }
  .group:hover .group-hover\\:rotate-y-3 { transform: rotateY(3deg); }
  .will-change-transform { will-change: transform; }
  .animate-bounce { animation: bounce 1s infinite; }
  @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
  .bg-grid {
    background-image: linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
`

// Helper untuk icon statistik
const StatIcon = ({ iconName, size = 28 }: { iconName: string; size?: number }) => {
  const icons: Record<string, any> = {
    FiBriefcase, FiUsers, FiGlobe, FiBarChart2, FiClock, FiAward, FiDatabase, FiZap
  }
  const Icon = icons[iconName] || FiBriefcase
  return <Icon size={size} />
}

// ========== IPHONE FRAME ==========
interface IphoneFrameProps {
  src: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  isVideo?: boolean;
}

const IphoneFrame = ({ 
  src, 
  alt = "Phone Screen", 
  objectFit = 'cover', 
  objectPosition = 'center',
  isVideo = false
}: IphoneFrameProps) => {
  const [currentTime, setCurrentTime] = useState("")
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Tambahkan timestamp untuk bypass cache
  const imageSrc = !isVideo && src ? `${src}?t=${Date.now()}` : src

  return (
    <div className="relative perspective-1000 group">
      <div className="relative transform transition-all duration-500 group-hover:rotate-y-3 will-change-transform">
        <div className="relative w-[340px] h-[640px] rounded-[48px] bg-gradient-to-br from-gray-800 via-black to-gray-900 shadow-[0_30px_40px_-15px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.15)] border border-gray-600/50">
          <div className="absolute inset-[6px] rounded-[42px] overflow-hidden bg-black shadow-inner">
            <div className="relative w-full h-full">
              {isVideo ? (
                <video 
                  key={src}
                  className="w-full h-full"
                  style={{ objectFit, objectPosition }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={src}
                />
              ) : (
                <img 
                  src={imageSrc}
                  alt={alt} 
                  className="w-full h-full" 
                  style={{ objectFit, objectPosition }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 px-5 pt-2 flex justify-between items-center text-white text-xs font-semibold drop-shadow-md">
                <div className="text-[13px] font-medium tracking-wide">{currentTime || "09:41"}</div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-[2px]">
                    <div className="w-1 h-1.5 bg-white rounded-sm"></div>
                    <div className="w-1 h-2.5 bg-white rounded-sm"></div>
                    <div className="w-1 h-3.5 bg-white rounded-sm"></div>
                    <div className="w-1 h-4 bg-white rounded-sm"></div>
                  </div>
                  <div className="relative ml-0.5">
                    <div className="w-[22px] h-[11px] border border-white/80 rounded-sm bg-black/30"></div>
                    <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-white/80 rounded-r-sm"></div>
                    <div className="absolute top-[2px] left-[2px] bottom-[2px] w-[14px] bg-white/80 rounded-sm"></div>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[10px] h-[10px] bg-black/60 rounded-full border border-white/20 shadow-sm" />
            </div>
          </div>
          <div className="absolute left-[-2px] top-20 w-1.5 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-full shadow-inner" />
          <div className="absolute left-[-2px] top-32 w-1.5 h-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-full" />
          <div className="absolute left-[-2px] top-44 w-1.5 h-6 bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-full" />
          <div className="absolute right-[-2px] top-32 w-1.5 h-12 bg-gradient-to-l from-gray-600 to-gray-700 rounded-r-full" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-700 rounded-full" />
          <div className="absolute top-0 left-0 right-0 h-28 rounded-t-[48px] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  )
}

// ========== MONITOR FRAME ==========
interface MonitorFrameProps {
  src: string;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  isVideo?: boolean;
}

const MonitorFrame = ({ 
  src, 
  alt = "Monitor Screen", 
  objectFit = 'contain', 
  objectPosition = 'center',
  isVideo = false
}: MonitorFrameProps) => {
  const imageSrc = !isVideo && src ? `${src}?t=${Date.now()}` : src

  return (
    <div className="relative perspective-1000 group">
      <div className="relative transform transition-all duration-500 group-hover:rotate-y-3 will-change-transform">
        <div className="relative w-[700px] h-[420px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
          <div className="absolute inset-[3px] rounded-lg overflow-hidden bg-black">
            {isVideo ? (
              <video 
                key={src}
                className="w-full h-full"
                style={{ objectFit, objectPosition }}
                autoPlay
                loop
                muted
                playsInline
                src={src}
              />
            ) : (
              <img 
                src={imageSrc} 
                alt={alt} 
                className="w-full h-full"
                style={{ objectFit, objectPosition }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20 pointer-events-none" />
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-700 rounded-full shadow-inner" />
          <div className="absolute bottom-2 right-3 text-[8px] text-gray-500 opacity-50">IPS</div>
        </div>
        <div className="w-16 h-6 bg-gradient-to-r from-gray-700 to-gray-800 mx-auto rounded-b-md shadow-md -mt-1" />
        <div className="w-48 h-8 bg-gradient-to-b from-gray-700 to-gray-800 mx-auto rounded-b-lg shadow-lg flex justify-center items-center">
          <div className="w-32 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ========== FLOATING PARTICLES ==========
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            opacity: 0.3 + Math.random() * 0.5
          }}
          animate={{
            y: [null, -20, 20, -10, 10, 0],
            x: [null, Math.random() * 50 - 25],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// ========== IMAGE MODAL ==========
const ImageModal = ({ image, onClose }: { image: string | null; onClose: () => void }) => {
  if (!image) return null
  const imageWithTimestamp = `${image}?t=${Date.now()}`
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full"
      >
        <img src={imageWithTimestamp} alt="Popup" className="w-full h-auto rounded-2xl shadow-2xl border border-cyan-500/30" />
        <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition">
          <FiX size={24} />
        </button>
      </motion.div>
    </motion.div>
  )
}

// ========== VIDEO DEMO ==========
const DemoVideo = () => {
  return (
    <section className="py-20 px-6 md:px-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-cyan-700 bg-cyan-100 rounded-full">
            <FiPlay size={14} /> VIDEO DEMO
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">Lihat Langsung Aksi Inspektur Lapangan</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Upload kegiatan harian, foto, dan dokumen langsung dari lokasi proyek</p>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-black group">
          <video
            className="w-full h-auto"
            autoPlay
            loop
            muted
            playsInline
            controls
            poster="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200&h=675&fit=crop"
          >
            <source src="https://cdn.pixabay.com/video/2023/06/26/169717-837895848_large.mp4" type="video/mp4" />
            Browser Anda tidak mendukung video.
          </video>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-none">
            <p className="text-white text-sm md:text-base font-medium">🎥 Simulasi: Inspektur mengupload laporan harian + foto progres</p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">*Video demonstrasi penggunaan aplikasi mobile oleh inspektur lapangan</p>
      </div>
    </section>
  )
}

// ========== WORKFLOW SECTION ==========
interface WorkflowSectionProps {
  data: {
    title: string
    subtitle: string
    mobile_video: string
    mobile_image: string
    monitor_video: string
    monitor_image: string
    steps: { title: string; desc: string; icon: string }[]
    stats: { label: string; value: string; icon: string; gradient: string }[]
  }
}

const WorkflowSection = ({ data }: WorkflowSectionProps) => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [showDataPacket, setShowDataPacket] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true)
      setSyncProgress(0)
      let progress = 0
      const timer = setInterval(() => {
        progress += 2
        setSyncProgress(progress)
        if (progress >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setIsSyncing(false)
            setShowDataPacket(true)
            setTimeout(() => setShowDataPacket(false), 1000)
          }, 500)
        }
      }, 30)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const mobileSrc = data.mobile_video || data.mobile_image || 'images/s.mp4'
  const monitorSrc = data.monitor_video || data.monitor_image || 'images/s.mp4'

  return (
    <section className="py-20 px-6 md:px-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-cyan-600 bg-cyan-100 rounded-full">
            ALUR KERJA INOVATIF
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
            {data.title || 'Dari Lapangan ke Dashboard'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            {data.subtitle || 'Inspektur upload kegiatan harian (foto, video, PDF) → Data langsung tampil di web dalam hitungan detik'}
          </p>
        </div>

        {/* Visualisasi Ponsel ↔ Cloud ↔ Monitor */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-16 mb-14">
          <div className="relative">
            <IphoneFrame 
              src={mobileSrc} 
              alt="Mobile Upload" 
              objectFit="cover" 
              isVideo={!!data.mobile_video} 
            />
            {isSyncing && (
              <motion.div
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-cyan-500/30 flex items-center justify-center backdrop-blur-sm"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <FiLoader className="text-cyan-600 animate-spin" size={20} />
              </motion.div>
            )}
          </div>

          <div className="relative flex flex-col items-center">
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 backdrop-blur-sm border border-cyan-300/50 flex items-center justify-center shadow-lg"
              animate={{ boxShadow: isSyncing ? "0 0 30px rgba(6,182,212,0.5)" : "0 0 10px rgba(6,182,212,0.2)" }}
            >
              <FiCloud size={56} className="text-cyan-600" />
            </motion.div>
            {showDataPacket && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-10 text-cyan-700 text-sm bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md whitespace-nowrap"
              >
                📦 Data terkirim ke cloud
              </motion.div>
            )}
            {isSyncing && (
              <div className="w-64 mt-4 bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                <motion.div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${syncProgress}%` }} />
              </div>
            )}
            <div className="flex gap-1.5 mt-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-5 bg-cyan-400 rounded-full"
                  animate={{ height: isSyncing ? [5, 16, 5] : 5 }}
                  transition={{ delay: i * 0.1, repeat: isSyncing ? Infinity : 0, duration: 0.6 }}
                />
              ))}
            </div>
            <p className="text-cyan-700 text-sm mt-2 font-semibold">SINKRONISASI {syncProgress}%</p>
            <p className="text-gray-500 text-xs mt-1 max-w-xs text-center">Enkripsi end-to-end & verifikasi otomatis</p>
          </div>

          <div className="relative">
            <MonitorFrame 
              src={monitorSrc} 
              alt="Dashboard" 
              objectFit="cover" 
              isVideo={!!data.monitor_video} 
            />
            {isSyncing && (
              <motion.div
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center backdrop-blur-sm"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <FiCheckCircle className="text-green-600" size={20} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {data.steps && data.steps.length > 0 ? (
            data.steps.map((step, i) => {
              const Icon = step.icon ? (() => {
                const icons: Record<string, any> = {
                  FiUploadCloud, FiCloud, FiEye, FiMessageSquare, FiClipboard, FiCalendar, FiImage, FiFileText, FiShield
                }
                return icons[step.icon] || FiStar
              })() : FiStar
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-5 rounded-xl transition" />
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white mb-3">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{step.desc}</p>
                </motion.div>
              )
            })
          ) : (
            <>
              {[
                { icon: FiUploadCloud, title: "Upload di Lapangan", desc: "Foto progres, isi form harian, lampirkan dokumen. Bisa offline." },
                { icon: FiCloud, title: "Sinkronisasi Real-time", desc: "Data terkirim ke cloud terenkripsi dalam <2 detik, notifikasi ke manajer." },
                { icon: FiEye, title: "Monitoring Dashboard", desc: "Manajer lihat data & analitik langsung, generate laporan, pantau KPI." }
              ].map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-5 rounded-xl transition" />
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white mb-3">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{step.desc}</p>
                  </motion.div>
                )
              })}
            </>
          )}
        </div>

        {/* Real-time stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.stats && data.stats.length > 0 ? (
            data.stats.map((stat, idx) => {
              const Icon = stat.icon ? (() => {
                const icons: Record<string, any> = {
                  FiZap, FiDatabase, FiTrendingUp, FiBarChart2, FiClock, FiAward
                }
                return icons[stat.icon] || FiBarChart2
              })() : FiBarChart2
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient || 'from-purple-500 to-indigo-500'} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient || 'from-purple-500 to-indigo-500'} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
                </motion.div>
              )
            })
          ) : (
            <>
              {[
                { icon: FiZap, label: "Kecepatan Sinkron", value: "< 2 detik", gradient: "from-yellow-500 to-amber-500" },
                { icon: FiDatabase, label: "Data Terproses", value: "2.5M+", gradient: "from-green-500 to-emerald-500" },
                { icon: FiTrendingUp, label: "Efisiensi Waktu", value: "+67%", gradient: "from-purple-500 to-indigo-500" }
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
                  </motion.div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

// ========== HERO SLIDESHOW ==========
interface SlideItem { image: string; badge: string; title: string; highlight: string; description: string }
const HeroSlideshow = ({ slides }: { slides: SlideItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => { setDirection(1); setCurrentIndex((prev) => (prev + 1) % slides.length) }
  const prevSlide = () => { setDirection(-1); setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length) }
  const goToSlide = (index: number) => { setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index) }

  useEffect(() => {
    intervalRef.current = setInterval(() => nextSlide(), 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const bgVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0, scale: 0.95, transition: { duration: 0.7 } }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.7 } },
    exit: (direction: number) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0, scale: 0.95, transition: { duration: 0.5 } })
  }

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  const currentSlide = slides[currentIndex] || slides[0]

  // Tambahkan timestamp pada gambar untuk bypass cache
  const imageWithTimestamp = currentSlide?.image ? `${currentSlide.image}?t=${Date.now()}` : ''

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" onMouseEnter={() => intervalRef.current && clearInterval(intervalRef.current)} onMouseLeave={() => { intervalRef.current = setInterval(() => nextSlide(), 5000) }}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div key={currentIndex} custom={direction} variants={bgVariants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
          <img src={imageWithTimestamp} alt={currentSlide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 text-white">
        <AnimatePresence mode="wait">
          <motion.div key={`badge-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium tracking-wide">{currentSlide.badge}</span>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.h1 key={`title-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
            {currentSlide.title}<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">{currentSlide.highlight}</span>
          </motion.h1>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p key={`desc-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            {currentSlide.description}
          </motion.p>
        </AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/contact" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="relative z-10">Konsultasi Gratis</span>
            <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition duration-300" />
          </Link>
          <Link href="#features" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 hover:-translate-y-1 transition">
            Lihat Fitur
          </Link>
        </motion.div>
      </div>
      <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition"><FiChevronLeft size={24} /></button>
      <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition"><FiChevronRight size={24} /></button>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => goToSlide(idx)} className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>
    </div>
  )
}

// ========== PARTNER MARQUEE ==========
interface Partner { name: string; logo: string }

const PartnerItem = ({ partner }: { partner: Partner }) => {
  const [imgError, setImgError] = useState(false)
  const logoWithTimestamp = partner.logo ? `${partner.logo}?t=${Date.now()}` : ''

  return (
    <div className="group relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-105 cursor-default">
      {!imgError ? (
        <img src={logoWithTimestamp} alt={partner.name} className="h-6 w-auto object-contain relative z-10 transition" onError={() => setImgError(true)} />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white relative z-10 shadow-sm">
          {partner.name.charAt(0)}
        </div>
      )}
      <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition hidden sm:inline relative z-10">{partner.name}</span>
    </div>
  )
}

const PartnerMarquee = ({ partners }: { partners: Partner[] }) => {
  if (!partners || partners.length === 0) {
    const defaultPartners: Partner[] = [
      { name: "Kementerian PUPR", logo: "/images/pu.png" },
      { name: "Pam Jaya", logo: "/images/pamjaya.png" },
      { name: "Kementerian Desa", logo: "/images/pdtt.png" },
      { name: "Kementerian Tenaga Kerja", logo: "/images/transmigrasi.png" },
      { name: "Global Green Growth Institute", logo: "/images/gggi.png" },
      { name: "Kementerian Agama", logo: "/images/agama.png" },
      { name: "Kementerian Sekretariat Negara", logo: "/images/setneg.png" },
    ]
    partners = defaultPartners
  }

  const duplicated = [...partners, ...partners]
  return (
    <div className="relative w-full overflow-hidden py-12 bg-white">
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1.5 text-sm font-medium text-cyan-600 bg-cyan-100 rounded-full">MITRA KAMI</span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Dipercaya oleh Lembaga Ternama</h2>
      </div>
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 35, repeat: Infinity, ease: "linear", repeatType: "loop" }} className="flex gap-8 items-center w-max px-4">
        {duplicated.map((partner, idx) => <PartnerItem key={idx} partner={partner} />)}
      </motion.div>
    </div>
  )
}

// ========== MAIN PAGE ==========
export default function InnovationPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(Date.now())

  // Data dari database
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [workflowData, setWorkflowData] = useState<any>(null)
  const [mobileData, setMobileData] = useState<any>(null)
  const [digitalData, setDigitalData] = useState<any>(null)
  const [statsData, setStatsData] = useState<any[]>([])
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [features, setFeatures] = useState<any[]>([])
  const [cta, setCta] = useState<any>(null)

  const [showBackToTop, setShowBackToTop] = useState(false)
  const [modalImage, setModalImage] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      console.log('🔄 Fetching innovation data...')
      const { data, error } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'innovation')
        .eq('key', 'data')

      if (error) {
        console.error('❌ Error fetching innovation data:', error)
        setLoading(false)
        return
      }

      console.log('✅ Data received:', data)

      let slides: SlideItem[] = []
      let partnersList: Partner[] = []
      let workflow: any = null
      let mobile: any = null
      let digital: any = null
      let stats: any[] = []
      let gallery: string[] = []
      let testimonialsList: any[] = []
      let featuresList: any[] = []
      let ctaData: any = null

      data?.forEach((item: any) => {
        try {
          const parsed = JSON.parse(item.value)
          console.log(`📦 Parsed ${item.section}:`, parsed)
          if (item.section === 'hero_slides') {
            slides = parsed.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          } else if (item.section === 'partners') {
            partnersList = parsed
          } else if (item.section === 'workflow') {
            workflow = parsed
          } else if (item.section === 'mobile_section') {
            mobile = parsed
          } else if (item.section === 'digital_section') {
            digital = parsed
          } else if (item.section === 'stats') {
            stats = parsed
          } else if (item.section === 'gallery') {
            gallery = parsed.map((img: any) => img.url || img)
          } else if (item.section === 'testimonials') {
            testimonialsList = parsed
          } else if (item.section === 'features') {
            featuresList = parsed
          } else if (item.section === 'cta') {
            ctaData = parsed
          }
        } catch (e) { console.error('Parse error:', e) }
      })

      // Fallback default jika kosong
      if (slides.length === 0) {
        console.log('⚠️ No slides found, using default')
        slides = [
          { image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop", badge: "INOVASI LPPSLH", title: "Platform Manajemen", highlight: "Proyek Terpadu", description: "Hubungkan tim lapangan dan kantor dalam satu ekosistem digital. Inspektur upload kegiatan harian, foto, dan dokumen langsung dari lokasi." },
          { image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=1920&h=1080&fit=crop", badge: "REAL-TIME COLLABORATION", title: "Kerja Tim", highlight: "Lebih Efektif", description: "Komunikasi instan, notifikasi push, dan berbagi dokumen langsung dari lokasi proyek. Data langsung tampil di dashboard." },
          { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop", badge: "DATA-DRIVEN", title: "Insight &", highlight: "Analitik Cerdas", description: "Dashboard interaktif untuk pengambilan keputusan strategis berdasarkan data real-time dari lapangan." }
        ]
      }

      if (partnersList.length === 0) {
        partnersList = [
          { name: "Kementerian PUPR", logo: "/images/pu.png" },
          { name: "Pam Jaya", logo: "/images/pamjaya.png" },
          { name: "Kementerian Desa", logo: "/images/pdtt.png" },
          { name: "Kementerian Tenaga Kerja", logo: "/images/transmigrasi.png" },
          { name: "Global Green Growth Institute", logo: "/images/gggi.png" },
          { name: "Kementerian Agama", logo: "/images/agama.png" },
          { name: "Kementerian Sekretariat Negara", logo: "/images/setneg.png" }
        ]
      }

      if (!workflow) {
        workflow = {
          title: 'Dari Lapangan ke Dashboard',
          subtitle: 'Inspektur upload kegiatan harian (foto, video, PDF) → Data langsung tampil di web dalam hitungan detik',
          mobile_video: '',
          mobile_image: '',
          monitor_video: '',
          monitor_image: '',
          steps: [
            { title: 'Upload di Lapangan', desc: 'Foto progres, isi form harian, lampirkan dokumen. Bisa offline.', icon: 'FiUploadCloud' },
            { title: 'Sinkronisasi Real-time', desc: 'Data terkirim ke cloud terenkripsi dalam <2 detik, notifikasi ke manajer.', icon: 'FiCloud' },
            { title: 'Monitoring Dashboard', desc: 'Manajer lihat data & analitik langsung, generate laporan, pantau KPI.', icon: 'FiEye' }
          ],
          stats: [
            { label: 'Kecepatan Sinkron', value: '< 2 detik', icon: 'FiZap', gradient: 'from-yellow-500 to-amber-500' },
            { label: 'Data Terproses', value: '2.5M+', icon: 'FiDatabase', gradient: 'from-green-500 to-emerald-500' },
            { label: 'Efisiensi Waktu', value: '+67%', icon: 'FiTrendingUp', gradient: 'from-purple-500 to-indigo-500' }
          ]
        }
      }

      if (!mobile) {
        mobile = {
          title: 'Monitoring Proyek dari Genggaman Tangan',
          subtitle: 'Aplikasi mobile untuk inspektur lapangan: upload kegiatan harian, foto progres, dan dokumen pendukung',
          video: '',
          image: '',
          features: [
            { title: 'Real-time messaging & notifikasi', desc: 'Inspektur kirim laporan dengan foto/video, manajer terima notifikasi instan.' },
            { title: 'Tasks, punch lists, inspeksi', desc: 'Buat daftar periksa, catat ketidaksesuaian, lampirkan bukti.' },
            { title: 'Scheduling & laporan otomatis', desc: 'Generate PDF report custom, bagikan ke stakeholder.' }
          ]
        }
      }

      if (!digital) {
        digital = {
          title: 'Real work, not paperwork',
          subtitle: 'Semua formulir harian, timesheet, RFI digital. Data langsung masuk sistem.',
          video: '',
          image: '',
          features: [
            { title: 'Mobile plan viewing & markup', desc: 'Lihat gambar teknis di HP, tambah catatan, upload as-built.' },
            { title: 'Markups & as-builts offline', desc: 'Rekam perubahan meski offline, sinkron otomatis saat online.' },
            { title: 'Digitized forms', desc: 'Daily report, timesheet, RFI digital, hemat waktu dan kurangi error.' }
          ]
        }
      }

      if (stats.length === 0) {
        stats = [
          { icon: "FiBriefcase", value: "500", suffix: "+", label: "Proyek Berhasil", gradient: "from-blue-500 to-cyan-500" },
          { icon: "FiUsers", value: "2500", suffix: "+", label: "Pengguna Aktif", gradient: "from-purple-500 to-indigo-500" },
          { icon: "FiGlobe", value: "34", suffix: "+", label: "Provinsi", gradient: "from-emerald-500 to-teal-500" },
          { icon: "FiBarChart2", value: "99.9", suffix: "%", label: "Uptime", gradient: "from-amber-500 to-orange-500" }
        ]
      }

      if (gallery.length === 0) {
        gallery = [
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1517686469429-8bdb88b9f947?w=600&h=400&fit=crop"
        ]
      }

      if (featuresList.length === 0) {
        featuresList = [
          { icon: "FiMessageSquare", title: "Komunikasi Real-time", desc: "Pesan, notifikasi push, diskusi terpusat. Inspektur langsung terhubung dengan manajer.", gradient: "from-cyan-500 to-blue-500" },
          { icon: "FiClipboard", title: "Manajemen Tugas & Inspeksi", desc: "Daftar periksa, inspeksi, bukti foto/video. Lacak setiap temuan di lapangan.", gradient: "from-blue-500 to-indigo-500" },
          { icon: "FiCalendar", title: "Jadwal & Laporan", desc: "Jadwal otomatis, laporan PDF dari data harian. Efisiensi waktu pelaporan.", gradient: "from-indigo-500 to-purple-500" },
          { icon: "FiImage", title: "Markup & As-built", desc: "Edit gambar di mobile, simpan versi as-built, dan sinkronkan ke cloud.", gradient: "from-purple-500 to-pink-500" },
          { icon: "FiFileText", title: "Form Digital", desc: "Digitalisasi formulir harian, timesheet, RFI. Data langsung masuk database tanpa re-entry.", gradient: "from-pink-500 to-rose-500" },
          { icon: "FiShield", title: "Keamanan Enterprise", desc: "Enkripsi end-to-end, kontrol akses berbasis peran. Data proyek tetap aman.", gradient: "from-rose-500 to-orange-500" }
        ]
      }

      setHeroSlides(slides)
      setPartners(partnersList)
      setWorkflowData(workflow)
      setMobileData(mobile)
      setDigitalData(digital)
      setStatsData(stats)
      setGalleryImages(gallery)
      setTestimonials(testimonialsList)
      setFeatures(featuresList)
      setCta(ctaData)
      setRefreshKey(Date.now())
      console.log('✅ State updated with data from database')
    } catch (err) {
      console.error('❌ Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Memuat data innovation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white overflow-x-hidden" key={refreshKey}>
      <style>{globalStyles}</style>
      <HeroSlideshow slides={heroSlides} />
      <PartnerMarquee partners={partners} />
      <WorkflowSection data={workflowData} />

      <DemoVideo />

      {/* SECTION 1 - Mobile-first */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto py-20 px-6 md:px-16">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full">📱 MOBILE-FIRST</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">{mobileData.title || 'Monitoring Proyek dari Genggaman Tangan'}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-2">{mobileData.subtitle || 'Aplikasi mobile untuk inspektur lapangan: upload kegiatan harian, foto progres, dan dokumen pendukung'}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="flex justify-center">
              <IphoneFrame 
                src={mobileData.video || mobileData.image || 'images/s.mp4'} 
                alt="Dashboard" 
                objectFit="cover" 
                isVideo={!!mobileData.video} 
              />
            </div>
            <div className="space-y-8">
              {mobileData.features && mobileData.features.map((feature: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Digitalisasi */}
      <section className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto py-20 px-6 md:px-16">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-amber-600 bg-amber-100 rounded-full">📋 DIGITALISASI LAPANGAN</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">{digitalData.title || 'Real work, not paperwork'}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-2">{digitalData.subtitle || 'Semua formulir harian, timesheet, RFI digital. Data langsung masuk sistem.'}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {digitalData.features && digitalData.features.map((feature: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <IphoneFrame 
                src={digitalData.video || digitalData.image || 'images/s.mp4'} 
                alt="Mobile Plan" 
                objectFit="cover" 
                isVideo={!!digitalData.video} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - STATISTIK */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-rose-600 bg-rose-100 rounded-full mb-4">📊 DAMPAK NYATA</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Membangun proyek dalam skala apa pun.</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Dari proyek kecil hingga mega-proyek infrastruktur, platform kami tumbuh bersama kebutuhan Anda.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {statsData.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg`}>
                  <StatIcon iconName={stat.icon} size={28} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}{stat.suffix || ''}</h3>
                <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => {
              const imgWithTimestamp = `${img}?t=${refreshKey}`
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  className="cursor-pointer overflow-hidden rounded-xl shadow-md"
                  onClick={() => setModalImage(img)}
                >
                  <img src={imgWithTimestamp} className="w-full h-48 object-cover transition duration-300 hover:scale-105" alt={`Proyek ${idx+1}`} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 - FITUR */}
      <section id="features" className="py-20 px-6 md:px-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-purple-600 bg-purple-100 rounded-full">FITUR UNGGULAN</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Semua yang Anda Butuhkan dalam Satu Platform</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mt-3">Fitur canggih untuk memaksimalkan produktivitas tim lapangan dan kantor</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, idx) => {
              const Icon = (() => {
                const icons: Record<string, any> = {
                  FiMessageSquare, FiClipboard, FiCalendar, FiImage, FiFileText, FiShield
                }
                return icons[item.icon] || FiStar
              })()
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${item.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-15 transition duration-500`} />
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition duration-300 shadow-md`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition">{item.title}</h3>
                  <p className="text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition duration-300">
                    <FiArrowRight className="text-gray-300" size={20} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 px-6 md:px-16 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-amber-600 bg-amber-100 rounded-full">TESTIMONI</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Apa Kata Klien Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {testimonials.map((t, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-6 shadow-sm text-left">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={`${t.avatar}?t=${refreshKey}`} className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{t.text}"</p>
                  <div className="flex text-yellow-400 mt-3">
                    {[...Array(t.rating || 5)].map((_, i) => <FiStar key={i} fill="currentColor" size={14} className="mr-0.5" />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-20 px-6 md:px-16 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            {cta?.title || 'Siap Transformasi Digital Proyek Anda?'}
          </h2>
          <p className="mt-4 text-gray-300">{cta?.description || 'Inspektur lapangan upload kegiatan, manajer pantau real-time.'}</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href={cta?.button_link || '/contact'} className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-medium hover:shadow-xl hover:-translate-y-1 transition">
              {cta?.button_text || 'Konsultasi Gratis'} <FiArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link href="#features" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition">Lihat Fitur</Link>
          </div>
        </div>
      </section>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={scrollToTop} className="fixed bottom-8 right-8 bg-gradient-to-r from-gray-900 to-black text-white p-3 rounded-full shadow-lg z-50 border border-cyan-500/30">
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>{modalImage && <ImageModal image={modalImage} onClose={() => setModalImage(null)} />}</AnimatePresence>
    </div>
  )
}