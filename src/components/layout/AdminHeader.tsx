// src/components/admin/AdminHeader.tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const isActive = (path: string): boolean => {
    if (path === '/admin' && pathname === '/admin') return true
    if (path !== '/admin' && pathname.startsWith(path)) return true
    return false
  }

  const menuItems: { name: string; path: string }[] = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Settings', path: '/admin/settings' },
    { name: 'Admins', path: '/admin/admins' },
    { name: 'Messages', path: '/admin/messages' },
  ]

  async function handleLogout(): Promise<void> {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive(item.path) ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">Logout</button>
        </div>
      </div>
    </header>
  )
}