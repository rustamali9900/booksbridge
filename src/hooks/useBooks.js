import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useBooks() {
  const {
    data: books = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["books"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(
          `
          *,
          profiles (
            full_name,
            avatar_url
          )
        `,
        )
        .in("status", ["available", "pending"])
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    books,
    isPending,
    error,
  };
}
