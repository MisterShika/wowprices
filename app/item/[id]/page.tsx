import Header from "@/components/Header";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import PriceButton from "@/components/PriceButton";
import MostRecentSubmissions from "@/components/MostRecentSubmissions";
import AveragePrice from "@/components/AveragePrice";
import CurrentPrice from "@/components/CurrentPrice";
import MinPrice from "@/components/MinPrice";
import MaxPrice from "@/components/MaxPrice";

import PriceAnalysis from "@/components/PriceAnalysis";

import Components from "@/components/Components";
import AuthGate from "@/components/AuthGate";
import { getItemIconUrl } from "@/lib/itemIcon";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type ComponentRow = {
  quantity: number;
  component: {
    id: number;
    name: string;
    icon: string;
    current_price: number | null;
    average_price: number | null;
    purchase_price: number | null;
  };
};

export default async function ItemPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const { data: item, error } = await supabase
    .from("items")
    .select(`
      id,
      name,
      icon,
      rarity,
      base_sale_price,
      current_price,
      min_price,
      max_price,
      average_price
    `)
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

  // Get price history
  const { data: prices, error: priceError } = await supabase
    .from("price_checks")
    .select("created_at, sale_price, total_quantity")
    .eq("item_id", item.id)
    .order("created_at", { ascending: true });

  if (priceError) {
    console.error(priceError);
  }

  const priceData = prices ?? [];

  // Get item components
  const { data: componentData, error: componentError } =
    await supabase
      .from("item_components")
      .select(`
        quantity,
        component:items!item_components_component_fkey (
          id,
          name,
          icon,
          current_price,
          average_price,
          purchase_price
        )
      `)
      .eq("item_id", item.id);

  if (componentError) {
    console.error(componentError);
  }

  const components =
    (componentData as ComponentRow[] | null)?.map(
      (row) => ({
        id: row.component.id,
        name: row.component.name,
        icon: row.component.icon,
        current_price: row.component.current_price,
        average_price: row.component.average_price,
        purchase_price: row.component.purchase_price,
        quantity: row.quantity,
      })
    ) ?? [];

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

          {/* Top section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Item information */}
            <div className="md:col-span-1 flex flex-row items-center gap-4 max-sm:flex-col justify-center">
              <img
                src={getItemIconUrl(item.icon)}
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
                  Vendor Price:{" "}
                  {formatPrice(item.base_sale_price)}
                </p>
              </div>
            </div>

            {/* Price statistics */}
            <div className="md:col-span-2 flex flex-col sm:flex-row justify-around gap-4">
              <CurrentPrice
                price={item.current_price ?? 0}
                average={item.average_price ?? 0}
              />

              <AveragePrice
                price={item.average_price ?? 0}
              />

              <MaxPrice
                price={item.max_price ?? 0}
              />

              <MinPrice
                price={item.min_price ?? 0}
              />
            </div>

            {/* Add price button */}
            <div className="md:col-span-1 flex flex-col justify-center px-4">
              <PriceButton itemId={item.id} />
            </div>

          </div>

          {/* Price analysis */}
          <PriceAnalysis
            prices={priceData}
            minPrice={item.min_price ?? 0}
            maxPrice={item.max_price ?? 0}
            averagePrice={item.average_price ?? 0}
          />

          {/* Components */}
          {components.length > 0 && (
            <div>
              <Components
                components={components}
              />
            </div>
          )}

          {/* Recent submissions */}
          <MostRecentSubmissions
            itemId={item.id}
          />

        </div>
      </main>
    </AuthGate>
  );
}