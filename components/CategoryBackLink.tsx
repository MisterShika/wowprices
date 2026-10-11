"use client";

import { useState } from "react";
import Link from "next/link";
import NavigationLoading from "@/components/NavigationLoading";

type Props = {
  slug: string;
  name: string;
};

export default function CategoryBackLink({ slug, name }: Props) {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <>
      <Link
        href={`/item-type/${slug}`}
        onClick={() => setIsNavigating(true)}
        className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
      >
        ← See all {name}
      </Link>

      {isNavigating && <NavigationLoading />}
    </>
  );
}