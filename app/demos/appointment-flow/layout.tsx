import type { Metadata, Viewport } from "next";
import "./appointment-flow.css";

export const metadata: Metadata = {
  title: "Appointment Flow | Motus illustrative showroom",
  description:
    "A fictional interactive appointment-flow example showing what happens after a customer chooses a time.",
  alternates: { canonical: "/demos/appointment-flow" },
  openGraph: {
    title: "Appointment Flow | Motus illustrative showroom",
    description:
      "A fictional interactive appointment-flow example showing what happens after a customer chooses a time.",
    url: "/demos/appointment-flow",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f4ef",
};

export default function AppointmentFlowLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
