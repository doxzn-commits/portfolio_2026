# WORK — 진행 상황과 다음 할 일

> 이 저장소를 이어받는 사람(또는 AI CLI)이 **가장 먼저 읽을 문서**
> 최종 갱신: 2026-07-21

---

## 지금 무엇을 하고 있나

> 이 저장소에는 현재 **세 갈래**의 일이 있다.
> ① 포트폴리오 웹 (이 문서) ② 카피아 게시판 운영 — [`GSC_BOARD_OPS.md`](carfia/board/GSC_BOARD_OPS.md)
> ③ 카피아 서비스 소개 페이지 — [`SERVICE_INTRO_PAGE.md`](carfia/intro-page/SERVICE_INTRO_PAGE.md)

도유진(그로스 마케터)의 **포트폴리오 웹사이트**를 만들고 있다.
토스 지원용 PDF 포트폴리오는 이미 제출됐고, 지금은 그 내용을 인터랙티브 웹으로 옮기는 중이다.

- 배포: **https://doyujin-portfolio.vercel.app** (noindex 상태 — 아래 ⚠️ 참조)
- 코드: `web_prototype/index.html` (단일 파일)
- 상태: **동작하는 시안 완성.** 콘텐츠 다듬기와 이미지 보강이 남음

---

## ⚠️ 착수 전 반드시 알아야 할 것 2가지

### 0. 수치를 고치기 전에 — 단일 출처와 검사기

**모든 성과 수치의 단일 출처는 [`portfolio/kpi-registry.json`](portfolio/kpi-registry.json)이다.**

```bash
node tools/check-kpi.js
```

이 명령이 두 가지를 잡는다. 종료 코드 0이면 통과, 1이면 문제.

| 검사 | 내용 |
|---|---|
| ① 드리프트 | 레지스트리의 수치가 소비 문서(`appearsIn`)에 실제로 있는가 — 누락·오타 |
| ② 폐기 수치 | `387건` 등이 허용되지 않은 파일에 남아 있는가 — 재발 방지 |
| ③ frozen 경로 | 종료건 목록(`frozen.files`)의 파일이 실제로 있는가 — 오타·이동으로 예외가 조용히 풀리는 것 방지 |

**고치는 순서: 레지스트리 → 소비 문서 → 검사기 실행.** 수치를 바꿀 일이 있으면 반드시 이 순서를 지킨다.
새 수치를 추가할 때는 `provenance`를 정직하게 적는다 (`원천검증` / `본인확인` / `미검증`).

> ⚠️ **평균과 사례를 구분한다.** 앱푸시 CTR은 두 벌이 존재한다 —
> 평균 `0.85% → 3.07%`(대표 KPI)와 단일 A/B 사례 `0.50% → 2.94%`. 섞으면 꼬리질문에서 무너진다.

### 0-1. 갱신 대상에서 제외하는 문서 (2026-08-05)

**아래는 종료된 건이다. 수치가 옛 값으로 남아 있어도 정정하지 않는다** — 제출본과 저장소가 어긋나면 오히려 혼선이 된다.

| 문서 | 상태 | 검사기 |
|---|---|---|
| `job-search/토스_지원서_답변_초안.md` · `토스_지원서_항목별_원고.md` · `토스_면접_스크립트_기획안.md` | **종료 (탈락)** | `frozen` — ② 제외 |
| `job-search/엔비티_커피챗_준비.md` | **종료 (진행 완료)** | `frozen` — ② 제외 |
| `carfia/archive/*` | 과거 시점 기록 — 그대로 보존 | **frozen 아님.** 폐기수치 감시는 계속 |

이 목록은 `portfolio/kpi-registry.json`의 **`frozen.files`** 에 기계가 읽는 형태로 박아뒀다.
아카이브를 넣지 않은 이유: 시점값(`329`)은 놔둬도 되지만 폐기수치(`387건`)는 아카이브에도 퍼지면 안 되기 때문이다.

**앞으로 쓸 문서**(리멤버·위시캣·포트폴리오 덱·웹)는 아래 확정값으로 통일한다.

### 1. 수치는 CTA 대장으로 검증한다

단일 소스는 [`carfia/board/CTA_PERFORMANCE_LEDGER.md`](carfia/board/CTA_PERFORMANCE_LEDGER.md)와 추출본 `source_materials/cta/`다.
원천은 **카피아 관리자 대시보드**이며, 엑셀 `AI 도입 전후 비교 (6월).xlsx`는 **과거 시점 기록으로만 보관**한다 (2026-08-05 전환).

**코호트 정의** — old = UTM `5o` 하나 / new = `카피아게시판(new)` 그룹.
⚠️ `카피아 게시판(old)` **그룹**을 old로 쓰면 안 된다. 상시 노출 버튼 UTM이 섞여 있다.

