// src/app/(public)/sectors/page.tsx
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  FiArrowRight, FiArrowUp, FiBriefcase, FiUsers, FiAward, FiStar,
  FiGlobe, FiTrendingUp, FiHome, FiDroplet, FiSun, FiBook, FiHeart, FiBarChart2,
  FiClock, FiMapPin, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight,
  FiPlay, FiPause, FiTruck, FiCpu, FiShield
} from 'react-icons/fi'

// ==================== TYPES ====================
interface SlideItem {
  image: string
  title: string
  highlight: string
  description: string
  badge: string
}

interface Partner {
  name: string
  logo: string
}

interface Sector {
  id: number
  title: string
  slug: string
  desc: string
  icon: React.ElementType
  features: string[]
  image: string
  projects: number
  years: number
}

interface Stat {
  icon: React.ElementType
  value: number
  label: string
  suffix: string
}

interface Advantage {
  title: string
  desc: string
  icon: React.ElementType
}

interface CaseStudy {
  title: string
  sector: string
  location: string
  year: number
  image: string
}

interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
  avatar: string
  sector: string
}

interface Faq {
  q: string
  a: string
}

// ==================== HERO SLIDESHOW ====================
const HeroSlideshow = ({ slides }: { slides: SlideItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [direction, setDirection] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  if (!slides || slides.length === 0) return null

  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = (index: number) => {
    if (index === currentIndex) return
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const togglePlay = () => setIsPlaying(!isPlaying)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => nextSlide(), 5000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, nextSlide])

  const bgVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.8 }
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8 }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.6 }
    })
  }

  const textVariants = {
    enter: { opacity: 0, y: 40 },
    center: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  const currentSlide = slides[currentIndex]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-20 mix-blend-overlay" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse delay-700" />

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${currentIndex}`}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/30"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium tracking-wide">{currentSlide.badge}</span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${currentIndex}`}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]"
          >
            {currentSlide.title}<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentSlide.highlight}
            </span>
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${currentIndex}`}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            {currentSlide.description}
          </motion.p>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
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

      <button onClick={prevSlide} aria-label="Previous slide" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition">
        <FiChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} aria-label="Next slide" className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition">
        <FiChevronRight size={24} />
      </button>

      

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, idx: number) => (
          <button key={idx} onClick={() => goToSlide(idx)} aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-10">
        <FiChevronDown className="animate-bounce" size={20} />
      </div>
    </div>
  )
}

// ==================== PARTNER MARQUEE PREMIUM ====================
const PartnerItem = ({ partner }: { partner: Partner }) => {
  const [imgError, setImgError] = useState<boolean>(false)

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

  const duplicatedPartners = [...partners, ...partners]

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
          {duplicatedPartners.map((partner, idx: number) => (
            <PartnerItem key={idx} partner={partner} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ==================== DATA ====================
const heroSlides: SlideItem[] = [
  { image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop", title: "Pemerintahan &", highlight: "Kebijakan Publik", description: "Perencanaan pembangunan strategis, kebijakan publik, dan tata kelola pemerintahan yang berdampak.", badge: "Sektor Unggulan 2024" },
  { image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop", title: "Infrastruktur &", highlight: "Pekerjaan Umum", description: "Mewujudkan infrastruktur tangguh: jalan, jembatan, bendungan, dan irigasi modern.", badge: "Proyek Strategis Nasional" },
  { image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1920&h=1080&fit=crop", title: "Perumahan &", highlight: "Kawasan Permukiman", description: "Pengembangan perumahan layak huni dan penataan kawasan kumuh berkelanjutan.", badge: "Program Kotaku" },
  { image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&h=1080&fit=crop", title: "Sumber Daya Air &", highlight: "Lingkungan", description: "Pengelolaan air minum, sanitasi, dan konservasi lingkungan untuk masa depan hijau.", badge: "Konservasi & Sanitasi" }
]

const sectors: Sector[] = [
  { id: 1, title: "Pemerintahan & Kebijakan Publik", slug: "pemerintahan", desc: "Perencanaan pembangunan, kebijakan publik, dan tata kelola pemerintahan.", icon: FiGlobe, features: ["Perencanaan Strategis", "Kebijakan Publik", "Tata Kelola", "Analisis Dampak Regulasi"], image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop", projects: 124, years: 15 },
  { id: 2, title: "Infrastruktur & Pekerjaan Umum", slug: "infrastruktur", desc: "Perencanaan jalan, jembatan, bendungan, dan irigasi.", icon: FiTrendingUp, features: ["Jalan & Jembatan", "Sumber Daya Air", "Irigasi", "Bendungan"], image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop", projects: 98, years: 12 },
  { id: 3, title: "Perumahan & Kawasan Permukiman", slug: "perumahan", desc: "Pengembangan perumahan layak huni dan penataan kawasan kumuh.", icon: FiHome, features: ["Perumahan", "Penataan Kawasan", "Infrastruktur Permukiman", "Kotaku"], image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=600&h=400&fit=crop", projects: 76, years: 10 },
  { id: 4, title: "Sumber Daya Air & Lingkungan", slug: "sumber-daya-air", desc: "Pengelolaan air minum, sanitasi, dan konservasi lingkungan.", icon: FiDroplet, features: ["Air Minum", "Sanitasi", "Konservasi", "Pengelolaan DAS"], image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop", projects: 112, years: 14 },
  { id: 5, title: "Pertanian & Ketahanan Pangan", slug: "pertanian", desc: "Pengembangan agribisnis dan ketahanan pangan.", icon: FiSun, features: ["Agribisnis", "Ketahanan Pangan", "Irigasi Pertanian", "Pembangunan Pedesaan"], image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop", projects: 87, years: 11 },
  { id: 6, title: "Pembangunan Pedesaan", slug: "pembangunan-pedesaan", desc: "Pemberdayaan masyarakat dan pengembangan BUMDes.", icon: FiHeart, features: ["Pemberdayaan", "BUMDes", "Infrastruktur Desa", "Pengembangan Wisata Desa"], image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop", projects: 65, years: 9 },
  { id: 7, title: "Pendidikan & Peningkatan Kapasitas", slug: "pendidikan", desc: "Pelatihan, workshop, dan pengembangan SDM.", icon: FiBook, features: ["Pelatihan", "Workshop", "Pengembangan SDM", "Sertifikasi"], image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop", projects: 203, years: 18 },
  { id: 8, title: "Kesehatan & Sanitasi", slug: "kesehatan", desc: "Program sanitasi dan kesehatan masyarakat.", icon: FiBarChart2, features: ["Sanitasi", "Kesehatan Masyarakat", "Program Kesehatan", "STBM"], image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=600&h=400&fit=crop", projects: 94, years: 12 }
]

const stats: Stat[] = [
  { icon: FiBriefcase, value: 487, label: "Proyek Selesai", suffix: "+" },
  { icon: FiUsers, value: 126, label: "Klien Aktif", suffix: "" },
  { icon: FiAward, value: 78, label: "Penghargaan", suffix: "" },
  { icon: FiStar, value: 99, label: "Kepuasan Klien", suffix: "%" },
  { icon: FiGlobe, value: 15, label: "Kota Tersebar", suffix: "+" },
  { icon: FiClock, value: 25, label: "Tahun Pengalaman", suffix: "" },
  { icon: FiTruck, value: 1200, label: "Tenaga Ahli", suffix: "+" },
  { icon: FiCpu, value: 45, label: "Teknologi Terapan", suffix: "" }
]

const advantages: Advantage[] = [
  { title: "Pendekatan Holistik", desc: "Melibatkan semua pemangku kepentingan untuk solusi berkelanjutan.", icon: FiGlobe },
  { title: "Data-Driven", desc: "Keputusan berdasarkan analisis data dan riset lapangan akurat.", icon: FiBarChart2 },
  { title: "Inovasi Teknologi", desc: "Memanfaatkan GIS, AI, dan Digital Twin untuk efisiensi.", icon: FiTrendingUp },
  { title: "Komitmen Kualitas", desc: "Sertifikasi ISO 9001:2015 dan standar internasional.", icon: FiAward },
  { title: "Jaminan Ketepatan Waktu", desc: "Project management dengan milestone terukur.", icon: FiClock },
  { title: "Dukungan Pasca Proyek", desc: "Monitoring dan evaluasi berkelanjutan.", icon: FiShield }
]

const caseStudies: CaseStudy[] = [
  { title: "Masterplan IKN Nusantara", sector: "Pemerintahan", location: "Kalimantan Timur", year: 2024, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop" },
  { title: "Jembatan Selat Sunda", sector: "Infrastruktur", location: "Banten-Lampung", year: 2025, image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f947?w=600&h=400&fit=crop" },
  { title: "Smart City Jakarta", sector: "Pemerintahan", location: "Jakarta", year: 2023, image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop" },
  { title: "Pengelolaan DAS Citarum", sector: "Lingkungan", location: "Jawa Barat", year: 2023, image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop" },
  { title: "Village Digital Program", sector: "Pedesaan", location: "50 Desa", year: 2024, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" },
  { title: "Peningkatan Kapasitas ASN", sector: "Pendidikan", location: "Nasional", year: 2024, image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop" }
]

const testimonials: Testimonial[] = [
  { name: "Dr. Ir. Budi Santoso", role: "Kepala BAPPEDA", text: "LPPSLH telah membantu kami menyusun masterplan yang visioner dan aplikatif.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/32.jpg", sector: "Pemerintahan" },
  { name: "Ir. Andi Wijaya", role: "Konsultan Senior", text: "Pemahaman mendalam tentang regulasi membuat LPPSLH menjadi mitra terpercaya.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/75.jpg", sector: "Infrastruktur" },
  { name: "Siti Nurhaliza, ST", role: "Project Director", text: "Kualitas pekerjaan dan ketepatan waktu sangat mengesankan.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/68.jpg", sector: "Perumahan" },
  { name: "Dr. Eng. Ahmad Zaki", role: "Akademisi UI", text: "Pendekatan ilmiah dan data-driven sangat membantu pengambilan kebijakan.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/45.jpg", sector: "Pendidikan" },
  { name: "Maya Sari, M.Sc", role: "Direktur CSR", text: "Mitra yang ideal untuk program pembangunan berkelanjutan.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/52.jpg", sector: "Lingkungan" }
]

const faqs: Faq[] = [
  { q: "Sektor apa saja yang menjadi fokus LPPSLH?", a: "Kami melayani 8 sektor utama: Pemerintahan, Infrastruktur, Perumahan, SDA & Lingkungan, Pertanian, Pedesaan, Pendidikan, dan Kesehatan." },
  { q: "Apakah LPPSLH memiliki pengalaman di sektor swasta?", a: "Ya, kami juga bekerja sama dengan BUMN, perusahaan swasta nasional dan multinasional, serta lembaga internasional seperti World Bank dan ADB." },
  { q: "Bagaimana LPPSLH memastikan kualitas di setiap sektor?", a: "Kami menerapkan sistem manajemen mutu ISO 9001:2015, didukung tim ahli bersertifikasi, dan evaluasi berkala oleh independent reviewer." },
  { q: "Apakah LPPSLH bisa membantu pengurusan perizinan sektor tertentu?", a: "Ya, kami memiliki layanan konsultasi hukum dan perizinan untuk berbagai sektor, termasuk AMDAL, UKL-UPL, dan izin lokasi." },
  { q: "Berapa lama durasi proyek biasanya?", a: "Bergantung pada kompleksitas, mulai dari 3 bulan untuk studi kecil hingga 2-3 tahun untuk proyek besar." },
  { q: "Apakah LPPSLH menyediakan pelatihan?", a: "Ya, kami memiliki pusat pelatihan bersertifikasi untuk peningkatan kapasitas SDM pemerintah dan swasta." }
]

// ==================== COUNTUP ====================
const CountUp = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    let start = 0
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])
  return <>{count}</>
}

// ==================== MAIN PAGE ====================
export default function SectorsPage() {
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0)
  const { scrollYProgress } = useScroll()
  const ctaY = useTransform(scrollYProgress, [0.7, 1], [0, -100])

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const nextTestimonial = () => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  const prevTestimonial = () => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <div className="bg-white overflow-x-hidden">
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee linear infinite;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
      `}</style>

      {/* HERO SLIDESHOW */}
      <HeroSlideshow slides={heroSlides} />

      {/* ========== MARQUEE PARTNER PREMIUM (LANGSUNG DI BAWAH HERO) ========== */}
      <PartnerMarquee />

      {/* KAMI DALAM ANGKA - TAMPILAN SERAGAM */}
