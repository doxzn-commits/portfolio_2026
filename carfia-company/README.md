# 카피아 회사 소개 페이지 (carfia-company)

`carfia.co.kr/company` 를 대체할 회사 소개 페이지. 시안 두 개가 라우트로 나뉘어 있다.
Next.js 15 App Router · TypeScript · 순수 CSS (프레임워크 없음).

## 실행

```bash
npm install
npm run dev      # http://localhost:3220
```

**주의** — `npm run build` 를 dev 서버가 켜진 상태에서 돌리면 `.next` 를 덮어써
dev 서버가 CSS 없는 화면을 뱉는다. 빌드했으면 `.next` 를 지우고 dev 를 다시 띄운다.

```bash
npm run build && rm -rf .next && npm run dev
```

## 라우트

| 주소 | 내용 |
|---|---|
| `/` | 시안 비교 입구. 두 카드 중 선택 |
| `/v1` | **제안서 톤.** 실적·근거를 순서대로 쌓아 신뢰를 만드는 구성 |
| `/v2` | **설명서 톤.** 중학생 눈높이 + 도식 중심 |

방향이 정해지면 고른 쪽 내용을 `app/page.tsx` 로 옮기고 `app/v1` · `app/v2` 와
버전 토글(`.ver` / `Bar.tsx`)을 지운다.

## 구조

```
app/
  data.ts          ← 모든 문구·수치의 단일 원천. 내용 수정은 여기 한 곳
  globals.css      ← 디자인 토큰 + v1 스타일 + 공용 .zig
  layout.tsx       ← 메타데이터 + JSON-LD
  page.tsx         ← 시안 비교 입구
  components/      ← v1·v2 공용
    Chrome.tsx     헤더 (검정 섹션 위에서 색 반전) + 버전 토글
    Reveal.tsx     스크롤 진입 fade-up
    CountUp.tsx    숫자 카운트업
    ZigFlow.tsx    5단계 좌우 지그재그 — v1·v2 가 함께 쓴다
    Split.tsx      두 사업부 갈림길 (v1)
    Compare.tsx    기존 vs 카피아 2열 표 (v1)
    Chart.tsx      취급액·건수·매출 전환 차트 (v1)
    Gauges.tsx     다이렉트 침투율 게이지 (v1)
    TechRows.tsx   기술 3축 (v1)
  v1/page.tsx      ← 11개 섹션 조립
  v2/
    page.tsx       ← 9개 섹션 조립
    v2.css         ← v2 전용 스타일 (클래스는 x- 접두사로 격리)
    components/
      Bar.tsx        상단 바 + 버전 토글
      VsDiagram.tsx  도식 1 — 나→딜러→1곳 vs 나→카피아→14곳
      FeeStack.tsx   도식 2 — 수수료 블록 쌓기
      LogoWall.tsx   브랜드 로고 월 (빌드 시점에 파일 존재 확인)
public/
  logo-black.png · logo-white.png   CI 원본에서 여백 잘라 4배 확대
  fonts/PretendardVariable.woff2
```

## v1 섹션 구성

흰색 → 회색 → **검정** → 흰 → 회색 → 흰 → 회색 → 흰 → 회색 → 흰 → 회색.
검정은 문제 제기 한 곳뿐이다.

`intro` → `lanes`(두 사업부) → `market`(검정) → `compare` → `flow` → `growth`
→ `history` → `group` → `partners` → `vision` → `contact`

## v2 섹션 구성

히어로 → **`lanes`**(무엇을 도와드리나 — 실질적 입구) → `how`(비교 도식)
→ `steps`(지그재그 5단계) → `why`(수수료 도식) → `history`(라인 표)
→ `brands`(로고 월) → `faq` → `contact`

v2 에서 뺀 것: 그룹 4개 법인, 시장 규모(18조·SAM), 기술 3축, 비전 STEP,
파급효과, 고객군 표. 처음 온 사람에게 필요한 정보가 아니다.

## 설계 원칙

- **카드 대신 선.** 항목은 테두리 상자에 담지 않고 1px 헤어라인으로 나눈다.
- **검정 배경은 딱 한 번.** 그 외에는 흰색과 `#fafafa` 두 가지뿐.
- **대표 초록은 채우지 않고 가리킨다.** 강조 수치, CTA 버튼, 활성 탭 밑줄 정도.
- **제목과 본문 사이에 계단.** 제목 800 웨이트, 본문 400. 크기 차이 약 3배.
- **비교는 토글하지 않는다.** 좁은 화면에서도 2열을 유지하고, 대신 문장을 구로 줄인다.
- **애니메이션 뒤에 텍스트를 숨기지 않는다.** 카운트업 초기값은 최종 숫자,
  접힌 FAQ 답변도 DOM 에 남는다. 검색·AI 가 SSR HTML 에서 그대로 읽는다.
- `prefers-reduced-motion` 이 켜져 있으면 모션이 전부 꺾인다.
- **좁은 화면에서만 가로로 눕힌다.** `.rail` / `.hrail-sm` 이 담당.

## 아직 안 된 것

- **브랜드 로고 파일이 없다.** 지금은 한글 이름으로 폴백 중.
  `public/logos/` 에 아래 파일을 넣으면 코드 수정 없이 로고로 바뀌고,
  PC 에서 마우스를 올리면 한글 이름이 나온다.
  `encar` `heydealer` `kcar` `charancha` `woori` `bnk` `hana` `jb`
  `kcar-capital` `deutsche` `korea-capital` `meritz` (`.svg`·`.png`·`.webp`)
- **회사 사진·차량 사진이 없다.** 현재는 타이포그래피와 이모지로만 만들어져 있다.
  스톡 이미지로 메우지 않는다.
- **v2 히어로의 "무조건 더 싸게"** 는 절대적 표현이라 표시광고법 확인이 필요하다.
  `app/v2/page.tsx` 한 줄만 고치면 된다.
- 게이지·차트가 `width`/`height` 를 애니메이션한다(`globals.css`).
  `transform` 기반으로 바꾸면 저사양 기기에서 부드러워진다.

## 데이터 출처와 주의

- 모든 수치는 「카피아_사업계획서」(2026-06-30 제출본) 기준. `SITE.updatedAt` 이 그 기준일.
- **사업계획서가 최우선.** 라이브 사이트와 어긋나면 사업계획서 값을 쓴다.
  그래서 금융사는 14곳(라이브 사이트의 "24곳"이 아니라)이다.
- 공개 페이지라 **손익·투자유치 계획(30억)·Exit 목표는 싣지 않았다.**
- 그룹 매출은 부가세 신고 기준 내부 관리 수치 — 감사 재무제표가 아니다.
- 누적 취급액 9,245억원은 연도별 표 합계(7,707억원)와 산술이 맞지 않는다.
  사업계획서 표기를 그대로 쓰되 두 수치를 나란히 놓고 설명하지 않는다.
- 제품 맥락 전체는 `PRODUCT.md` 참조.
