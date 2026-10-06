import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://villademo.caeldigital.com";
  const routes = ["", "/about", "/rooms", "/blog", "/contact", "/reservation-status", "/privacy", "/booking-terms", "/cancellation-policy"];
  return routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" : "monthly", priority: route === "" ? 1 : route === "/rooms" ? 0.9 : 0.6 }));
}
