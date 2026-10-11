"use client";

import { useState } from "react";
import SingleTile from "@/components/SingleTile";
import NavigationLoading from "@/components/NavigationLoading";

export default function ItemTileList({ items }: { items: any[] }) {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <>
      {isNavigating && <NavigationLoading />}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((item) => (
          <SingleTile
            key={item.id}
            {...item}
            onNavigate={() => setIsNavigating(true)}
          />
        ))}
      </div>
    </>
  );
}