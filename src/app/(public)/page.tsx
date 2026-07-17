// src/app/(public)/page.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  FiArrowRight, FiTrendingUp, FiUsers, FiBriefcase, FiAward, FiStar, FiGlobe, 
  FiCpu, FiCalendar, FiUser, FiMail, FiMapPin, FiPhone, FiChevronRight, FiHeart,
  FiBarChart2, FiCompass, FiDroplet, FiChevronDown, FiChevronUp, FiArrowUp,
  FiTv, FiCloud, FiServer, FiCheckCircle, FiChevronLeft
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { createClient } from '@/lib/supabase/client'
import { getAllPersonil, Personil } from '@/lib/personil'

// ========== Type Definitions ==========
interface StatItem {
  icon: string
  value: number
  label: string
  suffix: string
  color: string
}

interface ServiceFeature {
  title: string
  desc: string
  icon: string
  link: string
  features: string[]
}

interface PortfolioItem {
  title: string
  location: string
  year: number
  image: string
  category: string
  size: 'large' | 'medium' | 'small'
}

interface FaqItem {
  q: string
  a: string
}

interface ArticleItem {
  title: string
  desc: string
  date: string
  readTime: string
  image: string
  link: string
}

interface TestimonialItem {
  name: string
  role: string
  text: string
  rating: number
  avatar: string
}

interface AwardItem {
  title: string
  organizer: string
  year: number
  icon: string
}

interface SlideItem {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
}

interface Partner {
  name: string
  logo: string
}

interface CtaContent {
  title: string
  description: string
  placeholder: string
  button_text: string
}

// ========== Icon Map ==========
const iconMap: Record<string, IconType> = {
  FiBriefcase, FiUsers, FiAward, FiStar, FiGlobe, FiHeart,
  FiCompass, FiDroplet, FiBarChart2, FiMapPin, FiTrendingUp,
  FiCpu, FiServer, FiTv, FiCloud, FiCheckCircle
}
const getIcon = (name: string): IconType => iconMap[name] || FiBriefcase

// ========== Custom Hook CountUp ==========
const useCountUp = (target: number, duration: number = 4000): number => {
  const [count, setCount] = useState<number>(0)
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

// ========== KOMPONEN STAT CARD ==========
const StatCard = ({ stat, idx }: { stat: StatItem; idx: number }) => {
  const Icon = getIcon(stat.icon)
  const count = useCountUp(stat.value)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      className="group relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg`}>
        <Icon size={28} />
      </div>
      <h3 className="text-3xl font-bold text-gray-900">{count}{stat.suffix}</h3>
      <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
    </motion.div>
  )
}

// ========== KOMPONEN MARQUEE PARTNER ==========
const PartnerItem = ({ partner }: { partner: Partner }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="group relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-105 cursor-default">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
      {!imgError ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-6 w-auto object-contain relative z-10 transition duration-500"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white relative z-10 shadow-sm">
          {partner.name.charAt(0)}
        </div>
      )}
      <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition hidden sm:inline relative z-10">
        {partner.name}
      </span>
    </div>
  );
};

