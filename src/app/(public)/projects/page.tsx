// src/app/(public)/projects/page.tsx
'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { 
  FiArrowRight, FiArrowUp, FiBriefcase, FiUsers, FiAward,
  FiChevronRight, FiGlobe, FiMapPin, FiCalendar, FiCheckCircle, FiTrendingUp, FiFilter, FiGrid, FiList,
  FiSearch, FiX, FiChevronLeft, FiChevronRight as FiChevronRightIcon, FiZoomIn, FiChevronUp, FiChevronDown,
  FiPieChart, FiBarChart2, FiUser, FiBookOpen, FiStar, FiImage
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { createClient } from '@/lib/supabase/client'

// ==================== TYPES ====================
interface SlideItem { image: string; badge: string; title: string; highlight: string; description: string }
interface MarqueeItem { name: string; logo: string }
interface StatItem { icon: string; value: number; label: string; gradient: string }
// REMOVED: FeaturedProject
interface GalleryItem { id: number; title: string; description: string; slug: string; category: string; location: string; year: number; images: string[] }
interface CaseStudy { title: string; client: string; year: string; challenge: string; solution: string; result: string; image: string }
interface Achievement { year: number; title: string; desc: string }
interface Award { name: string; organizer: string; year: number; icon: string }
interface Testimonial { name: string; role: string; text: string; project: string; avatar: string }
interface Faq { q: string; a: string }
interface CtaContent { title: string; description: string; button_text: string; button_link: string; background_image: string; background_color: string; text_color: string }
interface Project { id: number; title: string; slug: string; category: string; province: string; city: string; year: number; image: string; description: string; progress: number; status: 'completed' | 'ongoing'; client: string; value: string; service: string; lat: number; lng: number }

// Helper
const getYearlyData = (projects: Project[]) => {
  const yearMap = new Map<number, number>()
  projects.forEach(p => yearMap.set(p.year, (yearMap.get(p.year) || 0) + 1))
  return Array.from(yearMap.entries()).map(([year, count]) => ({ year, count })).sort((a,b) => a.year - b.year)
}
const getPieData = (projects: Project[]) => {
  const categoryMap = new Map<string, number>()
  projects.forEach(p => categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1))
  const colorMap: Record<string, string> = {
    infrastructure: "#3b82f6", urban: "#8b5cf6", engineering: "#10b981", energy: "#f59e0b", conservation: "#ef4444",
    tourism: "#ec489a", environment: "#14b8a6", technology: "#6366f1", water: "#06b6d4"
  }
  return Array.from(categoryMap.entries()).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, color: colorMap[name] || "#94a3b8" }))
}

// ==================== KOMPONEN ====================
const GOOGLE_MAPS_API_KEY = "AIzaSyDl1rC7h_f3Mw5IhMaKrEZ95oEYPnlJ69g"

