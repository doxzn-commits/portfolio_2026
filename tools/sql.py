# -*- coding: utf-8 -*-
"""GSC 연습용 SQL 콘솔.

실행:  python tools/sql.py

SQL 을 입력하고 Enter. 세미콜론 없어도 된다.
  .tables        표 목록
  .schema 표이름  표 구조
  .q             종료
"""
import sqlite3, sys, os

sys.stdout.reconfigure(encoding="utf-8")
DB = os.path.join(os.path.dirname(__file__), "..", "source_materials", "gsc", "practice.db")

if not os.path.exists(DB):
    print("practice.db 가 없습니다. 경로:", os.path.abspath(DB))
    sys.exit(1)

con = sqlite3.connect(DB)


def show(rows, cols):
    if not rows:
        print("  (결과 없음)")
        return
    w = [len(c) for c in cols]
    txt = []
    for r in rows:
        cells = ["" if v is None else str(v) for v in r]
        txt.append(cells)
        for i, c in enumerate(cells):
            w[i] = max(w[i], len(c))
    line = "  " + "  ".join(c.ljust(w[i]) for i, c in enumerate(cols))
    print(line)
    print("  " + "  ".join("-" * w[i] for i in range(len(cols))))
    for cells in txt:
        print("  " + "  ".join(c.ljust(w[i]) for i, c in enumerate(cells)))
    print(f"  ({len(rows)} 행)")


print("GSC 연습 DB 에 연결됨:", os.path.abspath(DB))
print("표: daily_search · daily_discover · queries · pages · pages_discover")
print("도움말 — .tables / .schema 표이름 / .q 종료\n")

while True:
    try:
        q = input("sql> ").strip()
    except (EOFError, KeyboardInterrupt):
        print()
        break
    if not q:
        continue
    if q in (".q", ".quit", ".exit"):
        break
    if q == ".tables":
        rows = con.execute(
            "select name from sqlite_master where type='table' order by name"
        ).fetchall()
        for (n,) in rows:
            cnt = con.execute(f"select count(*) from {n}").fetchone()[0]
            print(f"  {n:18} {cnt:>6} 행")
        print()
        continue
    if q.startswith(".schema"):
        parts = q.split()
        if len(parts) < 2:
            print("  사용법: .schema 표이름\n")
            continue
        row = con.execute(
            "select sql from sqlite_master where name=?", (parts[1],)
        ).fetchone()
        print("  " + (row[0] if row else "그런 표가 없습니다") + "\n")
        continue
    try:
        cur = con.execute(q.rstrip(";"))
        if cur.description:
            show(cur.fetchall(), [d[0] for d in cur.description])
        else:
            con.commit()
            print(f"  적용됨 ({cur.rowcount} 행)")
    except Exception as e:
        print("  ⚠️", e)
    print()

con.close()
print("종료")
