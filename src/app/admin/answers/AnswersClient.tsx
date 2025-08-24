// src/app/admin/answers/AnswersClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Answer, Question } from '@prisma/client';

type LiteQuestion = Pick<Question, 'question_id' | 'text'>;

export default function AnswersClient() {
  const router = useRouter();
  const search = useSearchParams();

  // Read query param (if present) so deep links continue to work
  const qidFromUrl = useMemo(() => {
    const raw = search.get('question_id');
    const n = Number(raw ?? 0);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [search]);

  const [questions, setQuestions] = useState<LiteQuestion[]>([]);
  const [selectedQid, setSelectedQid] = useState<number | null>(qidFromUrl);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [text, setText] = useState('');
  const [correct, setCorrect] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load the list of questions once
  useEffect(() => {
    (async () => {
      try {
        const data: Question[] = await fetch('/api/questions', { cache: 'no-store' }).then(r => r.json());
        // Keep a lite array for the picker
        setQuestions(data.map(q => ({ question_id: q.question_id, text: q.text })));
      } catch (e) {
        console.error('Failed to load questions', e);
      }
    })();
  }, []);

  // Keep URL in sync when the selection changes
  useEffect(() => {
    if (selectedQid) {
      const url = new URL(window.location.href);
      url.searchParams.set('question_id', String(selectedQid));
      router.replace(url.pathname + '?' + url.searchParams.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('question_id');
      router.replace(url.pathname);
    }
  }, [selectedQid, router]);

  // Load the selected question + its answers
  useEffect(() => {
    if (!selectedQid) {
      setQuestion(null);
      setAnswers([]);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const q = await fetch(`/api/questions/${selectedQid}`, { cache: 'no-store' }).then(r => r.json());
        setQuestion(q);
        setAnswers(q?.answers ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedQid]);

  const reload = async () => {
    if (!selectedQid) return;
    const q = await fetch(`/api/questions/${selectedQid}`, { cache: 'no-store' }).then(r => r.json());
    setQuestion(q);
    setAnswers(q?.answers ?? []);
  };

  const add = async () => {
    if (!selectedQid || !text.trim()) return;
    await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: selectedQid, text, is_correct: correct }),
    });
    setText('');
    setCorrect(false);
    reload();
  };

  const toggle = async (a: Answer) => {
    await fetch(`/api/answers/${a.answer_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_correct: !a.is_correct }),
    });
    reload();
  };

  const remove = async (id: number) => {
    if (!confirm('Delete answer?')) return;
    await fetch(`/api/answers/${id}`, { method: 'DELETE' });
    reload();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Answers</h2>

      {/* Question picker */}
      <div className="flex items-center gap-2">
        <label className="text-sm">Select a question:</label>
        <select
          value={selectedQid ?? ''}
          onChange={(e) => setSelectedQid(e.target.value ? Number(e.target.value) : null)}
          className="border px-2 py-1 min-w-[280px]"
        >
          <option value="">— Choose a question —</option>
          {questions.map(q => (
            <option key={q.question_id} value={q.question_id}>
              #{q.question_id} — {q.text.slice(0, 60)}
            </option>
          ))}
        </select>
      </div>

      {!questions.length && (
        <div className="text-sm text-gray-500">
          No questions yet. Create one first from the <a href="/admin/questions" className="underline">Questions</a> page.
        </div>
      )}

      {/* Selected question summary */}
      {selectedQid && question && (
        <div className="rounded border p-3 bg-gray-50">
          <div className="font-medium">Question #{question.question_id}</div>
          <div className="opacity-80">{question.text}</div>
        </div>
      )}

      {/* Answers manager */}
      {selectedQid ? (
        <>
          <div className="flex gap-2">
            <input
              className="border px-2 py-1 flex-1"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Answer text"
            />
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={correct} onChange={e => setCorrect(e.target.checked)} />
              correct
            </label>
            <button className="border px-3 py-1" onClick={add} disabled={loading}>Add</button>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : (
            <ul className="space-y-2">
              {answers.map(a => (
                <li key={a.answer_id} className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-sm border ${a.is_correct ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300'}`}>
                    {a.is_correct ? 'correct' : 'wrong'}
                  </span>
                  <span className="flex-1">{a.text}</span>
                  <button className="border px-2 py-0.5" onClick={() => toggle(a)}>
                    {a.is_correct ? 'Mark wrong' : 'Mark correct'}
                  </button>
                  <button className="border px-2 py-0.5" onClick={() => remove(a.answer_id)}>
                    Delete
                  </button>
                </li>
              ))}
              {!answers.length && (
                <li className="text-sm text-gray-500">No answers yet for this question.</li>
              )}
            </ul>
          )}
        </>
      ) : (
        <div className="text-sm text-gray-500">Pick a question to manage its answers.</div>
      )}
    </div>
  );
}
