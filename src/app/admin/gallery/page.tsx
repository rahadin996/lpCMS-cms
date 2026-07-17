// src/app/admin/gallery/page.tsx
'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminSectionNav from '@/components/admin/AdminSectionNav'
import MultiImageUpload from '@/components/admin/MultiImageUpload'
import {
  FiPlus, FiEdit2, FiTrash2, FiSave, FiLoader, FiArrowLeft,
  FiImage, FiFolder, FiCalendar, FiMapPin, FiAlertCircle
} from 'react-icons/fi'

// ========== TYPE DEFINITIONS ==========
interface GalleryItem {
  id: number
  title: string
  category: string
  date: string
  location: string
  images: { url: string }[]
  image_url: string
  description: string
  is_active: boolean
  sort_order: number
  created_at: string
}

interface ImageItem {
  url: string
  title?: string
  caption?: string
}

interface Message {
  text: string
  type: 'success' | 'error' | ''
}

// ========== CONSTANTS ==========
const CATEGORIES = ['Acara', 'Pelatihan', 'Proyek', 'Kerjasama', 'Penghargaan']

const NAV_ITEMS = [
  { key: 'list', label: '📸 Daftar Galeri' },
  { key: 'create', label: '➕ Tambah Baru' },
  { key: 'edit', label: '✏️ Edit Galeri' },
]

