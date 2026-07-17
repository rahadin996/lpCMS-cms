'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FiArrowLeft, FiSave } from 'react-icons/fi'
import ImageUpload from '@/components/admin/ImageUpload'

export default function EditProject() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '', slug: '', category: '', province: '', city: '', year: '', image: '', description: '',
    progress: 0, status: 'ongoing', client: '', value: '', service: '', lat: '', lng: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('project_porto').select('*').eq('id', id).single()
      if (data) setForm(data)
      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('project_porto').update(form).eq('id', id)
    if (error) alert('Gagal update: ' + error.message)
    else router.push('/admin/projects')
    setSaving(false)
  }

  if (loading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-600 mb-4"><FiArrowLeft /> Kembali</button>
      <h1 className="text-2xl font-bold mb-6">Edit Proyek</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Judul" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="border p-2 rounded" required />
          <input placeholder="Slug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Kategori" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Provinsi" value={form.province} onChange={e => setForm({...form, province: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Kota" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="border p-2 rounded" />
          <input type="number" placeholder="Tahun" value={form.year} onChange={e => setForm({...form, year: e.target.value})} className="border p-2 rounded" />
          <textarea placeholder="Deskripsi" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="border p-2 rounded col-span-2" rows="3" />
          <ImageUpload bucket="service-images" path="projects" value={form.image} onChange={(url) => setForm({...form, image: url})} label="Gambar Proyek" />
          <input type="number" placeholder="Progress" value={form.progress} onChange={e => setForm({...form, progress: parseInt(e.target.value)})} className="border p-2 rounded" />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="border p-2 rounded">
            <option value="ongoing">Berjalan</option>
            <option value="completed">Selesai</option>
          </select>
          <input placeholder="Klien" value={form.client} onChange={e => setForm({...form, client: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Nilai" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Layanan" value={form.service} onChange={e => setForm({...form, service: e.target.value})} className="border p-2 rounded" />
          <input placeholder="Latitude" value={form.lat} onChange={e => setForm({...form, lat: parseFloat(e.target.value)})} className="border p-2 rounded" />
          <input placeholder="Longitude" value={form.lng} onChange={e => setForm({...form, lng: parseFloat(e.target.value)})} className="border p-2 rounded" />
        </div>
        <button type="submit" disabled={saving} className="bg-green-600 text-white py-2 rounded-lg w-full">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
      </form>
    </div>
  )
}