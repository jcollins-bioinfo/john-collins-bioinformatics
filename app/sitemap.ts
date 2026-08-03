import type { MetadataRoute } from "next";
import { canonicalUrl, publicRoutes } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: canonicalUrl(route),
    ...(route === "/research/cgt"
      ? { lastModified: new Date("2026-07-20T00:00:00Z") }
      : {}),
    ...(route === "/publications"
      ? { lastModified: new Date("2026-07-30T00:00:00Z") }
      : {}),
    ...(route === "/" ? { priority: 1 } : {}),
  }));
}
