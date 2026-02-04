"use client";

import { X } from "lucide-react";

type UserInfo = {
  id?: number | string;
  name: string;
  email: string;
  role: string;
};

type ViewUserModalProps = {
  open: boolean;
  onClose: () => void;
  user?: UserInfo | null;
};

export default function ViewUserModal({ open, onClose, user }: ViewUserModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-full max-w-2xl rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">View User</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={user?.role ?? ""}
              readOnly
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Nama Pengguna <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={user?.name ?? ""}
              readOnly
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              PIN Pengguna <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value="••••••"
              readOnly
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Konfirmasi PIN <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value="••••••"
              readOnly
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
