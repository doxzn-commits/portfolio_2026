import fs from "node:fs";
import path from "node:path";
import { FINANCE, PLATFORMS } from "../../data";

/**
 * 브랜드 로고 월.
 *
 * 로고 이미지 파일이 아직 없다. 서버 컴포넌트이므로 빌드 시점에 public/logos 를 실제로 확인해서,
 * 파일이 있으면 이미지를 쓰고 없으면 워드마크 텍스트로 대신 채운다.
 * 나중에 파일만 떨어뜨리면 코드를 고치지 않고 자동으로 이미지로 바뀐다.
 *
 * 파일명 규칙: public/logos/<slug>.svg 또는 .png  (예: logos/encar.svg)
 */

const SLUG: Record<string, string> = {
  엔카: "encar",
  헤이딜러: "heydealer",
  케이카: "kcar",
  차란차: "charancha",
  우리금융캐피탈: "woori",
  BNK캐피탈: "bnk",
  하나캐피탈: "hana",
  JB우리캐피탈: "jb",
  케이카캐피탈: "kcar-capital",
  도이치파이낸셜: "deutsche",
  한국캐피탈: "korea-capital",
  메리츠캐피탈: "meritz",
};

const DIR = path.join(process.cwd(), "public", "logos");

/** 해당 브랜드의 로고 파일이 있으면 웹 경로를, 없으면 null 을 준다. */
function findLogo(name: string): string | null {
  const slug = SLUG[name];
  if (!slug) return null;
  for (const ext of ["svg", "png", "webp"]) {
    const file = `${slug}.${ext}`;
    try {
      if (fs.existsSync(path.join(DIR, file))) return `/logos/${file}`;
    } catch {
      // public/logos 가 아직 없는 경우 — 워드마크로 넘어간다
    }
  }
  return null;
}

/**
 * 로고 파일이 있으면 로고를 기본으로 보여주고, PC 에서 마우스를 올리면 한글 이름으로 바뀐다.
 * 파일이 아직 없으면 처음부터 한글 이름만 보여준다.
 * 두 경우 모두 이름이 DOM 에 남으므로 검색·스크린리더가 어느 브랜드인지 읽는다.
 */
function Tile({ name }: { name: string }) {
  const src = findLogo(name);
  if (!src) {
    return (
      <div className="x-logo">
        <span>{name}</span>
      </div>
    );
  }
  return (
    <div className="x-logo x-logo--has">
      <img src={src} alt={name} />
      <span aria-hidden>{name}</span>
    </div>
  );
}

export default function LogoWall() {
  const all = [...PLATFORMS, ...FINANCE];
  const missing = all.filter((n) => !findLogo(n)).length;

  return (
    <>
      <div className="x-logogroup">
        <h3>차를 파는 곳 — 이곳의 금융을 카피아가 맡습니다</h3>
        <div className="x-logos">
          {PLATFORMS.map((p) => (
            <Tile key={p} name={p} />
          ))}
        </div>
      </div>

      <div className="x-logogroup">
        <h3>돈을 빌려주는 곳 — 이 중에서 가장 낮은 금리를 고릅니다</h3>
        <div className="x-logos">
          {FINANCE.map((f) => (
            <Tile key={f} name={f} />
          ))}
          <div className="x-logo">
            <span>외 6곳</span>
          </div>
        </div>
      </div>

      {missing > 0 ? (
        <p className="x-logos__note">
          로고 이미지 {missing}개가 아직 준비되지 않아 이름으로 표시하고 있습니다.
          {" "}
          <code>public/logos/</code> 에 파일을 넣으면 자동으로 로고로 바뀝니다.
        </p>
      ) : null}
    </>
  );
}
