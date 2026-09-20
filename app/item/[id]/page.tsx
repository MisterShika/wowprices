import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import PriceButton from "@/components/PriceButton";
import MostRecentSubmissions from "@/components/MostRecentSubmissions";
import PriceHistoryGraph from "@/components/PriceHistoryGraph";
import AveragePrice from "@/components/AveragePrice";
import MinPrice from "@/components/MinPrice";
import MaxPrice from "@/components/MaxPrice";
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

  const modeEntry = [...frequency.entries()].sort(
    (a, b) => b[1] - a[1]
  )[0];

  const modePrice =
    modeEntry && modeEntry[1] > 1
      ? modeEntry[0]
      : null;

  return (
    <AuthGate>
      <main>
        <Header />

        <div className="text-center mt-8">

          <img
            src={`/icons/${item.icon}.jpg`}
            alt={item.name}
            className="w-16 h-16 mx-auto rounded"
          />

          <h1 className="text-3xl font-bold text-yellow-400 mt-3">
            {item.name}
          </h1>

          <p className="text-gray-300 mt-1">
            Rarity: {item.rarity ?? "None"}
          </p>

          <p className="text-gray-300 mt-1">
            Base Sale Price: {item.base_sale_price}
          </p>

          {/* You can rearrange these however you want */}

          <PriceHistoryGraph
            prices={priceData}
            minPrice={minPrice}
            maxPrice={maxPrice}
            averagePrice={averagePrice}
            modePrice={modePrice}
          />

          <AveragePrice price={averagePrice} />

          <MaxPrice price={maxPrice} />

          <MinPrice price={minPrice} />

          <PriceButton itemId={item.id} />

          <MostRecentSubmissions
            itemId={item.id}
          />

        </div>
      </main>
    </AuthGate>
  );
}