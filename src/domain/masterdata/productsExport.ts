import type { ProductTableRow } from "@/types/masterdata";

export const productsExportHeaders = [
  "SKU Produk",
  "Kategori",
  "Nama Produk",
  "Packaging",
  "Varian Size",
  "Varian Pedas",
  "Additional",
  "Harga",
  "Status",
  "Dibuat",
];

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null | undefined) {
  if (!value || value === "-") return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(parsed);
}

export function buildProductsExportRows(rows: ProductTableRow[]) {
  return rows.map((item) => [
    item.sku ?? "-",
    item.category ?? "-",
    item.name ?? "-",
    item.packaging ?? "-",
    item.sizeVariant ?? "-",
    item.spicyVariant == null ? "-" : item.spicyVariant ? "Yes" : "No",
    item.additionalVariant == null
      ? "-"
      : item.additionalVariant
        ? "Yes"
        : "No",
    formatCurrency(item.price),
    item.status ?? "-",
    formatDate(item.createdAt),
  ]);
}
