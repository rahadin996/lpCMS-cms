// src/app/(public)/contact/page.tsx
'use client'

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle, 
  FiArrowUp, FiAlertCircle, FiUser, FiPhoneCall, FiEdit3, 
  FiChevronLeft, FiChevronRight, FiChevronDown
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

// ========== TYPES ==========
interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

interface OfficeInfo {
  title: string
  address: string
  phone: string
  email: string
  hours: string
  gradient: string
  mapUrl?: string
  lat?: number | string
  lng?: number | string
}

interface SlideItem {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
}

interface CtaData {
  title: string
  description: string
  button_text_semarang: string
  button_link_semarang: string
  button_text_jakarta: string
  button_link_jakarta: string
}

// ========== DEFAULT DATA ==========
const DEFAULT_SLIDES: SlideItem[] = [
  {
    image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop",
    badge: "HUBUNGI KAMI",
    title: "Siap Membantu",
    highlight: "Konsultasi & Informasi",
    description: "Tim customer service kami siap membantu Anda Senin - Sabtu, 08.00 - 18.00."
  },
  {
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop",
    badge: "KANTOR KAMI",
    title: "Lokasi Strategis",
    highlight: "Semarang & Jakarta",
    description: "Dua kantor yang siap melayani kebutuhan konsultasi dan kerjasama Anda."
  },
  {
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop",
    badge: "RESPON CEPAT",
    title: "24 Jam",
    highlight: "Layanan Tanggap",
    description: "Setiap pesan akan kami balas dalam waktu kurang dari 24 jam kerja."
  }
]

const DEFAULT_OFFICES: OfficeInfo[] = [
  { 
    title: "Kantor Pusat Semarang", 
    address: "Jl. Ngesrep Barat III No.30 G, Semarang, Jawa Tengah 50261", 
    phone: "(024) 7472581", 
    email: "pt.lppslh@yahoo.com", 
    hours: "Senin - Jumat: 08.00 - 17.00",
    gradient: "from-blue-500 to-cyan-500",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.705820499239!2d110.39850801477063!3d-7.027148794457813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4d3f0d7e6b%3A0x4a2b5c8d9e1f3a7c!2sJl.%20Ngesrep%20Barat%20III%2C%20Semarang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
    lat: -7.0271488,
    lng: 110.398508
  },
  { 
    title: "Studio Jakarta Selatan", 
    address: "Ruko Royal Palace Blok C5, Jl. Prof. DR. Soepomo No.178A, Tebet, Jakarta Selatan 12870", 
    phone: "(021) 38825070", 
    email: "lppslh.konsultan.pt@gmail.com", 
    hours: "Senin - Jumat: 09.00 - 18.00",
    gradient: "from-purple-500 to-pink-500",
    mapUrl: "",
    lat: -6.2363558,
    lng: 106.8346501
  },
]

const DEFAULT_CTA: CtaData = {
  title: 'Butuh bantuan segera?',
  description: 'Hubungi tim customer service kami langsung melalui telepon.',
  button_text_semarang: '📞 Kantor Semarang',
  button_link_semarang: 'tel:+62247472581',
  button_text_jakarta: '📞 Studio Jakarta',
  button_link_jakarta: 'tel:+622138825070'
}

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
        </motion.div>
      </AnimatePresence>

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
          <a href="#contact-form" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="relative z-10">Kirim Pesan</span>
            <FiSend className="relative z-10 group-hover:translate-x-1 transition" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300" />
          </a>
          <a href="tel:+62247472581" className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium hover:bg-white/20 hover:-translate-y-1 transition">
            <FiPhoneCall /> Hubungi Kami
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

