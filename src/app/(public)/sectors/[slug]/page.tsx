// src/app/(public)/sectors/[slug]/page.tsx
'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, FiCheckCircle, FiBriefcase, FiUsers, FiAward, FiTarget,
  FiArrowRight, FiChevronDown, FiChevronUp, FiStar, FiTwitter, FiLinkedin, 
  FiInstagram, FiFacebook, FiArrowUp, FiMapPin, FiCalendar, FiGlobe, FiPlay,
  FiPause, FiX, FiZoomIn, FiImage, FiDroplet, FiHome, FiSun, FiBook, FiHeart, 
  FiBarChart2, FiTruck, FiCpu, FiShield, FiTrendingUp, FiCompass, FiServer
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { createClient } from '@/lib/supabase/client'

// ==================== ICON MAP ====================
const iconMap: Record<string, IconType> = {
  FiGlobe,
  FiBriefcase,
  FiUsers,
  FiAward,
  FiStar,
  FiTarget,
  FiDroplet,
  FiHome,
  FiSun,
  FiBook,
  FiHeart,
  FiBarChart2,
  FiTruck,
  FiCpu,
  FiShield,
  FiTrendingUp,
  FiCompass,
  FiServer,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
}

const getIcon = (name: string): IconType => {
  return iconMap[name] || FiGlobe
}

// ==================== TYPE ====================
interface SectorDetail {
  id: number
  title: string
  slug: string
  description: string
  icon: string
  features: string[]
  image: string
  projects: number
  years: number
  heroImage: string
  shortDesc: string
  fullDesc: string
  objectives: string[]
  achievements: { value: string; label: string }[]
  services: string[]
  portfolioProjects: { title: string; client: string; year: number; image: string }[]
  gallery: string[]
  timeline: { year: string; title: string; desc: string }[]
  team: { name: string; role: string; expertise: string; image: string; bio?: string }[]
  testimonials: { name: string; role: string; text: string; avatar: string }[]
  faqs: { q: string; a: string }[]
}

// ========== DEFAULT DATA ==========
const DEFAULT_SECTOR: SectorDetail = {
  id: 0,
  title: '',
  slug: '',
  description: '',
  icon: 'FiGlobe',
  features: [],
  image: '',
  projects: 0,
  years: 0,
  heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop',
  shortDesc: '',
  fullDesc: '',
  objectives: [],
  achievements: [],
  services: [],
  portfolioProjects: [],
  gallery: [],
  timeline: [],
  team: [],
  testimonials: [],
  faqs: []
}

// ========== HOOK COUNTER ==========
const useCounter = (target: number, duration = 1500) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

// ========== HOOK SCROLL POSITION (MANUAL, TANPA useScroll) ==========
const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return scrollY
}

// ========== VARIANTS ==========
const fadeUp: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

