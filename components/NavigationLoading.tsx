
"use client";

export default function NavigationLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-mist-900/95">
      <div className="h-14 w-14 rounded-full border-4 border-mist-600 border-t-yellow-400 animate-spin" />

      <p className="mt-6 text-lg font-bold text-yellow-400">
        Loading item...
      </p>

      <p className="mt-2 text-sm text-gray-300">
        Fetching the latest prices
      </p>
    </div>
  );
}
