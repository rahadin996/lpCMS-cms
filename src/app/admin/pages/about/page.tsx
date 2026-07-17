// src/app/admin/pages/about/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FiPlus, FiSave, FiTrash2 } from 'react-icons/fi'
import ImageUpload from '@/components/admin/ImageUpload'

// ========== TYPE DEFINITIONS ==========
interface SlideItem {
  image: string
  badge: string
  title: string
  highlight: string
  description: string
}

interface StatItem {
  icon: string
  value: number
  label: string
  suffix: string
  color: string
}

interface Leader {
  name: string
  position: string
  bio: string
  image: string
  expertise: string
}

interface TimelineEvent {
  year: number
  title: string
  desc: string
  image?: string
}

interface Certification {
  title: string
  desc: string
  icon: string
}

interface ValueItem {
  title: string
  desc: string
  icon: string
  color: string
}

interface TechItem {
  name: string
  desc: string
  icon: string
  color: string
}

interface GalleryImage {
  src: string
  title: string
  category: string
}

interface VisionMission {
  vision: string
  mission: string[]
}

interface CtaContent {
  title: string
  description: string
  button_text: string
  button_link: string
  background_image: string
}

interface Partner {
  name: string
  logo: string
}

interface AboutContent {
  hero_slides: SlideItem[]
  stats: StatItem[]
  leadership: Leader[]
  timeline: TimelineEvent[]
  certifications: Certification[]
  values: ValueItem[]
  tech_innovations: TechItem[]
  gallery: GalleryImage[]
  vision_mission: VisionMission
  cta: CtaContent
  partners: Partner[]
}

// ========== DEFAULT DATA ==========
const DEFAULT_CONTENT: AboutContent = {
  hero_slides: [
    {
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop",
      badge: "TENTANG LPPSLH",
      title: "Konsultan Terpercaya",
      highlight: "Sejak 2002",
      description: "Mitra strategis dalam perencanaan wilayah, konsultansi lingkungan, dan pemberdayaan masyarakat berkelanjutan."
    }
  ],
  stats: [
    { icon: "FiCalendar", value: 2002, label: "Tahun Berdiri", suffix: "", color: "from-blue-500 to-cyan-500" },
    { icon: "FiTrendingUp", value: 24, label: "Pengalaman", suffix: "+", color: "from-purple-500 to-pink-500" },
    { icon: "FiBriefcase", value: 487, label: "Proyek Selesai", suffix: "+", color: "from-emerald-500 to-teal-500" },
    { icon: "FiStar", value: 99, label: "Klien Puas", suffix: "%", color: "from-amber-500 to-orange-500" },
    { icon: "FiUsers", value: 126, label: "Tenaga Ahli", suffix: "", color: "from-red-500 to-rose-500" },
    { icon: "FiAward", value: 78, label: "Penghargaan", suffix: "", color: "from-indigo-500 to-blue-500" },
    { icon: "FiGlobe", value: 50, label: "Mitra Kerja", suffix: "+", color: "from-green-500 to-emerald-500" },
    { icon: "FiMapPin", value: 15, label: "Kota Tersebar", suffix: "+", color: "from-cyan-500 to-blue-500" }
  ],
  leadership: [
    { name: "Ir. Siti Zubaidah, M.Si", position: "Komisaris", bio: "Memiliki pengalaman luas dalam pengembangan masyarakat dan kebijakan publik.", image: "https://randomuser.me/api/portraits/women/68.jpg", expertise: "Kebijakan Publik" }
  ],
  timeline: [
    { year: 1999, title: "Rintisan Awal", desc: "Dirintis dengan fokus pada peningkatan peran serta dalam pembangunan masyarakat.", image: "" }
  ],
  certifications: [
    { title: "Anggota INKINDO", desc: "No. 12430/P/0580.JT", icon: "FiBriefcase" }
  ],
  values: [
    { title: "Profesionalisme & Integritas", desc: "Kami mengutamakan kualitas, etika, dan kejujuran.", icon: "FiShield", color: "from-blue-500 to-cyan-500" }
  ],
  tech_innovations: [
    { name: "Digital Twin", desc: "Simulasi 3D untuk infrastruktur", icon: "FiCpu", color: "bg-blue-100 text-blue-600" }
  ],
  gallery: [
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop", title: "Kantor Pusat", category: "Office" }
  ],
  vision_mission: {
    vision: "Menjadi konsultan terpercaya yang berkontribusi dalam mewujudkan pembangunan berkelanjutan.",
    mission: [
      "Meningkatkan peran serta dalam kegiatan pembangunan masyarakat",
      "Mengembangkan kapasitas dan profesionalisme SDM"
    ]
  },
  cta: {
    title: "Siap Bekerja Sama dengan Kami?",
    description: "Diskusikan kebutuhan konsultansi Anda dengan tim ahli kami",
    button_text: "Hubungi Kami",
    button_link: "/contact",
    background_image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=600&fit=crop"
  },
  partners: [
    { name: "Kementrian PUPR", logo: "/images/pu.png" }
  ]
}

