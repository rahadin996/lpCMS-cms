// src/app/admin/contact/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminSectionNav from '@/components/admin/AdminSectionNav'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  FiPlus, FiEdit2, FiTrash2, FiSave, FiLoader, FiMapPin, FiPhone, FiMail, FiClock,
  FiArrowUp, FiArrowDown, FiX, FiRefreshCw
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

interface OfficeInfo {
  id: number
  title: string
  address: string
  phone: string
  email: string
  hours: string
  gradient: string
  mapUrl: string
  lat: number | string
  lng: number | string
}

interface CtaContent {
  title: string
  description: string
  button_text_semarang: string
  button_link_semarang: string
  button_text_jakarta: string
  button_link_jakarta: string
}

interface Message {
  text: string
  type: 'success' | 'error' | ''
}

// ========== CONSTANTS ==========
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop',
    badge: 'HUBUNGI KAMI',
    title: 'Siap Membantu',
    highlight: 'Konsultasi & Informasi',
    description: 'Tim customer service kami siap membantu Anda Senin - Sabtu, 08.00 - 18.00.',
    order: 0
  },
  {
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
    badge: 'KANTOR KAMI',
    title: 'Lokasi Strategis',
    highlight: 'Semarang & Jakarta',
    description: 'Dua kantor yang siap melayani kebutuhan konsultasi dan kerjasama Anda.',
    order: 1
  },
  {
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop',
    badge: 'RESPON CEPAT',
    title: '24 Jam',
    highlight: 'Layanan Tanggap',
    description: 'Setiap pesan akan kami balas dalam waktu kurang dari 24 jam kerja.',
    order: 2
  }
]

const DEFAULT_OFFICES: OfficeInfo[] = [
  {
    id: 1,
    title: 'Kantor Pusat Semarang',
    address: 'Jl. Ngesrep Barat III No.30 G, Semarang, Jawa Tengah 50261',
    phone: '(024) 7472581',
    email: 'pt.lppslh@yahoo.com',
    hours: 'Senin - Jumat: 08.00 - 17.00',
    gradient: 'from-blue-500 to-cyan-500',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.705820499239!2d110.39850801477063!3d-7.027148794457813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4d3f0d7e6b%3A0x4a2b5c8d9e1f3a7c!2sJl.%20Ngesrep%20Barat%20III%2C%20Semarang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    lat: -7.0271488,
    lng: 110.398508
  },
  {
    id: 2,
    title: 'Studio Jakarta Selatan',
    address: 'Ruko Royal Palace Blok C5, Jl. Prof. DR. Soepomo No.178A, Tebet, Jakarta Selatan 12870',
    phone: '(021) 38825070',
    email: 'lppslh.konsultan.pt@gmail.com',
    hours: 'Senin - Jumat: 09.00 - 18.00',
    gradient: 'from-purple-500 to-pink-500',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.166349436707!2d106.83465011476913!3d-6.236355795484318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3b5c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sJl.%20Prof.%20DR.%20Soepomo%20No.178A%2C%20Tebet%2C%20Jakarta%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    lat: -6.2363558,
    lng: 106.8346501
  }
]

const DEFAULT_CTA: CtaContent = {
  title: 'Butuh bantuan segera?',
  description: 'Hubungi tim customer service kami langsung melalui telepon.',
  button_text_semarang: '📞 Kantor Semarang',
  button_link_semarang: 'tel:+62247472581',
  button_text_jakarta: '📞 Studio Jakarta',
  button_link_jakarta: 'tel:+622138825070'
}

const NAV_ITEMS = [
  { key: 'slides', label: '🎞️ Hero Slideshow' },
  { key: 'offices', label: '🏢 Info Kantor' },
  { key: 'cta', label: '🎯 CTA Section' },
]

const GRADIENTS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-amber-500 to-orange-500',
  'from-red-500 to-rose-500',
  'from-indigo-500 to-purple-500'
]

