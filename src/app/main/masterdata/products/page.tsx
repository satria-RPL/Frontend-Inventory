"use client";

import { useState } from "react";
import {
  ChevronDown,
  RotateCw,
  Download,
  Plus
} from "lucide-react";
import OrderHistoryView from "@/components/sections/OrderHistoryView";

const categories = ["Semua Kategori", "Makanan", "Minuman", "Snack"];
const labels = ["Semua Label", "Best Seller", "Promo", "New"];

export default function DashboardPage() {
  const [category, setCategory] = useState("Semua Kategori");
  const [label, setLabel] = useState("Semua Label");
  const [openCategory, setOpenCategory] = useState(false);
  const [openLabel, setOpenLabel] = useState(false);

  return (
    <div className="min-h-screen space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Dafter Products</h1>

        <div className="flex gap-2 p-2">
          <button
            type="button"
            onClick={() => {
              console.log("Kategori:", category);
              console.log("Label:", label);
            }}
            className="h-[38px] flex items-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Plus size={17} className="inline-block font-bold" />
            Add Product
          </button>
          <button className="flex items-center gap-2 bg-white rounded-md border  border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <RotateCw size={17} className="inline-block font-bold" />
            Reset Filter
          </button>
          <div className="flex items-center gap-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={17} className="inline-block font-bold" />
            Export All
          </div>
          <div className="flex items-center gap-2 bg-white relative"></div>
          <div className="flex items-center gap-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={17} className="inline-block font-bold" />
            Export Filter
          </div>
        </div>
      </div>
      <div className="border border-gray-200"></div>

      {/* filter kategory n label */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-6 p-2">
          {/* Filter Kategori */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">Filter Kategori</label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-48 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenCategory((v) => !v)}
              >
                {category}
                <ChevronDown size={16} />
              </button>
              {openCategory && (
                <div className="absolute z-30 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory(item);
                        setOpenCategory(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        category === item ? "bg-orange-50 font-semibold" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Label */}
          <div className="flex flex-col gap-1 px-15">
            <label className="text-base font-semibold text-gray-600">Filter Label</label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-48 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenLabel((v) => !v)}
              >
                {label}
                <ChevronDown size={16} />
              </button>
              {openLabel && (
                <div className="absolute z-30  mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
                  {labels.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setLabel(item);
                        setOpenLabel(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        label === item ? "bg-gray-50 font-normal" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Button Terapkan Filter */}
          <button
            type="button"
            onClick={() => {
              console.log("Kategori:", category);
              console.log("Label:", label);
            }}
            className="h-[38px] rounded-md bg-orange-500 px-8 text-sm font-medium text-white hover:bg-orange-600"
          >
            Terapkan Filter
          </button>
        </div>
        
      </div>

      {/* Table History Order */}
      <OrderHistoryView />
    </div>
  );
}
