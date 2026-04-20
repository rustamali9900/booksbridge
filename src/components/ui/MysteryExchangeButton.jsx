"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useExchangeBook } from "@/hooks/useExchangeBook";
import ExchangeModal from "@/components/layout/ExchangeModal";
import { useUserMysteryBooks } from "@/hooks/useUserMysteryBooks";

export default function MysteryExchangeButton({
  bookId,
  ownerId,
  currentUserId,
}) {
  const router = useRouter();

  const { currentUserId: userId } = useCurrentUser();
  const { data: books = [] } = useUserMysteryBooks(userId);

  const exchangeMutation = useExchangeBook();

  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const isOwner = ownerId === currentUserId;

  function handleConfirm() {
    exchangeMutation.mutate(
      {
        requestedBookId: bookId,
        selectedBookId: selectedBook,
        ownerId,
        currentUserId,
      },
      {
        onSuccess: () => {
          toast.success("Mystery exchange completed!");
          router.replace("/mystery");
        },
        onError: (err) => toast.error(err.message),
      },
    );

    setOpen(false);
    setSelectedBook(null);
  }

  if (isOwner) {
    return (
      <button className="mt-4 mx-2 w-[calc(100%-16px)] bg-gray-800 text-slate-400 font-bold py-3 rounded-lg text-[11px] uppercase tracking-[0.25em] cursor-not-allowed">
        You Own This
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 mx-2 w-[calc(100%-16px)] bg-gradient-to-r from-[#e42c0c] to-[#e4aa0a] cursor-pointer text-white py-3 rounded-lg text-[11px] uppercase tracking-[0.25em]"
      >
        Swap Instantly
      </button>

      <ExchangeModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedBook(null);
        }}
        books={books}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        onConfirm={handleConfirm}
        isPending={exchangeMutation.isPending}
        mode="mystery"
      />
    </>
  );
}
