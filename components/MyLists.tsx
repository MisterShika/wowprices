
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Header from "@/components/Header";
import NavigationLoading from "@/components/NavigationLoading";

type ItemList = {
  id: string;
  name: string;
  created_at: string;
};

export default function MyLists() {
  const [lists, setLists] = useState<ItemList[]>([]);
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const loadLists = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setLists([]);
        return;
      }

      const { data, error: listsError } = await supabase
        .from("item_lists")
        .select("id, name, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (listsError) throw listsError;

      setLists(data ?? []);
    } catch (err) {
      console.error("Error loading lists:", err);
      setError("Unable to load your lists.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLists();
  }, [loadLists]);

  async function handleDeleteList(list: ItemList) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${list.name}"? This cannot be undone.`
  );

  if (!confirmed) return;

  setError("");
  setSuccess("");

  const { error: deleteError } = await supabase
    .from("item_lists")
    .delete()
    .eq("id", list.id);

  if (deleteError) {
    console.error("Error deleting list:", deleteError);
    setError("Unable to delete the list. Please try again.");
    return;
  }

  setLists((currentLists) =>
    currentLists.filter((currentList) => currentList.id !== list.id)
  );

  setSuccess(`Deleted "${list.name}".`);
}

  async function handleCreateList(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = listName.trim();

    if (!trimmedName) {
      setError("Please enter a list name.");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("You must be logged in to create a list.");
      }

      const { error: insertError } = await supabase
        .from("item_lists")
        .insert({
          name: trimmedName,
          user_id: user.id,
        });

      if (insertError) throw insertError;

      setListName("");
      setSuccess(`Created "${trimmedName}".`);

      await loadLists();
    } catch (err) {
      console.error("Error creating list:", err);
      setError("Unable to create the list. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4">
      {isNavigating && <NavigationLoading />}
      <Header />
      <h1 className="mb-2 text-3xl font-bold text-yellow-400">
        My Lists
      </h1>

      <p className="mb-8 text-gray-300">
        Create lists of items to organize and share with your friends.
      </p>

      <section className="mb-10 rounded-lg border border-mist-700 bg-mist-800 p-5">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Create a List
        </h2>

        <form onSubmit={handleCreateList}>
          <label
            htmlFor="list-name"
            className="mb-2 block text-sm text-gray-300"
          >
            List Name
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="list-name"
              type="text"
              value={listName}
              onChange={(event) => setListName(event.target.value)}
              placeholder="e.g. Tailoring Materials"
              maxLength={100}
              required
              disabled={creating}
              className="min-w-0 flex-1 rounded border border-mist-700 bg-mist-900 px-3 py-2 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={creating || !listName.trim()}
              className="rounded bg-yellow-400 px-5 py-2 font-semibold text-mist-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create List"}
            </button>
          </div>
        </form>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="mt-4 text-sm text-green-400">
            {success}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Your Lists
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading lists...</p>
        ) : lists.length === 0 ? (
          <div className="rounded-lg border border-mist-700 bg-mist-800 p-6 text-center">
            <p className="text-gray-300">You haven't created any lists yet.</p>
            <p className="mt-2 text-sm text-gray-500">
              Create your first list above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {lists.map((list) => (
              <div
                key={list.id}
                className="group relative rounded-lg border border-mist-700 p-4 pr-12 bg-mist-700 text-gray-300 hover:bg-mist-600 transition-colors duration-300"
              >
                <Link
                  href={`/lists/${list.id}`}
                  onClick={() => setIsNavigating(true)}
                >
                <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 ">
                  
                    {list.name}
                  
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Created {new Date(list.created_at).toLocaleDateString()}
                </p>
                </Link>
                <button
                  type="button"
                  onClick={() => void handleDeleteList(list)}
                  aria-label={`Delete ${list.name}`}
                  title="Delete list"
                  className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <span aria-hidden="true" className="text-xl leading-none">
                    ×
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
