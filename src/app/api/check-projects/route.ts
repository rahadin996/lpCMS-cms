// src/app/api/check-projects/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Paksa dynamic rendering (karena pakai cookies)
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {
            // GET request tidak perlu set cookie
          },
        },
      }
    )
    
    // Ambil semua proyek
    const { data: projects, error: projectsError } = await supabase
      .from('project_porto')
      .select('*')
      .order('id', { ascending: true })
    
    // Ambil konten dari page_contents (halaman projects)
    const { data: contents, error: contentsError } = await supabase
      .from('page_contents')
      .select('section, value')
      .eq('page', 'projects')
      .eq('key', 'data')
    
    return NextResponse.json({
      success: true,
      projects: projects || [],
      projectsError: projectsError?.message || null,
      contents: contents || [],
      contentsError: contentsError?.message || null,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}