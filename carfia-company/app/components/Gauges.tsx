"use client";

import { useEffect, useRef, useState } from "react";
import { MARKET } from "../data";

/**
 * 다이렉트 침투율 게이지 — 보험 35% vs 할부 5%.
 * 두 막대의 길이 차이가 이 챕터의 논지 전부라, 채워지는 순간을 보여줘야 한다.
 * 퍼센트 숫자는 처음부터 텍스트로 박아 두고 막대만 움직인다.
 */
export default function Gauges() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {MARKET.gauges.map((g) => (
        <div className="gauge" data-tone={g.tone} key={g.name}>
          <div className="gauge__top">
            <span className="gauge__n">{g.name}</span>
            <span className="gauge__v">{g.pct}%</span>
          </div>
          <div className="gauge__bar">
            {/* 5% 는 그대로 그리면 실이 되어 안 보인다. 35% 를 100% 로 잡아 상대 길이를 만든다 */}
            <div className="gauge__fill" style={{ width: on ? `${(g.pct / 35) * 100}%` : 0 }} />
          </div>
          <p className="gauge__c">{g.caption}</p>
        </div>
      ))}
    </div>
  );
}
