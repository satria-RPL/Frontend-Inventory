"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { PERMISSION_GROUPS } from "@/lib/constants/permissions";

type RoleInfo = {
  id?: number | string;
  name: string;
  description?: string | null;
  permissions?: string[] | null;
};

type ViewRoleModalProps = {
  open: boolean;
  onClose: () => void;
  role?: RoleInfo | null;
};

const permissionLabelByKey = new Map(
  PERMISSION_GROUPS.flatMap((group) =>
    group.permissions.map((permission) => [permission.key, permission.label])
  )
);

type UserApiItem = {
  id?: number | string;
  name?: string;
  username?: string;
  email?: string;
  role?: { name?: string; description?: string; role?: string } | string | null;
  roleName?: string;
};

type UsersApiResponse =
  | UserApiItem[]
  | { data?: UserApiItem[] | { users?: UserApiItem[] } };

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function resolveUserRole(item: UserApiItem) {
  if (typeof item.roleName === "string" && item.roleName.trim()) {
    return item.roleName;
  }
  if (typeof item.role === "string") return item.role;
  if (item.role && typeof item.role === "object") {
    return item.role.name ?? item.role.description ?? item.role.role ?? "-";
  }
  return "-";
}

export default function ViewRoleModal({ open, onClose, role }: ViewRoleModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [roleUsers, setRoleUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setError(null);
    setSelected(new Set(role?.permissions ?? []));
    setDescription(role?.description ?? "");
  }, [open, role]);

  useEffect(() => {
    if (!open) return;
    if (!role?.id) return;
    let isActive = true;

    async function loadRoleDetail() {
      setLoadingPermissions(true);
      try {
        const res = await fetch(`/api/roles/${role.id}`, { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as
          | { permissions?: string[]; name?: string; description?: string }
          | null;
        if (!res.ok) {
          const message =
            data && typeof data === "object" && "message" in data
              ? String((data as { message?: unknown }).message)
              : "Gagal memuat detail role.";
          throw new Error(message);
        }
        if (isActive) {
          if (Array.isArray(data?.permissions)) {
            setSelected(new Set(data.permissions));
          }
          if (typeof data?.description === "string") {
            setDescription(data.description);
          }
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Gagal memuat detail role.");
        }
      } finally {
        if (isActive) {
          setLoadingPermissions(false);
        }
      }
    }

    loadRoleDetail();
    return () => {
      isActive = false;
    };
  }, [open, role?.id]);

  useEffect(() => {
    if (!open) return;
    if (!role?.name) return;
    let isActive = true;

    async function loadRoleUsers() {
      setLoadingUsers(true);
      setUsersError(null);
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as UsersApiResponse | null;
        if (!res.ok) {
          const message =
            data && typeof data === "object" && "message" in data
              ? String((data as { message?: unknown }).message)
              : "Gagal memuat user.";
          throw new Error(message);
        }

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data?.data
            : data?.data && typeof data.data === "object" && "users" in data.data
              ? (data.data as { users?: UserApiItem[] }).users ?? []
              : [];

        const normalized = list.map((item) => ({
          id: item.id !== null && item.id !== undefined ? String(item.id) : "-",
          name: item.name ?? item.username ?? "-",
          email: item.email ?? "-",
          role: resolveUserRole(item),
        }));

        const normalizedRole = role.name.trim().toLowerCase();
        const filtered = normalized.filter(
          (user) => user.role.trim().toLowerCase() === normalizedRole
        );

        if (isActive) {
          setRoleUsers(filtered);
        }
      } catch (err) {
        if (isActive) {
          setRoleUsers([]);
          setUsersError(err instanceof Error ? err.message : "Gagal memuat user.");
        }
      } finally {
        if (isActive) {
          setLoadingUsers(false);
        }
      }
    }

    loadRoleUsers();
    return () => {
      isActive = false;
    };
  }, [open, role?.name]);

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return PERMISSION_GROUPS;
    return PERMISSION_GROUPS.map((group) => ({
      ...group,
      permissions: group.permissions.filter((permission) => {
        return (
          permission.label.toLowerCase().includes(normalized) ||
          permission.key.toLowerCase().includes(normalized)
        );
      }),
    })).filter((group) => group.permissions.length > 0);
  }, [query]);

  const selectedList = useMemo(() => {
    return Array.from(selected).map((key) => ({
      key,
      label: permissionLabelByKey.get(key) ?? key,
    }));
  }, [selected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 flex max-h-[90vh] w-[94vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg sm:w-[92vw]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Detail Role</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="grid flex-1 min-h-0 gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex min-h-0 flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Nama Role</label>
              <input
                type="text"
                value={role?.name ?? "-"}
                readOnly
                className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                value={description || "-"}
                readOnly
                rows={3}
                className="mt-2 w-full resize-none rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Cari Permission</label>
              <div className="relative mt-2">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari permission..."
                  className="h-10 w-full rounded-md border border-gray-200 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span>{selected.size} permission aktif</span>
              {loadingPermissions ? <span>• Memuat...</span> : null}
              {error ? <span className="text-red-500">• {error}</span> : null}
            </div>

            <div className="flex-1 min-h-0 space-y-5 overflow-auto rounded-xl border border-gray-100 bg-gray-50 p-4">
              {filteredGroups.length === 0 ? (
                <p className="text-sm text-gray-500">Permission tidak ditemukan.</p>
              ) : (
                filteredGroups.map((group) => {
                  const keys = group.permissions.map((permission) => permission.key);
                  const activeCount = keys.filter((key) => selected.has(key)).length;
                  const allActive = activeCount === keys.length && keys.length > 0;

                  return (
                    <div key={group.key} className="rounded-xl bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{group.label}</p>
                          <p className="text-xs text-gray-500">
                            {activeCount} / {keys.length} aktif
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            allActive
                              ? "bg-orange-500 text-white"
                              : "border border-gray-200 text-gray-600"
                          }`}
                        >
                          {allActive ? "Aktif semua" : "Aktif sebagian"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.permissions.map((permission) => {
                          const active = selected.has(permission.key);
                          return (
                            <span
                              key={permission.key}
                              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                                active
                                  ? "border-orange-500 bg-orange-500 text-white"
                                  : "border-gray-200 text-gray-400"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  active ? "bg-white" : "bg-gray-300"
                                }`}
                              />
                              {permission.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Pengguna dengan role ini</p>
                  <p className="text-xs text-gray-500">Daftar user yang memakai role.</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                  {loadingUsers ? "..." : roleUsers.length}
                </span>
              </div>
              <div className="mt-3 max-h-40 space-y-2 overflow-auto">
                {loadingUsers ? (
                  <p className="text-xs text-gray-500">Memuat user...</p>
                ) : usersError ? (
                  <p className="text-xs text-red-500">{usersError}</p>
                ) : roleUsers.length === 0 ? (
                  <p className="text-xs text-gray-500">Belum ada user untuk role ini.</p>
                ) : (
                  roleUsers.map((user) => (
                    <div
                      key={`${user.id}-${user.email}`}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-gray-700">{user.name}</p>
                        <p className="text-[11px] text-gray-400">{user.email}</p>
                      </div>
                      <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                        {user.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-800">Ringkasan Permission</p>
              <p className="mt-1 text-xs text-gray-500">
                Daftar permission yang aktif untuk role ini.
              </p>
              <div className="mt-4 flex-1 min-h-0 space-y-2 overflow-auto">
                {selectedList.length === 0 ? (
                  <p className="text-sm text-gray-500">Belum ada permission dipilih.</p>
                ) : (
                  selectedList.map((permission) => (
                    <div
                      key={permission.key}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-gray-700">{permission.label}</p>
                        <p className="text-[11px] text-gray-400">{permission.key}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-6 pt-2 sm:px-6" />
      </div>
    </div>
  );
}
