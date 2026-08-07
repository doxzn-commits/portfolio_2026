import { Header, ScrollProgress, StickyCta } from "./components/Chrome";
import Reveal from "./components/Reveal";
import HowItWorks from "./components/HowItWorks";
import Offerings from "./components/Offerings";
import Calculator from "./components/Calculator";
import CompareTable from "./components/CompareTable";
import CountUp from "./components/CountUp";
import { SITE, DEFINITION, BOARDS, BRANDS, PROOF_STATS, FAQS } from "./data";

/** S2 — 랜딩의 "문제 제기"가 아니라 상세 페이지의 "이런 분께 권합니다" */
const FORWHO = [
  {
    ic: "🚗",
    q: "곧 수입차 구매하려고요!",
    a: "이번 달 프로모션부터 브랜드별로 딱 정리해드려요. 정가 주고 살 필요, 없습니다.",
  },
  {
    ic: "🧮",
    q: "할부·리스·렌트 뭘 봐야 할지 모르겠어요",
    a: "현금·할부·리스·렌트를 한 화면에 나란히. 월 납입금부터 총비용까지 비교해드립니다.",
  },
  {
    ic: "🔎",
    q: "정보가 너무 많아서 비교하기 힘들어요",
    a: "흩어진 조건을 한곳에 모아 매달 갱신. 필요한 것만 골라 쉽게 보여드려요.",
  },
];

