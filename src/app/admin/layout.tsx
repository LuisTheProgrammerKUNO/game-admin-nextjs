import { Suspense, ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-4">
      <nav className="flex gap-4 mb-6 text-sm">
        <a className="underline" href="/admin">Dashboard</a>
        <a className="underline" href="/admin/users">Users</a>
        <a className="underline" href="/admin/modules">Modules</a>
        <a className="underline" href="/admin/questions">Questions</a>
        <a className="underline" href="/admin/answers">Answers</a>
        <a className="underline" href="/request-deletion">Request Deletion (test)</a>
      </nav>

      <Suspense fallback={<div className="opacity-70">Loading…</div>}>{children}</Suspense>
    </div>
  )
}