| 항목 | 확정값 |
|---|---|
| 6월 수기 클릭 / 전환 | 17건 / 0건 |
| 6월 AI 발행 클릭 / 전환 | **339건 / 4건** |
| 전환율 | 1.2% |
| 성장 배수 | 약 20배 |
| 도입 전 1~6월 누적 | 92건 / 6건 |
| 누적 대비 | 3.7배 |

> 2026-08-05: 6월 CTA **329 → 339 소급 반영** (관리자 대시보드 기준).
> 단일 소스는 [`carfia/board/CTA_PERFORMANCE_LEDGER.md`](carfia/board/CTA_PERFORMANCE_LEDGER.md)로 이관했다.
> **엑셀의 요약·피벗을 근거로 삼지 않는다 — 일별 원본으로 재집계한다.**

과거에 근거 없는 **387건**이 문서 9곳에 퍼진 사고가 있었다.
경위: `claude_history_transfer/13_내부_콘텐츠_자동화_발행_시스템_성과_포트폴리오.md` 6절.
**엑셀로 검증되지 않는 숫자는 쓰지 않는다.**

`AI_PROJECT_HISTORY.md`에 `[미검증]` 표시된 항목 2건(사용자 429→482명, CVR 9.7→18.8%)은
원천이 저장소에 없다. 인용 금지.

### 2. 사내 자산 이미지가 공개 웹에 올라가 있다

`web_prototype/img/`의 일부는 카피아·핌아시아 사내 자산이다:

- `admin.webp` — 어드민 CMS UI
- `sheet.webp` — 정산/상담 DB 시트
- `ad-beauty.webp`, `reels.webp` — 실제 집행 광고 소재 (모델 초상 포함)
- `onsite.webp` — 온사이트 매출 지표 화면

지금은 3중으로 검색 노출을 막아둔 상태다 (`robots.txt` + `vercel.json` 헤더 + `<meta>`).
다만 **URL을 아는 사람은 접근 가능**하다. 정식 공개 전 공개 범위 확정 필요.

---

## 완료된 것

### 문서 정합성 (2026-07-21)

- [x] 전 문서를 원천 검증값(329건 기준)으로 통일 — 커밋 `9da8fd3`, `26af6bb`
- [x] 누적 클릭 90→91건, 누적 전환 12→6건 정정
- [x] 일별 추이 표현을 실측 범위로 정정 (월초 1~8건 → 월말 14~30건)
- [x] 원천 엑셀을 `source_materials/`에 포함해 git 추적
- [x] 재발 방지 — 아카이브 13에 근거·일별 실측값·오류 이력 고정

### 웹 시안

- [x] 기획서 작성 — `PORTFOLIO_WEB_PLAN.md`
- [x] 레퍼런스 영상(snap.dsgn) 프레임 분석 → 기하 수치 도출
- [x] 대각선 앨범 스택 + 커서 리프트 (데스크톱)
- [x] 세로 캐스케이드 (모바일, 861px 경계)
- [x] 카드 13장 + CSS 그라데이션 5종
- [x] 상세 페이지 5블록 규격 + 13개 데이터 전량 작성
- [x] Vercel 배포 + noindex 3중 차단
- [x] 구현 규격서 — `web_prototype/SPEC.md`

### 잡은 버그

| 증상 | 원인 |
|---|---|
| 뒤쪽 카드에 커서가 안 닿음 | `.stack`이 z=0 평면에서 포인터를 가로챔 → `pointer-events:none` |
| 리프트가 툭 튐 | 스택 위치와 리프트가 같은 transform 공유 → 레이어 분리 |
| 리프트한 카드가 앞 카드에 가려짐 | `--liftZ` 고정값 → 깊이별 동적 계산 |
| 텍스트에 형광펜 자국 | 드래그 중 텍스트 선택 → `user-select:none` |
| 커서만 움직여도 계속 드래그 | `alert()`이 pointerup을 삼킴 → 오버레이로 교체 |
| 모바일에서 페이지 새로고침 | 당겨서 새로고침 충돌 → `overscroll-behavior` + `touch-action` |
| 입력이 가끔 전부 무시됨 | rAF 끊김 시 `running` 플래그 고착 → 250ms 워치독 |

---

## 다음 할 일

### 🔴 이어서 할 것 (2026-07-29 세션 인계)

**저장소 밖 (브라우저에서 직접)**

- [ ] **원티드 이력서 "작성 완료" 클릭** — 수치 정정은 끝났고 임시 저장까지 됐다.
      최종 반영 버튼만 남음. https://www.wanted.co.kr/cv/AwEMDAMDBwRIBgEGAwcFBElC
