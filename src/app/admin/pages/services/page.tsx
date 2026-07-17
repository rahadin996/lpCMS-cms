// src/app/admin/services/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminSectionNav from '@/components/admin/AdminSectionNav'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  FiPlus, FiEdit, FiTrash2, FiX, FiArrowUp, FiArrowDown, FiSave,
  FiRefreshCw, FiLoader, FiChevronRight, FiUser
} from 'react-icons/fi'

// ========== TYPE DEFINITIONS ==========

// === Untuk Halaman Services (page_contents) ===
interface HeroSlide {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
  order: number
}

interface MarqueeItem {
  name: string
  icon: string
  order: number
}

interface StatItem {
  icon: string
  value: string | number
  label: string
  suffix?: string
}

interface AdvantageItem {
  title: string
  desc: string
  icon: string
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
  year: string | number
  issuer: string
  icon: string
}

interface FaqItem {
  q: string
  a: string
}

interface CtaContent {
  title: string
  description: string
  button_text: string
  button_link: string
  background_image: string
  background_color: string
  text_color: string
}

// === Untuk Daftar Layanan (tabel services) ===
interface Service {
  id: number
  title: string
  slug: string
  description: string
  icon: string
  image_url: string
  features: string[]
  created_at?: string
}

interface ServiceForm {
  title: string
  slug: string
  description: string
  icon: string
  image_url: string
  features: string[]
}

// === Untuk Detail Layanan (page_contents service_detail) ===
interface DetailStatItem {
  value: number
  label: string
  suffix?: string
  icon?: string
  color?: string
}

interface FeatureItem {
  icon?: string
  label: string
  desc: string
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

interface DetailTeamMember {
  name: string
  role: string
  expertise?: string
  image: string
}

interface DetailTestimonial {
  name: string
  role: string
  text: string
  rating: number
  avatar: string
}

interface DetailFaq {
  q: string
  a: string
}

interface DetailContent {
  hero: {
    badge: string
    title: string
    subtitle: string
    background_video: string
    background_image: string
    button_text: string
    button_link: string
    secondary_button_text: string
    secondary_button_link: string
  }
  stats: DetailStatItem[]
  about: {
    title: string
    description: string
    description2: string
    features: FeatureItem[]
  }
  benefits: BenefitItem[]
  timeline: TimelineItem[]
  projects: ProjectItem[]
  gallery: string[]
  team: DetailTeamMember[]
  testimonials: DetailTestimonial[]
  faqs: DetailFaq[]
  clients: string[]
}

// === Personil (tabel personil) ===
interface Personil {
  id: number
  nama: string
  posisi: string
  image: string
  noHp?: string
  lulusan?: string
  tahun_lulus?: number
  deskripsi?: string
  keahlian?: string[]
}

interface Message {
  text: string
  type: 'success' | 'error' | ''
}

// ========== CONSTANTS ==========

const NAV_ITEMS = [
  { key: 'hero_slides', label: '🎞️ Hero Slideshow' },
  { key: 'marquee', label: '🔄 Service Marquee' },
  { key: 'stats', label: '📊 Statistik' },
  { key: 'advantages', label: '⭐ Keunggulan' },
  { key: 'services_list', label: '🛠️ Daftar Layanan' },
  { key: 'service_detail', label: '✏️ Detail Layanan' },
  { key: 'testimonials', label: '💬 Testimonial' },
  { key: 'clients', label: '🏢 Klien' },
  { key: 'team', label: '👥 Tim Ahli (Personil)' },
  { key: 'awards', label: '🏆 Penghargaan' },
  { key: 'faqs', label: '❓ FAQ' },
  { key: 'cta', label: '🎯 CTA' },
]

const ICON_OPTIONS = [
  'FiCompass', 'FiDroplet', 'FiBarChart2', 'FiMapPin', 'FiTrendingUp', 'FiUsers',
  'FiCpu', 'FiServer', 'FiBriefcase', 'FiAward', 'FiStar', 'FiGlobe', 'FiLayers',
  'FiCheckCircle', 'FiBookOpen', 'FiMessageCircle', 'FiCalendar', 'FiClock', 'FiUser'
]

// Default data untuk Halaman Services
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop',
    badge: 'LAYANAN PREMIUM',
    title: 'Solusi Konsultansi',
    highlight: 'Terintegrasi',
    description: 'LPPSLH menyediakan layanan perencanaan strategis, konsultansi lingkungan, dan manajemen proyek berstandar internasional.',
    order: 0
  },
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop',
    badge: 'INFRASTRUKTUR & LINGKUNGAN',
    title: 'Membangun Masa Depan',
    highlight: 'Berkelanjutan',
    description: 'Kami hadir untuk menjawab tantangan pembangunan berkelanjutan dengan pendekatan inovatif.',
    order: 1
  },
  {
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop',
    badge: 'TEKNOLOGI & INOVASI',
    title: 'Digital Twin & GIS',
    highlight: 'Presisi & Efisiensi',
    description: 'Memanfaatkan teknologi terkini untuk analisis spasial dan simulasi digital.',
    order: 2
  }
]

const DEFAULT_MARQUEE: MarqueeItem[] = [
  { name: 'Perencanaan Strategis', icon: 'FiCompass', order: 0 },
  { name: 'Konsultansi Lingkungan', icon: 'FiDroplet', order: 1 },
  { name: 'Manajemen Proyek', icon: 'FiBarChart2', order: 2 },
  { name: 'Sistem Informasi Geografis', icon: 'FiMapPin', order: 3 },
  { name: 'Kajian Kelayakan', icon: 'FiTrendingUp', order: 4 },
  { name: 'Pemberdayaan Masyarakat', icon: 'FiUsers', order: 5 },
  { name: 'Transformasi Digital', icon: 'FiCpu', order: 6 },
  { name: 'Konsultasi Hukum', icon: 'FiServer', order: 7 }
]

const DEFAULT_SERVICE_FORM: ServiceForm = {
  title: '',
  slug: '',
  description: '',
  icon: 'FiBriefcase',
  image_url: '',
  features: []
}

const DEFAULT_DETAIL: DetailContent = {
  hero: {
    badge: 'Layanan Premium',
    title: 'Judul Layanan',
    subtitle: 'Deskripsi singkat layanan',
    background_video: '',
    background_image: '',
    button_text: 'Konsultasi Sekarang',
    button_link: '/contact',
    secondary_button_text: 'Lihat Portofolio',
    secondary_button_link: '/projects'
  },
  stats: [],
  about: {
    title: 'Tentang Layanan',
    description: 'Deskripsi lengkap layanan...',
    description2: '',
    features: []
  },
  benefits: [],
  timeline: [],
  projects: [],
  gallery: [],
  team: [],
  testimonials: [],
  faqs: [],
  clients: []
}

