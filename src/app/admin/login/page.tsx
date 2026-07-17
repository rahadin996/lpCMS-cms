// src/app/admin/login/page.tsx
'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi'

export default function AdminLoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image dengan overlay tipis */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop" 
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* overlay lebih tipis agar transparan */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20" />
      </div>

      {/* Form Login Glass - super transparan */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="relative p-8 pb-0 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/40 rounded-full" />
            {/* Logo: warna asli, ukuran diperbesar h-20 */}
            <div className="flex justify-center mb-5">
              <img 
                src="/images/lppslh.png" 
                alt="LPPSLH Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">Selamat Datang</h2>
            <p className="text-white/80 text-sm mt-1">Masuk ke dashboard admin LPPSLH</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 pt-6 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-xl"
              >
                <p className="text-red-100 text-sm flex items-center gap-2"><FiShield className="inline" /> {error}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <FiMail className="text-blue-300" size={14} /> Alamat Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="nama@perusahaan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 outline-none transition-all duration-300 text-white placeholder:text-white/50"
                  required
                />
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-blue-300 transition-colors" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <FiLock className="text-purple-300" size={14} /> Kata Sandi
              </label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300 outline-none transition-all duration-300 text-white placeholder:text-white/50"
                  required
                />
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-purple-300 transition-colors" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/30 hover:-translate-y-1 disabled:opacity-60 disabled:hover:translate-y-0 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Login
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </span>
              )}
            </button>
          </form>

          <div className="p-6 pt-0 text-center border-t border-white/20 mt-2">
            <p className="text-xs text-white/60 flex items-center justify-center gap-1">
              <span>🔒</span> Area administratif terproteksi
            </p>
            <p className="text-[11px] text-white/40 mt-2">
              &copy; {new Date().getFullYear()} LPPSLH Konsultan — All rights reserved
            </p>
          </div>
        </div>

      
        
      </motion.div>
    </div>
  )
}