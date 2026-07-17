'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'

interface ImageItem {
  url: string
  title?: string
  caption?: string
}

interface MultiImageUploadProps {
  bucket: string
  path: string
  value: ImageItem[]
  onChange: (images: ImageItem[]) => void
  label?: string
  maxImages?: number
}

export default function MultiImageUpload({
  bucket,
  path,
  value,
  onChange,
  label = 'Upload Gambar',
  maxImages = 10
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadIndex, setUploadIndex] = useState<number | null>(null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadIndex(index)

    const fileName = `${path}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from(bucket).upload(fileName, file)

    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      const newImages = [...value]
      newImages[index] = { ...newImages[index], url: data.publicUrl }
      onChange(newImages)
    }

    setUploading(false)
    setUploadIndex(null)
  }

  const addImage = () => {
    if (value.length >= maxImages) {
      alert(`Maksimal ${maxImages} gambar`)
      return
    }
    onChange([...value, { url: '', title: '', caption: '' }])
  }

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const updateImageField = (index: number, field: keyof ImageItem, val: string) => {
    const newImages = [...value]
    newImages[index] = { ...newImages[index], [field]: val }
    onChange(newImages)
  }

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {value.map((img, idx) => (
          <div key={idx} className="relative border rounded-lg p-2 bg-gray-50 group">
            {img.url ? (
              <div className="relative">
                <img src={img.url} alt={img.title || 'Gambar'} className="w-full h-28 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <div className="w-full h-28 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                {uploading && uploadIndex === idx ? (
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                    <span className="text-xs text-gray-400">Uploading...</span>
                  </div>
                ) : (
                  <label className="cursor-pointer text-center">
                    <FiUpload className="mx-auto text-gray-400" size={24} />
                    <span className="text-xs text-gray-400 block">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(e, idx)}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            )}
            <div className="mt-2 space-y-1">
              <input
                placeholder="Judul foto"
                value={img.title || ''}
                onChange={(e) => updateImageField(idx, 'title', e.target.value)}
                className="w-full text-xs border rounded p-1"
              />
              <input
                placeholder="Caption"
                value={img.caption || ''}
                onChange={(e) => updateImageField(idx, 'caption', e.target.value)}
                className="w-full text-xs border rounded p-1"
              />
            </div>
          </div>
        ))}
        
        {/* Tombol Tambah Foto - PASTIKAN type="button" */}
        {value.length < maxImages && (
          <button
            type="button"  // <-- INI PENTING!
            onClick={addImage}
            className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-28 hover:border-blue-400 transition group"
          >
            <FiImage className="text-gray-300 group-hover:text-blue-400" size={28} />
            <span className="text-xs text-gray-400 group-hover:text-blue-400 mt-1">Tambah Foto</span>
          </button>
        )}
      </div>
      
      <p className="text-xs text-gray-400">{value.length} / {maxImages} gambar</p>
    </div>
  )
}