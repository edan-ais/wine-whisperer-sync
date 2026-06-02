interface Props {
  lastSync: string;
  eventsProcessed: number;
}

export function SyncStatus({ lastSync, eventsProcessed }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
        </span>
        <span className="text-xs font-medium text-foreground">Live sync</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Commerce7</span>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 5h12m0 0L8 1m4 4L8 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        <span className="font-medium text-foreground">Vinosmith</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="text-xs text-muted-foreground">
        {eventsProcessed.toLocaleString()} events · {lastSync}
      </div>
    </div>
  );
}
