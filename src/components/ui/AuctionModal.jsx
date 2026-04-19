"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuctionModal({ books }) {
  const router = useRouter();
  const [startingBookId, setStartingBookId] = useState(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    let timer;
    if (startingBookId && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (startingBookId && countdown === 0) {
      router.push(`/auction/${startingBookId}`);
    }
    return () => clearInterval(timer);
  }, [startingBookId, countdown, router]);

  const handleStartAuction = async (bookId) => {
    setStartingBookId(bookId);
    setCountdown(10);

    try {
      await fetch("/api/auction/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter text-white">
          Select Book for Auction
        </h3>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5"
            >
              <div className="relative w-16 h-24 rounded-md overflow-hidden shrink-0">
                <Image
                  src={book.image_url}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm text-orange-400 font-bold uppercase tracking-widest">
                  {book.title}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  Multiple requests detected
                </p>
              </div>

              {startingBookId === book.id ? (
                <div className="flex items-center justify-center w-24 h-12 bg-orange-600/20 text-orange-400 border border-orange-500/50 rounded-full font-black text-xl">
                  {countdown}s
                </div>
              ) : (
                <button
                  onClick={() => handleStartAuction(book.id)}
                  disabled={startingBookId !== null}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all"
                >
                  Start
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => router.replace("/dashboard")}
          disabled={startingBookId !== null}
          className="w-full mt-6 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-30"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
