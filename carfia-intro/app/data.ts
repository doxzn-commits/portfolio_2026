/**
 * 소개 페이지가 쓰는 데이터.
 *
 * 지금은 상수지만, 확정된 설계는 "게시판 실시간 연동"이다.
 * BOARDS 의 각 항목이 그대로 조회 대상이 되고, 이 파일의 promotions/hotdeals/cartips 는
 * 서버 컴포넌트에서 fetch 로 대체된다. (기획안 S4 연동 스펙)
 */

/**
 * 페이지 최종 수정일 — 빌드 시점에 고정된다.
 * 재배포(재빌드)할 때마다 자동으로 그날 날짜가 되어 신선도(GEO ②)가 코드로 보장된다.
 * 정적 프리렌더라 요청마다 바뀌지 않고, 배포 시점 한 번만 찍힌다.
 */
export const BUILD_DATE = new Date().toISOString().slice(0, 10);

export const SITE = {
  name: "카피아",
  nameEn: "Carfia",
  origin: "https://carfia.co.kr",
  tel: "1833-4765",
  /** 서비스 최초 공개일(고정) */
  publishedAt: "2026-07-24",
  /** 페이지 최종 수정일 = 빌드일(자동). 화면 "최근 갱신"과 JSON-LD dateModified 양쪽에 쓴다 */
  updatedAt: BUILD_DATE,
  /** 반영된 프로모션 월(콘텐츠 라벨, 수기 — 실데이터 연동 시 최신 월로) */
  updatedLabel: "2026년 7월",
} as const;

/** 한 문장 정의 — h1 직후 첫 문단. AI 가 그대로 인용하게 될 문장 (강점 = 딜러사별 최고 할인가 비교) */
export const DEFINITION =
  "카피아(Carfia)는 딜러사마다 다른 수입차 할인가를 비교해 지금 받을 수 있는 최고 할인가를 알려주고, 할부·리스·장기렌트 조건까지 함께 확인해 실구매가를 알려주는 수입차 프로모션 비교 서비스입니다.";

export const BOARDS = {
  promotion: { label: "수입차 프로모션", path: "/board/new-car-promotion" },
  hotdeal: { label: "수입차 핫딜", path: "/board/hotdeal" },
  cartip: { label: "차량 꿀팁", path: "/board/cartip" },
  news: { label: "차량 뉴스", path: "/board/news" },
  newsModel: { label: "모델 상세 정보", path: "/board/news-model" },
} as const;

/** 14개 취급 브랜드. updated=false 면 이번 달 글이 아직 없는 브랜드 */
export const BRANDS: { name: string; updated: boolean }[] = [
  { name: "BMW", updated: true },
  { name: "벤츠", updated: true },
  { name: "아우디", updated: true },
  { name: "볼보", updated: true },
  { name: "랜드로버", updated: true },
  { name: "폭스바겐", updated: true },
  { name: "포르쉐", updated: true },
  { name: "미니", updated: true },
  { name: "렉서스", updated: true },
  { name: "포드", updated: true },
  { name: "링컨", updated: false },
  { name: "지프", updated: true },
  { name: "BYD", updated: false },
  { name: "람보르기니", updated: false },
];

export const PROMOTIONS = [
  { brand: "볼보", title: "2026년 7월 볼보 프로모션 신차 할인 조건 총정리", note: "라인업 24→18 압축", date: "2026-07-21" },
  { brand: "랜드로버", title: "2026년 7월 랜드로버 프로모션 신차 할인 조건 총정리", note: "벨라 14% 할인", date: "2026-07-20" },
  { brand: "아우디", title: "2026년 7월 아우디 프로모션 신차 할인 조건 총정리", note: "할인 커진 트림 정리", date: "2026-07-18" },
  { brand: "벤츠", title: "2026년 7월 벤츠 프로모션 신차 할인 조건 총정리", note: "전달 대비 46개 변동", date: "2026-07-16" },
  { brand: "BMW", title: "2026년 7월 BMW 프로모션 신차 할인 조건 총정리", note: "6월 대비 변화", date: "2026-07-15" },
];

/**
 * 핫딜은 제목에 금액이 박혀 있다 → 금액을 주인공으로 올린다.
 * amount 가 null 인 글(예: JEEP 핫딜)도 실제로 있어 폴백이 필요하다.
 */
