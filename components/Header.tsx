"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getItemIconUrl } from "@/lib/itemIcon";

type Item = {
  id: number;
  name: string;
  icon: string;
};

export default function Header() {
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadItems() {
      const { data } = await supabase
        .from("items")
        .select("id, name, icon")
        .order("name");

      setItems(data ?? []);
    }

    loadItems();
  }, []);

  const filteredItems =
    search.trim().length > 0
      ? items
          .filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 10)
      : [];

  function handleItemClick(item: Item) {
    router.push(`/item/${item.id}`);
    setSearch("");
  }

  return (
    <header className="bg-mist-800 text-white p-4 flex justify-center gap-6">

      <div className="relative w-full max-w-[500px]">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {search.trim() && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-800 hover:bg-gray-100"
                >
                  <img
                    src={getItemIconUrl(item.icon)}
                    alt=""
                    className="w-8 h-8 rounded"
                  />

                  <span>{item.name}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500">
                No items found
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}