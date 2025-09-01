// src/app/admin/layout.tsx
import { Suspense, ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="nav-bar font-sans grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] bg-white text-black text-center [&_a]:py-3 [&_a]:border-0 [&_a]:hover:text-white [&_a]:hover:bg-black">
        <a href="/admin">Dashboard</a>
        <a href="/admin/modules">Modules</a>
        <a href="/admin/users">User Management</a>
        <a href="/admin/questions">Questions</a>
        <a href="/admin/answers">Answers</a>
        <a href="/admin/pending-users">Pending Account Deletion Requests</a>
      </nav>
      <div className="px-10 py-5 w-screen">

        <Suspense fallback={<div className="p-[30px] text-sm opacity-70">Loading…</div>}>
          <div className="py-[30px] text-sm">
            {children}
          </div>
        </Suspense>
      </div>
    </>
  )
}
