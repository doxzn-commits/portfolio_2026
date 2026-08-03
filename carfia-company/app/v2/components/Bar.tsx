import { SITE } from "../../data";

/**
 * ver.2 상단 바. 두 버전을 나란히 비교할 수 있도록 v1/v2 전환 토글을 단다.
 * 실제 배포 때는 이 토글을 떼고 헤더만 남기면 된다.
 */
export default function Bar({ current }: { current: "v1" | "v2" }) {
  return (
    <header className="x-bar">
      <div className="x-wrap x-bar__in">
        <a className="x-bar__logo" href="/" aria-label="카피아 홈">
          <img src="/logo-black.png" alt="카피아 carfia" width={640} height={172} />
        </a>
        <a className="x-bar__tel" href={`tel:${SITE.tel.replace(/-/g, "")}`}>
          {SITE.tel}
        </a>
        <nav className="x-bar__v" aria-label="버전 보기">
          <a href="/v1" aria-current={current === "v1" ? "page" : undefined}>
            ver.1
          </a>
          <a href="/v2" aria-current={current === "v2" ? "page" : undefined}>
            ver.2
          </a>
        </nav>
      </div>
    </header>
  );
}
