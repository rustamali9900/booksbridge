"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-[#fa4d2e] selection:text-white flex flex-col px-4 py-6">
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between mb-12">
        <h1 className="text-base font-bold tracking-[0.18em] uppercase">
          Booksbridge
        </h1>

        <nav className="flex items-center gap-5">
          <button className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/70 hover:text-white transition">
            Collection
          </button>

          <button
            onClick={() => router.push("/login")}
            className="text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition"
          >
            Log In
          </button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl text-center space-y-7">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
              Beyond the Bookstore.
            </h2>

            <h3 className="text-3xl md:text-5xl font-semibold leading-tight text-white/90">
              Beyond the Barter.
            </h3>
          </div>

          <p className="text-sm md:text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
            The ultimate arena for elite collectors and mystery seekers. Join
            the world&apos;s most exclusive book-trading community.
          </p>

          <div className="flex flex-col items-center gap-5 pt-2">
            <button
              onClick={() => router.push("/signup")}
              className="bg-linear-to-r from-[#ff5132] to-[#fdd259] text-black px-8 py-3 rounded-full text-xs md:text-sm font-bold tracking-[0.18em] uppercase flex items-center gap-2 hover:scale-[1.02] transition"
            >
              Enter the Exchange
              <span>→</span>
            </button>

            <button
              onClick={() => router.push("/login")}
              className="text-[11px] tracking-[0.18em] uppercase font-semibold text-white/50 hover:text-white underline underline-offset-4 decoration-white/20"
            >
              Already a member?
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
