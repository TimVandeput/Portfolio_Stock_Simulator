"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { GraphData } from "@/lib/api/graphs";

interface StockChartProps {
  chartData: GraphData;
  className?: string;
}

interface ChartPoint {
  timestamp: number;
  price: number;
  date: string;
  volume: number;
}

export default function StockChart({
  chartData,
  className = "",
}: StockChartProps) {
  if (!chartData.chart.result?.[0]) {
    return (
      <div
        className={`h-64 bg-[var(--background)] rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-[var(--text-secondary)]">
          No chart data available
        </span>
      </div>
    );
  }

  const result = chartData.chart.result[0];
  const timestamps = result.timestamp || [];
  const prices = result.indicators.quote[0]?.close || [];

  let data: ChartPoint[] = timestamps
    .map((timestamp, index) => {
      const price = prices[index];
      if (price == null || isNaN(price) || !isFinite(price) || price <= 0) {
        return null;
      }
      return {
        timestamp,
        price,
        date: new Date(timestamp * 1000).toLocaleDateString(),
        volume: result.indicators.quote[0]?.volume?.[index] || 0,
      };
    })
    .filter((point): point is ChartPoint => point !== null)
    .sort((a, b) => a.timestamp - b.timestamp);

  const maxPoints = 300;
  if (data.length > maxPoints) {
    const step = Math.ceil(data.length / maxPoints);
    data = data.filter((_, index) => index % step === 0);
    if (data[data.length - 1].timestamp !== timestamps[timestamps.length - 1]) {
      const lastValidPoint = data[data.length - 1];
      if (lastValidPoint) {
        data.push(lastValidPoint);
      }
    }
  }

  console.log(
    `Original points: ${timestamps.length}, Processed points: ${data.length}`
  );

  if (timestamps.length === 0 || prices.length === 0) {
    return (
      <div
        className={`h-64 bg-[var(--background)] rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-[var(--text-secondary)]">
          No price data available
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`h-64 bg-[var(--background)] rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-[var(--text-secondary)]">
          No valid price data points
        </span>
      </div>
    );
  }

  if (data.length < 2) {
    return (
      <div
        className={`h-64 bg-[var(--background)] rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-[var(--text-secondary)]">
          Insufficient data points for chart
        </span>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatTooltipDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const prices_only = data.map((d) => d.price);
  const minPrice = Math.min(...prices_only);
  const maxPrice = Math.max(...prices_only);
  const padding = (maxPrice - minPrice) * 0.05;
  const yDomain = [Math.max(0, minPrice - padding), maxPrice + padding];

  return (
    <div className={`h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(128, 128, 128, 0.2)"
            className="stroke-[var(--border)]"
          />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatTooltipDate}
            stroke="rgba(102, 102, 102, 0.8)"
            fontSize={12}
            interval="preserveStartEnd"
            className="stroke-[var(--text-secondary)]"
          />
          <YAxis
            domain={yDomain}
            tickFormatter={formatPrice}
            stroke="rgba(102, 102, 102, 0.8)"
            fontSize={12}
            className="stroke-[var(--text-secondary)]"
          />
          <Tooltip
            labelFormatter={(value: number) => formatTooltipDate(value)}
            formatter={(value: number) => [formatPrice(value), "Price"]}
            contentStyle={{
              backgroundColor: "var(--surface, #ffffff)",
              border: "1px solid var(--border, #e0e0e0)",
              borderRadius: "8px",
              color: "var(--text-primary, #333333)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="linear"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6" }}
            connectNulls={false}
            strokeLinecap="round"
            strokeLinejoin="round"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
