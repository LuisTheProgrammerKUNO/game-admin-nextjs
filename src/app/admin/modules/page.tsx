'use client'
import { useEffect, useState } from 'react'

type Module = { module_id: number; name: string }

export default function ModulesPage() {
  const [items, setItems] = useState<Module[]>([])
  const [name, setName] = useState('')

  const load = async () => {
    const r = await fetch('/api/modules')
    setItems(await r.json())
  }
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!name.trim()) return
    await fetch('/api/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
    setName('')
    load()
  }
  const del = async (id: number) => { await fetch(`/api/modules/${id}`, { method: 'DELETE' }); load() }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Modules</h1>

      <div className="flex gap-2 mb-4">
        <input className="px-3 py-2 rounded border bg-black/20" placeholder="Module name" value={name} onChange={e => setName(e.target.value)} />
        <button className="px-4 py-2 rounded bg-blue-600" onClick={add}>Add</button>
      </div>

      <ul className="space-y-2">
        {items.map(m => (
          <li key={m.module_id} className="flex items-center justify-between border rounded px-3 py-2">
            <div>#{m.module_id} — {m.name}</div>
            <button className="px-3 py-1 rounded bg-red-600" onClick={() => del(m.module_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
