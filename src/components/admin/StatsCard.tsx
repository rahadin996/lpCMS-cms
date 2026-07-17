// src/components/admin/StatsCard.tsx
import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: string // e.g., "bg-blue-500", "bg-green-500", etc.
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className={`${color} rounded-lg shadow p-4 text-white`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}