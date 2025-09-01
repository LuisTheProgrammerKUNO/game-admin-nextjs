'use client'

import { useEffect, useState } from 'react'

type User = {
  id: string
  first_name: string
  middle_name?: string
  last_name: string
  school?: string
  birthday?: string
  location?: string
  coins?: number
  is_active: boolean
  deletion_req?: string
  email?: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [hover, setHover] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null)

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // show 10 users per page

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      console.log("API response:", data)

      // Ensure it's always an array
      if (Array.isArray(data)) {
        setUsers(data)
      } else if (Array.isArray(data.users)) {
        setUsers(data.users)
      } else {
        setUsers([])
      }
    } catch (err) {
      console.error('Error loading users:', err)
      setUsers([]) // fallback to avoid filter crash
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

  // 🔍 Filtering
  const filteredUsers = users.filter(
    (u) =>
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  function normalize(val: any) {
    if (typeof val === 'number') return val
    if (typeof val === 'boolean') return val ? 1 : 0
    return val?.toString().toLowerCase() ?? ''
  }

  // ⬆️⬇️ Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    const valA = normalize(a[key])
    const valB = normalize(b[key])
    if (valA < valB) return direction === 'asc' ? -1 : 1
    if (valA > valB) return direction === 'asc' ? 1 : -1
    return 0
  })

  // 🔹 Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  if (loading) return <div>Loading users...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* 🔍 Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1) // reset page on search
          }}
          className="px-3 py-2 border rounded w-80 bg-gray-900 text-white"
        />
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse border border-gray-600 text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            {[
              'id',
              'first_name',
              'middle_name',
              'last_name',
              'school',
              'birthday',
              'location',
              'coins',
              'is_active',
              'deletion_req',
              'email',
            ].map((col) => (
              <th
                key={col}
                className="border border-gray-600 px-2 py-1 cursor-pointer hover:bg-gray-700"
                onClick={() => requestSort(col as keyof User)}
              >
                {col.replace('_', ' ').toUpperCase()}
                {sortConfig?.key === col && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
            <th className="border border-gray-600 px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((u, i) => (
            <tr
              key={u.id}
              className={i % 2 === 0 ? 'bg-gray-900 text-white' : 'bg-gray-700 text-white'}
            >
              <td
                className="border border-gray-600 px-2 py-1"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                {hover ? u.id : `${u.id.slice(0, 8)}...`}
              </td>
              <td className="border border-gray-600 px-2 py-1">{u.first_name}</td>
              <td className="border border-gray-600 px-2 py-1">{u.middle_name || '—'}</td>
              <td className="border border-gray-600 px-2 py-1">{u.last_name}</td>
              <td className="border border-gray-600 px-2 py-1">{u.school || '—'}</td>
              <td className="border border-gray-600 px-2 py-1">
                {u.birthday ? new Date(u.birthday).toLocaleDateString() : '—'}
              </td>
              <td className="border border-gray-600 px-2 py-1">{u.location || '—'}</td>
              <td className="border border-gray-600 px-2 py-1">{u.coins ?? 0}</td>
              <td className="border border-gray-600 px-2 py-1">
                {u.is_active ? 'Active' : 'Inactive'}
              </td>
              <td className="border border-gray-600 px-2 py-1">
                {u.deletion_req ? new Date(u.deletion_req).toLocaleDateString() : '—'}
              </td>
              <td className="border border-gray-600 px-2 py-1">{u.email || '—'}</td>
              <td className="grid grid-rows-auto grid-cols-1 border border-gray-600 px-2 py-1 space-x-1">
                <div className='grid grid-cols-2 gap-2'>
                  <button
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                    onClick={() => handleAction(u.id, 'toggleActive')}
                  >
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded"
                    onClick={() => handleAction(u.id, 'resetCoins')}
                  >
                    Reset Coins
                  </button>
                </div>
                {u.deletion_req && (
                  <div className='grid grid-cols-2 gap-2 mt-2'>
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
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
