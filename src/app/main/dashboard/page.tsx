"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  RotateCw,
  Download,
} from "lucide-react";
import SalesCategoryCard from "@/components/cards/SalesCategoryCard";

export default function DashboardPage() {
  // State per card
  const [periodAll, setPeriodAll] = useState("Weekly");
  const [openPeriodAll, setOpenPeriodAll] = useState(false);
  const [periodPenjualan, setPeriodPenjualan] = useState("Weekly");
  const [openPeriodPenjualan, setOpenPeriodPenjualan] = useState(false);
  const [periodSaldo, setPeriodSaldo] = useState("Weekly");
  const [openPeriodSaldo, setOpenPeriodSaldo] = useState(false);
  const [periodProfit, setPeriodProfit] = useState("Weekly");
  const [openPeriodProfit, setOpenPeriodProfit] = useState(false);
  const [periodAOV, setPeriodAOV] = useState("Weekly");
  const [openPeriodAOV, setOpenPeriodAOV] = useState(false);

  return (
    <div className="min-h-screen space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Dashboard</h1>

        <div className="flex gap-2 p-2">
          <button className="flex items-center gap-2 bg-white rounded-md border  border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <RotateCw size={17} className="inline-block font-bold" />
            Reset All Today
          </button>
          <div className="flex items-center gap-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={17} className="inline-block font-bold" />
            Export All
          </div>
          <div className="flex items-center gap-2 bg-white relative">
            <button
              onClick={() => setOpenPeriodAll(!openPeriodAll)}
              className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-500 hover:bg-gray-50"
            >
              Jan 3 – Jan 10
              <div className="w-0 h-5 mx-2 top-20 rotate-180 outline-1 outline-neutral-200"></div>
              {periodAll}
              <ChevronDown size={14} />
            </button>

            {openPeriodAll && (
              <div className="absolute right-0 z-10 mt-1 w-28 rounded-md border border-gray-200 bg-white shadow">
                {["Daily", "Weekly", "Yearly"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setPeriodAll(item);
                      setOpenPeriodAll(false);
                    }}
                    className="block w-full px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={17} className="inline-block font-bold" />
            Export All
          </div>
        </div>
      </div>

      {/* GRID WRAPPER */}
      <div className="grid grid-cols-12 gap-6">
        {/* ================= ROW 1 ================= */}
        {/* Penjualan */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border-2 border-gray-300 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100">
                <Image
                  src="/icon/statistik.svg"
                  alt="Statistik"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-5x1 font-medium text-gray-700">
                Penjualan
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenPeriodPenjualan(!openPeriodPenjualan)}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-500 hover:bg-gray-50"
              >
                Jan 3 – Jan 10
                <div className="w-0 h-5 mx-2 top-20 rotate-180 outline-1 outline-neutral-200"></div>
                {periodPenjualan}
                <ChevronDown size={14} />
              </button>

              {openPeriodPenjualan && (
                <div className="absolute right-0 z-10 mt-1 w-28 rounded-md border border-gray-200 bg-white shadow">
                  {["Daily", "Weekly", "Yearly"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setPeriodPenjualan(item);
                        setOpenPeriodPenjualan(false);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-medium">10,500</span>
              <div className="group relative">
                <span className="cursor-pointer rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                  +10.5%{" "}
                  <ArrowUpRight size={15} className="inline-block font-bold" />
                </span>

                <div className="pointer-events-none absolute left-1/2 top-7 w-max -translate-x-1/2 rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 opacity-0 shadow transition group-hover:opacity-100">
                  Kenaikan 10.5% dari minggu kemarin
                </div>
              </div>
            </div>
            <p className="mt-3 text-base text-gray-500">Total Penjualan</p>
          </div>
        </div>

        {/* Total Saldo */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border-2 border-gray-300 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100">
                <Image
                  src="/icon/coin.svg"
                  alt="Statistik"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-4x1 font-medium text-gray-700">
                Total Saldo
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenPeriodSaldo(!openPeriodSaldo)}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-500 hover:bg-gray-50"
              >
                10 january
                <div className="w-0 h-5 mx-2 top-17 rotate-180 outline-1 outline-neutral-200"></div>
                {periodSaldo}
                <ChevronDown size={14} />
              </button>

              {openPeriodSaldo && (
                <div className="absolute right-0 z-10 mt-1 w-25 rounded-md border border-gray-200 bg-white shadow">
                  {["Daily", "Weekly", "Yearly"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setPeriodSaldo(item);
                        setOpenPeriodSaldo(false);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-medium">10,500,000</span>
              <div className="group relative">
                <span className="cursor-pointer rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                  +10.5% <ArrowDownRight size={15} className="inline-block" />
                </span>

                <div className="pointer-events-none absolute left-1/2 top-7 w-max -translate-x-1/2 rounded-md bg-red-100 px-2 py-1 text-xs text-red-700 opacity-0 shadow transition group-hover:opacity-100">
                  penurunan 10.5% dari Hari kemarin
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">Total Penjualan</p>
          </div>
        </div>

        {/* ================= ROW 1.5 ================= */}
        {/* Net Profit */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border-2 border-gray-300 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100">
                <Image
                  src="/icon/statistik.svg"
                  alt="Statistik"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-5x1 font-medium text-gray-700">
                Net Profit
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenPeriodProfit(!openPeriodProfit)}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-500 hover:bg-gray-50"
              >
                Jan 3 – Jan 10
                <div className="w-0 h-5 mx-2 top-20 rotate-180 outline-1 outline-neutral-200"></div>
                {periodProfit}
                <ChevronDown size={14} />
              </button>

              {openPeriodProfit && (
                <div className="absolute right-0 z-10 mt-1 w-28 rounded-md border border-gray-200 bg-white shadow">
                  {["Daily", "Weekly", "Yearly"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setPeriodProfit(item);
                        setOpenPeriodProfit(false);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-medium">10.500.500</span>
              <div className="group relative">
                <span className="cursor-pointer rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                  +10.5%{" "}
                  <ArrowUpRight size={15} className="inline-block font-bold" />
                </span>

                <div className="pointer-events-none absolute left-1/2 top-7 w-max -translate-x-1/2 rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 opacity-0 shadow transition group-hover:opacity-100">
                  Kenaikan 10.5% dari minggu kemarin
                </div>
              </div>
            </div>
            <p className="mt-3 text-base text-gray-500">Total Penjualan</p>
          </div>
        </div>

        {/* AOV */}
        <div className="col-span-12 lg:col-span-6 rounded-xl border-2 border-gray-300 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gray-100">
                <Image
                  src="/icon/coin.svg"
                  alt="Statistik"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-4x1 font-medium text-gray-700">AOV</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenPeriodAOV(!openPeriodAOV)}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-500 hover:bg-gray-50"
              >
                10 january
                <div className="w-0 h-5 mx-2 top-17 rotate-180 outline-1 outline-neutral-200"></div>
                {periodAOV}
                <ChevronDown size={14} />
              </button>

              {openPeriodAOV && (
                <div className="absolute right-0 z-10 mt-1 w-25 rounded-md border border-gray-200 bg-white shadow">
                  {["Daily", "Weekly", "Yearly"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setPeriodAOV(item);
                        setOpenPeriodAOV(false);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-medium">10,500,000</span>
              <div className="group relative">
                <span className="cursor-pointer rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                  +10.5% <ArrowDownRight size={15} className="inline-block" />
                </span>

                <div className="pointer-events-none absolute left-1/2 top-7 w-max -translate-x-1/2 rounded-md bg-red-100 px-2 py-1 text-xs text-red-700 opacity-0 shadow transition group-hover:opacity-100">
                  penurunan 10.5% dari Hari kemarin
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">Total Penjualan</p>
          </div>
        </div>

        {/* ================= ROW 2 ================= */}
        {/* Penjualan by Category */}
        <SalesCategoryCard />

        {/* Saldo Chart */}
        <div className="col-span-12 lg:col-span-8 rounded-xl border border-gray-300 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Saldo</span>
            <span className="text-xs text-gray-400">
              Jan 3 – Jan 10 · Weekly
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-medium">Rp 105,500,000</span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
              +10.5%
            </span>
          </div>

          {/* Placeholder Chart */}
          <div className="mt-6 flex h-48 items-end gap-4">
            {[40, 25, 15, 45, 30, 50, 20].map((h, i) => (
              <div
                key={i}
                className="w-full rounded-md bg-orange-500"
                style={{ height: `${h * 3}px` }}
              />
            ))}
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-400">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        {/* ================= ROW 3 ================= */}

        <div className="col-span-12 rounded-xl border border-gray-300 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Filter:</span>
            <span className="text-orange-500">
              Bulan November 2026 (01 Nov 2025 – 30 Nov 2025)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
