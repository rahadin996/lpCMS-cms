// src/app/(public)/about/team/page.tsx
'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from 'framer-motion'
import { FiTwitter, FiLinkedin, FiMail, FiArrowRight, FiArrowUp, FiInstagram, FiFacebook } from 'react-icons/fi'

// ========== Type Definitions ==========
interface TeamMember {
  id: number
  name: string
  position: string
  expertise: string
  bio: string
  image: string
  social: {
    linkedin: string
    mail: string
  }
}

const teamMembers: TeamMember[] = [
  { id: 1, name: "Ir. Siti Zubaidah, M.Si", position: "Komisaris", expertise: "Kebijakan Publik", bio: "Memiliki pengalaman luas dalam pengembangan masyarakat dan kebijakan publik. Mengawasi arah strategis perusahaan dengan fokus pada keberlanjutan.", image: "https://randomuser.me/api/portraits/women/68.jpg", social: { linkedin: "#", mail: "siti@lppslh.com" } },
  { id: 2, name: "Fahmy Ibrahim Syarifuddin, SE, B.Sc", position: "Direktur", expertise: "Manajemen Proyek", bio: "Memimpin operasional perusahaan dengan pengalaman di bidang manajemen proyek dan konsultansi pembangunan.", image: "https://randomuser.me/api/portraits/men/32.jpg", social: { linkedin: "#", mail: "fahmy@lppslh.com" } },
  { id: 3, name: "Dr. Ir. Budi Santoso", position: "Senior Planner", expertise: "Perencanaan Wilayah", bio: "Ahli perencanaan wilayah dengan pengalaman lebih dari 15 tahun dalam penyusunan RTRW dan RDTR.", image: "https://randomuser.me/api/portraits/men/45.jpg", social: { linkedin: "#", mail: "budi@lppslh.com" } },
  { id: 4, name: "Ir. Siti Nurhaliza, M.Sc", position: "Konsultan GIS", expertise: "Sistem Informasi Geografis", bio: "Pakar pemetaan digital dan analisis spasial, berpengalaman dalam proyek-proyek infrastruktur nasional.", image: "https://randomuser.me/api/portraits/women/55.jpg", social: { linkedin: "#", mail: "siti.n@lppslh.com" } },
  { id: 5, name: "M. Rizky, S.Si, M.T.", position: "Ahli GIS", expertise: "Pemodelan Spasial", bio: "Menguasai berbagai platform GIS dan pengembangan webGIS untuk perencanaan kota.", image: "https://randomuser.me/api/portraits/men/75.jpg", social: { linkedin: "#", mail: "rizky@lppslh.com" } },
  { id: 6, name: "Dewi Anggraini, S.Hut", position: "Konsultan Lingkungan", expertise: "AMDAL", bio: "Berpengalaman dalam penyusunan dokumen AMDAL dan UKL-UPL untuk berbagai sektor.", image: "https://randomuser.me/api/portraits/women/89.jpg", social: { linkedin: "#", mail: "dewi@lppslh.com" } },
]

export default function TeamPage() {
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
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop" alt="Team Hero" className="w-full h-full object-cover" />
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
            <span className="text-sm font-medium tracking-wide">Tim Ahli</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]"
          >
            Tim <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Kami</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Para profesional berpengalaman yang siap memberikan solusi terbaik untuk Anda.
          </motion.p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Grid Tim */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium mt-1">{member.position}</p>
                <p className="text-gray-500 text-sm mt-2">{member.expertise}</p>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{member.bio}</p>
                <div className="flex gap-3 mt-4">
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition"><FiLinkedin size={18} /></a>
                  <a href={`mailto:${member.social.mail}`} className="text-gray-400 hover:text-blue-600 transition"><FiMail size={18} /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Bergabung dengan tim kami?</h2>
          <p className="mt-4 text-gray-600">Lihat peluang karir dan menjadi bagian dari LPPSLH.</p>
          <div className="mt-8">
            <Link href="/careers" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Lihat Lowongan <FiArrowRight />
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