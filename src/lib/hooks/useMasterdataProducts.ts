import { useCallback, useEffect, useState } from "react";

import {
  fetchCategoriesClient,
  fetchMenuPricesClient,
  fetchMenusClient,
} from "@/lib/services/menuClientService";
import {
  fetchMenuVariants,
  fetchMenuVariantItems,
} from "@/lib/services/menuVariantService";
import {
  normalizeProductsPayloads,
  type CategoryOption,
} from "@/domain/masterdata/products";
import type { ProductTableRow } from "@/types/masterdata";

export default function useMasterdataProducts() {
  const [rows, setRows] = useState<ProductTableRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        menusRes,
        pricesRes,
        variantsRes,
        variantItemsRes,
        categoriesRes,
      ] =
        await Promise.all([
          fetchMenusClient(),
          fetchMenuPricesClient(),
          fetchMenuVariants(),
          fetchMenuVariantItems(),
          fetchCategoriesClient(),
        ]);

      if (!menusRes.ok) {
        throw new Error(menusRes.error || "Gagal memuat produk.");
      }

      const normalized = normalizeProductsPayloads({
        menusPayload: menusRes.data,
        pricesPayload: pricesRes.ok ? pricesRes.data : null,
        variantsPayload: variantsRes.ok ? variantsRes.data : null,
        variantItemsPayload: variantItemsRes.ok ? variantItemsRes.data : null,
        categoriesPayload: categoriesRes.ok ? categoriesRes.data : null,
      });

      setRows(normalized.rows);
      setCategories(normalized.categories);
    } catch (err) {
      setRows([]);
      setCategories([]);
      setError(err instanceof Error ? err.message : "Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    rows,
    categories,
    loading,
    error,
    reload: load,
  };
}
