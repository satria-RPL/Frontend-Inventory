"use client";

import { useState, forwardRef } from "react";
import { ChevronDown, RotateCw, Download, Plus } from "lucide-react";
import { FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OrderHistoryView from "@/components/sections/OrderHistoryView";
import AddProductModal from "@/components/modals/AddProduct";

const categories = ["Semua Jenis", "Makanan", "Minuman", "Snack"];
const labels = ["Semua Status", "Best Seller", "Promo", "New"];

export default function DashboardPage() {
  const [category, setCategory] = useState("Semua Jenis");
  const [label, setLabel] = useState("Semua Status");
  const [openCategory, setOpenCategory] = useState(false);
  const [openLabel, setOpenLabel] = useState(false);
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [openDateFrom, setOpenDateFrom] = useState(false);
  const [openDateTo, setOpenDateTo] = useState(false);

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
      {/*  */}
      <FaRegCalendarAlt className="ml-2 text-gray-400" />
    </div>
  ));
  DateInput.displayName = "DateInput";

  return (
    <div className="min-h-screen space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Purchase Items</h1>

        {/* Filter */}
        <div className="flex gap-2 p-2 ">
          <button
            type="button"
            onClick={() => setOpenAddProduct(true)}
            className="h-[38px] flex items-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Plus size={17} />
            Add Purchase
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
      <div className="w-full">
        <div className="flex flex-wrap items-end gap-6 p-4 rounded-lg border-2 border-gray-200 bg-white">
          {/* Filter Kategori */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">
              Kategori
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenCategory((v) => !v)}
              >
                {category}
                <ChevronDown size={16} />
              </button>
              {openCategory && (
                <div className="absolute z-30  mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory(item);
                        setOpenCategory(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        category === item ? "bg-gray-50 font-normal" : ""
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
          <div className="flex flex-col gap-1 px-5">
            <label className="text-base font-semibold text-gray-600">
              Filter Items
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-50 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenLabel((v) => !v)}
              >
                {label}
                <ChevronDown size={16} />
              </button>
              {openLabel && (
                <div className="absolute z-30  mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
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
          {/* Filter Tanggal Dari */}
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
          {/* Filter Tanggal Sampai */}
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
          {/* Button Terapkan Filter */}
          <button
            type="button"
            onClick={() => {
              console.log("Kategori:", category);
              console.log("Label:", label);
            }}
            className=" h-[35px] rounded-md bg-orange-500 px-4 text-sm font-medium text-white hover:bg-orange-600"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
      {/* Search input and button */}
      <div className="flex items-center gap-2 mt-4">
        <label className="text-sm text-gray-700 mr-2">Search :</label>
        <input
          type="text"
          placeholder=""
          className="flex-1 min-w-[300px] rounded-md border bg-white border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        {/* Jika ingin button search, tambahkan di sini */}
        {/* <button className="ml-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">Search</button> */}
      </div>

      {/* Table History Order */}
      <OrderHistoryView />
      <AddProductModal
        open={openAddProduct}
        onClose={() => setOpenAddProduct(false)}
      />
    </div>
  );
}
