"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { useSessionUser } from "@/components/providers/SessionUserProvider";
import type { ProductTableRow } from "@/types/masterdata";

type Props = {
  open: boolean;
  onClose: () => void;
  product: ProductTableRow | null;
};

type RecipeApiItem = {
  id?: number | string;
  menuId?: number | string;
  menu_id?: number | string;
  menuVariantItemId?: number | string | null;
  menu_variant_item_id?: number | string | null;
  ingredientId?: number | string;
  ingredient_id?: number | string;
  qty?: number | string;
};

type RecipeApiResponse = RecipeApiItem[] | { data?: RecipeApiItem[] };

type IngredientApiItem = {
  id?: number | string;
  name?: string;
};

type IngredientApiResponse = IngredientApiItem[] | { data?: IngredientApiItem[] };

function formatDate(value: string | null | undefined) {
  if (!value || value === "-") return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
  const timeLabel = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(parsed);
  return `${dateLabel}, ${timeLabel}`;
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ViewProductModal({ open, onClose, product }: Props) {
  const sessionUser = useSessionUser();
  const createdBy = useMemo(() => {
    const name = sessionUser?.name || sessionUser?.username || "-";
    const role = sessionUser?.role || "";
    return role ? `${role} - ${name}` : name;
  }, [sessionUser]);
  const [recipeItems, setRecipeItems] = useState<
    Array<{ name: string; qty: string }>
  >([]);

  useEffect(() => {
    if (!open || !product) return;
    let isActive = true;

    async function loadRecipes() {
      try {
        const [recipesRes, ingredientsRes] = await Promise.all([
          fetch("/api/recipes", { cache: "no-store" }).catch(() => null),
          fetch("/api/ingredients", { cache: "no-store" }).catch(() => null),
        ]);

        const recipesPayload = recipesRes
          ? ((await recipesRes.json().catch(() => null)) as RecipeApiResponse | null)
          : null;
        const ingredientsPayload = ingredientsRes
          ? ((await ingredientsRes.json().catch(() => null)) as
              | IngredientApiResponse
              | null)
          : null;

        if (!isActive) return;

        const recipeList = Array.isArray(recipesPayload)
          ? recipesPayload
          : recipesPayload?.data ?? [];
        const ingredientList = Array.isArray(ingredientsPayload)
          ? ingredientsPayload
          : ingredientsPayload?.data ?? [];

        const ingredientMap = new Map<string, string>();
        ingredientList.forEach((item) => {
          const id = item.id != null ? String(item.id) : "";
          const name = item.name?.trim() ?? "";
          if (id && name) {
            ingredientMap.set(id, name);
          }
        });

        const menuId = product.id;
        const normalized = recipeList
          .filter((item) => {
            const itemMenuId = item.menuId ?? item.menu_id;
            return itemMenuId != null && Number(itemMenuId) === Number(menuId);
          })
          .map((item) => {
            const ingredientId = item.ingredientId ?? item.ingredient_id;
            const name =
              ingredientId != null
                ? ingredientMap.get(String(ingredientId)) ??
                  `Bahan ${ingredientId}`
                : "Bahan";
            const qty = item.qty != null ? String(item.qty) : "-";
            return { name, qty };
          });

        setRecipeItems(normalized);
      } catch {
        if (isActive) {
          setRecipeItems([]);
        }
      }
    }

    loadRecipes();
    return () => {
      isActive = false;
    };
  }, [open, product]);

  if (!open || !product) return null;
  const showSizeVariants =
    Boolean(product.sizeVariant && product.sizeVariant !== "-");
  const isActive = (product.status ?? "").toLowerCase() === "aktif";
  const additionalEnabled = Boolean(product.additionalVariant);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-full max-w-3xl rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">View Produk</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[80vh] space-y-5 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Dibuat</label>
              <input
                type="text"
                readOnly
                value={formatDate(product.createdAt)}
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Dibuat Oleh
              </label>
              <input
                type="text"
                readOnly
                value={createdBy}
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  readOnly
                  value={product.category ?? "-"}
                  className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700"
                />
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Packaging <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  readOnly
                  value={product.packaging ?? "-"}
                  className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700"
                />
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                SKU Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={product.sku}
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={product.name}
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Aktifkan Varian Cup <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500">
                  Gunakan varian Cup untuk size cup
                </p>
              </div>
              <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-500">
                <span className="absolute left-6 top-1 h-4 w-4 rounded-full bg-white" />
              </span>
            </div>

            {showSizeVariants && (
              <div className="flex flex-wrap gap-3">
                {["Small (S)", "Medium (M)", "Large (L)", "XtraLarge (XL)"].map(
                  (label) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-gray-100">
                        <Check className="h-4 w-4 text-white opacity-0" />
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        {label}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700">Bahan Baku</p>
            {recipeItems.length === 0 ? (
              <p className="text-sm text-gray-500">-</p>
            ) : (
              <div className="space-y-2">
                {recipeItems.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span>{item.qty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Harga Produk <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center rounded-md border border-gray-200 bg-gray-100">
                <span className="px-3 text-sm text-gray-500">Rp</span>
                <input
                  type="text"
                  readOnly
                  value={formatCurrency(product.price)}
                  className="w-full rounded-r-md px-2 py-2 text-sm text-gray-700 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Izinkan Pesanan Take Away <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500">
                  Izinkan Pesanan Dengan Take Away
                </p>
              </div>
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  showSizeVariants ? "bg-orange-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    showSizeVariants ? "left-6" : "left-1"
                  }`}
                />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Penyesuaian Harga dengan Profitabilitas{" "}
                  <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500">
                  Menyesuaikan harga dengan kalkulasi HPP + Margin keuntungan
                </p>
              </div>
              <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Aktifkan Additional Menu <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500">
                  Gunakan varian tambahan additional menu
                </p>
              </div>
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  additionalEnabled ? "bg-orange-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    additionalEnabled ? "left-6" : "left-1"
                  }`}
                />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Produk Aktif <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500">Status produk saat ini</p>
              </div>
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  isActive ? "bg-orange-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    isActive ? "left-6" : "left-1"
                  }`}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
