'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('project_porto')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Yakin hapus proyek ini?')) return
    await supabase.from('project_porto').delete().eq('id', id)
    fetchProjects()
  }

  if (loading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Data Proyek</h1>
        <Link href="/admin/projects/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiPlus /> Tambah Proyek
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Tahun</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(proj => (
              <tr key={proj.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{proj.title}</td>
                <td className="p-3">{proj.category}</td>
                <td className="p-3">{proj.year}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${proj.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{proj.status === 'completed' ? 'Selesai' : 'Berjalan'}</span></td>
                <td className="p-3 text-center space-x-2">
                  <Link href={`/admin/projects/${proj.id}/edit`} className="text-blue-600 hover:text-blue-800"><FiEdit className="inline" /></Link>
                  <button onClick={() => handleDelete(proj.id)} className="text-red-600 hover:text-red-800"><FiTrash2 className="inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <div className="text-center py-8 text-gray-400">Belum ada data proyek.</div>}
      </div>
    </div>
  )
}