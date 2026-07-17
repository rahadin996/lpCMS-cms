// src/app/admin/layout.tsx
'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  FiHome, FiBriefcase, FiFileText, FiSettings, FiLogOut, FiMenu, FiBook, 
  FiImage, FiHelpCircle, FiMail, FiGlobe, FiMapPin, FiStar,
  FiChevronDown, FiChevronRight
} from 'react-icons/fi'
import { IconType } from 'react-icons'

// ========== Types ==========
interface SubmenuItem {
  name: string
  path: string
  icon: IconType
}

interface MenuGroup {
  name: string
  icon: IconType
  items: (SubmenuItem | { name: string; icon: IconType; submenus: SubmenuItem[] })[]
}

interface AdminLayoutProps {
  children: ReactNode
}

// ========== MENU UTAMA ==========
const websiteMenu: MenuGroup = {
  name: 'Website',
  icon: FiGlobe,
  items: [
    { name: 'Homepage', path: '/admin/pages/homepage', icon: FiHome },
    { name: 'Services', path: '/admin/pages/services', icon: FiBriefcase },
    { name: 'Sectors', path: '/admin/pages/sectors', icon: FiBriefcase },
    { name: 'About', path: '/admin/pages/about', icon: FiFileText },
    { name: 'Offices', path: '/admin/pages/offices', icon: FiMapPin },
    { name: 'News', path: '/admin/news', icon: FiBook },
    { name: 'Gallery', path: '/admin/gallery', icon: FiImage },
    { name: 'Innovation', path: '/admin/innovation', icon: FiImage },
    { name: 'FAQ', path: '/admin/faq', icon: FiHelpCircle },
    { name: 'Contact', path: '/admin/contact', icon: FiMail },
    {
      name: 'Projects',
      icon: FiBriefcase,
      submenus: [
        { name: 'Edit Projects', path: '/admin/pages/projects', icon: FiFileText },
        { name: 'Kelola Data Proyek', path: '/admin/pages/projects-detail', icon: FiStar },
      ]
    },
    {
      name: 'Pengaturan',
      icon: FiSettings,
      submenus: [
        { name: 'Header', path: '/admin/header', icon: FiMenu },
        { name: 'Footer', path: '/admin/footer', icon: FiMenu },
      ]
    }
  ]
}

