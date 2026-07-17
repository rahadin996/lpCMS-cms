// src/app/admin/news/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminSectionNav from '@/components/admin/AdminSectionNav'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  FiPlus, FiEdit2, FiTrash2, FiSave, FiLoader, FiRefreshCw,
  FiArrowUp, FiArrowDown, FiX, FiStar, FiEye, FiCalendar, FiUser, FiTag, FiLink
} from 'react-icons/fi'

// ========== TYPE DEFINITIONS ==========
interface HeroSlide {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
  order: number
}

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

interface StatItem {
  icon: string
  value: number | string
  label: string
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
const CATEGORIES = ['Penghargaan', 'Acara', 'Kerjasama', 'Karir', 'Proyek', 'Pelatihan']

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=1080&fit=crop',
    badge: 'BERITA & ARTIKEL',
    title: 'Wawasan Terbaru',
    highlight: 'Dari LPPSLH',
    description: 'Ikuti perkembangan terkini seputar kegiatan, proyek, dan pencapaian LPPSLH.',
    order: 0
  },
  {
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop',
    badge: 'INOVASI & TEKNOLOGI',
    title: 'Masa Depan Infrastruktur',
    highlight: 'Berkelanjutan',
    description: 'Artikel tentang teknologi terbaru dalam perencanaan wilayah dan konsultansi lingkungan.',
    order: 1
  },
  {
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
    badge: 'PENGHARGAAN',
    title: 'Pengakuan Global',
    highlight: 'Prestasi LPPSLH',
    description: 'Berbagai penghargaan yang telah diraih oleh LPPSLH dari lembaga nasional dan internasional.',
    order: 2
  }
]

const DEFAULT_STATS: StatItem[] = [
  { icon: 'FiBookOpen', value: 120, label: 'Total Artikel', gradient: 'from-blue-500 to-cyan-500' },
  { icon: 'FiEye', value: '45k+', label: 'Total Pembaca', gradient: 'from-purple-500 to-pink-500' },
  { icon: 'FiStar', value: 15, label: 'Kategori', gradient: 'from-emerald-500 to-teal-500' },
  { icon: 'FiTrendingUp', value: '98%', label: 'Kepuasan', gradient: 'from-amber-500 to-orange-500' },
]

const DEFAULT_CTA: CtaContent = {
  title: 'Tetap Terinformasi',
  description: 'Dapatkan update berita terbaru langsung ke email Anda.',
  button_text: 'Berlangganan',
  button_link: '#'
}

const NAV_ITEMS = [
  { key: 'slides', label: '🎞️ Hero Slideshow' },
  { key: 'stats', label: '📊 Statistik' },
  { key: 'news', label: '📰 Daftar Berita' },
  { key: 'cta', label: '🎯 CTA Section' },
]

