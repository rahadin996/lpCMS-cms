// src/components/admin/DashboardCharts.tsx
'use client'

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import { ReactNode } from 'react'

// ========== Type Definitions ==========
interface ChartItem {
  name: string
  value: number
}

interface BarChartItem {
  name: string
  count: number
}

interface DashboardChartsProps {
  pieData: ChartItem[]
  barData: BarChartItem[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: ChartItem | BarChartItem
  }>
  label?: string
}

// Custom tooltip premium
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 p-3 px-4">
        <p className="text-sm font-semibold text-gray-800">{payload[0].payload.name || label}</p>
        <p className="text-2xl font-bold text-gray-900">{payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">Total item</p>
      </div>
    )
  }
  return null
}

export default function DashboardCharts({ pieData, barData }: DashboardChartsProps) {
  // Urutkan dari nilai terendah ke tertinggi
  const sortedData = [...pieData].sort((a, b) => a.value - b.value)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Area Chart */}
      <div className="relative group rounded-3xl bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 -right-32 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              📈 Kurva Distribusi Data Utama
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center">
              <span className="text-xs text-gray-600">{sortedData.length}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={sortedData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="areaPremium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="40%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#c4b5fd" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a78bfa', strokeWidth: 1, strokeDasharray: '4' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="url(#lineGlow)"
                strokeWidth={3}
                fill="url(#areaPremium)"
                dot={{ r: 5, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#8b5cf6', stroke: 'white', strokeWidth: 2 }}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
              <Legend
                verticalAlign="bottom"
                height={40}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#4b5563' }}
                formatter={() => <span className="text-gray-700">Jumlah Item (terendah → tertinggi)</span>}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            *Data diurutkan dari nilai terendah ke tertinggi
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="relative group rounded-3xl bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-0 -right-32 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              📊 Jumlah Item per Menu
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center">
              <span className="text-xs text-gray-600">{barData.length}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <defs>
                {barData.map((_, idx) => (
                  <linearGradient key={`grad-${idx}`} id={`barGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={`hsl(${230 + idx * 12}, 80%, 65%)`} />
                    <stop offset="100%" stopColor={`hsl(${230 + idx * 12}, 75%, 50%)`} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                barSize={36}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-bar-${index}`}
                    fill={`url(#barGrad-${index})`}
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            *Jumlah item per menu website (berdasarkan data terkini)
          </p>
        </div>
      </div>
    </div>
  )
}