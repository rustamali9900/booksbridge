import Image from "next/image";
import Link from "next/link";

export default function BookCard({ book }) {
  const status = book?.status?.toLowerCase();

  const statusStyles = {
    available: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    pending:
      "bg-red-950/70 text-red-200 border-red-900/70 shadow-[0_0_10px_rgba(220,38,38,0.15)]",
  };

  const statusLabel = {
    available: "AVAILABLE",
    pending: "PENDING",
  };

  if (!book || !book.id) return null;

  return (
    <Link href={`/books/${book.id}`} className="block h-full cursor-pointer">
      <div className="glass-card rounded-xl overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] overflow-hidden shrink-0">
          <Image
            src={
              book?.image_url ??
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                book?.title ?? "Book",
              )}&background=111827&color=ffffff&size=600`
            }
            alt={book?.title ?? "Book Cover"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />

          {(status === "available" || status === "pending") && (
            <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10">
              <span
                className={`text-[9px] font-bold tracking-[0.1em] ${statusStyles[status]}`}
              >
                {statusLabel[status]}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="flex-1 text-base font-bold leading-tight line-clamp-2 uppercase tracking-tight text-white">
              {book?.title ?? "Untitled Book"}
            </h3>

            <span className="text-base font-semibold text-white whitespace-nowrap">
              ${book?.price?.toLocaleString() ?? "0"}
            </span>
          </div>

          <p className="text-slate-500 text-xs mb-6 font-medium line-clamp-1">
            {book?.author ?? "Unknown Author"} •{" "}
            {book?.copy_type ?? "Standard Edition"}
          </p>

          {/* Seller */}
          <div className="flex items-center gap-3 mb-6 mt-auto">
            <div className="relative size-8 rounded-full overflow-hidden border border-white/10 bg-zinc-900 shrink-0">
              <Image
                src={
                  book?.profiles?.avatar_url ??
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    book?.profiles?.full_name ?? "Seller",
                  )}&background=111827&color=ffffff`
                }
                alt={book?.profiles?.full_name ?? "Seller"}
                fill
                sizes="32px"
                className="object-cover grayscale"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-200 truncate">
                {book?.profiles?.full_name ?? "Unknown Seller"}
              </p>

              <div className="flex items-center gap-1">
                <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">
                  Collector
                </span>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="w-full flex items-center justify-center bg-gradient-to-r from-[#dc2505] to-[#f6c438] text-white px-8 py-3 rounded-full text-xs md:text-sm font-bold tracking-[0.18em] hover:scale-[1.02] transition">
            Request to Buy
          </div>
        </div>
      </div>
    </Link>
  );
}
