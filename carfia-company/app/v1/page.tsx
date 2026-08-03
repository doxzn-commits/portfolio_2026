import Chart from "../components/Chart";
import Chrome from "../components/Chrome";
import Compare from "../components/Compare";
import CountUp from "../components/CountUp";
import Gauges from "../components/Gauges";
import Reveal from "../components/Reveal";
import Split from "../components/Split";
import TechRows from "../components/TechRows";
import ZigFlow from "../components/ZigFlow";
import {
  CHANNELS,
  COMPANY,
  DEFINITION,
  FINANCE,
  FINANCE_MORE,
  GROUP,
  GROUP_NOTE,
  GROWTH,
  GROWTH_NOTE,
  HERO_STATS,
  HISTORY,
  IMPACT,
  MARKET,
  MOAT,
  PARTNER_NOTE,
  PEOPLE,
  PLATFORMS,
  REVENUE_NOTE,
  SEGMENTS,
  SITE,
  SUCCESSION,
  TECH_NOTE,
  VISION,
  VISION_CLOSING,
} from "../data";

/** 섹션 머리 — 라벨 + 제목 + 리드. 열한 개 섹션이 같은 리듬으로 열린다. */
function Head({ label, title, lead }: { label: string; title: React.ReactNode; lead?: React.ReactNode }) {
  return (
    <Reveal className="sec__head">
      <span className="label">{label}</span>
      <h2 className="h2">{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </Reveal>
  );
}

export default function Page() {
  const channelMax = Math.max(...CHANNELS.map((c) => c.amount));
  const last = GROWTH[GROWTH.length - 1];

  return (
    <>
      <Chrome />

      <main>
        {/* ───────── 소개 ─────────
            처음 온 사람이 첫 화면에서 답을 얻어야 하는 질문은 "이 회사 뭐 하는 데인가"다. */}
        <section className="sec hero" id="intro">
          <div className="inner">
            <Reveal>
              <h1 className="h1 hero__h1">
                차 살 때 금리는 원래 <em>고르는</em> 것입니다
              </h1>
            </Reveal>
            <Reveal delay={80}>
              <p className="hero__def">{DEFINITION}</p>
            </Reveal>
            <Reveal delay={150}>
              <div className="hero__cta">
                <a className="btn btn--accent btn--lg" href="#lanes">
                  최저금리부터 확인하기
                  <span className="btn__arrow">→</span>
                </a>
                <a className="btn btn--line btn--lg" href={`tel:${SITE.tel.replace(/-/g, "")}`}>
                  바로 전화 상담
                </a>
              </div>
              <p className="hero__tel">
                상담은 무료입니다 · 평일 09:00–18:00 · <b>{SITE.tel}</b>
              </p>
            </Reveal>

            <Reveal delay={210}>
              <dl className="figs">
                {HERO_STATS.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>
                      <CountUp value={s.value} suffix={s.suffix} />
                      <small>{s.note}</small>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ───────── 갈림길: 두 사업부 ─────────
            히어로 바로 다음 자리다. 여기서 자기 길을 고르지 못하면 나머지는 읽히지 않는다. */}
        <section className="sec sec--tint sec--center" id="lanes">
          <div className="inner">
            <Head
              label="하는 일"
              title={
                <>
                  어떤 차를 <em>알아보고</em> 계신가요
                </>
              }
              lead="중고차 거래 플랫폼도, 렌터카 회사도 아닙니다. 차를 살 때 붙는 금융 조건을 대신 비교하고 실행해 드리는 곳입니다."
            />
            <Split />
            <Reveal delay={240}>
              <p className="succ">{SUCCESSION}</p>
            </Reveal>
          </div>
        </section>

        {/* ───────── 문제 제기 — 페이지에서 유일하게 검정을 쓰는 곳 ───────── */}
        <section className="sec sec--dark sec--center" id="market">
          <div className="inner">
            <Head
              label="왜 이런 회사가 필요한가"
              title={
                <>
                  보험은 직접 고르면서, <em>할부는</em> 왜 못 고를까요
                </>
              }
              lead="자동차보험은 이제 직접 비교해서 가입합니다. 그런데 자동차 할부는 아직도 딜러가 연결해 주는 곳에서, 만나서, 시키는 대로 진행됩니다."
            />

            <div className="mkt">
              <Reveal>
                <div>
                  <div className="sizes">
                    <div>
                      <b>{MARKET.size}</b>
                      <span>{MARKET.sizeLabel}</span>
                    </div>
                    <div>
                      <b className="on">{MARKET.sam}</b>
                      <span>{MARKET.samLabel}</span>
                    </div>
                  </div>
                  <Gauges />
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div>
                  <ul className="rows">
                    {MARKET.barriers.map((b, i) => (
                      <li key={b.title}>
                        <span className="rows__k">
                          <em>장벽 {i + 1}</em>
                          {b.title}
                        </span>
                        <span className="rows__v">{b.desc}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="note">{MARKET.conclusion}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────── 무엇이 달라지나 ───────── */}
        <section className="sec" id="compare">
          <div className="inner">
            <Head
              label="무엇이 달라지나"
              title={
                <>
                  금리를 고르는 사람이 딜러에서 <em>나</em>로 바뀝니다
                </>
              }
              lead="지금까지 금융사가 상대해 온 사람은 딜러였습니다. 그래서 조건도 딜러 편에서 정해졌습니다."
            />
            <Reveal>
              <Compare />
            </Reveal>
            <Reveal delay={90}>
              <ul className="impact">
                {IMPACT.map((i) => (
                  <li key={i.who}>
                    <b>{i.who}</b>
                    <span>{i.what}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ───────── 진행 순서 · 기술 ───────── */}
        <section className="sec sec--tint" id="flow">
          <div className="inner">
            <Head
              label="어떻게 진행되나"
              title={
                <>
                  신청부터 차 받는 날까지, <em>한 번에</em>
                </>
              }
              lead="한 번 신청하면 카피아가 끝까지 처리합니다."
            />
            <ZigFlow />
            <Reveal delay={90}>
              <p className="flow__tail">{TECH_NOTE}</p>
            </Reveal>

            <Reveal delay={140}>
              <div style={{ marginTop: "clamp(64px, 8vw, 108px)" }}>
                <span className="label">이걸 가능하게 하는 것</span>
                <TechRows />
                <ul className="moat">
                  {MOAT.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                <p className="note">기업부설연구소를 두고 조회부터 정산까지 직접 만듭니다.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 실적 ───────── */}
        <section className="sec" id="growth">
          <div className="inner">
            <Head
              label="믿어도 되나"
              title={
                <>
                  <em>45,328</em>대의 차가 카피아를 거쳐 갔습니다
                </>
              }
              lead={`5년 동안 9,245억원의 자동차 금융을 실행했습니다. ${GROWTH_NOTE}.`}
            />

            <div className="growth">
              <Reveal>
                <Chart />
              </Reveal>

              <Reveal delay={90}>
                <div>
                  <dl className="metrics">
                    <div>
                      <dt>2025년 한 해 실행 금액</dt>
                      <dd>
                        <b>
                          {last.amount.toLocaleString()}
                          <i>억원</i>
                        </b>
                      </dd>
                    </div>
                    <div>
                      <dt>2025년 한 해 실행 건수</dt>
                      <dd>
                        <b>
                          {last.count.toLocaleString()}
                          <i>건</i>
                        </b>
                      </dd>
                    </div>
                  </dl>

                  <span className="label">2025년, 어디서 들어온 건인가</span>
                  <ul className="chan">
                    {CHANNELS.map((c) => (
                      <li key={c.name}>
                        <span className="chan__n">{c.name}</span>
                        <span className="chan__b">
                          <i style={{ width: `${(c.amount / channelMax) * 100}%` }} />
                        </span>
                        <span className="chan__v">{c.amount.toLocaleString()}억원</span>
                      </li>
                    ))}
                  </ul>
                  <p className="note">{REVENUE_NOTE}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────── 연혁 ───────── */}
        <section className="sec sec--tint" id="history">
          <div className="inner">
            <Head
              label="걸어온 길"
              title={
                <>
                  2011년부터 <em>이 일만</em> 해왔습니다
                </>
              }
              lead="회사 이름은 몇 번 바뀌었지만 하는 일은 15년째 그대로입니다."
            />
            <Reveal>
              <ul className="hist">
                {HISTORY.map((h) => (
                  <li key={h.year}>
                    <p className="hist__y">{h.span}</p>
                    <div>
                      <h3 className="hist__t">{h.title}</h3>
                      <ul className="hist__l">
                        {h.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ───────── 그룹과 사람 ───────── */}
        <section className="sec" id="group">
          <div className="inner">
            <Head label="누가 만들고 있나" title={<>네 개 회사가 <em>나눠</em> 맡습니다</>} lead={GROUP_NOTE} />

            <Reveal>
              <ul className="group">
                {GROUP.map((g) => (
                  <li key={g.name} data-core={g.core}>
                    <span className="group__n">{g.name}</span>
                    <span className="group__r">{g.role}</span>
                    <span className="group__d">
                      {g.desc}
                      <small>{g.place}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={90}>
              <ul className="people hrail-sm">
                {PEOPLE.map((p) => (
                  <li key={p.name}>
                    <span className="people__n">{p.name}</span>
                    <span className="people__r">{p.role}</span>
                    <span className="people__c">{p.career}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ───────── 파트너 ───────── */}
        <section className="sec sec--tint" id="partners">
          <div className="inner">
            <Head
              label="어디와 일하나"
              title={
                <>
                  이름 아는 곳들과 <em>이미</em> 일하고 있습니다
                </>
              }
              lead={PARTNER_NOTE}
            />

            <Reveal>
              <div className="pblock">
                <h3>자동차 플랫폼 · 채널 제휴</h3>
                <ul className="plist plist--key">
                  {PLATFORMS.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <div className="pblock">
                <h3>모집인 등록 금융사</h3>
                <ul className="plist">
                  {FINANCE.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                  <li className="plist__more">{FINANCE_MORE}</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <ul className="seg">
                {SEGMENTS.map((s) => (
                  <li key={s.name} data-done={s.done}>
                    <span className="seg__n">{s.name}</span>
                    <span className="seg__s">{s.scale}</span>
                    <span className="seg__t">{s.status}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ───────── 비전 ───────── */}
        <section className="sec sec--center" id="vision">
          <div className="inner">
            <Head
              label="앞으로 하려는 일"
              title={
                <>
                  차를 <em>사고 타고 파는</em> 동안 계속 곁에 있으려 합니다
                </>
              }
              lead="살 때 금리를 비교하는 데서 그치지 않고, 몇 년 뒤 그 차의 가치까지 책임지려 합니다."
            />

            <Reveal>
              <ul className="vision rail">
                {VISION.map((v) => (
                  <li key={v.step}>
                    <p className="vision__s">
                      <b>{v.step}</b>
                      <span>{v.when}</span>
                    </p>
                    <h3 className="vision__t">{v.title}</h3>
                    <p className="vision__d">{v.desc}</p>
                  </li>
                ))}
              </ul>
              <p className="hint" aria-hidden>
                옆으로 밀어 단계 보기
              </p>
            </Reveal>

            <Reveal delay={110}>
              <div className="closing">
                {VISION_CLOSING.map((c) => (
                  <p key={c}>{c}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── 회사 정보 ───────── */}
        <section className="sec sec--tint" id="contact">
          <div className="inner">
            <Head label="회사 정보" title="어떤 회사인지 확인해 보세요" />

            <div className="contact">
              <Reveal>
                <dl className="info">
                  <div>
                    <dt>회사명</dt>
                    <dd>
                      {COMPANY.nameKo} ({COMPANY.nameEn})
                    </dd>
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
                  <div>
                    <dt>구성원</dt>
                    <dd>{COMPANY.people}</dd>
                  </div>
                  <div>
                    <dt>이메일</dt>
                    <dd>
                      <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={90}>
                <div className="reach">
                  <h3>
                    궁금한 게 있으면 <em>편하게</em> 전화 주세요
                  </h3>
                  <p>
                    지금 알아보는 차가 있어도 좋고, 아직 없어도 괜찮습니다. 금리가 얼마쯤 나올지, 할부와 리스 중
                    뭐가 나은지부터 물어보셔도 됩니다. 상담은 무료입니다.
                  </p>
                  <a className="reach__tel" href={`tel:${SITE.tel.replace(/-/g, "")}`}>
                    {SITE.tel}
                  </a>
                  <p className="reach__hr">{COMPANY.hours}</p>
                  {/* 전화번호가 이미 크게 놓여 있으므로 버튼은 그다음 행동을 맡는다. */}
                  <div className="reach__btns">
                    <a className="btn btn--accent btn--lg" href="/">
                      내 금리 확인해 보기
                      <span className="btn__arrow">→</span>
                    </a>
                    <a className="btn btn--line btn--lg" href={`mailto:${SITE.email}`}>
                      이메일로 문의
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="foot">
              <div className="foot__in">
                <b>{COMPANY.nameKo}</b>
                <span>대표 {COMPANY.ceo}</span>
                <span>사업자등록번호 {COMPANY.bizNo}</span>
                <span>{COMPANY.address}</span>
                <span>{SITE.tel}</span>
                <span>최종 갱신 {SITE.updatedAt}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
