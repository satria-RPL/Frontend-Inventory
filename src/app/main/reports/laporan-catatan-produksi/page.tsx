"use client";

import { Package, BoxIcon, Zap } from "lucide-react";

interface ProductionData {
  id: string;
  tanggalDatang: string;
  kategori: string;
  skuItem: string;
  namaItem: string;
}

const productionData: ProductionData[] = [
  {
    id: "1",
    tanggalDatang: "#TOM5051446",
    kategori: "Dirga Hardeka Agustianjtora",
    skuItem: "Large Candle",
    namaItem: "Makanan",
  },
  {
    id: "2",
    tanggalDatang: "#TOM5051446",
    kategori: "Fani",
    skuItem: "A Cup",
    namaItem: "Dessert",
  },
  {
    id: "3",
    tanggalDatang: "#TOM5051446",
    kategori: "Dirga Hardeka Agustianjtora",
    skuItem: "Large Candle",
    namaItem: "Makanan",
  },
  {
    id: "4",
    tanggalDatang: "#TOM5051446",
    kategori: "Fani",
    skuItem: "A Cup",
    namaItem: "Dessert",
  },
  {
    id: "5",
    tanggalDatang: "#TOM5051446",
    kategori: "Dirga Hardeka Agustianjtora",
    skuItem: "Large Candle",
    namaItem: "Makanan",
  },
];

export default function ProductionReportPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Title */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-800">Laporan Catatan Produksi</h1>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Produksi</p>
              <p className="mt-2 text-lg font-semibold text-gray-800">200</p>
            </div>
            <Package size={30} className="text-gray-300" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Quantity</p>
              <p className="mt-2 text-lg font-semibold text-gray-800">Rp 200</p>
            </div>
            <Zap size={30} className="text-gray-300" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Unique Products</p>
              <p className="mt-2 text-lg font-semibold text-gray-800">200</p>
            </div>
            <BoxIcon size={30} className="text-gray-300" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Materials Used</p>
              <p className="mt-2 text-lg font-semibold text-gray-800">200</p>
            </div>
            <Package size={30} className="text-gray-300" />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Packaging Filter */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">Packaging</label>
            <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <option>Filter Berdasarkan Packs</option>
              <option>Pack 1</option>
              <option>Pack 2</option>
            </select>
          </div>

          {/* Product Filter */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">Produk</label>
            <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <option>Semua Produk</option>
              <option>Produk 1</option>
              <option>Produk 2</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">Tanggal Mulai</label>
            <input type="date" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600" placeholder="dd/mm/yyyy" />
          </div>

          {/* End Date */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">Tanggal Akhir</label>
            <input type="date" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600" placeholder="dd/mm/yyyy" />
          </div>
        </div>

        {/* Apply Filter Button */}
        <button className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600">
          Terapkan Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Search Bar */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Search :</span>
            <input
              type="text"
              placeholder=""
              className="flex-grow rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500">#</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500">Tanggal Datang</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500">Kategori</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500">SKU ITEM</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500">Nama Item</th>
              </tr>
            </thead>
            <tbody>
              {productionData.map((row, index) => (
                <tr key={row.id} className={`border-b border-gray-100 ${index % 2 === 1 ? "bg-orange-50" : "bg-white"} hover:bg-gray-50`}>
                  <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{row.tanggalDatang}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.kategori}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{row.skuItem}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.namaItem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="text-xs text-gray-600">Data di tampilkan 25 dari 2500</div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">Prev</button>
            <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600">Next</button>
            <button className="rounded-lg bg-orange-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-orange-600">1</button>
            <button className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">2</button>
            <button className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">3</button>
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">50</button>
            <span className="text-xs text-gray-600">Go To :</span>
            <input
              type="text"
              placeholder="50"
              className="w-12 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-center text-xs text-gray-700 placeholder:text-gray-400"
            />
            <select className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-700">
              <option>10/Pages</option>
              <option>20/Pages</option>
              <option>50/Pages</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
