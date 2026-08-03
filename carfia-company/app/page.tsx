import Link from "next/link";
import "./v2/v2.css";

/**
 * 버전 선택 화면.
 *
 * 회사 소개 페이지 후보 두 개를 나란히 두고 비교하기 위한 임시 입구다.
 * 어느 쪽으로 갈지 정해지면 이 파일을 고른 버전의 내용으로 바꾸고 /v1 /v2 를 지운다.
 */
export const metadata = { title: "카피아 회사 소개 — 시안 비교" };

const VERSIONS = [
  {
    href: "/v1",
    tag: "ver.1",
    emoji: "📄",
    title: "제안서 톤",
    desc: "실적과 근거를 순서대로 쌓아 신뢰를 만드는 구성. 제휴사나 투자자가 읽어도 막히지 않는 밀도.",
    points: ["11개 섹션 · 헤어라인 정돈", "취급액·매출 추이 차트", "그룹 구조와 구성원 소개", "검정 배경으로 문제 제기"],
  },
  {
    href: "/v2",
    tag: "ver.2",
    emoji: "🧩",
    title: "설명서 톤",
    desc: "중학생이 읽어도 이해되는 눈높이. 문장으로 설명하지 않고 그림으로 보여주는 구성.",
    points: ["도식 3개 — 비교 흐름 · 5단계 · 수수료", "연혁은 세로 라인 표", "브랜드 로고 월", "자주 묻는 질문"],
  },
];

export default function Picker() {
  return (
    <main className="x-sec" style={{ minHeight: "100svh", display: "grid", alignContent: "center" }}>
      <div className="x-wrap">
        <div className="x-head">
          <span className="x-head__tag">시안 비교</span>
          <h2>
            회사 소개 페이지 <em>두 가지</em> 시안
          </h2>
          <p>같은 사실을 서로 다른 방식으로 풀었습니다. 두 개를 열어 보고 방향을 정해 주세요.</p>
        </div>

        <div className="x-two">
          {VERSIONS.map((v) => (
            <Link className="x-card" href={v.href} key={v.href}>
              <span className="x-card__ic" aria-hidden>
                {v.emoji}
              </span>
              <p className="x-card__when">{v.tag}</p>
              <h3 className="x-card__t">{v.title}</h3>
              <p className="x-card__d">{v.desc}</p>
              <ul className="x-card__l">
                {v.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="x-card__foot">
                <span className="btn btn--accent btn--lg" style={{ width: "100%" }}>
                  {v.tag} 보기
                  <span className="btn__arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
