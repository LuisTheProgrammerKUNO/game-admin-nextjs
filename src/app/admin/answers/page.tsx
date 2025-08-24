// src/app/admin/answers/page.tsx
import AnswersClient from './AnswersClient';

// ensure this page never prerenders a stale static version
export const dynamic = 'force-dynamic';

export default function Page() {
  return <AnswersClient />;
}