// ========== MAIN COMPONENT ==========
export default function SectorDetailPage() {
  const { slug } = useParams()
  const [sector, setSector] = useState<SectorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // 🟢 SCROLL POSITION - custom hook tanpa useScroll
  const scrollY = useScrollPosition()

  // Efek parallax sederhana dengan transform manual
  const heroY = Math.min(scrollY * 0.5, 200)
  const heroOpacity = Math.max(1 - scrollY / 800, 0)
  const heroScale = Math.min(1 + scrollY / 2000, 1.05)

  // ========== FETCH DATA ==========
  useEffect(() => {
    const fetchData = async () => {
      const { data: sectorData, error } = await supabase
        .from('sectors')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !sectorData) {
        setLoading(false)
        return
      }

      const { data: contentData } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', `sector_${slug}`)
        .eq('key', 'data')

      const contentMap: Record<string, any> = {}
      contentData?.forEach((item: any) => {
        try { contentMap[item.section] = JSON.parse(item.value) }
        catch (e) { console.error(e) }
      })

      const sectorDetail: SectorDetail = {
        id: sectorData.id,
        title: sectorData.title,
        slug: sectorData.slug,
        description: sectorData.description || '',
        icon: sectorData.icon || 'FiGlobe',
        features: sectorData.features || [],
        image: sectorData.image || '',
        projects: sectorData.projects || 0,
        years: sectorData.years || 0,
        heroImage: sectorData.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop',
        shortDesc: sectorData.description || '',
        fullDesc: contentMap.fullDesc || sectorData.description || '',
        objectives: contentMap.objectives || [],
        achievements: contentMap.achievements || [],
        services: contentMap.services || [],
        portfolioProjects: contentMap.projects || [],
        gallery: contentMap.gallery || [],
        timeline: contentMap.timeline || [],
        team: contentMap.team || [],
        testimonials: contentMap.testimonials || [],
        faqs: contentMap.faqs || []
      }

      setSector(sectorDetail)
      setLoading(false)
    }

    if (slug) fetchData()
  }, [slug, supabase])

  // ========== INTERSECTION OBSERVER ==========
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id)
      })
    }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' })
    sections.forEach(section => observer.observe(section))
    return () => sections.forEach(section => observer.unobserve(section))
  }, [sector])

  // ========== BACK TO TOP ==========
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openModal = (member: any) => { setSelectedMember(member); setIsModalOpen(true) }
  const openLightbox = (img: string) => { setCurrentImage(img); setLightboxOpen(true) }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data sektor...</p>
        </div>
      </div>
    )
  }

  if (!sector) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <h1 className="text-4xl font-bold mb-4">Sektor tidak ditemukan</h1>
        <Link href="/sectors" className="text-blue-600 hover:underline">Kembali ke Sektor</Link>
      </div>
    )
  }

  const Icon = getIcon(sector.icon)

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'services', label: 'Layanan' },
    { id: 'projects', label: 'Proyek' },
    ...(sector.timeline && sector.timeline.length > 0 ? [{ id: 'timeline', label: 'Timeline' }] : []),
    ...(sector.team && sector.team.length > 0 ? [{ id: 'team', label: 'Tim' }] : []),
    ...(sector.testimonials && sector.testimonials.length > 0 ? [{ id: 'testimonials', label: 'Testimoni' }] : []),
    { id: 'faq', label: 'FAQ' }
  ]

  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden">
      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0">
          <img src={sector.heroImage} alt={sector.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <motion.div 
          style={{ 
            y: heroY, 
            opacity: heroOpacity,
            scale: heroScale
          }} 
          className="relative z-10 max-w-7xl mx-auto px-4 pb-20 text-white w-full"
        >
          <Link href="/sectors" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <FiArrowLeft className="group-hover:-translate-x-1 transition" size={18} /> Kembali ke Sektor
          </Link>
          <div className="max-w-3xl">
            <div className="text-8xl mb-4 drop-shadow-2xl"><Icon /></div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">{sector.title}</h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">{sector.shortDesc}</p>
            <div className="mt-8 flex gap-4">
              <button onClick={() => scrollToSection('overview')} className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition">Pelajari Lebih <FiArrowRight /></button>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/10 transition">Hubungi Kami</Link>
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center"><div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse" /></div>
        </div>
      </section>

      {/* Sticky TOC */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6 overflow-x-auto">
          {sections.map(section => (
            <button key={section.id} onClick={() => scrollToSection(section.id)} className={`text-sm font-medium transition ${activeSection === section.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      <section id="overview" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">Tentang Sektor</span>
            <h2 className="text-3xl font-bold text-gray-900">Mengenal Lebih Dekat</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 mb-6 rounded-full" />
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{sector.fullDesc}</p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tujuan & Manfaat</h3>
            <ul className="space-y-4">
              {sector.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border">
                  <FiTarget className="text-blue-600 mt-1 shrink-0" size={20} />
                  <span className="text-gray-700">{obj}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        {sector.achievements.length > 0 && (
          <div id="achievements" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {sector.achievements.map((item, idx) => {
              const numericVal = parseInt(item.value)
              const count = useCounter(isNaN(numericVal) ? 0 : numericVal)
              return (
                <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-xl border text-center group hover:shadow-2xl transition hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition">
                    <FiAward size={32} />
                  </div>
                  <h3 className="text-4xl font-black text-gray-900">{isNaN(numericVal) ? item.value : count}</h3>
                  <p className="text-gray-500 text-sm mt-2 uppercase tracking-wide">{item.label}</p>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">LAYANAN KAMI</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Layanan Unggulan di Sektor Ini</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sector.services.map((service, idx) => (
              <motion.div key={idx} variants={fadeUp} className="bg-white rounded-xl p-6 shadow-lg border text-center hover:shadow-xl transition hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition"><FiCheckCircle className="text-green-600" size={28} /></div>
                <p className="font-semibold text-gray-800">{service}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-purple-600 bg-purple-100 rounded-full mb-4">PORTOFOLIO</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Proyek Unggulan</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full" />
        </div>
        {sector.portfolioProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sector.portfolioProjects.map((proj, idx) => (
              <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group cursor-pointer" onClick={() => openLightbox(proj.image)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"><FiZoomIn className="text-white" size={24} /></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{proj.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">Klien: {proj.client}</p>
                  <p className="text-sm text-gray-400">Tahun: {proj.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">Belum ada proyek yang ditampilkan.</p>
        )}
        {sector.gallery && sector.gallery.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Galeri Kegiatan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sector.gallery.map((img, idx) => (
                <div key={idx} className="relative h-32 rounded-lg overflow-hidden cursor-pointer" onClick={() => openLightbox(img)}>
                  <img src={img} className="w-full h-full object-cover hover:scale-105 transition" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* TIMELINE */}
      {sector.timeline && sector.timeline.length > 0 && (
        <section id="timeline" className="py-20 px-4 bg-gray-50 scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 text-sm font-medium text-amber-600 bg-amber-100 rounded-full mb-4">PERJALANAN</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Timeline Pencapaian</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full" />
            </div>
            <div className="relative border-l-4 border-amber-500 ml-4">
              {sector.timeline.map((item, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="mb-10 ml-6">
                  <div className="absolute w-4 h-4 bg-amber-500 rounded-full -left-2.5 mt-1.5"></div>
                  <div className="bg-white p-6 rounded-xl shadow-md border">
                    <span className="text-sm text-amber-600 font-bold">{item.year}</span>
                    <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TEAM */}
      {sector.team && sector.team.length > 0 && (
        <section id="team" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-24">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-full mb-4">TIM AHLI</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Para Profesional</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sector.team.map((member, idx) => (
              <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                onClick={() => openModal(member)} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer group">
                <div className="flex flex-col sm:flex-row">
                  <img src={member.image} alt={member.name} className="w-full sm:w-40 h-40 object-cover" />
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{member.name}</h3>
                    <p className="text-blue-600 text-sm font-medium mt-1">{member.role}</p>
                    <p className="text-gray-500 text-sm mt-2">{member.expertise}</p>
                    <div className="mt-3 text-sm text-gray-400">Klik untuk detail</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {sector.testimonials && sector.testimonials.length > 0 && (
        <section id="testimonials" className="py-20 px-4 bg-gray-50 scroll-mt-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-4">TESTIMONIAL</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Apa Kata Mereka</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mt-4 rounded-full" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {sector.testimonials.map((t, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-4"><img src={t.avatar} className="w-12 h-12 rounded-full" /><div><h4 className="font-bold">{t.name}</h4><p className="text-gray-500 text-sm">{t.role}</p></div></div>
                  <p className="text-gray-600 italic">"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 max-w-4xl mx-auto scroll-mt-24">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-cyan-600 bg-cyan-100 rounded-full mb-4">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pertanyaan Umum</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="space-y-5">
          {sector.faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition">
              <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full flex justify-between items-center p-6 text-left font-semibold text-gray-800 hover:bg-gray-50 transition">
                {faq.q} {activeFaq === idx ? <FiChevronUp className="text-blue-600" /> : <FiChevronDown className="text-gray-400" />}
              </button>
              <AnimatePresence>{activeFaq === idx && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 text-gray-500 border-t">{faq.a}</motion.div>}</AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=600&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" /></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Butuh Konsultasi di Sektor Ini?</h2>
          <p className="mt-4 text-lg text-white/80">Hubungi tim ahli kami untuk solusi terbaik.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition hover:-translate-y-0.5">
              Hubungi Kami <FiArrowRight />
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 border border-white/30 backdrop-blur-sm px-8 py-3 rounded-full hover:bg-white/10 transition">
              Lihat Portofolio
            </Link>
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

      {/* MODAL PERSONIL */}
      <AnimatePresence>
        {isModalOpen && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold">Detail Personil</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full"><FiX size={20} /></button>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <img src={selectedMember.image} alt={selectedMember.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedMember.name}</h4>
                    <p className="text-blue-600 text-sm">{selectedMember.role}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Keahlian:</span> {selectedMember.expertise}</p>
                  <p className="text-gray-600">{selectedMember.bio || "Berpengalaman dalam berbagai proyek nasional."}</p>
                </div>
                <div className="mt-5 flex justify-end">
                  <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Tutup</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img src={currentImage} className="w-full rounded-lg shadow-2xl" />
              <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 bg-white/20 rounded-full p-2 hover:bg-white/40"><FiX size={24} className="text-white" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}