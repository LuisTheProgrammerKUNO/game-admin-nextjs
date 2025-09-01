'use client'

import { useState } from 'react'

export default function RequestDeletionPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (!email.trim()) {
      setMsg('Please enter your email.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/request-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg(data?.error ?? `Request failed (${res.status})`)
      } else {
        setMsg('Request submitted. You can close this page now.')
        setEmail('')
      }
    } catch (err: any) {
      setMsg(err?.message ?? 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-semibold mb-3">Request Account Deletion</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="border px-3 py-2 w-full bg-black/20"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting}
          className="border px-3 py-2 rounded bg-red-600 disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
      {msg && <div className="mt-3 text-sm opacity-80">{msg}</div>}
    </div>
  )
}
