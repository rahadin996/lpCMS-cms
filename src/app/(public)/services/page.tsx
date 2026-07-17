// src/app/(public)/services/page.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowRight, FiArrowUp, FiCompass, FiDroplet, FiBarChart2, FiMapPin, 
  FiTrendingUp, FiUsers, FiCpu, FiServer, FiAward, FiBriefcase, 
  FiStar, FiChevronRight, FiChevronDown, FiUser, FiChevronLeft, 
  FiChevronRight as FiChevronRightIcon, FiGlobe, FiLayers, FiCheckCircle,
  FiInfo
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { createClient } from '@/lib/supabase/client'

// ========== TYPE DEFINITIONS ==========
interface HeroSlide {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
  order: number
}
interface MarqueeItem { name: string; icon: string; order: number }
interface StatItem { label: string; value: string | number; suffix?: string; icon?: string }
interface AdvantageItem { title: string; desc: string; icon?: string }
interface ServiceItem {
  id: number
  title: string
  slug: string
  description: string
  icon: string
  image_url: string
  features: string[]
}
interface TestimonialItem { name: string; role: string; text: string; rating: number; avatar: string }
interface PersonilItem {
  id: number
  nama: string
  posisi: string
  image: string
  lulusan?: string
  tahunLulus?: number
  deskripsi?: string
  keahlian?: string[]
}
interface FaqItem { q: string; a: string }
interface AwardItem { title: string; year: number; issuer: string; icon?: string }
interface CTAContent { title?: string; description?: string; button_text?: string; button_link?: string; background_image?: string; background_color?: string; text_color?: string }

// Icon mapping
const iconMap: Record<string, IconType> = {
  FiCompass, FiDroplet, FiBarChart2, FiMapPin, FiTrendingUp, FiUsers, FiCpu, FiServer,
  FiBriefcase, FiAward, FiStar, FiGlobe, FiLayers, FiCheckCircle
}
const getIcon = (name?: string): IconType => (name && iconMap[name]) || FiCompass

const statGradients = [
  'from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500',
  'from-red-500 to-rose-500', 'from-indigo-500 to-blue-500'
]

