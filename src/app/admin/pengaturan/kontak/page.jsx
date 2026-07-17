'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function kontakPage() {
  const [value, setValue] = useState('')
  const supabase = createClient()
  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'kontak').single().then(res => setValue(res.data?.value || ''))
  }, [])
  const save = async () => {
    await supabase.from('site_settings').upsert({ key: 'kontak', value })
    alert('Disimpan')
  }
  return (
    <div className='max-w-md mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Pengaturan kontak</h1>
      <div className='bg-white p-6 rounded shadow'>
        <label>Nilai kontak</label>
        <input type='text' value={value} onChange={e => setValue(e.target.value)} className='w-full border rounded p-2 mt-1' />
        <button onClick={save} className='mt-4 bg-blue-600 text-white px-4 py-2 rounded'>Simpan</button>
      </div>
    </div>
  )
}
