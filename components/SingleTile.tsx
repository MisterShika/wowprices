import { getItemIconUrl } from "@/lib/itemIcon";
import Link from "next/link";

type SingleTileProps = {
  id: number;
  name: string;
  icon: string;
  current_price: number | null;
  min_price: number | null;
  max_price: number | null;
  average_price: number | null;
  last_submitted_at: string | null;
  rarity: string | null;
  onNavigate: () => void;
};

function formatPrice(copper: number | null) {
  if (copper === null) return "—";

  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return [
    gold > 0 ? `${gold}g` : "",
    silver > 0 ? `${silver}s` : "",
    remainingCopper > 0 ? `${remainingCopper}c` : "",
  ]
    .filter(Boolean)
    .join(" ") || "0c";
}

function formatLastSubmitted(date: string | null) {
  if (!date) return "Never";

  const timestamp = new Date(date).getTime();
  const diff = Date.now() - timestamp;

  if (diff < 0) return "Just now";

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getRarityColor(rarity: string | null) {
    switch (rarity) {
        case "Common":
        return "text-white";

        case "Uncommon":
        return "text-green-400";

        case "Rare":
        return "text-blue-400";

        case "Epic":
        return "text-purple-400";

        case "Legendary":
        return "text-orange-400";

        default:
        return "text-yellow-400";
    }
}

export default function SingleTile({
  id,
  name,
  icon,
  current_price,
  min_price,
  max_price,
  average_price,
  last_submitted_at,
  rarity,
  onNavigate,
}: SingleTileProps) {
  return (
    <Link href={`/item/${id}`} className="bg-mist-700 hover:bg-mist-600 text-white rounded-lg p-4 border border-mist-600 transition-colors duration-300" onClick={onNavigate}>
      <div className="flex justify-between gap-3 mb-4">
        <div>
            <img
            src={getItemIconUrl(icon)}
            alt=""
            className="w-12 h-12 rounded"
            />
            <h2 className={`font-bold text-lg ${getRarityColor(rarity)}`}>{name}</h2>
        </div>
        <div className="text-right">
            <p className="text-gray-400 text-sm">Last updated:</p>
            <p className="text-gray-400 text-sm">{formatLastSubmitted(last_submitted_at)}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Current</span>
            <span
            className={`font-bold ${
                current_price === null || average_price === null
                ? "text-yellow-400"
                : current_price < average_price
                    ? "text-red-500"
                    : current_price > average_price
                    ? "text-green-500"
                    : "text-yellow-400"
            }`}
            >
            {formatPrice(current_price)}
            </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Minimum</span>
          <span>{formatPrice(min_price)}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Maximum</span>
          <span>{formatPrice(max_price)}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-400">Average</span>
          <span>{formatPrice(average_price)}</span>
        </div>
      </div>
    </Link>
  );
}