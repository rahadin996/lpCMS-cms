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
    const { error } = await supabase.from('peraturan').insert([form])
    if (!error) router.push('/admin/konten/peraturan')
    else alert(error.message)
  }
  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Tambah peraturan</h1>
      <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded shadow'>
        <div><label>judul:</label><input name='judul' onChange={e => setForm({...form, [judul[0]]:e.target.value})} className='w-full border rounded p-2' /></div> <div><label>isi:</label><input name='isi' onChange={e => setForm({...form, [isi[0]]:e.target.value})} className='w-full border rounded p-2' /></div>
        <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>Simpan</button>
      </form>
    </div>
  )
}
