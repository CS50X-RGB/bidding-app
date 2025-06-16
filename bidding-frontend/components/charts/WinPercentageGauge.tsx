// components/charts/WinPercentageGauge.tsx
"use client";
import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const RADIAN = Math.PI / 180;

const needle = (value: number, data: any[], cx: number, cy: number, iR: number, oR: number, color: string) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle key="needle-circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path key="needle-path" d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="none" fill="#eee" />,
  ];
};

type Props = {
  percentage: number;
};

export default function WinPercentageGauge({ percentage }: Props) {
  const cx = 150;
  const cy = 200;
  const iR = 80;
  const oR = 120;

  const data = [
    { name: "Win %", value: percentage, color: "#00C49F" }, // total scale
    { name: "Remain", value: 100-percentage, color: "#ffffff" }, // dummy to fill background if needed
  ];

  return (
    <>
    
    <PieChart width={300} height={250}>
        
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={0}
        data={[{ value: 100, color: "#eee" }]}
        cx={cx}
        cy={cy}
        innerRadius={iR}
        outerRadius={oR}
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      {/* {needle(percentage, data, cx, cy, iR, oR, "#00C49F")} */}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={22}
        fontWeight="bold"
        fill="#ffffff">
        {percentage}
      </text>

      
    </PieChart>
    </>
  );
}
