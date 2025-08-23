'use client'
import { useEffect, useMemo, useState } from 'react'
import type { Question, Module } from '@prisma/client'
import { QuestionType } from '@prisma/client'

type QuestionWith = Question & { module?: Module | null }

export default function QuestionsPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [items, setItems] = useState<QuestionWith[]>([])
  const [module_id, setModuleId] = useState<number | ''>('')
  const [text, setText] = useState('')
  const [type, setType] = useState<QuestionType>(QuestionType.mul_choice)

  const types = useMemo(() => Object.values(QuestionType), [])

  const load = async () => {
    const [ms, qs] = await Promise.all([
      fetch('/api/modules').then(r=>r.json()),
      fetch('/api/questions').then(r=>r.json()),
    ])
    setModules(ms); setItems(qs)
  }
  useEffect(()=>{ load() }, [])

  const create = async () => {
    if (!module_id || !text.trim()) return
    await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_id, text, type }),
    })
    setText(''); setModuleId(''); setType(QuestionType.mul_choice); load()
  }
  const remove = async (id: number) => {
    if (!confirm('Delete question?')) return
    await fetch(`/api/questions/${id}`, { method: 'DELETE' }); load()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Questions</h2>

      <div className="grid md:grid-cols-4 gap-2 mb-4">
        <select className="border px-2 py-1" value={module_id}
                onChange={e=>setModuleId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Module…</option>
          {modules.map(m => <option key={m.module_id} value={m.module_id}>{m.name}</option>)}
        </select>

        <select className="border px-2 py-1" value={type} onChange={e=>setType(e.target.value as QuestionType)}>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <input className="border px-2 py-1 md:col-span-2" value={text} onChange={e=>setText(e.target.value)} placeholder="Question text" />
      </div>

      <button className="border px-3 py-1 mb-6" onClick={create}>Add Question</button>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">#</th>
            <th>Module</th>
            <th>Type</th>
            <th>Text</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(q => (
            <tr key={q.question_id} className="border-b">
              <td className="py-2">{q.question_id}</td>
              <td>{q.module?.name ?? q.module_id}</td>
              <td>{q.type}</td>
              <td>{q.text}</td>
              <td>
                <a className="underline mr-3" href={`/admin/answers?question_id=${q.question_id}`}>Answers</a>
                <button className="border px-2 py-0.5" onClick={()=>remove(q.question_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
