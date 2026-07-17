// src/components/layout/Header.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  FiSearch, FiUser, FiChevronDown, FiX, FiMenu, 
  FiTwitter, FiLinkedin, FiInstagram, FiFacebook, FiEdit
} from 'react-icons/fi'
import { createClient } from '@/lib/supabase/client'

// ========== Type Definitions ==========
type SearchItem = {
  title: string
  url: string
  desc: string
}

type DropdownItem = {
  name: string
  href: string
  icon?: React.ReactNode
}

type MenuItem = {
  name: string
  href: string
  dropdown: DropdownItem[] | null
}

// ========== Default Menu (fallback) ==========
const DEFAULT_MENU: MenuItem[] = [
  { name: 'LANDING', href: '/landing', dropdown: null },
  { name: 'SERVICES', href: '/services', dropdown: [] },
  { name: 'SECTORS', href: '/sectors', dropdown: [] },
  { name: 'PROJECTS', href: '/projects', dropdown: [] },
  { name: 'INNOVATION', href: '/innovation', dropdown: null },
  { name: 'GALLERY', href: '/gallery', dropdown: null },
  { name: 'ABOUT US', href: '/about', dropdown: [] },
  { name: 'OFFICES', href: '/offices', dropdown: null },
  { name: 'NEWS', href: '/news', dropdown: null },
  { name: 'FAQ', href: '/faq', dropdown: null },
  { name: 'CONTACT', href: '/contact', dropdown: null },
]

