'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowRight, FiUsers, FiMapPin, FiTrendingUp, FiBarChart2, FiCompass, 
  FiCpu, FiGlobe, FiLayers, FiAward, FiTwitter, FiLinkedin, FiInstagram, 
  FiFacebook, FiStar, FiChevronDown, FiChevronUp
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { createClient } from '@/lib/supabase/client'

// ========== Type Definitions ==========
interface HeroContent {
  title?: string
  subtitle?: string
  badge?: string
  button_text?: string
  button_link?: string
  secondary_button_text?: string
  secondary_button_link?: string
  background_video?: string
  background_image?: string
}

interface StatItem {
  label: string
  value: number
  suffix?: string
  icon?: string
  color?: string
}

interface AboutContent {
  title?: string
  description?: string
  description2?: string
  features?: Array<{ icon?: string; label: string; desc: string }>
}

interface BenefitItem {
  text: string
  icon?: string
}

interface TimelineItem {
  step: string
  desc: string
}

interface ProjectItem {
  title: string
  year: number
  client: string
  image: string
}

interface TeamMember {
  name: string
  role: string
  expertise?: string
  image: string
}

interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
  avatar: string
}

interface FaqItem {
  q: string
  a: string
}

interface ServiceDetailContent {
  hero: HeroContent
  stats: StatItem[]
  about: AboutContent
  benefits: BenefitItem[]
  timeline: TimelineItem[]
  projects: ProjectItem[]
  gallery: string[]
  team: TeamMember[]
  testimonials: Testimonial[]
  faqs: FaqItem[]
  clients: string[]
}

// Props
interface ServiceDetailClientProps {
  slug: string
}

// Icon mapping
const iconMap: Record<string, IconType> = {
  FiArrowRight, FiUsers, FiMapPin, FiTrendingUp, FiBarChart2, FiCompass,
  FiCpu, FiGlobe, FiLayers, FiAward, FiTwitter, FiLinkedin, FiInstagram, FiFacebook, FiStar, FiChevronDown, FiChevronUp
}

const getIcon = (iconName?: string): IconType => {
  if (!iconName) return FiStar
  return iconMap[iconName] || FiStar
}

// Custom hook for scroll position
function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState<number>(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return scrollY
}

// StatCounter component
interface StatCounterProps {
  value: number
  suffix: string
  icon: IconType
  color: string
  label: string
}

function StatCounter({ value, suffix, icon: Icon, color, label }: StatCounterProps) {
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    const duration = 2000
    const stepTime = 30
    const steps = duration / stepTime
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [value])
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100 group hover:shadow-2xl transition"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition`} />
      <div className="relative p-6 text-center">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition">
          <Icon size={28} />
        </div>
        <h3 className="text-4xl font-bold text-gray-900">{count}{suffix}</h3>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </motion.div>
  )
}

// FAQItem component
interface FAQItemProps {
  faq: FaqItem
  variants: any // menggunakan any untuk menghindari error tipe
}

