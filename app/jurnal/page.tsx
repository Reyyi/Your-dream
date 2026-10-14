import type { Metadata } from "next";
import { DreamJournalExperience } from "@/components/ui/DreamJournalExperience";

export const metadata: Metadata = {
  title: "Jurnal mimpi — Your Dream",
  description: "Ruang pribadi untuk menulis mimpi, harapan, dan hal kecil yang ingin diingat.",
};

export default function JournalPage() {
  return <DreamJournalExperience />;
}
