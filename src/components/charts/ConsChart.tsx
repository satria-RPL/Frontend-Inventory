"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function CostChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={28}>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />

          <YAxis
            tickFormatter={(v) => `${v / 1_000_000}JT`}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            width={40}
          />

          <Tooltip
            formatter={(value: number | undefined) =>
              value !== undefined ? `Rp ${value.toLocaleString("id-ID")}` : ""
            }
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />

          <Bar
            dataKey="food"
            stackId="cost"
            fill="#F97316"
            radius={[6, 6, 0, 0]}
            animationDuration={900}
          />

          <Bar
            dataKey="waste"
            stackId="cost"
            fill="#FDBA74"
            radius={[6, 6, 0, 0]}
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