function FAQItem({ faq, variants }: FAQItemProps) {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <motion.div variants={variants} className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left font-semibold text-gray-800 hover:bg-gray-50 transition">
        {faq.q}
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-5 pb-5 text-gray-500 border-t">
            {faq.a}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ========== MAIN COMPONENT ==========
export default function ServiceDetailClient({ slug }: ServiceDetailClientProps) {
  const [content, setContent] = useState<ServiceDetailContent | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTestimonial, setActiveTestimonial] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollY = useScrollPosition()
  
  // Parallax manual
  const heroY = Math.min(scrollY * 0.5, 200)
  const heroOpacity = Math.max(1 - scrollY / 700, 0)
  const scaleProgress = Math.max(1 - scrollY / 2000, 0.95)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('value')
        .eq('page', 'service_detail')
        .eq('section', slug)
        .eq('key', 'data')
        .maybeSingle()
      if (error) console.error(error)
      if (data?.value) {
        try {
          setContent(JSON.parse(data.value) as ServiceDetailContent)
        } catch(e) { console.error(e) }
      } else {
        // Jika tidak ada data, set content default agar tidak error
        setContent({
          hero: {
            badge: 'Layanan Premium',
            title: slug.replace(/-/g, ' ').toUpperCase(),
            subtitle: 'Deskripsi layanan ini belum diisi di admin panel.',
            button_text: 'Konsultasi Sekarang',
            button_link: '/contact',
            secondary_button_text: 'Lihat Portofolio',
            secondary_button_link: '/projects'
          },
          stats: [],
          about: { title: '', description: '', features: [] },
          benefits: [],
          timeline: [],
          projects: [],
          gallery: [],
          team: [],
          testimonials: [],
          faqs: [],
          clients: []
        })
      }
      setLoading(false)
    }
    fetchData()
  }, [slug, supabase])

  useEffect(() => {
    if (content?.testimonials?.length) {
      const interval = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % (content.testimonials?.length ?? 1))
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [content?.testimonials])

  if (loading) return <div className="text-center py-20">Memuat...</div>
  if (!content) return <div className="text-center py-20">Konten tidak ditemukan.</div>

  const { hero = {}, stats = [], about = {}, benefits = [], timeline = [], projects = [], gallery = [], team = [], testimonials = [], faqs = [], clients = [] } = content

  // ========== VARIANTS ANIMASI (DIPERBAIKI) ==========
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  } as const

  const fadeLeft = {
    hidden: { opacity: 0, x: -70 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  } as const

  const fadeRight = {
    hidden: { opacity: 0, x: 70 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  } as const

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const

  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {hero.background_video ? (
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={hero.background_video} type="video/mp4" />
            </video>
          ) : hero.background_image ? (
            <img src={hero.background_image} className="w-full h-full object-cover" alt="Hero background" />
          ) : (
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop" className="w-full h-full object-cover" alt="Hero background" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: scaleProgress }}
          className="relative z-10 text-center max-w-6xl mx-auto px-4 text-white"
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{hero.badge || 'Layanan Premium'}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
            {hero.title || 'Layanan Kami'}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            {hero.subtitle || 'Deskripsi layanan ini belum diisi.'}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href={hero.button_link || '/contact'} className="group inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition">
              {hero.button_text || 'Konsultasi Sekarang'} <FiArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link href={hero.secondary_button_link || '/projects'} className="inline-flex items-center gap-2 border border-white/30 backdrop-blur-sm px-8 py-3 rounded-full hover:bg-white/10 transition">
              {hero.secondary_button_text || 'Lihat Portofolio'}
            </Link>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = getIcon(stat.icon)
              const color = stat.color || ['from-blue-500 to-cyan-500','from-emerald-500 to-teal-500','from-amber-500 to-orange-500','from-purple-500 to-pink-500'][idx % 4]
              return (
                <StatCounter
                  key={idx}
                  value={stat.value}
                  suffix={stat.suffix || ''}
                  icon={Icon}
                  color={color}
                  label={stat.label}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* About */}
      {about.title && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{about.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mt-4 rounded-full" />
              <p className="mt-6 text-gray-600 leading-relaxed">{about.description}</p>
              {about.description2 && <p className="mt-4 text-gray-600 leading-relaxed">{about.description2}</p>}
            </motion.div>
            <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 gap-5">
              {(about.features || []).map((feat, i) => {
                const Icon = getIcon(feat.icon)
                return (
                  <div key={i} className="bg-gray-50/80 p-5 rounded-xl text-center hover:shadow-lg transition">
                    <Icon size={28} className="mx-auto text-blue-600 mb-3" />
                    <h3 className="font-semibold text-gray-800">{feat.label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{feat.desc}</p>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">MANFAAT</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Keunggulan Layanan</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {benefits.map((b, i) => {
                const Icon = getIcon(b.icon)
                return (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition group">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition">
                      <Icon className="text-green-600" size={20} />
                    </div>
                    <span className="text-gray-700 font-medium">{b.text}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-purple-600 bg-purple-100 rounded-full mb-4">PROSES KERJA</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Metodologi Pendekatan</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {timeline.map((t, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i*0.1 }} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-3">{i+1}</div>
                <h3 className="font-bold text-gray-800">{t.step}</h3>
                <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-amber-600 bg-amber-100 rounded-full mb-4">PROYEK UNGGULAN</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Portofolio Proyek</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {projects.map((p, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i*0.05 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group">
                  <img src={p.image} alt={p.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
                  <div className="p-5">
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="text-gray-500 text-sm">{p.year} • {p.client}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-cyan-600 bg-cyan-100 rounded-full mb-4">GALERI</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Dokumentasi Proyek</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full" />
            <div className="flex gap-4 overflow-x-auto pb-4 mt-12 snap-x snap-mandatory scrollbar-hide">
              {gallery.map((img, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  className="snap-center shrink-0 w-80 h-56 rounded-xl overflow-hidden shadow-lg">
                  <img src={img} alt="gallery" className="w-full h-full object-cover transition hover:scale-105 duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-4">TIM AHLI</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Para Profesional</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i*0.1 }} className="text-center">
                <img src={m.image} alt={m.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-100 shadow-md" />
                <h3 className="text-xl font-bold mt-4">{m.name}</h3>
                <p className="text-gray-500 text-sm">{m.role}</p>
                <p className="text-xs text-blue-600 mt-1">{m.expertise}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-rose-600 bg-rose-100 rounded-full mb-4">TESTIMONIAL</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Apa Kata Klien</h2>
            <div className="relative mt-12">
              <AnimatePresence mode="wait">
                <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-2xl p-8 shadow-lg">
                  <img src={testimonials[activeTestimonial].avatar} alt="avatar" className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <div className="flex justify-center text-yellow-400 mb-3">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_,i) => <FiStar key={i} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-600 italic">"{testimonials[activeTestimonial].text}"</p>
                  <h4 className="font-bold mt-4">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button key={idx} onClick={() => setActiveTestimonial(idx)} className={`w-2 h-2 rounded-full transition ${activeTestimonial===idx ? 'bg-blue-600 w-4' : 'bg-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-full mb-4">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pertanyaan Umum</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-4 rounded-full" />
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} variants={fadeUp} />
            ))}
          </motion.div>
        </section>
      )}

      {/* Clients */}
      {clients.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">Dipercaya Oleh</h2>
            <div className="flex flex-wrap justify-center gap-12 grayscale opacity-70">
              {clients.map((logo, i) => (
                <img key={i} src={logo} alt="client" className="h-12 w-auto" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=600&fit=crop" className="w-full h-full object-cover" alt="CTA background" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Siap Mewujudkan Masa Depan?</h2>
          <p className="mt-4 text-lg text-white/80">Tim ahli kami siap membantu mewujudkan rencana Anda.</p>
          <div className="mt-10">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 px-10 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition">
              Hubungi Kami Sekarang <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="hover:text-gray-600"><FiTwitter size={20} /></a>
            <a href="#" className="hover:text-gray-600"><FiLinkedin size={20} /></a>
            <a href="#" className="hover:text-gray-600"><FiInstagram size={20} /></a>
            <a href="#" className="hover:text-gray-600"><FiFacebook size={20} /></a>
          </div>
          <p>&copy; {new Date().getFullYear()} LPPSLH. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}