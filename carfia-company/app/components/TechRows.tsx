import { TECH } from "../data";

/**
 * 기술 3축.
 * 진척도를 막대로 그리면 없는 정밀도를 주장하게 된다. 상태는 글자로만 적는다.
 * 상호작용이 없으므로 서버 컴포넌트로 둔다.
 */
export default function TechRows() {
  return (
    <ul className="tech">
      {TECH.map((t) => (
        <li key={t.axis} data-state={t.state}>
          <span className="tech__ax">0{t.axis}</span>
          <span className="tech__t">{t.title}</span>
          <span className="tech__d">{t.desc}</span>
          <span className="tech__st">{t.status}</span>
        </li>
      ))}
    </ul>
  );
}
