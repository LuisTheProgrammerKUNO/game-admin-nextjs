"use client"

import { useEffect, useState } from "react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false))
  }, [])

  async function approveDeletion(id: string) {
    if (!confirm("Are you sure you want to permanently delete this user?")) return

    const res = await fetch(`/api/admin/users/${id}/approve-deletion`, {
      method: "POST",
    })

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id)) // remove from UI
    } else {
      alert("Failed to approve deletion")
    }
  }

  if (loading) return <p>Loading users…</p>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Deletion Requested</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">{u.first_name}</td>
              <td className="border px-4 py-2">{u.last_name}</td>
              <td className="border px-4 py-2">{u.email ?? "—"}</td>
              <td className="border px-4 py-2">
                {u.deletion_req ? new Date(u.deletion_req).toLocaleString() : "No"}
              </td>
              <td className="border px-4 py-2">
                {u.deletion_req ? (
                  <button
                    onClick={() => approveDeletion(u.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Approve Deletion
                  </button>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