export const HOTDEALS: {
  seq: string;
  model: string;
  trim: string;
  amount: number | null;
  date: string;
}[] = [
  { seq: "7월 핫딜 #2", model: "아우디 A6 40 TFSI", trim: "S라인 + 조수석 디스플레이", amount: 1116, date: "2026-07-14" },
  { seq: "5월 핫딜 #3", model: "아우디 Q5", trim: "최대 할인 적용 트림", amount: 1300, date: "2026-05-27" },
  { seq: "5월 핫딜 #1", model: "포르쉐 마칸", trim: "재고 한정 물량", amount: 1272, date: "2026-05-09" },
  { seq: "7월 핫딜 #1", model: "JEEP 오프로드 라인업", trim: "오프로드의 감성 가득한 핫딜", amount: null, date: "2026-07-07" },
];

/** 꿀팁은 제목 자체가 사용자의 질문이라 가공하지 않는다 */
export const CARTIPS = [
  { title: "수입차 사기 전 꼭 볼 유지비 현실 — 차값보다 이게 중요", date: "2026-07-22" },
  { title: "신차 실구매가, 차값 말고 뭐가 더 붙나 — 부대비용 총정리", date: "2026-07-17" },
  { title: "전기차 살까 리스할까 — 보조금·감가·월 리스료까지 총비용 비교", date: "2026-07-11" },
  { title: "여름 휴가 렌터카 vs 장기렌트 — 비용·조건·월 요금 뭐가 이득일까", date: "2026-07-04" },
];

export const PROOF_STATS = [
  { value: 15, suffix: "년", label: "자동차금융 업력", desc: "2011년 시작" },
  { value: 10000, suffix: "명+", label: "이용 고객", desc: "매년 이용자 평균" },
  { value: 9245, suffix: "억원+", label: "취급액", desc: "누적 취급액" },
  { value: 14, suffix: "곳", label: "제휴 금융사", desc: "은행·캐피탈" },
];

export const REVIEWS = [
  { car: "BMW 520i", method: "운용리스", body: "다른 데서 받은 견적이랑 나란히 놓고 비교하니 뭐가 빠졌는지 바로 보였어요. 결국 300만원 넘게 차이 났습니다.", name: "김OO", date: "2026-07-09" },
  { car: "벤츠 GLC 300", method: "할부", body: "프로모션이 매달 바뀐다는 걸 여기서 처음 알았습니다. 한 달 기다렸다가 조건 좋아졌을 때 계약했어요.", name: "이OO", date: "2026-06-28" },
  { car: "아우디 Q5", method: "장기렌트", body: "월 납입금만 보다가 총비용으로 보니 판단이 완전히 달라지더군요. 계산기가 제일 도움됐습니다.", name: "박OO", date: "2026-06-15" },
  { car: "볼보 XC60", method: "운용리스", body: "전화 돌릴 필요 없이 조건 정리된 걸 먼저 보고 상담해서 편했어요. 설명이 과장 없이 담백합니다.", name: "정OO", date: "2026-05-30" },
];

