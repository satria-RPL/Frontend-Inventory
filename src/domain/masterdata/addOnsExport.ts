import type { AddOnRow } from "@/types/masterdata";

export const addOnsExportHeaders = [
  "SKU Produk",
  "Kategori",
  "Nama Add Ons",
  "Harga Produk",
  "Status",
];

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildAddOnsExportRows(rows: AddOnRow[]) {
  return rows.map((item) => [
    item.sku ?? "-",
    item.category ?? "-",
    item.name ?? "-",
    formatCurrency(item.price),
    item.status ?? "-",
  ]);
}
