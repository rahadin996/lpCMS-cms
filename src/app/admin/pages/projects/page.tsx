// src/app/admin/pages/projects/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FiPlus, FiEdit, FiTrash2, FiX, FiArrowUp, FiArrowDown, FiDatabase, FiImage, FiSave } from 'react-icons/fi'
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

interface MarqueeItem {
  name: string
  logo: string
}

interface HeroContent {
  badge_text: string
  title: string
  subtitle: string
  background_image: string
  button_text: string
  button_link: string
}

interface StatItem {
  icon: string
  value: number
  label: string
  gradient: string
}

interface GalleryImage {
  url: string
  title?: string
  caption?: string
}

interface GalleryItem {
  title: string
  location: string
  category: string
  year: string
  description: string
  images: GalleryImage[]
}

interface CaseStudy {
  title: string
  client: string
  year: string
  challenge: string
  solution: string
  result: string
  image: string
}

interface Achievement {
  year: string
  title: string
  desc: string
}

interface Award {
  name: string
  organizer: string
  year: string
  icon: string
}

interface Testimonial {
  name: string
  role: string
  text: string
  project: string
  avatar: string
}

interface Faq {
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

interface ProjectRecord {
  id: number
  title: string
  slug: string
  category: string
  province: string
  city: string
  year: number
  image: string
  description: string
  progress: number
  status: 'ongoing' | 'completed'
  client: string
  value: string
  service: string
  lat: number
  lng: number
}

// ========== DEFAULT DATA ==========
const DEFAULT_SLIDES: SlideItem[] = [
  {
    image: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=1920&h=1080&fit=crop",
    badge: "PORTOFOLIO PREMIUM",
    title: "Proyek Strategis",
    highlight: "LPPSLH",
    description: "Proyek unggulan LPPSLH di seluruh Indonesia – infrastruktur, energi, dan tata kota berkelanjutan."
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop",
    badge: "IKU KOTA NUSANTARA",
    title: "Masa Depan Berkelanjutan",
    highlight: "Ibu Kota Negara",
    description: "Perencanaan forest city dengan teknologi hijau dan smart infrastructure."
  },
  {
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&h=1080&fit=crop",
    badge: "INFRASTRUKTUR MODERN",
    title: "Kereta Cepat & Bandara",
    highlight: "Konektivitas Nasional",
    description: "Manajemen proyek transportasi terpadu, dari Whoosh hingga bandara internasional."
  },
  {
    image: "https://images.unsplash.com/photo-1508514177221-1888071b96b2?w=1920&h=1080&fit=crop",
    badge: "ENERGI TERBARUKAN",
    title: "",
    highlight: "Energi Hijau",
    description: "Proyek PLTS terapung 145 MWp sebagai langkah transisi energi nasional."
  }
]

const DEFAULT_MARQUEE: MarqueeItem[] = [
  { name: "Kementerian PUPR", logo: "/images/pu.png" },
  { name: "Pam Jaya", logo: "/images/pamjaya.png" },
  { name: "Kementerian Desa", logo: "/images/pdtt.png" },
  { name: "Kementerian Tenaga Kerja", logo: "/images/transmigrasi.png" },
  { name: "Global Green Growth Institute", logo: "/images/gggi.png" },
  { name: "Kementerian Agama", logo: "/images/agama.png" },
  { name: "Kementerian Sekretariat Negara", logo: "/images/setneg.png" }
]

const DEFAULT_PROJECT: Omit<ProjectRecord, 'id'> = {
  title: '',
  slug: '',
  category: '',
  province: '',
  city: '',
  year: new Date().getFullYear(),
  image: '',
  description: '',
  progress: 0,
  status: 'ongoing',
  client: '',
  value: '',
  service: '',
  lat: -2.5489,
  lng: 118.0149
}

// ========== NAV ITEMS (TANPA FOOTER) ==========
const navItems = [
  { key: 'hero_slides', label: '🎞️ Hero Slideshow' },
  { key: 'marquee', label: '🔄 Partner Marquee' },
  { key: 'projects_data', label: '📁 Data Proyek' },
  { key: 'hero_text', label: '🎯 Hero Teks' },
  { key: 'stats', label: '📊 Statistik' },
  { key: 'gallery', label: '🖼️ Galeri' },
  { key: 'case_studies', label: '📚 Studi Kasus' },
  { key: 'achievements', label: '🏆 Timeline Prestasi' },
  { key: 'awards', label: '🏅 Penghargaan' },
  { key: 'testimonials', label: '💬 Testimonial' },
  { key: 'faqs', label: '❓ FAQ' },
  { key: 'cta', label: '🎯 CTA' },
]

// ========== MAIN COMPONENT ==========
export default function EditProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState<string>('hero_slides')
  const supabase = createClient()

