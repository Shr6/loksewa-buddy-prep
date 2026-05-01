import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AdSlot } from "@/components/AdSlot";
import { QuizProgress } from "@/components/QuizProgress";
import { CATEGORIES, type CategoryKey } from "@/data/questions";
import { CATEGORY_ICONS } from "@/lib/category-assets";
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
      <div className="min-h-screen">
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
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "🎉" : pct >= 40 ? "💪" : "📚";
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 text-primary-foreground text-center shadow-elevate animate-pop-in">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="text-6xl mb-2">{emoji}</div>
            <p className="text-sm opacity-90">{meta.label} Quiz Complete</p>
            <div className="text-7xl font-bold mt-1 tracking-tight">{pct}%</div>
            <p className="mt-2 opacity-90">You scored {score} out of {questions.length}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate({ to: "/quiz/$cat", params: { cat: catKey } })}
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold hover:opacity-90"
            >
              Try again
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="flex-1 rounded-xl border border-border bg-card py-3.5 font-semibold hover:bg-muted"
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
    <div className="min-h-screen">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        <QuizProgress
          current={idx + 1}
          total={questions.length}
          emoji={meta.emoji}
          label={meta.label}
        />

        {idx === 4 && <AdSlot label="Advertisement" size="inline" />}

        <div key={idx} className="rounded-3xl bg-card border border-border p-5 sm:p-6 shadow-soft animate-pop-in">
          <div className="flex items-start gap-3">
            <img src={CATEGORY_ICONS[catKey]} alt="" loading="lazy" className="h-10 w-10 object-contain shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold leading-snug">{q.question}</h2>
          </div>
          <div className="mt-5 grid gap-2.5">
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              const isCorrect = i === q.correctIndex;
              let cls = "border-border bg-background hover:bg-muted hover:border-primary/30";
              let badgeCls = "bg-muted text-muted-foreground";
              let tail: React.ReactNode = null;
              if (revealed) {
                if (isCorrect) {
                  cls = "border-success bg-success/10 text-foreground";
                  badgeCls = "bg-success text-success-foreground";
                  tail = <span className="text-success font-bold">✓</span>;
                } else if (isSel) {
                  cls = "border-destructive bg-destructive/10 text-foreground";
                  badgeCls = "bg-destructive text-destructive-foreground";
                  tail = <span className="text-destructive font-bold">✗</span>;
                } else {
                  cls = "border-border bg-background opacity-60";
                }
              } else if (isSel) {
                cls = "border-primary bg-primary/5 ring-2 ring-primary/20";
                badgeCls = "bg-primary text-primary-foreground";
              }
              return (
                <button
                  key={i}
                  disabled={revealed}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left rounded-2xl border-2 px-3 sm:px-4 py-3 sm:py-3.5 transition-all flex items-center gap-3 ${cls}`}
                >
                  <span className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg font-bold text-sm transition-colors ${badgeCls}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-sm sm:text-base leading-snug">{opt}</span>
                  {tail}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="mt-5 rounded-2xl bg-muted/70 p-4 text-sm animate-pop-in border border-border">
              <div className="font-semibold mb-1.5 flex items-center gap-2">
                {selected === q.correctIndex ? (
                  <><span className="text-success">✅ Correct!</span></>
                ) : (
                  <><span className="text-destructive">❌ Not quite</span></>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
            </div>
          )}

          <div className="mt-5">
            {!revealed ? (
              <button
                disabled={selected === null}
                onClick={submit}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Check answer
              </button>
            ) : (
              <button
                onClick={next}
                className="w-full rounded-xl bg-hero-gradient text-primary-foreground py-3.5 font-semibold hover:opacity-95 transition-opacity shadow-soft"
              >
                {idx + 1 >= questions.length ? "See results 🏁" : "Next question →"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
