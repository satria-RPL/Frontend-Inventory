"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import type { ProductTableRow } from "@/types/masterdata";

type Props = {
  open: boolean;
  onClose: () => void;
  product: ProductTableRow | null;
  onUpdated?: () => void | Promise<void>;
};

type CategoryOption = {
  id?: number | string;
  name?: string;
  label?: string;
  title?: string;
  description?: string;
};
type PackageOption = { id?: number | string; name?: string; description?: string };
type IngredientOption = { id?: number | string; name?: string };
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

function isDefined<T>(value: T | null): value is T {
  return value !== null;
}

function formatPriceInput(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parsePriceValue(value: string) {
  const digits = value.replace(/\./g, "");
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function EditProductModal({
  open,
  onClose,
  product,
  onUpdated,
}: Props) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [ingredients, setIngredients] = useState<IngredientOption[]>([]);
  const [categoryValue, setCategoryValue] = useState("");
  const [packagingValue, setPackagingValue] = useState("");
  const [skuValue, setSkuValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [menuVariantEnabled, setMenuVariantEnabled] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [ingredientRows, setIngredientRows] = useState<number[]>([0]);
  const [ingredientValues, setIngredientValues] = useState<
    Array<{ ingredientId: string; qty: string }>
  >([]);
  const [takeAwayEnabled, setTakeAwayEnabled] = useState(false);
  const [profitEnabled, setProfitEnabled] = useState(true);
  const [additionalEnabled, setAdditionalEnabled] = useState(true);
  const [activeEnabled, setActiveEnabled] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !product) return;
    setCategoryValue(product.categoryId ?? "");
    setPackagingValue(product.packaging ?? "");
    setSkuValue(product.sku ?? "");
    setNameValue(product.name ?? "");
    setPriceValue(product.price != null ? formatPriceInput(String(product.price)) : "");
    setActiveEnabled((product.status ?? "").toLowerCase() === "aktif");
    setAdditionalEnabled(Boolean(product.additionalVariant));
    setMenuVariantEnabled(
      Boolean(product.sizeVariant && product.sizeVariant !== "-")
    );
    setIngredientRows([0]);
    setIngredientValues([{ ingredientId: "", qty: "" }]);
    setProfitEnabled(true);
    setFieldErrors({});
  }, [open, product]);

  useEffect(() => {
    if (!open) return;
    let isActive = true;

    async function loadOptions() {
      setLoading(true);
      try {
        const [categoriesRes, packagesRes, ingredientsRes] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }).catch(() => null),
          fetch("/api/packages", { cache: "no-store" }).catch(() => null),
          fetch("/api/ingredients", { cache: "no-store" }).catch(() => null),
        ]);
        const categoriesPayload = categoriesRes
          ? ((await categoriesRes.json().catch(() => null)) as
              | (CategoryOption & { type?: string })[]
              | { data?: (CategoryOption & { type?: string })[] }
              | null)
          : null;
        const packagesPayload = packagesRes
          ? ((await packagesRes.json().catch(() => null)) as
              | PackageOption[]
              | { data?: PackageOption[] }
              | null)
          : null;
        const ingredientsPayload = ingredientsRes
          ? ((await ingredientsRes.json().catch(() => null)) as
              | IngredientOption[]
              | { data?: IngredientOption[] }
              | null)
          : null;
        if (!isActive) return;
        const categoryList = Array.isArray(categoriesPayload)
          ? categoriesPayload
          : categoriesPayload?.data ?? [];
        const filteredCategories = categoryList.filter(
          (item) => (item.type ?? "").toLowerCase() !== "ingredient"
        );
        const packageList = Array.isArray(packagesPayload)
          ? packagesPayload
          : packagesPayload?.data ?? [];
        const ingredientList = Array.isArray(ingredientsPayload)
          ? ingredientsPayload
          : ingredientsPayload?.data ?? [];
        setCategories(filteredCategories);
        setPackages(packageList);
        setIngredients(ingredientList);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadOptions();
    return () => {
      isActive = false;
    };
  }, [open]);

  const categoryOptions = useMemo(
    () =>
      categories
        .map((item) => {
          const label =
            item.name?.trim() ||
            item.label?.trim() ||
            item.title?.trim() ||
            item.description?.trim() ||
            "";
          if (!label || item.id == null) return null;
          return { id: String(item.id), label };
        })
        .filter(isDefined),
    [categories]
  );

  const packageOptions = useMemo(
    () =>
      packages
        .map((item) => item.name?.trim() || "")
        .filter((label) => label && label !== "-"),
    [packages]
  );

  const ingredientOptions = useMemo(
    () =>
      ingredients
        .map((item) => {
          const name = item.name?.trim() || "";
          if (!name) return null;
          return { id: item.id ?? name, name };
        })
        .filter(isDefined),
    [ingredients]
  );

  const handleToggleSize = (label: string) => {
    setSelectedSizes((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleAddIngredientRow = () => {
    setIngredientRows((prev) => [...prev, prev.length]);
    setIngredientValues((prev) => [...prev, { ingredientId: "", qty: "" }]);
  };

  const ingredientSections =
    menuVariantEnabled && selectedSizes.length > 0 ? selectedSizes : [""];

  useEffect(() => {
    if (!open || !product) return;
    let isActive = true;

    async function loadRecipes() {
      try {
        const res = await fetch("/api/recipes", { cache: "no-store" });
        const payload = (await res.json().catch(() => null)) as
          | RecipeApiResponse
          | null;
        if (!isActive) return;
        const list = Array.isArray(payload) ? payload : payload?.data ?? [];
        const menuId = product.id;
        const mapped = list
          .filter((item) => {
            const itemMenuId = item.menuId ?? item.menu_id;
            return itemMenuId != null && Number(itemMenuId) === Number(menuId);
          })
          .map((item) => ({
            ingredientId: String(item.ingredientId ?? item.ingredient_id ?? ""),
            qty: item.qty != null ? String(item.qty) : "",
          }));

        const rows = mapped.length > 0 ? mapped : [{ ingredientId: "", qty: "" }];
        setIngredientValues(rows);
        setIngredientRows(rows.map((_, index) => index));
      } catch {
        if (isActive) {
          setIngredientValues([{ ingredientId: "", qty: "" }]);
          setIngredientRows([0]);
        }
      }
    }

    loadRecipes();
    return () => {
      isActive = false;
    };
  }, [open, product]);

  const handleIngredientChange = (index: number, value: string) => {
    setIngredientValues((prev) => {
      const next = [...prev];
      const current = next[index] ?? { ingredientId: "", qty: "" };
      next[index] = { ...current, ingredientId: value };
      return next;
    });
  };

  const handleQtyChange = (index: number, value: string) => {
    setIngredientValues((prev) => {
      const next = [...prev];
      const current = next[index] ?? { ingredientId: "", qty: "" };
      next[index] = { ...current, qty: value };
      return next;
    });
  };

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!categoryValue) nextErrors.category = "Kategori wajib diisi.";
    if (!packagingValue) nextErrors.packaging = "Packaging wajib diisi.";
    if (!skuValue.trim()) nextErrors.sku = "SKU produk wajib diisi.";
    if (!nameValue.trim()) nextErrors.name = "Nama produk wajib diisi.";
    const price = parsePriceValue(priceValue);
    if (price == null || price <= 0) nextErrors.price = "Harga produk wajib diisi.";

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const categoryId = Number(categoryValue);
    console.log("Update product:", {
      id: product?.id,
      categoryId,
      packaging: packagingValue,
      sku: skuValue.trim(),
      name: nameValue.trim(),
      price,
    });
    const effectiveDate = new Date().toISOString().slice(0, 10);

    try {
      const res = await fetch(`/api/menus/${product?.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: 1,
          name: nameValue.trim(),
          categoryId: Number(categoryValue),
          description: "",
          sku: skuValue.trim(),
          isActive: activeEnabled,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(payload?.message ?? "Gagal memperbarui menu.");
      }
      if (price != null) {
        if (product?.priceId != null) {
          const priceRes = await fetch(`/api/menu-prices/${product.priceId}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              menuId: product.id,
              price,
              effectiveDate,
            }),
          });
          if (!priceRes.ok) {
            const pricePayload = (await priceRes.json().catch(() => null)) as
              | { message?: string }
              | null;
            throw new Error(pricePayload?.message ?? "Gagal memperbarui harga menu.");
          }
        } else {
          const priceRes = await fetch("/api/menu-prices", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              menuId: product.id,
              price,
              effectiveDate,
            }),
          });
          if (!priceRes.ok) {
            const pricePayload = (await priceRes.json().catch(() => null)) as
              | { message?: string }
              | null;
            throw new Error(pricePayload?.message ?? "Gagal membuat harga menu.");
          }
        }
      }
      if (onUpdated) {
        await onUpdated();
      }
      onClose();
    } catch (err) {
      setFieldErrors((prev) => ({
        ...prev,
        form: err instanceof Error ? err.message : "Gagal memperbarui menu.",
      }));
    }
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-full max-w-2xl rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Produk</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[80vh] space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Kategori <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <select
                value={categoryValue}
                onChange={(event) => setCategoryValue(event.target.value)}
                className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                <option value="">Pilih Kategori Barang</option>
                {categoryOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
            {fieldErrors.category && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.category}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Packaging <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <select
                value={packagingValue}
                onChange={(event) => setPackagingValue(event.target.value)}
                className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                <option value="">Pilih Kategori Packaging</option>
                {packageOptions.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
            {fieldErrors.packaging && (
              <p className="mt-1 text-xs text-red-500">
                {fieldErrors.packaging}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              SKU Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={skuValue}
              onChange={(event) => setSkuValue(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
            {fieldErrors.sku && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.sku}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Harga Produk <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex items-center rounded-md border border-gray-200 bg-white">
              <span className="px-3 text-sm text-gray-500">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={priceValue}
                onChange={(event) => setPriceValue(formatPriceInput(event.target.value))}
                className="w-full rounded-r-md px-2 py-2 text-sm outline-none"
              />
            </div>
            {fieldErrors.price && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.price}</p>
            )}
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
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={menuVariantEnabled}
                  onChange={(event) => setMenuVariantEnabled(event.target.checked)}
                />
                <span className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-orange-500" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
            </div>

            {menuVariantEnabled && (
              <div className="flex flex-wrap gap-3">
                {["Small (S)", "Medium (M)", "Large (L)", "XtraLarge (XL)"].map(
                  (label) => (
                    <label key={label} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(label)}
                        onChange={() => handleToggleSize(label)}
                        className="peer sr-only"
                      />
                      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500 text-orange-500 transition peer-checked:bg-orange-500 peer-checked:[&>svg]:opacity-100">
                        <span className="text-white opacity-0 transition peer-checked:opacity-100">
                          ✓
                        </span>
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {label}
                      </span>
                    </label>
                  )
                )}
              </div>
            )}
          </div>

          <div className="space-y-6 border-t border-gray-200 pt-4">
            {ingredientSections.map((sectionLabel) => (
              <div key={sectionLabel || "default"} className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">
                  {sectionLabel
                    ? `Bahan Baku Varian Cup ${sectionLabel}`
                    : "Bahan Baku"}
                </p>

                {ingredientRows.map((rowId, rowIndex) => (
                  <div key={rowId} className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Bahan Baku <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <select
                          value={ingredientValues[rowIndex]?.ingredientId ?? ""}
                          onChange={(event) =>
                            handleIngredientChange(rowIndex, event.target.value)
                          }
                          className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                        >
                          <option>Bahan Baku</option>
                          {ingredientOptions.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Grammasi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="10 Gram"
                        value={ingredientValues[rowIndex]?.qty ?? ""}
                        onChange={(event) =>
                          handleQtyChange(rowIndex, event.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddIngredientRow}
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              + Tambah Bahan Baku
            </button>
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
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={takeAwayEnabled}
                  onChange={(event) => setTakeAwayEnabled(event.target.checked)}
                />
                <span className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-orange-500" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
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
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={profitEnabled}
                  onChange={(event) => setProfitEnabled(event.target.checked)}
                />
                <span className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-orange-500" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
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
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={additionalEnabled}
                  onChange={(event) => setAdditionalEnabled(event.target.checked)}
                />
                <span className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-orange-500" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Produk Aktif <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500">Status produk saat ini</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={activeEnabled}
                  onChange={(event) => setActiveEnabled(event.target.checked)}
                />
                <span className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-orange-500" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-md bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Simpan Perubahan
          </button>
          {loading && (
            <p className="text-xs text-gray-500">Memuat data...</p>
          )}
          {fieldErrors.form && (
            <p className="text-sm text-red-500">{fieldErrors.form}</p>
          )}
        </div>
      </div>
    </div>
  );
}
