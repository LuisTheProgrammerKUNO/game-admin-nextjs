'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Answer, Question } from '@prisma/client'

export default function AnswersPage() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const qidParam = Number(params.get('question_id') || 0)

  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [text, setText] = useState('')
  const [correct, setCorrect] = useState(false)

  const load = useCallback(async () => {
    if (qidParam) {
      const q: (Question & { answers: Answer[] }) | null =
        await fetch(`/api/questions/${qidParam}`).then((r) => r.json())
      if (q) {
        setQuestion(q)
        setAnswers(q.answers ?? [])
      }
    }
  }, [qidParam])

  useEffect(() => { void load() }, [load])

  const add = async () => {
    if (!qidParam || !text.trim()) return
    await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: qidParam, text, is_correct: correct }),
    })
    setText('')
    setCorrect(false)
    void load()
  }

  const toggle = async (a: Answer) => {
    await fetch(`/api/answers/${a.answer_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_correct: !a.is_correct }),
    })
    void load()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete answer?')) return
    await fetch(`/api/answers/${id}`, { method: 'DELETE' })
    void load()
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
