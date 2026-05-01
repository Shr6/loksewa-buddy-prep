import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AdSlot } from "@/components/AdSlot";
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
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
          <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-8 text-primary-foreground shadow-[var(--shadow-elevate)]">
            <p className="text-sm opacity-90">Exam Mode 📝</p>
            <h1 className="text-3xl font-bold mt-1">Mock Loksewa Exam</h1>
            <ul className="mt-4 text-sm space-y-1 opacity-95">
              <li>• 50 mixed-category questions</li>
              <li>• 60 minutes timer (auto-submit)</li>
              <li>• Score & full review at the end</li>
            </ul>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="w-full rounded-xl bg-primary text-primary-foreground py-4 font-semibold text-lg hover:opacity-90"
          >
            Start Exam
          </button>
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:underline">Cancel</Link>
        </main>
      </div>
    );
  }

  if (submitted) {
    const score = questions.reduce((a, q, i) => a + (answers[i] === q.correctIndex ? 1 : 0), 0);
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
          <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-8 text-primary-foreground text-center shadow-[var(--shadow-elevate)]">
            <p className="text-sm opacity-90">Exam Complete</p>
            <div className="text-6xl font-bold mt-2">{pct}%</div>
            <p className="mt-2 opacity-90">{score} / {questions.length} correct</p>
          </div>

          <AdSlot label="Sponsored" size="inline" />

          <h2 className="text-lg font-semibold">Review</h2>
          <div className="space-y-3">
            {questions.map((q, i) => {
              const a = answers[i];
              const correct = a === q.correctIndex;
              return (
                <div key={i} className="rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                      {correct ? "✓" : "✗"}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{i + 1}. {q.question}</div>
                      <div className="mt-2 text-sm space-y-0.5">
                        <div className="text-success">Correct: {q.options[q.correctIndex]}</div>
                        {!correct && (
                          <div className="text-destructive">Your answer: {a !== null ? q.options[a] : "— not answered —"}</div>
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
            <button onClick={() => navigate({ to: "/exam" })} className="flex-1 rounded-xl border border-border py-3 font-semibold">Retake</button>
            <Link to="/" className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-semibold text-center">Home</Link>
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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center justify-between gap-3 sticky top-14 z-20 bg-background/90 backdrop-blur py-2 -mx-4 px-4 border-b border-border">
          <div className="text-sm">
            <div className="font-semibold">Question {idx + 1} / {questions.length}</div>
            <div className="text-xs text-muted-foreground">Answered: {answeredCount}</div>
          </div>
          <div className={`tabular-nums font-mono text-lg font-bold px-3 py-1.5 rounded-lg ${secondsLeft < 300 ? "bg-destructive/15 text-destructive" : "bg-muted"}`}>
            ⏱ {mins}:{secs}
          </div>
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
        </div>

        {idx > 0 && idx % 10 === 0 && <AdSlot label="Advertisement" size="inline" />}

        <div className="flex gap-3">
          <button
            disabled={idx === 0}
            onClick={() => setIdx(idx - 1)}
            className="flex-1 rounded-xl border border-border py-3 font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          {idx + 1 < questions.length ? (
            <button onClick={() => setIdx(idx + 1)} className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-semibold">
              Next
            </button>
          ) : (
            <button onClick={() => setSubmitted(true)} className="flex-1 rounded-xl bg-success text-success-foreground py-3 font-semibold">
              Submit Exam
            </button>
          )}
        </div>

        <div className="grid grid-cols-10 gap-1.5">
          {questions.map((_, i) => {
            const isCur = i === idx;
            const has = answers[i] !== null;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-8 rounded-md text-xs font-medium border ${isCur ? "border-primary bg-primary text-primary-foreground" : has ? "border-primary/30 bg-primary/10" : "border-border bg-background"}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
