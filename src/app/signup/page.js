"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Next.js router for redirection
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/useAuth"; // Import our server state hook

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, loading, serverError } = useAuth(); // Destructure hook

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

    // --- Client-Side Validation ---
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

    // --- Server-Side Authentication ---
    const response = await signUp(email, password, fullName);

    if (response.success) {
      toast.success("Signup successful! Welcome to Booksbridge 🚀", {
        position: "top-right",
        autoClose: 1500, // Reduced slightly so it feels faster before redirect
        theme: "dark",
      });

      // Delay the redirect slightly so the user sees the success toast
      setTimeout(() => {
        router.push("/marketplace");
      }, 1500);
    }
  };

  // Combine client and server errors for display
  const displayError = validationError || serverError;

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative bg-mesh min-h-screen w-full">
      <ToastContainer />

      {/* Header */}
      <header className="w-full px-8 py-8 flex items-center justify-center absolute top-0 left-0 z-50">
        <h1 className="text-xl font-bold tracking-tight uppercase">
          booksbridge
        </h1>
      </header>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF4B2B]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="glass-card w-full max-w-[500px] rounded-xl p-8 md:p-12 shadow-2xl relative z-10 mt-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black mb-2 tracking-tight">
            Join the Exchange
          </h2>
          <p className="text-slate-400 font-medium">
            Create your premium book-trading portfolio
          </p>
        </div>

        {displayError && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            {displayError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white"
            placeholder="Full Name"
            disabled={loading}
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white"
            placeholder="Email"
            disabled={loading}
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white"
            placeholder="Password"
            disabled={loading}
          />

          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white"
            placeholder="Confirm Password"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`btn-gradient btn-glow w-full text-white font-extrabold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : "group"}`}
          >
            {loading ? "Creating Account..." : "Join the Exchange"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?
            <Link
              className="text-[#FF4B2B] font-bold ml-1 hover:underline transition-all"
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
