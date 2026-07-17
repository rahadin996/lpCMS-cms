// src/app/admin/konten/berita/page.tsx
import { createClient } from '@/lib/supabase/server'   // ← correct import
import Link from 'next/link'

// Define the type for a berita item (adjust according to your actual table columns)
interface BeritaItem {
  id: number
  judul?: string
  nama?: string
  pertanyaan?: string
  created_at?: string
  // add other fields you use
}

export default async function Page() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Berita</h1>
        <Link
          href="/admin/konten/berita/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Tambah
        </Link>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Judul</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((i: BeritaItem) => (
              <tr key={i.id}>
                <td className="p-2">{i.judul || i.nama || i.pertanyaan}</td>
                <td className="p-2">
                  <Link
                    href={`/admin/konten/berita/${i.id}/edit`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}