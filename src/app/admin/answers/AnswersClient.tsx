'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Answer, Question } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default function AnswersClient() {
  const search = useSearchParams()
  const router = useRouter()

  const qidParam = search.get('question_id')
  const qid = useMemo(() => {
    const n = Number(qidParam)
    return Number.isFinite(n) && n > 0 ? n : null
  }, [qidParam])

  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [text, setText] = useState('')
  const [correct, setCorrect] = useState(false)
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(false)

  // If no ?question_id, pick the first available question and rewrite the URL.
  useEffect(() => {
    const bootstrap = async () => {
      if (qid !== null) return
      setLoading(true)
      const list: Question[] = await fetch('/api/questions')
        .then(r => r.json())
        .catch(() => [])
      if (Array.isArray(list) && list.length > 0) {
        router.replace(`/admin/answers?question_id=${list[0].question_id}`)
      } else {
        setEmpty(true)
        setLoading(false)
      }
    }
    bootstrap()
  }, [qid, router])

  // Load the selected question (+ answers)
  useEffect(() => {
    if (qid === null) return
    const load = async () => {
      setLoading(true)
      const q = await fetch(`/api/questions/${qid}`).then(r => r.json())
      setQuestion(q ?? null)
      setAnswers(q?.answers ?? [])
      setLoading(false)
    }
    load()
  }, [qid])

  const reload = async () => {
    if (qid === null) return
    const q = await fetch(`/api/questions/${qid}`).then(r => r.json())
    setQuestion(q ?? null)
    setAnswers(q?.answers ?? [])
  }

  const add = async () => {
    if (qid === null || !text.trim()) return
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

  if (loading) return <div className="p-4 text-sm text-gray-400">Loading…</div>
  if (empty) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Answers</h2>
        <p className="text-sm opacity-80">
          No questions found. Create one first on the{' '}
          <a className="underline" href="/admin/questions">Questions</a> page.
        </p>
      </div>
    )
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
          onChange={(e) => setText(e.target.value)}
          placeholder="Answer text"
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={correct}
            onChange={(e) => setCorrect(e.target.checked)}
          />
          correct
        </label>
        <button className="border px-3 py-1" onClick={add}>Add</button>
      </div>

      <ul className="space-y-2">
        {answers.map((a) => (
          <li key={a.answer_id} className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 rounded text-sm border ${
                a.is_correct ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300'
              }`}
            >
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
