'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import AdminSectionNav from '@/components/admin/AdminSectionNav'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  FiPlus, FiEdit, FiTrash2, FiX, FiArrowUp, FiArrowDown, FiSave,
  FiRefreshCw, FiLoader, FiMapPin, FiUser, FiClock,
  FiStar, FiMail, FiPhone, FiMessageCircle, FiCompass, FiNavigation,
  FiImage, FiUpload
} from 'react-icons/fi'

// ===== TYPE DEFINITIONS =====
interface HeroSlide {
  id: string
  image: string
  badge: string
  title: string
  highlight: string
  description: string
  order: number
}

interface Office {
  id: string
  name: string
  type: string
  city: string
  address: string
  phone: string
  whatsapp: string
  email: string
  mapUrl: string
  lat: number
  lng: number
  gradient: string
  icon_name: string
  workingHours: string
  gallery: string[]
  nearbyPlaces: string[]
  contactPerson: { name: string; title: string; phone: string }
}

interface StatItem {
  id: string
  icon: string
  value: string
  label: string
  color: string
}

interface Testimonial {
  id: string
  name: string
  role: string
  text: string
  avatar: string
  rating: number
}

interface Message {
  text: string
  type: 'success' | 'error' | ''
}

// ===== CONSTANTS =====
const NAV_ITEMS = [
  { key: 'hero_slides', label: '🎞️ Hero Slideshow' },
  { key: 'stats', label: '📊 Statistik' },
  { key: 'offices', label: '🏢 Daftar Kantor' },
  { key: 'testimonials', label: '💬 Testimonial' },
]

const ICON_OPTIONS = [
  'FiCompass', 'FiNavigation', 'FiMapPin', 'FiGlobe', 'FiStar',
  'FiClock', 'FiMail', 'FiUser', 'FiCalendar', 'FiCamera',
  'FiMessageCircle', 'FiUsers', 'FiAward', 'FiTrendingUp', 'FiShield'
]

const GRADIENT_OPTIONS = [
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-pink-600',
  'from-green-600 to-emerald-600',
  'from-amber-600 to-orange-600',
  'from-red-600 to-rose-600',
  'from-cyan-600 to-blue-600',
  'from-indigo-600 to-purple-600',
  'from-emerald-600 to-teal-600',
]

const generateId = () => crypto.randomUUID()

// ===== DEFAULT DATA =====
const DEFAULT_STATS: StatItem[] = [
  { id: generateId(), icon: 'FiClock', value: '24/7', label: 'Layanan Konsultasi', color: 'from-blue-500 to-cyan-500' },
  { id: generateId(), icon: 'FiMapPin', value: '2', label: 'Lokasi Strategis', color: 'from-purple-500 to-pink-500' },
  { id: generateId(), icon: 'FiMail', value: '24 Jam', label: 'Respon Cepat', color: 'from-green-500 to-emerald-500' },
  { id: generateId(), icon: 'FiStar', value: '100%', label: 'Kepuasan Klien', color: 'from-amber-500 to-orange-500' },
]

