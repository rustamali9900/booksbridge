"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, loading, serverError } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setValidationError("All fields are required.");
      return;
    }

    if (fullName.trim().length < 2) {
      setValidationError("Full name is too short.");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError("");

    const response = await signUp(email, password, fullName);

    if (response.success) {
      toast.success("Signup successful! Welcome to Booksbridge 🚀", {
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
    <div className="relative flex min-h-screen w-full flex-1 items-center justify-center bg-mesh p-4">
      <ToastContainer />

      {/* Header */}
      <header className="absolute left-0 top-0 z-50 flex w-full items-center justify-center px-8 py-7">
        <h1 className="text-xl font-bold uppercase tracking-tight text-white">
          booksbridge
        </h1>
      </header>

      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF4B2B]/5 blur-[120px]"></div>

      <main className="glass-card relative z-10 mt-12 w-full max-w-[400px] rounded-2xl p-6 md:p-7 shadow-2xl">
        <div className="mb-7 text-center">
          <h2 className="mb-1 font-display text-2xl font-bold tracking-tight text-white">
            Join the Exchange
          </h2>
          <p className="text-xs text-slate-400">
            Create your premium book-trading portfolio
          </p>
        </div>

        {displayError && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400">
            {displayError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            placeholder="Full Name"
            disabled={loading}
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            placeholder="Email"
            disabled={loading}
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            placeholder="Password"
            disabled={loading}
          />

          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            placeholder="Confirm Password"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`btn-gradient btn-glow w-full rounded-xl py-3 text-sm font-bold text-white transition-all ${
              loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
          >
            {loading ? "Creating Account..." : "Join the Exchange"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?
            <Link
              className="ml-1 font-bold text-[#FF4B2B] transition-all hover:underline"
              href="/login"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
