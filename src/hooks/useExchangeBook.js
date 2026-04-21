"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const exchangeBooks = async ({
  requestedBookId,
  selectedBookId,
  ownerId,
  currentUserId,
}) => {
  const { data: requestedBook } = await supabase
    .from("books")
    .select("*")
    .eq("id", requestedBookId)
    .single();

  const { data: selectedBook } = await supabase
    .from("books")
    .select("*")
    .eq("id", selectedBookId)
    .single();

  if (!requestedBook || !selectedBook) {
    throw new Error("Books not found");
  }

  if (selectedBook.owner_id !== currentUserId) {
    throw new Error("You do not own this book");
  }

  const { error: err1 } = await supabase
    .from("books")
    .update({ owner_id: currentUserId })
    .eq("id", requestedBookId);

  if (err1) throw err1;

  const { error: err2 } = await supabase
    .from("books")
    .update({ owner_id: ownerId })
    .eq("id", selectedBookId);

  if (err2) throw err2;

  const { error: deleteError } = await supabase
    .from("requests")
    .delete()
    .or(
      `book_id.eq.${requestedBookId},book_id.eq.${selectedBookId},requester_id.eq.${currentUserId}`,
    );

  if (deleteError) throw deleteError;

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
    },
  });
}
