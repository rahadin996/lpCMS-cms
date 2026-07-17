'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  FiArrowRight, FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiUserCheck,
  FiTwitter, FiLinkedin, FiInstagram, FiFacebook, FiSend, FiArrowUp
} from 'react-icons/fi'

// Data lowongan pekerjaan
const jobs = [
  {
    id: 1,
    title: "Konsultan Perencanaan Wilayah",
    slug: "konsultan-perencanaan-wilayah",
    location: "Semarang",
    type: "Full Time",
    salary: "Negosiasi",
    experience: "Min. 3 tahun",
    deadline: "31 Desember 2024",
    description: "Kami mencari konsultan perencanaan wilayah yang berpengalaman dalam penyusunan RTRW, RDTR, dan studi kelayakan.",
    requirements: [
      "S1 Teknik Planologi / Perencanaan Wilayah dan Kota",
      "Memiliki pengalaman minimal 3 tahun",
      "Menguasai GIS dan analisis spasial",
      "Bisa bekerja dalam tim",
    ],
  },
  {
    id: 2,
    title: "Ahli GIS (Geographic Information System)",
    slug: "ahli-gis",
    location: "Jakarta",
    type: "Full Time",
    salary: "Negosiasi",
    experience: "Min. 2 tahun",
    deadline: "31 Desember 2024",
    description: "Mengelola dan mengembangkan sistem informasi geografis untuk berbagai proyek.",
    requirements: [
      "S1 Geodesi / Teknik Informatika / Geografi",
      "Menguasai ArcGIS, QGIS, dan pemrograman",
      "Memiliki pengalaman minimal 2 tahun",
    ],
  },
  {
    id: 3,
    title: "Konsultan Lingkungan",
    slug: "konsultan-lingkungan",
    location: "Semarang",
    type: "Full Time",
    salary: "Negosiasi",
    experience: "Min. 3 tahun",
    deadline: "31 Januari 2025",
    description: "Melakukan kajian AMDAL, UKL-UPL, dan dokumen lingkungan lainnya.",
    requirements: [
      "S1 Teknik Lingkungan / Ilmu Lingkungan",
      "Memiliki sertifikasi AMDAL",
      "Pengalaman 3 tahun",
    ],
  },
  {
    id: 4,
    title: "Project Manager Infrastruktur",
    slug: "project-manager-infrastruktur",
    location: "Jakarta",
    type: "Full Time",
    salary: "Negosiasi",
    experience: "Min. 5 tahun",
    deadline: "31 Januari 2025",
    description: "Memimpin tim manajemen proyek infrastruktur dari perencanaan hingga serah terima.",
    requirements: [
      "S1 Teknik Sipil",
      "Pengalaman 5 tahun",
      "Memiliki sertifikasi PMP lebih disukai",
    ],
  },
]

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState(null)
  const [showApplyForm, setShowApplyForm] = useState(false)
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

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const handleApply = (job) => {
    setSelectedJob(job)
    setShowApplyForm(true)
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop" alt="Careers Hero" className="w-full h-full object-cover" />
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
            <span className="text-sm font-medium tracking-wide">Karir</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]"
          >
            Bergabung <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Bersama Kami</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            LPPSLH membuka peluang karir bagi profesional yang ingin berkontribusi dalam pembangunan berkelanjutan.
          </motion.p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Keunggulan Bekerja di LPPSLH */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">MENGAPA BERGABUNG?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Keunggulan Bekerja di LPPSLH</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: FiBriefcase, title: "Proyek Berdampak", desc: "Terlibat dalam proyek-proyek infrastruktur dan pemberdayaan masyarakat berskala nasional." },
            { icon: FiUserCheck, title: "Lingkungan Profesional", desc: "Bekerja dengan tim ahli yang berpengalaman dan mendukung pengembangan karir." },
            { icon: FiSend, title: "Pengembangan Kapasitas", desc: "Pelatihan dan sertifikasi rutin untuk meningkatkan kompetensi." },
          ].map((item, idx) => (
            <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center group hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daftar Lowongan */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-green-600 bg-green-100 rounded-full mb-4">LOWONGAN TERBUKA</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Posisi yang Tersedia</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="space-y-6">
            {jobs.map((job, idx) => (
              <motion.div key={job.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><FiMapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1"><FiClock size={14} /> {job.type}</span>
                      <span className="flex items-center gap-1"><FiBriefcase size={14} /> {job.experience}</span>
                      <span className="flex items-center gap-1"><FiDollarSign size={14} /> {job.salary}</span>
                    </div>
                    <p className="mt-3 text-gray-600">{job.description}</p>
                    <button onClick={() => handleApply(job)} className="inline-flex items-center gap-1 mt-4 text-blue-600 font-medium text-sm hover:gap-2 transition">
                      Lamar Sekarang <FiArrowRight size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Deadline: {job.deadline}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Lamaran */}
      {showApplyForm && selectedJob && (
        <section className="py-20 px-4 bg-white" id="apply-form">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Lamaran Pekerjaan</h2>
              <p className="text-gray-500 mb-6">Posisi: <span className="font-semibold text-blue-600">{selectedJob.title}</span> - {selectedJob.location}</p>
              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label><input type="text" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label><input type="tel" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Lampiran CV (PDF)</label><input type="file" accept=".pdf" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" required /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Pesan / Cover Letter</label><textarea rows="4" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"></textarea></div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Kirim Lamaran</button>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition">Batal</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-r from-blue-900/90 to-purple-900/90">
        <div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=600&fit=crop" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90"/></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Tidak menemukan posisi yang sesuai?</h2>
          <p className="mt-4 text-lg text-white/80">Tetap kirimkan CV Anda, kami akan menghubungi jika ada posisi yang cocok.</p>
          <div className="mt-8">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:shadow-xl transition">Kirim CV Spontan <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-2xl text-gray-900">LPPSLH</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">KONSULTAN</span>
              </div>
              <p className="text-gray-500 text-sm">Mitra strategis dalam perencanaan wilayah dan konsultansi berkelanjutan.</p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-gray-600"><FiTwitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-gray-600"><FiLinkedin size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-gray-600"><FiInstagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-gray-600"><FiFacebook size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/services" className="hover:text-gray-900">Perencanaan Strategis</Link></li>
                <li><Link href="/services" className="hover:text-gray-900">Konsultansi Lingkungan</Link></li>
                <li><Link href="/services" className="hover:text-gray-900">Manajemen Proyek</Link></li>
                <li><Link href="/services" className="hover:text-gray-900">Sistem Informasi Geografis</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/about" className="hover:text-gray-900">Tentang Kami</Link></li>
                <li><Link href="/careers" className="hover:text-gray-900">Karir</Link></li>
                <li><Link href="/news" className="hover:text-gray-900">Berita</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Kontak</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Kantor Pusat</h4>
              <address className="text-gray-500 text-sm not-italic">
                Jl. Ngesrep Barat III No.30 G<br />
                Semarang, Jawa Tengah 50261<br />
                Tel: (024) 7472581<br />
                Email: pt.lppslh@yahoo.com
              </address>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} LPPSLH. All rights reserved. | Desain premium oleh tim kreatif.
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
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
    </div>
  )
}