// ========== MAIN COMPONENT ==========
export default function AdminServicesPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState<string>('hero_slides')

  // ===== STATE UNTUK HALAMAN SERVICES =====
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES)
  const [savingSlides, setSavingSlides] = useState(false)
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [slideForm, setSlideForm] = useState<HeroSlide>({
    image: '', badge: '', title: '', highlight: '', description: '', order: 0
  })

  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>(DEFAULT_MARQUEE)
  const [savingMarquee, setSavingMarquee] = useState(false)
  const [showMarqueeModal, setShowMarqueeModal] = useState(false)
  const [editingMarqueeIndex, setEditingMarqueeIndex] = useState<number | null>(null)
  const [marqueeForm, setMarqueeForm] = useState<MarqueeItem>({ name: '', icon: 'FiCompass', order: 0 })

  const [stats, setStats] = useState<StatItem[]>([])
  const [advantages, setAdvantages] = useState<AdvantageItem[]>([])
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [clients, setClients] = useState<string[]>([])
  const [awards, setAwards] = useState<AwardItem[]>([])
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [cta, setCta] = useState<CtaContent>({
    title: 'Siap Memulai Proyek Anda?',
    description: 'Konsultasikan kebutuhan Anda dengan tim ahli kami secara gratis.',
    button_text: 'Hubungi Kami',
    button_link: '/contact',
    background_image: '',
    background_color: '#1e3a8a',
    text_color: '#ffffff'
  })

  // ===== STATE UNTUK PERSONIL =====
  const [personil, setPersonil] = useState<Personil[]>([])
  const [showPersonilModal, setShowPersonilModal] = useState(false)
  const [editingPersonil, setEditingPersonil] = useState<Personil | null>(null)
  const [personilForm, setPersonilForm] = useState<{
    nama: string
    posisi: string
    image: string
    lulusan: string
    tahun_lulus: number
    deskripsi: string
    keahlian: string
  }>({
    nama: '',
    posisi: '',
    image: '',
    lulusan: '',
    tahun_lulus: new Date().getFullYear(),
    deskripsi: '',
    keahlian: ''
  })
  const [savingPersonil, setSavingPersonil] = useState(false)

  // ===== STATE UNTUK DAFTAR LAYANAN =====
  const [services, setServices] = useState<Service[]>([])
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [serviceForm, setServiceForm] = useState<ServiceForm>(DEFAULT_SERVICE_FORM)
  const [featuresInput, setFeaturesInput] = useState('')

  // ===== STATE UNTUK DETAIL LAYANAN =====
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [detailContent, setDetailContent] = useState<DetailContent>(DEFAULT_DETAIL)
  const [savingDetail, setSavingDetail] = useState(false)

  // ========== FUNGSI FETCH ==========

  const fetchPageContent = async () => {
    const { data, error } = await supabase
      .from('page_contents')
      .select('section, value')
      .eq('page', 'services')
      .eq('key', 'data')

    if (error) {
      console.error('Error fetching page content:', error)
      return
    }

    if (data) {
      data.forEach((item: any) => {
        try {
          const parsed = JSON.parse(item.value)
          if (item.section === 'hero_slides') {
            const sorted = parsed.sort((a: HeroSlide, b: HeroSlide) => (a.order || 0) - (b.order || 0))
            setHeroSlides(sorted)
          } else if (item.section === 'marquee') {
            const sorted = parsed.sort((a: MarqueeItem, b: MarqueeItem) => (a.order || 0) - (b.order || 0))
            setMarqueeItems(sorted)
          } else if (item.section === 'stats') setStats(parsed)
          else if (item.section === 'advantages') setAdvantages(parsed)
          else if (item.section === 'testimonials') setTestimonials(parsed)
          else if (item.section === 'clients') setClients(parsed)
          else if (item.section === 'awards') setAwards(parsed)
          else if (item.section === 'faqs') setFaqs(parsed)
          else if (item.section === 'cta') setCta(prev => ({ ...prev, ...parsed }))
        } catch (e) { console.error('Parse error:', e) }
      })
    }
  }

  const fetchPersonil = async () => {
    const { data, error } = await supabase
      .from('personil')
      .select('*')
      .order('id', { ascending: true })
    if (!error && data) setPersonil(data as Personil[])
  }

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) setServices(data as Service[])
  }

  const fetchDetail = async (slug: string) => {
    if (!slug) return
    const { data, error } = await supabase
      .from('page_contents')
      .select('value')
      .eq('page', 'service_detail')
      .eq('section', slug)
      .eq('key', 'data')
      .maybeSingle()
    if (!error && data?.value) {
      try {
        const parsed = JSON.parse(data.value)
        setDetailContent(prev => ({ ...prev, ...parsed }))
      } catch (e) { console.error('Parse detail error:', e) }
    } else {
      setDetailContent(DEFAULT_DETAIL)
    }
  }

  const fetchAll = async () => {
    setLoading(true)
    await Promise.all([
      fetchPageContent(),
      fetchPersonil(),
      fetchServices()
    ])
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  useEffect(() => {
    if (activeSection === 'service_detail' && selectedSlug) {
      fetchDetail(selectedSlug)
    }
  }, [activeSection, selectedSlug])

  // ========== FUNGSI SAVE ==========

  const saveSection = async (section: string, data: any) => {
    const { error } = await supabase
      .from('page_contents')
      .upsert(
        { page: 'services', section, key: 'data', value: JSON.stringify(data) },
        { onConflict: 'page, section, key' }
      )
    if (error) throw error
  }

  // === Slideshow ===
  const saveSlides = async (slides: HeroSlide[]) => {
    setSavingSlides(true)
    try {
      await saveSection('hero_slides', slides)
      setMessage({ text: '✅ Slideshow berhasil disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal: ' + err.message, type: 'error' })
    } finally {
      setSavingSlides(false)
    }
  }

  const addSlide = (newSlide: HeroSlide) => {
    const updated = [...heroSlides, { ...newSlide, order: heroSlides.length }]
    setHeroSlides(updated)
    saveSlides(updated)
  }

  const updateSlide = (index: number, updatedSlide: HeroSlide) => {
    const updated = [...heroSlides]
    updated[index] = { ...updatedSlide, order: index }
    setHeroSlides(updated)
    saveSlides(updated)
  }

  const deleteSlide = (index: number) => {
    if (!confirm('Hapus slide ini?')) return
    const updated = heroSlides.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }))
    setHeroSlides(updated)
    saveSlides(updated)
  }

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === heroSlides.length - 1) return
    const newSlides = [...heroSlides]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]]
    newSlides.forEach((s, idx) => { s.order = idx })
    setHeroSlides(newSlides)
    saveSlides(newSlides)
  }

  // === Marquee ===
  const saveMarquee = async (items: MarqueeItem[]) => {
    setSavingMarquee(true)
    try {
      await saveSection('marquee', items)
      setMessage({ text: '✅ Marquee berhasil disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal: ' + err.message, type: 'error' })
    } finally {
      setSavingMarquee(false)
    }
  }

  const addMarqueeItem = (newItem: MarqueeItem) => {
    const updated = [...marqueeItems, { ...newItem, order: marqueeItems.length }]
    setMarqueeItems(updated)
    saveMarquee(updated)
  }

  const updateMarqueeItem = (index: number, updatedItem: MarqueeItem) => {
    const updated = [...marqueeItems]
    updated[index] = { ...updatedItem, order: index }
    setMarqueeItems(updated)
    saveMarquee(updated)
  }

  const deleteMarqueeItem = (index: number) => {
    if (!confirm('Hapus item marquee?')) return
    const updated = marqueeItems.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i }))
    setMarqueeItems(updated)
    saveMarquee(updated)
  }

  const moveMarqueeItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === marqueeItems.length - 1) return
    const newItems = [...marqueeItems]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    newItems.forEach((item, idx) => { item.order = idx })
    setMarqueeItems(newItems)
    saveMarquee(newItems)
  }

  // === Halaman Services (semua konten kecuali team) ===
  const saveAllPageContent = async () => {
    setSaving(true)
    try {
      await saveSection('stats', stats)
      await saveSection('advantages', advantages)
      await saveSection('testimonials', testimonials)
      await saveSection('clients', clients)
      await saveSection('awards', awards)
      await saveSection('faqs', faqs)
      await saveSection('cta', cta)
      setMessage({ text: '✅ Semua konten halaman services disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal: ' + err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // ========== CRUD PERSONIL ==========

  const openAddPersonilModal = () => {
    setEditingPersonil(null)
    setPersonilForm({
      nama: '',
      posisi: '',
      image: '',
      lulusan: '',
      tahun_lulus: new Date().getFullYear(),
      deskripsi: '',
      keahlian: ''
    })
    setShowPersonilModal(true)
  }

  const openEditPersonilModal = (p: Personil) => {
    setEditingPersonil(p)
    setPersonilForm({
      nama: p.nama,
      posisi: p.posisi,
      image: p.image || '',
      lulusan: p.lulusan || '',
      tahun_lulus: p.tahun_lulus || new Date().getFullYear(),
      deskripsi: p.deskripsi || '',
      keahlian: (p.keahlian || []).join(', ')
    })
    setShowPersonilModal(true)
  }

  const savePersonil = async () => {
    if (!personilForm.nama || !personilForm.posisi) {
      alert('Nama dan Posisi wajib diisi')
      return
    }
    setSavingPersonil(true)
    try {
      const keahlianArray = personilForm.keahlian.split(',').map(s => s.trim()).filter(s => s)
      const dataToSave = {
        nama: personilForm.nama,
        posisi: personilForm.posisi,
        image: personilForm.image || '',
        lulusan: personilForm.lulusan || '',
        tahun_lulus: personilForm.tahun_lulus || null,
        deskripsi: personilForm.deskripsi || '',
        keahlian: keahlianArray
      }
      let error
      if (editingPersonil) {
        const { error: e } = await supabase
          .from('personil')
          .update(dataToSave)
          .eq('id', editingPersonil.id)
        error = e
      } else {
        const { error: e } = await supabase
          .from('personil')
          .insert(dataToSave)
        error = e
      }
      if (error) throw error
      await fetchPersonil()
      setShowPersonilModal(false)
      setMessage({ text: editingPersonil ? '✅ Personil diupdate' : '✅ Personil ditambahkan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) {
      alert('Gagal: ' + err.message)
    } finally {
      setSavingPersonil(false)
    }
  }

  const deletePersonil = async (id: number) => {
    if (!confirm('Hapus personil ini?')) return
    const { error } = await supabase.from('personil').delete().eq('id', id)
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      await fetchPersonil()
      setMessage({ text: '✅ Personil dihapus', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    }
  }

  // ========== CRUD SERVICE (DAFTAR LAYANAN) ==========

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const openAddServiceModal = () => {
    setEditingService(null)
    setServiceForm(DEFAULT_SERVICE_FORM)
    setFeaturesInput('')
    setShowServiceModal(true)
  }

  const openEditServiceModal = (service: Service) => {
    setEditingService(service)
    setServiceForm({
      title: service.title,
      slug: service.slug,
      description: service.description || '',
      icon: service.icon || 'FiBriefcase',
      image_url: service.image_url || '',
      features: service.features || []
    })
    setFeaturesInput((service.features || []).join(', '))
    setShowServiceModal(true)
  }

  const saveService = async () => {
    const slug = serviceForm.slug || generateSlug(serviceForm.title)
    const featuresArray = featuresInput.split(',').map((f: string) => f.trim()).filter((f: string) => f)
    const dataToSave = {
      title: serviceForm.title,
      slug,
      description: serviceForm.description,
      icon: serviceForm.icon,
      image_url: serviceForm.image_url,
      features: featuresArray
    }

    let error: any
    if (editingService) {
      const { error: e } = await supabase
        .from('services')
        .update(dataToSave)
        .eq('id', editingService.id)
      error = e
    } else {
      const { error: e } = await supabase
        .from('services')
        .insert(dataToSave)
      error = e
    }

    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      await fetchServices()
      setShowServiceModal(false)
      setMessage({ text: editingService ? '✅ Layanan diupdate' : '✅ Layanan ditambahkan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    }
  }

  const deleteService = async (id: number) => {
    if (!confirm('Yakin hapus layanan ini?')) return
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      await fetchServices()
      setMessage({ text: '✅ Layanan dihapus', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    }
  }

  // ========== CRUD DETAIL LAYANAN ==========

  const saveDetail = async () => {
    if (!selectedSlug) return
    setSavingDetail(true)
    try {
      const valueString = JSON.stringify(detailContent)
      const { data: existing, error: checkError } = await supabase
        .from('page_contents')
        .select('id')
        .eq('page', 'service_detail')
        .eq('section', selectedSlug)
        .eq('key', 'data')
        .maybeSingle()

      if (checkError) throw checkError

      let result
      if (existing) {
        result = await supabase
          .from('page_contents')
          .update({ value: valueString, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        result = await supabase
          .from('page_contents')
          .insert({
            page: 'service_detail',
            section: selectedSlug,
            key: 'data',
            value: valueString,
            type: 'json',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
      }
      if (result.error) throw result.error
      setMessage({ text: '✅ Detail berhasil disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal: ' + err.message, type: 'error' })
    } finally {
      setSavingDetail(false)
    }
  }

  // Helper untuk detail
  const updateNested = (path: string, value: any) => {
    setDetailContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const parts = path.split('.')
      let current: any = newContent
      for (let i = 0; i < parts.length - 1; i++) current = current[parts[i]]
      current[parts[parts.length - 1]] = value
      return newContent
    })
  }

  const addArrayItem = (arrayPath: string, defaultItem: any) => {
    setDetailContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const parts = arrayPath.split('.')
      let current: any = newContent
      for (let i = 0; i < parts.length; i++) current = current[parts[i]]
      current.push(defaultItem)
      return newContent
    })
  }

  const removeArrayItem = (arrayPath: string, index: number) => {
    setDetailContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const parts = arrayPath.split('.')
      let current: any = newContent
      for (let i = 0; i < parts.length; i++) current = current[parts[i]]
      current.splice(index, 1)
      return newContent
    })
  }

  const updateArrayItem = (arrayPath: string, index: number, field: string, value: any) => {
    setDetailContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      const parts = arrayPath.split('.')
      let current: any = newContent
      for (let i = 0; i < parts.length; i++) current = current[parts[i]]
      if (field === '') current[index] = value
      else current[index][field] = value
      return newContent
    })
  }

  // Helper untuk array (stats, advantages, testimonials, awards, faqs)
  const addArrayItemPage = (setter: any, current: any[], defaultItem: any) => {
    setter([...current, defaultItem])
  }
  const removeArrayItemPage = (setter: any, current: any[], index: number) => {
    setter(current.filter((_, i) => i !== index))
  }
  const updateArrayItemPage = (setter: any, current: any[], index: number, field: string, value: any) => {
    const newArr = [...current]
    newArr[index] = { ...newArr[index], [field]: value }
    setter(newArr)
  }

  // ========== RENDER ==========

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500 mt-3">Memuat data...</p>
      </div>
    )
  }

  // ========== RENDER FUNGSI UNTUK SETIAP SECTION ==========

  const renderHeroSlides = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🎞️ Hero Slideshow</h2>
        <button
          onClick={() => {
            setEditingSlideIndex(null)
            setSlideForm({ image: '', badge: '', title: '', highlight: '', description: '', order: heroSlides.length })
            setShowSlideModal(true)
          }}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
        >
          <FiPlus /> Tambah Slide
        </button>
      </div>
      {savingSlides && <div className="text-xs text-blue-500 mb-2">Menyimpan...</div>}
      {heroSlides.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Belum ada slide.</p>
      ) : (
        <div className="space-y-3">
          {heroSlides.map((slide, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-bold">{slide.title} <span className="text-blue-600">({slide.highlight})</span></div>
                <div className="text-sm text-gray-500 truncate">{slide.description}</div>
                <div className="text-xs text-gray-400">Badge: {slide.badge}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => moveSlide(idx, 'up')} disabled={idx === 0} className="p-1 disabled:opacity-30"><FiArrowUp /></button>
                <button onClick={() => moveSlide(idx, 'down')} disabled={idx === heroSlides.length - 1} className="p-1 disabled:opacity-30"><FiArrowDown /></button>
                <button onClick={() => { setEditingSlideIndex(idx); setSlideForm(slide); setShowSlideModal(true) }} className="text-blue-600 p-1"><FiEdit /></button>
                <button onClick={() => deleteSlide(idx)} className="text-red-600 p-1"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderMarquee = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🔄 Service Marquee</h2>
        <button
          onClick={() => {
            setEditingMarqueeIndex(null)
            setMarqueeForm({ name: '', icon: 'FiCompass', order: marqueeItems.length })
            setShowMarqueeModal(true)
          }}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
        >
          <FiPlus /> Tambah Item
        </button>
      </div>
      {savingMarquee && <div className="text-xs text-blue-500 mb-2">Menyimpan...</div>}
      {marqueeItems.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Belum ada item marquee.</p>
      ) : (
        <div className="space-y-3">
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">Ikon: {item.icon}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => moveMarqueeItem(idx, 'up')} disabled={idx === 0} className="p-1 disabled:opacity-30"><FiArrowUp /></button>
                <button onClick={() => moveMarqueeItem(idx, 'down')} disabled={idx === marqueeItems.length - 1} className="p-1 disabled:opacity-30"><FiArrowDown /></button>
                <button onClick={() => { setEditingMarqueeIndex(idx); setMarqueeForm(item); setShowMarqueeModal(true) }} className="text-blue-600 p-1"><FiEdit /></button>
                <button onClick={() => deleteMarqueeItem(idx)} className="text-red-600 p-1"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderStats = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">📊 Statistik</h2>
      {stats.map((stat, idx) => (
        <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <input placeholder="Ikon" value={stat.icon || ''} onChange={e => updateArrayItemPage(setStats, stats, idx, 'icon', e.target.value)} className="border rounded p-2" />
            <input placeholder="Nilai" value={stat.value || ''} onChange={e => updateArrayItemPage(setStats, stats, idx, 'value', e.target.value)} className="border rounded p-2" />
            <input placeholder="Label" value={stat.label || ''} onChange={e => updateArrayItemPage(setStats, stats, idx, 'label', e.target.value)} className="border rounded p-2" />
            <input placeholder="Suffix" value={stat.suffix || ''} onChange={e => updateArrayItemPage(setStats, stats, idx, 'suffix', e.target.value)} className="border rounded p-2" />
          </div>
          <button onClick={() => removeArrayItemPage(setStats, stats, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
        </div>
      ))}
      <button onClick={() => addArrayItemPage(setStats, stats, { icon: 'FiBriefcase', value: '100', label: 'Contoh', suffix: '+' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Statistik</button>
    </div>
  )

  const renderAdvantages = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">⭐ Keunggulan</h2>
      {advantages.map((adv, idx) => (
        <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input placeholder="Judul" value={adv.title || ''} onChange={e => updateArrayItemPage(setAdvantages, advantages, idx, 'title', e.target.value)} className="border rounded p-2" />
            <input placeholder="Deskripsi" value={adv.desc || ''} onChange={e => updateArrayItemPage(setAdvantages, advantages, idx, 'desc', e.target.value)} className="border rounded p-2" />
            <input placeholder="Ikon" value={adv.icon || ''} onChange={e => updateArrayItemPage(setAdvantages, advantages, idx, 'icon', e.target.value)} className="border rounded p-2" />
          </div>
          <button onClick={() => removeArrayItemPage(setAdvantages, advantages, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
        </div>
      ))}
      <button onClick={() => addArrayItemPage(setAdvantages, advantages, { title: 'Keunggulan Baru', desc: 'Deskripsi', icon: 'FiAward' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Keunggulan</button>
    </div>
  )

  const renderServicesList = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🛠️ Daftar Layanan</h2>
        <button onClick={openAddServiceModal} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Layanan
        </button>
      </div>
      {services.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Belum ada layanan.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-2 text-left">Judul</th>
                <th className="p-2 text-left">Slug</th>
                <th className="p-2 text-left">Ikon</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service: Service) => (
                <tr key={service.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{service.title}</td>
                  <td className="p-2">{service.slug}</td>
                  <td className="p-2">{service.icon}</td>
                  <td className="p-2 text-center space-x-2">
                    <button onClick={() => openEditServiceModal(service)} className="text-blue-600"><FiEdit /></button>
                    <button onClick={() => deleteService(service.id)} className="text-red-600"><FiTrash2 /></button>
                    <button
                      onClick={() => {
                        setSelectedSlug(service.slug)
                        setActiveSection('service_detail')
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderServiceDetail = () => {
    if (!selectedSlug) {
      return <p className="text-gray-400 text-center py-8">Pilih layanan dari daftar untuk mengedit detail.</p>
    }

    const serviceTitle = services.find((s: Service) => s.slug === selectedSlug)?.title || selectedSlug

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">✏️ Detail Layanan: {serviceTitle}</h2>
          <button onClick={() => setActiveSection('services_list')} className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1">
            <FiChevronRight className="rotate-180" /> Kembali ke Daftar
          </button>
        </div>

        <div className="space-y-6">
          <DetailSection title="Hero Section">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Badge" value={detailContent.hero.badge || ''} onChange={(e) => updateNested('hero.badge', e.target.value)} className="border p-2 rounded" />
              <input placeholder="Title" value={detailContent.hero.title || ''} onChange={(e) => updateNested('hero.title', e.target.value)} className="border p-2 rounded" />
              <textarea placeholder="Subtitle" value={detailContent.hero.subtitle || ''} onChange={(e) => updateNested('hero.subtitle', e.target.value)} className="border p-2 rounded col-span-2" rows={2} />
              <input placeholder="Background Video URL" value={detailContent.hero.background_video || ''} onChange={(e) => updateNested('hero.background_video', e.target.value)} className="border p-2 rounded" />
              <div className="col-span-2">
                <ImageUpload bucket="service-images" path={`hero-${selectedSlug}`} value={detailContent.hero.background_image || ''} onChange={(url) => updateNested('hero.background_image', url)} label="Background Image" />
              </div>
              <input placeholder="Button Text" value={detailContent.hero.button_text || ''} onChange={(e) => updateNested('hero.button_text', e.target.value)} className="border p-2 rounded" />
              <input placeholder="Button Link" value={detailContent.hero.button_link || ''} onChange={(e) => updateNested('hero.button_link', e.target.value)} className="border p-2 rounded" />
              <input placeholder="Secondary Button Text" value={detailContent.hero.secondary_button_text || ''} onChange={(e) => updateNested('hero.secondary_button_text', e.target.value)} className="border p-2 rounded" />
              <input placeholder="Secondary Button Link" value={detailContent.hero.secondary_button_link || ''} onChange={(e) => updateNested('hero.secondary_button_link', e.target.value)} className="border p-2 rounded" />
            </div>
          </DetailSection>

          <DetailSection title="Statistik">
            {detailContent.stats.map((stat: DetailStatItem, idx: number) => (
              <div key={idx} className="border p-3 rounded mb-3 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <input value={stat.value || ''} onChange={(e) => updateArrayItem('stats', idx, 'value', Number(e.target.value))} placeholder="Nilai" className="border p-1 rounded" />
                  <input value={stat.label || ''} onChange={(e) => updateArrayItem('stats', idx, 'label', e.target.value)} placeholder="Label" className="border p-1 rounded" />
                  <input value={stat.suffix || ''} onChange={(e) => updateArrayItem('stats', idx, 'suffix', e.target.value)} placeholder="Suffix" className="border p-1 rounded" />
                  <input value={stat.icon || ''} onChange={(e) => updateArrayItem('stats', idx, 'icon', e.target.value)} placeholder="Icon" className="border p-1 rounded" />
                  <input value={stat.color || ''} onChange={(e) => updateArrayItem('stats', idx, 'color', e.target.value)} placeholder="Color class" className="border p-1 rounded" />
                </div>
                <button onClick={() => removeArrayItem('stats', idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('stats', { value: 0, label: '', suffix: '', icon: 'FiGlobe', color: 'from-blue-500 to-cyan-500' })} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah Stat</button>
          </DetailSection>

          <DetailSection title="Tentang Layanan">
            <input placeholder="Judul About" value={detailContent.about.title || ''} onChange={(e) => updateNested('about.title', e.target.value)} className="border p-2 rounded w-full mb-2" />
            <textarea placeholder="Deskripsi" value={detailContent.about.description || ''} onChange={(e) => updateNested('about.description', e.target.value)} className="border p-2 rounded w-full mb-2" rows={2} />
            <textarea placeholder="Deskripsi 2" value={detailContent.about.description2 || ''} onChange={(e) => updateNested('about.description2', e.target.value)} className="border p-2 rounded w-full mb-4" rows={2} />
            <h4 className="font-semibold mb-2">Features</h4>
            {detailContent.about.features.map((feat: FeatureItem, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input value={feat.icon || ''} onChange={(e) => updateArrayItem('about.features', idx, 'icon', e.target.value)} placeholder="Icon" className="border p-1 rounded w-24" />
                <input value={feat.label || ''} onChange={(e) => updateArrayItem('about.features', idx, 'label', e.target.value)} placeholder="Label" className="border p-1 rounded flex-1" />
                <input value={feat.desc || ''} onChange={(e) => updateArrayItem('about.features', idx, 'desc', e.target.value)} placeholder="Deskripsi" className="border p-1 rounded flex-1" />
                <button onClick={() => removeArrayItem('about.features', idx)} className="text-red-500">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('about.features', { icon: 'FiCompass', label: '', desc: '' })} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah Feature</button>
          </DetailSection>

          <DetailSection title="Manfaat (Benefits)">
            {detailContent.benefits.map((ben: BenefitItem, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input value={ben.text || ''} onChange={(e) => updateArrayItem('benefits', idx, 'text', e.target.value)} placeholder="Teks" className="border p-1 rounded flex-1" />
                <input value={ben.icon || ''} onChange={(e) => updateArrayItem('benefits', idx, 'icon', e.target.value)} placeholder="Icon" className="border p-1 rounded w-32" />
                <button onClick={() => removeArrayItem('benefits', idx)} className="text-red-500">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('benefits', { text: '', icon: 'FiUsers' })} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah Benefit</button>
          </DetailSection>

          <DetailSection title="Timeline Proses">
            {detailContent.timeline.map((item: TimelineItem, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input value={item.step || ''} onChange={(e) => updateArrayItem('timeline', idx, 'step', e.target.value)} placeholder="Step" className="border p-1 rounded w-32" />
                <input value={item.desc || ''} onChange={(e) => updateArrayItem('timeline', idx, 'desc', e.target.value)} placeholder="Deskripsi" className="border p-1 rounded flex-1" />
                <button onClick={() => removeArrayItem('timeline', idx)} className="text-red-500">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('timeline', { step: '', desc: '' })} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah Timeline</button>
          </DetailSection>

          <DetailSection title="Proyek Terkait">
            {detailContent.projects.map((proj: ProjectItem, idx: number) => (
              <div key={idx} className="border p-3 rounded mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input value={proj.title || ''} onChange={(e) => updateArrayItem('projects', idx, 'title', e.target.value)} placeholder="Judul" className="border p-1 rounded" />
                  <input value={proj.year || ''} onChange={(e) => updateArrayItem('projects', idx, 'year', e.target.value)} placeholder="Tahun" className="border p-1 rounded" />
                  <input value={proj.client || ''} onChange={(e) => updateArrayItem('projects', idx, 'client', e.target.value)} placeholder="Klien" className="border p-1 rounded" />
                  <div className="col-span-2">
                    <ImageUpload bucket="service-images" path={`projects-${selectedSlug}`} value={proj.image || ''} onChange={(url) => updateArrayItem('projects', idx, 'image', url)} label="Gambar Proyek" />
                  </div>
                </div>
                <button onClick={() => removeArrayItem('projects', idx)} className="text-red-500 text-sm mt-2">Hapus Proyek</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('projects', { title: '', year: '', client: '', image: '' })} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah Proyek</button>
          </DetailSection>

          <DetailSection title="Galeri">
            {detailContent.gallery.map((url: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <ImageUpload bucket="service-images" path={`gallery-${selectedSlug}`} value={url || ''} onChange={(newUrl) => updateArrayItem('gallery', idx, '', newUrl)} label={`Gambar ${idx + 1}`} />
                <button onClick={() => removeArrayItem('gallery', idx)} className="text-red-500">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('gallery', '')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah Gambar</button>
          </DetailSection>

          <DetailSection title="Tim Ahli (Detail)">
            {detailContent.team.map((member: DetailTeamMember, idx: number) => (
              <div key={idx} className="border p-3 rounded mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input value={member.name || ''} onChange={(e) => updateArrayItem('team', idx, 'name', e.target.value)} placeholder="Nama" className="border p-1 rounded" />
                  <input value={member.role || ''} onChange={(e) => updateArrayItem('team', idx, 'role', e.target.value)} placeholder="Jabatan" className="border p-1 rounded" />
                  <div className="col-span-2">
                    <ImageUpload bucket="service-images" path={`team-${selectedSlug}`} value={member.image || ''} onChange={(url) => updateArrayItem('team', idx, 'image', url)} label="Foto Profil" />
                  </div>
                  <input value={member.expertise || ''} onChange={(e) => updateArrayItem('team', idx, 'expertise', e.target.value)} placeholder="Keahlian" className="border p-1 rounded col-span-2" />
                </div>
                <button onClick={() => removeArrayItem('team', idx)} className="text-red-500 text-sm mt-2">Hapus Anggota</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('team', { name: '', role: '', image: '', expertise: '' })} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah Anggota</button>
          </DetailSection>

          <DetailSection title="Testimonial">
            {detailContent.testimonials.map((test: DetailTestimonial, idx: number) => (
              <div key={idx} className="border p-3 rounded mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input value={test.name || ''} onChange={(e) => updateArrayItem('testimonials', idx, 'name', e.target.value)} placeholder="Nama" className="border p-1 rounded" />
                  <input value={test.role || ''} onChange={(e) => updateArrayItem('testimonials', idx, 'role', e.target.value)} placeholder="Peran" className="border p-1 rounded" />
                  <textarea value={test.text || ''} onChange={(e) => updateArrayItem('testimonials', idx, 'text', e.target.value)} placeholder="Testimonial" className="border p-1 rounded col-span-2" rows={2} />
                  <input value={test.rating || 5} onChange={(e) => updateArrayItem('testimonials', idx, 'rating', Number(e.target.value))} placeholder="Rating" className="border p-1 rounded" />
                  <div className="col-span-2">
                    <ImageUpload bucket="service-images" path={`testimonials-${selectedSlug}`} value={test.avatar || ''} onChange={(url) => updateArrayItem('testimonials', idx, 'avatar', url)} label="Avatar" />
                  </div>
                </div>
                <button onClick={() => removeArrayItem('testimonials', idx)} className="text-red-500 text-sm mt-2">Hapus Testimonial</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('testimonials', { name: '', role: '', text: '', rating: 5, avatar: '' })} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah Testimonial</button>
          </DetailSection>

          <DetailSection title="FAQ">
            {detailContent.faqs.map((faq: DetailFaq, idx: number) => (
              <div key={idx} className="border p-3 rounded mb-3">
                <input value={faq.q || ''} onChange={(e) => updateArrayItem('faqs', idx, 'q', e.target.value)} placeholder="Pertanyaan" className="border p-1 rounded w-full mb-1" />
                <textarea value={faq.a || ''} onChange={(e) => updateArrayItem('faqs', idx, 'a', e.target.value)} placeholder="Jawaban" className="border p-1 rounded w-full" rows={2} />
                <button onClick={() => removeArrayItem('faqs', idx)} className="text-red-500 text-sm mt-2">Hapus FAQ</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('faqs', { q: '', a: '' })} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah FAQ</button>
          </DetailSection>

          <DetailSection title="Klien (Logo)">
            {detailContent.clients.map((logo: string, idx: number) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <ImageUpload bucket="service-images" path={`clients-${selectedSlug}`} value={logo || ''} onChange={(newUrl) => updateArrayItem('clients', idx, '', newUrl)} label={`Logo ${idx + 1}`} />
                <button onClick={() => removeArrayItem('clients', idx)} className="text-red-500">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem('clients', '')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Tambah Logo Klien</button>
          </DetailSection>

          <button onClick={saveDetail} disabled={savingDetail} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
            <FiSave /> {savingDetail ? 'Menyimpan...' : 'Simpan Detail Layanan'}
          </button>
        </div>
      </div>
    )
  }

  const renderTestimonials = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">💬 Testimonial</h2>
      {testimonials.map((test, idx) => (
        <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input placeholder="Nama" value={test.name || ''} onChange={e => updateArrayItemPage(setTestimonials, testimonials, idx, 'name', e.target.value)} className="border rounded p-2" />
            <input placeholder="Role" value={test.role || ''} onChange={e => updateArrayItemPage(setTestimonials, testimonials, idx, 'role', e.target.value)} className="border rounded p-2" />
            <textarea placeholder="Testimonial" value={test.text || ''} onChange={e => updateArrayItemPage(setTestimonials, testimonials, idx, 'text', e.target.value)} rows={2} className="border rounded p-2 col-span-2" />
            <input placeholder="Rating (1-5)" type="number" value={test.rating || 5} onChange={e => updateArrayItemPage(setTestimonials, testimonials, idx, 'rating', parseInt(e.target.value))} className="border rounded p-2" />
            <div className="col-span-2">
              <ImageUpload bucket="service-images" path="testimonial-avatars" value={test.avatar || ''} onChange={(url) => updateArrayItemPage(setTestimonials, testimonials, idx, 'avatar', url)} label="Avatar" />
            </div>
          </div>
          <button onClick={() => removeArrayItemPage(setTestimonials, testimonials, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
        </div>
      ))}
      <button onClick={() => addArrayItemPage(setTestimonials, testimonials, { name: '', role: '', text: '', rating: 5, avatar: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Testimonial</button>
    </div>
  )

  const renderClients = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🏢 Klien (Logo)</h2>
      {clients.map((logo, idx) => (
        <div key={idx} className="flex gap-2 mb-2 items-center">
          <ImageUpload bucket="service-images" path="client-logos" value={logo || ''} onChange={(newUrl) => { const updated = [...clients]; updated[idx] = newUrl; setClients(updated) }} label={`Logo ${idx+1}`} />
          <button onClick={() => { const updated = clients.filter((_, i) => i !== idx); setClients(updated) }} className="text-red-500"><FiTrash2 /></button>
        </div>
      ))}
      <button onClick={() => setClients([...clients, ''])} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Logo</button>
    </div>
  )

  const renderTeam = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">👥 Tim Ahli (dari tabel Personil)</h2>
        <button onClick={openAddPersonilModal} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Personil
        </button>
      </div>
      {personil.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Belum ada personil.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personil.map((p) => (
            <div key={p.id} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                {p.image ? (
                  <img src={p.image} alt={p.nama} className="w-14 h-14 rounded-full object-cover border-2 border-blue-100" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><FiUser size={24} /></div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800">{p.nama}</div>
                  <div className="text-xs text-indigo-600 font-medium">{p.posisi}</div>
                  {p.lulusan && <div className="text-xs text-gray-500">🎓 {p.lulusan}{p.tahun_lulus ? ` (${p.tahun_lulus})` : ''}</div>}
                  {p.keahlian && p.keahlian.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1 line-clamp-1">{p.keahlian.join(', ')}</div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEditPersonilModal(p)} className="text-blue-500 hover:text-blue-700"><FiEdit size={14} /></button>
                  <button onClick={() => deletePersonil(p.id)} className="text-red-500 hover:text-red-700"><FiTrash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderAwards = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🏆 Penghargaan</h2>
      {awards.map((award, idx) => (
        <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input placeholder="Judul" value={award.title || ''} onChange={e => updateArrayItemPage(setAwards, awards, idx, 'title', e.target.value)} className="border rounded p-2" />
            <input placeholder="Tahun" value={award.year || ''} onChange={e => updateArrayItemPage(setAwards, awards, idx, 'year', e.target.value)} className="border rounded p-2" />
            <input placeholder="Penerbit" value={award.issuer || ''} onChange={e => updateArrayItemPage(setAwards, awards, idx, 'issuer', e.target.value)} className="border rounded p-2" />
            <input placeholder="Ikon" value={award.icon || ''} onChange={e => updateArrayItemPage(setAwards, awards, idx, 'icon', e.target.value)} className="border rounded p-2" />
          </div>
          <button onClick={() => removeArrayItemPage(setAwards, awards, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
        </div>
      ))}
      <button onClick={() => addArrayItemPage(setAwards, awards, { title: '', year: '', issuer: '', icon: 'FiAward' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Penghargaan</button>
    </div>
  )

  const renderFaqs = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">❓ FAQ</h2>
      {faqs.map((faq, idx) => (
        <div key={idx} className="border p-3 rounded mb-3 bg-gray-50">
          <input placeholder="Pertanyaan" value={faq.q || ''} onChange={e => updateArrayItemPage(setFaqs, faqs, idx, 'q', e.target.value)} className="border rounded p-2 w-full mb-1" />
          <textarea placeholder="Jawaban" value={faq.a || ''} onChange={e => updateArrayItemPage(setFaqs, faqs, idx, 'a', e.target.value)} rows={2} className="border rounded p-2 w-full" />
          <button onClick={() => removeArrayItemPage(setFaqs, faqs, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
        </div>
      ))}
      <button onClick={() => addArrayItemPage(setFaqs, faqs, { q: '', a: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah FAQ</button>
    </div>
  )

  const renderCta = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🎯 CTA Section</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2"><label>Title</label><input type="text" value={cta.title || ''} onChange={e => setCta({...cta, title: e.target.value})} className="w-full border rounded-lg p-2" /></div>
        <div className="col-span-2"><label>Deskripsi</label><textarea value={cta.description || ''} onChange={e => setCta({...cta, description: e.target.value})} rows={2} className="w-full border rounded-lg p-2" /></div>
        <div><label>Tombol Teks</label><input type="text" value={cta.button_text || ''} onChange={e => setCta({...cta, button_text: e.target.value})} className="w-full border rounded-lg p-2" /></div>
        <div><label>Tombol Link</label><input type="text" value={cta.button_link || ''} onChange={e => setCta({...cta, button_link: e.target.value})} className="w-full border rounded-lg p-2" /></div>
        <div className="col-span-2">
          <ImageUpload bucket="service-images" path="cta" value={cta.background_image || ''} onChange={(url) => setCta({...cta, background_image: url})} label="Background Image" />
        </div>
        <div><label>Background Color</label><input type="color" value={cta.background_color || '#1e3a8a'} onChange={e => setCta({...cta, background_color: e.target.value})} className="w-full h-10 border rounded-lg p-1" /></div>
        <div><label>Text Color</label><input type="color" value={cta.text_color || '#ffffff'} onChange={e => setCta({...cta, text_color: e.target.value})} className="w-full h-10 border rounded-lg p-1" /></div>
      </div>
      <button onClick={saveAllPageContent} disabled={saving} className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
        <FiSave /> {saving ? 'Menyimpan...' : 'Simpan Semua Konten Halaman Services (kecuali slideshow & marquee)'}
      </button>
    </div>
  )

  // ========== MAIN RENDER ==========
  return (
    <div className="flex gap-6">
      <AdminSectionNav
        items={NAV_ITEMS}
        activeKey={activeSection}
        onSelect={(key) => setActiveSection(key)}
      />

      <div className="flex-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Kelola Services</h2>
          <button onClick={fetchAll} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition text-sm">
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {activeSection === 'hero_slides' && renderHeroSlides()}
        {activeSection === 'marquee' && renderMarquee()}
        {activeSection === 'stats' && renderStats()}
        {activeSection === 'advantages' && renderAdvantages()}
        {activeSection === 'services_list' && renderServicesList()}
        {activeSection === 'service_detail' && renderServiceDetail()}
        {activeSection === 'testimonials' && renderTestimonials()}
        {activeSection === 'clients' && renderClients()}
        {activeSection === 'team' && renderTeam()}
        {activeSection === 'awards' && renderAwards()}
        {activeSection === 'faqs' && renderFaqs()}
        {activeSection === 'cta' && renderCta()}
      </div>

      {/* MODAL SLIDE */}
      {showSlideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingSlideIndex !== null ? 'Edit Slide' : 'Tambah Slide'}</h3>
              <button onClick={() => setShowSlideModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <ImageUpload bucket="service-images" path="hero-slides" value={slideForm.image} onChange={(url) => setSlideForm({...slideForm, image: url})} label="Gambar Slide" />
              <input placeholder="Badge" value={slideForm.badge} onChange={(e) => setSlideForm({...slideForm, badge: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Title" value={slideForm.title} onChange={(e) => setSlideForm({...slideForm, title: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Highlight" value={slideForm.highlight} onChange={(e) => setSlideForm({...slideForm, highlight: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Description" value={slideForm.description} onChange={(e) => setSlideForm({...slideForm, description: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <button onClick={() => {
                if (!slideForm.image || !slideForm.title) { alert('Image dan Title wajib diisi'); return }
                if (editingSlideIndex !== null) updateSlide(editingSlideIndex, slideForm)
                else addSlide(slideForm)
                setShowSlideModal(false)
              }} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MARQUEE */}
      {showMarqueeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingMarqueeIndex !== null ? 'Edit Marquee' : 'Tambah Marquee'}</h3>
              <button onClick={() => setShowMarqueeModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Nama Layanan" value={marqueeForm.name} onChange={(e) => setMarqueeForm({...marqueeForm, name: e.target.value})} className="w-full border rounded p-2" />
              <div>
                <label className="block text-sm font-medium mb-1">Ikon</label>
                <select value={marqueeForm.icon} onChange={(e) => setMarqueeForm({...marqueeForm, icon: e.target.value})} className="w-full border rounded p-2">
                  {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <button onClick={() => {
                if (!marqueeForm.name) { alert('Nama wajib diisi'); return }
                if (editingMarqueeIndex !== null) updateMarqueeItem(editingMarqueeIndex, marqueeForm)
                else addMarqueeItem(marqueeForm)
                setShowMarqueeModal(false)
              }} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PERSONIL */}
      {showPersonilModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingPersonil ? '✏️ Edit Personil' : '➕ Tambah Personil'}</h3>
              <button onClick={() => setShowPersonilModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-gray-700">Nama *</label><input placeholder="Nama lengkap" value={personilForm.nama} onChange={(e) => setPersonilForm({...personilForm, nama: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Posisi *</label><input placeholder="Jabatan / Role" value={personilForm.posisi} onChange={(e) => setPersonilForm({...personilForm, posisi: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Universitas / Lulusan</label><input placeholder="Contoh: ITB, UGM" value={personilForm.lulusan} onChange={(e) => setPersonilForm({...personilForm, lulusan: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Tahun Lulus</label><input type="number" placeholder="Tahun" value={personilForm.tahun_lulus} onChange={(e) => setPersonilForm({...personilForm, tahun_lulus: parseInt(e.target.value) || 0})} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Deskripsi</label><textarea placeholder="Deskripsi singkat" value={personilForm.deskripsi} onChange={(e) => setPersonilForm({...personilForm, deskripsi: e.target.value})} rows={2} className="w-full border rounded p-2" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Keahlian (pisahkan koma)</label><input placeholder="Contoh: GIS, AMDAL" value={personilForm.keahlian} onChange={(e) => setPersonilForm({...personilForm, keahlian: e.target.value})} className="w-full border rounded p-2" /></div>
              <div><ImageUpload bucket="service-images" path="personil" value={personilForm.image} onChange={(url) => setPersonilForm({...personilForm, image: url})} label="Foto Profil" /></div>
              <button onClick={savePersonil} disabled={savingPersonil} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transition disabled:opacity-50">
                {savingPersonil ? 'Menyimpan...' : '💾 Simpan Personil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SERVICE */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingService ? 'Edit Layanan' : 'Tambah Layanan'}</h3>
              <button onClick={() => setShowServiceModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Judul *" value={serviceForm.title} onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Slug (kosongkan otomatis)" value={serviceForm.slug} onChange={(e) => setServiceForm({...serviceForm, slug: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Deskripsi" value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <div><label className="block text-sm font-medium mb-1">Ikon</label><select value={serviceForm.icon} onChange={(e) => setServiceForm({...serviceForm, icon: e.target.value})} className="w-full border rounded p-2">{ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}</select></div>
              <ImageUpload bucket="service-images" path="services-list" value={serviceForm.image_url} onChange={(url) => setServiceForm({...serviceForm, image_url: url})} label="Gambar Layanan" />
              <input placeholder="Fitur (pisahkan koma)" value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} className="w-full border rounded p-2" />
              <button onClick={saveService} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Layanan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== DetailSection Component ==========
function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow border">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      {children}
    </div>
  )
}