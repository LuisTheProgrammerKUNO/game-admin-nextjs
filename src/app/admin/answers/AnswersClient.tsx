// src/app/admin/answers/AnswersClient.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Answer, Question, Module } from '@prisma/client'

type QuestionWithModule = Question & { module: Module | null }
type QuestionWithAnswers = Question & { answers: Answer[] }

export default function AnswersClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // read ?question_id from URL
  const qid = useMemo(() => {
    const n = Number(searchParams.get('question_id') || 0)
    return Number.isFinite(n) && n > 0 ? n : null
  }, [searchParams])

  // state
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<QuestionWithModule[]>([])
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [text, setText] = useState('')
  const [correct, setCorrect] = useState(false)

  // when NO qid: load a list of questions
  useEffect(() => {
    if (qid) return
    setLoading(true)
    fetch('/api/questions')
      .then(r => r.json())
      .then((rows: QuestionWithModule[]) => setQuestions(rows ?? []))
      .finally(() => setLoading(false))
  }, [qid])

  // when qid exists: load that single question + its answers
  useEffect(() => {
    if (!qid) return
    setLoading(true)
    fetch(`/api/questions/${qid}`)
      .then(r => r.json())
      .then((q: QuestionWithAnswers | null) => {
        setQuestion(q)
        setAnswers(q?.answers ?? [])
      })
      .finally(() => setLoading(false))
  }, [qid])

  // helpers
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

  // UI — no question picked: show the table of questions
  if (!qid) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Pick a Question</h2>
        {loading ? (
          <div className="text-sm opacity-70">Loading…</div>
        ) : questions.length === 0 ? (
          <div className="text-sm opacity-70">No questions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[640px] border-collapse">
              <thead>
                <tr className="[&_th]:text-left [&_th]:px-2 [&_th]:py-1 border-b">
                  <th>ID</th>
                  <th>Module</th>
                  <th>Type</th>
                  <th>Text</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="[&_td]:px-2 [&_td]:py-2">
                {questions.map(q => (
                  <tr key={q.question_id} className="border-b">
                    <td className="tabular-nums">{q.question_id}</td>
                    <td>{q.module?.name ?? '—'}</td>
                    <td className="uppercase text-xs tracking-wide opacity-70">{q.type}</td>
                    <td className="truncate max-w-[480px]">{q.text}</td>
                    <td>
                      <button
                        className="border px-2 py-0.5 rounded"
                        onClick={() => router.push(`/admin/answers?question_id=${q.question_id}`)}
                      >
                        Manage answers
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

  // UI — question picked: show the answers editor
  return (
    <div className="p-4">
      <button
        className="border px-2 py-0.5 rounded mb-3"
        onClick={() => router.push('/admin/answers')}
      >
        ← Back to questions
      </button>

      <h2 className="text-xl font-semibold mb-2">Answers</h2>

      {loading ? (
        <div className="text-sm opacity-70">Loading…</div>
      ) : question ? (
        <>
          <div className="mb-4">
            <div className="font-medium">Question #{question.question_id}</div>
            <div className="opacity-80">{question.text}</div>
          </div>

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
        </>
      ) : (
        <div className="text-sm opacity-70">Question not found.</div>
      )}
    </div>
  )
}