const PartnerMarquee = ({ items }: { items: Partner[] }) => {
  if (!items || items.length === 0) return null
  const duplicated = [...items, ...items]
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
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex gap-8 items-center w-max px-4 will-change-transform"
        >
          {duplicated.map((partner, idx) => (
            <PartnerItem key={idx} partner={partner} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ========== HERO SLIDESHOW ==========
const HeroSlideshow = ({ slides }: { slides: SlideItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }
  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (slides.length === 0) return
    intervalRef.current = setInterval(() => nextSlide(), 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [slides.length])

  const pauseAutoSlide = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  const resumeAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => nextSlide(), 4000)
  }

  if (slides.length === 0) return null

  const bgVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.7 }
    }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.7 } },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.5 }
    })
  }

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  const currentSlide = slides[currentIndex]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" onMouseEnter={pauseAutoSlide} onMouseLeave={resumeAutoSlide}>
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
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium tracking-wide">{currentSlide.badge}</span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1 key={`title-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
            {currentSlide.title}<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{currentSlide.highlight}</span>
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p key={`desc-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            {currentSlide.description}
          </motion.p>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/contact" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="relative z-10">Konsultasi Sekarang</span>
            <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300" />
          </Link>
          <Link href="/projects" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 hover:-translate-y-1 transition">
            Lihat Portofolio
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

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-10">
        <FiChevronDown className="animate-bounce" size={20} />
      </div>
    </div>
  )
}

// ========== HOMEPAGE COMPONENT ==========
export default function HomePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  // ===== STATE DENGAN DEFAULT DARI FILE STATIS =====
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>([
    {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop",
      badge: "LPPSLH - EST. 1998",
      title: "Konsultan Teknik & Manajemen",
      highlight: "Pendidikan dan Pemberdayaan Masyarakat",
      description: "LPPSLH – mitra strategis dalam perencanaan wilayah, konsultansi lingkungan, dan manajemen proyek berkelanjutan."
    },
    {
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop",
      badge: "KONSULTANSI LINGKUNGAN",
      title: "Solusi Ramah Lingkungan",
      highlight: "Untuk Masa Depan Berkelanjutan",
      description: "Kajian AMDAL, UKL-UPL, dan strategi hijau yang terintegrasi untuk proyek Anda."
    },
    {
      image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1920&h=1080&fit=crop",
      badge: "PEMBERDAYAAN MASYARAKAT",
      title: "Bersama Masyarakat",
      highlight: "Membangun Negeri",
      description: "Program capacity building dan partisipasi publik untuk kesejahteraan bersama."
    },
    {
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&h=1080&fit=crop",
      badge: "INOVASI TEKNOLOGI",
      title: "Digital Twin & Smart City",
      highlight: "Masa Depan Infrastruktur",
      description: "Integrasi IoT, AI, dan cloud untuk efisiensi dan akurasi perencanaan."
    }
  ])

  const [marqueeItems, setMarqueeItems] = useState<Partner[]>([
    { name: "Kementrian PUPR", logo: "/images/pu.png" },
    { name: "Pam Jaya", logo: "/images/pamjaya.png" },
    { name: "Kementrian Desa, Pembangunan Daerah Tertinggal Dan Transmigrasi", logo: "/images/pdtt.png" },
    { name: "Kementrian Tenaga Kerja Dan Transmigrasi", logo: "/images/transmigrasi.png" },
    { name: "Global Green Growth Institute", logo: "/images/gggi.png" },
    { name: "Kementrian Agama", logo: "/images/agama.png" },
    { name: "Kementrian Sekretariat Negara", logo: "/images/setneg.png" },
  ])

  const [stats, setStats] = useState<StatItem[]>([
    { icon: "FiBriefcase", value: 487, label: "Proyek Selesai", suffix: "+", color: "from-blue-500 to-cyan-500" },
    { icon: "FiUsers", value: 126, label: "Tim Profesional", suffix: "", color: "from-purple-500 to-pink-500" },
    { icon: "FiAward", value: 78, label: "Penghargaan", suffix: "", color: "from-emerald-500 to-teal-500" },
    { icon: "FiStar", value: 99, label: "Kepuasan Klien", suffix: "%", color: "from-amber-500 to-orange-500" },
    { icon: "FiGlobe", value: 15, label: "Kota Tersebar", suffix: "+", color: "from-cyan-500 to-blue-500" },
    { icon: "FiHeart", value: 250, label: "Mitra Aktif", suffix: "+", color: "from-red-500 to-rose-500" },
  ])

  const [services, setServices] = useState<ServiceFeature[]>([
    { title: "Perencanaan Strategis", desc: "Masterplan & roadmap pembangunan jangka panjang dengan pendekatan data-driven.", icon: "FiCompass", link: "/services", features: ["Analisis Big Data", "Simulasi 3D", "Konsultasi Regulasi"] },
    { title: "Konsultansi Lingkungan", desc: "AMDAL, UKL-UPL, dan strategi keberlanjutan ramah lingkungan.", icon: "FiDroplet", link: "/services", features: ["Eco-Assessment", "Carbon Footprint", "Green Certification"] },
    { title: "Manajemen Proyek", desc: "Supervisi, quality control, dan digital twin untuk efisiensi maksimal.", icon: "FiBarChart2", link: "/services", features: ["Real-time Monitoring", "Risk Management", "Digital Twin"] },
    { title: "Sistem Informasi Geografis", desc: "Pemetaan digital & analisis spasial untuk pengambilan keputusan.", icon: "FiMapPin", link: "/services", features: ["WebGIS", "Spatial Analysis", "3D Mapping"] },
    { title: "Kajian Kelayakan", desc: "Studi teknis, ekonomi, dan finansial proyek infrastruktur.", icon: "FiTrendingUp", link: "/services", features: ["Feasibility Study", "Cost-Benefit", "Financial Modeling"] },
    { title: "Pemberdayaan Masyarakat", desc: "Program capacity building dan partisipasi publik.", icon: "FiUsers", link: "/services", features: ["Community Engagement", "Training", "Social Impact"] },
    { title: "Transformasi Digital", desc: "Integrasi teknologi IoT, AI, dan Cloud untuk efisiensi bisnis.", icon: "FiCpu", link: "/services", features: ["IoT", "Cloud Computing", "AI Analytics"] },
    { title: "Konsultasi Hukum", desc: "Pendampingan perizinan dan regulasi proyek infrastruktur.", icon: "FiServer", link: "/services", features: ["Legal Opinion", "Due Diligence", "Permitting"] },
  ])

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { title: "Bandara Internasional", location: "Jawa Barat", year: 2024, image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=1000&fit=crop", category: "infrastructure", size: "large" },
    { title: "Kota Mandiri Nusantara", location: "Kalimantan", year: 2023, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop", category: "urban", size: "medium" },
    { title: "Jembatan Selat Sunda", location: "Bali-Jawa", year: 2025, image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f947?w=800&h=800&fit=crop", category: "engineering", size: "small" },
    { title: "Pembangunan PLTS", location: "NTB", year: 2024, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop", category: "energy", size: "medium" },
    { title: "Revitalisasi Kota Tua", location: "Jakarta", year: 2022, image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&h=600&fit=crop", category: "conservation", size: "small" },
    { title: "Smart City Project", location: "Surabaya", year: 2024, image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&h=600&fit=crop", category: "urban", size: "medium" },
    { title: "High-speed Rail", location: "Jakarta-Bandung", year: 2023, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop", category: "infrastructure", size: "small" },
  ])

  const [awards, setAwards] = useState<AwardItem[]>([
    { title: "Best Consulting Firm 2024", organizer: "World Bank", year: 2024, icon: "FiAward" },
    { title: "Innovation in Urban Planning", organizer: "ADB", year: 2023, icon: "FiTv" },
    { title: "Green Company Award", organizer: "Ministry of Environment", year: 2022, icon: "FiCloud" },
  ])

  // ===== STATE TEAM DARI DATABASE (fallback statis) =====
  const [team, setTeam] = useState<{ name: string; role: string; image: string }[]>([
    { name: "Mebby Suwarna, S.T", role: "Tenaga Ahli Air Minum", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Dirga Rangga Malindo, S.T", role: "Tenaga Ahli K3", image: "https://randomuser.me/api/portraits/men/2.jpg" },
    { name: "Yusuf Rachman, S.I", role: "Ahli IT", image: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "Dr. Lina Mariana", role: "Konsultan Lingkungan", image: "https://randomuser.me/api/portraits/women/4.jpg" },
  ])

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    { name: "Dr. Ir. Budi Santoso", role: "Kepala BAPPEDA Provinsi", text: "LPPSLH telah membantu kami menyusun masterplan yang visioner, aplikatif, dan sesuai dengan target pembangunan berkelanjutan.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Siti Nurhaliza, ST, M.Sc", role: "Project Director", text: "Profesionalisme, ketepatan waktu, dan inovasi yang diberikan sangat mengesankan. Tim LPPSLH benar-benar ahli di bidangnya.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Ir. Andi Wijaya, MBA", role: "Konsultan Senior", text: "Pemahaman mendalam tentang regulasi dan aspek teknis membuat LPPSLH menjadi mitra yang tak tergantikan.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
    { name: "Prof. Dr. Dewi Lestari", role: "Akademisi ITB", text: "Kolaborasi riset dan aplikasi teknologi terkini menjadikan LPPSLH pionir dalam konsultansi perencanaan.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/89.jpg" },
  ])

  const [faqs, setFaqs] = useState<FaqItem[]>([
    { q: "Apa saja layanan unggulan LPPSLH?", a: "Kami menyediakan perencanaan strategis, konsultansi lingkungan, manajemen proyek, GIS, kajian kelayakan, pemberdayaan masyarakat, transformasi digital, dan konsultasi hukum." },
    { q: "Bagaimana cara memulai konsultasi?", a: "Anda dapat mengisi form kontak atau menghubungi langsung nomor telepon kami. Tim kami akan merespon dalam 24 jam." },
    { q: "Apakah LPPSLH memiliki pengalaman internasional?", a: "Ya, kami telah mengerjakan proyek di beberapa negara Asia Tenggara dan bekerjasama dengan lembaga internasional seperti World Bank." },
    { q: "Berapa lama waktu penyelesaian proyek?", a: "Tergantung kompleksitas proyek. Rata-rata studi kelayakan memakan waktu 3-6 bulan, sedangkan perencanaan masterplan 6-12 bulan." },
    { q: "Apakah LPPSLH menyediakan pelatihan?", a: "Ya, kami memiliki program capacity building untuk pemerintah daerah dan swasta, termasuk workshop dan sertifikasi." },
  ])

  const [articles, setArticles] = useState<ArticleItem[]>([
    { title: "Tren Perencanaan Kota 2026: 15-Minute City", desc: "Konsep kota yang memungkinkan semua kebutuhan dalam 15 menit berjalan kaki.", date: "15 Mar 2026", readTime: "5 min", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop", link: "/news" },
    { title: "Digital Twin untuk Infrastruktur", desc: "Simulasi 3D untuk memprediksi dan mengoptimalkan kinerja infrastruktur.", date: "10 Feb 2026", readTime: "4 min", image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop", link: "/news" },
    { title: "Green Building Certification di Indonesia", desc: "Panduan mendapatkan sertifikasi bangunan ramah lingkungan.", date: "28 Jan 2026", readTime: "6 min", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop", link: "/news" },
    { title: "AI dalam Perencanaan Wilayah", desc: "Pemanfaatan kecerdasan buatan untuk analisis data spasial.", date: "5 Jan 2026", readTime: "7 min", image: "https://images.unsplash.com/photo-1488229297570-58520851e868?w=600&h=400&fit=crop", link: "/news" },
    { title: "Masa Depan Energi Terbarukan", desc: "Potensi dan tantangan transisi energi di Indonesia.", date: "20 Dec 2025", readTime: "8 min", image: "https://images.unsplash.com/photo-1508514177221-1888071b96b2?w=600&h=400&fit=crop", link: "/news" },
  ])

  const [cta, setCta] = useState<CtaContent>({
    title: 'Siap Mewujudkan Proyek Anda?',
    description: 'Konsultasikan kebutuhan Anda dengan tim ahli kami secara gratis.',
    placeholder: 'Alamat email',
    button_text: 'Hubungi Kami'
  })

  // ===== STATE UI =====
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover'>('default')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0)

  // ===== FETCH DATA DARI SUPABASE =====
  useEffect(() => {
    const fetchData = async () => {
      // 1. Ambil data konten homepage
      const { data: contentData } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'homepage')
        .eq('key', 'data')

      if (contentData && contentData.length > 0) {
        contentData.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            switch (item.section) {
              case 'hero_slides': setHeroSlides(parsed); break
              case 'partner_marquee': setMarqueeItems(parsed); break
              case 'stats': setStats(parsed); break
              case 'services': setServices(parsed); break
              case 'portfolio': setPortfolio(parsed); break
              case 'awards': setAwards(parsed); break
              case 'testimonials': setTestimonials(parsed); break
              case 'faqs': setFaqs(parsed); break
              case 'articles': setArticles(parsed); break
              case 'cta': setCta(prev => ({ ...prev, ...parsed })); break
            }
          } catch (e) { console.error('Gagal parse data:', e) }
        })
      }

      // 2. Ambil data personil dari database
      try {
        const personilData = await getAllPersonil()
        if (personilData && personilData.length > 0) {
          const mapped = personilData.map((p: Personil) => ({
            name: p.nama,
            role: p.posisi,
            image: p.image,
          }))
          setTeam(mapped)
        }
      } catch (err) {
        console.error('Gagal fetch personil:', err)
        // fallback ke statis sudah ada di state awal
      }

      setLoading(false)
    }
    fetchData()
  }, [supabase])

  // ===== EFFECTS UI =====
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY })
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (testimonials.length === 0) return
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const filteredPortfolio = activeFilter === 'all' ? portfolio : portfolio.filter(i => i.category === activeFilter)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Memuat data...</div>

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-gray-400 pointer-events-none z-50 mix-blend-difference"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16, scale: cursorVariant === 'hover' ? 2 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      <HeroSlideshow slides={heroSlides} />
      <PartnerMarquee items={marqueeItems} />

      {/* ========== STATISTIK ========== */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} idx={idx} />
          ))}
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4"
            >
              LAYANAN KAMI
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
            >
              Solusi <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Komprehensif</span>
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((service, idx) => {
              const Icon = getIcon(service.icon)
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden h-full"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <div className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.features.slice(0,2).map((f, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                          <FiCheckCircle size={10} /> {f}
                        </span>
                      ))}
                    </div>
                    <Link href={service.link} className="inline-flex items-center gap-1 mt-4 text-blue-600 font-medium text-sm hover:gap-2 transition">
                      Selengkapnya <FiChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== PORTOFOLIO ========== */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 text-sm font-medium text-purple-600 bg-purple-100 rounded-full mb-4"
          >
            PORTOFOLIO
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Proyek <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Unggulan</span>
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['all', 'infrastructure', 'urban', 'engineering', 'energy', 'conservation'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeFilter === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] gap-6">
          {filteredPortfolio.map((item, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative group rounded-2xl overflow-hidden shadow-md cursor-pointer ${
                item.size === 'large' ? 'lg:row-span-2 lg:col-span-2' : item.size === 'medium' ? 'lg:row-span-1 lg:col-span-1' : ''
              }`}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition duration-500">
                <span className="text-xs font-semibold text-white bg-blue-600 px-2 py-1 rounded-full">{item.category}</span>
                <h3 className="text-xl font-bold text-white mt-2">{item.title}</h3>
                <p className="text-gray-200 text-sm">{item.location} • {item.year}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-12">
          <Link href="/projects" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
            Lihat Semua Proyek <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ========== AWARDS ========== */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 text-sm font-medium text-amber-600 bg-amber-100 rounded-full mb-4"
            >
              PENGHARGAAN
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
            >
              Diakui <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">Global</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, idx) => {
              const Icon = getIcon(award.icon)
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-md text-center hover:shadow-xl transition"
                >
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} className="text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{award.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{award.organizer} • {award.year}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========== TEAM (dari database) ========== */}
      {team.length > 0 && (
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-full mb-4"
            >
              TENAGA AHLI
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
            >
              Para <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">Profesional</span> Berpengalaman
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ========== TESTIMONIAL ========== */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-4"
              >
                TESTIMONIAL
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
              >
                Apa Kata <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Klien Kami</span>
              </motion.h2>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonialIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl p-8 shadow-lg text-center"
                  >
                    {testimonials[testimonialIndex] && (
                      <>
                        <img src={testimonials[testimonialIndex].avatar} alt={testimonials[testimonialIndex].name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100" />
                        <div className="flex justify-center text-yellow-400 mb-4">
                          {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-600 italic text-lg">"{testimonials[testimonialIndex].text}"</p>
                        <h4 className="font-bold text-gray-900 mt-4">{testimonials[testimonialIndex].name}</h4>
                        <p className="text-gray-500 text-sm">{testimonials[testimonialIndex].role}</p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-10"
              >
                ←
              </button>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-10"
              >
                →
              </button>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`w-2 h-2 rounded-full transition ${testimonialIndex === idx ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== FAQ ========== */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 text-sm font-medium text-rose-600 bg-rose-100 rounded-full mb-4"
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
            >
              Pertanyaan <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600">Umum</span>
            </motion.h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left font-semibold text-gray-900 hover:bg-gray-100 transition"
                >
                  {faq.q}
                  {activeFaq === idx ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-gray-500 border-t border-gray-100"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BLOG ========== */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 text-sm font-medium text-cyan-600 bg-cyan-100 rounded-full mb-4">INSIGHT</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Artikel & Berita</h2>
            </div>
            <Link href="/news" className="text-blue-600 font-medium hover:underline flex items-center gap-1">Lihat Semua <FiArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {articles.slice(0,4).map((article, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <FiCalendar /> {article.date} <FiUser /> {article.readTime}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{article.title}</h3>
                  <p className="text-gray-500 text-sm">{article.desc}</p>
                  <Link href={article.link} className="inline-flex items-center gap-1 mt-3 text-blue-600 font-medium text-sm hover:gap-2 transition">
                    Baca <FiArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">{cta.title}</h2>
          <p className="mt-4 text-gray-600">{cta.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <input type="email" placeholder={cta.placeholder} className="px-6 py-3 rounded-full text-gray-900 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-sm" />
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition shadow-md hover:shadow-lg flex items-center gap-2">
              {cta.button_text} <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-40"
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
      `}</style>
    </div>
  )
}