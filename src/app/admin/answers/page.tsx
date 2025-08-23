// src/app/admin/answers/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import AnswersClient from './AnswersClient';

export default function Page() {
  return <AnswersClient />;
}
