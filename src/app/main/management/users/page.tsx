"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

type UserItem = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type UserApiItem = {
  id?: number | string;
  name?: string;
  username?: string;
  email?: string;
  role?: { name?: string; description?: string; role?: string } | string | null;
  roleName?: string;
};

type UsersApiResponse = UserApiItem[] | { data?: UserApiItem[] };

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

function resolveRoleLabel(item: UserApiItem) {
  if (typeof item.roleName === "string" && item.roleName.trim()) {
    return item.roleName;
  }
  if (typeof item.role === "string") return item.role;
  if (item.role && typeof item.role === "object") {
    return item.role.name ?? item.role.description ?? item.role.role ?? "-";
  }
  return "-";
}

function normalizeUsers(payload: UsersApiResponse | null): UserItem[] {
  const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
  return list.map((item, index) => ({
    id: toNumberId(item.id, index + 1),
    name: item.name ?? item.username ?? "-",
    email: item.email ?? "-",
    role: resolveRoleLabel(item),
  }));
}

export default function Users() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        const data = (await res
          .json()
          .catch(() => null)) as UsersApiResponse | null;
        if (!res.ok) {
          const message =
            data && typeof data === "object" && "message" in data
              ? String((data as { message?: unknown }).message)
              : "Gagal memuat user.";
          throw new Error(message);
        }

        if (isActive) {
          setUsers(normalizeUsers(data));
        }
      } catch (err) {
        if (isActive) {
          setUsers([]);
          setError(err instanceof Error ? err.message : "Gagal memuat user.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadUsers();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized) ||
        user.role.toLowerCase().includes(normalized)
      );
    });
  }, [query, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / perPage));
  const pagedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="min-h-screen space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">User Management</h1>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus size={16} />
          Add New User
        </button>
      </div>

      <div className="border border-gray-200" />

      <div className="flex items-center gap-6">
        <label className="text-sm text-gray-600">Search</label>
        <label className="text-sm text-gray-600"> : </label>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama, email, role..."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      <div className="rounded-2xl border-3 border-gray-200 bg-white">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 border-2 border-black/10">
            <tr className="text-left text-xs font-medium text-[#9a9a9a]">
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">Nama Pengguna</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[#6f6f6f]">
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-sm text-[#9a9a9a]"
                >
                  Memuat data...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && pagedUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-sm text-[#9a9a9a]"
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              pagedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 even:bg-[#fff3ec] even:[&>td]:font-semibold odd:[&>td]:font-normal hover:bg-[#fff0e8]"
                >
                  <td className="px-4 py-3 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#3f2f23]">
                    {user.name}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        aria-label="Edit user"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white hover:opacity-90"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete user"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ef4444] text-white hover:opacity-90"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="View user"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#22c55e] text-white hover:opacity-90"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#3f2f23]">
        <p className="font-bold">
          Data ditampilkan{" "}
          <span className="font-bold text-[#3f2f23]">
            {loading ? 0 : Math.min(page * perPage, filteredUsers.length)}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-[#3f2f23]">
            {loading ? 0 : filteredUsers.length}
          </span>
        </p>

        <Pagination
          page={page}
          setPage={setPage}
          total={filteredUsers.length}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>
    </div>
  );
}
