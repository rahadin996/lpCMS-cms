// src/app/admin/page.tsx
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { 
  FiBriefcase, FiFileText, FiBook, FiImage, FiMail, FiStar, FiUsers, 
  FiSettings, FiHome, FiMessageSquare, FiFlag, FiTool, FiVideo, 
  FiHeart, FiHelpCircle, FiSliders, FiTag, FiBarChart2, FiTrendingUp,
  FiPlus
} from 'react-icons/fi'
import { IconType } from 'react-icons'

// Dynamic import untuk DashboardCharts
const DashboardCharts = dynamic(() => import('@/components/admin/DashboardCharts'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-white/20 backdrop-blur-md rounded-3xl">
      <div className="animate-pulse text-gray-500">Memuat grafik premium...</div>
    </div>
  )
})

import SystemWorkflow from '@/components/admin/SystemWorkflow'

// ========== Type Definitions ==========
interface Stats {
  pengguna: number
  pencariKerja: number
  lowongan: number
  layananJasa: number
  produk: number
  pesan: number
  administrator: number
  services: number
  sectors: number
  projects: number
  news: number
  gallery: number
  team: number
  awards: number
}

interface PieDataItem {
  name: string
  value: number
  color: string
}

interface BarDataItem {
  name: string
  count: number
}

interface MainMenuItem {
  name: string
  icon: IconType
  path: string
  count: number
  desc: string
}

interface ContentStat {
  name: string
  count: number
  icon: IconType
  path: string
}

interface SettingStat {
  name: string
  icon: IconType
  path: string
}

