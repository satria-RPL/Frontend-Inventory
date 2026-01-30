"use client";

import { useState, forwardRef } from "react";
import { ChevronDown, RotateCw, Download, Plus } from "lucide-react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OrderHistoryView from "@/components/sections/OrderHistoryView";
import AddProductModal from "@/components/modals/AddProduct";

const skuProdukList = ["Semua Jenis", "Makanan", "Minuman", "Snack"];
const namaList = ["Semua Status", "Best Seller", "Promo", "New"];
const labelList = ["Semua Jenis", "Makanan", "Minuman", "Snack"];
const packList = ["Semua Status", "Best Seller", "Promo", "New"];
const bahanBakuList = ["Semua Jenis", "Makanan", "Minuman", "Snack"];

export default function DashboardPage() {
  const [skuProduk, setSkuProduk] = useState("Semua Jenis");
  const [nama, setNama] = useState("Semua Status");
  const [label, setLabel] = useState("Semua Jenis");
  const [pack, setPack] = useState("Semua Status");
  const [bahanBaku, setBahanBaku] = useState("Semua Jenis");

  const [openSKU, setOpenSKU] = useState(false);
  const [openNama, setOpenNama] = useState(false);
  const [openLabel, setOpenLabel] = useState(false);
  const [openPack, setOpenPack] = useState(false);
  const [openBahanBaku, setOpenBahanBaku] = useState(false);

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
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
        <h1 className="text-3xl font-medium">Catatan Produksi</h1>

        <div className="flex gap-2 p-2 ">
          <button
            type="button"
            onClick={() => setOpenAddProduct(true)}
            className="h-[38px] flex items-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Plus size={17} />
            Add Purchase
          </button>

          <button className="flex items-center gap-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <RotateCw size={17} />
            Reset Filter
          </button>

          <div className="flex items-center gap-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={17} />
            Export All
          </div>

          <div className="flex items-center gap-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={17} />
            Export Filter
          </div>
        </div>
      </div>

      <div className="border border-gray-200" />

      {/* FILTER */}
      <div className="w-full">
        <div className="flex flex-wrap items-end gap-6 p-4 rounded-lg border-2 border-gray-200 bg-white">

          {/* SKU Produk */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">
              SKU Produk
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenSKU((v) => !v)}
              >
                {skuProduk}
                <ChevronDown size={16} />
              </button>
              {openSKU && (
                <div className="absolute z-40 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                  {skuProdukList.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSkuProduk(item);
                        setOpenSKU(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        skuProduk === item ? "bg-gray-50 font-normal" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Nama Produk */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">
              Nama Produk
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenNama((v) => !v)}
              >
                {nama}
                <ChevronDown size={16} />
              </button>
              {openNama && (
                <div className="absolute z-40 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                  {namaList.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setNama(item);
                        setOpenNama(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        nama === item ? "bg-gray-50 font-normal" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Label Produk */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">
              Label Produk
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenLabel((v) => !v)}
              >
                {label}
                <ChevronDown size={16} />
              </button>
              {openLabel && (
                <div className="absolute z-40 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                  {labelList.map((item) => (
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

          {/* Pack */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">
              Pack
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenPack((v) => !v)}
              >
                {pack}
                <ChevronDown size={16} />
              </button>
              {openPack && (
                <div className="absolute z-40 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                  {packList.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setPack(item);
                        setOpenPack(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        pack === item ? "bg-gray-50 font-normal" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bahan Baku */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">
              Bahan Baku
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenBahanBaku((v) => !v)}
              >
                {bahanBaku}
                <ChevronDown size={16} />
              </button>
              {openBahanBaku && (
                <div className="absolute z-40 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                  {bahanBakuList.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setBahanBaku(item);
                        setOpenBahanBaku(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        bahanBaku === item ? "bg-gray-50 font-normal" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tanggal Dari */}
          <div className="flex flex-col gap-1 px-5">
            <label className="text-base font-semibold text-gray-600">
              Tanggal Dari
            </label>
            <div className="relative p-0.5 w-48 z-30">
              <DatePicker
                selected={dateFrom}
                onChange={(date: Date | null) => setDateFrom(date)}
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                customInput={<DateInput />}
              />
            </div>
          </div>

          {/* Tanggal Sampai */}
          <div className="flex flex-col gap-1 px-5">
            <label className="text-base font-semibold text-gray-600">
              Tanggal Sampai
            </label>
            <div className="relative p-0.5 w-48 z-30">
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

          {/* Terapkan */}
          <button
            type="button"
            onClick={() => {
              console.log({
                skuProduk,
                nama,
                label,
                pack,
                bahanBaku,
                dateFrom,
                dateTo,
              });
            }}
            className="h-[35px] rounded-md bg-orange-500 px-4 text-sm font-medium text-white hover:bg-orange-600"
          >
            Terapkan Filter
          </button>
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
