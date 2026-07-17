// src/app/admin/innovation/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminSectionNav from '@/components/admin/AdminSectionNav'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  FiPlus, FiEdit, FiTrash2, FiX, FiArrowUp, FiArrowDown, FiSave,
  FiRefreshCw, FiLoader, FiChevronRight
} from 'react-icons/fi'

// ========== TYPE DEFINITIONS ==========

// Hero Slideshow
interface HeroSlide {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
  order: number
}

interface Partner {
  name: string
  logo: string
}

interface WorkflowStep {
  title: string
  desc: string
  icon: string
}

interface WorkflowStat {
  label: string
  value: string
  icon: string
  gradient: string
}

interface WorkflowContent {
  title: string
  subtitle: string
  mobile_video: string
  mobile_image: string
  monitor_video: string
  monitor_image: string
  steps: WorkflowStep[]
  stats: WorkflowStat[]
}

interface MobileFeature {
  title: string
  desc: string
}

interface MobileContent {
  title: string
  subtitle: string
  video: string
  image: string
  features: MobileFeature[]
}

interface DigitalFeature {
  title: string
  desc: string
}

interface DigitalContent {
  title: string
  subtitle: string
  video: string
  image: string
  features: DigitalFeature[]
}

interface StatItem {
  icon: string
  value: string
  label: string
  suffix: string
  gradient: string
}

interface GalleryImage {
  url: string
  title?: string
}

interface Testimonial {
  name: string
  role: string
  text: string
  avatar: string
  rating: number
}

interface FeatureItem {
  title: string
  desc: string
  icon: string
  gradient: string
}

interface CtaContent {
  title: string
  description: string
  button_text: string
  button_link: string
}

interface Message {
  text: string
  type: 'success' | 'error' | ''
}

// ========== CONSTANTS ==========

const NAV_ITEMS = [
  { key: 'hero_slides', label: '🎞️ Hero Slideshow' },
  { key: 'partners', label: '🤝 Partner Marquee' },
  { key: 'workflow', label: '🔄 Workflow' },
  { key: 'mobile_section', label: '📱 Mobile-first' },
  { key: 'digital_section', label: '📋 Digitalisasi' },
  { key: 'stats', label: '📊 Statistik' },
  { key: 'gallery', label: '🖼️ Galeri' },
  { key: 'testimonials', label: '💬 Testimonial' },
  { key: 'features', label: '✨ Fitur' },
  { key: 'cta', label: '🎯 CTA' },
]

const DEFAULT_STATS: StatItem[] = [
  { icon: 'FiBriefcase', value: '500', label: 'Proyek Berhasil', suffix: '+', gradient: 'from-blue-500 to-cyan-500' },
  { icon: 'FiUsers', value: '2500', label: 'Pengguna Aktif', suffix: '+', gradient: 'from-purple-500 to-indigo-500' },
  { icon: 'FiGlobe', value: '34', label: 'Provinsi', suffix: '+', gradient: 'from-emerald-500 to-teal-500' },
  { icon: 'FiBarChart2', value: '99.9', label: 'Uptime', suffix: '%', gradient: 'from-amber-500 to-orange-500' }
]

const DEFAULT_WORKFLOW: WorkflowContent = {
  title: 'Dari Lapangan ke Dashboard',
  subtitle: 'Inspektur upload kegiatan harian (foto, video, PDF) → Data langsung tampil di web dalam hitungan detik',
  mobile_video: '',
  mobile_image: '',
  monitor_video: '',
  monitor_image: '',
  steps: [
    { title: 'Upload di Lapangan', desc: 'Foto progres, isi form harian, lampirkan dokumen. Bisa offline.', icon: 'FiUploadCloud' },
    { title: 'Sinkronisasi Real-time', desc: 'Data terkirim ke cloud terenkripsi dalam <2 detik, notifikasi ke manajer.', icon: 'FiCloud' },
    { title: 'Monitoring Dashboard', desc: 'Manajer lihat data & analitik langsung, generate laporan, pantau KPI.', icon: 'FiEye' }
  ],
  stats: [
    { label: 'Kecepatan Sinkron', value: '< 2 detik', icon: 'FiZap', gradient: 'from-yellow-500 to-amber-500' },
    { label: 'Data Terproses', value: '2.5M+', icon: 'FiDatabase', gradient: 'from-green-500 to-emerald-500' },
    { label: 'Efisiensi Waktu', value: '+67%', icon: 'FiTrendingUp', gradient: 'from-purple-500 to-indigo-500' }
  ]
}

