// src/app/(public)/faq/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  FiArrowRight, FiChevronDown, FiChevronUp, FiArrowUp, 
  FiChevronLeft, FiChevronRight, FiChevronDown as FiChevronDownIcon
} from 'react-icons/fi'

// ========== TYPES ==========
interface FaqItem {
  id: number
  q: string
  a: string
  order: number
}

interface SlideItem {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
}

// ========== DEFAULT DATA ==========
const DEFAULT_SLIDES: SlideItem[] = [
  {
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop",
    badge: "PERTANYAAN UMUM",
    title: "Jawaban atas",
    highlight: "Semua Pertanyaan Anda",
    description: "Temukan informasi lengkap tentang layanan, prosedur, dan kebijakan LPPSLH."
  },
  {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop",
    badge: "LAYANAN KAMI",
    title: "Konsultansi Profesional",
    highlight: "Solusi Terpercaya",
    description: "Mulai dari perencanaan strategis hingga konsultansi lingkungan dan manajemen proyek."
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop",
    badge: "DUKUNG KAMI",
    title: "Tim Ahli Siap",
    highlight: "Membantu Anda",
    description: "Customer service kami siap menjawab setiap pertanyaan Anda dengan cepat dan tepat."
  }
]

const DEFAULT_FAQS: FaqItem[] = [
  { id: 1, q: 'Apa saja layanan unggulan LPPSLH?', a: 'Kami menyediakan perencanaan strategis, konsultansi lingkungan, manajemen proyek, GIS, kajian kelayakan, pemberdayaan masyarakat, transformasi digital, dan konsultasi hukum.', order: 0 },
  { id: 2, q: 'Bagaimana cara memulai konsultasi dengan LPPSLH?', a: 'Anda dapat mengisi form kontak di halaman Contact atau menghubungi langsung nomor telepon kami. Tim kami akan merespon dalam 24 jam.', order: 1 },
  { id: 3, q: 'Apakah LPPSLH memiliki pengalaman internasional?', a: 'Ya, kami telah mengerjakan proyek di beberapa negara Asia Tenggara dan bekerjasama dengan lembaga internasional seperti World Bank dan ADB.', order: 2 },
  { id: 4, q: 'Berapa lama waktu penyelesaian proyek konsultansi?', a: 'Tergantung kompleksitas proyek. Rata-rata studi kelayakan memakan waktu 3-6 bulan, sedangkan perencanaan masterplan 6-12 bulan.', order: 3 },
  { id: 5, q: 'Apakah LPPSLH menyediakan pelatihan?', a: 'Ya, kami memiliki program capacity building untuk pemerintah daerah dan swasta, termasuk workshop dan sertifikasi.', order: 4 },
  { id: 6, q: 'Bagaimana sistem pembayaran jasa konsultansi?', a: 'Kami menerapkan sistem termin berdasarkan progress pekerjaan, sesuai kesepakatan dalam kontrak.', order: 5 },
  { id: 7, q: 'Apakah LPPSLH memiliki tenaga ahli bersertifikasi?', a: 'Ya, seluruh tenaga ahli kami memiliki sertifikasi nasional maupun internasional di bidangnya.', order: 6 },
  { id: 8, q: 'Bagaimana cara bergabung menjadi mitra atau karyawan?', a: 'Silakan kunjungi halaman Careers untuk melihat lowongan terbuka atau kirim CV spontan melalui form kontak.', order: 7 }
]

// ========== HERO SLIDESHOW ==========
const HeroSlideshow = ({ slides }: { slides: SlideItem[] }) => {
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
          <Link href="#faq-section" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="relative z-10">Lihat FAQ</span>
            <FiChevronDownIcon className="relative z-10" size={20} />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300" />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 hover:-translate-y-1 transition">
            Hubungi Kami
          </Link>
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
        <FiChevronDownIcon className="animate-bounce" size={20} />
      </div>
    </div>
  )
}

// ========== MAIN COMPONENT ==========
export default function FAQPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [slides, setSlides] = useState<SlideItem[]>(DEFAULT_SLIDES)
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // ========== FETCH DATA ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('page_contents')
          .select('section, value')
          .eq('page', 'faq')
          .eq('key', 'data')

        if (error) throw error

        if (data && data.length > 0) {
          data.forEach((item: any) => {
            try {
              const parsed = JSON.parse(item.value)
              if (item.section === 'slides') {
                const sorted = parsed.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                setSlides(sorted)
              } else if (item.section === 'faqs') {
                const sorted = parsed.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                setFaqs(sorted)
              }
            } catch (e) { console.error('Parse error', e) }
          })
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [supabase])

  // ========== SCROLL BACK TO TOP ==========
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = (): void => window.scrollTo({ top: 0, behavior: 'smooth' })

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Memuat data FAQ...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="bg-white overflow-x-hidden">
      <HeroSlideshow slides={slides} />

      {/* FAQ SECTION */}
      <section id="faq-section" className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pertanyaan yang Sering Diajukan</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center p-6 text-left font-semibold text-gray-800 hover:bg-gray-50 transition"
              >
                {faq.q}
                {activeIndex === idx ? <FiChevronUp className="text-blue-600" /> : <FiChevronDown className="text-gray-400" />}
              </button>
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 text-gray-500 border-t border-gray-100"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Masih punya pertanyaan?</h2>
          <p className="mt-4 text-gray-600">Hubungi tim customer service kami untuk informasi lebih lanjut.</p>
          <div className="mt-8">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Hubungi Kami <FiArrowRight />
            </Link>
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
    </div>
  )
}