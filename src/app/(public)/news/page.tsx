// src/app/(public)/news/page.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  FiArrowRight, FiCalendar, FiUser, FiSearch, 
  FiArrowUp, FiChevronLeft, FiChevronRight, 
  FiStar, FiTrendingUp, FiBookOpen, FiEye, FiChevronDown,
  FiX, FiExternalLink, FiShare2, FiFacebook, FiTwitter, FiLinkedin,
  FiClock
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { format } from 'date-fns'
import { id } from 'date-fns/locale/id'

// ========== TYPES ==========
interface NewsItem {
  id: number
  title: string
  slug: string
  category: string
  date: string
  author: string
  image: string
  excerpt: string
  content?: string
  link?: string
  views: number
  is_featured: boolean
  created_at?: string
}

interface SlideItem {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
}

interface StatItem {
  icon: string
  value: number | string
  label: string
  gradient: string
}

// ========== DEFAULT DATA (FALLBACK) ==========
const DEFAULT_SLIDES: SlideItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=1080&fit=crop',
    badge: 'BERITA & ARTIKEL',
    title: 'Wawasan Terbaru',
    highlight: 'Dari LPPSLH',
    description: 'Ikuti perkembangan terkini seputar kegiatan, proyek, dan pencapaian LPPSLH.'
  },
  {
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop',
    badge: 'INOVASI & TEKNOLOGI',
    title: 'Masa Depan Infrastruktur',
    highlight: 'Berkelanjutan',
    description: 'Artikel tentang teknologi terbaru dalam perencanaan wilayah dan konsultansi lingkungan.'
  },
  {
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
    badge: 'PENGHARGAAN',
    title: 'Pengakuan Global',
    highlight: 'Prestasi LPPSLH',
    description: 'Berbagai penghargaan yang telah diraih oleh LPPSLH dari lembaga nasional dan internasional.'
  }
]

const DEFAULT_STATS: StatItem[] = [
  { icon: 'FiBookOpen', value: 120, label: 'Total Artikel', gradient: 'from-blue-500 to-cyan-500' },
  { icon: 'FiEye', value: '45k+', label: 'Total Pembaca', gradient: 'from-purple-500 to-pink-500' },
  { icon: 'FiStar', value: 15, label: 'Kategori', gradient: 'from-emerald-500 to-teal-500' },
  { icon: 'FiTrendingUp', value: '98%', label: 'Kepuasan', gradient: 'from-amber-500 to-orange-500' }
]

const DEFAULT_CTA = {
  title: 'Tetap Terinformasi',
  description: 'Dapatkan update berita terbaru langsung ke email Anda.',
  button_text: 'Berlangganan',
  button_link: '#'
}

const CATEGORIES = ['Semua', 'Penghargaan', 'Acara', 'Kerjasama', 'Karir', 'Proyek', 'Pelatihan']

// ========== HELPER ==========
function StatIcon({ iconName, size }: { iconName: string; size: number }) {
  const icons: Record<string, IconType> = {
    FiBookOpen, FiTrendingUp, FiStar, FiEye
  }
  const Icon = icons[iconName] || FiBookOpen
  return <Icon size={size} />
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return format(date, 'dd MMMM yyyy', { locale: id })
  } catch {
    return dateStr
  }
}

function formatDateShort(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return format(date, 'dd MMM yyyy', { locale: id })
  } catch {
    return dateStr
  }
}

function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari lalu`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`
    return `${Math.floor(diffDays / 365)} tahun lalu`
  } catch {
    return ''
  }
}

