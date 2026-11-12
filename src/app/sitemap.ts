import type { MetadataRoute } from "next";
import { getNoticias } from "@/lib/data/noticias";
import { NAV, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const noticias = await getNoticias();
  return [
    ...NAV.map((p) => ({ url: `${SITE_URL}${p.href === "/" ? "" : p.href}`, changeFrequency: "weekly" as const })),
    ...noticias.map((n) => ({ url: `${SITE_URL}/noticias/${n.slug}`, lastModified: n.publicado_em ?? undefined })),
  ];
}
