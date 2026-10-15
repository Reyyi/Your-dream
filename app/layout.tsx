import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SoundscapePanel } from "@/components/ui/SoundscapePanel";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Your Dream | by rayvelione",
  description:
    "Ruang tenang untuk menjelajah cerita, pengetahuan kecil, dan permainan sederhana.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${displayFont.variable} ${sansFont.variable}`}>
        <SiteHeader />
        {children}
        <SoundscapePanel />
      </body>
    </html>
  );
}
