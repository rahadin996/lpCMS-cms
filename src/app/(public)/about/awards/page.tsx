// src/app/(public)/awards/page.tsx
'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from 'framer-motion'
import { FiAward, FiTv, FiCloud, FiCheckCircle, FiTwitter, FiLinkedin, FiInstagram, FiFacebook, FiArrowUp } from 'react-icons/fi'
import { IconType } from 'react-icons'

// Type definitions
interface AwardItem {
  title: string
  organizer: string
  year: number
  icon: IconType
  desc: string
}

const awardsData: AwardItem[] = [
  { title: "Best Consulting Firm 2024", organizer: "World Bank", year: 2024, icon: FiAward, desc: "Penghargaan untuk konsultan terbaik dalam proyek infrastruktur berkelanjutan." },
  { title: "Innovation in Urban Planning", organizer: "ADB", year: 2023, icon: FiTv, desc: "Inovasi dalam perencanaan kota pintar dan digital twin." },
  { title: "Green Company Award", organizer: "Ministry of Environment", year: 2022, icon: FiCloud, desc: "Komitmen terhadap lingkungan dan pembangunan berkelanjutan." },
  { title: "Sertifikasi ISO 9001:2015", organizer: "TUV Rheinland", year: 2021, icon: FiCheckCircle, desc: "Sertifikasi manajemen mutu terakreditasi internasional." },
  { title: "Penghargaan Konsultan Terbaik", organizer: "KADIN Jawa Tengah", year: 2020, icon: FiAward, desc: "Apresiasi atas kontribusi dalam pembangunan daerah." },
]

export default function AwardsPage() {
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&h=1080&fit=crop" alt="Awards Hero" className="w-full h-full object-cover" />
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
            <span className="text-sm font-medium tracking-wide">Penghargaan & Sertifikasi</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]"
          >
            Penghargaan & <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Sertifikasi</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Pengakuan atas dedikasi dan kualitas layanan LPPSLH di tingkat nasional dan internasional.
          </motion.p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Grid Penghargaan */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awardsData.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition group"
              >
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                  <Icon size={32} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center">{item.title}</h3>
                <p className="text-sm text-gray-500 text-center mt-1">{item.organizer} • {item.year}</p>
                <p className="text-gray-600 text-sm text-center mt-3">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Prestasi yang terus bertambah</h2>
          <p className="mt-4 text-gray-600">LPPSLH berkomitmen untuk terus meningkatkan kualitas dan inovasi.</p>
          <div className="mt-8">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Hubungi Kami <FiArrowUp className="rotate-90" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div><div className="flex items-center gap-2 mb-4"><span className="font-bold text-2xl text-gray-900">LPPSLH</span><span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">KONSULTAN</span></div><p className="text-gray-500 text-sm">Mitra strategis dalam perencanaan wilayah dan konsultansi berkelanjutan.</p><div className="flex gap-4 mt-6"><a href="#" className="text-gray-400 hover:text-gray-600"><FiTwitter size={20} /></a><a href="#" className="text-gray-400 hover:text-gray-600"><FiLinkedin size={20} /></a><a href="#" className="text-gray-400 hover:text-gray-600"><FiInstagram size={20} /></a><a href="#" className="text-gray-400 hover:text-gray-600"><FiFacebook size={20} /></a></div></div>
            <div><h4 className="font-semibold text-gray-900 mb-4">Layanan</h4><ul className="space-y-2 text-gray-500 text-sm"><li><Link href="/services">Perencanaan Strategis</Link></li><li><Link href="/services">Konsultansi Lingkungan</Link></li><li><Link href="/services">Manajemen Proyek</Link></li><li><Link href="/services">Sistem Informasi Geografis</Link></li></ul></div>
            <div><h4 className="font-semibold text-gray-900 mb-4">Perusahaan</h4><ul className="space-y-2 text-gray-500 text-sm"><li><Link href="/about">Tentang Kami</Link></li><li><Link href="/careers">Karir</Link></li><li><Link href="/news">Berita</Link></li><li><Link href="/contact">Kontak</Link></li></ul></div>
            <div><h4 className="font-semibold text-gray-900 mb-4">Kantor Pusat</h4><address className="text-gray-500 text-sm not-italic">Jl. Ngesrep Barat III No.30 G<br />Semarang, Jawa Tengah 50261<br />Tel: (024) 7472581<br />Email: pt.lppslh@yahoo.com</address></div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">&copy; {new Date().getFullYear()} LPPSLH. All rights reserved. | Desain premium oleh tim kreatif.</div>
        </div>
      </footer>

      {/* Back to Top */}
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