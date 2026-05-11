"use client";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const changePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;

  return data;
};

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
