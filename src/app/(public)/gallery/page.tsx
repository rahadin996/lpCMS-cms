'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { 
  FiX, FiZoomIn, FiChevronLeft, FiChevronRight, 
  FiCalendar, FiMapPin, FiArrowUp,
  FiCamera, FiFolder, FiImage, FiAward, FiShare2, FiStar, FiArrowRight, FiChevronDown,
  FiGrid, FiList
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { createClient } from '@/lib/supabase/client'

// ========== Type Definitions ==========
interface GalleryImage {
  url: string
  title?: string
  caption?: string
}

interface GalleryItem {
  id: number
  title: string
  description: string | null
  category: string
  images: GalleryImage[] | string[]
  image_url: string | null
  date: string
  location: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

interface Stats {
  total: number
  categories: Record<string, number>
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

// ========== HELPER GET IMAGE URL ==========
const getImageUrl = (item: GalleryItem, index: number = 0): string => {
  // 1. Coba dari kolom images (array)
  if (item.images && Array.isArray(item.images) && item.images.length > index) {
    const img = item.images[index]
    if (typeof img === 'string') return img
    if (img && typeof img === 'object' && 'url' in img) return img.url
  }
  // 2. Fallback ke image_url (hanya untuk index 0)
  if (index === 0 && item.image_url) return item.image_url
  // 3. Default placeholder
  return 'https://via.placeholder.com/400x300?text=No+Image'
}

const getImageCount = (item: GalleryItem): number => {
  if (item.images && Array.isArray(item.images)) return item.images.length
  if (item.image_url) return 1
  return 0
}

// ========== HELPER STAT ICON ==========
function StatIcon({ iconName, size }: { iconName: string; size: number }) {
  const icons: Record<string, IconType> = {
    FiCamera: FiCamera,
    FiFolder: FiFolder,
    FiImage: FiImage,
    FiAward: FiAward,
  }
  const Icon = icons[iconName] || FiCamera
  return <Icon size={size} />
}

const statGradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
]

// ==================== PARTNER MARQUEE ====================
const PartnerItem = ({ partner }: { partner: Partner }) => {
  const [imgError, setImgError] = useState<boolean>(false)
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
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 35, repeat: Infinity, ease: "linear", repeatType: "loop" }} className="flex gap-8 items-center w-max px-4 will-change-transform">
          {duplicatedPartners.map((partner, idx) => <PartnerItem key={idx} partner={partner} />)}
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

  const pauseAutoSlide = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  const resumeAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => nextSlide(), 5000)
  }

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
          <Link href="/gallery" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 hover:-translate-y-1 transition">
            Lihat Galeri
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

