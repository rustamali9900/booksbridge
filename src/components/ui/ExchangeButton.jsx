"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUserBooks } from "@/hooks/useUserBooks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useExchangeBook } from "@/hooks/useExchangeBook";
import ExchangeModal from "@/components/layout/ExchangeModal";

export default function ExchangeButton({ bookId, ownerId, currentUserId }) {
  const router = useRouter();

  const { currentUserId: userId } = useCurrentUser();
  const { data: books = [] } = useUserBooks(userId);
  const exchangeMutation = useExchangeBook();

  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const isOwner = ownerId === currentUserId;

  function handleExchange() {
    if (!selectedBook) return;

    exchangeMutation.mutate(
      {
        requestedBookId: bookId,
        selectedBookId: selectedBook,
        ownerId,
        currentUserId,
      },
      {
        onSuccess: () => {
          toast.success("Exchange completed successfully!", {
            position: "top-center",
            autoClose: 2000,
          });

          router.replace("/exchange");
        },
        onError: (err) => {
          toast.error(err.message || "Exchange failed", {
            position: "top-center",
          });
        },
      },
    );

    setOpen(false);
    setSelectedBook(null);
  }

  if (isOwner) {
    return (
      <button className="w-full py-3 rounded-xl bg-gray-700 text-gray-300 font-bold cursor-not-allowed">
        You own the book
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl bg-gradient-to-br from-[#FF4B2B] to-[#FDC830] text-white font-normal shadow-lg hover:scale-[1.02] transition"
      >
        Exchange Book
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
        onConfirm={handleExchange}
        isPending={exchangeMutation.isPending}
        mode="exchange"
      />
    </>
  );
}
