export function FlowDiagram() {
  return (
    <div className="surface p-5">
      <h3 className="font-display text-lg mb-1">Integration Logic</h3>
      <p className="text-xs text-muted-foreground mb-4">How every Commerce7 event maps to Vinosmith inventory moves</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <Rule color="warehouse" trigger="Web Order" action="Deplete Warehouse inventory" />
        <Rule color="tasting" trigger="Tasting Room Order" action="Deplete Tasting Room inventory" />
        <Rule color="allocated" trigger="Wine Club Billing" action="Move Warehouse → Allocated Pool" />
        <Rule color="allocated" trigger="Club Ship" action="Deplete from Allocated Pool" />
        <Rule color="tasting" trigger="Club Pickup" action="Deplete Tasting Room + Remove from Allocated" badge="dual" />
        <div className="rounded-lg border border-dashed p-3 flex items-center justify-center text-muted-foreground italic">
          + extensible to refunds, transfers, audits
        </div>
      </div>
    </div>
  );
}

function Rule({ color, trigger, action, badge }: { color: string; trigger: string; action: string; badge?: string }) {
  return (
    <div className="rounded-lg border p-3 hover:border-foreground/20 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: `var(--${color})` }} />
          <span className="font-medium text-sm">{trigger}</span>
        </div>
        {badge && <span className="text-[9px] uppercase tracking-wider rounded bg-accent px-1.5 py-0.5">{badge}</span>}
      </div>
      <div className="text-muted-foreground pl-4">{action}</div>
    </div>
  );
}
