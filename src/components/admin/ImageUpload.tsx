// src/components/admin/ImageUpload.tsx
'use client'
import { useState, type ChangeEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FiUpload, FiX, FiLoader } from 'react-icons/fi'

interface ImageUploadProps {
  bucket: string          // nama bucket: 'service-images', 'team-avatars', dll
  path: string            // folder di dalam bucket (misal: 'hero', 'projects', 'team')
  value: string           // URL gambar saat ini
  onChange: (url: string) => void  // fungsi callback untuk mengirim URL baru
  label?: string
  accept?: string
}

export default function ImageUpload({ 
  bucket,
  path,
  value,
  onChange,
  label = 'Gambar',
  accept = 'image/*'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false)
  const [preview, setPreview] = useState<string>(value || '')
  const supabase = createClient()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    // Buat nama file unik
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = path ? `${path}/${fileName}` : fileName

    // Upload ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      alert('Gagal upload: ' + uploadError.message)
      setUploading(false)
      return
    }

    // Dapatkan public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    setPreview(publicUrl)
    onChange(publicUrl)
    setUploading(false)
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <FiX size={14} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id={`upload-${bucket}-${path}`}
          />
          <label
            htmlFor={`upload-${bucket}-${path}`}
            className="cursor-pointer flex flex-col items-center gap-2 text-gray-500"
          >
            {uploading ? (
              <FiLoader className="animate-spin" size={24} />
            ) : (
              <FiUpload size={24} />
            )}
            <span className="text-sm">{uploading ? 'Mengupload...' : 'Klik untuk upload gambar'}</span>
          </label>
        </div>
      )}
    </div>
  )
}