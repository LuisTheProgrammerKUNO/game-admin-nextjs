'use client'
import { useEffect, useState } from 'react'

type Module = { module_id: number; name: string }
type Question = { question_id: number; module_id: number; type: 'mul_choice'|'fill_blank'|'identification'; text: string; module?: Module }

export default function QuestionsPage() {
  const [mods, setMods] = useState<Module[]>([])
  const [items, setItems] = useState<Question[]>([])
  const [moduleId, setModuleId] = useState<number | ''>('')
  const [type, setType] = useState<Question['type']>('mul_choice')
  const [text, setText] = useState('')

  const load = async () => {
    const r1 = await fetch('/api/modules'); setMods(await r1.json())
    const r2 = await fetch('/api/questions'); setItems(await r2.json())
  }
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!moduleId || !text.trim()) return
    await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ module_id: moduleId, type, text }) })
    setText(''); setType('mul_choice'); setModuleId('')
    load()
  }
  const del = async (id: number) => { await fetch(`/api/questions/${id}`, { method: 'DELETE' }); load() }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Questions</h1>

      <div className="flex gap-2 mb-4">
        <select className="px-3 py-2 rounded border bg-black/20" value={moduleId} onChange={e => setModuleId(Number(e.target.value))}>
          <option value="">— Choose a module —</option>
          {mods.map(m => <option key={m.module_id} value={m.module_id}>{m.name}</option>)}
        </select>

        <select className="px-3 py-2 rounded border bg-black/20" value={type} onChange={e => setType(e.target.value as any)}>
          <option value="mul_choice">mul_choice</option>
          <option value="fill_blank">fill_blank</option>
          <option value="identification">identification</option>
        </select>

        <input className="flex-1 px-3 py-2 rounded border bg-black/20" placeholder="Question text" value={text} onChange={e => setText(e.target.value)} />
        <button className="px-4 py-2 rounded bg-blue-600" onClick={add}>Add Question</button>
      </div>

      <ul className="space-y-2">
        {items.map(q => (
          <li key={q.question_id} className="flex items-center justify-between border rounded px-3 py-2">
            <div>
              #{q.question_id} — [{q.type}] {q.text} <span className="opacity-70">({q.module?.name ?? q.module_id})</span>
            </div>
            <button className="px-3 py-1 rounded bg-red-600" onClick={() => del(q.question_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
