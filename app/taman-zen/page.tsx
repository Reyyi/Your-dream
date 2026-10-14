import type { Metadata } from "next";
import { ZenGardenExperience } from "@/components/ui/ZenGardenExperience";

export const metadata: Metadata = {
  title: "Taman Zen Karesansui | Your Dream",
  description:
    "Ruang keheningan batu, alur pasir meditatif, dan teka-teki keseimbangan gravitasi alami.",
};

export default function ZenGardenPage() {
  return <ZenGardenExperience />;
}
