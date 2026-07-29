#!/usr/bin/env node
/* KPI 드리프트 검사기
 *
 *   node tools/check-kpi.js
 *
 * portfolio/kpi-registry.json 을 단일 출처로 삼아 두 가지를 검사한다.
 *   ① 레지스트리의 각 수치가 소비 문서(appearsIn)에 실제로 있는가  — 누락·오타 탐지
 *   ② 폐기된 수치(banned)가 허용되지 않은 파일에 남아 있는가       — 387건 사고 재발 방지
 *
 * 종료 코드: 0 = 통과, 1 = 문제 발견 (CI·훅에서 쓸 수 있게)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REG = path.join(ROOT, 'portfolio', 'kpi-registry.json');

const read = p => { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return null; } };

// 재귀 스캔 대상 — 텍스트 문서만
const SCAN_EXT = ['.md', '.html', '.json'];
const SKIP_DIR = ['.git', 'node_modules', '.bkit', '.claude', '.next', '.vercel', 'source_materials'];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIR.includes(e.name)) walk(rel, out); }
    else if (SCAN_EXT.includes(path.extname(e.name))) out.push(rel);
  }
  return out;
}

const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
const problems = [];
let checked = 0;

// ── ① 레지스트리 수치가 소비 문서에 있는가
for (const it of reg.items) {
  for (const f of it.appearsIn) {
    checked++;
    const src = read(f);
    if (src === null) { problems.push(`[파일없음] ${f} — ${it.id}가 참조`); continue; }
    if (!src.includes(it.value)) {
      problems.push(`[누락] ${f}\n         "${it.value}" (${it.label}) 이 없다`);
    }
  }
}

// ── ② 폐기 수치가 허용되지 않은 곳에 있는가
const files = walk('.');
for (const f of files) {
  const allowed = reg.banned.allowedIn.some(a => a.endsWith('/') ? f.startsWith(a) : f === a);
  if (allowed) continue;
  const src = read(f);
  if (!src) continue;
  const lines = src.split('\n');
  for (const tok of reg.banned.tokens) {
    const hits = lines.map((l, i) => l.includes(tok) ? i + 1 : 0).filter(Boolean);
    if (hits.length) {
      problems.push(`[폐기수치] ${f} — "${tok}" ${hits.length}곳 (줄 ${hits.join(', ')})`);
    }
  }
}

// ── 결과
const stamp = `수치 ${reg.items.length}개 · 대조 ${checked}회 · 스캔 ${files.length}개 파일`;
if (problems.length === 0) {
  console.log(`OK  전부 일치합니다.  (${stamp})`);
  process.exit(0);
}
console.log(`FAIL  ${problems.length}건 발견  (${stamp})\n`);
problems.forEach(p => console.log('  - ' + p));
console.log('\n고치는 순서: portfolio/kpi-registry.json 을 먼저 맞추고 → 소비 문서를 맞춘다.');
process.exit(1);