export default function IntroPage() {
  const updated = BRANDS.filter((b) => b.updated).length;

  return (
    <>
      <ScrollProgress />
      <Header />

      <main>
        {/* ================= 브레드크럼: 하위 페이지 신호 ================= */}
        <div className="wrap">
          <nav className="crumb" aria-label="위치">
            <a href="https://carfia.co.kr">홈</a>
            <i aria-hidden>›</i>
            <span aria-current="page">카피아 소개</span>
          </nav>
        </div>

        {/* ================= S1 소개 헤더 ================= */}
        <section className="hero" aria-label="카피아 소개 개요">

          <div className="wrap">
            <Reveal>
              {/* 핵심 문장은 이미지가 아니라 텍스트 — AI 가 읽어야 한다. 키워드+브랜드 h1 */}
              <h1 className="hero__h1">
                수입차 전국 할인가 비교 서비스, <span className="hero__brand">카피아</span>
              </h1>

              {/* h1 직후 첫 문단 = AI 가 그대로 인용할 정의문. 강점 문구는 화면에서 강조(마크업).
                  DEFINITION 원문(평문)은 meta·JSON-LD·FAQ에서 그대로 쓴다 → 화면만 강조. */}
              <p className="hero__def">
                카피아(Carfia)는{" "}
                <mark className="hero__def-hl">
                  딜러사마다 다른 수입차 할인가를 비교해 지금 받을 수 있는 최고 할인가
                </mark>
                를 알려주고, 할부·리스·장기렌트 조건까지 함께 확인해 실구매가를 알려주는 수입차 프로모션
                비교 서비스입니다.
              </p>

              <div className="hero__cta">
                <a href={BOARDS.promotion.path} className="btn btn--primary">
                  이번 달 프로모션 보기 <span className="btn__arrow" aria-hidden>→</span>
                </a>
                <a href="#consult" className="btn btn--ghost">
                  무료 상담 신청
                </a>
              </div>
              <p className="hero__tel">
                전화 상담 <b>{SITE.tel}</b> · 평일 09:00–18:00
              </p>
            </Reveal>
          </div>
        </section>

        {/* ================= 01 오직 카피아에서만 (그래프 + 제공 콘텐츠) ================= */}
        <section className="section section--surface" aria-label="제공 콘텐츠 — 할인 추이 그래프와 수입차 프로모션·핫딜·차량 꿀팁">
          <div className="wrap">
            <div className="sec-head">
              <Reveal>
                <p className="eyebrow">
                  <b>01</b> 오직 카피아에서만
                </p>
                <h2 className="h2">이건, 카피아가 제일 잘합니다</h2>
                <p className="lead">
                  딜러사마다 다른 할인가를 비교해 최고 할인가를. 프로모션·핫딜·꿀팁까지 이만큼 부지런히 챙기는
                  곳은 흔치 않습니다. 게다가 전부 무료예요.
                </p>
              </Reveal>
            </div>
            <Reveal>
              <Offerings />
            </Reveal>
          </div>
        </section>

        {/* ================= 02 이런 분께 ================= */}
        <section className="section" aria-label="추천 대상 — 카피아가 해결하는 고민">
          <div className="wrap">
            <div className="sec-head">
              <Reveal>
                <p className="eyebrow">
                  <b>02</b> 이런 분께
                </p>
                <h2 className="h2">이런 고민, 딱 하나라도 있으신가요?</h2>
                <p className="lead">
                  하나라도 해당된다면 잘 오셨어요.
                </p>
              </Reveal>
            </div>
            <Reveal>
              <p className="who-strength">
                <b>카피아는 딜러사마다 다른 할인가를 비교해, 지금 받을 수 있는 최고 할인가를 알려드립니다.</b>{" "}
                여기에 할부·리스·장기렌트 조건까지 함께 확인해 실구매가로 보여주는 수입차 프로모션 비교
                서비스예요.
              </p>
            </Reveal>
            <div className="forwho">
              {FORWHO.map((w, i) => (
                <Reveal key={w.q} delay={i * 80}>
                  <article className="who">
                    <p className="who__ic" aria-hidden>
                      {w.ic}
                    </p>
                    <p className="who__q">“{w.q}”</p>
                    <p className="who__a">
                      <em>카피아는</em> {w.a}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 03 사용 방법 (설명서 핵심) ================= */}
        <section className="section section--surface" aria-label="카피아 사용 방법 4단계">

          <div className="wrap">
            <div className="sec-head">
              <Reveal>
                <p className="eyebrow">
                  <b>03</b> 사용 방법
                </p>
                <h2 className="h2">차 고르고 견적까지, 4단계면 끝</h2>
                <p className="lead">
                  복잡할 것 같죠? 직접 눌러보면 3분이면 실구매가가 나옵니다.
                </p>
              </Reveal>
            </div>
            <HowItWorks />
          </div>
        </section>

        {/* ================= 04 미리 체험 ================= */}
        <section className="section" aria-label="구매 방식별 월 납입금 비교 체험">

          <div className="wrap">
            <div className="sec-head">
              <Reveal>
                <p className="eyebrow">
                  <b>04</b> 미리 체험
                </p>
                <h2 className="h2">같은 차인데, 사는 방법 하나로 이만큼 벌어집니다</h2>
                <p className="lead">
                  직접 눌러보세요. 카피아가 비교해주는 방식 그대로, 월 납입금이 어떻게 갈리는지 바로 보입니다.
                </p>
              </Reveal>
            </div>
            <Reveal>
              <Calculator />
            </Reveal>

            <Reveal delay={80}>
              <h3 className="cmp__title">구매 방식 한눈에 비교</h3>
              <CompareTable />
            </Reveal>
          </div>
        </section>

        {/* ================= 05 신뢰 근거 ================= */}
        <section className="section section--surface" aria-label="신뢰 근거 — 이용 실적과 취급 브랜드">

          <div className="wrap">
            <div className="sec-head">
              <Reveal>
                <p className="eyebrow">
                  <b>05</b> 대중이 선택했습니다
                </p>
                <h2 className="h2">15년의 베테랑이 진행합니다</h2>
                <p className="lead">
                  카피아는 2011년 자동차금융에서 출발했습니다. 프로모션 비교는 그 내공 위에 얹은 서비스예요.
                </p>
              </Reveal>
            </div>

            <Reveal>
              <dl className="stats">
                {PROOF_STATS.map((s) => (
                  <div className="stat" key={s.label}>
                    <CountUp value={s.value} suffix={s.suffix} />
                    <dt>{s.label}</dt>
                    <dd>{s.desc}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={80}>
              <div className="logos" aria-label="취급 브랜드">
                <div className="logos__track">
                  {[...BRANDS, ...BRANDS].map((b, i) => (
                    <span key={`${b.name}-${i}`} aria-hidden={i >= BRANDS.length}>
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="biz">
                <b>카피아</b> · 대표 오영수 · 서울특별시 송파구 · 대표번호 {SITE.tel} ·
                hello@carfia.co.kr
                <br />
                자동차금융 상품의 계약 체결 권한은 각 금융회사에 있으며, 카피아는 대출성 상품의
                판매대리·중개 업무를 수행합니다. 상담 신청 단계에서는 신용조회가 이뤄지지 않습니다.
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= S7 FAQ ================= */}
        <section className="section" aria-label="자주 묻는 질문">

          <div className="wrap">
            <div className="sec-head">
              <Reveal>
                <p className="eyebrow">
                  <b>06</b> 자주 묻는 질문
                </p>
                <h2 className="h2">이건 미리 답해둘게요</h2>
              </Reveal>
            </div>
            {/* details/summary — 접힌 상태에서도 답변이 DOM 에 존재해 AI 가 읽는다 */}
            <Reveal>
              <div className="faq">
                {FAQS.map((f, i) => (
                  <details key={f.q} open={i === 0}>
                    <summary>{f.q}</summary>
                    <div className="faq__a">
                      <p>{f.a}</p>
                      {f.link && (
                        <a className="faq__link" href={f.link.href}>
                          {f.link.label} <span aria-hidden>→</span>
                        </a>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= S8 최종 CTA ================= */}
        <section className="section section--tight" id="consult" aria-label="상담 신청 안내">

          <div className="wrap">
            <Reveal>
              <div className="final">
                <h2>이번 달 조건, 지금 확인하세요</h2>
                <p>
                  조회도 비교도 상담도 전부 무료. 당장 안 사더라도, 조건은 알고 시작하는 게 이득입니다.
                </p>
                <div className="final__cta">
                  <a href={BOARDS.promotion.path} className="btn btn--primary">
                    이번 달 프로모션 확인하기 <span className="btn__arrow" aria-hidden>→</span>
                  </a>
                  <a href="#consult" className="btn btn--ghost">
                    무료 상담 신청
                  </a>
                </div>
                <p className="final__tel">
                  전화 상담 <b>{SITE.tel}</b> · 평일 09:00–18:00
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ================= S9 푸터 ================= */}
      <footer className="ftr">
        <div className="wrap">
          <nav className="ftr__nav" aria-label="게시판">
            <a href={BOARDS.promotion.path}>수입차 프로모션</a>
            <a href={BOARDS.hotdeal.path}>핫딜</a>
            <a href={BOARDS.cartip.path}>차량 꿀팁</a>
            <a href={BOARDS.news.path}>차량 뉴스</a>
            <a href={BOARDS.newsModel.path}>모델 상세 정보</a>
          </nav>
          <p className="ftr__legal">
            <b>카피아</b> · 대표 오영수 · 서울특별시 송파구
            <br />
            대표번호 {SITE.tel} · hello@carfia.co.kr
          </p>
          <p className="ftr__disc">
            본 페이지의 프로모션·금리 정보는 {SITE.updatedAt.replace(/-/g, ".")} 기준이며 제조사 및
            금융회사 정책에 따라 변경될 수 있습니다. 계산기 금액은 예시이며 실제 조건은 심사 결과에 따라
            달라집니다.
            <br />© 2026 Carfia. All rights reserved.
          </p>
        </div>
      </footer>

      <StickyCta />
    </>
  );
}