  // ========== STATE KONTEN ==========
  const [heroSlides, setHeroSlides] = useState<SlideItem[]>([])
  const [savingSlide, setSavingSlide] = useState(false)
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [slideForm, setSlideForm] = useState<SlideItem>({ image: '', badge: '', title: '', highlight: '', description: '' })

  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([])
  const [savingMarquee, setSavingMarquee] = useState(false)
  const [showMarqueeModal, setShowMarqueeModal] = useState(false)
  const [editingMarqueeIndex, setEditingMarqueeIndex] = useState<number | null>(null)
  const [marqueeForm, setMarqueeForm] = useState<MarqueeItem>({ name: '', logo: '' })

  const [hero, setHero] = useState<HeroContent>({
    badge_text: 'PORTOFOLIO PREMIUM',
    title: 'Proyek Strategis',
    subtitle: 'Proyek unggulan LPPSLH di seluruh Indonesia',
    background_image: '',
    button_text: 'Konsultasi Proyek',
    button_link: '/contact'
  })

  const [stats, setStats] = useState<StatItem[]>([])

  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null)
  const [galleryForm, setGalleryForm] = useState<GalleryItem>({
    title: '',
    location: '',
    category: '',
    year: '',
    description: '',
    images: []
  })
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [showCaseModal, setShowCaseModal] = useState(false)
  const [editingCaseIndex, setEditingCaseIndex] = useState<number | null>(null)
  const [caseForm, setCaseForm] = useState<CaseStudy>({ title: '', client: '', year: '', challenge: '', solution: '', result: '', image: '' })

  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [awards, setAwards] = useState<Award[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [cta, setCta] = useState<CtaContent>({
    title: 'Siap Mewujudkan Proyek Besar Anda?',
    description: 'Diskusikan ide dan kebutuhan proyek Anda dengan tim ahli kami.',
    button_text: 'Hubungi Kami',
    button_link: '/contact',
    background_image: '',
    background_color: '#1e3a8a',
    text_color: '#ffffff'
  })

  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null)
  const [projectForm, setProjectForm] = useState<Omit<ProjectRecord, 'id'>>({ ...DEFAULT_PROJECT })

  // ========== HELPER ==========
  const addArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], defaultItem: T) => setter([...current, defaultItem])
  const removeArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], index: number) => setter(current.filter((_, i) => i !== index))
  const updateArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], index: number, field: keyof T, value: any) => {
    const newArr = [...current]
    newArr[index][field] = value
    setter(newArr)
  }
  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  // ========== AUTO-SAVE SLIDESHOW ==========
  const saveHeroSlidesToDb = async (slides: SlideItem[]) => {
    setSavingSlide(true)
    try {
      const { error } = await supabase.from('page_contents').upsert({ page: 'projects', section: 'hero_slides', key: 'data', value: JSON.stringify(slides) }, { onConflict: 'page, section, key' })
      if (error) throw error
      setMessage({ text: '✅ Slide berhasil disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) { setMessage({ text: `❌ Gagal: ${err.message}`, type: 'error' }) }
    finally { setSavingSlide(false) }
  }
  const addSlide = (s: SlideItem) => { const updated = [...heroSlides, s]; setHeroSlides(updated); saveHeroSlidesToDb(updated) }
  const updateSlide = (i: number, s: SlideItem) => { const updated = [...heroSlides]; updated[i] = s; setHeroSlides(updated); saveHeroSlidesToDb(updated) }
  const deleteSlide = (i: number) => { if (!confirm('Hapus?')) return; const updated = heroSlides.filter((_, idx) => idx !== i); setHeroSlides(updated); saveHeroSlidesToDb(updated) }
  const moveSlide = (i: number, dir: 'up' | 'down') => {
    if (dir === 'up' && i === 0) return
    if (dir === 'down' && i === heroSlides.length - 1) return
    const newSlides = [...heroSlides]
    const newIndex = dir === 'up' ? i - 1 : i + 1
    ;[newSlides[i], newSlides[newIndex]] = [newSlides[newIndex], newSlides[i]]
    setHeroSlides(newSlides)
    saveHeroSlidesToDb(newSlides)
  }

  // ========== AUTO-SAVE MARQUEE ==========
  const saveMarqueeToDb = async (items: MarqueeItem[]) => {
    setSavingMarquee(true)
    try {
      const { error } = await supabase.from('page_contents').upsert({ page: 'projects', section: 'partner_marquee', key: 'data', value: JSON.stringify(items) }, { onConflict: 'page, section, key' })
      if (error) throw error
      setMessage({ text: '✅ Marquee disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) { setMessage({ text: `❌ Gagal: ${err.message}`, type: 'error' }) }
    finally { setSavingMarquee(false) }
  }
  const addMarqueeItem = (item: MarqueeItem) => { const updated = [...marqueeItems, item]; setMarqueeItems(updated); saveMarqueeToDb(updated) }
  const updateMarqueeItem = (i: number, item: MarqueeItem) => { const updated = [...marqueeItems]; updated[i] = item; setMarqueeItems(updated); saveMarqueeToDb(updated) }
  const deleteMarqueeItem = (i: number) => { if (!confirm('Hapus?')) return; const updated = marqueeItems.filter((_, idx) => idx !== i); setMarqueeItems(updated); saveMarqueeToDb(updated) }

  // ========== SAVE SECTION LAIN ==========
  const saveSection = async (section: string, data: any) => {
    const { error } = await supabase.from('page_contents').upsert({ page: 'projects', section, key: 'data', value: JSON.stringify(data) }, { onConflict: 'page, section, key' })
    if (error) throw error
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await saveSection('hero', hero)
      await saveSection('stats', stats)
      await saveSection('gallery', gallery)
      await saveSection('caseStudies', caseStudies)
      await saveSection('achievements', achievements)
      await saveSection('awards', awards)
      await saveSection('testimonials', testimonials)
      await saveSection('faqs', faqs)
      await saveSection('cta', cta)
      setMessage({ text: '✅ Semua konten halaman projects disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) { setMessage({ text: '❌ Gagal menyimpan: ' + err.message, type: 'error' }) }
    finally { setSaving(false) }
  }

  // ========== CRUD PROYEK (project_porto) ==========
  const fetchProjects = async () => {
    const { data, error } = await supabase.from('project_porto').select('*').order('id', { ascending: true })
    if (!error && data) setProjects(data as ProjectRecord[])
  }
  const saveProject = async () => {
    const slug = projectForm.slug || generateSlug(projectForm.title)
    const dataToSave = { ...projectForm, slug }
    if (editingProject) {
      const { error } = await supabase.from('project_porto').update(dataToSave).eq('id', editingProject.id)
      if (error) alert('Gagal: ' + error.message)
    } else {
      const { error } = await supabase.from('project_porto').insert(dataToSave)
      if (error) alert('Gagal: ' + error.message)
    }
    fetchProjects()
    setShowProjectModal(false)
    setEditingProject(null)
    setProjectForm({ ...DEFAULT_PROJECT })
  }
  const deleteProject = async (id: number) => {
    if (!confirm('Hapus proyek ini?')) return
    await supabase.from('project_porto').delete().eq('id', id)
    fetchProjects()
  }
  const openProjectModal = (project: ProjectRecord | null = null) => {
    if (project) { setEditingProject(project); setProjectForm(project) }
    else { setEditingProject(null); setProjectForm({ ...DEFAULT_PROJECT }) }
    setShowProjectModal(true)
  }

  // ===== FUNGSI GALERI =====
  const openGalleryModal = (index: number | null = null) => {
    if (index !== null) {
      setEditingGalleryIndex(index)
      setGalleryForm(gallery[index])
    } else {
      setEditingGalleryIndex(null)
      setGalleryForm({ title: '', location: '', category: '', year: '', description: '', images: [] })
    }
    setCurrentImageIndex(null)
    setShowGalleryModal(true)
  }

  const addGalleryImage = () => {
    setGalleryForm({
      ...galleryForm,
      images: [...galleryForm.images, { url: '', title: '', caption: '' }]
    })
    setCurrentImageIndex(galleryForm.images.length)
  }

  const removeGalleryImage = (imgIndex: number) => {
    const newImages = galleryForm.images.filter((_, i) => i !== imgIndex)
    setGalleryForm({ ...galleryForm, images: newImages })
    if (currentImageIndex === imgIndex) setCurrentImageIndex(null)
    else if (currentImageIndex !== null && currentImageIndex > imgIndex) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const updateGalleryImage = (imgIndex: number, field: keyof GalleryImage, value: string) => {
    const newImages = [...galleryForm.images]
    newImages[imgIndex] = { ...newImages[imgIndex], [field]: value }
    setGalleryForm({ ...galleryForm, images: newImages })
  }

  const saveGalleryItem = () => {
    if (editingGalleryIndex !== null) {
      const newGallery = [...gallery]
      newGallery[editingGalleryIndex] = galleryForm
      setGallery(newGallery)
    } else {
      setGallery([...gallery, galleryForm])
    }
    setShowGalleryModal(false)
  }

  // ===== FUNGSI LAIN =====
  const openCaseModal = (index: number | null = null) => {
    setEditingCaseIndex(index)
    setCaseForm(index !== null ? caseStudies[index] : { title: '', client: '', year: '', challenge: '', solution: '', result: '', image: '' })
    setShowCaseModal(true)
  }
  const saveCaseItem = () => {
    if (editingCaseIndex !== null) {
      const nc = [...caseStudies]
      nc[editingCaseIndex] = caseForm
      setCaseStudies(nc)
    } else setCaseStudies([...caseStudies, caseForm])
    setShowCaseModal(false)
  }

  // ========== FETCH AWAL ==========
  useEffect(() => {
    const fetchAll = async () => {
      const { data: contentData } = await supabase.from('page_contents').select('section, value').eq('page', 'projects').eq('key', 'data')
      contentData?.forEach((item: any) => {
        try {
          const parsed = JSON.parse(item.value)
          if (item.section === 'hero') setHero(prev => ({ ...prev, ...parsed }))
          if (item.section === 'stats') setStats(parsed)
          if (item.section === 'gallery') setGallery(parsed)
          if (item.section === 'caseStudies') setCaseStudies(parsed)
          if (item.section === 'achievements') setAchievements(parsed)
          if (item.section === 'awards') setAwards(parsed)
          if (item.section === 'testimonials') setTestimonials(parsed)
          if (item.section === 'faqs') setFaqs(parsed)
          if (item.section === 'cta') setCta(prev => ({ ...prev, ...parsed }))
          if (item.section === 'hero_slides') setHeroSlides(parsed)
          if (item.section === 'partner_marquee') setMarqueeItems(parsed)
        } catch (e) { console.error(e) }
      })

      const { data: existingSlides } = await supabase.from('page_contents').select('id').eq('page', 'projects').eq('section', 'hero_slides').maybeSingle()
      if (!existingSlides) { await saveHeroSlidesToDb(DEFAULT_SLIDES); setHeroSlides(DEFAULT_SLIDES) }

      const { data: existingMarquee } = await supabase.from('page_contents').select('id').eq('page', 'projects').eq('section', 'partner_marquee').maybeSingle()
      if (!existingMarquee) { await saveMarqueeToDb(DEFAULT_MARQUEE); setMarqueeItems(DEFAULT_MARQUEE) }

      await fetchProjects()
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
              <h2 className="text-2xl font-semibold">🎞️ Hero Slideshow (Auto-Save)</h2>
              <button onClick={() => { setEditingSlideIndex(null); setSlideForm({ image: '', badge: '', title: '', highlight: '', description: '' }); setShowSlideModal(true) }} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
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

      case 'marquee':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🔄 Partner Marquee (Auto-Save)</h2>
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

      case 'projects_data':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2"><FiDatabase className="text-green-600" /> Data Proyek (Visualisasi & Peta)</h2>
              <button onClick={() => openProjectModal()} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FiPlus /> Tambah Proyek
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Data ini akan muncul di <strong>Visualisasi Kinerja (Chart)</strong> dan <strong>Peta Sebaran Proyek</strong>.</p>
            {projects.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Belum ada data proyek.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Judul</th>
                      <th className="p-2 text-left">Kategori</th>
                      <th className="p-2 text-left">Lokasi</th>
                      <th className="p-2 text-left">Tahun</th>
                      <th className="p-2 text-center">Status</th>
                      <th className="p-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(proj => (
                      <tr key={proj.id} className="border-t">
                        <td className="p-2 font-medium">{proj.title}</td>
                        <td className="p-2 text-gray-500">{proj.category}</td>
                        <td className="p-2 text-gray-500">{proj.city}, {proj.province}</td>
                        <td className="p-2 text-gray-500">{proj.year}</td>
                        <td className="p-2 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${proj.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {proj.status === 'completed' ? 'Selesai' : 'Berjalan'}
                          </span>
                        </td>
                        <td className="p-2 text-center space-x-2">
                          <button onClick={() => openProjectModal(proj)} className="text-blue-600"><FiEdit size={16} /></button>
                          <button onClick={() => deleteProject(proj.id)} className="text-red-600"><FiTrash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )

      case 'hero_text':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">🎯 Hero Teks & Tombol</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Badge" value={hero.badge_text} onChange={e => setHero({...hero, badge_text: e.target.value})} className="border rounded-lg p-2" />
              <input placeholder="Title" value={hero.title} onChange={e => setHero({...hero, title: e.target.value})} className="border rounded-lg p-2" />
              <textarea placeholder="Subtitle" value={hero.subtitle} onChange={e => setHero({...hero, subtitle: e.target.value})} rows={2} className="border rounded-lg p-2 col-span-2" />
              <div className="col-span-2"><ImageUpload bucket="service-images" path="projects-hero" value={hero.background_image} onChange={url => setHero({...hero, background_image: url})} label="Background Image" /></div>
              <input placeholder="Button Text" value={hero.button_text} onChange={e => setHero({...hero, button_text: e.target.value})} className="border rounded-lg p-2" />
              <input placeholder="Button Link" value={hero.button_link} onChange={e => setHero({...hero, button_link: e.target.value})} className="border rounded-lg p-2" />
            </div>
          </div>
        )

      case 'stats':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">📊 Statistik</h2>
            {stats.map((stat, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input value={stat.icon} onChange={e => updateArrayItem(setStats, stats, idx, 'icon', e.target.value)} className="border rounded p-2" placeholder="Icon" />
                  <input type="number" value={stat.value} onChange={e => updateArrayItem(setStats, stats, idx, 'value', Number(e.target.value))} className="border rounded p-2" placeholder="Value" />
                  <input value={stat.label} onChange={e => updateArrayItem(setStats, stats, idx, 'label', e.target.value)} className="border rounded p-2" placeholder="Label" />
                  <input value={stat.gradient} onChange={e => updateArrayItem(setStats, stats, idx, 'gradient', e.target.value)} className="border rounded p-2" placeholder="Gradient" />
                </div>
                <button onClick={() => removeArrayItem(setStats, stats, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
            <button onClick={() => addArrayItem(setStats, stats, { icon: 'FiBriefcase', value: 0, label: 'Baru', gradient: 'from-blue-500 to-cyan-500' })} className="bg-blue-500 text-white px-4 py-2 rounded-lg">+ Tambah Stat</button>
          </div>
        )

      case 'gallery':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2"><FiImage className="text-purple-600" /> 🖼️ Galeri Proyek</h2>
              <button onClick={() => openGalleryModal()} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FiPlus /> Tambah Galeri
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Unggah foto untuk setiap item galeri. Klik gambar untuk melihat detail.</p>
            {gallery.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Belum ada galeri.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((item, idx) => (
                  <div key={idx} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group relative">
                    <div className="relative h-40 bg-gray-100">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <FiImage size={32} />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => openGalleryModal(idx)} className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100">
                          <FiEdit size={14} className="text-blue-600" />
                        </button>
                        <button onClick={() => removeArrayItem(setGallery, gallery, idx)} className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100">
                          <FiTrash2 size={14} className="text-red-600" />
                        </button>
                      </div>
                      {item.images && item.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                          +{item.images.length - 1} foto
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'case_studies':
        return (
          <div>
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold">📚 Studi Kasus</h2><button onClick={() => openCaseModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah</button></div>
            <div className="grid md:grid-cols-2 gap-4">
              {caseStudies.map((cs, idx) => (
                <div key={idx} className="border rounded-xl p-3 relative group">
                  <img src={cs.image} className="w-full h-32 object-cover rounded mb-2" />
                  <h3 className="font-bold">{cs.title}</h3>
                  <p className="text-xs text-gray-500">{cs.client} - {cs.year}</p>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100">
                    <button onClick={() => openCaseModal(idx)} className="bg-white p-1 rounded"><FiEdit size={14} /></button>
                    <button onClick={() => removeArrayItem(setCaseStudies, caseStudies, idx)} className="bg-white p-1 rounded text-red-600"><FiTrash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'achievements':
        return (
          <div>
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold">🏆 Timeline Prestasi</h2><button onClick={() => addArrayItem(setAchievements, achievements, { year: '', title: '', desc: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah</button></div>
            {achievements.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input placeholder="Tahun" value={item.year} onChange={e => updateArrayItem(setAchievements, achievements, idx, 'year', e.target.value)} className="border rounded p-2 w-24" />
                <input placeholder="Judul" value={item.title} onChange={e => updateArrayItem(setAchievements, achievements, idx, 'title', e.target.value)} className="border rounded p-2 flex-1" />
                <input placeholder="Deskripsi" value={item.desc} onChange={e => updateArrayItem(setAchievements, achievements, idx, 'desc', e.target.value)} className="border rounded p-2 flex-1" />
                <button onClick={() => removeArrayItem(setAchievements, achievements, idx)} className="text-red-500">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'awards':
        return (
          <div>
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold">🏅 Penghargaan</h2><button onClick={() => addArrayItem(setAwards, awards, { name: '', organizer: '', year: '', icon: 'FiAward' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah</button></div>
            {awards.map((award, idx) => (
              <div key={idx} className="flex flex-wrap gap-2 mb-2 items-center">
                <input placeholder="Nama" value={award.name} onChange={e => updateArrayItem(setAwards, awards, idx, 'name', e.target.value)} className="border rounded p-2 flex-1" />
                <input placeholder="Organizer" value={award.organizer} onChange={e => updateArrayItem(setAwards, awards, idx, 'organizer', e.target.value)} className="border rounded p-2 w-40" />
                <input placeholder="Tahun" value={award.year} onChange={e => updateArrayItem(setAwards, awards, idx, 'year', e.target.value)} className="border rounded p-2 w-24" />
                <input placeholder="Icon" value={award.icon} onChange={e => updateArrayItem(setAwards, awards, idx, 'icon', e.target.value)} className="border rounded p-2 w-32" />
                <button onClick={() => removeArrayItem(setAwards, awards, idx)} className="text-red-500">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'testimonials':
        return (
          <div>
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold">💬 Testimonial</h2><button onClick={() => addArrayItem(setTestimonials, testimonials, { name: '', role: '', text: '', project: '', avatar: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah</button></div>
            {testimonials.map((test, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input placeholder="Nama" value={test.name} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'name', e.target.value)} className="border rounded p-2" />
                  <input placeholder="Role" value={test.role} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'role', e.target.value)} className="border rounded p-2" />
                  <textarea placeholder="Testimonial" value={test.text} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'text', e.target.value)} rows={2} className="border rounded p-2 col-span-2" />
                  <input placeholder="Proyek" value={test.project} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'project', e.target.value)} className="border rounded p-2" />
                  <div className="col-span-2"><ImageUpload bucket="service-images" path="testimonials" value={test.avatar} onChange={url => updateArrayItem(setTestimonials, testimonials, idx, 'avatar', url)} label="Avatar" /></div>
                </div>
                <button onClick={() => removeArrayItem(setTestimonials, testimonials, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'faqs':
        return (
          <div>
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold">❓ FAQ</h2><button onClick={() => addArrayItem(setFaqs, faqs, { q: '', a: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah</button></div>
            {faqs.map((faq, idx) => (
              <div key={idx} className="border p-3 rounded mb-3 bg-gray-50">
                <input placeholder="Pertanyaan" value={faq.q} onChange={e => updateArrayItem(setFaqs, faqs, idx, 'q', e.target.value)} className="border rounded p-2 w-full mb-1" />
                <textarea placeholder="Jawaban" value={faq.a} onChange={e => updateArrayItem(setFaqs, faqs, idx, 'a', e.target.value)} rows={2} className="border rounded p-2 w-full" />
                <button onClick={() => removeArrayItem(setFaqs, faqs, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'cta':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">🎯 CTA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Title" value={cta.title} onChange={e => setCta({...cta, title: e.target.value})} className="border rounded-lg p-2" />
              <textarea placeholder="Deskripsi" value={cta.description} onChange={e => setCta({...cta, description: e.target.value})} rows={2} className="border rounded-lg p-2 col-span-2" />
              <input placeholder="Button Text" value={cta.button_text} onChange={e => setCta({...cta, button_text: e.target.value})} className="border rounded-lg p-2" />
              <input placeholder="Button Link" value={cta.button_link} onChange={e => setCta({...cta, button_link: e.target.value})} className="border rounded-lg p-2" />
              <div className="col-span-2"><ImageUpload bucket="service-images" path="projects-cta" value={cta.background_image} onChange={url => setCta({...cta, background_image: url})} label="Background Image" /></div>
              <div><label>Background Color</label><input type="color" value={cta.background_color} onChange={e => setCta({...cta, background_color: e.target.value})} className="w-full h-10 border rounded p-1" /></div>
              <div><label>Text Color</label><input type="color" value={cta.text_color} onChange={e => setCta({...cta, text_color: e.target.value})} className="w-full h-10 border rounded p-1" /></div>
            </div>
          </div>
        )

      default:
        return <p>Pilih section di sidebar</p>
    }
  }

  // ========== RENDER ==========
  return (
    <div className="flex gap-6">
      <AdminSectionNav items={navItems} activeKey={activeSection} onSelect={setActiveSection} />

      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Halaman Projects</h2>
          <button onClick={handleSaveAll} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50">
            <FiSave /> {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {renderSection()}
      </div>

      {/* MODALS... (sama seperti sebelumnya, tidak berubah) */}
      {showSlideModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowSlideModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingSlideIndex !== null ? 'Edit Slide' : 'Tambah Slide'}</h3>
              <button onClick={() => setShowSlideModal(false)}><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <ImageUpload bucket="service-images" path="hero-slides" value={slideForm.image} onChange={url => setSlideForm({...slideForm, image: url})} label="Gambar Slide" />
              <input placeholder="Badge" value={slideForm.badge} onChange={e => setSlideForm({...slideForm, badge: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Title" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Highlight" value={slideForm.highlight} onChange={e => setSlideForm({...slideForm, highlight: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Deskripsi" value={slideForm.description} onChange={e => setSlideForm({...slideForm, description: e.target.value})} rows={2} className="w-full border rounded p-2" />
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

      {showMarqueeModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowMarqueeModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingMarqueeIndex !== null ? 'Edit Marquee' : 'Tambah Marquee'}</h3>
              <button onClick={() => setShowMarqueeModal(false)}><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Nama Mitra" value={marqueeForm.name} onChange={e => setMarqueeForm({...marqueeForm, name: e.target.value})} className="w-full border rounded p-2" />
              <ImageUpload bucket="service-images" path="partner-marquee" value={marqueeForm.logo} onChange={url => setMarqueeForm({...marqueeForm, logo: url})} label="Logo" />
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

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowGalleryModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
              <h3 className="text-xl font-bold">{editingGalleryIndex !== null ? 'Edit Galeri' : 'Tambah Galeri'}</h3>
              <button onClick={() => setShowGalleryModal(false)}><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Judul" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Lokasi" value={galleryForm.location} onChange={e => setGalleryForm({...galleryForm, location: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Kategori" value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Tahun" value={galleryForm.year} onChange={e => setGalleryForm({...galleryForm, year: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Deskripsi" value={galleryForm.description} onChange={e => setGalleryForm({...galleryForm, description: e.target.value})} rows={2} className="w-full border rounded p-2" />

              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">📸 Gambar Galeri ({galleryForm.images.length})</h4>
                  <button onClick={addGalleryImage} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                    <FiPlus size={14} /> Tambah Gambar
                  </button>
                </div>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {galleryForm.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-600">Gambar #{imgIdx + 1}</span>
                        <button onClick={() => removeGalleryImage(imgIdx)} className="text-red-500 text-sm">Hapus</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="md:col-span-1">
                          <ImageUpload
                            bucket="service-images"
                            path={`gallery/${galleryForm.title || 'untitled'}`}
                            value={img.url}
                            onChange={(url) => updateGalleryImage(imgIdx, 'url', url)}
                            label="Upload Foto"
                          />
                        </div>
                        <input
                          placeholder="Judul Foto"
                          value={img.title || ''}
                          onChange={(e) => updateGalleryImage(imgIdx, 'title', e.target.value)}
                          className="border rounded p-2 text-sm"
                        />
                        <input
                          placeholder="Caption"
                          value={img.caption || ''}
                          onChange={(e) => updateGalleryImage(imgIdx, 'caption', e.target.value)}
                          className="border rounded p-2 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  {galleryForm.images.length === 0 && (
                    <p className="text-gray-400 text-center py-4 text-sm">Belum ada gambar. Klik "Tambah Gambar" untuk upload.</p>
                  )}
                </div>
              </div>

              <button onClick={saveGalleryItem} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Galeri</button>
            </div>
          </div>
        </div>
      )}

      {/* Case Study Modal */}
      {showCaseModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCaseModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{editingCaseIndex !== null ? 'Edit Studi Kasus' : 'Tambah Studi Kasus'}</h3>
            <div className="space-y-2">
              <input placeholder="Judul" value={caseForm.title} onChange={e => setCaseForm({...caseForm, title: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Klien" value={caseForm.client} onChange={e => setCaseForm({...caseForm, client: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Tahun" value={caseForm.year} onChange={e => setCaseForm({...caseForm, year: e.target.value})} className="w-full border rounded p-2" />
              <textarea placeholder="Tantangan" value={caseForm.challenge} onChange={e => setCaseForm({...caseForm, challenge: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <textarea placeholder="Solusi" value={caseForm.solution} onChange={e => setCaseForm({...caseForm, solution: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <textarea placeholder="Hasil" value={caseForm.result} onChange={e => setCaseForm({...caseForm, result: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <ImageUpload bucket="service-images" path="case-studies" value={caseForm.image} onChange={url => setCaseForm({...caseForm, image: url})} label="Gambar" />
              <button onClick={saveCaseItem} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowProjectModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
              <h3 className="text-xl font-bold">{editingProject ? 'Edit Proyek' : 'Tambah Proyek'}</h3>
              <button onClick={() => setShowProjectModal(false)}><FiX size={24} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Judul" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="border rounded p-2" />
              <input placeholder="Slug (kosongkan otomatis)" value={projectForm.slug} onChange={e => setProjectForm({...projectForm, slug: e.target.value})} className="border rounded p-2" />
              <select value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} className="border rounded p-2">
                <option value="">Pilih Kategori</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="urban">Urban</option>
                <option value="engineering">Engineering</option>
                <option value="energy">Energy</option>
                <option value="conservation">Conservation</option>
                <option value="tourism">Tourism</option>
                <option value="environment">Environment</option>
                <option value="technology">Technology</option>
                <option value="water">Water</option>
              </select>
              <input placeholder="Provinsi" value={projectForm.province} onChange={e => setProjectForm({...projectForm, province: e.target.value})} className="border rounded p-2" />
              <input placeholder="Kota" value={projectForm.city} onChange={e => setProjectForm({...projectForm, city: e.target.value})} className="border rounded p-2" />
              <input type="number" placeholder="Tahun" value={projectForm.year} onChange={e => setProjectForm({...projectForm, year: parseInt(e.target.value, 10)})} className="border rounded p-2" />
              <div className="col-span-2"><ImageUpload bucket="service-images" path="projects" value={projectForm.image} onChange={url => setProjectForm({...projectForm, image: url})} label="Gambar" /></div>
              <textarea placeholder="Deskripsi" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} rows={2} className="border rounded p-2 col-span-2" />
              <input type="number" placeholder="Progress (0-100)" value={projectForm.progress} onChange={e => setProjectForm({...projectForm, progress: parseInt(e.target.value, 10)})} className="border rounded p-2" />
              <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value as 'ongoing' | 'completed'})} className="border rounded p-2">
                <option value="ongoing">Berjalan</option>
                <option value="completed">Selesai</option>
              </select>
              <input placeholder="Klien" value={projectForm.client} onChange={e => setProjectForm({...projectForm, client: e.target.value})} className="border rounded p-2" />
              <input placeholder="Nilai (Rp)" value={projectForm.value} onChange={e => setProjectForm({...projectForm, value: e.target.value})} className="border rounded p-2" />
              <input placeholder="Layanan" value={projectForm.service} onChange={e => setProjectForm({...projectForm, service: e.target.value})} className="border rounded p-2" />

              <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">📍 Koordinat (Latitude, Longitude)</label>
                <p className="text-xs text-gray-500 mb-2">Digunakan untuk peta sebaran proyek.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Latitude</label>
                    <input type="number" step="any" placeholder="contoh: -6.2088" value={projectForm.lat} onChange={e => setProjectForm({...projectForm, lat: parseFloat(e.target.value)})} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Longitude</label>
                    <input type="number" step="any" placeholder="contoh: 106.8456" value={projectForm.lng} onChange={e => setProjectForm({...projectForm, lng: parseFloat(e.target.value)})} className="w-full border rounded p-2" />
                  </div>
                </div>
              </div>
            </div>
            <button onClick={saveProject} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Proyek</button>
          </div>
        </div>
      )}
    </div>
  )
}