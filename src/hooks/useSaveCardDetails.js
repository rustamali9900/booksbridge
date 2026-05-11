"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const saveCardDetails = async ({ userId, cardData }) => {
  const { error } = await supabase
    .from("profiles")
    .update({ fake_card_info: JSON.stringify(cardData) })
    .eq("id", userId);

  if (error) throw error;
};

export function useSaveCardDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCardDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}
