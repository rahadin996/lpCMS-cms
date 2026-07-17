'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import ImageUpload from '@/components/admin/ImageUpload'

export default function CreateProject() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '', slug: '', category: '', province: '', city: '', year: new Date().getFullYear(),
    image: '', description: '', progress: 0, status: 'ongoing', client: '', value: '', service: '', lat: '', lng: ''
  })

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) return alert('Judul wajib diisi')
    const slug = form.slug || generateSlug(form.title)
    setLoading(true)
    const { error } = await supabase.from('project_porto').insert({ ...form, slug })
    if (error) alert('Gagal: ' + error.message)
    else router.push('/admin/projects')
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-600 mb-4"><FiArrowLeft /> Kembali</button>
      <h1 className="text-2xl font-bold mb-6">Tambah Proyek Baru</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Judul *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-2 rounded" required />
          <input placeholder="Slug (kosongkan otomatis)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Kategori (infrastructure, urban, dll)" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Provinsi" value={form.province} onChange={e => setForm({...form, province: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Kota/Kabupaten" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="border p-2 rounded" />
          <input type="number" placeholder="Tahun" value={form.year} onChange={e => setForm({...form, year: e.target.value})} className="border p-2 rounded" />
          <textarea placeholder="Deskripsi" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 rounded col-span-2" rows="3" />
          <ImageUpload bucket="service-images" path="projects" value={form.image} onChange={(url) => setForm({...form, image: url})} label="Gambar Proyek" />
          <input type="number" placeholder="Progress (0-100)" value={form.progress} onChange={e => setForm({...form, progress: parseInt(e.target.value)})} className="border p-2 rounded" />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="border p-2 rounded">
            <option value="ongoing">Berjalan</option>
            <option value="completed">Selesai</option>
          </select>
          <input placeholder="Klien" value={form.client} onChange={e => setForm({...form, client: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Nilai (contoh: 1.2 T)" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Layanan (Manajemen Proyek, dll)" value={form.service} onChange={e => setForm({...form, service: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Latitude" value={form.lat} onChange={e => setForm({...form, lat: parseFloat(e.target.value)})} className="border p-2 rounded" />
          <input placeholder="Longitude" value={form.lng} onChange={e => setForm({...form, lng: parseFloat(e.target.value)})} className="border p-2 rounded" />
        </div>
        <button type="submit" disabled={loading} className="bg-green-600 text-white py-2 rounded-lg w-full">{loading ? 'Menyimpan...' : 'Simpan Proyek'}</button>
      </form>
    </div>
  )
}