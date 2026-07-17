// src/app/admin/header/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminSectionNav from '@/components/admin/AdminSectionNav'
import ImageUpload from '@/components/admin/ImageUpload'
import { 
  FiPlus, FiEdit, FiTrash2, FiX, FiArrowUp, FiArrowDown, FiRefreshCw,
  FiSave, FiLoader, FiImage, FiMenu, FiSettings, FiEye, FiChevronRight
} from 'react-icons/fi'

// ========== TYPE DEFINITIONS ==========
interface LogoData {
  url: string
  alt: string
  width?: number
  height?: number
  companyName?: string  // Nama perusahaan
  tagline?: string      // Tagline di bawah nama perusahaan
}

interface SubMenuItem {
  label: string
  href: string
  icon?: string
}

interface MenuItem {
  id: string
  label: string
  href: string
  order: number
  icon?: string
  dropdown?: SubMenuItem[]
}

interface HeaderSettings {
  backgroundColor: string
  textColor: string
  hoverColor: string
  sticky: boolean
  showSearch: boolean
  showLogin: boolean
}

interface Message {
  text: string
  type: 'success' | 'error' | ''
}

// ========== CONSTANTS ==========
const availableIcons = [
  'FiHome', 'FiBriefcase', 'FiFileText', 'FiUsers', 'FiStar', 'FiGlobe',
  'FiCompass', 'FiMapPin', 'FiTrendingUp', 'FiAward', 'FiBook', 'FiMail',
  'FiCalendar', 'FiClock', 'FiMessageSquare', 'FiHelpCircle', 'FiSettings',
  'FiMenu', 'FiImage', 'FiVideo', 'FiMusic', 'FiCamera', 'FiHeart', 'FiFlag'
]

const DEFAULT_MENU: MenuItem[] = [
  {
    id: '1',
    label: 'SERVICES',
    href: '/services',
    order: 1,
    icon: 'FiBriefcase',
    dropdown: [
      { label: 'Perencanaan', href: '/services/perencanaan-perkotaan', icon: 'FiMapPin' },
      { label: 'Pengembangan Pertanian dan Pedesaan', href: '/services/pengembangan-pedesaan', icon: 'FiTrendingUp' },
      { label: 'Konsultansi Lingkungan', href: '/services/konsultansi-lingkungan', icon: 'FiDroplet' },
      { label: 'Studi dan Perencanaan Rekayasa', href: '/services/studi-perencanaan', icon: 'FiBarChart2' },
      { label: 'Konsultansi Manajemen', href: '/services/konsultansi-manajemen', icon: 'FiUsers' },
      { label: 'Sistem Informasi', href: '/services/sistem-informasi', icon: 'FiCpu' },
      { label: 'Surveyor Independen', href: '/services/surveyor-independen', icon: 'FiServer' },
      { label: 'Event Organizer', href: '/services/event-organizer', icon: 'FiCalendar' },
      { label: 'Administration Service', href: '/services/administration-service', icon: 'FiFileText' },
    ]
  },
  {
    id: '2',
    label: 'SECTORS',
    href: '/sectors',
    order: 2,
    icon: 'FiGlobe',
    dropdown: [
      { label: 'Pemerintahan & Kebijakan Publik', href: '/sectors/pemerintahan', icon: 'FiHome' },
      { label: 'Infrastruktur & Pekerjaan Umum', href: '/sectors/infrastruktur', icon: 'FiTool' },
      { label: 'Perumahan & Kawasan Permukiman', href: '/sectors/perumahan', icon: 'FiHome' },
      { label: 'Sumber Daya Air & Lingkungan', href: '/sectors/sumber-daya-air', icon: 'FiDroplet' },
      { label: 'Pertanian & Ketahanan Pangan', href: '/sectors/pertanian', icon: 'FiTrendingUp' },
      { label: 'Pembangunan Pedesaan', href: '/sectors/pembangunan-pedesaan', icon: 'FiMapPin' },
      { label: 'Pendidikan & Peningkatan Kapasitas', href: '/sectors/pendidikan', icon: 'FiBook' },
      { label: 'Kesehatan & Sanitasi', href: '/sectors/kesehatan', icon: 'FiHeart' },
    ]
  },
  {
    id: '3',
    label: 'PROJECTS',
    href: '/projects',
    order: 3,
    icon: 'FiBriefcase',
    dropdown: []
  },
  {
    id: '4',
    label: 'INNOVATION',
    href: '/innovation',
    order: 4,
    icon: 'FiStar',
    dropdown: []
  },
  {
    id: '5',
    label: 'GALLERY',
    href: '/gallery',
    order: 5,
    icon: 'FiImage',
    dropdown: []
  },
  {
    id: '6',
    label: 'ABOUT US',
    href: '/about',
    order: 6,
    icon: 'FiUsers',
    dropdown: [
      { label: 'Tentang Kami', href: '/about', icon: 'FiInfo' },
      { label: 'Tim Kami', href: '/about/team', icon: 'FiUsers' },
      { label: 'Penghargaan & Sertifikasi', href: '/about/awards', icon: 'FiAward' },
    ]
  },
  {
    id: '7',
    label: 'OFFICES',
    href: '/offices',
    order: 7,
    icon: 'FiMapPin',
    dropdown: []
  },
  {
    id: '8',
    label: 'NEWS',
    href: '/news',
    order: 8,
    icon: 'FiMail',
    dropdown: []
  },
  {
    id: '9',
    label: 'FAQ',
    href: '/faq',
    order: 9,
    icon: 'FiHelpCircle',
    dropdown: []
  },
  {
    id: '10',
    label: 'CONTACT',
    href: '/contact',
    order: 10,
    icon: 'FiMail',
    dropdown: []
  }
]

