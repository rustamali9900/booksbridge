"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useState, useRef, useEffect } from "react";
import { useLiveAuction } from "@/hooks/useLiveAuction";

function timeAgo(dateString) {
  if (!dateString) return "Just now";
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 0) return "Just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
}

function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return "--:--";
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export default function AuctionClientRoom({ bookId, userId }) {
  const router = useRouter();

  const { book, bids, timeLeft, isOwner, placeBid, isBidding } = useLiveAuction(
    bookId,
    userId,
  );

  const [customBid, setCustomBid] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const totalDurationRef = useRef(null);

  useEffect(() => {
    if (!book) return;

    if (
      book.auction_status === "in_auction" &&
      book.auction_end_time &&
      totalDurationRef.current === null
    ) {
      const endTime = new Date(book.auction_end_time).getTime();
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      totalDurationRef.current = remaining || 60;
    }

    const isEnded = book.auction_status === "sold" || timeLeft === 0;
    if (isEnded) {
      router.push(`/auction/${book.id}`);
    }

    if (!isEnded) return;

    const timer = setTimeout(() => {
      router.replace("/auctionhouse?alert=auction_ended");
    }, 800);

    return () => clearTimeout(timer);
  }, [book, router]);

  if (!book) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-display">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-[#FDC830] animate-pulse" />
        <span className="relative flex h-6 w-6 mb-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4B2B] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-6 w-6 bg-[#FF4B2B]"></span>
        </span>
        <h2 className="text-xl font-bold tracking-widest uppercase animate-pulse">
          Connecting to Live Room...
        </h2>
      </div>
    );
  }

  const isAuctionStarted = book.auction_status === "in_auction";
  const isAuctionEnded = book.auction_status === "sold" || timeLeft === 0;

  const disableBidding =
    isOwner || isBidding || !isAuctionStarted || isAuctionEnded;

  const displayTime = isAuctionEnded
    ? "00:00"
    : timeLeft === null
      ? "--:--"
      : formatTime(timeLeft);

  const timerPercent = isAuctionEnded
    ? 0
    : timeLeft === null || totalDurationRef.current === null
      ? 100
      : Math.max(0, Math.min(100, (timeLeft / totalDurationRef.current) * 100));

  const handleStartAuction = async () => {
    setIsStarting(true);
    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      if (!res.ok) throw new Error("Failed to start the auction.");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsStarting(false);
    }
  };

  const handleQuickBid = (amount) => {
    if (disableBidding) return;
    placeBid(book.price + amount);
  };

  const handleCustomBid = () => {
    if (disableBidding) return;
    const bidAmount = Number(customBid.replace(/\D/g, ""));
    if (bidAmount > book.price) {
      placeBid(bidAmount);
      setCustomBid("");
    } else {
      alert(
        `Bid must be strictly higher than Rs ${book.price.toLocaleString()}`,
      );
    }
  };

  const glassCard =
    "bg-[#191919]/60 backdrop-blur-xl border border-white/10 shadow-2xl";
  const primaryGradient = "bg-gradient-to-br from-[#FF4B2B] to-[#FDC830]";
  const customScrollbar =
    "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full";

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-black overflow-x-hidden font-display antialiased selection:bg-[#FF4B2B]/30">
      <div className="flex h-full grow flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-xl px-4 md:px-10 py-5 sticky top-0 z-50">
          <Navbar />
        </header>

        <div className="px-4 md:px-10 pt-6 flex items-center justify-between max-w-[1440px] mx-auto w-full">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-sm font-bold leading-tight tracking-tight uppercase">
              The Live Room
            </h2>
            <div className="h-4 w-px bg-white/10"></div>
            {isAuctionStarted && !isAuctionEnded ? (
              <span className="flex items-center gap-1.5 bg-red-600/20 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase">
                <span className="size-1.5 bg-red-500 rounded-full animate-pulse"></span>
                LIVE
              </span>
            ) : isAuctionEnded ? (
              <span className="flex items-center gap-1.5 bg-gray-600/20 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase">
                ENDED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-orange-600/20 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase">
                WAITING TO START
              </span>
            )}
          </div>
        </div>

        <main className="px-4 md:px-10 py-6 flex flex-col lg:flex-row gap-10 max-w-[1440px] mx-auto w-full">
          <div className="flex-1 flex flex-col gap-8">
            <div
              className={`${glassCard} rounded-2xl p-6 md:p-10 flex flex-col items-center text-center relative overflow-hidden`}
            >
              <div
                className={`absolute inset-0 ${primaryGradient} opacity-10 blur-[100px] rounded-full pointer-events-none`}
              ></div>

              <div className="relative group w-48 h-72 md:w-64 md:h-[400px] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8 transform group-hover:scale-[1.02] transition-transform duration-700">
                <Image
                  alt={book.title}
                  className="object-cover rounded-lg"
                  src={book.image_url}
                  fill
                  sizes="(max-width: 768px) 192px, 256px"
                  priority
                />
              </div>

              <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight mb-3">
                {book.title}
              </h1>
              <p className="text-white/60 text-lg font-medium mb-6">
                {book.author
                  ? `Written by ${book.author}`
                  : "Rare Collection Edition"}
              </p>
            </div>

            <div
              className={`${glassCard} rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10`}
            >
              <div className="flex flex-col gap-2">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                  Current Bid
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-white text-4xl md:text-6xl font-black tracking-tight">
                    Rs {book.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                  Ending In
                </p>
                <div
                  className={`text-4xl md:text-6xl font-black tabular-nums tracking-tight ${
                    isAuctionEnded
                      ? "text-gray-500"
                      : "text-red-500 animate-pulse"
                  }`}
                >
                  {displayTime}
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-5 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                      isAuctionEnded
                        ? "bg-gray-500"
                        : "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    }`}
                    style={{ width: `${timerPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[400px] flex flex-col gap-8">
            <div className={`${glassCard} rounded-2xl flex flex-col h-[480px]`}>
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-white font-bold flex items-center gap-2.5">
                  {!isAuctionEnded && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                  Activity Feed
                </h3>
              </div>

              <div
                className={`flex-1 overflow-y-auto p-5 flex flex-col gap-4 ${customScrollbar}`}
              >
                {bids.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-white/30 text-sm font-medium italic">
                    {isAuctionStarted
                      ? "Waiting for first bid..."
                      : "Auction hasn't started yet."}
                  </div>
                ) : (
                  bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border ${
                        index === 0
                          ? "bg-white/[0.04] border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                          : "opacity-60 border-transparent"
                      }`}
                    >
                      <img
                        alt="Bidder avatar"
                        className="size-10 rounded-full border border-white/10 bg-black"
                        src={
                          bid.profiles?.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${bid.bidder_id}`
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-bold">
                            {bid.profiles?.full_name || "Anonymous User"}
                          </span>
                          {index === 0 && !isAuctionEnded && (
                            <span
                              className={`${primaryGradient} text-black text-[9px] font-black px-1.5 py-0.5 rounded italic`}
                            >
                              LEADER
                            </span>
                          )}
                          {index === 0 && isAuctionEnded && (
                            <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded italic">
                              WINNER
                            </span>
                          )}
                        </div>
                        <p className="text-white/70 text-xs">
                          Placed a bid of{" "}
                          <span className="text-white font-bold">
                            Rs {bid.amount.toLocaleString()}
                          </span>
                        </p>
                        <p className="text-white/30 text-[10px] mt-1.5 font-medium uppercase">
                          {timeAgo(bid.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div
              className={`${glassCard} rounded-2xl p-8 flex flex-col gap-6 ring-1 ring-white/10 relative overflow-hidden`}
            >
              {isOwner && !isAuctionStarted && !isAuctionEnded && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center border border-[#FF4B2B]/30 rounded-2xl">
                  <span className="material-symbols-outlined text-5xl text-[#FF4B2B] mb-4 animate-pulse">
                    rocket_launch
                  </span>
                  <h3 className="text-white font-black tracking-widest uppercase text-lg mb-2">
                    Ready to Start?
                  </h3>
                  <p className="text-white/60 text-xs mb-6">
                    Initiate the countdown to begin.
                  </p>
                  <button
                    onClick={handleStartAuction}
                    disabled={isStarting}
                    className={`${primaryGradient} text-black font-black px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(255,75,43,0.4)] hover:scale-105 transition-transform disabled:opacity-50`}
                  >
                    {isStarting ? "STARTING..." : "START AUCTION"}
                  </button>
                </div>
              )}

              {!isOwner && !isAuctionStarted && !isAuctionEnded && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center border border-white/5 rounded-2xl">
                  <span className="material-symbols-outlined text-4xl text-white/50 mb-2">
                    hourglass_empty
                  </span>
                  <p className="text-white font-black tracking-widest uppercase text-sm mb-1">
                    Waiting for Owner
                  </p>
                  <p className="text-white/50 text-xs">
                    The auction will begin shortly.
                  </p>
                </div>
              )}

              {isOwner && isAuctionStarted && !isAuctionEnded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-6 text-center border border-white/5 rounded-2xl">
                  <span className="material-symbols-outlined text-4xl text-[#FF4B2B] mb-2">
                    lock
                  </span>
                  <p className="text-white font-black tracking-widest uppercase text-sm mb-1">
                    Live Auction
                  </p>
                  <p className="text-white/50 text-xs">
                    You are the owner. Watching only.
                  </p>
                </div>
              )}

              {isAuctionEnded && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center border border-white/5 rounded-2xl">
                  <span className="material-symbols-outlined text-5xl text-emerald-500 mb-2">
                    gavel
                  </span>
                  <h3 className="text-white font-black tracking-widest uppercase text-xl mb-1">
                    Auction Closed
                  </h3>
                  <p className="text-white/50 text-xs">
                    No more bids can be placed.
                  </p>
                </div>
              )}

              <div
                className={`flex flex-col gap-4 ${disableBidding ? "opacity-30" : ""}`}
              >
                <label className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                  Quick Add
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleQuickBid(100)}
                    disabled={disableBidding}
                    className="flex-1 py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-[11px] font-bold transition-all disabled:opacity-50"
                  >
                    + Rs 100
                  </button>
                  <button
                    onClick={() => handleQuickBid(500)}
                    disabled={disableBidding}
                    className="flex-1 py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-[11px] font-bold transition-all disabled:opacity-50"
                  >
                    + Rs 500
                  </button>
                  <button
                    onClick={() => handleQuickBid(1000)}
                    disabled={disableBidding}
                    className="flex-1 py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-[11px] font-bold transition-all disabled:opacity-50"
                  >
                    + Rs 1k
                  </button>
                </div>
              </div>

              <div className={`relative ${disableBidding ? "opacity-30" : ""}`}>
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 font-black text-xl">
                  Rs
                </span>
                <input
                  className="w-full bg-black/40 border-2 border-white/10 rounded-xl pl-14 pr-5 py-4 text-2xl font-black text-white focus:border-[#FF4B2B] focus:ring-0 transition-all outline-none placeholder:text-white/20"
                  type="number"
                  placeholder={(book.price + 100).toString()}
                  value={customBid}
                  onChange={(e) => setCustomBid(e.target.value)}
                  disabled={disableBidding}
                />
              </div>

              <button
                onClick={handleCustomBid}
                disabled={disableBidding || !customBid}
                className={`w-full ${primaryGradient} hover:opacity-90 text-black py-4 rounded-xl font-black text-lg shadow-[0_10px_30px_rgba(255,75,43,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${disableBidding ? "opacity-30" : ""}`}
              >
                <span className="material-symbols-outlined font-black">
                  gavel
                </span>
                {isBidding ? "PLACING BID..." : "PLACE BID"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
