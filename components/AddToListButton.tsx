
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type ItemList = {
  id: string;
  name: string;
};

export default function AddToListButton({
  itemId,
}: {
  itemId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [lists, setLists] = useState<ItemList[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function toggleDropdown() {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("You must be logged in.");
      }

      const { data, error: listsError } = await supabase
        .from("item_lists")
        .select("id, name")
        .eq("user_id", user.id)
        .order("name");

      if (listsError) throw listsError;

      setLists(data ?? []);
    } catch (err) {
      console.error("Failed to load lists:", err);
      setError("Unable to load your lists.");
    } finally {
      setLoading(false);
    }
  }

  async function addToList(list: ItemList) {
    setAddingId(list.id);
    setMessage("");
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("item_list_entries")
        .insert({
          list_id: list.id,
          item_id: itemId,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setMessage(`Already in "${list.name}".`);
        } else {
          throw insertError;
        }
      } else {
        setMessage(`Added to "${list.name}".`);
      }
    } catch (err) {
      console.error("Failed to add item to list:", err);
      setError("Unable to add item to this list.");
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={toggleDropdown}
        className="rounded bg-mist-800 border border-mist-600 px-4 py-2 text-white hover:bg-mist-700 transition-colors"
      >
        Add to List
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-64 rounded-lg border border-mist-600 bg-mist-800 p-2 shadow-lg">
          {loading ? (
            <p className="p-2 text-sm text-gray-400">
              Loading your lists...
            </p>
          ) : error ? (
            <p role="alert" className="p-2 text-sm text-red-400">
              {error}
            </p>
          ) : lists.length === 0 ? (
            <p className="p-2 text-sm text-gray-400">
              You haven't created any lists yet.
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {lists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  disabled={addingId !== null}
                  onClick={() => addToList(list)}
                  className="block w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-mist-700 disabled:opacity-50"
                >
                  {addingId === list.id
                    ? "Adding..."
                    : list.name}
                </button>
              ))}
            </div>
          )}

          {message && (
            <p role="status" className="p-2 text-sm text-green-400">
              {message}
            </p>
          )}

          {error && !loading && lists.length > 0 && (
            <p role="alert" className="p-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
