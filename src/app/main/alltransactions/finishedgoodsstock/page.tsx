"use client";

import { useState, forwardRef } from "react";
import {
  Plus,
  RotateCw,
  RotateCcw,
  Play,
  Download,
  ChevronDown,
} from "lucide-react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OrderHistoryView from "@/components/sections/OrderHistoryView";
import AddProductModal from "@/components/modals/AddProduct";

// DATA FILTER
const skuIndukList = ["Semua SKU", "SKU-001", "SKU-002", "SKU-003"];
const namaBarangList = ["Semua Barang", "Gula", "Susu", "Tepung"];
const kategoriList = ["Semua Kategori", "Makanan", "Minuman", "Snack"];

export default function DashboardPage() {
  const [skuInduk, setSkuInduk] = useState("Semua SKU");
  const [namaBarang, setNamaBarang] = useState("Semua Barang");
  const [kategori, setKategori] = useState("Semua Kategori");

  const [openSkuInduk, setOpenSkuInduk] = useState(false);
  const [openNamaBarang, setOpenNamaBarang] = useState(false);
  const [openKategori, setOpenKategori] = useState(false);

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const DateInput = forwardRef<
    HTMLDivElement,
    { value?: string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className="flex items-center w-50 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
    >
      <span className="flex-1">{value || "dd / mm / yyyy"}</span>
      <FaRegCalendarAlt className="ml-2 text-gray-400" />
    </div>
  ));
  DateInput.displayName = "DateInput";

  return (
    <div className="min-h-screen space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Inventory Bahan Baku
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenAddProduct(true)}
            className="h-9 flex items-center gap-2 rounded-md bg-orange-500 px-4 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Plus size={16} />
            Add Purchase
          </button>

          <button className="h-9 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600 hover:bg-gray-50">
            <RotateCcw size={16} />
            Reset Filter
          </button>

          <button className="h-9 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={16} />
            Export All
          </button>

          <button className="h-9 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={16} />
            Export Filter
          </button>
        </div>
      </div>

      <div className="border border-gray-200" />

      {/* FILTER */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-3">
          {/* ROW 1 */}
          <div className="flex flex-wrap items-end gap-4">
            {/* SKU Induk */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                SKU Induk
              </label>
              <div className="relative p-0.5">
                <button
                  type="button"
                  className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpenSkuInduk((v) => !v)}
                >
                  {skuInduk}
                  <ChevronDown size={16} />
                </button>
                {openSkuInduk && (
                  <div className="absolute z-30 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                    {skuIndukList.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setSkuInduk(item);
                          setOpenSkuInduk(false);
                        }}
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                          skuInduk === item ? "bg-gray-50 font-normal" : ""
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Nama Barang */}
            <div className="flex flex-col gap-1 px-5">
              <label className="text-sm font-medium text-gray-700">
                Nama Barang
              </label>
              <div className="relative p-0.5">
                <button
                  type="button"
                  className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpenNamaBarang((v) => !v)}
                >
                  {namaBarang}
                  <ChevronDown size={16} />
                </button>
                {openNamaBarang && (
                  <div className="absolute z-40 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                    {namaBarangList.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setNamaBarang(item);
                          setOpenNamaBarang(false);
                        }}
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                          namaBarang === item ? "bg-gray-50 font-normal" : ""
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Kategori */}
            <div className="flex flex-col gap-1 px-5">
              <label className="text-sm font-medium text-gray-700">
                Kategori
              </label>
              <div className="relative p-0.5">
                <button
                  type="button"
                  className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpenKategori((v) => !v)}
                >
                  {kategori}
                  <ChevronDown size={16} />
                </button>
                {openKategori && (
                  <div className="absolute z-30 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                    {kategoriList.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setKategori(item);
                          setOpenKategori(false);
                        }}
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                          kategori === item ? "bg-gray-50 font-normal" : ""
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Bulan */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Filter Bulan
              </label>
              <div className="h-9 w-44 z-30">
                <DatePicker
                  selected={dateTo}
                  onChange={(date: Date | null) => setDateTo(date)}
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  customInput={<DateInput />}
                />
              </div>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="flex flex-wrap items-end gap-4">
            {/* Terapkan */}
            <div className="flex items-center pb-3 pl-1">
              <button
                type="button"
                onClick={() => {
                  console.log({
                    skuInduk,
                    namaBarang,
                    kategori,
                    dateTo,
                  });
                }}
                className="h-[35px] rounded-md bg-orange-500 px-4 text-sm font-medium text-white hover:bg-orange-600"
              >
                Terapkan Filter
              </button>
            </div>

            {/* Filter Simulasi */}
            <div className="flex items-end gap-3 px-22">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Lakukan Simulasi
                </label>
                <div className="h-9 w-44 z-30">
                  <DatePicker
                    selected={dateTo}
                    onChange={(date: Date | null) => setDateTo(date)}
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    customInput={<DateInput />}
                  />
                  <div>
                    <label className="text-xs font-thin text-gray-700">
                      Atur Tanggal Simulasi
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mx-6 ">
                {/* Play */}
                <button className="h-9 w-9 rounded-md bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600">
                  <Play size={16} />
                </button>

                {/* Reset */}
                <button className="h-9 w-9 rounded-md bg-green-500 flex items-center justify-center text-white hover:bg-green-600">
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mt-4">
        <label className="text-sm text-gray-700 mr-2">Search :</label>
        <input
          type="text"
          className="flex-1 min-w-[300px] rounded-md border bg-white border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Table */}
      <OrderHistoryView />

      <AddProductModal
        open={openAddProduct}
        onClose={() => setOpenAddProduct(false)}
      />
    </div>
  );
}