// ========== HERO SLIDESHOW (tanpa efek scroll & floating) ==========
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

  const pauseAutoSlide = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  const resumeAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => nextSlide(), 5000)
  }

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

  const currentSlide = slides[currentIndex] || slides[0]

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={pauseAutoSlide} 
      onMouseLeave={resumeAutoSlide}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div key={currentIndex} custom={direction} variants={bgVariants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
          <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 text-white">
        <AnimatePresence mode="wait">
          <motion.div key={`badge-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit" 
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium tracking-wide">{currentSlide.badge}</span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1 key={`title-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit"
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]"
          >
            {currentSlide.title}<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentSlide.highlight}
            </span>
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p key={`desc-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit"
            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            {currentSlide.description}
          </motion.p>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <a href="#news-section" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="relative z-10">Jelajahi Berita</span>
            <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300" />
          </a>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 hover:-translate-y-1 transition">
            Hubungi Kami
          </Link>
        </motion.div>
      </div>

      <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/40 transition">
        <FiChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/40 transition">
        <FiChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => goToSlide(idx)} 
            className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-10">
        <FiChevronDown className="animate-bounce" size={20} />
      </div>
    </div>
  )
}

// ========== FEATURED CAROUSEL ==========
const FeaturedCarousel = ({ items }: { items: NewsItem[] }) => {
  const [active, setActive] = useState(0)
  const featured = items.filter(i => i.is_featured).slice(0, 4)
  if (featured.length === 0) return null

  useEffect(() => {
    const interval = setInterval(() => setActive(prev => (prev + 1) % featured.length), 5000)
    return () => clearInterval(interval)
  }, [featured.length])

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full mb-3">
            <FiStar className="text-yellow-500" /> Berita Unggulan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Yang Harus Anda Tahu
          </h2>
        </div>
        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="absolute inset-0">
              <img src={featured[active].image} alt={featured[active].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="bg-blue-600 text-sm px-3 py-1 rounded-full w-fit mb-3">{featured[active].category}</span>
                <h3 className="text-3xl md:text-4xl font-bold">{featured[active].title}</h3>
                <p className="text-gray-200 mt-2 max-w-2xl">{featured[active].excerpt}</p>
                <button 
                  onClick={() => {
                    document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' })
                    setTimeout(() => {
                      const el = document.querySelector(`[data-news-id="${featured[active].id}"]`)
                      if (el) (el as HTMLElement).click()
                    }, 500)
                  }}
                  className="inline-flex items-center gap-2 mt-4 text-white border-b border-white/50 pb-1 hover:gap-3 transition"
                >
                  Baca Selengkapnya <FiArrowRight />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {featured.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-amber-500 w-6' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ========== MAIN COMPONENT ==========
export default function NewsPage() {
  const supabase = createClient()
  
  // State data
  const [loading, setLoading] = useState(true)
  const [slides, setSlides] = useState<SlideItem[]>(DEFAULT_SLIDES)
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS)
  const [news, setNews] = useState<NewsItem[]>([])
  const [cta, setCta] = useState(DEFAULT_CTA)
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal detail
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Scroll to top
  const [showBackToTop, setShowBackToTop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: contentData } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'news')
        .eq('key', 'data')

      if (contentData) {
        contentData.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            if (item.section === 'slides') setSlides(parsed)
            else if (item.section === 'stats') setStats(parsed)
            else if (item.section === 'cta') setCta(prev => ({ ...prev, ...parsed }))
          } catch (e) { console.error('Parse error', e) }
        })
      }

      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false })

      setNews(newsData as NewsItem[] || [])

    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ========== SCROLL ==========
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // ========== FILTER & SEARCH ==========
  const filteredNews = news.filter(item => {
    if (selectedCategory !== 'Semua' && item.category !== selectedCategory) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // ========== OPEN DETAIL MODAL ==========
  const openDetail = (item: NewsItem, index: number) => {
    setSelectedNews(item)
    setCurrentIndex(index)
    setIsModalOpen(true)
    supabase
      .from('news')
      .update({ views: (item.views || 0) + 1 })
      .eq('id', item.id)
      .then(() => {
        setNews(prev => prev.map(n => 
          n.id === item.id ? { ...n, views: (n.views || 0) + 1 } : n
        ))
      })
  }

  // ========== RENDER ==========
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Memuat berita...</p>
        </div>
      </div>
    )
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  } as const

  // ========== RENDER MODAL ==========
  const renderModal = () => {
    if (!isModalOpen || !selectedNews) return null

    const otherNews = filteredNews.filter(n => n.id !== selectedNews.id)

    return (
      <AnimatePresence>
        {isModalOpen && selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-7xl w-full max-h-[94vh] overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ===== HEADER ===== */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 flex justify-between items-center p-4 border-b shadow-sm">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <FiX size={22} />
                  </button>
                  <div className="w-px h-6 bg-gray-200" />
                  <span className="text-sm text-gray-500 font-medium">
                    {currentIndex + 1} dari {filteredNews.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (currentIndex > 0) {
                        const newIndex = currentIndex - 1
                        setCurrentIndex(newIndex)
                        setSelectedNews(filteredNews[newIndex])
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-30"
                    disabled={currentIndex === 0}
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      if (currentIndex < filteredNews.length - 1) {
                        const newIndex = currentIndex + 1
                        setCurrentIndex(newIndex)
                        setSelectedNews(filteredNews[newIndex])
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-30"
                    disabled={currentIndex === filteredNews.length - 1}
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* ===== BODY ===== */}
              <div className="flex flex-col lg:flex-row h-[calc(94vh-70px)] overflow-hidden">
                {/* KONTEN UTAMA (KIRI) - 2/3 */}
                <div className="lg:w-2/3 overflow-y-auto p-6 lg:p-8">
                  {/* Gambar Full Width */}
                  <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-100 mb-6">
                    <img 
                      src={selectedNews.image} 
                      alt={selectedNews.title} 
                      className="w-full object-cover aspect-video" 
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                        {selectedNews.category}
                      </span>
                      {selectedNews.is_featured && (
                        <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <FiStar size={12} /> Unggulan
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <FiClock size={12} /> {formatTimeAgo(selectedNews.date)}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={14} /> {formatDate(selectedNews.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiUser size={14} /> {selectedNews.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiEye size={14} /> {selectedNews.views || 0} dilihat
                    </span>
                  </div>

                  {/* Judul */}
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {selectedNews.title}
                  </h2>

                  {/* Konten */}
                  <div className="prose prose-blue max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-headings:text-gray-900">
                    {selectedNews.content ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedNews.content.replace(/\n/g, '<br/>') }} />
                    ) : (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedNews.excerpt}</p>
                    )}
                  </div>

                  {/* Tombol aksi (hanya tombol Kunjungi jika ada link) */}
                  <div className="mt-8 flex flex-wrap justify-between items-center gap-3 pt-4 border-t">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
                    >
                      Tutup
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-medium">Bagikan:</span>
                      <button 
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: selectedNews.title,
                              text: selectedNews.excerpt,
                              url: window.location.href
                            })
                          }
                        }}
                        className="p-2 bg-gray-100 hover:bg-blue-50 rounded-full transition text-gray-600 hover:text-blue-600"
                      >
                        <FiShare2 size={16} />
                      </button>
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 hover:bg-blue-50 rounded-full transition text-gray-600 hover:text-blue-600"
                      >
                        <FiFacebook size={16} />
                      </a>
                      <a 
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(selectedNews.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 hover:bg-blue-50 rounded-full transition text-gray-600 hover:text-blue-600"
                      >
                        <FiTwitter size={16} />
                      </a>
                      <a 
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 hover:bg-blue-50 rounded-full transition text-gray-600 hover:text-blue-600"
                      >
                        <FiLinkedin size={16} />
                      </a>
                      {selectedNews.link && (
                        <a
                          href={selectedNews.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium text-sm"
                        >
                          Kunjungi <FiExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* ===== SIDEBAR DAFTAR BERITA (KANAN) - 1/3 ===== */}
                <div className="lg:w-1/3 bg-gray-50/80 border-l border-gray-200 flex flex-col">
                  <div className="p-4 border-b bg-white/50">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <FiBookOpen className="text-blue-600" size={18} />
                      Daftar Berita
                      <span className="ml-auto text-xs text-gray-400 font-normal">
                        {filteredNews.length} artikel
                      </span>
                    </h4>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 sidebar-scroll">
                    {otherNews.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const idx = filteredNews.findIndex(n => n.id === item.id)
                          if (idx !== -1) {
                            setCurrentIndex(idx)
                            setSelectedNews(item)
                            const sidebar = document.querySelector('.sidebar-scroll')
                            if (sidebar) sidebar.scrollTop = 0
                          }
                        }}
                        className={`w-full text-left group flex gap-3 p-3 rounded-xl transition-all duration-200 ${
                          item.id === selectedNews.id 
                            ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                            : 'hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold line-clamp-2 transition ${
                            item.id === selectedNews.id ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'
                          }`}>
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span className="flex items-center gap-0.5">
                              <FiCalendar size={10} /> {formatDateShort(item.date)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <FiEye size={10} /> {item.views || 0}
                            </span>
                          </div>
                          {item.is_featured && (
                            <span className="inline-block mt-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                              <FiStar size={8} className="inline" /> Unggulan
                            </span>
                          )}
                        </div>
                        {item.id === selectedNews.id && (
                          <div className="w-1.5 h-full bg-blue-500 rounded-full flex-shrink-0 self-stretch" />
                        )}
                      </button>
                    ))}
                    {otherNews.length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-8">
                        Tidak ada berita lain
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden">
      <HeroSlideshow slides={slides} />

      {/* STATS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
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
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED CAROUSEL */}
      <FeaturedCarousel items={news} />

      {/* FILTER & SEARCH */}
      <section id="news-section" className="sticky top-0 z-30 bg-white/90 backdrop-blur-md py-4 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full w-64 focus:ring-2 focus:ring-blue-400 outline-none bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GRID BERITA */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Tidak ada berita dengan filter yang dipilih.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, idx) => (
              <motion.article
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                variants={fadeUp}
                data-news-id={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                onClick={() => openDetail(item, idx)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">{item.category}</span>
                  </div>
                  {item.is_featured && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      <FiStar size={10} /> Unggulan
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><FiCalendar size={12} /> {formatDate(item.date)}</span>
                    <span className="flex items-center gap-1"><FiUser size={12} /> {item.author}</span>
                    <span className="flex items-center gap-1"><FiEye size={12} /> {item.views || 0} dilihat</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{item.excerpt}</p>
                  <button className="inline-flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium hover:gap-2 transition">
                    Baca Selengkapnya <FiArrowRight size={14} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{cta.title}</h2>
          <p className="mt-4 text-gray-600">{cta.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <input type="email" placeholder="Alamat email" className="px-6 py-3 rounded-full text-gray-900 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 shadow-sm" />
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition shadow-md hover:shadow-lg flex items-center gap-2">
              {cta.button_text} <FiArrowRight />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Kami tidak akan mengirim spam. Berhenti berlangganan kapan saja.</p>
        </div>
      </section>

      {/* BACK TO TOP */}
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

      {/* MODAL DETAIL */}
      {renderModal()}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .prose {
          color: #374151;
        }
        .prose p {
          margin-bottom: 1rem;
        }
        .prose strong {
          font-weight: 600;
        }
        .prose h2, .prose h3, .prose h4 {
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose ul, .prose ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.25rem;
        }
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}