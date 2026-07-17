'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CreateAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Mendaftarkan user ke Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true })
    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    // Tambahkan ke tabel admin_profiles
    const { error: profileError } = await supabase.from('admin_profiles').insert([{ id: data.user.id, email, is_admin: true }])
    if (profileError) {
      alert(profileError.message)
    } else {
      router.push('/admin/admins')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Admin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? 'Creating...' : 'Create'}
          </button>
          <Link href="/admin/admins" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</Link>
        </div>
      </form>
    </div>
  )
}