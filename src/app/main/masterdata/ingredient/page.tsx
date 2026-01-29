"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, RotateCw, Download, Plus } from "lucide-react";
import AddRawMaterialModal from "@/components/modals/AddIngredient";
import RawMaterialTable from "@/components/sections/IngredientTable";
import Pagination from "@/components/ui/Pagination";
import {
  buildIngredientsExportRows,
  ingredientsExportHeaders,
} from "@/domain/masterdata/ingredientsExport";
import useMasterdataIngredients from "@/lib/hooks/useMasterdataIngredients";
import { downloadCsv } from "@/lib/utils/csvExport";
import type { RawMaterialRow } from "@/types/masterdata";

export default function DashboardPage() {
  const [category, setCategory] = useState("Semua Kategori");
  const [unit, setUnit] = useState("Semua Satuan");
  const [appliedCategory, setAppliedCategory] = useState("Semua Kategori");
  const [appliedUnit, setAppliedUnit] = useState("Semua Satuan");
  const [openCategory, setOpenCategory] = useState(false);
  const [openUnit, setOpenUnit] = useState(false);
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const {
    rows: ingredients,
    categoryOptions,
    unitOptions,
    loading,
    error,
  } = useMasterdataIngredients();

  const filteredRows = useMemo<RawMaterialRow[]>(() => {
    const query = search.trim().toLowerCase();
    return ingredients
      .filter((item) => {
        const matchCategory =
          appliedCategory === "Semua Kategori" ||
          item.kategori === appliedCategory;
        const matchUnit =
          appliedUnit === "Semua Satuan" || item.satuan === appliedUnit;
        const matchSearch =
          !query ||
          [item.skuInduk, item.kategori, item.namaBarang, item.satuan]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query));
        return matchCategory && matchUnit && matchSearch;
      });
  }, [ingredients, appliedCategory, appliedUnit, search]);

  useEffect(() => {
    if (!categoryOptions.includes(category)) {
      setCategory("Semua Kategori");
    }
    if (!categoryOptions.includes(appliedCategory)) {
      setAppliedCategory("Semua Kategori");
    }
    if (!unitOptions.includes(unit)) {
      setUnit("Semua Satuan");
    }
    if (!unitOptions.includes(appliedUnit)) {
      setAppliedUnit("Semua Satuan");
    }
  }, [category, appliedCategory, unit, appliedUnit, categoryOptions, unitOptions]);

  const pagedRows = filteredRows.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleResetFilters = () => {
    setCategory("Semua Kategori");
    setUnit("Semua Satuan");
    setAppliedCategory("Semua Kategori");
    setAppliedUnit("Semua Satuan");
    setSearch("");
    setPage(1);
    setOpenCategory(false);
    setOpenUnit(false);
  };

  const handleApplyFilters = () => {
    setAppliedCategory(category);
    setAppliedUnit(unit);
    setPage(1);
    setOpenCategory(false);
    setOpenUnit(false);
  };

  const handleExportAll = () => {
    const rows = buildIngredientsExportRows(ingredients);
    downloadCsv({
      filename: "ingredients-all.csv",
      headers: ingredientsExportHeaders,
      rows,
    });
  };

  const handleExportFilter = () => {
    const rows = buildIngredientsExportRows(filteredRows);
    downloadCsv({
      filename: "ingredients-filter.csv",
      headers: ingredientsExportHeaders,
      rows,
    });
  };

  const handleEdit = (item: RawMaterialRow) => {
    console.log("Edit raw material:", item);
  };

  const handleDelete = (item: RawMaterialRow) => {
    console.log("Delete raw material:", item);
  };

  const handleView = (item: RawMaterialRow) => {
    console.log("View raw material:", item);
  };

  return (
    <div className="min-h-screen space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Daftar Bahan Baku</h1>

        <div className="flex gap-2 p-2">
          <button
            type="button"
            onClick={() => setOpenAddProduct(true)}
            className="h-9.5 flex items-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Plus size={17} />
            Add Bahan Baku
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-2 bg-white rounded-md border  border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RotateCw size={17} className="inline-block font-bold" />
            Reset Filter
          </button>
          <button
            type="button"
            onClick={handleExportAll}
            className="flex items-center gap-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Download size={17} className="inline-block font-bold" />
            Export All
          </button>
          <div className="flex items-center gap-2 bg-white relative"></div>
          <button
            type="button"
            onClick={handleExportFilter}
            className="flex items-center gap-2 bg-white rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Download size={17} className="inline-block font-bold" />
            Export Filter
          </button>
        </div>
      </div>
      <div className="border border-gray-200"></div>

      {/* filter kategory n label */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-6 p-2">
          {/* Filter Kategori */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">
              Filter Kategori
            </label>
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
                  {categoryOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory(item);
                        setOpenCategory(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-orange-50 ${
                        category === item ? "font-semibold" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Filter satuan */}
          <div className="flex flex-col gap-1 pl-5">
            <label className="text-base font-semibold text-gray-600">
              Satuan
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-48 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenUnit((v) => !v)}
              >
                {unit}
                <ChevronDown size={16} />
              </button>
              {openUnit && (
                <div className="absolute z-30  mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
                  {unitOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setUnit(item);
                        setOpenUnit(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-orange-50 ${
                        unit === item ? "font-semibold" : ""
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
            onClick={handleApplyFilters}
            className=" h-8.75 rounded-md bg-orange-500 px-4 text-sm font-medium text-white hover:bg-orange-600"
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
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="flex-1 min-w-75 rounded-md border bg-white border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        {/* Jika ingin button search, tambahkan di sini */}
        {/* <button className="ml-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">Search</button> */}
      </div>

      <RawMaterialTable
        rows={pagedRows}
        loading={loading}
        error={error}
        page={page}
        perPage={perPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#3f2f23]">
        <p className="font-bold">
          Data ditampilkan{" "}
          <span className="font-bold text-[#3f2f23]">
            {Math.min(page * perPage, filteredRows.length)}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-[#3f2f23]">
            {filteredRows.length}
          </span>
        </p>
        <Pagination
          page={page}
          setPage={setPage}
          total={filteredRows.length}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>
      <AddRawMaterialModal
        open={openAddProduct}
        onClose={() => setOpenAddProduct(false)}
      />
    </div>
  );
}
