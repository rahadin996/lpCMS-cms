// src/app/(public)/about/page.tsx
'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from 'framer-motion'
import { 
  FiArrowRight, FiEye, FiTarget, FiHeart, FiBriefcase, FiUsers, FiAward, 
  FiCalendar, FiMapPin, FiMail, FiPhone, FiTwitter, FiLinkedin, FiInstagram, 
  FiFacebook, FiCheckCircle, FiGlobe, FiBook, FiTrendingUp, FiUserCheck, FiArrowUp,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiStar, FiPlay, FiPause, FiCpu, 
  FiZap, FiShield, FiClock, FiBarChart2, FiCamera, FiZoomIn, FiX
} from 'react-icons/fi'
import { IconType } from 'react-icons'

// ========== Type Definitions ==========
interface SlideItem {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
}

interface StatItem {
  label: string
  value: number
  icon: IconType
  suffix: string
  color: string
}

interface Leader {
  name: string
  position: string
  bio: string
  image: string
  expertise: string
}

interface TimelineEvent {
  year: number
  title: string
  desc: string
  image?: string
}

interface Certification {
  title: string
  desc: string
  icon: IconType
}

interface Partner {
  name: string
  logo: string
}

interface ValueItem {
  title: string
  desc: string
  icon: IconType
  color: string
}

interface TechItem {
  name: string
  desc: string
  icon: IconType
  color: string
}

interface GalleryImage {
  src: string
  title: string
  category: string
}

// ========== HOOK COUNTUP ==========
const useCountUp = (target: number, duration: number = 2000): number => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

// ========== MARQUEE PARTNER SUPER PREMIUM ==========
const PartnerItem = ({ partner }: { partner: Partner }) => {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="group relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-105 cursor-default">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
      {!imgError ? (
        <img src={partner.logo} alt={partner.name} className="h-6 w-auto object-contain relative z-10 transition duration-500" onError={() => setImgError(true)} />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white relative z-10 shadow-sm">
          {partner.name.charAt(0)}
        </div>
      )}
      <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition hidden sm:inline relative z-10">{partner.name}</span>
    </div>
  )
}

const PartnerMarquee = () => {
  const partners: Partner[] = [
    { name: "Kementrian PUPR", logo: "/images/pu.png" },
    { name: "Pam Jaya", logo: "/images/pamjaya.png" },
    { name: "Kementrian Desa, Pembangunan Daerah Tertinggal Dan Transmigrasi", logo: "/images/pdtt.png" },
    { name: "Kementrian Tenaga Kerja Dan Transmigrasi", logo: "/images/transmigrasi.png" },
    { name: "Global Green Growth Institute", logo: "/images/gggi.png" },
    { name: "Kementrian Agama", logo: "/images/agama.png" },
    { name: "Kementrian Sekretariat Negara", logo: "/images/setneg.png" },
  ]
  const duplicated = [...partners, ...partners]
  return (
    <div className="relative w-full overflow-hidden py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="absolute inset-0 backdrop-blur-sm bg-white/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/5" />
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gray-300/60 to-transparent" />
      <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent" />
      <div className="relative z-10">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">MITRA KAMI</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">Dipercaya oleh Lembaga Ternama</h2>
        </div>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 35, repeat: Infinity, ease: "linear", repeatType: "loop" }} className="flex gap-8 items-center w-max px-4 will-change-transform">
          {duplicated.map((partner, idx) => <PartnerItem key={idx} partner={partner} />)}
        </motion.div>
      </div>
    </div>
  )
}

