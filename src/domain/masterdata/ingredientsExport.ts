import type { RawMaterialRow } from "@/types/masterdata";

export const ingredientsExportHeaders = [
  "SKU Induk",
  "Kategori",
  "Nama Barang",
  "Stok Sistem",
  "Satuan",
];

export function buildIngredientsExportRows(rows: RawMaterialRow[]) {
  return rows.map((item) => [
    item.skuInduk ?? "-",
    item.kategori ?? "-",
    item.namaBarang ?? "-",
    item.stokSistem ?? "-",
    item.satuan ?? "-",
  ]);
}
