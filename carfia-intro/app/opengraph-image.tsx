import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * og:image 자동 생성 (빌드 시 PNG).
 * Next가 이 파일을 보고 og:image·twitter:image 메타를 자동으로 붙인다 → 공유/인용/디스커버용 미리보기.
 * 한글 렌더를 위해 Pretendard 정적 woff를 읽어 폰트로 주입한다(satori는 woff2 미지원 → woff 사용).
 */
export const runtime = "nodejs";
export const alt = "카피아 — 수입차 프로모션 비교 서비스";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), "assets/Pretendard-Bold.woff")),
    readFile(join(process.cwd(), "assets/Pretendard-Regular.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#11181c",
          padding: "72px 80px",
          fontFamily: "Pretendard",
          position: "relative",
        }}
      >
        {/* 브랜드 워드마크 */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700, letterSpacing: "-0.04em", color: "#fff" }}>
          car<span style={{ color: "#00eb2b" }}>fia</span>
        </div>

        {/* 핵심 카피 — 히어로 h1과 동일 문구 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.28, letterSpacing: "-0.04em", color: "#fff" }}>
            수입차 전국 할인가 비교 서비스,
          </div>
          <div style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.28, letterSpacing: "-0.04em", color: "#00eb2b" }}>
            카피아
          </div>
        </div>

        {/* 하단 정보 */}
        <div style={{ display: "flex", fontSize: 26, fontWeight: 400, color: "#898e94" }}>
          매달 갱신 · 14개 브랜드 · 할부·리스·장기렌트 실구매가 비교
        </div>

        {/* 우상단 글로우 */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,235,43,0.28), rgba(0,235,43,0))",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
        { name: "Pretendard", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
