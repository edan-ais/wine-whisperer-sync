export type OrderType = "web" | "tasting_room" | "club_billing" | "club_ship" | "club_pickup";

export interface SKU {
  id: string;
  name: string;
  vintage: number;
  varietal: string;
}

export interface InventoryRow {
  skuId: string;
  warehouse: number;
  tastingRoom: number;
  allocated: number;
}

export interface OrderEvent {
  id: string;
  timestamp: string;
  type: OrderType;
  customer: string;
  skuId: string;
  qty: number;
  source: "Commerce7";
  actions: string[];
}

export const SKUS: SKU[] = [
  { id: "EST-CAB-22", name: "Estate Cabernet Sauvignon", vintage: 2022, varietal: "Cabernet Sauvignon" },
  { id: "RES-PIN-23", name: "Reserve Pinot Noir", vintage: 2023, varietal: "Pinot Noir" },
  { id: "OAK-CHD-23", name: "Oak Hill Chardonnay", vintage: 2023, varietal: "Chardonnay" },
  { id: "ROS-GRN-24", name: "Grenache Rosé", vintage: 2024, varietal: "Rosé" },
  { id: "BLK-SYR-21", name: "Black Label Syrah", vintage: 2021, varietal: "Syrah" },
  { id: "SAU-BLC-24", name: "Sauvignon Blanc", vintage: 2024, varietal: "Sauvignon Blanc" },
];

export const INITIAL_INVENTORY: InventoryRow[] = [
  { skuId: "EST-CAB-22", warehouse: 1240, tastingRoom: 86, allocated: 320 },
  { skuId: "RES-PIN-23", warehouse: 870, tastingRoom: 64, allocated: 210 },
  { skuId: "OAK-CHD-23", warehouse: 1560, tastingRoom: 120, allocated: 180 },
  { skuId: "ROS-GRN-24", warehouse: 2100, tastingRoom: 145, allocated: 90 },
  { skuId: "BLK-SYR-21", warehouse: 540, tastingRoom: 42, allocated: 260 },
  { skuId: "SAU-BLC-24", warehouse: 1820, tastingRoom: 98, allocated: 70 },
];

// 6 months of historical depletions by SKU
const MONTHS = ["Dec '25", "Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26"];
const FORECAST_MONTHS = ["Jun '26", "Jul '26", "Aug '26", "Sep '26", "Oct '26", "Nov '26"];

function seedRand(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function buildDepletions() {
  return SKUS.map((sku, i) => {
    const r = seedRand(i * 137 + 7);
    const base = 60 + Math.floor(r() * 140);
    const history = MONTHS.map((m, idx) => {
      const seasonal = 1 + Math.sin((idx + i) * 0.7) * 0.25;
      const noise = 0.85 + r() * 0.3;
      return { month: m, value: Math.round(base * seasonal * noise), forecast: false };
    });
    // Linear regression-ish forecast with seasonality continuation
    const avg = history.reduce((s, h) => s + h.value, 0) / history.length;
    const trend = (history[5].value - history[0].value) / 5;
    const forecast = FORECAST_MONTHS.map((m, idx) => {
      const seasonal = 1 + Math.sin((6 + idx + i) * 0.7) * 0.25;
      const projected = avg + trend * (idx + 1);
      return { month: m, value: Math.max(20, Math.round(projected * seasonal)), forecast: true };
    });
    return { sku, series: [...history, ...forecast] };
  });
}

const CUSTOMERS = ["Sarah Mitchell", "James O'Brien", "Lily Chen", "Marco Rossi", "Priya Patel", "Daniel Kim", "Emma Walsh", "Tom Becker"];

export function generateOrder(id: number): OrderEvent {
  const r = seedRand(id * 53 + 11);
  const types: OrderType[] = ["web", "tasting_room", "club_billing", "club_ship", "club_pickup"];
  const type = types[Math.floor(r() * types.length)];
  const sku = SKUS[Math.floor(r() * SKUS.length)];
  const qty = 1 + Math.floor(r() * 6);
  const actions: string[] = [];
  switch (type) {
    case "web": actions.push(`Deplete ${qty} from Warehouse`); break;
    case "tasting_room": actions.push(`Deplete ${qty} from Tasting Room`); break;
    case "club_billing": actions.push(`Move ${qty} Warehouse → Allocated Pool`); break;
    case "club_ship": actions.push(`Deplete ${qty} from Allocated Pool`); break;
    case "club_pickup": actions.push(`Deplete ${qty} from Tasting Room`, `Remove ${qty} from Allocated Pool`); break;
  }
  return {
    id: `C7-${100000 + id}`,
    timestamp: new Date(Date.now() - id * 1000 * 60 * 7).toISOString(),
    type,
    customer: CUSTOMERS[Math.floor(r() * CUSTOMERS.length)],
    skuId: sku.id,
    qty,
    source: "Commerce7",
    actions,
  };
}

export const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  web: "Web Order",
  tasting_room: "Tasting Room",
  club_billing: "Club Billing",
  club_ship: "Club Ship",
  club_pickup: "Club Pickup",
};
