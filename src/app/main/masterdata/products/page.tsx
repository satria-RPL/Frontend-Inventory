"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  RotateCw,
  Download,
  Plus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

type MenuApiItem = {
  id?: number | string;
  placeId?: number | string;
  place_id?: number | string;
  name?: string;
  categoryId?: number | string;
  category_id?: number | string;
  description?: string;
  sku?: string;
  isActive?: boolean | number | string;
  is_active?: boolean | number | string;
  createdAt?: string;
  created_at?: string;
};

type MenuApiResponse = MenuApiItem[] | { data?: MenuApiItem[] };

type MenuVariantApiItem = {
  id?: number | string;
  menuId?: number | string;
  menu_id?: number | string;
  name?: string;
};

type MenuVariantApiResponse = MenuVariantApiItem[] | { data?: MenuVariantApiItem[] };

type CategoryApiItem = {
  id?: number | string;
  categoryId?: number | string;
  category_id?: number | string;
  name?: string;
  label?: string;
  title?: string;
  description?: string;
};

type CategoriesApiResponse = CategoryApiItem[] | { data?: CategoryApiItem[] };

type ProductRow = {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  status: string;
  spicyVariant: boolean;
  createdAt: string;
};

type CategoryOption = {
  id: string;
  label: string;
};

const statusOptions = ["Semua Status", "Aktif", "Nonaktif"];
const spicyVariantKeywords = ["pedas", "spicy"];

function toNumberId(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function normalizeBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return null;
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  return null;
}

function resolveCategoryLabel(item: CategoryApiItem) {
  return (
    (typeof item.name === "string" && item.name.trim() ? item.name : null) ??
    (typeof item.label === "string" && item.label.trim() ? item.label : null) ??
    (typeof item.title === "string" && item.title.trim() ? item.title : null) ??
    (typeof item.description === "string" && item.description.trim()
      ? item.description
      : null) ??
    "-"
  );
}

function addUniqueName(map: Map<string, string[]>, key: string, name: string) {
  const existing = map.get(key);
  if (!existing) {
    map.set(key, [name]);
    return;
  }
  const normalizedName = name.toLowerCase();
  if (!existing.some((value) => value.toLowerCase() === normalizedName)) {
    existing.push(name);
  }
}

function normalizeMenuVariants(payload: MenuVariantApiResponse | null): {
  namesByMenuId: Map<string, string[]>;
  variantIdToMenuId: Map<string, string>;
} {
  const list = Array.isArray(payload) ? payload : payload?.data ?? [];
  const namesByMenuId = new Map<string, string[]>();
  const variantIdToMenuId = new Map<string, string>();

  list.forEach((item) => {
    const rawMenuId = item.menuId ?? item.menu_id;
    const rawVariantId = item.id;
    const menuKey = rawMenuId != null ? String(rawMenuId) : "";
    const variantKey = rawVariantId != null ? String(rawVariantId) : "";
    if (menuKey && variantKey) {
      variantIdToMenuId.set(variantKey, menuKey);
    }
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!name || !menuKey) return;
    addUniqueName(namesByMenuId, menuKey, name);
  });

  return { namesByMenuId, variantIdToMenuId };
}

function resolveSpicyFlag(names: string[], keywords: string[]) {
  if (names.length === 0) return false;
  const keywordSet = new Set(keywords);
  return names.some((name) => {
    const tokens = name
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
    return tokens.some((token) => keywordSet.has(token));
  });
}

function normalizeCategories(payload: CategoriesApiResponse | null): CategoryOption[] {
  const list = Array.isArray(payload) ? payload : payload?.data ?? [];
  const seen = new Set<string>();
  return list
    .map((item) => {
      const rawId = item.id ?? item.categoryId ?? item.category_id;
      if (rawId == null) return null;
      const id = String(rawId);
      if (!id) return null;
      const label = resolveCategoryLabel(item);
      return { id, label };
    })
    .filter((item): item is CategoryOption => Boolean(item))
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
}

function normalizeMenus(
  payload: MenuApiResponse | null,
  categoryMap: Map<string, string>,
  variantMap: Map<string, string[]>
): ProductRow[] {
  const list = Array.isArray(payload) ? payload : payload?.data ?? [];
  return list.map((item, index) => {
    const rawMenuId = item.id ?? null;
    const menuKey = rawMenuId != null ? String(rawMenuId) : "";
    const variantNames = menuKey ? variantMap.get(menuKey) ?? [] : [];
    const categoryId = item.categoryId ?? item.category_id ?? null;
    const categoryKey = categoryId != null ? String(categoryId) : "";
    const category =
      (categoryKey && categoryMap.get(categoryKey)) ??
      (categoryKey ? `Kategori ${categoryKey}` : "-");
    const activeValue = normalizeBoolean(item.isActive ?? item.is_active);
    const status =
      activeValue == null ? "-" : activeValue ? "Aktif" : "Nonaktif";
    return {
      id: toNumberId(item.id, index + 1),
      sku: item.sku ?? "-",
      name: item.name ?? "-",
      description: item.description ?? "-",
      category,
      status,
      spicyVariant: resolveSpicyFlag(variantNames, spicyVariantKeywords),
      createdAt: item.createdAt ?? item.created_at ?? "-",
    };
  });
}

