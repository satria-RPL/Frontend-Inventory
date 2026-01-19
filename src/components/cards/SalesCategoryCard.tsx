import Image from "next/image";
import GrowthBadge from "@/components/ui/GrowthBadge";
import SalesCategoryBars from "@/components/charts/SalesCategoryBars";

export default function SalesCategoryCard() {
  return (
    <div className="col-span-12 lg:col-span-4 rounded-xl border border-gray-300 bg-white p-4">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-gray-100 p-1.5">
          <Image
            src="/icon/statistik.svg"
            alt="Statistik"
            width={18}
            height={18}
          />
        </div>

        <span className="text-base font-medium text-gray-700">
          Penjualan
        </span>
      </div>

      {/* VALUE */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-semibold">10,500</span>

          <GrowthBadge
            value="+10.5%"
            description="Kenaikan 10.5% dari minggu kemarin"
          />
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Total Penjualan
        </p>
      </div>

      {/* CHART */}
      <SalesCategoryBars />
    </div>
  );
}
