# CARFIA CMS — 축적 운영 지식

> 카피아 마케팅 콘텐츠 자동 발행 시스템의 **운영·규칙 지식 베이스**
> 최종 갱신: 2026-07-28
> 자매 문서: [`GSC_BOARD_OPS.md`](GSC_BOARD_OPS.md) (CTA 10,000 전략) · [`WORK.md`](WORK.md) (포트폴리오 웹)

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

> ⚠️ **이 절은 원본 전달 과정에서 일부 문장이 잘렸다.** 유실 지점은 `⟨유실⟩` 로 표시했다.
> 추측으로 메우지 않았으니, 표시된 항목은 실행 전에 원본을 다시 확인할 것. 목록은 [E-6](#e-6-복원-필요-항목) 참조.

### E-1. 파이프라인 · 수집

#### 뉴스 자동발행 파이프라인 v6 — 핵심 워크플로우
`project_capia_pipeline`

**사용자 개입은 딱 2곳.** 그 외 전체 자동발행은 금지다.
1. CLI에서 기사 번호 선택
2. 대시보드에서 이미지 검수 + 발행 승인

- 원문 파싱 실패 시 폴백: **다음 기사 → 같은 카테고리 → RSS 요약**. 에러가 나도 사용자에게 묻지 않는다
- **H2는 키워드 리스트형 3줄 필수** (문장형 금지)
- `articles_db.json`은 배열이 최상위
- ⚠️ 이 메모리에 적힌 포트 3000은 **구값**이다 — 실제 4517 ([A-1](#a-1-포트))

#### 번호 재부여 함정 ★
`project_collect_renumber_pitfall`

`collect-and-publish.ts`가 **매 실행마다 재수집**해서, 1차(목록)와 2차(선택)의 스냅샷이 달라진다.
→ **같은 N이 다른 기사를 가리킨다.** 실증: "2"를 골랐는데 엉뚱한 기사가 발행됨.

**해결**
- 목록은 1회만 실행 → `.cache/collect-list.json` 에 TTL 1시간 스냅샷 저장
- 선택은 `--select N` (캐시에서 읽으므로 번호가 안 흔들림)
- ❌ `echo "N" | ...` 방식 금지 (불안정)

#### 뉴스 발행 기본 프로세스
`feedback_pipeline_flow`

```
① RSS 수집 → 브랜드 필터 → 중복 제거 → 최대 20건
② CLI 번호 선택          ← 전체 자동발행 금지
③ 원문 WebSearch/WebFetch 크롤링
④ 템플릿 재작성 (구조 · NewsArticle+FAQPage 스키마 · H2 키워드 리스트형)
⑤ PATCH /articles/:id
⑥ 대시보드 확인
```

⚠️ **RSS 폴백으로 넣으면 링크 텍스트만 들어가 못 쓴다. 반드시 원문 크롤링 후 재작성.**

#### 쓸 기사가 없을 때
`feedback_no_recommended_article`

기본 "자동차" 피드를 재실행하지 말고 **다른 키워드로 재수집**한다.

```bash
FEED_QUERY="검색어" npx tsx scripts/collect-and-publish.ts
```

상위 20건(`MAX_DISPLAY`)만 표시되므로, 원하는 기사가 그 밖이면 **검색어를 더 좁혀** 상위로 올린다.

---

### E-2. 자동초안 · 기획 콘텐츠

#### autodraft 창 누락
`project_autodraft_window_gap`

autodraft는 ⟨유실: 실행 시각/조건⟩ **내일(오늘+1)** 의 `cartip` · `contentId` 없는 슬롯만 초안 생성한다.

| 함정 | 내용 | 대응 |
|---|---|---|
| **창 누락** | 당일 08:00 cron 이후에 시드하면 그날 cron은 이미 지났고, 다음날 cron은 오늘+1만 보므로 **아무도 초안을 안 만든다** | `python3 scripts/autodraft-tomorrow.py <날짜>` 수동 실행 |
| **CLI 타임아웃** | 서버 writer(claude CLI 헤드리스)가 **10분 초과 시 실패** → DRAFT로 복귀 | 긴 글은 Claude가 직접 작성해 PATCH ⟨유실⟩ |

⚠️ **목록 API ⟨유실: `?page=N` 추정⟩ 는 `bodyHtml`을 포함하지 않는다** (len=0으로 보임).
→ 본문 유무는 반드시 **상세 `GET /planned-content/:id`** 로 확인할 것.

#### 기획 콘텐츠 (PlannedContent)
`project_planned_content`

뉴스·프로모션과 나란한 **3번째 타입**. 3단계(수집 / 생성 / 발행).

```
주제 받음 → Claude가 완결 HTML 원고 작성
         → POST /planned-content/collect {keyword}   레코드 생성
         → PATCH /planned-content/:id {title, bodyHtml, ⟨유실⟩}
```
⟨유실: Claude 직접 생성이 폴백인지 기본인지 문장 손상⟩

- **미리보기는 iframe `srcDoc`** — `div` + `dangerouslySetInnerHTML`은 head/style이 깨진다
- 주제 방향: **구매 꿀팁 · 구매 시 알아야 할 점 · 관리 꿀팁 · 리스/렌트**
- **시각 요소 필수**, CTA ⟨유실⟩
- 이미지는 본문 인라인 (운영 절대 URL)

#### 대장 초안 자동 생성
`project_ledger_auto_draft`

대장의 **"초안 생성" 버튼**(꿀팁·뉴스)과 상세의 **"🤖 본문 생성"** 은 본문까지 자동 작성한다.

- 서버 키가 없어도 된다 — NestJS가 ⟨유실: claude CLI spawn 추정⟩ (cwd=리포 루트라 `CLAUDE.md` 자동 로드)
- 상태: `DRAFT → GENERATING → READY` / 실패 시 `generateError`
- `DraftWriterService`: **동시 1개 직렬 큐, 10분 타임아웃**, 재시작 시 `GENERATING → DRAFT` 복귀
- 대화에서 직접 작성 → PATCH 하는 방식도 유효

---

### E-3. 프로모션 (단일 · 엑셀)

#### 단일 차종 프로모션
`project_single_promotion`

⟨유실: 생성 경로 앞부분⟩ → `scripts/seed-single-promotion.ts <html>` 로 주입 (`kind='single'`)
대시보드 **뉴스 ▸ 모델정보 탭**에 노출 (프로모션 탭 제외, `kind` 컬럼 ⟨유실⟩)

**HTML 제약**
- CSS 변수 금지 → **리터럴 hex**
- `<style>` 내 **주석 금지**
- `@media`는 **통째로 제거됨**
- 갤러리/카드는 `grid`/`flex` 대신 **`<table table-layout:fixed>`**
- 표는 `table-layout:fixed` + `word-break:` ⟨유실⟩
- **그림자 · 의사요소 금지**
- FAQ는 `<details class="faq-item">`

**CTA 표준 문구**: `같은 [모델명]라도, 카피아의 가격은 다릅니다` (모델명만 가변)

> 🚨 **`bodyHtml` 통째 덮어쓰기 금지.**
> 재시 ⟨유실⟩ 슬롯 이미지(`hero`/`front`/`side`/`interior`의 실제 URL)가 **전부 날아간다** — 본문 HTML에만 저장되기 때문.
> **재작성 전에 라이브 `bodyHtml`을 GET해서 각 `data-slot`의 `src`를 보존할 것.**

#### 단일 프로모션 히어로 = 전체 이미지
`project_single_promo_hero_fullimage`

비율 그대로 **잘림 없이** 노출한다. 뉴스/기획의 4:3 `cover`와 다르므로 그쪽 스타일을 적용하면 안 된다.

```css
.m-image      { width: 100%; }              /* aspect-ratio 없음 */
.m-image img  { width: 100%; height: auto; } /* object-⟨유실⟩ */
```

- 스크립트: `scripts/fix-si⟨유실⟩ngle-promo-hero-fullimage.ts` (**재 seed 금지**)
- 버그 이력: 제목 저장 시 완결 문서가 박살나는 문제(update가 조각 생성기로 재생성) → **`isFullDoc` 가드로 수정됨**

#### 단일 모델 CTA — 앵커 2곳
`project_single_model_cta_dual_anchor`

견적 앵커가 **2곳**이다: 카드의 `.cta-btn` + 하단 `.cta-block`. CTA 저장 시 둘 다 동기화 ⟨유실⟩

- `href = https://carfia.co.kr/mkt/<코드>` — **모델별 마케팅 단축코드**
- 코드는 사장님/마케팅이 배정한다 → **Claude는 모른다**
- 작성 시 임시값을 넣고, 사장님께 코드를 물어 **PATCH로 교체**

#### 프로모션 엑셀 단위
`project_promotion_excel_unit`

`rawData` ⟨유실: 단위 기준 문장⟩ (`html-generator`가 "만원" 라벨을 붙임)

**함정**: 폭스바겐 6월만 '원' 단위로 업로드 → **"69,040,000만원"** 증상.
→ **코드 버그가 아니라 엑셀 입력 단위 문제다.** 신규 업로드 시 단위부터 확인할 것.
`rawData`는 ⟨유실⟩ 저장하면 재발한다.

---

### E-4. 발행 CSS · 인라이너 함정

#### 미리보기 ≠ 발행본을 만드는 6종 ★
`project_publish_inline_css_pitfalls`

인라이너(`inlineCssStyles` ⟨명칭 일부 유실⟩)가 원인이다.

| # | 함정 | 대응 |
|---|---|---|
| ① | `/* */` **주석이 뒤 규칙을 깨서 통째로 사라짐** | `<style>` 내 주석 금지 |
| ② | `body::before` · `body{}` 는 인라인 불가 | ⟨유실⟩ 요소에 |
| ③ | 박스 안 `disc <ul>` 불릿이 게시판 테두리에 달라붙음 | `injectBoxListBullets`로 해결 |
| ④ | 자식 결합자(`>`) · `@media` 미지원 | 넓은 표는 **카드형**으로 |
| ⑤ | 게시판 sanitizer가 `<ca⟨유실: caption 추정⟩` 제거 | 제목은 **표 앞 div**, 합계행은 평셀 |
| ⑥ | **`display:grid` · `transform` · `position:absolute` 제거됨** | 카드/비교는 grid 금지 → **세로 스택 또는 table** |

**생존하는 것**: `block` / `flex` / `inline-block` / `table`, line-⟨유실⟩, `rgba`, `border-left`

**검증**: `preprocessContent()` 를 직접 호출해 재현할 것.

#### h1 제거 → 빈 히어로 밴드
`project_publish_h1_strip_hero_band`

발행 시 `stripPublishingOverlap()` 이 **모든 `<h1>`을 제거**한다 (게시판이 title을 별도로 렌더하므로).

**함정**: 제목을 그라데이션 배너 안에 넣으면 h1만 지워지고 **빈 파란 밴드 + 날짜만 잔존**한다.

→ 제목은 **배경 없는 평범한 h1**, 히어로는 **별도 `figure.hero`(이미지)**. 날짜·kicker를 넣지 말 것.
→ `.hero` 클래스 = 이미지 figure

---

### E-5. 히어로 · 인라인 에디터

#### 히어로 비율 = natural
`project_hero_image_ratio`

히어로는 `width:100%; height:auto` — **고정 박스 · 여백 · 크롭 없음.**

이력: 16:9 → 4:3 → … → **natural (2026-06-23 최종)**. `contain` 레터박스가 "깨진 것처럼" 보여 폐기.

⚠️ 뉴스/기획 히어로 스타일 주입 지점이 **4곳**이다 (DetailModal, collect-and-publish, ⟨2곳 유실⟩).
**전부 같이 바꿔야** 재업로드 시 유지된다.

#### 히어로가 .wrap 바깥에 있을 때
`project_hero_outside_wrap_pitfall`

기획 히어로가 `.wrap`(max-width:680px) **바깥(body 직속)** 이면 `width:100%`가 전체폭으로 풀려 본문 ⟨유실⟩ (885px).

**해결**: `insertOrReplaceHero`가 컨테이너 **안쪽 최상단**에 재삽입 + 발행 시 `normalizeHeroPlacement` + 백필

#### 앵커 없으면 조용히 실패 ★
`project_hero_no_anchor_pitfall`

히어로 주입은 **고정 앵커 문자열 치환**이다 (`article-figure` / `placeholder` / `her⟨유실⟩`).

**자유 HTML은 replace가 no-op** → 업로드해도 본문에 안 박힌다.
파일·DB는 정상 생성되므로 겉보기엔 **"추가가 안 됨"** 으로만 보인다. 조용한 실패.

**해결**: 앵커가 전부 실패하면 `</h1>` 뒤(없으면 `<body>` 직후)에 figure 삽입.
⟨유실⟩-HTML 분기는 **500자 이상**에서만 탐색.

#### 인라인 에디터 손상 — 증상 3종의 공통 뿌리 ★
`project_inline_editor_corruption`

```
insertOrReplaceHero 폴백이 히어로를 <!DOCTYPE> 앞에 prepend
  → malformed 파싱
  → head의 meta/title/style이 contenteditable body로 relocate
  → syncOut이 그대로 저장
  → 매 편집마다 ⟨유실: 악화 추정⟩
```

**증상 3종이 전부 같은 뿌리다**: 모바일 깨짐 / 이미지 좌측 정렬 / CTA 안 보임

**수정**: `setImgWidth` 중앙정렬, `syncOut` strip, 히어로를 **body 안쪽**에 삽입, 백필

#### 대표 이미지 교체 안 됨
`project_inline_editor_hero_replace`

⟨유실⟩(`article-figure`)가 **편집 루트(`article-body`) 바깥**이라, 클릭 교체가 `syncOut`/`reconstruct` 과정에서 버려진다.

**해결**: 선택 이미지가 편집 루트 밖이면 `syncOut` 대신 전체 ⟨유실⟩`(url)` 치환
**부수 팁**: 2단 나란히 이미지의 세로 차이 = `table table-layout:fixed` 누락

#### 뉴스 미리보기는 iframe
`project_news_preview_iframe`

뉴스 상세 view 미리보기가 완결 HTML을 `<div dangerouslySetInnerHTML>`로 넣어 **head의 `<style>`이 미적용** → "CTA 버튼 안 보임".

**해결**: `iframe srcDoc` (`sandbox="allow-same-origin"`) 으로 교체.
→ **완결 HTML은 반드시 iframe srcDoc. div 금지.**

---

### E-6. 이식 · 도구 · 콘텐츠 앵글

#### Figma → HTML 랜딩 이식
`project_figma_landing_import`

**변환 3단계**
1. **JS 제거** — 스크롤 리빌은 항상 표시, 폼/모달 → `<a class="cta">` 실 URL
2. 800px 고정 캔 ⟨유실⟩ 폴백 + `zoom: calc(100vw/800px)`
3. 주석 제거 · body 배경 → 래퍼 클래스

**⚠️ 실발행 제약**
- CSS 변수 · `@media` · pseudo-element **폐기**
- `data:` URI **제거됨** (이미지 깨짐) → 사진은 `<img src=…>` (background는 미러링 안 됨)
- 반응형은 `clamp`/`vw`
- **h1 전부 제거** → 시각 타이틀은 `p`
- **이미지 위 텍스트 오버레이 불가** → 필요하면 PIL로 이미지에 합성

#### Playwright 재현 환경
`project_playwright_repro_chromium`

기본 초기화 실패 (`/opt/google/chrome/chrome` 없음).

**우회**: 스크래치패드에 `npm i playwright-core` 후
```js
chromium.launch({
  executablePath: '/home/user/.cache/⟨유실⟩/chrome-linux64/chrome',
  headless: true
})
```
로 대시보드 UI를 재현한다. 파일 업로드는 `setInputFiles` (꿀팁 모달은 **file input이 2개**).

#### 콘텐츠 앵글 실험 — 테슬라 트림별 배터리
`project_tesla_battery_trim_angle`

성과가 좋았던 "테슬라 BSM 배터리" 후속으로 **트림별 배터리(LFP vs NCM) 선택 가이드** 발행 (`news-20260701⟨유실⟩`).

| 트림 | 배터리 | 용량 · 주행 |
|---|---|---|
| ⟨트림명 유실⟩ | LFP | ⟨유실⟩2 kWh |
| 롱레인지 AWD | NCM | 84.85 kWh · 523 km |

- 충전: **LFP는 100% 상시**, **NCM은 80~90%**
- 보증: 8년 16만 km, 70%

> 목적은 성과 자체가 아니라 **학습**이다. 한 포맷에 고착하지 말고 다양한 앵글을 시도해 인용 여부를 관찰할 것 ([C-1](#c-1-1차-목표--ai-검색-인용)).

⚠️ **위 표의 수치는 일부 유실됐다.** 이 프로젝트의 수치 검증 규칙상 **복원 전 인용 금지**.

---

## E-6. 복원 필요 항목

전달 과정에서 문장이 잘린 항목이다. 실행 전에 원본을 다시 받아 채울 것.

| 항목 | 유실 내용 |
|---|---|
| `project_autodraft_window_gap` | autodraft 실행 조건 앞부분, 목록 API 파라미터명, 긴 글 PATCH 문장 |
| `project_planned_content` | Claude 직접 생성의 위상(기본/폴백), PATCH 페이로드 나머지 필드, CTA 규칙 |
| `project_ledger_auto_draft` | NestJS가 무엇을 spawn하는지 |
| `project_single_promotion` | 생성 경로 앞부분, `kind` 컬럼 설명, `word-break` 값, 덮어쓰기 재시도 문맥 |
| `project_single_promo_hero_fullimage` | `object-fit` 값, 스크립트 파일명 일부 |
| `project_single_model_cta_dual_anchor` | CTA 동기화 동작 설명 |
| `project_promotion_excel_unit` | `rawData` 단위 기준 문장, 재발 조건 |
| `project_publish_inline_css_pitfalls` | 인라이너 함수명, ②의 대응, ⑤ 태그명, 생존 속성 1개 |
| `project_hero_image_ratio` | 주입 지점 4곳 중 2곳 |
| `project_hero_outside_wrap_pitfall` | 증상 서술 |
| `project_hero_no_anchor_pitfall` | 앵커 3번째 이름, 500자 분기 대상 |
| `project_inline_editor_hero_replace` | 대상 요소명, 치환 함수명 |
| `project_figma_landing_import` | 800px 캔버스 처리 |
| `project_playwright_repro_chromium` | chromium 캐시 경로 |
| `project_tesla_battery_trim_angle` | 기사 ID, RWD 트림명·용량·주행거리 |