// ========== FEATURED GALLERY CAROUSEL ==========
const FeaturedCarousel = ({ items }: { items: GalleryItem[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const featuredItems = items.slice(0, 5)

  useEffect(() => {
    const interval = setInterval(() => setActiveIndex((prev) => (prev + 1) % featuredItems.length), 4000)
    return () => clearInterval(interval)
  }, [featuredItems.length])

  if (featuredItems.length === 0) return null

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full mb-3">
            <FiStar className="text-yellow-500" />
            <span className="text-sm font-semibold">Galeri Unggulan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Momen Terbaik Kami</h2>
          <p className="text-gray-500 mt-2">Koleksi foto-foto pilihan dari berbagai kegiatan LPPSLH</p>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative h-[500px] md:h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                <img src={getImageUrl(featuredItems[activeIndex], 0)} alt={featuredItems[activeIndex].title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="bg-blue-600/80 text-xs px-3 py-1 rounded-full">{featuredItems[activeIndex].category}</span>
                  <h3 className="text-2xl md:text-3xl font-bold mt-3">{featuredItems[activeIndex].title}</h3>
                  <p className="text-gray-200 mt-2 max-w-2xl">{featuredItems[activeIndex].description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <span><FiCalendar className="inline mr-1" /> {new Date(featuredItems[activeIndex].date).toLocaleDateString('id-ID')}</span>
                    {featuredItems[activeIndex].location && <span><FiMapPin className="inline mr-1" /> {featuredItems[activeIndex].location}</span>}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {featuredItems.map((_, idx) => (
              <button key={idx} onClick={() => setActiveIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === activeIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== MAIN COMPONENT ==========
export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua")
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const [stats, setStats] = useState<Stats>({ total: 0, categories: {} })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const supabase = createClient()

  useEffect(() => { fetchGallery() }, [])
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchGallery = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetch gallery:', error)
        setLoading(false)
        return
      }

      const items = (data || []) as GalleryItem[]
      console.log('✅ Data gallery:', items.length, 'items')
      
      if (items.length > 0) {
        console.log('🖼️ Gambar pertama:', getImageUrl(items[0], 0))
        console.log('📸 Jumlah gambar:', getImageCount(items[0]))
      }

      setGalleryItems(items)
      const total = items.length
      const catCount: Record<string, number> = {}
      items.forEach(item => { catCount[item.category] = (catCount[item.category] || 0) + 1 })
      setStats({ total, categories: catCount })
    } catch (err) {
      console.error('❌ Error:', err)
    }
    setLoading(false)
  }

  const categories: string[] = ["Semua", "Acara", "Pelatihan", "Proyek", "Kerjasama", "Penghargaan"]
  const filteredGallery: GalleryItem[] = selectedCategory === "Semua" ? galleryItems : galleryItems.filter(item => item.category === selectedCategory)

  const openLightbox = (itemIndex: number, imageIndex: number = 0): void => {
    setCurrentIndex(itemIndex)
    setCurrentItem(filteredGallery[itemIndex])
    setCurrentImageIndex(imageIndex)
    setLightboxOpen(true)
  }

  const nextImage = (): void => {
    if (!currentItem) return
    const totalImages = getImageCount(currentItem)
    if (currentImageIndex + 1 < totalImages) {
      setCurrentImageIndex(currentImageIndex + 1)
    } else {
      // Pindah ke item berikutnya
      const newItemIndex = (currentIndex + 1) % filteredGallery.length
      setCurrentIndex(newItemIndex)
      setCurrentItem(filteredGallery[newItemIndex])
      setCurrentImageIndex(0)
    }
  }

  const prevImage = (): void => {
    if (!currentItem) return
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    } else {
      // Pindah ke item sebelumnya
      const newItemIndex = (currentIndex - 1 + filteredGallery.length) % filteredGallery.length
      setCurrentIndex(newItemIndex)
      setCurrentItem(filteredGallery[newItemIndex])
      const newItem = filteredGallery[newItemIndex]
      setCurrentImageIndex(Math.max(0, getImageCount(newItem) - 1))
    }
  }

  const scrollToTop = (): void => window.scrollTo({ top: 0, behavior: 'smooth' })
  const shareImage = (): void => {
    if (!currentItem) return
    if (navigator.share) {
      navigator.share({ title: currentItem.title, text: currentItem.description || undefined, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link disalin ke clipboard')
    }
  }

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const heroSlides: SlideItem[] = [
    { image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop", badge: "GALERI KEGIATAN", title: "Momen Berharga", highlight: "LPPSLH", description: "Dokumentasi berbagai kegiatan, acara, pelatihan, dan proyek yang telah dilaksanakan." },
    { image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop", badge: "ACARA & PELATIHAN", title: "Pemberdayaan Masyarakat", highlight: "Kapasitas & Kolaborasi", description: "Pelatihan dan workshop untuk meningkatkan kompetensi masyarakat dan mitra kerja." },
    { image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&h=1080&fit=crop", badge: "PROYEK STRATEGIS", title: "Infrastruktur & Lingkungan", highlight: "Inovasi Berkelanjutan", description: "Dokumentasi proyek-proyek unggulan di bidang infrastruktur dan konsultansi lingkungan." },
    { image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&h=1080&fit=crop", badge: "PENGHARGAAN", title: "Pengakuan Global", highlight: "Prestasi & Sertifikasi", description: "Penghargaan dari berbagai lembaga nasional dan internasional atas dedikasi kami." }
  ]

  const galleryStats = [
    { icon: 'FiCamera', value: stats.total, label: 'Total Dokumentasi', gradient: statGradients[0] },
    { icon: 'FiFolder', value: Object.keys(stats.categories).length, label: 'Kategori', gradient: statGradients[1] },
    { icon: 'FiImage', value: galleryItems.filter(i => getImageCount(i) > 0).length, label: 'Kegiatan dengan Foto', gradient: statGradients[2] },
    { icon: 'FiAward', value: stats.categories['Penghargaan'] || 0, label: 'Penghargaan', gradient: statGradients[3] },
  ]

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat galeri...</p>
      </div>
    </div>
  )

  return (
    <div className="bg-white overflow-x-hidden">
      <HeroSlideshow slides={heroSlides} />
      <PartnerMarquee />

      {/* STATISTIK */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryStats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="group relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
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

      <FeaturedCarousel items={galleryItems} />

      {/* FILTER KATEGORI */}
      <section className="py-12 px-4 bg-gray-50 sticky top-0 z-20 backdrop-blur-md bg-white/90 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <motion.button key={cat} onClick={() => setSelectedCategory(cat)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'}`}>
                  {cat}
                  {cat !== "Semua" && stats.categories[cat] && <span className="ml-1 text-xs opacity-80">({stats.categories[cat]})</span>}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <FiGrid size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GRID GALERI - Menggunakan Grid dengan tinggi tetap agar sejajar */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        {filteredGallery.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Tidak ada kegiatan dalam kategori ini.</div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGallery.map((item, idx) => {
              const imageCount = getImageCount(item)
              return (
                <motion.div 
                  key={item.id} 
                  variants={fadeUp} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }} 
                  transition={{ delay: idx * 0.05 }} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 flex flex-col h-full"
                  onClick={() => openLightbox(idx, 0)}
                >
                  <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                    <img 
                      src={getImageUrl(item, 0)} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-2"><FiZoomIn className="text-white" size={18} /></div>
                    </div>
                    {imageCount > 1 && (
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FiImage size={12} /> {imageCount} foto
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition duration-500">
                      <h3 className="text-white font-bold text-xl">{item.title}</h3>
                      <div className="flex items-center gap-3 text-gray-200 text-xs mt-2">
                        <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {item.location && <span className="flex items-center gap-1"><FiMapPin size={12} /> {item.location}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{item.category}</span>
                    <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('id-ID')}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          // LIST VIEW
          <div className="space-y-4">
            {filteredGallery.map((item, idx) => {
              const imageCount = getImageCount(item)
              return (
                <motion.div key={item.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition cursor-pointer" onClick={() => openLightbox(idx, 0)}>
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 md:h-auto relative bg-gray-100">
                      <img src={getImageUrl(item, 0)} alt={item.title} className="w-full h-full object-cover" />
                      {imageCount > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <FiImage size={12} /> {imageCount} foto
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{item.category}</span>
                          <h3 className="text-xl font-bold text-gray-900 mt-2">{item.title}</h3>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      {item.description && <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        {item.location && <span className="flex items-center gap-1"><FiMapPin size={12} /> {item.location}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      {/* ========== LIGHTBOX ========== */}
      <AnimatePresence>
        {lightboxOpen && currentItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 px-10 pt-6 pb-8 bg-white/5 backdrop-blur-sm border-b border-white/20">
                <div className="flex-1 text-center text-white/60 text-xs font-semibold tracking-wide">
                  Galeri – {currentItem.title} {getImageCount(currentItem) > 1 && `(${currentImageIndex + 1}/${getImageCount(currentItem)})`}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row h-[calc(90vh-52px)]">
                <div className="relative flex-1 bg-black/30 flex items-center justify-center p-4 min-h-[300px] lg:min-h-0">
                  <img 
                    src={getImageUrl(currentItem, currentImageIndex)} 
                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-xl" 
                    alt={currentItem.title} 
                  />
                  <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/40 transition-all duration-200 shadow-md">
                    <FiChevronLeft size={24} className="text-white drop-shadow" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/40 transition-all duration-200 shadow-md">
                    <FiChevronRight size={24} className="text-white drop-shadow" />
                  </button>

                  {getImageCount(currentItem) > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5">
                      {Array.from({ length: getImageCount(currentItem) }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx) }}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:w-96 bg-white/5 backdrop-blur-md border-l border-white/20 p-6 text-white overflow-y-auto">
                  <h3 className="text-2xl font-medium tracking-tight mb-2">{currentItem.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-600/80 text-xs px-2 py-1 rounded-full">{currentItem.category}</span>
                    <span className="flex items-center gap-1 text-xs text-white/70"><FiCalendar size={12} /> {new Date(currentItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    {currentItem.location && <span className="flex items-center gap-1 text-xs text-white/70"><FiMapPin size={12} /> {currentItem.location}</span>}
                  </div>
                  {currentItem.description && <p className="text-sm text-white/70 mb-6 leading-relaxed">{currentItem.description}</p>}

                  {getImageCount(currentItem) > 1 && (
                    <div className="mb-4">
                      <dt className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Semua Foto ({getImageCount(currentItem)})</dt>
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: getImageCount(currentItem) }).map((_, idx) => (
                          <div
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition ${idx === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            <img src={getImageUrl(currentItem, idx)} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="group">
                      <dt className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1">Diunggah pada</dt>
                      <dd className="text-base font-light text-white/90 group-hover:text-white transition">
                        {new Date(currentItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </dd>
                      <div className="mt-1 h-px bg-white/10 group-hover:bg-white/20 transition" />
                    </div>
                    <div className="group">
                      <dt className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1">Kategori</dt>
                      <dd className="text-base font-light text-white/90 group-hover:text-white transition">{currentItem.category}</dd>
                      <div className="mt-1 h-px bg-white/10 group-hover:bg-white/20 transition" />
                    </div>
                    <div className="group">
                      <dt className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1">Lokasi</dt>
                      <dd className="text-base font-light text-white/90 group-hover:text-white transition">{currentItem.location || "Tidak disebutkan"}</dd>
                      <div className="mt-1 h-px bg-white/10 group-hover:bg-white/20 transition" />
                    </div>
                  </div>

                  <button onClick={shareImage} className="mt-6 w-full flex items-center justify-center gap-2 py-2 bg-white/10 backdrop-blur-md rounded-xl text-sm text-white hover:bg-white/20 transition">
                    <FiShare2 size={16} /> Bagikan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BACK TO TOP */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={scrollToTop} className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-40">
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx>{`
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        .animate-pulse { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  )
}