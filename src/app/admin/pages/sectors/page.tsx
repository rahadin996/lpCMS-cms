'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FiPlus, FiEdit, FiTrash2, FiX, FiArrowUp, FiArrowDown, FiSave } from 'react-icons/fi'
import ImageUpload from '@/components/admin/ImageUpload'
import AdminSectionNav from '@/components/admin/AdminSectionNav'

// ========== TYPE DEFINITIONS ==========
interface SlideItem {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
}

interface StatItem {
  icon: string
  value: number
  label: string
  suffix: string
  gradient: string
}

interface AdvantageItem {
  title: string
  desc: string
  icon: string
}

interface SectorData {
  id: number
  title: string
  slug: string
  description: string
  icon: string
  features: string[]
  image: string
  projects: number
  years: number
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

interface Partner {
  name: string
  logo: string
}

// ========== DEFAULT DATA ==========
const DEFAULT_HERO_SLIDES: SlideItem[] = [
  {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop",
    badge: "Sektor Unggulan 2024",
    title: "Pemerintahan &",
    highlight: "Kebijakan Publik",
    description: "Perencanaan pembangunan strategis, kebijakan publik, dan tata kelola pemerintahan yang berdampak."
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop",
    badge: "Proyek Strategis Nasional",
    title: "Infrastruktur &",
    highlight: "Pekerjaan Umum",
    description: "Mewujudkan infrastruktur tangguh: jalan, jembatan, bendungan, dan irigasi modern."
  },
  {
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1920&h=1080&fit=crop",
    badge: "Program Kotaku",
    title: "Perumahan &",
    highlight: "Kawasan Permukiman",
    description: "Pengembangan perumahan layak huni dan penataan kawasan kumuh berkelanjutan."
  },
  {
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&h=1080&fit=crop",
    badge: "Konservasi & Sanitasi",
    title: "Sumber Daya Air &",
    highlight: "Lingkungan",
    description: "Pengelolaan air minum, sanitasi, dan konservasi lingkungan untuk masa depan hijau."
  }
]

const DEFAULT_STATS: StatItem[] = [
  { icon: 'FiBriefcase', value: 487, label: 'Proyek Selesai', suffix: '+', gradient: 'from-blue-500 to-cyan-500' },
  { icon: 'FiUsers', value: 126, label: 'Klien Aktif', suffix: '', gradient: 'from-purple-500 to-pink-500' },
  { icon: 'FiAward', value: 78, label: 'Penghargaan', suffix: '', gradient: 'from-emerald-500 to-teal-500' },
  { icon: 'FiStar', value: 99, label: 'Kepuasan Klien', suffix: '%', gradient: 'from-amber-500 to-orange-500' },
  { icon: 'FiGlobe', value: 15, label: 'Kota Tersebar', suffix: '+', gradient: 'from-cyan-500 to-blue-500' },
  { icon: 'FiClock', value: 25, label: 'Tahun Pengalaman', suffix: '', gradient: 'from-red-500 to-rose-500' },
  { icon: 'FiTruck', value: 1200, label: 'Tenaga Ahli', suffix: '+', gradient: 'from-green-500 to-emerald-500' },
  { icon: 'FiCpu', value: 45, label: 'Teknologi Terapan', suffix: '', gradient: 'from-indigo-500 to-purple-500' }
]

const DEFAULT_ADVANTAGES: AdvantageItem[] = [
  { title: 'Pendekatan Holistik', desc: 'Melibatkan semua pemangku kepentingan untuk solusi berkelanjutan.', icon: 'FiGlobe' },
  { title: 'Data-Driven', desc: 'Keputusan berdasarkan analisis data dan riset lapangan akurat.', icon: 'FiBarChart2' },
  { title: 'Inovasi Teknologi', desc: 'Memanfaatkan GIS, AI, dan Digital Twin untuk efisiensi.', icon: 'FiTrendingUp' },
  { title: 'Komitmen Kualitas', desc: 'Sertifikasi ISO 9001:2015 dan standar internasional.', icon: 'FiAward' },
  { title: 'Jaminan Ketepatan Waktu', desc: 'Project management dengan milestone terukur.', icon: 'FiClock' },
  { title: 'Dukungan Pasca Proyek', desc: 'Monitoring dan evaluasi berkelanjutan.', icon: 'FiShield' }
]

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  { title: 'Masterplan IKN Nusantara', sector: 'Pemerintahan', location: 'Kalimantan Timur', year: 2024, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop' },
  { title: 'Jembatan Selat Sunda', sector: 'Infrastruktur', location: 'Banten-Lampung', year: 2025, image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f947?w=600&h=400&fit=crop' },
  { title: 'Smart City Jakarta', sector: 'Pemerintahan', location: 'Jakarta', year: 2023, image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop' },
  { title: 'Pengelolaan DAS Citarum', sector: 'Lingkungan', location: 'Jawa Barat', year: 2023, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop' },
  { title: 'Village Digital Program', sector: 'Pedesaan', location: '50 Desa', year: 2024, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop' },
  { title: 'Peningkatan Kapasitas ASN', sector: 'Pendidikan', location: 'Nasional', year: 2024, image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop' }
]

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: 'Dr. Ir. Budi Santoso', role: 'Kepala BAPPEDA', text: 'LPPSLH telah membantu kami menyusun masterplan yang visioner dan aplikatif.', rating: 5, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', sector: 'Pemerintahan' },
  { name: 'Ir. Andi Wijaya', role: 'Konsultan Senior', text: 'Pemahaman mendalam tentang regulasi membuat LPPSLH menjadi mitra terpercaya.', rating: 5, avatar: 'https://randomuser.me/api/portraits/men/75.jpg', sector: 'Infrastruktur' },
  { name: 'Siti Nurhaliza, ST', role: 'Project Director', text: 'Kualitas pekerjaan dan ketepatan waktu sangat mengesankan.', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/68.jpg', sector: 'Perumahan' },
  { name: 'Dr. Eng. Ahmad Zaki', role: 'Akademisi UI', text: 'Pendekatan ilmiah dan data-driven sangat membantu pengambilan kebijakan.', rating: 5, avatar: 'https://randomuser.me/api/portraits/men/45.jpg', sector: 'Pendidikan' },
  { name: 'Maya Sari, M.Sc', role: 'Direktur CSR', text: 'Mitra yang ideal untuk program pembangunan berkelanjutan.', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/52.jpg', sector: 'Lingkungan' }
]

const DEFAULT_FAQS: Faq[] = [
  { q: 'Sektor apa saja yang menjadi fokus LPPSLH?', a: 'Kami melayani 8 sektor utama: Pemerintahan, Infrastruktur, Perumahan, SDA & Lingkungan, Pertanian, Pedesaan, Pendidikan, dan Kesehatan.' },
  { q: 'Apakah LPPSLH memiliki pengalaman di sektor swasta?', a: 'Ya, kami juga bekerja sama dengan BUMN, perusahaan swasta nasional dan multinasional, serta lembaga internasional seperti World Bank dan ADB.' },
  { q: 'Bagaimana LPPSLH memastikan kualitas di setiap sektor?', a: 'Kami menerapkan sistem manajemen mutu ISO 9001:2015, didukung tim ahli bersertifikasi, dan evaluasi berkala oleh independent reviewer.' }
]

const DEFAULT_PARTNERS: Partner[] = [
  { name: 'Kementerian PUPR', logo: '/images/pu.png' },
  { name: 'Pam Jaya', logo: '/images/pamjaya.png' },
  { name: 'Kementerian Desa', logo: '/images/pdtt.png' },
  { name: 'Kementerian Tenaga Kerja', logo: '/images/transmigrasi.png' },
  { name: 'Global Green Growth Institute', logo: '/images/gggi.png' },
  { name: 'Kementerian Agama', logo: '/images/agama.png' },
  { name: 'Kementerian Sekretariat Negara', logo: '/images/setneg.png' }
]

// ========== NAV ITEMS ==========
const navItems = [
  { key: 'hero_slides', label: '🎞️ Hero Slideshow' },
  { key: 'partner_marquee', label: '🔄 Partner Marquee' },
  { key: 'stats', label: '📊 Statistik' },
  { key: 'advantages', label: '⭐ Keunggulan' },
  { key: 'sectors', label: '📂 Sektor' },
  { key: 'case_studies', label: '📚 Studi Kasus' },
  { key: 'testimonials', label: '💬 Testimonial' },
  { key: 'faqs', label: '❓ FAQ' }
]

// ========== MAIN COMPONENT ==========
export default function EditSectorsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState<string>('hero_slides')
  const supabase = createClient()

  // ========== STATE ==========
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>([])
  const [savingSlide, setSavingSlide] = useState(false)
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [slideForm, setSlideForm] = useState<SlideItem>({ image: '', badge: '', title: '', highlight: '', description: '' })

  const [partners, setPartners] = useState<Partner[]>([])
  const [savingPartner, setSavingPartner] = useState(false)
  const [showPartnerModal, setShowPartnerModal] = useState(false)
  const [editingPartnerIndex, setEditingPartnerIndex] = useState<number | null>(null)
  const [partnerForm, setPartnerForm] = useState<Partner>({ name: '', logo: '' })

  const [stats, setStats] = useState<StatItem[]>([])
  const [advantages, setAdvantages] = useState<AdvantageItem[]>([])
  const [sectors, setSectors] = useState<SectorData[]>([])
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])

  // ===== MODAL SECTOR =====
  const [showSectorModal, setShowSectorModal] = useState(false)
  const [editingSector, setEditingSector] = useState<SectorData | null>(null)
  const [sectorForm, setSectorForm] = useState<Partial<SectorData>>({
    title: '',
    slug: '',
    description: '',
    icon: 'FiGlobe',
    features: [],
    image: '',
    projects: 0,
    years: 0
  })
  const [featuresInput, setFeaturesInput] = useState('')

  // ===== MODAL CASE STUDY =====
  const [showCaseModal, setShowCaseModal] = useState(false)
  const [editingCaseIndex, setEditingCaseIndex] = useState<number | null>(null)
  const [caseForm, setCaseForm] = useState<CaseStudy>({ title: '', sector: '', location: '', year: new Date().getFullYear(), image: '' })

  // ===== MODAL TESTIMONIAL =====
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null)
  const [testimonialForm, setTestimonialForm] = useState<Testimonial>({ name: '', role: '', text: '', rating: 5, avatar: '', sector: '' })

  // ===== MODAL FAQ =====
  const [showFaqModal, setShowFaqModal] = useState(false)
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null)
  const [faqForm, setFaqForm] = useState<Faq>({ q: '', a: '' })

  // ========== HELPER ==========
  const addArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], defaultItem: T) => setter([...current, defaultItem])
  const removeArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], index: number) => setter(current.filter((_, i) => i !== index))
  const updateArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], index: number, field: keyof T, value: any) => {
    const newArr = [...current]; newArr[index][field] = value; setter(newArr)
  }
  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  // ========== FUNGSI HERO SLIDES ==========
  const saveHeroSlidesToDb = async (slides: SlideItem[]) => {
    setSavingSlide(true)
    try {
      const { error } = await supabase.from('page_contents').upsert({ page: 'sectors', section: 'hero_slides', key: 'data', value: JSON.stringify(slides) }, { onConflict: 'page, section, key' })
      if (error) throw error
      setMessage({ text: '✅ Slide berhasil disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) { setMessage({ text: `❌ Gagal: ${err.message}`, type: 'error' }) }
    finally { setSavingSlide(false) }
  }

  const addSlide = (s: SlideItem) => { const updated = [...heroSlides, s]; setHeroSlides(updated); saveHeroSlidesToDb(updated) }
  const updateSlide = (i: number, s: SlideItem) => { const updated = [...heroSlides]; updated[i] = s; setHeroSlides(updated); saveHeroSlidesToDb(updated) }
  const deleteSlide = (i: number) => { if (!confirm('Hapus slide?')) return; const updated = heroSlides.filter((_, idx) => idx !== i); setHeroSlides(updated); saveHeroSlidesToDb(updated) }
  const moveSlide = (i: number, dir: 'up' | 'down') => {
    if (dir === 'up' && i === 0) return
    if (dir === 'down' && i === heroSlides.length - 1) return
    const newSlides = [...heroSlides]; const newIndex = dir === 'up' ? i - 1 : i + 1
    ;[newSlides[i], newSlides[newIndex]] = [newSlides[newIndex], newSlides[i]]
    setHeroSlides(newSlides); saveHeroSlidesToDb(newSlides)
  }

  const openSlideModal = (idx?: number) => {
    if (idx !== undefined) { setEditingSlideIndex(idx); setSlideForm(heroSlides[idx]) }
    else { setEditingSlideIndex(null); setSlideForm({ image: '', badge: '', title: '', highlight: '', description: '' }) }
    setShowSlideModal(true)
  }

  const saveSlideFromModal = () => {
    if (!slideForm.image || !slideForm.title) { alert('Image dan Title wajib diisi'); return }
    if (editingSlideIndex !== null) updateSlide(editingSlideIndex, slideForm)
    else addSlide(slideForm)
    setShowSlideModal(false)
  }

  // ========== FUNGSI PARTNER MARQUEE ==========
  const savePartnersToDb = async (items: Partner[]) => {
    setSavingPartner(true)
    try {
      const { error } = await supabase.from('page_contents').upsert({ page: 'sectors', section: 'partner_marquee', key: 'data', value: JSON.stringify(items) }, { onConflict: 'page, section, key' })
      if (error) throw error
      setMessage({ text: '✅ Marquee disimpan', type: 'success' })
    } catch (err: any) { setMessage({ text: `❌ Gagal: ${err.message}`, type: 'error' }) }
    finally { setSavingPartner(false) }
  }

  const addPartner = (item: Partner) => { const updated = [...partners, item]; setPartners(updated); savePartnersToDb(updated) }
  const updatePartner = (i: number, item: Partner) => { const updated = [...partners]; updated[i] = item; setPartners(updated); savePartnersToDb(updated) }
  const deletePartner = (i: number) => { if (!confirm('Hapus item?')) return; const updated = partners.filter((_, idx) => idx !== i); setPartners(updated); savePartnersToDb(updated) }

  const openPartnerModal = (idx?: number) => {
    if (idx !== undefined) { setEditingPartnerIndex(idx); setPartnerForm(partners[idx]) }
    else { setEditingPartnerIndex(null); setPartnerForm({ name: '', logo: '' }) }
    setShowPartnerModal(true)
  }

  const savePartnerFromModal = () => {
    if (!partnerForm.name || !partnerForm.logo) { alert('Nama dan Logo wajib diisi'); return }
    if (editingPartnerIndex !== null) updatePartner(editingPartnerIndex, partnerForm)
    else addPartner(partnerForm)
    setShowPartnerModal(false)
  }

  // ========== SAVE SECTION LAIN ==========
  const saveSection = async (section: string, data: any) => {
    const { error } = await supabase.from('page_contents').upsert({ page: 'sectors', section, key: 'data', value: JSON.stringify(data) }, { onConflict: 'page, section, key' })
    if (error) throw error
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await saveSection('stats', stats)
      await saveSection('advantages', advantages)
      await saveSection('case_studies', caseStudies)
      await saveSection('testimonials', testimonials)
      await saveSection('faqs', faqs)
      setMessage({ text: '✅ Semua konten disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) { setMessage({ text: '❌ Gagal: ' + err.message, type: 'error' }) }
    finally { setSaving(false) }
  }

  // ========== CRUD SECTOR ==========
  const fetchSectors = async () => {
    const { data } = await supabase.from('sectors').select('*').order('id', { ascending: true })
    setSectors(data as SectorData[] || [])
  }

  const openSectorModal = (sector?: SectorData) => {
    if (sector) {
      setEditingSector(sector)
      setSectorForm(sector)
      setFeaturesInput((sector.features || []).join(', '))
    } else {
      setEditingSector(null)
      setSectorForm({ title: '', slug: '', description: '', icon: 'FiGlobe', features: [], image: '', projects: 0, years: 0 })
      setFeaturesInput('')
    }
    setShowSectorModal(true)
  }

  const saveSector = async () => {
    const slug = sectorForm.slug || generateSlug(sectorForm.title || '')
    const featuresArray = featuresInput.split(',').map(f => f.trim()).filter(Boolean)
    const dataToSave = {
      title: sectorForm.title,
      slug,
      description: sectorForm.description || '',
      icon: sectorForm.icon || 'FiGlobe',
      features: featuresArray,
      image: sectorForm.image || '',
      projects: Number(sectorForm.projects) || 0,
      years: Number(sectorForm.years) || 0
    }

    let error: any
    if (editingSector) {
      const { error: e } = await supabase.from('sectors').update(dataToSave).eq('id', editingSector.id)
      error = e
    } else {
      const { error: e } = await supabase.from('sectors').insert(dataToSave)
      error = e
    }
    if (error) { alert('Gagal: ' + error.message) } else { fetchSectors(); setShowSectorModal(false) }
  }

  const deleteSector = async (id: number) => {
    if (!confirm('Hapus sektor ini?')) return
    const { error } = await supabase.from('sectors').delete().eq('id', id)
    if (!error) fetchSectors()
  }

  // ========== CRUD CASE STUDY ==========
  const openCaseModal = (idx?: number) => {
    if (idx !== undefined) { setEditingCaseIndex(idx); setCaseForm(caseStudies[idx]) }
    else { setEditingCaseIndex(null); setCaseForm({ title: '', sector: '', location: '', year: new Date().getFullYear(), image: '' }) }
    setShowCaseModal(true)
  }

  const saveCaseStudy = () => {
    if (!caseForm.title || !caseForm.sector) { alert('Judul dan Sektor wajib diisi'); return }
    if (editingCaseIndex !== null) { const updated = [...caseStudies]; updated[editingCaseIndex] = caseForm; setCaseStudies(updated) }
    else { setCaseStudies([...caseStudies, caseForm]) }
    setShowCaseModal(false)
  }

  // ========== CRUD TESTIMONIAL ==========
  const openTestimonialModal = (idx?: number) => {
    if (idx !== undefined) { setEditingTestimonialIndex(idx); setTestimonialForm(testimonials[idx]) }
    else { setEditingTestimonialIndex(null); setTestimonialForm({ name: '', role: '', text: '', rating: 5, avatar: '', sector: '' }) }
    setShowTestimonialModal(true)
  }

  const saveTestimonial = () => {
    if (!testimonialForm.name || !testimonialForm.text) { alert('Nama dan Testimonial wajib diisi'); return }
    if (editingTestimonialIndex !== null) { const updated = [...testimonials]; updated[editingTestimonialIndex] = testimonialForm; setTestimonials(updated) }
    else { setTestimonials([...testimonials, testimonialForm]) }
    setShowTestimonialModal(false)
  }

  // ========== CRUD FAQ ==========
  const openFaqModal = (idx?: number) => {
    if (idx !== undefined) { setEditingFaqIndex(idx); setFaqForm(faqs[idx]) }
    else { setEditingFaqIndex(null); setFaqForm({ q: '', a: '' }) }
    setShowFaqModal(true)
  }

  const saveFaq = () => {
    if (!faqForm.q || !faqForm.a) { alert('Pertanyaan dan Jawaban wajib diisi'); return }
    if (editingFaqIndex !== null) { const updated = [...faqs]; updated[editingFaqIndex] = faqForm; setFaqs(updated) }
    else { setFaqs([...faqs, faqForm]) }
    setShowFaqModal(false)
  }

  // ========== FETCH DATA ==========
  useEffect(() => {
    const fetchAll = async () => {
      const { data: contentData } = await supabase.from('page_contents').select('section, value').eq('page', 'sectors').eq('key', 'data')
      contentData?.forEach((item: any) => {
        try {
          const parsed = JSON.parse(item.value)
          if (item.section === 'hero_slides') setHeroSlides(parsed)
          if (item.section === 'partner_marquee') setPartners(parsed)
          if (item.section === 'stats') setStats(parsed)
          if (item.section === 'advantages') setAdvantages(parsed)
          if (item.section === 'case_studies') setCaseStudies(parsed)
          if (item.section === 'testimonials') setTestimonials(parsed)
          if (item.section === 'faqs') setFaqs(parsed)
        } catch (e) { console.error(e) }
      })

      // Default untuk hero_slides
      const { data: existingSlides } = await supabase.from('page_contents').select('id').eq('page', 'sectors').eq('section', 'hero_slides').maybeSingle()
      if (!existingSlides) { await saveHeroSlidesToDb(DEFAULT_HERO_SLIDES); setHeroSlides(DEFAULT_HERO_SLIDES) }

      const { data: existingPartners } = await supabase.from('page_contents').select('id').eq('page', 'sectors').eq('section', 'partner_marquee').maybeSingle()
      if (!existingPartners) { await savePartnersToDb(DEFAULT_PARTNERS); setPartners(DEFAULT_PARTNERS) }

      if (!stats.length) setStats(DEFAULT_STATS)
      if (!advantages.length) setAdvantages(DEFAULT_ADVANTAGES)
      if (!caseStudies.length) setCaseStudies(DEFAULT_CASE_STUDIES)
      if (!testimonials.length) setTestimonials(DEFAULT_TESTIMONIALS)
      if (!faqs.length) setFaqs(DEFAULT_FAQS)

      await fetchSectors()
      setLoading(false)
    }
    fetchAll()
  }, [])

  if (loading) return <div className="p-8 text-center">Memuat data...</div>

  // ========== RENDER SECTION ==========
  const renderSection = () => {
    switch (activeSection) {
      case 'hero_slides':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🎞️ Hero Slideshow</h2>
              <button onClick={() => openSlideModal()} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm"><FiPlus /> Tambah Slide</button>
            </div>
            {savingSlide && <div className="text-xs text-blue-500 mb-2">Menyimpan...</div>}
            {heroSlides.length === 0 ? <p className="text-gray-400 text-center py-4">Belum ada slide.</p> : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {heroSlides.map((slide, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-200 flex-shrink-0"><img src={slide.image} alt={slide.title} className="w-full h-full object-cover" /></div>
                    <div className="flex-1"><div className="font-bold">{slide.title} <span className="text-blue-600">({slide.highlight})</span></div><div className="text-sm text-gray-500 truncate">{slide.description}</div><div className="text-xs text-gray-400">Badge: {slide.badge}</div></div>
                    <div className="flex gap-2">
                      <button onClick={() => moveSlide(idx, 'up')} disabled={idx === 0} className="p-1 disabled:opacity-30"><FiArrowUp /></button>
                      <button onClick={() => moveSlide(idx, 'down')} disabled={idx === heroSlides.length-1} className="p-1 disabled:opacity-30"><FiArrowDown /></button>
                      <button onClick={() => openSlideModal(idx)} className="text-blue-600 p-1"><FiEdit /></button>
                      <button onClick={() => deleteSlide(idx)} className="text-red-600 p-1"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'partner_marquee':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🔄 Partner Marquee</h2>
              <button onClick={() => openPartnerModal()} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm"><FiPlus /> Tambah Item</button>
            </div>
            {savingPartner && <div className="text-xs text-blue-500 mb-2">Menyimpan...</div>}
            {partners.length === 0 ? <p className="text-gray-400 text-center py-4">Belum ada item.</p> : (
              <div className="space-y-3">
                {partners.map((item, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-4"><img src={item.logo} alt={item.name} className="h-8 w-auto object-contain" /><span className="font-medium">{item.name}</span></div>
                    <div className="flex gap-2">
                      <button onClick={() => openPartnerModal(idx)} className="text-blue-600 p-1"><FiEdit /></button>
                      <button onClick={() => deletePartner(idx)} className="text-red-600 p-1"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'stats':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">📊 Statistik</h2>
            {stats.map((stat, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <input value={stat.icon} onChange={e => updateArrayItem(setStats, stats, idx, 'icon', e.target.value)} className="border rounded p-2" placeholder="Icon" />
                  <input type="number" value={stat.value} onChange={e => updateArrayItem(setStats, stats, idx, 'value', Number(e.target.value))} className="border rounded p-2" placeholder="Value" />
                  <input value={stat.label} onChange={e => updateArrayItem(setStats, stats, idx, 'label', e.target.value)} className="border rounded p-2" placeholder="Label" />
                  <input value={stat.suffix} onChange={e => updateArrayItem(setStats, stats, idx, 'suffix', e.target.value)} className="border rounded p-2" placeholder="Suffix" />
                  <input value={stat.gradient} onChange={e => updateArrayItem(setStats, stats, idx, 'gradient', e.target.value)} className="border rounded p-2" placeholder="Gradient" />
                </div>
                <button onClick={() => removeArrayItem(setStats, stats, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem(setStats, stats, { icon: 'FiBriefcase', value: 0, label: 'Baru', suffix: '', gradient: 'from-blue-500 to-cyan-500' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Stat</button>
          </div>
        )

      case 'advantages':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">⭐ Keunggulan</h2>
            {advantages.map((adv, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input value={adv.title} onChange={e => updateArrayItem(setAdvantages, advantages, idx, 'title', e.target.value)} className="border rounded p-2" placeholder="Judul" />
                  <input value={adv.desc} onChange={e => updateArrayItem(setAdvantages, advantages, idx, 'desc', e.target.value)} className="border rounded p-2" placeholder="Deskripsi" />
                  <input value={adv.icon} onChange={e => updateArrayItem(setAdvantages, advantages, idx, 'icon', e.target.value)} className="border rounded p-2" placeholder="Icon" />
                </div>
                <button onClick={() => removeArrayItem(setAdvantages, advantages, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem(setAdvantages, advantages, { title: 'Keunggulan Baru', desc: 'Deskripsi', icon: 'FiGlobe' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Keunggulan</button>
          </div>
        )

      case 'sectors':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">📂 Sektor (Data dari tabel sectors)</h2>
              <button onClick={() => openSectorModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FiPlus /> Tambah Sektor</button>
            </div>
            {sectors.length === 0 ? <p className="text-gray-400 text-center py-4">Belum ada sektor.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr><th className="p-2 text-left">Judul</th><th className="p-2 text-left">Slug</th><th className="p-2 text-left">Ikon</th><th className="p-2 text-center">Aksi</th></tr>
                  </thead>
                  <tbody>
                    {sectors.map(s => (
                      <tr key={s.id} className="border-t">
                        <td className="p-2">{s.title}</td>
                        <td className="p-2">{s.slug}</td>
                        <td className="p-2">{s.icon}</td>
                        <td className="p-2 text-center space-x-2">
                          <button onClick={() => openSectorModal(s)} className="text-blue-600"><FiEdit /></button>
                          <button onClick={() => deleteSector(s.id)} className="text-red-600"><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )

      case 'case_studies':
        return (
          <div>
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold">📚 Studi Kasus</h2><button onClick={() => openCaseModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FiPlus /> Tambah</button></div>
            {caseStudies.map((item, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input placeholder="Judul" value={item.title} onChange={e => updateArrayItem(setCaseStudies, caseStudies, idx, 'title', e.target.value)} className="border rounded p-2" />
                  <input placeholder="Sektor" value={item.sector} onChange={e => updateArrayItem(setCaseStudies, caseStudies, idx, 'sector', e.target.value)} className="border rounded p-2" />
                  <input placeholder="Lokasi" value={item.location} onChange={e => updateArrayItem(setCaseStudies, caseStudies, idx, 'location', e.target.value)} className="border rounded p-2" />
                  <input type="number" placeholder="Tahun" value={item.year} onChange={e => updateArrayItem(setCaseStudies, caseStudies, idx, 'year', Number(e.target.value))} className="border rounded p-2" />
                  <div className="col-span-2"><ImageUpload bucket="service-images" path="case-studies" value={item.image} onChange={(url) => updateArrayItem(setCaseStudies, caseStudies, idx, 'image', url)} label="Gambar" /></div>
                </div>
                <button onClick={() => removeArrayItem(setCaseStudies, caseStudies, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'testimonials':
        return (
          <div>
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold">💬 Testimonial</h2><button onClick={() => openTestimonialModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FiPlus /> Tambah</button></div>
            {testimonials.map((item, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input placeholder="Nama" value={item.name} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'name', e.target.value)} className="border rounded p-2" />
                  <input placeholder="Role" value={item.role} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'role', e.target.value)} className="border rounded p-2" />
                  <textarea placeholder="Testimonial" value={item.text} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'text', e.target.value)} rows={2} className="border rounded p-2 col-span-2" />
                  <input placeholder="Sektor" value={item.sector} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'sector', e.target.value)} className="border rounded p-2" />
                  <input type="number" placeholder="Rating" value={item.rating} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'rating', Number(e.target.value))} className="border rounded p-2" />
                  <div className="col-span-2"><ImageUpload bucket="service-images" path="testimonial-avatars" value={item.avatar} onChange={(url) => updateArrayItem(setTestimonials, testimonials, idx, 'avatar', url)} label="Avatar" /></div>
                </div>
                <button onClick={() => removeArrayItem(setTestimonials, testimonials, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'faqs':
        return (
          <div>
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold">❓ FAQ</h2><button onClick={() => openFaqModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FiPlus /> Tambah</button></div>
            {faqs.map((item, idx) => (
              <div key={idx} className="border p-3 rounded mb-3 bg-gray-50">
                <input placeholder="Pertanyaan" value={item.q} onChange={e => updateArrayItem(setFaqs, faqs, idx, 'q', e.target.value)} className="border rounded p-2 w-full mb-1" />
                <textarea placeholder="Jawaban" value={item.a} onChange={e => updateArrayItem(setFaqs, faqs, idx, 'a', e.target.value)} rows={2} className="border rounded p-2 w-full" />
                <button onClick={() => removeArrayItem(setFaqs, faqs, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      default: return <p>Pilih section di sidebar</p>
    }
  }

  // ========== RENDER ==========
  return (
    <div className="flex gap-6">
      <AdminSectionNav items={navItems} activeKey={activeSection} onSelect={setActiveSection} />

      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Halaman Sectors</h2>
          <button onClick={handleSaveAll} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50">
            <FiSave /> {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>
        {message.text && <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
        {renderSection()}
      </div>

      {/* ===== MODAL SLIDE ===== */}
      {showSlideModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowSlideModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">{editingSlideIndex !== null ? 'Edit Slide' : 'Tambah Slide'}</h3><button onClick={() => setShowSlideModal(false)}><FiX size={24} /></button></div>
            <div className="space-y-3">
              <ImageUpload bucket="service-images" path="sector-slides" value={slideForm.image} onChange={url => setSlideForm({...slideForm, image: url})} label="Gambar" />
              <input placeholder="Badge" value={slideForm.badge} onChange={e => setSlideForm({...slideForm, badge: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Title" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Highlight" value={slideForm.highlight} onChange={e => setSlideForm({...slideForm, highlight: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Deskripsi" value={slideForm.description} onChange={e => setSlideForm({...slideForm, description: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <button onClick={saveSlideFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL PARTNER ===== */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPartnerModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">{editingPartnerIndex !== null ? 'Edit Item' : 'Tambah Item'}</h3><button onClick={() => setShowPartnerModal(false)}><FiX size={24} /></button></div>
            <div className="space-y-3">
              <input placeholder="Nama" value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full border rounded p-2" />
              <ImageUpload bucket="service-images" path="partner-marquee" value={partnerForm.logo} onChange={url => setPartnerForm({...partnerForm, logo: url})} label="Logo" />
              <button onClick={savePartnerFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL SECTOR ===== */}
      {showSectorModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowSectorModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">{editingSector ? 'Edit Sektor' : 'Tambah Sektor'}</h3><button onClick={() => setShowSectorModal(false)}><FiX size={24} /></button></div>
            <div className="space-y-3">
              <input placeholder="Judul" value={sectorForm.title} onChange={e => setSectorForm({...sectorForm, title: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Slug (kosongkan otomatis)" value={sectorForm.slug} onChange={e => setSectorForm({...sectorForm, slug: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Deskripsi" value={sectorForm.description} onChange={e => setSectorForm({...sectorForm, description: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <input placeholder="Icon" value={sectorForm.icon} onChange={e => setSectorForm({...sectorForm, icon: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Fitur (pisahkan koma)" value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} rows={2} className="w-full border rounded p-2" />
              <ImageUpload bucket="service-images" path="sectors" value={sectorForm.image || ''} onChange={url => setSectorForm({...sectorForm, image: url})} label="Gambar" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Jumlah Proyek" value={sectorForm.projects} onChange={e => setSectorForm({...sectorForm, projects: Number(e.target.value)})} className="border rounded p-2" />
                <input type="number" placeholder="Tahun Pengalaman" value={sectorForm.years} onChange={e => setSectorForm({...sectorForm, years: Number(e.target.value)})} className="border rounded p-2" />
              </div>
              <button onClick={saveSector} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL CASE STUDY ===== */}
      {showCaseModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCaseModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{editingCaseIndex !== null ? 'Edit Studi Kasus' : 'Tambah Studi Kasus'}</h3>
            <div className="space-y-3">
              <input placeholder="Judul" value={caseForm.title} onChange={e => setCaseForm({...caseForm, title: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Sektor" value={caseForm.sector} onChange={e => setCaseForm({...caseForm, sector: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Lokasi" value={caseForm.location} onChange={e => setCaseForm({...caseForm, location: e.target.value})} className="w-full border rounded p-2" />
              <input type="number" placeholder="Tahun" value={caseForm.year} onChange={e => setCaseForm({...caseForm, year: Number(e.target.value)})} className="w-full border rounded p-2" />
              <ImageUpload bucket="service-images" path="case-studies" value={caseForm.image} onChange={url => setCaseForm({...caseForm, image: url})} label="Gambar" />
              <button onClick={saveCaseStudy} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL TESTIMONIAL ===== */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowTestimonialModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{editingTestimonialIndex !== null ? 'Edit Testimonial' : 'Tambah Testimonial'}</h3>
            <div className="space-y-3">
              <input placeholder="Nama" value={testimonialForm.name} onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Role" value={testimonialForm.role} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Sektor" value={testimonialForm.sector} onChange={e => setTestimonialForm({...testimonialForm, sector: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Testimonial" value={testimonialForm.text} onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <input type="number" placeholder="Rating (1-5)" value={testimonialForm.rating} onChange={e => setTestimonialForm({...testimonialForm, rating: Number(e.target.value)})} className="w-full border rounded p-2" />
              <ImageUpload bucket="service-images" path="testimonial-avatars" value={testimonialForm.avatar} onChange={url => setTestimonialForm({...testimonialForm, avatar: url})} label="Avatar" />
              <button onClick={saveTestimonial} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL FAQ ===== */}
      {showFaqModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowFaqModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{editingFaqIndex !== null ? 'Edit FAQ' : 'Tambah FAQ'}</h3>
            <div className="space-y-3">
              <input placeholder="Pertanyaan" value={faqForm.q} onChange={e => setFaqForm({...faqForm, q: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Jawaban" value={faqForm.a} onChange={e => setFaqForm({...faqForm, a: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <button onClick={saveFaq} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}