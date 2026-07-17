'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCalendar, FiUser, FiTag, FiTwitter, FiLinkedin, FiFacebook } from 'react-icons/fi'

// Sementara pakai data statis; nanti bisa fetch dari database
const blogPosts = {
  'tren-perencanaan-kota-2025': { title: "Tren Perencanaan Kota 2025: Smart City Berkelanjutan", category: "Perencanaan", date: "15 Jan 2025", author: "Dr. Budi Santoso", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop", content: "<p>Konten lengkap artikel...</p>" },
  // tambahkan slug lain
}

export default function BlogDetailPage() {
  const { slug } = useParams()
  const post = blogPosts[slug]

  if (!post) return <div className="p-8 text-center">Artikel tidak ditemukan</div>

  return (
    <div className="bg-white min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-1 text-blue-600 hover:gap-2 transition mb-6"><FiArrowLeft /> Kembali ke Blog</Link>
        <img src={post.image} alt={post.title} className="w-full rounded-2xl shadow-lg mb-8" />
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><FiCalendar /> {post.date}</span>
          <span className="flex items-center gap-1"><FiUser /> {post.author}</span>
          <span className="flex items-center gap-1"><FiTag /> {post.category}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="border-t pt-6 mt-8 flex justify-center gap-4">
          <a href="#" className="text-gray-400 hover:text-blue-600"><FiTwitter size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-blue-600"><FiLinkedin size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-blue-600"><FiFacebook size={20} /></a>
        </div>
      </div>
    </div>
  )
}