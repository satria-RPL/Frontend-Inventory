"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronDown, ChevronUp, RefreshCcw } from "lucide-react";

type ActivityLogItem = {
  id: number;
  datetime: string;
  category: string;
  activity: string;
  description: string;
  user: string;
  userId?: string;
  createdAt?: string;
};

type ActivityLogApiItem = {
  id?: number | string;
  userId?: number | string | null;
  userName?: string;
  username?: string;
  action?: string;
  entityType?: string;
  entityId?: number | string | null;
  contextJson?: unknown;
  createdAt?: string;
};

type ActivityLogsApiResponse = ActivityLogApiItem[] | { data?: ActivityLogApiItem[] };

type UserApiItem = {
  id?: number | string;
  name?: string;
  username?: string;
  email?: string;
  role?: { name?: string; description?: string; role?: string } | string | null;
  roleName?: string;
};

type UsersApiResponse = UserApiItem[] | { data?: UserApiItem[] };

function toTitleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toNumberId(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function resolveDescription(item: ActivityLogApiItem) {
  if (item.contextJson && typeof item.contextJson === "object") {
    const context = item.contextJson as Record<string, unknown>;
    if (typeof context.description === "string" && context.description.trim()) {
      return context.description;
    }
    if (typeof context.message === "string" && context.message.trim()) {
      return context.message;
    }
  }
  const action = item.action ? toTitleCase(item.action) : "Activity";
  const entity = item.entityType ? toTitleCase(item.entityType) : "Entity";
  const entityId = item.entityId ? ` #${item.entityId}` : "";
  return `${action} ${entity}${entityId}`.trim();
}

function resolveUserLabel(item: ActivityLogApiItem) {
  if (typeof item.userName === "string" && item.userName.trim()) {
    return item.userName;
  }
  if (typeof item.username === "string" && item.username.trim()) {
    return item.username;
  }
  if (item.contextJson && typeof item.contextJson === "object") {
    const context = item.contextJson as Record<string, unknown>;
    const contextUser = context.user as Record<string, unknown> | undefined;
    if (contextUser) {
      const name = (typeof contextUser.name === "string" && contextUser.name.trim() ? contextUser.name : undefined) ?? (typeof contextUser.username === "string" && contextUser.username.trim() ? contextUser.username : undefined);
      if (name) return name;
    }
    if (typeof context.name === "string" && context.name.trim()) {
      return context.name;
    }
    if (typeof context.username === "string" && context.username.trim()) {
      return context.username;
    }
  }
  if (item.userId !== null && item.userId !== undefined && `${item.userId}`) {
    return `User #${item.userId}`;
  }
  return "-";
}

function normalizeLogs(payload: ActivityLogsApiResponse | null): ActivityLogItem[] {
  const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
  return list.map((item, index) => ({
    id: toNumberId(item.id, index + 1),
    datetime: formatDateTime(item.createdAt),
    category: item.entityType ? toTitleCase(item.entityType) : "-",
    activity: item.action ? toTitleCase(item.action) : "-",
    description: resolveDescription(item),
    user: resolveUserLabel(item),
    userId: item.userId !== null && item.userId !== undefined ? String(item.userId) : undefined,
    createdAt: item.createdAt,
  }));
}

function normalizeUsers(payload: UsersApiResponse | null) {
  const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
  const entries = list
    .map((item) => {
      const id = item.id !== null && item.id !== undefined ? String(item.id).trim() : "";
      const name = (item.name ?? item.username ?? "").toString().trim();
      return id && name ? [id, name] : null;
    })
    .filter(Boolean) as Array<[string, string]>;
  return Object.fromEntries(entries);
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [draftUserId, setDraftUserId] = useState("");
  const [draftCategory, setDraftCategory] = useState("");
  const [draftStartDate, setDraftStartDate] = useState("");
  const [activeUserId, setActiveUserId] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeStartDate, setActiveStartDate] = useState("");
  const [sortKey, setSortKey] = useState<
    "datetime" | "category" | "activity" | "description" | "user"
  >("datetime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let isActive = true;

    async function loadLogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/activity-logs", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as ActivityLogsApiResponse | null;
        if (!res.ok) {
          const message = data && typeof data === "object" && "message" in data ? String((data as { message?: unknown }).message) : "Gagal memuat activity logs.";
          throw new Error(message);
        }

        if (isActive) {
          setLogs(normalizeLogs(data));
        }
      } catch (err) {
        if (isActive) {
          setLogs([]);
          setError(err instanceof Error ? err.message : "Gagal memuat activity logs.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadLogs();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as UsersApiResponse | null;
        if (!res.ok) return;
        if (isActive) {
          setUserMap(normalizeUsers(data));
        }
      } catch {
        if (isActive) {
          setUserMap({});
        }
      }
    }

    loadUsers();
    return () => {
      isActive = false;
    };
  }, []);

  const userOptions = useMemo(() => {
    const entries = Object.entries(userMap).filter(([, name]) => name.trim());
    const sorted = entries.sort(([, a], [, b]) => a.localeCompare(b));
    return sorted.map(([id, name]) => ({ id, name }));
  }, [userMap]);

  const categoryOptions = useMemo(() => {
    const values = new Set<string>();
    logs.forEach((log) => {
      if (log.category && log.category !== "-") values.add(log.category);
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const startDate = activeStartDate ? new Date(activeStartDate) : null;
    if (startDate) {
      startDate.setHours(0, 0, 0, 0);
    }
    return logs.filter((log) => {
      if (activeUserId && log.userId !== activeUserId) return false;
      if (activeCategory && log.category !== activeCategory) return false;
      if (startDate && log.createdAt) {
        const logDate = new Date(log.createdAt);
        if (Number.isNaN(logDate.getTime())) return false;
        if (logDate < startDate) return false;
      }
      return true;
    });
  }, [activeCategory, activeStartDate, activeUserId, logs]);

  const sortedLogs = useMemo(() => {
    const sorted = [...filteredLogs];
    sorted.sort((a, b) => {
      if (sortKey === "datetime") {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
      }
      const aValue = (a[sortKey] ?? "").toString().toLowerCase();
      const bValue = (b[sortKey] ?? "").toString().toLowerCase();
      if (aValue === bValue) return 0;
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue > bValue ? -1 : 1;
    });
    return sorted;
  }, [filteredLogs, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedLogs.length / perPage));
  const pagedLogs = useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedLogs.slice(start, start + perPage);
  }, [sortedLogs, page]);
  const displayLogs = useMemo(() => {
    if (!Object.keys(userMap).length) return pagedLogs;
    return pagedLogs.map((row) => {
      if (row.userId && userMap[row.userId]) {
        return { ...row, user: userMap[row.userId] };
      }
      return row;
    });
  }, [pagedLogs, userMap]);
  const visiblePages = useMemo(() => {
    const maxButtons = 3;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const start = Math.min(Math.max(1, page - 1), totalPages - (maxButtons - 1));
    return Array.from({ length: maxButtons }, (_, index) => start + index);
  }, [page, totalPages]);

  const handleSort = (
    key: "datetime" | "category" | "activity" | "description" | "user"
  ) => {
    setPage(1);
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Activity Logs</h1>
        <button
          type="button"
          onClick={() => {
            setDraftUserId("");
            setDraftCategory("");
            setDraftStartDate("");
            setActiveUserId("");
            setActiveCategory("");
            setActiveStartDate("");
            setPage(1);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <div>
            <label className="text-xs font-medium text-gray-500">Filter User</label>
            <div className="mt-2 relative">
              <select value={draftUserId} onChange={(event) => setDraftUserId(event.target.value)} className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-10 text-sm text-gray-600">
                <option value="">Semua User</option>
                {userOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Filter Kategori</label>
            <div className="mt-2 relative">
              <select value={draftCategory} onChange={(event) => setDraftCategory(event.target.value)} className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-10 text-sm text-gray-600">
                <option value="">Semua Kategori</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Tanggal Mulai</label>
            <div className="mt-2 relative">
              <input type="date" value={draftStartDate} onChange={(event) => setDraftStartDate(event.target.value)} className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 pr-10 text-sm text-gray-600" />
              <CalendarDays size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex items-end justify-end">
            <button
              type="button"
              onClick={() => {
                setActiveUserId(draftUserId);
                setActiveCategory(draftCategory);
                setActiveStartDate(draftStartDate);
                setPage(1);
              }}
              className="h-9 rounded-md bg-orange-500 px-4 text-xs font-semibold text-white"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full min-w-[900px] table-fixed">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                  <th className="w-12 px-6 py-3 text-left text-xs font-semibold text-gray-500">#</th>
                  <th className="w-44 px-6 py-3 text-left text-xs font-semibold text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleSort("datetime")}
                      className="inline-flex items-center gap-1"
                    >
                      Tanggal & Waktu
                      <span className="flex flex-col leading-none text-gray-300">
                        <ChevronUp
                          size={12}
                          className={sortKey === "datetime" && sortDirection === "asc" ? "text-gray-600" : ""}
                        />
                        <ChevronDown
                          size={12}
                          className={sortKey === "datetime" && sortDirection === "desc" ? "text-gray-600" : ""}
                        />
                      </span>
                    </button>
                  </th>
                  <th className="w-40 px-6 py-3 text-left text-xs font-semibold text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleSort("category")}
                      className="inline-flex items-center gap-1"
                    >
                      Kategori
                      <span className="flex flex-col leading-none text-gray-300">
                        <ChevronUp
                          size={12}
                          className={sortKey === "category" && sortDirection === "asc" ? "text-gray-600" : ""}
                        />
                        <ChevronDown
                          size={12}
                          className={sortKey === "category" && sortDirection === "desc" ? "text-gray-600" : ""}
                        />
                      </span>
                    </button>
                  </th>
                  <th className="w-36 px-6 py-3 text-left text-xs font-semibold text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleSort("activity")}
                      className="inline-flex items-center gap-1"
                    >
                      Aktivitas
                      <span className="flex flex-col leading-none text-gray-300">
                        <ChevronUp
                          size={12}
                          className={sortKey === "activity" && sortDirection === "asc" ? "text-gray-600" : ""}
                        />
                        <ChevronDown
                          size={12}
                          className={sortKey === "activity" && sortDirection === "desc" ? "text-gray-600" : ""}
                        />
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleSort("description")}
                      className="inline-flex items-center gap-1"
                    >
                      Keterangan
                      <span className="flex flex-col leading-none text-gray-300">
                        <ChevronUp
                          size={12}
                          className={sortKey === "description" && sortDirection === "asc" ? "text-gray-600" : ""}
                        />
                        <ChevronDown
                          size={12}
                          className={sortKey === "description" && sortDirection === "desc" ? "text-gray-600" : ""}
                        />
                      </span>
                    </button>
                  </th>
                  <th className="w-32 px-6 py-3 text-left text-xs font-semibold text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleSort("user")}
                      className="inline-flex items-center gap-1"
                    >
                      User
                      <span className="flex flex-col leading-none text-gray-300">
                        <ChevronUp
                          size={12}
                          className={sortKey === "user" && sortDirection === "asc" ? "text-gray-600" : ""}
                        />
                        <ChevronDown
                          size={12}
                          className={sortKey === "user" && sortDirection === "desc" ? "text-gray-600" : ""}
                        />
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                      Memuat activity logs...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                      Data activity logs belum tersedia.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  displayLogs.map((row, index) => (
                    <tr key={row.id} className={`border-b border-gray-100 ${index % 2 === 1 ? "bg-orange-50" : "bg-white"} hover:bg-gray-50`}>
                      <td className="px-6 py-4 text-sm text-gray-600">{(page - 1) * perPage + index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{row.datetime}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-normal break-words">{row.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-normal break-words">{row.activity}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-normal break-words">{row.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{row.user}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <span>
            Data di tampilkan {loading ? 0 : Math.min(page * perPage, filteredLogs.length)} dari {loading ? 0 : filteredLogs.length}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${pageNumber === page ? "bg-orange-500 text-white" : "border border-gray-200 text-gray-600"}`}
              >
                {pageNumber}
              </button>
            ))}
            <div className="flex items-center gap-2">
              <span>Go to:</span>
              <input type="text" placeholder="50" className="w-12 rounded-md border border-gray-200 px-2 py-1.5 text-center text-xs text-gray-600 placeholder:text-gray-400" />
            </div>
            <button className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600">10/Pages</button>
          </div>
        </div>
      </div>
    </div>
  );
}
