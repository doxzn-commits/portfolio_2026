import { BOARDS } from "../data";
import PromoChart from "./PromoChart";

/**
 * S4 — "카피아 소개" 하위 페이지이므로 실제 최신 글을 끌어오지 않는다.
 * 강의 상세페이지의 "커리큘럼"처럼, 무엇을 제공하는지를 설명한다.
 * 예시 주제는 유형을 보여줄 뿐 라이브 피드가 아니다(라벨로 명시).
 * 서버 컴포넌트 — 상호작용이 없어 클라이언트 번들에 넣지 않는다.
 */
const OFFERS = [
  {
    ic: "📋",
    freq: "매월 갱신",
    title: "수입차 프로모션",
    desc: "14개 브랜드 이번 달 할인 조건을 매월 초 싹 정리합니다. 어느 브랜드가 이번 달 가장 많이 빠지는지, 한눈에.",
    eg: ["브랜드별 이번 달 할인액 총정리", "전월 대비 뭐가 바뀌었는지", "트림별 실구매가 비교"],
    href: BOARDS.promotion.path,
    more: "프로모션 보러가기",
  },
  {
    ic: "🔥",
    freq: "수시 업데이트",
    title: "수입차 핫딜",
    desc: "재고 떨이, 기간 한정 특가. 인증 매니저가 직접 물어온 진짜 딜만 올립니다. 놓치면 끝이에요.",
    eg: ["재고 한정 최대 할인 딜", "매니저가 직접 확보한 특가", "즉시 출고 가능 물량"],
    href: BOARDS.hotdeal.path,
    more: "핫딜 보러가기",
  },
  {
    ic: "💡",
    freq: "주 단위 발행",
    title: "차량 꿀팁",
    desc: "실구매가, 유지비, 리스 vs 렌트… 계약 전에 알았으면 좋았을 것들만 골라 쉽게 풀어드려요.",
    eg: ["할부·리스·렌트 총비용 비교", "차값 말고 더 붙는 부대비용", "전기차 보조금·감가 가이드"],
    href: BOARDS.cartip.path,
    more: "꿀팁 보러가기",
  },
];

export default function Offerings() {
  return (
    <div>
      {/* 프로모션 대표 기능 — 할인 추이 그래프 (우상향 애니메이션) */}
      <div className="promo-feature">
        <div className="promo-feature__txt">
          <span className="offer__freq">할인 추이 그래프</span>
          <h3>할인이 어떻게 움직이는지, 그래프로 보여드려요</h3>
          <p>
            내 차의 자사·타사 할인 추이를 한눈에. 지금이 살 때인지, 조금 더 기다릴 때인지 그래프가
            말해줍니다.
          </p>
          <a className="offer__more" href={BOARDS.promotion.path}>
            프로모션 보러가기 <span className="btn__arrow" aria-hidden>→</span>
          </a>
        </div>
        <PromoChart />
      </div>

      <div className="offers">
        {OFFERS.map((o) => (
          <article className="offer" key={o.title}>
            <div className="offer__top">
              <span className="offer__ic" aria-hidden>
                {o.ic}
              </span>
              <span className="offer__freq">{o.freq}</span>
            </div>
            <h3>{o.title}</h3>
            <p>{o.desc}</p>
            <div className="offer__eg">
              <em>이런 걸 챙겨드려요</em>
              <ul>
                {o.eg.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <a className="offer__more" href={o.href}>
                {o.more} <span className="btn__arrow" aria-hidden>→</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="subboards">
        이 밖에
        <a href={BOARDS.news.path}>차량 뉴스</a>
        <a href={BOARDS.newsModel.path}>모델 상세 정보</a>
        게시판도 함께 운영합니다.
      </p>
    </div>
  );
}
