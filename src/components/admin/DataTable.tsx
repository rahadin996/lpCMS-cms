// src/components/admin/DataTable.tsx

interface DataRow {
  name: string;
  value: string | number;
}

interface DataTableProps {
  data: DataRow[];
}

export default function DataTable({ data }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">Statistik</th>
            <th className="py-2 px-4 text-left">April 2026</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{row.name}</td>
              <td className="py-2 px-4">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}