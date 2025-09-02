'use client'
import { useEffect, useState } from 'react'

type UserRow = {
  id: string
  first_name: string
  last_name: string
  middle_name: string | null
  school: string | null
  birthday: string | null
  location: string | null
  is_active: boolean | null
  deletion_req: string | null
  coins: number | null
  email: string | null
  signup_at?: string | null
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      setUsers(await res.json())
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchUsers() }, [])

  const act = async (id: string, action: 'toggle'|'reset'|'cancel'|'approve') => {
    const map = {
      toggle: `/api/admin/users/${id}`,
      reset: `/api/admin/users/${id}`,
      cancel: `/api/admin/users/${id}/cancel-deletion`,
      approve: `/api/admin/users/${id}/approve-deletion`,
    } as const

    const body =
      action === 'toggle' ? { toggleActive: true } :
      action === 'reset' ? { resetCoins: true } :
      undefined

    await fetch(map[action], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    await fetchUsers()
  }

  if (loading) return <div>Loading users…</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-white/10">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Birthday</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Coins</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Deletion Requested</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="text-center">
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">
                {u.first_name} {u.middle_name ?? ''} {u.last_name}
              </td>
              <td className="p-2 border">{u.email ?? '—'}</td>
              <td className="p-2 border">{u.birthday ? new Date(u.birthday).toLocaleDateString() : '—'}</td>
              <td className="p-2 border">{u.location ?? '—'}</td>
              <td className="p-2 border">{u.coins ?? 0}</td>
              <td className="p-2 border">{u.is_active ? 'Yes' : 'No'}</td>
              <td className="p-2 border">
                {u.deletion_req ? new Date(u.deletion_req).toLocaleString() : '—'}
              </td>
              <td className="p-2 border space-x-2">
                <button className="px-2 py-1 rounded bg-blue-600" onClick={() => act(u.id, 'toggle')}>
                  {u.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button className="px-2 py-1 rounded bg-purple-600" onClick={() => act(u.id, 'reset')}>
                  Reset coins
                </button>
                {u.deletion_req && (
                  <>
                    <button className="px-2 py-1 rounded bg-yellow-600" onClick={() => act(u.id, 'cancel')}>
                      Cancel deletion
                    </button>
                    <button className="px-2 py-1 rounded bg-red-600" onClick={() => act(u.id, 'approve')}>
                      Approve deletion
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
