import CountUp from "../components/CountUp";
import Reveal from "../components/Reveal";
import ZigFlow from "../components/ZigFlow";
import Bar from "./components/Bar";
import FeeStack from "./components/FeeStack";
import LogoWall from "./components/LogoWall";
import VsDiagram from "./components/VsDiagram";
import { COMPANY, FAQ, HISTORY, LANES, SITE, SUCCESSION } from "../data";
import "./v2.css";

/**
 * ver.2 — 설명 중심 / 도식 중심.
 *
 * ver.1(/v1)이 제안서 톤이라 읽는 사람에게 배경 지식을 요구했다.
 * 여기서는 같은 사실을 그림으로 옮기고 문장을 중학생 눈높이로 낮춘다.
 *
 * ver.1 에서 뺀 것: 그룹 4개 법인, 시장 규모(18조/SAM), 기술 3축,
 * 비전 STEP, 파급효과, 고객군 표. 전부 처음 온 사람에게 필요한 정보가 아니다.
 */

function Head({ tag, title, desc }: { tag: string; title: React.ReactNode; desc?: string }) {
  return (
    <Reveal className="x-head">
      <span className="x-head__tag">{tag}</span>
      <h2>{title}</h2>
      {desc ? <p>{desc}</p> : null}
    </Reveal>
  );
}

