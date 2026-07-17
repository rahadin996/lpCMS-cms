'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from 'framer-motion'
import {
  FiMapPin, FiPhone, FiMail, FiClock, FiArrowRight, FiArrowUp,
  FiTwitter, FiLinkedin, FiInstagram, FiFacebook,
  FiCompass, FiNavigation, FiGlobe, FiStar, FiWifi,
  FiMap, FiCopy, FiCheck, FiCalendar, FiUser, FiMessageCircle,
  FiCamera, FiZoomIn, FiX, FiChevronLeft, FiChevronRight, FiChevronDown,
  FiUsers, FiAward, FiTrendingUp, FiShield, FiCoffee, FiShoppingBag, FiBriefcase
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { createClient } from '@/lib/supabase/client'

// ========== TYPE DEFINITIONS ==========
interface Office {
  id?: number
  name: string
  type: string
  city: string
  address: string
  phone: string
  whatsapp: string
  email: string
  mapUrl: string
  lat: number
  lng: number
  gradient: string
  icon_name: string
  workingHours: string
  gallery: string[]
  nearbyPlaces: string[]
  contactPerson: { name: string; title: string; phone: string }
}

interface StatItem {
  id?: string
  icon: string
  value: string
  label: string
  color: string
}

interface HeroSlide {
  id?: string
  image: string
  badge: string
  title: string
  highlight: string
  description: string
  order: number
}

// ========== ICON MAPPING ==========
import * as Icons from 'react-icons/fi'
const iconMap: Record<string, IconType> = {
  FiCompass: Icons.FiCompass,
  FiNavigation: Icons.FiNavigation,
  FiMapPin: Icons.FiMapPin,
  FiGlobe: Icons.FiGlobe,
  FiStar: Icons.FiStar,
  FiClock: Icons.FiClock,
  FiMail: Icons.FiMail,
  FiUser: Icons.FiUser,
  FiCalendar: Icons.FiCalendar,
  FiCamera: Icons.FiCamera,
  FiMessageCircle: Icons.FiMessageCircle,
  FiUsers: Icons.FiUsers,
  FiAward: Icons.FiAward,
  FiTrendingUp: Icons.FiTrendingUp,
  FiShield: Icons.FiShield,
}

// ========== DEFAULT DATA ==========
const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1920&h=1080&fit=crop',
    badge: 'KANTOR & STUDIO',
    title: 'Lokasi Strategis',
    highlight: 'di Semarang & Jakarta',
    description: 'Dua lokasi premium untuk melayani kebutuhan konsultasi Anda dengan fasilitas modern dan tim profesional.',
    order: 0
  },
  {
    image: 'https://images.unsplash.com/photo-1497366754035-f2008d2a7c4b?w=1920&h=1080&fit=crop',
    badge: 'NUANSA PROFESIONAL',
    title: 'Ruang Kerja',
    highlight: 'Kelas Dunia',
    description: 'Kantor dengan desain modern, ruang rapat premium, dan kenyamanan maksimal untuk kolaborasi.',
    order: 1
  },
  {
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1920&h=1080&fit=crop',
    badge: 'STUDIO KREATIF',
    title: 'Ruang Inovasi',
    highlight: 'Jakarta Selatan',
    description: 'Studio kreatif dengan fasilitas lengkap untuk workshop, diskusi, dan pengembangan ide.',
    order: 2
  }
]

const DEFAULT_STATS: StatItem[] = [
  { icon: 'FiClock', value: '24/7', label: 'Layanan Konsultasi', color: 'from-blue-500 to-cyan-500' },
  { icon: 'FiMapPin', value: '2', label: 'Lokasi Strategis', color: 'from-purple-500 to-pink-500' },
  { icon: 'FiMail', value: '24 Jam', label: 'Respon Cepat', color: 'from-green-500 to-emerald-500' },
  { icon: 'FiStar', value: '100%', label: 'Kepuasan Klien', color: 'from-amber-500 to-orange-500' },
]

