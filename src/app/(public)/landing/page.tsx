// src/app/(public)/landing/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  FiCheckCircle, FiArrowRight, FiStar, FiBriefcase, FiUsers, FiGlobe,
  FiLayout, FiDatabase, FiSettings, FiShield, FiZap, FiAward,
  FiChevronDown, FiX, FiMenu, FiMonitor, FiSmartphone, FiCode,
  FiCloud, FiLock, FiTrendingUp, FiMessageSquare, FiPlay,
  FiExternalLink, FiGithub, FiMail, FiPhone, FiMapPin, FiCheck,
  FiHeart, FiThumbsUp, FiClock, FiHeadphones, FiShoppingCart
} from 'react-icons/fi'
import { FaWhatsapp, FaYoutube, FaGoogle } from 'react-icons/fa'

// ========== TYPES ==========
interface PricingPlan {
  name: string
  price: string
  priceYearly: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  isPopular?: boolean
  gradient: string
  badge?: string
}

interface FAQ {
  question: string
  answer: string
}

// ========== COMPONENTS ==========
const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

// ========== MAIN PAGE ==========
export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [selectedBuyPlan, setSelectedBuyPlan] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  // ===== DATA =====
  const testimonials = [
    {
      name: 'Tahira Kanaya',
      role: 'Project Manager',
      text: 'CMS sangat membantu kami mengelola konten proyek secara real-time. Admin panel intuitif dan mudah digunakan. Tim kami bisa fokus pada pekerjaan inti.',
      avatar: '',
      rating: 5,
      company: 'Kementerian'
    },
    {
      name: 'Naufalyn',
      role: 'Direktur Operasional',
      text: 'Kami menggunakan platform ini untuk memantau puluhan proyek. Dashboard real-time dan laporan otomatis sangat berguna. Efisiensi tim meningkat 40%.',
      avatar: '',
      rating: 5,
      company: 'PT'
    },
    {
      name: 'Rahadin Arguby',
      role: 'CEO',
      text: 'Digitalisasi proyek kami meningkat drastis setelah menggunakan Lp CMS. Tim lapangan dan kantor terhubung mulus. Sangat direkomendasikan!',
      avatar: '',
      rating: 5,
      company: 'PT Hutama'
    }
  ]

  const pricingPlans: PricingPlan[] = [
    {
      name: 'Basic',
      price: 'Rp 5.000.000',
      priceYearly: 'Rp 35.000.000',
      description: 'Cocok untuk perusahaan kecil yang baru memulai digitalisasi.',
      features: [
        'Source code lengkap',
        'Database Supabase',
        '1 Domain',
        'Dokumentasi dasar',
        'Email support 1 bulan'
      ],
      buttonText: 'Beli Sekarang',
      buttonLink: '#buy',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Standard',
      price: 'Rp 8.000.000',
      priceYearly: 'Rp 62.000.000',
      description: 'Paling populer untuk bisnis menengah dengan kebutuhan lengkap.',
      features: [
        'Semua fitur Basic',
        'Video tutorial',
        'Dokumentasi lengkap',
        '1 Tahun support',
        'Training 1 hari online',
        'Custom branding'
      ],
      isPopular: true,
      badge: '🔥 Paling Populer',
      buttonText: 'Beli Sekarang',
      buttonLink: '#buy',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Premium',
      price: 'Rp 12.000.000',
      priceYearly: 'Rp 108.000.000',
      description: 'Solusi komprehensif untuk perusahaan besar dan instansi pemerintah.',
      features: [
        'Semua fitur Standard',
        'Setup deployment',
        'Pelatihan 1 hari on-site',
        '2 Tahun support',
        'Custom development 40 jam',
        'SLA 99.9% uptime'
      ],
      buttonText: 'Hubungi Kami',
      buttonLink: '/contact',
      gradient: 'from-amber-500 to-orange-500'
    }
  ]

  const features = [
    { 
      icon: FiLayout, 
      title: 'Admin Panel Lengkap', 
      desc: 'CRUD untuk semua konten: Hero, Kantor, Testimonial, Statistik, dan lainnya. Tanpa coding!',
      benefit: 'Kelola sendiri tanpa developer'
    },
    { 
      icon: FiDatabase, 
      title: 'Supabase Database', 
      desc: 'Data tersimpan aman dengan RLS dan real-time subscription. Backup otomatis setiap hari.',
      benefit: 'Data aman & real-time'
    },
    { 
      icon: FiShield, 
      title: 'Keamanan Enterprise', 
      desc: 'Authentication, Row Level Security, dan enkripsi data. Perlindungan dari serangan umum.',
      benefit: 'Keamanan tingkat tinggi'
    },
    { 
      icon: FiSettings, 
      title: 'Multi Halaman', 
      desc: 'Homepage, Kantor, Testimonial, Galeri, dan lainnya. Semua bisa diatur dari admin.',
      benefit: 'Fitur lengkap siap pakai'
    },
    { 
      icon: FiZap, 
      title: 'Next.js 14', 
      desc: 'Performansi tinggi dengan SSR, ISR, dan App Router. Website loading super cepat.',
      benefit: 'Cepat & SEO friendly'
    },
    { 
      icon: FiUsers, 
      title: 'Manajemen Tim', 
      desc: 'Kelola informasi tim dengan lengkap: nama, posisi, lulusan, keahlian, dan foto.',
      benefit: 'Profil tim profesional'
    },
  ]

  const trustBadges = [
    { icon: FiShield, label: '100% Garansi Uang Kembali' },
    { icon: FiClock, label: '24/7 Support Teknis' },
    { icon: FiThumbsUp, label: 'Sudah Dipakai 50+ Klien' },
    { icon: FiAward, label: 'Sertifikat Keamanan' },
  ]

  const faqs: FAQ[] = [
    {
      question: 'Apakah saya bisa mengelola sendiri konten website?',
      answer: 'Ya! Dengan admin panel yang lengkap, Anda bisa mengelola semua konten tanpa perlu coding. Edit hero slideshow, tambah kantor, kelola testimonial, dan lainnya.'
    },
    {
      question: 'Bagaimana cara deploy website ini?',
      answer: 'Kami menyediakan dokumentasi lengkap langkah demi langkah. Anda juga bisa menggunakan jasa setup deployment kami (tersedia di paket Premium).'
    },
    {
      question: 'Apakah data saya aman?',
      answer: 'Sangat aman. Menggunakan Supabase dengan Row Level Security, autentikasi, dan enkripsi. Data Anda hanya bisa diakses oleh yang berhak.'
    },
    {
      question: 'Apakah bisa custom design?',
      answer: 'Bisa! Source code fully customizable. Anda bisa mengubah warna, font, layout, dan menambahkan fitur sesuai kebutuhan.'
    },
    {
      question: 'Berapa lama proses pembuatan website?',
      answer: 'Dengan source code ini, Anda bisa memiliki website profesional dalam waktu 1-2 hari. Jika menggunakan jasa kami, estimasi 3-7 hari kerja.'
    },
  ]

  // ===== EFFECTS =====
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  useEffect(() => {
    if (showBuyModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showBuyModal])

  // ===== RENDER =====
  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden">
      {/* ===== SCHEMA MARKUP (SEO) ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Lp CMS - Company Profile Pro",
            "description": "Platform manajemen konten website profesional berbasis Next.js + Supabase",
            "applicationCategory": "WebApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "5000000",
              "priceCurrency": "IDR"
            }
          })
        }}
      />

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition">
                L
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Lp<span className="text-blue-600">CMS</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Fitur</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 transition">Demo</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Harga</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">Testimoni</a>
              <a href="/admin" target="_blank" className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition text-sm font-medium">
                Admin Login
              </a>
              <a
                href="#pricing"
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition text-sm font-medium hover:-translate-y-0.5"
              >
                Beli Sekarang
              </a>
            </nav>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-4 md:hidden"
          >
            <nav className="flex flex-col items-center gap-6 text-lg">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition">Fitur</a>
              <a href="#demo" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition">Demo</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition">Harga</a>
              <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 transition">Testimoni</a>
              <a href="/admin" target="_blank" className="w-full text-center px-4 py-3 bg-gray-100 rounded-xl text-gray-700">Admin Login</a>
              <a href="#pricing" className="w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">Beli Sekarang</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />
        <div className="absolute inset-0 bg-grid opacity-[0.02]" />
        <FloatingParticles />

        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center"
        >
          {/* Badge Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-6 border border-green-200"
          >
            <FiHeart className="text-green-500" fill="currentColor" />
            <span className="text-sm font-medium">🔥 50+ Klien Telah Percaya</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Kelola Website Anda
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lebih Mudah & Cepat
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Platform manajemen konten profesional berbasis Next.js + Supabase.
            Kelola semua halaman, konten, dan tim dalam satu dashboard terintegrasi.
            <span className="block text-sm text-blue-600 font-medium mt-2">
              🎯 Tanpa coding, siap pakai dalam 1 hari!
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <a
              href="#pricing"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <FiShoppingCart className="group-hover:scale-110 transition" />
              Beli Sekarang
              <FiArrowRight className="group-hover:translate-x-1 transition" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition"
            >
              <FiPlay size={18} />
              Lihat Demo
            </a>
            <a
              href="https://wa.me/6287733008821"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border border-green-500 text-green-600 rounded-full font-semibold hover:bg-green-50 transition"
            >
              <FaWhatsapp size={18} />
              Konsultasi Gratis
            </a>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { label: 'Klien Aktif', value: '50+' },
              { label: 'Modul Siap', value: '12+' },
              { label: 'Database', value: 'Supabase' },
              { label: 'Support', value: '24/7' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-sm">Scroll untuk eksplorasi</span>
            <FiChevronDown className="animate-bounce" size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="py-12 px-4 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 justify-center md:justify-start"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{badge.label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">
              FITUR UNGGULAN
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Semua yang Anda Butuhkan
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Platform all-in-one untuk mengelola konten website Anda dengan mudah dan efisien.
              <span className="block text-sm text-blue-600">✅ Tanpa coding, siap pakai</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 rounded-2xl group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon size={26} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      <FiCheck size={12} />
                      {feature.benefit}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-purple-600 bg-purple-100 rounded-full mb-4">
              KENAPA KAMI
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              4 Alasan Memilih Lp CMS
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiZap, title: 'Instan Siap Pakai', desc: 'Deploy dalam 1 hari, langsung kelola konten sendiri.' },
              { icon: FiShield, title: 'Keamanan Terjamin', desc: 'Database terenkripsi, autentikasi, dan RLS.' },
              { icon: FiUsers, title: 'Support 24/7', desc: 'Tim support siap membantu kapan pun Anda butuh.' },
              { icon: FiAward, title: 'Garansi Uang Kembali', desc: 'Puas atau uang kembali 100% dalam 30 hari.' },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== DEMO SECTION ===== */}
      <section id="demo" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-full mb-4">
              LIVE DEMO
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Lihat Admin Panel dalam Aksi
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-cyan-500 mx-auto mt-4 rounded-full" />
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Coba sendiri admin panel dan lihat bagaimana konten langsung berubah di website.
              <span className="block text-sm text-green-600">🎯 Demo gratis, tanpa registrasi!</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Screenshot / Mockup Admin Panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-sm mx-auto">Admin Panel - Dashboard</span>
                </div>
                <div className="p-4 bg-gray-900 min-h-[320px] flex items-center justify-center">
                  <div className="w-full max-w-md bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="w-32 h-3 bg-gray-600 rounded" />
                        <div className="w-20 h-2 bg-gray-700 rounded mt-1" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {['Hero Slideshow', 'Daftar Kantor', 'Testimonial', 'Statistik'].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-gray-300 text-sm">{item}</span>
                          <span className="ml-auto text-xs text-gray-500">Edit</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200 shadow-lg text-sm font-medium text-gray-700">
                <FiMonitor className="inline mr-1" /> Admin Panel
              </div>
            </motion.div>

            {/* Teks Demo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-900">Admin Panel yang Powerful & Intuitif</h3>
              <ul className="space-y-3">
                {[
                  'CRUD lengkap untuk semua konten website',
                  'Sidebar navigasi yang mudah digunakan',
                  'Upload gambar langsung ke Supabase Storage',
                  'Manajemen Tim dengan informasi lengkap',
                  'Real-time update, perubahan langsung terlihat',
                  'Responsif di semua device (desktop, tablet, mobile)'
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 text-gray-600"
                  >
                    <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="/demo"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
                >
                  <FiPlay size={18} /> Coba Demo Sekarang
                </a>
                <a
                  href="/admin"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  <FiExternalLink size={18} /> Admin Login
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-rose-600 bg-rose-100 rounded-full mb-4">
            TESTIMONI KLIEN
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Apa Kata Klien Kami
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-4 rounded-full mb-12" />

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 text-lg">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
                    <p className="text-xs text-blue-600 font-medium">{testimonials[activeTestimonial].company}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} fill="currentColor" size={20} className="mr-0.5" />
                  ))}
                </div>
                <p className="text-gray-600 text-lg italic leading-relaxed">"{testimonials[activeTestimonial].text}"</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === idx ? 'bg-blue-600 w-8' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-4">
              PAKET HARGA
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pilih Paket yang Sesuai
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full" />
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Pilih paket yang paling sesuai dengan kebutuhan bisnis Anda.
              <span className="block text-sm text-green-600">💰 Hemat 25% dengan paket tahunan!</span>
            </p>

            {/* Toggle Monthly/Yearly */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-medium ${selectedPlan === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
                Bulanan
              </span>
              <button
                onClick={() => setSelectedPlan(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-1 transition shadow-md"
              >
                <motion.div
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: selectedPlan === 'yearly' ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </button>
              <span className={`text-sm font-medium ${selectedPlan === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
                Tahunan <span className="text-green-600 text-xs font-bold">(hemat 25%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border transition-all duration-300 ${
                  plan.isPopular
                    ? 'border-purple-500 shadow-xl ring-2 ring-purple-500/20'
                    : 'border-gray-200 hover:shadow-xl'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                    {plan.badge || 'Paling Populer'}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-gray-900">
                      {selectedPlan === 'monthly' ? plan.price : plan.priceYearly}
                    </span>
                    <span className="text-gray-400 text-sm block">
                      /{selectedPlan === 'monthly' ? 'bulan' : 'tahun'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-gray-600 text-sm">
                      <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.buttonLink === '#buy' ? '#' : plan.buttonLink}
                  onClick={(e) => {
                    if (plan.buttonLink === '#buy') {
                      e.preventDefault()
                      setSelectedBuyPlan(plan.name)
                      setShowBuyModal(true)
                    }
                  }}
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:-translate-y-0.5'
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:-translate-y-0.5'
                  }`}
                >
                  {plan.buttonText}
                </a>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            *Harga belum termasuk PPN. Support dan update 1 tahun.
            <br />
            💳 Pembayaran via transfer bank, QRIS, atau kartu kredit.
          </p>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-amber-600 bg-amber-100 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Pertanyaan Umum
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <h3 className="font-bold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-white/10 rounded-full mb-4 backdrop-blur-sm border border-white/10">
              🚀 SIAP MEMULAI?
            </span>
            <h2 className="text-3xl md:text-5xl font-bold">
              Siap Digitalisasi Website Anda?
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Dapatkan website profesional dengan admin panel lengkap.
              Konsultasikan kebutuhan Anda sekarang, gratis!
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-xl transition hover:-translate-y-1"
              >
                <FiShoppingCart size={18} />
                Beli Sekarang
                <FiArrowRight className="group-hover:translate-x-1 transition" />
              </a>
              <a
                href="https://wa.me/6287733008821"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 backdrop-blur-sm rounded-full font-semibold hover:bg-white/10 transition"
              >
                <FaWhatsapp size={18} />
                Konsultasi Gratis
              </a>
              <a
                href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 backdrop-blur-sm rounded-full font-semibold hover:bg-white/10 transition"
              >
                <FiPlay size={18} />
                Lihat Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  L
                </div>
                <span className="font-bold text-gray-800">Lp CMS</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">
                Solusi manajemen konten website profesional berbasis Next.js + Supabase.
                Kelola konten sendiri, tanpa coding.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
                  <FiGlobe size={18} />
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition">
                  <FiMessageSquare size={18} />
                </a>
                <a href="https://wa.me/6287733008821" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-lg hover:bg-green-50 hover:text-green-600 transition">
                  <FaWhatsapp size={18} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Navigasi</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-blue-600 transition">Fitur</a></li>
                <li><a href="#demo" className="hover:text-blue-600 transition">Demo</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 transition">Harga</a></li>
                <li><a href="#testimonials" className="hover:text-blue-600 transition">Testimoni</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2"><FiMail size={14} className="text-blue-500" />rahadin06@gmail.com</li>
                <li className="flex items-center gap-2"><FiPhone size={14} className="text-green-500" /> (024) 1234567</li>
                <li className="flex items-center gap-2"><FaWhatsapp size={14} className="text-green-600" /> 0877-3300-8821</li>
                <li className="flex items-center gap-2"><FiMapPin size={14} className="text-red-500" /> Brebes, Indonesia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Jam Operasional</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Senin - Jumat: 08.00 - 17.00</li>
                <li>Sabtu: 08.00 - 13.00</li>
                <li>Minggu: Tutup</li>
                <li className="text-blue-600 font-medium mt-2">Support 24/7 via WA</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">© 2025 LpCMS. All rights reserved. Built with ❤️ using Next.js</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== STICKY CTA (Mobile) ===== */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-3 md:hidden shadow-lg"
      >
        <div className="flex gap-3">
          <a
            href="#pricing"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-center text-sm hover:shadow-lg transition"
          >
            Beli Sekarang
          </a>
          <a
            href="https://wa.me/6287733008821"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 bg-green-500 text-white py-3 rounded-xl font-semibold text-center text-sm flex items-center justify-center gap-2"
          >
            <FaWhatsapp size={18} />
            WA
          </a>
        </div>
      </motion.div>

      {/* ===== BUY MODAL ===== */}
      <AnimatePresence>
        {showBuyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBuyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <FiShoppingCart size={30} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Siap Memesan?</h3>
                <p className="text-gray-500 mt-2">
                  Anda memilih paket <strong>{selectedBuyPlan || 'Standard'}</strong>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedPlan === 'monthly' 
                    ? pricingPlans.find(p => p.name === selectedBuyPlan)?.price 
                    : pricingPlans.find(p => p.name === selectedBuyPlan)?.priceYearly}
                  /{selectedPlan === 'monthly' ? 'bulan' : 'tahun'}
                </p>

                <div className="mt-6 space-y-3 text-left">
                  <p className="text-sm font-medium text-gray-700">📋 Langkah Selanjutnya:</p>
                  <ol className="text-sm text-gray-500 space-y-2 list-decimal pl-5">
                    <li>Klik tombol di bawah untuk menghubungi kami</li>
                    <li>Konfirmasi paket dan metode pembayaran</li>
                    <li>Dapatkan akses source code dalam 1x24 jam</li>
                  </ol>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href="https://wa.me/6287733008821?text=Halo%2C%20saya%20tertarik%20membeli%20paket%20Lp%20CMS%20-%20{{selectedBuyPlan}}"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp size={20} />
                    Pesan via WhatsApp
                  </a>
                  <button
                    onClick={() => setShowBuyModal(false)}
                    className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition"
                  >
                    Tutup
                  </button>
                </div>
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
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
      `}</style>
    </div>
  )
}