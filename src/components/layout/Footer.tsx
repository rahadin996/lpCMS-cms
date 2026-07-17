// src/components/layout/Footer.tsx
'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FiLinkedin, FiInstagram, FiFacebook, FiMail, 
  FiMapPin, FiPhone, FiGlobe, FiArrowRight, FiSend
} from 'react-icons/fi'
import { FaXTwitter } from 'react-icons/fa6'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// ========== Type Definitions ==========
interface LinkItem {
  label: string
  url: string
}

interface CompanyInfo {
  company_name: string
  tagline: string
  description: string
  copyright_text: string
}

interface ContactInfo {
  address: string
  phone: string
  email: string
  website: string
}

interface SocialMedia {
  facebook: string
  twitter: string
  linkedin: string
  instagram: string
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [footerData, setFooterData] = useState<{
    company: CompanyInfo
    contact: ContactInfo
    social: SocialMedia
    quickLinks: LinkItem[]
    serviceLinks: LinkItem[]
    legalLinks: LinkItem[]
  }>({
    company: {
      company_name: 'LPPSLH',
      tagline: 'KONSULTAN',
      description: 'Mitra strategis dalam perencanaan wilayah, konsultansi lingkungan, dan manajemen proyek berkelanjutan sejak 1998.',
      copyright_text: 'Seluruh hak cipta dilindungi.'
    },
    contact: {
      address: 'Jl. Sudirman No. 123, Jakarta Selatan 12190, Indonesia',
      phone: '(021) 1234-5678',
      email: 'info@lppslh.com',
      website: 'www.lppslh.com'
    },
    social: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    quickLinks: [
      { label: 'Tentang Kami', url: '/about' },
      { label: 'Layanan', url: '/services' },
      { label: 'Portofolio', url: '/projects' },
      { label: 'Berita & Artikel', url: '/news' },
      { label: 'Karir', url: '/careers' }
    ],
    serviceLinks: [
      { label: 'Perencanaan Strategis', url: '/services/perencanaan-strategis' },
      { label: 'Konsultasi Lingkungan', url: '/services/konsultansi-lingkungan' },
      { label: 'Manajemen Proyek', url: '/services/manajemen-proyek' },
      { label: 'Sistem Informasi Geografis', url: '/services/sistem-informasi-geografis' },
      { label: 'Kajian Kelayakan', url: '/services/kajian-kelayakan' }
    ],
    legalLinks: [
      { label: 'Kebijakan Privasi', url: '/privacy-policy' },
      { label: 'Syarat & Ketentuan', url: '/terms-of-service' },
      { label: 'Kebijakan Cookie', url: '/cookie-policy' },
      { label: 'Peta Situs', url: '/sitemap' }
    ]
  })

  const supabase = createClient()

  useEffect(() => {
    const fetchFooter = async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'footer')
        .eq('key', 'data')

      if (error || !data) return

      data.forEach((item: any) => {
        try {
          const parsed = JSON.parse(item.value)
          switch (item.section) {
            case 'company_info':
              setFooterData(prev => ({ ...prev, company: { ...prev.company, ...parsed } }))
              break
            case 'contact_info':
              setFooterData(prev => ({ ...prev, contact: { ...prev.contact, ...parsed } }))
              break
            case 'social_media':
              setFooterData(prev => ({ ...prev, social: { ...prev.social, ...parsed } }))
              break
            case 'quick_links':
              setFooterData(prev => ({ ...prev, quickLinks: parsed }))
              break
            case 'service_links':
              setFooterData(prev => ({ ...prev, serviceLinks: parsed }))
              break
            case 'legal_links':
              setFooterData(prev => ({ ...prev, legalLinks: parsed }))
              break
          }
        } catch (e) { console.error('Parse error:', e) }
      })
    }

    fetchFooter()
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Terima kasih telah berlangganan!')
    setEmail('')
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.6 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const { company, contact, social, quickLinks, serviceLinks, legalLinks } = footerData

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className="relative w-full overflow-hidden"
    >
      {/* Background dengan efek glass & gradien */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />
      <div className="absolute inset-0 backdrop-blur-xl bg-white/40" />
      
      {/* Decorative blobs / partikel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="relative h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-full" />

      <div className="relative max-w-14xl mx-auto px-16 md:px-20 py-16 lg:py-18">
        {/* Main Footer Content - 4 Kolom Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-5">
              <span className="font-bold text-3xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {company.company_name}
              </span>
              <span className="text-xs font-medium text-gray-500 bg-white/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200">
                {company.tagline}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {company.description}
            </p>
            <div className="flex gap-3">
              {social.twitter && <SocialIcon href={social.twitter} icon={<FaXTwitter size={18} />} label="X" />}
              {social.linkedin && <SocialIcon href={social.linkedin} icon={<FiLinkedin size={18} />} label="LinkedIn" />}
              {social.instagram && <SocialIcon href={social.instagram} icon={<FiInstagram size={18} />} label="Instagram" />}
              {social.facebook && <SocialIcon href={social.facebook} icon={<FiFacebook size={18} />} label="Facebook" />}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-gray-800 font-semibold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500">
              Tautan Cepat
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <FooterLink key={idx} href={link.url}>{link.label}</FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* Layanan Unggulan */}
          <motion.div variants={itemVariants}>
            <h4 className="text-gray-800 font-semibold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500">
              Layanan Unggulan
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link, idx) => (
                <FooterLink key={idx} href={link.url}>{link.label}</FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-gray-800 font-semibold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500">
              Kantor Pusat
            </h4>
            <address className="not-italic space-y-3 text-gray-600 text-sm">
              <p className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 text-blue-500 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: contact.address }} />
              </p>
              <p className="flex items-center gap-3">
                <FiPhone className="text-blue-500" />
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-blue-600 transition">{contact.phone}</a>
              </p>
              <p className="flex items-center gap-3">
                <FiMail className="text-blue-500" />
                <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition">{contact.email}</a>
              </p>
              <p className="flex items-center gap-3">
                <FiGlobe className="text-blue-500" />
                <a href={`https://${contact.website}`} className="hover:text-blue-600 transition">{contact.website}</a>
              </p>
            </address>
          </motion.div>
        </div>

        {/* Bottom Section dengan Legal Links */}
        <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} {company.company_name}. {company.copyright_text}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link, idx) => (
              <LegalLink key={idx} href={link.url}>{link.label}</LegalLink>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

// Komponen untuk ikon sosial media dengan efek hover lingkaran
function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-500 hover:text-white transition-all duration-300 hover:border-transparent"
      style={{
        backgroundImage: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        backgroundSize: '0% 100%',
        backgroundRepeat: 'no-repeat',
        transition: 'background-size 0.3s ease-in-out'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundSize = '100% 100%' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundSize = '0% 100%' }}
      aria-label={label}
    >
      <span className="relative z-10 group-hover:text-white transition-colors">{icon}</span>
    </motion.a>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">
        <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300"></span>
        {children}
      </Link>
    </li>
  )
}

function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-400 hover:text-blue-600 transition-colors duration-200 text-sm">
      {children}
    </Link>
  )
}