"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { Boxes, LineChart, Download } from "lucide-react";

type ReportItem = {
  id: string;
  title: string;
  href?: string;
  icon: ComponentType<{ size?: number }>;
  disabled?: boolean;
};

type ReportGroup = {
  id: string;
  title: string;
  items: ReportItem[];
};

const reportGroups: ReportGroup[] = [
  {
    id: "stock",
    title: "Produk dan Stok",
    items: [
      { id: "hitung-stok", title: "Hitung Stok", icon: Boxes, disabled: true },
      { id: "waste-stok", title: "Waste Stok", icon: Boxes, disabled: true },
      {
        id: "ringkasan-pergerakan-stok",
        title: "Ringkasan Pergerakan Stok",
        icon: Boxes,
        disabled: true,
      },
      { id: "pergerakan-stok", title: "Pergerakan Stok", icon: Boxes, disabled: true },
      { id: "stok-produk", title: "Stok Produk", icon: Boxes, disabled: true },
      { id: "ringkasan-produksi", title: "Ringkasan Produksi", icon: Boxes, disabled: true },
      { id: "biaya-produksi", title: "Biaya Produksi", icon: Boxes, disabled: true },
      {
        id: "laporan-purchase",
        title: "Laporan Purchase",
        icon: Boxes,
        href: "/main/reports/laporan-purchase",
      },
      {
        id: "laporan-catatan-produksi",
        title: "Laporan Catatan Produksi",
        icon: Boxes,
        href: "/main/reports/laporan-catatan-produksi",
      },
    ],
  },
  {
    id: "sales",
    title: "Penjualan",
    items: [
      { id: "penjualan", title: "Penjualan", icon: LineChart, href: "/main/sales/report" },
      { id: "ringkasan-penjualan", title: "Ringkasan Penjualan", icon: LineChart, disabled: true },
      { id: "transaksi-penjualan", title: "Transaksi Penjualan", icon: LineChart, disabled: true },
      { id: "daftar-penjualan", title: "Daftar Penjualan", icon: LineChart, disabled: true },
      { id: "rekapan-cash", title: "Rekapan Cash", icon: LineChart, disabled: true },
      { id: "biaya-produksi-penjualan", title: "Biaya Produksi", icon: LineChart, disabled: true },
      { id: "promosi-penjualan", title: "Promosi Penjualan", icon: LineChart, disabled: true },
      { id: "berdasarkan-pembayaran", title: "Berdasarkan Pembayaran", icon: LineChart, disabled: true },
    ],
  },
  {
    id: "business",
    title: "Bisnis",
    items: [
      { id: "pergerakan-uang", title: "Pergerakan Uang", icon: LineChart, disabled: true },
      {
        id: "laba-rugi",
        title: "Laporan Laba Untung & Rugi",
        icon: LineChart,
        disabled: true,
      },
    ],
  },
];

export default function ReportsPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              Reports Hub
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Laporan
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Pilih menu laporan untuk membuka halaman terkait dan pantau performa bisnis.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Download size={14} />
            Export List
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="space-y-10">
          {reportGroups.map((group) => (
            <div key={group.id}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {group.title}
                  </h2>
                  <div className="mt-2 h-1 w-12 rounded-full bg-amber-200" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {group.items.length} menu
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">Buka laporan</p>
                      </div>
                    </div>
                  );

                  if (item.disabled || !item.href) {
                    return (
                      <div
                        key={item.id}
                        className="cursor-not-allowed rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-slate-400"
                      >
                        {content}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
