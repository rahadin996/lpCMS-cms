'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Tambah() {
  const [form, setForm] = useState({})
  const router = useRouter()
  const supabase = createClient()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('layanan').insert([form])
    if (!error) router.push('/admin/konten/layanan')
    else alert(error.message)
  }
  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Tambah layanan</h1>
      <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded shadow'>
        <div><label>nama:</label><input name='nama' onChange={e => setForm({...form, [nama[0]]:e.target.value})} className='w-full border rounded p-2' /></div> <div><label>deskripsi:</label><input name='deskripsi' onChange={e => setForm({...form, [deskripsi[0]]:e.target.value})} className='w-full border rounded p-2' /></div> <div><label>icon:</label><input name='icon' onChange={e => setForm({...form, [icon[0]]:e.target.value})} className='w-full border rounded p-2' /></div>
        <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>Simpan</button>
      </form>
    </div>
  )
}
