"use client";

import Navbar from "@/components/layout/Navbar";
import BookCard from "@/components/ui/BookCard";
import Spinner from "@/components/ui/Spinner";
import { useBooks } from "@/hooks/useBooks";

export default function Marketplace() {
  const { books, isPending, error } = useBooks();

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen">
      <Navbar user={books[0]?.profiles} />

      <main className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex flex-col items-center mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter uppercase italic text-white">
            Direct Sales Marketplace
          </h2>

          <p className="text-slate-400 max-w-xl text-sm mb-10 font-light">
            Discover premium editions from verified collectors. Secure, instant
            transactions for the world's rarest literary treasures.
          </p>

          <button className="mb-8 px-6 py-2.5 rounded-full bg-linear-to-r from-[#ff330f] to-[#f6c438] text-white font-bold text-xs tracking-[0.2em] uppercase shadow-md hover:scale-[1.03] hover:shadow-lg transition-all duration-300">
            List a Book
          </button>

          {/* Search Bar */}
          <div className="w-full max-w-xl flex items-center h-12 pl-5 pr-2 rounded-lg border border-orange-500/40 bg-black/20 backdrop-blur-md transition focus-within:border-orange-400 focus-within:shadow-none">
            <input
              className="w-full text-white placeholder:text-slate-600 text-xs font-light tracking-wide bg-transparent outline-none focus:outline-none"
              placeholder="Search for rare editions, authors, or genres..."
              type="text"
            />

            <button className="size-9 flex items-center justify-center text-orange-400 hover:text-orange-300 transition-all">
              <span className="material-symbols-outlined text-[18px]">
                search
              </span>
            </button>
          </div>
        </div>

        {isPending ? (
          <Spinner />
        ) : error ? (
          <div className="text-center text-primary py-16 font-bold tracking-widest uppercase text-sm">
            Error: {error.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {!isPending && (
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
            <p className="text-slate-600 text-[10px] font-medium uppercase tracking-[0.3em]">
              LiberExchange Marketplace © 2026
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
