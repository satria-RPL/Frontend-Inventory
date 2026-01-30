import { useCallback, useEffect, useState } from "react";

import {
  fetchCategoriesClient,
  fetchMenusClient,
} from "@/lib/services/menuClientService";
import {
  fetchMenuVariantItems,
  fetchMenuVariants,
} from "@/lib/services/menuVariantService";
import { normalizeAddOnsPayloads } from "@/domain/masterdata/addOns";
import type { AddOnRow } from "@/types/masterdata";

export default function useMasterdataAddOns() {
  const [rows, setRows] = useState<AddOnRow[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    "Semua Kategori",
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [menusRes, variantsRes, itemsRes, categoriesRes] =
        await Promise.all([
          fetchMenusClient(),
          fetchMenuVariants(),
          fetchMenuVariantItems(),
          fetchCategoriesClient(),
        ]);

      if (!itemsRes.ok) {
        throw new Error(itemsRes.error || "Gagal memuat add-ons.");
      }

      const normalized = normalizeAddOnsPayloads({
        menusPayload: menusRes.ok ? menusRes.data : null,
        variantsPayload: variantsRes.ok ? variantsRes.data : null,
        itemsPayload: itemsRes.data,
        categoriesPayload: categoriesRes.ok ? categoriesRes.data : null,
      });

      setRows(normalized.rows);
      setCategoryOptions(normalized.categoryOptions);
    } catch (err) {
      setRows([]);
      setCategoryOptions(["Semua Kategori"]);
      setError(err instanceof Error ? err.message : "Gagal memuat add-ons.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    rows,
    categoryOptions,
    loading,
    error,
    reload: load,
  };
}