// ========== MAIN COMPONENT ==========
export default function AdminContactPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState('slides')

  // Hero Slides
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES)
  const [savingSlides, setSavingSlides] = useState(false)

  // Offices
  const [offices, setOffices] = useState<OfficeInfo[]>(DEFAULT_OFFICES)

  // CTA
  const [cta, setCta] = useState<CtaContent>(DEFAULT_CTA)

  // Modal
  const [showSlideModal, setShowSlideModal] = useState(false)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [slideForm, setSlideForm] = useState<HeroSlide>({
    image: '', badge: '', title: '', highlight: '', description: '', order: 0
  })

  const [showOfficeModal, setShowOfficeModal] = useState(false)
  const [editingOfficeId, setEditingOfficeId] = useState<number | null>(null)
  const [officeForm, setOfficeForm] = useState<OfficeInfo>({
    id: 0, title: '', address: '', phone: '', email: '', hours: '',
    gradient: 'from-blue-500 to-cyan-500', mapUrl: '', lat: '', lng: ''
  })

  // ========== FETCH DATA ==========
  const fetchAllData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'contact')
        .eq('key', 'data')

      if (error) throw error
      if (data) {
        data.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            if (item.section === 'slides') {
              const sorted = parsed.sort((a: HeroSlide, b: HeroSlide) => (a.order || 0) - (b.order || 0))
              setSlides(sorted)
            } else if (item.section === 'offices') {
              setOffices(parsed)
            } else if (item.section === 'cta') {
              setCta(prev => ({ ...prev, ...parsed }))
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
        { page: 'contact', section, key: 'data', value: JSON.stringify(data) },
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
      await saveSection('offices', offices)
      await saveSection('cta', cta)
      setMessage({ text: '✅ Semua konten contact disimpan!', type: 'success' })
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

  // ========== OFFICES CRUD ==========
  const addOffice = () => {
    setEditingOfficeId(null)
    setOfficeForm({
      id: Date.now(),
      title: '',
      address: '',
      phone: '',
      email: '',
      hours: '',
      gradient: 'from-blue-500 to-cyan-500',
      mapUrl: '',
      lat: '',
      lng: ''
    })
    setShowOfficeModal(true)
  }

  const editOffice = (office: OfficeInfo) => {
    setEditingOfficeId(office.id)
    setOfficeForm({ ...office })
    setShowOfficeModal(true)
  }

  const saveOffice = () => {
    const newOffice = { ...officeForm, id: editingOfficeId || Date.now() }
    if (editingOfficeId) {
      setOffices(offices.map(o => o.id === editingOfficeId ? newOffice : o))
    } else {
      setOffices([...offices, newOffice])
    }
    setShowOfficeModal(false)
  }

  const removeOffice = (id: number) => {
    if (!confirm('Hapus kantor ini?')) return
    setOffices(offices.filter(o => o.id !== id))
  }

  // ========== RENDER SECTION ==========
  const renderSection = () => {
    switch (activeSection) {
      case 'slides':
        return renderSlidesSection()
      case 'offices':
        return renderOfficesSection()
      case 'cta':
        return renderCtaSection()
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

  // ========== RENDER OFFICES ==========
  const renderOfficesSection = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">🏢 Info Kantor</h2>
          <button onClick={addOffice} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm">
            <FiPlus /> Tambah Kantor
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {offices.map((office) => (
            <div key={office.id} className="relative group bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${office.gradient} flex items-center justify-center text-white text-sm`}>
                  <FiMapPin size={14} />
                </div>
                <h3 className="font-bold text-gray-800">{office.title}</h3>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Alamat:</strong> {office.address}</p>
                <p><strong>Telepon:</strong> {office.phone}</p>
                <p><strong>Email:</strong> {office.email}</p>
                <p><strong>Jam:</strong> {office.hours}</p>
              </div>
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => editOffice(office)} className="bg-white p-1.5 rounded shadow text-blue-600"><FiEdit2 size={14} /></button>
                <button onClick={() => removeOffice(office.id)} className="bg-white p-1.5 rounded shadow text-red-600"><FiTrash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">* URL Maps bisa diisi dengan embed link dari Google Maps</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Semarang</label>
            <input type="text" value={cta.button_text_semarang} onChange={e => setCta({...cta, button_text_semarang: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Semarang</label>
            <input type="text" value={cta.button_link_semarang} onChange={e => setCta({...cta, button_link_semarang: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tombol Jakarta</label>
            <input type="text" value={cta.button_text_jakarta} onChange={e => setCta({...cta, button_text_jakarta: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Jakarta</label>
            <input type="text" value={cta.button_link_jakarta} onChange={e => setCta({...cta, button_link_jakarta: e.target.value})} className="w-full border rounded-lg p-2" />
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
        <p className="text-gray-500 mt-3">Memuat data contact...</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      <AdminSectionNav items={NAV_ITEMS} activeKey={activeSection} onSelect={setActiveSection} />

      <div className="flex-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Halaman Contact</h2>
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
              <ImageUpload bucket="service-images" path="hero-slides" value={slideForm.image} onChange={(url) => setSlideForm({...slideForm, image: url})} label="Gambar Slide (wajib)" />
              <input type="text" placeholder="Badge" value={slideForm.badge} onChange={e => setSlideForm({...slideForm, badge: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="text" placeholder="Title *" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="text" placeholder="Highlight" value={slideForm.highlight} onChange={e => setSlideForm({...slideForm, highlight: e.target.value})} className="w-full border rounded-lg p-2" />
              <textarea placeholder="Deskripsi" value={slideForm.description} onChange={e => setSlideForm({...slideForm, description: e.target.value})} className="w-full border rounded-lg p-2" rows={2} />
              <button onClick={saveSlideFromModal} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Slide</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OFFICE */}
      {showOfficeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingOfficeId ? 'Edit Kantor' : 'Tambah Kantor'}</h3>
              <button onClick={() => setShowOfficeModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Nama Kantor *" value={officeForm.title} onChange={e => setOfficeForm({...officeForm, title: e.target.value})} className="w-full border rounded-lg p-2" />
              <select value={officeForm.gradient} onChange={e => setOfficeForm({...officeForm, gradient: e.target.value})} className="w-full border rounded-lg p-2">
                {GRADIENTS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <textarea placeholder="Alamat" value={officeForm.address} onChange={e => setOfficeForm({...officeForm, address: e.target.value})} rows={2} className="w-full col-span-2 border rounded-lg p-2" />
              <input placeholder="Telepon" value={officeForm.phone} onChange={e => setOfficeForm({...officeForm, phone: e.target.value})} className="w-full border rounded-lg p-2" />
              <input placeholder="Email" value={officeForm.email} onChange={e => setOfficeForm({...officeForm, email: e.target.value})} className="w-full border rounded-lg p-2" />
              <input placeholder="Jam Kerja" value={officeForm.hours} onChange={e => setOfficeForm({...officeForm, hours: e.target.value})} className="w-full border rounded-lg p-2" />
              <input placeholder="Latitude" value={officeForm.lat} onChange={e => setOfficeForm({...officeForm, lat: e.target.value})} className="w-full border rounded-lg p-2" />
              <input placeholder="Longitude" value={officeForm.lng} onChange={e => setOfficeForm({...officeForm, lng: e.target.value})} className="w-full border rounded-lg p-2" />
              <textarea placeholder="Embed URL Google Maps" value={officeForm.mapUrl} onChange={e => setOfficeForm({...officeForm, mapUrl: e.target.value})} rows={2} className="w-full col-span-2 border rounded-lg p-2" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowOfficeModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={saveOffice} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan Kantor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}