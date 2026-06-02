export function StatCard({ label, value, delta, hint }: { label: string; value: string; delta?: string; hint?: string }) {
  return (
    <div className="surface p-4 relative overflow-hidden">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-medium">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="font-display text-3xl">{value}</div>
        {delta && (
          <div className="text-xs text-[var(--success)] font-medium px-1.5 py-0.5 rounded bg-[color-mix(in_oklab,var(--success)_15%,transparent)]">
            {delta}
          </div>
        )}
      </div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}
