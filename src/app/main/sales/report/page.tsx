"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Download,
  Filter,
  RefreshCcw,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";

const summaryCards = [
  {
    title: "Penjualan",
    value: "10,500",
    sublabel: "Total Penjualan",
    delta: "+10.5%",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "Total Saldo",
    value: "Rp 10,500,000",
    sublabel: "Total Saldo",
    delta: "-10.5%",
    trend: "down",
    icon: Wallet,
  },
  {
    title: "Net Profit",
    value: "Rp 10.500.500",
    sublabel: "Total Penjualan",
    delta: "+10.5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "AOV",
    value: "Rp 50.000.000",
    sublabel: "Total Avarage Order Value",
    delta: "-10.5%",
    trend: "down",
    icon: ShoppingBag,
  },
];

const paymentMethods = [
  { label: "Dine In", value: 62, badge: 295 },
  { label: "Take Away", value: 48 },
];

const salesCategories = [
  { label: "Makanan", value: 72 },
  { label: "Minuman", value: 45 },
  { label: "Add Ons", value: 32, badge: 298 },
  { label: "Lainnya", value: 18 },
];

const topProducts = [
  { label: "Coffee Latte", value: 78 },
  { label: "Nasi Goreng", value: 63 },
  { label: "Espresso", value: 48, badge: 298 },
  { label: "Americano", value: 30 },
];

const barHeights = [38, 28, 16, 34, 26, 42, 24];
const costHeights = [52, 38, 22, 46, 36, 54, 34];
const costYAxis = ["50JT", "40JT", "30JT", "20JT", "10JT", "5JT"];
const hours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const saldoSeries = [
  { label: "Total Pembayaran", color: "#f97316", values: [50, 42, 55, 35, 48, 32, 52] },
  { label: "QRIS", color: "#22c55e", values: [28, 12, 30, 18, 26, 14, 24] },
  { label: "Tunai", color: "#ef4444", values: [24, 20, 12, 26, 16, 10, 22] },
];

