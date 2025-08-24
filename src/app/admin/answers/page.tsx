// src/app/admin/answers/page.tsx
'use client'

// make sure this page is always dynamic (no static export)
export const dynamic = 'force-dynamic'

import AnswersClient from './AnswersClient'

export default function Page() {
  return <AnswersClient />
}
