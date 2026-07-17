// src/app/admin/footer/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  FiSave, FiRefreshCw, FiEdit2, FiTrash2, FiX, FiPlus, FiLoader,
  FiMapPin, FiPhone, FiMail, FiGlobe, FiFacebook, FiTwitter, FiLinkedin, FiInstagram
} from 'react-icons/fi'
import AdminSectionNav from '@/components/admin/AdminSectionNav'

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

interface Message {
  text: string
  type: 'success' | 'error' | ''
}

// ========== DEFAULT DATA ==========
const DEFAULT_COMPANY: CompanyInfo = {
  company_name: 'LPPSLH',
  tagline: 'KONSULTAN',
  description: 'Mitra strategis dalam perencanaan wilayah, konsultansi lingkungan, dan manajemen proyek berkelanjutan sejak 1998.',
  copyright_text: 'Seluruh hak cipta dilindungi.'
}

const DEFAULT_CONTACT: ContactInfo = {
  address: 'Jl. Sudirman No. 123, Jakarta Selatan 12190, Indonesia',
  phone: '(021) 1234-5678',
  email: 'info@lppslh.com',
  website: 'www.lppslh.com'
}

const DEFAULT_SOCIAL: SocialMedia = {
  facebook: '',
  twitter: '',
  linkedin: '',
  instagram: ''
}

const DEFAULT_QUICK_LINKS: LinkItem[] = [
  { label: 'Tentang Kami', url: '/about' },
  { label: 'Layanan', url: '/services' },
  { label: 'Portofolio', url: '/projects' },
  { label: 'Berita & Artikel', url: '/news' },
  { label: 'Karir', url: '/careers' }
]

const DEFAULT_SERVICE_LINKS: LinkItem[] = [
  { label: 'Perencanaan Strategis', url: '/services/perencanaan-strategis' },
  { label: 'Konsultasi Lingkungan', url: '/services/konsultansi-lingkungan' },
  { label: 'Manajemen Proyek', url: '/services/manajemen-proyek' },
  { label: 'Sistem Informasi Geografis', url: '/services/sistem-informasi-geografis' },
  { label: 'Kajian Kelayakan', url: '/services/kajian-kelayakan' }
]

const DEFAULT_LEGAL_LINKS: LinkItem[] = [
  { label: 'Kebijakan Privasi', url: '/privacy-policy' },
  { label: 'Syarat & Ketentuan', url: '/terms-of-service' },
  { label: 'Kebijakan Cookie', url: '/cookie-policy' },
  { label: 'Peta Situs', url: '/sitemap' }
]

// ========== NAV ITEMS ==========
const navItems = [
  { key: 'company', label: '🏢 Perusahaan' },
  { key: 'quick_links', label: '🔗 Tautan Cepat' },
  { key: 'service_links', label: '📋 Layanan Unggulan' },
  { key: 'legal_links', label: '⚖️ Legal Links' },
  { key: 'contact', label: '📞 Kontak' },
  { key: 'social', label: '📱 Sosial Media' },
]

