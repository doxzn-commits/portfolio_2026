# 포트폴리오 웹 — 구현 규격서

> 대상: 이 코드를 이어받는 사람(또는 AI CLI)
> 구현체: `web_prototype/index.html` (단일 파일, 빌드 없음)
> 배포: https://doyujin-portfolio.vercel.app (Vercel, noindex 상태)
> 최종 갱신: 2026-07-21

---

## 0. 먼저 읽을 것

| 순서 | 문서 | 용도 |
|---|---|---|
| 1 | `../WORK.md` | 현재 진행 상황 · 다음 할 일 |
| 2 | 이 문서 | 구현 규격 (구조 · 상수 · 계약) |
| 3 | `../PORTFOLIO_WEB_PLAN.md` | 기획 배경 · 왜 이렇게 만들었는지 |
| 4 | `../AI_PROJECT_HISTORY.md` | **수치 검증 규칙 (필독)** |

**절대 규칙**: 성과 수치는 `../source_materials/AI 도입 전후 비교 (6월).xlsx`로 검증된 값만 쓴다.
과거에 근거 없는 387건이 문서 9곳에 퍼진 사고가 있었다. 자세한 경위는
`../claude_history_transfer/13_내부_콘텐츠_자동화_발행_시스템_성과_포트폴리오.md` 6절.

---

## 1. 파일 구조

```
web_prototype/
├── index.html        전부 여기 (HTML + CSS + JS 단일 파일)
├── img/              카드 이미지 9장 (webp, 총 320KB)
├── robots.txt        Disallow: /
├── vercel.json       X-Robots-Tag: noindex 헤더
├── .gitignore        .vercel, .env*
└── SPEC.md           이 문서
```

`.vercel/`, `.env.local`은 Vercel CLI가 만든 것. **git에 올리지 말 것** (이미 무시 처리됨).

---

## 2. 레이아웃 — 3층 구조

z-index 순서가 핵심이다. 바꾸면 반드시 깨진다.

```
z:1  .veil    좌측 흰색→투명 그라데이션   (카드 뒤)
z:2  .stage   카드 스택                  (perspective 컨테이너)
z:3  .hero    텍스트만                   (카드 위)
z:9000 .detail 상세 화면 오버레이
```

- **베일이 카드 위로 가면 안 된다** — 리프트한 카드가 뿌옇게 가려진다
- `.hero`는 `pointer-events:none`, 자식만 `auto` — 텍스트가 카드 hover를 막지 않도록
- `.stack`은 **반드시** `pointer-events:none` — 없으면 z=0 평면이 뒤쪽 카드의 포인터를 전부 가로챈다 (히트율 52% → 4%로 폭락)

---

## 3. 기하 상수

### 데스크톱 (861px 이상)

```css
--P:1600px    /* perspective */
--XW:45px     /* 인덱스당 X 이동 (월드 좌표) */
--YW:-170px   /* 인덱스당 Y 이동 */
--DZ:97px     /* 인덱스당 Z 깊이 */
--cardW:480px --cardH:360px   /* 4:3 */
--r:24px      /* 카드 라운딩 */

.stack  transform: rotateX(8deg) rotateY(-18deg) rotateZ(-4deg)
.card   left:56% top:86%
```

원근 축소율은 `scale = 1600 / (1600 + 97k)`로 **자동 계산**된다. JS에서 scale을 직접 곱하지 않는다.

| 깊이 k | scale | opacity |
|---|---|---|
| 0 | 1.000 | 1 |
| 1 | 0.943 | 1 |
| 2 | 0.892 | 1 |
| 3 | 0.846 | 1 |
| 4 | 0.805 | 1 |
| 5 | 0.767 | 1 |
| 6 | 0.733 | 1 |
| 6.5 초과 | — | 1 → 0 페이드 |
| 7.6 초과 | — | `display:none` |

### 모바일 (860px 이하) — 세로 캐스케이드

```css
--P:1200px --XW:0px --YW:-160px --DZ:120px
--cardW:min(340px,86vw) --cardH:calc(cardW * .75)
--r:20px

.stack  transform: none      /* 회전 없음 */
.card   left:50% top:74%
```

**두 레이아웃은 같은 엔진, 다른 파라미터다.** 카드 렌더링·가상화·물리 코드는 단일 구현이고
CSS 변수만 미디어쿼리로 교체된다. 새 레이아웃을 추가하려면 변수만 정의하면 된다.

