import type { Metadata, Viewport } from "next";
import PropertyDesk from "@/components/property-desk/PropertyDesk";

export const metadata: Metadata = {
  title: "Property Desk: a Gmail and Outlook automation demo | Motus",
  description: "Follow a tenant leak report into organised property emails and a landlord draft ready for review. Try Gmail or Outlook, with an optional sidebar add-on concept.",
  alternates: { canonical: "/demos/property-desk" },
  openGraph: {
    title: "Property Desk | Motus",
    description: "See property emails organised and a landlord update prepared for human review in a fictional Gmail or Outlook inbox.",
    url: "/demos/property-desk",
  },
};

export const viewport: Viewport = { colorScheme: "light", themeColor: "#111519" };

export default function PropertyDeskPage() {
  return <PropertyDesk />;
}
