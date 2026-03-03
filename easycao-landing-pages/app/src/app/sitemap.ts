import type { MetadataRoute } from "next";
import { getAllPages } from "../lib/content-pages";
import { SITE_URL } from "../lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const contentPages = getAllPages().map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/metodo`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/lives`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...contentPages,
  ];
}
