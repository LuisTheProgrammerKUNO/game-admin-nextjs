'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Modal from '@/app/components/Modal'

type Module = {
  module_id: number
  name: string
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  // Add Modal
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')

  // Edit Modal
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  // Delete Modal
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteName, setDeleteName] = useState('')

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/modules')
      const data = await res.json()
      setModules(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const addModule = async () => {
    if (!newName.trim()) return
    await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    setNewName('')
    setAddOpen(false)
    refresh()
  }

  const editModule = async () => {
    if (editId === null || !editName.trim()) return
    await fetch(`/api/modules/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    })
    setEditOpen(false)
    setEditId(null)
    setEditName('')
    refresh()
  }

  const deleteModule = async () => {
    if (deleteId === null) return
    await fetch(`/api/modules/${deleteId}`, { method: 'DELETE' })
    setDeleteOpen(false)
    setDeleteId(null)
    setDeleteName('')
    refresh()
  }

  if (loading) return <div className="p-4">Loading modules…</div>

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modules</h1>
        <button
          onClick={() => setAddOpen(true)}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          + Add Module
        </button>
      </div>

      {modules.length === 0 ? (
        <p className="text-gray-400">No modules yet</p>
      ) : (
        <ul className="space-y-3">
          {modules.map((m) => (
            <li
              key={m.module_id}
              className="flex items-center justify-between border border-gray-700 rounded p-4"
            >
              <Link
                href={`/admin/modules/${m.module_id}`}
                className="underline text-blue-400 font-medium"
              >
                {m.name}
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditId(m.module_id)
                    setEditName(m.name)
                    setEditOpen(true)
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteId(m.module_id)
                    setDeleteName(m.name)
                    setDeleteOpen(true)
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Module Modal */}
      <Modal
        isOpen={addOpen}
        title="Add Module"
        onClose={() => setAddOpen(false)}
        onSave={addModule}
      >
        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          placeholder="Module name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </Modal>

      {/* Edit Module Modal */}
      <Modal
        isOpen={editOpen}
        title="Edit Module"
        onClose={() => setEditOpen(false)}
        onSave={editModule}
      >
        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          placeholder="Module name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      </Modal>

      {/* Delete Module Modal */}
      <Modal
        isOpen={deleteOpen}
        title="Delete Module"
        onClose={() => setDeleteOpen(false)}
        onSave={deleteModule}
      >
        <p className="text-gray-200">
          Are you sure you want to delete <strong>{deleteName}</strong>?
        </p>
      </Modal>
    </div>
  )
}
