export const dynamic = "force-dynamic";

import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RequestActionModal from "@/components/ui/RequestActionModal";
import AuctionModal from "@/components/ui/AuctionModal";

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: requests, error } = await supabase
    .from("requests")
    .select(
      `
      id,
      status,
      created_at,
      book:books ( id, title, price, image_url, status ),
      requester:profiles!requester_id ( id, full_name, email, avatar_url )
    `,
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.error(error);

  const selectedRequest = params?.request
    ? requests?.find((r) => r.id === params.request)
    : null;

  const showAuctionModal = params?.auction === "true";

  const activeAuctionBookId = requests?.find(
    (req) => req.book.status === "in_auction",
  )?.book?.id;

  const groupedRequests = requests?.reduce((acc, req) => {
    if (!acc[req.book.id]) {
      acc[req.book.id] = { book: req.book, count: 0 };
    }
    acc[req.book.id].count += 1;
    return acc;
  }, {});

  const auctionableBooks = Object.values(groupedRequests || {})
    .filter((item) => item.count > 1 && item.book.status !== "in_auction")
    .map((item) => item.book);

  return (
    <div className="min-h-screen bg-background-dark text-white p-10 max-w-5xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Seller Dashboard
        </h1>

        {activeAuctionBookId ? (
          <Link
            href={`/auction/${activeAuctionBookId}`}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-all text-sm animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          >
            Enter Active Auction
          </Link>
        ) : (
          auctionableBooks.length > 0 && (
            <Link
              href="/dashboard?auction=true"
              className="rounded-full bg-gradient-to-r from-[#dc2505] to-[#f6c438] ml-10 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:brightness-110"
            >
              Start an Auction
            </Link>
          )
        )}
      </div>

      <h2 className="text-xl font-semibold mb-6 border-b border-white/10 pb-4">
        Incoming Requests
      </h2>

      {!requests || requests.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/50">
          <p className="text-lg">No Requests Yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Link
              href={`/dashboard?request=${request.id}`}
              key={request.id}
              className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-24 shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={request.book.image_url}
                    alt={request.book.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-widest mb-1">
                    Requested: {request.book.title}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="relative size-8 rounded-full overflow-hidden bg-zinc-900">
                      <Image
                        src={
                          request.requester.avatar_url ||
                          `https://ui-avatars.com/api/?name=${request.requester.full_name}&background=111827&color=ffffff`
                        }
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        {request.requester.full_name}
                      </p>
                      <p className="text-xs text-white/50">
                        {request.requester.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-bold">
                    ${request.book.price}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-sm uppercase tracking-widest font-bold ${
                      request.status === "pending"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {selectedRequest && <RequestActionModal request={selectedRequest} />}

      {showAuctionModal && !activeAuctionBookId && (
        <AuctionModal books={auctionableBooks} />
      )}
    </div>
  );
}
