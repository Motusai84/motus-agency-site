import type { Metadata } from "next";
import App from "@/components/App";

export const metadata: Metadata = { title: "Motus | Motion comparison", robots: { index: false, follow: false } };
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ direction: "signal" }, { direction: "flow" }, { direction: "type" }];
}

export default async function MotionPreview({ params }: { params: Promise<{ direction: string }> }) {
  const { direction } = await params;
  return <App heroDirection={direction === "flow" ? "flow" : direction === "type" ? "type" : "signal"} />;
}
