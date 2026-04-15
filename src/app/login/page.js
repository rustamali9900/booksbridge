"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading, serverError } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError("");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email.trim() || !password) {
      setValidationError("Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    setValidationError("");

    const response = await signIn(email, password);

    if (response?.success) {
      toast.success("Welcome back to the Exchange King 🛐", {
        position: "top-right",
        autoClose: 1500,
        theme: "dark",
      });

      setTimeout(() => {
        router.push("/marketplace");
      }, 1500);
    }
  };

  const displayError = validationError || serverError;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center min-h-screen p-4">
      <ToastContainer />

      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-[#FF4B2B]/10 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-[#FDC830]/5 blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 flex w-full items-center justify-center px-8 py-7">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-xl font-bold tracking-tight text-white">
            LiberExchange
          </h1>
        </div>
      </header>

      <main className="z-10 mt-12 w-full max-w-[380px]">
        <div className="glass-card flex flex-col gap-5 rounded-2xl p-6 md:p-7">
          <div className="space-y-1 text-center">
            <h2 className="font-display text-2xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400">
              Continue your book-trading journey.
            </p>
          </div>

          {/* Error */}
          {displayError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-center text-xs text-red-400">
              {displayError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full cursor-pointer rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
              placeholder="name@example.com"
              type="email"
            />

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full cursor-pointer rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-12 text-sm text-white"
                placeholder="••••••••••••"
                type={showPassword ? "text" : "password"}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[11px] text-slate-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-vibrant w-full cursor-pointer rounded-xl py-3 text-sm font-bold text-white"
            >
              {loading ? "Authenticating..." : "Secure Log In"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Do not have an account?
            <Link className="ml-1 font-bold text-white" href="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
