import { redirect } from "next/navigation";
import Header from "@/components/Header";
import AuthGate from "@/components/AuthGate";
import AdminItemForm from "@/components/AdminItemForm";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminItemsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AuthGate><></></AuthGate>;
  }

  // Load categories
  const { data: categories, error: categoryError } = await supabase
    .from("item_categories")
    .select("id, name")
    .order("name");

  if (categoryError) {
    console.error(categoryError);
  }

  // Load existing items for component selection
  const { data: items, error: itemError } = await supabase
    .from("items")
    .select("id, name, icon, rarity")
    .order("name");

  if (itemError) {
    console.error(itemError);
  }

  // Load icons from Supabase Storage
  const { data: iconFiles, error: iconError } = await supabase.storage
    .from("items-icons")
    .list("", {
      limit: 1000,
      sortBy: {
        column: "name",
        order: "asc",
      },
    });

  if (iconError) {
    console.error(iconError);
  }

  const icons =
    iconFiles
      ?.filter((file) => file.name.toLowerCase().endsWith(".jpg"))
      .map((file) => file.name) ?? [];

  return (
    <AuthGate>
      <main>
        <Header />

        <div className="max-w-5xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-yellow-400 mb-6">
            Add Item
          </h1>

          <AdminItemForm
            categories={categories ?? []}
            items={items ?? []}
            icons={icons}
          />
        </div>
      </main>
    </AuthGate>
  );
}