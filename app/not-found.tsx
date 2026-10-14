import Link from "next/link";
import { SiteHeader } from "@/components/ui/SiteHeader";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center bg-[#18233d] px-6 text-center text-white">
      <SiteHeader active="home" />
      <div className="relative z-10 max-w-md">
        <span className="font-display text-7xl font-bold text-amber-200/80">404</span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-[#fff5e6]">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-2 text-sm text-white/70">
          Sepertinya halaman yang kamu cari belum ada atau sudah berpindah. Kamu bisa kembali ke beranda untuk melanjutkan penjelajahan.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
