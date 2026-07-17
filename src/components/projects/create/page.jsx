'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CreateProjectPage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setSlug(generateSlug(newTitle))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('projects').insert([{ title, slug, description, image_url: imageUrl }])
    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      router.push('/admin/projects')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" value={title} onChange={handleTitleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <Link href="/admin/projects" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</Link>
        </div>
      </form>
    </div>
  )
}