// ========== COMPONENT YANG PAKAI useSearchParams ==========
function GalleryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // ========== NAVIGATION STATE ==========
  const [activeSection, setActiveSection] = useState('list')
  const [editId, setEditId] = useState<number | null>(null)

  // ========== UI STATE ==========
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // ========== DATA STATE ==========
  const [items, setItems] = useState<GalleryItem[]>([])

  // ========== FORM STATE ==========
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Acara')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [images, setImages] = useState<ImageItem[]>([])
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState(0)

  // ========== CHECK URL PARAMS ==========
  useEffect(() => {
    const edit = searchParams.get('edit')
    if (edit) {
      const id = parseInt(edit)
      if (!isNaN(id)) {
        setEditId(id)
        setActiveSection('edit')
        fetchEditData(id)
      }
    }
  }, [searchParams])

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data as GalleryItem[] || [])
    } catch (err: any) {
      setMessage({ text: 'Gagal memuat data: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchEditData = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setTitle(data.title || '')
        setCategory(data.category || 'Acara')
        setDate(data.date || '')
        setLocation(data.location || '')
        setImages(data.images || [])
        setDescription(data.description || '')
        setSortOrder(data.sort_order || 0)
      }
    } catch (err: any) {
      setMessage({ text: 'Gagal memuat data edit: ' + err.message, type: 'error' })
    }
  }

  useEffect(() => {
    if (activeSection === 'list') {
      fetchData()
    }
  }, [activeSection])

  // ========== DELETE ==========
  const deleteItem = async (id: number) => {
    if (!confirm('Yakin ingin menghapus galeri ini?')) return
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id)
      if (error) throw error
      setMessage({ text: '✅ Galeri berhasil dihapus', type: 'success' })
      fetchData()
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal hapus: ' + err.message, type: 'error' })
    }
  }

  // ========== VALIDATION ==========
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!title.trim()) errors.title = 'Judul wajib diisi'
    if (!date) errors.date = 'Tanggal wajib diisi'
    const validImages = images.filter(img => img.url)
    if (validImages.length === 0) errors.images = 'Minimal 1 gambar wajib diupload'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ========== SUBMIT (CREATE / UPDATE) ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    setMessage({ text: '', type: '' })

    const validImages = images.filter(img => img.url)
    const firstImageUrl = validImages[0]?.url || ''

    const payload = {
      title: title.trim(),
      category,
      date,
      location: location.trim() || null,
      images: validImages,
      image_url: firstImageUrl,
      description: description.trim() || null,
      sort_order: sortOrder,
      is_active: true
    }

    try {
      let error
      if (editId) {
        const { error: e } = await supabase
          .from('gallery')
          .update(payload)
          .eq('id', editId)
        error = e
      } else {
        const { error: e } = await supabase.from('gallery').insert(payload)
        error = e
      }

      if (error) throw error

      setMessage({
        text: editId ? '✅ Galeri berhasil diperbarui!' : '✅ Galeri berhasil ditambahkan!',
        type: 'success'
      })

      resetForm()
      fetchData()
      setTimeout(() => {
        setActiveSection('list')
        setEditId(null)
        setMessage({ text: '', type: '' })
      }, 1500)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal menyimpan: ' + err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setCategory('Acara')
    setDate('')
    setLocation('')
    setImages([])
    setDescription('')
    setSortOrder(0)
    setFormErrors({})
    setEditId(null)
  }

  // ========== FORMAT DATE ==========
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  // ========== HANDLE EDIT CLICK ==========
  const handleEdit = (id: number) => {
    setEditId(id)
    setActiveSection('edit')
    fetchEditData(id)
  }

  // ========== RENDER SECTION ==========
  const renderSection = () => {
    if (activeSection === 'list') return renderList()
    if (activeSection === 'create' || activeSection === 'edit') return renderForm()
    return null
  }

  // ========== RENDER LIST ==========
  const renderList = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <FiLoader className="animate-spin text-blue-600" size={32} />
          <p className="text-gray-500 mt-3">Memuat data galeri...</p>
        </div>
      )
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">📸 Semua Galeri</h2>
          <button
            onClick={() => { resetForm(); setActiveSection('create') }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition text-sm"
          >
            <FiPlus /> Tambah Baru
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">Belum ada data galeri.</p>
            <p className="text-gray-400 text-sm mt-1">Klik tombol "Tambah Baru" untuk memulai.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-left w-12 text-gray-600">No</th>
                    <th className="p-3 text-left text-gray-600">Judul</th>
                    <th className="p-3 text-left text-gray-600 hidden md:table-cell">Kategori</th>
                    <th className="p-3 text-left text-gray-600 hidden lg:table-cell">Tanggal</th>
                    <th className="p-3 text-center w-28 text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 text-center text-gray-500">{idx + 1}</td>
                      <td className="p-3 font-medium text-gray-800">{item.title}</td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 hidden lg:table-cell">{formatDate(item.date)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t bg-gray-50 text-xs text-gray-500 flex justify-between">
              <span>Total: {items.length} item</span>
              <span>Terakhir diperbarui: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ========== RENDER FORM ==========
  const renderForm = () => {
    const isEdit = activeSection === 'edit'
    const titleText = isEdit ? '✏️ Edit Galeri' : '📸 Tambah Galeri Baru'
    const buttonText = isEdit ? 'Update Galeri' : 'Simpan Galeri'

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{titleText}</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Masukkan judul galeri"
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition ${
                formErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={saving}
            />
            {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
          </div>

          {/* Kategori & Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                disabled={saving}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  formErrors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={saving}
              />
              {formErrors.date && <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>}
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Contoh: Semarang, Jawa Tengah"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
              disabled={saving}
            />
          </div>

          {/* Upload Gambar */}
          <div>
            <MultiImageUpload
              bucket="service-images"
              path={`gallery/${title || 'untitled'}`}
              value={images}
              onChange={setImages}
              label="📷 Upload Gambar (min 1, max 10)"
              maxImages={10}
            />
            {formErrors.images && <p className="text-red-500 text-sm mt-1">{formErrors.images}</p>}
            <p className="text-xs text-gray-400 mt-1">Gambar pertama akan digunakan sebagai thumbnail</p>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Ceritakan tentang kegiatan atau proyek ini..."
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
              disabled={saving}
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urutan (Sort Order)</label>
            <input
              type="number"
              value={sortOrder}
              onChange={e => setSortOrder(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full md:w-32 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
              disabled={saving}
            />
            <p className="text-xs text-gray-400 mt-1">Angka lebih kecil akan tampil lebih dulu</p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => { resetForm(); setActiveSection('list') }}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Menyimpan...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  {buttonText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="flex gap-6">
      <AdminSectionNav
        items={NAV_ITEMS.filter(item => item.key !== 'edit')}
        activeKey={activeSection === 'edit' ? 'create' : activeSection}
        onSelect={(key) => {
          if (key === 'create') {
            resetForm()
            setActiveSection('create')
          } else {
            setActiveSection(key)
          }
        }}
      />

      <div className="flex-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Kelola Galeri</h2>
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg mb-4 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {renderSection()}
      </div>
    </div>
  )
}

// ========== MAIN PAGE (dengan Suspense) ==========
export default function AdminGalleryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-600" size={32} />
      </div>
    }>
      <GalleryContent />
    </Suspense>
  )
}