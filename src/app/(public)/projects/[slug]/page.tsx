// src/app/(public)/projects/[slug]/page.tsx
'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { 
  FiArrowLeft, FiCalendar, FiMapPin, FiUsers, FiBriefcase, 
  FiClock, FiDollarSign, FiCheckCircle, FiDownload, FiArrowUp,
  FiChevronLeft, FiChevronRight, FiZoomIn, FiX, FiBookOpen, FiImage,
} from 'react-icons/fi'
import { createClient } from '@/lib/supabase/client'

// ================= TYPE =================
interface Personil {
  id: number
  nama: string
  noHp: string
  posisi: string
  lulusan: string
  tahunLulus: number
  deskripsi: string
  image: string
  keahlian: string[]
}

// ================= HOOK COUNTER =================
const useCounter = (target: number, duration = 2000) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

// ================= ORGANIGRAM =================
const PersonilOrganigram = ({ 
  project, 
  allPersonil, 
  openPersonilModal 
}: { 
  project: any
  allPersonil: Personil[]
  openPersonilModal: (id: number) => void 
}) => {
  const [hoveredPerson, setHoveredPerson] = useState<Personil | null>(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  const roles = project.organigramRoles || {}
  const roleProjectManager = roles.projectManager || "Senior Planner"
  const roleGisConsultant = roles.gisConsultant || "Konsultan GIS"
  const roleGisSpecialist = roles.gisSpecialist || "Ahli GIS"
  const roleEnvironmental = roles.environmental || "Konsultan Lingkungan"
  const roleQaQc = roles.qaQc
  const roleK3 = roles.k3

  const projectManager = allPersonil.find((p) => p.posisi === roleProjectManager) || null
  const gisConsultant = allPersonil.find((p) => p.posisi === roleGisConsultant) || null
  const gisSpecialist = allPersonil.find((p) => p.posisi === roleGisSpecialist) || null
  const environmental = allPersonil.find((p) => p.posisi === roleEnvironmental) || null
  const qaQcPerson = roleQaQc ? allPersonil.find((p) => p.posisi === roleQaQc) || null : null
  const k3Person = roleK3 ? allPersonil.find((p) => p.posisi === roleK3) || null : null

  const handlePersonMouseEnter = (e: React.MouseEvent, person: Personil) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPopupPosition({ x: rect.right + 15, y: rect.top })
    setHoveredPerson(person)
  }
  const handlePersonMouseLeave = () => setHoveredPerson(null)

  const OrgBox = ({ title, color = "slate", children }: { title: string; color?: string; children: React.ReactNode }) => {
    const colorMap: Record<string, string> = { 
      slate: "bg-slate-700", 
      amber: "bg-amber-600", 
      emerald: "bg-emerald-600", 
      indigo: "bg-indigo-600" 
    }
    return (
      <div className="relative border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 p-4 h-full flex flex-col z-20">
        <div className={`${colorMap[color]} text-white text-xs font-semibold rounded-full py-2 px-3 text-center shadow-sm tracking-wide`}>
          {title}
        </div>
        <div className="flex-1 space-y-2 mt-3">{children}</div>
      </div>
    )
  }

  const OrgMember = ({ 
    person, 
    onClick, 
    placeholder 
  }: { 
    person?: Personil | null
    onClick?: () => void
    placeholder?: boolean 
  }) => {
    if (placeholder || !person) {
      return (
        <div className="flex items-center gap-2 bg-slate-50 text-slate-400 rounded-xl px-3 py-2 border border-dashed border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 text-xs">👤</div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold text-slate-400">-</div>
            <div className="text-[9px] text-slate-300">Belum ditetapkan</div>
          </div>
        </div>
      )
    }
    return (
      <div 
        onClick={onClick}
        onMouseEnter={(e) => handlePersonMouseEnter(e, person)}
        onMouseLeave={handlePersonMouseLeave}
        className="flex items-center gap-2 bg-slate-800 text-white rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-700 transition-all shadow-sm"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
          {person.image ? (
            <img src={person.image} alt={person.nama} className="w-full h-full rounded-full object-cover" />
          ) : '👤'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold leading-tight">{person.posisi}</div>
          <div className="text-[9px] opacity-80 truncate">{person.nama}</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div key="personil" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-1">Struktur Organisasi Tim Supervisi</h2>
        <p className="text-slate-500 text-sm">Konsultan Supervisi – Skema Lengkap</p>
      </div>
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 overflow-x-auto">
          <div className="relative mx-auto" style={{ minWidth: "950px" }}>
            {/* PROJECT MANAGER */}
            <div className="relative flex justify-center mb-16">
              <div className="w-72 text-center relative z-10 cursor-pointer">
                <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold text-sm rounded-full py-2 shadow-md">
                  PROJECT MANAGER
                </div>
                <div 
                  className="bg-indigo-600 text-white rounded-full py-2 mt-2 shadow-md text-sm cursor-pointer hover:bg-indigo-700 transition"
                  onClick={() => projectManager && openPersonilModal(projectManager.id)}
                >
                  {projectManager?.nama || "-"}
                </div>
                <div className="text-xs text-slate-500 mt-1">{projectManager?.posisi || "Belum ditetapkan"}</div>
              </div>
            </div>
            <div className="relative h-12"><div className="absolute left-1/2 top-0 w-[2px] h-full bg-slate-400 -translate-x-1/2 z-0" /></div>
            <div className="relative mb-10" style={{ height: '32px' }}>
              <div className="absolute left-[10%] right-[10%] top-0 h-[2px] bg-slate-400" />
              {[12.5, 37.5, 62.5, 87.5].map((leftPos) => (
                <div key={leftPos} className="absolute w-[2px] bg-slate-400" style={{ left: `${leftPos}%`, top: '0px', height: '32px', transform: 'translateX(-1px)' }} />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-6 mb-16 relative z-10">
              <OrgBox title="ENGINEERING & PLANNING" color="emerald">
                <OrgMember person={projectManager} onClick={() => projectManager && openPersonilModal(projectManager.id)} />
              </OrgBox>
              <OrgBox title="GIS & PEMETAAN" color="emerald">
                {gisConsultant && <OrgMember person={gisConsultant} onClick={() => openPersonilModal(gisConsultant.id)} />}
                {gisSpecialist && <OrgMember person={gisSpecialist} onClick={() => openPersonilModal(gisSpecialist.id)} />}
                {!gisConsultant && !gisSpecialist && <OrgMember placeholder />}
              </OrgBox>
              <OrgBox title="LINGKUNGAN & AMDAL" color="emerald">
                {environmental ? <OrgMember person={environmental} onClick={() => openPersonilModal(environmental.id)} /> : <OrgMember placeholder />}
              </OrgBox>
              <OrgBox title="QA/QC & K3" color="emerald">
                {qaQcPerson && <OrgMember person={qaQcPerson} onClick={() => openPersonilModal(qaQcPerson.id)} />}
                {k3Person && <OrgMember person={k3Person} onClick={() => openPersonilModal(k3Person.id)} />}
                {!qaQcPerson && !k3Person && <OrgMember placeholder />}
              </OrgBox>
            </div>
            <div className="relative mb-10" style={{ height: '48px' }}>
              <div className="absolute left-1/2 top-0 w-[2px] h-[48px] bg-slate-400 -translate-x-1/2" />
              <div className="absolute left-[16.5%] right-[16.5%] top-[28px] h-[2px] bg-slate-400" />
              {[25, 50, 75].map((leftPos) => (
                <div key={leftPos} className="absolute w-[2px] bg-slate-400" style={{ left: `${leftPos}%`, top: '28px', height: '20px', transform: 'translateX(-1px)' }} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6 mb-16 relative z-10">
              <OrgBox title="ADMINISTRASI & KEUANGAN" color="emerald"><OrgMember placeholder /></OrgBox>
              <OrgBox title="DOKUMENTASI & REPORTING" color="emerald"><OrgMember placeholder /></OrgBox>
              <OrgBox title="LOGISTIK & PENGADAAN" color="emerald"><OrgMember placeholder /></OrgBox>
            </div>
            <div className="relative mb-10" style={{ height: '40px' }}>
              <div className="absolute left-1/2 top-0 w-[2px] h-[40px] bg-slate-400 -translate-x-1/2" />
              <div className="absolute left-[35%] right-[35%] top-[20px] h-[2px] bg-slate-400" />
              <div className="absolute left-1/2 top-[20px] w-[2px] h-[20px] bg-slate-400 -translate-x-1/2" />
            </div>
            <div className="flex justify-center mb-10 relative z-10">
              <div className="w-full max-w-md">
                <OrgBox title="STAFF LAPANGAN / SITE INSPECTOR" color="indigo">
                  <OrgMember placeholder />
                </OrgBox>
              </div>
            </div>
            <div className="text-center mt-10 text-l font-semibold tracking-wide text-slate-600 border-t border-slate-100 pt-5">
              STRUKTUR ORGANISASI
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hoveredPerson && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 w-96 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 p-5" 
            style={{ left: popupPosition.x, top: popupPosition.y }}
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                {hoveredPerson.image ? <img src={hoveredPerson.image} alt="" className="w-full h-full rounded-full object-cover" /> : '👤'}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">{hoveredPerson.nama}</h3>
                <p className="text-indigo-600 font-semibold text-sm">{hoveredPerson.posisi}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p><span className="font-medium text-slate-500">📞 Kontak:</span> {hoveredPerson.noHp || '-'}</p>
              <p><span className="font-medium text-slate-500">🎓 Pendidikan:</span> {hoveredPerson.lulusan} ({hoveredPerson.tahunLulus})</p>
              <p><span className="font-medium text-slate-500">📝 Deskripsi:</span> {hoveredPerson.deskripsi || 'Tidak ada deskripsi'}</p>
              <p><span className="font-medium text-slate-500">⚙️ Keahlian:</span> {hoveredPerson.keahlian?.join(', ') || '-'}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ================= MAIN PAGE =================
export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const supabase = createClient()
  
  const [project, setProject] = useState<any>(null)
  const [allPersonil, setAllPersonil] = useState<Personil[]>([])
  const [loading, setLoading] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedTab, setSelectedTab] = useState('deskripsi')
  const [showPersonilModal, setShowPersonilModal] = useState(false)
  const [selectedPersonil, setSelectedPersonil] = useState<Personil | null>(null)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  // Hooks - dipanggil di level atas
  const rawValue = project?.value ? parseInt(project.value.replace(/[^0-9]/g, '')) || 0 : 0
  const rawProgress = project?.progress || 0
  const animatedValue = useCounter(rawValue, 1500)
  const animatedProgress = useCounter(rawProgress, 1200)

  useEffect(() => {
    const fetchData = async () => {
      // 1. Ambil data proyek
      const { data, error } = await supabase
        .from('project_porto')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        setLoading(false)
        return
      }

      const detail = data.detail_data || {}
      const galleryImages = detail.images || []
      
      setProject({
        id: data.id,
        title: data.title,
        slug: data.slug,
        client: data.client,
        location: `${data.city}, ${data.province}`,
        year: data.year,
        value: data.value,
        status: data.status,
        duration: detail.duration || '12 bulan',
        category: data.category,
        progress: data.progress,
        imageHero: data.image,
        images: galleryImages.map((img: any) => typeof img === 'string' ? img : img.url || img),
        galleryImages: galleryImages,
        desc: data.description,
        fullDesc: data.full_desc || detail.fullDesc || data.description,
        objectives: detail.objectives || [],
        achievements: detail.achievements || [],
        challenges: detail.challenges || [],
        timeline: detail.timeline || [],
        personilIds: detail.personilIds || [],
        organigramRoles: detail.organigramRoles || {},
        documents: detail.documents || [],
        relatedProjects: detail.relatedProjects || [],
        videoUrl: detail.videoUrl || null,
      })

      // 2. Ambil data personil
      const { data: personilData, error: personilError } = await supabase
        .from('personil')
        .select('*')
        .order('id', { ascending: true })

      if (!personilError && personilData) {
        const mapped: Personil[] = personilData.map((item: any) => ({
          id: item.id,
          nama: item.nama,
          noHp: item.no_hp || '',
          posisi: item.posisi,
          lulusan: item.lulusan || '',
          tahunLulus: item.tahun_lulus || 0,
          deskripsi: item.deskripsi || '',
          image: item.image || '',
          keahlian: item.keahlian || [],
        }))
        setAllPersonil(mapped)
      }

      setLoading(false)
    }

    fetchData()
  }, [slug, supabase])

  useEffect(() => {
    const h = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  if (loading) return <div className="p-8 text-center">Memuat proyek...</div>
  if (!project) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">Proyek tidak ditemukan</div>

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const openLightbox = (index: number) => { setCurrentImageIndex(index); setLightboxOpen(true) }
  
  const openPersonilModal = (personilId: number) => {
    const person = allPersonil.find(p => p.id === personilId)
    setSelectedPersonil(person ?? null)
    setShowPersonilModal(true)
  }

  const fadeUp: Variants = { 
    hidden: { opacity: 0, y: 60 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } } 
  }
  const staggerContainer: Variants = { 
    hidden: { opacity: 0 }, 
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } } 
  }

  const formattedValue = () => {
    if (project.value.includes('Rp')) return project.value
    return `Rp ${animatedValue.toLocaleString('id-ID')}`
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  const imageDetailsList = (project.galleryImages || []).map((img: any, idx: number) => {
    if (typeof img === 'string') return { title: `Gambar ${idx+1}`, caption: '', specs: {} }
    return { title: img.title || `Gambar ${idx+1}`, caption: img.caption || '', specs: img.specs || {} }
  })

  const defaultTimeline = [
    { phase: "Kick-off Meeting", startMonth: 0, endMonth: 0.5, desc: "Inisiasi proyek, pembentukan tim, penyusunan jadwal induk" },
    { phase: "Persiapan & Mobilisasi", startMonth: 0.5, endMonth: 1, desc: "Mobilisasi alat berat, material, dan tenaga kerja" },
    { phase: "Desain & Engineering", startMonth: 1, endMonth: 3, desc: "Desain detail, gambar kerja, dan perizinan" },
    { phase: "Pengadaan Material", startMonth: 2, endMonth: 4, desc: "Pengadaan material utama dan subkontraktor" },
    { phase: "Konstruksi - Pondasi", startMonth: 3, endMonth: 5, desc: "Pekerjaan pondasi dan struktur bawah" },
    { phase: "Konstruksi - Struktur", startMonth: 5, endMonth: 8, desc: "Pekerjaan struktur atas" },
    { phase: "Arsitektur & Finishing", startMonth: 7, endMonth: 10, desc: "Dinding, lantai, plafon, dan finishing" },
    { phase: "MEP & Instalasi", startMonth: 8, endMonth: 11, desc: "Instalasi mekanikal, elektrikal, plumbing" },
    { phase: "Komisioning & Uji Coba", startMonth: 11, endMonth: 12, desc: "Pengujian sistem dan peralatan" },
    { phase: "Handover & Serah Terima", startMonth: 12, endMonth: 12.5, desc: "Serah terima final ke klien dan pemeliharaan awal" }
  ]
  const phases = project.timeline && project.timeline.length > 0 ? project.timeline : defaultTimeline
  const totalMonths = 13

  return (
    <div className="bg-gray-50 text-gray-900 overflow-x-hidden">
      <style jsx global>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        html { scroll-behavior: smooth; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-start overflow-hidden">
        <div className="absolute inset-0">
          <img src={project.imageHero} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-white w-full">
          <Link href="/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition" size={18} /> Kembali ke Proyek
          </Link>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">{project.title}</h1>
              <div className="flex flex-wrap gap-3 mt-6 text-sm">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"><FiMapPin size={14} /> {project.location}</span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"><FiCalendar size={14} /> {project.year}</span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"><FiBriefcase size={14} /> {project.client}</span>
                <span className={`px-4 py-2 rounded-full text-xs font-semibold ${project.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                  {project.status === 'completed' ? '✓ Selesai' : '⚡ Berjalan'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* STATS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {[
            { label: "Nilai Proyek", value: project.value, icon: FiDollarSign, isCounter: true },
            { label: "Durasi", value: project.duration, icon: FiClock },
            { label: "Klien", value: project.client, icon: FiUsers },
            { label: "Status", value: project.status === 'completed' ? "Selesai" : "Berjalan", icon: FiCheckCircle },
            { label: "Kategori", value: project.category || "Infrastruktur", icon: FiBriefcase },
            { label: "Tahun", value: project.year, icon: FiCalendar },
          ].map((stat, idx) => {
            const gradients = ["from-blue-500 to-cyan-500","from-purple-500 to-pink-500","from-emerald-500 to-teal-500","from-amber-500 to-orange-500","from-rose-500 to-red-500","from-indigo-500 to-purple-500"]
            const displayValue = stat.isCounter ? formattedValue() : stat.value;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="group relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradients[idx % 6]} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[idx % 6]} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition duration-300 shadow-lg`}>
                  <stat.icon size={28} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{displayValue}</h3>
                <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PROGRESS BAR */}
      {project.status === 'ongoing' && project.progress && (
        <section className="py-8 px-4 max-w-7xl mx-auto">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${animatedProgress}%` }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative">
              <div className="absolute right-0 top-0 h-full w-2 bg-white/40 rounded-full animate-pulse" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>Progress Proyek</span>
            <span className="font-bold text-blue-600">{animatedProgress}%</span>
          </div>
        </section>
      )}

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {[
            { key: 'deskripsi', label: 'Deskripsi', icon: FiBookOpen },
            { key: 'galeri', label: 'Galeri', icon: FiZoomIn },
            { key: 'timeline', label: 'Timeline', icon: FiClock },
            { key: 'personil', label: 'Struktur Organisasi', icon: FiUsers },
            { key: 'dokumen', label: 'Dokumen', icon: FiDownload }
          ].map((tab) => (
            <motion.button key={tab.key} onClick={() => setSelectedTab(tab.key)} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              className={`group relative py-2.5 px-4 md:px-8 text-sm md:text-base font-medium transition-all duration-300 rounded-xl flex items-center gap-2 md:gap-2.5 ${selectedTab === tab.key ? 'text-gray-900 bg-white/80 shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'}`}>
              <tab.icon size={18} className="transition-transform duration-200 group-hover:scale-105" />
              <span className="tracking-wide">{tab.label}</span>
              {selectedTab === tab.key && (
                <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* DESKRIPSI */}
          {selectedTab === 'deskripsi' && (
            <motion.div
              key="deskripsi"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-700" />
                <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
                  <div className="p-8 md:p-10 lg:p-12">
                    <div className="mb-8 text-center md:text-left">
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight text-gray-800">
                        {project.title}
                      </h2>
                      <div className="w-16 h-px bg-gradient-to-r from-blue-400 to-transparent mt-4 mx-auto md:mx-0" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                      {/* TEKS */}
                      <div className="lg:col-span-2">
                        <div className="text-gray-600 leading-relaxed text-base md:text-lg font-light">
                          <div className="space-y-4">
                            <p className="first-letter:text-6xl first-letter:font-normal first-letter:text-blue-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none mt-0">
                              {project.fullDesc}
                            </p>
                            <p>
                              Proyek ini merupakan bagian dari komitmen LPPSLH dalam menghadirkan infrastruktur berkualitas tinggi yang berkelanjutan.
                            </p>
                            <p>
                              Kolaborasi erat dengan seluruh pemangku kepentingan memungkinkan identifikasi dan mitigasi risiko secara dini.
                            </p>
                            <p>
                              Keberhasilan proyek ini tidak terlepas dari penerapan prinsip keselamatan dan kesehatan kerja (K3) yang unggul.
                            </p>
                            <div className="border-l-4 border-blue-400 pl-5 py-2 my-4 italic text-gray-500 bg-blue-50/50 rounded-r-lg">
                              <span className="text-blue-400 text-lg mr-1">“</span>
                              Dedikasi terhadap keunggulan dan inovasi menjadi landasan setiap langkah kami.
                              <span className="text-blue-400 text-lg ml-1">”</span>
                            </div>
                            <p>
                              LPPSLH terus berinovasi dalam memberikan layanan supervisi dan konsultasi yang adaptif terhadap tantangan lapangan.
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-5 mt-8 pt-5 text-sm text-gray-500 border-t border-gray-200/50">
                            {[
                              { icon: FiMapPin, label: project.location },
                              { icon: FiCalendar, label: project.year },
                              { icon: FiUsers, label: project.client },
                              { icon: FiBriefcase, label: project.category || "Infrastruktur" }
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-gray-500">
                                <item.icon size={14} className="text-blue-400" />
                                <span>{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* FOTO */}
                      <div className="lg:col-span-1 space-y-4">
                        {project.images && project.images.length > 0 && (
                          <div className="relative rounded-xl overflow-hidden shadow-lg group/foto1 cursor-pointer" onClick={() => openLightbox(0)}>
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className="w-full h-48 md:h-56 lg:h-64 object-cover transition duration-700 group-hover/foto1:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/foto1:opacity-100 transition duration-500 flex items-end p-3">
                              <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Foto Utama</span>
                            </div>
                            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/foto1:opacity-100 transition duration-300 shadow-sm">
                              <FiZoomIn size={14} className="text-gray-700" />
                            </div>
                          </div>
                        )}

                        {project.images && project.images.length > 1 ? (
                          <div className="relative rounded-xl overflow-hidden shadow-lg group/foto2 cursor-pointer" onClick={() => openLightbox(1)}>
                            <img
                              src={project.images[1]}
                              alt={`${project.title} - tampilan tambahan`}
                              className="w-full h-36 md:h-40 lg:h-44 object-cover transition duration-700 group-hover/foto2:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/foto2:opacity-100 transition duration-500 flex items-end p-3">
                              <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Foto Tambahan</span>
                            </div>
                            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/foto2:opacity-100 transition duration-300 shadow-sm">
                              <FiZoomIn size={14} className="text-gray-700" />
                            </div>
                          </div>
                        ) : (
                          project.images && project.images.length === 1 && (
                            <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center h-36 md:h-40 lg:h-44 border-2 border-dashed border-gray-300">
                              <div className="text-center text-gray-400">
                                <FiImage size={32} className="mx-auto mb-2 opacity-50" />
                                <span className="text-sm">Foto tambahan belum tersedia</span>
                              </div>
                            </div>
                          )
                        )}
                        <p className="text-[11px] text-gray-400 text-center tracking-wide mt-1">
                          Klik foto untuk melihat galeri lengkap
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* GALERI */}
          {selectedTab === 'galeri' && (
            <motion.div key="galeri" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full">
              <div className="relative">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-800">Galeri Proyek</h2>
                  <div className="w-12 h-px bg-gradient-to-r from-blue-400 to-transparent mx-auto mt-3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.images.map((img: any, idx: number) => {
                    const imageUrl = typeof img === 'string' ? img : img.url
                    const detail = imageDetailsList[idx] || { title: '', caption: '', specs: {} }
                    return (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.05, duration: 0.4 }} whileHover={{ y: -6 }}
                        className="group relative bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/60"
                        onClick={() => openLightbox(idx)}>
                        <div className="aspect-video overflow-hidden">
                          <img src={imageUrl} alt={detail.caption} className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-105" />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-8 translate-y-2 group-hover:translate-y-0 transition duration-300">
                          <p className="text-white text-xs md:text-sm font-medium leading-relaxed line-clamp-2">{detail.caption}</p>
                        </div>
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 shadow-sm">
                          <FiZoomIn size={15} className="text-gray-700" />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <AnimatePresence>
                  {lightboxOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-6xl max-h-[90vh] bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 px-5 pt-8 pb-6 bg-white/5 backdrop-blur-sm border-b border-white/20">
                          <div className="flex-1 text-center text-white/60 text-xs font-bold tracking-wide">
                            {project.title} – {imageDetailsList[currentImageIndex]?.title || "Preview"}
                          </div>
                        </div>
                        <div className="flex flex-col lg:flex-row h-[calc(90vh-52px)]">
                          <div className="relative flex-1 bg-black/30 flex items-center justify-center p-4 min-h-[300px] lg:min-h-0">
                            <img src={project.images[currentImageIndex]} className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-xl" alt="" />
                            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/40 transition-all duration-200 shadow-md"><FiChevronLeft size={24} className="text-white drop-shadow" /></button>
                            <button onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % project.images.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/40 transition-all duration-200 shadow-md"><FiChevronRight size={24} className="text-white drop-shadow" /></button>
                          </div>
                          <div className="lg:w-96 bg-white/5 backdrop-blur-md border-l border-white/20 p-6 text-white overflow-y-auto">
                            {imageDetailsList[currentImageIndex] ? (
                              <>
                                <h3 className="text-2xl font-medium tracking-tight mb-2">{imageDetailsList[currentImageIndex].title}</h3>
                                <p className="text-sm text-white/70 mb-6 leading-relaxed">{imageDetailsList[currentImageIndex].caption}</p>
                                <div className="space-y-4">
                                  {Object.entries(imageDetailsList[currentImageIndex].specs).map(([key, val]) => (
                                    <div key={key} className="group">
                                      <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1 block">{key}</span>
                                      <span className="text-base font-light text-white/90 group-hover:text-white transition">{String(val)}</span>
                                      <div className="mt-1 h-px bg-white/10 group-hover:bg-white/20 transition" />
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-center h-full text-white/40 text-sm italic">Tidak ada informasi detail untuk foto ini</div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* TIMELINE */}
          {selectedTab === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Gantt Chart - Project Timeline</h2>
              <p className="text-center text-gray-500 mb-8">Jadwal lengkap proyek</p>
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-[220px,1fr] gap-4 mb-4">
                    <div className="font-bold text-gray-600">Fase Pekerjaan</div>
                    <div className="relative h-8">
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: totalMonths + 1 }, (_, i) => {
                          const monthName = monthNames[i % 12]
                          return <div key={i} className="flex-1 text-center text-xs text-gray-400 border-l border-gray-100">{monthName}</div>
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {phases.map((phase: any, idx: number) => {
                      const startMonth = phase.startMonth
                      const endMonth = phase.endMonth
                      const duration = endMonth - startMonth
                      const leftPercent = (startMonth / totalMonths) * 100
                      const widthPercent = (duration / totalMonths) * 100
                      const startLabel = monthNames[Math.floor(startMonth) % 12]
                      const endLabel = monthNames[Math.floor(endMonth) % 12]
                      const tooltipText = `${phase.phase}\n📅 ${startLabel} - ${endLabel}\n📝 ${phase.desc}`
                      const phaseColors = ["from-emerald-500 to-teal-500","from-sky-500 to-blue-500","from-indigo-500 to-purple-500","from-purple-500 to-pink-500","from-rose-500 to-orange-500","from-amber-500 to-yellow-500","from-green-500 to-emerald-500","from-blue-500 to-cyan-500","from-fuchsia-500 to-pink-500","from-gray-500 to-gray-600"]
                      return (
                        <div key={idx} className="grid grid-cols-[220px,1fr] gap-4 items-center group">
                          <div>
                            <div className="font-semibold text-gray-800">{phase.phase}</div>
                            <div className="text-xs text-gray-400">{startLabel} - {endLabel}</div>
                          </div>
                          <div className="relative h-10">
                            <div className="absolute inset-0 bg-gray-100 rounded-full" />
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${widthPercent}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.05 }}
                              className={`absolute h-full bg-gradient-to-r ${phaseColors[idx % phaseColors.length]} rounded-full shadow-md cursor-pointer flex items-center justify-center`}
                              style={{ left: `${leftPercent}%` }}
                              onMouseEnter={(e) => setTooltip({ text: tooltipText, x: e.clientX, y: e.clientY - 40 })}
                              onMouseLeave={() => setTooltip(null)}>
                              {widthPercent > 8 && <span className="text-white text-xs font-medium truncate px-2">{phase.phase}</span>}
                            </motion.div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6 flex flex-wrap justify-between items-center text-xs text-gray-500 border-t pt-4 gap-4">
                    <div className="flex gap-4"><div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div><span>Durasi fase</span></div>
                    <div className="flex gap-4"><div className="w-4 h-4 bg-gray-100 rounded-full border border-gray-200"></div><span>Waktu proyek</span></div>
                    <div className="text-gray-400">* Skala waktu dalam bulan</div>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {tooltip && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg shadow-xl p-3 max-w-xs pointer-events-none"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}>
                    {tooltip.text.split('\n').map((line: string, i: number) => (
                      <p key={i} className={i === 0 ? 'font-bold mb-1' : 'text-gray-300 text-xs'}>{line}</p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* PERSONIL */}
          {selectedTab === 'personil' && (
            <PersonilOrganigram 
              project={project} 
              allPersonil={allPersonil}
              openPersonilModal={openPersonilModal} 
            />
          )}

          {/* DOKUMEN */}
          {selectedTab === 'dokumen' && (
            <motion.div key="dokumen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Arsip & Dokumen</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {project.documents?.map((doc: any, idx: number) => (
                  <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-50 p-5 rounded-xl hover:shadow-md transition group border border-gray-200 hover:border-blue-300">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><FiDownload className="text-blue-600" size={22} /></div>
                    <div><p className="font-medium text-gray-900 group-hover:text-blue-600">{doc.name}</p><p className="text-xs text-gray-400">{doc.type} • {doc.size}</p></div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RELATED PROJECTS */}
      {project.relatedProjects && project.relatedProjects.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Proyek Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.relatedProjects.map((rel: any, idx: number) => (
                <Link key={idx} href={`/projects/${rel.slug}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden"><img src={rel.image} alt={rel.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" /></div>
                    <div className="p-6"><h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{rel.title}</h3><span className="text-blue-600 text-sm inline-flex items-center gap-1 mt-2 group-hover:gap-2 transition">Lihat Detail <FiArrowLeft className="rotate-180" size={14} /></span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MODAL PERSONIL */}
      <AnimatePresence>
        {showPersonilModal && selectedPersonil && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPersonilModal(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white flex justify-between items-center">
                <h3 className="text-2xl font-bold">Detail Personil</h3>
                <button onClick={() => setShowPersonilModal(false)} className="p-2 hover:bg-white/20 rounded-full transition"><FiX size={22} /></button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-5 mb-5">
                  <img src={selectedPersonil.image} alt={selectedPersonil.nama} className="w-20 h-20 rounded-full object-cover border-4 border-blue-200" />
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{selectedPersonil.nama}</h4>
                    <p className="text-blue-600 font-medium">{selectedPersonil.posisi}</p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-600">
                  <p><span className="font-semibold text-gray-800">Telepon:</span> <a href={`tel:${selectedPersonil.noHp}`} className="text-blue-600 hover:underline">{selectedPersonil.noHp}</a></p>
                  <p><span className="font-semibold text-gray-800">Pendidikan:</span> {selectedPersonil.lulusan} ({selectedPersonil.tahunLulus})</p>
                  <p><span className="font-semibold text-gray-800">Keahlian:</span> {selectedPersonil.keahlian?.join(', ')}</p>
                  <p><span className="font-semibold text-gray-800">Deskripsi:</span> {selectedPersonil.deskripsi}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setShowPersonilModal(false)} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-300 transition">Tutup</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* BACK TO TOP */}
      <AnimatePresence>
        {showBackToTop && (
          <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all z-40">
            <FiArrowUp size={24} />
          </button>
        )}
      </AnimatePresence>
    </div>
  )
}