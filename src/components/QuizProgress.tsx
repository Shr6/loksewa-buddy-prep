type Props = {
  current: number;
  total: number;
  label?: string;
  emoji?: string;
  rightSlot?: React.ReactNode;
};

export function QuizProgress({ current, total, label, emoji, rightSlot }: Props) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {emoji && <span className="text-lg">{emoji}</span>}
          {label && <span className="font-semibold text-sm truncate">{label}</span>}
        </div>
        <div className="flex items-center gap-2">
          {rightSlot}
          <span className="tabular-nums text-sm font-semibold rounded-full bg-primary/10 text-primary px-3 py-1">
            {current}/{total}
          </span>
        </div>
      </div>
      <div className="relative h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-hero-gradient transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full opacity-60"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.4s linear infinite",
          }}
        />
      </div>
    </div>
  );
}
