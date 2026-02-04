"use client";

import { useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { ALL_PERMISSIONS, PERMISSION_GROUPS } from "@/lib/constants/permissions";

type AddRoleModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const permissionLabelByKey = new Map(PERMISSION_GROUPS.flatMap((group) => group.permissions.map((permission) => [permission.key, permission.label])));

export default function AddRoleModal({ open, onClose, onCreated }: AddRoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setRoleName("");
    setDescription("");
    setQuery("");
    setSelected(new Set());
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return PERMISSION_GROUPS;
    return PERMISSION_GROUPS.map((group) => ({
      ...group,
      permissions: group.permissions.filter((permission) => {
        return permission.label.toLowerCase().includes(normalized) || permission.key.toLowerCase().includes(normalized);
      }),
    })).filter((group) => group.permissions.length > 0);
  }, [query]);

  const togglePermission = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleGroup = (keys: string[]) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = keys.every((key) => next.has(key));
      if (allSelected) {
        keys.forEach((key) => next.delete(key));
      } else {
        keys.forEach((key) => next.add(key));
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(ALL_PERMISSIONS));
  };

  const clearAll = () => {
    setSelected(new Set());
  };

  const validate = () => {
    if (!roleName.trim()) return "Nama role wajib diisi.";
    if (selected.size === 0) return "Minimal pilih 1 permission.";
    return null;
  };

  const handleSubmit = async () => {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roleName.trim(),
          description: description.trim() || undefined,
          permissions: Array.from(selected),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const errorMessage = data && typeof data === "object" && "message" in data ? String((data as { message?: unknown }).message) : "Gagal menambahkan role.";
        throw new Error(errorMessage);
      }
      onCreated?.();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambahkan role.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedList = useMemo(() => {
    return Array.from(selected).map((key) => ({
      key,
      label: permissionLabelByKey.get(key) ?? key,
    }));
  }, [selected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative z-50 flex max-h-[90vh] w-[94vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg sm:w-[92vw]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Tambah Role</h2>
          <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="grid flex-1 min-h-0 gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex min-h-0 flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nama Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(event) => setRoleName(event.target.value)}
                placeholder="Masukan nama role"
                className="mt-2 h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tambahkan deskripsi role"
                rows={3}
                className="mt-2 w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400"
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

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={selectAll} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                Aktifkan Semua
              </button>
              <button type="button" onClick={clearAll} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600">
                Reset
              </button>
              <span className="ml-auto text-xs text-gray-500">{selected.size} permission aktif</span>
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
                        <button type="button" onClick={() => toggleGroup(keys)} className={`rounded-full px-3 py-1 text-xs font-semibold ${allActive ? "bg-orange-500 text-white" : "border border-gray-200 text-gray-600"}`}>
                          {allActive ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.permissions.map((permission) => {
                          const active = selected.has(permission.key);
                          return (
                            <button
                              key={permission.key}
                              type="button"
                              onClick={() => togglePermission(permission.key)}
                              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                active ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                              }`}
                            >
                              <span className={`h-2 w-2 rounded-full ${active ? "bg-white" : "bg-gray-300"}`} />
                              {permission.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">Ringkasan Permission</p>
            <p className="mt-1 text-xs text-gray-500">Daftar permission yang aktif untuk role ini.</p>
            <div className="mt-4 flex-1 min-h-0 space-y-2 overflow-auto">
              {selectedList.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada permission dipilih.</p>
              ) : (
                selectedList.map((permission) => (
                  <div key={permission.key} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs">
                    <div>
                      <p className="font-semibold text-gray-700">{permission.label}</p>
                      <p className="text-[11px] text-gray-400">{permission.key}</p>
                    </div>
                    <button type="button" onClick={() => togglePermission(permission.key)} className="text-[11px] font-semibold text-orange-600">
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pb-6 pt-2 sm:px-6">
          <button type="button" onClick={handleSubmit} disabled={submitting} className="mt-2 h-10 w-full rounded-md bg-orange-500 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Menyimpan..." : "Simpan Role"}
          </button>
          {error ? <p className="mt-3 text-xs text-red-500">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