export default function V2() {
  return (
    <>
      <Bar current="v2" />

      <main>
        {/* ───────── 히어로 ───────── */}
        <section className="x-sec x-hero">
          <div className="x-wrap">
            <Reveal>
              <h1>
                차 살 때 <em>무조건</em> 더 싸게 낼 수 있어요
              </h1>
            </Reveal>
            <Reveal delay={80}>
              <p className="x-hero__sub">
                차를 살 때 목돈이 없으면 돈을 빌리거나 나눠 냅니다. 그 조건을 카피아가 14곳에서 한 번에 받아와
                가장 싼 것을 골라 드립니다.
              </p>
            </Reveal>
            <Reveal delay={140}>
              {/* 여기서 조건을 고르는 게 아니라 바로 아래 두 갈래에서 고른다.
                  히어로에 선택 버튼을 두면 같은 결정을 두 번 묻는 셈이 된다. */}
              <div className="x-hero__cta">
                <a className="btn btn--line btn--lg" href={`tel:${SITE.tel.replace(/-/g, "")}`}>
                  전화로 물어보기
                </a>
              </div>
              <p className="x-hero__note">비교와 상담은 무료입니다 · 평일 09:00–18:00</p>
            </Reveal>

            <Reveal delay={200}>
              <div className="x-nums">
                <div className="x-num">
                  <b>
                    <CountUp value={45328} suffix="대" />
                  </b>
                  <span>카피아를 거쳐 간 차</span>
                  <small>5년 동안 쌓인 실제 거래</small>
                </div>
                <div className="x-num">
                  <b>
                    <CountUp value={14} suffix="곳" />
                  </b>
                  <span>한 번에 비교하는 금융사</span>
                  <small>모집인으로 정식 등록</small>
                </div>
                <div className="x-num">
                  <b>
                    <CountUp value={15} suffix="년" />
                  </b>
                  <span>이 일만 해온 기간</span>
                  <small>2011년 시작</small>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 두 갈래 — 히어로 바로 다음. 여기가 실질적인 입구다 ─────────
            두 카드가 각각 중고금융 / 신차 전환 페이지로 들어가는 창구 역할을 한다. */}
        <section className="x-sec x-sec--tint" id="lanes">
          <div className="x-wrap">
            <Head
              tag="무엇을 도와드리나"
              title={
                <>
                  어떤 차를 <em>알아보고</em> 계신가요
                </>
              }
              desc="사려는 차에 따라 들어가는 곳이 다릅니다. 해당하는 쪽을 눌러 주세요."
            />
            <div className="x-two">
              {LANES.map((l, i) => (
                <Reveal key={l.key} delay={i * 110}>
                  <article className="x-card">
                    <span className="x-card__ic" aria-hidden>
                      {l.emoji}
                    </span>
                    <p className="x-card__when">{l.eyebrow}</p>
                    <h3 className="x-card__t">{l.title}</h3>
                    <p className="x-card__d">{l.desc}</p>
                    <ul className="x-card__l">
                      {l.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    <div className="x-card__foot">
                      <a className="btn btn--accent btn--lg" href={l.href} style={{ width: "100%" }}>
                        {l.cta}
                        <span className="btn__arrow">→</span>
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal delay={240}>
              <p className="x-logos__note">{SUCCESSION}</p>
            </Reveal>
          </div>
        </section>

        {/* ───────── 도식 1: 지금 vs 카피아 ───────── */}
        <section className="x-sec" id="how">
          <div className="x-wrap">
            <Head
              tag="한눈에 보기"
              title={
                <>
                  지금까지는 <em>한 곳만</em> 물어봤습니다
                </>
              }
              desc="할부는 보통 딜러가 연결해 주는 곳에서 진행됩니다. 다른 곳이 더 싼지 비교할 기회가 없습니다."
            />
            <Reveal>
              <VsDiagram />
            </Reveal>
          </div>
        </section>

        {/* ───────── 도식 2: 진행 순서 — 좌우 지그재그 ───────── */}
        <section className="x-sec x-sec--tint" id="steps">
          <div className="x-wrap">
            <Head
              tag="진행 순서"
              title={
                <>
                  신청부터 차 받는 날까지 <em>5단계</em>
                </>
              }
              desc="한 번 신청하면 카피아가 끝까지 처리합니다."
            />
            <ZigFlow />
          </div>
        </section>

        {/* ───────── 도식 3: 금리가 왜 싸지나 ───────── */}
        <section className="x-sec x-sec--mint" id="why">
          <div className="x-wrap">
            <Head
              tag="왜 더 싼가"
              title={
                <>
                  불필요한 과정은 빼고, <em>다이렉트로</em> 거품가를 뺐습니다!
                </>
              }
              desc="이자는 금융사가 정한 기본 금리에, 중간에 거친 곳들의 몫이 더해져 정해집니다."
            />
            <Reveal>
              <FeeStack />
            </Reveal>
            <Reveal delay={100}>
              <p className="x-logos__note">
                위 그림은 구조를 설명하는 것으로, 특정 수수료율을 나타내지 않습니다.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────── 연혁 라인 표 ───────── */}
        <section className="x-sec" id="history">
          <div className="x-wrap">
            <Head
              tag="걸어온 길"
              title={
                <>
                  2011년부터 <em>이 일만</em> 해왔습니다
                </>
              }
            />
            <Reveal>
              <ol className="x-tl">
                {HISTORY.map((h) => (
                  <li key={h.year}>
                    <p className="x-tl__y">{h.span}</p>
                    <div>
                      <p className="x-tl__t">{h.title}</p>
                      <ul className="x-tl__l">
                        {h.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* ───────── 브랜드 로고 ───────── */}
        <section className="x-sec x-sec--tint" id="brands">
          <div className="x-wrap">
            <Head
              tag="함께 일하는 곳"
              title={
                <>
                  아는 이름들과 <em>이미</em> 일하고 있습니다
                </>
              }
            />
            <Reveal>
              <LogoWall />
            </Reveal>
          </div>
        </section>

        {/* ───────── 자주 묻는 질문 ───────── */}
        <section className="x-sec" id="faq">
          <div className="x-wrap">
            <Head tag="자주 묻는 질문" title="궁금한 것부터 눌러 보세요" />
            <Reveal>
              <div className="x-faq">
                {FAQ.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p className="x-faq__a">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 마무리 ───────── */}
        <section className="x-sec x-sec--tint x-end" id="contact">
          <div className="x-wrap">
            <Reveal>
              <h2>
                금리가 얼마 나올지, <em>먼저 물어보셔도</em> 됩니다
              </h2>
              <a className="x-end__tel" href={`tel:${SITE.tel.replace(/-/g, "")}`}>
                {SITE.tel}
              </a>
              <p className="x-end__hr">{COMPANY.hours} · 상담은 무료입니다</p>
              <div className="x-end__btns">
                <a className="btn btn--accent btn--lg" href="/">
                  내 금리 확인해 보기
                  <span className="btn__arrow">→</span>
                </a>
                <a className="btn btn--line btn--lg" href={`mailto:${SITE.email}`}>
                  이메일로 문의
                </a>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <dl className="x-info">
                <div>
                  <dt>회사명</dt>
                  <dd>{COMPANY.nameKo}</dd>
                </div>
                <div>
                  <dt>대표이사</dt>
                  <dd>{COMPANY.ceo}</dd>
                </div>
                <div>
                  <dt>사업자등록번호</dt>
                  <dd>{COMPANY.bizNo}</dd>
                </div>
                <div>
                  <dt>설립</dt>
                  <dd>{COMPANY.founded}</dd>
                </div>
                <div>
                  <dt>본사</dt>
                  <dd>{COMPANY.address}</dd>
                </div>
                <div>
                  <dt>사업장</dt>
                  <dd>{COMPANY.offices.join(" · ")}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
