"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 스크롤 진입 시 fade-up.
 * 서버에서 렌더된 자식을 그대로 감싸므로 SSR HTML 에는 텍스트가 온전히 남는다.
 * 한 번 등장하면 관찰을 끊는다 — 오르내릴 때 깜빡이면 산만해진다.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: any;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} data-in={inView} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
