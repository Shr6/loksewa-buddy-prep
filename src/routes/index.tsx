import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { AdSlot } from "@/components/AdSlot";
import { CATEGORIES, QUESTIONS } from "@/data/questions";
import { CATEGORY_ICONS, CATEGORY_GRADIENT } from "@/lib/category-assets";
import heroStudy from "@/assets/hero-study.png";

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
  const totalQ = Object.values(QUESTIONS).reduce((a, qs) => a + qs.length, 0);
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        <AdSlot label="Top Banner Ad" />

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-hero-gradient p-6 sm:p-8 text-primary-foreground shadow-elevate">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-3xl animate-blob" />
          <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
          <div className="relative grid sm:grid-cols-[1fr_auto] gap-4 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/30 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                {totalQ}+ practice questions
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                Master Loksewa.<br />
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">One question at a time.</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base opacity-90 max-w-md">
                Quizzes, fast rounds, and timed mock exams across General Knowledge, Math, English, and Logic.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/quiz"
                  className="inline-flex items-center justify-center rounded-xl bg-background text-foreground px-5 py-3 font-semibold shadow-soft hover:-translate-y-0.5 transition-all"
                >
                  🎯 Start Quiz
                </Link>
                <Link
                  to="/exam"
                  className="inline-flex items-center justify-center rounded-xl bg-white/15 backdrop-blur px-5 py-3 font-semibold ring-1 ring-white/30 hover:bg-white/25 transition-colors"
                >
                  📝 Start Exam
                </Link>
              </div>
            </div>
            <img
              src={heroStudy}
              alt=""
              width={1024}
              height={768}
              className="hidden sm:block h-40 w-auto object-contain animate-float drop-shadow-2xl"
            />
          </div>
        </section>

        {/* Modes */}
        <section>
          <h2 className="text-lg font-semibold mb-3 px-1">Modes</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <ModeCard to="/quiz" title="Quiz Mode" desc="Pick a category, see explanations after each question." emoji="🎯" tint="from-violet-500/15 to-fuchsia-500/15" />
            <ModeCard to="/fast-quiz" title="Fast Quiz" desc="10 quick questions. Review at the end." emoji="⚡" tint="from-amber-400/20 to-orange-500/15" />
            <ModeCard to="/exam" title="Exam Mode" desc="50 questions, 60 minutes. Full review at the end." emoji="📝" tint="from-emerald-400/15 to-teal-500/15" wide />
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-lg font-semibold mb-3 px-1">Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to="/quiz/$cat"
                params={{ cat: c.key }}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-4 hover:shadow-elevate transition-all hover:-translate-y-0.5`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENT[c.key]} opacity-60`} />
                <div className="relative">
                  <img src={CATEGORY_ICONS[c.key]} alt="" loading="lazy" width={512} height={512} className="h-16 w-16 object-contain group-hover:scale-110 transition-transform" />
                  <div className="mt-2 font-semibold">{c.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{QUESTIONS[c.key].length} questions →</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot label="Sponsored" size="inline" />

        {/* Stats teaser */}
        <section className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
          <div>
            <div className="font-semibold">Track your progress 📈</div>
            <p className="text-sm text-muted-foreground">See your personal best across modes.</p>
          </div>
          <Link to="/stats" className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90">View stats</Link>
        </section>
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
  tint,
  wide,
}: {
  to: string;
  title: string;
  desc: string;
  emoji: string;
  tint: string;
  wide?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-5 hover:shadow-elevate transition-all hover:-translate-y-0.5 ${wide ? "sm:col-span-2" : ""}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${tint} opacity-70`} />
      <div className="relative flex items-start gap-3">
        <div className="text-3xl drop-shadow-sm">{emoji}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <p className="text-sm text-muted-foreground mt-1">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
