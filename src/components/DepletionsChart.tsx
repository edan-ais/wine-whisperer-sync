import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { buildDepletions, SKUS } from "@/lib/mock-data";

export function DepletionsChart() {
  const data = useMemo(() => buildDepletions(), []);
  const [selected, setSelected] = useState<string>(SKUS[0].id);
  const current = data.find((d) => d.sku.id === selected)!;

  const totalHistory = current.series.filter((s) => !s.forecast).reduce((s, x) => s + x.value, 0);
  const totalForecast = current.series.filter((s) => s.forecast).reduce((s, x) => s + x.value, 0);
  const delta = ((totalForecast - totalHistory) / totalHistory) * 100;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4 border-b">
        <div>
          <h3 className="font-display text-lg">Depletions by SKU · Monthly</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            6 months actual + 6 months forecast · {current.sku.name} {current.sku.vintage}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Forecast vs prior 6 mo</div>
            <div className={`text-sm font-semibold tabular-nums ${delta >= 0 ? "text-[var(--success)]" : "text-destructive"}`}>
              {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
            </div>
          </div>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SKUS.map((s) => (
              <option key={s.id} value={s.id}>{s.name} {s.vintage}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-5 pt-3">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={current.series} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="actualG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--allocated)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--allocated)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(v: number, _n, p: any) => [`${v} bottles`, p.payload.forecast ? "Forecast" : "Actual"]}
            />
            <ReferenceLine x="May '26" stroke="var(--muted-foreground)" strokeDasharray="3 3" label={{ value: "Today", fill: "var(--muted-foreground)", fontSize: 10, position: "top" }} />
            <Area
              type="monotone"
              dataKey={(d: any) => (d.forecast ? null : d.value)}
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#actualG)"
              name="Actual"
            />
            <Area
              type="monotone"
              dataKey={(d: any) => (d.forecast ? d.value : null)}
              stroke="var(--allocated)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#forecastG)"
              name="Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
