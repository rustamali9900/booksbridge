"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserBooks } from "@/hooks/useUserBooks";
import { useExchangeBook } from "@/hooks/useExchangeBook";

export default function ExchangeButton({ bookId, ownerId, currentUserId }) {
  const router = useRouter();

  const { currentUserId: userId } = useCurrentUser();
  const { data: books = [] } = useUserBooks(userId);
  const exchangeMutation = useExchangeBook();

  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const isOwner = ownerId === currentUserId;

  function handleExchange() {
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
        Request Exchange
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-[400px] p-6 shadow-2xl">
            <h2 className="text-white font-bold text-lg mb-4">
              Select a book to exchange
            </h2>

            <div className="max-h-[250px] overflow-y-auto flex flex-col gap-2">
              {books.length === 0 ? (
                <p className="text-white/50 text-sm">You don't own any books</p>
              ) : (
                books.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBook(b.id)}
                    className={`p-3 rounded-lg border text-left transition ${
                      selectedBook === b.id
                        ? "border-[#FF4B2B] bg-white/10"
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <p className="text-white font-semibold">{b.title}</p>
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setOpen(false);
                  setSelectedBook(null);
                }}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>

              <button
                disabled={!selectedBook || exchangeMutation.isPending}
                onClick={() => handleExchange()}
                className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#FF4B2B] to-[#FDC830] text-black font-bold disabled:opacity-50"
              >
                {exchangeMutation.isPending ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
