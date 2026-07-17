// src/components/admin/AdminSectionNav.tsx
'use client'

interface NavItem {
  key: string
  label: string
}

interface AdminSectionNavProps {
  items: NavItem[]
  activeKey: string
  onSelect: (key: string) => void
}

export default function AdminSectionNav({ items, activeKey, onSelect }: AdminSectionNavProps) {
  return (
    <div className="w-64 shrink-0 bg-white rounded-2xl shadow-lg p-4 h-fit sticky top-6">
      <h3 className="font-bold text-gray-700 mb-3">Navigasi</h3>
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
              activeKey === item.key
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}