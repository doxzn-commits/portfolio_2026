import { COMPARE } from "../data";

/**
 * 기존 시장 vs 카피아 — 한눈에 비교.
 *
 * 이전 버전은 좁은 화면에서 토글로 한쪽씩 보여줬다. 그건 대조가 아니다.
 * 두 값을 나란히 놓고 눈이 좌우로 한 번 오가면 끝나야 한다.
 * 그래서 문장을 구(句)로 줄이고, 좁은 화면에서도 2열을 유지한다.
 *
 * 상호작용이 없으니 서버 컴포넌트로 둔다.
 */
export default function Compare() {
  return (
    <table className="cmp2">
      <thead>
        <tr>
          <th />
          <th className="cmp2__hOld">지금까지</th>
          <th className="cmp2__hNew">카피아</th>
        </tr>
      </thead>
      <tbody>
        {COMPARE.map((c) => (
          <tr key={c.axis}>
            <th scope="row">{c.axis}</th>
            <td className="cmp2__old">{c.old}</td>
            <td className="cmp2__new">{c.now}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
