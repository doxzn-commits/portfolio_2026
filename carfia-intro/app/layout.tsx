import type { Metadata } from "next";
import { SITE, DEFINITION, FAQS, BOARDS } from "./data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: "카피아 소개 — 수입차 프로모션 비교 서비스",
  description: DEFINITION,
  keywords: [
    "카피아",
    "carfia",
    "수입차 프로모션",
    "수입차 프로모션 비교",
    "수입차 할인",
    "수입차 리스",
    "수입차 장기렌트",
    "수입차 할부",
    "신차 실구매가",
    "수입차 핫딜",
  ],
  alternates: { canonical: "/intro" },
  openGraph: {
    type: "website",
    siteName: "카피아",
    url: "/intro",
    title: "카피아 소개 — 수입차 프로모션 비교 서비스",
    description: DEFINITION,
    locale: "ko_KR",
  },
  robots: { index: true, follow: true },
};

/**
 * AI 인식 설계의 핵심.
 * Organization / WebPage(dateModified) / Service / FAQPage / BreadcrumbList 5종을 심는다.
 * FAQPage 는 data.ts 의 FAQS 를 그대로 쓰므로 화면과 구조화 데이터가 절대 어긋나지 않는다.
 */
function JsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE.origin}/#org`,
      name: "카피아",
      alternateName: ["Carfia", "카피아오토플랜"],
      url: SITE.origin,
      description: DEFINITION,
      telephone: SITE.tel,
      address: { "@type": "PostalAddress", addressLocality: "송파구", addressRegion: "서울", addressCountry: "KR" },
      foundingDate: "2011",
      email: "hello@carfia.co.kr",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE.origin}/intro#page`,
      url: `${SITE.origin}/intro`,
      name: "카피아 소개 — 수입차 프로모션 비교 서비스",
      description: DEFINITION,
      inLanguage: "ko-KR",
      datePublished: SITE.publishedAt,
      dateModified: SITE.updatedAt, // = BUILD_DATE (재배포마다 today)
      isPartOf: { "@id": `${SITE.origin}/#org` },
    },
    {
      "@type": "Service",
      "@id": `${SITE.origin}/#service`,
      name: "수입차 프로모션 비교",
      serviceType: "수입차 프로모션 비교 및 자동차금융 중개",
      description: DEFINITION,
      provider: { "@id": `${SITE.origin}/#org` },
      areaServed: { "@type": "Country", name: "대한민국" },
      audience: { "@type": "Audience", audienceType: "수입 신차 구매 예정자" },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "KRW",
        description: "프로모션 조회·비교·계산·상담 신청 무료",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "제공 콘텐츠",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "매월 갱신 수입차 프로모션", url: SITE.origin + BOARDS.promotion.path } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "수입차 핫딜", url: SITE.origin + BOARDS.hotdeal.path } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "차량 꿀팁", url: SITE.origin + BOARDS.cartip.path } },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.origin}/intro#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE.origin },
        { "@type": "ListItem", position: 2, name: "카피아 소개", item: `${SITE.origin}/intro` },
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
        {/* 자체 호스팅 Pretendard — 히어로 텍스트가 폰트 스왑 없이 바로 뜨도록 프리로드 */}
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <JsonLd />
      </body>
    </html>
  );
}
