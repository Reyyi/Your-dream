import Link from "next/link";

type SiteHeaderProps = {
  active: "home" | "library" | "games" | "journal";
};

const links = [
  { id: "home", label: "Beranda", href: "/" },
  { id: "library", label: "Perpustakaan", href: "/perpustakaan" },
  { id: "games", label: "Mini-games", href: "/mini-games" },
  { id: "journal", label: "Jurnal", href: "/jurnal" },
] as const;

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex flex-col items-start gap-3 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-10 sm:pt-7 lg:px-16">
      <Link
        href="/"
        className="group inline-flex shrink-0 items-center gap-3"
        aria-label="Your Dream, beranda"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/45 transition-colors group-hover:border-white/70">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffe5b2] shadow-[0_0_18px_rgba(255,229,178,0.85)]" />
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
      <nav
        aria-label="Navigasi utama"
        className="grid w-full grid-cols-4 items-center gap-0.5 rounded-full border border-white/15 bg-slate-950/60 p-1 backdrop-blur-md sm:flex sm:w-auto sm:justify-normal sm:gap-2"
      >
        {links.map((link) => (
          <Link
            key={link.id}
            aria-current={active === link.id ? "page" : undefined}
            className={`flex min-h-9 items-center justify-center rounded-full px-1 py-1.5 text-center text-[clamp(0.5rem,2.2vw,0.68rem)] leading-tight transition sm:min-h-0 sm:flex-none sm:whitespace-nowrap sm:px-4 sm:py-2 sm:text-xs ${
              active === link.id
                ? "bg-white/20 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
