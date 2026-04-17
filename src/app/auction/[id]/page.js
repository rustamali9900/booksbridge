import { createServerSupabase } from "@/lib/supabase-server";
import AuctionClientRoom from "./AuctionClientRoom";

export default async function AuctionRoomPage({ params }) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AuctionClientRoom bookId={id} userId={user?.id} />;
}