- [x] 리멤버 소개 2종 저장 완료 (채용 서비스용 1,297자 · 커넥트용 809자 — 별도 관리 ON)

**저장소 안**

- [ ] **`#work-N` 딥링크 복원** — `web_prototype/index.html`. 상세를 열면 URL은 바뀌는데,
      그 URL로 새로 접속하면 목록만 뜬다. 로드 시 해시를 읽어 `openDetail()`을 호출하는 3줄이 없다.
      포트폴리오 링크를 특정 프로젝트로 보낼 수 없는 상태다.
- [ ] 상세 `rs`가 1행뿐인 프로젝트 6개 보강 (SEO/GEO · 데이터파이프라인 · CRM메일링 · 온사이트 · 체체 · 요옆).
      KPI 칩이 1개만 나와 빈약하다. 온사이트는 마스터에 `+12%p`가 더 있다

### 📌 지원 후보 (2026-07-29 리멤버 조사)

방향: **리드 중개 플랫폼 > B2B SaaS > 버티컬 커머스.** 시리즈 A~C · 마케팅팀 3~10명이 최적.

| 순위 | 회사 | 포지션 | 메모 |
|---|---|---|---|
| 1 | **패스트뷰 [차살때]** | 퍼포먼스/그로스 마케터 | 신차 구매 플랫폼 — **카피아와 동일 도메인.** KPI가 DB 수·전환율·CPA. 시리즈 A, 토스 출신 팀 |
| 2 | 채널코퍼레이션 [채널톡] | Growth Marketer | B2B SaaS, 콘텐츠·SEO 주력 → GEO 역량 직결. 조사 시점 **D-2 마감** |
| 3 | 힐링페이퍼 [강남언니] | 플랫폼 CRM 마케터 | 시술 중개 플랫폼. CRM 성과 직결. ⚠️ **Braze 실무 요구 — 갭** |
| 4 | 휴머스온 / 콘레브[베이글챗] | 그로스 마케터 | 마테크 SaaS / AI 콘텐츠 플랫폼 — AX 색깔 살릴 곳 |

제외: 무신사·컬리 등 대형 커머스 (역할 분화로 강점 8할이 잘림), 에이전시, 제조 대기업

### 우선순위 1 — 콘텐츠

- [ ] **상세 페이지 본문을 유진님 목소리로 다듬기**
      현재 `D[]`의 문제·가설·실행은 AI가 마스터 원고에서 추론해 쓴 초안이다.
      특히 **가설 문장**은 실제 사고 과정과 뉘앙스가 다를 수 있으므로 본인 확인 필수
- [ ] 이미지 공개 범위 확정 (위 ⚠️ 2번)

### 우선순위 2 — 이미지 보강

- [ ] 썸네일 없는 카드 5장 처리
      콘텐츠자동화 / 인플루언서플랫폼 / CRM앱푸시 / CRM메일링 / 커뮤니티
      → 지금은 그라데이션. **원본 덱 HTML을 브라우저로 렌더링해 해당 영역만 스크린샷**으로
        뽑으면 실제 비주얼 확보 가능 (`portfolio_doyujin_toss_growth_2026.html`)
- [ ] **다중 이미지 갤러리 지원** — 현재 스키마는 프로젝트당 이미지 1장만 가능.
      상세 페이지에 Before/After 등 여러 장을 넣으려면 `img` 필드를 배열로 확장해야 함

### 우선순위 3 — 마감

- [ ] Pretendard 자체 호스팅 + 한글 서브셋 (현재 jsdelivr CDN 의존, 약 120KB)
- [ ] 실제 기기에서 터치 동작 확인 (Claude Code 브라우저 패널은 rAF가 정지해 검증 불가)
- [ ] 접근성 — 키보드 조작·`prefers-reduced-motion`·스크린리더 (`PORTFOLIO_WEB_PLAN.md` 7장)
- [ ] 정식 공개 시 noindex 제거 + 커스텀 도메인

### 보류 중

- [ ] Next.js 전환 — 프로젝트별 고유 URL·SEO·OG 이미지가 필요해지면.
      비교표는 `PORTFOLIO_WEB_PLAN.md` 5장

---

## 문서 지도

> **2026-07-29 폴더 재구성.** 문서를 영역별로 옮겼다. 아래는 새 경로다.

### 루트

| 문서 | 내용 |
|---|---|
| **`WORK.md`** | 이 문서 — 저장소 허브 · 포트폴리오 웹 진행 상황 |
| `AI_COLLABORATION_RULES.md` | AI 협업 규칙 |

### [`carfia/`](carfia/) — 카피아 프로젝트 → [지도](carfia/README.md)

