// src/app/admin/konten/galeri/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FiEdit, FiTrash2, FiPlus, FiImage } from 'react-icons/fi'

// Type definition for gallery items
interface GalleryItem {
  id: number
  title: string
  category: string
  date: string | null
  location: string | null
  image_url: string | null
  sort_order: number
  created_at: string
  is_active?: boolean
  description?: string | null
}

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const supabase = createClient()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async (): Promise<void> => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setItems(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm('Yakin ingin menghapus item ini?')) return
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) alert('Gagal hapus: ' + error.message)
    else fetchItems()
  }

  if (loading) return <div className="p-8 text-center">Memuat data...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📸 Galeri Kegiatan</h1>
        <Link
          href="/admin/konten/galeri/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FiPlus /> Tambah Galeri
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Gambar</th>
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Lokasi</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FiImage className="text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="p-3 font-medium">{item.title}</td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {item.category}
                  </span>
                </td>
                <td className="p-3 text-gray-500">
                  {item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-'}
                </td>
                <td className="p-3 text-gray-500">{item.location || '-'}</td>
                <td className="p-3 text-center space-x-2">
                  <Link
                    href={`/admin/konten/galeri/${item.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <FiEdit size={16} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                  >
                    <FiTrash2 size={16} /> Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Belum ada data galeri. Klik "Tambah Galeri" untuk mulai.
          </div>
        )}
      </div>
    </div>
  )
}