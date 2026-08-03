import { LANES } from "../data";
import Reveal from "./Reveal";

/**
 * 갈림길 — 두 사업부를 나란히 세운다.
 *
 * 직전 버전은 탭 안에 셋을 접어 두었다. 탭을 누르지 않으면 신차 프로모션이
 * 있다는 사실 자체가 전달되지 않는다. 중고차를 사려는 사람과 신차를 사려는
 * 사람은 애초에 다른 사람이므로, 감추지 않고 둘 다 보여 주고 고르게 한다.
 *
 * 두 카드가 0.1초 차이로 들어와 "둘 중 하나를 고르는 화면"이라는 인상을 만든다.
 */
export default function Split() {
  return (
    <div className="split">
      {LANES.map((l, i) => (
        <Reveal key={l.key} delay={i * 110}>
          <article className="lane">
            <span className="lane__ic" aria-hidden>
              {l.emoji}
            </span>
            <p className="lane__eyebrow">{l.eyebrow}</p>
            <h3 className="lane__t">{l.title}</h3>
            <p className="lane__d">{l.desc}</p>
            <ul className="lane__pts">
              {l.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="lane__foot">
              <p className="lane__num">
                <b>{l.num}</b>
                <span>{l.numLabel}</span>
              </p>
              <a className="btn btn--accent btn--lg" href={l.href} style={{ marginTop: 22, width: "100%" }}>
                {l.cta}
                <span className="btn__arrow">→</span>
              </a>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
