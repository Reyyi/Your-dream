import type { Metadata } from "next";
import { RetroWorldExperience } from "@/components/ui/RetroWorldExperience";

export const metadata: Metadata = {
  title: "Dunia Retro: Laboratorium Pengetahuan Analog | Your Dream",
  description:
    "Eksplorasi wawasan sains klasik, fisika akustik pita kaset, gelombang radio, dan pemecah sandi logika retro 1984.",
};

export default function RetroWorldPage() {
  return <RetroWorldExperience />;
}
