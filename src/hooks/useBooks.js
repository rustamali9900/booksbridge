import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useBooks() {
  const {
    data: books = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["books"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(
          `
          *,
          profiles (
            full_name,
            avatar_url
          )
        `,
        )
        .in("status", ["available", "pending"])
        .eq("type", "sell")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    books,
    isPending,
    error,
  };
}

export function useMysteryBooks() {
  const {
    data: books = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["mystery_books"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(
          `
          *,
          profiles (
            full_name,
            avatar_url
          )
        `,
        )
        .in("status", ["available", "pending"])
        .eq("type", "mystery")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    books,
    isPending,
    error,
  };
}

export function useExchangeBooks() {
  const {
    data: books = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["exchange_books"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(
          `
          *,
          profiles (
            full_name,
            avatar_url
          )
        `,
        )
        .in("status", ["available", "pending"])
        .eq("type", "exchange")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    books,
    isPending,
    error,
  };
}

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
          description,
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
