"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import AddRoleModal from "@/components/modals/AddRoleModal";
import EditRoleModal from "@/components/modals/EditRoleModal";
import ViewRoleModal from "@/components/modals/ViewRoleModal";
import DeleteRoleModal from "@/components/modals/DeleteRoleModal";
import { canEditTarget, canManageUsers } from "@/lib/utils/role-hierarchy";

type RoleItem = {
  id: number;
  name: string;
  description: string;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
};

type RoleApiItem = {
  id?: number | string;
  name?: string;
  description?: string;
  permissions?: string[];
  createdAt?: string;
  created_at?: string;
  created?: string;
  updatedAt?: string;
  updated_at?: string;
  updated?: string;
};

type RolesApiResponse =
  | RoleApiItem[]
  | { data?: RoleApiItem[] | { roles?: RoleApiItem[] } }
  | { roles?: RoleApiItem[] };

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

function formatDate(value: string | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function normalizeRoles(payload: RolesApiResponse | null): RoleItem[] {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload?.data
      : payload?.data && typeof payload.data === "object" && "roles" in payload.data
        ? (payload.data as { roles?: RoleApiItem[] }).roles ?? []
        : payload && typeof payload === "object" && "roles" in payload
          ? (payload as { roles?: RoleApiItem[] }).roles ?? []
          : [];
  return list.map((item, index) => ({
    id: toNumberId(item.id, index + 1),
    name: item.name ?? "-",
    description: item.description ?? "-",
    permissions: Array.isArray(item.permissions) ? item.permissions : [],
    createdAt: formatDate(item.createdAt ?? item.created_at ?? item.created),
    updatedAt: formatDate(item.updatedAt ?? item.updated_at ?? item.updated),
  }));
}

export default function Roles() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [viewingRole, setViewingRole] = useState<RoleItem | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sessionRole, setSessionRole] = useState("");
  const [canManageRoles, setCanManageRoles] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadSessionUser() {
      try {
        const res = await fetch("/api/session-user", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as { role?: string } | null;
        if (!isActive) return;
        const role = data?.role ?? "";
        setSessionRole(role);
        setCanManageRoles(canManageUsers(role));
      } catch {
        if (isActive) {
          setSessionRole("");
          setCanManageRoles(false);
        }
      }
    }

    loadSessionUser();
    return () => {
      isActive = false;
    };
  }, []);

  const loadRoles = async (isActiveRef?: () => boolean) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/roles", { cache: "no-store" });
      const data = (await res
        .json()
        .catch(() => null)) as RolesApiResponse | null;
      if (!res.ok) {
        const message =
          data && typeof data === "object" && "message" in data
            ? String((data as { message?: unknown }).message)
            : "Gagal memuat role.";
        throw new Error(message);
      }

      if (!isActiveRef || isActiveRef()) {
        setRoles(normalizeRoles(data));
      }
    } catch (err) {
      if (!isActiveRef || isActiveRef()) {
        setRoles([]);
        setError(err instanceof Error ? err.message : "Gagal memuat role.");
      }
    } finally {
      if (!isActiveRef || isActiveRef()) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let isActive = true;
    loadRoles(() => isActive);
    return () => {
      isActive = false;
    };
  }, []);

  const handleDeleteRole = async (password: string) => {
    if (!deletingRole) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/roles/${deletingRole.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          data && typeof data === "object" && "message" in data
            ? String((data as { message?: unknown }).message)
            : "Gagal menghapus role.";
        throw new Error(message);
      }
      setDeletingRole(null);
      await loadRoles();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Gagal menghapus role.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredRoles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return roles;
    return roles.filter((role) => {
      return role.name.toLowerCase().includes(normalized);
    });
  }, [query, roles]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / perPage));
  const pagedRoles = filteredRoles.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="min-h-screen space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Role Management</h1>
        {canManageRoles ? (
          <button
            type="button"
            onClick={() => setShowAddRole(true)}
            className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            <Plus size={16} />
            Add New Role
          </button>
        ) : null}
      </div>

      <div className="border border-gray-200" />

      <div className="flex items-center gap-6">
        <label className="text-sm text-gray-600">Search</label>
        <label className="text-sm text-gray-600"> : </label>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama role..."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      <div className="rounded-2xl border-3 border-gray-200 bg-white">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 border-2 border-black/10">
            <tr className="text-left text-xs font-medium text-[#9a9a9a]">
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">Nama Role</th>
              <th className="px-4 py-3">Deskripsi</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Updated At</th>
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

            {!loading && !error && pagedRoles.length === 0 && (
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
              pagedRoles.map((role, index) => (
                <tr
                  key={role.id}
                  className="border-b border-gray-200 even:bg-[#fff3ec] even:[&>td]:font-semibold odd:[&>td]:font-normal hover:bg-[#fff0e8]"
                >
                  <td className="px-4 py-3 text-center">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#3f2f23]">
                    {role.name}
                  </td>
                    <td className="px-4 py-3">{role.description}</td>
                    <td className="px-4 py-3">{role.createdAt}</td>
                    <td className="px-4 py-3">{role.updatedAt}</td>
                    <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {canEditTarget(sessionRole, role.name) ? (
                        <button
                          type="button"
                          aria-label="Edit role"
                          onClick={() => setEditingRole(role)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white hover:opacity-90"
                        >
                          <Pencil size={14} />
                        </button>
                      ) : null}
                      {canEditTarget(sessionRole, role.name) ? (
                        <button
                          type="button"
                          aria-label="Delete role"
                          onClick={() => {
                            setDeletingRole(role);
                            setDeleteError(null);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ef4444] text-white hover:opacity-90"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : null}
                      {canManageRoles ? (
                        <button
                          type="button"
                          aria-label="View role"
                          onClick={() => setViewingRole(role)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#22c55e] text-white hover:opacity-90"
                        >
                          <Eye size={14} />
                        </button>
                      ) : null}
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
            {loading ? 0 : Math.min(page * perPage, filteredRoles.length)}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-[#3f2f23]">
            {loading ? 0 : filteredRoles.length}
          </span>
        </p>

        <Pagination
          page={page}
          setPage={setPage}
          total={filteredRoles.length}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      </div>

      <AddRoleModal
        open={showAddRole}
        onClose={() => setShowAddRole(false)}
        onCreated={async () => {
          await loadRoles();
        }}
      />
      <EditRoleModal
        open={Boolean(editingRole)}
        onClose={() => setEditingRole(null)}
        role={editingRole}
        onUpdated={async () => {
          await loadRoles();
        }}
      />
      <ViewRoleModal
        open={Boolean(viewingRole)}
        onClose={() => setViewingRole(null)}
        role={viewingRole}
      />
      <DeleteRoleModal
        open={Boolean(deletingRole)}
        roleName={deletingRole?.name}
        loading={deleting}
        error={deleteError}
        onClose={() => setDeletingRole(null)}
        onConfirm={handleDeleteRole}
      />
    </div>
  );
}
