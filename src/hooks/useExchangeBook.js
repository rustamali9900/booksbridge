"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const exchangeBooks = async ({
  requestedBookId,
  selectedBookId,
  ownerId,
  currentUserId,
}) => {
  // Only fetch the fields we need to validate ownership
  const [{ data: requestedBook }, { data: selectedBook }] = await Promise.all([
    supabase.from("books").select("id, owner_id").eq("id", requestedBookId).single(),
    supabase.from("books").select("id, owner_id").eq("id", selectedBookId).single(),
  ]);

  if (!requestedBook || !selectedBook) throw new Error("Books not found");
  if (selectedBook.owner_id !== currentUserId) throw new Error("You do not own this book");

  // Swap ownership
  const [{ error: err1 }, { error: err2 }] = await Promise.all([
    supabase.from("books").update({ owner_id: currentUserId }).eq("id", requestedBookId),
    supabase.from("books").update({ owner_id: ownerId }).eq("id", selectedBookId),
  ]);

  if (err1) throw err1;
  if (err2) throw err2;

  const { error: deleteError } = await supabase
    .from("requests")
    .delete()
    .or(
      `book_id.eq.${requestedBookId},book_id.eq.${selectedBookId},requester_id.eq.${currentUserId}`,
    );

  if (deleteError) throw deleteError;

  // Atomically increment items_exchanged_count for both users via RPC
  const { error: statsError } = await supabase.rpc("record_book_exchange", {
    p_user1_id: currentUserId,
    p_user2_id: ownerId,
  });

  if (statsError) throw new Error(statsError.message);

  return true;
};

export function useExchangeBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exchangeBooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["user-books"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["all-books"] });
      // Refresh both users' exchanged counts on the profile page
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}