---

## 4. 인터랙션 계약

### 리프트 (데스크톱 hover)

```css
.card.lift .lifter{
  transform: translate3d(-70px, 0, var(--liftZ))
             rotateZ(4deg) rotateY(18deg) rotateX(-8deg) scale(1.15);
}
```

- **회전 3개는 `.stack`의 회전을 정확히 상쇄하는 값이다.** `.stack` 회전을 바꾸면 여기도 부호 반대로 같이 바꿔야 한다.
- `--liftZ`는 JS가 카드마다 계산: `DZ*k + 120`.
  고정값이면 뒤쪽 카드가 스택 앞줄(z=0)을 못 넘어 앞 카드에 가려진다.
  **어느 깊이의 카드든 최종 z = +120으로 수렴**한다.
- 실효 확대율 약 **1.225배**. 크기만 조절하려면 `--liftZ` 계산식의 `+120`을 바꾼다 (앞뒤 순서는 유지됨).

### 불변식 — 반드시 지킬 것

> **커서가 닿는다 ⟺ 리프트된다**

반투명 카드는 `pointer-events:none`으로 아예 포인터를 안 받는다 (`layout()`의 `live` 변수).
"닿는데 반응 없는" 영역이 생기면 이 불변식이 깨진 것이다.

### 레이어 분리 — 건드리지 말 것

```
.card    스택 위치 전담. 물리 루프가 매 프레임 transform을 덮어씀 → transition 금지
 └ .lifter  리프트 전담. CSS transition 0.22s(in) / 0.16s(out)
    └ .inner  클리핑(border-radius + overflow:hidden)
```

둘을 한 엘리먼트에 합치면 **리프트가 툭 튀거나 스크롤이 끈적해진다.** 둘 중 하나는 반드시 깨진다.

`.lifter::before/::after`는 그림자 2겹. **box-shadow를 애니메이션하면 매 프레임 리페인트**가 발생하므로
opacity 교차 페이드로 처리했다.

### 물리

```js
K=200, C=28        // 스프링. ζ=0.990 (오버슈트 없음), 정착 0.286s
PX_PER_CARD=130    // 휠·드래그 130px = 카드 1칸
```

- 드래그 방향: `d = e.clientY - sy` — **아래로 끌면 카드도 아래로** (휠 방향과 부호 일치)
- `setPointerCapture`는 6px 이상 실제로 움직인 뒤에만 건다. 즉시 걸면 카드 hover가 죽는다
- `alert()` 금지 — pointerup을 삼켜서 드래그가 영구 고착된다
- **rAF 고착 복구**: 250ms 넘게 프레임이 없으면 `running=false`로 강제 복구.
  없으면 백그라운드 탭 전환 후 입력이 전부 무시된다

### 모바일 스크롤 충돌

```css
html,body { overscroll-behavior:none }   /* 당겨서 새로고침 차단 */
.stage    { touch-action:none }          /* 터치는 JS 전담 */
.detail   { overscroll-behavior:contain }
```

셋 중 하나라도 빠지면 드래그할 때 페이지가 새로고침된다.

---

## 5. 데이터 스키마

### 카드 배열 `P[]`

```js
{
  n:  '프로젝트명',
  k:  '대표 수치',           // 카드에 크게 표시
  o:  '소속', d:'기간', r:'역할',
  bg: '#0B1F3A' | G.auto,   // 색상 또는 CSS 그라데이션
  fg: '#fff',               // 텍스트 색
  img:'img/파일명.webp',     // 선택. 없으면 그라데이션 카드
  wide:true,                // 선택. 가로 이미지를 카드 전체에 cover
  line:'2줄<br>카피'         // 선택. 이미지 없는 카드의 대체 문구
}
```

`G` 객체에 그라데이션 5종이 정의돼 있다 (`G.auto`, `G.infl`, `G.push`, `G.mail`, `G.comm`).

### 상세 배열 `D[]` — 인덱스가 `P[]`와 1:1 대응

```js
{
  pb: '문제 — 숫자 포함 필수',
  hy: '가설 — 따옴표 없이. 마크업이 자동으로 감쌈',
  ac: ['실행 1', '실행 2', …],        // 3~5개
  rs: [['지표','이전','이후'], …]      // 1~3개
}
```

