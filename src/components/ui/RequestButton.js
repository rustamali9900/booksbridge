"use client";

import { useRequestStatus, useCreateRequest } from "@/hooks/useRequestBook";

import { useRouter } from "next/navigation";

export default function RequestButton({ bookId, ownerId, currentUserId }) {
  const router = useRouter();

  const { data: alreadyRequested, isLoading } = useRequestStatus(
    bookId,
    currentUserId,
  );

  const { mutate, isPending } = useCreateRequest();

  const handleRequest = () => {
    if (!currentUserId) {
      return alert("You must be logged in.");
    }

    if (alreadyRequested) return;

    mutate({
      bookId,
      ownerId,
      userId: currentUserId,
    });
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="w-full bg-zinc-800 text-zinc-500 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest"
      >
        Loading...
      </button>
    );
  }

  if (alreadyRequested) {
    return (
      <button
        disabled
        className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest"
      >
        Request Sent
      </button>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={isPending}
      className="w-full bg-gradient-to-r from-[#dc2505] to-[#f6c438] text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? "Sending..." : "Request to Buy"}
    </button>
  );
}