| 문서 | 내용 |
|---|---|
| [`carfia/board/GSC_BOARD_OPS.md`](carfia/board/GSC_BOARD_OPS.md) | 게시판 운영 — CTA 10,000 전략 (목표 2026-09-15) |
| [`carfia/board/GSC_PERFORMANCE_LEDGER.md`](carfia/board/GSC_PERFORMANCE_LEDGER.md) | 📊 **GSC 성과 대장** — 데이터를 받을 때마다 병합 |
| [`carfia/board/GEO_INSIGHTS.md`](carfia/board/GEO_INSIGHTS.md) | AI 검색 인용 인사이트 13항목 |
| [`carfia/cms/CARFIA_CMS_OPS.md`](carfia/cms/CARFIA_CMS_OPS.md) | CMS 운영 지식 — 인프라·발행 자동화·콘텐츠 규칙·구현 함정 |
| [`carfia/intro-page/SERVICE_INTRO_PAGE.md`](carfia/intro-page/SERVICE_INTRO_PAGE.md) | 카피아 소개 페이지 기획·작업 로그 |
| [`carfia/archive/`](carfia/archive/) | 프로젝트별 상세 아카이브 (**13번이 수치 근거**) |

### [`portfolio/`](portfolio/) — 포트폴리오

| 문서 | 내용 |
|---|---|
| [`portfolio/PORTFOLIO_MASTER_2026.md`](portfolio/PORTFOLIO_MASTER_2026.md) | 포트폴리오 텍스트 마스터 원고 |
| [`portfolio/PORTFOLIO_WEB_PLAN.md`](portfolio/PORTFOLIO_WEB_PLAN.md) | 웹 기획 배경 — 구조·수치 근거·대안 비교 |
| [`portfolio/kpi-registry.json`](portfolio/kpi-registry.json) | 🔒 **성과 수치 단일 출처** — 여기를 먼저 고친다 |
| [`portfolio/AI_PROJECT_HISTORY.md`](portfolio/AI_PROJECT_HISTORY.md) | KPI 원장(사람이 읽는 사본) + **수치 검증 규칙** |
| [`portfolio/decks/`](portfolio/decks/) | 제출 덱 HTML 2종 |
| `web_prototype/SPEC.md` | 구현 규격 — 구조·상수·인터랙션 계약 |

### [`job-search/`](job-search/) — 구직

토스(면접 기획안·지원서) · 엔비티 커피챗 · 리멤버 프로필 · 위시캣

### 공용

| 위치 | 내용 |
|---|---|
| [`tools/`](tools/) | 🔧 `check-kpi.js` — 수치 드리프트·폐기 수치 검사기 |
| [`prompts/`](prompts/) | ♻️ 재사용 프롬프트 (GEO 원고 생성기 — 원문 보존) |
| [`source_materials/`](source_materials/) | 원천 데이터 — 6월 엑셀 · **GSC CSV 6종** · PDF |

### ⚠️ 이동 금지

| 경로 | 이유 |
|---|---|
| `web_prototype/` | **Vercel 배포 Root Directory** — 옮기면 배포가 깨진다 |
| `carfia-intro/` | Next.js 빌드 루트 |

---

## 배포 (Vercel)

- **공개 주소: https://doyujin-portfolio.vercel.app** (noindex 상태)
- Vercel 프로젝트명: `doyujin-portfolio` (팀 `yjdos-projects`)
- Root Directory: `web_prototype/` (저장소 루트 아님 — index.html이 이 하위에 있음)
- 배포 산출물: 정적 (빌드 없음). Output Directory = `web_prototype` 그대로

### GitHub 연동 상태

**2026-07-22 완료.** Vercel REST API로 직접 연결함 (`POST /v9/projects/{id}/link`,
`PATCH /v9/projects/{id}` rootDirectory). 이 커밋이 그 연동을 검증하는 테스트 푸시다.

`git push origin main` → Vercel이 자동 재배포한다. 더 이상 `vercel --prod` 수동 배포 불필요.
Root Directory는 `web_prototype`으로 지정돼 있다 (저장소 루트가 아님 — index.html 위치).

## 환경

- Windows 11 / PowerShell (`rm -rf` 안 됨 → `Remove-Item -Recurse -Force`)
- Python 3.13 (`pypdf`, `openpyxl`, `Pillow` 설치됨 — PDF·엑셀 분석용)
- ffmpeg (winget `Gyan.FFmpeg` — 레퍼런스 영상 프레임 추출용)
- Vercel CLI (프로젝트 `doyujin-portfolio`에 연결됨, `web_prototype/.vercel/`)
- git remote: `github.com/doxzn-commits/portfolio_2026` (**비공개**)
