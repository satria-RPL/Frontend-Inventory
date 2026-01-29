"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, RotateCw, Download, Plus } from "lucide-react";
import AddProductModal from "@/components/modals/AddProduct";
import AddOnsTable from "@/components/sections/AddOnsTable";
import Pagination from "@/components/ui/Pagination";
import {
  addOnsExportHeaders,
  buildAddOnsExportRows,
} from "@/domain/masterdata/addOnsExport";
import useMasterdataAddOns from "@/lib/hooks/useMasterdataAddOns";
import { downloadCsv } from "@/lib/utils/csvExport";
import type { AddOnRow } from "@/types/masterdata";

type FilterState = {
  category: string;
  search: string;
};

type DropdownKey = "category";

const defaultFilters: FilterState = {
  category: "Semua Kategori",
  search: "",
};

export default function DashboardPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { rows, categoryOptions, loading, error } = useMasterdataAddOns();

  const filteredRows = useMemo(() => {
    const normalizedSearch = appliedFilters.search.trim().toLowerCase();

    return rows.filter((item) => {
      const matchCategory =
        appliedFilters.category === "Semua Kategori" ||
        item.category === appliedFilters.category;
      const matchSearch =
        normalizedSearch === "" ||
        [item.sku, item.name, item.category]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch)
          );

      return matchCategory && matchSearch;
    });
  }, [appliedFilters, rows]);

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / perPage));
  const pagedRows = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    return filteredRows.slice(startIndex, startIndex + perPage);
  }, [filteredRows, page, perPage]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((current) => (current === key ? null : key));
  };

  const handleSelectFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
    setOpenDropdown(null);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
    setOpenDropdown(null);
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setAppliedFilters((prev) => ({ ...prev, search: value }));
    setPage(1);
  };

  const handleExportAll = () => {
    const exportRows = buildAddOnsExportRows(rows);
    downloadCsv({
      filename: "add-ons-all.csv",
      headers: addOnsExportHeaders,
      rows: exportRows,
    });
  };

  const handleExportFilter = () => {
    const exportRows = buildAddOnsExportRows(filteredRows);
    downloadCsv({
      filename: "add-ons-filter.csv",
      headers: addOnsExportHeaders,
      rows: exportRows,
    });
  };

  const handleEdit = (item: AddOnRow) => {
    console.log("Edit add-ons:", item);
  };

  const handleDelete = (item: AddOnRow) => {
    console.log("Delete add-ons:", item);
  };

  const handleView = (item: AddOnRow) => {
    console.log("View add-ons:", item);
  };

  return (
    <div className="min-h-screen space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Daftar Add-Ons</h1>

        <div className="flex gap-2 p-2">
          <button
            type="button"
            onClick={() => setOpenAddProduct(true)}
            className="h-9.5 flex items-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Plus size={17} />
            Add Additional Items
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

      {/* filter kategori */}
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
                onClick={() => toggleDropdown("category")}
              >
                {filters.category}
                <ChevronDown size={16} />
              </button>
              {openDropdown === "category" && (
                <div className="absolute z-30 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
                  {categoryOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        handleSelectFilter("category", item);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        filters.category === item ? "bg-orange-50 font-semibold" : ""
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
          value={filters.search}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="flex-1 min-w-75 rounded-md border bg-white border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        {/* Jika ingin button search, tambahkan di sini */}
        {/* <button className="ml-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">Search</button> */}
      </div>

      <AddOnsTable
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
      <AddProductModal
        open={openAddProduct}
        onClose={() => setOpenAddProduct(false)}
      />
    </div>
  );
}
