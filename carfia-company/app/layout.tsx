import type { Metadata } from "next";
import { COMPANY, DEFINITION, SITE } from "./data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: "회사 소개 — 카피아 | 중고차 할부금리 비교, 수입 신차 할인 비교",
  description: DEFINITION,
  keywords: [
    "카피아",
    "carfia",
    "카피아 회사소개",
    "자동차 금융",
    "중고차 할부",
    "중고차 금리비교",
    "수입차 프로모션",
    "자동차 금융 중개",
    "자동차 할부 다이렉트",
  ],
  alternates: { canonical: SITE.path },
  openGraph: {
    type: "website",
    siteName: "카피아",
    url: SITE.path,
    title: "회사 소개 — 카피아 | 중고차 할부금리 비교, 수입 신차 할인 비교",
    description: DEFINITION,
    locale: "ko_KR",
  },
  robots: { index: true, follow: true },
};

/**
 * 구조화 데이터. 화면과 같은 data.ts 를 참조하므로 수치가 어긋날 수 없다.
 * Organization 에 실적을 얹지 않는 이유: schema.org 에 취급액에 대응하는 속성이 없어
 * 억지로 넣으면 오히려 파싱을 어지럽힌다. 실적은 본문 텍스트로 읽히게 둔다.
 */
function JsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE.origin}/#org`,
      name: "카피아",
      legalName: COMPANY.nameKo,
      alternateName: ["Carfia", "Carfia Co., Ltd.", "카피아오토플랜"],
      url: SITE.origin,
      description: DEFINITION,
      telephone: SITE.tel,
      email: SITE.email,
      foundingDate: "2011",
      address: {
        "@type": "PostalAddress",
        addressLocality: "송파구",
        addressRegion: "서울",
        addressCountry: "KR",
      },
      taxID: COMPANY.bizNo,
      founder: { "@type": "Person", name: COMPANY.ceo },
      numberOfEmployees: { "@type": "QuantitativeValue", value: 25 },
      knowsAbout: ["자동차 금융 중개", "중고차 할부금리 비교", "수입 신차 할인 비교", "리스·장기렌트 승계"],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE.origin}${SITE.path}#page`,
      url: `${SITE.origin}${SITE.path}`,
      name: "회사 소개 — 카피아",
      description: DEFINITION,
      inLanguage: "ko-KR",
      dateModified: SITE.updatedAt,
      about: { "@id": `${SITE.origin}/#org` },
      isPartOf: { "@id": `${SITE.origin}/#org` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE.origin },
        { "@type": "ListItem", position: 2, name: "회사 소개", item: `${SITE.origin}${SITE.path}` },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 히어로 카피가 폰트 스왑 없이 바로 뜨도록 프리로드 */}
        <link rel="preload" href="/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <JsonLd />
      </body>
    </html>
  );
}
