import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AdSlot } from "@/components/AdSlot";
import { CATEGORIES, type CategoryKey } from "@/data/questions";
import { pickQuizQuestions } from "@/lib/quiz-utils";
import { saveQuizResult } from "@/lib/storage";

export const Route = createFileRoute("/quiz/$cat")({
  component: QuizPage,
});

function QuizPage() {
  const { cat } = Route.useParams();
  const navigate = useNavigate();
  const catKey = cat as CategoryKey;
  const meta = CATEGORIES.find((c) => c.key === catKey);

  const questions = useMemo(() => pickQuizQuestions(catKey, 10), [catKey]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!meta) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p>Unknown category.</p>
          <button onClick={() => navigate({ to: "/quiz" })} className="mt-4 underline">Back</button>
        </main>
      </div>
    );
  }

  const q = questions[idx];

  const submit = () => {
    if (selected === null) return;
    if (selected === q.correctIndex) setScore((s) => s + 1);
    setRevealed(true);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      saveQuizResult(catKey, score, questions.length);
      setDone(true);
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-8 text-primary-foreground text-center shadow-[var(--shadow-elevate)]">
            <p className="text-sm opacity-90">{meta.label} Quiz Complete</p>
            <div className="text-6xl font-bold mt-2">{pct}%</div>
            <p className="mt-2 opacity-90">You scored {score} out of {questions.length}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate({ to: "/quiz/$cat", params: { cat: catKey } })}
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90"
            >
              Try again
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="flex-1 rounded-xl border border-border py-3 font-semibold hover:bg-muted"
            >
              Home
            </button>
          </div>
          <AdSlot label="Sponsored" size="inline" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{meta.emoji} {meta.label}</span>
          <span className="text-muted-foreground">Question {idx + 1} / {questions.length}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-[image:var(--gradient-hero)] transition-all"
            style={{ width: `${((idx + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        {idx === 4 && <AdSlot label="Advertisement" size="inline" />}

        <div className="rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-lg font-semibold leading-snug">{q.question}</h2>
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              const isCorrect = i === q.correctIndex;
              let cls = "border-border bg-background hover:bg-muted";
              if (revealed) {
                if (isCorrect) cls = "border-success bg-success/10 text-foreground";
                else if (isSel) cls = "border-destructive bg-destructive/10 text-foreground";
                else cls = "border-border bg-background opacity-70";
              } else if (isSel) {
                cls = "border-primary bg-primary/5";
              }
              return (
                <button
                  key={i}
                  disabled={revealed}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-colors ${cls}`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="mt-4 rounded-xl bg-muted p-4 text-sm">
              <div className="font-semibold mb-1">
                {selected === q.correctIndex ? "✅ Correct!" : "❌ Not quite"}
              </div>
              <p className="text-muted-foreground">{q.explanation}</p>
            </div>
          )}

          <div className="mt-5">
            {!revealed ? (
              <button
                disabled={selected === null}
                onClick={submit}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-50 hover:opacity-90"
              >
                Check answer
              </button>
            ) : (
              <button
                onClick={next}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90"
              >
                {idx + 1 >= questions.length ? "See results" : "Next question"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
