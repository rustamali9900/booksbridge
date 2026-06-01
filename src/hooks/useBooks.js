import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
          id, title, author, price, status, image_url, copy_type, owner_id,
          profiles ( full_name, avatar_url )
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
          "id, title, author, description, image_url, copy_type, genre_tags, owner_id",
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
          "id, title, author, description, image_url, copy_type, owner_id",
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
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("auction_books_status")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "books" },
        (payload) => {
          const status = payload.new.auction_status;
          if (status === "sold" || status === "in_auction") {
            queryClient.invalidateQueries({ queryKey: ["auction_books"] });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["auction_books"],
    staleTime: 0,
    refetchOnMount: "always",
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
          auction_end_time,
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