const DEFAULT_OFFICES: Office[] = [
  {
    id: generateId(),
    name: 'Kantor Pusat',
    type: 'Head Office',
    city: 'Semarang, Jawa Tengah',
    address: 'Jl. Ngesrep Barat III No.30 G, Kota Semarang, Jawa Tengah 50261',
    phone: '(024) 7472581',
    whatsapp: '6281234567890',
    email: 'pt.lppslh@yahoo.com',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.705820499239!2d110.39850801477063!3d-7.027148794457813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4d3f0d7e6b%3A0x4a2b5c8d9e1f3a7c!2sJl.%20Ngesrep%20Barat%20III%2C%20Semarang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    lat: -7.0271488,
    lng: 110.398508,
    gradient: 'from-blue-600 to-indigo-600',
    icon_name: 'FiCompass',
    workingHours: 'Senin - Jumat: 08.00 - 17.00 WIB | Sabtu: 08.00 - 13.00 WIB | Minggu: Tutup',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f2008d2a7c4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop'
    ],
    nearbyPlaces: ['Universitas Diponegoro', 'Simpang Lima Semarang', 'Kota Lama Semarang'],
    contactPerson: { name: 'Bapak Hendra', title: 'Customer Service Manager', phone: '081234567890' }
  },
  {
    id: generateId(),
    name: 'Studio Jakarta',
    type: 'Creative Studio',
    city: 'Jakarta Selatan',
    address: 'Ruko Royal Palace Blok C5, Jl. Prof. DR. Soepomo No.178A, Tebet, 12870',
    phone: '(021) 38825070',
    whatsapp: '6281234567891',
    email: 'lppslh.konsultan.pt@gmail.com',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.166349436707!2d106.83465011476913!3d-6.236355795484318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3b5c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sJl.%20Prof.%20DR.%20Soepomo%20No.178A%2C%20Tebet%2C%20Jakarta%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    lat: -6.2363558,
    lng: 106.8346501,
    gradient: 'from-purple-600 to-pink-600',
    icon_name: 'FiNavigation',
    workingHours: 'Senin - Jumat: 09.00 - 18.00 WIB | Sabtu: 09.00 - 14.00 WIB | Minggu: Tutup',
    gallery: [
      'https://images.unsplash.com/photo-1497366815505-2a06b4c2d1b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f2008d2a7c4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop'
    ],
    nearbyPlaces: ['Kuningan City Mall', 'Tebet Eco Park', 'Setiabudi One', 'Kantor Kementerian PUPR'],
    contactPerson: { name: 'Ibu Dewi', title: 'Client Relation', phone: '081298765432' }
  }
]

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: generateId(),
    image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1920&h=1080&fit=crop',
    badge: 'KANTOR & STUDIO',
    title: 'Lokasi Strategis',
    highlight: 'di Semarang & Jakarta',
    description: 'Dua lokasi premium untuk melayani kebutuhan konsultasi Anda dengan fasilitas modern dan tim profesional.',
    order: 0
  },
  {
    id: generateId(),
    image: 'https://images.unsplash.com/photo-1497366754035-f2008d2a7c4b?w=1920&h=1080&fit=crop',
    badge: 'NUANSA PROFESIONAL',
    title: 'Ruang Kerja',
    highlight: 'Kelas Dunia',
    description: 'Kantor dengan desain modern, ruang rapat premium, dan kenyamanan maksimal untuk kolaborasi.',
    order: 1
  },
  {
    id: generateId(),
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1920&h=1080&fit=crop',
    badge: 'STUDIO KREATIF',
    title: 'Ruang Inovasi',
    highlight: 'Jakarta Selatan',
    description: 'Studio kreatif dengan fasilitas lengkap untuk workshop, diskusi, dan pengembangan ide.',
    order: 2
  }
]

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: generateId(), name: 'Budi Santoso', role: 'CEO, PT Maju Jaya', text: 'Kantor LPPSLH sangat profesional dan nyaman. Timnya responsif dan solutif.', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', rating: 5 },
  { id: generateId(), name: 'Siti Aminah', role: 'Kepala Dinas PU', text: 'Kunjungan ke Studio Jakarta sangat mengesankan. Fasilitas lengkap dan modern.', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', rating: 5 },
  { id: generateId(), name: 'Andi Wijaya', role: 'Direktur Operasional', text: 'Konsultasi di kantor pusat sangat membantu proyek kami. Highly recommended!', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', rating: 5 },
]

const DEFAULT_OFFICE: Office = {
  id: generateId(),
  name: '',
  type: 'Head Office',
  city: '',
  address: '',
  phone: '',
  whatsapp: '',
  email: '',
  mapUrl: '',
  lat: -7.0271488,
  lng: 110.398508,
  gradient: 'from-blue-600 to-indigo-600',
  icon_name: 'FiCompass',
  workingHours: 'Senin - Jumat: 08.00 - 17.00 WIB | Sabtu: 08.00 - 13.00 WIB | Minggu: Tutup',
  gallery: [],
  nearbyPlaces: [],
  contactPerson: { name: '', title: '', phone: '' },
}

// ===== KOMPONEN MODAL PORTAL =====
function ModalPortal({ children, isOpen, onClose }: { children: React.ReactNode; isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted) return null
  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

// ========== MAIN COMPONENT ==========
export default function AdminOfficesPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState<string>('hero_slides')

  // Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [slideForm, setSlideForm] = useState<HeroSlide>({
    id: generateId(),
    image: '', badge: '', title: '', highlight: '', description: '', order: 0
  })

  // Stats
  const [stats, setStats] = useState<StatItem[]>([])
  const [showStatModal, setShowStatModal] = useState(false)
  const [editingStat, setEditingStat] = useState<StatItem | null>(null)
  const [statForm, setStatForm] = useState<StatItem>({
    id: generateId(),
    icon: 'FiClock', value: '', label: '', color: 'from-blue-500 to-cyan-500'
  })

  // Offices
  const [offices, setOffices] = useState<Office[]>([])
  const [showOfficeModal, setShowOfficeModal] = useState(false)
  const [editingOffice, setEditingOffice] = useState<Office | null>(null)
  const [officeForm, setOfficeForm] = useState<Office>({ ...DEFAULT_OFFICE })
  const [galleryInput, setGalleryInput] = useState('')
  const [nearbyInput, setNearbyInput] = useState('')
  const [showGalleryUpload, setShowGalleryUpload] = useState(false)

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [testimonialForm, setTestimonialForm] = useState<Testimonial>({
    id: generateId(),
    name: '', role: '', text: '', avatar: '', rating: 5
  })

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'offices')
        .eq('key', 'data')

      if (error) throw error

      let hasHero = false, hasStats = false, hasOffices = false, hasTestimonials = false

      if (data && data.length > 0) {
        data.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            if (item.section === 'hero_slides' && parsed.length > 0) {
              const withIds = parsed.map((s: any) => ({ ...s, id: s.id || generateId() }))
              const sorted = withIds.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              setHeroSlides(sorted)
              hasHero = true
            } else if (item.section === 'stats' && parsed.length > 0) {
              const withIds = parsed.map((s: any) => ({ ...s, id: s.id || generateId() }))
              setStats(withIds)
              hasStats = true
            } else if (item.section === 'offices_list' && parsed.length > 0) {
              const withIds = parsed.map((s: any) => ({ ...s, id: s.id || generateId() }))
              setOffices(withIds)
              hasOffices = true
            } else if (item.section === 'testimonials' && parsed.length > 0) {
              const withIds = parsed.map((s: any) => ({ ...s, id: s.id || generateId() }))
              setTestimonials(withIds)
              hasTestimonials = true
            }
          } catch (e) {
            console.error('Parse error section', item.section, e)
          }
        })
      }

      if (!hasHero) setHeroSlides(DEFAULT_HERO_SLIDES)
      if (!hasStats) setStats(DEFAULT_STATS)
      if (!hasOffices) setOffices(DEFAULT_OFFICES)
      if (!hasTestimonials) setTestimonials(DEFAULT_TESTIMONIALS)

      setMessage({ text: '✅ Data berhasil dimuat', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)

    } catch (err: any) {
      setMessage({ text: '❌ Gagal memuat data: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ========== SAVE ==========
  const saveSection = async (section: string, data: any) => {
    const { error } = await supabase
      .from('page_contents')
      .upsert(
        { page: 'offices', section, key: 'data', value: JSON.stringify(data) },
        { onConflict: 'page, section, key' }
      )
    if (error) throw error
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await saveSection('hero_slides', heroSlides)
      await saveSection('stats', stats)
      await saveSection('offices_list', offices)
      await saveSection('testimonials', testimonials)
      setMessage({ text: '✅ Semua konten offices berhasil disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal menyimpan: ' + err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // ========== CRUD HERO SLIDES ==========
  const addSlide = (s: HeroSlide) => {
    const newSlide = { ...s, id: generateId(), order: heroSlides.length }
    setHeroSlides([...heroSlides, newSlide])
  }

  const updateSlide = (id: string, s: HeroSlide) => {
    const updated = heroSlides.map(item => item.id === id ? { ...s, id } : item)
    setHeroSlides(updated)
  }

  const deleteSlide = (id: string) => {
    if (!confirm('Hapus slide ini?')) return
    const filtered = heroSlides.filter(item => item.id !== id)
    const reordered = filtered.map((item, idx) => ({ ...item, order: idx }))
    setHeroSlides(reordered)
  }

  const moveSlide = (id: string, dir: 'up' | 'down') => {
    const idx = heroSlides.findIndex(item => item.id === id)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === heroSlides.length - 1) return
    const newSlides = [...heroSlides]
    const newIdx = dir === 'up' ? idx - 1 : idx + 1
    ;[newSlides[idx], newSlides[newIdx]] = [newSlides[newIdx], newSlides[idx]]
    newSlides.forEach((item, i) => { item.order = i })
    setHeroSlides(newSlides)
  }

  const openSlideModal = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide)
      setSlideForm({ ...slide })
    } else {
      setEditingSlide(null)
      setSlideForm({ id: generateId(), image: '', badge: '', title: '', highlight: '', description: '', order: heroSlides.length })
    }
    setShowSlideModal(true)
  }

  const saveSlideFromModal = () => {
    if (!slideForm.title) { alert('Title wajib diisi'); return }
    if (editingSlide) {
      updateSlide(editingSlide.id, slideForm)
    } else {
      addSlide(slideForm)
    }
    setShowSlideModal(false)
  }

  // ========== CRUD STATS ==========
  const addStat = (item: StatItem) => {
    const newItem = { ...item, id: generateId() }
    setStats([...stats, newItem])
  }

  const updateStat = (id: string, item: StatItem) => {
    const updated = stats.map(s => s.id === id ? { ...item, id } : s)
    setStats(updated)
  }

  const deleteStat = (id: string) => {
    if (stats.length <= 1) { alert('Minimal 1 statistik harus ada'); return }
    if (!confirm('Hapus statistik ini?')) return
    setStats(stats.filter(s => s.id !== id))
  }

  const openStatModal = (stat?: StatItem) => {
    if (stat) {
      setEditingStat(stat)
      setStatForm({ ...stat })
    } else {
      setEditingStat(null)
      setStatForm({ id: generateId(), icon: 'FiClock', value: '', label: '', color: 'from-blue-500 to-cyan-500' })
    }
    setShowStatModal(true)
  }

  const saveStatFromModal = () => {
    if (!statForm.value || !statForm.label) { alert('Value dan Label wajib diisi'); return }
    if (editingStat) {
      updateStat(editingStat.id, statForm)
    } else {
      addStat(statForm)
    }
    setShowStatModal(false)
  }

  // ========== CRUD OFFICES ==========
  const addOffice = (item: Office) => {
    const newOffice = { ...item, id: generateId() }
    setOffices([...offices, newOffice])
  }

  const updateOffice = (id: string, item: Office) => {
    const updated = offices.map(o => o.id === id ? { ...item, id } : o)
    setOffices(updated)
  }

  const deleteOffice = (id: string) => {
    if (!confirm('Hapus kantor ini?')) return
    setOffices(offices.filter(o => o.id !== id))
  }

  const openOfficeModal = (office?: Office) => {
    if (office) {
      setEditingOffice(office)
      setOfficeForm({ ...office })
      setGalleryInput((office.gallery || []).join('\n'))
      setNearbyInput((office.nearbyPlaces || []).join('\n'))
    } else {
      setEditingOffice(null)
      setOfficeForm({ ...DEFAULT_OFFICE, id: generateId() })
      setGalleryInput('')
      setNearbyInput('')
    }
    setShowOfficeModal(true)
  }

  const handleGalleryUpload = (url: string) => {
    if (url) {
      const current = galleryInput ? galleryInput.split('\n').filter(Boolean) : []
      if (!current.includes(url)) {
        current.push(url)
        setGalleryInput(current.join('\n'))
      }
    }
    setShowGalleryUpload(false)
  }

  const saveOfficeFromModal = () => {
    if (!officeForm.name || !officeForm.address || !officeForm.phone) {
      alert('Nama, Alamat, dan Telepon wajib diisi')
      return
    }

    const galleryArray = galleryInput.split('\n').map(s => s.trim()).filter(Boolean)
    const nearbyArray = nearbyInput.split('\n').map(s => s.trim()).filter(Boolean)

    const dataToSave = {
      ...officeForm,
      gallery: galleryArray,
      nearbyPlaces: nearbyArray,
    }

    if (editingOffice) {
      updateOffice(editingOffice.id, dataToSave)
    } else {
      addOffice(dataToSave)
    }
    setShowOfficeModal(false)
  }

  // ========== CRUD TESTIMONIALS ==========
  const addTestimonial = (item: Testimonial) => {
    const newItem = { ...item, id: generateId() }
    setTestimonials([...testimonials, newItem])
  }

  const updateTestimonial = (id: string, item: Testimonial) => {
    const updated = testimonials.map(t => t.id === id ? { ...item, id } : t)
    setTestimonials(updated)
  }

  const deleteTestimonial = (id: string) => {
    if (!confirm('Hapus testimonial ini?')) return
    setTestimonials(testimonials.filter(t => t.id !== id))
  }

  const openTestimonialModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setTestimonialForm({ ...testimonial })
    } else {
      setEditingTestimonial(null)
      setTestimonialForm({ id: generateId(), name: '', role: '', text: '', avatar: '', rating: 5 })
    }
    setShowTestimonialModal(true)
  }

  const saveTestimonialFromModal = () => {
    if (!testimonialForm.name || !testimonialForm.text) { alert('Nama dan Testimonial wajib diisi'); return }
    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, testimonialForm)
    } else {
      addTestimonial(testimonialForm)
    }
    setShowTestimonialModal(false)
  }

  // ========== RENDER ==========
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500 mt-3">Memuat data offices...</p>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'hero_slides': return renderHeroSlides()
      case 'stats': return renderStats()
      case 'offices': return renderOffices()
      case 'testimonials': return renderTestimonials()
      default: return <p>Pilih section di sidebar</p>
    }
  }

  const renderHeroSlides = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🎞️ Hero Slideshow</h2>
        <button onClick={() => openSlideModal()} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Slide
        </button>
      </div>
      {heroSlides.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Belum ada slide.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="border rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                {slide.image ? (
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold">{slide.title} <span className="text-blue-600">({slide.highlight})</span></div>
                <div className="text-sm text-gray-500 truncate">{slide.description}</div>
                <div className="text-xs text-gray-400">Badge: {slide.badge}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => moveSlide(slide.id, 'up')} disabled={slide.order === 0} className="p-1 disabled:opacity-30"><FiArrowUp /></button>
                <button onClick={() => moveSlide(slide.id, 'down')} disabled={slide.order === heroSlides.length - 1} className="p-1 disabled:opacity-30"><FiArrowDown /></button>
                <button onClick={() => openSlideModal(slide)} className="text-blue-600 p-1"><FiEdit /></button>
                <button onClick={() => deleteSlide(slide.id)} className="text-red-600 p-1"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderStats = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">📊 Statistik</h2>
        <button onClick={() => openStatModal()} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Stat
        </button>
      </div>
      {stats.map((stat) => (
        <div key={stat.id} className="border p-4 rounded-lg mb-4 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
              <span className="text-sm font-bold">{stat.icon.replace('Fi', '')}</span>
            </div>
            <div>
              <div className="font-bold text-xl">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openStatModal(stat)} className="text-blue-600"><FiEdit /></button>
            <button onClick={() => deleteStat(stat.id)} className="text-red-500"><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  )

  const renderOffices = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🏢 Daftar Kantor</h2>
        <button onClick={() => openOfficeModal()} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Kantor
        </button>
      </div>
      {offices.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Belum ada kantor.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {offices.map((office) => (
            <div key={office.id} className="border rounded-xl p-4 bg-gray-50 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{office.name}</h3>
                  <p className="text-sm text-gray-500">{office.type} • {office.city}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openOfficeModal(office)} className="text-blue-600 p-1"><FiEdit /></button>
                  <button onClick={() => deleteOffice(office.id)} className="text-red-500 p-1"><FiTrash2 /></button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p><FiMapPin className="inline mr-1" /> {office.address}</p>
                <p><FiPhone className="inline mr-1" /> {office.phone}</p>
                <p><FiMail className="inline mr-1" /> {office.email}</p>
              </div>
              {office.gallery && office.gallery.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {office.gallery.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} className="w-8 h-8 rounded object-cover" alt="" />
                  ))}
                  {office.gallery.length > 3 && <span className="text-xs text-gray-400">+{office.gallery.length - 3}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderTestimonials = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">💬 Testimonial</h2>
        <button onClick={() => openTestimonialModal()} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Testimonial
        </button>
      </div>
      {testimonials.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Belum ada testimonial.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((test) => (
            <div key={test.id} className="border rounded-xl p-4 bg-gray-50 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {test.avatar ? (
                    <img src={test.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <FiUser size={20} />
                    </div>
                  )}
                  <div>
                    <div className="font-bold">{test.name}</div>
                    <div className="text-sm text-gray-500">{test.role}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openTestimonialModal(test)} className="text-blue-600 p-1"><FiEdit /></button>
                  <button onClick={() => deleteTestimonial(test.id)} className="text-red-500 p-1"><FiTrash2 /></button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 italic">"{test.text}"</p>
              <div className="flex text-yellow-400 mt-1">
                {[...Array(test.rating)].map((_, i) => <FiStar key={i} fill="currentColor" size={14} className="mr-0.5" />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ========== MAIN RENDER ==========
  return (
    <div className="flex gap-6">
      <AdminSectionNav items={NAV_ITEMS} activeKey={activeSection} onSelect={setActiveSection} />

      <div className="flex-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Kelola Halaman Offices</h2>
          <div className="flex gap-2">
            <button onClick={fetchData} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition text-sm">
              <FiRefreshCw size={14} /> Refresh
            </button>
            <button onClick={handleSaveAll} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50 text-sm">
              <FiSave size={14} /> {saving ? 'Menyimpan...' : 'Simpan Semua'}
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {renderSection()}
      </div>

      {/* ===== MODAL SLIDE ===== */}
      <ModalPortal isOpen={showSlideModal} onClose={() => setShowSlideModal(false)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{editingSlide ? 'Edit Slide' : 'Tambah Slide'}</h3>
          <button onClick={() => setShowSlideModal(false)}><FiX size={24} /></button>
        </div>
        <div className="space-y-3">
          <ImageUpload bucket="service-images" path="offices/hero" value={slideForm.image} onChange={url => setSlideForm({...slideForm, image: url})} label="Gambar Slide (Opsional)" />
          <input placeholder="Badge" value={slideForm.badge} onChange={e => setSlideForm({...slideForm, badge: e.target.value})} className="w-full border rounded p-2" />
          <input placeholder="Title *" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full border rounded p-2" />
          <input placeholder="Highlight" value={slideForm.highlight} onChange={e => setSlideForm({...slideForm, highlight: e.target.value})} className="w-full border rounded p-2" />
          <textarea placeholder="Deskripsi" value={slideForm.description} onChange={e => setSlideForm({...slideForm, description: e.target.value})} rows={2} className="w-full border rounded p-2" />
          <button onClick={saveSlideFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
        </div>
      </ModalPortal>

      {/* ===== MODAL STAT ===== */}
      <ModalPortal isOpen={showStatModal} onClose={() => setShowStatModal(false)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{editingStat ? 'Edit Statistik' : 'Tambah Statistik'}</h3>
          <button onClick={() => setShowStatModal(false)}><FiX size={24} /></button>
        </div>
        <div className="space-y-3">
          <select value={statForm.icon} onChange={e => setStatForm({...statForm, icon: e.target.value})} className="w-full border rounded p-2">
            {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
          </select>
          <input placeholder="Value" value={statForm.value} onChange={e => setStatForm({...statForm, value: e.target.value})} className="w-full border rounded p-2" />
          <input placeholder="Label" value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} className="w-full border rounded p-2" />
          <select value={statForm.color} onChange={e => setStatForm({...statForm, color: e.target.value})} className="w-full border rounded p-2">
            {GRADIENT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <button onClick={saveStatFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
        </div>
      </ModalPortal>

      {/* ===== MODAL OFFICE ===== */}
      <ModalPortal isOpen={showOfficeModal} onClose={() => setShowOfficeModal(false)}>
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h3 className="text-xl font-bold">{editingOffice ? 'Edit Kantor' : 'Tambah Kantor'}</h3>
          <button onClick={() => setShowOfficeModal(false)}><FiX size={24} /></button>
        </div>
        <div className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Nama Kantor *" value={officeForm.name} onChange={e => setOfficeForm({...officeForm, name: e.target.value})} className="border rounded p-2" />
            <input placeholder="Tipe (Head Office, Creative Studio)" value={officeForm.type} onChange={e => setOfficeForm({...officeForm, type: e.target.value})} className="border rounded p-2" />
          </div>
          <input placeholder="Kota" value={officeForm.city} onChange={e => setOfficeForm({...officeForm, city: e.target.value})} className="w-full border rounded p-2" />
          <textarea placeholder="Alamat *" value={officeForm.address} onChange={e => setOfficeForm({...officeForm, address: e.target.value})} rows={2} className="w-full border rounded p-2" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Telepon *" value={officeForm.phone} onChange={e => setOfficeForm({...officeForm, phone: e.target.value})} className="border rounded p-2" />
            <input placeholder="WhatsApp" value={officeForm.whatsapp} onChange={e => setOfficeForm({...officeForm, whatsapp: e.target.value})} className="border rounded p-2" />
          </div>
          <input placeholder="Email" value={officeForm.email} onChange={e => setOfficeForm({...officeForm, email: e.target.value})} className="w-full border rounded p-2" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Latitude" type="number" step="any" value={officeForm.lat} onChange={e => setOfficeForm({...officeForm, lat: parseFloat(e.target.value)})} className="border rounded p-2" />
            <input placeholder="Longitude" type="number" step="any" value={officeForm.lng} onChange={e => setOfficeForm({...officeForm, lng: parseFloat(e.target.value)})} className="border rounded p-2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={officeForm.icon_name} onChange={e => setOfficeForm({...officeForm, icon_name: e.target.value})} className="border rounded p-2">
              {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
            <select value={officeForm.gradient} onChange={e => setOfficeForm({...officeForm, gradient: e.target.value})} className="border rounded p-2">
              {GRADIENT_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <textarea placeholder="Jam Operasional" value={officeForm.workingHours} onChange={e => setOfficeForm({...officeForm, workingHours: e.target.value})} rows={2} className="w-full border rounded p-2" />

          {/* GALERI dengan Upload */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Galeri (Opsional, satu URL per baris)</label>
              <button
                type="button"
                onClick={() => setShowGalleryUpload(true)}
                className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-200 transition"
              >
                <FiUpload size={14} /> Upload Gambar
              </button>
            </div>
            <textarea
              placeholder="https://images.unsplash.com/photo-..."
              value={galleryInput}
              onChange={e => setGalleryInput(e.target.value)}
              rows={3}
              className="w-full border rounded p-2"
            />
            {showGalleryUpload && (
              <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Upload Gambar</span>
                  <button onClick={() => setShowGalleryUpload(false)} className="text-gray-400 hover:text-gray-600">
                    <FiX size={18} />
                  </button>
                </div>
                <ImageUpload
                  bucket="service-images"
                  path="offices/gallery"
                  value=""
                  onChange={handleGalleryUpload}
                  label="Pilih gambar"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Terdekat (satu per baris)</label>
            <textarea placeholder="Universitas Diponegoro" value={nearbyInput} onChange={e => setNearbyInput(e.target.value)} rows={3} className="w-full border rounded p-2" />
          </div>

          <div className="border p-3 rounded-lg bg-gray-50">
            <p className="font-medium text-sm">Contact Person</p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <input placeholder="Nama" value={officeForm.contactPerson.name} onChange={e => setOfficeForm({...officeForm, contactPerson: {...officeForm.contactPerson, name: e.target.value}})} className="border rounded p-1 text-sm" />
              <input placeholder="Jabatan" value={officeForm.contactPerson.title} onChange={e => setOfficeForm({...officeForm, contactPerson: {...officeForm.contactPerson, title: e.target.value}})} className="border rounded p-1 text-sm" />
              <input placeholder="Telepon" value={officeForm.contactPerson.phone} onChange={e => setOfficeForm({...officeForm, contactPerson: {...officeForm.contactPerson, phone: e.target.value}})} className="border rounded p-1 text-sm" />
            </div>
          </div>

          <textarea placeholder="Map Embed URL" value={officeForm.mapUrl} onChange={e => setOfficeForm({...officeForm, mapUrl: e.target.value})} rows={2} className="w-full border rounded p-2" />

          <button onClick={saveOfficeFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Kantor</button>
        </div>
      </ModalPortal>

      {/* ===== MODAL TESTIMONIAL ===== */}
      <ModalPortal isOpen={showTestimonialModal} onClose={() => setShowTestimonialModal(false)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{editingTestimonial ? 'Edit Testimonial' : 'Tambah Testimonial'}</h3>
          <button onClick={() => setShowTestimonialModal(false)}><FiX size={24} /></button>
        </div>
        <div className="space-y-3">
          <input placeholder="Nama" value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} className="w-full border rounded p-2" />
          <input placeholder="Role" value={testimonialForm.role} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} className="w-full border rounded p-2" />
          <textarea placeholder="Testimonial" value={testimonialForm.text} onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})} rows={3} className="w-full border rounded p-2" />
          <ImageUpload bucket="service-images" path="offices/testimonials" value={testimonialForm.avatar} onChange={url => setTestimonialForm({...testimonialForm, avatar: url})} label="Avatar (Opsional)" />
          <input type="number" placeholder="Rating (1-5)" value={testimonialForm.rating} onChange={e => setTestimonialForm({...testimonialForm, rating: parseInt(e.target.value)})} className="w-full border rounded p-2" min="1" max="5" />
          <button onClick={saveTestimonialFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
        </div>
      </ModalPortal>
    </div>
  )
}