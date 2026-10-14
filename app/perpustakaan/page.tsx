import type { Metadata } from "next";
import { LibraryExperience } from "@/components/ui/LibraryExperience";

export const metadata: Metadata = {
  title: "Perpustakaan kecil — Your Dream",
  description: "Cerita pendek dan pengetahuan kecil untuk dibaca pelan-pelan.",
};

export default function LibraryPage() {
  return <LibraryExperience />;
}