function GoogleMapComponent({ points }: { points: { id: number; title: string; slug: string; city: string; province: string; value: string; status: string; lat: number; lng: number }[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initGoogleMap`
      script.async = true; script.defer = true;
      (window as any).initGoogleMap = () => setMapLoaded(true)
      document.head.appendChild(script)
    } else if (typeof window !== 'undefined' && (window as any).google) setMapLoaded(true)
  }, [])
  useEffect(() => {
    if (mapLoaded && mapRef.current && points.length > 0) {
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: { lat: -2.548926, lng: 118.0148634 }, zoom: 5, mapTypeId: 'roadmap', mapTypeControl: true, fullscreenControl: true, streetViewControl: true, zoomControl: true,
      })
      const bounds = new (window as any).google.maps.LatLngBounds()
      points.forEach(point => {
        const position = { lat: point.lat, lng: point.lng }
        const marker = new (window as any).google.maps.Marker({ position, map, title: point.title, animation: (window as any).google.maps.Animation.DROP })
        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `<div style="padding:8px; max-width:220px; text-align:center;"><h3 style="font-weight:bold; color:#2563eb; margin-bottom:4px;">${point.title}</h3><p style="font-size:12px; color:#6b7280; margin:4px 0;">${point.city}, ${point.province}</p><p style="font-size:11px; color:#9ca3af;">Nilai: Rp ${point.value}</p><a href="/projects/${point.slug}" style="display:inline-block; margin-top:6px; font-size:12px; color:#2563eb; text-decoration:underline;">Detail Proyek →</a></div>`,
        })
        marker.addListener('click', () => infoWindow.open(map, marker))
        bounds.extend(position)
      })
      if (points.length > 1) map.fitBounds(bounds)
    }
  }, [mapLoaded, points])
  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '1rem' }} />
}

function GalleryLightbox({ item, onClose }: { item: GalleryItem | null; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  if (!item || !item.images || item.images.length === 0) return null
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % item.images.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-6xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 bg-white/80 rounded-full p-2 transition"><FiX size={24} /></button>
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-2/3 relative bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
            <img src={item.images[currentImageIndex]} alt={item.title} className="max-w-full max-h-[70vh] object-contain" />
            {item.images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"><FiChevronLeft size={28} /></button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"><FiChevronRightIcon size={28} /></button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {item.images.map((_, idx) => (<button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`} />))}
                </div>
              </>
            )}
          </div>
          <div className="md:w-1/3 p-6 bg-white overflow-y-auto">
            <div className="mb-4"><span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{item.category}</span></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3"><span><FiMapPin className="inline mr-1" /> {item.location}</span><span><FiCalendar className="inline mr-1" /> {item.year}</span></div>
            <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
            <Link href={`/projects/${item.slug}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition">Detail Proyek <FiChevronRight /></Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PartnerMarquee({ items }: { items: MarqueeItem[] }) {
  if (items.length === 0) return null
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
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 35, repeat: Infinity, ease: "linear", repeatType: "loop" }} className="flex gap-8 items-center w-max px-4 will-change-transform">
          {duplicated.map((partner, idx) => (
            <div key={idx} className="group relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-105 cursor-default">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
              <img src={partner.logo} alt={partner.name} className="h-6 w-auto object-contain relative z-10" />
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition hidden sm:inline relative z-10">{partner.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function HeroSlideshow({ slides }: { slides: SlideItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const nextSlide = () => { setDirection(1); setCurrentIndex((prev) => (prev + 1) % slides.length) }
  const prevSlide = () => { setDirection(-1); setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length) }
  const goToSlide = (index: number) => { setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index) }
  useEffect(() => { intervalRef.current = setInterval(() => nextSlide(), 4000); return () => { if (intervalRef.current) clearInterval(intervalRef.current) } }, [])
  const pauseAutoSlide = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  const resumeAutoSlide = () => { if (intervalRef.current) clearInterval(intervalRef.current); intervalRef.current = setInterval(() => nextSlide(), 4000) }
  const bgVariants = { enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0, scale: 0.95, transition: { duration: 0.7 } }), center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.7 } }, exit: (direction: number) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0, scale: 0.95, transition: { duration: 0.5 } }) }
  const textVariants = { enter: { opacity: 0, y: 30 }, center: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }, exit: { opacity: 0, y: -20, transition: { duration: 0.3 } } }
  const currentSlide = slides[currentIndex]
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" onMouseEnter={pauseAutoSlide} onMouseLeave={resumeAutoSlide}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div key={currentIndex} custom={direction} variants={bgVariants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
          <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-30" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000" />
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 text-white">
        <AnimatePresence mode="wait">
          <motion.div key={`badge-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-sm font-medium text-white">{currentSlide.badge}</span>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.h1 key={`title-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
            {currentSlide.title}<br /><span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{currentSlide.highlight}</span>
          </motion.h1>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p key={`desc-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">{currentSlide.description}</motion.p>
        </AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/contact" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"><span className="relative z-10">Konsultasi Sekarang</span><FiArrowRight className="relative z-10 group-hover:translate-x-1 transition" /><div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300" /></Link>
          <Link href="/projects" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 hover:-translate-y-1 transition">Lihat Portofolio</Link>
        </motion.div>
      </div>
      <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition"><FiChevronLeft size={24} /></button>
      <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition"><FiChevronRightIcon size={24} /></button>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, idx) => (<button key={idx} onClick={() => goToSlide(idx)} className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />))}
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-10"><FiChevronDown className="animate-bounce" size={20} /></div>
    </div>
  )
}

const iconMap: Record<string, IconType> = { FiBriefcase, FiGlobe, FiUsers, FiAward }
const StatIcon = ({ iconName, size }: { iconName: string; size: number }) => { const Icon = iconMap[iconName] || FiBriefcase; return <Icon size={size} /> }
const AwardIcon = ({ iconName, size, className }: { iconName: string; size: number; className?: string }) => { const icons: Record<string, IconType> = { FiAward, FiTrendingUp, FiCheckCircle }; const Icon = icons[iconName] || FiAward; return <Icon size={size} className={className} /> }

// ==================== HALAMAN UTAMA ====================
export default function ProjectsPage() {
  const supabase = createClient()
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>([])
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([])
  const [stats, setStats] = useState<StatItem[]>([])
  // REMOVED: featured
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [awards, setAwards] = useState<Award[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [cta, setCta] = useState<CtaContent>({ title: '', description: '', button_text: '', button_link: '', background_image: '', background_color: '#1e3a8a', text_color: '#ffffff' })
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [showGallery, setShowGallery] = useState(false)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [activeCaseStudy, setActiveCaseStudy] = useState<number | null>(null)

  useEffect(() => { const h = () => setShowBackToTop(window.scrollY > 500); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h) }, [])
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  useEffect(() => {
    const fetch = async () => {
      const { data: contentData } = await supabase.from('page_contents').select('section, value').eq('page', 'projects').eq('key', 'data')
      contentData?.forEach((item: any) => {
        try {
          const parsed = JSON.parse(item.value)
          if (item.section === 'hero_slides') setHeroSlides(parsed)
          if (item.section === 'partner_marquee') setMarqueeItems(parsed)
          if (item.section === 'stats') setStats(parsed)
          // REMOVED: featured
          if (item.section === 'gallery') setGallery(parsed)
          if (item.section === 'caseStudies') setCaseStudies(parsed)
          if (item.section === 'achievements') setAchievements(parsed)
          if (item.section === 'awards') setAwards(parsed)
          if (item.section === 'testimonials') setTestimonials(parsed)
          if (item.section === 'faqs') setFaqs(parsed)
          if (item.section === 'cta') setCta(prev => ({ ...prev, ...parsed }))
        } catch (e) { console.error(e) }
      })
      const { data: projectData } = await supabase.from('project_porto').select('*').order('id', { ascending: true })
      if (projectData) setProjects(projectData as Project[])
      setLoading(false)
    }
    fetch()
  }, [])

  const allProjects = projects
  const provinces = [...new Set(allProjects.map(p => p.province))].sort()
  const cities = [...new Set(allProjects.map(p => p.city))].sort()
  const years = [...new Set(allProjects.map(p => p.year))].sort((a,b)=>b-a)
  const servicesList = [...new Set(allProjects.map(p => p.service))].sort()

  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
      if (activeFilter !== 'all' && p.category !== activeFilter) return false
      if (selectedProvince && p.province !== selectedProvince) return false
      if (selectedCity && p.city !== selectedCity) return false
      if (selectedYear && p.year !== Number(selectedYear)) return false
      if (selectedService && p.service !== selectedService) return false
      if (searchTerm && !p.title.toLowerCase().includes(searchTerm.toLowerCase()) && !p.description.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
  }, [activeFilter, selectedProvince, selectedCity, selectedYear, selectedService, searchTerm, allProjects])

  const filteredProjectPoints = useMemo(() => filteredProjects.map(p => ({ id: p.id, title: p.title, slug: p.slug, city: p.city, province: p.province, value: p.value, status: p.status, lat: p.lat, lng: p.lng })), [filteredProjects])
  const yearlyChartData = useMemo(() => getYearlyData(filteredProjects), [filteredProjects])
  const pieChartData = useMemo(() => getPieData(filteredProjects), [filteredProjects])

  if (loading) return <div className="flex justify-center items-center min-h-screen">Memuat data...</div>

  return (
    <div className="bg-white overflow-x-hidden">
      {heroSlides.length > 0 && <HeroSlideshow slides={heroSlides} />}
      {marqueeItems.length > 0 && <PartnerMarquee items={marqueeItems} />}

      {stats.length > 0 && (
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx*0.1 }} className="group relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg`}><StatIcon iconName={stat.icon} size={28} /></div>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* REMOVED: Featured Projects Section */}

      {allProjects.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Visualisasi Kinerja</h2><p className="text-gray-500 mt-2">Tren proyek per tahun dan komposisi kategori (berdasarkan filter aktif)</p></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-6 shadow-xl"><h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiBarChart2 className="text-blue-500" /> Tren Proyek per Tahun</h3>
                {yearlyChartData.length > 0 ? <ResponsiveContainer width="100%" height={320}><BarChart data={yearlyChartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="year" /><YAxis /><Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', background: 'white' }} /><Bar dataKey="count" fill="#3b82f6" radius={[8,8,0,0]} barSize={50} /></BarChart></ResponsiveContainer> : <p className="text-gray-400 text-center py-8">Belum ada data proyek.</p>}
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-xl"><h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiPieChart className="text-purple-500" /> Komposisi Kategori</h3>
                {pieChartData.length > 0 ? <ResponsiveContainer width="100%" height={320}><PieChart><Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>{pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />)}</Pie><Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} /></PieChart></ResponsiveContainer> : <p className="text-gray-400 text-center py-8">Belum ada data proyek.</p>}
              </div>
            </div>
          </div>
        </section>
      )}

      {allProjects.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8"><div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full mb-4"><FiMapPin className="text-white" /><span className="text-sm font-semibold">GOOGLE MAPS</span></div><h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Peta Sebaran Proyek</h2><p className="text-gray-500 mt-2 max-w-2xl mx-auto">{filteredProjectPoints.length} titik proyek sesuai filter yang dipilih.</p></div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-100 h-[550px] relative">
              {filteredProjectPoints.length > 0 ? <GoogleMapComponent points={filteredProjectPoints} /> : <div className="flex items-center justify-center h-full text-gray-500">Tidak ada proyek dengan filter yang dipilih.</div>}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 px-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"><FiFilter className="text-white text-sm" /></div><span className="font-semibold text-gray-700">Filter Proyek</span></div><div className="flex gap-2"><button onClick={()=>setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode==='grid'?'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><FiGrid /></button><button onClick={()=>setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode==='list'?'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><FiList /></button></div></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Cari proyek..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all bg-white/80 backdrop-blur-sm" /></div>
            <select value={selectedProvince} onChange={e=>{setSelectedProvince(e.target.value); setSelectedCity('')}} className="px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 outline-none"><option value="">Semua Provinsi</option>{provinces.map(p=><option key={p}>{p}</option>)}</select>
            <select value={selectedCity} onChange={e=>setSelectedCity(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 outline-none" disabled={!selectedProvince}><option value="">Semua Kab/Kota</option>{cities.filter(c=>allProjects.find(p=>p.city===c && p.province===selectedProvince)).map(c=><option key={c}>{c}</option>)}</select>
            <select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 outline-none"><option value="">Semua Tahun</option>{years.map(y=><option key={y}>{y}</option>)}</select>
            <select value={selectedService} onChange={e=>setSelectedService(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 outline-none"><option value="">Semua Bidang Layanan</option>{servicesList.map(s=><option key={s}>{s}</option>)}</select>
          </div>
          {(selectedProvince||selectedCity||selectedYear||selectedService||searchTerm||activeFilter!=='all') && <button onClick={()=>{setSelectedProvince('');setSelectedCity('');setSelectedYear('');setSelectedService('');setSearchTerm('');setActiveFilter('all')}} className="mt-4 text-sm bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">Reset Filter</button>}
        </div>
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <p className="text-gray-500 mb-6 flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Menampilkan {filteredProjects.length} dari {allProjects.length} proyek</p>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden"><img src={project.image} alt={project.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" /><div className="absolute top-3 left-3"><span className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md ${project.status==='completed'?'bg-green-500/90 text-white':'bg-yellow-500/90 text-white'}`}>{project.status==='completed'?'✓ Selesai':'⟳ Berjalan'}</span></div></div>
                <div className="p-5"><h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{project.title}</h3><div className="flex items-center gap-3 text-gray-400 text-sm mb-2"><span className="flex items-center gap-1"><FiMapPin size={14} /> {project.city}</span><span className="flex items-center gap-1"><FiCalendar size={14} /> {project.year}</span></div><p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">{project.description}</p><div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3"><span className="bg-gray-100 px-2 py-1 rounded-full">Rp {project.value}</span><span className="bg-gray-100 px-2 py-1 rounded-full">{project.service}</span></div>{project.status === 'ongoing' && (<div className="mt-2"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span className="font-semibold">{project.progress}%</span></div><div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"><div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} /></div></div>)}<Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-1 mt-4 text-blue-600 font-medium text-sm hover:gap-2 transition-all">Detail Proyek <FiChevronRight size={14} /></Link></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map(project => (<div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap md:flex-nowrap gap-4 items-center hover:shadow-md transition-all"><img src={project.image} alt={project.title} className="w-24 h-24 rounded-lg object-cover" /><div className="flex-1"><h3 className="text-lg font-bold text-gray-900">{project.title}</h3><p className="text-sm text-gray-500 line-clamp-1">{project.description}</p><div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1"><span><FiMapPin className="inline mr-1" /> {project.city}</span><span><FiCalendar className="inline mr-1" /> {project.year}</span><span>{project.service}</span></div></div><Link href={`/projects/${project.slug}`} className="text-blue-600 hover:underline text-sm font-medium">Detail →</Link></div>))}
          </div>
        )}
        {filteredProjects.length === 0 && <div className="text-center py-12 text-gray-500">Tidak ada proyek dengan filter yang dipilih.</div>}
      </section>

      {gallery.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto"><div className="text-center mb-10"><div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full mb-3"><FiImage className="text-blue-500" /><span className="text-sm font-semibold">Dokumentasi Proyek</span></div><h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Galeri Teknik & Infrastruktur</h2></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{gallery.map((item, idx) => (<div key={item.id || idx} className="group relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300" onClick={() => { setActiveGalleryIndex(idx); setShowGallery(true); }}><img src={item.images?.[0]} alt={item.title} className="w-full h-56 object-cover transition duration-500 group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition"><h3 className="text-white font-bold text-sm">{item.title}</h3><p className="text-white/80 text-xs">{item.location}</p></div></div>))}</div></div>
        </section>
      )}
      <AnimatePresence>{showGallery && gallery[activeGalleryIndex] && <GalleryLightbox item={gallery[activeGalleryIndex]} onClose={() => setShowGallery(false)} />}</AnimatePresence>

      {caseStudies.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto"><div className="text-center mb-10"><div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full mb-3"><FiBookOpen /><span className="text-sm font-semibold">Studi Kasus</span></div><h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bagaimana Kami Memecahkan Tantangan</h2></div><div className="grid md:grid-cols-2 gap-8">{caseStudies.map((cs, idx) => (<div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg"><img src={cs.image} alt={cs.title} className="w-full h-52 object-cover" /><div className="p-6"><h3 className="text-xl font-bold text-gray-900">{cs.title}</h3><div className="flex gap-4 text-sm text-gray-500 mt-1 mb-3"><span>Klien: {cs.client}</span><span>Tahun: {cs.year}</span></div><button onClick={() => setActiveCaseStudy(activeCaseStudy === idx ? null : idx)} className="text-blue-600 font-medium flex items-center gap-1 text-sm">{activeCaseStudy === idx ? 'Tutup Detail' : 'Baca Studi Kasus'} {activeCaseStudy === idx ? <FiChevronUp /> : <FiChevronDown />}</button><AnimatePresence>{activeCaseStudy === idx && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-600"><p><strong>Tantangan:</strong> {cs.challenge}</p><p><strong>Solusi:</strong> {cs.solution}</p><p><strong>Hasil:</strong> {cs.result}</p></motion.div>)}</AnimatePresence></div></div>))}</div></div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white"><div className="max-w-5xl mx-auto"><h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perjalanan Kami</h2><div className="relative border-l-4 border-blue-500 ml-4">{achievements.map((item, idx) => (<div key={idx} className="mb-8 ml-6"><div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2.5 mt-1.5"></div><div className="bg-white p-5 rounded-xl shadow-sm"><span className="text-sm text-blue-600 font-bold">{item.year}</span><h3 className="text-xl font-bold mt-1">{item.title}</h3><p className="text-gray-500">{item.desc}</p></div></div>))}</div></div></section>
      )}

      {awards.length > 0 && (
        <section className="py-16 px-4 bg-white"><div className="max-w-7xl mx-auto text-center"><h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Penghargaan & Sertifikasi</h2><div className="flex flex-wrap justify-center gap-8">{awards.map((award, idx) => (<div key={idx} className="bg-gray-50 rounded-2xl p-6 shadow-md text-center w-64"><AwardIcon iconName={award.icon} size={40} className="text-yellow-500 mx-auto mb-3" /><h3 className="font-bold">{award.name}</h3><p className="text-gray-500 text-sm">{award.organizer} • {award.year}</p></div>))}</div></div></section>
      )}

      {testimonials.length > 0 && (
        <section className="py-16 px-4 bg-white"><div className="max-w-5xl mx-auto text-center"><h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Apa Kata Klien</h2><div className="grid md:grid-cols-2 gap-6">{testimonials.map((t, idx) => (<div key={idx} className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition"><div className="flex items-center gap-4 mb-4"><img src={t.avatar} className="w-12 h-12 rounded-full"/><div><h4 className="font-bold">{t.name}</h4><p className="text-gray-500 text-sm">{t.role}</p></div></div><p className="text-gray-600 italic text-sm">"{t.text}"</p><p className="text-xs text-blue-600 mt-2">Proyek: {t.project}</p></div>))}</div></div></section>
      )}

      {faqs.length > 0 && (
        <section className="py-16 px-4 max-w-4xl mx-auto"><h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pertanyaan Umum</h2><div className="space-y-4">{faqs.map((faq, idx) => (<div key={idx} className="bg-white rounded-xl shadow-sm border overflow-hidden"><button onClick={()=>setActiveFaq(activeFaq===idx?null:idx)} className="w-full flex justify-between items-center p-5 text-left font-semibold">{faq.q}{activeFaq===idx?<FiChevronUp/>:<FiChevronDown/>}</button><AnimatePresence>{activeFaq===idx && <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="px-5 pb-5 text-gray-500 border-t">{faq.a}</motion.div>}</AnimatePresence></div>))}</div></section>
      )}

      {cta.title && (
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-r from-blue-900/80 to-purple-900/80"><div className="absolute inset-0"><img src={cta.background_image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=600&fit=crop"} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80" /></div><div className="relative max-w-4xl mx-auto text-center text-white"><h2 className="text-3xl md:text-5xl font-bold">{cta.title}</h2><p className="mt-4 text-gray-200">{cta.description}</p><div className="mt-8"><Link href={cta.button_link} className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition">{cta.button_text} <FiArrowRight /></Link></div></div></section>
      )}

      <AnimatePresence>{showBackToTop && <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={scrollToTop} className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 z-40"><FiArrowUp size={24} /></motion.button>}</AnimatePresence>

      <style jsx>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
      `}</style>
    </div>
  )
}