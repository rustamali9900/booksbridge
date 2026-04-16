"use client";

import { useRouter } from "next/navigation";
import { useAcceptRequest, useRejectRequest } from "@/hooks/useManageRequests";
import Image from "next/image";
import { useTransition } from "react";

export default function RequestActionModal({ request }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { mutate: accept, isPending: isAccepting } = useAcceptRequest();
  const { mutate: reject, isPending: isRejecting } = useRejectRequest();

  if (!request) return null;

  const handleAccept = () => {
    accept(
      {
        bookId: request.book.id,
        requesterId: request.requester.id,
        requestId: request.id,
      },
      {
        onSuccess: () => {
          startTransition(() => {
            router.replace("/dashboard");
            router.refresh();
          });
        },
      },
    );
  };

  const handleReject = () => {
    reject(
      {
        requestId: request.id,
      },
      {
        onSuccess: () => {
          startTransition(() => {
            router.replace("/dashboard");
            router.refresh();
          });
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter text-white">
          Review Request
        </h3>

        <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
          <div className="relative w-16 h-24 rounded-md overflow-hidden shrink-0">
            <Image
              src={request.book.image_url}
              alt={request.book.title}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">
              {request.book.title}
            </p>
            <p className="text-sm font-semibold text-white">
              {request.requester.full_name}
            </p>
            <p className="text-xs text-white/50">{request.requester.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            disabled={isAccepting || isRejecting || isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-4 rounded-full font-bold uppercase tracking-widest transition-all"
          >
            {isAccepting || isPending ? "Processing..." : "Accept & Transfer"}
          </button>

          <button
            onClick={handleReject}
            disabled={isAccepting || isRejecting || isPending}
            className="w-full bg-red-900/30 border border-red-900/50 hover:bg-red-900/50 disabled:opacity-50 text-red-400 py-4 rounded-full font-bold uppercase tracking-widest transition-all"
          >
            {isRejecting ? "Rejecting..." : "Reject Request"}
          </button>

          <button
            onClick={() => router.replace("/dashboard")}
            className="mt-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