const DEFAULT_OFFICES: Office[] = [
  {
    name: 'Kantor Pusat',
    type: 'Head Office',
    city: 'Semarang, Jawa Tengah',
    address: 'Jl. Ngesrep Barat III No.30 G, Kota Semarang, Jawa Tengah 50261',
    phone: '(024) 7472581',
    whatsapp: '6281234567890',
    email: 'pt.lppslh@yahoo.com',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.705820499239!2d110.39850801477063!3d-7.027148794457813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4d3f0d7e6b%3A0x4a2b5c8d9e1f3a7c!2sJl.%20Ngesrep%20Barat%20III%2C%20Semarang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    lat: -7.0271488,
    lng: 110.398508,
    gradient: 'from-blue-600 to-indigo-600',
    icon_name: 'FiCompass',
    workingHours: 'Senin - Jumat: 08.00 - 17.00 WIB | Sabtu: 08.00 - 13.00 WIB | Minggu: Tutup',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f2008d2a7c4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop'
    ],
    nearbyPlaces: ['Universitas Diponegoro', 'Simpang Lima Semarang', 'Kota Lama Semarang'],
    contactPerson: { name: 'Bapak Hendra', title: 'Customer Service Manager', phone: '081234567890' }
  },
  {
    name: 'Studio Jakarta',
    type: 'Creative Studio',
    city: 'Jakarta Selatan',
    address: 'Ruko Royal Palace Blok C5, Jl. Prof. DR. Soepomo No.178A, Tebet, 12870',
    phone: '(021) 38825070',
    whatsapp: '6281234567891',
    email: 'lppslh.konsultan.pt@gmail.com',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.166349436707!2d106.83465011476913!3d-6.236355795484318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3b5c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sJl.%20Prof.%20DR.%20Soepomo%20No.178A%2C%20Tebet%2C%20Jakarta%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    lat: -6.2363558,
    lng: 106.8346501,
    gradient: 'from-purple-600 to-pink-600',
    icon_name: 'FiNavigation',
    workingHours: 'Senin - Jumat: 09.00 - 18.00 WIB | Sabtu: 09.00 - 14.00 WIB | Minggu: Tutup',
    gallery: [
      'https://images.unsplash.com/photo-1497366815505-2a06b4c2d1b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f2008d2a7c4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop'
    ],
    nearbyPlaces: ['Kuningan City Mall', 'Tebet Eco Park', 'Setiabudi One', 'Kantor Kementerian PUPR'],
    contactPerson: { name: 'Ibu Dewi', title: 'Client Relation', phone: '081298765432' }
  }
]

