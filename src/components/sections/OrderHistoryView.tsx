"use client";

import { useEffect, useMemo, useState } from "react";
import OrderTable, { type HistoryOrderRow } from "@/components/sections/HistoryOrderTable";
import { dummyProducts } from "@/data/historyproduct";

type OrderHistoryViewProps = {
  authName?: string;
  authRole?: string;
  rows?: HistoryOrderRow[];
  total?: number;
  page?: number;
  perPage?: number;
  setPage?: (n: number) => void;
  setPerPage?: (n: number) => void;
  paginateClientSide?: boolean;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onDelete?: (row: HistoryOrderRow) => void;
  onView?: (row: HistoryOrderRow) => void;
};

export default function OrderHistoryView({
  rows,
  total,
  page,
  perPage,
  setPage,
  setPerPage,
  paginateClientSide = true,
  loading = false,
  error = null,
  emptyMessage,
  onDelete,
  onView,
}: OrderHistoryViewProps) {
  const [internalPage, setInternalPage] = useState(1);
  const [internalPerPage, setInternalPerPage] = useState(10);

  const resolvedPage = page ?? internalPage;
  const resolvedPerPage = perPage ?? internalPerPage;
  const resolvedSetPage = setPage ?? setInternalPage;
  const resolvedSetPerPage = setPerPage ?? setInternalPerPage;

  const sourceRows = rows ?? dummyProducts;
  const totalRows = total ?? sourceRows.length;

  const pagedRows = useMemo(() => {
    if (!paginateClientSide) return sourceRows;
    const start = (resolvedPage - 1) * resolvedPerPage;
    return sourceRows.slice(start, start + resolvedPerPage);
  }, [paginateClientSide, sourceRows, resolvedPage, resolvedPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalRows / resolvedPerPage));
  }, [totalRows, resolvedPerPage]);

  useEffect(() => {
    if (resolvedPage > totalPages) {
      resolvedSetPage(totalPages);
    }
  }, [resolvedPage, resolvedSetPage, totalPages]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 px-4 py-4">
      <div className="flex-1 overflow-hidden">
        <OrderTable
          rows={pagedRows}
          total={totalRows}
          page={resolvedPage}
          perPage={resolvedPerPage}
          setPage={resolvedSetPage}
          setPerPage={resolvedSetPerPage}
          loading={loading}
          error={error}
          emptyMessage={emptyMessage}
          onDelete={onDelete}
          onView={onView}
        />
      </div>
    </div>
  );
}
