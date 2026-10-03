import type { MetadataRoute } from "next";
import { demoCatalog } from "@/lib/demo-catalog";

const siteUrl = "https://motusautomation.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedDemos = demoCatalog
    .filter((demo) => demo.status === "ready" && demo.url)
    .map((demo) => ({ url: `${siteUrl}${demo.url}` }));

  return [
    { url: siteUrl },
    { url: `${siteUrl}/demos` },
    { url: `${siteUrl}/privacy` },
    ...publishedDemos,
  ];
}
