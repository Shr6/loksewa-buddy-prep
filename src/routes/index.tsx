import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { AdSlot } from "@/components/AdSlot";
import { CATEGORIES } from "@/data/questions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loksewa Prep — Free Nepal Public Service Exam Practice" },
      {
        name: "description",
        content:
          "Practice for Nepal Loksewa exams. Quiz mode with instant explanations, fast quiz, and 50-question timed exam mode. Free, mobile-friendly, no login required.",
      },
      { property: "og:title", content: "Loksewa Prep — Free Nepal Public Service Exam Practice" },
      { property: "og:description", content: "Quizzes, fast quiz and timed mock exams to ace Loksewa." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <AdSlot label="Top Banner Ad" />

        <section className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-8 sm:p-10 text-primary-foreground shadow-[var(--shadow-elevate)]">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-medium opacity-90">Nepal Public Service Exam Prep</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">
            Master Loksewa.<br />One question at a time.
          </h1>
          <p className="mt-3 text-sm sm:text-base opacity-90 max-w-md">
            200+ practice questions across General Knowledge, Math, English, and Logic. No login. Free forever.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center rounded-xl bg-background text-foreground px-5 py-3 font-semibold shadow-[var(--shadow-soft)] hover:translate-y-[-1px] transition-transform"
            >
              Start Quiz
            </Link>
            <Link
              to="/exam"
              className="inline-flex items-center justify-center rounded-xl bg-white/15 backdrop-blur px-5 py-3 font-semibold ring-1 ring-white/30 hover:bg-white/25 transition-colors"
            >
              Start Exam
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Modes</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <ModeCard
              to="/quiz"
              title="Quiz Mode"
              desc="Pick a category, see correct answers and explanations after each question."
              emoji="🎯"
            />
            <ModeCard
              to="/fast-quiz"
              title="Fast Quiz"
              desc="10 quick questions. Answers and short explanations at the end."
              emoji="⚡"
            />
            <ModeCard
              to="/exam"
              title="Exam Mode"
              desc="50 questions, 60 minutes. Final score and review at the end."
              emoji="📝"
              wide
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to="/quiz/$cat"
                params={{ cat: c.key }}
                className="group rounded-2xl border border-border bg-card p-4 hover:shadow-[var(--shadow-soft)] transition-shadow"
              >
                <div className="text-3xl">{c.emoji}</div>
                <div className="mt-2 font-semibold">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-1">Practice now →</div>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot label="Sponsored" size="inline" />
      </main>
      <footer className="text-center text-xs text-muted-foreground py-8">
        Built for Loksewa aspirants · Practice every day
      </footer>
    </div>
  );
}

function ModeCard({
  to,
  title,
  desc,
  emoji,
  wide,
}: {
  to: string;
  title: string;
  desc: string;
  emoji: string;
  wide?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`rounded-2xl border border-border bg-card p-5 hover:shadow-[var(--shadow-soft)] transition-shadow ${wide ? "sm:col-span-2" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{emoji}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <p className="text-sm text-muted-foreground mt-1">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
