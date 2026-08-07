import { COMPARE } from "../data";

/**
 * 구매 방식 비교 — 진짜 <table>.
 * AI는 비교/총정리 쿼리에서 표를 통째로 인용한다(GEO ⑩). 서버 컴포넌트(정적).
 * 모바일에서는 좌우 스크롤로 표 형태를 유지한다(셀을 카드로 쪼개면 표 인용 이점이 사라짐).
 */
export default function CompareTable() {
  return (
    <div className="cmp" id="compare">
      <div className="cmp__scroll">
        <table className="cmp__table">
          <caption className="sr">{COMPARE.caption}</caption>
          <thead>
            <tr>
              <th scope="col">구분</th>
              {COMPARE.cols.map((c) => (
                <th scope="col" key={c}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {r.vals.map((v, i) => (
                  <td key={COMPARE.cols[i]}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cmp__note">
        일반적인 특징 비교이며, 실제 조건은 차종·금융사·약정에 따라 달라집니다. 월 납입금 예시는 위
        계산기에서 확인하세요.
      </p>
    </div>
  );
}
