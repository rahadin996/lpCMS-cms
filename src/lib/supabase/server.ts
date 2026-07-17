  // src/lib/supabase/server.ts
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  import type { CookieOptions } from '@supabase/ssr'  // Import tipe dari Supabase

  // Jika sudah generate tipe, import Database
  // import type { Database } from '@/types/supabase'

  // Definisikan tipe untuk item cookie (jika tidak menggunakan CookieOptions dari @supabase/ssr)
  // type CookieItem = { name: string; value: string; options?: CookieOptions }

  export const createClient = async () => {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
    }
    if (!supabaseAnonKey) {
      throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }

    // Jika pakai tipe Database, tambahkan <Database> setelah createServerClient
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // Perbaikan: tambahkan tipe untuk parameter cookiesToSet
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Jika dipanggil di Server Component, ignore setAll karena tidak bisa set cookie di Server Component
            // Ini normal untuk Server Component yang read-only
          }
        },
      },
    })
  }