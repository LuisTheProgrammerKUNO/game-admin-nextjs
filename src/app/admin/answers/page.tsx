'use client'
import { useEffect, useState } from 'react'

type QuestionType = 'mul_choice' | 'fill_blank' | 'identification'

type Question = { question_id: number; text: string; type: QuestionType }
type Answer = { answer_id: number; question_id: number; text: string; is_correct: boolean }

export default function AnswersPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [qid, setQid] = useState<number | ''>('')

  // for mul_choice
  const [choices, setChoices] = useState<string[]>(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)

  // for fill_blank / identification
  const [fillAnswers, setFillAnswers] = useState<string[]>([''])

  const selectedQuestion = questions.find(q => q.question_id === qid)

  const load = async () => {
    const qs = await (await fetch('/api/questions')).json()
    setQuestions(qs)

    if (qid) {
      const as = await (await fetch(`/api/answers?question_id=${qid}`)).json()
      setAnswers(as)

      if (selectedQuestion?.type === 'mul_choice') {
        // load existing answers into choices if available
        const filledChoices = ['', '', '', '']
        let foundCorrect = null
        as.forEach((a: Answer, i: number) => {
          if (i < 4) filledChoices[i] = a.text
          if (a.is_correct) foundCorrect = i
        })
        setChoices(filledChoices)
        setCorrectIndex(foundCorrect)
      } else {
        // identification and fill_blank may have multiple correct answers
        setFillAnswers(as.map((a: Answer) => a.text))
        if (as.length === 0) setFillAnswers([''])
      }
    } else {
      setAnswers([])
      setChoices(['', '', '', ''])
      setCorrectIndex(null)
      setFillAnswers([''])
    }
  }

  useEffect(() => { load() }, [qid])

  // --- API Calls ---

  const saveChoices = async () => {
    if (!qid || choices.some(c => !c.trim()) || correctIndex === null) return

    await fetch('/api/answers/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: qid,
        answers: choices.map((c, i) => ({
          text: c,
          is_correct: i === correctIndex,
        })),
      }),
    })
    load()
  }

  const saveFillAnswers = async () => {
    if (!qid) return
    const valid = fillAnswers.filter(a => a.trim())
    if (valid.length === 0) return

    await fetch('/api/answers/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: qid,
        answers: valid.map(a => ({ text: a, is_correct: true })),
      }),
    })
    load()
  }

  const del = async (id: number) => {
    await fetch(`/api/answers/${id}`, { method: 'DELETE' })
    load()
  }

  // --- UI ---

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Answers</h1>

      <div className="flex gap-2 mb-4">
        <select
          className="px-3 py-2 rounded border bg-black/20"
          value={qid}
          onChange={e => setQid(Number(e.target.value))}
        >
          <option value="">— Select question —</option>
          {questions.map(q => (
            <option key={q.question_id} value={q.question_id}>
              {q.text} ({q.type})
            </option>
          ))}
        </select>
      </div>

      {/* MULTIPLE CHOICE */}
      {selectedQuestion?.type === 'mul_choice' && (
        <div className="space-y-2">
          {choices.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
              />
              <input
                className="flex-1 px-3 py-2 rounded border bg-black/20"
                placeholder={`Choice ${i + 1}`}
                value={c}
                onChange={e => {
                  const newChoices = [...choices]
                  newChoices[i] = e.target.value
                  setChoices(newChoices)
                }}
              />
            </div>
          ))}
          <button className="px-4 py-2 rounded bg-blue-600" onClick={saveChoices}>
            Save Choices
          </button>
        </div>
      )}

      {/* FILL BLANK / IDENTIFICATION */}
      {selectedQuestion && selectedQuestion.type !== 'mul_choice' && (
        <div className="space-y-2">
          {fillAnswers.map((a, i) => (
            <input
              key={i}
              className="w-full px-3 py-2 rounded border bg-black/20"
              placeholder={
                selectedQuestion.type === 'fill_blank'
                  ? `Correct answer for blank ${i + 1}`
                  : 'Correct answer'
              }
              value={a}
              onChange={e => {
                const updated = [...fillAnswers]
                updated[i] = e.target.value
                setFillAnswers(updated)
              }}
            />
          ))}
          {selectedQuestion.type === 'fill_blank' && (
            <button
              type="button"
              onClick={() => setFillAnswers([...fillAnswers, ''])}
              className="px-3 py-1 bg-gray-600 rounded"
            >
              + Add another correct answer
            </button>
          )}
          <button
            className="px-4 py-2 rounded bg-blue-600"
            onClick={saveFillAnswers}
          >
            Save Answers
          </button>

          <ul className="space-y-2 mt-4">
            {answers.map(a => (
              <li
                key={a.answer_id}
                className="flex items-center justify-between border rounded px-3 py-2"
              >
                <div>
                  #{a.answer_id} — {a.text}{' '}
                  {a.is_correct ? (
                    <span className="text-green-400">✔</span>
                  ) : (
                    <span className="opacity-60">✖</span>
                  )}
                </div>
                <button
                  className="px-3 py-1 rounded bg-red-600"
                  onClick={() => del(a.answer_id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
