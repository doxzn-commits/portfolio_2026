"use client";

import { useMemo, useState } from "react";
import { CALC_CARS } from "../data";

/** 원리금균등 월 납입금 */
function monthly(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/**
 * 예시 계산이다. 실제 심사 조건이 아니라 "비교 방식"을 이해시키는 게 목적이라
 * 화면에도 예시임을 반드시 명시한다. (금융 서비스에서 이 고지가 빠지면 안 된다)
 */
function quote(price: number, discount: number) {
  const real = price - discount;

  // 할부 60개월, 선수금 0, 연 6.4%
  const installment = monthly(real, 0.064, 60);

  // 운용리스 48개월, 보증금 0, 잔가 40%, 연 5.5%
  // 잔가만큼은 갚지 않으므로 잔가의 현재가치를 원금에서 뺀다
  const leaseResidual = real * 0.4;
  const lease = monthly(real - leaseResidual / Math.pow(1 + 0.055 / 12, 48), 0.055, 48);

  // 장기렌트 60개월, 잔가 30%, 연 7.2% — 세금·보험·정비가 포함돼 월 9만원가량 얹힌다
  const rentResidual = real * 0.3;
  const rent = monthly(real - rentResidual / Math.pow(1 + 0.072 / 12, 60), 0.072, 60) + 9;

  return { real, installment, lease, rent };
}

const won = (n: number) => Math.round(n).toLocaleString();

export default function Calculator() {
  const [id, setId] = useState(CALC_CARS[2].id);
  const car = CALC_CARS.find((c) => c.id === id)!;
  const q = useMemo(() => quote(car.price, car.discount), [car]);

  const rows = [
    { name: "할부", val: q.installment, sub: "60개월 · 선수금 0 · 연 6.4% 기준 · 만기 후 내 차" },
    { name: "운용리스", val: q.lease, sub: "48개월 · 보증금 0 · 잔가 40% 기준 · 만기 반납/인수" },
    { name: "장기렌트", val: q.rent, sub: "60개월 · 잔가 30% · 세금·보험·정비 포함" },
  ];
  const best = rows.reduce((a, b) => (b.val < a.val ? b : a));

  return (
    <div className="calc">
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)", marginBottom: 10 }}>
          차량을 선택하세요
        </p>
        <div className="calc__cars">
          {CALC_CARS.map((c) => (
            <button
              key={c.id}
              className="carbtn"
              aria-pressed={c.id === id}
              onClick={() => setId(c.id)}
            >
              <span>
                <strong>{c.name}</strong>
                <span>{c.price.toLocaleString()}만원</span>
              </span>
              <span className="cut">-{c.discount.toLocaleString()}만원</span>
            </button>
          ))}
        </div>
      </div>

      <div className="calc__out">
        <div className="calc__price">
          <span>실구매가</span>
          <b>
            <del>{car.price.toLocaleString()}만원</del>
            {q.real.toLocaleString()}만원
          </b>
        </div>

        <div className="opts">
          {rows.map((r) => (
            <div className="opt" key={r.name} data-best={r.name === best.name}>
              <p className="opt__name">
                {r.name}
                {r.name === best.name && <em>월 납입금 최저</em>}
              </p>
              <p className="opt__val">
                {won(r.val)}
                <small>만원/월</small>
              </p>
              <p className="opt__sub">{r.sub}</p>
            </div>
          ))}
        </div>

        <p className="calc__note">
          위 금액은 이해를 돕기 위한 <b>예시 계산</b>입니다. 실제 조건은 신용도, 선수금, 주행거리
          약정, 제휴 금융사에 따라 달라지며 상담 시 확정됩니다. 월 납입금이 가장 낮은 방식이 총비용까지
          가장 유리한 것은 아닙니다.
        </p>
      </div>
    </div>
  );
}
