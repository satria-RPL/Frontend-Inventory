"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dummyProducts } from "@/data/opnamedata";
import Pagination from "@/components/ui/Pagination";

export default function HistoryOrderTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const paged = dummyProducts.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-white">
      {/* ================= TABLE WRAPPER ================= */}
      <div className="relative flex-1 overflow-y-auto rounded-2xl border border-gray-200 [&::-webkit-scrollbar]:hidden">
        <table className="w-full border-separate border-spacing-0 text-sm">
          {/* ================= HEADER ================= */}
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-gray-200 text-xs font-semibold text-[#9a9a9a]">
              <th className="w-[48px] px-4 py-3 text-center">#</th>
              <th className="px-5 py-3 text-left">Jenis Opname</th>
              <th className="px-5 py-3 text-left">Tanggal Opname</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Total Items</th>
              <th className="px-5 py-3 text-left">Dibuat Oleh</th>
              <th className="w-[140px] px-5 py-3 text-center rounded-tr-2xl">
                Aksi
              </th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody className="text-[#6f6f6f]">
            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-[#9a9a9a]"
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            )}

            {paged.map((item, index) => {
              const showBelumInput = Math.random() > 0.5; // random tombol

              return (
                <tr
                  key={item.id}
                  className="
                    border-b border-gray-100
                    even:bg-[#fff3ec]
                    hover:bg-[#ffe7db]
                  "
                >
                  {/* Nomor */}
                  <td className="px-4 py-3 text-center text-sm">
                    {(page - 1) * perPage + index + 1}
                  </td>

                  {/* Jenis Opname */}
                  <td className="px-5 py-3 font-medium text-[#3f2f23]">
                    {item.jenisOpname}
                  </td>

                  {/* Tanggal */}
                  <td className="px-5 py-3 whitespace-nowrap">
                    {item.tanggal}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          item.status === "Draft"
                            ? "bg-white font-semibold"
                            : item.status === "Selesai"
                              ? " font-semibold"
                              : " font-semibold"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Total Items */}
                  <td className="px-5 py-3 font-semibold text-[#3f2f23]">
                    {item.totalItems}
                  </td>

                  {/* Dibuat Oleh */}
                  <td className="px-5 py-3">{item.dibuatOleh}</td>

                  {/* Aksi */}
                  <td className="px-5 py-3 text-center">
                    {showBelumInput ? (
                      <button
                        className="rounded-md bg-[#22c55e] px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
                        type="button"
                        onClick={() =>
                          router.push(
                            `/main/alltransactions/stockopname/opnameinput?id=${item.id}`,
                          )
                        }
                      >
                        Belum Input
                      </button>
                    ) : (
                      <button
                        className="rounded-md bg-[#9ca3af] px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
                        type="button"
                        onClick={() => alert("Cek Detail ID: " + item.id)}
                      >
                        Cek Detail
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-4 flex items-center justify-between px-1 text-sm font-medium text-[#3f2f23]">
        <p>
          Data di tampilkan{" "}
          <span className="font-bold">
            {Math.min(page * perPage, dummyProducts.length)}
          </span>{" "}
          dari <span className="font-bold">{dummyProducts.length}</span>
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
