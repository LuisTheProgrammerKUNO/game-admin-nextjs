export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <nav className="flex gap-4">
        <a className="underline" href="/admin">Dashboard</a>
        <a className="underline" href="/admin/modules">Modules</a>
        <a className="underline" href="/admin/questions">Questions</a>
        <a className="underline" href="/admin/answers">Answers</a>
      </nav>
      {children}
    </div>
  )
}
