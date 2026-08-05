# 카피아 (CARFIA) — 프로젝트 지도

> 카피아 재직 중(2025.09 ~) 진행한 프로젝트 문서를 영역별로 모아둔 곳
> 최종 갱신: 2026-07-29

---

## 폴더 구성

| 폴더 | 내용 |
|---|---|
| [`board/`](board/) | **게시판 콘텐츠 그로스** — 전략 · 성과 · GEO 인사이트 |
| [`cms/`](cms/) | **CMS 운영 지식** — 인프라 · 발행 자동화 · 콘텐츠 규칙 · 구현 함정 |
| [`intro-page/`](intro-page/) | **카피아 소개 페이지** (Next.js) 기획·작업 로그 |
| [`archive/`](archive/) | 프로젝트별 상세 아카이브 (구 `claude_history_transfer/`) |

---

## board/ — 게시판 콘텐츠 그로스

대표 프로젝트. AI 콘텐츠 자동 발행 시스템으로 정체된 자사 게시판을 상담 리드 채널로 전환.

| 문서 | 역할 |
|---|---|
| [`GSC_BOARD_OPS.md`](board/GSC_BOARD_OPS.md) | **작전 문서** — CTA 10,000 전략 (목표 2026-09-15) |
| [`GSC_PERFORMANCE_LEDGER.md`](board/GSC_PERFORMANCE_LEDGER.md) | 📊 **유입 대장** — GSC 데이터를 받을 때마다 병합하는 누적 문서 |
| [`CTA_PERFORMANCE_LEDGER.md`](board/CTA_PERFORMANCE_LEDGER.md) | 📊 **CTA 대장** — CTA 클릭·상담 전환. 원천 검증 완료(2026-08-05), 원본 내부 불일치 4건 기록 |
| [`GEO_INSIGHTS.md`](board/GEO_INSIGHTS.md) | AI 검색 인용 인사이트 13항목 (시도→결과→적용) |

**핵심 수치** (원천: [`source_materials/`](../source_materials/))

| 지표 | 값 | 기간 |
|---|---|---|
| CTA 클릭 | 16 → **339건** | 2026-06 (동월·동일 채널) |
| 상담 전환 | 0 → **4건** (1.2%) | 2026-06 |
| GSC 검색 클릭 | 478 → **708건** | 6월 → 7월(26일) |
| GSC 디스커버 클릭 | 0 → **3,517건** | ~6월 → 7월 |

⚠️ **CTA 클릭과 GSC 클릭은 다른 지표다.** 대장 맨 위 경고 참조.

---

## cms/ — CMS 운영 지식

[`CARFIA_CMS_OPS.md`](cms/CARFIA_CMS_OPS.md) — 축적된 운영 지식 59건.

- **A** 인프라 (포트 4517 · pm2 · 재기동 절차 · Prisma)
- **B** 발행 자동화 (크론 스케줄러 · 슬롯 · 발행 게이트 · 대장)
- **C** 콘텐츠 규칙 (AI 인용 목표 · 문체 · CTA 범위 · 강조)
- **D** 성과 측정 (hit 필드 · 디스커버 · 스프린트)
- **E** 구현 함정 (파이프라인 · 프로모션 · 발행 CSS · 히어로 · 이식)

> 재사용 프롬프트는 [`prompts/geo-article-system-prompt.md`](../prompts/geo-article-system-prompt.md) 에 원문 보존.

---

## intro-page/ — 카피아 소개 페이지

[`SERVICE_INTRO_PAGE.md`](intro-page/SERVICE_INTRO_PAGE.md) — 기획·설계 결정·진행 이력.

⚠️ 소스 코드는 저장소 루트의 [`carfia-intro/`](../carfia-intro/) 에 있다. **빌드 루트라 이동하면 안 된다.**

---

## archive/ — 프로젝트별 상세

| 파일 | 프로젝트 |
|---|---|
| `01_influencer_dashboard.md` · `10_` · `11_` | 인플루언서 대시보드 · 추출기 |
| `02_dealer_promotion_dashboard.md` | 딜러 프로모션 대시보드 |
| `03_vehicle_tips_content_geo.md` · `04_news_article_process.md` | 게시판 콘텐츠 · 뉴스 프로세스 |
| `05_onsite_terms_system.md` | 온사이트 용어 체계 |
| `06_seo_geo_analyzer.md` · `08_` | SEO/GEO 진단기 |
| `07_naver_blog_automation.md` · `09_` | 네이버 블로그 자동화 |
| `12_마케팅_자동화_프로젝트_통합_포트폴리오.md` | 통합 |
| **`13_내부_콘텐츠_자동화_발행_시스템_성과_포트폴리오.md`** | ★ **수치 근거 · 일별 실측 · 387건 오류 이력** |

---

## 저장소 다른 곳

| 위치 | 내용 |
|---|---|
| [`../WORK.md`](../WORK.md) | 저장소 전체 허브 |
| [`../portfolio/`](../portfolio/) | 포트폴리오 마스터 · 웹 기획 · KPI 원장 |
| [`../job-search/`](../job-search/) | 토스 · 엔비티 · 리멤버 · 위시캣 |
| [`../source_materials/`](../source_materials/) | 원천 데이터 (엑셀 · GSC CSV · PDF) |
| [`../prompts/`](../prompts/) | 재사용 프롬프트 |

### ⚠️ 이동하면 안 되는 것

| 경로 | 이유 |
|---|---|
| `web_prototype/` | **Vercel 배포 Root Directory** |
| `carfia-intro/` | Next.js 빌드 루트 |
