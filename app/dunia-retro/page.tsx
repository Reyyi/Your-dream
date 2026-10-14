import type { Metadata } from "next";
import { RetroRoomExperience } from "@/components/ui/RetroRoomExperience";

export const metadata: Metadata = {
  title: "Ruang Nostalgia | Your Dream",
  description:
    "Ruang nostalgia bernuansa klasik dengan pemutar piringan hitam, TV tabung, kamera polaroid, lampu lava, dan telepon putar interaktif.",
};

export default function RetroWorldPage() {
  return <RetroRoomExperience />;
}
