"use client";

import { useEffect, useRef, useState } from "react";
import { SITE, BOARDS } from "../data";

/** 상단 스크롤 진행 바 — rAF 로 묶어 스크롤 핸들러가 레이아웃을 밀지 않게 한다 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        el.style.transform = `scaleX(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="progress" ref={ref} aria-hidden />;
}

export function Header() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="hdr" data-stuck={stuck}>
      <div className="wrap hdr__in">
        <a href="https://carfia.co.kr" className="hdr__logo">
          car<span>fia</span>
        </a>
        <nav className="hdr__nav" aria-label="주요 메뉴">
          <a href={BOARDS.promotion.path}>수입차 프로모션</a>
          <a href="https://carfia.co.kr">탐색</a>
          <a href={BOARDS.cartip.path}>커뮤니티</a>
          <a href="/" aria-current="page">
            카피아 소개
          </a>
        </nav>
        <span className="hdr__spacer" />
        <a href="#consult" className="btn btn--primary btn--sm">
          상담 신청
        </a>
      </div>
    </header>
  );
}

/** 스크롤 40% 지점부터 올라오는 모바일 고정 CTA */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShow(max > 0 && window.scrollY / max > 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky" data-show={show}>
      <a href={BOARDS.promotion.path} className="btn btn--primary">
        이번 달 프로모션 보기
      </a>
      <a href={`tel:${SITE.tel}`} className="btn btn--ghost" aria-label={`전화 상담 ${SITE.tel}`}>
        전화
      </a>
    </div>
  );
}
