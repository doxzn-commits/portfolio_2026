import type { MetadataRoute } from "next";
import { SITE } from "./data";

/** 검색엔진 크롤링 허용 + 사이트맵 위치 안내 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.origin}/sitemap.xml`,
    host: SITE.origin,
  };
}