export default function ProductsPage() {
  const [category, setCategory] = useState("Semua Kategori");
  const [status, setStatus] = useState("Semua Status");
  const [openCategory, setOpenCategory] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const [menusRes, categoriesRes, variantsRes] = await Promise.all([
          fetch("/api/menus", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }).catch(() => null),
          fetch("/api/menu-variants", { cache: "no-store" }).catch(() => null),
        ]);

        const menusPayload = (await menusRes
          .json()
          .catch(() => null)) as MenuApiResponse | null;
        const categoriesPayload = categoriesRes
          ? ((await categoriesRes
              .json()
              .catch(() => null)) as CategoriesApiResponse | null)
          : null;
        const variantsPayload = variantsRes
          ? ((await variantsRes
              .json()
              .catch(() => null)) as MenuVariantApiResponse | null)
          : null;

        if (!menusRes.ok) {
          const message =
            menusPayload && typeof menusPayload === "object" && "message" in menusPayload
              ? String((menusPayload as { message?: unknown }).message)
              : "Gagal memuat produk.";
          throw new Error(message);
        }

        const normalizedCategories =
          categoriesRes && categoriesRes.ok
            ? normalizeCategories(categoriesPayload)
            : [];
        const normalizedVariants =
          variantsRes && variantsRes.ok
            ? normalizeMenuVariants(variantsPayload)
            : {
                namesByMenuId: new Map<string, string[]>(),
                variantIdToMenuId: new Map<string, string>(),
              };
        const categoryMap = new Map(
          normalizedCategories.map((entry) => [entry.id, entry.label])
        );
        const normalizedMenus = normalizeMenus(
          menusPayload,
          categoryMap,
          normalizedVariants.namesByMenuId
        );

        if (isActive) {
          setCategories(normalizedCategories);
          setProducts(normalizedMenus);
        }
      } catch (err) {
        if (isActive) {
          setProducts([]);
          setCategories([]);
          setError(err instanceof Error ? err.message : "Gagal memuat produk.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      isActive = false;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    const labels =
      categories.length > 0
        ? categories.map((item) => item.label)
        : Array.from(new Set(products.map((item) => item.category))).filter(
            (label) => label && label !== "-"
          );
    return ["Semua Kategori", ...labels];
  }, [categories, products]);

  useEffect(() => {
    if (!categoryOptions.includes(category)) {
      setCategory("Semua Kategori");
    }
  }, [category, categoryOptions]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory =
        category === "Semua Kategori" || item.category === category;
      const matchStatus =
        status === "Semua Status" || item.status === status;
      return matchCategory && matchStatus;
    });
  }, [products, category, status]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const pagedProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="min-h-screen space-y-6 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Daftar Products</h1>

        <div className="flex gap-2 p-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Plus size={17} className="inline-block font-bold" />
            Add Product
          </button>
          <button
            type="button"
            onClick={() => {
              setCategory("Semua Kategori");
              setStatus("Semua Status");
            }}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RotateCw size={17} className="inline-block font-bold" />
            Reset Filter
          </button>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={17} className="inline-block font-bold" />
            Export All
          </div>
          <div className="flex items-center gap-2 bg-white relative"></div>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={17} className="inline-block font-bold" />
            Export Filter
          </div>
        </div>
      </div>
      <div className="border border-gray-200"></div>

      {/* filter kategory n status */}
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-6 p-2">
          {/* Filter Kategori */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">
              Filter Kategori
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-48 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenCategory((v) => !v)}
              >
                {category}
                <ChevronDown size={16} />
              </button>
              {openCategory && (
                <div className="absolute z-30 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
                  {categoryOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory(item);
                        setOpenCategory(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        category === item ? "bg-orange-50 font-semibold" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Status */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-gray-600">
              Filter Label
            </label>
            <div className="relative p-0.5">
              <button
                type="button"
                className="flex w-48 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenStatus((v) => !v)}
              >
                {status}
                <ChevronDown size={16} />
              </button>
              {openStatus && (
                <div className="absolute z-30  mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
                  {statusOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setStatus(item);
                        setOpenStatus(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                        status === item ? "bg-gray-50 font-normal" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Button Terapkan Filter */}
          <button
            type="button"
            onClick={() => setPage(1)}
            className="rounded-md bg-orange-500 px-8 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            Terapkan Filter
          </button>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-gray-200 bg-white">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-gray-100 border border-gray-200">
            <tr className="text-left text-xs font-medium text-[#9a9a9a]">
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Nama Produk</th>
              <th className="px-4 py-3">Packaging</th>
              <th className="px-4 py-3">Varian Size</th>
              <th className="px-4 py-3">Varian Pedas</th>
              <th className="px-4 py-3">Additional</th>
              <th className="px-4 py-3">Dibuat</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[#6f6f6f]">
            {loading && (
              <tr>
                <td
                  colSpan={10}
                  className="py-10 text-center text-sm text-[#9a9a9a]"
                >
                  Memuat data...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={10}
                  className="py-10 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && pagedProducts.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="py-10 text-center text-sm text-[#9a9a9a]"
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              pagedProducts.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 even:bg-[#fff3ec] even:[&>td]:font-semibold odd:[&>td]:font-normal hover:bg-[#fff0e8]"
                >
                  <td className="px-4 py-3 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">{item.sku}</td>
                  <td className="px-4 py-3 font-medium">{item.category}</td>
                  <td className="px-4 py-3 font-medium text-[#3f2f23]">
                    {item.name}
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td
                    className={`px-4 py-3 ${
                      index % 2 === 1 ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {item.spicyVariant ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        aria-label="Edit produk"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white hover:opacity-90"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete produk"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ef4444] text-white hover:opacity-90"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="View produk"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#22c55e] text-white hover:opacity-90"
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

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#3f2f23]">
        <p className="font-bold">
          Data ditampilkan{" "}
          <span className="font-bold text-[#3f2f23]">
            {loading ? 0 : Math.min(page * perPage, filteredProducts.length)}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-[#3f2f23]">
            {loading ? 0 : filteredProducts.length}
          </span>
        </p>

        <Pagination
          page={page}
          setPage={setPage}
          total={filteredProducts.length}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>
    </div>
  );
}
