"use client";

import { useRouter } from "next/navigation";
import { useAcceptRequest, useRejectRequest } from "@/hooks/useManageRequests";
import Image from "next/image";

export default function RequestActionModal({ request }) {
  const router = useRouter();
  const { mutate: accept, isPending: isAccepting } = useAcceptRequest();
  const { mutate: reject, isPending: isRejecting } = useRejectRequest();

  if (!request) return null;

  const closeModal = () => {
    router.push("/dashboard");
    router.refresh();
  };

  const handleAccept = () => {
    accept(
      {
        bookId: request.book.id,
        requesterId: request.requester.id,
      },
      {
        onSuccess: closeModal,
      },
    );
  };

  const handleReject = () => {
    reject(
      {
        requestId: request.id,
      },
      {
        onSuccess: closeModal,
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-6">
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
            <p className="text-sm font-semibold text-white mt-1">
              Requester: {request.requester.full_name}
            </p>
            <p className="text-xs text-white/50">{request.requester.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            disabled={isAccepting || isRejecting}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
          >
            {isAccepting ? "Transferring..." : "Accept & Transfer"}
          </button>

          <button
            onClick={handleReject}
            disabled={isAccepting || isRejecting}
            className="w-full bg-red-950/50 text-red-400 border border-red-900/50 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-red-950 transition-colors disabled:opacity-50"
          >
            {isRejecting ? "Rejecting..." : "Reject Request"}
          </button>

          <button
            onClick={closeModal}
            disabled={isAccepting || isRejecting}
            className="w-full mt-2 text-xs font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
