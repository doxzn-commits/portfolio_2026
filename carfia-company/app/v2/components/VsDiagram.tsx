/**
 * 도식 1 — 지금 어떻게 되고 있나 vs 카피아를 쓰면.
 *
 * ver.1 은 이 내용을 4행 대조표로 설명했다. 표는 읽어야 이해되고, 그림은 보면 이해된다.
 * 같은 사실을 "나 → 누구를 거쳐 → 금융사 몇 곳 → 결과" 흐름으로 그린다.
 * 두 줄의 노드 개수가 다른 것 자체가 메시지다.
 */

const NOW = [
  { ic: "🙋", t: "나", d: "차를 사려는 사람" },
  { ic: "🧑‍💼", t: "딜러", d: "딜러가 아는 곳으로 연결" },
  { ic: "🏦", t: "금융사 1곳", d: "딜러와 제휴된 곳" },
];

const CARFIA = [
  { ic: "🙋", t: "나", d: "차를 사려는 사람" },
  { ic: "🟢", t: "카피아", d: "한 번만 신청", hi: true },
  { ic: "🏦", t: "금융사 14곳", d: "동시에 조건 비교", hi: true },
];

export default function VsDiagram() {
  return (
    <div className="x-vs">
      <div className="x-row x-row--bad">
        <p className="x-row__label">
          <i>✕</i> 지금까지 이렇게 진행됐습니다
        </p>
        <div className="x-flowline">
          {NOW.map((n, i) => (
            <div key={n.t} style={{ display: "contents" }}>
              <div className="x-node">
                <span className="x-node__ic" aria-hidden>
                  {n.ic}
                </span>
                <span className="x-node__t">{n.t}</span>
                <span className="x-node__d">{n.d}</span>
              </div>
              {i < NOW.length - 1 ? <span className="x-arrow" aria-hidden /> : null}
            </div>
          ))}
        </div>
        <p className="x-row__out">딜러가 정해 준 금리를 그대로 받습니다</p>
      </div>

      <div className="x-row x-row--good">
        <p className="x-row__label">
          <i>✓</i> 카피아를 거치면
        </p>
        <div className="x-flowline">
          {CARFIA.map((n, i) => (
            <div key={n.t} style={{ display: "contents" }}>
              <div className={`x-node${n.hi ? " x-node--hi" : ""}`}>
                <span className="x-node__ic" aria-hidden>
                  {n.ic}
                </span>
                <span className="x-node__t">{n.t}</span>
                <span className="x-node__d">{n.d}</span>
              </div>
              {i < CARFIA.length - 1 ? <span className="x-arrow" aria-hidden /> : null}
            </div>
          ))}
        </div>
        <p className="x-row__out">
          14곳 가운데 <b>가장 낮은 금리</b>를 골라서 받습니다
        </p>
      </div>
    </div>
  );
}
