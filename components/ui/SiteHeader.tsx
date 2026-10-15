"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useIntroStore } from "@/lib/introStore";
import { useZenStore } from "@/lib/zenStore";

type SiteHeaderProps = {
  active?: "home" | "library" | "games" | "journal" | "capsule" | "retro";
};

const links = [
  { id: "home", label: "Beranda", href: "/" },
  { id: "library", label: "Perpustakaan", href: "/perpustakaan" },
  { id: "games", label: "Mini-games", href: "/mini-games" },
  { id: "journal", label: "Jurnal", href: "/jurnal" },
  { id: "capsule", label: "Kapsul Waktu", href: "/kapsul-waktu" },
  { id: "retro", label: "Ruang Nostalgia", href: "/dunia-retro" },
] as const;

export function SiteHeader({ active }: SiteHeaderProps = {}) {
  const pathname = usePathname();
  const isIntroActive = useIntroStore((state) => state.isIntroActive);
  const isDreamTransitioning = useIntroStore((state) => state.isDreamTransitioning);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navRef = useRef<HTMLElement>(null);

  const isHome = pathname === "/";
  const isZenMode = useZenStore((state) => state.isZenMode);
  // On home route, keep navbar hidden until intro finishes, or when Zen Mode is active
  const isHidden = (isHome && isIntroActive && !isDreamTransitioning) || isZenMode;

  const currentActive =
    active ??
    (pathname === "/"
      ? "home"
      : pathname.startsWith("/perpustakaan")
      ? "library"
      : pathname.startsWith("/mini-games")
      ? "games"
      : pathname.startsWith("/jurnal")
      ? "journal"
      : pathname.startsWith("/kapsul-waktu")
      ? "capsule"
      : pathname.startsWith("/dunia-retro")
      ? "retro"
      : undefined);

  const handleScroll = () => {
    if (!navRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  };

  const scrollNav = (direction: "left" | "right") => {
    if (!navRef.current) return;
    const distance = 120;
    navRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);

    // Auto-scroll active item into view smoothly on route change
    const timer = setTimeout(() => {
      const activeEl = navRef.current?.querySelector('[aria-current="page"]');
      if (activeEl) {
        activeEl.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      }
      handleScroll();
    }, 150);

    return () => {
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <header
      className={`absolute inset-x-0 top-0 z-30 flex flex-col items-start gap-3 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-10 sm:pt-7 lg:px-16 transition-all duration-1000 ease-out ${
        isHidden
          ? "pointer-events-none -translate-y-8 opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <Link
        href="/"
        className="group inline-flex shrink-0 items-center gap-3"
        aria-label="Your Dream, beranda"
      >
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
          <Image
            src="/logo.png"
            alt="Logo Your Dream"
            width={48}
            height={48}
            className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(255,229,178,0.35)]"
            priority
          />
        </span>
        <span className="flex flex-col">
          <span className="font-display text-[1.45rem] leading-none tracking-[0.03em] text-white sm:text-[1.65rem]">
            Your Dream
          </span>
          <span className="mt-1 text-[0.56rem] uppercase tracking-[0.22em] text-white/55 transition-colors group-hover:text-white/80">
            by rayvelione
          </span>
        </span>
      </Link>

      {/* Navigation Bar Container with Dual Mobile Scroll Indicators */}
      <div className="relative w-full sm:w-auto">
        {/* Left Scroll Gradient Mask on Mobile */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 rounded-l-full bg-gradient-to-r from-slate-950/90 to-transparent transition-opacity duration-300 sm:hidden ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Left Interactive Scroll Button for Mobile */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollNav("left")}
            aria-label="Geser navigasi ke kiri"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 flex items-center gap-0.5 rounded-full border border-amber-300/40 bg-slate-950/90 px-1.5 py-0.5 text-[0.55rem] font-medium text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.35)] backdrop-blur-md transition-all active:scale-95 sm:hidden"
          >
            <span className="text-amber-300">←</span>
            <span>geser</span>
          </button>
        )}

        <nav
          ref={navRef}
          onScroll={handleScroll}
          aria-label="Navigasi utama"
          className="flex w-full items-center gap-1 overflow-x-auto no-scrollbar rounded-full border border-white/20 bg-slate-950/35 px-2 py-1 backdrop-blur-xl shadow-lg sm:w-auto sm:justify-normal sm:gap-2 sm:px-1 scroll-smooth overscroll-x-contain"
        >
          {links.map((link) => (
            <Link
              key={link.id}
              aria-current={currentActive === link.id ? "page" : undefined}
              className={`flex min-h-9 shrink-0 items-center justify-center rounded-full px-2.5 py-1.5 text-center text-[clamp(0.55rem,2vw,0.68rem)] leading-tight transition sm:min-h-0 sm:flex-none sm:whitespace-nowrap sm:px-4 sm:py-2 sm:text-xs ${
                currentActive === link.id
                  ? "bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Scroll Gradient Mask on Mobile */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 rounded-r-full bg-gradient-to-l from-slate-950/90 to-transparent transition-opacity duration-300 sm:hidden ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right Interactive Scroll Button for Mobile */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollNav("right")}
            aria-label="Geser navigasi ke kanan"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex items-center gap-0.5 rounded-full border border-amber-300/40 bg-slate-950/90 px-1.5 py-0.5 text-[0.55rem] font-medium text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.35)] backdrop-blur-md transition-all active:scale-95 sm:hidden"
          >
            <span>geser</span>
            <span className="text-amber-300">→</span>
          </button>
        )}
      </div>
    </header>
  );
}
