import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AdSlot } from "@/components/AdSlot";
import { CATEGORIES, type CategoryKey } from "@/data/questions";
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
  const navigate = useNavigate();
  const [cat, setCat] = useState<CategoryKey | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  const questions = useMemo(() => (cat ? pickQuizQuestions(cat, 10) : []), [cat]);

  if (!cat) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">Fast Quiz ⚡</h1>
          <p className="text-muted-foreground mt-1">10 questions. Review at the end.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  setCat(c.key);
                  setAnswers(Array(10).fill(null));
                }}
                className="rounded-2xl border border-border bg-card p-5 hover:shadow-[var(--shadow-soft)] text-left"
              >
                <div className="text-3xl">{c.emoji}</div>
                <div className="font-semibold mt-2">{c.label}</div>
                <div className="text-xs text-muted-foreground">Start →</div>
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
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
          <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-8 text-primary-foreground text-center shadow-[var(--shadow-elevate)]">
            <p className="text-sm opacity-90">Fast Quiz Complete</p>
            <div className="text-6xl font-bold mt-2">{pct}%</div>
            <p className="mt-2 opacity-90">{score} / {questions.length} correct</p>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const correct = userAns === q.correctIndex;
              return (
                <div key={i} className="rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                      {correct ? "✓" : "✗"}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{i + 1}. {q.question}</div>
                      <div className="mt-2 text-sm">
                        <div className="text-success">Correct: {q.options[q.correctIndex]}</div>
                        {!correct && userAns !== null && (
                          <div className="text-destructive">Your answer: {q.options[userAns]}</div>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setCat(null); setIdx(0); setDone(false); }} className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-semibold">
              New quiz
            </button>
            <Link to="/" className="flex-1 rounded-xl border border-border py-3 font-semibold text-center">Home</Link>
          </div>
        </main>
      </div>
    );
  }

  const q = questions[idx];
  const sel = answers[idx];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">⚡ Fast Quiz</span>
          <span className="text-muted-foreground">{idx + 1} / {questions.length}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-[image:var(--gradient-hero)] transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold leading-snug">{q.question}</h2>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  const next = [...answers];
                  next[idx] = i;
                  setAnswers(next);
                }}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-colors ${sel === i ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-muted"}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            ))}
          </div>
          <button
            disabled={sel === null}
            onClick={() => {
              if (idx + 1 >= questions.length) setDone(true);
              else setIdx(idx + 1);
            }}
            className="mt-5 w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-50"
          >
            {idx + 1 >= questions.length ? "Finish" : "Next"}
          </button>
        </div>

        {idx === 4 && <AdSlot label="Advertisement" size="inline" />}
      </main>
    </div>
  );
}
