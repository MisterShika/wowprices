"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { getItemIconUrl } from "@/lib/itemIcon";

type Item = {
  id: number;
  name: string;
  icon: string;
};

export default function ItemSelect() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Load all items once
  useEffect(() => {
    async function loadItems() {
      const { data, error } = await supabase
        .from("items")
        .select("id, name, icon")
        .order("name");

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setItems(data ?? []);
      setLoading(false);
    }

    loadItems();
  }, []);

  // Filter items as the user types
  const filteredItems =
    search.trim().length > 0
      ? items.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  // Repeat selected item's icon for the banners
  const marqueeIcons = selectedItem
    ? Array(12).fill(selectedItem.icon)
    : [];

  function handleSelectItem(item: Item) {
    setSelectedItem(item);
    setSearch(item.name);
  }

  return (
    <div className="flex flex-col max-w-lg items-center mt-8 space-y-4 bg-mist-700 p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white">
        Search for an item...
      </h2>

      {/* Search */}
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search for an item..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedItem(null);
          }}
          className="w-full bg-white px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Search results */}
        {search.trim() && !selectedItem && (
          <div className="absolute z-20 w-full mt-1 bg-white rounded-md border border-gray-300 shadow-lg max-h-64 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-3 text-gray-500">
                Loading items...
              </p>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100"
                >
                  <img
                    src={getItemIconUrl(item.icon)}
                    alt=""
                    className="w-8 h-8 rounded"
                  />

                  <span className="text-gray-800">
                    {item.name}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-gray-500">
                No items found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Selected item confirmation */}
      {selectedItem && (
        <>
          {/* Top endless banner */}
          <div className="w-full overflow-hidden mt-4">
            <div className="flex w-max animate-marquee-left">
              <div className="flex shrink-0 gap-3 pr-3">
                {marqueeIcons.map((icon, index) => (
                  <img
                    key={`top-1-${index}`}
                    src={getItemIconUrl(icon)}
                    alt=""
                    className="w-10 h-10 rounded"
                  />
                ))}
              </div>

              <div className="flex shrink-0 gap-3 pr-3">
                {marqueeIcons.map((icon, index) => (
                  <img
                    key={`top-2-${index}`}
                    src={getItemIconUrl(icon)}
                    alt=""
                    className="w-10 h-10 rounded"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center text */}
          <div className="text-center py-2">
            <p className="text-sm uppercase tracking-widest text-gray-300">
              Viewing the prices for
            </p>

            <p className="text-3xl font-bold text-yellow-400 mt-1">
              {selectedItem.name}
            </p>
          </div>

          {/* Go */}
            <button
            type="button"
            className="px-6 py-2 bg-yellow-400 text-gray-800 font-bold rounded-md hover:bg-yellow-500"
            onClick={() => {
                router.push(`/item/${selectedItem.id}`);
            }}
            >
            Go
            </button>

          {/* Bottom endless banner */}
          <div className="w-full overflow-hidden">
            <div className="flex w-max animate-marquee-right">
              <div className="flex shrink-0 gap-3 pr-3">
                {marqueeIcons.map((icon, index) => (
                  <img
                    key={`bottom-1-${index}`}
                    src={getItemIconUrl(icon)}
                    alt=""
                    className="w-10 h-10 rounded"
                  />
                ))}
              </div>

              <div className="flex shrink-0 gap-3 pr-3">
                {marqueeIcons.map((icon, index) => (
                  <img
                    key={`bottom-2-${index}`}
                    src={getItemIconUrl(icon)}
                    alt=""
                    className="w-10 h-10 rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {error && (
        <p className="text-red-400 text-sm text-center">
          {error}
        </p>
      )}
    </div>
  );
}