export default function SalesReportPage() {
  const maxSaldo = Math.max(
    ...saldoSeries.flatMap((series) => series.values)
  );
  const chartWidth = 420;
  const chartHeight = 140;
  const chartPadding = 16;
  const buildSaldoPoints = (values: number[]) =>
    values
      .map((value, index) => {
        const x = (chartWidth / (days.length - 1)) * index;
        const y =
          chartHeight -
          chartPadding -
          (value / maxSaldo) * (chartHeight - chartPadding * 2);
        return `${x},${y}`;
      })
      .join(" ");
  return (
    <div className="min-h-screen space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Sales Overview</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            <RefreshCcw size={16} />
            Reset Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            <Download size={16} />
            Export All
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            <Filter size={16} />
            Export Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
          <div
            key={card.title}
            className={`col-span-12 rounded-xl border border-gray-200 bg-white p-4 sm:col-span-6 lg:col-span-6 ${
              index < 2 ? "h-[281px]" : "h-[199px]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                  <Icon size={14} />
                </span>
                {card.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1">
                  {index % 2 === 0 ? "Jan 3 - Jan 10" : "10 Januari"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1">
                  {index % 2 === 0 ? "Weekly" : "Daily"}
                  <ChevronDown size={12} />
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {card.value}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {card.sublabel}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  card.trend === "down"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {card.delta}
                {card.trend === "down" ? (
                  <ArrowDownRight size={13} />
                ) : (
                  <ArrowUpRight size={13} />
                )}
              </span>
            </div>
            {index < 2 ? (
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>QRIS : 5,500 Transaksi</span>
                <span className="text-gray-300">|</span>
                <span>Tunai : 5,000 Transaksi</span>
                <span className="ml-auto inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px] text-gray-400">
                  i
                </span>
              </div>
            ) : null}
          </div>
        );
        })}

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <BarChart3 size={14} />
              </span>
              Cost Produksi
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                5 Hours
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Today
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Food Cost</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                Rp 105.500.000
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-red-500">Waste Cost</p>
              <p className="mt-1 text-lg font-semibold text-red-500">
                Rp 50.500.000
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex w-10 flex-col justify-between text-xs text-gray-400">
              {costYAxis.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {costYAxis.map((label) => (
                  <div key={label} className="h-px bg-gray-100" />
                ))}
              </div>
              <div className="relative flex h-40 items-end gap-3">
                {costHeights.map((height, index) => (
                  <div key={`cost-${index}`} className="relative flex-1">
                    <div
                      className="rounded-md bg-orange-200"
                      style={{ height: `${height}%` }}
                    />
                    <div
                      className="-mt-6 rounded-md bg-orange-500"
                      style={{ height: `${Math.max(12, height - 22)}%` }}
                    />
                    {index === 5 ? (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded bg-green-500 px-2 py-0.5 text-[10px] text-white">
                        Rp 50.000.000
                      </span>
                    ) : null}
                    <span className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span />
            {hours.map((label) => (
              <span key={label} className="flex-1 text-center">
                {label}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-200" />
              Food Cost
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Waste Cost
            </span>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <BarChart3 size={14} />
              </span>
              Metode Pemesanan
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Jan 3 - Jan 10
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Weekly
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="mt-4 text-2xl font-semibold text-gray-900">
            10,500
            <span className="ml-2 text-sm font-medium text-gray-500">
              Total Pesanan
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Metode pesanan yang sering di gunakan
          </p>
          <div className="mt-4 space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.label}>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{method.label}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-800" />
                  <div className="h-2 flex-1 rounded-full bg-gray-100">
                    <div
                      className="relative h-2 rounded-full bg-orange-500"
                      style={{ width: `${method.value}%` }}
                    >
                      {method.badge ? (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded bg-green-500 px-1.5 text-[10px] text-white">
                          {method.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>0</span>
            <span>200</span>
            <span>500</span>
            <span>1K</span>
            <span>2K</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Dine In</span>
            <span>Take Away</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>5012</span>
            <span>1710</span>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <BarChart3 size={14} />
              </span>
              Penjualan
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Jan 3 - Jan 10
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Weekly
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900">10,500</p>
            <p className="text-sm text-gray-500">Total Penjualan</p>
          </div>
          <div className="mt-4 space-y-4">
            {salesCategories.map((category) => (
              <div key={category.label}>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{category.label}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-800" />
                  <div className="h-2 flex-1 rounded-full bg-gray-100">
                    <div
                      className="relative h-2 rounded-full bg-orange-500"
                      style={{ width: `${category.value}%` }}
                    >
                      {category.badge ? (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded bg-green-500 px-1.5 text-[10px] text-white">
                          {category.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>0</span>
            <span>200</span>
            <span>500</span>
            <span>1K</span>
            <span>2K</span>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <Wallet size={14} />
              </span>
              Saldo
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Jan 3 - Jan 10
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Weekly
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="mt-4 text-2xl font-semibold text-gray-900">
            Rp 105.500.000
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
              +10.5%
              <ArrowUpRight size={13} />
            </span>
            <span className="text-xs text-gray-500">Total Saldo</span>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-white p-3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {costYAxis.map((label) => (
                  <div key={label} className="h-px bg-gray-100" />
                ))}
              </div>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-40 w-full">
                {saldoSeries.map((series) => (
                  <polyline
                    key={series.label}
                    fill="none"
                    stroke={series.color}
                    strokeWidth="2"
                    points={buildSaldoPoints(series.values)}
                  />
                ))}
                {saldoSeries[0].values.map((_, index) => {
                  const x = (chartWidth / (days.length - 1)) * index;
                  const y = chartHeight - 6;
                  return (
                    <circle key={`dot-${index}`} cx={x} cy={y} r="3" fill="#1f2937" />
                  );
                })}
              </svg>
              <span className="absolute right-24 top-10 rounded bg-green-500 px-2 py-0.5 text-[10px] text-white">
                Rp 20.000.000
              </span>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              {days.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            {saldoSeries.map((series) => (
              <span key={series.label} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: series.color }} />
                {series.label}
              </span>
            ))}
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <BarChart3 size={14} />
              </span>
              Total Profitabilitas
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Jan 3 - Jan 10
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Weekly
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="mt-4 text-2xl font-semibold text-gray-900">
            Rp 105.500.000
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
              +10.5%
              <ArrowUpRight size={13} />
            </span>
            <span className="text-xs text-gray-500">Total Profitabilitas</span>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex w-10 flex-col justify-between text-xs text-gray-400">
              {costYAxis.map((label) => (
                <span key={`profit-${label}`}>{label}</span>
              ))}
            </div>
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {costYAxis.map((label) => (
                  <div key={`profit-grid-${label}`} className="h-px bg-gray-100" />
                ))}
              </div>
              <div className="relative flex h-36 items-end gap-3">
                {barHeights.map((height, index) => (
                  <div key={`profit-${index}`} className="relative flex-1">
                    <div
                      className="rounded-md bg-orange-200"
                      style={{ height: `${height}%` }}
                    />
                    <div
                      className="-mt-5 rounded-md bg-orange-500"
                      style={{ height: `${Math.max(12, height - 14)}%` }}
                    />
                    {index === 5 ? (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded bg-green-500 px-2 py-0.5 text-[10px] text-white">
                        Rp 50.000.000
                      </span>
                    ) : null}
                    <span className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-700" />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                {days.map((label) => (
                  <span key={`profit-day-${label}`}>{label}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-200" />
              Harga Jual
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              HPP
            </span>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <BarChart3 size={14} />
              </span>
              Total Revenue
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                5 Hours
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Today
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="mt-4 text-2xl font-semibold text-gray-900">
            Rp 105.500.000
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex w-10 flex-col justify-between text-xs text-gray-400">
              {costYAxis.map((label) => (
                <span key={`rev-${label}`}>{label}</span>
              ))}
            </div>
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {costYAxis.map((label) => (
                  <div key={`rev-grid-${label}`} className="h-px bg-gray-100" />
                ))}
              </div>
              <div className="relative flex h-36 items-end gap-3">
                {costHeights.map((height, index) => (
                  <div key={`revenue-${index}`} className="relative flex-1">
                    <div
                      className="rounded-md bg-orange-200"
                      style={{ height: `${height}%` }}
                    />
                    <div
                      className="-mt-5 rounded-md bg-orange-500"
                      style={{ height: `${Math.max(12, height - 20)}%` }}
                    />
                    {index === 5 ? (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded bg-green-500 px-2 py-0.5 text-[10px] text-white">
                        Rp 50.000.000
                      </span>
                    ) : null}
                    <span className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-700" />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                {hours.map((label) => (
                  <span key={`rev-${label}`}>{label}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-200" />
              Paid Revenue
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Cost Stock / COGS
            </span>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <BarChart3 size={14} />
              </span>
              Gross Profit
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                5 Hours
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Today
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="mt-4 text-2xl font-semibold text-gray-900">
            Rp 105.500.000
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
              +10.5%
              <ArrowUpRight size={13} />
            </span>
            <span className="text-xs text-gray-500">Gross Profit</span>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex w-10 flex-col justify-between text-xs text-gray-400">
              {costYAxis.map((label) => (
                <span key={`gross-${label}`}>{label}</span>
              ))}
            </div>
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {costYAxis.map((label) => (
                  <div key={`gross-grid-${label}`} className="h-px bg-gray-100" />
                ))}
              </div>
              <div className="relative flex h-36 items-end gap-3">
                {costHeights.map((height, index) => (
                  <div key={`gross-${index}`} className="relative flex-1">
                    <div
                      className="rounded-md bg-orange-200"
                      style={{ height: `${height}%` }}
                    />
                    <div
                      className="-mt-5 rounded-md bg-orange-500"
                      style={{ height: `${Math.max(12, height - 18)}%` }}
                    />
                    {index === 5 ? (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded bg-green-500 px-2 py-0.5 text-[10px] text-white">
                        Rp 50.000.000
                      </span>
                    ) : null}
                    <span className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-700" />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                {hours.map((label) => (
                  <span key={`gross-${label}`}>{label}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-200" />
              Paid Revenue
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Cost Stock / COGS
            </span>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                <BarChart3 size={14} />
              </span>
              Top Produk Terjual
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Jan 3 - Jan 10
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                Weekly
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="mt-4 text-2xl font-semibold text-gray-900">
            10,500
          </div>
          <p className="text-xs text-gray-500">Produk Terlaris</p>
          <div className="mt-4 space-y-4">
            {topProducts.map((product) => (
              <div key={product.label}>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{product.label}</span>
                  {product.badge ? (
                    <span className="rounded bg-green-500 px-1.5 text-[10px] text-white">
                      {product.badge}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-800" />
                  <div className="h-2 flex-1 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{ width: `${product.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>0</span>
            <span>200</span>
            <span>500</span>
            <span>1K</span>
            <span>2K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