// ========== KOMPONEN UTAMA ==========
export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [pageTitle, setPageTitle] = useState('Dashboard')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Website: true
  })
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    Projects: false,
    Pengaturan: false
  })

  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({ ...prev, [name]: !prev[name] }))
  }

  // Set page title berdasarkan path
  useEffect(() => {
    const allPaths: { name: string; path: string }[] = []
    const collect = (items: any[]) => {
      items.forEach(item => {
        if ('path' in item && item.path) allPaths.push({ name: item.name, path: item.path })
        if ('submenus' in item && item.submenus) {
          item.submenus.forEach((sub: any) => allPaths.push({ name: sub.name, path: sub.path }))
        }
      })
    }
    collect(websiteMenu.items)
    const found = allPaths.find(item => item.path === pathname)
    setPageTitle(found ? found.name : 'Dashboard')
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (pathname === '/admin/login') return <>{children}</>

  // Render submenu items
  const renderSubmenuItems = (submenus: SubmenuItem[]) => {
    return submenus.map(sub => (
      <Link
        key={sub.path}
        href={sub.path}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
          pathname === sub.path ? 'bg-white/70 text-gray-900' : 'text-gray-600 hover:bg-white/40 hover:text-gray-800'
        }`}
      >
        <sub.icon size={12} className="text-gray-400" />
        <span>{sub.name}</span>
      </Link>
    ))
  }

  // Render menu item
  const renderMenuItem = (item: any) => {
    if (item.submenus) {
      const isOpen = openSubmenus[item.name] || false
      const isActive = item.submenus.some((sub: any) => sub.path === pathname)

      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition-all duration-300 group ${
              isActive ? 'bg-white/60 text-gray-900' : 'text-gray-700 hover:bg-white/40'
            }`}
          >
            <div className="flex items-center">
              <item.icon size={18} className={`${isActive ? 'text-emerald-600' : 'text-emerald-500 group-hover:text-emerald-600'} transition-colors`} />
              {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
            </div>
            {sidebarOpen && (
              <span className="text-gray-500">{isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}</span>
            )}
          </button>
          {sidebarOpen && isOpen && (
            <div className="ml-6 mt-1 space-y-1 border-l border-white/40 pl-2">
              {renderSubmenuItems(item.submenus)}
            </div>
          )}
        </div>
      )
    }

    // Item biasa
    const isActive = item.path === pathname
    return (
      <Link
        key={item.path}
        href={item.path}
        className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 group ${
          isActive ? 'bg-white/60 text-gray-900' : 'text-gray-700 hover:bg-white/40'
        }`}
      >
        <item.icon size={18} className={`${isActive ? 'text-emerald-600' : 'text-emerald-500 group-hover:text-emerald-600'} transition-colors`} />
        {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
      </Link>
    )
  }

  // Render group menu
  const renderGroup = (group: MenuGroup) => {
    const isOpen = openGroups[group.name] || false
    const isAnyActive = group.items.some(item => {
      if ('submenus' in item) return item.submenus.some((sub: any) => sub.path === pathname)
      return 'path' in item && item.path === pathname
    })

    return (
      <div key={group.name} className="mb-4">
        <button
          onClick={() => toggleGroup(group.name)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
            isAnyActive ? 'bg-white/70 shadow-lg text-gray-900' : 'text-gray-700 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center">
            <group.icon size={20} className="text-emerald-600 transition-colors" />
            {sidebarOpen && <span className="ml-4 text-sm font-medium">{group.name}</span>}
          </div>
          {sidebarOpen && (
            <span className="text-gray-500">{isOpen ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}</span>
          )}
        </button>
        {sidebarOpen && isOpen && (
          <div className="ml-6 mt-2 space-y-1 border-l border-white/40 pl-2">
            {group.items.map(item => renderMenuItem(item))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? 'w-80' : 'w-24'} bg-white/30 backdrop-blur-2xl border-r border-white/50 transition-all duration-500 ease-out flex flex-col shadow-2xl relative z-20`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-r-3xl"></div>

        <div className={`p-6 flex ${sidebarOpen ? 'justify-between' : 'justify-center'} items-center border-b border-white/40 relative`}>
          {sidebarOpen && (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Admin Panel</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300 backdrop-blur-sm shadow-sm"
          >
            <FiMenu size={20} className="text-gray-700" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 custom-scrollbar">
          <Link
            href="/admin"
            className={`flex items-center px-4 py-3 mb-6 rounded-2xl transition-all duration-300 group ${
              pathname === '/admin' ? 'bg-white/70 shadow-lg shadow-black/5 backdrop-blur-sm text-gray-900' : 'text-gray-700 hover:bg-white/50 hover:text-gray-900'
            }`}
          >
            <FiHome size={20} className={`${pathname === '/admin' ? 'text-indigo-600' : 'text-indigo-500 group-hover:text-indigo-600'} transition-colors`} />
            {sidebarOpen && <span className="ml-4 text-sm font-medium">Dashboard</span>}
          </Link>

          {renderGroup(websiteMenu)}
        </nav>

        <div className="p-4 border-t border-white/40">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-500/20 hover:text-red-600 rounded-2xl transition-all duration-300 group"
          >
            <FiLogOut size={20} className="group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="ml-4 text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="sticky top-0 z-10 bg-white/40 backdrop-blur-xl border-b border-white/50 shadow-lg">
          <div className="px-8 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight drop-shadow-sm">{pageTitle}</h2>
              <p className="text-sm text-gray-600 mt-0.5">Kelola konten dan pengaturan website</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 group"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm flex items-center justify-center shadow-md border border-white/60 group-hover:scale-105 transition-transform">
                  <span className="text-sm font-medium text-gray-700">AD</span>
                </div>
                <FiChevronDown size={16} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 py-2 z-20 animate-fadeIn">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-500/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-2xl">
            {children}
          </div>
        </main>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.4); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  )
}