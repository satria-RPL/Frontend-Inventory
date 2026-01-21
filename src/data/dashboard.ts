export const dashboardSummary = {
  sales: {
    value: "10,500",
    growth: "10.5%",
    growthLabel: "Kenaikan 10.5% dari minggu kemarin",
    qris: "5,500",
    cash: "5,000",
    periodLabel: "Jan 3 - Jan 10",
    cadence: "Weekly",
  },
  balance: {
    value: "Rp 10,500,000",
    change: "-10.5%",
    qris: "Rp 5,250,000",
    cash: "Rp 5,250,000",
    dateLabel: "10 Januari",
    cadence: "Daily",
  },
  costProduction: {
    foodCost: "Rp 105,500,000",
    wasteCost: "Rp 50,500,000",
    periodLabel: "5 Hours",
    cadence: "Today",
    highlightIndex: 5,
    highlightValue: "Rp 50,000,000",
  },
  orderMethod: {
    total: "10,500",
    description: "Metode pesanan yang sering digunakan",
    periodLabel: "Jan 3 - Jan 10",
    cadence: "Weekly",
    totals: {
      dineIn: "5012",
      takeAway: "1710",
    },
  },
  categorySales: {
    total: "10,500",
    growth: "10.5%",
  },
  balanceChart: {
    total: "Rp 105,500,000",
    growth: "10.5%",
    periodLabel: "Jan 3 - Jan 10",
    cadence: "Weekly",
    highlightValue: "Rp 20,000,000",
  },
  totalUsers: {
    total: "200",
    description: "Akun yang terdaftar",
  },
};

export const productionData = [
  { time: "10:00", food: 50000000, waste: 15000000 },
  { time: "11:00", food: 32000000, waste: 10000000 },
  { time: "12:00", food: 18000000, waste: 8000000 },
  { time: "13:00", food: 42000000, waste: 12000000 },
  { time: "14:00", food: 30000000, waste: 10000000 },
  { time: "15:00", food: 50000000, waste: 18000000 },
  { time: "16:00", food: 28000000, waste: 9000000 },
];

export const orderData = [
  { label: "Dine In", value: 295, badge: "295" },
  { label: "Take Away", value: 1710 },
];

export const categoryBreakdown = [
  { label: "Makanan", value: 1200 },
  { label: "Minuman", value: 2000 },
  { label: "Add Ons", value: 295, badge: "295" },
  { label: "Lainnya", value: 520 },
];

export const balanceLabels = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export const balanceSeries = [
  {
    label: "Total Pembayaran",
    color: "#f97316",
    values: [45, 38, 50, 32, 48, 36, 50],
  },
  {
    label: "QRIS",
    color: "#ef4444",
    values: [30, 22, 35, 18, 28, 20, 30],
  },
  {
    label: "Tunai",
    color: "#22c55e",
    values: [25, 15, 30, 20, 35, 22, 28],
  },
];

export type ActivityStat = {
  title: string;
  value: string;
  subtitle: string;
  icon:
    | "shopping-cart"
    | "boxes"
    | "clipboard-list"
    | "package"
    | "factory"
    | "shopping-bag";
  highlight?: boolean;
};

export const activityStats: ActivityStat[] = [
  {
    title: "Penjualan",
    value: "5",
    subtitle: "Total Transaksi",
    icon: "shopping-cart",
    highlight: true,
  },
  {
    title: "Produksi",
    value: "5",
    subtitle: "Batch Selesai",
    icon: "boxes",
  },
  {
    title: "Pembelian",
    value: "5",
    subtitle: "Order Pembelian",
    icon: "clipboard-list",
  },
  {
    title: "Qty Terjual",
    value: "5",
    subtitle: "Unit Terjual",
    icon: "package",
  },
  {
    title: "Diproduksi",
    value: "5",
    subtitle: "Unit Diproduksi",
    icon: "factory",
  },
  {
    title: "Dibeli",
    value: "5",
    subtitle: "Unit Dibeli",
    icon: "shopping-bag",
  },
];

export const activityLogs = [
  { label: "Create Opname", time: "17/08/2025 14:00:09" },
  { label: "Create Opname", time: "17/08/2025 14:00:09" },
  { label: "Create Opname", time: "17/08/2025 14:00:09" },
];

export const systemSummaryItems = [
  { label: "Bahan Baku", status: "Good" },
  { label: "Semi-Finished Goods", status: "Good" },
];
