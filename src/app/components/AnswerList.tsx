'use client'

import { useState } from 'react'
import Modal from './Modal'

type Answer = {
  answer_id: number
  text: string
  is_correct: boolean
}

type Props = {
  questionId: number
  answers: Answer[]
  onAdd: (question_id: number, text: string, is_correct: boolean) => Promise<void>
  onEdit: (id: number, text: string, is_correct: boolean) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export default function AnswerList({ answers, questionId, onAdd, onEdit, onDelete }: Props) {
  const [isAddOpen, setAddOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [text, setText] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)

  return (
    <div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setText('')
          setIsCorrect(false)
          setAddOpen(true)
        }}
      >
        + Add Answer
      </button>

      {answers.map((a) => (
        <div key={a.answer_id} className="border border-gray-700 rounded p-4 mb-4">
          <p>
            {a.text} {a.is_correct && <span className="text-green-400">(correct)</span>}
          </p>
          <div className="space-x-2 mt-2">
            <button
              className="bg-blue-600 px-3 py-1 rounded text-white"
              onClick={() => {
                setSelectedAnswer(a)
                setText(a.text)
                setIsCorrect(a.is_correct)
                setEditOpen(true)
              }}
            >
              Edit
            </button>
            <button
              className="bg-red-600 px-3 py-1 rounded text-white"
              onClick={async () => await onDelete(a.answer_id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <Modal
        isOpen={isAddOpen}
        title="Add Answer"
        onClose={() => setAddOpen(false)}
        onSave={async () => {
          if (text.trim()) {
            await onAdd(questionId, text, isCorrect)
            setAddOpen(false)
          }
        }}
      >
        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-2"
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

      <Modal
        isOpen={isEditOpen}
        title="Edit Answer"
        onClose={() => setEditOpen(false)}
        onSave={async () => {
          if (selectedAnswer && text.trim()) {
            await onEdit(selectedAnswer.answer_id, text, isCorrect)
            setEditOpen(false)
          }
        }}
      >
        <input
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-2"
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
