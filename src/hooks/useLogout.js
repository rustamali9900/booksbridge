"use client";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.replace("/login");
    },
  });
}