const NAV_ITEMS = [
  { key: 'logo', label: '🏢 Logo & Nama' },
  { key: 'menu', label: '📋 Menu' },
  { key: 'submenu', label: '📎 Submenu' },
  { key: 'settings', label: '🎨 Pengaturan' },
  { key: 'preview', label: '👁️ Preview' },
]

// ========== MAIN COMPONENT ==========
export default function EditHeaderPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState('logo')

  const [logo, setLogo] = useState<LogoData>({
    url: '/images/lppslh.png',
    alt: 'LPPSLH Logo',
    width: 40,
    height: 40,
    companyName: 'LPPSLH',
    tagline: 'KONSULTAN'
  })
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [settings, setSettings] = useState<HeaderSettings>({
    backgroundColor: 'rgba(255,255,255,0.05)',
    textColor: '#1f2937',
    hoverColor: '#3b82f6',
    sticky: true,
    showSearch: true,
    showLogin: true
  })

  // Modal states
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  const [menuForm, setMenuForm] = useState<MenuItem>({
    id: '', label: '', href: '', order: 0, icon: '', dropdown: []
  })

  const [showSubmenuModal, setShowSubmenuModal] = useState(false)
  const [editingSubmenuParent, setEditingSubmenuParent] = useState<string | null>(null)
  const [editingSubmenuIndex, setEditingSubmenuIndex] = useState<number | null>(null)
  const [submenuForm, setSubmenuForm] = useState<SubMenuItem>({ label: '', href: '', icon: '' })

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'header')
        .eq('key', 'data')

      if (error) {
        console.error('Fetch error:', error)
        setMessage({ text: 'Gagal memuat data: ' + error.message, type: 'error' })
        return
      }

      console.log('📦 Data dari Supabase:', data)

      if (data && data.length > 0) {
        data.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            console.log(`🔍 Parsed ${item.section}:`, parsed)
            if (item.section === 'logo') setLogo(parsed)
            if (item.section === 'menu') setMenuItems(parsed)
            if (item.section === 'settings') setSettings(parsed)
          } catch (e) {
            console.error('❌ Parse error:', e)
          }
        })
      } else {
        console.log('⚠️ Tidak ada data, gunakan default')
        setMenuItems(JSON.parse(JSON.stringify(DEFAULT_MENU)))
      }
    } catch (err: any) {
      console.error('Fetch error:', err)
      setMessage({ text: 'Gagal memuat data: ' + err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ========== SAVE FUNCTIONS ==========
  const saveSection = async (section: string, data: any) => {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('page_contents')
        .select('id')
        .eq('page', 'header')
        .eq('section', section)
        .eq('key', 'data')
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      const payload = {
        page: 'header',
        section: section,
        key: 'data',
        value: JSON.stringify(data),
        type: 'json'
      }

      let result
      if (existing) {
        result = await supabase
          .from('page_contents')
          .update(payload)
          .eq('id', existing.id)
      } else {
        result = await supabase
          .from('page_contents')
          .insert(payload)
      }

      if (result.error) throw result.error
      console.log(`✅ ${section} berhasil disimpan`)
    } catch (err: any) {
      console.error(`❌ Error saving ${section}:`, err)
      throw err
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setMessage({ text: '', type: '' })
    try {
      await saveSection('logo', logo)
      await saveSection('menu', menuItems)
      await saveSection('settings', settings)
      setMessage({ text: '✅ Semua pengaturan header berhasil disimpan!', type: 'success' })
      await fetchData()
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      console.error('Save error:', err)
      setMessage({ text: '❌ Gagal menyimpan: ' + err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const resetToDefaultMenu = () => {
    if (confirm('Reset semua menu ke default? Perubahan yang belum disimpan akan hilang.')) {
      setMenuItems(JSON.parse(JSON.stringify(DEFAULT_MENU)))
    }
  }

  // ========== MENU CRUD ==========
  const moveMenuItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...menuItems]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= newItems.length) return
    ;[newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]]
    newItems.forEach((item, idx) => item.order = idx + 1)
    setMenuItems(newItems)
  }

  const openAddMenuModal = () => {
    setEditingMenu(null)
    setMenuForm({
      id: '', label: '', href: '/', order: menuItems.length + 1, icon: '', dropdown: []
    })
    setShowMenuModal(true)
  }

  const openEditMenuModal = (item: MenuItem) => {
    setEditingMenu(item)
    setMenuForm({ ...item })
    setShowMenuModal(true)
  }

  const saveMenu = () => {
    const newMenu: MenuItem = {
      ...menuForm,
      order: menuForm.order || menuItems.length + 1
    }

    if (editingMenu) {
      setMenuItems(prev => prev.map(item => item.id === editingMenu.id ? newMenu : item))
    } else {
      setMenuItems(prev => [...prev, { ...newMenu, id: Date.now().toString() }])
    }
    setShowMenuModal(false)
  }

  const deleteMenuItem = (id: string) => {
    if (!confirm('Yakin hapus menu ini?')) return
    setMenuItems(prev => prev.filter(item => item.id !== id))
  }

  // ========== SUBMENU CRUD ==========
  const openAddSubmenuModal = (parentId: string) => {
    setEditingSubmenuParent(parentId)
    setEditingSubmenuIndex(null)
    setSubmenuForm({ label: '', href: '', icon: '' })
    setShowSubmenuModal(true)
  }

  const openEditSubmenuModal = (parentId: string, index: number) => {
    const parent = menuItems.find(m => m.id === parentId)
    if (!parent) return
    setEditingSubmenuParent(parentId)
    setEditingSubmenuIndex(index)
    setSubmenuForm(parent.dropdown?.[index] || { label: '', href: '', icon: '' })
    setShowSubmenuModal(true)
  }

  const saveSubmenu = () => {
    if (!editingSubmenuParent) return
    const parentIndex = menuItems.findIndex(m => m.id === editingSubmenuParent)
    if (parentIndex === -1) return

    const newItems = [...menuItems]
    const parent = newItems[parentIndex]
    const dropdown = parent.dropdown || []

    if (editingSubmenuIndex !== null) {
      dropdown[editingSubmenuIndex] = submenuForm
    } else {
      dropdown.push(submenuForm)
    }

    newItems[parentIndex] = { ...parent, dropdown }
    setMenuItems(newItems)
    setShowSubmenuModal(false)
  }

  const deleteSubmenu = (parentId: string, index: number) => {
    if (!confirm('Hapus submenu ini?')) return
    const parentIndex = menuItems.findIndex(m => m.id === parentId)
    if (parentIndex === -1) return
    const newItems = [...menuItems]
    const parent = newItems[parentIndex]
    const dropdown = (parent.dropdown || []).filter((_, i) => i !== index)
    newItems[parentIndex] = { ...parent, dropdown: dropdown.length ? dropdown : undefined }
    setMenuItems(newItems)
  }

  const moveSubmenu = (parentId: string, index: number, direction: 'up' | 'down') => {
    const parentIndex = menuItems.findIndex(m => m.id === parentId)
    if (parentIndex === -1) return
    const newItems = [...menuItems]
    const parent = newItems[parentIndex]
    const dropdown = parent.dropdown || []
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= dropdown.length) return
    ;[dropdown[index], dropdown[newIndex]] = [dropdown[newIndex], dropdown[index]]
    newItems[parentIndex] = { ...parent, dropdown }
    setMenuItems(newItems)
  }

  // ========== RENDER SECTIONS ==========
  const renderSection = () => {
    switch (activeSection) {
      case 'logo': return renderLogo()
      case 'menu': return renderMenu()
      case 'submenu': return renderSubmenu()
      case 'settings': return renderSettings()
      case 'preview': return renderPreview()
      default: return <p>Pilih section di sidebar</p>
    }
  }

  const renderLogo = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🏢 Logo & Nama Perusahaan</h2>
      <div className="space-y-4">
        <ImageUpload
          bucket="service-images"
          path="logo"
          value={logo.url}
          onChange={(url) => setLogo({ ...logo, url })}
          label="Upload Logo"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
            <input
              type="text"
              value={logo.alt}
              onChange={e => setLogo({ ...logo, alt: e.target.value })}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lebar (px)</label>
            <input
              type="number"
              value={logo.width}
              onChange={e => setLogo({ ...logo, width: parseInt(e.target.value) || 40 })}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={logo.companyName || ''}
            onChange={e => setLogo({ ...logo, companyName: e.target.value })}
            className="w-full border rounded-lg p-2"
            placeholder="LPPSLH"
          />
          <p className="text-xs text-gray-400 mt-1">Nama ini akan tampil di header website di samping logo</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tagline <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={logo.tagline || ''}
            onChange={e => setLogo({ ...logo, tagline: e.target.value })}
            className="w-full border rounded-lg p-2"
            placeholder="KONSULTAN"
          />
          <p className="text-xs text-gray-400 mt-1">Tagline akan tampil di bawah nama perusahaan</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-500">Preview logo & nama:</p>
          <div className="flex items-center gap-3 mt-2">
            <img src={logo.url} alt={logo.alt} className="h-12 w-auto object-contain" />
            <div className="leading-tight">
              <span className="block font-bold text-xl text-gray-800">{logo.companyName || 'LPPSLH'}</span>
              <span className="block text-sm text-gray-400">{logo.tagline || 'KONSULTAN'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMenu = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📋 Menu Navigasi</h2>
        <div className="flex gap-2">
          <button
            onClick={resetToDefaultMenu}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition text-sm"
          >
            <FiRefreshCw size={14} /> Reset Default
          </button>
          <button onClick={openAddMenuModal} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition text-sm">
            <FiPlus /> Tambah Menu
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {menuItems.sort((a,b) => a.order - b.order).map((item, idx) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-lg">{item.label}</span>
                  <span className="text-gray-500">→ {item.href}</span>
                  {item.icon && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">icon: {item.icon}</span>}
                </div>
                {item.dropdown && item.dropdown.length > 0 && (
                  <div className="mt-2 pl-4 border-l-2 border-gray-300">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Submenu ({item.dropdown.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {item.dropdown.map((sub, si) => (
                        <span key={si} className="text-xs bg-white px-2 py-0.5 rounded shadow-sm">
                          {sub.label} ({sub.href})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center ml-4">
                <button onClick={() => moveMenuItem(idx, 'up')} disabled={idx === 0} className="text-gray-500 disabled:opacity-30">
                  <FiArrowUp size={18} />
                </button>
                <button onClick={() => moveMenuItem(idx, 'down')} disabled={idx === menuItems.length-1} className="text-gray-500 disabled:opacity-30">
                  <FiArrowDown size={18} />
                </button>
                <button onClick={() => openEditMenuModal(item)} className="text-amber-600 p-1"><FiEdit size={18} /></button>
                <button onClick={() => deleteMenuItem(item.id)} className="text-red-500 p-1"><FiTrash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
        {menuItems.length === 0 && (
          <p className="text-gray-400 text-center py-4">Belum ada menu. Klik "Tambah Menu" untuk memulai.</p>
        )}
      </div>
    </div>
  )

  const renderSubmenu = () => {
    const allMenus = menuItems

    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">📎 Kelola Submenu</h2>
        <p className="text-sm text-gray-500 mb-4">
          Tambahkan, edit, atau hapus submenu untuk setiap menu navigasi.
          <br />Menu tanpa submenu akan tampil sebagai link biasa.
        </p>
        <div className="space-y-4">
          {allMenus.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Belum ada menu.</p>
          ) : (
            allMenus.sort((a,b) => a.order - b.order).map((menu) => (
              <div key={menu.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <FiChevronRight className="text-blue-500" />
                      {menu.label}
                      <span className="text-sm text-gray-400 font-normal">
                        ({menu.dropdown?.length || 0} submenu)
                      </span>
                    </h3>
                    {menu.icon && (
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{menu.icon}</span>
                    )}
                  </div>
                  <button
                    onClick={() => openAddSubmenuModal(menu.id)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm hover:bg-blue-700 transition"
                  >
                    <FiPlus size={14} /> Tambah Submenu
                  </button>
                </div>

                {(menu.dropdown && menu.dropdown.length > 0) ? (
                  <div className="space-y-2">
                    {menu.dropdown.map((sub, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                        <div>
                          <span className="font-medium">{sub.label}</span>
                          <span className="text-gray-400 text-sm ml-3">→ {sub.href}</span>
                          {sub.icon && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-2">{sub.icon}</span>}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveSubmenu(menu.id, idx, 'up')}
                            disabled={idx === 0}
                            className="text-gray-500 disabled:opacity-30 p-1 hover:text-blue-600 transition"
                          >
                            <FiArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => moveSubmenu(menu.id, idx, 'down')}
                            disabled={idx === (menu.dropdown?.length || 0) - 1}
                            className="text-gray-500 disabled:opacity-30 p-1 hover:text-blue-600 transition"
                          >
                            <FiArrowDown size={14} />
                          </button>
                          <button
                            onClick={() => openEditSubmenuModal(menu.id, idx)}
                            className="text-amber-600 p-1 hover:bg-amber-50 rounded transition"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            onClick={() => deleteSubmenu(menu.id, idx)}
                            className="text-red-500 p-1 hover:bg-red-50 rounded transition"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-4 border border-dashed border-gray-300 text-center">
                    <p className="text-sm text-gray-400">Belum ada submenu untuk <strong>{menu.label}</strong></p>
                    <p className="text-xs text-gray-400 mt-1">Klik tombol "Tambah Submenu" untuk menambahkan.</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  const renderSettings = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🎨 Pengaturan Tampilan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warna Latar (CSS)</label>
          <input
            type="text"
            value={settings.backgroundColor}
            onChange={e => setSettings({ ...settings, backgroundColor: e.target.value })}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warna Teks</label>
          <input
            type="color"
            value={settings.textColor}
            onChange={e => setSettings({ ...settings, textColor: e.target.value })}
            className="w-full h-10 border rounded-lg p-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warna Hover</label>
          <input
            type="color"
            value={settings.hoverColor}
            onChange={e => setSettings({ ...settings, hoverColor: e.target.value })}
            className="w-full h-10 border rounded-lg p-1"
          />
        </div>
        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.sticky} onChange={e => setSettings({ ...settings, sticky: e.target.checked })} />
            <span>Sticky header</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.showSearch} onChange={e => setSettings({ ...settings, showSearch: e.target.checked })} />
            <span>Tampilkan ikon pencarian</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.showLogin} onChange={e => setSettings({ ...settings, showLogin: e.target.checked })} />
            <span>Tampilkan ikon login</span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderPreview = () => (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">👁️ Preview Header</h2>
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <div 
          className="rounded-lg p-4 flex items-center justify-between"
          style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}
        >
          <div className="flex items-center gap-3">
            <img src={logo.url} alt={logo.alt} className="h-10 w-auto object-contain" />
            <div className="leading-tight">
              <span className="block font-bold text-xl text-gray-800">{logo.companyName || 'LPPSLH'}</span>
              <span className="block text-sm text-gray-400">{logo.tagline || 'KONSULTAN'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {menuItems.slice(0, 5).map(item => (
              <span key={item.id} className="text-sm font-medium" style={{ color: settings.hoverColor }}>
                {item.label}
              </span>
            ))}
            {menuItems.length > 5 && <span className="text-sm text-gray-400">+{menuItems.length - 5}</span>}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">*Preview sederhana, tampilan aktual mungkin berbeda.</p>
      </div>
    </div>
  )

  // ========== MAIN RENDER ==========
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500 mt-3">Memuat data header...</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      <AdminSectionNav items={NAV_ITEMS} activeKey={activeSection} onSelect={setActiveSection} />

      <div className="flex-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Header</h2>
          <div className="flex gap-2">
            <button onClick={fetchData} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition text-sm">
              <FiRefreshCw size={14} /> Refresh
            </button>
            <button onClick={handleSaveAll} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50 text-sm">
              <FiSave size={14} /> {saving ? 'Menyimpan...' : 'Simpan Semua'}
            </button>
          </div>
        </div>
        {message.text && (
          <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        {renderSection()}
      </div>

      {/* MODAL MENU */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingMenu ? '✏️ Edit Menu' : '📋 Tambah Menu'}</h3>
              <button onClick={() => setShowMenuModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Label Menu *"
                value={menuForm.label}
                onChange={e => setMenuForm({ ...menuForm, label: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Link *"
                value={menuForm.href}
                onChange={e => setMenuForm({ ...menuForm, href: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
              <select
                value={menuForm.icon || ''}
                onChange={e => setMenuForm({ ...menuForm, icon: e.target.value || undefined })}
                className="w-full border rounded-lg p-2"
              >
                <option value="">-- Tanpa ikon --</option>
                {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
              <input
                type="number"
                placeholder="Urutan"
                value={menuForm.order}
                onChange={e => setMenuForm({ ...menuForm, order: parseInt(e.target.value) || 0 })}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowMenuModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={saveMenu} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUBMENU */}
      {showSubmenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingSubmenuIndex !== null ? '✏️ Edit Submenu' : '📎 Tambah Submenu'}</h3>
              <button onClick={() => setShowSubmenuModal(false)} className="text-gray-500"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Label Submenu *"
                value={submenuForm.label}
                onChange={e => setSubmenuForm({ ...submenuForm, label: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Link *"
                value={submenuForm.href}
                onChange={e => setSubmenuForm({ ...submenuForm, href: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
              <select
                value={submenuForm.icon || ''}
                onChange={e => setSubmenuForm({ ...submenuForm, icon: e.target.value || undefined })}
                className="w-full border rounded-lg p-2"
              >
                <option value="">-- Tanpa ikon --</option>
                {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowSubmenuModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={saveSubmenu} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}