import type { Metadata } from "next";
import { TimeCapsuleExperience } from "@/components/ui/TimeCapsuleExperience";

export const metadata: Metadata = {
  title: "Kapsul Waktu Antarbintang | Your Dream",
  description:
    "Ruang sunyi untuk mengukir pesan, refleksi ketabahan, dan harapanmu mengarungi samudra waktu abadi.",
};

export default function TimeCapsulePage() {
  return <TimeCapsuleExperience />;
}
