"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { filterAssignableRoles, sortRolesByHierarchy } from "@/lib/utils/role-hierarchy";

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

type RoleApiItem = {
  id?: number | string;
  name?: string;
  description?: string;
};

type RolesApiResponse =
  | RoleApiItem[]
  | { data?: RoleApiItem[] | { roles?: RoleApiItem[] } };

type RoleOption = {
  id: string;
  label: string;
};

type SessionUser = {
  id?: string;
  name?: string;
  username?: string;
  role?: string;
};

export default function AddUserModal({ open, onClose, onCreated }: AddUserModalProps) {
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [roleName, setRoleName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [authorizationPassword, setAuthorizationPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isCashier = roleName.toLowerCase() === "cashier";

  useEffect(() => {
    if (!open) return;
    let isActive = true;

    async function loadSessionUser() {
      try {
        const res = await fetch("/api/session-user", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as SessionUser | null;
        if (!isActive) return;
        setSessionUser(data);
      } catch {
        if (isActive) {
          setSessionUser(null);
        }
      }
    }

    async function loadRoles() {
      setLoadingRoles(true);
      setRolesError(null);
      try {
        const res = await fetch("/api/roles", { cache: "no-store" });
        const data = (await res.json().catch(() => null)) as RolesApiResponse | null;
        if (!res.ok) {
          const message =
            data && typeof data === "object" && "message" in data
              ? String((data as { message?: unknown }).message)
              : "Gagal memuat role.";
          throw new Error(message);
        }

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data?.data
            : data?.data && typeof data.data === "object" && "roles" in data.data
              ? (data.data as { roles?: RoleApiItem[] }).roles ?? []
              : [];

        const mapped = list
          .map((role) => {
            const id = role.id !== null && role.id !== undefined ? String(role.id).trim() : "";
            const label = (role.name ?? role.description ?? "").toString().trim();
            return id && label ? { id, label } : null;
          })
          .filter(Boolean) as RoleOption[];

        if (isActive) {
          setRoles(mapped);
        }
      } catch (err) {
        if (isActive) {
          setRoles([]);
          setRolesError(err instanceof Error ? err.message : "Gagal memuat role.");
        }
      } finally {
        if (isActive) {
          setLoadingRoles(false);
        }
      }
    }

    loadSessionUser();
    loadRoles();
    return () => {
      isActive = false;
    };
  }, [open]);

  const availableRoles = useMemo(() => {
    const filtered = filterAssignableRoles(roles, sessionUser?.role);
    return sortRolesByHierarchy(filtered);
  }, [roles, sessionUser?.role]);

  if (!open) return null;

  const resetForm = () => {
    setRoleName("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPin("");
    setConfirmPin("");
    setAuthorizationPassword("");
    setSubmitError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = () => {
    if (!sessionUser?.name) return "Authorisasi user tidak ditemukan.";
    if (!authorizationPassword.trim()) return "Password authorisasi wajib diisi.";
    if (authorizationPassword.trim().length < 8) {
      return "Password authorisasi minimal 8 karakter.";
    }
    if (!name.trim()) return "Nama pengguna wajib diisi.";
    if (!roleName.trim()) return "Role wajib dipilih.";
    if (isCashier) {
      if (!pin.trim()) return "PIN wajib diisi untuk cashier.";
      if (!/^\d{4,6}$/.test(pin.trim())) {
        return "PIN harus 4-6 digit angka.";
      }
      if (pin.trim() !== confirmPin.trim()) {
        return "Konfirmasi PIN tidak sama.";
      }
      return null;
    }
    if (!email.trim()) return "Email wajib diisi untuk non-cashier.";
    if (!password.trim()) return "Password wajib diisi untuk non-cashier.";
    if (password.trim().length < 8) return "Password minimal 8 karakter.";
    if (password.trim() !== confirmPassword.trim()) {
      return "Konfirmasi password tidak sama.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const message = validate();
    if (message) {
      setSubmitError(message);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        roleName: roleName.trim(),
        authorizationPassword: authorizationPassword.trim(),
        authorizedBy: sessionUser?.id ?? sessionUser?.name ?? "",
      };
      if (isCashier) {
        payload.pin = pin.trim();
      } else {
        payload.email = email.trim();
        payload.password = password.trim();
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const errorMessage =
          data && typeof data === "object" && "message" in data
            ? String((data as { message?: unknown }).message)
            : "Gagal menambahkan user.";
        throw new Error(errorMessage);
      }
      onCreated?.();
      handleClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Gagal menambahkan user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative z-50 w-full max-w-2xl rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Tambah User</h2>
          <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <select
                value={roleName}
                onChange={(event) => setRoleName(event.target.value)}
                className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-10 text-sm text-gray-600"
              >
                <option value="">
                  {loadingRoles ? "Memuat role..." : "Pilih Role"}
                </option>
                {availableRoles.map((role) => (
                  <option key={role.id} value={role.label}>
                    {role.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {rolesError ? (
              <p className="mt-2 text-xs text-red-500">{rolesError}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Nama Pengguna <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Masukan Nama Pengguna"
              className="mt-2 h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {!isCashier ? (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Masukan Email Pengguna"
                className="mt-2 h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>
          ) : null}

          {!isCashier ? (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukan Password Pengguna"
                className="mt-2 h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-gray-700">
                PIN Pengguna <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Masukan PIN Pengguna"
                className="mt-2 h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>
          )}

          {!isCashier ? (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Konfirmasi Password Pengguna"
                className="mt-2 h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Konfirmasi PIN <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPin}
                onChange={(event) => setConfirmPin(event.target.value)}
                placeholder="Konfirmasi PIN Pengguna"
                className="mt-2 h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Authorisasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={sessionUser?.name ?? ""}
              readOnly
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600"
            />
            {sessionUser?.role ? (
              <p className="mt-1 text-xs text-gray-500">{sessionUser.role}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Authorisasi Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={authorizationPassword}
              onChange={(event) => setAuthorizationPassword(event.target.value)}
              placeholder="Masukan Password"
              className="mt-2 h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="h-10 w-full rounded-md bg-orange-500 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Menyimpan..." : "Tambah Pengguna"}
          </button>
          {submitError ? (
            <p className="mt-3 text-xs text-red-500">{submitError}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
