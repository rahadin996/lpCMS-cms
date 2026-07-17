// src/app/api/check-projects/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
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