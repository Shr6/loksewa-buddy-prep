type Props = { label?: string; size?: "banner" | "inline" };

export function AdSlot({ label = "Advertisement", size = "banner" }: Props) {
  const h = size === "banner" ? "h-20 sm:h-24" : "h-16 sm:h-20";
  return (
    <div
      className={`w-full ${h} rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground`}
      aria-label="Ad placeholder"
    >
      {label}
    </div>
  );
}
