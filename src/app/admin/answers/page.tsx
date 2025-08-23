// src/app/admin/answers/page.tsx
'use client'

import { useEffect, useState } from 'react'
import type { Answer, Question } from '@prisma/client'

// Disable prerendering so this page is always dynamic
export const dynamic = 'force-dynamic'

export default function AnswersPage() {
  const [qid, setQid] = useState<number | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [text, setText] = useState('')
  const [correct, setCorrect] = useState(false)

  // Read query string on the client only
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const v = Number(sp.get('question_id') || 0)
    setQid(Number.isFinite(v) && v > 0 ? v : null)
  }, [])

  // Load data when qid is known
  useEffect(() => {
    if (!qid) return
    const load = async () => {
      const q = await fetch(`/api/questions/${qid}`).then(r => r.json())
      setQuestion(q)
      setAnswers(q?.answers ?? [])
    }
    load()
  }, [qid])

  const reload = async () => {
    if (!qid) return
    const q = await fetch(`/api/questions/${qid}`).then(r => r.json())
    setQuestion(q)
    setAnswers(q?.answers ?? [])
  }

  const add = async () => {
    if (!qid || !text.trim()) return
    await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: qid, text, is_correct: correct }),
    })
    setText('')
    setCorrect(false)
    reload()
  }

  const toggle = async (a: Answer) => {
    await fetch(`/api/answers/${a.answer_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_correct: !a.is_correct }),
    })
    reload()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete answer?')) return
    await fetch(`/api/answers/${id}`, { method: 'DELETE' })
    reload()
  }

  // While we don't know qid yet (first render on server or before effect runs)
  if (qid == null) {
    return <div className="p-4 text-sm text-gray-500">Loading…</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Answers</h2>
      {question && (
        <div className="mb-4">
          <div className="font-medium">Question #{question.question_id}</div>
          <div className="opacity-80">{question.text}</div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1 flex-1"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Answer text"
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={correct}
            onChange={e => setCorrect(e.target.checked)}
          />
          correct
        </label>
        <button className="border px-3 py-1" onClick={add}>Add</button>
      </div>

      <ul className="space-y-2">
        {answers.map(a => (
          <li key={a.answer_id} className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-sm border ${a.is_correct ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300'}`}>
              {a.is_correct ? 'correct' : 'wrong'}
            </span>
            <span className="flex-1">{a.text}</span>
            <button className="border px-2 py-0.5" onClick={() => toggle(a)}>
              {a.is_correct ? 'Mark wrong' : 'Mark correct'}
            </button>
            <button className="border px-2 py-0.5" onClick={() => remove(a.answer_id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
