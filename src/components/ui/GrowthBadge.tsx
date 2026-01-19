import { ArrowUpRight } from "lucide-react";

type GrowthBadgeProps = {
  value: string;
  description: string;
};

export default function GrowthBadge({
  value,
  description,
}: GrowthBadgeProps) {
  return (
    <div className="group relative">
      <span className="cursor-pointer rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
        {value}
        <ArrowUpRight size={14} className="ml-0.5 inline-block" />
      </span>

      <div className="pointer-events-none absolute left-1/2 top-7 w-max -translate-x-1/2 rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 opacity-0 shadow transition group-hover:opacity-100">
        {description}
      </div>
    </div>
  );
}
