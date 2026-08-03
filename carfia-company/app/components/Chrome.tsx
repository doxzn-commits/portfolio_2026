"use client";

import { useEffect, useState } from "react";
import { SITE } from "../data";

/**
 * 상단 헤더.
 *
 * 하는 일은 하나 — 헤더 바로 아래에 어떤 섹션이 와 있는지 보고 색을 뒤집는다.
 * 페이지에서 검정 배경은 문제 제기 한 곳뿐이라 그 구간에서만 헤더가 어두워진다.
 * 진행바나 챕터 도트 같은 장치는 두지 않는다. 회사 소개서는 조용해야 한다.
 */
export default function Chrome() {
  const [tone, setTone] = useState<"light" | "dark">("light");

  useEffect(() => {
    const darks = Array.from(document.querySelectorAll<HTMLElement>(".sec--dark"));
    if (!darks.length) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const band = 36; // 헤더 높이의 절반 — 이 선을 덮은 섹션이 헤더 배경이다
      setTone(
        darks.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= band && r.bottom > band;
        })
          ? "dark"
          : "light"
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="hdr" data-tone={tone}>
      <div className="inner hdr__in">
        <a className="hdr__logo" href="/" aria-label="카피아 홈">
          <img src="/logo-black.png" alt="카피아 carfia" width={640} height={172} />
          <img src="/logo-white.png" alt="" aria-hidden width={640} height={172} />
        </a>
        <span className="hdr__crumb">회사 소개</span>
        <nav className="hdr__nav">
          <a href="#lanes">하는 일</a>
          <a href="#flow">진행 순서</a>
          <a href="#growth">실적</a>
          <a href="#history">걸어온 길</a>
          <a href="#contact">회사 정보</a>
        </nav>
        <span className="hdr__spacer" />
        <a className="hdr__tel" href={`tel:${SITE.tel.replace(/-/g, "")}`}>
          {SITE.tel}
        </a>
        {/* 시안 비교용 전환 토글. 방향이 정해지면 이 블록만 지우면 된다 */}
        <nav className="ver" aria-label="버전 보기">
          <a href="/v1" aria-current="page">
            ver.1
          </a>
          <a href="/v2">ver.2</a>
        </nav>
      </div>
    </header>
  );
}
