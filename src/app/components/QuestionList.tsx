'use client'

import { useState } from 'react'
import AnswerList from './AnswerList'
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

type Props = {
  questions?: Question[]
  moduleId: number
  onAdd: (module_id: number, type: string, text: string) => void
  onEdit: (id: number, type: string, text: string) => void
  onDelete: (id: number) => void
  onAddAnswer: (question_id: number, text: string, is_correct: boolean) => void
  onEditAnswer: (id: number, text: string, is_correct: boolean) => void
  onDeleteAnswer: (id: number) => void
}

const QUESTION_TYPES = [
  { value: 'mul_choice', label: 'Multiple Choice' },
  { value: 'fill_blank', label: 'Fill in the Blank' },
  { value: 'identification', label: 'Identification' },
]

export default function QuestionList({
  questions = [],
  moduleId,
  onAdd,
  onEdit,
  onDelete,
  onAddAnswer,
  onEditAnswer,
  onDeleteAnswer,
}: Props) {
  // Add modal
  const [addOpen, setAddOpen] = useState(false)
  const [newType, setNewType] = useState('mul_choice')
  const [newText, setNewText] = useState('')

  // Edit modal
  const [editOpen, setEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editType, setEditType] = useState('mul_choice')
  const [editText, setEditText] = useState('')

  return (
    <div>
      {questions.length === 0 ? (
        <p className="text-gray-400">No questions yet</p>
      ) : (
        questions.map((q) => (
          <div key={q.question_id} className="border border-gray-700 rounded p-4 mb-3">
            <p className="font-medium">{q.text}</p>

            <AnswerList
              answers={q.answers ?? []}
              questionId={q.question_id}
              onAdd={onAddAnswer}
              onEdit={onEditAnswer}
              onDelete={onDeleteAnswer}
            />

            <div className="space-x-2 mt-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => {
                  setEditingId(q.question_id)
                  setEditType(q.type)
                  setEditText(q.text)
                  setEditOpen(true)
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => onDelete(q.question_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <button
        className="bg-green-600 text-white px-3 py-2 rounded mt-2"
        onClick={() => {
          setNewType('mul_choice')
          setNewText('')
          setAddOpen(true)
        }}
      >
        + Add Question
      </button>

      {/* Add Question Modal */}
      <Modal
        isOpen={addOpen}
        title="Add question"
        onClose={() => setAddOpen(false)}
        onSave={() => {
          if (newText.trim()) {
            onAdd(moduleId, newType, newText.trim())
            setAddOpen(false)
          }
        }}
      >
        <select
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-2"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        >
          {QUESTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          placeholder="Question text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
      </Modal>

      {/* Edit Question Modal */}
      <Modal
        isOpen={editOpen}
        title="Edit question"
        onClose={() => setEditOpen(false)}
        onSave={() => {
          if (editingId !== null && editText.trim()) {
            onEdit(editingId, editType, editText.trim())
            setEditOpen(false)
          }
        }}
      >
        <select
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-2"
          value={editType}
          onChange={(e) => setEditType(e.target.value)}
        >
          {QUESTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          placeholder="Question text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />
      </Modal>
    </div>
  )
}
