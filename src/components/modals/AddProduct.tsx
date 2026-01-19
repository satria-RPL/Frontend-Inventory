"use client";

import { X, Plus } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddProductModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative z-50 w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
        {/* header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tambah Produk</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* form */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Masukan Kategori *
            </label>
            <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option>Pilih Kategori Barang</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              SKU Produk *
            </label>
            <input
              type="text"
              placeholder="Masukan SKU Produk"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Nama Barang *
            </label>
            <input
              type="text"
              placeholder="Masukan Nama Barang"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          {/* variant */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Aktifkan Varian Cup *</p>
              <p className="text-xs text-gray-500">
                Gunakan varian cup untuk size cup
              </p>
            </div>
            <input type="checkbox" className="h-5 w-5 accent-orange-500" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Aktifkan Varian Pedas *</p>
              <p className="text-xs text-gray-500">
                Gunakan varian untuk tingkat kepedasan
              </p>
            </div>
            <input type="checkbox" className="h-5 w-5 accent-orange-500" />
          </div>

          {/* bahan baku */}
          <div className="rounded-md border p-3">
            <div className="flex gap-2">
              <select className="flex-1 rounded-md border px-2 py-1 text-sm">
                <option>Bahan Baku</option>
              </select>
              <input
                type="text"
                placeholder="Gramasi"
                className="w-24 rounded-md border px-2 py-1 text-sm"
              />
            </div>
            <p className="mt-1 text-xs text-green-600">Total HPP : Rp 20.000</p>
          </div>

          <button className="flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </button>
        </div>
      </div>
    </div>
  );
}