const DEFAULT_MOBILE: MobileContent = {
  title: 'Monitoring Proyek dari Genggaman Tangan',
  subtitle: 'Aplikasi mobile untuk inspektur lapangan: upload kegiatan harian, foto progres, dan dokumen pendukung',
  video: '',
  image: '',
  features: [
    { title: 'Real-time messaging & notifikasi', desc: 'Inspektur kirim laporan dengan foto/video, manajer terima notifikasi instan.' },
    { title: 'Tasks, punch lists, inspeksi', desc: 'Buat daftar periksa, catat ketidaksesuaian, lampirkan bukti.' },
    { title: 'Scheduling & laporan otomatis', desc: 'Generate PDF report custom, bagikan ke stakeholder.' }
  ]
}

const DEFAULT_DIGITAL: DigitalContent = {
  title: 'Real work, not paperwork',
  subtitle: 'Semua formulir harian, timesheet, RFI digital. Data langsung masuk sistem.',
  video: '',
  image: '',
  features: [
    { title: 'Mobile plan viewing & markup', desc: 'Lihat gambar teknis di HP, tambah catatan, upload as-built.' },
    { title: 'Markups & as-builts offline', desc: 'Rekam perubahan meski offline, sinkron otomatis saat online.' },
    { title: 'Digitized forms', desc: 'Daily report, timesheet, RFI digital, hemat waktu dan kurangi error.' }
  ]
}

const DEFAULT_CTA: CtaContent = {
  title: 'Siap Transformasi Digital Proyek Anda?',
  description: 'Inspektur lapangan upload kegiatan, manajer pantau real-time.',
  button_text: 'Konsultasi Gratis',
  button_link: '/contact'
}

