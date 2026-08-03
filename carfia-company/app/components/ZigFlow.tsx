import { FLOW } from "../data";
import Reveal from "./Reveal";

/**
 * 5단계 진행 순서 — 좌우 지그재그.
 *
 * 홀수 단계는 그림이 왼쪽, 짝수 단계는 그림이 오른쪽에 온다.
 * 시선이 좌우로 꺾이면서 내려가기 때문에 같은 카드가 반복되는 느낌이 사라지고,
 * 단계가 넘어간다는 감각이 배치 자체로 전달된다.
 *
 * 좁은 화면에서는 지그재그를 접고 그림을 항상 위에 둔다 — 폭이 없으면 지그재그가
 * 오히려 읽는 순서를 헷갈리게 만든다.
 *
 * v1 과 v2 가 같은 컴포넌트를 쓴다. 스타일은 globals.css 의 .zig 에 있다.
 */
export default function ZigFlow() {
  return (
    <ol className="zig">
      {FLOW.map((f, i) => (
        <li className="zig__row" data-side={i % 2 === 0 ? "left" : "right"} key={f.step}>
          <Reveal className="zig__art">
            <span className="zig__ic" aria-hidden>
              {f.emoji}
            </span>
          </Reveal>
          <Reveal className="zig__body" delay={80}>
            <span className="zig__no">STEP {f.step}</span>
            <h3 className="zig__t">{f.title}</h3>
            <p className="zig__d">{f.desc}</p>
            <p className="zig__old">
              <em>예전에는</em>
              {f.old}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
