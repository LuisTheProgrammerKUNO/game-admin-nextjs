'use client'
import { useEffect, useState } from 'react'

type Question = { question_id: number; text: string }
type Answer = { answer_id: number; question_id: number; text: string; is_correct: boolean }

export default function AnswersPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [qid, setQid] = useState<number | ''>('')
  const [text, setText] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)

  const load = async () => {
    const qs = await (await fetch('/api/questions')).json()
    setQuestions(qs)
    if (qid) {
      const as = await (await fetch(`/api/answers?question_id=${qid}`)).json()
      setAnswers(as)
    } else {
      setAnswers([])
    }
  }
  useEffect(() => { load() }, [qid])

  const add = async () => {
    if (!qid || !text.trim()) return
    await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: qid, text, is_correct: isCorrect }),
    })
    setText(''); setIsCorrect(false); load()
  }
  const del = async (id: number) => { await fetch(`/api/answers/${id}`, { method: 'DELETE' }); load() }
  const toggle = async (id: number, curr: boolean) => {
    await fetch(`/api/answers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_correct: !curr }) })
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Answers</h1>

      <div className="flex gap-2 mb-4">
        <select className="px-3 py-2 rounded border bg-black/20" value={qid} onChange={e => setQid(Number(e.target.value))}>
          <option value="">— Select question —</option>
          {questions.map(q => <option key={q.question_id} value={q.question_id}>{q.text}</option>)}
        </select>
        <input className="flex-1 px-3 py-2 rounded border bg-black/20" placeholder="Answer text" value={text} onChange={e => setText(e.target.value)} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isCorrect} onChange={e => setIsCorrect(e.target.checked)} />
          correct
        </label>
        <button className="px-4 py-2 rounded bg-blue-600" onClick={add}>Add Answer</button>
      </div>

      {!!qid && (
        <ul className="space-y-2">
          {answers.map(a => (
            <li key={a.answer_id} className="flex items-center justify-between border rounded px-3 py-2">
              <div>#{a.answer_id} — {a.text} {a.is_correct ? <span className="text-green-400">✔</span> : <span className="opacity-60">✖</span>}</div>
              <div className="space-x-2">
                <button className="px-3 py-1 rounded bg-purple-600" onClick={() => toggle(a.answer_id, a.is_correct)}>Toggle correct</button>
                <button className="px-3 py-1 rounded bg-red-600" onClick={() => del(a.answer_id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
