"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ItemTileList from "@/components/ItemTileList";

export default function SharedList({ listId }: { listId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleRemoveItem = async (itemId: number) => {
    const confirmed = window.confirm("Remove this item from the list?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("item_list_entries")
      .delete()
      .eq("list_id", listId)
      .eq("item_id", itemId);

    if (error) {
      console.error("Failed to remove item:", error);
      setError("Unable to remove item from the list.");
      return;
    }

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("item_list_entries")
        .select(`
          items (
            id,
            name,
            icon,
            current_price,
            min_price,
            max_price,
            average_price,
            last_submitted_at,
            rarity
          )
        `)
        .eq("list_id", listId);

      if (error) throw error;

      setItems(
        (data ?? [])
          .map((entry: any) => entry.items)
          .filter(Boolean)
      );
    } catch (err) {
      console.error("Error loading list items:", err);
      setError("Unable to load list items.");
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  if (loading) {
    return <p className="text-gray-400">Loading items...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <ItemTileList
      items={items}
      listId={listId}
      onRemove={handleRemoveItem}
    />
  );
}