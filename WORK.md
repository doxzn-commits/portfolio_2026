# WORK — 진행 상황과 다음 할 일

> 이 저장소를 이어받는 사람(또는 AI CLI)이 **가장 먼저 읽을 문서**
> 최종 갱신: 2026-07-21

---

## 지금 무엇을 하고 있나

도유진(그로스 마케터)의 **포트폴리오 웹사이트**를 만들고 있다.
토스 지원용 PDF 포트폴리오는 이미 제출됐고, 지금은 그 내용을 인터랙티브 웹으로 옮기는 중이다.

- 배포: **https://doyujin-portfolio.vercel.app** (noindex 상태 — 아래 ⚠️ 참조)
- 코드: `web_prototype/index.html` (단일 파일)
- 상태: **동작하는 시안 완성.** 콘텐츠 다듬기와 이미지 보강이 남음

---

## ⚠️ 착수 전 반드시 알아야 할 것 2가지

### 1. 수치는 원천 엑셀로만 검증한다

`source_materials/AI 도입 전후 비교 (6월).xlsx`가 **유일한 근거**다.

| 항목 | 확정값 |
|---|---|
| 6월 수기 클릭 / 전환 | 16건 / 0건 |
| 6월 AI 발행 클릭 / 전환 | **329건 / 4건** |
| 전환율 | 1.2% |
| 성장 배수 | 약 20배 |
| 도입 전 1~6월 누적 | 91건 / 6건 |
| 누적 대비 | 3.6배 |

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

| 문서 | 내용 |
|---|---|
| **`WORK.md`** | 이 문서 — 진행 상황·다음 할 일 |
| `web_prototype/SPEC.md` | 구현 규격 — 구조·상수·인터랙션 계약·검증 스크립트 |
| `PORTFOLIO_WEB_PLAN.md` | 기획 배경 — 왜 이 구조인지, 수치 근거, 대안 비교 |
| `AI_PROJECT_HISTORY.md` | KPI 원장 + **수치 검증 규칙** |
| `AI_COLLABORATION_RULES.md` | AI 협업 규칙 |
| `PORTFOLIO_MASTER_2026.md` | 포트폴리오 텍스트 마스터 원고 |
| `portfolio_doyujin_toss_growth_2026.html` | 토스 제출 덱 (PDF 원본) |
| `claude_history_transfer/` | 프로젝트별 상세 아카이브 (13번이 수치 근거) |

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
