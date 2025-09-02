'use client'

import { useState } from 'react'

export default function RequestDeletionPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (!email.trim()) {
      setMsg('Please enter your email')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/request-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) setMsg('Request submitted. An admin can now approve it.')
      else setMsg(data?.error ?? 'Something went wrong')
    } catch {
      setMsg('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Request Account Deletion</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full rounded border px-3 py-2 bg-black/20 outline-none"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
        <button
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
      {msg && <p className="mt-3 text-sm opacity-80">{msg}</p>}
    </div>
  )
}
