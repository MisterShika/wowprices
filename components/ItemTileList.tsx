"use client";

import { useState } from "react";
import SingleTile from "@/components/SingleTile";
import NavigationLoading from "@/components/NavigationLoading";

type Props = {
  items: any[];
  listId?: string;
  onRemove?: (itemId: number) => void;
};

export default function ItemTileList({
  items,
  listId,
  onRemove,
}: Props) {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <>
      {isNavigating && <NavigationLoading />}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <SingleTile
            key={item.id}
            {...item}
            onNavigate={() => setIsNavigating(true)}
            listId={listId}
            onRemove={onRemove}
          />
        ))}
      </div>
    </>
  );
}