// ========== MAIN COMPONENT ==========
export default function EditAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' })
  const [content, setContent] = useState<AboutContent>(DEFAULT_CONTENT)
  const [activeSection, setActiveSection] = useState<string>('hero_slides')
  const supabase = createClient()

  const updateContent = <K extends keyof AboutContent>(section: K, value: AboutContent[K]) => {
    setContent(prev => ({ ...prev, [section]: value }))
  }

  const saveContent = async () => {
    setSaving(true)
    setMessage({ text: '', type: '' })

    const sections = [
      { key: 'hero_slides', data: content.hero_slides },
      { key: 'stats', data: content.stats },
      { key: 'leadership', data: content.leadership },
      { key: 'timeline', data: content.timeline },
      { key: 'certifications', data: content.certifications },
      { key: 'values', data: content.values },
      { key: 'tech_innovations', data: content.tech_innovations },
      { key: 'gallery', data: content.gallery },
      { key: 'vision_mission', data: content.vision_mission },
      { key: 'cta', data: content.cta },
      { key: 'partners', data: content.partners },
    ]

    try {
      for (const section of sections) {
        const { error } = await supabase
          .from('page_contents')
          .upsert({
            page: 'about',
            section: section.key,
            key: 'data',
            value: JSON.stringify(section.data)
          }, { onConflict: 'page, section, key' })
        if (error) throw error
      }
      setMessage({ text: '✅ Semua konten About berhasil disimpan!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (err: any) {
      setMessage({ text: '❌ Gagal menyimpan: ' + err.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: contentData } = await supabase
        .from('page_contents')
        .select('section, value')
        .eq('page', 'about')
        .eq('key', 'data')

      if (contentData && contentData.length > 0) {
        const newContent = { ...DEFAULT_CONTENT }
        contentData.forEach((item: any) => {
          try {
            const parsed = JSON.parse(item.value)
            const section = item.section as keyof AboutContent
            if (section in newContent) {
              ;(newContent[section] as any) = parsed
            }
          } catch (e) { console.error('Parse error:', e) }
        })
        setContent(newContent)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="p-8 text-center">Memuat data...</div>

  // ========== RENDER SECTION ==========
  const renderSection = () => {
    switch (activeSection) {
      case 'hero_slides': {
        const items = content.hero_slides
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Hero Slides</h3>
            <button onClick={() => updateContent('hero_slides', [...items, { image: '', badge: '', title: '', highlight: '', description: '' }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><FiPlus /> Tambah Slide</button>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ImageUpload bucket="about-images" path={`hero-slides/${Date.now()}`} value={item.image} onChange={(url) => { const newItems = [...items]; newItems[idx].image = url; updateContent('hero_slides', newItems) }} label="Gambar" />
                    <input placeholder="Badge" value={item.badge} onChange={(e) => { const newItems = [...items]; newItems[idx].badge = e.target.value; updateContent('hero_slides', newItems) }} className="border rounded p-2" />
                    <input placeholder="Title" value={item.title} onChange={(e) => { const newItems = [...items]; newItems[idx].title = e.target.value; updateContent('hero_slides', newItems) }} className="border rounded p-2" />
                    <input placeholder="Highlight" value={item.highlight} onChange={(e) => { const newItems = [...items]; newItems[idx].highlight = e.target.value; updateContent('hero_slides', newItems) }} className="border rounded p-2" />
                    <textarea placeholder="Deskripsi" value={item.description} onChange={(e) => { const newItems = [...items]; newItems[idx].description = e.target.value; updateContent('hero_slides', newItems) }} rows={2} className="border rounded p-2 col-span-2" />
                  </div>
                  <button onClick={() => { if (confirm('Hapus slide ini?')) { const newItems = items.filter((_, i) => i !== idx); updateContent('hero_slides', newItems) } }} className="text-red-500 text-sm mt-2">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'stats': {
        const items = content.stats
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Statistik</h3>
            <button onClick={() => updateContent('stats', [...items, { icon: 'FiBriefcase', value: 0, label: 'Baru', suffix: '', color: 'from-blue-500 to-cyan-500' }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><FiPlus /> Tambah Stat</button>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <input placeholder="Icon" value={item.icon} onChange={(e) => { const newItems = [...items]; newItems[idx].icon = e.target.value; updateContent('stats', newItems) }} className="border rounded p-2" />
                    <input type="number" placeholder="Value" value={item.value} onChange={(e) => { const newItems = [...items]; newItems[idx].value = Number(e.target.value); updateContent('stats', newItems) }} className="border rounded p-2" />
                    <input placeholder="Label" value={item.label} onChange={(e) => { const newItems = [...items]; newItems[idx].label = e.target.value; updateContent('stats', newItems) }} className="border rounded p-2" />
                    <input placeholder="Suffix" value={item.suffix} onChange={(e) => { const newItems = [...items]; newItems[idx].suffix = e.target.value; updateContent('stats', newItems) }} className="border rounded p-2" />
                    <input placeholder="Color" value={item.color} onChange={(e) => { const newItems = [...items]; newItems[idx].color = e.target.value; updateContent('stats', newItems) }} className="border rounded p-2" />
                  </div>
                  <button onClick={() => { if (confirm('Hapus stat ini?')) { const newItems = items.filter((_, i) => i !== idx); updateContent('stats', newItems) } }} className="text-red-500 text-sm mt-2">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'leadership': {
        const items = content.leadership
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Tim Kepemimpinan</h3>
            <button onClick={() => updateContent('leadership', [...items, { name: '', position: '', bio: '', image: '', expertise: '' }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><FiPlus /> Tambah Leader</button>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ImageUpload bucket="about-images" path={`leadership/${Date.now()}`} value={item.image} onChange={(url) => { const newItems = [...items]; newItems[idx].image = url; updateContent('leadership', newItems) }} label="Foto" />
                    <input placeholder="Nama" value={item.name} onChange={(e) => { const newItems = [...items]; newItems[idx].name = e.target.value; updateContent('leadership', newItems) }} className="border rounded p-2" />
                    <input placeholder="Posisi" value={item.position} onChange={(e) => { const newItems = [...items]; newItems[idx].position = e.target.value; updateContent('leadership', newItems) }} className="border rounded p-2" />
                    <input placeholder="Keahlian" value={item.expertise} onChange={(e) => { const newItems = [...items]; newItems[idx].expertise = e.target.value; updateContent('leadership', newItems) }} className="border rounded p-2" />
                    <textarea placeholder="Bio" value={item.bio} onChange={(e) => { const newItems = [...items]; newItems[idx].bio = e.target.value; updateContent('leadership', newItems) }} rows={3} className="border rounded p-2 col-span-2" />
                  </div>
                  <button onClick={() => { if (confirm('Hapus leader ini?')) { const newItems = items.filter((_, i) => i !== idx); updateContent('leadership', newItems) } }} className="text-red-500 text-sm mt-2">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'timeline': {
        const items = content.timeline
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Timeline Sejarah</h3>
            <button onClick={() => updateContent('timeline', [...items, { year: new Date().getFullYear(), title: '', desc: '', image: '' }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><FiPlus /> Tambah Event</button>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="number" placeholder="Tahun" value={item.year} onChange={(e) => { const newItems = [...items]; newItems[idx].year = Number(e.target.value); updateContent('timeline', newItems) }} className="border rounded p-2" />
                    <input placeholder="Judul" value={item.title} onChange={(e) => { const newItems = [...items]; newItems[idx].title = e.target.value; updateContent('timeline', newItems) }} className="border rounded p-2" />
                    <textarea placeholder="Deskripsi" value={item.desc} onChange={(e) => { const newItems = [...items]; newItems[idx].desc = e.target.value; updateContent('timeline', newItems) }} rows={2} className="border rounded p-2 col-span-2" />
                    <div className="col-span-2">
                      <ImageUpload bucket="about-images" path={`timeline/${Date.now()}`} value={item.image || ''} onChange={(url) => { const newItems = [...items]; newItems[idx].image = url; updateContent('timeline', newItems) }} label="Gambar (opsional)" />
                    </div>
                  </div>
                  <button onClick={() => { if (confirm('Hapus event ini?')) { const newItems = items.filter((_, i) => i !== idx); updateContent('timeline', newItems) } }} className="text-red-500 text-sm mt-2">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'certifications': {
        const items = content.certifications
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Sertifikasi & Keanggotaan</h3>
            <button onClick={() => updateContent('certifications', [...items, { title: '', desc: '', icon: 'FiBriefcase' }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><FiPlus /> Tambah</button>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input placeholder="Judul" value={item.title} onChange={(e) => { const newItems = [...items]; newItems[idx].title = e.target.value; updateContent('certifications', newItems) }} className="border rounded p-2" />
                    <input placeholder="Deskripsi" value={item.desc} onChange={(e) => { const newItems = [...items]; newItems[idx].desc = e.target.value; updateContent('certifications', newItems) }} className="border rounded p-2" />
                    <input placeholder="Icon" value={item.icon} onChange={(e) => { const newItems = [...items]; newItems[idx].icon = e.target.value; updateContent('certifications', newItems) }} className="border rounded p-2" />
                  </div>
                  <button onClick={() => { if (confirm('Hapus?')) { const newItems = items.filter((_, i) => i !== idx); updateContent('certifications', newItems) } }} className="text-red-500 text-sm mt-2">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'values': {
        const items = content.values
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Nilai-Nilai</h3>
            <button onClick={() => updateContent('values', [...items, { title: '', desc: '', icon: 'FiShield', color: 'from-blue-500 to-cyan-500' }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><FiPlus /> Tambah Nilai</button>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input placeholder="Judul" value={item.title} onChange={(e) => { const newItems = [...items]; newItems[idx].title = e.target.value; updateContent('values', newItems) }} className="border rounded p-2" />
                    <input placeholder="Deskripsi" value={item.desc} onChange={(e) => { const newItems = [...items]; newItems[idx].desc = e.target.value; updateContent('values', newItems) }} className="border rounded p-2" />
                    <input placeholder="Icon" value={item.icon} onChange={(e) => { const newItems = [...items]; newItems[idx].icon = e.target.value; updateContent('values', newItems) }} className="border rounded p-2" />
                    <input placeholder="Color" value={item.color} onChange={(e) => { const newItems = [...items]; newItems[idx].color = e.target.value; updateContent('values', newItems) }} className="border rounded p-2" />
                  </div>
                  <button onClick={() => { if (confirm('Hapus?')) { const newItems = items.filter((_, i) => i !== idx); updateContent('values', newItems) } }} className="text-red-500 text-sm mt-2">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'tech_innovations': {
        const items = content.tech_innovations
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Teknologi & Inovasi</h3>
            <button onClick={() => updateContent('tech_innovations', [...items, { name: '', desc: '', icon: 'FiCpu', color: 'bg-blue-100 text-blue-600' }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><FiPlus /> Tambah</button>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input placeholder="Nama" value={item.name} onChange={(e) => { const newItems = [...items]; newItems[idx].name = e.target.value; updateContent('tech_innovations', newItems) }} className="border rounded p-2" />
                    <input placeholder="Deskripsi" value={item.desc} onChange={(e) => { const newItems = [...items]; newItems[idx].desc = e.target.value; updateContent('tech_innovations', newItems) }} className="border rounded p-2" />
                    <input placeholder="Icon" value={item.icon} onChange={(e) => { const newItems = [...items]; newItems[idx].icon = e.target.value; updateContent('tech_innovations', newItems) }} className="border rounded p-2" />
                    <input placeholder="Color" value={item.color} onChange={(e) => { const newItems = [...items]; newItems[idx].color = e.target.value; updateContent('tech_innovations', newItems) }} className="border rounded p-2" />
                  </div>
                  <button onClick={() => { if (confirm('Hapus?')) { const newItems = items.filter((_, i) => i !== idx); updateContent('tech_innovations', newItems) } }} className="text-red-500 text-sm mt-2">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'gallery': {
        const items = content.gallery
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Galeri</h3>
            <button onClick={() => updateContent('gallery', [...items, { src: '', title: '', category: '' }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><FiPlus /> Tambah Gambar</button>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ImageUpload bucket="about-images" path={`gallery/${Date.now()}`} value={item.src} onChange={(url) => { const newItems = [...items]; newItems[idx].src = url; updateContent('gallery', newItems) }} label="Gambar" />
                    <input placeholder="Judul" value={item.title} onChange={(e) => { const newItems = [...items]; newItems[idx].title = e.target.value; updateContent('gallery', newItems) }} className="border rounded p-2" />
                    <input placeholder="Kategori" value={item.category} onChange={(e) => { const newItems = [...items]; newItems[idx].category = e.target.value; updateContent('gallery', newItems) }} className="border rounded p-2" />
                  </div>
                  <button onClick={() => { if (confirm('Hapus?')) { const newItems = items.filter((_, i) => i !== idx); updateContent('gallery', newItems) } }} className="text-red-500 text-sm mt-2">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'vision_mission': {
        const vm = content.vision_mission
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Visi & Misi</h3>
            <div className="space-y-4">
              <div className="border p-4 rounded-lg bg-gray-50">
                <label className="block font-medium mb-1">Visi</label>
                <textarea value={vm.vision} onChange={(e) => updateContent('vision_mission', { ...vm, vision: e.target.value })} rows={3} className="w-full border rounded p-2" />
              </div>
              <div className="border p-4 rounded-lg bg-gray-50">
                <label className="block font-medium mb-1">Misi (satu per baris)</label>
                <textarea value={vm.mission.join('\n')} onChange={(e) => updateContent('vision_mission', { ...vm, mission: e.target.value.split('\n').filter(m => m.trim()) })} rows={5} className="w-full border rounded p-2" placeholder="Misi 1&#10;Misi 2&#10;..." />
              </div>
            </div>
          </div>
        )
      }

      case 'cta': {
        const cta = content.cta
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">CTA Section</h3>
            <div className="border p-4 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Judul" value={cta.title} onChange={(e) => updateContent('cta', { ...cta, title: e.target.value })} className="border rounded p-2 col-span-2" />
                <textarea placeholder="Deskripsi" value={cta.description} onChange={(e) => updateContent('cta', { ...cta, description: e.target.value })} rows={2} className="border rounded p-2 col-span-2" />
                <input placeholder="Button Text" value={cta.button_text} onChange={(e) => updateContent('cta', { ...cta, button_text: e.target.value })} className="border rounded p-2" />
                <input placeholder="Button Link" value={cta.button_link} onChange={(e) => updateContent('cta', { ...cta, button_link: e.target.value })} className="border rounded p-2" />
                <div className="col-span-2">
                  <ImageUpload bucket="about-images" path={`cta/${Date.now()}`} value={cta.background_image} onChange={(url) => updateContent('cta', { ...cta, background_image: url })} label="Background Image" />
                </div>
              </div>
            </div>
          </div>
        )
      }

      case 'partners': {
        const items = content.partners
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Partner</h3>
            <button onClick={() => updateContent('partners', [...items, { name: '', logo: '' }])} className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2"><FiPlus /> Tambah Partner</button>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input placeholder="Nama" value={item.name} onChange={(e) => { const newItems = [...items]; newItems[idx].name = e.target.value; updateContent('partners', newItems) }} className="border rounded p-2" />
                    <ImageUpload bucket="about-images" path={`partners/${Date.now()}`} value={item.logo} onChange={(url) => { const newItems = [...items]; newItems[idx].logo = url; updateContent('partners', newItems) }} label="Logo" />
                  </div>
                  <button onClick={() => { if (confirm('Hapus partner?')) { const newItems = items.filter((_, i) => i !== idx); updateContent('partners', newItems) } }} className="text-red-500 text-sm mt-2">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      default:
        return <p>Pilih section di sidebar</p>
    }
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 shrink-0 bg-white rounded-2xl shadow-lg p-4 h-fit sticky top-6">
        <h3 className="font-bold text-gray-700 mb-3">Navigasi</h3>
        <div className="space-y-1">
          {[
            { key: 'hero_slides', label: 'Hero Slides' },
            { key: 'stats', label: 'Statistik' },
            { key: 'leadership', label: 'Tim Kepemimpinan' },
            { key: 'timeline', label: 'Timeline' },
            { key: 'certifications', label: 'Sertifikasi' },
            { key: 'values', label: 'Nilai-Nilai' },
            { key: 'tech_innovations', label: 'Teknologi & Inovasi' },
            { key: 'gallery', label: 'Galeri' },
            { key: 'vision_mission', label: 'Visi & Misi' },
            { key: 'cta', label: 'CTA' },
            { key: 'partners', label: 'Partner' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeSection === item.key ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Konten */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">✏️ Edit About Page</h2>
          <button
            onClick={saveContent}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50"
          >
            <FiSave /> {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {renderSection()}
      </div>
    </div>
  )
}