import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

export default async function ProjectsPage() {
  const supabase = createServerClient()
  const { data: projects, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return <div>Error loading projects</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/admin/projects/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Project
        </Link>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Slug</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project) => (
              <tr key={project.id} className="border-t">
                <td className="py-2 px-4">{project.title}</td>
                <td className="py-2 px-4">{project.slug}</td>
                <td className="py-2 px-4">
                  <Link href={`/admin/projects/${project.id}/edit`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {(!projects || projects.length === 0) && (
              <tr><td colSpan="3" className="py-4 text-center text-gray-500">No projects found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}