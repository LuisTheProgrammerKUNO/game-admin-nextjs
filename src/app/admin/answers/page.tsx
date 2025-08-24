// src/app/admin/answers/page.tsx
import { Suspense } from 'react'
import AnswersClient from './AnswersClient'

// optional but safe when you fetch on the client only
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-sm opacity-70">Loading…</div>}>
      <AnswersClient />
    </Suspense>
  )
}
