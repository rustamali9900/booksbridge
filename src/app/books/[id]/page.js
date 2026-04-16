import { createServerSupabase } from "@/lib/supabase-server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function BookDetailsPage({ params }) {
  const { id } = await params;

  const supabase = await createServerSupabase();

  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!book || error) {
    console.error("Fetch Error:", error);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-2 lg:p-4 font-display">
      <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-xl flex flex-col lg:flex-row border border-white/10 bg-black relative">
        <div className="w-full lg:w-1/2 bg-black flex items-center justify-center relative overflow-hidden min-h-[300px] lg:min-h-[420px]">
          <div className="absolute -inset-20 bg-orange-500/5 blur-3xl rounded-full" />

          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-6">
            <Image
              src={
                book.image_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}`
              }
              alt={book.title}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 flex flex-col bg-black relative min-h-[300px] lg:min-h-[420px]">
          {/* Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {/* Badge */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[9px] font-bold uppercase tracking-widest border border-orange-500/20">
                {book.copy_type || "Standard Copy"}
              </span>
            </div>

            {/* Title + Price */}
            <div>
              <h1 className="text-xl lg:text-2xl font-bold leading-tight">
                {book.title}
              </h1>

              <div className="mt-2">
                <span className="text-lg font-bold text-white">
                  Rs {book.price}
                </span>
              </div>

              <p className="text-slate-400 mt-1 text-sm">{book.author}</p>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Description */}
            <div className="text-slate-400 text-xs leading-relaxed">
              <p>{book.description}</p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-[9px] text-slate-500 uppercase mb-1">
                  Status
                </p>
                <p className="text-white text-xs font-medium">
                  {book.status || "available"}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-[9px] text-slate-500 uppercase mb-1">Type</p>
                <p className="text-white text-xs font-medium">
                  {book.type || "sell"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 md:p-5 bg-black/90 border-t border-white/10">
            <button className="w-full h-10 rounded-lg bg-gradient-to-r from-[#dc2505] to-[#f6c438] text-black font-bold text-[10px] uppercase tracking-widest hover:scale-[1.01] transition">
              Request to Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
