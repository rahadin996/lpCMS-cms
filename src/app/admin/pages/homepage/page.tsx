// src/app/admin/pages/homepage/page.tsx
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

interface MarqueeItem {
  name: string
  logo: string
}

interface StatItem {
  icon: string
  value: number
  label: string
  suffix: string
  gradient: string
}

interface ServiceItem {
  title: string
  desc: string
  icon: string
  link: string
  features: string[]
}

interface PortfolioItem {
  title: string
  location: string
  year: number
  image: string
  category: string
  size: 'large' | 'medium' | 'small'
}

interface AwardItem {
  title: string
  organizer: string
  year: number
  icon: string
}

// ===== Personil (dari database) =====
interface Personil {
  id: number
  nama: string
  noHp: string
  posisi: string
  lulusan: string
  tahunLulus: number
  deskripsi: string
  image: string
  keahlian: string[]
}

interface TestimonialItem {
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

interface ArticleItem {
  title: string
  desc: string
  date: string
  readTime: string
  image: string
  link: string
}

interface CtaContent {
  title: string
  description: string
  placeholder: string
  button_text: string
}

// ========== DEFAULT DATA ==========
const DEFAULT_SLIDES: SlideItem[] = [
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop",
    badge: "LPPSLH - EST. 1998",
    title: "Konsultan Teknik & Manajemen",
    highlight: "Pendidikan dan Pemberdayaan Masyarakat",
    description: "LPPSLH – mitra strategis dalam perencanaan wilayah, konsultansi lingkungan, dan manajemen proyek berkelanjutan."
  },
  {
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop",
    badge: "KONSULTANSI LINGKUNGAN",
    title: "Solusi Ramah Lingkungan",
    highlight: "Untuk Masa Depan Berkelanjutan",
    description: "Kajian AMDAL, UKL-UPL, dan strategi hijau yang terintegrasi untuk proyek Anda."
  },
  {
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1920&h=1080&fit=crop",
    badge: "PEMBERDAYAAN MASYARAKAT",
    title: "Bersama Masyarakat",
    highlight: "Membangun Negeri",
    description: "Program capacity building dan partisipasi publik untuk kesejahteraan bersama."
  },
  {
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&h=1080&fit=crop",
    badge: "INOVASI TEKNOLOGI",
    title: "Digital Twin & Smart City",
    highlight: "Masa Depan Infrastruktur",
    description: "Integrasi IoT, AI, dan cloud untuk efisiensi dan akurasi perencanaan."
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

// ========== NAV ITEMS ==========
const navItems = [
  { key: 'hero_slides', label: '🎞️ Hero Slideshow' },
  { key: 'marquee', label: '🔄 Partner Marquee' },
  { key: 'stats', label: '📊 Statistik' },
  { key: 'services', label: '🛠️ Layanan' },
  { key: 'portfolio', label: '🎨 Portofolio' },
  { key: 'awards', label: '🏆 Penghargaan' },
  { key: 'team', label: '👥 Tim Ahli (Personil)' },
  { key: 'testimonials', label: '💬 Testimonial' },
  { key: 'faqs', label: '❓ FAQ' },
  { key: 'articles', label: '📝 Artikel' },
  { key: 'cta', label: '🎯 CTA' },
]

// ========== MAIN COMPONENT ==========
export default function EditHomepagePage() {
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

  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([])
  const [savingMarquee, setSavingMarquee] = useState(false)
  const [showMarqueeModal, setShowMarqueeModal] = useState(false)
  const [editingMarqueeIndex, setEditingMarqueeIndex] = useState<number | null>(null)
  const [marqueeForm, setMarqueeForm] = useState<MarqueeItem>({ name: '', logo: '' })

  const [stats, setStats] = useState<StatItem[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [awards, setAwards] = useState<AwardItem[]>([])

  // ===== TEAM (Personil dari database) =====
  const [team, setTeam] = useState<Personil[]>([])
  const [loadingPersonil, setLoadingPersonil] = useState(false)
  const [showPersonilModal, setShowPersonilModal] = useState(false)
  const [editingPersonilIndex, setEditingPersonilIndex] = useState<number | null>(null)
  const [personilForm, setPersonilForm] = useState<Personil>({
    id: 0,
    nama: '',
    noHp: '',
    posisi: '',
    lulusan: '',
    tahunLulus: new Date().getFullYear(),
    deskripsi: '',
    image: '',
    keahlian: []
  })

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [cta, setCta] = useState<CtaContent>({
    title: 'Siap Mewujudkan Proyek Anda?',
    description: 'Konsultasikan kebutuhan Anda dengan tim ahli kami secara gratis.',
    placeholder: 'Alamat email',
    button_text: 'Hubungi Kami'
  })

  // ========== FUNGSI CRUD PERSONIL ==========
  const fetchPersonil = async () => {
    setLoadingPersonil(true)
    const { data, error } = await supabase
      .from('personil')
      .select('*')
      .order('id', { ascending: true })
    if (!error && data) {
      setTeam(data)
    } else {
      console.error('Error fetch personil:', error)
    }
    setLoadingPersonil(false)
  }

  const savePersonil = async (personil: Personil) => {
    const { error } = await supabase
      .from('personil')
      .upsert({ 
        id: personil.id || undefined,
        nama: personil.nama,
        no_hp: personil.noHp,
        posisi: personil.posisi,
        lulusan: personil.lulusan,
        tahun_lulus: personil.tahunLulus,
        deskripsi: personil.deskripsi,
        image: personil.image,
        keahlian: personil.keahlian
      }, { onConflict: 'id' })
    if (error) {
      console.error('Error saving personil:', error)
      throw error
    }
    await fetchPersonil()
  }

  const deletePersonil = async (id: number) => {
    if (!confirm('Hapus personil ini?')) return
    const { error } = await supabase
      .from('personil')
      .delete()
      .eq('id', id)
    if (error) {
      console.error('Error deleting personil:', error)
      throw error
    }
    await fetchPersonil()
  }

  // ========== SAVE SECTION ==========
  const saveSection = async (section: string, data: any) => {
    const { error } = await supabase
      .from('page_contents')
      .upsert({ page: 'homepage', section, key: 'data', value: JSON.stringify(data) }, { onConflict: 'page, section, key' })
    if (error) throw error
  }

  // ========== AUTO-SAVE SLIDESHOW ==========
  const saveHeroSlidesToDb = async (slides: SlideItem[]) => {
    setSavingSlide(true)
    try {
      await saveSection('hero_slides', slides)
      setMessage({ text: '✅ Slide berhasil disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) {
      setMessage({ text: `❌ Gagal simpan slide: ${err.message}`, type: 'error' })
    } finally { setSavingSlide(false) }
  }

  const addSlide = (s: SlideItem) => { const updated = [...heroSlides, s]; setHeroSlides(updated); saveHeroSlidesToDb(updated) }
  const updateSlide = (i: number, s: SlideItem) => { const updated = [...heroSlides]; updated[i] = s; setHeroSlides(updated); saveHeroSlidesToDb(updated) }
  const deleteSlide = (i: number) => { if (!confirm('Hapus slide ini?')) return; const updated = heroSlides.filter((_, idx) => idx !== i); setHeroSlides(updated); saveHeroSlidesToDb(updated) }
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
      await saveSection('partner_marquee', items)
      setMessage({ text: '✅ Marquee mitra berhasil disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) {
      setMessage({ text: `❌ Gagal simpan marquee: ${err.message}`, type: 'error' })
    } finally { setSavingMarquee(false) }
  }

  const addMarqueeItem = (item: MarqueeItem) => { const updated = [...marqueeItems, item]; setMarqueeItems(updated); saveMarqueeToDb(updated) }
  const updateMarqueeItem = (i: number, item: MarqueeItem) => { const updated = [...marqueeItems]; updated[i] = item; setMarqueeItems(updated); saveMarqueeToDb(updated) }
  const deleteMarqueeItem = (i: number) => { if (!confirm('Hapus item marquee ini?')) return; const updated = marqueeItems.filter((_, idx) => idx !== i); setMarqueeItems(updated); saveMarqueeToDb(updated) }

  // ========== SAVE ALL ==========
  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await saveSection('stats', stats)
      await saveSection('services', services)
      await saveSection('portfolio', portfolio)
      await saveSection('awards', awards)
      // team sudah disimpan langsung ke tabel personil
      await saveSection('testimonials', testimonials)
      await saveSection('faqs', faqs)
      await saveSection('articles', articles)
      await saveSection('cta', cta)
      setMessage({ text: '✅ Semua konten (kecuali Tim Ahli) berhasil disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal menyimpan: ' + err.message, type: 'error' })
    } finally { setSaving(false) }
  }

  // ========== FETCH DATA ==========
  useEffect(() => {
    const fetchAll = async () => {
      await fetchPersonil()

      const { data: contentData } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'homepage')
        .eq('key', 'data')

      contentData?.forEach((item: any) => {
        try {
          const parsed = JSON.parse(item.value)
          if (item.section === 'hero_slides') setHeroSlides(parsed)
          if (item.section === 'partner_marquee') setMarqueeItems(parsed)
          if (item.section === 'stats') setStats(parsed)
          if (item.section === 'services') setServices(parsed)
          if (item.section === 'portfolio') setPortfolio(parsed)
          if (item.section === 'awards') setAwards(parsed)
          if (item.section === 'testimonials') setTestimonials(parsed)
          if (item.section === 'faqs') setFaqs(parsed)
          if (item.section === 'articles') setArticles(parsed)
          if (item.section === 'cta') setCta(prev => ({ ...prev, ...parsed }))
        } catch (e) { console.error(e) }
      })

      const { data: existingSlides } = await supabase.from('page_contents').select('id').eq('page', 'homepage').eq('section', 'hero_slides').maybeSingle()
      if (!existingSlides) { await saveHeroSlidesToDb(DEFAULT_SLIDES); setHeroSlides(DEFAULT_SLIDES) }

      const { data: existingMarquee } = await supabase.from('page_contents').select('id').eq('page', 'homepage').eq('section', 'partner_marquee').maybeSingle()
      if (!existingMarquee) { await saveMarqueeToDb(DEFAULT_MARQUEE); setMarqueeItems(DEFAULT_MARQUEE) }

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

      case 'stats':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">📊 Statistik</h2>
              <button onClick={() => addArrayItem(setStats, stats, { icon: 'FiBriefcase', value: 0, label: 'Stat Baru', suffix: '', gradient: 'from-blue-500 to-cyan-500' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Stat</button>
            </div>
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
          </div>
        )

      case 'services':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🛠️ Layanan</h2>
              <button onClick={() => addArrayItem(setServices, services, { title: '', desc: '', icon: 'FiCompass', link: '', features: [] })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Layanan</button>
            </div>
            {services.map((svc, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input value={svc.title} onChange={e => updateArrayItem(setServices, services, idx, 'title', e.target.value)} className="border rounded p-2" placeholder="Judul" />
                  <input value={svc.desc} onChange={e => updateArrayItem(setServices, services, idx, 'desc', e.target.value)} className="border rounded p-2" placeholder="Deskripsi" />
                  <input value={svc.icon} onChange={e => updateArrayItem(setServices, services, idx, 'icon', e.target.value)} className="border rounded p-2" placeholder="Icon" />
                  <input value={svc.link} onChange={e => updateArrayItem(setServices, services, idx, 'link', e.target.value)} className="border rounded p-2" placeholder="Link" />
                  <input value={(svc.features || []).join(', ')} onChange={e => updateArrayItem(setServices, services, idx, 'features', e.target.value.split(',').map(f => f.trim()).filter(f => f))} className="border rounded p-2 col-span-2" placeholder="Fitur (pisahkan koma)" />
                </div>
                <button onClick={() => removeArrayItem(setServices, services, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'portfolio':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🎨 Portofolio</h2>
              <button onClick={() => addArrayItem(setPortfolio, portfolio, { title: '', location: '', year: new Date().getFullYear(), image: '', category: 'infrastructure', size: 'medium' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Portofolio</button>
            </div>
            {portfolio.map((item, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <input value={item.title} onChange={e => updateArrayItem(setPortfolio, portfolio, idx, 'title', e.target.value)} className="border rounded p-2" placeholder="Judul" />
                  <input value={item.location} onChange={e => updateArrayItem(setPortfolio, portfolio, idx, 'location', e.target.value)} className="border rounded p-2" placeholder="Lokasi" />
                  <input type="number" value={item.year} onChange={e => updateArrayItem(setPortfolio, portfolio, idx, 'year', Number(e.target.value))} className="border rounded p-2" placeholder="Tahun" />
                  <input value={item.category} onChange={e => updateArrayItem(setPortfolio, portfolio, idx, 'category', e.target.value)} className="border rounded p-2" placeholder="Kategori" />
                  <select value={item.size} onChange={e => updateArrayItem(setPortfolio, portfolio, idx, 'size', e.target.value)} className="border rounded p-2">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                  <ImageUpload bucket="service-images" path="portfolio" value={item.image} onChange={url => updateArrayItem(setPortfolio, portfolio, idx, 'image', url)} label="Gambar" />
                </div>
                <button onClick={() => removeArrayItem(setPortfolio, portfolio, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'awards':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🏆 Penghargaan</h2>
              <button onClick={() => addArrayItem(setAwards, awards, { title: '', organizer: '', year: new Date().getFullYear(), icon: 'FiAward' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Penghargaan</button>
            </div>
            {awards.map((award, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  <input value={award.title} onChange={e => updateArrayItem(setAwards, awards, idx, 'title', e.target.value)} className="border rounded p-2" placeholder="Judul" />
                  <input value={award.organizer} onChange={e => updateArrayItem(setAwards, awards, idx, 'organizer', e.target.value)} className="border rounded p-2" placeholder="Penyelenggara" />
                  <input type="number" value={award.year} onChange={e => updateArrayItem(setAwards, awards, idx, 'year', Number(e.target.value))} className="border rounded p-2" placeholder="Tahun" />
                  <input value={award.icon} onChange={e => updateArrayItem(setAwards, awards, idx, 'icon', e.target.value)} className="border rounded p-2" placeholder="Icon" />
                </div>
                <button onClick={() => removeArrayItem(setAwards, awards, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'team':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">👥 Tim Ahli (Personil)</h2>
              <button onClick={() => { 
                setEditingPersonilIndex(null); 
                setPersonilForm({ id: 0, nama: '', noHp: '', posisi: '', lulusan: '', tahunLulus: new Date().getFullYear(), deskripsi: '', image: '', keahlian: [] }); 
                setShowPersonilModal(true) 
              }} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
                <FiPlus /> Tambah Personil
              </button>
            </div>
            {loadingPersonil && <div className="text-xs text-blue-500 mb-2">Memuat personil...</div>}
            {team.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Belum ada personil.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {team.map((personil, idx) => (
                  <div key={personil.id} className="border rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={personil.image} alt={personil.nama} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">{personil.nama}</div>
                      <div className="text-sm text-gray-600">{personil.posisi}</div>
                      <div className="text-xs text-gray-400">{personil.lulusan} • {personil.tahunLulus}</div>
                      {personil.keahlian && personil.keahlian.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {personil.keahlian.map((skill, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { 
                        setEditingPersonilIndex(idx); 
                        setPersonilForm({ ...personil }); 
                        setShowPersonilModal(true) 
                      }} className="text-blue-600 p-1"><FiEdit /></button>
                      <button onClick={() => deletePersonil(personil.id)} className="text-red-600 p-1"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'testimonials':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">💬 Testimonial</h2>
              <button onClick={() => addArrayItem(setTestimonials, testimonials, { name: '', role: '', text: '', rating: 5, avatar: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Testimonial</button>
            </div>
            {testimonials.map((test, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input value={test.name} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'name', e.target.value)} className="border rounded p-2" placeholder="Nama" />
                  <input value={test.role} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'role', e.target.value)} className="border rounded p-2" placeholder="Role" />
                  <textarea value={test.text} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'text', e.target.value)} rows={2} className="border rounded p-2 col-span-2" placeholder="Testimonial" />
                  <input type="number" value={test.rating} onChange={e => updateArrayItem(setTestimonials, testimonials, idx, 'rating', Number(e.target.value))} className="border rounded p-2" placeholder="Rating (1-5)" />
                  <ImageUpload bucket="service-images" path="testimonials" value={test.avatar} onChange={url => updateArrayItem(setTestimonials, testimonials, idx, 'avatar', url)} label="Avatar" />
                </div>
                <button onClick={() => removeArrayItem(setTestimonials, testimonials, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'faqs':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">❓ FAQ</h2>
              <button onClick={() => addArrayItem(setFaqs, faqs, { q: '', a: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah FAQ</button>
            </div>
            {faqs.map((faq, idx) => (
              <div key={idx} className="border p-3 rounded mb-3 bg-gray-50">
                <input value={faq.q} onChange={e => updateArrayItem(setFaqs, faqs, idx, 'q', e.target.value)} className="border rounded p-2 w-full mb-1" placeholder="Pertanyaan" />
                <textarea value={faq.a} onChange={e => updateArrayItem(setFaqs, faqs, idx, 'a', e.target.value)} rows={2} className="border rounded p-2 w-full" placeholder="Jawaban" />
                <button onClick={() => removeArrayItem(setFaqs, faqs, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'articles':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">📝 Artikel</h2>
              <button onClick={() => addArrayItem(setArticles, articles, { title: '', desc: '', date: '', readTime: '', image: '', link: '' })} className="bg-blue-600 text-white px-4 py-2 rounded-lg"><FiPlus /> Tambah Artikel</button>
            </div>
            {articles.map((article, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input value={article.title} onChange={e => updateArrayItem(setArticles, articles, idx, 'title', e.target.value)} className="border rounded p-2" placeholder="Judul" />
                  <input value={article.desc} onChange={e => updateArrayItem(setArticles, articles, idx, 'desc', e.target.value)} className="border rounded p-2" placeholder="Deskripsi" />
                  <input value={article.date} onChange={e => updateArrayItem(setArticles, articles, idx, 'date', e.target.value)} className="border rounded p-2" placeholder="Tanggal" />
                  <input value={article.readTime} onChange={e => updateArrayItem(setArticles, articles, idx, 'readTime', e.target.value)} className="border rounded p-2" placeholder="Waktu Baca" />
                  <input value={article.link} onChange={e => updateArrayItem(setArticles, articles, idx, 'link', e.target.value)} className="border rounded p-2" placeholder="Link" />
                  <ImageUpload bucket="service-images" path="articles" value={article.image} onChange={url => updateArrayItem(setArticles, articles, idx, 'image', url)} label="Gambar" />
                </div>
                <button onClick={() => removeArrayItem(setArticles, articles, idx)} className="text-red-500 text-sm mt-2">Hapus</button>
              </div>
            ))}
          </div>
        )

      case 'cta':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">🎯 CTA Section</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={cta.title} onChange={e => setCta({...cta, title: e.target.value})} className="border rounded-lg p-2" placeholder="Judul" />
              <input value={cta.description} onChange={e => setCta({...cta, description: e.target.value})} className="border rounded-lg p-2" placeholder="Deskripsi" />
              <input value={cta.placeholder} onChange={e => setCta({...cta, placeholder: e.target.value})} className="border rounded-lg p-2" placeholder="Placeholder Email" />
              <input value={cta.button_text} onChange={e => setCta({...cta, button_text: e.target.value})} className="border rounded-lg p-2" placeholder="Teks Tombol" />
            </div>
          </div>
        )

      default:
        return <p>Pilih section di sidebar</p>
    }
  }

  // ========== HELPER ==========
  const addArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], defaultItem: T) => setter([...current, defaultItem])
  const removeArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], index: number) => setter(current.filter((_, i) => i !== index))
  const updateArrayItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, current: T[], index: number, field: keyof T, value: any) => {
    const newArr = [...current]
    newArr[index][field] = value
    setter(newArr)
  }

  // ========== RENDER ==========
  return (
    <div className="flex gap-6">
      {/* Sidebar Navigasi */}
      <AdminSectionNav
        items={navItems}
        activeKey={activeSection}
        onSelect={setActiveSection}
      />

      {/* Konten */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Halaman Homepage</h2>
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

      {/* ========== MODAL SLIDE ========== */}
      {showSlideModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowSlideModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
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
              }} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Slide</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL MARQUEE ========== */}
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

      {/* ========== MODAL PERSONIL ========== */}
      {showPersonilModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPersonilModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingPersonilIndex !== null ? 'Edit Personil' : 'Tambah Personil'}</h3>
              <button onClick={() => setShowPersonilModal(false)}><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <ImageUpload bucket="service-images" path="personil" value={personilForm.image} onChange={url => setPersonilForm({...personilForm, image: url})} label="Foto" />
              <input placeholder="Nama Lengkap" value={personilForm.nama} onChange={e => setPersonilForm({...personilForm, nama: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="No HP" value={personilForm.noHp} onChange={e => setPersonilForm({...personilForm, noHp: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Posisi" value={personilForm.posisi} onChange={e => setPersonilForm({...personilForm, posisi: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Lulusan" value={personilForm.lulusan} onChange={e => setPersonilForm({...personilForm, lulusan: e.target.value})} className="w-full border rounded p-2" />
              <input type="number" placeholder="Tahun Lulus" value={personilForm.tahunLulus} onChange={e => setPersonilForm({...personilForm, tahunLulus: Number(e.target.value)})} className="w-full border rounded p-2" />
              <textarea placeholder="Deskripsi" value={personilForm.deskripsi} onChange={e => setPersonilForm({...personilForm, deskripsi: e.target.value})} rows={2} className="w-full border rounded p-2" />
              <input placeholder="Keahlian (pisahkan dengan koma)" value={personilForm.keahlian.join(', ')} onChange={e => setPersonilForm({...personilForm, keahlian: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} className="w-full border rounded p-2" />
              <button onClick={async () => {
                if (!personilForm.nama || !personilForm.posisi) { alert('Nama dan Posisi wajib diisi'); return }
                try {
                  await savePersonil(personilForm)
                  setShowPersonilModal(false)
                  setMessage({ text: `✅ ${personilForm.id ? 'Diperbarui' : 'Ditambahkan'}`, type: 'success' })
                  setTimeout(() => setMessage({ text: '', type: '' }), 2000)
                } catch (err: any) {
                  alert('Gagal menyimpan: ' + err.message)
                }
              }} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">
                Simpan Personil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}