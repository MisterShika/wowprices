import Link from "next/link";
import { getItemIconUrl } from "@/lib/itemIcon";

type ComponentItem = {
  id: number;
  name: string;
  icon: string;
  current_price: number | null;
  average_price: number | null;
  purchase_price: number | null;
  quantity: number;
};

type Props = {
  components: ComponentItem[];
};

function formatPrice(copper: number | null) {
  if (copper === null) {
    return "—";
  }

  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return `${gold}g ${silver}s ${remainingCopper}c`;
}

export default function Components({ components }: Props) {
  if (components.length === 0) {
    return null;
  }

  const currentTotal = components.reduce(
    (total, component) => {
      const price =
        component.purchase_price ??
        component.current_price;

      if (price === null) {
        return total;
      }

      return total + price * component.quantity;
    },
    0
  );

  const averageTotal = components.reduce(
    (total, component) => {
      const price =
        component.purchase_price ??
        component.average_price;

      if (price === null) {
        return total;
      }

      return total + price * component.quantity;
    },
    0
  );

  return (
    <div className="bg-mist-800 text-white rounded-md">

      <h2 className="text-xl font-bold mb-3">
        Components
      </h2>

      <div className="flex flex-row gap-3 justify-start min-[1300px]:justify-center overflow-x-auto pb-2">

        {components.map((component) => (
          <Link
            key={component.id}
            href={`/item/${component.id}`}
            className="flex shrink-0 items-center gap-4 bg-mist-700 p-3 rounded-md hover:bg-mist-600"
          >

            {/* Icon and name */}
            <div className="flex flex-col items-center">

              <img
                src={getItemIconUrl(component.icon)}
                alt={component.name}
                className="w-12 h-12 rounded"
              />

              <div className="flex-1 text-center">

                <p className="font-semibold">
                  {component.name}
                </p>

                <p className="text-sm text-gray-400">
                  Quantity: {component.quantity}
                </p>

              </div>
            </div>

            {/* Price */}
            {component.purchase_price !== null ? (

              <div className="text-right">

                <p className="text-sm text-gray-400">
                  Purchase Price
                </p>

                <p className="font-bold text-yellow-100">
                  {formatPrice(
                    component.purchase_price
                  )}
                </p>

              </div>

            ) : (

              <div>

                <div className="text-right">

                  <p className="text-sm text-gray-400">
                    Current
                  </p>

                  <p className="font-bold text-yellow-400">
                    {formatPrice(
                      component.current_price
                    )}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-sm text-gray-400">
                    Average
                  </p>

                  <p className="font-bold text-yellow-400">
                    {formatPrice(
                      component.average_price
                    )}
                  </p>

                </div>

              </div>

            )}

          </Link>
        ))}

      </div>

      {/* Totals */}
      <div className="mt-2 flex flex-wrap justify-center gap-8">

        <div className="text-center">

          <p className="text-sm text-gray-400">
            Total Current
          </p>

          <p className="text-lg font-bold text-yellow-400">
            {formatPrice(currentTotal)}
          </p>

        </div>

        <div className="text-center">

          <p className="text-sm text-gray-400">
            Total Average
          </p>

          <p className="text-lg font-bold text-yellow-400">
            {formatPrice(averageTotal)}
          </p>

        </div>

      </div>

    </div>
  );
}