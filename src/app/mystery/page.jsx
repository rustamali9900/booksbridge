"use client";

import { useState, useMemo } from "react";
import Spinner from "@/components/ui/Spinner";
import Navbar from "@/components/layout/Navbar";
import { useMysteryBooks } from "@/hooks/useBooks";
import { useCreateBook } from "@/hooks/useCreateBook";
import MysteryBook from "@/components/ui/MysteryBook";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ListBookModal from "@/components/layout/ListBookModal";

export default function MysteryPage() {
  const { books, isPending, error } = useMysteryBooks();
  const { currentUser } = useCurrentUser();

  const { mutate: createBook, isPending: isCreating } = useCreateBook();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleBookSubmit = (formData) => {
    createBook(
      { ...formData, type: "mystery" },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
        onError: (err) => {
          alert(err.message);
        },
      },
    );
  };

  const filters = ["all", "horror", "thriller", "drama", "fiction"];

  const filteredBooks = useMemo(() => {
    if (!books) return [];

    if (activeFilter === "all") return books;

    return books.filter((book) => {
      const tags = (book.genre_tags || []).map((t) => t.toLowerCase());

      if (activeFilter === "others") {
        const main = ["horror", "thriller", "drama", "fiction"];
        return !tags.some((t) => main.includes(t));
      }

      return tags.includes(activeFilter);
    });
  }, [books, activeFilter]);

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

        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 cursor-pointer rounded-full bg-gradient-to-r from-[#ff330f] to-[#f6c438] text-black font-bold text-xs tracking-[0.2em] uppercase shadow-md hover:scale-[1.03] transition"
          >
            List Mystery Book
          </button>
        </div>

        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 text-[10px] cursor-pointer uppercase tracking-widest rounded-full border transition ${
                activeFilter === f
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold border-transparent"
                  : "border-slate-800 text-slate-300 hover:border-primary"
              }`}
            >
              {f.replaceAll("_", " ")}
            </button>
          ))}
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center text-slate-600 py-20">
            No mystery books available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <MysteryBook key={book.id} book={book} />
            ))}
          </div>
        )}

        <div className="mt-14 text-center text-[10px] text-slate-600 uppercase tracking-widest">
          Showing {filteredBooks.length} Mysteries
        </div>
      </main>

      <ListBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBookSubmit}
        isPending={isCreating}
        mode="mystery"
      />
    </div>
  );
}
