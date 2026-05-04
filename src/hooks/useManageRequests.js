import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const acceptRequest = async ({ bookId, requesterId }) => {
  // Fetch the book's current owner (seller) before transferring ownership.
  // We need this id to increment their lent count atomically.
  const { data: book, error: fetchError } = await supabase
    .from("books")
    .select("owner_id")
    .eq("id", bookId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const sellerId = book.owner_id;

  const { error: bookError } = await supabase
    .from("books")
    .update({ owner_id: requesterId, status: "available" })
    .eq("id", bookId);

  if (bookError) throw new Error(bookError.message);

  const { error: deleteError } = await supabase
    .from("requests")
    .delete()
    .eq("book_id", bookId);

  if (deleteError) throw new Error(deleteError.message);

  // Atomically increment items_lent_count for seller and items_bought_count
  // for buyer via a single Postgres RPC (avoids read-modify-write race).
  const { error: statsError } = await supabase.rpc("record_book_sale", {
    p_seller_id: sellerId,
    p_buyer_id: requesterId,
  });

  if (statsError) throw new Error(statsError.message);

  return { bookId };
};

const rejectRequest = async ({ requestId }) => {
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);

  if (error) throw new Error(error.message);

  return true;
};

export const useAcceptRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptRequest,
    onSuccess: ({ bookId }) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["books", bookId] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["all-books"] });
      // Refresh the seller's profile stats displayed on the profile page
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.removeQueries({ queryKey: ["request-status", bookId] });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};