/** FAQ 첫 문항이 정의문을 다시 담는다 — AI 답변 정확도를 가르는 지점 */
export const FAQS: { q: string; a: string; link?: { label: string; href: string } }[] = [
  {
    q: "카피아는 어떤 서비스인가요?",
    a: DEFINITION + " 중고차 거래 플랫폼이 아니고, 렌터카 업체도 아닙니다. 신차(수입차)를 살 때의 구매 조건을 비교하는 서비스입니다.",
  },
  {
    q: "이용료가 있나요?",
    a: "프로모션 조회, 비교, 계산기, 상담 신청까지 모두 무료입니다. 이용자에게 별도 수수료를 받지 않습니다.",
  },
  {
    q: "프로모션 정보는 얼마나 자주 갱신되나요?",
    a: "제조사·딜러 프로모션은 매월 초 갱신되며, 브랜드별로 정리해 프로모션 게시판에 올립니다. 기간 한정 특가는 핫딜 게시판에 수시로 올라옵니다.",
    link: { label: "이번 달 프로모션 보기", href: BOARDS.promotion.path },
  },
  {
    q: "수입차 프로모션은 매달 바뀌나요?",
    a: "네, 제조사·딜러 할인 조건은 매월 초 바뀝니다. 지난달과 이번 달 조건이 다른 경우가 많아, 계약 시점에 따라 실구매가가 수백만 원까지 차이 날 수 있습니다. 그래서 카피아는 매월 초 브랜드별로 갱신해 정리합니다.",
    link: { label: "이번 달 프로모션 보기", href: BOARDS.promotion.path },
  },
  {
    q: "수입차 살 때 뭘 비교해야 하나요?",
    a: "① 이번 달 제조사·딜러 프로모션 할인액, ② 현금·할부·리스·장기렌트 중 구매 방식, ③ 방식별 월 납입금과 총비용, ④ 취득세·보험·정비 등 부대비용까지 함께 봐야 합니다. 월 납입금만 비교하면 총비용에서 손해를 볼 수 있습니다.",
    link: { label: "구매 방식 비교하기", href: "#compare" },
  },
  {
    q: "할부, 리스, 장기렌트 중 뭐가 유리한가요?",
    a: "정답이 하나로 정해져 있지 않습니다. 사업자 여부, 보유 기간, 연간 주행거리, 초기 비용 여력에 따라 유리한 쪽이 갈립니다. 월 납입금만 보지 말고 총비용으로 비교하셔야 합니다.",
    link: { label: "총비용 비교 글 읽기", href: BOARDS.cartip.path },
  },
  {
    q: "리스와 장기렌트는 뭐가 다른가요?",
    a: "리스는 차량을 빌려 타다 만기에 반납하거나 인수하는 방식이고, 장기렌트는 세금·보험·정비까지 월 요금에 포함되는 경우가 많습니다. 리스는 사업자 비용 처리와 초기 부담 절감에, 장기렌트는 관리 부담을 줄이려는 분께 유리한 편입니다.",
    link: { label: "리스·렌트 비교하기", href: "#compare" },
  },
  {
    q: "상담을 신청하면 어떻게 진행되나요?",
    a: "원하시는 모델과 구매 방식을 남기시면 담당 매니저가 연락드려 조건을 확정합니다. 14개 제휴 금융사 조건을 함께 확인해 드립니다.",
  },
  {
    q: "어떤 브랜드를 취급하나요?",
    a: "BMW, 벤츠, 아우디, 폭스바겐, 볼보, 랜드로버, 미니, 포르쉐, 포드, 렉서스, 링컨, 지프, BYD, 람보르기니 등 14개 수입차 브랜드를 다룹니다.",
  },
  {
    q: "상담을 신청하면 신용조회가 되나요?",
    a: "상담 신청 단계에서는 신용조회가 이뤄지지 않습니다. 실제 금융 심사를 진행할 때 본인 동의를 받은 뒤에만 조회합니다.",
  },
  {
    q: "국산차도 가능한가요?",
    a: "가능합니다. 다만 이 페이지와 게시판 콘텐츠는 수입차 프로모션을 중심으로 운영합니다.",
  },
];

/**
 * 구매 방식 비교표 — 현금/할부/리스/장기렌트.
 * 정성적 사실(소유권·포함비용 등)만 담는다. 추측 수치 없음(GEO ④·저장소 수치 검증 원칙).
 * 실제 <table>로 렌더 → 비교/총정리 쿼리에서 AI가 표를 통째로 인용(GEO ⑩).
 */
export const COMPARE = {
  caption: "수입차 구매 방식 비교 — 현금·할부·리스·장기렌트",
  cols: ["현금", "할부", "리스", "장기렌트"],
  rows: [
    { label: "차량 소유", vals: ["즉시 내 차", "완납하면 내 차", "만기에 반납/인수 선택", "만기에 반납/인수 선택"] },
    { label: "초기 비용", vals: ["차값 전액", "선수금(조정 가능)", "보증금·선납 선택", "낮음(무보증도 가능)"] },
    { label: "월 납입", vals: ["없음", "원리금", "리스료", "렌트료"] },
    { label: "세금·보험·정비", vals: ["본인 부담", "본인 부담", "선택 포함", "대부분 포함"] },
    { label: "이럴 때 유리", vals: ["여유 자금·장기 보유", "내 차로 오래 탈 때", "사업자·초기부담 절감", "관리 부담 줄이기"] },
  ],
} as const;

/** S5 미니 계산기용 예시 차량 — 실제 조건이 아니라 이해를 돕는 예시다 */
export const CALC_CARS = [
  { id: "bmw520", name: "BMW 520i M 스포츠", price: 7490, discount: 780 },
  { id: "benzglc", name: "벤츠 GLC 300 4MATIC", price: 8360, discount: 640 },
  { id: "audiq5", name: "아우디 Q5 45 TFSI", price: 7180, discount: 1300 },
  { id: "volvoxc60", name: "볼보 XC60 B5", price: 6890, discount: 520 },
];
