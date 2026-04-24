import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function useLiveAuction(bookId, userId) {
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState(null);

  const hasResolvedRef = useRef(false);

  const { data: book } = useQuery({
    queryKey: ["auction_book", bookId],
    enabled: !!bookId,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", bookId)
        .single();

      if (error) throw error;

      return data;
    },
  });

  const { data: bids = [] } = useQuery({
    queryKey: ["auction_bids", bookId],
    enabled: !!bookId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bids")
        .select("*, profiles(full_name, avatar_url)")
        .eq("book_id", bookId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const resolveAuction = useCallback(async () => {
    if (!bookId || hasResolvedRef.current) return;

    hasResolvedRef.current = true;

    try {
      const { error } = await supabase.rpc("resolve_auction", {
        p_book_id: bookId,
      });

      if (error) {
        console.error("resolve_auction failed", error);
        hasResolvedRef.current = false;
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["auction_book", bookId],
          refetchType: "all",
        }),

        queryClient.invalidateQueries({
          queryKey: ["auction_bids", bookId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["requests", bookId],
        }),
      ]);
    } catch (err) {
      console.error(err);
      hasResolvedRef.current = false;
    }
  }, [bookId, queryClient]);

  const placeBidMutation = useMutation({
    mutationFn: async (bidAmount) => {
      const currentBook = queryClient.getQueryData(["auction_book", bookId]);

      if (
        !currentBook ||
        currentBook.auction_status !== "in_auction" ||
        timeLeft === 0
      ) {
        throw new Error("Auction has already ended.");
      }

      const { error } = await supabase.rpc("place_auction_bid", {
        p_book_id: bookId,
        p_bid_amount: bidAmount,
        p_bidder_id: userId,
      });

      if (error) throw error;
    },

    onMutate: async (bidAmount) => {
      const currentBook = queryClient.getQueryData(["auction_book", bookId]);

      if (
        !currentBook ||
        currentBook.auction_status !== "in_auction" ||
        timeLeft === 0
      ) {
        throw new Error("Auction has already ended.");
      }

      await queryClient.cancelQueries({
        queryKey: ["auction_book", bookId],
      });

      await queryClient.cancelQueries({
        queryKey: ["auction_bids", bookId],
      });

      const previousBook = queryClient.getQueryData(["auction_book", bookId]);
      const previousBids = queryClient.getQueryData(["auction_bids", bookId]);

      const optimisticBid = {
        id: `optimistic-${Date.now()}`,
        book_id: bookId,
        bidder_id: userId,
        amount: bidAmount,
        created_at: new Date().toISOString(),
        profiles: null,
      };

      queryClient.setQueryData(["auction_bids", bookId], (old = []) => [
        optimisticBid,
        ...old,
      ]);

      queryClient.setQueryData(["auction_book", bookId], (old) =>
        old
          ? {
              ...old,
              price: bidAmount,
            }
          : old,
      );

      return { previousBook, previousBids };
    },

    onError: (_err, _bidAmount, context) => {
      if (context?.previousBook) {
        queryClient.setQueryData(
          ["auction_book", bookId],
          context.previousBook,
        );
      }

      if (context?.previousBids) {
        queryClient.setQueryData(
          ["auction_bids", bookId],
          context.previousBids,
        );
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auction_book", bookId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["auction_bids", bookId],
      });
    },
  });

  useEffect(() => {
    if (!bookId) return;

    const channel = supabase
      .channel(`auction_${bookId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "books",
          filter: `id=eq.${bookId}`,
        },
        (payload) => {
          const updatedBook = payload.new;

          queryClient.setQueryData(["auction_book", bookId], updatedBook);

          if (updatedBook.auction_status === "sold") {
            hasResolvedRef.current = true;
            setTimeLeft(0);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `book_id=eq.${bookId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["auction_bids", bookId],
          });

          queryClient.invalidateQueries({
            queryKey: ["auction_book", bookId],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookId, queryClient]);

  useEffect(() => {
    if (!book?.auction_end_time) return;

    if (book.auction_status === "sold") {
      setTimeLeft(0);
      hasResolvedRef.current = true;
      return;
    }

    if (book.auction_status !== "in_auction") {
      setTimeLeft(null);
      return;
    }

    hasResolvedRef.current = false;

    const endTime = new Date(book.auction_end_time).getTime();

    if (Number.isNaN(endTime)) return;

    const tick = async () => {
      const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      setTimeLeft(diff);

      if (diff <= 0 && !hasResolvedRef.current) {
        await resolveAuction();
      }
    };

    tick();

    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [book?.auction_end_time, book?.auction_status, resolveAuction]);

  const isOwner = book?.owner_id === userId;

  return {
    book,
    bids,
    timeLeft,
    isOwner,
    placeBid: placeBidMutation.mutate,
    isBidding: placeBidMutation.isPending,
  };
}
