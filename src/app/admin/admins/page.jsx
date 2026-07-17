import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

export default async function AdminsPage() {
  const supabase = createServerClient()
  const { data: admins, error } = await supabase.from('admin_profiles').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admins</h1>
        <Link href="/admin/admins/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Add Admin</Link>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Created At</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins?.map((admin) => (
              <tr key={admin.id} className="border-t">
                <td className="py-2 px-4">{admin.email}</td>
                <td className="py-2 px-4">{new Date(admin.created_at).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}