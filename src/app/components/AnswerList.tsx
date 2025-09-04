'use client'

import { useState } from 'react'
import Modal from './Modal'

type Answer = {
  answer_id: number
  text: string
  is_correct: boolean
}

type Props = {
  /** The parent question id this list belongs to */
  questionId: number
  answers: Answer[]
  onAdd: (question_id: number, text: string, is_correct: boolean) => void | Promise<void>
  onEdit: (id: number, text: string, is_correct: boolean) => void | Promise<void>
  onDelete: (id: number) => void | Promise<void>
}

export default function AnswerList({
  questionId,
  answers,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [isAddOpen, setAddOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<Answer | null>(null)
  const [text, setText] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)

  const resetForm = () => {
    setText('')
    setIsCorrect(false)
  }

  return (
    <div className="mt-3">
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded"
        onClick={() => {
          resetForm()
          setAddOpen(true)
        }}
      >
        + Add Answer
      </button>

      <div className="mt-3 space-y-2">
        {answers.map((a) => (
          <div
            key={a.answer_id}
            className="border border-gray-700 rounded p-3 flex items-start justify-between"
          >
            <div>
              <p className="leading-tight">
                {a.text}{' '}
                {a.is_correct && (
                  <span className="ml-2 inline-block text-xs px-2 py-0.5 rounded bg-green-700/40 text-green-300 border border-green-700">
                    correct
                  </span>
                )}
              </p>
            </div>

            <div className="shrink-0 space-x-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                onClick={() => {
                  setSelected(a)
                  setText(a.text)
                  setIsCorrect(a.is_correct)
                  setEditOpen(true)
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                onClick={() => onDelete(a.answer_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Answer Modal */}
      <Modal
        isOpen={isAddOpen}
        title="Add Answer"
        onClose={() => setAddOpen(false)}
        onSave={async () => {
          await onAdd(questionId, text.trim(), isCorrect)
          setAddOpen(false)
          resetForm()
        }}
      >
        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Answer text"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isCorrect}
            onChange={(e) => setIsCorrect(e.target.checked)}
          />
          Correct
        </label>
      </Modal>

      {/* Edit Answer Modal */}
      <Modal
        isOpen={isEditOpen}
        title="Edit Answer"
        onClose={() => setEditOpen(false)}
        onSave={async () => {
          if (!selected) return
          await onEdit(selected.answer_id, text.trim(), isCorrect)
          setEditOpen(false)
          setSelected(null)
          resetForm()
        }}
      >
        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Answer text"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isCorrect}
            onChange={(e) => setIsCorrect(e.target.checked)}
          />
          Correct
        </label>
      </Modal>
    </div>
  )
}
