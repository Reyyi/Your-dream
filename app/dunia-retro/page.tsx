import type { Metadata } from "next";
import { RetroRoomExperience } from "@/components/ui/RetroRoomExperience";

export const metadata: Metadata = {
  title: "Dunia Retro: Kamar Nostalgia & Pemandangan | Your Dream",
  description:
    "Pemandangan kamar retro dengan pemutar piringan hitam vinil, TV tabung cembung, kamera polaroid, lampu lava, dan telepon putar interaktif.",
};

export default function RetroWorldPage() {
  return <RetroRoomExperience />;
}
