"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import NavigationLoading from "@/components/NavigationLoading";
import { useRouter, usePathname } from "next/navigation";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function CategoriesDropdown() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("item_categories")
        .select("id, name, slug")
        .neq("slug", "vendor-materials")
        .order("name");

      if (error) {
        console.error("Failed to load categories:", error);
        return;
      }

      setCategories(data ?? []);
    }

    loadCategories();
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
        Categories
      </button>

      <div
        className="invisible absolute left-0 top-full z-50 min-w-48
                   rounded-md bg-mist-800 shadow-lg
                   opacity-0 transition-opacity duration-200
                   group-hover:visible group-hover:opacity-100
                   group-focus-within:visible group-focus-within:opacity-100
                   border-1 border-mist-700"
      >
        <div className="py-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/item-type/${category.slug}`}
              onClick={(event) => {
                const targetPath = `/item-type/${category.slug}`;

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
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}