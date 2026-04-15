"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "AUCTION HOUSE", href: "/auction" },
  { label: "MARKETPLACE", href: "/marketplace" },
  { label: "EXCHANGE ZONE", href: "/exchange" },
  { label: "MYSTERY ROOM", href: "/mystery" },
];

export default function Navbar({ user }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/90 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative h-9 w-9 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Booksbridge Logo"
              fill
              priority
              className="object-contain"
            />
          </div>

          <h1 className="text-lg sm:text-xl font-bold tracking-[0.25em] uppercase text-white font-nav">
            Booksbridge
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[11px] tracking-[0.2em] font-medium uppercase transition-all duration-300 ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}

                {isActive && (
                  <span className="absolute left-0 -bottom-8 h-[2px] w-full rounded-full bg-gradient-to-r from-[#FF4B2B] to-[#FDC830]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-5 shrink-0">
          <button className="hidden sm:flex items-center text-slate-400 hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.18em] uppercase">
                Collector
              </p>

              <p className="text-xs font-semibold tracking-wide text-white uppercase max-w-[140px] truncate">
                {user?.full_name ?? "Guest"}
              </p>
            </div>

            <div className="relative size-10 rounded-full border border-white/20 overflow-hidden ring-1 ring-white/10 ring-offset-2 ring-offset-black bg-zinc-900">
              <Image
                src={
                  user?.avatar_url ??
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.full_name ?? "Guest",
                  )}&background=111827&color=ffffff`
                }
                alt={user?.full_name ?? "Guest"}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden text-white flex items-center hover:text-primary transition-colors duration-300">
            <span className="material-symbols-outlined text-[26px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
