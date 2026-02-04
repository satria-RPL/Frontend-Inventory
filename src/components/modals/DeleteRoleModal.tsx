"use client";

import { useEffect, useState } from "react";
import { TriangleAlert, X } from "lucide-react";

type DeleteRoleModalProps = {
  open: boolean;
  roleName?: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (password: string) => void;
};

export default function DeleteRoleModal({
  open,
  roleName,
  loading,
  error,
  onClose,
  onConfirm,
}: DeleteRoleModalProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!open) return;
    setPassword("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-[94vw] max-w-md overflow-hidden rounded-2xl bg-white shadow-xl sm:w-[92vw]">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
              <TriangleAlert size={18} />
            </span>
            <h2 className="text-lg font-semibold text-gray-800">Konfirmasi Hapus</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            Aksi ini akan menonaktifkan role{" "}
            <span className="font-semibold">{roleName ?? "-"}</span>. Pengguna dengan
            role ini tidak akan punya akses sesuai role.
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan password login"
              className="mt-2 h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>

          {error ? <p className="mt-3 text-xs text-red-500">{error}</p> : null}
        </div>

        <div className="flex items-center gap-3 px-6 pb-6 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-md border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(password)}
            disabled={loading || !password.trim()}
            className="h-10 flex-1 rounded-md bg-red-500 text-sm font-semibold text-white shadow-sm hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Menghapus..." : "Hapus Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
