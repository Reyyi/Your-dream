import type { Metadata } from "next";
import { MiniGamesExperience } from "@/components/ui/MiniGamesExperience";

export const metadata: Metadata = {
  title: "Ruang bermain — Your Dream",
  description: "Permainan kecil untuk bernapas, mengingat, dan mengikuti bintang.",
};

export default function MiniGamesPage() {
  return <MiniGamesExperience />;
}
