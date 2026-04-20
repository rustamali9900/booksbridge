"use client";

import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Spinner from "@/components/ui/Spinner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import { useExchangeZoneFilter } from "@/hooks/useExchangeZoneFilter";

export default function ExchangeZonePage() {
  const { filters, activeFilter, setActiveFilter, books, isPending, error } =
    useExchangeZoneFilter();

  const {
    currentUserId,
    currentUser,
    isLoading: isUserLoading,
  } = useCurrentUser();

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6 text-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-6">
          <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-red-400">
            Failed To Load Exchange Books
          </p>
          <p className="mt-3 text-sm text-slate-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black px-6 py-4">
        <div className="mx-auto max-w-[1600px]">
          <Navbar user={currentUser} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-[#FF4B2B] to-[#FDC830] opacity-50" />
              <span className="font-display text-[10px] font-black uppercase tracking-[0.3em] text-[#FDC830] opacity-80">
                The Barter Floor
              </span>
            </div>

            <h1 className="font-display text-4xl font-black tracking-tighter text-white md:text-5xl">
              Exchange Zone
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-slate-500">
              Trade your stories for new adventures. No currency, just quality
              literature exchange.
            </p>
          </div>
        </div>

        <div className="mb-8 flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? "border border-white/10 bg-white/5 text-white"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {books.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] text-center">
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
                No Books Found
              </p>
              <p className="mt-3 text-sm text-slate-600">
                There are no books available for this collection yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <Link href={`/books/${book.id}`} key={book.id}>
                <div className="group flex flex-col gap-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    <Image
                      src={
                        book.image_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}`
                      }
                      alt={book.title}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    <div className="absolute left-4 top-4 z-20">
                      <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                        {book.copy_type === "signed_copy"
                          ? "Signed Copy"
                          : book.copy_type === "first_edition"
                            ? "First Edition"
                            : "Standard"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 px-1">
                    <div>
                      <h3 className="text-base font-bold leading-tight text-white transition-colors group-hover:text-[#FDC830]">
                        {book.title}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {book.author}
                      </p>

                      {book.description && (
                        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
                          {book.description}
                        </p>
                      )}
                    </div>

                    <button className="relative w-full rounded-lg border border-orange-400 bg-black py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-all hover:scale-[1.01] hover:text-white active:scale-[0.98] before:absolute before:-inset-[1.5px] before:-z-10 before:rounded-lg before:bg-gradient-to-r before:from-[#d4290b] before:to-[#f3ba10]">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-col items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            {books.length} Collection{books.length !== 1 ? "s" : ""} Available
          </p>

          <button className="rounded-full border border-white/10 px-8 py-3 text-xs font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-white/5">
            Explore More
          </button>
        </div>
      </main>
    </div>
  );
}
