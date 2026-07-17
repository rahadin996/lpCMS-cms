// src/app/admin/pages/projects-detail/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FiPlus, FiEdit, FiTrash2, FiX, FiFileText, FiUser, FiChevronDown, FiChevronRight, FiSave, FiRefreshCw } from 'react-icons/fi'
import ImageUpload from '@/components/admin/ImageUpload'
import AdminSectionNav from '@/components/admin/AdminSectionNav'

// ========== Type Definitions ==========
interface GalleryImage {
  url: string
  title?: string
  caption?: string
  specs?: Record<string, string>
}

interface TimelinePhase {
  phase: string
  startMonth: number
  endMonth: number
  desc: string
}

interface Project {
  id: number
  title: string
  slug: string
  category: string
  province: string
  city: string
  year: number
  image: string
  description: string
  progress: number
  status: 'ongoing' | 'completed'
  client: string
  value: string
  service: string
  lat: number
  lng: number
  detail_data?: ProjectDetailData
}

interface ProjectDetailData {
  fullDesc?: string
  images?: GalleryImage[]
  timeline?: TimelinePhase[]
  documents?: { name: string; url: string; type?: string; size?: string }[]
  organigramRoles?: Record<string, string>
  personilIds?: number[]
  relatedProjects?: { slug: string; title: string; image: string }[]
}

interface Personil {
  id: number
  nama: string
  posisi: string
  image: string
  noHp?: string
  lulusan?: string
  tahunLulus?: number
  deskripsi?: string
  keahlian?: string[]
}

interface Role {
  id: number
  name: string
  label: string
  position_order: number
}

type ProjectFormData = Omit<Project, 'id' | 'detail_data'>

interface Message {
  text: string
  type: 'success' | 'error' | ''
}

const DEFAULT_IMAGE: GalleryImage = {
  url: '',
  title: '',
  caption: '',
  specs: {}
}

const DEFAULT_DETAIL: ProjectDetailData = {
  fullDesc: '',
  images: [],
  timeline: [],
  documents: [],
  organigramRoles: {},
  personilIds: [],
  relatedProjects: []
}

