"use client";

import Link from "next/link";
import { FileText, Zap } from "lucide-react";

const reports = [
  {
    id: "purchase",
    title: "Laporan Purchase",
    description: "Lihat laporan pembelian dan detail transaksi pembelian",
    icon: FileText,
    href: "/main/reports/laporan-purchase",
  },
  {
    id: "production",
    title: "Laporan Catatan Produksi",
    description: "Lihat laporan catatan produksi dan detail produksi",
    icon: Zap,
    href: "/main/reports/laporan-catatan-produksi",
  },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
        <p className="mt-2 text-gray-600">Pilih laporan yang ingin Anda lihat</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link key={report.id} href={report.href} className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-orange-100 p-3">
                <Icon className="text-orange-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600">{report.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{report.description}</p>
              <div className="mt-4 flex items-center text-sm text-orange-600">
                Buka Laporan
                <span className="ml-2">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
