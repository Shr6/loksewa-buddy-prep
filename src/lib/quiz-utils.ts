import { QUESTIONS, type CategoryKey, type Question } from "@/data/questions";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickQuizQuestions(cat: CategoryKey, n = 10): Question[] {
  return shuffle(QUESTIONS[cat]).slice(0, n);
}

export function pickExamQuestions(n = 50): Question[] {
  const all: Question[] = [];
  (Object.keys(QUESTIONS) as CategoryKey[]).forEach((k) => all.push(...QUESTIONS[k]));
  return shuffle(all).slice(0, n);
}
