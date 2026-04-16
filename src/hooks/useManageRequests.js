import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const acceptRequest = async ({ bookId, requesterId }) => {
  const { error: bookError } = await supabase
    .from("books")
    .update({ owner_id: requesterId, status: "available" })
    .eq("id", bookId);

  if (bookError) throw bookError;

  const { error: requestError } = await supabase
    .from("requests")
    .delete()
    .eq("book_id", bookId);

  if (requestError) throw requestError;

  return true;
};

export const useAcceptRequest = () => {
  return useMutation({
    mutationFn: acceptRequest,
  });
};

const rejectRequest = async ({ requestId }) => {
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);

  if (error) throw error;

  return true;
};

export const useRejectRequest = () => {
  return useMutation({
    mutationFn: rejectRequest,
  });
};
