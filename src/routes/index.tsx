import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { SyncStatus } from "@/components/SyncStatus";
import { StatCard } from "@/components/StatCard";
import { InventoryTable } from "@/components/InventoryTable";
import { OrderFeed } from "@/components/OrderFeed";
import { DepletionsChart } from "@/components/DepletionsChart";
import { FlowDiagram } from "@/components/FlowDiagram";
import { INITIAL_INVENTORY, generateOrder, type InventoryRow, type OrderEvent } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cellarbridge — Commerce7 × Vinosmith Inventory Sync" },
      { name: "description", content: "Prototype of the Commerce7 to Vinosmith inventory integration with live depletions and 6-month forecasting." },
    ],
  }),
  component: Index,
});

function Index() {
  const [inventory, setInventory] = useState<InventoryRow[]>(INITIAL_INVENTORY);
  const [orders, setOrders] = useState<OrderEvent[]>(() => Array.from({ length: 8 }, (_, i) => generateOrder(i + 1)));
  const [pulse, setPulse] = useState<Record<string, string | undefined>>({});
  const [eventsProcessed, setEventsProcessed] = useState(14782);
  const [auto, setAuto] = useState(true);
  const counter = useRef(100);

  function applyOrder(o: OrderEvent) {
    setInventory((prev) => prev.map((row) => {
      if (row.skuId !== o.skuId) return row;
      const next = { ...row };
      switch (o.type) {
        case "web": next.warehouse = Math.max(0, next.warehouse - o.qty); break;
        case "tasting_room": next.tastingRoom = Math.max(0, next.tastingRoom - o.qty); break;
        case "club_billing":
          next.warehouse = Math.max(0, next.warehouse - o.qty);
          next.allocated += o.qty;
          break;
        case "club_ship": next.allocated = Math.max(0, next.allocated - o.qty); break;
        case "club_pickup":
          next.tastingRoom = Math.max(0, next.tastingRoom - o.qty);
          next.allocated = Math.max(0, next.allocated - o.qty);
          break;
      }
      return next;
    }));
    const pool = o.type === "web" ? "warehouse" : o.type === "tasting_room" || o.type === "club_pickup" ? "tasting" : "allocated";
    setPulse({ [o.skuId]: pool });
    setTimeout(() => setPulse({}), 900);
  }

  function fireOne() {
    const o = generateOrder(counter.current++);
    o.timestamp = new Date().toISOString();
    setOrders((prev) => [o, ...prev].slice(0, 30));
    setEventsProcessed((n) => n + 1);
    applyOrder(o);
  }

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(fireOne, 3500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  const totalBottles = inventory.reduce((s, r) => s + r.warehouse + r.tastingRoom + r.allocated, 0);
  const allocated = inventory.reduce((s, r) => s + r.allocated, 0);

  return (
    <div className="min-h-screen">
      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1 className="font-display text-2xl leading-tight">Margerum Wines Inventory Tracker</h1>
          <div className="flex items-center gap-3 flex-wrap">
            
            <button
              onClick={fireOne}
              className="rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:brightness-110 transition shadow-[0_6px_20px_-6px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
            >
              Simulate Order
            </button>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="accent-[var(--primary)]" />
              Auto-stream
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Bottles" value={totalBottles.toLocaleString()} hint="Across all pools" />
          <StatCard label="Allocated to Club" value={allocated.toLocaleString()} hint="Awaiting fulfillment" />
          <StatCard label="Events Today" value={eventsProcessed.toLocaleString()} delta="+1.2k" hint="Synced both directions" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InventoryTable inventory={inventory} pulse={pulse} />
            <DepletionsChart />
          </div>
          <div className="lg:col-span-1">
            <OrderFeed orders={orders} />
          </div>
        </div>

        <FlowDiagram />
      </main>
    </div>
  );
}
