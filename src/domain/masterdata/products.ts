import type { ProductTableRow } from "@/types/masterdata";
import {
  normalizeBoolean,
  toNumber,
  toNumberId,
  toTimestamp,
  unwrapArray,
} from "@/domain/masterdata/utils";

type MenuApiItem = {
  id?: number | string;
  placeId?: number | string;
  place_id?: number | string;
  name?: string;
  categoryId?: number | string;
  category_id?: number | string;
  description?: string;
  sku?: string;
  price?: number | string;
  sellPrice?: number | string;
  sellingPrice?: number | string;
  amount?: number | string;
  isActive?: boolean | number | string;
  is_active?: boolean | number | string;
  createdAt?: string;
  created_at?: string;
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

type MenuPriceApiItem = {
  id?: number | string;
  menuId?: number | string;
  menu_id?: number | string;
  menu?: { id?: number | string };
  price?: number | string;
  sellPrice?: number | string;
  sellingPrice?: number | string;
  amount?: number | string;
  effectiveDate?: string;
  effective_date?: string;
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

export type CategoryOption = {
  id: string;
  label: string;
};

const spicyVariantKeywords = ["pedas", "spicy"];
const packagingVariantKeywords = ["packaging"];

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

function matchesKeywords(value: string, keywords: string[]) {
  const keywordSet = new Set(keywords);
  const tokens = value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  return tokens.some((token) => keywordSet.has(token));
}

function normalizeMenuVariants(payload: unknown) {
  const list = unwrapArray<MenuVariantApiItem>(payload);
  const namesByMenuId = new Map<string, string[]>();
  const packagingVariantIdsByMenu = new Map<string, string[]>();

  list.forEach((item) => {
    const rawMenuId = item.menuId ?? item.menu_id;
    const menuKey = rawMenuId != null ? String(rawMenuId) : "";
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!menuKey) return;
    if (name) {
      addUniqueName(namesByMenuId, menuKey, name);
    }
    const rawVariantId = item.id ?? null;
    const variantId = rawVariantId != null ? String(rawVariantId) : "";
    if (
      variantId &&
      name &&
      matchesKeywords(name, packagingVariantKeywords)
    ) {
      addUniqueName(packagingVariantIdsByMenu, menuKey, variantId);
    }
  });

  return { namesByMenuId, packagingVariantIdsByMenu };
}

function resolveSpicyFlag(names: string[], keywords: string[]) {
  if (names.length === 0) return false;
  return names.some((name) => matchesKeywords(name, keywords));
}

function resolveAdditionalFlag(names: string[]) {
  return names.length > 0;
}

function normalizeMenuVariantItems(payload: unknown) {
  const list = unwrapArray<MenuVariantItemApiItem>(payload);
  const namesByVariantId = new Map<string, string[]>();

  list.forEach((item) => {
    const rawVariantId = item.menuVariantId ?? item.menu_variant_id;
    const variantKey = rawVariantId != null ? String(rawVariantId) : "";
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!variantKey || !name) return;
    addUniqueName(namesByVariantId, variantKey, name);
  });

  return namesByVariantId;
}

