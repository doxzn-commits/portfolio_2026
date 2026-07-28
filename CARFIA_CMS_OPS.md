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

## 미수집 항목

원본 메모리에는 아래가 더 있으나 이 문서에는 아직 옮기지 않았다 (약 25건):

- 인라인 에디터 손상
- 히어로 배치
- 프로모션 엑셀 단위
- Figma 이식
- 기타 일회성 구현 함정

→ 필요해지면 이어서 수집한다.
