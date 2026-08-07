"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    n: "01",
    h: "차부터 고르세요",
    p: "14개 수입차 브랜드, 이번 달 프로모션이 브랜드별로 딱 정리돼 있어요. 원하는 차부터 찾으면 끝.",
  },
  {
    n: "02",
    h: "이번 달 할인, 항목별로 확인",
    p: "제조사 할인, 딜러 프로모션, 재고 특가… 어디서 얼마나 빠지는지 숨김없이 보여드립니다.",
  },
  {
    n: "03",
    h: "할부·리스·렌트 나란히 비교",
    p: "같은 차를 네 가지 방식으로 샀을 때 월 납입금과 총비용을 한 줄에 놓고 비교하세요.",
  },
  {
    n: "04",
    h: "조건 확정하고 상담 신청",
    p: "14개 금융사 조건까지 확인해 최종 견적을 확정합니다. 상담은 물론 무료예요.",
  },
];

function Scene({ i, active }: { i: number; active: number }) {
  const show = i === active;

  if (i === 0)
    return (
      <div className="mock__scene" data-show={show}>
        <p className="mrow" style={{ paddingTop: 0 }}>
          <em>브랜드 선택</em>
          <b>14개</b>
        </p>
        <div className="mgrid" style={{ marginTop: 12 }}>
          {["BMW", "벤츠", "아우디", "볼보", "랜드로버", "폭스바겐", "포르쉐", "미니", "렉서스"].map((b, k) => (
            <b key={b} data-on={k === 2}>
              {b}
            </b>
          ))}
        </div>
        <p style={{ marginTop: 18, fontSize: 13, color: "var(--ink-3)" }}>
          아우디 선택 → 이번 달 프로모션 12개 모델
        </p>
      </div>
    );

  if (i === 1)
    return (
      <div className="mock__scene" data-show={show}>
        <p style={{ fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>아우디 Q5 45 TFSI</p>
        <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 16 }}>2026년 7월 프로모션 적용</p>
        <div className="mrow">
          <em>차량 가격</em>
          <b>7,180만원</b>
        </div>
        <div className="mrow">
          <em>카피아 금융 할인</em>
          <b className="cut">-1,300만원</b>
        </div>
        <div className="mrow mrow--total">
          <em style={{ fontWeight: 700, color: "var(--ink)" }}>실구매가</em>
          <b>5,880만원</b>
        </div>
      </div>
    );

  if (i === 2)
    return (
      <div className="mock__scene" data-show={show}>
        <p style={{ fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>월 납입금 비교</p>
        <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 20 }}>
          실구매가 5,880만원 기준 · 현금 일시납 제외 · 예시
        </p>
        <div className="mbars">
          {[
            { k: "할부 60개월", w: 100, v: "115만원", best: false },
            { k: "운용리스 48", w: 81, v: "93만원", best: true },
            { k: "장기렌트 60", w: 89, v: "102만원", best: false },
          ].map((r) => (
            <div className="mbar" key={r.k} data-best={r.best}>
              <span style={{ color: "var(--ink-2)" }}>{r.k}</span>
              <i style={{ ["--w" as any]: show ? `${r.w}%` : "0%" }} />
              <b>{r.v}</b>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 20, fontSize: 12, color: "var(--ink-3)", lineHeight: 1.6 }}>
          월 납입금이 가장 낮은 쪽이 항상 유리한 건 아닙니다. 보유 기간과 총비용까지 함께 봅니다.
        </p>
      </div>
    );

  return (
    <div className="mock__scene" data-show={show}>
      <p style={{ fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>상담 신청</p>
      <div className="mform">
        <span className="filled">아우디 Q5 45 TFSI</span>
        <div className="mform__chips" role="group" aria-label="구매 방식 선택">
          <b>현금</b>
          <b>할부</b>
          <b data-on="true">리스</b>
          <b>렌트</b>
        </div>
        <span className="submit">무료로 견적 받기</span>
      </div>
      <p style={{ marginTop: 16, fontSize: 12, color: "var(--ink-3)", lineHeight: 1.6 }}>
        신청 단계에서는 신용조회가 이뤄지지 않습니다.
      </p>
    </div>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  /** 클릭으로 이동한 직후에는 스크롤 관찰이 값을 덮어쓰지 않게 잠깐 잠근다 */
  const lock = useRef(false);

  useEffect(() => {
    // 스크롤 연동은 데스크톱 2단 레이아웃에서만. 모바일은 아코디언(탭)으로 동작.
    if (!window.matchMedia("(min-width: 960px)").matches) return;
    const els = refs.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (lock.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const i = els.indexOf(visible.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { threshold: [0.3, 0.6, 0.9], rootMargin: "-24% 0px -34% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const pick = (i: number) => {
    lock.current = true;
    setActive(i);
    const mobile = !window.matchMedia("(min-width: 960px)").matches;
    // 데스크톱: 탭한 스텝을 가운데로 / 모바일: 펼쳐진 스텝이 시야에 들어오게 살짝만
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: mobile ? "nearest" : "center" });
    window.setTimeout(() => {
      lock.current = false;
    }, 700);
  };

  return (
    <div className="how">
      <div className="steps">
        {STEPS.map((s, i) => (
          <div className="step-item" key={s.n} data-active={i === active}>
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="step"
              data-active={i === active}
              onClick={() => pick(i)}
              aria-expanded={i === active}
              aria-label={`${s.n}단계 ${s.h}`}
            >
              <span className="step__n" aria-hidden>
                {i + 1}
              </span>
              <span>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </span>
            </button>

            {/* 모바일 인라인 목업 — 활성 스텝 아래에서 펼쳐진다 (데스크톱에선 CSS로 숨김) */}
            <div className="step__scene" aria-hidden>
              <div className="mock">
                <div className="mock__bar">
                  <i />
                  <i />
                  <i />
                  <span>carfia.co.kr</span>
                </div>
                <div className="mock__body">
                  <Scene i={i} active={active} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크톱 2단 목업 (모바일에선 숨김) */}
      <div className="how__panel">
        <div className="mock" aria-hidden>
          <div className="mock__bar">
            <i />
            <i />
            <i />
            <span>carfia.co.kr</span>
          </div>
          <div className="mock__body">
            {STEPS.map((_, i) => (
              <Scene key={i} i={i} active={active} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
