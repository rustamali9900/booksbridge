import { NextResponse } from "next/server";
import { Client } from "@upstash/qstash";
import { createServerSupabase } from "@/lib/supabase-server";

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN,
});

export async function POST(req) {
  try {
    const { bookId } = await req.json();

    if (!bookId) {
      return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: activeAuction, error: activeAuctionError } = await supabase
      .from("books")
      .select("id")
      .eq("owner_id", user.id)
      .eq("auction_status", "in_auction")
      .maybeSingle();

    if (activeAuctionError) {
      throw activeAuctionError;
    }

    if (activeAuction) {
      return NextResponse.json(
        { error: "You already have an active auction." },
        { status: 400 },
      );
    }

    const auctionStartTime = new Date().toISOString();
    const auctionEndTime = new Date(Date.now() + 60 * 1000).toISOString();

    const { data: updatedBook, error: updateError } = await supabase
      .from("books")
      .update({
        auction_status: "in_auction",
        auction_start_time: auctionStartTime,
        auction_end_time: auctionEndTime,
      })
      .eq("id", bookId)
      .eq("owner_id", user.id)
      .select("id")
      .single();

    if (updateError) {
      throw updateError;
    }

    if (!updatedBook) {
      return NextResponse.json(
        { error: "Book not found or not owned by user." },
        { status: 404 },
      );
    }

    await qstashClient.publishJSON({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auction/webhook`,
      body: {
        bookId,
        action: "AUCTION_ENDED",
      },
      delay: "60s",
    });

    return NextResponse.json({
      success: true,
      bookId,
      auction_status: "in_auction",
      auction_start_time: auctionStartTime,
      auction_end_time: auctionEndTime,
    });
  } catch (error) {
    console.error("Auction start error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
