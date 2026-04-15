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
    <div className="relative flex flex-1 flex-col items-center justify-center p-6 min-h-screen">
      <ToastContainer />

      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#FF4B2B]/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#FDC830]/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full px-10 py-10 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            LiberExchange
          </h1>
        </div>
      </header>

      <main className="w-full max-w-[460px] z-10 mt-16">
        <div className="glass-card rounded-2xl p-8 md:p-12 flex flex-col gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white font-display">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-400">
              Continue your book-trading journey.
            </p>
          </div>

          {/* Error */}
          {displayError && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center">
              {displayError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white cursor-pointer"
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
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white pr-12 cursor-pointer"
                placeholder="••••••••••••"
                type={showPassword ? "text" : "password"}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-vibrant text-white font-bold py-4 rounded-xl cursor-pointer"
            >
              {loading ? "Authenticating..." : "Secure Log In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Do not have an account?
            <Link className="text-white font-bold ml-1" href="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
