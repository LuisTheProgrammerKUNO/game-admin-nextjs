'use client'

type Props = {
  isOpen: boolean
  title: string
  onClose: () => void
  onSave: () => void | Promise<void>
  children: React.ReactNode
}

export default function Modal({ isOpen, title, onClose, onSave, children }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <div className="space-y-3">{children}</div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
