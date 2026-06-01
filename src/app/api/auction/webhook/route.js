import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { supabaseAdmin } from "@/lib/supabase-admin";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  try {
    await receiver.verify({ signature, body, clockTolerance: 5 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookId, action } = JSON.parse(body);

    if (!bookId || action !== "AUCTION_ENDED") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { data: book, error } = await supabaseAdmin
      .from("books")
      .select("auction_end_time, auction_status")
      .eq("id", bookId)
      .single();

    if (error || !book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.auction_status === "sold") {
      return NextResponse.json({ skipped: true });
    }

    const isExpired =
      new Date(book.auction_end_time).getTime() <= Date.now();

    if (!isExpired) {
      return NextResponse.json({ skipped: true });
    }

    const { error: rpcError } = await supabaseAdmin.rpc("resolve_auction", {
      p_book_id: bookId,
    });

    if (rpcError) {
      return NextResponse.json({ error: "RPC failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
