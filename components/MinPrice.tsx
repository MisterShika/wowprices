type Props = {
  price: number;
};

function formatPrice(copper: number) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return `${gold}g ${silver}s ${remainingCopper}c`;
}

export default function MinPrice({ price }: Props) {
  return (
    <div className="bg-mist-800 text-white p-4 rounded-md">
      <h2 className="text-xl font-bold">
        Min Price
      </h2>

      <p className="text-2xl font-bold text-yellow-400">
        {formatPrice(price)}
      </p>
    </div>
  );
}