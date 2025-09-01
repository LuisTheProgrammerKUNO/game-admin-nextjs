'use client';

import { useEffect, useState } from 'react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      let body: any = {};
      if (action === "toggleActive") {
        const user = users.find((u) => u.id === id);
        body.is_active = !user.is_active;
      } else if (action === "resetCoins") {
        body.resetCoins = true;
      } else if (action === "cancelDeletion") {
        body.cancelDeletion = true;
      }

      await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      fetchUsers(); // refresh
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full border border-gray-600 text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Active</th>
            <th className="border px-2 py-1">Coins</th>
            <th className="border px-2 py-1">Deletion Req</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border">
                <td className="border px-2 py-1">{u.id}</td>
                <td className="border px-2 py-1">
                  {u.first_name} {u.last_name}
                </td>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">
                  {u.is_active ? "✅" : "❌"}
                </td>
                <td className="border px-2 py-1">{u.coins}</td>
                <td className="border px-2 py-1">
                  {u.deletion_req ? u.deletion_req : "—"}
                </td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => handleAction(u.id, "toggleActive")}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    {u.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleAction(u.id, "resetCoins")}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Reset Coins
                  </button>
                  {u.deletion_req && (
                    <button
                      onClick={() => handleAction(u.id, "cancelDeletion")}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Cancel Deletion
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
