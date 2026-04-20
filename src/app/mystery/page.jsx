"use client";

import Navbar from "@/components/layout/Navbar";
import Spinner from "@/components/ui/Spinner";
import MysteryBook from "@/components/ui/MysteryBook";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMysteryBooks } from "@/hooks/useBooks";

export default function MysteryPage() {
  const { books, isPending, error } = useMysteryBooks();
  const { currentUser } = useCurrentUser();

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400 text-sm">
        {error.message}
      </div>
    );
  }

  const allGenres = [
    "cyberpunk",
    "dark_romance",
    "vintage_noir",
    "space_opera",
    "gothic_horror",
  ];

  return (
    <div className="min-h-screen bg-black text-slate-100 font-display">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black px-6 ">
        <Navbar user={currentUser} />
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 border-l-4 border-primary pl-6">
          <h1 className="text-4xl font-black">The Mystery Room</h1>
          <p className="text-slate-500 text-sm">Trade by vibe, not cover.</p>
        </div>

        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          <button className="px-4 py-2 text-[10px] uppercase tracking-widest rounded-full bg-gradient-to-r from-[#FF4B2B] to-[#FDC830] text-black font-bold">
            All Vibes
          </button>

          {allGenres.map((g) => (
            <button
              key={g}
              className="px-4 py-2 text-[10px] uppercase tracking-widest rounded-full border border-slate-800 text-slate-300 hover:border-primary"
            >
              {g.replaceAll("_", " ")}
            </button>
          ))}
        </div>

        {books.length === 0 ? (
          <div className="text-center text-slate-600 py-20">
            No mystery books available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <MysteryBook key={book.id} book={book} />
            ))}
          </div>
        )}

        <div className="mt-14 text-center text-[10px] text-slate-600 uppercase tracking-widest">
          Showing {books.length} Mysteries
        </div>
      </main>
    </div>
  );
}
