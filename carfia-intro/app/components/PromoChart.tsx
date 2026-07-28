"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 프로모션 "할인 추이" 그래프 (carfia 프로모션 상세의 차트를 오마주).
 * 실제 데이터가 아니라 우상향 예시 — "카피아에서 할인 추이를 그래프로 본다"를 보여주는 용도.
 * 스크롤 진입 시 좌→우 클립 리빌로 라인·점·면적이 함께 그려진다. (점선 타사 라인도 패턴 유지)
 */

// 12개월 · 만원. 우상향. 마지막 1,050은 예시 카드(-1,050만원)와 맞춤.
const MONTHS = ["25.8", "9", "10", "11", "12", "26.1", "2", "3", "4", "5", "6", "7"];
const SELF = [660, 690, 650, 610, 730, 790, 830, 810, 910, 985, 1025, 1050]; // 자사(초록 실선)
const OTHER = [640, 700, 625, 510, 670, 745, 760, 720, 865, 945, 995, 1010]; // 타사(회색 점선)

const VB_W = 680;
const X0 = 44;
const X1 = 664;
const Y_TOP = 20;
const Y_BOT = 260;
const DOMAIN_MIN = 300;
const DOMAIN_MAX = 1300;
const GRID = [325, 650, 975, 1300];
const MARK_IDX = 2; // '10' 시점 면식변경 마커

const dx = (X1 - X0) / (MONTHS.length - 1);
const xAt = (i: number) => X0 + i * dx;
const yAt = (v: number) => Y_BOT - ((v - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * (Y_BOT - Y_TOP);

const line = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ");
const area = (arr: number[]) =>
  `M${X0},${Y_BOT} ` + arr.map((v, i) => `L${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ") + ` L${X1},${Y_BOT} Z`;

export default function PromoChart() {
  const ref = useRef<SVGSVGElement>(null);
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
    <div className="promo-chart">
      <div className="promo-chart__head">
        <div>
          <strong>BMW 220i M 스포츠 디자인</strong>
          <span>할인 추이 · 최근 12개월</span>
        </div>
        <div className="promo-chart__legend">
          <span className="lg">
            <i className="lg-self" aria-hidden />
            자사 할인금액
          </span>
          <span className="lg">
            <i className="lg-other" aria-hidden />
            타사 할인금액
          </span>
        </div>
      </div>

      <svg
        ref={ref}
        className="promo-chart__svg"
        viewBox={`0 0 ${VB_W} 300`}
        role="img"
        aria-label="수입차 프로모션 할인 추이 그래프 — 최근 12개월 우상향 예시"
        data-on={on}
      >
        <defs>
          <clipPath id="promoReveal">
            <rect className="reveal-rect" x={X0 - 3} y={0} width={0} height={300} />
          </clipPath>
          <linearGradient id="promoFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y 그리드 + 라벨 */}
        {GRID.map((g) => (
          <g key={g}>
            <line className="c-grid" x1={X0} y1={yAt(g)} x2={X1} y2={yAt(g)} />
            <text className="c-ylabel" x={X0 - 10} y={yAt(g) + 4} textAnchor="end">
              {g.toLocaleString()}
            </text>
          </g>
        ))}

        {/* X 라벨 */}
        {MONTHS.map((m, i) => (
          <text key={m + i} className="c-xlabel" x={xAt(i)} y={Y_BOT + 22} textAnchor="middle">
            {m}
          </text>
        ))}

        {/* 면식변경 마커 (클립 밖 — 항상 보이되 페이드) */}
        <g className="c-mark">
          <line x1={xAt(MARK_IDX)} y1={Y_TOP - 2} x2={xAt(MARK_IDX)} y2={Y_BOT} />
          <text className="c-mark-t" x={xAt(MARK_IDX)} y={Y_TOP - 6} textAnchor="middle">
            연식변경
          </text>
        </g>

        {/* 좌→우 리빌로 라인·면적·점 함께 그려짐 */}
        <g clipPath="url(#promoReveal)">
          <path className="c-area" d={area(SELF)} fill="url(#promoFill)" />
          <path className="c-line c-line--other" d={line(OTHER)} />
          <path className="c-line c-line--self" d={line(SELF)} />
          {SELF.map((v, i) => (
            <circle key={i} className="c-dot" cx={xAt(i)} cy={yAt(v)} r={i === SELF.length - 1 ? 5 : 3} />
          ))}
        </g>
      </svg>
    </div>
  );
}
