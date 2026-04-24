"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useLogout } from "@/hooks/useLogout";
import { useDeleteBook } from "@/hooks/useDeleteBook";
import { useUserBooks } from "@/hooks/useAllUserBooks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUploadAvatar } from "@/hooks/useUploadAvatar";
import ConfirmModal from "@/components/layout/ConfirmModal";

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const { currentUserId, currentUser, isLoading, error } = useCurrentUser();

  const { data: userBooks = [] } = useUserBooks(currentUserId);

  const uploadAvatarMutation = useUploadAvatar();
  const logoutMutation = useLogout();
  const deleteBookMutation = useDeleteBook();

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !currentUserId) return;

    uploadAvatarMutation.mutate({
      file,
      userId: currentUserId,
    });
  };

  const handleDelete = () => {
    if (!selectedBook) return;
    deleteBookMutation.mutate(selectedBook);
    setSelectedBook(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white">
        Loading profile...
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-red-400">
        Failed to load profile.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-[#1a1a1a] sm:h-28 sm:w-28">
                  {currentUser.avatar_url ? (
                    <Image
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-5xl text-slate-500">
                      account_circle
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-1 text-[10px] font-medium text-slate-300 transition hover:border-[#fa4d2e]/40 hover:text-white"
                >
                  {uploadAvatarMutation.isPending ? "Uploading" : "Upload"}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-white sm:text-2xl">
                    {currentUser.full_name}
                  </h1>

                  <span className="rounded-full border border-[#fa4d2e]/20 bg-[#fa4d2e]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fa4d2e]">
                    Pro Seller
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <button onClick={() => logoutMutation.mutate()}>
              <span className=" cursor-pointer material-symbols-outlined text-white text-2xl">
                logout
              </span>
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-2 text-center">
            <span className="material-symbols-outlined text-base text-slate-500">
              shopping_bag
            </span>
            <p className="mt-1 text-lg font-semibold text-white">
              {currentUser.items_bought_count ?? 0}
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-slate-500">
              Bought
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-2 text-center">
            <span className="material-symbols-outlined text-base text-slate-500">
              menu_book
            </span>
            <p className="mt-1 text-lg font-semibold text-white">
              {currentUser.items_lent_count ?? 0}
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-slate-500">
              Lent
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-2 text-center">
            <span className="material-symbols-outlined text-base text-slate-500">
              swap_horiz
            </span>
            <p className="mt-1 text-lg font-semibold text-white">
              {currentUser.items_exchanged_count ?? 0}
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-slate-500">
              Exchanged
            </p>
          </div>

          <div className="rounded-xl border border-[#fa4d2e]/20 bg-[#0d0d0d] p-2 text-center">
            <span className="material-symbols-outlined text-base text-[#fa4d2e]">
              library_books
            </span>
            <p className="mt-1 text-lg font-semibold text-[#fa4d2e]">
              {userBooks.length}
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-slate-500">
              Listings
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Active Listings
            </h2>

            <span className="text-xs text-slate-500">
              {userBooks.length} total
            </span>
          </div>

          {userBooks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
              No active listings yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {userBooks.map((book) => (
                <div
                  key={book.id}
                  className="relative overflow-hidden rounded-lg border border-white/10 bg-[#111111] transition hover:border-[#fa4d2e]/30"
                >
                  <button
                    onClick={() => setSelectedBook(book.id)}
                    className="absolute top-2 right-2 z-10 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-red-700 text-sm">
                      delete
                    </span>
                  </button>

                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1a1a1a]">
                    {book.image_url ? (
                      <Image
                        src={book.image_url}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#343434]">
                        <span className="material-symbols-outlined text-3xl text-slate-600">
                          menu_book
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 p-2.5">
                    <p className="line-clamp-1 text-xs font-semibold text-white">
                      {book.title}
                    </p>

                    <p className="line-clamp-1 text-[11px] text-slate-500">
                      {book.author}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="rounded-full border border-[#fa4d2e]/20 bg-[#fa4d2e]/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-[#fa4d2e]">
                        {book.copy_type || "standard"}
                      </span>

                      <span className="rounded-full border border-slate-700 bg-slate-800/60 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-slate-300">
                        {book.type === "sell"
                          ? "For Sale"
                          : book.type === "exchange"
                            ? "Exchange"
                            : book.type === "mystery"
                              ? "Mystery"
                              : book.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <ConfirmModal
        open={!!selectedBook}
        onCancel={() => setSelectedBook(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
