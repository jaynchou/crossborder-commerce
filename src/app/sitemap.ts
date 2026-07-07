import type { MetadataRoute } from "next";
import { listCategoryPages, listProducts } from "@/lib/store";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    ...listCategoryPages().map((category) => ({
      url: `${siteUrl}/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...listProducts().map((product) => ({
      url: `${siteUrl}/products/${product.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: product.featured ? 0.9 : 0.7
    }))
  ];
}
