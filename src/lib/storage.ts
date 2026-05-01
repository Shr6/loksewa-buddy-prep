import type { CategoryKey } from "@/data/questions";

const KEY = "loksewa_prep_stats_v1";

export type Stats = {
  quizBest: Partial<Record<CategoryKey, { score: number; total: number; pct: number; date: string }>>;
  examBest: { score: number; total: number; pct: number; date: string } | null;
};

const empty: Stats = { quizBest: {}, examBest: null };

export function getStats(): Stats {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function saveQuizResult(cat: CategoryKey, score: number, total: number) {
  const s = getStats();
  const pct = (score / total) * 100;
  const prev = s.quizBest[cat];
  if (!prev || pct > prev.pct) {
    s.quizBest[cat] = { score, total, pct, date: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(s));
  }
}

export function saveExamResult(score: number, total: number) {
  const s = getStats();
  const pct = (score / total) * 100;
  if (!s.examBest || pct > s.examBest.pct) {
    s.examBest = { score, total, pct, date: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(s));
  }
}
