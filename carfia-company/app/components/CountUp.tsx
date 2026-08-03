"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 숫자 카운트업.
 *
 * 중요: 초기 렌더값이 '최종 숫자'다. SSR HTML 에 완성된 수치가 그대로 남아야
 * AI 와 검색엔진이 9,245억원을 읽는다. 애니메이션은 마운트 이후에만 개입한다.
 */
export default function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [n, setN] = useState(value);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();

        setN(0);
        const dur = 1200;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
          setN(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      // 화면에 닿기 200px 전에 발화. 스크롤하지 않으면 최종값 그대로 남는다.
      { threshold: 0, rootMargin: "0px 0px 200px 0px" }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <b ref={ref as any}>
      {n.toLocaleString()}
      <i>{suffix}</i>
    </b>
  );
}
