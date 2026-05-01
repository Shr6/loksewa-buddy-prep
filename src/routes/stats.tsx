import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CATEGORIES } from "@/data/questions";
import { getStats, type Stats } from "@/lib/storage";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Your Stats — Loksewa Prep" },
      { name: "description", content: "Personal best scores across quizzes and exams." },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => setStats(getStats()), []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Your Best Scores</h1>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Exam Mode</h2>
          <div className="mt-2 rounded-2xl bg-card border border-border p-5">
            {stats?.examBest ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{Math.round(stats.examBest.pct)}%</div>
                  <div className="text-sm text-muted-foreground">{stats.examBest.score} / {stats.examBest.total} correct</div>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(stats.examBest.date).toLocaleDateString()}</div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No exam taken yet. <Link to="/exam" className="text-primary underline">Start one →</Link></p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quiz Personal Bests</h2>
          <div className="mt-2 grid sm:grid-cols-2 gap-3">
            {CATEGORIES.map((c) => {
              const b = stats?.quizBest[c.key];
              return (
                <div key={c.key} className="rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="font-semibold">{c.label}</span>
                  </div>
                  {b ? (
                    <div className="mt-2 flex items-baseline justify-between">
                      <div className="text-2xl font-bold">{Math.round(b.pct)}%</div>
                      <div className="text-xs text-muted-foreground">{b.score}/{b.total}</div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">Not played yet</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