// ========== HERO SLIDESHOW ==========
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
  const pauseAuto = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  const resumeAuto = () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = setInterval(() => nextSlide(), 5000) }
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
  const currentSlide = slides[currentIndex]
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" onMouseEnter={pauseAuto} onMouseLeave={resumeAuto}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div key={currentIndex} custom={direction} variants={bgVariants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
          <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-30" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000" />
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 text-white">
        <AnimatePresence mode="wait">
          <motion.div key={`badge-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-sm font-medium tracking-wide">{currentSlide.badge}</span>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.h1 key={`title-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
            {currentSlide.title}<br /><span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{currentSlide.highlight}</span>
          </motion.h1>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p key={`desc-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">{currentSlide.description}</motion.p>
        </AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/contact" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="relative z-10">Hubungi Kami</span><FiArrowRight className="relative z-10 group-hover:translate-x-1 transition" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300" />
          </Link>
          <Link href="/sectors" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 hover:-translate-y-1 transition">Sektor Layanan</Link>
        </motion.div>
      </div>
      <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition"><FiChevronLeft size={24} /></button>
      <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition"><FiChevronRight size={24} /></button>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, idx) => (<button key={idx} onClick={() => goToSlide(idx)} className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />))}
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-10"><FiChevronDown className="animate-bounce" size={20} /></div>
    </div>
  )
}

// ========== DATA ==========
const heroSlides: SlideItem[] = [
  { image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop", badge: "TENTANG LPPSLH", title: "Konsultan Terpercaya", highlight: "Sejak 2002", description: "Mitra strategis dalam perencanaan wilayah, konsultansi lingkungan, dan pemberdayaan masyarakat berkelanjutan." },
  { image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop", badge: "VISI KAMI", title: "Membangun Negeri", highlight: "Berkelanjutan & Inklusif", description: "Menjadi konsultan terpercaya yang berkontribusi dalam mewujudkan pembangunan berkelanjutan dan pemberdayaan masyarakat." },
  { image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop", badge: "PENGHARGAAN", title: "Diakui Nasional", highlight: "Mitra Pemerintah & Swasta", description: "Berkolaborasi dengan berbagai kementerian, pemerintah daerah, dan lembaga internasional." },
  { image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop", badge: "KOMITMEN KAMI", title: "Profesional & Integritas", highlight: "Solusi Terbaik", description: "Memberikan layanan konsultansi yang inovatif, tepat waktu, dan berorientasi pada kepuasan klien." }
]

// Statistik untuk bagian "Kami dalam Angka" (dengan warna gradient)
const advancedStats: StatItem[] = [
  { label: "Tahun Berdiri", value: 2002, icon: FiCalendar, suffix: "", color: "from-blue-500 to-cyan-500" },
  { label: "Pengalaman", value: 24, icon: FiTrendingUp, suffix: "+", color: "from-purple-500 to-pink-500" },
  { label: "Proyek Selesai", value: 487, icon: FiBriefcase, suffix: "+", color: "from-emerald-500 to-teal-500" },
  { label: "Klien Puas", value: 99, icon: FiStar, suffix: "%", color: "from-amber-500 to-orange-500" },
  { label: "Tenaga Ahli", value: 126, icon: FiUsers, suffix: "", color: "from-red-500 to-rose-500" },
  { label: "Penghargaan", value: 78, icon: FiAward, suffix: "", color: "from-indigo-500 to-blue-500" },
  { label: "Mitra Kerja", value: 50, icon: FiGlobe, suffix: "+", color: "from-green-500 to-emerald-500" },
  { label: "Kota Tersebar", value: 15, icon: FiMapPin, suffix: "+", color: "from-cyan-500 to-blue-500" },
]

const leadership: Leader[] = [
  { name: "Ir. Siti Zubaidah, M.Si", position: "Komisaris", bio: "Memiliki pengalaman luas dalam pengembangan masyarakat dan kebijakan publik. Mengawasi arah strategis perusahaan dengan fokus pada keberlanjutan dan pemberdayaan masyarakat.", image: "https://randomuser.me/api/portraits/women/68.jpg", expertise: "Kebijakan Publik" },
  { name: "Fahmy Ibrahim Syarifuddin, SE, B.Sc", position: "Direktur", bio: "Memimpin operasional perusahaan dengan pengalaman di bidang manajemen proyek dan konsultansi pembangunan. Bertanggung jawab atas pengembangan bisnis dan pelayanan konsultansi.", image: "https://randomuser.me/api/portraits/men/32.jpg", expertise: "Manajemen Proyek" },
]

const timelineEvents: TimelineEvent[] = [
  { year: 1999, title: "Rintisan Awal", desc: "Dirintis dengan fokus pada peningkatan peran serta dalam pembangunan masyarakat, khususnya masyarakat miskin dan marginal.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400" },
  { year: 2002, title: "Pendirian Resmi", desc: "PT. LPPSLH Konsultan didirikan secara resmi di Semarang pada tanggal 1 Juli 2002 dengan Akta Pendirian Nomor 6 pada Notaris Indrijadi, S.H.", image: "https://images.unsplash.com/photo-1497366815505-2a06b4c2d1b2?w=400" },
  { year: 2005, title: "Keanggotaan INKINDO", desc: "Terdaftar sebagai anggota INKINDO Jawa Tengah dengan nomor keanggotaan 12430/P/0580.JT.", image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400" },
  { year: 2010, title: "Keanggotaan KADIN", desc: "Bergabung sebagai anggota KADIN Jawa Tengah dengan nomor keanggotaan 20301-2220313364.", image: "https://images.unsplash.com/photo-1497366754035-f2008d2a7c4b?w=400" },
  { year: 2024, title: "Pembaruan Akta", desc: "Perubahan akte terakhir dengan Nomor 68 tanggal 01 Juli 2024 pada Notariat M. Khalid Artha, S.H, menegaskan komitmen berkelanjutan.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400" },
]

const certifications: Certification[] = [
  { title: "Anggota INKINDO", desc: "No. 12430/P/0580.JT", icon: FiBriefcase },
  { title: "Anggota KADIN", desc: "No. 20301-2220313364", icon: FiUsers },
  { title: "Akta Notaris", desc: "No. 6 Tahun 2002 / No. 68 Tahun 2024", icon: FiBook },
  { title: "Mitra Terpercaya", desc: "Bekerja sama dengan berbagai instansi", icon: FiGlobe },
]

const values: ValueItem[] = [
  { title: "Profesionalisme & Integritas", desc: "Kami mengutamakan kualitas, etika, dan kejujuran dalam setiap layanan.", icon: FiShield, color: "from-blue-500 to-cyan-500" },
  { title: "Inovasi & Kreativitas", desc: "Terus berinovasi dengan teknologi terkini untuk solusi terbaik.", icon: FiZap, color: "from-purple-500 to-pink-500" },
  { title: "Kolaborasi & Kemitraan", desc: "Bekerja sama dengan berbagai pihak untuk hasil optimal.", icon: FiUsers, color: "from-emerald-500 to-teal-500" },
  { title: "Keberlanjutan & Pemberdayaan", desc: "Berfokus pada pembangunan berkelanjutan dan pemberdayaan masyarakat.", icon: FiHeart, color: "from-amber-500 to-orange-500" },
  { title: "Tanggung Jawab Sosial", desc: "Peduli terhadap lingkungan dan masyarakat sekitar.", icon: FiGlobe, color: "from-red-500 to-rose-500" },
]

const techInnovations: TechItem[] = [
  { name: "Digital Twin", desc: "Simulasi 3D untuk infrastruktur", icon: FiCpu, color: "bg-blue-100 text-blue-600" },
  { name: "GIS & Spatial", desc: "Analisis spasial presisi", icon: FiMapPin, color: "bg-green-100 text-green-600" },
  { name: "AI & Big Data", desc: "Prediksi dan optimasi", icon: FiBarChart2, color: "bg-purple-100 text-purple-600" },
  { name: "Cloud Collaboration", desc: "Platform kolaborasi real-time", icon: FiGlobe, color: "bg-amber-100 text-amber-600" },
]

const galleryImages: GalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop", title: "Kantor Pusat", category: "Office" },
  { src: "https://images.unsplash.com/photo-1497366754035-f2008d2a7c4b?w=800&h=600&fit=crop", title: "Ruang Rapat", category: "Office" },
  { src: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop", title: "Kegiatan Workshop", category: "Event" },
  { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop", title: "Pelatihan", category: "Event" },
  { src: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&h=600&fit=crop", title: "Proyek Infrastruktur", category: "Project" },
  { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop", title: "Kota Mandiri", category: "Project" },
]

export default function AboutPage() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null)
  const [activeTimeline, setActiveTimeline] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const fadeUp: Variants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }
  const fadeLeft: Variants = { hidden: { opacity: 0, x: -70 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } }
  const fadeRight: Variants = { hidden: { opacity: 0, x: 70 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } }
  const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }

  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden">
      <HeroSlideshow slides={heroSlides} />
      <PartnerMarquee />

      {/* Statistik Premium - Kami dalam Angka */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">KAMI DALAM ANGKA</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Dampak Nyata <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">di Seluruh Indonesia</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {advancedStats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
              className="group relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg`}>
                <stat.icon size={28} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{useCountUp(stat.value)}{stat.suffix}</h3>
              <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Profil & Sejarah */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">PROFIL PERUSAHAAN</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Mitra Terpercaya dalam Pembangunan Berkelanjutan</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-4 rounded-full" />
            <p className="mt-6 text-gray-600 leading-relaxed">PT. LPPSLH Konsultan pada awalnya dirintis sekitar tahun 1999 dengan pertimbangan peningkatan peran serta dalam kegiatan pembangunan masyarakat, khususnya masyarakat miskin dan marginal, pengembangan kapasitas dan profesionalisme sumber daya manusia, serta peningkatan daya dukung sumber daya finansial untuk kegiatan pengembangan masyarakat secara mandiri dan berkelanjutan.</p>
            <p className="mt-4 text-gray-600 leading-relaxed">Dengan pertimbangan tersebut, secara resmi PT. LPPSLH Konsultan didirikan di Semarang pada tanggal 1 Juli 2002 dengan Akta Pendirian Nomor 6 pada Notaris Indrijadi, S.H. Sejak saat itu, kami terus berkembang dan berkomitmen memberikan layanan konsultansi terbaik.</p>
            <div className="mt-6 flex gap-4"><FiCheckCircle className="text-green-500" /><span className="text-gray-600">Terakreditasi & Bersertifikasi Nasional</span></div>
            <div className="flex gap-4 mt-2"><FiCheckCircle className="text-green-500" /><span className="text-gray-600">Mitra Pemerintah & Swasta Se-Indonesia</span></div>
          </motion.div>
          <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop" alt="Kantor" className="w-full h-auto" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3"><FiAward className="text-amber-500 text-3xl" /><div><p className="font-bold">Best Consulting Firm</p><p className="text-xs text-gray-500">2024 - World Bank</p></div></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visi Misi Nilai - Lebih premium */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-purple-600 bg-purple-100 rounded-full mb-4">VISI & MISI</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Landasan <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Kami</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5"><FiEye size={40} className="text-blue-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Visi</h3>
              <p className="text-gray-600 text-center">Menjadi konsultan terpercaya yang berkontribusi dalam mewujudkan pembangunan berkelanjutan dan pemberdayaan masyarakat melalui layanan konsultansi yang profesional, inovatif, dan berintegritas.</p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"><FiTarget size={40} className="text-green-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Misi</h3>
              <ul className="space-y-2 text-left">
                {["Meningkatkan peran serta dalam kegiatan pembangunan masyarakat, khususnya masyarakat miskin dan marginal","Mengembangkan kapasitas dan profesionalisme SDM","Memperluas jaringan kelembagaan dan meningkatkan keahlian","Meningkatkan daya dukung sumber daya finansial secara mandiri"].map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600"><FiCheckCircle className="text-green-500 shrink-0 mt-1" size={16} /><span className="text-sm">{m}</span></li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5"><FiHeart size={40} className="text-amber-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Nilai-Nilai</h3>
              <div className="grid grid-cols-1 gap-2">
                {values.map((val, i) => (
                  <div key={i} className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full bg-gradient-to-r ${val.color}`} /><span className="text-sm text-gray-700">{val.title}</span></div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Interaktif dengan thumbnail */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-cyan-600 bg-cyan-100 rounded-full mb-4">PERJALANAN KAMI</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Sejarah <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">LPPSLH Konsultan</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 hidden md:block" />
          {timelineEvents.map((event, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              onMouseEnter={() => setActiveTimeline(idx)} onMouseLeave={() => setActiveTimeline(null)}>
              <div className="md:w-1/2 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-2"><span className="text-3xl font-bold text-blue-600">{event.year}</span><span className="text-sm text-gray-400">|</span><h3 className="text-xl font-bold text-gray-900">{event.title}</h3></div>
                <p className="text-gray-500">{event.desc}</p>
              </div>
              <div className="md:w-1/2 hidden md:block" />
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-md hidden md:block z-10" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Teknologi & Inovasi */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-4">TEKNOLOGI & INOVASI</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Masa Depan <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Infrastruktur</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {techInnovations.map((tech, idx) => (
              <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition text-center">
                <div className={`w-16 h-16 rounded-full ${tech.color} flex items-center justify-center mx-auto mb-4`}><tech.icon size={32} /></div>
                <h3 className="text-xl font-bold">{tech.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Kegiatan (Lightbox) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-rose-600 bg-rose-100 rounded-full mb-4">GALERI KEGIATAN</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Momen <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600">Terbaik Kami</span></h2>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((img, idx) => (
            <motion.div key={idx} variants={fadeUp} className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition" onClick={() => { setCurrentImage(img); setLightboxOpen(true); }}>
              <img src={img.src} alt={img.title} className="w-full h-64 object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <div><p className="text-white font-bold">{img.title}</p><p className="text-white/80 text-sm">{img.category}</p></div>
              </div>
              <div className="absolute top-3 right-3 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition"><FiZoomIn className="text-white" /></div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && currentImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
            <button className="absolute top-6 right-6 text-white text-3xl z-10" onClick={() => setLightboxOpen(false)}><FiX /></button>
            <img src={currentImage.src} alt={currentImage.title} className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl" />
            <div className="absolute bottom-6 left-0 right-0 text-center text-white bg-black/50 py-2">{currentImage.title} - {currentImage.category}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tim Kepemimpinan */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-4">TIM KEPEMIMPINAN</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Dewan <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Pengurus</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {leadership.map((leader, idx) => (
              <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="grid md:grid-cols-3 gap-6 p-6">
                  <div className="md:col-span-1"><img src={leader.image} alt={leader.name} className="w-full h-auto rounded-xl object-cover shadow-md" /></div>
                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-gray-900">{leader.name}</h3>
                    <p className="text-blue-600 font-medium mt-1">{leader.position}</p>
                    <p className="text-gray-500 text-sm mt-2">{leader.expertise}</p>
                    <p className="text-gray-600 mt-3 leading-relaxed">{leader.bio}</p>
                    <div className="flex gap-3 mt-4"><a href="#" className="text-gray-400 hover:text-blue-600 transition"><FiLinkedin size={20} /></a><a href="#" className="text-gray-400 hover:text-blue-600 transition"><FiMail size={20} /></a></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sertifikasi & Penghargaan */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-amber-600 bg-amber-100 rounded-full mb-4">PENGAKUAN</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Sertifikasi & <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">Keanggotaan</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, idx) => (
            <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4"><cert.icon size={32} className="text-amber-600" /></div>
              <h3 className="text-xl font-bold text-gray-900">{cert.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{cert.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Super Premium */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=600&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" /></div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Siap Bekerja Sama dengan Kami?</h2>
          <p className="mt-4 text-xl text-white/80">Diskusikan kebutuhan konsultansi Anda dengan tim ahli kami</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition hover:-translate-y-0.5 text-lg">Hubungi Kami <FiArrowRight /></Link>
            <Link href="/sectors" className="inline-flex items-center gap-2 border border-white/30 backdrop-blur-sm px-8 py-4 rounded-full font-medium hover:bg-white/10 transition text-lg">Lihat Sektor Layanan</Link>
          </div>
        </motion.div>
      </section>

      {/* Back to Top */}
      <AnimatePresence>{showBackToTop && <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={scrollToTop} className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-40"><FiArrowUp size={24} /></motion.button>}</AnimatePresence>

      <style jsx>{`
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .animate-pulse { animation: pulse 4s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      `}</style>
    </div>
  )
}