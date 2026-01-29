"use client";

import { Pencil, Trash2, Eye } from "lucide-react";
import type { AddOnRow } from "@/types/masterdata";

type AddOnsTableProps = {
  rows: AddOnRow[];
  loading?: boolean;
  error?: string | null;
  page: number;
  perPage: number;
  onEdit?: (row: AddOnRow) => void;
  onDelete?: (row: AddOnRow) => void;
  onView?: (row: AddOnRow) => void;
};

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AddOnsTable({
  rows,
  loading = false,
  error = null,
  page,
  perPage,
  onEdit,
  onDelete,
  onView,
}: AddOnsTableProps) {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white overflow-x-auto">
      <table className="min-w-max w-full border-separate border-spacing-0 text-sm">
        <thead className="sticky top-0 z-10 bg-gray-100 border border-gray-200">
          <tr className="text-center text-xs font-medium text-[#9a9a9a]">
            <th className="px-4 py-3 text-center whitespace-nowrap">#</th>
            <th className="px-4 py-3 whitespace-nowrap">SKU Produk</th>
            <th className="px-4 py-3 whitespace-nowrap">Kategori</th>
            <th className="px-4 py-3 whitespace-nowrap">Nama Add Ons</th>
            <th className="px-4 py-3 whitespace-nowrap">Harga Produk</th>
            <th className="px-4 py-3 whitespace-nowrap">Status</th>
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
                  {item.sku}
                </td>
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {item.category}
                </td>
                <td className="px-4 py-3 font-medium text-[#3f2f23] whitespace-nowrap">
                  {item.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`font-semibold ${
                      item.status.toLowerCase() === "aktif"
                        ? "text-green-500"
                        : "text-orange-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      aria-label="Edit add-ons"
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white hover:opacity-90"
                      onClick={() => onEdit?.(item)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete add-ons"
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ef4444] text-white hover:opacity-90"
                      onClick={() => onDelete?.(item)}
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="View add-ons"
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
