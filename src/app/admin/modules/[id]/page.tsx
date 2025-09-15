'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import QuestionList from '@/app/components/QuestionList'

type Answer = {
  answer_id: number
  text: string
  is_correct: boolean
}

type Question = {
  question_id: number
  text: string
  type: string
  answers?: Answer[]
}

type Module = {
  module_id: number
  name: string
  questions?: Question[]
}

export default function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ unwrap the promise
  const { id } = use(params)
  const moduleId = Number(id)

  const [mod, setMod] = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/modules/${moduleId}`)
      const data = await res.json()
      setMod(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId])

  // … your add/edit/delete handlers stay the same

  if (loading) return <div className="p-4">Loading module…</div>
  if (!mod) return <div className="p-4">Module not found.</div>

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link href="/admin/modules" className="underline text-blue-400">
            Modules
          </Link>{' '}
          / {mod.name}
        </h1>
      </div>

      <QuestionList
        questions={mod.questions ?? []}
        moduleId={mod.module_id}
        onAdd={async (m, t, text) => {
          await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module_id: m, type: t, text }),
          })
          refresh()
        }}
        onEdit={async (id, t, text) => {
          await fetch(`/api/questions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: t, text }),
          })
          refresh()
        }}
        onDelete={async (id) => {
          await fetch(`/api/questions/${id}`, { method: 'DELETE' })
          refresh()
        }}
        onAddAnswer={async (qid, text, is_correct) => {
          await fetch('/api/answers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question_id: qid, text, is_correct }),
          })
          refresh()
        }}
        onEditAnswer={async (id, text, is_correct) => {
          await fetch(`/api/answers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, is_correct }),
          })
          refresh()
        }}
        onDeleteAnswer={async (id) => {
          await fetch(`/api/answers/${id}`, { method: 'DELETE' })
          refresh()
        }}
      />
    </div>
  )
}
