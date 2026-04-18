import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req) {
  console.log("WEBHOOK CALLED", new Date().toISOString());

  try {
    const { bookId } = await req.json();

    const supabase = await createServerSupabase();

    const { data: book, error } = await supabase
      .from("books")
      .select("auction_end_time, auction_status")
      .eq("id", bookId)
      .single();

    if (error || !book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const isExpired = new Date(book.auction_end_time).getTime() <= Date.now();

    if (!isExpired) {
      console.log("Skipping — not expired yet");
      return NextResponse.json({ skipped: true });
    }

    const { error: rpcError } = await supabase.rpc("resolve_auction", {
      p_book_id: bookId,
    });

    if (rpcError) {
      console.error(rpcError);
      return NextResponse.json({ error: "RPC failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
