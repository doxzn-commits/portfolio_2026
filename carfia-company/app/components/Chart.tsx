"use client";

import { useEffect, useRef, useState } from "react";
import { GROWTH, REVENUE } from "../data";

/**
 * 성장 추이 차트 — 취급액 · 실행 건수 · 그룹 매출 세 지표를 같은 축에서 갈아 끼운다.
 *
 * 세 지표는 단위가 달라 하나의 y축을 공유할 수 없다. 지표별 최댓값을 100 으로
 * 정규화해 "모양"만 비교하게 하고, 실제 수치는 막대 위에 항상 텍스트로 적는다.
 */

type Key = "amount" | "count" | "revenue";

const SERIES: Record<Key, { label: string; unit: string; data: { year: string; value: number }[]; fmt: (n: number) => string }> = {
  amount: {
    label: "실행한 금액",
    unit: "억원",
    data: GROWTH.map((g) => ({ year: g.year, value: g.amount })),
    fmt: (n) => `${n.toLocaleString()}억`,
  },
  count: {
    label: "도와드린 건수",
    unit: "건",
    data: GROWTH.map((g) => ({ year: g.year, value: g.count })),
    fmt: (n) => n.toLocaleString(),
  },
  revenue: {
    label: "회사 매출",
    unit: "억원",
    data: REVENUE.map((r) => ({ year: r.year, value: r.value })),
    fmt: (n) => `${n}억`,
  },
};

export default function Chart() {
  const [key, setKey] = useState<Key>("amount");
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
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const s = SERIES[key];
  const max = Math.max(...s.data.map((d) => d.value));

  return (
    <>
      <div className="tabs" role="tablist" aria-label="지표 선택">
        {(Object.keys(SERIES) as Key[]).map((k) => (
          <button key={k} className="tab" role="tab" aria-selected={key === k} onClick={() => setKey(k)}>
            {SERIES[k].label}
          </button>
        ))}
      </div>

      <div className="chart" ref={ref} data-in={on}>
        <div className="chart__grid">
          {s.data.map((d) => {
            // 가장 낮은 막대도 형태가 보이도록 바닥을 18% 로 깐다
            const h = 18 + (d.value / max) * 82;
            return (
              <div className="bar" key={d.year} style={{ ["--h" as any]: h }}>
                <span className="bar__v">{s.fmt(d.value)}</span>
                <div className="bar__fill" />
              </div>
            );
          })}
        </div>
        <div className="chart__x">
          {s.data.map((d) => (
            <span key={d.year}>{d.year}</span>
          ))}
        </div>
      </div>
    </>
  );
}
