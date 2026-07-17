// src/app/admin/faq/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminSectionNav from '@/components/admin/AdminSectionNav'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  FiPlus, FiEdit2, FiTrash2, FiSave, FiLoader, FiRefreshCw,
  FiArrowUp, FiArrowDown, FiX, FiChevronDown, FiChevronUp
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

interface FaqItem {
  id: number
  q: string
  a: string
  order: number
  created_at?: string
}

interface Message {
  text: string
  type: 'success' | 'error' | ''
}

// ========== CONSTANTS ==========
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
    badge: 'PERTANYAAN UMUM',
    title: 'Jawaban atas',
    highlight: 'Semua Pertanyaan Anda',
    description: 'Temukan informasi lengkap tentang layanan, prosedur, dan kebijakan LPPSLH.',
    order: 0
  },
  {
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop',
    badge: 'LAYANAN KAMI',
    title: 'Konsultansi Profesional',
    highlight: 'Solusi Terpercaya',
    description: 'Mulai dari perencanaan strategis hingga konsultansi lingkungan dan manajemen proyek.',
    order: 1
  },
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop',
    badge: 'DUKUNG KAMI',
    title: 'Tim Ahli Siap',
    highlight: 'Membantu Anda',
    description: 'Customer service kami siap menjawab setiap pertanyaan Anda dengan cepat dan tepat.',
    order: 2
  }
]

const DEFAULT_FAQS: FaqItem[] = [
  { id: 1, q: 'Apa saja layanan unggulan LPPSLH?', a: 'Kami menyediakan perencanaan strategis, konsultansi lingkungan, manajemen proyek, GIS, kajian kelayakan, pemberdayaan masyarakat, transformasi digital, dan konsultasi hukum.', order: 0 },
  { id: 2, q: 'Bagaimana cara memulai konsultasi dengan LPPSLH?', a: 'Anda dapat mengisi form kontak di halaman Contact atau menghubungi langsung nomor telepon kami. Tim kami akan merespon dalam 24 jam.', order: 1 },
  { id: 3, q: 'Apakah LPPSLH memiliki pengalaman internasional?', a: 'Ya, kami telah mengerjakan proyek di beberapa negara Asia Tenggara dan bekerjasama dengan lembaga internasional seperti World Bank dan ADB.', order: 2 },
  { id: 4, q: 'Berapa lama waktu penyelesaian proyek konsultansi?', a: 'Tergantung kompleksitas proyek. Rata-rata studi kelayakan memakan waktu 3-6 bulan, sedangkan perencanaan masterplan 6-12 bulan.', order: 3 },
  { id: 5, q: 'Apakah LPPSLH menyediakan pelatihan?', a: 'Ya, kami memiliki program capacity building untuk pemerintah daerah dan swasta, termasuk workshop dan sertifikasi.', order: 4 },
  { id: 6, q: 'Bagaimana sistem pembayaran jasa konsultansi?', a: 'Kami menerapkan sistem termin berdasarkan progress pekerjaan, sesuai kesepakatan dalam kontrak.', order: 5 },
  { id: 7, q: 'Apakah LPPSLH memiliki tenaga ahli bersertifikasi?', a: 'Ya, seluruh tenaga ahli kami memiliki sertifikasi nasional maupun internasional di bidangnya.', order: 6 },
  { id: 8, q: 'Bagaimana cara bergabung menjadi mitra atau karyawan?', a: 'Silakan kunjungi halaman Careers untuk melihat lowongan terbuka atau kirim CV spontan melalui form kontak.', order: 7 }
]

const NAV_ITEMS = [
  { key: 'slides', label: '🎞️ Hero Slideshow' },
  { key: 'faqs', label: '❓ Daftar FAQ' },
]

