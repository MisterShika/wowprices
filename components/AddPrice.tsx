"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type AddPriceProps = {
  itemId: number;
  onClose: () => void;
};

export default function AddPrice({
  itemId,
  onClose,
}: AddPriceProps) {
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [copper, setCopper] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    const goldValue = Number(gold) || 0;
    const silverValue = Number(silver) || 0;
    const copperValue = Number(copper) || 0;

    const totalCopper =
      goldValue * 10000 +
      silverValue * 100 +
      copperValue;

    if (totalCopper <= 0) {
      setError("Please enter a price.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      return;
    }

    const { error } = await supabase
      .from("price_checks")
      .insert({
        item_id: itemId,
        user_id: user.id,
        sale_price: totalCopper,
      });

    if (error) {
      setError(error.message);
      return;
    }

    // Clear the inputs
    setGold("");
    setSilver("");
    setCopper("");

    window.dispatchEvent(new Event("price-submitted"));

    // Close the popup
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-mist-700 p-8 rounded-lg shadow-xl">
        {/* X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-300 hover:text-white"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Add Price
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              placeholder="Gold"
              value={gold}
              onChange={(e) => setGold(e.target.value)}
              className="w-24 bg-white text-gray-800 px-3 py-2 rounded-md"
            />

            <input
              type="number"
              min="0"
              placeholder="Silver"
              value={silver}
              onChange={(e) => setSilver(e.target.value)}
              className="w-24 bg-white text-gray-800 px-3 py-2 rounded-md"
            />

            <input
              type="number"
              min="0"
              placeholder="Copper"
              value={copper}
              onChange={(e) => setCopper(e.target.value)}
              className="w-24 bg-white text-gray-800 px-3 py-2 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-yellow-400 text-gray-800 font-bold rounded-md hover:bg-yellow-500"
          >
            Submit
          </button>

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}