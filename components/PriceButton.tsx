"use client";

import { useState } from "react";
import AddPrice from "@/components/AddPrice";

type Props = {
  itemId: number;
};

export default function PriceButton({ itemId }: Props) {
  const [showAddPrice, setShowAddPrice] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowAddPrice(true)}
        className="px-6 py-2 bg-yellow-400 text-gray-800 font-bold rounded-md hover:bg-yellow-500"
      >
        Add Price
      </button>

      {showAddPrice && (
        <AddPrice
          itemId={itemId}
          onClose={() => setShowAddPrice(false)}
        />
      )}
    </>
  );
}