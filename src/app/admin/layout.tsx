// src/app/admin/layout.tsx
import { Suspense, ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-4">
      {<nav className="flex gap-4">
        <a className="underline" href="/admin">Dashboard</a>
        <a className="underline" href="/admin/modules">Modules</a>
        <a className="underline" href="/admin/questions">Questions</a>
        <a className="underline" href="/admin/answers">Answers</a>
      </nav>}
      <Suspense fallback={<div className="p-4 text-sm opacity-70">Loading…</div>}>
        {children}
      </Suspense>
    </div>
  )
}
