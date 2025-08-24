// src/app/admin/answers/page.tsx
import AnswersClient from './AnswersClient';

export default function Page() {
  // Server component wrapper — the UI logic lives in the client file
  return <AnswersClient />;
}
