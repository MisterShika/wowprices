import { createSupabaseServerClient } from "@/lib/supabase-server";
import AuthGate from "@/components/AuthGate";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SharedList from "@/components/SharedList";

type Props = {
  params: Promise<{ uuid: string }>;
};

export default async function SharedListPage({ params }: Props) {
  const { uuid } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: list, error } = await supabase
    .from("item_lists")
    .select("id, name")
    .eq("id", uuid)
    .single();

  if (error || !list) {
    notFound();
  }

  return (
    <AuthGate>
      <main className="p-6">
        <Header />

        <h1 className="mb-6 text-3xl font-bold text-white">
          {list.name}
        </h1>

        <SharedList listId={uuid} />
      </main>
    </AuthGate>
  );
}