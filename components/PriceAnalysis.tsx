"use client";

import { useState } from "react";
import PriceDateRange from "@/components/PriceDateRange";
import PriceHistoryGraph from "@/components/PriceHistoryGraph";
import TimeOfDay from "@/components/TimeOfDay";
import DayOfWeek from "@/components/DayOfWeek";
import DayOfWeekTimeOfDay from "@/components/DayOfWeekTimeOfDay";

type PricePoint = {
  created_at: string;
  sale_price: number;
  total_quantity: number | null;
};

type Props = {
  prices: PricePoint[];
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
};

type Range = "all" | "today" | "7d" | "30d" | "90d";

export default function PriceAnalysis({
  prices,
  minPrice,
  maxPrice,
  averagePrice,
}: Props) {
  const [range, setRange] = useState<Range>("all");

  function getStartDate(range: Range) {
    if (range === "all") {
      return null;
    }

    const now = new Date();

    if (range === "today") {
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
    }

    const days =
      range === "7d"
        ? 7
        : range === "30d"
          ? 30
          : 90;

    const start = new Date(now);
    start.setDate(start.getDate() - days);

    return start;
  }

  const startDate = getStartDate(range);

  const filteredPrices = startDate
    ? prices.filter(
        (price) =>
          new Date(price.created_at) >= startDate
      )
    : prices;

  return (
    <>
      <PriceDateRange
        value={range}
        onChange={setRange}
      />

      <PriceHistoryGraph
        prices={filteredPrices}
        minPrice={minPrice}
        maxPrice={maxPrice}
        averagePrice={averagePrice}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TimeOfDay
            prices={filteredPrices}
          />

          <DayOfWeek
            prices={filteredPrices}
          />
        </div>

        <div>
          <DayOfWeekTimeOfDay
            prices={filteredPrices}
          />
        </div>
      </div>
    </>
  );
}