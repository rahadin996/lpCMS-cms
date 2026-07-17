import { createServerClient } from '@/lib/supabase/server'

export default async function MessagesPage() {
  const supabase = createServerClient()
  const { data: messages, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Message</th>
              <th className="py-2 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages?.map((msg) => (
              <tr key={msg.id} className="border-t">
                <td className="py-2 px-4">{msg.name}</td>
                <td className="py-2 px-4">{msg.email}</td>
                <td className="py-2 px-4">{msg.message}</td>
                <td className="py-2 px-4">{new Date(msg.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {(!messages || messages.length === 0) && (
              <tr><td colSpan="4" className="py-4 text-center text-gray-500">No messages yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}