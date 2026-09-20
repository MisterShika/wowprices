import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import PriceButton from "@/components/PriceButton";
import MostRecentSubmissions from "@/components/MostRecentSubmissions";
import PriceHistoryGraph from "@/components/PriceHistoryGraph";
import AveragePrice from "@/components/AveragePrice";
import CurrentPrice from "@/components/CurrentPrice";
import MinPrice from "@/components/MinPrice";
import MaxPrice from "@/components/MaxPrice";
import TimeOfDay from "@/components/TimeOfDay";
import DayOfWeek from "@/components/DayOfWeek";
import DayOfWeekTimeOfDay from "@/components/DayOfWeekTimeOfDay";
import AuthGate from "@/components/AuthGate";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ItemPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const { data: item, error } = await supabase
    .from("items")
    .select("id, name, icon, rarity, base_sale_price")
    .eq("id", id)
    .single();

  if (error || !item) {
    return (
      <AuthGate>
        <main>
          <Header />

          <div className="text-center mt-8">
            <h1 className="text-2xl font-bold text-red-400">
              Item not found
            </h1>
          </div>
        </main>
      </AuthGate>
    );
  }

  // Get price data
  const { data: prices, error: priceError } = await supabase
    .from("price_checks")
    .select("created_at, sale_price")
    .eq("item_id", item.id)
    .order("created_at", { ascending: true });

  if (priceError) {
    console.error(priceError);
  }

  const priceData = prices ?? [];

  // Calculate statistics
  const priceValues = priceData.map(
    (price) => price.sale_price
  );

  const minPrice =
    priceValues.length > 0
      ? Math.min(...priceValues)
      : 0;

  const maxPrice =
    priceValues.length > 0
      ? Math.max(...priceValues)
      : 0;

  const averagePrice =
    priceValues.length > 0
      ? Math.round(
          priceValues.reduce(
            (sum, price) => sum + price,
            0
          ) / priceValues.length
        )
      : 0;

  const frequency = new Map<number, number>();

  for (const price of priceValues) {
    frequency.set(
      price,
      (frequency.get(price) ?? 0) + 1
    );
  }

  function getRarityColor(rarity: string | null) {
    switch (rarity) {
      case "Common":
        return "text-white";
      case "Uncommon":
        return "text-green-400";
      case "Rare":
        return "text-blue-400";
      case "Epic":
        return "text-purple-400";
      case "Legendary":
        return "text-orange-400";
      default:
        return "text-yellow-400";
    }
  }

  function formatPrice(copper: number) {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const remainingCopper = copper % 100;

    return `${gold}g ${silver}s ${remainingCopper}c`;
  }

  return (
    <AuthGate>
      <main>
        <Header />

        <div className="text-center">


        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 flex flex-row items-center gap-4 max-sm:flex-col justify-center">
            <img
              src={`/icons/${item.icon}.jpg`}
              alt={item.name}
              className="w-16 h-16 rounded"
            />

            <div>
              <h1
                className={`text-3xl font-bold ${getRarityColor(
                  item.rarity
                )}`}
              >
                {item.name}
              </h1>

              <p className="text-gray-300 mt-1">
                Vendor Price: {formatPrice(item.base_sale_price)}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row justify-around gap-4">
            <CurrentPrice
              price={priceValues[priceValues.length - 1] ?? 0}
            />
            <AveragePrice price={averagePrice} />
            <MaxPrice price={maxPrice} />
            <MinPrice price={minPrice} />
          </div>

          <div className="md:col-span-1 flex flex-col justify-center px-4">
            <PriceButton itemId={item.id} />
          </div>
        </div>

          {/* You can rearrange these however you want */}

          <PriceHistoryGraph
            prices={priceData}
            minPrice={minPrice}
            maxPrice={maxPrice}
            averagePrice={averagePrice}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TimeOfDay prices={priceData} />
              <DayOfWeek prices={priceData} />
            </div>

            <div>
              <DayOfWeekTimeOfDay prices={priceData} />
            </div>
          </div>

          <MostRecentSubmissions
            itemId={item.id}
          />

        </div>
      </main>
    </AuthGate>
  );
}