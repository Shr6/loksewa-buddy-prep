import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { CATEGORIES } from "@/data/questions";

export const Route = createFileRoute("/quiz/")({
  head: () => ({
    meta: [
      { title: "Quiz Mode — Loksewa Prep" },
      { name: "description", content: "Choose a category and start a 10-question quiz with instant explanations." },
    ],
  }),
  component: QuizIndex,
});

function QuizIndex() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">Quiz Mode</h1>
        <p className="text-muted-foreground mt-1">Pick a category — 10 questions, with explanations after each.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to="/quiz/$cat"
              params={{ cat: c.key }}
              className="rounded-2xl border border-border bg-card p-5 hover:shadow-[var(--shadow-soft)] transition-shadow flex items-center gap-3"
            >
              <div className="text-3xl">{c.emoji}</div>
              <div>
                <div className="font-semibold">{c.label}</div>
                <div className="text-xs text-muted-foreground">Start 10-question quiz →</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
