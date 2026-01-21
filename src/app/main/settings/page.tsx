"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type SettingRowProps = {
  title: string;
  description: string;
  children: ReactNode;
  align?: "center" | "start";
  controlClassName?: string;
};

const baseSelectClass =
  "h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700";
const smallInputClass =
  "h-9 rounded-md border border-gray-300 bg-white px-2 text-center text-sm text-gray-700";

function SettingRow({
  title,
  description,
  children,
  align = "center",
  controlClassName = "flex items-center",
}: SettingRowProps) {
  return (
    <div
      className={`flex flex-wrap justify-between gap-4 py-4 ${
        align === "start" ? "items-start" : "items-center"
      }`}
    >
      <div className="max-w-xl space-y-1">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className={controlClassName}>{children}</div>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? "bg-orange-100" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full transition ${
          enabled ? "right-0.5 bg-orange-500" : "left-0.5 bg-gray-500"
        }`}
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
      />
    </button>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-gray-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-orange-400 bg-white transition peer-checked:border-orange-500 peer-checked:bg-orange-500">
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-4 w-4 text-white opacity-0 transition peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 10.5l3 3L15 6.5" />
        </svg>
      </span>
      {label}
    </label>
  );
}

export default function SettingsPage() {
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  const [virtualKeyboard, setVirtualKeyboard] = useState(true);
  const [dineInEnabled, setDineInEnabled] = useState(true);
  const [tableManagement, setTableManagement] = useState(true);
  const [kitchenMode, setKitchenMode] = useState(true);
  const [paymentLimit, setPaymentLimit] = useState("Tunai dan Non Tunai");
  const [dineInIdentify, setDineInIdentify] = useState("Nama");

  const [providerOne, setProviderOne] = useState("Midtrans");
  const [providerTwo, setProviderTwo] = useState("Tripay");
  const [providerOneQris, setProviderOneQris] = useState(true);
  const [providerOneVa, setProviderOneVa] = useState(true);
  const [providerTwoQris, setProviderTwoQris] = useState(true);
  const [providerTwoVa, setProviderTwoVa] = useState(true);

  const [marginProfit, setMarginProfit] = useState("5");
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxPercent, setTaxPercent] = useState("5");
  const [roundingEnabled, setRoundingEnabled] = useState(false);
  const [roundingRule, setRoundingRule] = useState("Puluhan");

  const [shiftEnabled, setShiftEnabled] = useState(true);
  const [shiftCount, setShiftCount] = useState("1");
  const [shiftInterval, setShiftInterval] = useState("1 Jam");

  const [resetQueue, setResetQueue] = useState("Setiap Ganti Shift");
  const [prefixEnabled, setPrefixEnabled] = useState(true);
  const [prefixValue, setPrefixValue] = useState("TOM");

  return (
    <div className="h-[calc(100vh-7rem-0.25rem)] overflow-hidden pb-4 px-4">
      <div className="h-full overscroll-contain overflow-y-auto rounded-xl border border-gray-200 bg-white hide-scrollbar">
        <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-white px-6 pb-4 pt-6.25">
          <h1 className="text-xl font-semibold text-gray-800">
            General Settings
          </h1>
          <button
            type="button"
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            Konfirmasi Perubahan
          </button>
        </div>

        <div className="px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-800">General</h2>
          <div className="mt-2 divide-y divide-gray-200">
            <SettingRow
              title="Tampilkan Virtual Keyboard"
              description="Tampilkan keyboard di layar untuk memudahkan input tanpa keyboard fisik."
            >
              <Toggle
                enabled={virtualKeyboard}
                onChange={() => setVirtualKeyboard((prev) => !prev)}
              />
            </SettingRow>
            <SettingRow
              title="Izinkan Makan Di Tempat (Dine-In)"
              description="Aktifkan opsi dine in saat membuat pesanan."
            >
              <Toggle
                enabled={dineInEnabled}
                onChange={() => setDineInEnabled((prev) => !prev)}
              />
            </SettingRow>
            <SettingRow
              title="Manajemen Meja"
              description="Gunakan fitur pengelolaan meja untuk pesanan dinein."
            >
              <Toggle
                enabled={tableManagement}
                onChange={() => setTableManagement((prev) => !prev)}
              />
            </SettingRow>
            <SettingRow
              title="Aktifkan Mode Kitchen"
              description="Aktifkan mode kitchen untuk menerima dan memproses pesanan."
            >
              <Toggle
                enabled={kitchenMode}
                onChange={() => setKitchenMode((prev) => !prev)}
              />
            </SettingRow>
            <SettingRow
              title="Batasi Metode Pembayaran"
              description="Batasi metode pembayaran untuk semua transaksi."
            >
              <select
                value={paymentLimit}
                onChange={(event) => setPaymentLimit(event.target.value)}
                className={`${baseSelectClass} w-48`}
              >
                <option value="Tunai dan Non Tunai">Tunai dan Non Tunai</option>
                <option value="Tunai">Tunai</option>
                <option value="Non Tunai">Non Tunai</option>
              </select>
            </SettingRow>
            <SettingRow
              title="Identifikasi Panggilan Dine In"
              description="Tentukan cara memanggil pesanan pelanggan."
            >
              <select
                value={dineInIdentify}
                onChange={(event) => setDineInIdentify(event.target.value)}
                className={`${baseSelectClass} w-40`}
              >
                <option value="Nama">Nama</option>
                <option value="Nomor">Nomor</option>
                <option value="Meja">Meja</option>
              </select>
            </SettingRow>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Pembayaran dan Provider
          </h2>
          <div className="mt-2 divide-y divide-gray-200">
            <SettingRow
              title="Provider Payment Gateway 1"
              description="Provider utama yang digunakan untuk memproses pembayaran."
            >
              <select
                value={providerOne}
                onChange={(event) => setProviderOne(event.target.value)}
                className={`${baseSelectClass} w-40`}
              >
                <option value="Midtrans">Midtrans</option>
                <option value="Xendit">Xendit</option>
                <option value="Doku">Doku</option>
              </select>
            </SettingRow>
            <div className="py-4">
              <p className="text-sm font-semibold text-gray-700">
                Payment Provider 1
              </p>
              <p className="text-xs text-gray-500">
                Pilih metode pembayaran yang tersedia dari provider ini.
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <Checkbox
                  checked={providerOneQris}
                  onChange={() => setProviderOneQris((prev) => !prev)}
                  label="QRIS"
                />
                <Checkbox
                  checked={providerOneVa}
                  onChange={() => setProviderOneVa((prev) => !prev)}
                  label="Virtual Account (BCA, Mandiri, BRI, BNI)"
                />
              </div>
            </div>
            <SettingRow
              title="Provider Payment Gateway 2"
              description="Provider cadangan atau alternatif untuk pembayaran."
            >
              <select
                value={providerTwo}
                onChange={(event) => setProviderTwo(event.target.value)}
                className={`${baseSelectClass} w-40`}
              >
                <option value="Tripay">Tripay</option>
                <option value="Xendit">Xendit</option>
                <option value="Doku">Doku</option>
              </select>
            </SettingRow>
            <div className="py-4">
              <p className="text-sm font-semibold text-gray-700">
                Payment Provider 2
              </p>
              <p className="text-xs text-gray-500">
                Pilih metode pembayaran yang tersedia dari provider ini.
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <Checkbox
                  checked={providerTwoQris}
                  onChange={() => setProviderTwoQris((prev) => !prev)}
                  label="QRIS"
                />
                <Checkbox
                  checked={providerTwoVa}
                  onChange={() => setProviderTwoVa((prev) => !prev)}
                  label="Virtual Account (BCA, Mandiri, BRI, BNI)"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-800">Keuangan</h2>
          <div className="mt-2 divide-y divide-gray-200">
            <SettingRow
              title="Margin Keuntungan"
              description="Tentukan margin keuntungan yang ditambahkan ke harga produk."
            >
              <div className="flex items-center gap-3">
                <input
                  value={marginProfit}
                  onChange={(event) => setMarginProfit(event.target.value)}
                  className={`${smallInputClass} w-12`}
                />
                <span className="text-xs font-semibold text-green-600">
                  HPP + {marginProfit || 0}%
                </span>
              </div>
            </SettingRow>
            <SettingRow
              title="Aktifkan Pajak"
              description="Gunakan pajak untuk setiap transaksi."
            >
              <Toggle
                enabled={taxEnabled}
                onChange={() => setTaxEnabled((prev) => !prev)}
              />
            </SettingRow>
            <SettingRow
              title="Persen Pajak Transaksi"
              description="Tentukan pajak untuk setiap transaksi."
            >
              <input
                value={taxPercent}
                onChange={(event) => setTaxPercent(event.target.value)}
                disabled={!taxEnabled}
                className={`${smallInputClass} w-14 disabled:bg-gray-100 disabled:text-gray-400`}
              />
            </SettingRow>
            <SettingRow
              title="Pembulatan"
              description="Gunakan pembulatan untuk setiap transaksi."
            >
              <Toggle
                enabled={roundingEnabled}
                onChange={() => setRoundingEnabled((prev) => !prev)}
              />
            </SettingRow>
            <SettingRow
              title="Pembulatan Hingga"
              description="Pilih fungsi pembulatan puluhan atau ratusan."
            >
              <select
                value={roundingRule}
                onChange={(event) => setRoundingRule(event.target.value)}
                disabled={!roundingEnabled}
                className={`${baseSelectClass} w-32 disabled:bg-gray-100 disabled:text-gray-400`}
              >
                <option value="Puluhan">Puluhan</option>
                <option value="Ratusan">Ratusan</option>
                <option value="Ribuan">Ribuan</option>
              </select>
            </SettingRow>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Shift Manajemen Toko
          </h2>
          <div className="mt-2 divide-y divide-gray-200">
            <SettingRow title="Shift" description="Pakai shift setiap hari.">
              <Toggle
                enabled={shiftEnabled}
                onChange={() => setShiftEnabled((prev) => !prev)}
              />
            </SettingRow>
            <SettingRow
              title="Atur Shift"
              description="Atur total shift pada toko setiap harinya."
            >
              <input
                value={shiftCount}
                onChange={(event) => setShiftCount(event.target.value)}
                disabled={!shiftEnabled}
                className={`${smallInputClass} w-12 disabled:bg-gray-100 disabled:text-gray-400`}
              />
            </SettingRow>
            <SettingRow
              title="Ganti Shift Setiap"
              description="Ganti shift setiap jam."
            >
              <select
                value={shiftInterval}
                onChange={(event) => setShiftInterval(event.target.value)}
                disabled={!shiftEnabled}
                className={`${baseSelectClass} w-28 disabled:bg-gray-100 disabled:text-gray-400`}
              >
                <option value="1 Jam">1 Jam</option>
                <option value="2 Jam">2 Jam</option>
                <option value="3 Jam">3 Jam</option>
              </select>
            </SettingRow>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Manajemen Transaksi
          </h2>
          <div className="mt-2 divide-y divide-gray-200">
            <SettingRow
              title="Reset Antrian Setiap"
              description="Reset nomor antrian sesuai pengaturan."
            >
              <select
                value={resetQueue}
                onChange={(event) => setResetQueue(event.target.value)}
                className={`${baseSelectClass} w-52`}
              >
                <option value="Setiap Ganti Shift">Setiap Ganti Shift</option>
                <option value="Setiap Hari">Setiap Hari</option>
                <option value="Setiap Minggu">Setiap Minggu</option>
              </select>
            </SettingRow>
            <SettingRow
              title="Prefix ID Transaksi"
              description="Aktifkan custom prefix id transaksi."
            >
              <Toggle
                enabled={prefixEnabled}
                onChange={() => setPrefixEnabled((prev) => !prev)}
              />
            </SettingRow>
            <SettingRow
              title="Custom Prefix ID Transaksi"
              description="Gunakan prefix ID untuk awalan setiap ID transaksi."
            >
              <input
                value={prefixValue}
                onChange={(event) => setPrefixValue(event.target.value)}
                disabled={!prefixEnabled}
                className={`${smallInputClass} w-16 uppercase disabled:bg-gray-100 disabled:text-gray-400`}
              />
            </SettingRow>
          </div>
        </div>
      </div>
    </div>
  );
}