// ========== Component ==========
export default function Header() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU)
  const [menuLoading, setMenuLoading] = useState(true)
  const [projectDropdownItems, setProjectDropdownItems] = useState<DropdownItem[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  // ===== STATE LOGO =====
  const [logoUrl, setLogoUrl] = useState<string>('/images/lppslh.png')
  const [logoAlt, setLogoAlt] = useState<string>('LPPSLH Logo')
  const [logoWidth, setLogoWidth] = useState<number>(40)
  const [companyName, setCompanyName] = useState<string>('LPPSLH')
  const [tagline, setTagline] = useState<string>('KONSULTAN') // <-- TAMBAHAN
  const [logoLoading, setLogoLoading] = useState(true)

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { scrollYProgress } = useScroll()
  const headerBg = useTransform(scrollYProgress, [0, 0.1], ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.9)'])
  const headerBlur = useTransform(scrollYProgress, [0, 0.1], ['blur(0px)', 'blur(12px)'])

  const supabase = createClient()

  // ===== FETCH LOGO DARI DATABASE =====
  useEffect(() => {
    const fetchLogo = async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('value')
        .eq('page', 'header')
        .eq('section', 'logo')
        .eq('key', 'data')
        .maybeSingle()

      if (!error && data) {
        try {
          const parsed = JSON.parse(data.value)
          if (parsed.url) {
            setLogoUrl(parsed.url)
            setLogoAlt(parsed.alt || 'LPPSLH Logo')
            setLogoWidth(parsed.width || 40)
            setCompanyName(parsed.companyName || 'LPPSLH')
            setTagline(parsed.tagline || 'KONSULTAN') // <-- TAMBAHAN
          }
        } catch (e) {
          console.error('Gagal parse logo:', e)
        }
      }
      setLogoLoading(false)
    }
    fetchLogo()
  }, [])

  // ===== FETCH MENU DARI DATABASE =====
  useEffect(() => {
    const fetchMenu = async () => {
      setMenuLoading(true)
      const { data, error } = await supabase
        .from('page_contents')
        .select('value')
        .eq('page', 'header')
        .eq('section', 'menu')
        .eq('key', 'data')
        .maybeSingle()

      if (!error && data) {
        try {
          const parsed = JSON.parse(data.value)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const converted = parsed.map((item: any) => ({
              name: item.label,
              href: item.href,
              dropdown: item.dropdown && item.dropdown.length > 0
                ? item.dropdown.map((sub: any) => ({
                    name: sub.label,
                    href: sub.href,
                    icon: sub.icon ? <FiEdit className="inline mr-2" size={14} /> : undefined
                  }))
                : null
            }))
            setMenuItems(converted)
          } else {
            setMenuItems(DEFAULT_MENU)
          }
        } catch (e) {
          console.error('Gagal parse menu:', e)
          setMenuItems(DEFAULT_MENU)
        }
      } else {
        setMenuItems(DEFAULT_MENU)
      }
      setMenuLoading(false)
    }
    fetchMenu()
  }, [])

  // ===== FETCH PROJECTS UNTUK DROPDOWN DINAMIS =====
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('project_porto')
        .select('title, slug')
        .order('id', { ascending: true })
      if (!error && data) {
        const items = data.map((p: any) => ({
          name: p.title,
          href: `/projects/${p.slug}`
        }))
        setProjectDropdownItems(items)
      } else {
        console.error('Gagal fetch proyek:', error)
      }
      setProjectsLoading(false)
    }
    fetchProjects()
  }, [])

  // ===== GANTI DROPDOWN PROJECTS DENGAN DATA DINAMIS =====
  useEffect(() => {
    if (!menuLoading && !projectsLoading) {
      setMenuItems(prev => {
        const projectsIndex = prev.findIndex(item => item.name === 'PROJECTS')
        if (projectsIndex === -1) return prev
        const newItems = [...prev]
        const projectsItem = newItems[projectsIndex]
        const dropdown = projectsLoading
          ? [{ name: 'Memuat proyek...', href: '#' }]
          : projectDropdownItems.length > 0
          ? projectDropdownItems
          : [{ name: 'Belum ada proyek', href: '#' }]
        newItems[projectsIndex] = { ...projectsItem, dropdown }
        return newItems
      })
    }
  }, [menuLoading, projectsLoading, projectDropdownItems])

  // ===== SCROLL & SEARCH =====
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [isSearchOpen])

  // ===== SEARCH DATA =====
  const staticSearchData: SearchItem[] = [
    { title: "Pemerintahan & Kebijakan Publik", url: "/sectors/pemerintahan", desc: "Perencanaan pembangunan, kebijakan publik" },
    { title: "Infrastruktur & Pekerjaan Umum", url: "/sectors/infrastruktur", desc: "Perencanaan jalan, jembatan" },
    { title: "Perencanaan Perkotaan", url: "/services/perencanaan-perkotaan", desc: "Tata ruang dan pengembangan kota" },
    { title: "Pengembangan Pertanian dan Pedesaan", url: "/services/pengembangan-pedesaan", desc: "Pengembangan pertanian & desa" },
    { title: "Konsultansi Lingkungan", url: "/services/konsultansi-lingkungan", desc: "AMDAL, UKL-UPL" },
    { title: "Studi dan Perencanaan Rekayasa", url: "/services/studi-perencanaan", desc: "Perencanaan teknik" },
    { title: "Konsultansi Manajemen", url: "/services/konsultansi-manajemen", desc: "Manajemen proyek" },
    { title: "Sistem Informasi", url: "/services/sistem-informasi", desc: "Pengembangan sistem" },
    { title: "Surveyor Independen", url: "/services/surveyor-independen", desc: "Survei lapangan" },
    { title: "Event Organizer", url: "/services/event-organizer", desc: "Penyelenggaraan event" },
    { title: "Administration Service Firm", url: "/services/administration-service", desc: "Layanan administrasi" },
    { title: "Tentang Kami", url: "/about", desc: "Profil perusahaan" },
  ]

  const [projectSearchData, setProjectSearchData] = useState<SearchItem[]>([])
  useEffect(() => {
    if (projectDropdownItems.length > 0) {
      const items = projectDropdownItems.map(item => ({
        title: item.name,
        url: item.href,
        desc: `Proyek: ${item.name}`
      }))
      setProjectSearchData(items)
    }
  }, [projectDropdownItems])

  const searchData: SearchItem[] = [...staticSearchData, ...projectSearchData]

  const handleSearch = (query: string) => {
    if (!query.trim()) return setSearchResults([])
    const results = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(results)
  }

  // ===== VARIANTS ANIMASI =====
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.03, delayChildren: 0.05 }
    }
  }
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  // ===== RENDER =====
  if (menuLoading || logoLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm h-20 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Memuat...</div>
      </header>
    )
  }

  return (
    <>
      <motion.header 
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-xl' : 'shadow-sm'}`}
      >
        <div className="w-full px-2 md:px-6 lg:px-16">
          <div className="flex items-center justify-between py-3">
            {/* Logo - dengan companyName dan tagline */}
            <Link href="/" className="flex items-center space-x-2 group shrink-0 relative pl-4 md:pl-0">
              <motion.div
                whileHover={{ rotateY: 10, rotateX: 5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative"
              >
                <img 
                  src={logoUrl} 
                  alt={logoAlt} 
                  className="h-16 w-auto object-contain"
                  style={{ maxWidth: logoWidth }}
                />
              </motion.div>
              <div className="leading-tight hidden sm:block">
                <motion.span 
                  className="block font-bold text-4xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.02 }}
                >
                  {companyName}
                </motion.span>
                <span className="block text-1xl text-gray-400">{tagline}</span>
              </div>
            </Link>

            {/* Right section */}
            <div className="flex items-left gap-0 pr-2 md:pr-0">
              <nav className="hidden lg:flex items-center space-x-0">
                {menuItems.map((item) => (
                  <div key={item.name} className="relative group"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.dropdown ? (
                      <>
                        <Link
                          href={item.href}
                          className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        >
                          {item.name}
                          <motion.div
                            animate={{ rotate: openDropdown === item.name ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiChevronDown size={14} />
                          </motion.div>
                        </Link>
                        <AnimatePresence>
                          {openDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                            >
                              <motion.div
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                className="py-2"
                              >
                                {item.dropdown.map((sub) => (
                                  <motion.div key={sub.name} variants={itemVariants}>
                                    <Link
                                      href={sub.href}
                                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition"
                                    >
                                      {sub.icon && <FiEdit className="inline mr-2" size={14} />}
                                      {sub.name}
                                    </Link>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                >
                  <FiSearch size={20} />
                </motion.button>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/admin/login"
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                  >
                    <FiUser size={20} />
                  </Link>
                </motion.div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
                >
                  <FiMenu size={24} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        <motion.div 
          className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white/95 backdrop-blur-md shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition">
                  <FiX size={24} />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div className="space-y-1">
                        <Link
                          href={item.href}
                          className="block py-2 text-gray-800 font-medium hover:text-blue-600 transition"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <div className="pl-4 space-y-1 border-l-2 border-gray-100">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="block py-1 text-sm text-gray-500 hover:text-blue-600 transition"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {sub.icon && <FiEdit className="inline mr-2" size={12} />}
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-2 text-gray-800 font-medium hover:text-blue-600 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 mt-4 border-t">
                  <Link
                    href="/admin/login"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-full shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser size={16} /> Admin Login
                  </Link>
                </div>
                <div className="flex justify-center gap-4 pt-6 text-gray-400">
                  <a href="#"><FiTwitter /></a>
                  <a href="#"><FiLinkedin /></a>
                  <a href="#"><FiInstagram /></a>
                  <a href="#"><FiFacebook /></a>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Cari Informasi</h3>
                <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-full hover:bg-gray-100 transition">
                  <FiX size={24} />
                </button>
              </div>
              <div className="p-4">
                <div className="flex gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Cari proyek, layanan, sektor..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); handleSearch(e.target.value) }}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSearch(searchQuery)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition"
                  >
                    Cari
                  </motion.button>
                </div>
                <div className="mt-4 max-h-96 overflow-y-auto">
                  {searchQuery.trim() === '' ? (
                    <p className="text-gray-400 text-center py-4">Ketik kata kunci...</p>
                  ) : searchResults.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Tidak ada hasil</p>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.05 }}
                    >
                      {searchResults.map((res, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          onClick={() => { router.push(res.url); setIsSearchOpen(false); }}
                          className="p-3 border-l-4 border-blue-500 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 mb-2 transition shadow-sm"
                        >
                          <h4 className="font-semibold text-gray-800">{res.title}</h4>
                          <p className="text-sm text-gray-500">{res.desc}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}