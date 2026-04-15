"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const signUp = async (email, password, fullName) => {
    setLoading(true);
    setServerError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      return { success: true, data };
    } catch (err) {
      setServerError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    setServerError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (err) {
      setServerError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { loading, serverError, signUp, signIn };
}
