// src/lib/personil.ts
import { createClient } from '@/lib/supabase/client'

export interface Personil {
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

/**
 * Mengambil semua data personil dari Supabase
 * Jika gagal atau tabel kosong, mengembalikan array kosong
 */
export async function getAllPersonil(): Promise<Personil[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('personil')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching personil:', error)
    return []
  }

  // Mapping dari snake_case ke camelCase
  return (data || []).map((item: any) => ({
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
}

/**
 * Mengambil satu personil berdasarkan ID
 */
export async function getPersonilById(id: number): Promise<Personil | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('personil')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching personil by id:', error)
    return null
  }

  return {
    id: data.id,
    nama: data.nama,
    noHp: data.no_hp || '',
    posisi: data.posisi,
    lulusan: data.lulusan || '',
    tahunLulus: data.tahun_lulus || 0,
    deskripsi: data.deskripsi || '',
    image: data.image || '',
    keahlian: data.keahlian || [],
  }
}

/**
 * Mendapatkan personil berdasarkan array ID (untuk filtering)
 */
export async function getPersonilByIds(ids: number[]): Promise<Personil[]> {
  if (!ids || ids.length === 0) return []
  const all = await getAllPersonil()
  return all.filter(p => ids.includes(p.id))
}