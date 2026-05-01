import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { CATEGORIES, QUESTIONS } from "@/data/questions";
import { CATEGORY_ICONS, CATEGORY_GRADIENT } from "@/lib/category-assets";

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
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="rounded-3xl bg-hero-gradient p-6 text-primary-foreground shadow-elevate relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
          <div className="text-4xl">🎯</div>
          <h1 className="text-2xl font-bold mt-2">Quiz Mode</h1>
          <p className="opacity-90 text-sm mt-1">10 questions per round, with instant explanations.</p>
        </div>
        <h2 className="mt-6 mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Choose category</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to="/quiz/$cat"
              params={{ cat: c.key }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 hover:shadow-elevate transition-all hover:-translate-y-0.5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENT[c.key]} opacity-60`} />
              <div className="relative flex items-center gap-3">
                <img src={CATEGORY_ICONS[c.key]} alt="" loading="lazy" className="h-14 w-14 object-contain group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold">{c.label}</div>
                  <div className="text-xs text-muted-foreground">{QUESTIONS[c.key].length} questions →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
