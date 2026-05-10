"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const fetchCurrentUser = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) throw profileError;

  return {
    id: user.id,
    profile,
  };
};

export function useCurrentUser() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED"
      ) {
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    currentUserId: query.data?.id ?? null,
    currentUser: query.data?.profile ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
