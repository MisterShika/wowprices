type PricePoint = {
  created_at: string;
  sale_price: number;
};

type Props = {
  prices: PricePoint[];
};

function formatPrice(copper: number) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return `${gold}g ${silver}s ${remainingCopper}c`;
}

function getAverage(prices: number[]) {
  if (prices.length === 0) {
    return 0;
  }

  return Math.round(
    prices.reduce((sum, price) => sum + price, 0) / prices.length
  );
}

export default function TimeOfDay({ prices }: Props) {
  const morning: number[] = [];
  const afternoon: number[] = [];
  const evening: number[] = [];
  const night: number[] = [];

  for (const price of prices) {
    const hour = new Date(price.created_at).getHours();

    if (hour >= 6 && hour < 12) {
      morning.push(price.sale_price);
    } else if (hour >= 12 && hour < 18) {
      afternoon.push(price.sale_price);
    } else if (hour >= 18) {
      evening.push(price.sale_price);
    } else {
      night.push(price.sale_price);
    }
  }

  const periods = [
    {
      name: "Morning",
      time: "6:00 AM – 11:59 AM",
      averagePrice: getAverage(morning),
      count: morning.length,
    },
    {
      name: "Afternoon",
      time: "12:00 PM – 5:59 PM",
      averagePrice: getAverage(afternoon),
      count: afternoon.length,
    },
    {
      name: "Evening",
      time: "6:00 PM – 11:59 PM",
      averagePrice: getAverage(evening),
      count: evening.length,
    },
    {
      name: "Night",
      time: "12:00 AM – 5:59 AM",
      averagePrice: getAverage(night),
      count: night.length,
    },
  ];

  // Only consider periods that actually have submissions
  const populatedPeriods = periods.filter(
    (period) => period.count > 0
  );

  const highestPrice =
    populatedPeriods.length > 0
      ? Math.max(
          ...populatedPeriods.map(
            (period) => period.averagePrice
          )
        )
      : 0;

  const lowestPrice =
    populatedPeriods.length > 0
      ? Math.min(
          ...populatedPeriods.map(
            (period) => period.averagePrice
          )
        )
      : 0;

  return (
    <div className="bg-mist-800 text-white p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">
        Price by Time of Day
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {periods.map((period) => {
          let priceColor = "text-yellow-400";

          if (period.count > 0) {
            if (period.averagePrice === highestPrice) {
              priceColor = "text-green-400";
            } else if (period.averagePrice === lowestPrice) {
              priceColor = "text-red-400";
            }
          }

          return (
            <div
              key={period.name}
              className="bg-mist-700 p-3 rounded-md"
            >
              <h3 className="font-semibold">
                {period.name}
              </h3>

              <p className="text-xs text-gray-400">
                {period.time}
              </p>

              <p
                className={`text-xl font-bold ${priceColor}`}
              >
                {formatPrice(period.averagePrice)}
              </p>

              <p className="text-sm text-gray-400">
                {period.count} submissions
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}