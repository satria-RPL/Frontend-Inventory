"use client";

import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { dummyProducts } from "@/data/historyproduct";
import Pagination from "@/components/ui/Pagination";

export default function HistoryOrderTable() {
  // ==============================
  // STATE: Pagination
  // ==============================
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // ==============================
  // DATA: Slice data sesuai page
  // ==============================
  const paged = dummyProducts.slice((page - 1) * perPage, page * perPage);

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
              <th className="px-4 py-3">SKU</th>
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
            {/* Empty State */}
            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-sm text-[#9a9a9a]"
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            )}

            {/* Data Rows */}
            {paged.map((item, index) => (
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
                  {(page - 1) * perPage + index + 1}
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
                      onClick={() => alert("Delete dummy row id: " + item.id)}
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* View Detail */}
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#22c55e] text-white hover:opacity-90"
                      title="View"
                      type="button"
                      onClick={() => alert("Detail dummy row id: " + item.id)}
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
            {Math.min(page * perPage, dummyProducts.length)}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-[#3f2f23]">
            {dummyProducts.length}
          </span>
        </p>

        <Pagination
          page={page}
          setPage={setPage}
          total={dummyProducts.length}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>
    </div>
  );
}
