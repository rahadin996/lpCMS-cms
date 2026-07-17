'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  FiArrowRight, FiCalendar, FiUser, FiTag, FiSearch, FiTwitter, 
  FiLinkedin, FiInstagram, FiFacebook, FiArrowUp
} from 'react-icons/fi'

// Data blog (sementara, nanti bisa dari database)
const blogPosts = [
  { id: 1, title: "Tren Perencanaan Kota 2025: Smart City Berkelanjutan", slug: "tren-perencanaan-kota-2025", category: "Perencanaan", date: "15 Jan 2025", author: "Dr. Budi Santoso", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=500&fit=crop", excerpt: "Perkembangan teknologi dan kebutuhan lingkungan mendorong transformasi kota menuju smart city yang berkelanjutan." },
  { id: 2, title: "Pentingnya AMDAL dalam Proyek Infrastruktur", slug: "pentingnya-amdal", category: "Lingkungan", date: "10 Jan 2025", author: "Ir. Siti Nurhaliza", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=500&fit=crop", excerpt: "Analisis Mengenai Dampak Lingkungan (AMDAL) menjadi kunci keberlanjutan proyek infrastruktur." },
  { id: 3, title: "Digital Twin untuk Manajemen Infrastruktur", slug: "digital-twin-infrastruktur", category: "Teknologi", date: "5 Jan 2025", author: "M. Rizky, S.T.", image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=500&fit=crop", excerpt: "Teknologi digital twin memungkinkan simulasi dan monitoring infrastruktur secara real-time." },
  { id: 4, title: "Pemberdayaan Masyarakat dalam Pembangunan Desa", slug: "pemberdayaan-masyarakat-desa", category: "Sosial", date: "20 Des 2024", author: "Dewi Anggraini", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop", excerpt: "Partisipasi masyarakat menjadi faktor sukses pembangunan desa yang berkelanjutan." },
  { id: 5, title: "Green Building: Sertifikasi Bangunan Ramah Lingkungan", slug: "green-building-sertifikasi", category: "Lingkungan", date: "15 Des 2024", author: "Ir. Siti Nurhaliza", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=500&fit=crop", excerpt: "Sertifikasi green building meningkatkan efisiensi energi dan mengurangi dampak lingkungan." },
  { id: 6, title: "Perencanaan Transportasi Berbasis Data", slug: "transportasi-berbasis-data", category: "Perencanaan", date: "10 Des 2024", author: "Dr. Budi Santoso", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=500&fit=crop", excerpt: "Penggunaan big data untuk mengoptimalkan sistem transportasi perkotaan." },
]

const categories = ["Semua", "Perencanaan", "Lingkungan", "Teknologi", "Sosial"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [searchQuery, setSearchQuery] = useState("")
  const [showBackToTop, setShowBackToTop] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory !== "Semua" && post.category !== selectedCategory) return false
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) && !post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=1080&fit=crop" alt="Blog Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-30" />
        </div>
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium tracking-wide">Blog & Wawasan</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]"
          >
            Blog <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">LPPSLH</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Artikel, wawasan, dan berita seputar perencanaan, konsultansi, dan pembangunan berkelanjutan.
          </motion.p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Search & Filter */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid Artikel */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">{post.category}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><FiCalendar size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1"><FiUser size={12} /> {post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{post.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium hover:gap-2 transition">
                  Baca Selengkapnya <FiArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">Tidak ada artikel dengan filter yang dipilih.</div>
        )}
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Ingin berlangganan artikel kami?</h2>
          <p className="mt-4 text-gray-600">Dapatkan update terbaru langsung ke email Anda.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <input type="email" placeholder="Alamat email" className="px-6 py-3 rounded-full text-gray-900 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200" />
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition">Berlangganan</button>
          </div>
        </div>
      </section>

      {/* Footer (sama seperti about) */}
      <footer className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div><div className="flex items-center gap-2 mb-4"><span className="font-bold text-2xl text-gray-900">LPPSLH</span><span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">KONSULTAN</span></div><p className="text-gray-500 text-sm">Mitra strategis dalam perencanaan wilayah dan konsultansi berkelanjutan.</p><div className="flex gap-4 mt-6"><a href="#" className="text-gray-400 hover:text-gray-600"><FiTwitter size={20} /></a><a href="#" className="text-gray-400 hover:text-gray-600"><FiLinkedin size={20} /></a><a href="#" className="text-gray-400 hover:text-gray-600"><FiInstagram size={20} /></a><a href="#" className="text-gray-400 hover:text-gray-600"><FiFacebook size={20} /></a></div></div>
            <div><h4 className="font-semibold text-gray-900 mb-4">Layanan</h4><ul className="space-y-2 text-gray-500 text-sm"><li><Link href="/services">Perencanaan Strategis</Link></li><li><Link href="/services">Konsultansi Lingkungan</Link></li><li><Link href="/services">Manajemen Proyek</Link></li><li><Link href="/services">Sistem Informasi Geografis</Link></li></ul></div>
            <div><h4 className="font-semibold text-gray-900 mb-4">Perusahaan</h4><ul className="space-y-2 text-gray-500 text-sm"><li><Link href="/about">Tentang Kami</Link></li><li><Link href="/careers">Karir</Link></li><li><Link href="/news">Berita</Link></li><li><Link href="/contact">Kontak</Link></li></ul></div>
            <div><h4 className="font-semibold text-gray-900 mb-4">Kantor Pusat</h4><address className="text-gray-500 text-sm not-italic">Jl. Sudirman No. 123<br />Jakarta Selatan 12190<br />Tel: (021) 1234-5678<br />Email: info@lppslh.com</address></div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">&copy; {new Date().getFullYear()} LPPSLH. All rights reserved. | Desain premium oleh tim kreatif.</div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={scrollToTop} className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-40">
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}