<section className="py-20 px-4 max-w-7xl mx-auto">
  <div className="text-center mb-12">
    <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">
      KAMI DALAM ANGKA
    </span>
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Dampak Nyata di Seluruh Indonesia</h2>
    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {stats.map((stat, idx) => {
      const Icon = stat.icon
      const gradients = [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-emerald-500 to-teal-500',
        'from-amber-500 to-orange-500',
        'from-red-500 to-rose-500',
        'from-indigo-500 to-blue-500',
        'from-green-500 to-emerald-500',
        'from-cyan-500 to-teal-500',
      ]
      const gradient = gradients[idx % gradients.length]
      return (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          className="group relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg`}>
            <Icon size={28} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {typeof stat.value === 'number' ? <CountUp value={stat.value} /> : stat.value}
            {stat.suffix}
          </h3>
          <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
        </motion.div>
      )
    })}
  </div>
</section>

      {/* KEUNGGULAN */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=600&fit=crop" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 backdrop-blur-sm" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-white bg-white/20 rounded-full backdrop-blur-sm mb-4">MENGAPA KAMI?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Keunggulan Kompetitif LPPSLH</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((adv, idx: number) => {
              const Icon = adv.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition group"
                >
                  <Icon size={36} className="text-blue-300 mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-xl font-bold text-white">{adv.title}</h3>
                  <p className="text-gray-200 text-sm mt-2">{adv.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* GRID SEKTOR */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">
            SPESIALISASI
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-gray-900">
            Sektor yang <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Kami Bidangi</span>
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sectors.map((sector, idx: number) => {
            const Icon = sector.icon
            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={sector.image} alt={sector.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 -mt-8 relative z-10 shadow-lg group-hover:scale-110 transition">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{sector.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{sector.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sector.features.slice(0,3).map((f: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{f}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1"><FiBriefcase size={12} /> {sector.projects} proyek</span>
                    <span className="flex items-center gap-1"><FiClock size={12} /> {sector.years} tahun</span>
                  </div>
                  <Link href={`/sectors/${sector.slug}`} className="inline-flex items-center gap-1 mt-4 text-blue-600 font-medium text-sm hover:gap-2 transition">
                    Selengkapnya <FiChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* STUDI KASUS */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-full mb-4">PROYEK UNGGULAN</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Kisah Sukses Kami</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={study.image} alt={study.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900">{study.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{study.sector}</p>
                <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                  <FiMapPin size={12} /> {study.location} • {study.year}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL SLIDER */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-4">TESTIMONIAL</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Apa Kata Mereka</h2>
          <div className="relative mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-xl"
              >
                <div className="flex flex-col items-center">
                  <img src={testimonials[testimonialIndex].avatar} alt="" className="w-20 h-20 rounded-full border-4 border-indigo-200" />
                  <p className="text-gray-600 italic text-lg mt-4">"{testimonials[testimonialIndex].text}"</p>
                  <div className="flex text-yellow-400 mt-3">
                    {[...Array(testimonials[testimonialIndex].rating)].map((_, i: number) => <FiStar key={i} fill="currentColor" />)}
                  </div>
                  <h4 className="font-bold text-gray-900 mt-3">{testimonials[testimonialIndex].name}</h4>
                  <p className="text-gray-400 text-sm">{testimonials[testimonialIndex].role} • {testimonials[testimonialIndex].sector}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={prevTestimonial} className="p-2 rounded-full bg-white shadow hover:bg-gray-100">
                <FiChevronLeft size={20} />
              </button>
              <button onClick={nextTestimonial} className="p-2 rounded-full bg-white shadow hover:bg-gray-100">
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

    
      {/* CTA */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=600&fit=crop" alt="CTA" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
        </div>
        <motion.div style={{ y: ctaY }} className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Siap Memulai Proyek Anda?</h2>
          <p className="mt-4 text-xl text-gray-200">Dapatkan konsultasi gratis dari tim ahli kami hari ini.</p>
          <div className="mt-8">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition text-lg">
              Hubungi Kami Sekarang <FiArrowRight />
            </Link>
          </div>
        </motion.div>
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
    </div>
  )
}