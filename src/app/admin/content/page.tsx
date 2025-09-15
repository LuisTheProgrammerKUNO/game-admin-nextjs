'use client'

import { useEffect, useState } from 'react'
import ModuleList from '@/app/components/ModuleList'

export default function AdminContentPage() {
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const m = await fetch('/api/modules').then((r) => r.json())
      setModules(m)
    } catch (err) {
      console.error('Error fetching content:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Module CRUD
  const addModule = async (name: string) => {
    await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    await fetchData()
  }

  const editModule = async (id: number, name: string) => {
    await fetch(`/api/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    await fetchData()
  }

  const deleteModule = async (id: number) => {
    await fetch(`/api/modules/${id}`, { method: 'DELETE' })
    await fetchData()
  }

  // Question CRUD
  const addQuestion = async (module_id: number, type: string, text: string) => {
    await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_id, type, text }),
    })
    await fetchData()
  }

  const editQuestion = async (id: number, type: string, text: string) => {
    await fetch(`/api/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, text }),
    })
    await fetchData()
  }

  const deleteQuestion = async (id: number) => {
    await fetch(`/api/questions/${id}`, { method: 'DELETE' })
    await fetchData()
  }

  // Answer CRUD
  const addAnswer = async (question_id: number, text: string, is_correct: boolean) => {
    await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id, text, is_correct }),
    })
    await fetchData()
  }

  const editAnswer = async (id: number, text: string, is_correct: boolean) => {
    await fetch(`/api/answers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, is_correct }),
    })
    await fetchData()
  }

  const deleteAnswer = async (id: number) => {
    await fetch(`/api/answers/${id}`, { method: 'DELETE' })
    await fetchData()
  }

  if (loading) return <div className="p-4">Loading content...</div>

  return (
    <div className="space-y-10 p-4">
      <h1 className="text-2xl font-bold">Admin Content Management</h1>

      <ModuleList
        modules={modules}
        onAdd={addModule}
        onEdit={editModule}
        onDelete={deleteModule}
        onAddQuestion={addQuestion}
        onEditQuestion={editQuestion}
        onDeleteQuestion={deleteQuestion}
        onAddAnswer={addAnswer}
        onEditAnswer={editAnswer}
        onDeleteAnswer={deleteAnswer}
      />
    </div>
  )
}
