import type { Metadata, Viewport } from "next";
import "./lead-hub.css";

export const metadata: Metadata = {
  title: "Lead Hub | Motus illustrative showroom",
  description:
    "A fictional interactive example showing how an enquiry becomes an owned, review-ready next step.",
  alternates: { canonical: "/demos/lead-hub" },
  openGraph: {
    title: "Lead Hub | Motus illustrative showroom",
    description: "Follow a fictional enquiry from its original source to a human-controlled next step.",
    url: "/demos/lead-hub",
  },
};

export const viewport: Viewport = { colorScheme: "light", themeColor: "#f0f4f4" };

export default function LeadHubLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
