"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Plus, ChevronDown, Check } from "lucide-react";
import { useSessionUser } from "@/components/providers/SessionUserProvider";

interface Props {
  open: boolean;
  onClose: () => void;
}

function isDefined<T>(value: T | null): value is T {
  return value !== null;
}

export default function AddProductModal({ open, onClose }: Props) {
  const [createdAt, setCreatedAt] = useState("");
  const [packages, setPackages] = useState<
    { id: number | string; name: string; description?: string }[]
  >([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [categories, setCategories] = useState<
    { id: number | string; name: string }[]
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [menuVariantEnabled, setMenuVariantEnabled] = useState(false);
  const [ingredients, setIngredients] = useState<
    { id: number | string; name: string }[]
  >([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const sessionUser = useSessionUser();
  const [priceValue, setPriceValue] = useState("");
  const [additionalEnabled, setAdditionalEnabled] = useState(true);
  const [additionalFileName, setAdditionalFileName] = useState("");
  const [ingredientRows, setIngredientRows] = useState<number[]>([0]);
  const [skuValue, setSkuValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [packagingValue, setPackagingValue] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const createdBy = useMemo(() => {
    const name = sessionUser?.name || sessionUser?.username || "-";
    const role = sessionUser?.role || "";
    return role ? `${role} - ${name}` : name;
  }, [sessionUser]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const formatter = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const getPart = (type: string) =>
      parts.find((part) => part.type === type)?.value ?? "";

    const day = getPart("day");
    const month = getPart("month");
    const year = getPart("year");
    const hour = getPart("hour");
    const minute = getPart("minute");
    const second = getPart("second");

    setCreatedAt(`${day} ${month} ${year} , ${hour}:${minute}:${second}`);
  }, [open]);

  const formatPriceInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (value: string) => {
    setPriceValue(formatPriceInput(value));
  };

  const handleAddIngredientRow = () => {
    setIngredientRows((prev) => [...prev, prev.length]);
  };

  const ingredientSections =
    menuVariantEnabled && selectedSizes.length > 0
      ? selectedSizes
      : [""];

  const handleToggleSize = (label: string) => {
    setSelectedSizes((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const parsePriceValue = () => {
    const digits = priceValue.replace(/\./g, "");
    if (!digits) return null;
    const parsed = Number(digits);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setFormError(null);
    setFieldErrors({});

    const nextErrors: Record<string, string> = {};
    if (!categoryValue) {
      nextErrors.category = "Kategori wajib diisi.";
    }
    if (!packagingValue) {
      nextErrors.packaging = "Packaging wajib diisi.";
    }
    if (!skuValue.trim()) {
      nextErrors.sku = "SKU produk wajib diisi.";
    }
    if (!nameValue.trim()) {
      nextErrors.name = "Nama produk wajib diisi.";
    }

    const price = parsePriceValue();
    if (price == null || price <= 0) {
      nextErrors.price = "Harga produk wajib diisi.";
    }
    if (menuVariantEnabled && selectedSizes.length === 0) {
      nextErrors.size = "Pilih minimal 1 ukuran.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError("Mohon lengkapi input yang wajib diisi.");
      return;
    }

    const placeId = 1;

    setSubmitting(true);
    try {
      const menuRes = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          name: nameValue.trim(),
          categoryId: Number(categoryValue),
          description: "",
          sku: skuValue.trim(),
          isActive: true,
        }),
      });

      const menuPayload = (await menuRes.json().catch(() => null)) as
        | { id?: number | string; message?: string }
        | null;

      if (!menuRes.ok || !menuPayload?.id) {
        throw new Error(menuPayload?.message ?? "Gagal membuat menu.");
      }

      const menuId = Number(menuPayload.id);

      if (price != null) {
        const today = new Date();
        const effectiveDate = today.toISOString().slice(0, 10);
        const priceRes = await fetch("/api/menu-prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            menuId,
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

      if (menuVariantEnabled && selectedSizes.length > 0) {
        const variantRequests = selectedSizes.map((label) =>
          fetch("/api/menu-variants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ menuId, name: label }),
          })
        );
        const variantResponses = await Promise.all(variantRequests);
        const failed = variantResponses.find((res) => !res.ok);
        if (failed) {
          const variantPayload = (await failed.json().catch(() => null)) as
            | { message?: string }
            | null;
          throw new Error(variantPayload?.message ?? "Gagal membuat varian menu.");
        }
      }

      setSkuValue("");
      setNameValue("");
      setCategoryValue("");
      setPackagingValue("");
      setPriceValue("");
      setSelectedSizes([]);
      setAdditionalFileName("");
      setIngredientRows([0, 1]);
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    let isActive = true;

    async function loadCategories() {
      setCategoriesLoading(true);
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as
          | {
              id?: number | string;
              name?: string;
              label?: string;
              title?: string;
              description?: string;
              type?: string;
            }[]
          | {
              data?: {
                id?: number | string;
                name?: string;
                label?: string;
                title?: string;
                description?: string;
                type?: string;
              }[];
            }
          | null;
        if (!isActive) return;
        const list = Array.isArray(data) ? data : data?.data ?? [];
        const filtered = list.filter(
          (item) => (item.type ?? "").toLowerCase() !== "ingredient"
        );
        const normalized = filtered
          .map((item) => {
            const id = item.id ?? "";
            const name =
              item.name?.trim() ||
              item.label?.trim() ||
              item.title?.trim() ||
              item.description?.trim() ||
              "";
            if (!id || !name) return null;
            return { id, name };
          })
          .filter(isDefined);
        setCategories(normalized);
      } catch {
        if (isActive) {
          setCategories([]);
        }
      } finally {
        if (isActive) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();
    return () => {
      isActive = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let isActive = true;

    async function loadIngredients() {
      setIngredientsLoading(true);
      try {
        const res = await fetch("/api/ingredients", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as
          | { id?: number | string; name?: string }[]
          | null;
        if (!isActive) return;
        if (Array.isArray(data)) {
          const normalized = data
            .map((item) => {
              const id = item.id ?? "";
              const name = item.name?.trim() ?? "";
              if (!id || !name) return null;
              return { id, name };
            })
            .filter(isDefined);
          setIngredients(normalized);
        } else {
          setIngredients([]);
        }
      } catch {
        if (isActive) {
          setIngredients([]);
        }
      } finally {
        if (isActive) {
          setIngredientsLoading(false);
        }
      }
    }

    loadIngredients();
    return () => {
      isActive = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let isActive = true;

    async function loadPackages() {
      setPackagesLoading(true);
      try {
        const res = await fetch("/api/packages", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as
          | { id?: number | string; name?: string; description?: string }[]
          | null;
        if (!isActive) return;
        if (Array.isArray(data)) {
          const normalized = data
            .map((item) => {
              const id = item.id ?? "";
              const name = item.name?.trim() ?? "";
              if (!id || !name) return null;
              return { id, name, description: item.description };
            })
            .filter(isDefined);
          setPackages(normalized);
        } else {
          setPackages([]);
        }
      } catch {
        if (isActive) {
          setPackages([]);
        }
      } finally {
        if (isActive) {
          setPackagesLoading(false);
        }
      }
    }

    loadPackages();
    return () => {
      isActive = false;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative z-50 w-full max-w-3xl rounded-2xl bg-white shadow-lg">
        {/* header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Tambah Produk</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* form */}
        <div className="max-h-[80vh] space-y-5 overflow-y-auto px-6 py-5 hide-scrollbar">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Dibuat</label>
              <input
                type="text"
                readOnly
                value={createdAt}
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
                <select
                  value={categoryValue}
                  onChange={(event) => setCategoryValue(event.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                >
                  <option>Pilih Kategori Barang</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
              {categoriesLoading && (
                <p className="mt-1 text-xs text-gray-500">Memuat kategori...</p>
              )}
              {fieldErrors.category && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.category}
                </p>
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
                  <option>Pilih Kategori Packaging</option>
                  {packages.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
              {packagesLoading && (
                <p className="mt-1 text-xs text-gray-500">Memuat packaging...</p>
              )}
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
                placeholder="Masukan SKU Produk"
                value={skuValue}
                onChange={(event) => setSkuValue(event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
              {fieldErrors.sku && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.sku}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Masukan Nama Barang"
                value={nameValue}
                onChange={(event) => setNameValue(event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Aktifkan Menu Varian <span className="text-red-500">*</span>
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
              <>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Small (S)",
                    "Medium (M)",
                    "Large (L)",
                    "XtraLarge (XL)",
                  ].map((label) => (
                    <label key={label} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(label)}
                        onChange={() => handleToggleSize(label)}
                        className="peer sr-only"
                      />
                      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500 text-orange-500 transition peer-checked:bg-orange-500 peer-checked:[&>svg]:opacity-100">
                        <Check className="h-4 w-4 text-white opacity-0 transition" />
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
                >
                  <Plus size={16} />
                  Tambah Cupsize
                </button>
                {fieldErrors.size && (
                  <p className="text-xs text-red-500">{fieldErrors.size}</p>
                )}
              </>
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

                {ingredientRows.map((rowId) => (
                  <div key={rowId} className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Bahan Baku <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <select className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                          <option>Bahan Baku</option>
                          {ingredients.map((item) => (
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
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
              onClick={handleAddIngredientRow}
            >
              <Plus size={16} />
              Tambah Bahan Baku
            </button>
            {ingredientsLoading && (
              <p className="text-xs text-gray-500">Memuat bahan baku...</p>
            )}
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Izinkan Pesanan Take Away{" "}
                  <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500">
                  Izinkan Pesanan Dengan Take Away
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
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
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <span className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-orange-500" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
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
                  placeholder="0"
                  value={priceValue}
                  onChange={(event) => handlePriceChange(event.target.value)}
                  className="w-full rounded-r-md px-2 py-2 text-sm outline-none"
                />
              </div>
              {fieldErrors.price && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.price}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Aktifkan Additional Menu{" "}
                  <span className="text-red-500">*</span>
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
          </div>

          {additionalEnabled && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-100 px-4 py-10 text-center text-sm text-gray-600">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setAdditionalFileName(file?.name ?? "");
                    }}
                  />
                  {additionalFileName
                    ? `File: ${additionalFileName}`
                    : "+ Tambahkan Gambar"}
                </label>
              </div>
            </div>
          )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-md bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Menyimpan..." : "Tambah Produk Baru"}
            </button>
            {formError && (
              <p className="text-sm text-red-500">{formError}</p>
            )}
        </div>
      </div>
    </div>
  );
}
