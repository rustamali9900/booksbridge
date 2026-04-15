"use client";
import { useBooks } from "@/hooks/useBooks";
// Notice: No Supabase imports or fetch calls directly in this file!

export default function MarketplacePage() {
  const { books, loading, fetchMarketplaceBooks } = useBooks();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#f5ecd5] mb-6">
        The Marketplace
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder for BookCards */}
        <div className="card-dark h-64 flex items-center justify-center text-zinc-500">
          Loading Inventory...
        </div>
      </div>
    </div>
  );
}
