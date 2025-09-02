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

      if (action === 'approveDeletion') {
        endpoint = `/api/admin/users/${id}/approve-deletion`
      } else if (action === 'cancelDeletion') {
        endpoint = `/api/admin/users/${id}/cancel-deletion`
      } else if (action === 'toggleActive') {
        endpoint = `/api/admin/users/${id}`
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

  if (loading) return <div>Loading users...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Signup Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Coins</th>
            <th className="p-2 border">Deletion Requested</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center">
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">
                {u.first_name} {u.last_name}
              </td>
              <td className="p-2 border">{u.email || '—'}</td>
              <td className="p-2 border">
                {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
              </td>
              <td className="p-2 border">{u.is_active ? 'Active' : 'Inactive'}</td>
              <td className="p-2 border">{u.coins ?? 0}</td>
              <td className="p-2 border">
                {u.deletion_req ? new Date(u.deletion_req).toLocaleDateString() : '—'}
              </td>
              <td className="p-2 border space-x-2">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => handleAction(u.id, 'toggleActive')}
                >
                  {u.is_active ? 'Deactivate' : 'Activate'}
                </button>

                {u.deletion_req && (
                  <>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleAction(u.id, 'approveDeletion')}
                    >
                      Approve Deletion
                    </button>
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => handleAction(u.id, 'cancelDeletion')}
                    >
                      Cancel Deletion
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
