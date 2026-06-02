export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-8 w-8 rounded-full bg-primary flex items-center justify-center">
        <div className="h-3 w-3 rounded-full bg-background" />
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-2 w-0.5 bg-primary" />
      </div>
      <div className="leading-none">
        <div className="font-display text-lg">Cellarbridge</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">C7 × Vinosmith</div>
      </div>
    </div>
  );
}
