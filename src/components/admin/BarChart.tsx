// src/components/admin/BarChart.tsx
'use client'

import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string
  lowongan: number
  layanan: number
  produk: number
}

interface BarChartProps {
  data: ChartData[]
}

export default function BarChart({ data }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="lowongan" fill="#8884d8" name="Lowongan Kerja" />
        <Bar dataKey="layanan" fill="#82ca9d" name="Layanan Jasa" />
        <Bar dataKey="produk" fill="#ffc658" name="Produk Dijual" />
      </ReBarChart>
    </ResponsiveContainer>
  )
}