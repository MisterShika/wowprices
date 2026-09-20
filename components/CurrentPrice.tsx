type Props = {
  price: number;
  average: number;
};

function formatPrice(copper: number) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return `${gold}g ${silver}s ${remainingCopper}c`;
}

export default function CurrentPrice({
  price,
  average,
}: Props) {
  const minimumSalePrice = Math.ceil(price * 1.06);

  const priceComparison =
    price > average
      ? "Price is above average"
      : price < average
        ? "Price is below average"
        : "Price is at average";

  const comparisonColor =
    price > average
      ? "text-green-400"
      : price < average
        ? "text-red-400"
        : "text-gray-400";

  return (
    <div className="bg-mist-800 text-white p-1 sm:p-4 rounded-md">

      <h2 className="text-xl font-bold">
        Current Price
      </h2>

      <p className="text-2xl font-bold text-yellow-400">
        {formatPrice(price)}
      </p>

      <p className={`text-xs ${comparisonColor} mt-1`}>
        {priceComparison}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        Profit threshold:{" "}
        <span className="text-yellow-400 font-bold">
          {formatPrice(minimumSalePrice)}
        </span>
      </p>

    </div>
  );
}