// ========== MAIN COMPONENT ==========
export default function AdminInnovationPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState<string>('hero_slides')

  // Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [savingSlide, setSavingSlide] = useState(false)
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [slideForm, setSlideForm] = useState<HeroSlide>({
    image: '', badge: '', title: '', highlight: '', description: '', order: 0
  })

  // Partners
  const [marqueeItems, setMarqueeItems] = useState<Partner[]>([])
  const [savingMarquee, setSavingMarquee] = useState(false)
  const [showMarqueeModal, setShowMarqueeModal] = useState(false)
  const [editingMarqueeIndex, setEditingMarqueeIndex] = useState<number | null>(null)
  const [marqueeForm, setMarqueeForm] = useState<Partner>({ name: '', logo: '' })

  // Workflow
  const [workflow, setWorkflow] = useState<WorkflowContent>(DEFAULT_WORKFLOW)

  // Mobile
  const [mobile, setMobile] = useState<MobileContent>(DEFAULT_MOBILE)

  // Digital
  const [digital, setDigital] = useState<DigitalContent>(DEFAULT_DIGITAL)

  // Stats
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS)

  // Gallery
  const [gallery, setGallery] = useState<GalleryImage[]>([])

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  // Features
  const [features, setFeatures] = useState<FeatureItem[]>([])

  // CTA
  const [cta, setCta] = useState<CtaContent>(DEFAULT_CTA)

  // ========== HELPER ==========
  const addArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], defaultItem: T) => setter([...current, defaultItem])
  const removeArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], index: number) => setter(current.filter((_, i) => i !== index))
  const updateArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], index: number, field: keyof T, value: any) => {
    const newArr = [...current]
    newArr[index][field] = value
    setter(newArr)
  }

  // ========== FUNGSI FETCH ==========
  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'innovation')
        .eq('key', 'data')

      if (error) throw error

      if (data) {
        data.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            if (item.section === 'hero_slides') {
              const sorted = parsed.sort((a: HeroSlide, b: HeroSlide) => (a.order || 0) - (b.order || 0))
              setHeroSlides(sorted)
            } else if (item.section === 'partners') setMarqueeItems(parsed)
            else if (item.section === 'workflow') setWorkflow(parsed)
            else if (item.section === 'mobile_section') setMobile(parsed)
            else if (item.section === 'digital_section') setDigital(parsed)
            else if (item.section === 'stats') setStats(parsed)
            else if (item.section === 'gallery') setGallery(parsed)
            else if (item.section === 'testimonials') setTestimonials(parsed)
            else if (item.section === 'features') setFeatures(parsed)
            else if (item.section === 'cta') setCta(parsed)
          } catch (e) { console.error('Parse error', e) }
        })
      }

      // Default fallback
      if (heroSlides.length === 0) {
        const defaultSlides: HeroSlide[] = [
          {
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop',
            badge: 'INOVASI LPPSLH',
            title: 'Platform Manajemen',
            highlight: 'Proyek Terpadu',
            description: 'Hubungkan tim lapangan dan kantor dalam satu ekosistem digital.',
            order: 0
          },
          {
            image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=1920&h=1080&fit=crop',
            badge: 'REAL-TIME COLLABORATION',
            title: 'Kerja Tim',
            highlight: 'Lebih Efektif',
            description: 'Komunikasi instan, notifikasi push, dan berbagi dokumen langsung dari lokasi proyek.',
            order: 1
          },
          {
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop',
            badge: 'DATA-DRIVEN',
            title: 'Insight &',
            highlight: 'Analitik Cerdas',
            description: 'Dashboard interaktif untuk pengambilan keputusan strategis.',
            order: 2
          }
        ]
        setHeroSlides(defaultSlides)
        await saveSection('hero_slides', defaultSlides)
      }

      // Default untuk gallery, testimonials, features
      if (gallery.length === 0) setGallery([])
      if (testimonials.length === 0) setTestimonials([])
      if (features.length === 0) setFeatures([])

    } catch (err: any) {
      setMessage({ text: 'Gagal memuat data: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const saveSection = async (section: string, data: any) => {
    const { error } = await supabase
      .from('page_contents')
      .upsert(
        { page: 'innovation', section, key: 'data', value: JSON.stringify(data) },
        { onConflict: 'page, section, key' }
      )
    if (error) throw error
  }

  // ========== AUTO-SAVE SLIDESHOW ==========
  const saveHeroSlidesToDb = async (slides: HeroSlide[]) => {
    setSavingSlide(true)
    try {
      await saveSection('hero_slides', slides)
      setMessage({ text: '✅ Slide berhasil disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) {
      setMessage({ text: `❌ Gagal simpan slide: ${err.message}`, type: 'error' })
    } finally { setSavingSlide(false) }
  }

  const addSlide = (s: HeroSlide) => {
    const updated = [...heroSlides, { ...s, order: heroSlides.length }]
    setHeroSlides(updated)
    saveHeroSlidesToDb(updated)
  }

  const updateSlide = (i: number, s: HeroSlide) => {
    const updated = [...heroSlides]
    updated[i] = { ...s, order: i }
    setHeroSlides(updated)
    saveHeroSlidesToDb(updated)
  }

  const deleteSlide = (i: number) => {
    if (!confirm('Hapus slide ini?')) return
    const updated = heroSlides.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, order: idx }))
    setHeroSlides(updated)
    saveHeroSlidesToDb(updated)
  }

  const moveSlide = (i: number, dir: 'up' | 'down') => {
    if (dir === 'up' && i === 0) return
    if (dir === 'down' && i === heroSlides.length - 1) return
    const newSlides = [...heroSlides]
    const newIndex = dir === 'up' ? i - 1 : i + 1
    ;[newSlides[i], newSlides[newIndex]] = [newSlides[newIndex], newSlides[i]]
    newSlides.forEach((s, idx) => { s.order = idx })
    setHeroSlides(newSlides)
    saveHeroSlidesToDb(newSlides)
  }

  // ========== AUTO-SAVE MARQUEE ==========
  const saveMarqueeToDb = async (items: Partner[]) => {
    setSavingMarquee(true)
    try {
      await saveSection('partners', items)
      setMessage({ text: '✅ Marquee mitra berhasil disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) {
      setMessage({ text: `❌ Gagal simpan marquee: ${err.message}`, type: 'error' })
    } finally { setSavingMarquee(false) }
  }

  const addMarqueeItem = (item: Partner) => {
    const updated = [...marqueeItems, item]
    setMarqueeItems(updated)
    saveMarqueeToDb(updated)
  }

  const updateMarqueeItem = (i: number, item: Partner) => {
    const updated = [...marqueeItems]
    updated[i] = item
    setMarqueeItems(updated)
    saveMarqueeToDb(updated)
  }

  const deleteMarqueeItem = (i: number) => {
    if (!confirm('Hapus item marquee ini?')) return
    const updated = marqueeItems.filter((_, idx) => idx !== i)
    setMarqueeItems(updated)
    saveMarqueeToDb(updated)
  }

  // ========== HANDLE SAVE ALL ==========
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await saveSection('workflow', workflow)
      await saveSection('mobile_section', mobile)
      await saveSection('digital_section', digital)
      await saveSection('stats', stats)
      await saveSection('gallery', gallery)
      await saveSection('testimonials', testimonials)
      await saveSection('features', features)
      await saveSection('cta', cta)
      setMessage({ text: '✅ Semua konten berhasil disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal menyimpan: ' + err.message, type: 'error' })
    } finally { setSaving(false) }
  }

  // ========== RENDER SECTION ==========
  const renderSection = () => {
    switch (activeSection) {
      case 'hero_slides': return renderHeroSlides()
      case 'partners': return renderMarquee()
      case 'workflow': return renderWorkflow()
      case 'mobile_section': return renderMobile()
      case 'digital_section': return renderDigital()
      case 'stats': return renderStats()
      case 'gallery': return renderGallery()
      case 'testimonials': return renderTestimonials()
      case 'features': return renderFeatures()
      case 'cta': return renderCta()
      default: return <p>Pilih section di sidebar</p>
    }
  }

  // ========== RENDER FUNCTIONS ==========

  const renderHeroSlides = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🎞️ Hero Slideshow (Auto-Save)</h2>
        <button onClick={() => { setEditingSlideIndex(null); setSlideForm({ image: '', badge: '', title: '', highlight: '', description: '', order: heroSlides.length }); setShowSlideModal(true) }} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Slide
        </button>
      </div>
      {savingSlide && <div className="text-xs text-blue-500 mb-2">Menyimpan slide...</div>}
      {heroSlides.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Belum ada slide.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
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
        <h2 className="text-2xl font-semibold">🤝 Partner Marquee (Auto-Save)</h2>
        <button onClick={() => { setEditingMarqueeIndex(null); setMarqueeForm({ name: '', logo: '' }); setShowMarqueeModal(true) }} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Item
        </button>
      </div>
      {savingMarquee && <div className="text-xs text-blue-500 mb-2">Menyimpan marquee...</div>}
      {marqueeItems.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Belum ada item marquee.</p>
      ) : (
        <div className="space-y-3">
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={item.logo} alt={item.name} className="h-8 w-auto object-contain" />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingMarqueeIndex(idx); setMarqueeForm(item); setShowMarqueeModal(true) }} className="text-blue-600 p-1"><FiEdit /></button>
                <button onClick={() => deleteMarqueeItem(idx)} className="text-red-600 p-1"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderWorkflow = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🔄 Workflow</h2>
        <button onClick={() => {
          setWorkflow({
            ...workflow,
            steps: [...workflow.steps, { title: '', desc: '', icon: '' }]
          })
        }} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Step
        </button>
      </div>
      <div className="space-y-4 bg-white p-4 rounded-xl border">
        <div><label className="block font-medium">Judul</label><input type="text" value={workflow.title} onChange={e => setWorkflow({...workflow, title: e.target.value})} className="w-full border rounded p-2" /></div>
        <div><label className="block font-medium">Subtitle</label><textarea value={workflow.subtitle} onChange={e => setWorkflow({...workflow, subtitle: e.target.value})} rows={2} className="w-full border rounded p-2" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block font-medium">Mobile Video URL</label><input type="text" value={workflow.mobile_video} onChange={e => setWorkflow({...workflow, mobile_video: e.target.value})} className="w-full border rounded p-2" placeholder="URL video .mp4" />
            <ImageUpload bucket="service-images" path="innovation/workflow" value={workflow.mobile_image} onChange={url => setWorkflow({...workflow, mobile_image: url})} label="Mobile Image (fallback)" /></div>
          <div><label className="block font-medium">Monitor Video URL</label><input type="text" value={workflow.monitor_video} onChange={e => setWorkflow({...workflow, monitor_video: e.target.value})} className="w-full border rounded p-2" placeholder="URL video .mp4" />
            <ImageUpload bucket="service-images" path="innovation/workflow" value={workflow.monitor_image} onChange={url => setWorkflow({...workflow, monitor_image: url})} label="Monitor Image (fallback)" /></div>
        </div>
        <div>
          <h3 className="font-bold">Steps</h3>
          {workflow.steps.map((step, idx) => (
            <div key={idx} className="border p-3 rounded mb-2 bg-gray-50">
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="Title" value={step.title} onChange={e => { const s = [...workflow.steps]; s[idx].title = e.target.value; setWorkflow({...workflow, steps: s}) }} className="border rounded p-1" />
                <input placeholder="Deskripsi" value={step.desc} onChange={e => { const s = [...workflow.steps]; s[idx].desc = e.target.value; setWorkflow({...workflow, steps: s}) }} className="border rounded p-1" />
                <input placeholder="Icon" value={step.icon} onChange={e => { const s = [...workflow.steps]; s[idx].icon = e.target.value; setWorkflow({...workflow, steps: s}) }} className="border rounded p-1" />
              </div>
              <button onClick={() => { const s = workflow.steps.filter((_, i) => i !== idx); setWorkflow({...workflow, steps: s}) }} className="text-red-500 text-sm mt-1">Hapus</button>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-bold">Statistik Workflow</h3>
          {workflow.stats.map((stat, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
              <input placeholder="Label" value={stat.label} onChange={e => { const s = [...workflow.stats]; s[idx].label = e.target.value; setWorkflow({...workflow, stats: s}) }} className="border rounded p-1" />
              <input placeholder="Value" value={stat.value} onChange={e => { const s = [...workflow.stats]; s[idx].value = e.target.value; setWorkflow({...workflow, stats: s}) }} className="border rounded p-1" />
              <input placeholder="Icon" value={stat.icon} onChange={e => { const s = [...workflow.stats]; s[idx].icon = e.target.value; setWorkflow({...workflow, stats: s}) }} className="border rounded p-1" />
              <input placeholder="Gradient" value={stat.gradient} onChange={e => { const s = [...workflow.stats]; s[idx].gradient = e.target.value; setWorkflow({...workflow, stats: s}) }} className="border rounded p-1" />
            </div>
          ))}
          <button onClick={() => {
            setWorkflow({
              ...workflow,
              stats: [...workflow.stats, { label: '', value: '', icon: '', gradient: '' }]
            })
          }} className="bg-blue-600 text-white px-3 py-1 rounded text-sm"><FiPlus /> Tambah Stat</button>
        </div>
      </div>
    </div>
  )

  const renderMobile = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">📱 Mobile-first Section</h2>
        <button onClick={() => {
          setMobile({
            ...mobile,
            features: [...mobile.features, { title: '', desc: '' }]
          })
        }} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Feature
        </button>
      </div>
      <div className="space-y-4 bg-white p-4 rounded-xl border">
        <input placeholder="Title" value={mobile.title} onChange={e => setMobile({...mobile, title: e.target.value})} className="w-full border rounded p-2" />
        <textarea placeholder="Subtitle" value={mobile.subtitle} onChange={e => setMobile({...mobile, subtitle: e.target.value})} rows={2} className="w-full border rounded p-2" />
        <div><label className="block font-medium">Video URL</label><input type="text" value={mobile.video} onChange={e => setMobile({...mobile, video: e.target.value})} className="w-full border rounded p-2" placeholder="URL video .mp4" />
          <ImageUpload bucket="service-images" path="innovation/mobile" value={mobile.image} onChange={url => setMobile({...mobile, image: url})} label="Image (fallback)" /></div>
        <div>
          <h3 className="font-bold">Features</h3>
          {mobile.features.map((f, idx) => (
            <div key={idx} className="border p-3 rounded mb-2 bg-gray-50">
              <input placeholder="Title" value={f.title} onChange={e => { const ff = [...mobile.features]; ff[idx].title = e.target.value; setMobile({...mobile, features: ff}) }} className="border rounded p-2 w-full mb-1" />
              <textarea placeholder="Deskripsi" value={f.desc} onChange={e => { const ff = [...mobile.features]; ff[idx].desc = e.target.value; setMobile({...mobile, features: ff}) }} className="border rounded p-2 w-full" />
              <button onClick={() => { const ff = mobile.features.filter((_, i) => i !== idx); setMobile({...mobile, features: ff}) }} className="text-red-500 text-sm mt-1">Hapus</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDigital = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">📋 Digitalisasi Section</h2>
        <button onClick={() => {
          setDigital({
            ...digital,
            features: [...digital.features, { title: '', desc: '' }]
          })
        }} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Feature
        </button>
      </div>
      <div className="space-y-4 bg-white p-4 rounded-xl border">
        <input placeholder="Title" value={digital.title} onChange={e => setDigital({...digital, title: e.target.value})} className="w-full border rounded p-2" />
        <textarea placeholder="Subtitle" value={digital.subtitle} onChange={e => setDigital({...digital, subtitle: e.target.value})} rows={2} className="w-full border rounded p-2" />
        <div><label className="block font-medium">Video URL</label><input type="text" value={digital.video} onChange={e => setDigital({...digital, video: e.target.value})} className="w-full border rounded p-2" placeholder="URL video .mp4" />
          <ImageUpload bucket="service-images" path="innovation/digital" value={digital.image} onChange={url => setDigital({...digital, image: url})} label="Image (fallback)" /></div>
        <div>
          <h3 className="font-bold">Features</h3>
          {digital.features.map((f, idx) => (
            <div key={idx} className="border p-3 rounded mb-2 bg-gray-50">
              <input placeholder="Title" value={f.title} onChange={e => { const ff = [...digital.features]; ff[idx].title = e.target.value; setDigital({...digital, features: ff}) }} className="border rounded p-2 w-full mb-1" />
              <textarea placeholder="Deskripsi" value={f.desc} onChange={e => { const ff = [...digital.features]; ff[idx].desc = e.target.value; setDigital({...digital, features: ff}) }} className="border rounded p-2 w-full" />
              <button onClick={() => { const ff = digital.features.filter((_, i) => i !== idx); setDigital({...digital, features: ff}) }} className="text-red-500 text-sm mt-1">Hapus</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStats = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">📊 Statistik</h2>
        <button onClick={() => addArrayItem(setStats, stats, { icon: 'FiBriefcase', value: '0', label: 'Baru', suffix: '', gradient: 'from-blue-500 to-cyan-500' })} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Stat
        </button>
      </div>
      {stats.map((stat, idx) => (
        <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <input placeholder="Icon" value={stat.icon} onChange={e => updateArrayItem(setStats, stats, idx, 'icon', e.target.value)} className="border rounded p-2" />
            <input placeholder="Value" value={stat.value} onChange={e => updateArrayItem(setStats, stats, idx, 'value', e.target.value)} className="border rounded p-2" />
            <input placeholder="Label" value={stat.label} onChange={e => updateArrayItem(setStats, stats, idx, 'label', e.target.value)} className="border rounded p-2" />
            <input placeholder="Suffix" value={stat.suffix} onChange={e => updateArrayItem(setStats, stats, idx, 'suffix', e.target.value)} className="border rounded p-2" />
            <input placeholder="Gradient" value={stat.gradient} onChange={e => updateArrayItem(setStats, stats, idx, 'gradient', e.target.value)} className="border rounded p-2" />
          </div>
          <button onClick={() => removeArrayItem(setStats, stats, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
        </div>
      ))}
    </div>
  )

  const renderGallery = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🖼️ Galeri</h2>
        <button onClick={() => addArrayItem(setGallery, gallery, { url: '', title: '' })} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Gambar
        </button>
      </div>
      {gallery.map((img, idx) => (
        <div key={idx} className="flex gap-2 mb-2 items-center">
          <ImageUpload bucket="service-images" path="innovation/gallery" value={img.url} onChange={url => { const g = [...gallery]; g[idx].url = url; setGallery(g) }} label={`Gambar ${idx+1}`} />
          <input placeholder="Title" value={img.title || ''} onChange={e => { const g = [...gallery]; g[idx].title = e.target.value; setGallery(g) }} className="border rounded p-1 w-32" />
          <button onClick={() => removeArrayItem(setGallery, gallery, idx)} className="text-red-500"><FiTrash2 /></button>
        </div>
      ))}
    </div>
  )

  const renderTestimonials = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">💬 Testimonial</h2>
        <button onClick={() => addArrayItem(setTestimonials, testimonials, { name: '', role: '', text: '', rating: 5, avatar: '' })} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Testimonial
        </button>
      </div>
      {testimonials.map((t, idx) => (
        <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input placeholder="Nama" value={t.name} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'name', e.target.value)} className="border rounded p-2" />
            <input placeholder="Role" value={t.role} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'role', e.target.value)} className="border rounded p-2" />
            <textarea placeholder="Testimonial" value={t.text} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'text', e.target.value)} rows={2} className="border rounded p-2 col-span-2" />
            <input placeholder="Rating (1-5)" type="number" value={t.rating} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'rating', parseInt(e.target.value))} className="border rounded p-2" />
            <div className="col-span-2">
              <ImageUpload bucket="service-images" path="innovation/testimonials" value={t.avatar} onChange={url => updateArrayItem(setTestimonials, testimonials, idx, 'avatar', url)} label="Avatar" />
            </div>
          </div>
          <button onClick={() => removeArrayItem(setTestimonials, testimonials, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
        </div>
      ))}
    </div>
  )

  const renderFeatures = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">✨ Fitur</h2>
        <button onClick={() => addArrayItem(setFeatures, features, { title: '', desc: '', icon: 'FiStar', gradient: 'from-cyan-500 to-blue-500' })} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
          <FiPlus /> Tambah Fitur
        </button>
      </div>
      {features.map((f, idx) => (
        <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input placeholder="Title" value={f.title} onChange={e => updateArrayItem(setFeatures, features, idx, 'title', e.target.value)} className="border rounded p-2" />
            <textarea placeholder="Deskripsi" value={f.desc} onChange={e => updateArrayItem(setFeatures, features, idx, 'desc', e.target.value)} rows={2} className="border rounded p-2" />
            <input placeholder="Icon" value={f.icon} onChange={e => updateArrayItem(setFeatures, features, idx, 'icon', e.target.value)} className="border rounded p-2" />
            <input placeholder="Gradient" value={f.gradient} onChange={e => updateArrayItem(setFeatures, features, idx, 'gradient', e.target.value)} className="border rounded p-2" />
          </div>
          <button onClick={() => removeArrayItem(setFeatures, features, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
        </div>
      ))}
    </div>
  )

  const renderCta = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🎯 CTA</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border">
        <div className="col-span-2"><label>Title</label><input type="text" value={cta.title} onChange={e => setCta({...cta, title: e.target.value})} className="w-full border rounded p-2" /></div>
        <div className="col-span-2"><label>Deskripsi</label><textarea value={cta.description} onChange={e => setCta({...cta, description: e.target.value})} rows={2} className="w-full border rounded p-2" /></div>
        <div><label>Tombol Teks</label><input type="text" value={cta.button_text} onChange={e => setCta({...cta, button_text: e.target.value})} className="w-full border rounded p-2" /></div>
        <div><label>Tombol Link</label><input type="text" value={cta.button_link} onChange={e => setCta({...cta, button_link: e.target.value})} className="w-full border rounded p-2" /></div>
      </div>
    </div>
  )

  // ========== MAIN RENDER ==========
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500 mt-3">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      <AdminSectionNav items={NAV_ITEMS} activeKey={activeSection} onSelect={setActiveSection} />

      <div className="flex-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Kelola Innovation</h2>
          <div className="flex gap-2">
            <button onClick={fetchData} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition text-sm">
              <FiRefreshCw size={14} /> Refresh
            </button>
            <button onClick={handleSaveAll} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50 text-sm">
              <FiSave /> {saving ? 'Menyimpan...' : 'Simpan Semua'}
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

      {/* MODAL SLIDE */}
      {showSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowSlideModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingSlideIndex !== null ? 'Edit Slide' : 'Tambah Slide'}</h3>
              <button onClick={() => setShowSlideModal(false)}><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <ImageUpload bucket="service-images" path="innovation/hero-slides" value={slideForm.image} onChange={url => setSlideForm({...slideForm, image: url})} label="Gambar Slide" />
              <input placeholder="Badge" value={slideForm.badge} onChange={e => setSlideForm({...slideForm, badge: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Title" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Highlight" value={slideForm.highlight} onChange={e => setSlideForm({...slideForm, highlight: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Deskripsi" value={slideForm.description} onChange={e => setSlideForm({...slideForm, description: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <button onClick={() => {
                if (!slideForm.image || !slideForm.title) { alert('Image dan Title wajib diisi'); return }
                if (editingSlideIndex !== null) updateSlide(editingSlideIndex, slideForm)
                else addSlide(slideForm)
                setShowSlideModal(false)
              }} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Slide</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MARQUEE */}
      {showMarqueeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowMarqueeModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingMarqueeIndex !== null ? 'Edit Marquee' : 'Tambah Marquee'}</h3>
              <button onClick={() => setShowMarqueeModal(false)}><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Nama Mitra" value={marqueeForm.name} onChange={e => setMarqueeForm({...marqueeForm, name: e.target.value})} className="w-full border rounded p-2" />
              <ImageUpload bucket="service-images" path="innovation/partner-marquee" value={marqueeForm.logo} onChange={url => setMarqueeForm({...marqueeForm, logo: url})} label="Logo" />
              <button onClick={() => {
                if (!marqueeForm.name || !marqueeForm.logo) { alert('Nama dan Logo wajib diisi'); return }
                if (editingMarqueeIndex !== null) updateMarqueeItem(editingMarqueeIndex, marqueeForm)
                else addMarqueeItem(marqueeForm)
                setShowMarqueeModal(false)
              }} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}