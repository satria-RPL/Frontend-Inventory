"use client";

import { Pencil, Trash2, Eye } from "lucide-react";
import type { RawMaterialRow } from "@/types/masterdata";

type RawMaterialTableProps = {
  rows: RawMaterialRow[];
  loading?: boolean;
  error?: string | null;
  page: number;
  perPage: number;
  onEdit?: (row: RawMaterialRow) => void;
  onDelete?: (row: RawMaterialRow) => void;
  onView?: (row: RawMaterialRow) => void;
};

export default function RawMaterialTable({
  rows,
  loading = false,
  error = null,
  page,
  perPage,
  onEdit,
  onDelete,
  onView,
}: RawMaterialTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-gray-200 bg-white">
      <table className="min-w-max w-full border-separate border-spacing-0 text-sm">
        <thead className="sticky top-0 z-10 bg-gray-100 border border-gray-200">
          <tr className="text-center text-xs font-medium text-[#9a9a9a]">
            <th className="px-4 py-3 text-center whitespace-nowrap">#</th>
            <th className="px-4 py-3 whitespace-nowrap">SKU Induk</th>
            <th className="px-4 py-3 whitespace-nowrap">Kategori</th>
            <th className="px-4 py-3 whitespace-nowrap">Nama Barang</th>
            <th className="px-4 py-3 whitespace-nowrap">Stok Sistem</th>
            <th className="px-4 py-3 whitespace-nowrap">Satuan</th>
            <th className="px-4 py-3 text-center whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-[#6f6f6f]">
          {loading && (
            <tr>
              <td
                colSpan={7}
                className="py-10 text-center text-sm text-[#9a9a9a]"
              >
                Memuat data...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={7} className="py-10 text-center text-sm text-red-500">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && rows.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="py-10 text-center text-sm text-[#9a9a9a]"
              >
                Data tidak ditemukan.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            rows.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 even:bg-[#fff3ec] even:[&>td]:font-semibold odd:[&>td]:font-normal hover:bg-[#fff0e8]"
              >
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  {(page - 1) * perPage + index + 1}
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {item.skuInduk}
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {item.kategori}
                </td>
                <td className="px-4 py-3 font-medium text-[#3f2f23] whitespace-nowrap">
                  {item.namaBarang}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.stokSistem ?? "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{item.satuan}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      aria-label="View bahan baku"
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#22c55e] text-white hover:opacity-90"
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
  );
}
