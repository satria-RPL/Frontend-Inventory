"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type CategoryOption = { id: number | string; name: string };
type UnitOption = { id: number | string; label: string };

function isDefined<T>(value: T | null): value is T {
  return value !== null;
}

export default function AddRawMaterialModal({ open, onClose }: Props) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");
  const [unitValue, setUnitValue] = useState("");
  const [skuValue, setSkuValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [imageName, setImageName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!categoryValue) nextErrors.category = "Kategori wajib diisi.";
    if (!unitValue) nextErrors.unit = "Satuan wajib diisi.";
    if (!skuValue.trim()) nextErrors.sku = "SKU bahan baku wajib diisi.";
    if (!nameValue.trim()) nextErrors.name = "Nama barang wajib diisi.";

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onClose();
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
          (item) => (item.type ?? "").toLowerCase() === "ingredient"
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
      } finally {
        if (isActive) {
          setCategoriesLoading(false);
        }
      }
    }

    async function loadUnits() {
      setUnitsLoading(true);
      try {
        const res = await fetch("/api/units", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as
          | { id?: number | string; name?: string; abbreviation?: string }[]
          | { data?: { id?: number | string; name?: string; abbreviation?: string }[] }
          | null;
        if (!isActive) return;
        const list = Array.isArray(data) ? data : data?.data ?? [];
        const normalized = list
          .map((item) => {
            const id = item.id ?? "";
            const label = item.abbreviation?.trim() || item.name?.trim() || "";
            if (!id || !label) return null;
            return { id, label };
          })
          .filter(isDefined);
        setUnits(normalized);
      } finally {
        if (isActive) {
          setUnitsLoading(false);
        }
      }
    }

    loadCategories();
    loadUnits();

    return () => {
      isActive = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setCategoryValue("");
    setUnitValue("");
    setSkuValue("");
    setNameValue("");
    setImageName("");
  }, [open]);

  const categoryPlaceholder = useMemo(
    () => (categoriesLoading ? "Memuat kategori..." : "Pilih Kategori Barang"),
    [categoriesLoading]
  );

  const unitPlaceholder = useMemo(
    () => (unitsLoading ? "Memuat satuan..." : "Pilih Kategori Satuan"),
    [unitsLoading]
  );

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-full max-w-2xl rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Tambah Bahan Baku</h2>
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
                <option value="">{categoryPlaceholder}</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
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
              Satuan <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <select
                value={unitValue}
                onChange={(event) => setUnitValue(event.target.value)}
                className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                <option value="">{unitPlaceholder}</option>
                {units.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
            {fieldErrors.unit && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.unit}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              SKU Bahan Baku <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={skuValue}
              onChange={(event) => setSkuValue(event.target.value)}
              placeholder="Masukan SKU Bahan Baku"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
            {fieldErrors.sku && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.sku}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Nama Barang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
              placeholder="Masukan Nama Barang"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
          </div>

          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-100 px-4 py-10 text-center text-sm text-gray-600">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setImageName(file?.name ?? "");
                }}
              />
              {imageName ? `File: ${imageName}` : "+ Tambahkan Gambar"}
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-md bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Tambah Produk Baru
          </button>
        </div>
      </div>
    </div>
  );
}
