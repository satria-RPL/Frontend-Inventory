"use client";

import Image from "next/image";
import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  ChevronDown,
  ClipboardList,
  Download,
  Factory,
  Info,
  Package,
  RotateCw,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  activityLogs,
  activityStats,
  balanceLabels,
  balanceSeries,
  categoryBreakdown,
  dashboardSummary,
  orderData,
  productionData,
  systemSummaryItems,
} from "@/data/dashboard";
import type { ActivityStat } from "@/data/dashboard";

export default function DashboardPage() {
  const maxProduction = Math.max(
    ...productionData.map((item) => item.food)
  );
  const maxOrderValue = Math.max(...orderData.map((item) => item.value));
  const maxCategoryValue = Math.max(
    ...categoryBreakdown.map((item) => item.value)
  );
  const maxBalance = Math.max(
    ...balanceSeries.flatMap((series) => series.values)
  );
  const chartWidth = 600;
  const chartHeight = 160;
  const chartPadding = 12;
  const buildBalancePoints = (values: number[]) =>
    values
      .map((value, index) => {
        const x =
          (chartWidth / (balanceLabels.length - 1)) * index;
        const y =
          chartHeight -
          chartPadding -
          (value / maxBalance) * (chartHeight - chartPadding * 2);
        return `${x},${y}`;
      })
      .join(" ");

  const activityIconMap: Record<ActivityStat["icon"], typeof ShoppingCart> = {
    "shopping-cart": ShoppingCart,
    boxes: Boxes,
    "clipboard-list": ClipboardList,
    package: Package,
    factory: Factory,
    "shopping-bag": ShoppingBag,
  };

  return (
    <div className="min-h-screen space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <RotateCw size={16} />
            Reset All Today
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <Download size={16} />
            Export All
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
          >
            {dashboardSummary.sales.periodLabel}
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
          >
            {dashboardSummary.sales.cadence}
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <Download size={16} />
            Export Periode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-gray-100 p-1.5">
                <Image
                  src="/icon/statistik.svg"
                  alt="Statistik"
                  width={18}
                  height={18}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Penjualan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                {dashboardSummary.sales.periodLabel}
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                {dashboardSummary.sales.cadence}
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-3xl font-semibold text-gray-900">
                {dashboardSummary.sales.value}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
                {dashboardSummary.sales.growth}
                <ArrowUpRight size={13} />
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Total Penjualan
            </p>
            <span className="mt-3 inline-flex rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">
              {dashboardSummary.sales.growthLabel}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 text-xs text-gray-500">
            <span>
              QRIS : {dashboardSummary.sales.qris} Transaksi | Tunai :{" "}
              {dashboardSummary.sales.cash} Transaksi
            </span>
            <Info size={14} />
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-gray-100 p-1.5">
                <Image
                  src="/icon/coin.svg"
                  alt="Saldo"
                  width={18}
                  height={18}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Total Saldo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                {dashboardSummary.balance.dateLabel}
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                {dashboardSummary.balance.cadence}
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-3xl font-semibold text-gray-900">
                {dashboardSummary.balance.value}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                {dashboardSummary.balance.change}
                <ArrowDownRight size={13} />
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Total Saldo</p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 text-xs text-gray-500">
            <span>
              QRIS : {dashboardSummary.balance.qris} | Tunai :{" "}
              {dashboardSummary.balance.cash}
            </span>
            <Info size={14} />
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-gray-100 p-1.5">
                <Image
                  src="/icon/statistik.svg"
                  alt="Statistik"
                  width={18}
                  height={18}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Cost Produksi
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                {dashboardSummary.costProduction.periodLabel}
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                {dashboardSummary.costProduction.cadence}
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Food Cost</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {dashboardSummary.costProduction.foodCost}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Waste Cost</p>
              <p className="mt-1 text-lg font-semibold text-red-500">
                {dashboardSummary.costProduction.wasteCost}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <div className="flex w-10 flex-col justify-between text-xs text-gray-400">
              {["50JT", "40JT", "30JT", "20JT", "10JT", "5JT"].map(
                (label) => (
                  <span key={label}>{label}</span>
                )
              )}
            </div>
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`grid-${index}`}
                    className="h-px bg-gray-100"
                  />
                ))}
              </div>
              <div className="relative flex h-48 items-end gap-4">
                {productionData.map((item, index) => {
                  const totalHeight =
                    (item.food / maxProduction) * 100;
                  const wasteHeight = Math.max(
                    (item.waste / item.food) * 100,
                    0
                  );
                  return (
                    <div
                      key={item.time}
                      className="relative flex w-full flex-col items-center gap-2"
                    >
                      {index ===
                      dashboardSummary.costProduction.highlightIndex ? (
                        <span className="absolute -top-6 rounded-md bg-green-500 px-2 py-0.5 text-[10px] text-white">
                          {dashboardSummary.costProduction.highlightValue}
                        </span>
                      ) : null}
                      <div className="flex h-36 w-full items-end justify-center">
                        <div
                          className="flex w-6 flex-col justify-end rounded-md bg-orange-200"
                          style={{ height: `${totalHeight}%` }}
                        >
                          <div
                            className="rounded-md bg-orange-500"
                            style={{ height: `${wasteHeight}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {item.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-orange-200" />
              Food Cost
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-orange-500" />
              Waste Cost
            </span>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-gray-100 p-1.5">
                <Image
                  src="/icon/statistik.svg"
                  alt="Statistik"
                  width={18}
                  height={18}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Metode Pemesanan
              </span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-semibold text-gray-900">
              {dashboardSummary.orderMethod.total}
              <span className="ml-2 text-sm font-medium text-gray-500">
                Total Pesanan
              </span>
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {dashboardSummary.orderMethod.description}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
            >
              {dashboardSummary.orderMethod.periodLabel}
              <ChevronDown size={14} />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
            >
              {dashboardSummary.orderMethod.cadence}
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {orderData.map((item) => {
              const width =
                (item.value / maxOrderValue) * 100;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.label}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-gray-100">
                    <div
                      className="relative h-3 rounded-full bg-orange-500"
                      style={{ width: `${width}%` }}
                    >
                      {item.badge ? (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded bg-green-500 px-1.5 text-[10px] text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
            <span>Dine In</span>
            <span>Take Away</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>{dashboardSummary.orderMethod.totals.dineIn}</span>
            <span>{dashboardSummary.orderMethod.totals.takeAway}</span>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-gray-100 p-1.5">
              <Image
                src="/icon/statistik.svg"
                alt="Statistik"
                width={18}
                height={18}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Penjualan
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl font-semibold text-gray-900">
              {dashboardSummary.categorySales.total}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
              {dashboardSummary.categorySales.growth}
              <ArrowUpRight size={13} />
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Total Penjualan</p>

          <div className="mt-4 space-y-3">
            {categoryBreakdown.map((item) => {
              const width =
                (item.value / maxCategoryValue) * 100;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.label}</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100">
                    <div
                      className="relative h-3 rounded-full bg-orange-500"
                      style={{ width: `${width}%` }}
                    >
                      {item.badge ? (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded bg-green-500 px-1.5 text-[10px] text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400">
            <span>0</span>
            <span>200</span>
            <span>500</span>
            <span>1K</span>
            <span>2K</span>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-gray-100 p-1.5">
                <Image
                  src="/icon/coin.svg"
                  alt="Saldo"
                  width={18}
                  height={18}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Saldo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                {dashboardSummary.balanceChart.periodLabel}
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
              >
                {dashboardSummary.balanceChart.cadence}
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-semibold text-gray-900">
              {dashboardSummary.balanceChart.total}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
              {dashboardSummary.balanceChart.growth}
              <ArrowUpRight size={13} />
            </span>
          </div>

          <div className="relative mt-6">
            <span className="absolute right-24 top-6 rounded-md bg-green-500 px-2 py-0.5 text-[10px] text-white">
              {dashboardSummary.balanceChart.highlightValue}
            </span>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-40 w-full"
            >
              {balanceSeries.map((series) => (
                <polyline
                  key={series.label}
                  fill="none"
                  stroke={series.color}
                  strokeWidth="2"
                  points={buildBalancePoints(series.values)}
                />
              ))}
            </svg>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              {balanceLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {balanceSeries.map((series) => (
              <span key={series.label} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                {series.label}
              </span>
            ))}
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-8">
          <div className="text-sm font-semibold text-gray-700">
            Ringkasan Sistem
          </div>
          <div className="mt-4 divide-y divide-gray-100 text-sm text-gray-600">
            {systemSummaryItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3"
              >
                <span>{item.label}</span>
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs text-white">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4 lg:col-span-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-700">
                Total User
              </div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">
                {dashboardSummary.totalUsers.total}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {dashboardSummary.totalUsers.description}
              </div>
            </div>
            <div className="rounded-full border border-gray-200 p-3 text-gray-400">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="col-span-12">
          <div className="text-sm font-semibold text-gray-700">
            Statistik Aktivitas
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {activityStats.map((stat) => {
              const Icon = activityIconMap[stat.icon];
              return (
                <div
                  key={stat.title}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center ${
                    stat.highlight
                      ? "border-orange-200 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div
                    className={`rounded-md p-2 ${
                      stat.highlight
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-gray-700">
                    {stat.title}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {stat.subtitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-sm font-semibold text-gray-700">
            Logs Aktivitas
          </div>
          <div className="mt-4 divide-y divide-gray-100 text-sm text-gray-600">
            {activityLogs.map((log, index) => (
              <div
                key={`${log.label}-${index}`}
                className="flex items-center justify-between py-2"
              >
                <span>{log.label}</span>
                <span className="text-xs text-gray-400">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
