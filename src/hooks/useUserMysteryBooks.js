"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const fetchUserMysteryBooks = async (userId) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("owner_id", userId)
    .eq("type", "mystery");

  if (error) throw error;

  return data;
};

export function useUserMysteryBooks(userId) {
  return useQuery({
    queryKey: ["user-mystery-books", userId],
    queryFn: () => fetchUserMysteryBooks(userId),
    enabled: !!userId,
  });
}
