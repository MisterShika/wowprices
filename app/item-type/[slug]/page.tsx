import { createSupabaseServerClient } from "@/lib/supabase-server";
import AuthGate from "@/components/AuthGate";
import ItemTileList from "@/components/ItemTileList";
import { notFound } from "next/navigation";
import Header from "@/components/Header";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ItemTypePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: category, error: categoryError } = await supabase
    .from("item_categories")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (categoryError || !category) {
    notFound();
  }

  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select(
      "id, name, icon, current_price, min_price, max_price, average_price, rarity, last_submitted_at"
    )
    .eq("category_id", category.id)
    .order("name");

  if (itemsError) {
    return (
      <p className="text-red-400">
        Failed to load items: {itemsError.message}
      </p>
    );
  }

  return (
    <AuthGate>
      <main className="p-6">
        <Header />
        <h1 className="text-3xl font-bold text-white mb-6">
          {category.name}
        </h1>

        {items && items.length > 0 ? (
          <ItemTileList items={items} />
        ) : (
          <p className="text-gray-400">
            No items found in this category.
          </p>
        )}
      </main>
    </AuthGate>
  );
}