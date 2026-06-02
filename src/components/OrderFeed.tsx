import type { OrderEvent } from "@/lib/mock-data";
import { ORDER_TYPE_LABEL, SKUS } from "@/lib/mock-data";

const typeColor: Record<string, string> = {
  web: "var(--warehouse)",
  tasting_room: "var(--tasting)",
  club_billing: "var(--allocated)",
  club_ship: "var(--allocated)",
  club_pickup: "var(--tasting)",
};

export function OrderFeed({ orders }: { orders: OrderEvent[] }) {
  const skuMap = Object.fromEntries(SKUS.map((s) => [s.id, s]));
  return (
    <div className="surface overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b">
        <h3 className="font-display text-lg">Live Order Stream</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Inbound from Commerce7 → routed to Vinosmith</p>
      </div>
      <div className="flex-1 overflow-y-auto divide-y max-h-[520px]">
        {orders.map((o, idx) => (
          <div key={o.id} className={`px-5 py-3 ${idx === 0 ? "bg-accent/40 animate-in fade-in slide-in-from-top-2" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                  style={{ background: typeColor[o.type] }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{ORDER_TYPE_LABEL[o.type]}</span>
                    <span className="text-xs text-muted-foreground">· {o.id}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {o.customer} · {o.qty}× {skuMap[o.skuId]?.name}
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
              <span className="text-[10px] text-muted-foreground tabular-nums shrink-0" suppressHydrationWarning>
                {new Date(o.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
