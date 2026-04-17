import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAuctionBooks() {
  return useQuery({
    queryKey: ["auction_books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(
          `
          id,
          title,
          author,
          price,
          image_url,
          auction_status,
          auction_start_time,
          created_at
        `,
        )
        .in("auction_status", ["in_auction", "sold"])
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
