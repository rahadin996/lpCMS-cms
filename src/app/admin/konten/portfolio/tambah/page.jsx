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
    const { error } = await supabase.from('portfolio').insert([form])
    if (!error) router.push('/admin/konten/portfolio')
    else alert(error.message)
  }
  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Tambah portfolio</h1>
      <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded shadow'>
        <div><label>judul:</label><input name='judul' onChange={e => setForm({...form, [judul[0]]:e.target.value})} className='w-full border rounded p-2' /></div> <div><label>client:</label><input name='client' onChange={e => setForm({...form, [client[0]]:e.target.value})} className='w-full border rounded p-2' /></div> <div><label>gambar_url:</label><input name='gambar_url' onChange={e => setForm({...form, [gambar_url[0]]:e.target.value})} className='w-full border rounded p-2' /></div> <div><label>deskripsi:</label><input name='deskripsi' onChange={e => setForm({...form, [deskripsi[0]]:e.target.value})} className='w-full border rounded p-2' /></div>
        <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>Simpan</button>
      </form>
    </div>
  )
}
