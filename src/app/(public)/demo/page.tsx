// src/app/(public)/demo/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiMonitor, FiSettings, FiUser, FiLock, FiArrowRight, 
  FiCheckCircle, FiExternalLink, FiPlay, FiShield,
  FiCopy, FiCheck, FiX, FiMenu, FiHome, FiLayout,
  FiDatabase, FiCloud, FiUsers, FiStar, FiMapPin,
  FiMessageSquare, FiCalendar, FiImage, FiGlobe
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function DemoPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'website' | 'admin'>('website')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)

  const demoCredentials = {
  email: 'demo@admin.com',
  password: 'admin123'
}

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAllCredentials = () => {
    const text = `Email: ${demoCredentials.email}\nPassword: ${demoCredentials.password}`
    navigator.clipboard.writeText(text)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 3000)
  }

  // Features yang bisa dicoba di demo
  const demoFeatures = [
    { icon: FiLayout, title: 'Kelola Konten', desc: 'CRUD Hero Slideshow, Kantor, Testimonial, Statistik, dan lainnya' },
    { icon: FiUsers, title: 'Manajemen Tim', desc: 'Kelola personil dengan informasi lengkap (nama, posisi, lulusan, keahlian)' },
    { icon: FiMonitor, title: 'Multi Halaman', desc: 'Homepage, Kantor, Testimonial, Galeri, dan halaman lainnya' },
    { icon: FiShield, title: 'Keamanan Terjamin', desc: 'Login dengan akun demo, data aman dengan RLS Supabase' },
    { icon: FiCloud, title: 'Real-time Update', desc: 'Perubahan konten langsung tampil di website tanpa delay' },
    { icon: FiImage, title: 'Upload Gambar', desc: 'Upload gambar langsung ke Supabase Storage dari admin panel' },
  ]

  const adminScreenshots = [
    { label: 'Dashboard Admin', icon: FiSettings },
    { label: 'Kelola Hero Slideshow', icon: FiImage },
    { label: 'Daftar Kantor', icon: FiMapPin },
    { label: 'Testimonial', icon: FiStar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-x-hidden">
      {/* ===== SCHEMA MARKUP ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "LPPSLH CMS Demo",
            "description": "Demo interaktif admin panel LPPSLH CMS",
            "applicationCategory": "WebApplication",
            "operatingSystem": "All",
            "browserRequirements": "Modern browser",
          })
        }}
      />

      {/* ===== HEADER DEMO ===== */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <span className="text-white font-bold">LPPSLH<span className="text-blue-400">CMS</span></span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                Demo
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <a
                href="/admin"
                target="_blank"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition hover:-translate-y-0.5"
              >
                <FiSettings size={16} /> Buka Admin
              </a>
              <a
                href="https://wa.me/6287733008821?text=Halo%2C%20saya%20tertarik%20dengan%20LPPSLH%20CMS%20setelah%20melihat%20demo"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition"
              >
                <FaWhatsapp size={16} /> Konsultasi
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative py-16 md:py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-purple-600/10" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full mb-6 border border-blue-500/30">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium">LIVE DEMO INTERAKTIF</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Coba Langsung
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel LPPSLH CMS
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Rasakan kemudahan mengelola website dengan admin panel yang powerful.
            Login dengan akun demo dan jelajahi semua fitur tanpa registrasi.
          </p>

          {/* Video Demo Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowVideoModal(true)}
            className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 hover:bg-white/20 transition"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <FiPlay size={20} className="text-white ml-0.5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Lihat Video Demo</div>
              <div className="text-xs text-gray-400">2 menit 30 detik</div>
            </div>
          </motion.button>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 max-w-md mx-auto"
          >
            <p className="text-gray-400 text-sm mb-3 flex items-center justify-between">
              <span>🔑 Kredensial Demo</span>
              <button
                onClick={copyAllCredentials}
                className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
              >
                {copiedAll ? <FiCheck className="text-green-400" /> : <FiCopy size={12} />}
                {copiedAll ? 'Tersalin Semua' : 'Salin Semua'}
              </button>
            </p>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between gap-4 bg-white/5 rounded-lg px-4 py-2.5 border border-white/5">
                <div className="flex items-center gap-2">
                  <FiUser className="text-gray-400" size={14} />
                  <span className="text-gray-300 text-sm font-mono">{demoCredentials.email}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(demoCredentials.email, 'email')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                >
                  {copied === 'email' ? <FiCheck className="text-green-400" /> : <FiCopy size={12} />}
                  {copied === 'email' ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <div className="flex items-center justify-between gap-4 bg-white/5 rounded-lg px-4 py-2.5 border border-white/5">
                <div className="flex items-center gap-2">
                  <FiLock className="text-gray-400" size={14} />
                  <span className="text-gray-300 text-sm font-mono">{demoCredentials.password}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(demoCredentials.password, 'password')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                >
                  {copied === 'password' ? <FiCheck className="text-green-400" /> : <FiCopy size={12} />}
                  {copied === 'password' ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <a
              href="/admin"
              target="_blank"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <FiSettings size={20} />
              Buka Admin Panel
              <FiArrowRight className="group-hover:translate-x-1 transition" />
            </a>
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition"
            >
              <FiMonitor size={20} />
              Lihat Website
              <FiExternalLink size={16} />
            </a>
            <a
              href="/landing#pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500/20 text-amber-400 rounded-full font-semibold border border-amber-500/30 hover:bg-amber-500/30 transition"
            >
              💰 Beli Sekarang
            </a>
          </motion.div>

          <p className="text-xs text-gray-500 mt-6">
            🔒 Data demo di-reset setiap 24 jam. Gunakan untuk eksplorasi fitur.
          </p>
        </motion.div>
      </section>

      {/* ===== TAB WEBSITE / ADMIN PREVIEW ===== */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('website')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition flex items-center justify-center gap-2 ${
                activeTab === 'website'
                  ? 'text-white border-b-2 border-blue-500 bg-white/5'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <FiMonitor size={16} /> Preview Website
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition flex items-center justify-center gap-2 ${
                activeTab === 'admin'
                  ? 'text-white border-b-2 border-purple-500 bg-white/5'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <FiSettings size={16} /> Admin Panel
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'website' ? (
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <div className="text-center p-8">
                  <FiMonitor size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Website Anda akan tampil di sini</p>
                  <p className="text-sm text-gray-500 mt-1">Kelola konten dari admin panel</p>
                  <a
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300 transition"
                  >
                    Buka Website <FiExternalLink size={14} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                <div className="text-center p-8">
                  <FiSettings size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Admin Panel dengan CRUD lengkap</p>
                  <p className="text-sm text-gray-500 mt-1">Login dengan akun demo di atas</p>
                  <a
                    href="/admin"
                    target="_blank"
                    className="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 transition"
                  >
                    Buka Admin Panel <FiExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== FEATURES DEMO ===== */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
            YANG BISA ANDA COBA
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Jelajahi Semua Fitur
          </h2>
          <p className="text-gray-400 mt-2">Admin panel yang lengkap untuk mengelola website Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoFeatures.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ===== ADMIN SCREENSHOTS ===== */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20 mb-4">
              TAMPILAN ADMIN
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Lihat Admin Panel dari Dekat
            </h2>
            <p className="text-gray-400 mt-2">Beberapa halaman yang bisa Anda kelola</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {adminScreenshots.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center hover:bg-white/10 transition"
                >
                  <Icon size={24} className="text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-300 text-xs">{item.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONI DEMO ===== */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Apa Kata Pengguna Demo?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Andi Pratama', role: 'CEO, PT Maju Jaya', text: 'Admin panel sangat intuitif! Saya bisa langsung mengelola konten tanpa bantuan developer.' },
            { name: 'Dewi Lestari', role: 'Marketing Manager', text: 'Fitur upload gambar dan CRUD sangat membantu tim marketing kami.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-medium">{item.name}</div>
                  <div className="text-gray-400 text-sm">{item.role}</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic">"{item.text}"</p>
              <div className="flex text-yellow-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill="currentColor" size={14} className="mr-0.5" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-purple-600/10" />
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="relative z-10 max-w-2xl mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/20 backdrop-blur-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Siap Punya Website Seperti Ini?</h3>
          <p className="text-gray-300 mt-2">Dapatkan source code lengkap dengan admin panel. Kelola konten sendiri, tanpa coding!</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="/landing#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition hover:-translate-y-0.5"
            >
              Lihat Harga & Paket
              <FiArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/6287733008821?text=Halo%2C%20saya%20tertarik%20dengan%20LPPSLH%20CMS%20setelah%20mencoba%20demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
            >
              <FaWhatsapp size={18} /> Konsultasi Gratis
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            💳 Pembayaran via transfer bank, QRIS, atau kartu kredit
          </p>
        </div>
      </section>

      {/* ===== VIDEO MODAL ===== */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h3 className="text-white font-semibold">🎬 Video Demo Admin Panel</h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-white transition p-1"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center p-8">
                <div className="text-center">
                  <FiPlay size={64} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Video demo akan ditampilkan di sini</p>
                  <p className="text-sm text-gray-500 mt-1">(Silakan upload video demo Anda)</p>
                </div>
              </div>
              <div className="p-4 bg-white/5 border-t border-white/10">
                <p className="text-gray-400 text-sm text-center">
                  🔥 Lihat bagaimana cara mengelola konten website dengan mudah
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .bg-grid {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}