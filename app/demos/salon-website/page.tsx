import type { Metadata } from "next";
import { salonDemo } from "@/src/clients/salon-demo";
import SalonDemo from "./SalonDemo";

export const metadata: Metadata = {
  title: `${salonDemo.name} | Salon website demo by Motus`,
  description: "Explore a fictional salon website with services, a product collection and booking previews. No real appointments, orders or messages.",
  alternates: { canonical: "/demos/salon-website" },
  openGraph: {
    title: `${salonDemo.name} — a salon website demo`,
    description: "A complete fictional salon website, made by Motus.",
    url: "/demos/salon-website",
    images: [{ url: salonDemo.hero.src, width: 1407, height: 1759, alt: "Salon website demo by Motus" }],
  },
};

export default function SalonWebsitePage() {
  return <SalonDemo />;
}
