"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePriceCheck } from "@/lib/actions";

type Props = {
  priceCheckId: number;
};

export default function OopsieButton({
  priceCheckId,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this price submission?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      await deletePriceCheck(priceCheckId);
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete submission."
      );
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      title="Oopsie! Delete this submission"
      className="ml-3 text-red-500 hover:text-red-400 font-bold text-lg disabled:opacity-50"
    >
      ×
    </button>
  );
}