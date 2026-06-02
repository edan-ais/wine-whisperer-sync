import type { ReactNode } from "react";
import type { OrderEvent } from "@/lib/mock-data";
import { ORDER_TYPE_LABEL, SKUS } from "@/lib/mock-data";

const channelMeta: Record<string, { label: string; color: string; icon: ReactNode }> = {
  web: {
    label: "Online Order",
    color: "var(--warehouse)",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
      </svg>
    ),
  },
  tasting_room: {
    label: "Tasting Room",
    color: "var(--tasting)",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l-1 9a4 4 0 11-6 0L8 2zM12 15v6M9 21h6" />
      </svg>
    ),
  },
  club_billing: {
    label: "Wine Club Billing",
    color: "var(--allocated)",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" />
      </svg>
    ),
  },
  club_ship: {
    label: "Wine Club Shipment",
    color: "var(--allocated)",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      </svg>
    ),
  },
  club_pickup: {
    label: "Wine Club Pickup",
    color: "var(--tasting)",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 7v13a2 2 0 002 2h14a2 2 0 002-2V7l-3-5zM3 7h18M16 11a4 4 0 11-8 0" />
      </svg>
    ),
  },
};

export function OrderFeed({ orders }: { orders: OrderEvent[] }) {
  const skuMap = Object.fromEntries(SKUS.map((s) => [s.id, s]));
  return (
    <div className="surface overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b">
        <h3 className="font-display text-lg">Live Order Stream</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Inbound from Commerce7 → routed to Vinosmith</p>
      </div>
      <div className="flex-1 overflow-y-auto divide-y">
        {orders.map((o, idx) => {
          const meta = channelMeta[o.type];
          return (
            <div key={o.id} className={`px-5 py-3 ${idx === 0 ? "bg-accent/40 animate-in fade-in slide-in-from-top-2" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-md px-2 py-1 border"
                      style={{
                        color: meta.color,
                        background: `color-mix(in oklab, ${meta.color} 12%, transparent)`,
                        borderColor: `color-mix(in oklab, ${meta.color} 35%, transparent)`,
                      }}
                    >
                      {meta.icon}
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground tabular-nums" suppressHydrationWarning>
                      {new Date(o.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">{o.qty}× {skuMap[o.skuId]?.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {o.customer} · {o.id}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {o.actions.map((a, i) => (
                      <span key={i} className="text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground border">
                        → {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
