type PricePoint = {
  created_at: string;
  sale_price: number;
};

type Props = {
  prices: PricePoint[];
};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const periods = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
];

function formatPrice(copper: number) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return `${gold}g ${silver}s ${remainingCopper}c`;
}

function getPeriod(hour: number) {
  if (hour >= 6 && hour < 12) {
    return "Morning";
  }

  if (hour >= 12 && hour < 18) {
    return "Afternoon";
  }

  if (hour >= 18) {
    return "Evening";
  }

  return "Night";
}

function getAverage(prices: number[]) {
  if (prices.length === 0) {
    return 0;
  }

  return Math.round(
    prices.reduce((sum, price) => sum + price, 0) / prices.length
  );
}

export default function DayOfWeekTimeOfDay({
  prices,
}: Props) {
  const data: Record<
    string,
    Record<string, number[]>
  > = {};

  for (const day of days) {
    data[day] = {};

    for (const period of periods) {
      data[day][period] = [];
    }
  }

  for (const price of prices) {
    const date = new Date(price.created_at);

    const day = days[date.getDay()];
    const period = getPeriod(date.getHours());

    data[day][period].push(price.sale_price);
  }

  return (
    <div className="bg-mist-800 text-white p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">
        Price by Day and Time
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left p-2">
                Day
              </th>

              {periods.map((period) => (
                <th
                  key={period}
                  className="p-2"
                >
                  {period}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map((day) => (
              <tr
                key={day}
                className="border-b border-gray-700"
              >
                <td className="text-left p-2 font-semibold">
                  {day}
                </td>

                {periods.map((period) => {
                  const pricesForPeriod =
                    data[day][period];

                  const averagePrice =
                    getAverage(pricesForPeriod);

                  return (
                    <td
                      key={period}
                      className="p-2"
                    >
                      {pricesForPeriod.length > 0 ? (
                        <>
                          <div className="font-bold text-yellow-400">
                            {formatPrice(averagePrice)}
                          </div>

                          <div className="text-xs text-gray-400">
                            {pricesForPeriod.length} submissions
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-500">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}