// ========== MAIN COMPONENT ==========
export default function AdminFooterPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState<string>('company')

  const [company, setCompany] = useState<CompanyInfo>(DEFAULT_COMPANY)
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT)
  const [social, setSocial] = useState<SocialMedia>(DEFAULT_SOCIAL)
  const [quickLinks, setQuickLinks] = useState<LinkItem[]>(DEFAULT_QUICK_LINKS)
  const [serviceLinks, setServiceLinks] = useState<LinkItem[]>(DEFAULT_SERVICE_LINKS)
  const [legalLinks, setLegalLinks] = useState<LinkItem[]>(DEFAULT_LEGAL_LINKS)

  const [showLinkModal, setShowLinkModal] = useState(false)
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null)
  const [linkForm, setLinkForm] = useState<LinkItem>({ label: '', url: '' })
  const [linkType, setLinkType] = useState<'quick' | 'service' | 'legal'>('quick')

  // ========== FETCH DATA ==========
  const fetchData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'footer')
        .eq('key', 'data')

      if (error) throw error

      if (data && data.length > 0) {
        data.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            switch (item.section) {
              case 'company_info': setCompany(prev => ({ ...prev, ...parsed })); break
              case 'contact_info': setContact(prev => ({ ...prev, ...parsed })); break
              case 'social_media': setSocial(prev => ({ ...prev, ...parsed })); break
              case 'quick_links': setQuickLinks(parsed); break
              case 'service_links': setServiceLinks(parsed); break
              case 'legal_links': setLegalLinks(parsed); break
            }
          } catch (e) { console.error('Parse error:', e) }
        })
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
  const saveSection = async (section: string, value: any) => {
    const { error } = await supabase
      .from('page_contents')
      .upsert({
        page: 'footer',
        section: section,
        key: 'data',
        value: JSON.stringify(value)
      }, { onConflict: 'page, section, key' })
    if (error) throw error
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setMessage({ text: '', type: '' })
    try {
      await saveSection('company_info', company)
      await saveSection('contact_info', contact)
      await saveSection('social_media', social)
      await saveSection('quick_links', quickLinks)
      await saveSection('service_links', serviceLinks)
      await saveSection('legal_links', legalLinks)
      setMessage({ text: '✅ Semua perubahan footer berhasil disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal menyimpan: ' + err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // ========== CRUD LINK ==========
  const openAddLink = (type: 'quick' | 'service' | 'legal') => {
    setLinkType(type)
    setEditingLinkIndex(null)
    setLinkForm({ label: '', url: '' })
    setShowLinkModal(true)
  }

  const openEditLink = (type: 'quick' | 'service' | 'legal', index: number) => {
    setLinkType(type)
    setEditingLinkIndex(index)
    let links: LinkItem[] = []
    if (type === 'quick') links = quickLinks
    else if (type === 'service') links = serviceLinks
    else links = legalLinks
    setLinkForm(links[index])
    setShowLinkModal(true)
  }

  const saveLink = () => {
    if (!linkForm.label || !linkForm.url) {
      alert('Label dan URL wajib diisi!')
      return
    }

    const newLink = { ...linkForm }
    let setter: React.Dispatch<React.SetStateAction<LinkItem[]>>

    if (linkType === 'quick') setter = setQuickLinks
    else if (linkType === 'service') setter = setServiceLinks
    else setter = setLegalLinks

    if (editingLinkIndex !== null) {
      setter(prev => prev.map((item, i) => i === editingLinkIndex ? newLink : item))
    } else {
      setter(prev => [...prev, newLink])
    }
    setShowLinkModal(false)
  }

  const deleteLink = (type: 'quick' | 'service' | 'legal', index: number) => {
    if (!confirm('Hapus link ini?')) return
    const setter = type === 'quick' ? setQuickLinks : type === 'service' ? setServiceLinks : setLegalLinks
    setter(prev => prev.filter((_, i) => i !== index))
  }

  // ========== RENDER SECTION ==========
  const renderSection = () => {
    switch (activeSection) {
      case 'company':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">🏢 Perusahaan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                <input
                  type="text"
                  value={company.company_name}
                  onChange={e => setCompany({ ...company, company_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={company.tagline}
                  onChange={e => setCompany({ ...company, tagline: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={company.description}
                  onChange={e => setCompany({ ...company, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                <input
                  type="text"
                  value={company.copyright_text}
                  onChange={e => setCompany({ ...company, copyright_text: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </div>
        )

      case 'quick_links':
        return renderLinks('quick', '🔗 Tautan Cepat', quickLinks)

      case 'service_links':
        return renderLinks('service', '📋 Layanan Unggulan', serviceLinks)

      case 'legal_links':
        return renderLinks('legal', '⚖️ Legal Links', legalLinks)

      case 'contact':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">📞 Kontak</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea
                  value={contact.address}
                  onChange={e => setContact({ ...contact, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">Telepon</label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={e => setContact({ ...contact, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  value={contact.email}
                  onChange={e => setContact({ ...contact, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={contact.website}
                  onChange={e => setContact({ ...contact, website: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </div>
        )

      case 'social':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">📱 Sosial Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FiFacebook className="text-blue-600" /> Facebook URL
                </label>
                <input
                  type="text"
                  value={social.facebook}
                  onChange={e => setSocial({ ...social, facebook: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FiTwitter className="text-sky-500" /> Twitter / X URL
                </label>
                <input
                  type="text"
                  value={social.twitter}
                  onChange={e => setSocial({ ...social, twitter: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FiLinkedin className="text-blue-700" /> LinkedIn URL
                </label>
                <input
                  type="text"
                  value={social.linkedin}
                  onChange={e => setSocial({ ...social, linkedin: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FiInstagram className="text-pink-600" /> Instagram URL
                </label>
                <input
                  type="text"
                  value={social.instagram}
                  onChange={e => setSocial({ ...social, instagram: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>
        )

      default:
        return <p>Pilih section di sidebar</p>
    }
  }

  const renderLinks = (type: 'quick' | 'service' | 'legal', title: string, links: LinkItem[]) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={() => openAddLink(type)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <FiPlus /> Tambah Link
          </button>
        </div>
        <div className="space-y-2">
          {links.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Belum ada link. Klik "Tambah Link" untuk menambahkan.</p>
          ) : (
            links.map((link, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <div>
                  <span className="font-medium text-gray-800">{link.label}</span>
                  <span className="text-gray-400 text-sm ml-3">{link.url}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditLink(type, idx)} className="text-amber-600 p-1 hover:bg-amber-50 rounded">
                    <FiEdit2 size={18} />
                  </button>
                  <button onClick={() => deleteLink(type, idx)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <FiLoader className="animate-spin text-indigo-500" size={32} />
          <p className="text-gray-500">Memuat data footer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 p-6">
      <AdminSectionNav items={navItems} activeKey={activeSection} onSelect={setActiveSection} />

      <div className="flex-1 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Footer</h2>
          <div className="flex gap-3">
            <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">
              <FiRefreshCw size={18} /> Refresh
            </button>
            <button onClick={handleSaveAll} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50">
              <FiSave size={18} /> {saving ? 'Menyimpan...' : 'Simpan Semua'}
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {renderSection()}
      </div>

      {/* Modal Link */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowLinkModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingLinkIndex !== null ? '✏️ Edit Link' : '➕ Tambah Link'}</h3>
              <button onClick={() => setShowLinkModal(false)} className="p-1 hover:bg-gray-100 rounded"><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={linkForm.label}
                  onChange={e => setLinkForm({ ...linkForm, label: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Contoh: Tentang Kami"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={linkForm.url}
                  onChange={e => setLinkForm({ ...linkForm, url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 border border-white/40 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Contoh: /about"
                />
              </div>
              <button onClick={saveLink} className="w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition">
                {editingLinkIndex !== null ? 'Update Link' : 'Simpan Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}