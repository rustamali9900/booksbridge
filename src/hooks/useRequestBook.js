import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const fetchRequestStatus = async ({ queryKey }) => {
  const [_key, bookId, userId] = queryKey;

  if (!userId) return false;

  const { data, error } = await supabase
    .from("requests")
    .select("id")
    .eq("book_id", bookId)
    .eq("requester_id", userId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
};

export const useRequestStatus = (bookId, userId) => {
  return useQuery({
    queryKey: ["request-status", bookId, userId],
    queryFn: fetchRequestStatus,
    enabled: !!userId,
  });
};

const createRequest = async ({ bookId, ownerId, userId }) => {
  const { error } = await supabase.from("requests").insert([
    {
      book_id: bookId,
      requester_id: userId,
      owner_id: ownerId,
      status: "pending",
    },
  ]);

  if (error) throw error;

  return true;
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequest,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        ["request-status", variables.bookId, variables.userId],
        true,
      );
    },
  });
};
