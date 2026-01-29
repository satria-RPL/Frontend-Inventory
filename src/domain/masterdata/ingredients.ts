import type { RawMaterialRow } from "@/types/masterdata";
import { unwrapArray } from "@/domain/masterdata/utils";

type IngredientApiItem = {
  id?: number | string;
  name?: string;
  unitId?: number | string;
  unit_id?: number | string;
  category?: string;
  categoryId?: number | string;
  category_id?: number | string;
  sku?: string;
  skuInduk?: string;
  sku_induk?: string;
  stock?: number | string;
  stockSystem?: number | string;
  stock_system?: number | string;
};

type CategoryApiItem = {
  id?: number | string;
  name?: string;
  type?: string;
};

type PlaceStockApiItem = {
  id?: number | string;
  placeId?: number | string;
  place_id?: number | string;
  ingredientId?: number | string;
  ingredient_id?: number | string;
  qty?: number | string;
  unitId?: number | string;
  unit_id?: number | string;
};

type UnitApiItem = {
  id?: number | string;
  name?: string;
  abbreviation?: string;
};

export type IngredientsResult = {
  rows: RawMaterialRow[];
  categoryOptions: string[];
  unitOptions: string[];
};

export function normalizeIngredientsPayloads(options: {
  ingredientsPayload: unknown;
  unitsPayload: unknown;
  stocksPayload: unknown;
  categoriesPayload: unknown;
}): IngredientsResult {
  const ingredientList = unwrapArray<IngredientApiItem>(
    options.ingredientsPayload
  );
  const unitList = unwrapArray<UnitApiItem>(options.unitsPayload);
  const stocksList = unwrapArray<PlaceStockApiItem>(options.stocksPayload);
  const categoryList = unwrapArray<CategoryApiItem>(options.categoriesPayload);

  const unitMap = new Map<string, string>();
  unitList.forEach((unit) => {
    const id = unit.id != null ? String(unit.id) : "";
    const label = unit.abbreviation ?? unit.name ?? "";
    if (id && label) {
      unitMap.set(id, label);
    }
  });

  const categoryMap = new Map<string, string>();
  categoryList.forEach((categoryItem) => {
    const type = (categoryItem.type ?? "").toLowerCase();
    if (type && type !== "ingredient") return;
    const id = categoryItem.id != null ? String(categoryItem.id) : "";
    const label = categoryItem.name?.trim() ?? "";
    if (id && label) {
      categoryMap.set(id, label);
    }
  });

  const stockMap = new Map<
    string,
    { qty: number | string; unitId?: number | string }
  >();
  stocksList.forEach((stock) => {
    const ingredientId = stock.ingredientId ?? stock.ingredient_id ?? null;
    if (ingredientId == null) return;
    const key = String(ingredientId);
    stockMap.set(key, {
      qty: stock.qty ?? "-",
      unitId: stock.unitId ?? stock.unit_id,
    });
  });

  const rows: RawMaterialRow[] = ingredientList.map((item, index) => {
    const unitId = item.unitId ?? item.unit_id;
    const stock = item.id != null ? stockMap.get(String(item.id)) : undefined;
    const stockUnitId = stock?.unitId ?? unitId;
    const categoryId = item.categoryId ?? item.category_id;
    const categoryLabel =
      categoryId != null ? categoryMap.get(String(categoryId)) ?? "" : "";
    const skuInduk =
      item.skuInduk ??
      item.sku_induk ??
      item.sku ??
      (item.id != null ? `SKU-${item.id}` : "-");

    return {
      id: item.id ?? index + 1,
      skuInduk,
      kategori:
        item.category ??
        categoryLabel ??
        (categoryId != null ? `Kategori ${categoryId}` : "-"),
      namaBarang: item.name ?? "-",
      stokSistem:
        stock?.qty ??
        item.stockSystem ??
        item.stock_system ??
        item.stock ??
        "-",
      satuan:
        stockUnitId != null
          ? unitMap.get(String(stockUnitId)) ?? String(stockUnitId)
          : "-",
    };
  });

  const categoryOptions = [
    "Semua Kategori",
    ...categoryList
      .filter((item) => (item.type ?? "").toLowerCase() === "ingredient")
      .map((item) => item.name?.trim() ?? "")
      .filter((label) => label && label !== "-"),
  ];

  const unitOptions = [
    "Semua Satuan",
    ...unitList
      .map((unit) => unit.abbreviation ?? unit.name ?? "")
      .filter((label) => label && label !== "-"),
  ];

  return { rows, categoryOptions, unitOptions };
}
