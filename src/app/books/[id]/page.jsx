import RequestButton from "@/components/ui/RequestButton";
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

  if (error || !book) {
    return notFound();
  }

  const isOwner = user?.id === book.owner_id;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="relative w-full h-[500px]">
          <Image
            src={book.image_url}
            alt={book.title}
            fill
            className="object-cover rounded-xl border border-white/10"
          />
        </div>

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
              <button
                disabled
                className="w-full bg-zinc-800 text-zinc-500 cursor-not-allowed px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest border border-white/5"
              >
                You own this book
              </button>
            ) : (
              <RequestButton
                bookId={book.id}
                ownerId={book.owner_id}
                currentUserId={user?.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
