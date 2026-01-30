import { useCallback, useEffect, useState } from "react";

import {
  fetchIngredientsClient,
  fetchPlaceStocksClient,
  fetchUnitsClient,
} from "@/lib/services/ingredientClientService";
import { fetchCategoriesClient } from "@/lib/services/menuClientService";
import {
  normalizeIngredientsPayloads,
  type IngredientsResult,
} from "@/domain/masterdata/ingredients";

const fallbackResult: IngredientsResult = {
  rows: [],
  categoryOptions: ["Semua Kategori"],
  unitOptions: ["Semua Satuan"],
};

export default function useMasterdataIngredients() {
  const [data, setData] = useState<IngredientsResult>(fallbackResult);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ingredientsRes, unitsRes, stocksRes, categoriesRes] =
        await Promise.all([
          fetchIngredientsClient(),
          fetchUnitsClient(),
          fetchPlaceStocksClient(),
          fetchCategoriesClient(),
        ]);

      if (!ingredientsRes.ok) {
        throw new Error(
          ingredientsRes.error || "Gagal memuat bahan baku."
        );
      }

      const normalized = normalizeIngredientsPayloads({
        ingredientsPayload: ingredientsRes.data,
        unitsPayload: unitsRes.ok ? unitsRes.data : null,
        stocksPayload: stocksRes.ok ? stocksRes.data : null,
        categoriesPayload: categoriesRes.ok ? categoriesRes.data : null,
      });

      setData(normalized);
    } catch (err) {
      setData(fallbackResult);
      setError(
        err instanceof Error ? err.message : "Gagal memuat bahan baku."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    rows: data.rows,
    categoryOptions: data.categoryOptions,
    unitOptions: data.unitOptions,
    loading,
    error,
    reload: load,
  };
}
