import type { AddOnRow } from "@/types/masterdata";
import {
  normalizeBoolean,
  toNumber,
  toNumberId,
  unwrapArray,
} from "@/domain/masterdata/utils";

type MenuApiItem = {
  id?: number | string;
  sku?: string;
  categoryId?: number | string;
  category_id?: number | string;
  isActive?: boolean | number | string;
  is_active?: boolean | number | string;
};

type MenuVariantApiItem = {
  id?: number | string;
  menuId?: number | string;
  menu_id?: number | string;
  name?: string;
};

type MenuVariantItemApiItem = {
  id?: number | string;
  menuVariantId?: number | string;
  menu_variant_id?: number | string;
  name?: string;
  additionalPrice?: number | string;
  additional_price?: number | string;
  price?: number | string;
};

type CategoryApiItem = {
  id?: number | string;
  categoryId?: number | string;
  category_id?: number | string;
  name?: string;
  label?: string;
  title?: string;
  description?: string;
  type?: string;
};

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

export function normalizeAddOnsPayloads(options: {
  menusPayload: unknown;
  variantsPayload: unknown;
  itemsPayload: unknown;
  categoriesPayload: unknown;
}): { rows: AddOnRow[]; categoryOptions: string[] } {
  const menus = unwrapArray<MenuApiItem>(options.menusPayload);
  const variants = unwrapArray<MenuVariantApiItem>(options.variantsPayload);
  const items = unwrapArray<MenuVariantItemApiItem>(options.itemsPayload);
  const categories = unwrapArray<CategoryApiItem>(options.categoriesPayload);

  const categoryMap = new Map<string, string>();
  categories
    .filter((item) => (item.type ?? "").toLowerCase() !== "ingredient")
    .forEach((item) => {
      const rawId = item.id ?? item.categoryId ?? item.category_id;
      if (rawId == null) return;
      const id = String(rawId);
      const label = resolveCategoryLabel(item);
      if (!id || !label || label === "-") return;
      if (!categoryMap.has(id)) {
        categoryMap.set(id, label);
      }
    });

  const menuMap = new Map<
    string,
    { sku: string; categoryId?: string; status: string }
  >();
  menus.forEach((menu) => {
    const id = menu.id != null ? String(menu.id) : "";
    if (!id) return;
    const categoryIdRaw = menu.categoryId ?? menu.category_id;
    const categoryId =
      categoryIdRaw != null ? String(categoryIdRaw) : undefined;
    const activeValue = normalizeBoolean(menu.isActive ?? menu.is_active);
    const status = activeValue == null ? "-" : activeValue ? "Aktif" : "Nonaktif";

    menuMap.set(id, {
      sku: menu.sku ?? "-",
      categoryId,
      status,
    });
  });

  const variantMap = new Map<string, { menuId?: string; name?: string }>();
  variants.forEach((variant) => {
    const id = variant.id != null ? String(variant.id) : "";
    if (!id) return;
    const menuIdRaw = variant.menuId ?? variant.menu_id;
    const menuId = menuIdRaw != null ? String(menuIdRaw) : undefined;
    const name = typeof variant.name === "string" ? variant.name.trim() : "";
    variantMap.set(id, { menuId, name: name || undefined });
  });

  const rows: AddOnRow[] = items.map((item, index) => {
    const variantIdRaw = item.menuVariantId ?? item.menu_variant_id ?? "";
    const variantId = variantIdRaw != null ? String(variantIdRaw) : "";
    const variant = variantId ? variantMap.get(variantId) : undefined;
    const menu = variant?.menuId ? menuMap.get(variant.menuId) : undefined;

    const categoryLabel = menu?.categoryId
      ? categoryMap.get(menu.categoryId) ?? `Kategori ${menu.categoryId}`
      : "-";

    const price =
      toNumber(
        item.additionalPrice ?? item.additional_price ?? item.price
      ) ?? null;

    const name =
      (typeof item.name === "string" && item.name.trim() ? item.name : null) ??
      variant?.name ??
      "-";

    return {
      id: toNumberId(item.id, index + 1),
      sku: menu?.sku ?? "-",
      category: categoryLabel,
      name,
      price,
      status: menu?.status ?? "-",
    };
  });

  const categoryOptions = [
    "Semua Kategori",
    ...Array.from(
      new Set(rows.map((row) => row.category).filter((label) => label && label !== "-"))
    ),
  ];

  return { rows, categoryOptions };
}