// ========== MAIN COMPONENT ==========
export default function AdminNewsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState('slides')

  // Hero Slides
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES)
  const [savingSlides, setSavingSlides] = useState(false)

  // Stats
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS)

  // News
  const [news, setNews] = useState<NewsItem[]>([])

  // CTA
  const [cta, setCta] = useState<CtaContent>(DEFAULT_CTA)

  // Modal States
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [slideForm, setSlideForm] = useState<HeroSlide>({
    image: '', badge: '', title: '', highlight: '', description: '', order: 0
  })

  const [showNewsModal, setShowNewsModal] = useState(false)
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null)
  const [newsForm, setNewsForm] = useState<NewsItem>({
    id: 0,
    title: '',
    slug: '',
    category: 'Acara',
    date: new Date().toISOString().split('T')[0],
    author: '',
    image: '',
    excerpt: '',
    content: '',
    link: '',
    views: 0,
    is_featured: false
  })

  const [showStatsModal, setShowStatsModal] = useState(false)
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null)
  const [statForm, setStatForm] = useState<StatItem>({
    icon: 'FiBookOpen', value: '', label: '', gradient: 'from-blue-500 to-cyan-500'
  })

  // ========== FETCH DATA ==========
  const fetchAllData = async () => {
    setLoading(true)
    try {
      const { data: contentData, error: contentError } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'news')
        .eq('key', 'data')

      if (contentError) throw contentError

      if (contentData) {
        contentData.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            if (item.section === 'slides') {
              const sorted = parsed.sort((a: HeroSlide, b: HeroSlide) => (a.order || 0) - (b.order || 0))
              setSlides(sorted)
            } else if (item.section === 'stats') {
              setStats(parsed)
            } else if (item.section === 'cta') {
              setCta(prev => ({ ...prev, ...parsed }))
            }
          } catch (e) { console.error('Parse error', e) }
        })
      }

      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false })

      if (newsError) throw newsError
      setNews(newsData as NewsItem[] || [])

    } catch (err: any) {
      setMessage({ text: 'Gagal memuat data: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  // ========== SAVE FUNCTIONS ==========
  const saveSection = async (section: string, data: any) => {
    const { error } = await supabase
      .from('page_contents')
      .upsert(
        { page: 'news', section, key: 'data', value: JSON.stringify(data) },
        { onConflict: 'page, section, key' }
      )
    if (error) throw error
  }

  const saveSlides = async (newSlides: HeroSlide[]) => {
    setSavingSlides(true)
    try {
      await saveSection('slides', newSlides)
      setMessage({ text: '✅ Slide berhasil disimpan', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal simpan slide: ' + err.message, type: 'error' })
    } finally {
      setSavingSlides(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setMessage({ text: '', type: '' })
    try {
      await saveSection('slides', slides)
      await saveSection('stats', stats)
      await saveSection('cta', cta)
      setMessage({ text: '✅ Semua konten news disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal menyimpan: ' + err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // ========== SLIDES CRUD ==========
  const addSlide = (newSlide: HeroSlide) => {
    const updated = [...slides, { ...newSlide, order: slides.length }]
    setSlides(updated)
    saveSlides(updated)
  }

  const updateSlide = (index: number, updatedSlide: HeroSlide) => {
    const updated = [...slides]
    updated[index] = { ...updatedSlide, order: index }
    setSlides(updated)
    saveSlides(updated)
  }

  const deleteSlide = (index: number) => {
    if (!confirm('Hapus slide ini?')) return
    const updated = slides.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }))
    setSlides(updated)
    saveSlides(updated)
  }

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === slides.length - 1) return
    const newSlides = [...slides]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]]
    newSlides.forEach((s, idx) => { s.order = idx })
    setSlides(newSlides)
    saveSlides(newSlides)
  }

  const openAddSlideModal = () => {
    setEditingSlideIndex(null)
    setSlideForm({ image: '', badge: '', title: '', highlight: '', description: '', order: slides.length })
    setShowSlideModal(true)
  }

  const openEditSlideModal = (slide: HeroSlide, idx: number) => {
    setEditingSlideIndex(idx)
    setSlideForm({ ...slide })
    setShowSlideModal(true)
  }

  const saveSlideFromModal = () => {
    if (!slideForm.image || !slideForm.title) {
      alert('Image dan Title wajib diisi')
      return
    }
    if (editingSlideIndex !== null) {
      updateSlide(editingSlideIndex, slideForm)
    } else {
      addSlide(slideForm)
    }
    setShowSlideModal(false)
  }

  // ========== STATS CRUD ==========
  const addStat = () => {
    setEditingStatIndex(null)
    setStatForm({ icon: 'FiBookOpen', value: '', label: '', gradient: 'from-blue-500 to-cyan-500' })
    setShowStatsModal(true)
  }

  const editStat = (idx: number) => {
    setEditingStatIndex(idx)
    setStatForm(stats[idx])
    setShowStatsModal(true)
  }

  const saveStat = () => {
    const newStats = [...stats]
    if (editingStatIndex !== null) {
      newStats[editingStatIndex] = statForm
    } else {
      newStats.push(statForm)
    }
    setStats(newStats)
    setShowStatsModal(false)
  }

  const removeStat = (idx: number) => setStats(stats.filter((_, i) => i !== idx))

  // ========== NEWS CRUD ==========
  const generateSlug = (text: string): string => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const openAddNewsModal = () => {
    setEditingNewsId(null)
    setNewsForm({
      id: 0,
      title: '',
      slug: '',
      category: 'Acara',
      date: new Date().toISOString().split('T')[0],
      author: '',
      image: '',
      excerpt: '',
      content: '',
      link: '',
      views: 0,
      is_featured: false
    })
    setShowNewsModal(true)
  }

  const openEditNewsModal = (item: NewsItem) => {
    setEditingNewsId(item.id)
    setNewsForm({ ...item })
    setShowNewsModal(true)
  }

  const saveNews = async () => {
    if (!newsForm.title || !newsForm.image) {
      alert('Judul dan Image wajib diisi')
      return
    }

    const slug = newsForm.slug || generateSlug(newsForm.title)
    const dataToSave = {
      title: newsForm.title,
      slug,
      category: newsForm.category,
      date: newsForm.date,
      author: newsForm.author || 'Admin LPPSLH',
      image: newsForm.image,
      excerpt: newsForm.excerpt || '',
      content: newsForm.content || '',
      link: newsForm.link || '',
      views: newsForm.views || 0,
      is_featured: newsForm.is_featured || false
    }

    try {
      let error
      if (editingNewsId) {
        const { error: e } = await supabase
          .from('news')
          .update(dataToSave)
          .eq('id', editingNewsId)
        error = e
      } else {
        const { error: e } = await supabase
          .from('news')
          .insert(dataToSave)
        error = e
      }

      if (error) throw error

      await fetchAllData()
      setShowNewsModal(false)
      setMessage({ 
        text: editingNewsId ? '✅ Berita berhasil diupdate' : '✅ Berita berhasil ditambahkan', 
        type: 'success' 
      })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      console.error('Save news error:', err)
      alert('Gagal menyimpan: ' + err.message)
    }
  }

  const deleteNews = async (id: number) => {
    if (!confirm('Yakin hapus berita ini?')) return
    try {
      const { error } = await supabase.from('news').delete().eq('id', id)
      if (error) throw error
      await fetchAllData()
      setMessage({ text: '✅ Berita berhasil dihapus', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      alert('Gagal hapus: ' + err.message)
    }
  }

  const toggleFeatured = async (id: number, current: boolean) => {
    try {
      const { error } = await supabase
        .from('news')
        .update({ is_featured: !current })
        .eq('id', id)
      if (error) throw error
      await fetchAllData()
    } catch (err: any) {
      console.error('Toggle featured error:', err)
    }
  }

  // ========== RENDER SECTION ==========
  const renderSection = () => {
    switch (activeSection) {
      case 'slides': return renderSlidesSection()
      case 'stats': return renderStatsSection()
      case 'news': return renderNewsSection()
      case 'cta': return renderCtaSection()
      default: return <p>Pilih section di sidebar</p>
    }
  }

  // ========== RENDER SLIDES ==========
  const renderSlidesSection = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">🎞️ Hero Slideshow (Auto-Save)</h2>
          <button onClick={openAddSlideModal} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
            <FiPlus /> Tambah Slide
          </button>
        </div>
        {savingSlides && <div className="text-xs text-blue-500 mb-2">Menyimpan perubahan slide...</div>}
        {slides.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Belum ada slide.</p>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, idx) => (
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
                  <button onClick={() => moveSlide(idx, 'down')} disabled={idx === slides.length-1} className="p-1 disabled:opacity-30"><FiArrowDown /></button>
                  <button onClick={() => openEditSlideModal(slide, idx)} className="text-blue-600 p-1"><FiEdit2 /></button>
                  <button onClick={() => deleteSlide(idx)} className="text-red-600 p-1"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ========== RENDER STATS ==========
  const renderStatsSection = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">📊 Statistik</h2>
          <button onClick={addStat} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
            <FiPlus /> Tambah Stat
          </button>
        </div>
        <div className="space-y-2">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/40">
              <div><span className="font-mono text-indigo-600">{stat.icon}</span> - <strong>{stat.value}</strong> {stat.label}</div>
              <div className="flex gap-2">
                <button onClick={() => editStat(idx)} className="text-amber-600 p-1"><FiEdit2 size={18} /></button>
                <button onClick={() => removeStat(idx)} className="text-red-500 p-1"><FiTrash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ========== RENDER NEWS ==========
  const renderNewsSection = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">📰 Daftar Berita</h2>
          <button onClick={openAddNewsModal} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
            <FiPlus /> Tambah Berita
          </button>
        </div>
        {news.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Belum ada berita.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2 text-left w-10">#</th>
                  <th className="p-2 text-left">Judul</th>
                  <th className="p-2 text-left hidden md:table-cell">Kategori</th>
                  <th className="p-2 text-left hidden lg:table-cell">Tanggal</th>
                  <th className="p-2 text-center w-20">Unggulan</th>
                  <th className="p-2 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item, idx) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-center text-gray-500">{idx + 1}</td>
                    <td className="p-2 font-medium text-gray-800">{item.title}</td>
                    <td className="p-2 hidden md:table-cell">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">{item.category}</span>
                    </td>
                    <td className="p-2 hidden lg:table-cell text-gray-500">{item.date}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => toggleFeatured(item.id, item.is_featured)}
                        className={`p-1 rounded ${item.is_featured ? 'text-amber-500' : 'text-gray-300'}`}
                      >
                        <FiStar size={18} />
                      </button>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditNewsModal(item)} className="text-blue-600 p-1"><FiEdit2 size={16} /></button>
                        <button onClick={() => deleteNews(item.id)} className="text-red-600 p-1"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  // ========== RENDER CTA ==========
  const renderCtaSection = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🎯 CTA Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-xl border border-gray-200 p-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={cta.title} onChange={e => setCta({...cta, title: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea value={cta.description} onChange={e => setCta({...cta, description: e.target.value})} rows={2} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Teks</label>
            <input type="text" value={cta.button_text} onChange={e => setCta({...cta, button_text: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Link</label>
            <input type="text" value={cta.button_link} onChange={e => setCta({...cta, button_link: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
        </div>
      </div>
    )
  }

  // ========== MAIN RENDER ==========
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500 mt-3">Memuat data news...</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      {/* SIDEBAR */}
      <div className="w-56 flex-shrink-0">
        <AdminSectionNav 
          items={NAV_ITEMS} 
          activeKey={activeSection} 
          onSelect={setActiveSection} 
        />
      </div>

      {/* KONTEN UTAMA */}
      <div className="flex-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl min-h-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Halaman News</h2>
          <div className="flex gap-2">
            <button onClick={fetchAllData} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition text-sm">
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

      {/* MODAL SLIDE */}
      {showSlideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingSlideIndex !== null ? 'Edit Hero Slide' : 'Tambah Hero Slide Baru'}</h3>
              <button onClick={() => setShowSlideModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <ImageUpload bucket="service-images" path="news/hero-slides" value={slideForm.image} onChange={(url) => setSlideForm({...slideForm, image: url})} label="Gambar Slide (wajib)" />
              <input type="text" placeholder="Badge" value={slideForm.badge} onChange={e => setSlideForm({...slideForm, badge: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="text" placeholder="Title *" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="text" placeholder="Highlight" value={slideForm.highlight} onChange={e => setSlideForm({...slideForm, highlight: e.target.value})} className="w-full border rounded-lg p-2" />
              <textarea placeholder="Deskripsi" value={slideForm.description} onChange={e => setSlideForm({...slideForm, description: e.target.value})} className="w-full border rounded-lg p-2" rows={2} />
              <button onClick={saveSlideFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Slide</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL STAT */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingStatIndex !== null ? 'Edit Statistik' : 'Tambah Statistik'}</h3>
              <button onClick={() => setShowStatsModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Icon (FiBookOpen, FiEye, FiStar, FiTrendingUp)" value={statForm.icon} onChange={e => setStatForm({...statForm, icon: e.target.value})} className="w-full border rounded-lg p-2" />
              <input placeholder="Value" value={statForm.value} onChange={e => setStatForm({...statForm, value: e.target.value})} className="w-full border rounded-lg p-2" />
              <input placeholder="Label" value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} className="w-full border rounded-lg p-2" />
              <input placeholder="Gradient (from-blue-500 to-cyan-500)" value={statForm.gradient} onChange={e => setStatForm({...statForm, gradient: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowStatsModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={saveStat} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NEWS - DIPERBAIKI */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-white rounded-t-2xl">
              <h3 className="text-xl font-bold">
                {editingNewsId ? '✏️ Edit Berita' : '📰 Tambah Berita Baru'}
              </h3>
              <button onClick={() => setShowNewsModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            {/* Body scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kolom kiri */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul <span className="text-red-500">*</span></label>
                    <input 
                      placeholder="Judul Berita" 
                      value={newsForm.title} 
                      onChange={e => setNewsForm({...newsForm, title: e.target.value})} 
                      className="w-full border rounded-lg p-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (kosongkan otomatis)</label>
                    <input 
                      placeholder="slug-berita" 
                      value={newsForm.slug} 
                      onChange={e => setNewsForm({...newsForm, slug: e.target.value})} 
                      className="w-full border rounded-lg p-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select 
                      value={newsForm.category} 
                      onChange={e => setNewsForm({...newsForm, category: e.target.value})} 
                      className="w-full border rounded-lg p-2"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      value={newsForm.date} 
                      onChange={e => setNewsForm({...newsForm, date: e.target.value})} 
                      className="w-full border rounded-lg p-2" 
                    />
                  </div>
                </div>

                {/* Kolom kanan */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input 
                      placeholder="Nama Penulis" 
                      value={newsForm.author} 
                      onChange={e => setNewsForm({...newsForm, author: e.target.value})} 
                      className="w-full border rounded-lg p-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Views</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={newsForm.views} 
                      onChange={e => setNewsForm({...newsForm, views: parseInt(e.target.value) || 0})} 
                      className="w-full border rounded-lg p-2" 
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="is_featured" 
                      checked={newsForm.is_featured} 
                      onChange={e => setNewsForm({...newsForm, is_featured: e.target.checked})} 
                      className="w-4 h-4" 
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Jadikan Berita Unggulan (Featured)</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (opsional)</label>
                    <input 
                      placeholder="https://example.com/artikel" 
                      value={newsForm.link || ''} 
                      onChange={e => setNewsForm({...newsForm, link: e.target.value})} 
                      className="w-full border rounded-lg p-2" 
                    />
                    <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ada link eksternal</p>
                  </div>
                </div>

                {/* Kolom penuh */}
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Berita <span className="text-red-500">*</span></label>
                    <ImageUpload 
                      bucket="service-images" 
                      path="news" 
                      value={newsForm.image} 
                      onChange={(url) => setNewsForm({...newsForm, image: url})} 
                      label="Upload Gambar" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Ringkasan)</label>
                    <textarea 
                      placeholder="Ringkasan singkat berita..." 
                      value={newsForm.excerpt} 
                      onChange={e => setNewsForm({...newsForm, excerpt: e.target.value})} 
                      rows={2} 
                      className="w-full border rounded-lg p-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (Isi Lengkap)</label>
                    <textarea 
                      placeholder="Isi berita lengkap..." 
                      value={newsForm.content} 
                      onChange={e => setNewsForm({...newsForm, content: e.target.value})} 
                      rows={5} 
                      className="w-full border rounded-lg p-2" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer sticky */}
            <div className="px-6 py-4 border-t bg-white rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={() => setShowNewsModal(false)} 
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button 
                onClick={saveNews} 
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <FiSave size={16} /> Simpan Berita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}