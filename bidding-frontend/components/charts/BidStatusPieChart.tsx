'use client';

import { useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';

type BidStatusData = Record<string, number>;

type Props = {
  data: BidStatusData;
};

// Factory function to create custom active shape renderer with percent calculation
const renderActiveShape = (total: number) => (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius,
    startAngle, endAngle, fill, payload, value
  } = props;

  const percent = total > 0 ? value / total : 0;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector {...{ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }} />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#999">
        {`Count: ${value}`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

export default function BidStatusPieChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const chartData = Object.entries(data || {})
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Number(value),
    }))
    .filter((item) => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return <p className="text-center text-gray-500">No bid status data to display.</p>;
  }

  const COLORS: Record<string, string> = {
    accepted: "#4CAF50",     // green
    inprogress: "#2196F3",   // blue
    pending: "#FFC107",      // amber
    rejected: "#F44336",     // red
  };

  return (
    <div className="w-full  sm:w-3/4 h-96 ">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape(total)}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name.toLowerCase()] || "#8884d8"}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
