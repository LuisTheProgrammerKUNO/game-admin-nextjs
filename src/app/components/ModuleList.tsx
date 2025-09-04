'use client'

import { useState } from 'react'
import QuestionList from './QuestionList'
import Modal from './Modal'

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

type Props = {
  modules: Module[]
  onAdd: (name: string) => void
  onEdit: (id: number, name: string) => void
  onDelete: (id: number) => void
  onAddQuestion: (module_id: number, type: string, text: string) => void
  onEditQuestion: (id: number, type: string, text: string) => void
  onDeleteQuestion: (id: number) => void
  onAddAnswer: (question_id: number, text: string, is_correct: boolean) => void
  onEditAnswer: (id: number, text: string, is_correct: boolean) => void
  onDeleteAnswer: (id: number) => void
}

export default function ModuleList({
  modules,
  onAdd,
  onEdit,
  onDelete,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onAddAnswer,
  onEditAnswer,
  onDeleteAnswer,
}: Props) {
  // Add Module modal
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')

  // Edit Module modal
  const [editOpen, setEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  return (
    <div>
      <div className="mb-3">
        <button
          className="bg-green-600 text-white px-3 py-2 rounded"
          onClick={() => {
            setNewName('')
            setAddOpen(true)
          }}
        >
          + Add Module
        </button>
      </div>

      {modules.map((m) => (
        <div key={m.module_id} className="border border-gray-700 rounded p-4 mb-4">
          <h2 className="text-lg font-bold">{m.name}</h2>

          <QuestionList
            questions={m.questions ?? []}
            moduleId={m.module_id}
            onAdd={onAddQuestion}
            onEdit={onEditQuestion}
            onDelete={onDeleteQuestion}
            onAddAnswer={onAddAnswer}
            onEditAnswer={onEditAnswer}
            onDeleteAnswer={onDeleteAnswer}
          />

          <div className="space-x-2 mt-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => {
                setEditingId(m.module_id)
                setEditName(m.name)
                setEditOpen(true)
              }}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => onDelete(m.module_id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add Module Modal */}
      <Modal
        isOpen={addOpen}
        title="Add Module"
        onClose={() => setAddOpen(false)}
        onSave={() => {
          if (newName.trim()) {
            onAdd(newName.trim())
            setAddOpen(false)
          }
        }}
      >
        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          placeholder="Module name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </Modal>

      {/* Edit Module Modal */}
      <Modal
        isOpen={editOpen}
        title="Edit Module"
        onClose={() => setEditOpen(false)}
        onSave={() => {
          if (editingId !== null && editName.trim()) {
            onEdit(editingId, editName.trim())
            setEditOpen(false)
          }
        }}
      >
        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          placeholder="Module name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      </Modal>
    </div>
  )
}