// ========== HERO SLIDESHOW ==========
const HeroSlideshow = ({ slides }: { slides: HeroSlide[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (slides.length === 0) return
    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrentIndex(prev => (prev + 1) % slides.length)
    }, 6000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [slides.length])

  const pauseAuto = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  const resumeAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrentIndex(prev => (prev + 1) % slides.length)
    }, 6000)
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      rotateY: dir > 0 ? -15 : 15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.8, type: "tween" as const }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      rotateY: dir > 0 ? 15 : -15,
      transition: { duration: 0.6, type: "tween" as const }
    })
  }

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4 } }
  }

  if (!slides.length) return null
  const slide = slides[currentIndex]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" onMouseEnter={pauseAuto} onMouseLeave={resumeAuto}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${currentIndex}`}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/30"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium tracking-wide">{slide.badge}</span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${currentIndex}`}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]"
          >
            {slide.title}<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {slide.highlight}
            </span>
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${currentIndex}`}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            {slide.description}
          </motion.p>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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

      <button onClick={() => { setDirection(-1); setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length) }} 
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition">
        <FiChevronLeft size={24} />
      </button>
      <button onClick={() => { setDirection(1); setCurrentIndex(prev => (prev + 1) % slides.length) }} 
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition">
        <FiChevronRightIcon size={24} />
      </button>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx) }} 
            className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>
    </div>
  )
}

// ========== SERVICE MARQUEE ==========
const ServiceMarquee = ({ items }: { items: MarqueeItem[] }) => {
  if (!items.length) return null
  const duplicated = [...items, ...items]
  return (
    <div className="relative w-full overflow-hidden py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      <div className="relative z-10">
        <div className="text-center mb-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 text-sm font-medium text-blue-700 bg-blue-200 rounded-full"
          >
            LAYANAN UNGGULAN
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 mt-2"
          >
            Keahlian Kami dalam Satu Gerakan
          </motion.h2>
        </div>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className="flex gap-8 items-center w-max px-4 will-change-transform"
        >
          {duplicated.map((item, idx) => {
            const Icon = getIcon(item.icon)
            return (
              <div key={idx} className="group relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/70 shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-default">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Icon size={16} />
                </div>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition">
                  {item.name}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

// ========== FAQ COMPONENT ==========
const FAQItem = ({ faq, idx }: { faq: FaqItem; idx: number }) => {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-6 text-left font-semibold text-gray-800 hover:bg-gray-50 transition"
      >
        {faq.q}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <FiChevronDown />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 text-gray-500 border-t"
          >
            {faq.a}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ========== PERSONIL CARD WITH HOVER POPUP ==========
const PersonilCard = ({ person }: { person: PersonilItem }) => {
  const [hover, setHover] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [popupPosition, setPopupPosition] = useState<'top' | 'bottom'>('bottom')

  useEffect(() => {
    if (hover && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setPopupPosition(spaceBelow < 250 ? 'top' : 'bottom')
    }
  }, [hover])

  // Ambil teks singkat untuk ditampilkan di card (deskripsi atau keahlian)
  const shortBio = person.deskripsi || (person.keahlian?.length ? person.keahlian.slice(0, 2).join(', ') : '')

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer border border-gray-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-indigo-100 shrink-0">
            {person.image ? (
              <img src={person.image} alt={person.nama} className="w-full h-full object-cover" />
            ) : (
              <FiUser size={24} className="w-full h-full p-3 text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{person.nama}</h4>
            <p className="text-xs text-indigo-600 font-medium">{person.posisi}</p>
          </div>
        </div>
        {/* Tampilkan deskripsi atau keahlian singkat */}
        {shortBio && (
          <p className="text-gray-500 text-sm line-clamp-2">{shortBio}</p>
        )}
      </div>

      {/* Hover Popup (tidak berubah) */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-5 left-1/2 -translate-x-1/2 ${
              popupPosition === 'bottom' ? 'top-full mt-3' : 'bottom-full mb-3'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-indigo-100 shrink-0">
                {person.image ? (
                  <img src={person.image} alt={person.nama} className="w-full h-full object-cover" />
                ) : (
                  <FiUser size={24} className="w-full h-full p-3 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900">{person.nama}</h4>
                <p className="text-sm text-indigo-600 font-medium">{person.posisi}</p>
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-700 border-t pt-3">
              {person.lulusan && (
                <p><span className="font-medium">🎓 Pendidikan:</span> {person.lulusan}{person.tahunLulus ? ` (${person.tahunLulus})` : ''}</p>
              )}
              {person.deskripsi && (
                <p><span className="font-medium">📝 Deskripsi:</span> {person.deskripsi}</p>
              )}
              {person.keahlian && person.keahlian.length > 0 && (
                <div>
                  <span className="font-medium">⚙️ Keahlian:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {person.keahlian.map((skill, i) => (
                      <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ========== MAIN PAGE ==========
export default function ServicesPage() {
  const [loading, setLoading] = useState(true)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([])
  const [stats, setStats] = useState<StatItem[]>([])
  const [advantages, setAdvantages] = useState<AdvantageItem[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [clients, setClients] = useState<string[]>([])
  const [personil, setPersonil] = useState<PersonilItem[]>([])
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [awards, setAwards] = useState<AwardItem[]>([])
  const [cta, setCta] = useState<CTAContent>({})
  const [showBackToTop, setShowBackToTop] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchAll = async () => {
      // Ambil data services dari tabel `services`
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true })
      setServices(servicesData || [])

      // Ambil konten lainnya dari page_contents (kecuali team)
      const { data, error } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'services')
        .eq('key', 'data')
      if (error) console.error(error)

      const sections: any = { hero_slides: [], marquee: [], stats: [], advantages: [], testimonials: [], clients: [], faqs: [], awards: [], cta: {} }
      data?.forEach(item => {
        try {
          const parsed = JSON.parse(item.value)
          if (item.section === 'hero_slides') sections.hero_slides = parsed
          else if (item.section === 'marquee') sections.marquee = parsed
          else if (item.section === 'stats') sections.stats = parsed
          else if (item.section === 'advantages') sections.advantages = parsed
          else if (item.section === 'testimonials') sections.testimonials = parsed
          else if (item.section === 'clients') sections.clients = parsed
          else if (item.section === 'faqs') sections.faqs = parsed
          else if (item.section === 'awards') sections.awards = parsed
          else if (item.section === 'cta') sections.cta = parsed
        } catch(e) { console.error(e) }
      })

      // Ambil personil untuk tim ahli dari tabel `personil`
      const { data: personilData } = await supabase
        .from('personil')
        .select('*')
        .order('id', { ascending: true })
      if (personilData) {
        const mapped = personilData.map((p: any) => ({
          id: p.id,
          nama: p.nama,
          posisi: p.posisi,
          image: p.image || '',
          lulusan: p.lulusan || '',
          tahunLulus: p.tahunLulus || null,
          deskripsi: p.deskripsi || '',
          keahlian: p.keahlian || [],
        }))
        setPersonil(mapped)
      }

      setHeroSlides(Array.isArray(sections.hero_slides) ? sections.hero_slides.sort((a:any,b:any)=>a.order-b.order) : [])
      setMarqueeItems(Array.isArray(sections.marquee) ? sections.marquee.sort((a:any,b:any)=>a.order-b.order) : [])
      setStats(sections.stats || [])
      setAdvantages(sections.advantages || [])
      setTestimonials(sections.testimonials || [])
      setClients(sections.clients || [])
      setFaqs(sections.faqs || [])
      setAwards(sections.awards || [])
      setCta(sections.cta || {})
      setLoading(false)
    }
    fetchAll()
  }, [])

  if (loading) return <div className="text-center py-20">Memuat data...</div>

  const fadeUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }

  return (
    <div className="bg-white overflow-x-hidden">
      <HeroSlideshow slides={heroSlides} />
      <ServiceMarquee items={marqueeItems} />

      {/* Statistik */}
      {stats.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, idx) => {
              const gradient = statGradients[idx % statGradients.length]
              const Icon = getIcon(stat.icon)
              return (
                <motion.div key={idx} variants={fadeUp} className="group relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}{stat.suffix || ''}</h3>
                  <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      )}

      {/* Keunggulan */}
      {advantages.length > 0 && (
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=600&fit=crop" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80" />
          </div>
          <div className="relative max-w-7xl mx-auto text-white">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 text-sm font-medium bg-white/20 rounded-full backdrop-blur-sm mb-4"
              >
                MENGAPA KAMI?
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight"
              >
                Keunggulan Kami
              </motion.h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((adv, idx) => {
                const Icon = getIcon(adv.icon)
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    <Icon size={32} className="text-blue-300 mb-4" />
                    <h3 className="text-xl font-bold">{adv.title}</h3>
                    <p className="text-gray-200 text-sm mt-2">{adv.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* GRID LAYANAN */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4"
          >
            LAYANAN UNGGULAN
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          >
            Keahlian <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Kami</span>
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
        </div>
        {services.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Belum ada layanan yang tersedia.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => {
              const Icon = getIcon(service.icon)
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={service.image_url || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'} alt={service.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition -mt-8 relative z-10 shadow-lg">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                    {service.features && service.features.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {service.features.slice(0,2).map((f,i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{f}</span>
                        ))}
                      </div>
                    )}
                    <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-1 mt-4 text-blue-600 font-medium text-sm hover:gap-2 transition">
                      Selengkapnya <FiArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      {/* Penghargaan */}
      {awards.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 text-sm font-medium text-amber-600 bg-amber-100 rounded-full mb-4"
            >
              PENGHARGAAN
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              Diakui & Dipercaya
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full mb-12" />
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
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                      <Icon size={32} className="text-amber-600" />
                    </div>
                    <h3 className="font-bold text-xl">{award.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{award.year} • {award.issuer}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tim Ahli – dengan Popup Hover */}
      {personil.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-4"
              >
                TIM AHLI
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-gray-900"
              >
                Para Profesional
              </motion.h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mt-4 rounded-full" />
              <p className="text-gray-500 text-sm mt-3">Arahkan kursor ke personil untuk melihat detail lengkap</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personil.map((p) => (
                <PersonilCard key={p.id} person={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 text-sm font-medium text-rose-600 bg-rose-100 rounded-full mb-4"
            >
              TESTIMONIAL
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              Apa Kata Klien
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-4 rounded-full mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-800">{test.name}</h4>
                      <p className="text-xs text-gray-500">{test.role}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(test.rating)].map((_, i) => <FiStar key={i} fill="currentColor" size={14} />)}
                  </div>
                  <p className="text-gray-600 italic text-sm">"{test.text}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden text-center" style={{ backgroundColor: cta.background_color || '#1e3a8a', color: cta.text_color || '#ffffff' }}>
        {cta.background_image && (
          <div className="absolute inset-0">
            <img src={cta.background_image} alt="CTA background" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            {cta.title || 'Siap Memulai Proyek Anda?'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg"
          >
            {cta.description || 'Konsultasikan kebutuhan Anda dengan tim ahli kami secara gratis.'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Link href={cta.button_link || '/contact'} className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:shadow-xl transition-all hover:-translate-y-1">
              {cta.button_text || 'Hubungi Kami'} <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-40"
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx global>{`
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