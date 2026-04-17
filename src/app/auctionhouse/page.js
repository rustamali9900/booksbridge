"use client";

import { useRouter } from "next/navigation";
import { useAuctionBooks } from "@/hooks/useAuctionBooks";
import Navbar from "@/components/layout/Navbar";

export default function AuctionHousePage() {
  const { data: books, isLoading, error } = useAuctionBooks();
  const router = useRouter();

  const featuredBook =
    books?.find((b) => b.auction_status === "in_auction") || books?.[0];
  const gridBooks = books?.filter((b) => b.id !== featuredBook?.id) || [];

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-display text-slate-100 selection:bg-[#fa4d2e]/30 bg-black">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-6 lg:px-10">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#fa4d2e]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center">
            Failed to load auction house. Please try again later.
          </div>
        ) : !books || books.length === 0 ? (
          <div className="bg-white/5 border border-white/10 p-8 rounded-xl text-center text-sm text-white/50">
            No active or past auctions available.
          </div>
        ) : (
          <>
            {featuredBook && (
              <section className="mb-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
                  <div className="space-y-1.5">
                    <span className="text-[#fa4d2e] font-semibold tracking-widest text-[10px] uppercase">
                      Premium Collection
                    </span>
                    <h2 className="font-header text-2xl md:text-3xl font-extrabold text-white">
                      Marketplace Auction House
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xl font-light">
                      Experience the world&apos;s most exclusive first editions
                      and rare manuscripts, live for bidding now.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                    <span className="material-symbols-outlined text-green-400 text-[16px]">
                      online_prediction
                    </span>
                    <span className="text-xs font-medium text-slate-200">
                      Live Sync Active
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 relative overflow-hidden rounded-xl p-1 group">
                  <div className="flex flex-col lg:flex-row gap-6 p-5 lg:p-8 relative z-10">
                    <div className="w-full lg:w-1/4 aspect-[3/4] rounded-lg overflow-hidden shadow-xl shadow-[#fa4d2e]/20 relative">
                      <img
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        src={featuredBook.image_url}
                        alt={featuredBook.title}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          {featuredBook.auction_status === "in_auction" ? (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fa4d2e]/20 border border-[#fa4d2e]/30 text-[#fa4d2e] text-[10px] font-bold uppercase tracking-wider">
                              <span className="material-symbols-outlined text-[14px] animate-pulse">
                                local_fire_department
                              </span>
                              Live Now
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                              Auction Ended
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-header text-xl md:text-2xl text-white tracking-tight">
                            {featuredBook.title}
                          </h3>
                          <p className="text-slate-400 text-sm italic">
                            {featuredBook.author || "Unknown Author"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 py-3 border-y border-white/5">
                          <div>
                            <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                              {featuredBook.auction_status === "sold"
                                ? "Winning Bid"
                                : "Current Bid"}
                            </p>
                            <p className="text-2xl font-bold text-white">
                              Rs {featuredBook.price.toLocaleString()}
                            </p>
                          </div>

                          {featuredBook.auction_status === "in_auction" && (
                            <div>
                              <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                                Status
                              </p>
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[#fa4d2e] text-xl animate-pulse">
                                  timer
                                </span>
                                <p className="text-lg font-black text-[#fa4d2e] font-display tracking-tighter uppercase">
                                  Bidding Open
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {featuredBook.auction_status === "in_auction" && (
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() =>
                              router.push(`/auction/${featuredBook.id}`)
                            }
                            className="bg-gradient-to-br from-[#FF4B2B] to-[#FDC830] px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg shadow-black/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                          >
                            Enter Auction Room
                            <span className="material-symbols-outlined text-[18px]">
                              trending_up
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Grid Section */}
            {gridBooks.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-header text-xl text-white">
                    More Auctions
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gridBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-[#fa4d2e]/30 transition-all duration-300 rounded-xl overflow-hidden flex flex-col group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          src={book.image_url}
                          alt={book.title}
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          {book.auction_status === "in_auction" ? (
                            <span className="bg-[#fa4d2e] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                              Live
                            </span>
                          ) : (
                            <span className="bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                              Ended / Sold
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <h4 className="font-bold text-base text-white mb-1">
                          {book.title}
                        </h4>

                        <p className="text-slate-400 text-xs mb-3">
                          {book.author || "Unknown Author"}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                          <p className="text-lg font-bold text-white">
                            Rs {book.price.toLocaleString()}
                          </p>

                          {book.auction_status === "in_auction" ? (
                            <button
                              onClick={() => router.push(`/auction/${book.id}`)}
                              className="bg-gradient-to-br from-[#FF4B2B] to-[#FDC830] px-3 py-1.5 text-[10px] font-bold text-white rounded"
                            >
                              Join Room
                            </button>
                          ) : (
                            <button className="bg-white/10 px-3 py-1.5 text-[10px] rounded">
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
