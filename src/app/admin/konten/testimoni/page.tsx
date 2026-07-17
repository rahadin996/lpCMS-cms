// src/app/admin/konten/testimoni/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface TestimoniItem {
  id: number
  judul?: string
  nama?: string
  pertanyaan?: string
  created_at?: string
}

export default async function Page() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('testimoni')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testimoni</h1>
        <Link
          href="/admin/konten/testimoni/tambah"
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
            {items?.map((i: TestimoniItem) => (
              <tr key={i.id}>
                <td className="p-2">{i.judul || i.nama || i.pertanyaan}</td>
                <td className="p-2">
                  <Link
                    href={`/admin/konten/testimoni/${i.id}/edit`}
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