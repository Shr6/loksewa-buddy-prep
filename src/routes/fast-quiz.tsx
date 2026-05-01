import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AdSlot } from "@/components/AdSlot";
import { QuizProgress } from "@/components/QuizProgress";
import { CATEGORIES, type CategoryKey } from "@/data/questions";
import { CATEGORY_ICONS, CATEGORY_GRADIENT } from "@/lib/category-assets";
import { pickQuizQuestions } from "@/lib/quiz-utils";

export const Route = createFileRoute("/fast-quiz")({
  head: () => ({
    meta: [
      { title: "Fast Quiz — Loksewa Prep" },
      { name: "description", content: "Quick 10-question round. Answers and explanations shown at the end." },
    ],
  }),
  component: FastQuiz,
});

function FastQuiz() {
  const [cat, setCat] = useState<CategoryKey | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  const questions = useMemo(() => (cat ? pickQuizQuestions(cat, 10) : []), [cat]);

  if (!cat) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-6">
          <div className="rounded-3xl bg-hero-gradient p-6 text-primary-foreground shadow-elevate relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <div className="text-4xl">⚡</div>
            <h1 className="text-2xl font-bold mt-2">Fast Quiz</h1>
            <p className="opacity-90 text-sm mt-1">10 quick questions. Review at the end.</p>
          </div>
          <h2 className="mt-6 mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Choose category</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  setCat(c.key);
                  setAnswers(Array(10).fill(null));
                }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 hover:shadow-elevate transition-all hover:-translate-y-0.5 text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENT[c.key]} opacity-60`} />
                <div className="relative flex items-center gap-3">
                  <img src={CATEGORY_ICONS[c.key]} alt="" loading="lazy" className="h-14 w-14 object-contain group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold">{c.label}</div>
                    <div className="text-xs text-muted-foreground">Start →</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (done) {
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "🎉" : pct >= 40 ? "💪" : "📚";
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
          <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 text-primary-foreground text-center shadow-elevate animate-pop-in">
            <div className="text-6xl mb-2">{emoji}</div>
            <p className="text-sm opacity-90">Fast Quiz Complete</p>
            <div className="text-7xl font-bold mt-1 tracking-tight">{pct}%</div>
            <p className="mt-2 opacity-90">{score} / {questions.length} correct</p>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const correct = userAns === q.correctIndex;
              return (
                <div key={i} className="rounded-2xl bg-card border border-border p-4 shadow-soft">
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                      {correct ? "✓" : "✗"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{i + 1}. {q.question}</div>
                      <div className="mt-2 text-sm space-y-0.5">
                        <div className="text-success">Correct: {q.options[q.correctIndex]}</div>
                        {!correct && userAns !== null && (
                          <div className="text-destructive">Your answer: {q.options[userAns]}</div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setCat(null); setIdx(0); setDone(false); }} className="flex-1 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold">
              New quiz
            </button>
            <Link to="/" className="flex-1 rounded-xl border border-border bg-card py-3.5 font-semibold text-center">Home</Link>
          </div>
        </main>
      </div>
    );
  }

  const q = questions[idx];
  const sel = answers[idx];
  const meta = CATEGORIES.find((c) => c.key === cat)!;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        <QuizProgress current={idx + 1} total={questions.length} emoji="⚡" label={`Fast Quiz · ${meta.label}`} />

        <div key={idx} className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-soft animate-pop-in">
          <h2 className="text-base sm:text-lg font-semibold leading-snug">{q.question}</h2>
          <div className="mt-5 grid gap-2.5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  const next = [...answers];
                  next[idx] = i;
                  setAnswers(next);
                }}
                className={`w-full text-left rounded-2xl border-2 px-3 sm:px-4 py-3 sm:py-3.5 transition-all flex items-center gap-3 ${sel === i ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-background hover:bg-muted hover:border-primary/30"}`}
              >
                <span className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg font-bold text-sm ${sel === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-sm sm:text-base leading-snug">{opt}</span>
              </button>
            ))}
          </div>
          <button
            disabled={sel === null}
            onClick={() => {
              if (idx + 1 >= questions.length) setDone(true);
              else setIdx(idx + 1);
            }}
            className="mt-5 w-full rounded-xl bg-hero-gradient text-primary-foreground py-3.5 font-semibold disabled:opacity-50 shadow-soft"
          >
            {idx + 1 >= questions.length ? "Finish 🏁" : "Next →"}
          </button>
        </div>

        {idx === 4 && <AdSlot label="Advertisement" size="inline" />}
      </main>
    </div>
  );
}
