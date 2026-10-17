"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NavigationLoading from "@/components/NavigationLoading";
import { useRouter, usePathname } from "next/navigation";

type ItemList = {
  id: string;
  name: string;
};

export default function ListsDropdown() {
  const [lists, setLists] = useState<ItemList[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadLists() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Failed to get user:", authError);
        return;
      }

      if (!user) return;

      const { data, error } = await supabase
        .from("item_lists")
        .select("id, name")
        .eq("user_id", user.id)
        .order("name");

      if (error) {
        console.error("Failed to load lists:", error);
        return;
      }

      setLists(data ?? []);
    }

    void loadLists();
  }, []);

  return (
    <>
      {isNavigating && <NavigationLoading />}

      <div className="group relative inline-block">
        <button
          type="button"
          className="rounded px-4 py-2 bg-mist-700 hover:bg-mist-600
                     transition-colors duration-300"
          aria-haspopup="true"
        >
          Lists
        </button>

        <div
          className="invisible absolute left-0 top-full z-50 min-w-48
                     rounded-md bg-mist-800 shadow-lg
                     opacity-0 transition-opacity duration-200
                     group-hover:visible group-hover:opacity-100
                     group-focus-within:visible group-focus-within:opacity-100
                     border border-mist-700"
        >
          <div className="py-2">
            {lists.length > 0 ? (
              lists.map((list) => {
                const targetPath = `/lists/${list.id}`;

                return (
                  <Link
                    key={list.id}
                    href={targetPath}
                    onClick={(event) => {
                      if (pathname === targetPath) {
                        event.preventDefault();
                        router.refresh();
                      } else {
                        setIsNavigating(true);
                      }
                    }}
                    className="block px-4 py-2 text-left text-gray-200
                               hover:bg-mist-700 hover:text-yellow-400
                               transition-colors duration-200"
                  >
                    {list.name}
                  </Link>
                );
              })
            ) : (
              <p className="px-4 py-2 text-sm text-gray-400">
                No lists yet
              </p>
            )}

            <div className="mt-2 border-t border-mist-700 pt-2">
              <Link
                href="/lists"
                onClick={(event) => {
                  if (pathname === "/lists") {
                    event.preventDefault();
                    router.refresh();
                  } else {
                    setIsNavigating(true);
                  }
                }}
                className="block px-4 py-2 text-left text-yellow-400
                           hover:bg-mist-700 transition-colors duration-200"
              >
                Manage Lists
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}