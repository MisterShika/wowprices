"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type PricePoint = {
  created_at: string;
  sale_price: number;
};

type Props = {
  prices: PricePoint[];
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  modePrice: number | null;
};

function formatPrice(copper: number) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return `${gold}g ${silver}s ${remainingCopper}c`;
}

function formatTooltipDate(timestamp: number) {
  return new Date(timestamp).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getXAxisFormatter(prices: PricePoint[]) {
  if (prices.length === 0) {
    return () => "";
  }

  const timestamps = prices.map((price) =>
    new Date(price.created_at).getTime()
  );

  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);

  const hours = (max - min) / (1000 * 60 * 60);

  // Less than 24 hours
  if (hours < 24) {
    return (timestamp: number) =>
      new Date(timestamp).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
  }

  // 1–3 days
  if (hours < 72) {
    return (timestamp: number) =>
      new Date(timestamp).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
      });
  }

  // 4–30 days
  if (hours < 24 * 30) {
    return (timestamp: number) =>
      new Date(timestamp).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
  }

  // More than 30 days
  return (timestamp: number) =>
    new Date(timestamp).toLocaleDateString([], {
      month: "short",
      year: "numeric",
    });
}

export default function PriceHistoryGraph({
  prices,
  minPrice,
  maxPrice,
  averagePrice,
  modePrice,
}: Props) {
  if (prices.length === 0) {
    return (
      <div className="bg-mist-800 text-gray-400 p-4 rounded-md">
        No price history yet.
      </div>
    );
  }

  const chartData = prices.map((price) => ({
    timestamp: new Date(price.created_at).getTime(),
    price: price.sale_price,
  }));

  const xAxisFormatter = getXAxisFormatter(prices);

  return (
    <div className="bg-mist-800 text-white p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">
        Price History
      </h2>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="timestamp"
              type="number"
              domain={["dataMin", "dataMax"]}
              scale="time"
              tickFormatter={xAxisFormatter}
            />

            <YAxis
              tickFormatter={formatPrice}
            />

            <Tooltip
              labelFormatter={(value) =>
                formatTooltipDate(Number(value))
              }
              formatter={(value) =>
                formatPrice(Number(value))
              }
            />

            <ReferenceLine
              y={minPrice}
              stroke="#888"
              strokeDasharray="5 5"
              label={{
                value: `Min: ${formatPrice(minPrice)}`,
                position: "insideTopRight",
              }}
            />

            <ReferenceLine
              y={maxPrice}
              stroke="#888"
              strokeDasharray="5 5"
              label={{
                value: `Max: ${formatPrice(maxPrice)}`,
                position: "insideTopRight",
              }}
            />

            <ReferenceLine
              y={averagePrice}
              stroke="#fff"
              strokeDasharray="5 5"
              label={{
                value: `Average: ${formatPrice(averagePrice)}`,
                position: "insideTopRight",
              }}
            />

            {modePrice !== null && (
              <ReferenceLine
                y={modePrice}
                stroke="#aaa"
                strokeDasharray="5 5"
                label={{
                  value: `Mode: ${formatPrice(modePrice)}`,
                  position: "insideTopRight",
                }}
              />
            )}

            <Line
              type="linear"
              dataKey="price"
              stroke="#facc15"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}