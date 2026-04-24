"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const deleteBook = async (bookId) => {
  console.log(bookId);
  const { error } = await supabase.from("books").delete().eq("id", bookId);
  if (error) throw error;
};

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-books"] });
      queryClient.invalidateQueries({ queryKey: ["all-books"] });
      queryClient.invalidateQueries({ queryKey: ["mystery_books"] });
      queryClient.invalidateQueries({ queryKey: ["exchange_books"] });
      queryClient.invalidateQueries({ queryKey: ["auction_books"] });
    },
  });
}
