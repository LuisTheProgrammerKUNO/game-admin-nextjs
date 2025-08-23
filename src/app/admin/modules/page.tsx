'use client'
import { useEffect, useState } from 'react'

type Module = { module_id: number; name: string }

export default function ModulesPage() {
  const [items, setItems] = useState<Module[]>([])
  const [name, setName] = useState('')
  const load = async () => setItems(await (await fetch('/api/modules')).json())
  useEffect(() => { load() }, [])

  const create = async () => {
    if (!name.trim()) return
    await fetch('/api/modules', { method: 'POST', body: JSON.stringify({ name }), headers: { 'Content-Type': 'application/json' } })
    setName(''); load()
  }
  const rename = async (id: number, v: string) => {
    await fetch(`/api/modules/${id}`, { method: 'PUT', body: JSON.stringify({ name: v }), headers: { 'Content-Type': 'application/json' } })
    load()
  }
  const remove = async (id: number) => {
    if (!confirm('Delete module?')) return
    await fetch(`/api/modules/${id}`, { method: 'DELETE' }); load()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Modules</h2>
      <div className="flex gap-2 mb-4">
        <input className="border px-2 py-1" value={name} onChange={e=>setName(e.target.value)} placeholder="New module name" />
        <button className="border px-3 py-1" onClick={create}>Add</button>
      </div>

      <ul className="space-y-2">
        {items.map(m => (
          <li key={m.module_id} className="flex items-center gap-2">
            <input
              defaultValue={m.name}
              className="border px-2 py-1 flex-1"
              onBlur={(e)=>rename(m.module_id, e.currentTarget.value)}
            />
            <button className="border px-2 py-1" onClick={()=>remove(m.module_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
