import type { InventoryRow } from "@/lib/mock-data";
import { SKUS } from "@/lib/mock-data";

interface Props {
  inventory: InventoryRow[];
  pulse: Record<string, string | undefined>;
}

export function InventoryTable({ inventory, pulse }: Props) {
  const skuMap = Object.fromEntries(SKUS.map((s) => [s.id, s]));
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h3 className="font-display text-lg">Inventory Pools</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live Vinosmith inventory across pools</p>
        </div>
        <div className="flex gap-3 text-[11px]">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--warehouse)]"/>Warehouse</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--tasting)]"/>Tasting Room</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--allocated)]"/>Allocated Club</span>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
            <th className="px-5 py-2.5 font-medium">SKU</th>
            <th className="px-3 py-2.5 font-medium text-right">Warehouse</th>
            <th className="px-3 py-2.5 font-medium text-right">Tasting Room</th>
            <th className="px-3 py-2.5 font-medium text-right">Allocated</th>
            <th className="px-5 py-2.5 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((row) => {
            const sku = skuMap[row.skuId];
            const total = row.warehouse + row.tastingRoom + row.allocated;
            const flash = pulse[row.skuId];
            return (
              <tr key={row.skuId} className="border-t transition-colors hover:bg-muted/30">
                <td className="px-5 py-3">
                  <div className="font-medium">{sku.name}</div>
                  <div className="text-xs text-muted-foreground">{sku.vintage} · {row.skuId}</div>
                </td>
                <Cell value={row.warehouse} color="warehouse" flash={flash === "warehouse"} />
                <Cell value={row.tastingRoom} color="tasting" flash={flash === "tasting"} />
                <Cell value={row.allocated} color="allocated" flash={flash === "allocated"} />
                <td className="px-5 py-3 text-right font-medium tabular-nums">{total.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value, color, flash }: { value: number; color: string; flash?: boolean }) {
  return (
    <td className="px-3 py-3 text-right tabular-nums">
      <span
        className="inline-block min-w-[3.5rem] rounded px-2 py-0.5 transition-all"
        style={{
          background: flash ? `color-mix(in oklab, var(--${color}) 20%, transparent)` : "transparent",
          color: `var(--${color})`,
          fontWeight: flash ? 600 : 500,
        }}
      >
        {value.toLocaleString()}
      </span>
    </td>
  );
}
