import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const acceptRequest = async ({ bookId, requesterId }) => {
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

  const { error: statsError } = await supabase.rpc("record_book_sale", {
    p_seller_id: sellerId,
    p_buyer_id: requesterId,
  });

  if (statsError) console.error("record_book_sale RPC:", statsError.message);

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
