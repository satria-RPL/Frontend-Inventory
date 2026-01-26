"use client";

import { CalendarDays, ChevronDown, RefreshCcw } from "lucide-react";

const activityRows = [
  {
    id: 1,
    datetime: "17/12/2025 10:12:36",
    category: "Permission",
    activity: "View",
    description: "User viewed permissions list",
    user: "Agus Negro",
  },
  {
    id: 2,
    datetime: "17/12/2025 10:12:36",
    category: "Role",
    activity: "View",
    description: "User viewed roles list",
    user: "Kasir #1",
  },
  {
    id: 3,
    datetime: "17/12/2025 10:12:36",
    category: "Permission",
    activity: "Input",
    description: "User logged in successfully",
    user: "Kasir #2",
  },
  {
    id: 4,
    datetime: "17/12/2025 10:12:36",
    category: "Auth",
    activity: "View",
    description: "Pengguna melihat halaman manajemen penjualan",
    user: "BackOffice",
  },
  {
    id: 5,
    datetime: "17/12/2025 10:12:36",
    category: "Finished Goods",
    activity: "Input",
    description: "User viewed roles list",
    user: "PIC",
  },
];

export default function ActivityLogPage() {
  return (
    <div className="min-h-screen space-y-4 bg-gray-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-gray-900">
          User Management
        </h1>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
        >
          <RefreshCcw size={14} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div>
            <label className="text-[11px] font-medium text-gray-500">
              Filter User
            </label>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500"
            >
              Semua User
              <ChevronDown size={14} />
            </button>
          </div>
          <div>
            <label className="text-[11px] font-medium text-gray-500">
              Filter User
            </label>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500"
            >
              Semua User
              <ChevronDown size={14} />
            </button>
          </div>
          <div>
            <label className="text-[11px] font-medium text-gray-500">
              Tanggal Mulai
            </label>
            <div className="mt-2 flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500">
              <span>dd/mm/yyyy</span>
              <CalendarDays size={14} />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              className="w-full rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-white"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
          <div className="grid grid-cols-[48px_180px_140px_120px_1fr_140px] gap-0 border-b border-gray-200 bg-gray-50 px-4 py-2 text-[11px] text-gray-500">
            <span>#</span>
            <span>Tanggal & Waktu</span>
            <span>Kategori</span>
            <span>Aktivitas</span>
            <span>Keterangan</span>
            <span>User</span>
          </div>
          {activityRows.map((row) => (
            <div
              key={row.id}
              className={`grid grid-cols-[48px_180px_140px_120px_1fr_140px] gap-0 px-4 py-3 text-[11px] text-gray-600 ${
                row.id % 2 === 0 ? "bg-orange-50" : "bg-white"
              }`}
            >
              <span className="text-gray-500">{row.id}</span>
              <span>{row.datetime}</span>
              <span>{row.category}</span>
              <span>{row.activity}</span>
              <span className="text-gray-700">{row.description}</span>
              <span>{row.user}</span>
            </div>
          ))}
          <div className="h-28 bg-white" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500">
          <span>Data di tampilkan 25 dari 2500</span>
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-500">
              Prev
            </button>
            <button className="rounded-md bg-orange-500 px-2 py-1 text-[11px] text-white">
              Next
            </button>
            <button className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-500">
              1
            </button>
            <button className="rounded-md bg-orange-500 px-2 py-1 text-[11px] text-white">
              2
            </button>
            <button className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-500">
              3
            </button>
            <button className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-500">
              50
            </button>
            <div className="flex items-center gap-2">
              <span>Go to:</span>
              <div className="rounded-md border border-gray-200 px-2 py-1">50</div>
            </div>
            <button className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-500">
              10/Pages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