// ========== MAIN COMPONENT ==========
export default function AdminFaqPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState('slides')

  // Hero Slides
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES)
  const [savingSlides, setSavingSlides] = useState(false)

  // FAQ
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS)

  // Modal Slide
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [slideForm, setSlideForm] = useState<HeroSlide>({
    image: '', badge: '', title: '', highlight: '', description: '', order: 0
  })

  // Modal FAQ
  const [showFaqModal, setShowFaqModal] = useState(false)
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null)
  const [faqForm, setFaqForm] = useState<FaqItem>({ id: 0, q: '', a: '', order: 0 })

  // ========== FETCH DATA ==========
  const fetchAllData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'faq')
        .eq('key', 'data')

      if (error) throw error

      if (data && data.length > 0) {
        data.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            if (item.section === 'slides') {
              const sorted = parsed.sort((a: HeroSlide, b: HeroSlide) => (a.order || 0) - (b.order || 0))
              setSlides(sorted)
            } else if (item.section === 'faqs') {
              const sorted = parsed.sort((a: FaqItem, b: FaqItem) => (a.order || 0) - (b.order || 0))
              setFaqs(sorted)
            }
          } catch (e) { console.error('Parse error', e) }
        })
      }
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
        { page: 'faq', section, key: 'data', value: JSON.stringify(data) },
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
      await saveSection('faqs', faqs)
      setMessage({ text: '✅ Semua konten FAQ disimpan!', type: 'success' })
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

  // ========== FAQ CRUD ==========
  const addFaq = (newFaq: FaqItem) => {
    const updated = [...faqs, { ...newFaq, id: Date.now(), order: faqs.length }]
    setFaqs(updated)
  }

  const updateFaq = (id: number, updatedFaq: FaqItem) => {
    const updated = faqs.map(f => f.id === id ? { ...updatedFaq, id } : f)
    setFaqs(updated)
  }

  const deleteFaq = (id: number) => {
    if (!confirm('Hapus FAQ ini?')) return
    const updated = faqs.filter(f => f.id !== id).map((f, i) => ({ ...f, order: i }))
    setFaqs(updated)
  }

  const moveFaq = (id: number, direction: 'up' | 'down') => {
    const index = faqs.findIndex(f => f.id === id)
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === faqs.length - 1) return
    const newFaqs = [...faqs]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newFaqs[index], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[index]]
    newFaqs.forEach((f, idx) => { f.order = idx })
    setFaqs(newFaqs)
  }

  const openAddFaqModal = () => {
    setEditingFaqId(null)
    setFaqForm({ id: 0, q: '', a: '', order: faqs.length })
    setShowFaqModal(true)
  }

  const openEditFaqModal = (faq: FaqItem) => {
    setEditingFaqId(faq.id)
    setFaqForm({ ...faq })
    setShowFaqModal(true)
  }

  const saveFaqFromModal = () => {
    if (!faqForm.q.trim() || !faqForm.a.trim()) {
      alert('Pertanyaan dan Jawaban wajib diisi')
      return
    }
    if (editingFaqId !== null) {
      updateFaq(editingFaqId, faqForm)
    } else {
      addFaq(faqForm)
    }
    setShowFaqModal(false)
  }

  // ========== RENDER SECTION ==========
  const renderSection = () => {
    switch (activeSection) {
      case 'slides':
        return renderSlidesSection()
      case 'faqs':
        return renderFaqsSection()
      default:
        return <p>Pilih section di sidebar</p>
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

  // ========== RENDER FAQS ==========
  const renderFaqsSection = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">❓ Daftar FAQ</h2>
          <button onClick={openAddFaqModal} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
            <FiPlus /> Tambah FAQ
          </button>
        </div>
        {faqs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Belum ada FAQ.</p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="border rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{idx + 1}. {faq.q}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{faq.a}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => moveFaq(faq.id, 'up')} disabled={idx === 0} className="p-1 disabled:opacity-30"><FiArrowUp /></button>
                  <button onClick={() => moveFaq(faq.id, 'down')} disabled={idx === faqs.length-1} className="p-1 disabled:opacity-30"><FiArrowDown /></button>
                  <button onClick={() => openEditFaqModal(faq)} className="text-blue-600 p-1"><FiEdit2 /></button>
                  <button onClick={() => deleteFaq(faq.id)} className="text-red-600 p-1"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-3">* Jangan lupa klik "Simpan Semua" setelah mengubah FAQ.</p>
      </div>
    )
  }

  // ========== MAIN RENDER ==========
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500 mt-3">Memuat data FAQ...</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      <AdminSectionNav items={NAV_ITEMS} activeKey={activeSection} onSelect={setActiveSection} />

      <div className="flex-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Halaman FAQ</h2>
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingSlideIndex !== null ? 'Edit Hero Slide' : 'Tambah Hero Slide Baru'}</h3>
              <button onClick={() => setShowSlideModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <ImageUpload bucket="service-images" path="faq/hero-slides" value={slideForm.image} onChange={(url) => setSlideForm({...slideForm, image: url})} label="Gambar Slide (wajib)" />
              <input type="text" placeholder="Badge" value={slideForm.badge} onChange={e => setSlideForm({...slideForm, badge: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="text" placeholder="Title *" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="text" placeholder="Highlight" value={slideForm.highlight} onChange={e => setSlideForm({...slideForm, highlight: e.target.value})} className="w-full border rounded-lg p-2" />
              <textarea placeholder="Deskripsi" value={slideForm.description} onChange={e => setSlideForm({...slideForm, description: e.target.value})} className="w-full border rounded-lg p-2" rows={2} />
              <button onClick={saveSlideFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Slide</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FAQ */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingFaqId !== null ? 'Edit FAQ' : 'Tambah FAQ'}</h3>
              <button onClick={() => setShowFaqModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <textarea placeholder="Pertanyaan *" value={faqForm.q} onChange={e => setFaqForm({...faqForm, q: e.target.value})} className="w-full border rounded-lg p-2" rows={2} />
              <textarea placeholder="Jawaban *" value={faqForm.a} onChange={e => setFaqForm({...faqForm, a: e.target.value})} className="w-full border rounded-lg p-2" rows={3} />
              <button onClick={saveFaqFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan FAQ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}