// ========== MAIN COMPONENT ==========
export default function OfficesPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES)
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS)
  const [offices, setOffices] = useState<Office[]>(DEFAULT_OFFICES)

  const [copied, setCopied] = useState<boolean>(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    name: '', email: '', date: '', office: 'Kantor Pusat (Semarang)', message: ''
  })
  const [submitted, setSubmitted] = useState<boolean>(false)

  // ========== FETCH DATA ==========
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('page_contents')
          .select('section, value')
          .eq('page', 'offices')
          .eq('key', 'data')

        if (error) throw error

        if (data && data.length > 0) {
          data.forEach((item: any) => {
            try {
              const parsed = JSON.parse(item.value)
              if (item.section === 'hero_slides') {
                const sorted = parsed.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                setHeroSlides(sorted)
              } else if (item.section === 'stats') {
                setStats(parsed.length ? parsed : DEFAULT_STATS)
              } else if (item.section === 'offices_list') {
                setOffices(parsed.length ? parsed : DEFAULT_OFFICES)
              }
              // Bagian testimonial telah dihapus
            } catch (e) {
              console.error('Parse error section', item.section, e)
            }
          })
        }
      } catch (err: any) {
        console.error('Gagal fetch data offices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  // ========== SCROLL EFFECT ==========
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: '', email: '', date: '', office: 'Kantor Pusat (Semarang)', message: '' })
  }

  const allGalleryImages = offices.flatMap(office => office.gallery)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-500">Memuat data kantor...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden">
      {/* HERO SLIDESHOW */}
      <HeroSlideshow slides={heroSlides} />

      {/* STATISTIK */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconComponent = iconMap[stat.icon] || FiStar
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: 'spring' }}
                className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <IconComponent size={28} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">KEUNGGULAN</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Mengapa Memilih Kantor Kami?</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4"><FiMapPin size={32} className="text-blue-600" /></div>
              <h3 className="text-xl font-bold">Lokasi Strategis</h3>
              <p className="text-gray-500 mt-2">Dekat pusat bisnis, akses mudah dari tol, stasiun, dan bandara.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4"><FiUsers size={32} className="text-purple-600" /></div>
              <h3 className="text-xl font-bold">Tim Profesional</h3>
              <p className="text-gray-500 mt-2">Didukung oleh ahli bersertifikasi dengan pengalaman luas.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><FiShield size={32} className="text-green-600" /></div>
              <h3 className="text-xl font-bold">Fasilitas Premium</h3>
              <p className="text-gray-500 mt-2">Ruang rapat modern, WiFi cepat, dan area parkir luas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DAFTAR KANTOR */}
      <section id="offices" className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">LOKASI KAMI</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Kantor & Studio</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto">Kunjungi kantor kami di dua lokasi strategis untuk konsultasi dan kerjasama</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offices.map((office, idx) => {
            const IconComponent = iconMap[office.icon_name] || FiCompass
            return (
              <TiltCard key={idx} className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500">
                <div className={`relative p-8 bg-gradient-to-r ${office.gradient} text-white`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 blur-2xl" />
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">{office.type}</span>
                      <h3 className="text-2xl font-bold mt-3">{office.name}</h3>
                      <p className="text-white/80 text-sm mt-1">{office.city}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition">
                      <IconComponent size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><FiMapPin className="text-blue-600" size={20} /></div>
                      <div><h4 className="font-semibold text-gray-900">Alamat</h4><p className="text-gray-600 text-sm leading-relaxed">{office.address}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a href={`tel:${office.phone}`} className="inline-flex items-center gap-2 text-sm bg-gray-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition"><FiPhone size={14} /> {office.phone}</a>
                      <a href={`https://wa.me/${office.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition"><FiMessageCircle size={14} /> WhatsApp</a>
                      <button onClick={() => copyAddress(office.address)} className="inline-flex items-center gap-2 text-sm bg-gray-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">{copied ? <FiCheck /> : <FiCopy />} Salin Alamat</button>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 text-gray-700"><FiClock className="text-blue-500" /><span className="font-semibold">Jam Operasional</span></div>
                      <p className="text-gray-600 text-sm ml-6 mt-1">{office.workingHours}</p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 text-gray-700"><FiMapPin className="text-green-500" /><span className="font-semibold">Tempat Terdekat</span></div>
                      <div className="flex flex-wrap gap-2 mt-2 ml-6">
                        {office.nearbyPlaces.map((place, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{place}</span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 text-gray-700"><FiUser className="text-amber-500" /><span className="font-semibold">Contact Person</span></div>
                      <p className="text-gray-600 text-sm ml-6 mt-1">{office.contactPerson.name} ({office.contactPerson.title}) - {office.contactPerson.phone}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl overflow-hidden shadow-md border border-gray-100">
                    <iframe src={office.mapUrl} width="100%" height="280" style={{ border: 0 }} allowFullScreen loading="lazy" title={`Map ${office.name}`} />
                  </div>

                  <div className="mt-5 flex justify-between items-center">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${office.lat},${office.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:gap-3 transition-all">Buka di Google Maps <FiArrowRight size={14} /></a>
                    <button onClick={() => window.open(`https://wa.me/${office.whatsapp}?text=Halo,%20saya%20tertarik%20untuk%20konsultasi%20di%20${office.name}`, '_blank')} className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-green-600 transition"><FiMessageCircle /> Chat Now</button>
                  </div>
                </div>
              </TiltCard>
            )
          })}
        </div>
      </section>

      {/* GALERI */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full mb-4">SUASANA KANTOR</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Lihat Langsung Suasana Kantor Kami</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mt-4 rounded-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allGalleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
                onClick={() => setLightboxIndex(idx)}
              >
                <img src={img} alt={`Kantor LPPSLH ${idx+1}`} className="w-full h-72 object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-start p-6">
                  <span className="text-white font-medium flex items-center gap-2"><FiCamera /> Lihat Detail</span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">*Foto asli dari kantor LPPSLH - Semarang & Jakarta</p>
        </div>
      </section>

      {/* FORM JADWAL KUNJUNGAN */}
      <section id="schedule" className="py-20 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-2">
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 text-white flex flex-col justify-center">
              <FiCalendar size={40} className="mb-4" />
              <h3 className="text-2xl font-bold">Jadwalkan Kunjungan</h3>
              <p className="mt-2 text-gray-200">Isi formulir untuk mengatur konsultasi langsung di kantor kami. Tim kami akan menghubungi Anda dalam 1x24 jam.</p>
              <div className="mt-6 flex gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><FiPhone /></div>
                <div><p className="font-semibold">Butuh cepat?</p><p className="text-sm">Hubungi (024) 7472581</p></div>
              </div>
            </div>
            <div className="p-8">
              {submitted ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiCheck size={30} className="text-green-600" /></div>
                  <h3 className="text-xl font-bold">Terima kasih!</h3>
                  <p className="text-gray-500 mt-2">Permintaan kunjungan Anda telah diterima.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama Anda" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@example.com" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Kunjungan</label>
                    <div className="relative"><FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pilih Kantor</label>
                    <select value={formData.office} onChange={(e) => setFormData({...formData, office: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                      {offices.map((off, idx) => (
                        <option key={idx} value={off.name}>{off.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pesan (Opsional)</label>
                    <textarea rows={2} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tanyakan sesuatu..." />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">Kirim Permintaan</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={allGalleryImages}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex(prev => (prev !== null ? (prev > 0 ? prev - 1 : allGalleryImages.length - 1) : 0))}
            onNext={() => setLightboxIndex(prev => (prev !== null ? (prev < allGalleryImages.length - 1 ? prev + 1 : 0) : 0))}
          />
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Siap Berkolaborasi?</h2>
          <p className="mt-4 text-gray-200">Hubungi kami sekarang untuk konsultasi profesional di kantor terdekat.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="tel:+62247472581" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:shadow-xl transition hover:-translate-y-0.5"><FiPhone /> Hubungi Semarang</a>
            <a href="tel:+622138825070" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:shadow-xl transition hover:-translate-y-0.5"><FiPhone /> Hubungi Jakarta</a>
            <a href="#schedule" className="inline-flex items-center gap-2 bg-transparent border border-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition"><FiCalendar /> Jadwalkan</a>
          </div>
        </div>
      </section>

      {/* BACK TO TOP */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition z-40"
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx>{`
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

// ========== HERO SLIDESHOW ==========
const HeroSlideshow = ({ slides }: { slides: HeroSlide[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => { setDirection(1); setCurrentIndex((prev) => (prev + 1) % slides.length) }
  const prevSlide = () => { setDirection(-1); setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length) }
  const goToSlide = (index: number) => { setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index) }

  useEffect(() => {
    intervalRef.current = setInterval(() => nextSlide(), 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const pauseAutoSlide = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  const resumeAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => nextSlide(), 5000)
  }

  const bgVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.7 }
    }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.7 } },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.5 }
    })
  }

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  const currentSlide = slides[currentIndex]

  if (!currentSlide) return null

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" onMouseEnter={pauseAutoSlide} onMouseLeave={resumeAutoSlide}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div key={currentIndex} custom={direction} variants={bgVariants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
          <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-30" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000" />

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 text-white">
        <AnimatePresence mode="wait">
          <motion.div key={`badge-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium tracking-wide">{currentSlide.badge}</span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1 key={`title-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit"
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
            {currentSlide.title}<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentSlide.highlight}
            </span>
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p key={`desc-${currentIndex}`} variants={textVariants} initial="enter" animate="center" exit="exit"
            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            {currentSlide.description}
          </motion.p>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-wrap gap-4 justify-center">
          <a href="#offices" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="relative z-10">Lihat Kantor Kami</span>
            <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300" />
          </a>
          <a href="#schedule" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 hover:-translate-y-1 transition">
            Jadwalkan Kunjungan
          </a>
        </motion.div>
      </div>

      <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition"><FiChevronLeft size={24} /></button>
      <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition"><FiChevronRight size={24} /></button>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-10">
        <FiChevronDown className="animate-bounce" size={20} />
      </div>
    </div>
  )
}

// ========== TILT CARD ==========
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5
    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 })

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ========== LIGHTBOX ==========
const Lightbox: React.FC<{ images: string[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void }> = ({ images, index, onClose, onPrev, onNext }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
    onClick={onClose}
  >
    <button className="absolute top-6 right-6 text-white text-3xl z-10 hover:scale-110 transition"><FiX /></button>
    <button className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl hover:scale-110 transition" onClick={(e) => { e.stopPropagation(); onPrev(); }}><FiChevronLeft /></button>
    <button className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl hover:scale-110 transition" onClick={(e) => { e.stopPropagation(); onNext(); }}><FiChevronRight /></button>
    <img src={images[index]} alt="gallery" className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
    <p className="absolute bottom-6 text-white/80 text-sm">{index+1} / {images.length}</p>
  </motion.div>
)