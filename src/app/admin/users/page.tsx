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
      let method = 'POST'
      let body: any = {}

      if (action === 'approveDeletion') {
        endpoint = `/api/admin/users/${id}/approve-deletion`
      } else if (action === 'cancelDeletion') {
        endpoint = `/api/admin/users/${id}/cancel-deletion`
      } else if (action === 'toggleActive') {
        endpoint = `/api/admin/users/${id}`
        method = 'PATCH'
        body.toggleActive = true
      } else if (action === 'resetCoins') {
        endpoint = `/api/admin/users/${id}`
        method = 'PATCH'
        body.resetCoins = true
      }

      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
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
      <table className="min-w-full border-collapse border border-gray-600">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border border-gray-600 px-4 py-2">ID</th>
            <th className="border border-gray-600 px-4 py-2">Name</th>
            <th className="border border-gray-600 px-4 py-2">Email</th>
            <th className="border border-gray-600 px-4 py-2">Status</th>
            <th className="border border-gray-600 px-4 py-2">Deletion Requested</th>
            <th className="border border-gray-600 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={u.id}
              className={i % 2 === 0 ? 'bg-gray-900 text-white' : 'bg-gray-700 text-white'}
            >
              <td className="border border-gray-600 px-4 py-2">{u.id}</td>
              <td className="border border-gray-600 px-4 py-2">
                {u.first_name} {u.last_name}
              </td>
              <td className="border border-gray-600 px-4 py-2">{u.email}</td>
              <td className="border border-gray-600 px-4 py-2">
                {u.is_active ? 'Active' : 'Inactive'}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {u.deletion_req ? new Date(u.deletion_req).toLocaleDateString() : '—'}
              </td>
              <td className="border border-gray-600 px-4 py-2 space-x-2">
                {/* Always allow toggle active/inactive */}
                <button
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                  onClick={() => handleAction(u.id, 'toggleActive')}
                >
                  {u.is_active ? 'Deactivate' : 'Activate'}
                </button>

                {/* Reset coins button */}
                <button
                  className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded"
                  onClick={() => handleAction(u.id, 'resetCoins')}
                >
                  Reset Coins
                </button>

                {/* Show only if deletion_req exists */}
                {u.deletion_req && (
                  <>
                    <button
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
                      onClick={() => handleAction(u.id, 'approveDeletion')}
                    >
                      Approve Deletion
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded"
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
