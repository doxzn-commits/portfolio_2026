import type { MetadataRoute } from "next";
import { SITE } from "./data";

/** 소개 페이지 사이트맵. 실제 배포 경로(/intro)를 canonical 과 맞춘다. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SITE.updatedAt);
  return [
    {
      url: `${SITE.origin}/intro`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