**`rs`의 앞 3개가 상세 페이지 KPI 칩으로 자동 생성된다.** 수치를 고칠 곳은 `rs` 한 군데뿐 —
같은 숫자가 여러 곳에 흩어져 어긋나는 것을 구조로 막았다. **이 설계를 깨지 말 것.**

### 작성 규칙

| 블록 | 규칙 |
|---|---|
| `pb` 문제 | 반드시 숫자 포함. "정체되어 있었다" ✗ → "6개월 누적 91건에 그쳤다" ✓ |
| `hy` 가설 | 검증 가능한 문장 하나. 실행 계획이 아니라 **믿음의 진술** |
| `ac` 실행 | 도구가 아니라 **판단**을 적을 것 |
| `rs` 성과 | 원천 엑셀로 검증된 값만 |

---

## 6. 상세 페이지 5블록 규격

13개 프로젝트가 예외 없이 같은 골격을 쓴다.

```
← 목록으로
① 헤더        소속(액센트) / 프로젝트명 48px / 기간·소속·역할
② 성과 스트립  KPI 칩 1~3개 (rs에서 자동 생성)
③ 본문 2단    좌: 문제 → 가설 → 실행   우: 비주얼(sticky)
④ 성과 표     지표 | 이전 | 이후
⑤ 이전 / 다음  끝단 자동 비활성
```

URL은 `#work-N`으로 갱신되고 브라우저 뒤로가기·Esc로 닫힌다.

---

## 7. 알려진 제약

| 제약 | 내용 |
|---|---|
| **이미지 1장/프로젝트** | `img` 필드가 단일 문자열. 갤러리(Before/After 등)는 스키마 확장 필요 |
| **썸네일 5장 부재** | 콘텐츠자동화 · 인플루언서플랫폼 · CRM앱푸시 · CRM메일링 · 커뮤니티 → 그라데이션으로 대체 중 |
| **Pretendard CDN 의존** | jsdelivr에서 로드. 배포 시 자체 호스팅 + 한글 서브셋으로 교체 권장 |
| **모바일 리프트 없음** | hover가 없어 최전면 카드가 자동 포커스. 의도된 설계 |
| **noindex 상태** | 사내 자산 이미지 검토 전까지 검색 노출 차단 중 |
| **빌드 없음** | 단일 HTML. Next.js 전환은 `PORTFOLIO_WEB_PLAN.md` 5장 참조 |

---

## 8. 로컬 실행 · 배포

```powershell
# 로컬 미리보기
cd "C:\Users\carpia b\Desktop\개인\carfia-backup\web_prototype"
python -m http.server 4321
# → http://localhost:4321

# 배포 (프로젝트명 doyujin-portfolio에 연결됨, 별칭 자동 갱신)
vercel --yes --prod
```

Claude Code에서는 `.claude/launch.json`의 `portfolio-prototype` 설정으로 preview_start 가능.

### 검증 체크리스트 (수정 후 반드시)

브라우저 콘솔에서:

```js
// 1) 히트 테스트 — "닿는다 ⟺ 리프트된다" 불변식
var cards=[...document.querySelectorAll('.card')];
function idxOf(el){while(el&&!el.classList.contains('card'))el=el.parentElement;return el?cards.indexOf(el):-1}
var reach={},fail=[];
for(var y=40;y<=880;y+=20)for(var x=20;x<=1420;x+=20){var v=idxOf(document.elementFromPoint(x,y));if(v>=0)reach[v]=1}
Object.keys(reach).forEach(i=>{cards[i].dispatchEvent(new PointerEvent('pointerenter',{bubbles:true}));
  if(!cards[i].classList.contains('lift'))fail.push(i);
  cards[i].dispatchEvent(new PointerEvent('pointerleave',{bubbles:true}))});
console.log('리프트 실패:',fail);   // [] 이어야 정상

// 2) 13개 상세 데이터 완성도
for(var i=0;i<13;i++){cards[i].dispatchEvent(new PointerEvent('click',{bubbles:true}));
  if(!d_pb.textContent||!document.querySelectorAll('#d-rs tbody tr').length)console.warn('미완성',i)}
```

> **주의**: Claude Code의 Browser 패널은 `requestAnimationFrame`이 정지해 있다.
> 애니메이션·드래그 검증이 불가능하므로, rAF를 수동 구동기로 교체해 테스트하거나 실제 브라우저에서 확인할 것.
