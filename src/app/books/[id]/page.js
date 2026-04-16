import { createServerSupabase } from "@/lib/supabase-server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function BookDetailsPage({ params }) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!book || error) {
    return notFound();
  }

  const isOwner = user?.id === book.owner_id;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="relative w-full h-[500px]">
          <Image
            src={book.image_url}
            alt={book.title}
            fill
            className="object-cover rounded-xl border border-white/10"
          />
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tighter">
              {book.title}
            </h1>
            <p className="text-white/50 text-lg">by {book.author}</p>
          </div>

          <p className="text-white/80 leading-relaxed">{book.description}</p>

          <div className="text-3xl font-bold text-orange-400">
            Rs {book.price.toLocaleString()}
          </div>

          <div className="pt-6">
            {isOwner ? (
              // Case: User is the Owner
              <button
                disabled
                className="w-full bg-zinc-800 text-zinc-500 cursor-not-allowed px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest border border-white/5"
              >
                You listed this book
              </button>
            ) : (
              // Case: User is a Buyer
              <button className="w-full bg-gradient-to-r from-[#dc2505] to-[#f6c438] text-black px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95">
                Request to Buy
              </button>
            )}

            {isOwner && (
              <p className="text-center text-xs text-zinc-500 mt-3 italic">
                You cannot purchase your own listing.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
