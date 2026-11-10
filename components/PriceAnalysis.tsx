
"use client";

import { useState, useEffect, useMemo } from "react";
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

  // Only calculate the date after the component has hydrated.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  // Filter prices based on the selected date range.
  const filteredPrices = useMemo(() => {
    // Before hydration, or when showing all prices,
    // display the complete price history.
    if (range === "all" || !now) {
      return prices;
    }

    let startDate: Date;

    if (range === "today") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
    } else {
      const days =
        range === "7d"
          ? 7
          : range === "30d"
            ? 30
            : 90;

      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - days);
    }

    return prices.filter(
      (price) => new Date(price.created_at) >= startDate
    );
  }, [prices, range, now]);

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
