"use client";

import { useState } from "react";
import { BOARDS, BRANDS, PROMOTIONS, HOTDEALS, CARTIPS, SITE } from "../data";

type Key = "promotion" | "hotdeal" | "cartip";

const TABS: { key: Key; label: string; count: string; desc: string; href: string }[] = [
  {
    key: "promotion",
    label: "수입차 프로모션",
    count: "매월 갱신",
    desc: "브랜드별 이번 달 공식 할인 조건을 매월 초 정리해 올립니다.",
    href: BOARDS.promotion.path,
  },
  {
    key: "hotdeal",
    label: "수입차 핫딜",
    count: "수시",
    desc: "특정 모델·트림의 기간 한정 특가입니다. 물량이 소진되면 닫힙니다.",
    href: BOARDS.hotdeal.path,
  },
  {
    key: "cartip",
    label: "차량 꿀팁",
    count: "주 단위",
    desc: "실구매가, 유지비, 리스와 장기렌트 비교 등 구매 판단에 필요한 지식입니다.",
    href: BOARDS.cartip.path,
  },
];

const fmtDate = (d: string) => d.slice(2).replace(/-/g, ".");

export default function ContentAxes() {
  const [tab, setTab] = useState<Key>("promotion");
  const cur = TABS.find((t) => t.key === tab)!;
  const updatedCount = BRANDS.filter((b) => b.updated).length;

  return (
    <div>
      <div className="tabs" role="tablist" aria-label="콘텐츠 종류">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            className="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <small>{t.count}</small>
          </button>
        ))}
      </div>

      <div className="panel" key={tab} role="tabpanel">
        <div className="panel__head">
          <p className="panel__desc">{cur.desc}</p>
          <a className="panel__more" href={cur.href}>
            {cur.label} 전체 보기 <span aria-hidden>→</span>
          </a>
        </div>

        {/* 프로모션: 최신 3건 카드가 아니라 브랜드 그리드.
            제목이 브랜드×월로 규칙적이라, 사용자가 자기 브랜드를 바로 찾는 편이 분배 효율이 높다. */}
        {tab === "promotion" && (
          <>
            <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 12, fontWeight: 600 }}>
              {SITE.updatedLabel} 프로모션 · {updatedCount}개 브랜드 갱신 완료
            </p>
            <div className="brands">
              {BRANDS.map((b) => (
                <a
                  key={b.name}
                  className="brand"
                  data-updated={b.updated}
                  href={BOARDS.promotion.path}
                  aria-label={`${b.name} ${SITE.updatedLabel} 프로모션 보기`}
                >
                  <b>{b.name}</b>
                  <em>{b.updated ? "7월 갱신" : "지난달 조건"}</em>
                </a>
              ))}
            </div>
            <div className="promo-list">
              {PROMOTIONS.slice(0, 4).map((p) => (
                <a className="promo-item" key={p.title} href={BOARDS.promotion.path}>
                  <span className="tag">{p.brand}</span>
                  <span className="t">
                    {p.title} <span style={{ color: "var(--ink-3)", fontWeight: 500 }}>— {p.note}</span>
                  </span>
                  <span className="d">{fmtDate(p.date)}</span>
                </a>
              ))}
            </div>
          </>
        )}

        {/* 핫딜: 제목에 박힌 금액을 가장 큰 타이포로 올린다 */}
        {tab === "hotdeal" && (
          <div className="deals">
            {HOTDEALS.slice(0, 3).map((d) => (
              <a
                className={`deal ${d.amount === null ? "deal--noamt" : ""}`}
                key={d.seq}
                href={BOARDS.hotdeal.path}
              >
                <span className="deal__badge">{d.seq} · 기간 한정</span>
                {d.amount !== null ? (
                  <>
                    <span className="deal__amt">
                      <b>{d.amount.toLocaleString()}</b>
                      <i>만원</i>
                    </span>
                    <p className="deal__cap">최대 할인</p>
                  </>
                ) : (
                  /* 금액이 제목에 없는 글도 실제로 있다 — 모델명을 대신 키운다 */
                  <p className="deal__title">{d.model}</p>
                )}
                <p className="deal__model">{d.model}</p>
                <p className="deal__trim">{d.trim}</p>
                <p className="deal__date">{fmtDate(d.date)}</p>
              </a>
            ))}
          </div>
        )}

        {/* 꿀팁: 제목 자체가 사용자의 질문이라 가공하지 않는다 */}
        {tab === "cartip" && (
          <ul className="tips">
            {CARTIPS.map((t) => (
              <li key={t.title}>
                <a className="tip" href={BOARDS.cartip.path}>
                  <span className="tip__q" aria-hidden>
                    Q
                  </span>
                  <span className="tip__t">{t.title}</span>
                  <span className="tip__d">{fmtDate(t.date)}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="subboards">
          이 밖에
          <a href={BOARDS.news.path}>차량 뉴스</a>
          <a href={BOARDS.newsModel.path}>모델 상세 정보</a>
          게시판도 함께 운영합니다.
        </p>
      </div>
    </div>
  );
}
