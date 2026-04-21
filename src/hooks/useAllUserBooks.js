"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const fetchUserBooks = async (userId) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("owner_id", userId);

  if (error) throw error;

  return data;
};

export function useUserBooks(userId) {
  return useQuery({
    queryKey: ["all-books", userId],
    queryFn: () => fetchUserBooks(userId),
    enabled: !!userId,
  });
}
