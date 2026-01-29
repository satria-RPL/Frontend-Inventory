export type ProductTableRow = {
  id: number;
  sku: string;
  name: string;
  category: string;
  categoryId?: string;
  priceId?: number | string;
  description?: string;
  packaging?: string | null;
  sizeVariant?: string | null;
  spicyVariant?: boolean | null;
  additionalVariant?: boolean | null;
  price?: number | null;
  status?: string | null;
  createdAt?: string | null;
};

export type RawMaterialRow = {
  id: number | string;
  skuInduk: string;
  kategori: string;
  namaBarang: string;
  stokSistem?: string | number | null;
  satuan: string;
};

export type AddOnRow = {
  id: number;
  sku: string;
  category: string;
  name: string;
  price: number | null;
  status: "Aktif" | "Draft" | "Nonaktif" | string;
};
