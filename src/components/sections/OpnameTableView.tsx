"use client";

import { useState } from "react";
import OrderTable from "@/components/sections/OpnameTable";

type OrderHistoryViewProps = {
  authName?: string;
  authRole?: string;
};

type FilterValue = "all" | "proses" | "selesai" | "cancel";
type SortValue = "newest" | "oldest";

export default function OrderHistoryView({
  authName,
  authRole,
}: OrderHistoryViewProps) {
  const [activeFilter, setActiveFilter] =
    useState<FilterValue>("all");
  const [activeSort, setActiveSort] =
    useState<SortValue>("newest");

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex-1 overflow-hidden">
        <OrderTable />
      </div>
    </div>
  );
}
