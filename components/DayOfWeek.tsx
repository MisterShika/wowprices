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

export default function DayOfWeek({ prices }: Props) {
  const days: Record<string, number[]> = {
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };

  for (const price of prices) {
    const day = new Date(price.created_at).toLocaleDateString([], {
      weekday: "long",
    });

    days[day].push(price.sale_price);
  }

  const dayData = Object.entries(days).map(
    ([day, dayPrices]) => ({
      name: day,
      averagePrice: getAverage(dayPrices),
      count: dayPrices.length,
    })
  );

  // Only consider days that actually have submissions
  const populatedDays = dayData.filter(
    (day) => day.count > 0
  );

  const highestPrice =
    populatedDays.length > 0
      ? Math.max(
          ...populatedDays.map(
            (day) => day.averagePrice
          )
        )
      : 0;

  const lowestPrice =
    populatedDays.length > 0
      ? Math.min(
          ...populatedDays.map(
            (day) => day.averagePrice
          )
        )
      : 0;

  return (
    <div className="bg-mist-800 text-white p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">
        Price by Day of Week
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {dayData.map((day) => {
          let priceColor = "text-yellow-400";

          if (day.count > 0) {
            if (day.averagePrice === highestPrice) {
              priceColor = "text-green-400";
            } else if (day.averagePrice === lowestPrice) {
              priceColor = "text-red-400";
            }
          }

          return (
            <div
              key={day.name}
              className="bg-mist-700 p-3 rounded-md"
            >
              <h3 className="font-semibold text-white">
                {day.name}
              </h3>

              <p
                className={`text-xl font-bold ${priceColor}`}
              >
                {formatPrice(day.averagePrice)}
              </p>

              <p className="text-sm text-gray-400">
                {day.count} submissions
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}