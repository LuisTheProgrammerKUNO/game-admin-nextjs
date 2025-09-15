'use client'

import { useEffect, useState } from 'react'

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAction = async (id: string, action: string) => {
    try {
      let endpoint = ''

      if (action === 'declineDeletion') {
        endpoint = `/api/admin/users/${id}/decline-deletion`
      } else if (action === 'toggleActive') {
        endpoint = `/api/admin/users/${id}/toggle-active`
      } else if (action === 'resetCoins') {
        endpoint = `/api/admin/users/${id}/reset-coins`
      }

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      fetchUsers()
    } catch (err) {
      console.error(`Action ${action} failed:`, err)
    }
  }

  if (loading) return <div className="text-white">Loading users...</div>

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full border border-gray-700 bg-gray-800 text-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-900 text-gray-200 text-center">
            <th className="p-2 border border-gray-700">ID</th>
            <th className="p-2 border border-gray-700">Name</th>
            <th className="p-2 border border-gray-700">Email</th>
            <th className="p-2 border border-gray-700">Signup Date</th>
            <th className="p-2 border border-gray-700">Status</th>
            <th className="p-2 border border-gray-700">Coins</th>
            <th className="p-2 border border-gray-700">Deletion Requested</th>
            <th className="p-2 border border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center hover:bg-gray-700">
              <td className="p-2 border border-gray-700">{u.id}</td>
              <td className="p-2 border border-gray-700">
                {u.first_name} {u.last_name}
              </td>
              <td className="p-2 border border-gray-700">{u.email || '—'}</td>
              <td className="p-2 border border-gray-700">
                {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
              </td>
              <td className="p-2 border border-gray-700">
                {u.is_active ? 'Active' : 'Inactive'}
              </td>
              <td className="p-2 border border-gray-700">{u.coins ?? 0}</td>
              <td className="p-2 border border-gray-700">
                {u.deletion_req ? new Date(u.deletion_req).toLocaleDateString() : '—'}
              </td>
              <td className="p-2 border border-gray-700 space-x-2">
                <button
                  className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  onClick={() => handleAction(u.id, 'toggleActive')}
                >
                  {u.is_active ? 'Deactivate' : 'Activate'}
                </button>

                {u.deletion_req && (
                  <button
                    className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded"
                    onClick={() => handleAction(u.id, 'declineDeletion')}
                  >
                    Decline Deletion
                  </button>
                )}

                {u.coins > 0 && (
                  <button
                    className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded"
                    onClick={() => handleAction(u.id, 'resetCoins')}
                  >
                    Reset Coins
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
