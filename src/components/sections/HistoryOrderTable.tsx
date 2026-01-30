"use client";

import { Eye, Trash2 } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

export type HistoryOrderRow = {
  id: number | string;
  sku: string;
  namaProduk: string;
  packaging: string;
  kategori: string;
  label: string;
  dibuat: string;
};

type HistoryOrderTableProps = {
  rows: HistoryOrderRow[];
  total: number;
  page: number;
  perPage: number;
  setPage: (n: number) => void;
  setPerPage: (n: number) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onDelete?: (row: HistoryOrderRow) => void;
  onView?: (row: HistoryOrderRow) => void;
};

export default function HistoryOrderTable({
  rows,
  total,
  page,
  perPage,
  setPage,
  setPerPage,
  loading = false,
  error = null,
  emptyMessage = "Data tidak ditemukan.",
  onDelete,
  onView,
}: HistoryOrderTableProps) {
  const startIndex = (page - 1) * perPage;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl">
      {/* ==============================
          TABLE WRAPPER
          - Rounded
          - Scrollable
          - Sticky header
         ============================== */}
      <div className="relative min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-3xl bg-white border-2 border-gray-200">
        <table className="w-full border-separate border-spacing-0 text-sm">
          {/* ==============================
              TABLE HEADER
              ============================== */}
          <thead className="sticky top-0 z-10 bg-gray-100 border border-gray-200">
            <tr className="text-left text-xs font-medium border border-gray-200 text-[#9a9a9a]">
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">SKU Induk</th>
              <th className="px-4 py-3">Nama Produk</th>
              <th className="px-4 py-3">Packaging</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Dibuat</th>
              <th className="rounded-tr-2xl px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          {/* ==============================
              TABLE BODY
              ============================== */}
          <tbody className="text-[#6f6f6f]">
            {loading && (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-sm text-[#9a9a9a]"
                >
                  Memuat data...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-sm text-[#9a9a9a]"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              rows.map((item, index) => (
              <tr
                key={item.id}
                className="
                  border-b border-gray-200
                  even:bg-[#fff3ec]
                  even:[&>td]:font-semibold
                  odd:[&>td]:font-normal
                  hover:bg-[#fff0e8]
                "
              >
                {/* Nomor urut global */}
                <td className="px-4 py-3 text-center">
                  {startIndex + index + 1}
                </td>

                <td className="px-4 py-3 font-medium">{item.sku}</td>

                <td className="px-4 py-3 font-medium text-[#3f2f23]">
                  {item.namaProduk}
                </td>

                <td className="px-4 py-3">{item.packaging}</td>

                <td className="px-4 py-3">{item.kategori}</td>

                <td className="px-4 py-3">{item.label}</td>

                <td className="px-4 py-3 whitespace-nowrap">{item.dibuat}</td>

                {/* Action Buttons */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {/* Delete */}
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ef4444] text-white hover:opacity-90"
                      title="Delete"
                      type="button"
                      onClick={() => onDelete?.(item)}
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* View Detail */}
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#22c55e] text-white hover:opacity-90"
                      title="View"
                      type="button"
                      onClick={() => onView?.(item)}
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==============================
          TABLE FOOTER
          - Info jumlah data
          - Pagination
         ============================== */}
      <div className="py-5 mt-4 flex items-center font-bold justify-between text-1xl text-[#3f2f23]">
        <p>
          Data ditampilkan{" "}
          <span className="font-bold text-[#3f2f23]">
            {Math.min(page * perPage, total)}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-[#3f2f23]">
            {total}
          </span>
        </p>

        <Pagination
          page={page}
          setPage={setPage}
          total={total}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>
    </div>
  );
}
