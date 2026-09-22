"use client";

type Range = "all" | "today" | "7d" | "30d" | "90d";

type Props = {
  value: Range;
  onChange: (range: Range) => void;
};

const ranges: { value: Range; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
];

export default function PriceDateRange({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {ranges.map((range) => (
        <button
          key={range.value}
          type="button"
          onClick={() => onChange(range.value)}
          className={`px-4 py-2 rounded-md font-bold transition ${
            value === range.value
              ? "bg-yellow-400 text-gray-800"
              : "bg-mist-700 text-gray-300 hover:bg-mist-600 hover:text-white"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}