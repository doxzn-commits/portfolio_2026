# CARFIA CMS — 축적 운영 지식

> 카피아 마케팅 콘텐츠 자동 발행 시스템의 **운영·규칙 지식 베이스**
> 최종 갱신: 2026-07-28
> 자매 문서: [`GSC_BOARD_OPS.md`](../board/GSC_BOARD_OPS.md) (CTA 10,000 전략) · [`WORK.md`](../../WORK.md) (포트폴리오 웹)

각 항목의 `project_*` / `feedback_*` / `reference_*` 키는 원본 메모리 식별자다. 검색용으로 유지한다.

---

## ⚠️ 먼저 읽을 것 — 2026-07-28 방향 전환

**사전 시드 슬롯 방식은 폐기됐다. 온디맨드 요청 버튼 방식이 유일 경로다.**

→ `GSC_BOARD_OPS.md`의 슬롯 확정 대장(157슬롯 · 4-3절)과 autodraft 창 운영 절차는 **이 전환 이전에 작성된 것**이다. 그대로 실행하지 말 것. 자세한 내용은 [B-4](#b-4-대장-온디맨드-원고-요청) 참조.

---

## A. 인프라 · 운영

### A-1. 포트
`project_api_port`

- CARFIA **API 실제 포트는 4517** — 스킬 문서에 적힌 3000이 아니다
- 대시보드 **3001**

### A-2. 프로세스 감시 (pm2)
`project_api_supervisor_pm2`

**"API 연동 끊김"의 근본 원인은 크래시가 아니라 감시자 부재다.**

API를 터미널에 묶인 수동 프로세스로 띄우면 세션 닫힘·재빌드·watch 에러 때 죽고 자동 복구되지 않는다.

- pm2(`carfia-api`)로 운영 → 죽어도 자동 재기동
- kill 후 pm2가 되살리는 것 실증 완료

### A-3. 재기동 표준 절차
`project_server_restart`

```bash
# ① 코드 받기
git pull

# ② API — 빌드본이라 재빌드 필수
cd apps/api && npx nest build && pm2 restart carfia-api

# ③ Dashboard — 프런트 소스 변경 시 반드시 빌드
cd apps/dashboard && npx next build && pm2 restart carfia-dashboard
```

⚠️ **현재 pm2 `carfia-dashboard`는 `next start`(프로덕션 빌드)로 떠 있다. dev가 아니라 핫리로드가 안 된다.**
프런트 소스를 고치고 빌드를 안 하면 화면에 반영되지 않는다 — 2026-07-28에 확인한 근본 원인.

⚠️ **종료는 pm2로만.** `pkill -f dist/main` 금지 — 자기 자신을 죽인다.

### A-4. Prisma 마이그레이션
`project_prisma_migrate_broken`

- `migrate dev`는 shadow DB 재생성에 실패한다
- 스키마 변경은 **`db push` (+ 수동 `migration.sql`)** 로 처리

### A-5. 대시보드 전체 공백 — 1순위 원인
`project_prisma_generate_blank_dashboard`

**증상: 대시보드 콘텐츠가 통째로 비어 보임**

원인 체인:
```
prisma 스키마 수정 → generate 누락 → API 빌드 실패 → 4517 다운 → 대시보드 공백
```

복구 순서: 스키마 확인 → `prisma generate` → `nest build` → `pm2 restart`

### A-6. 환경변수 · 토큰 경계
`project_dashboard_env_loading`

- 발행 토큰과 forward 설정은 **`apps/api` 단독 관리**
- 대시보드는 thin-proxy
- mTLS 미구현 (보류)

### A-7. 협업 규칙
`feedback_pull_merge_strategy` · `feedback_subagent_no_git_restore`

- **풀 시 로컬 수정과 커밋이 충돌하면 양쪽 의도를 보존해 병합한다.** 어느 쪽도 버리지 않는다
- **서브에이전트 디스패치에 `git restore` / `stash` / `clean` 실행 금지.** 오독 사고 이력이 있어 복구 절차의 기준으로 명시

---

## B. 발행 자동화 · 대장

### B-1. 자동 예약 스케줄러 ★ 핵심
`project_image_ready_batch_schedule`

**대상**: 발행대기 상태 + 게이트 통과분
- 뉴스 `REVIEWED` / 기획 `READY` / 프로모션 `reviewed` 또는 `imageReadyAt ≠ null`

**동작**: 서버 크론 `AutoScheduleService`가 **매분** 자동 예약

| 항목 | 값 |
|---|---|
| 슬롯 앵커 | **11 · 13 · 15 · 18 · 20시 (KST)** |
| 하루 상한 | **5건** (오늘 실제 발행분 + 예약 합산). 6번째부터 다음날 |
| 재시도 | `FAILED` / `CANCELED`는 **자동 재시도 안 함** |
| overdue | 30분 초과 시 다음 슬롯 재배정 (`originalScheduledAt` 마커) |

**발행 게이트**
- 히어로 이미지 (`https` 또는 `uploads`)
- CTA-on이면 CTA `href`가 `http(s)`

`setImageReady`는 **서버측에서 게이트를 검증**한다 — 이미지 없이 완료 처리하면 400. 조용한 스턱 방지 장치다.

**대장 표시**: 오늘 타임라인 = 예약 + 발행완료(실제 발행시각 `prodPublishedAt`). 인라인 완료 버튼은 체크리스트·목록 카드 양쪽에 있다.

### B-2. 예약 발행 정책
`project_scheduled_publish`

- **"예약 시점 스냅샷" 정책** — 등록 시점의 본문 그대로 발행된다. 이후 본문을 고쳐도 반영 안 됨
- `@nestjs/schedule` 크론, 매분 실행, **틱당 1건 스태거**
- ⚠️ **테스트 시 SSRF 폴백으로 실제 내부 게시판에 발행되는 함정이 있다**

### B-3. 발행 대장
`project_publish_ledger`

- `docs/publish-ledger.json` + `/ledger`
- **3채널 발행계획·실적·AI인용 추적의 단일 소스**
- `citedAt` · `viewCount` 인라인 편집 가능
- 파일 → Prisma 이관 예정

### B-4. 대장 온디맨드 원고 요청 ★ 2026-07-28 전환
`project_ledger_draft_request`

```
대장 "📰 뉴스 수집→원고 요청" 버튼
   → DraftRequest(pending) 생성
   → SessionStart 훅이 다음 세션에 표시
   → Claude가 top N 수집 · GEO 작성 · ingest
   → done (resultArticleIds 기록)
```

**⇒ 사전 시드 슬롯은 폐기. 온디맨드 방식이 유일 경로다.**

### B-5. ingest 함정
`project_manual_ingest_category` · `project_article_id_slash_pitfall`

- 수동 ingest는 **`category='news'` 슬러그 필수** — 라벨을 넣으면 id가 깨진다
- **카테고리에 `/`(슬래시)를 넣으면 id에 박혀 상세 페이지가 안 열린다**

### B-6. 발행 403 / 업로드 413
`project_publish_403_localhost_image` · `project_upload_413_no_trace`

| 증상 | 근본 원인 | 대응 |
|---|---|---|
| 발행 403 | `api.carfia.co.kr` 신규 **~5KB 본문 크기 제한** (서버 WAF/nginx 회귀). `style`/`script`/`localhost`도 차단 | `stripDisallowedTags` 적용. 근본 해결은 **원격 ops에서 크기 제한 상향** |
| 업로드 실패인데 로그·파일이 0 | 크기 제한 (413) | 전 엔드포인트 **30MB 상향** |

### B-7. 이미지 미러링
`project_image_mirror_report`

- 본문 이미지 S3 미러링 경로 존재
- 실패 시 발행 응답에 `_imageMirror.failed` 노출 — 계약으로 고정

### B-8. 편성 규칙
`feedback_schedule_brand_diversity` · `feedback_ledger_slot_link`

- **하루에 같은 브랜드/클러스터(BMS·EV5 등)를 몰지 말 것.** SEO 클러스터는 여러 날에 분산하고, 하루는 순위 · 구매/리스 · 관리 축을 섞는다
- **대장에 주제 슬롯이 있으면 `collect`로 고아 초안을 만들지 말고 슬롯 `contentId`에 링크한다** (collect 신규 생성 금지)

---

## C. 콘텐츠 규칙

### C-1. 1차 목표 = AI 검색 인용
`project_ai_citation_goal`

> 📎 **상세 인사이트는 [`GEO_INSIGHTS.md`](../board/GEO_INSIGHTS.md) 로 분리했다** (시도→결과→적용 13항목).
> 재사용 프롬프트: [`prompts/geo-article-system-prompt.md`](../../prompts/geo-article-system-prompt.md)
> 아래는 요약이다.

**콘텐츠의 1차 목표는 AI 검색 인용 수집이다.**

실증: "2026 주목 수입 신차 라인업" 검색에서 carfia 글이 인용됨 — **H2가 검색어와 1:1**로 대응한 케이스.

⚠️ 인용은 **확률적**이다. 노출마다 흔들리므로 **N일 · N쿼리 점유율**로 평가한다.

**레버 5가지**
1. 신선도 — `dateModified` 갱신
2. 쿼리형 헤딩 증식
3. 수치 정확성
4. 모델별 분리 + 상호 링크
5. FAQ 스키마 7개 이상 + 표 + 출처

> 이건 가설이다. 고착시키지 말고 다양한 앵글을 시도해 학습할 것.

### C-2. 지침의 성격
`feedback_flexible_guidelines`

GEO/인용 지침은 **참고용**이다. 고착시키지 말고 케이스별로 유연하게 적용하며, 다양한 시도로 학습한다.

### C-3. 문체
`feedback_article_body_jondaetmal` · `feedback_no_source_footer`

- **기사 본문 기본 문체 = 존댓말(합니다체). 한다체 금지**
- 단, AI식 헤지·양비론은 걷어낼 것
- **기사 메타에 출처 매체명 · "카피아 재구성" 텍스트 금지**
- **footer(면책 · 원문링크) 전체 제외**

### C-4. 사업 범위 · CTA
`feedback_carfia_scope_no_insurance` · `feedback_title_cta_defaults`

- 카피아 = **리스 / 렌트 / 할부 / 구매 비교** (+ 딜러 에이전트)
- **보험 상담은 하지 않는다 → 보험 CTA 금지**
- CTA 블록은 전 글에 포함하되 `ctaEnabled` 토글로 on/off
- **제목 연·월 접미는 제거가 디폴트**
- CTA는 한 줄(기사별 맞춤) + **"최저가 견적 보기"** 버튼

### C-5. 강조 표기
`feedback_content_emphasis`

전 콘텐츠 공통: **노란 형광펜(`<mark>`) + 볼드로 핵심 결론·수치만 절제해서 강조** (과용 금지)

```css
mark { background: #fff3bf; }
.hl  { color: #3182f6; }
```

### C-6. 독자 프레이밍
`feedback_no_import_only_framing`

**카피아 독자를 수입차 독자로 단정해 국산차 글을 제한하지 말 것.** 리스·렌트·할부 비교 관점으로 일반화한다.

### C-7. 유형별 규칙

| 유형 | 규칙 | 키 |
|---|---|---|
| 판매량·통계 | **막대 차트 시각화 필수** — 초입 후킹 차트 + 섹션별. 순수 HTML/CSS 인라인, 파란 톤 | `feedback_sales_article_chart` |
| 단일 모델 | **뉴스 ▸ 모델정보 탭** (`kind=single` 완결 문서). 일반 뉴스/프로모션 탭 아님 | `feedback_single_model_article_routing` |
| 월간 프로모션 | **자동생성 draft 그대로 발행 금지.** 매달 Claude가 전월 대비 + GEO 리라이팅 (⚠️ FAQ 먼저 → 본문 순서 함정) | `feedback_promotion_unique_content` |
| 기획 기사 | 본문 **2,500~3,500자**. 1,500자대면 GSC 얇은 콘텐츠 우려 → 표·H3·FAQ 6~7 · 카피아 데이터로 보강 | `feedback_planned_article_length` |

### C-8. 중복 방지
`feedback_avoid_topic_dupe`

**리토픽/신규 전에 이달 기발행분 + 예정 슬롯과 중복 대조 필수.**
판매/가격 순위는 중복이 잦다 → **구매결정 · 비교형이 안전**.

---

## D. 성과 측정

### D-1. 게시판 조회수
`project_board_view_count_hit`

**게시판 조회수는 페이지 RSC 페이로드의 `hit` 필드다.** `viewCount`가 아니다.

```
snapshot-board-views.py → hit 추출 → 대장 viewCount 반영
                        → ViewSnapshot 시계열 누적 (/view-snapshots, 하루 1점)
                        → /performance 대시보드 스파크라인 · Δ
```

⚠️ **WebFetch 요약 숫자는 파비콘 256을 오인하는 환각 주의** — `hit` 정규식으로 직접 추출할 것.

**GSC 검색 클릭은 사장님 수동 수령** (API 접근 불가). `hit`은 노이즈 있는 대리지표이므로 **판단은 신규글 주간 Δ로** 한다.

### D-2. 디스커버 노출
`project_discover_exposure`

- 디스커버 첫 노출 실증 — 자율주행 총정리 글
- 가설: **멀티브랜드 × 판도형 포맷**
- `og:image` 보강 여지 있음

### D-3. 스프린트
`project_sprint_automation`

- **9/15 검색 클릭 1만** 스프린트
- ⚠️ **2026-07-28 방향 전환: 사전 시드 슬롯 폐기 → 온디맨드 요청 버튼 방식**
- 발행 유형 매핑
  - 비교 · 판매량 · 신차 · 출시 → **뉴스**
  - 구매/관리 꿀팁 · 리스렌트 → **기획**

### D-4. 고유 데이터 소스
`reference_lease_price_source`

`carfia.co.kr/lease-rent-guarantee` = **카피아 리스 월가격 실데이터** (모델Y 46만~ 등)
→ 리스/구매 글에 **고유 수치로 인용**할 것. 경쟁 콘텐츠가 못 쓰는 자산이다.

---

## E. 구현 함정

> 2026-07-28 원본 재수신으로 **E-1 ~ E-3은 전량 복원**됐다.
> E-4 ~ E-6에 아직 잘린 문장이 남아 있고 `⟨유실⟩` 로 표시했다. 목록은 [E-7](#e-7-아직-복원-안-된-항목) 참조.

### E-1. 파이프라인 · 수집

#### 뉴스 자동발행 파이프라인 v6 — 핵심 워크플로우
`capia_pipeline`

**사용자 개입은 딱 2곳.** 그 외 전체 자동발행은 **절대 금지**다.
1. CLI에서 기사 번호 선택
2. 대시보드에서 이미지 검수 + 발행 승인

- 원문 파싱 실패 시 **자동 폴백**: 다음 기사 → 같은 카테고리 → RSS 요약
- **에러가 나도 사용자에게 절대 묻지 않는다**
- **H2는 키워드 리스트형 3줄 필수** — 문장형 금지
- `articles_db.json`은 **배열이 최상위**. 래핑 금지
- ⚠️ 이 메모리에 적힌 포트 3000은 **구값**이다 — 실제 4517 ([A-1](#a-1-포트))

#### 번호 재부여 함정 ★
`collect_renumber_pitfall`

`scripts/collect-and-publish.ts`가 **매 실행마다 목록을 새로 만든다.**
1차(목록 보기)와 2차(선택)가 서로 다른 스냅샷이 되어 **같은 N이 다른 기사를 가리킨다.**

> 실증 (2026-06-24): `"2"` 입력이 부산 모빌리티쇼가 아니라 **보험료 기사**로 들어감.

**해결** — 목록 빌드 시 `.cache/collect-list.json` 스냅샷 저장 (TTL 1h)

```bash
npx tsx scripts/collect-and-publish.ts              # 목록 표시 + 캐시 저장
npx tsx scripts/collect-and-publish.ts --select 3   # 캐시 스냅샷의 N번 ingest
#                                      --select 1,3,5 | all
```

❌ `echo "N" | ...` 방식 금지 (불안정)

#### 뉴스 발행 기본 프로세스
`pipeline_flow`

```
① RSS 수집 → 브랜드 필터 → 중복 제거 → 최대 20건 목록 표시
② 사용자가 CLI에서 번호로 선택        ← 전체 자동발행 절대 금지
③ 선택 기사 원문을 WebSearch/WebFetch로 크롤링
④ 원문 기반으로 템플릿 구조에 맞춰 신규 HTML 재생성
⑤ PATCH /articles/:id  (articleHtml · title · summary)
⑥ 대시보드에서 미리보기 확인
```

**④의 구조**
```
H1 → 3줄 요약 deck → 메타 → 히어로 → 본문 H2들
   → 표 → 핵심요약 박스 → FAQ → 태그 → CTA
```
SEO 스키마: **NewsArticle + FAQPage**

⚠️ **RSS 폴백으로 넣으면 링크 텍스트만 들어가 미리보기·수정이 불가능하다. 반드시 원문 크롤링 후 재작성.**

#### 쓸 기사가 없을 때
`no_recommended_article`

"추천 기사 중 쓸 게 없다 / 새 리스트 달라"면 **기본 "자동차" 피드를 다시 돌리지 말고 다른 검색 키워드로 재수집**한다.

1. 사용자에게 수집 주제를 물어본다 — 수입차 신차 / 리스·렌트 / 전기차 보조금 / 프로모션 등
2. 재수집 (env 오버라이드는 커밋돼 있음)
   ```bash
   FEED_QUERY="검색어" npx tsx scripts/collect-and-publish.ts
   ```
3. 상위 20건(`MAX_DISPLAY`)만 표시 → 원하는 기사가 밖이면 **더 구체적인 검색어로 좁힌다**
4. 이후 `echo "번호" | FEED_QUERY=... npx tsx ...` 로 ingest

---

### E-2. 자동초안 · 기획 콘텐츠

#### autodraft 창 누락 ★
`autodraft_window_gap`

`scripts/autodraft-tomorrow.py`는 **매일 08:00에 오늘+1(내일) 발행예정 `cartip` · `contentId` 없음 슬롯만** 초안 생성한다.

**함정 1 — 창(window) 누락**
클러스터 슬롯을 **당일 08:00 cron 실행 이후에 시드**하면, 그날 cron은 이미 지났고 다음날 cron은 오늘+1만 본다. → **그 슬롯은 아무도 초안을 안 만든다.**

> 실증: 2026-07-22에 시드한 7/23 판매순위 4건이 통째로 비어 수동 작성함.

→ 시드는 **cron(08:00) 이전**에 하거나, 시드 당일 `python3 scripts/autodraft-tomorrow.py <해당날짜>` 수동 실행.

**함정 2 — CLI 타임아웃**
서버 writer(claude CLI 헤드리스)는 `TIMEOUT_MS`(10분) 초과 시 실패 → 상태 `DRAFT` 복귀 + `generateError`.

> 실증: 7/22 운용리스 등 긴 비교/리스 글에서 발생.

→ 타임아웃 건은 재시도해도 또 걸릴 수 있다. **Claude(대화)가 직접 작성해 PATCH가 빠르다.**
→ 레코드가 이미 대장에 링크돼 있으면 collect 없이 `PATCH /planned-content/:id` 만 하면 된다.

**검증 함정**
`GET /planned-content?take=N` (목록)은 **`bodyHtml`을 싣지 않는다** (len=0으로 보임).
→ 본문 유무는 반드시 **`GET /planned-content/:id` (상세)** 로 확인.

#### 대장 초안 자동 생성
`ledger_auto_draft`

대장의 **"초안 생성" 버튼**(꿀팁·뉴스)과 기획 상세의 **"🤖 본문 생성"** 은 본문까지 자동 작성한다.

**서버에 `ANTHROPIC_API_KEY`가 없어도 된다** — NestJS가 로컬 claude CLI를 헤드리스로 spawn한다:

```bash
claude -p … --output-format json --allowedTools WebSearch WebFetch Read
```
(cwd = 리포 루트라 `CLAUDE.md` 지침 자동 로드, 구독 인증)

- `DraftWriterService`: **동시 1개 직렬 큐, 10분 타임아웃**. 서버 기동 시 `GENERATING` 잔존 → `DRAFT` 리셋 (재시작 복구)
- 상태: `DRAFT → GENERATING → READY`(성공) / `DRAFT + generateError`(실패, 재시도)
- `POST /planned-content/:id/write-body` — **빈 DRAFT만 허용** (소급 생성)
- 뉴스 kind: Article 셸(`news-YYYYMMDD-NNN`, `GENERATING`) 생성. 완료 시 h1→title, meta description→summary, **`status=DRAFT`** (뉴스엔 READY 없음 — 검수 후 발행)

#### 기획 콘텐츠 (PlannedContent)
`planned_content`

뉴스·프로모션과 나란한 **3번째 타입**. 3단계: 수집 / 생성 / 발행.

**Claude 직접 작성 방식 (API 키 불필요)**
서버 `generate()`의 자동생성은 키가 없어 **항상 폴백(placeholder)** 이다. 실제 워크플로우는:

```
① Claude가 완결 HTML 원고 작성
② POST /planned-content/collect {keyword}                    레코드 생성
③ PATCH /planned-content/:id {title, bodyHtml, status:READY} 덮어쓰기
```

- 원고는 자체 `<style>`을 가진 **완결 HTML 문서** (`<!DOCTYPE…`)
- **렌더링**: 상세/생성 미리보기는 `<iframe srcDoc={bodyHtml} sandbox="allow-same-origin">`
  → `div` + `dangerouslySetInnerHTML`은 head/style이 깨지고 스타일이 누수된다
- 주제 방향: **차량 구매 꿀팁 · 구매 시 꼭 알 점 · 차량 관리 꿀팁 · 리스/렌트**
- **시각 요소 필수** (표 · 콜아웃 · 번호카드 · 요약칩)
- CTA는 주제별 on/off. **보험 상담 CTA 금지** ([C-4](#c-4-사업-범위--cta))
- 이미지는 본문 `<img>` 인라인. 발행 시 **운영 절대 URL 필수** (localhost 금지)

---

### E-3. 프로모션 (단일 · 엑셀)

#### 단일 차종 1건 프로모션
`single_promotion`

**작성 · 등록**
- 사장님이 모델명 제시 → Claude가 저장된 엑셀 데이터(`GET /promotions/:id`의 `rawData.sections`) 기반으로 완결 HTML 문서(자체 `<style>`) 작성 → `content-output/`에 저장
- 주입:
  ```bash
  npx tsx scripts/seed-single-promotion.ts <html파일> \
    [--brand= --yearMonth= --title= --model=]
  ```
- 레코드: 컬럼 `kind='single'` + `rawData.kind='single'`
- 대시보드 **"뉴스 ▸ 모델 정보" 탭**에 노출 (프로모션 탭 제외)

**발행 인라이너 안전 규약** — *미리보기는 멀쩡한데 발행본이 깨질 때 1순위*

| 규칙 | 이유 |
|---|---|
| CSS 변수 금지 → **리터럴 hex만** | 인라이너는 `:root`에서만 변수를 읽음 |
| `<style>` 안 CSS 주석(`/* */`) 금지 | 뒤 셀렉터를 깨뜨림 |
| `@media` 통째 제거됨 | 기본 스타일이 모바일에서도 깔끔해야 함 |
| 3단 갤러리·가로 N등분 카드는 grid/flex 금지 | `<table table-layout:fixed>` + `<td width:33.33%>` |
| 이미지 비율에 고정 px height 금지 | `aspect-ratio:3/2`. 라운드는 `<img>`에 직접 `border-radius` 인라인 |
| 표는 모바일 폭 초과 금지 | `table-layout:fixed` + `width:100%`, 셀은 `white-space:normal` + `word-break:keep-all` + `overflow-wrap:anywhere`. 트림표는 폰트 12px · 패딩 8px 5px면 **5열도 375px 안착** |
| 글래스 / 그림자 / `backdrop-filter` / 의사요소(`::before`·`::after`) 금지 | strip됨 → 솔리드 배경으로 |
| FAQ는 `<details class="faq-item">` | 인라이너가 화살표 스타일 주입 |

**CTA 표준 문구 · 정렬** (2026-06-12 확정)
```html
같은 <span>[모델명]</span>라도,<br> <span>카피아</span>의 가격은 다릅니다.
```
- **모델명만 가변.** "카피아의 가격은 다릅니다"는 고정 문구
- 정렬: **flex 금지** → `.cta-block{text-align:center}` + 버튼 `display:inline-block`
- 버튼 문구: **"최저가 견적 보기 →"**

> 🚨 **`bodyHtml` 통째 덮어쓰기 금지** (2026-06-12 교훈)
>
> 단일 프로모션 원고를 새 HTML 파일로 통째 PATCH/재시드하면, 사장님이 드롭존으로 올린 **슬롯 이미지(`hero`/`front`/`side`/`interior`의 실제 URL)가 전부 날아간다.**
> 슬롯 이미지는 **본문 HTML 안에만** 저장된다 (Image 테이블 미등록).
>
> → 재작성 전 반드시 라이브 레코드의 `bodyHtml`을 GET해 각 `data-slot`의 현재 `src`를 추출 → 새 본문에 **보존(merge)**.
> → 복구 경로: hero는 S3/cloudfront, inline 슬롯은 서버 로컬 `uploads/{promotionId}_inline_{ts}.{ext}`

**운영 주의**: API는 빌드본(`node dist/main`) → service 수정 시 `npx nest build` 후 재기동 필요 ([A-3](#a-3-재기동-표준-절차))

#### 단일 프로모션 히어로 = 전체 이미지
`single_promo_hero_fullimage`

`kind='single'` 대표(히어로) 이미지는 **원본 비율 그대로 전체가 잘림 없이** 노출한다 (사장님 확정).
뉴스/기획 히어로의 **4:3 cover 정책과 다르다** — 단일 프로모션엔 적용 금지.

```css
/* ✅ 올바름 */
.m-image     { width:100%; /* aspect-ratio 없음 */ }
.m-image img { width:100%; height:auto; display:block; /* object-fit 없음 */ }

/* ❌ 잘못됨 — 원본이 16:9가 아니면 잘림 */
.m-image     { aspect-ratio:16/9; overflow:hidden; }
.m-image img { height:100%; object-fit:cover; }
```

- 소스: `scripts/templates/model-info-glass.template.html`
- 복구: `scripts/backfill-single-promo-hero-fullimage.ts` — `bodyHtml`의 `.m-image` CSS **두 줄만 교체**, 이미지 src 보존. **재 seed 금지**
- 버그 이력: **제목 저장 시 완결문서 박살** — `update()`가 (섹션순서·제목 변경 시) 조각 생성기로 재생성 → 완결문서 소실. **수정: 재생성 조건에 `&& !isFullDoc(...)` 추가**

#### 단일 모델 CTA — 앵커 2곳
`single_model_cta_dual_anchor`

단일 모델 글(`model-info-glass`, `kind=single`)에는 "최저가 견적 보기" 앵커가 **두 곳**이다:
① 카드 상단 `<a class="cta-btn">` ② 하단 `<div class="cta-block"><a>` — 둘 다 `{{QUOTE_URL}}` 플레이스홀더.

**버그**: 대시보드 CTA 저장이 `cta-block` 앵커만 갱신해 카드 `.cta-btn`의 href가 placeholder로 남음 → 아우디 건을 수기 발행함.
→ **수정**: `applyPromotionCtaToBody`가 `applyQuoteBtnLink()`로 `.cta-btn` href도 동기화 (2026-06-26)

**작성 시 두 앵커 모두 실제 랜딩 URL로 채울 것. 플레이스홀더 금지.**

⚠️ **실제 CTA URL 규칙** (2026-07-27 라이브 기준)
```
https://carfia.co.kr/mkt/<코드>
```
모델별 마케팅 트래킹 단축코드다.

| 모델 | 코드 |
|---|---|
| BMW 320i | `d4` |
| 아우디 A3 | `c9` |
| 벤츠 E200 | `cb` |
| BMW X4 | `ca` |

**위 4개 외의 코드는 사장님/마케팅이 배정하므로 Claude가 알 수 없다.**
→ 작성 시 임시값을 넣고 사장님께 물어 두 앵커를 PATCH하거나, 대시보드 CTA 편집기로 교체.
→ 옛 `/quote?model=<slug>` 패턴은 **폐기**.

#### 프로모션 엑셀 단위
`promotion_excel_unit`

`rawData.sections[].models[]`의 `price` · `ownDiscount` · `partnerDiscount`는 **만원 단위 저장이 표준**이다.
`html-generator.service.ts`가 `formatNumber(value)` + **"만원" 라벨**로 출력하므로 값이 만원 단위라고 가정한다.

**함정** (2026-06-17)
- BMW · 아우디 · 벤츠 · 볼보: `price ≈ 4,000~4,800` → 만원 단위 (정상)
- **폭스바겐 6월만** `price=69,040,000` 등 '원' 단위로 업로드 → **"69,040,000만원"** 표기
- **코드 버그가 아니다. 엑셀 입력 단위 문제.**

**조치**
- 폭스바겐만 세부 원 금액 그대로 노출하고 단위를 '원'으로 (예: `108,353,000원`)
- ⚠️ `rawData`는 여전히 원 단위 → **제목/섹션순서만 바꿔 저장해도 템플릿이 재생성해 증상 재발.** `UpdatePromotionDto`엔 `rawData`가 없어 PATCH로 못 고침
- 근본 해결: ① 폭스바겐 엑셀을 **만원 단위로 재업로드**, 또는 ② prisma 스크립트로 `rawData ÷ 10,000` 정규화
- **신규 프로모션 업로드 시 엑셀 가격 단위(만원)인지 먼저 확인**

---

### E-4. 발행 CSS — 미리보기 ≠ 발행본

#### 6대 원인 ★
`publish_inline_css_pitfalls`

발행 `preprocessContent(inlineCssStyles)`가 `<style>` 규칙을 각 요소 `style=""`에 인라인한 뒤 head·body 래퍼를 제거한다. 완결 HTML 문서(단일모델·글래스 기사)가 미리보기와 달라지는 원인 6가지:

**1. `/* */` CSS 주석이 바로 뒤 규칙을 깨뜨린다**
`parseCssRules`가 주석을 제거하지 않아, 주석 텍스트가 다음 셀렉터에 섞여 매칭 실패 → 그 규칙이 인라인도 안 되고 재주입 `<style>`에도 없어 **통째로 사라진다.**
→ **`<style>` 안에 주석 절대 금지.**

**2. `body::before`(가상요소) · `body{}` 규칙은 인라인 불가 → 발행 시 사라진다**
배경 앰비언트를 `body::before`로 만들면 미리보기엔 보여도 발행본엔 없다.
→ 배경은 **실제 요소(`.wrap` 같은 컨테이너)의 `background`** 로 둘 것. 요소 background(솔리드/rgba)는 인라인되어 살아남는다.

**3. 박스 안 기본 disc `<ul>` 불릿이 게시판 테두리에 달라붙는다**
`.toc`/`.summary-box`의 disc ul을 게시판이 `ul,li{padding:0}`으로 리셋하면 마커가 테두리에 붙음.
→ `inline-styles.ts`의 **`injectBoxListBullets`** 가 disc ul을 `list-style:none` + 선두 span 불릿으로 치환.

**4. 인라이너는 자식 결합자(`>`) 미지원, `@media`는 통째 제거**
`.table-wrap>table{min-width}` 같은 자식결합자 규칙은 인라인 안 됨.
→ 넓은 표(4열↑)는 가로 스크롤 대신 **카드형**(행별 블록, 인라인 스타일만)으로 재구성. 게시판은 overflow 스크롤 컨테이너 자체를 지원 안 함.

**5. 게시판 sanitizer가 `<caption>` · `colspan`/`rowspan`을 제거 → 표가 줄바꿈·정렬 붕괴**
caption은 태그만 제거되고 텍스트가 표 밖으로 튕긴다. colspan 제거로 행마다 셀 수가 어긋난다.
→ `content-preprocess.ts`의 `lif⟨유실⟩div)` + **`expandColspanCells`**(`colspan="N"` → 셀 + 빈셀 N-1개)
→ 표엔 애초에 caption · colspan/rowspan ⟨유실⟩ (합계행은 평셀)

**6. 게시판 sanitizer가 `display:grid` · `grid-template-*` · `gap`(grid) · `transform` · `position:absolute`를 인라인 style에서 제거**
`display:grid` 카드 레이아웃이 발행본에서 속성 통째로 사라져 무너진다 (2026-07-02 개소세 비교 뉴스 실증).

> **생존하는 것**: `display:block` / `flex` / `inline-block` / `table`·`table-cell`, `background:linear-gradient`, `border-radius`, `rgba` 배경, `border-left`

→ 카드/비교 레이아웃은 **grid 금지**. ⟨유실⟩ `<table>`로.
→ **`@media` 반응형에 의존하지 말 것**(제거됨) — 스택형은 미디어쿼리 없이도 모바일에서 세로로 쌓인다.

**검증법**: `preprocessContent({content, title})`를 직접 호출해 발행본을 재현하고, 요소별 인라인 style 유지 여부 확인 (주석 0개, `.wrap` 배경, 카드 rgba 배경이 유지되는지).

#### h1 제거 → 빈 히어로 밴드
`publish_h1_strip_hero_band`

발행 전처리 `stripPublishingOverlap()` (`content-preprocess.ts`)는 본문의 **모든 `<h1>`을 통째로 제거**한다 (게시판이 제목을 title 필드로 별도 렌더하므로 중복 방지).

**함정** (2026-07-21 실증, EV 여름충전 기획글)
제목을 그라데이션 `.hero` 밴드 div 안에 함께 넣었더니, 발행 시 h1만 제거되고 **파란 그라데이션 밴드 + 날짜 텍스트만 잔존** → "제목 잘림 + 잘린 파란 네모에 날짜" 증상.

**적용 방법**
- 기획/뉴스 완결문서 제목은 **배경 없는 평범한 `<h1>`** 으로
- 히어로는 **별도 `figure.hero`(이미지)** 로 두고, 발행일/날짜 라인·kicker는 넣지 ⟨유실⟩
- `.hero` 클래스 = 파이프라인상 **이미지 figure 의미로 고정** (`normalizeHeroPlacement`가 `figure.hero`를 `.wrap` 안으로 이동). 그라데이션 배경 밴드 ⟨유실⟩
- 검증법: 저장 전 `preprocessContent` ⟨유실⟩ linear-gradient · 날짜 잔존 없는지 확인

---

### E-5. 히어로 · 인라인 에디터

#### 히어로 비율 = natural
`hero_image_ratio`

대표(히어로) 이미지 = **원본 비율 그대로 `width:100%; height:auto`** — 고정 박스 · 여백 · 크롭 전부 없음.

이력: 16:9 cover → 4:3 → 5:4 → contain+여백 → **natural(height:auto)** (2026-06-23 최종).
contain의 회색 레터박스 바가 "깨진 것처럼" 보여 고정 박스를 폐기했다.

⚠️ **뉴스 히어로 스타일 주입은 4곳** — 전부 같이 바꿔야 재업로드에도 유지된다:
1. `article-html.service` (×2)
2. `NewsDetailModal`(`patchBodyFigure`)
3. `collect-and-publish.ts`

> 과거 누락으로 cover로 되돌아간 사고가 있었다.

- **기획은 `aspect-ratio:auto`** 로 글 CSS `figure img{aspect-ratio:16/9}`를 덮어써야 박스/크롭이 안 생긴다

#### 히어로가 .wrap 바깥에 있을 때
`hero_outside_wrap_pitfall`

기획 히어로와 본문 이미지의 **가로폭이 달라 깨지는 버그**의 근본 원인.

**원인**: `insertOrReplaceHero`가 히어로 figure를 `<body>` 직후(= `.wrap` 컨테이너 **바깥**)에 삽입.
구조가 `<body><div class="wrap">(max-width:680px)…</div></body>`라, 바깥 히어로는 `width:100%`가 `.wrap`이 아닌 **body 전체 폭**으로 풀린다.

> 측정(900px 창): 히어로 **885px** vs 본문 이미지 **644px** → 히어로를 `.wrap` 안쪽으로 옮기니 둘 다 644px로 일치.

**해결 (3중)**
1. `insertOrReplaceHero` — 기존 히어로 제거 후 **항상 컨테이너 안쪽 최상단**에 재삽입 (`.wrap` → `.article-wrap` → `article` → `body` 순)
2. 발행 정규화 — `content-preprocess.ts`의 `normalizeHeroPlacement` (바깥 히어로를 안쪽으로 이동, idempotent)
3. 백필 — 기존 기획기사 PATCH

#### 앵커 없으면 조용히 실패 ★
`hero_no_anchor_pitfall`

**증상**: 대표 이미지를 추가해도 본문에 안 ⟨유실: "나온다" 추정⟩

히어로 주입(`ArticleHtmlService.regenerate` 서버 + `patchBodyFigure` 클라)은 **고정 앵커 문자열 치환으로만** 넣는다:
- `<figure class="article-figu⟨유실⟩">`
- `hero-img-placeholder`
- `class="hero-img"`

차트형 판매량 기사처럼 자유 작성된 ⟨유실⟩ 없어 **모든 replace가 no-op** → 이미지 DB row·파일은 정상 생성(업로드 200)인데 `articleHtml`엔 안 박힘 → 사용자에겐 **"추가 안 됨/에러"** 로 보인다. 조용한 실패다.

**해결** (2026-06-30): 세 앵커 모두 매칭 실패하면 `</h1>` 바로 뒤(없으면 `<body>` 직후)에 figure 삽입 — 서버 `regenerate` + 클라 `patchBodyFigure` 양쪽 폴백.

**주의**: custom-HTML 분기는 `articleHtm⟨유실⟩`. 깨진 기사는 **재빌드 + 재기동 후 대표 이미지 1회 재업로드**하면 복구된다.

#### 인라인 에디터 손상 — 증상 3종의 공통 뿌리 ★
`inline_editor_corruption`

기획 인라인 에디터(`InlineArticleEdi⟨유실⟩`)

**Root cause**
```
insertOrReplaceHero 폴백의 return fig + html
  → 히어로 figure를 <!DOCTYPE html> 앞에 prepend
  → 문서가 malformed 파싱
  → head의 meta/title/script/style이 contenteditable body로 relocate
  → syncOut이 bodyEl.innerHTML을 그대로 저장
  → 매 편집마다 head가 body로 복제·누적
```

**증상 3종 — 전부 같은 뿌리**
1. **모바일 깨짐** = 히어로 중복 + `<tit⟨유실⟩`
2. **이미지 좌측정렬** = `setImgWidth`가 ⟨유실⟩ 사용. 중앙정렬은 `display:block; margin:0 auto`
3. **편집기 CTA 안 보임** = CTA OFF로 저장 시 `.cta-inline{display:none}`가 body로 baked → **CTA ON이어도 영구 숨김**

**수정**
- (a) `setImgWidth` 중앙정렬
- (b) `syncOut` 저장 전 에디터 마커 / head-only 노드 strip
- (c) 히어로를 **body 안쪽**에 삽입
- (d) 기존 글 backfill

#### 대표 이미지 교체 안 됨
`inline_editor_hero_replace`

`InlineArticleEditor`의 `detectMode`는 뉴스(`class="article-body"` 보유)에서 편집 루트를 `<div class="article-body">`에만 건다. 히⟨유실⟩ `article-body` **바깥(앞 형제)** 이라, 인라인 에디터에서 히어로를 클릭 → 교체하면 iframe DOM의 src는 바뀌지만 `syncOut`·`reconstruct`에서 교체분이 버려진다 → **"대표 이미지 교체 안 됨"**

**해결** (2026-06-29): `handleFile` 교체 ⟨유실⟩ 루트 밖이면(`!root.contains(selected)`) `syncOut` 대신 전체 문서 문자열에서 `workingRef.current.split(prevSrc).join(url)`로 직접 치환 후 `onChange`.
(src는 타임스탬프 파일명이라 유일 → 안전)

**잔존 이슈**: 히어로 폭조정·삭제도 `syncOut` 의존이라 편집 루트 밖이면 동일하게 누락된다.
**부수 팁**: 2단 나란히 이미지의 세로 차이 = 표에 `table-layout:fixed` 누락이 원인.

#### 뉴스 미리보기는 iframe
`news_preview_iframe`

뉴스 상세(`NewsDetailModal`) **view 모드** 미리보기가 완결 HTML 문서를 `<div dangerouslySetInnerHTML>`로 직접 주입했다.

전체 문서를 div innerHTML에 넣으면 `<head>`의 `<style>`이 적용 안 돼 **무스타일 렌더** → CTA가 스타일 잃은 맨 링크가 됨("견적 버튼 안 보임"). **편집 모드(iframe)는 정상이었다.**

**해결** (2026-06-24): view 미리보기를 `ifr⟨유실⟩ame-origin")` 으로 교체. 격리 문서라 자체 head/style이 적용 → CTA 버튼 정⟨유실⟩

> **규칙: 완결 HTML 문서(자체 style 보유)는 반드시 `iframe srcDoc`으로 렌더. `div` + `dangerouslySetInnerHTML` 금지.**

---

### E-6. 이식 · 도구 · 콘텐츠 앵글

#### Figma → HTML 랜딩 이식
`figma_landing_import`

**표준 변환 3단계**
1. **JS 전제 제거** — 게시판은 `<script>` ⟨유실⟩ `city:0}`)은 항상 표시로, 폼/모달은 삭제하고 `<a class="cta">` 실 랜딩 URL로 교체
2. **고정 캔버스 모바일 대응** — 800px ⟨유실⟩ + `zoom: calc(100vw / 800px)`, `.page-shell{overflow-x:hidden}` 래퍼
3. `<style>` 내 **주석 전부 제거**, body 배경 → 래퍼 클래스로 복제

**실발행 추가 제약 (dev 실증)**
- **CSS 변수 금지**(리터럴로), **`@media` 금지**(반응형은 `clamp()`/`vw`/`%`로)
- 사진은 전부 `<img src="http://loca⟨유실⟩` (cloudfront 미러링). **CSS background 이미지는 미러링 안 됨**
- **단순 클래스 셀렉터만.** 배경은 실요소의 `linear-gradient`
- **모든 `<h1>` 제거됨** → 본문 시각 타이틀은 `<p>`로
- 게시판이 `grid-area` 등 오버레이 계열 제거 → **이미지 위 텍스트 오버레이 CSS 불가.** 필요하면 **PIL로 타이틀을 이미지에 합성**

**검증**: `javaScriptEnabled:false` 헤드리스로 375 / 414 / 800 문서폭 ≤ 뷰포트 확인

#### Playwright 재현 환경
`playwright_repro_chromium`

이 머신에서 MCP playwright는 초기화 실패한다 (`Chromium 'chrome' is not found at /opt/google/chrome/chrome`).

**우회**: 스크래치패드에 `npm i playwright-core` 후
```js
chromium.launch({
  executablePath: '/home/user/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome',
  headless: true
})
```
로 대시보드(3001) UI를 재현한다.

파일 업로드는 `locator('input[type=file]').setInputFiles(...)`.
꿀팁 모달은 **file input이 2개** — 첫째 = 에디터 인라인, 마지막 = 우측 ⟨유실⟩

#### 콘텐츠 앵글 실험 — 테슬라 트림별 배터리
`tesla_battery_trim_angle`

성과가 좋았던 "테슬라 BSM 배터리" 후속으로 새 앵글 = **트림별 배터리(LFP vs NCM) 선택 가이드**를 뉴스 탭에 발행 (2026-07-01, id `news-20260701-6⟨유실⟩`).

**핵심 팩트 (공식 검증)**

| 트림 | 배터리 | 용량 | 주행 |
|---|---|---|---|
| 모델Y RWD | LFP | ~62 kWh | — |
| 모델Y 롱레인지 AWD | NCM (LG엔솔) | 84.85 kWh | 상온 523 km |
| 모델Y L | — | 88.2 kWh | 상온 553 / 저온 454 km (기후에너지환경부) |

- **충전**: LFP는 100% 상시 + 주 1회 완충 ⟨유실: 매뉴얼 추정⟩
- **보증**: 모델3·Y **8년 또는 16만 km, 용량 70% 보장**
- **출처**: tesla.com 보증·지원 + `ev.or⟨유실: ev.or.kr 추정⟩`

> 목적은 성과 자체가 아니라 **학습**이다. 한 포맷에 고착하지 말고 다양한 앵글을 시도해 인용되는지 관찰할 것 ([C-1](#c-1-1차-목표--ai-검색-인용)).

⚠️ **이 수치들은 위 공식 출처로 재검증한 뒤에만 인용한다. 트림명 + 용량이 반드시 함께 있어야 한다.**

---

## E-7. 아직 복원 안 된 항목

E-1 ~ E-3은 2026-07-28 재수신으로 전량 복원됐다. 아래는 **여전히 문장이 잘린 곳**이다.

| 항목 | 유실 지점 |
|---|---|
| `publish_inline_css_pitfalls` | ⑤ `content-preprocess.ts`의 `lif…div)` 함수명 · caption 관련 문장 끝 / ⑥ "카드·비교는 grid 금지, ⟨?⟩ `<table>`로" |
| `publish_h1_strip_hero_band` | "kicker는 넣지 ⟨않는다⟩" · ".hero … 그라데이션 배경 밴드 ⟨?⟩" · 검증법 문장 |
| `hero_no_anchor_pitfall` | 증상 문장 끝 · 앵커 1 클래스명 끝 · "자유 작성된 ⟨?⟩ 없어" · custom-HTML 분기 조건 |
| `inline_editor_corruption` | 컴포넌트명 끝 · 증상1의 `<tit…` · 증상2 `setImgWidth`가 무엇을 사용하는지 |
| `inline_editor_hero_replace` | "히⟨어로 figure가⟩" · `handleFile` 교체 문장 |
| `news_preview_iframe` | 해결 문장의 `iframe srcDoc(sandbox="allow-same-origin")` 표기 · 끝 문장 |
| `figma_landing_import` | ①의 script 조건(`…city:0}`) · ②의 800px 캔버스 처리 · 이미지 src 예시 |
| `playwright_repro_chromium` | 꿀팁 모달 두 번째 file input의 위치 |
| `tesla_battery_trim_angle` | 기사 id 끝자리 · 충전 매뉴얼 출처 · `ev.or.kr` 표기 |

> 위 9건은 **앞뒤 몇 글자만 알려주면 원본에서 해당 문장을 찾을 수 있다**고 전달자가 안내했다. 필요할 때 그 방식으로 채운다.
