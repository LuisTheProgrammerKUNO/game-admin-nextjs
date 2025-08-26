//FOR TESTING PURPOSES ONLY
//In production, this should be a protected route, accessible only to authenticated users.

'use client'

import { useState } from 'react'

export default function RequestDeletionPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const submit = async () => {
    setStatus('Submitting...')
    const res = await fetch('/api/users/request-deletion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (res.ok) {
      setStatus('Request submitted successfully!')
      setEmail('')
    } else {
      setStatus(`Error: ${data.error || 'Failed'}`)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Request Account Deletion</h1>
      <input
        className="border px-3 py-2 w-full mb-3"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button
        className="border px-4 py-2 bg-red-600 text-white rounded"
        onClick={submit}
      >
        Submit Request
      </button>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  )
}
