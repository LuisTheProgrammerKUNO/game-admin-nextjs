'use client'

import { useEffect, useState } from 'react'
import AnswerList from '@/app/components/AnswerList'

export default function AnswersPage({ params }: { params: { id: string } }) {
  const [answers, setAnswers] = useState<any[]>([])
  const questionId = parseInt(params.id)

  const fetchData = async () => {
    const a = await fetch(`/api/questions/${questionId}`).then((r) => r.json())
    setAnswers(a.answers ?? [])
  }

  useEffect(() => {
    fetchData()
  }, [questionId])

  const onAdd = async (question_id: number, text: string, is_correct: boolean) => {
    await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id, text, is_correct }),
    })
    await fetchData()
  }

  const onEdit = async (id: number, text: string, is_correct: boolean) => {
    await fetch(`/api/answers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, is_correct }),
    })
    await fetchData()
  }

  const onDelete = async (id: number) => {
    await fetch(`/api/answers/${id}`, { method: 'DELETE' })
    await fetchData()
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Answers</h1>
      <AnswerList
        answers={answers}
        questionId={questionId}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}
