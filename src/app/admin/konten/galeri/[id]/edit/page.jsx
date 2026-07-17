'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FiArrowLeft, FiSave } from 'react-icons/fi'

const categories = ['Acara', 'Pelatihan', 'Proyek', 'Kerjasama', 'Penghargaan']

export default function EditGaleri() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'Acara',
    date: '',
    location: '',
    image_url: '',
    description: '',
    sort_order: 0,
    is_active: true
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await supabase.from('gallery').select('*').eq('id', id).single()
      if (data) setForm(data)
      setLoading(false)
    }
    fetchItem()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('gallery').update(form).eq('id', id)
    if (error) alert('Gagal update: ' + error.message)
    else router.push('/admin/konten/galeri')
    setSaving(false)
  }

  if (loading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Edit Galeri</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Judul *</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kategori *</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-lg p-2">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <input type="date" value={form.date || ''} onChange={e => setForm({...form, date: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lokasi</label>
            <input type="text" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL Gambar *</label>
          <input type="text" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="w-full border rounded-lg p-2" placeholder="https://..." required />
          {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows="3" className="w-full border rounded-lg p-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Urutan (sort order)</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.is_active} onChange={e => setForm({...form, is_active: e.target.value === 'true'})} className="w-full border rounded-lg p-2">
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={saving} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
          {saving ? 'Menyimpan...' : <><FiSave /> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  )
}