// ========== KOMPONEN FLOATING INPUT (SEDERHANA) ==========
const FloatingInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false,
  icon: Icon,
  textarea = false
}: { 
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  required?: boolean
  icon?: React.ElementType
  textarea?: boolean
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  useEffect(() => {
    setIsFilled(value.length > 0)
  }, [value])

  const Component = textarea ? 'textarea' : 'input'

  return (
    <div className="relative group">
      <div className="relative">
        <Component
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          rows={textarea ? 4 : undefined}
          className={`
            w-full px-4 py-3 bg-white border rounded-xl transition-all duration-200 outline-none
            ${isFocused ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-gray-200'}
            ${error ? 'border-red-500 ring-4 ring-red-500/20' : ''}
            ${Icon ? 'pl-11' : ''}
            ${textarea ? 'resize-none' : ''}
            text-gray-900 placeholder-transparent
          `}
          placeholder={label}
        />
        <label
          className={`
            absolute left-3 transition-all duration-200 pointer-events-none
            ${Icon ? 'left-11' : 'left-3'}
            ${(isFocused || isFilled) 
              ? 'text-xs -top-2 bg-white px-1 text-blue-500' 
              : 'text-gray-500 top-3.5'
            }
          `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {Icon && (
          <Icon className={`absolute left-3 top-3.5 w-5 h-5 transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <FiAlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  )
}

// ========== WHATSAPP FLOAT ==========
const WhatsAppFloat = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-2 mb-2"
          >
            <a href="https://wa.me/6281223456789" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 transition-all">
              <FaWhatsapp className="text-green-500" size={18} /> WhatsApp Semarang
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 transition-all">
              <FaWhatsapp className="text-green-500" size={18} /> WhatsApp Jakarta
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all"
      >
        <FaWhatsapp size={28} />
      </button>
    </div>
  )
}

// ========== MAIN COMPONENT ==========
export default function ContactPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [slides, setSlides] = useState<SlideItem[]>(DEFAULT_SLIDES)
  const [offices, setOffices] = useState<OfficeInfo[]>(DEFAULT_OFFICES)
  const [cta, setCta] = useState<CtaData>(DEFAULT_CTA)

  // Form state
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  
  const contactFormRef = useRef<HTMLDivElement>(null)

  // ========== FETCH DATA ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('page_contents')
          .select('section, value')
          .eq('page', 'contact')
          .eq('key', 'data')

        if (error) throw error

        if (data && data.length > 0) {
          data.forEach((item: any) => {
            try {
              const parsed = JSON.parse(item.value)
              if (item.section === 'slides') {
                const sorted = parsed.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                setSlides(sorted)
              } else if (item.section === 'offices') {
                setOffices(parsed)
              } else if (item.section === 'cta') {
                setCta(parsed)
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // ========== FORM HANDLERS ==========
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Nama harus diisi'
        if (value.trim().length < 2) return 'Minimal 2 karakter'
        return ''
      case 'email':
        if (!value.trim()) return 'Email harus diisi'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Email tidak valid'
        return ''
      case 'message':
        if (!value.trim()) return 'Pesan harus diisi'
        if (value.trim().length < 10) return 'Minimal 10 karakter'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSuccess(true)
    setFormData({ name: '', email: '', phone: '', message: '' })
    setTimeout(() => setIsSuccess(false), 5000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Memuat data contact...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white overflow-x-hidden">
      {/* HERO */}
      <HeroSlideshow slides={slides} />

      {/* INFO KANTOR */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {offices.map((office, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${office.gradient} flex items-center justify-center text-white text-xl`}>
                  <FiMapPin />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{office.title}</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p><strong>Alamat:</strong> {office.address}</p>
                <p><strong>Telepon:</strong> <a href={`tel:${office.phone}`} className="hover:text-blue-600">{office.phone}</a></p>
                <p><strong>Email:</strong> <a href={`mailto:${office.email}`} className="hover:text-blue-600 break-all">{office.email}</a></p>
                <p><strong>Jam Kerja:</strong> {office.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM & MAPS */}
      <section id="contact-form" ref={contactFormRef} className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* FORM */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h2>
            <p className="text-gray-500 mb-6">Isi form di bawah, tim kami akan merespon dalam 24 jam.</p>
            
            {isSuccess && (
              <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 rounded flex items-center gap-2">
                <FiCheckCircle className="text-green-500" /> 
                <span className="text-green-700">Pesan terkirim! Kami akan segera menghubungi Anda.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FloatingInput
                label="Nama Lengkap"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                icon={FiUser}
              />
              <FloatingInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                icon={FiMail}
              />
              <FloatingInput
                label="No. Telepon"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                icon={FiPhoneCall}
              />
              <FloatingInput
                label="Pesan"
                name="message"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                required
                icon={FiEdit3}
                textarea
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⟳</span> Mengirim...
                  </>
                ) : (
                  <><FiSend /> Kirim Pesan</>
                )}
              </button>
            </form>
          </div>

          {/* MAPS */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Lokasi Kami</h2>
            </div>
            {offices[0]?.mapUrl ? (
              <iframe
                src={offices[0].mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Kantor LPPSLH"
              />
            ) : (
              <div className="h-[400px] bg-gray-100 flex items-center justify-center text-gray-400">
                <p>Belum ada peta. Admin belum mengisi URL Maps.</p>
              </div>
            )}
            <div className="p-4 text-center text-sm text-gray-500">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${offices[0]?.lat || '-7.0271488'},${offices[0]?.lng || '110.398508'}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                Buka di Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{cta.title}</h2>
          <p className="mt-4 text-gray-600">{cta.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={cta.button_link_semarang} className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              {cta.button_text_semarang}
            </a>
            <a href={cta.button_link_jakarta} className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              {cta.button_text_jakarta}
            </a>
          </div>
        </div>
      </section>

      {/* BACK TO TOP */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all z-40"
        >
          <FiArrowUp size={24} />
        </button>
      )}

      {/* WHATSAPP */}
      <WhatsAppFloat />
    </div>
  )
}