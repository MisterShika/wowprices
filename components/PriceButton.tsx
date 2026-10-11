"use client";

import { useState } from "react";
import AddPrice from "@/components/AddPrice";

type Props = {
  itemId: number;
  itemName: string;
  rarity: string;
};

export default function PriceButton({ itemId, itemName, rarity }: Props) {
  const [showAddPrice, setShowAddPrice] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowAddPrice(true)}
        className="px-6 py-2 bg-yellow-400 text-gray-800 font-bold rounded-md hover:bg-yellow-500 transition-colors duration-300 cursor-pointer mb-4"
      >
        Add Price
      </button>

      {showAddPrice && (
        <AddPrice
          itemId={itemId}
          itemName={itemName}
          rarity={rarity}
          onClose={() => setShowAddPrice(false)}
        />
      )}
    </>
  );
}