function buildPackagingMap(
  packagingVariantIdsByMenu: Map<string, string[]>,
  variantItemsMap: Map<string, string[]>
) {
  const result = new Map<string, string[]>();
  packagingVariantIdsByMenu.forEach((variantIds, menuId) => {
    variantIds.forEach((variantId) => {
      const items = variantItemsMap.get(variantId) ?? [];
      items.forEach((name) => addUniqueName(result, menuId, name));
    });
  });
  return result;
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

function normalizeCategories(payload: unknown): CategoryOption[] {
  const list = unwrapArray<CategoryApiItem>(payload);
  const seen = new Set<string>();
  return list
    .filter((item) => {
      const type = (item.type ?? "").toLowerCase();
      return type !== "ingredient";
    })
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

function shouldReplacePrice(currentDate: number | null, nextDate: number | null) {
  if (currentDate == null && nextDate == null) return true;
  if (currentDate == null) return true;
  if (nextDate == null) return false;
  return nextDate >= currentDate;
}

function buildPriceMap(payload: unknown) {
  const list = unwrapArray<MenuPriceApiItem>(payload);
  const map = new Map<
    number,
    { price: number; effectiveDate: number | null; priceId?: number | string }
  >();

  list.forEach((item) => {
    const rawMenuId = item.menuId ?? item.menu_id ?? item.menu?.id;
    const rawPrice =
      item.price ?? item.sellPrice ?? item.sellingPrice ?? item.amount;
    const menuId = toNumber(rawMenuId);
    const price = toNumber(rawPrice);
    if (menuId == null || price == null) return;

    const effectiveDate = toTimestamp(item.effectiveDate ?? item.effective_date);
    const existing = map.get(menuId);
    if (!existing || shouldReplacePrice(existing.effectiveDate, effectiveDate)) {
      map.set(menuId, { price, effectiveDate, priceId: item.id });
    }
  });

  const result = new Map<
    number,
    { price: number; priceId?: number | string }
  >();
  map.forEach((value, key) =>
    result.set(key, { price: value.price, priceId: value.priceId })
  );
  return result;
}

function normalizeMenus(
  payload: unknown,
  priceMap: Map<number, { price: number; priceId?: number | string }>,
  variantMap: Map<string, string[]>,
  categoryMap: Map<string, string>,
  packagingMap: Map<string, string[]>
): ProductTableRow[] {
  const list = unwrapArray<MenuApiItem>(payload);
  return list.map((item, index) => {
    const rawMenuId = item.id ?? null;
    const menuId = toNumber(rawMenuId);
    const menuKey = rawMenuId != null ? String(rawMenuId) : "";
    const variantNames = menuKey ? variantMap.get(menuKey) ?? [] : [];
    const packagingNames = menuKey ? packagingMap.get(menuKey) ?? [] : [];
    const rawPrice =
      item.price ?? item.sellPrice ?? item.sellingPrice ?? item.amount;
    const menuPrice = toNumber(rawPrice);
    const categoryId = item.categoryId ?? item.category_id ?? null;
    const categoryKey = categoryId != null ? String(categoryId) : "";
    const category =
      (categoryKey && categoryMap.get(categoryKey)) ??
      (categoryKey ? `Kategori ${categoryKey}` : "-");
    const activeValue = normalizeBoolean(item.isActive ?? item.is_active);
    const status = activeValue == null ? "-" : activeValue ? "Aktif" : "Draft";
    const packaging =
      packagingNames.length > 0 ? packagingNames.join(", ") : null;

    return {
      id: toNumberId(item.id, index + 1),
      sku: item.sku ?? "-",
      name: item.name ?? "-",
      description: item.description ?? "-",
      packaging,
      category,
      categoryId: categoryKey || undefined,
      price:
        menuPrice != null
          ? menuPrice
          : menuId != null
            ? priceMap.get(menuId)?.price ?? null
            : null,
      priceId: menuId != null ? priceMap.get(menuId)?.priceId : undefined,
      spicyVariant: resolveSpicyFlag(variantNames, spicyVariantKeywords),
      additionalVariant: resolveAdditionalFlag(variantNames),
      status,
      createdAt: item.createdAt ?? item.created_at ?? "-",
    };
  });
}

export function normalizeProductsPayloads(options: {
  menusPayload: unknown;
  pricesPayload: unknown;
  variantsPayload: unknown;
  variantItemsPayload: unknown;
  categoriesPayload: unknown;
}): { rows: ProductTableRow[]; categories: CategoryOption[] } {
  const priceMap = buildPriceMap(options.pricesPayload);
  const { namesByMenuId, packagingVariantIdsByMenu } = normalizeMenuVariants(
    options.variantsPayload
  );
  const variantItemsMap = normalizeMenuVariantItems(
    options.variantItemsPayload
  );
  const packagingMap = buildPackagingMap(
    packagingVariantIdsByMenu,
    variantItemsMap
  );
  const categories = normalizeCategories(options.categoriesPayload);
  const categoryMap = new Map(categories.map((entry) => [entry.id, entry.label]));
  const rows = normalizeMenus(
    options.menusPayload,
    priceMap,
    namesByMenuId,
    categoryMap,
    packagingMap
  );

  return { rows, categories };
}