// ========== KOMPONEN PREVIEW ORGANIGRAM ==========
const OrganigramPreview = ({ rolesMap, personilList, roleLabels }: {
  rolesMap: Record<string, string>
  personilList: Personil[]
  roleLabels: Record<string, string>
}) => {
  const [hoveredPerson, setHoveredPerson] = useState<Personil | null>(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  const getPersonilByPos = (pos: string) => personilList.find(p => p.posisi === pos) || null

  const projectManager = getPersonilByPos(rolesMap.projectManager || '')
  const gisConsultant = getPersonilByPos(rolesMap.gisConsultant || '')
  const gisSpecialist = getPersonilByPos(rolesMap.gisSpecialist || '')
  const environmental = getPersonilByPos(rolesMap.environmental || '')
  const qaQc = getPersonilByPos(rolesMap.qaQc || '')
  const k3 = getPersonilByPos(rolesMap.k3 || '')

  const handleMouseEnter = (e: React.MouseEvent, person: Personil) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setPopupPosition({ x: rect.right + 15, y: rect.top })
    setHoveredPerson(person)
  }
  const handleMouseLeave = () => setHoveredPerson(null)

  const OrgBox = ({ title, color = 'slate', children }: { title: string; color?: string; children: React.ReactNode }) => {
    const colorMap: Record<string, string> = { slate: 'bg-slate-700', amber: 'bg-amber-600', emerald: 'bg-emerald-600', indigo: 'bg-indigo-600' }
    return (
      <div className="relative border border-slate-200 rounded-2xl bg-white shadow-sm p-4 h-full flex flex-col">
        <div className={`${colorMap[color]} text-white text-xs font-semibold rounded-full py-2 px-3 text-center shadow-sm tracking-wide`}>{title}</div>
        <div className="flex-1 space-y-2 mt-3">{children}</div>
      </div>
    )
  }

  const OrgMember = ({ person, placeholder }: { person?: Personil | null; placeholder?: boolean }) => {
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
        onMouseEnter={(e) => handleMouseEnter(e, person)}
        onMouseLeave={handleMouseLeave}
        className="flex items-center gap-2 bg-slate-800 text-white rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-700 transition-all shadow-sm"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
          {person.image ? <img src={person.image} alt={person.nama} className="w-full h-full rounded-full object-cover" /> : '👤'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold leading-tight truncate">{person.posisi}</div>
          <div className="text-[9px] opacity-80 truncate">{person.nama}</div>
        </div>
      </div>
    )
  }

  const hasRoles = Object.values(rolesMap).some(v => v)

  if (!hasRoles) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400 border-2 border-dashed border-gray-300">
        <p>Belum ada peran yang ditentukan. Silakan isi peran di atas untuk melihat pratinjau organigram.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm mt-4 relative">
      <div className="text-center mb-4">
        <h4 className="text-lg font-bold text-slate-800">Pratinjau Struktur Organisasi</h4>
        <p className="text-xs text-slate-500">Arahkan kursor ke personil untuk melihat detail</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 overflow-x-auto">
        <div className="relative mx-auto" style={{ minWidth: '750px' }}>
          {/* Project Manager */}
          <div className="flex justify-center mb-12">
            <div className="w-64 text-center relative">
              <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold text-sm rounded-full py-2 shadow-md">
                {roleLabels.projectManager || 'PROJECT MANAGER'}
              </div>
              <div className="mt-2"><OrgMember person={projectManager} placeholder={!projectManager} /></div>
            </div>
          </div>

          <div className="relative h-8"><div className="absolute left-1/2 top-0 w-0.5 h-full bg-slate-400 -translate-x-1/2" /></div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <OrgBox title={roleLabels.projectManager || 'ENGINEERING & PLANNING'} color="emerald">
              <OrgMember person={projectManager} placeholder={!projectManager} />
            </OrgBox>
            <OrgBox title={roleLabels.gisConsultant || 'GIS & PEMETAAN'} color="emerald">
              {gisConsultant && <OrgMember person={gisConsultant} />}
              {gisSpecialist && <OrgMember person={gisSpecialist} />}
              {!gisConsultant && !gisSpecialist && <OrgMember placeholder />}
            </OrgBox>
            <OrgBox title={roleLabels.environmental || 'LINGKUNGAN & AMDAL'} color="emerald">
              <OrgMember person={environmental} placeholder={!environmental} />
            </OrgBox>
            <OrgBox title={roleLabels.qaQc || 'QA/QC & K3'} color="emerald">
              {qaQc && <OrgMember person={qaQc} />}
              {k3 && <OrgMember person={k3} />}
              {!qaQc && !k3 && <OrgMember placeholder />}
            </OrgBox>
          </div>

          <div className="relative h-8">
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-slate-400 -translate-x-1/2" />
            <div className="absolute left-[12.5%] right-[12.5%] top-0 h-0.5 bg-slate-400" />
            <div className="absolute left-1/2 top-0 w-0.5 h-8 bg-slate-400 -translate-x-1/2" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <OrgBox title="ADMINISTRASI & KEUANGAN" color="indigo"><OrgMember placeholder /></OrgBox>
            <OrgBox title="DOKUMENTASI & REPORTING" color="indigo"><OrgMember placeholder /></OrgBox>
            <OrgBox title="LOGISTIK & PENGADAAN" color="indigo"><OrgMember placeholder /></OrgBox>
          </div>

          <div className="relative h-8">
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-slate-400 -translate-x-1/2" />
            <div className="absolute left-[35%] right-[35%] top-0 h-0.5 bg-slate-400" />
            <div className="absolute left-1/2 top-0 w-0.5 h-8 bg-slate-400 -translate-x-1/2" />
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md"><OrgBox title="STAFF LAPANGAN / SITE INSPECTOR" color="indigo"><OrgMember placeholder /></OrgBox></div>
          </div>

          <div className="text-center mt-6 text-xs font-semibold tracking-wide text-slate-400 border-t border-slate-100 pt-4">STRUKTUR ORGANISASI – PREVIEW</div>
        </div>
      </div>

      {hoveredPerson && (
        <div className="fixed z-50 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 p-4 pointer-events-none" style={{ left: popupPosition.x, top: popupPosition.y }}>
          <div className="flex gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
              {hoveredPerson.image ? <img src={hoveredPerson.image} alt="" className="w-full h-full rounded-full object-cover" /> : '👤'}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">{hoveredPerson.nama}</h4>
              <p className="text-indigo-600 text-xs font-semibold">{hoveredPerson.posisi}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            <p><span className="font-medium">ID:</span> {hoveredPerson.id}</p>
            {hoveredPerson.keahlian && hoveredPerson.keahlian.length > 0 && (
              <p><span className="font-medium">Keahlian:</span> {hoveredPerson.keahlian.join(', ')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ========== NAV ITEMS UNTUK SIDEBAR DI MODAL DETAIL ==========
const detailNavItems = [
  { key: 'deskripsi', label: '📝 Deskripsi' },
  { key: 'galeri', label: '🖼️ Galeri' },
  { key: 'timeline', label: '📊 Timeline' },
  { key: 'organigram', label: '🧑‍💼 Organigram' },
  { key: 'dokumen', label: '📄 Dokumen' },
  { key: 'related', label: '🔗 Proyek Terkait' },
]

// ========== MAIN COMPONENT ==========
export default function ProjectsDetailList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [personilList, setPersonilList] = useState<Personil[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [message, setMessage] = useState<Message>({ text: '', type: '' })
  const [showModal, setShowModal] = useState<boolean>(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    title: '', slug: '', category: '', province: '', city: '', year: new Date().getFullYear(),
    image: '', description: '', progress: 0, status: 'ongoing', client: '', value: '', service: '',
    lat: -2.5489, lng: 118.0149
  })

  // Modal Detail
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [detailForm, setDetailForm] = useState<ProjectDetailData>({ ...DEFAULT_DETAIL })
  const [savingDetail, setSavingDetail] = useState<boolean>(false)
  const [detailActiveSection, setDetailActiveSection] = useState<string>('deskripsi')

  // Modal Personil
  const [showPersonilModal, setShowPersonilModal] = useState<boolean>(false)
  const [personilForm, setPersonilForm] = useState<{ nama: string; posisi: string; image: string }>({
    nama: '',
    posisi: '',
    image: ''
  })
  const [savingPersonil, setSavingPersonil] = useState<boolean>(false)

  // Modal Role
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false)
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null)
  const [roleForm, setRoleForm] = useState<{ name: string; label: string }>({ name: '', label: '' })
  const [savingRole, setSavingRole] = useState<boolean>(false)

  const supabase = createClient()

  const fetchProjects = async (): Promise<void> => {
    const { data, error } = await supabase
      .from('project_porto')
      .select('*')
      .order('id', { ascending: true })
    if (error) {
      setMessage({ text: 'Gagal memuat data: ' + error.message, type: 'error' })
    } else {
      setProjects(data as Project[] || [])
    }
    setLoading(false)
  }

  const fetchPersonil = async (): Promise<void> => {
    const { data, error } = await supabase
      .from('personil')
      .select('*')
      .order('id', { ascending: true })
    if (!error && data) {
      setPersonilList(data as Personil[])
      console.log('✅ Personil loaded:', data.length)
    }
  }

  const fetchRoles = async (): Promise<void> => {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('position_order', { ascending: true })
    if (!error && data) {
      setRoles(data as Role[])
      console.log('✅ Roles loaded:', data.length)
    }
  }

  const resetForm = (): void => {
    setProjectForm({
      title: '', slug: '', category: '', province: '', city: '', year: new Date().getFullYear(),
      image: '', description: '', progress: 0, status: 'ongoing', client: '', value: '', service: '',
      lat: -2.5489, lng: 118.0149
    })
    setEditingProject(null)
  }

  const generateSlug = (text: string): string => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const saveProject = async (): Promise<void> => {
    const slug = projectForm.slug.trim() || generateSlug(projectForm.title)
    const dataToSave = { ...projectForm, slug }
    let error: any
    if (editingProject) {
      const { error: e } = await supabase
        .from('project_porto')
        .update(dataToSave)
        .eq('id', editingProject.id)
      error = e
    } else {
      const { error: e } = await supabase
        .from('project_porto')
        .insert(dataToSave)
      error = e
    }
    if (error) {
      setMessage({ text: '❌ Gagal simpan: ' + error.message, type: 'error' })
    } else {
      setMessage({ text: '✅ Proyek berhasil disimpan', type: 'success' })
      fetchProjects()
      setShowModal(false)
      resetForm()
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    }
  }

  const deleteProject = async (id: number): Promise<void> => {
    if (!confirm('Yakin hapus proyek ini?')) return
    const { error } = await supabase.from('project_porto').delete().eq('id', id)
    if (error) {
      setMessage({ text: '❌ Gagal hapus: ' + error.message, type: 'error' })
    } else {
      setMessage({ text: '✅ Proyek dihapus', type: 'success' })
      fetchProjects()
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    }
  }

  // ========== CRUD PERSONIL ==========
  const savePersonil = async () => {
    if (!personilForm.nama || !personilForm.posisi) {
      alert('Nama dan Posisi wajib diisi')
      return
    }
    setSavingPersonil(true)
    const { error } = await supabase
      .from('personil')
      .insert({
        nama: personilForm.nama,
        posisi: personilForm.posisi,
        image: personilForm.image || 'https://via.placeholder.com/100'
      })
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      await fetchPersonil()
      setShowPersonilModal(false)
      setPersonilForm({ nama: '', posisi: '', image: '' })
      alert('✅ Personil berhasil ditambahkan!')
    }
    setSavingPersonil(false)
  }

  // ========== CRUD ROLE ==========
  const openRoleModal = (role?: Role) => {
    if (role) {
      setEditingRoleId(role.id)
      setRoleForm({ name: role.name, label: role.label })
    } else {
      setEditingRoleId(null)
      setRoleForm({ name: '', label: '' })
    }
    setShowRoleModal(true)
  }

  const saveRole = async () => {
    if (!roleForm.name || !roleForm.label) {
      alert('Nama dan Label wajib diisi')
      return
    }
    setSavingRole(true)

    const newName = roleForm.name.trim().toLowerCase().replace(/\s+/g, '')

    const { data: existing } = await supabase
      .from('roles')
      .select('id')
      .eq('name', newName)
      .maybeSingle()

    if (existing && existing.id !== editingRoleId) {
      alert('Nama role sudah digunakan!')
      setSavingRole(false)
      return
    }

    if (editingRoleId) {
      const { error } = await supabase
        .from('roles')
        .update({ name: newName, label: roleForm.label.trim() })
        .eq('id', editingRoleId)
      if (error) {
        alert('Gagal: ' + error.message)
      } else {
        await fetchRoles()
        setShowRoleModal(false)
        alert('✅ Role berhasil diperbarui!')
      }
    } else {
      const { error } = await supabase
        .from('roles')
        .insert({
          name: newName,
          label: roleForm.label.trim(),
          position_order: roles.length
        })
      if (error) {
        alert('Gagal: ' + error.message)
      } else {
        await fetchRoles()
        setShowRoleModal(false)
        alert('✅ Role berhasil ditambahkan!')
      }
    }
    setSavingRole(false)
  }

  const deleteRole = async (id: number, name: string) => {
    const { data: allProjects } = await supabase
      .from('project_porto')
      .select('title, detail_data')
    const usedIn = allProjects?.filter(p => p.detail_data?.organigramRoles?.[name]) || []

    if (usedIn.length > 0) {
      alert(`Role "${name}" masih digunakan di proyek: ${usedIn.map(p => p.title).join(', ')}. Hapus terlebih dahulu dari proyek tersebut.`)
      return
    }

    if (!confirm(`Hapus role "${name}"?`)) return
    const { error } = await supabase.from('roles').delete().eq('id', id)
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      await fetchRoles()
      alert('✅ Role berhasil dihapus!')
    }
  }

  // ========== HANDLER DETAIL ==========
  const openDetailModal = async (project: Project) => {
    await fetchPersonil()
    await fetchRoles()
    setDetailProject(project)
    const raw = project.detail_data || {}
    const images = (raw.images || []).map((img: any) =>
      typeof img === 'string' ? { ...DEFAULT_IMAGE, url: img } : { ...DEFAULT_IMAGE, ...img }
    )
    setDetailForm({ ...DEFAULT_DETAIL, ...raw, images })
    setDetailActiveSection('deskripsi')
    setShowDetailModal(true)
  }

  const saveDetail = async () => {
    if (!detailProject) return
    setSavingDetail(true)
    const { error } = await supabase
      .from('project_porto')
      .update({ detail_data: detailForm })
      .eq('id', detailProject.id)
    if (error) {
      setMessage({ text: '❌ Gagal simpan detail: ' + error.message, type: 'error' })
    } else {
      setMessage({ text: '✅ Detail proyek disimpan', type: 'success' })
      fetchProjects()
      setShowDetailModal(false)
    }
    setSavingDetail(false)
    setTimeout(() => setMessage({ text: '', type: '' }), 2000)
  }

  // ========== HELPERS ==========
  const updateDetailField = (field: keyof ProjectDetailData, value: any) => {
    setDetailForm(prev => ({ ...prev, [field]: value }))
  }

  // -- Images (Gallery) --
  const addImage = () => updateDetailField('images', [...(detailForm.images || []), { ...DEFAULT_IMAGE }])
  const updateImage = (index: number, field: keyof GalleryImage, value: any) => {
    const images = [...(detailForm.images || [])]
    images[index] = { ...images[index], [field]: value }
    updateDetailField('images', images)
  }
  const removeImage = (index: number) => updateDetailField('images', (detailForm.images || []).filter((_, i) => i !== index))

  const addSpec = (imgIndex: number, key: string, value: string) => {
    const images = [...(detailForm.images || [])]
    const currentSpecs = images[imgIndex].specs || {}
    images[imgIndex].specs = { ...currentSpecs, [key]: value }
    updateDetailField('images', images)
  }
  const removeSpec = (imgIndex: number, key: string) => {
    const images = [...(detailForm.images || [])]
    const currentSpecs = images[imgIndex].specs || {}
    delete currentSpecs[key]
    images[imgIndex].specs = { ...currentSpecs }
    updateDetailField('images', images)
  }

  // -- Timeline --
  const addTimelinePhase = () => updateDetailField('timeline', [...(detailForm.timeline || []), { phase: '', startMonth: 0, endMonth: 0, desc: '' }])
  const updateTimelinePhase = (index: number, field: keyof TimelinePhase, value: any) => {
    const timeline = [...(detailForm.timeline || [])]
    ;(timeline[index] as any)[field] = value
    updateDetailField('timeline', timeline)
  }
  const removeTimelinePhase = (index: number) => updateDetailField('timeline', (detailForm.timeline || []).filter((_, i) => i !== index))

  // -- Documents --
  const addDocument = () => updateDetailField('documents', [...(detailForm.documents || []), { name: '', url: '' }])
  const updateDocument = (index: number, field: string, value: string) => {
    const docs = [...(detailForm.documents || [])]
    ;(docs as any)[index][field] = value
    updateDetailField('documents', docs)
  }
  const removeDocument = (index: number) => updateDetailField('documents', (detailForm.documents || []).filter((_, i) => i !== index))

  // -- Related Projects --
  const addRelated = () => updateDetailField('relatedProjects', [...(detailForm.relatedProjects || []), { slug: '', title: '', image: '' }])
  const updateRelated = (index: number, field: string, value: string) => {
    const rels = [...(detailForm.relatedProjects || [])]
    ;(rels as any)[index][field] = value
    updateDetailField('relatedProjects', rels)
  }
  const removeRelated = (index: number) => updateDetailField('relatedProjects', (detailForm.relatedProjects || []).filter((_, i) => i !== index))

  // -- Organigram Roles --
  const updateRole = (roleName: string, value: string) => {
    const currentRoles = detailForm.organigramRoles || {}
    const newRoles = { ...currentRoles }
    if (value) {
      newRoles[roleName] = value
    } else {
      delete newRoles[roleName]
    }
    updateDetailField('organigramRoles', newRoles)
  }

  const updatePersonilIds = (ids: string) => {
    const parsed = ids.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
    updateDetailField('personilIds', parsed)
  }

  const getRoleLabel = (name: string): string => {
    const role = roles.find(r => r.name === name)
    return role ? role.label : name.replace(/([A-Z])/g, ' $1').trim()
  }

  useEffect(() => {
    console.log('📋 Detail Form OrganigramRoles:', detailForm.organigramRoles)
  }, [detailForm.organigramRoles])

  useEffect(() => {
    fetchProjects()
    fetchPersonil()
    fetchRoles()
  }, [])

  if (loading) return <div className="p-8 text-center">Memuat data proyek...</div>

  // ========== RENDER DETAIL SECTION ==========
  const renderDetailSection = () => {
    switch (detailActiveSection) {
      case 'deskripsi':
        return (
          <div>
            <label className="block font-semibold mb-1">Deskripsi Lengkap</label>
            <textarea value={detailForm.fullDesc || ''} onChange={e => updateDetailField('fullDesc', e.target.value)} rows={6} className="w-full border rounded-lg p-3" placeholder="Deskripsi lengkap proyek..." />
          </div>
        )

      case 'galeri':
        return (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Galeri Proyek</h3>
              <button onClick={addImage} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                <FiPlus /> Tambah Gambar
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Kelola gambar untuk tab <strong>Galeri</strong> di halaman proyek. Gambar pertama & kedua akan muncul di samping deskripsi.
            </p>
            {(detailForm.images || []).length === 0 ? (
              <div className="text-center py-4 text-gray-400">Belum ada gambar. Klik "Tambah Gambar".</div>
            ) : (
              (detailForm.images || []).map((img, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 mb-3 shadow-sm border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">Gambar {idx + 1}</span>
                    <button onClick={() => removeImage(idx)} className="text-red-500 hover:text-red-700 text-sm">
                      <FiTrash2 /> Hapus
                    </button>
                  </div>
                  <div className="space-y-2">
                    <ImageUpload bucket="service-images" path={`projects/${detailProject?.slug}`} value={img.url} onChange={url => updateImage(idx, 'url', url)} label="URL Gambar" />
                    <input placeholder="Judul gambar" value={img.title || ''} onChange={e => updateImage(idx, 'title', e.target.value)} className="w-full border rounded p-2" />
                    <input placeholder="Caption (deskripsi singkat)" value={img.caption || ''} onChange={e => updateImage(idx, 'caption', e.target.value)} className="w-full border rounded p-2" />
                    <div>
                      <label className="text-sm font-medium">Spesifikasi</label>
                      {img.specs && Object.entries(img.specs).map(([key, val], sIdx) => (
                        <div key={sIdx} className="flex gap-2 mt-1 items-center">
                          <input placeholder="Kunci" value={key} onChange={e => {
                            const newKey = e.target.value
                            const newVal = val
                            removeSpec(idx, key)
                            addSpec(idx, newKey, newVal)
                          }} className="border rounded p-1 w-1/3" />
                          <input placeholder="Nilai" value={val} onChange={e => addSpec(idx, key, e.target.value)} className="border rounded p-1 flex-1" />
                          <button onClick={() => removeSpec(idx, key)} className="text-red-500"><FiTrash2 size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => addSpec(idx, '', '')} className="text-blue-600 text-xs mt-1">+ Tambah Spesifikasi</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )

      case 'timeline':
        return (
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold">Timeline (Gantt Chart)</label>
              <button onClick={addTimelinePhase} className="text-blue-600 text-sm"><FiPlus className="inline" /> Tambah Fase</button>
            </div>
            <p className="text-xs text-gray-500 mb-2">Tentukan fase-fase proyek dengan bulan mulai dan selesai (dalam angka, misal 0-12).</p>
            {(detailForm.timeline || []).map((phase, idx) => (
              <div key={idx} className="border rounded-lg p-3 mb-2 bg-gray-50">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input placeholder="Nama Fase" value={phase.phase} onChange={e => updateTimelinePhase(idx, 'phase', e.target.value)} className="border rounded p-2" />
                  <input placeholder="Deskripsi" value={phase.desc} onChange={e => updateTimelinePhase(idx, 'desc', e.target.value)} className="border rounded p-2" />
                  <div>
                    <label className="text-xs text-gray-500">Bulan Mulai</label>
                    <input type="number" step="0.5" value={phase.startMonth} onChange={e => updateTimelinePhase(idx, 'startMonth', parseFloat(e.target.value))} className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Bulan Selesai</label>
                    <input type="number" step="0.5" value={phase.endMonth} onChange={e => updateTimelinePhase(idx, 'endMonth', parseFloat(e.target.value))} className="w-full border rounded p-2" />
                  </div>
                </div>
                <button onClick={() => removeTimelinePhase(idx)} className="text-red-500 text-sm">Hapus Fase</button>
              </div>
            ))}
          </div>
        )

      case 'organigram':
        return (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">🧑‍💼 Organigram & Personil</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openRoleModal()}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                >
                  <FiPlus /> Tambah Role
                </button>
                <button
                  onClick={() => { fetchRoles(); }}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-300 transition"
                  title="Refresh daftar role"
                >
                  <FiRefreshCw size={14} /> Refresh
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Pilih <strong>personil</strong> dari dropdown untuk setiap role. Role yang sudah dipilih akan muncul di preview organigram di bawah.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {roles.map(role => {
                const currentValue = (detailForm.organigramRoles || {})[role.name] || ''
                const selectedPersonil = personilList.find(p => p.posisi === currentValue)
                return (
                  <div key={`role-${role.id}`} className="flex flex-col border-b pb-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">{role.label}</label>
                      <div className="flex gap-1">
                        <button onClick={() => openRoleModal(role)} className="text-blue-500 hover:text-blue-700 text-xs" title="Edit role ini"><FiEdit size={14} /></button>
                        <button onClick={() => deleteRole(role.id, role.name)} className="text-red-500 hover:text-red-700 text-xs" title="Hapus role ini"><FiTrash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={currentValue}
                        onChange={(e) => updateRole(role.name, e.target.value)}
                        className="border rounded p-2 w-full"
                      >
                        <option value="">-- Pilih Personil --</option>
                        {personilList.map(p => (
                          <option key={p.id} value={p.posisi}>
                            {p.nama} – {p.posisi}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedPersonil && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-600">✅ Terpilih: {selectedPersonil.nama}</span>
                        <button onClick={() => updateRole(role.name, '')} className="text-xs text-red-500 hover:underline">Hapus</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {roles.length === 0 && <p className="text-gray-400 text-sm text-center py-2">Belum ada role. Klik "Tambah Role" untuk membuat.</p>}

            <button onClick={() => { setPersonilForm({ nama: '', posisi: '', image: '' }); setShowPersonilModal(true) }} className="mt-2 text-blue-600 text-sm hover:underline flex items-center gap-1">
              <FiPlus size={14} /> Tambah Personil Baru
            </button>

            <div className="mt-3">
              <label className="text-sm font-medium block mb-1">ID Personil (pisahkan koma) – untuk referensi tambahan</label>
              <input
                value={(detailForm.personilIds || []).join(', ')}
                onChange={e => updatePersonilIds(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="1, 2, 5"
              />
            </div>

            <OrganigramPreview
              key={JSON.stringify(detailForm.organigramRoles)}
              rolesMap={detailForm.organigramRoles || {}}
              personilList={personilList}
              roleLabels={Object.fromEntries(roles.map(r => [r.name, r.label]))}
            />
          </div>
        )

      case 'dokumen':
        return (
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold">Dokumen</label>
              <button onClick={addDocument} className="text-blue-600 text-sm"><FiPlus className="inline" /> Tambah</button>
            </div>
            {(detailForm.documents || []).map((doc, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input value={doc.name} onChange={e => updateDocument(idx, 'name', e.target.value)} placeholder="Nama dokumen" className="border rounded p-2 flex-1" />
                <input value={doc.url} onChange={e => updateDocument(idx, 'url', e.target.value)} placeholder="URL" className="border rounded p-2 flex-1" />
                <button onClick={() => removeDocument(idx)} className="text-red-500"><FiTrash2 /></button>
              </div>
            ))}
          </div>
        )

      case 'related':
        return (
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold">Proyek Terkait</label>
              <button onClick={addRelated} className="text-blue-600 text-sm"><FiPlus className="inline" /> Tambah</button>
            </div>
            {(detailForm.relatedProjects || []).map((rel, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input value={rel.slug} onChange={e => updateRelated(idx, 'slug', e.target.value)} placeholder="Slug" className="border rounded p-2 w-1/3" />
                <input value={rel.title} onChange={e => updateRelated(idx, 'title', e.target.value)} placeholder="Judul" className="border rounded p-2 flex-1" />
                <ImageUpload bucket="service-images" path="related" value={rel.image} onChange={url => updateRelated(idx, 'image', url)} label="Gambar" />
                <button onClick={() => removeRelated(idx)} className="text-red-500"><FiTrash2 /></button>
              </div>
            ))}
          </div>
        )

      default:
        return <p>Pilih section di sidebar</p>
    }
  }

  // ========== RENDER ==========
  return (
    <div className="p-28 w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">📁 Kelola Data Proyek (project_porto)</h1>
          <p className="text-sm text-gray-500">Data ini juga bisa dikelola langsung dari halaman <strong>Edit Projects</strong> (section Data Proyek).</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true) }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
          <FiPlus /> Tambah Proyek
        </button>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* TABEL */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Lokasi</th>
              <th className="p-3 text-left">Tahun</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  Belum ada proyek.
                </td>
              </tr>
            ) : (
              projects.map((proj) => (
                <tr key={proj.id} className="border-t">
                  <td className="p-3 font-medium">{proj.title}</td>
                  <td className="p-3 text-gray-500">{proj.category}</td>
                  <td className="p-3 text-gray-500">{proj.city}, {proj.province}</td>
                  <td className="p-3 text-gray-500">{proj.year}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${proj.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {proj.status === 'completed' ? 'Selesai' : 'Berjalan'}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => openDetailModal(proj)} className="text-indigo-600 hover:text-indigo-800" title="Edit Detail">
                      <FiFileText size={18} />
                    </button>
                    <button onClick={() => { setEditingProject(proj); setProjectForm(proj); setShowModal(true) }} className="text-blue-600 hover:text-blue-800">
                      <FiEdit size={18} />
                    </button>
                    <button onClick={() => deleteProject(proj.id)} className="text-red-600 hover:text-red-800">
                      <FiTrash2 size={18} />
                    </button>
                    <Link href={`/projects/${proj.slug}`} target="_blank" className="inline-block ml-2 text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">
                      Lihat Publik
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL TAMBAH/EDIT PROYEK */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingProject ? 'Edit Proyek' : 'Tambah Proyek'}</h3>
              <button onClick={() => setShowModal(false)}><FiX size={24} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* ... form yang sudah ada ... */}
              <input placeholder="Judul" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} className="border rounded p-2" />
              <input placeholder="Slug (kosongkan otomatis)" value={projectForm.slug} onChange={e => setProjectForm({ ...projectForm, slug: e.target.value })} className="border rounded p-2" />
              <select value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value })} className="border rounded p-2">
                <option value="">Pilih Kategori</option>
                <option value="infrastructure">Infrastructure</option><option value="urban">Urban</option><option value="engineering">Engineering</option>
                <option value="energy">Energy</option><option value="conservation">Conservation</option><option value="tourism">Tourism</option>
                <option value="environment">Environment</option><option value="technology">Technology</option><option value="water">Water</option>
              </select>
              <input placeholder="Provinsi" value={projectForm.province} onChange={e => setProjectForm({ ...projectForm, province: e.target.value })} className="border rounded p-2" />
              <input placeholder="Kota" value={projectForm.city} onChange={e => setProjectForm({ ...projectForm, city: e.target.value })} className="border rounded p-2" />
              <input type="number" placeholder="Tahun" value={projectForm.year} onChange={e => setProjectForm({ ...projectForm, year: parseInt(e.target.value, 10) })} className="border rounded p-2" />
              <div className="col-span-2"><ImageUpload bucket="service-images" path="projects" value={projectForm.image} onChange={url => setProjectForm({ ...projectForm, image: url })} label="Gambar Utama" /></div>
              <textarea placeholder="Deskripsi Singkat" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} rows={2} className="border rounded p-2 col-span-2" />
              <input type="number" placeholder="Progress (0-100)" value={projectForm.progress} onChange={e => setProjectForm({ ...projectForm, progress: parseInt(e.target.value, 10) })} className="border rounded p-2" />
              <select value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value as 'ongoing' | 'completed' })} className="border rounded p-2">
                <option value="ongoing">Berjalan</option>
                <option value="completed">Selesai</option>
              </select>
              <input placeholder="Klien" value={projectForm.client} onChange={e => setProjectForm({ ...projectForm, client: e.target.value })} className="border rounded p-2" />
              <input placeholder="Nilai (Rp)" value={projectForm.value} onChange={e => setProjectForm({ ...projectForm, value: e.target.value })} className="border rounded p-2" />
              <input placeholder="Layanan" value={projectForm.service} onChange={e => setProjectForm({ ...projectForm, service: e.target.value })} className="border rounded p-2" />

              <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">📍 Koordinat (Latitude, Longitude)</label>
                <p className="text-xs text-gray-500 mb-2">Untuk peta sebaran proyek.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500">Latitude</label><input type="number" step="any" placeholder="-6.2088" value={projectForm.lat} onChange={e => setProjectForm({ ...projectForm, lat: parseFloat(e.target.value) })} className="w-full border rounded p-2" /></div>
                  <div><label className="text-xs text-gray-500">Longitude</label><input type="number" step="any" placeholder="106.8456" value={projectForm.lng} onChange={e => setProjectForm({ ...projectForm, lng: parseFloat(e.target.value) })} className="w-full border rounded p-2" /></div>
                </div>
              </div>
            </div>
            <button onClick={saveProject} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg w-full">Simpan Proyek</button>
          </div>
        </div>
      )}

      {/* ========== MODAL DETAIL PROYEK DENGAN SIDEBAR ========== */}
      {showDetailModal && detailProject && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">📝 Detail Proyek: {detailProject.title}</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><FiX size={24} /></button>
            </div>

            {/* BODY: SIDEBAR + KONTEN */}
            <div className="flex flex-col md:flex-row h-[calc(90vh-70px)]">
              {/* SIDEBAR NAVIGASI - VERTIKAL */}
              <div className="w-full md:w-56 bg-gray-50 p-3 border-r border-gray-200 flex-shrink-0 overflow-y-auto">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Navigasi</h4>
                <div className="space-y-1">
                  {detailNavItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setDetailActiveSection(item.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        detailActiveSection === item.key
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={saveDetail}
                    disabled={savingDetail}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                  >
                    <FiSave size={16} /> {savingDetail ? 'Menyimpan...' : 'Simpan Semua'}
                  </button>
                </div>
              </div>

              {/* KONTEN */}
              <div className="flex-1 p-6 overflow-y-auto">
                {renderDetailSection()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL TAMBAH PERSONIL ========== */}
      {showPersonilModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPersonilModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">➕ Tambah Personil Baru</h3>
              <button onClick={() => setShowPersonilModal(false)}><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nama *</label>
                <input
                  value={personilForm.nama}
                  onChange={e => setPersonilForm({ ...personilForm, nama: e.target.value })}
                  className="w-full border rounded p-2"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Posisi / Jabatan *</label>
                <input
                  value={personilForm.posisi}
                  onChange={e => setPersonilForm({ ...personilForm, posisi: e.target.value })}
                  className="w-full border rounded p-2"
                  placeholder="Contoh: GIS Consultant, Project Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Foto (opsional)</label>
                <ImageUpload
                  bucket="service-images"
                  path="personil"
                  value={personilForm.image}
                  onChange={url => setPersonilForm({ ...personilForm, image: url })}
                  label="Upload Foto"
                />
              </div>
              <button
                onClick={savePersonil}
                disabled={savingPersonil}
                className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transition disabled:opacity-50"
              >
                {savingPersonil ? 'Menyimpan...' : '💾 Simpan Personil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL TAMBAH / EDIT ROLE ========== */}
      {showRoleModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowRoleModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingRoleId ? '✏️ Edit Role' : '➕ Tambah Role Baru'}</h3>
              <button onClick={() => setShowRoleModal(false)}><FiX size={24} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Role (identifier) *</label>
                <input
                  value={roleForm.name}
                  onChange={e => setRoleForm({ ...roleForm, name: e.target.value.trim().toLowerCase().replace(/\s+/g, '') })}
                  className="w-full border rounded p-2"
                  placeholder="Contoh: projectManager, gisConsultant"
                />
                <p className="text-xs text-gray-400 mt-1">Huruf kecil tanpa spasi, misal: 'siteInspector'</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Label (tampilan) *</label>
                <input
                  value={roleForm.label}
                  onChange={e => setRoleForm({ ...roleForm, label: e.target.value })}
                  className="w-full border rounded p-2"
                  placeholder="Contoh: Project Manager, Site Inspector"
                />
              </div>
              <button
                onClick={saveRole}
                disabled={savingRole}
                className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transition disabled:opacity-50"
              >
                {savingRole ? 'Menyimpan...' : editingRoleId ? '💾 Simpan Perubahan' : '💾 Simpan Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}