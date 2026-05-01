import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AdSlot } from "@/components/AdSlot";
import { QuizProgress } from "@/components/QuizProgress";
import { pickExamQuestions } from "@/lib/quiz-utils";
import { saveExamResult } from "@/lib/storage";

export const Route = createFileRoute("/exam")({
  head: () => ({
    meta: [
      { title: "Exam Mode — Loksewa Prep" },
      { name: "description", content: "Timed 50-question Loksewa mock exam. 60 minutes. Review answers at the end." },
    ],
  }),
  component: ExamPage,
});

const EXAM_SECONDS = 60 * 60;

function ExamPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const questions = useMemo(() => pickExamQuestions(50), [started]);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(50).fill(null));
  const [idx, setIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!started || submitted) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setSubmitted(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, submitted]);

  useEffect(() => {
    if (submitted && started) {
      const score = questions.reduce((a, q, i) => a + (answers[i] === q.correctIndex ? 1 : 0), 0);
      saveExamResult(score, questions.length);
    }
  }, [submitted, started, answers, questions]);

  if (!started) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
          <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 text-primary-foreground shadow-elevate">
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/15 blur-3xl animate-blob" />
            <div className="text-5xl">📝</div>
            <p className="text-sm opacity-90 mt-3">Exam Mode</p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight">Mock Loksewa Exam</h1>
            <ul className="mt-5 space-y-2 text-sm opacity-95">
              <li className="flex items-center gap-2"><span>📚</span> 50 mixed-category questions</li>
              <li className="flex items-center gap-2"><span>⏱️</span> 60 minutes timer (auto-submit)</li>
              <li className="flex items-center gap-2"><span>🎯</span> Score & full review at the end</li>
            </ul>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-4 font-semibold text-lg hover:opacity-90 shadow-soft"
          >
            🚀 Start Exam
          </button>
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:underline">Cancel</Link>
        </main>
      </div>
    );
  }

  if (submitted) {
    const score = questions.reduce((a, q, i) => a + (answers[i] === q.correctIndex ? 1 : 0), 0);
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "🎉" : pct >= 40 ? "💪" : "📚";
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
          <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 text-primary-foreground text-center shadow-elevate animate-pop-in">
            <div className="text-6xl mb-2">{emoji}</div>
            <p className="text-sm opacity-90">Exam Complete</p>
            <div className="text-7xl font-bold mt-1 tracking-tight">{pct}%</div>
            <p className="mt-2 opacity-90">{score} / {questions.length} correct</p>
          </div>

          <AdSlot label="Sponsored" size="inline" />

          <h2 className="text-lg font-semibold px-1">Review</h2>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const a = answers[i];
              const correct = a === q.correctIndex;
              return (
                <div key={i} className="rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                      {correct ? "✓" : "✗"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{i + 1}. {q.question}</div>
                      <div className="mt-2 text-sm space-y-0.5">
                        <div className="text-success">Correct: {q.options[q.correctIndex]}</div>
                        {!correct && (
                          <div className="text-destructive">Your answer: {a !== null ? q.options[a] : "— not answered —"}</div>
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
            <button onClick={() => navigate({ to: "/exam" })} className="flex-1 rounded-xl border border-border bg-card py-3.5 font-semibold">Retake</button>
            <Link to="/" className="flex-1 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold text-center">Home</Link>
          </div>
        </main>
      </div>
    );
  }

  const q = questions[idx];
  const sel = answers[idx];
  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");
  const answeredCount = answers.filter((a) => a !== null).length;
  const lowTime = secondsLeft < 300;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <div className="sticky top-14 z-20 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-md border-b border-border">
          <QuizProgress
            current={idx + 1}
            total={questions.length}
            emoji="📝"
            label={`Answered ${answeredCount}/${questions.length}`}
            rightSlot={
              <div className={`tabular-nums font-mono text-sm font-bold px-3 py-1 rounded-full ${lowTime ? "bg-destructive/15 text-destructive animate-pulse" : "bg-muted text-foreground"}`}>
                ⏱ {mins}:{secs}
              </div>
            }
          />
        </div>

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
        </div>

        {idx > 0 && idx % 10 === 0 && <AdSlot label="Advertisement" size="inline" />}

        <div className="flex gap-3">
          <button
            disabled={idx === 0}
            onClick={() => setIdx(idx - 1)}
            className="flex-1 rounded-xl border border-border bg-card py-3 font-semibold disabled:opacity-50"
          >
            ← Previous
          </button>
          {idx + 1 < questions.length ? (
            <button onClick={() => setIdx(idx + 1)} className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-semibold">
              Next →
            </button>
          ) : (
            <button onClick={() => setSubmitted(true)} className="flex-1 rounded-xl bg-success text-success-foreground py-3 font-semibold">
              Submit Exam ✓
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Question Map</div>
          <div className="grid grid-cols-10 gap-1.5">
            {questions.map((_, i) => {
              const isCur = i === idx;
              const has = answers[i] !== null;
              return (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-8 rounded-md text-xs font-semibold border transition-all ${isCur ? "border-primary bg-primary text-primary-foreground scale-110" : has ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