// Helper untuk ambil count dengan fallback
async function getCount(supabase: SupabaseClient, table: string): Promise<number> {
  try {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
    return count || 0
  } catch {
    return 0
  }
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Statistik database
  const stats: Stats = {
    pengguna: await getCount(supabase, 'users'),
    pencariKerja: await getCount(supabase, 'job_seekers'),
    lowongan: await getCount(supabase, 'jobs'),
    layananJasa: await getCount(supabase, 'services'),
    produk: await getCount(supabase, 'products'),
    pesan: await getCount(supabase, 'contact_messages'),
    administrator: await getCount(supabase, 'admin_profiles'),
    services: await getCount(supabase, 'services'),
    sectors: await getCount(supabase, 'sectors'),
    projects: await getCount(supabase, 'projects'),
    news: await getCount(supabase, 'news'),
    gallery: await getCount(supabase, 'gallery'),
    team: await getCount(supabase, 'team'),
    awards: await getCount(supabase, 'awards'),
  }

  // Data untuk area chart
  const pieData: PieDataItem[] = [
    { name: 'Pengguna', value: stats.pengguna, color: '#3b82f6' },
    { name: 'Pencari Kerja', value: stats.pencariKerja, color: '#10b981' },
    { name: 'Lowongan', value: stats.lowongan, color: '#f59e0b' },
    { name: 'Layanan Jasa', value: stats.layananJasa, color: '#8b5cf6' },
    { name: 'Produk', value: stats.produk, color: '#ec4899' },
    { name: 'Pesan', value: stats.pesan, color: '#ef4444' },
    { name: 'Administrator', value: stats.administrator, color: '#6366f1' },
  ]

  // Data bar chart
  const barData: BarDataItem[] = [
    { name: 'Services', count: stats.services },
    { name: 'Sectors', count: stats.sectors },
    { name: 'Projects', count: stats.projects },
    { name: 'News', count: stats.news },
    { name: 'Gallery', count: stats.gallery },
    { name: 'Team', count: stats.team },
    { name: 'Awards', count: stats.awards },
    { name: 'About', count: 1 },
  ]

  // Menu utama website
  const mainMenus: MainMenuItem[] = [
    { name: 'Services', icon: FiBriefcase, path: '/admin/services', count: stats.services, desc: 'Kelola layanan' },
    { name: 'Sectors', icon: FiBook, path: '/admin/sectors', count: stats.sectors, desc: 'Kelola sektor' },
    { name: 'Projects', icon: FiBriefcase, path: '/admin/projects', count: stats.projects, desc: 'Kelola proyek' },
    { name: 'About', icon: FiFileText, path: '/admin/pages/about', count: 1, desc: 'Halaman tentang' },
    { name: 'Offices', icon: FiImage, path: '/admin/offices', count: 1, desc: 'Data kantor' },
    { name: 'News', icon: FiMail, path: '/admin/news', count: stats.news, desc: 'Berita & artikel' },
    { name: 'Careers', icon: FiBriefcase, path: '/admin/careers', count: 1, desc: 'Lowongan kerja' },
    { name: 'Gallery', icon: FiImage, path: '/admin/gallery', count: stats.gallery, desc: 'Galeri foto' },
    { name: 'Team', icon: FiUsers, path: '/admin/team', count: stats.team, desc: 'Tim personil' },
    { name: 'Awards', icon: FiStar, path: '/admin/awards', count: stats.awards, desc: 'Penghargaan' },
  ]

  const contentStats: ContentStat[] = [
    { name: 'Peraturan', count: 12, icon: FiFileText, path: '/admin/konten/peraturan' },
    { name: 'Berita', count: 29, icon: FiBook, path: '/admin/konten/berita' },
    { name: 'Tutorial', count: 20, icon: FiVideo, path: '/admin/konten/tutorial' },
    { name: 'Layanan', count: 7, icon: FiTool, path: '/admin/konten/layanan' },
    { name: 'Portfolio', count: 14, icon: FiStar, path: '/admin/konten/portfolio' },
    { name: 'Galeri', count: 8, icon: FiImage, path: '/admin/konten/galeri' },
    { name: 'FAQ', count: 29, icon: FiHelpCircle, path: '/admin/konten/faq' },
    { name: 'Testimoni', count: 3, icon: FiHeart, path: '/admin/konten/testimoni' },
    { name: 'Slide Show', count: 7, icon: FiSliders, path: '/admin/konten/slide-show' },
    { name: 'Caption Halaman', count: 4, icon: FiTag, path: '/admin/konten/caption-halaman' },
    { name: 'Slide Show Background', count: 11, icon: FiImage, path: '/admin/konten/slide-show-background' },
    { name: 'Halaman Kontak', count: 9, icon: FiMail, path: '/admin/konten/halaman-kontak' },
  ]

  const settingStats: SettingStat[] = [
    { name: 'Logo', icon: FiImage, path: '/admin/pengaturan/logo' },
    { name: 'Kontak', icon: FiMail, path: '/admin/pengaturan/kontak' },
    { name: 'Caption Halaman', icon: FiTag, path: '/admin/pengaturan/caption-halaman' },
    { name: 'Halaman Beranda', icon: FiHome, path: '/admin/pengaturan/halaman-beranda' },
    { name: 'Halaman Kontak', icon: FiMail, path: '/admin/pengaturan/halaman-kontak' },
    { name: 'Kategori Berita', icon: FiBook, path: '/admin/pengaturan/kategori-berita' },
    { name: 'Pop Up Formulir', icon: FiMessageSquare, path: '/admin/pengaturan/popup-formulir' },
    { name: 'Banner Halaman', icon: FiImage, path: '/admin/pengaturan/banner-halaman' },
    { name: 'Bidang Keahlian', icon: FiFlag, path: '/admin/pengaturan/bidang-keahlian' },
    { name: 'Bidang Lowongan', icon: FiBriefcase, path: '/admin/pengaturan/bidang-lowongan' },
    { name: 'Bidang Jasa', icon: FiSettings, path: '/admin/pengaturan/bidang-jasa' },
  ]

  return (
    <div className="space-y-8">
      {/* HEADER – GLASS PREMIUM */}
     

      {/* CHARTS: Area + Bar */}
      <DashboardCharts pieData={pieData} barData={barData} />

      {/* SISTEM WORKFLOW */}
      <SystemWorkflow />

      {/* MENU UTAMA WEBSITE */}
      <div className="bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Menu Utama Website</h2>
          <span className="text-xs text-gray-600 bg-white/60 px-3 py-1 rounded-full">{mainMenus.length} menu</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mainMenus.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/70 transition group"
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-emerald-600 group-hover:scale-110 transition" />
                <div>
                  <div className="text-sm font-medium text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-700 bg-white/60 px-2 py-1 rounded-lg">{item.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* KONTEN INTERNAL */}
      <div className="bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Konten</h2>
          <span className="text-xs text-gray-600 bg-white/60 px-3 py-1 rounded-full">Total {contentStats.reduce((acc, item) => acc + item.count, 0)}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {contentStats.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/70 transition group"
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-amber-600 group-hover:scale-110 transition" />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-700 bg-white/60 px-2 py-1 rounded-lg">{item.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* PENGATURAN */}
      <div className="bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Pengaturan</h2>
          <span className="text-xs text-gray-600 bg-white/60 px-3 py-1 rounded-full">{settingStats.length} item</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {settingStats.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/70 transition group"
            >
              <item.icon size={20} className="text-purple-600 group-hover:scale-110 transition" />
              <span className="text-sm text-gray-700">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}