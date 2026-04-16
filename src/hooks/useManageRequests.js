import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const acceptRequest = async ({ bookId, requesterId, requestId }) => {
  const { error: bookError } = await supabase
    .from("books")
    .update({
      owner_id: requesterId,
      status: "available",
    })
    .eq("id", bookId);

  if (bookError) throw bookError;

  const { error: requestError } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);

  if (requestError) throw requestError;

  return true;
};

const rejectRequest = async ({ requestId }) => {
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);

  if (error) throw error;

  return true;
};

export const useAcceptRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptRequest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["books", variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
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
