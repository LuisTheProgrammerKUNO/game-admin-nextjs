'use client'

import { useEffect, useState } from 'react'
import QuestionList from '@/app/components/QuestionList'

export default function QuestionsPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<any[]>([])
  const moduleId = parseInt(params.id)

  const fetchData = async () => {
    const q = await fetch(`/api/modules/${moduleId}`).then((r) => r.json())
    setQuestions(q.questions ?? [])
  }

  useEffect(() => {
    fetchData()
  }, [moduleId])

  const onAdd = async (module_id: number, type: string, text: string) => {
    await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_id, type, text }),
    })
    await fetchData()
  }

  const onEdit = async (id: number, type: string, text: string) => {
    await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, text }),
    })
    await fetchData()
  }

  const onDelete = async (id: number) => {
    await fetch(`/api/questions/${id}`, { method: 'DELETE' })
    await fetchData()
  }

  const onAddAnswer = async (question_id: number, text: string, is_correct: boolean) => {
    await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id, text, is_correct }),
    })
    await fetchData()
  }

  const onEditAnswer = async (id: number, text: string, is_correct: boolean) => {
    await fetch(`/api/answers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, is_correct }),
    })
    await fetchData()
  }

  const onDeleteAnswer = async (id: number) => {
    await fetch(`/api/answers/${id}`, { method: 'DELETE' })
    await fetchData()
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Questions</h1>
      <QuestionList
        questions={questions}
        moduleId={moduleId}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddAnswer={onAddAnswer}
        onEditAnswer={onEditAnswer}
        onDeleteAnswer={onDeleteAnswer}
      />
    </div>
  )
}
