import type { Metadata, Viewport } from "next";
import "./ledger-desk.css";

export const metadata: Metadata = {
  title: "Ledger Desk | Motus illustrative showroom",
  description:
    "A fictional interactive billing-control example showing how completed work can become ready for invoice review.",
  alternates: { canonical: "/demos/ledger-desk" },
  openGraph: {
    title: "Ledger Desk | Motus illustrative showroom",
    description:
      "Follow completed work through evidence, draft preparation, record matching and owner review.",
    url: "/demos/ledger-desk",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f4ef",
};

export default function LedgerDeskLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
