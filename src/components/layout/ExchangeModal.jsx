"use client";

import { createPortal } from "react-dom";

export default function ExchangeModal({
  open,
  onClose,
  books = [],
  selectedBook,
  setSelectedBook,
  onConfirm,
  isPending,
  mode = "exchange",
}) {
  if (!open) return null;

  const title =
    mode === "mystery"
      ? "Select your mystery book"
      : "Select a book to exchange";

  const emptyText =
    mode === "mystery"
      ? "You don't own any mystery books"
      : "You don't own any books";

  const buttonText = isPending ? "Processing..." : "Confirm Swap";

  const accentClass = (mode = "from-purple-600 to-pink-500");

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl w-[420px] p-6 shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-4">{title}</h2>

        {/* BOOK LIST */}
        <div className="max-h-[260px] overflow-y-auto flex flex-col gap-2 pr-1">
          {books.length === 0 ? (
            <p className="text-white/50 text-sm">{emptyText}</p>
          ) : (
            books.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBook(b.id)}
                className={`p-3 rounded-lg border text-left transition ${
                  selectedBook === b.id
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                <p className="text-white font-semibold">{b.title}</p>
                <p className="text-xs text-white/50">{b.author}</p>
              </button>
            ))
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          >
            Cancel
          </button>

          <button
            disabled={!selectedBook || isPending}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg bg-gradient-to-br ${accentClass} text-white font-normal disabled:opacity-50`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
