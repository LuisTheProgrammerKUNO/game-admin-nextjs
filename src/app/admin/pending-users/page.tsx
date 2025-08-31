'use client'

import { useEffect, useState } from 'react'

type PendingUser = {
  id: string
  email: string | null
  name: string | null
  requestDeletion: string | null
}

export default function PendingUsersPage() {
  const [items, setItems] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/users/pending', { cache: 'no-store' })
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // ✅ Cancel deletion request
  const cancel = async (id: string) => {
    if (!confirm('Cancel deletion request for this user?')) return
    const res = await fetch(`/api/users/${id}/cancel`, { method: 'POST' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      alert(j?.error ?? 'Cancel failed')
      return
    }
    load()
  }

  // ✅ Permanently delete user
  const remove = async (id: string) => {
    if (!confirm('Permanently delete this user?')) return
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      alert(j?.error ?? 'Delete failed')
      return
    }
    load()
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Pending Account Deletion Requests
      </h1>

      {loading ? (
        <div className="opacity-70 text-sm">Loading…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="opacity-70 text-sm">No pending requests.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[640px] border-collapse">
            <thead>
              <tr className="[&_th]:text-left [&_th]:px-2 [&_th]:py-1 border-b">
                <th style={{ width: '15%' }}>User ID</th>
                <th style={{ width: '25%' }}>Name</th>
                <th style={{ width: '30%' }}>Email</th>
                <th style={{ width: '30%' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="[&_td]:px-2 [&_td]:py-2">
              {items.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="tabular-nums">{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="space-x-2">
                    <button
                      className="border px-2 py-0.5 rounded bg-red-50"
                      onClick={() => remove(u.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="border px-2 py-0.5 rounded bg-green-50"
                      onClick={() => cancel(u.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
