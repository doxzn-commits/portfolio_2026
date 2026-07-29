# 네이버 블로그 자동화 히스토리 정리

출처:
- https://claude.ai/share/7b3a9d82-1e61-4889-9e1d-d29a2bb675bd

이 문서는 네이버 블로그 프로모션 자동화 대화 내용을 새 Claude 또는 Claude Code CLI가 이어받을 수 있도록 정리한 인계 문서다.

---

## 1. 프로젝트 목표

목표는 월별 수입차 프로모션 엑셀 파일을 기반으로 네이버 블로그용 글, HTML 디자인, 섹션별 PNG 이미지, 정리 엑셀, 네이버 블로그 임시저장 업로드까지 자동화하는 것이다.

최종 운영 흐름:
- raw 폴더에 월별 브랜드 엑셀 파일을 넣는다.
- naverblog_promotion.py를 실행한다.
- 엑셀 데이터가 자동 파싱된다.
- 블로그 본문용 HTML이 생성된다.
- HTML을 섹션별 PNG 이미지로 캡처한다.
- 정리본 엑셀도 생성한다.
- Playwright로 네이버 블로그 글쓰기 화면에 접속한다.
- 고정 문구, 인용구, 이미지, 설명문, 표, 해시태그를 자동 입력한다.
- 글은 발행이 아니라 임시저장 상태로 남긴다.
- 사용자가 네이버에서 최종 확인 후 수동 발행한다.

사용자 성향:
- 장황한 설명보다 Claude Code CLI에 붙여넣을 수 있는 최소 토큰, 명확한 프롬프트를 선호한다.
- “프롬프트 전달”을 요청하면 구현 설명보다 바로 실행 가능한 지시문을 작성해야 한다.
- 최종 파일이 이미 만들어진 상태라면 프롬프트로 재생성시키는 것보다 파일 자체를 옮기는 방식을 선호한다.

---

## 2. 현재 자동화 위치와 핵심 파일

작업 폴더:

    C:\Users\카피아\Desktop\마케팅\블로그 자동화\프로모션 자동화

대화 중 확인된 실제 파일 목록:

    .claude
    03_carfia_sheet_to_naver.py
    core
    create_sample.py
    find_selector.py
    find_table_selector.py
    naverblog_promotion.py
    naver_state.json
    node_modules
    output
    package-lock.json
    package.json
    raw
    requirements.txt
    selector_results.json
    status.json

핵심 실행 파일:

    naverblog_promotion.py

주의:
- 중간에 core/naver_uploader.py 같은 분리 구조가 제안되었지만, 실제 중심 파일은 naverblog_promotion.py다.
- 수정 프롬프트를 만들 때는 “현재 naverblog_promotion.py와 core 폴더를 읽고 기존 구조에 맞게 반영하라”라고 지시하는 것이 안전하다.

---

## 3. 폴더 구조와 파일명 규칙

기본 폴더 구조:

    프로모션 자동화/
    ├── naverblog_promotion.py
    ├── core/
    ├── raw/
    ├── output/
    ├── requirements.txt
    ├── package.json
    ├── package-lock.json
    ├── naver_state.json
    └── status.json

raw 폴더:
- 원본 엑셀 파일을 직접 넣는다.
- 월별 하위 폴더는 만들지 않는다.

파일명 규칙:

    YYYY_MM_브랜드명.xlsx

예:

    2026_04_아우디.xlsx
    2026_04_벤츠.xlsx
    2026_04_BMW.xlsx

다중 브랜드 파일:

    2026_04_전체.xlsx

다중 브랜드 파일은 시트명이 브랜드명과 일치해야 한다. 단일 브랜드 파일도 시트명은 브랜드명으로 맞추는 것이 좋다.

---

## 4. 실행 명령

작업 폴더 이동:

    cd "C:\Users\카피아\Desktop\마케팅\블로그 자동화\프로모션 자동화"

콘텐츠 생성만:

    python naverblog_promotion.py --file 2026_04_아우디.xlsx --no-upload

기존 생성 결과를 네이버에 업로드만:

    python naverblog_promotion.py --file 2026_04_아우디.xlsx --upload-only

생성 + 업로드:

    python naverblog_promotion.py --file 2026_04_아우디.xlsx

전체 미처리 파일 실행:

    python naverblog_promotion.py --all

네이버 로그인 세션 저장:

    python naverblog_promotion.py --save-session

이미 DONE 처리된 파일 재실행:

    python naverblog_promotion.py --file 2026_04_BMW.xlsx --no-upload --force

주의:
- --no-upload--force처럼 붙여 쓰면 오류가 난다.
- 반드시 --no-upload --force처럼 띄어쓴다.

---

## 5. 엑셀 파싱 규칙

기본적으로 읽는 컬럼:
- 연식
- 모델명
- 차량가격
- 자사금융 조건
- 현금,타사조건

데이터 정리 규칙:
- 자사금융과 현금/타사 조건이 모두 0, None, 공백, “만원”뿐이면 프로모션 없음으로 판단한다.
- 프로모션 없는 모델은 일반 프로모션 섹션에서 제외한다.
- 필요하면 별도 no_promo 섹션으로 표시한다.
- 반복 헤더 행은 스킵한다.
- 모델명 안의 줄바꿈은 공백으로 치환한다.

BMW 이슈:
- BMW 파일은 기존 아우디/벤츠와 컬럼명이 달랐다.
- 기존 구조: 자사금융 조건, 현금/타사조건
- BMW 구조: 자사할인금액, 타사조건, 현금
- 이 때문에 자사금융 값이 추출되지 않는 문제가 있었다.

수정 방향:
- 컬럼명을 고정값으로 읽지 말고 헤더 행에서 키워드 기반으로 유연하게 매핑한다.
- 자사금융 컬럼은 “자사금융” 또는 “자사할인” 포함 컬럼.
- 현금/타사 컬럼은 “현금” 또는 “타사” 포함 컬럼.
- 둘 다 있으면 타사조건을 우선 사용한다.
- 차량가격 컬럼은 “차량가격” 또는 “가격” 포함 컬럼.
- 모델명 컬럼은 “모델명” 포함 컬럼.
- 연식 컬럼은 “연식” 포함 컬럼.
- 헤더 행은 첫 번째 열 값이 “연식”인 행으로 감지한다.

---

## 6. 브랜드 설정 규칙

초기 등록 브랜드:
- 아우디
- 벤츠

BMW 실행 시 발생한 오류:

    'BMW': brands.py 에 등록되지 않은 브랜드
    등록된 브랜드: ['아우디', '벤츠']

현재 구조에서는 core/config/brands.py에 브랜드 등록이 필요했다.

BMW 추가 예시:

    BRAND_CONFIG["BMW"] = {
        "color": "#0066CC",
        "url": "https://carfia.co.kr",
        "hashtags": ["#BMW견적", "#BMW프로모션", "#카피아", "#수입차프로모션", "#수입차견적"],
        "section_groups": []
    }

권장 개선:
- 등록되지 않은 브랜드가 들어오면 에러로 종료하지 않는다.
- 경고만 출력한다.
- 엑셀 데이터 기반으로 section_groups를 자동 생성한다.
- 모델명 앞부분 기준으로 그룹핑한다. 예: A시리즈, Q시리즈, 3시리즈 등.
- 자동 생성된 config를 brands.py에 저장하거나, 최소한 이번 실행에서 사용할 임시 config를 만든다.

---

## 7. HTML 생성 및 이미지 디자인 규칙

HTML은 네이버 블로그 본문용 콘텐츠이면서 PNG 캡처 원본으로도 사용된다.

초기 디자인 방향:
- 브랜드별 프로모션 요약과 모델별 할인 테이블을 보기 좋게 만든다.
- HTML 기반으로 디자인하고 Playwright로 PNG 캡처한다.
- 이미지 품질과 수정 가능성을 위해 HTML 렌더링 방식을 선택했다.

섹션 분리:
- 단순 HTML 주석만으로 섹션을 나누면 PNG 캡처가 불안정했다.
- 최종적으로 각 섹션을 data-section 속성이 있는 wrapper로 감싼다.
- 기존 Playwright crop 로직이 참조하므로 section 이름과 순서를 쉽게 바꾸면 안 된다.

PNG 생성 방식:
- Playwright에서 전체 페이지를 2000px 폭으로 렌더링한다.
- 전체 페이지 스크린샷을 한 번 찍는다.
- 각 data-section의 bounding box를 구한다.
- PIL로 해당 영역을 crop한다.
- page.screenshot의 clip 옵션 직접 사용은 viewport/out-of-bounds 오류가 나서 피한다.

대표 출력 이미지:

    00_header.png
    01_intro.png
    02_A3.png
    03_no_promo.png
    04_A6_etron.png
    05_Q4_etron.png
    06_Q5_TFSI.png
    07_Q5_TDI.png
    08_Q7.png
    09_Q8.png
    10_S_etron_GT.png
    11_CTA.png

네이버 블로그 삽입 범위:
- 00_header.png 삽입하지 않음.
- 01_intro.png 삽입하지 않음.
- 02_*.png부터 순서대로 삽입.
- 11_CTA.png는 현재 삽입하지 않음.

---

## 8. 이미지 내부 테이블 디자인 확정값

네이버 모바일에서 2000px 이미지는 약 1080px 폭으로 축소되므로 내부 폰트가 매우 커야 한다.

폰트:
- Pretendard 사용.
- CDN보다 로컬 base64 임베딩 권장.
- node_modules/pretendard/dist/web/static/woff2/의 400, 500, 600, 700, 800, 900 가중치를 사용.

테이블 레이아웃:
- 전체 폭 2000px 고정.
- 컬럼 비율은 모델명 27%, 차량가격 19%, 자사금융 27%, 현금/타사 27%.
- 모델명 컬럼만 줄바꿈 허용.
- 차량가격, 자사금융, 현금/타사는 nowrap.

폰트 크기:
- 섹션 타이틀: 약 62px, weight 800.
- 테이블 상단 헤더 바: 48px.
- 컬럼 헤더: 44px.
- 모델명: 46px, weight 700.
- 차량가격: 55px.
- 자사금융: 65px, weight 800.
- 현금/타사: 65px, weight 800.

색상:
- 자사금융: 브랜드 메인 컬러.
- 현금/타사: 파란색 #1565C0.
- Audi 예시 브랜드 컬러: #BB0A21.
- Benz 예시 브랜드 컬러: #1DB954.
- 기본 다크 컬러: #1A1A1A.

행 패딩:
- 40px 28px.

섹션 설명문:
- HTML 본문에는 보이게 한다.
- PNG 캡처용 HTML에서는 숨긴다.
- 과거에 .section-comment display:none이 원본 HTML에도 적용되어 설명문이 사라지는 문제가 있었다.
- 스크린샷 전용 HTML과 본문 HTML을 분리한다.

설명문 스타일:
- background #FFF8F8
- border 1px solid #F5C6C6
- font-size 40px
- padding 36px 52px

---

## 9. 네이버 블로그 본문 구조

사용자가 확정한 네이버 블로그 글 구조:

1. 고정 인사말
2. 인용구 2번으로 인트로 요약
3. 검색 안내 텍스트
4. 섹션 루프
5. 럭키 프로모션 정보
6. 프로모션 쉽게 검색하기
7. 표 삽입
8. 마무리 문구
9. 해시태그
10. 임시저장

고정 인사말:

    안녕하세요
    no.1 수입차 프로모션 정보 카피아입니다.
    yyyy년 mm월 브랜드명 프로모션이 업데이트 되었습니다!

검색 안내:
- PC에서는 Ctrl+F로 모델명을 검색할 수 있다는 안내를 넣는다.
- 이 문구는 인용구 안에 섞이지 않아야 한다.

모델 섹션:

    [인용구 2번] 브랜드명 모델 라인 프로모션
    [이미지] 해당 그룹 PNG
    [텍스트] section-comment 내용

섹션 제목 예:
- 아우디 Q4 프로모션
- 아우디 A6 프로모션
- BMW 3시리즈 프로모션

후반부:

    [인용구 2번] 럭키 프로모션 정보
    럭키 프로모션 본문

    [인용구 2번] 프로모션 쉽게 검색하기
    네이버 표 삽입

    카피아였습니다
    해시태그

---

## 10. 네이버 업로드 자동화 규칙

자동화 도구:
- Playwright 사용.
- naver_state.json으로 네이버 로그인 세션을 복원한다.

세션:
- naver_state.json이 없거나 로그인 세션이 만료되면 --save-session을 먼저 실행한다.
- 새 PC에서는 기존 naver_state.json을 복사하지 말고 새로 로그인 세션을 저장한다.

이미지 삽입:
- 네이버 블로그 사진 버튼 클릭.
- input[type=file]을 찾아 set_input_files 실행.
- 업로드 후 3초 정도 대기.
- 이미지 삽입 실패 시 전체 업로드를 중단하기보다 해당 이미지를 스킵하고 계속 진행하는 방향이 제안되었다.

업로드 완료:
- 최종 발행이 아니라 임시저장한다.
- status.json에 DONE 기록을 남겨 중복 실행을 방지한다.
- 재실행이 필요하면 --force를 사용한다.

---

## 11. 네이버 표 삽입 구현 히스토리

요구:
- 마지막 “프로모션 쉽게 검색하기” 섹션에 엑셀 정리표를 넣어야 한다.
- 단순 텍스트나 이미지가 아니라 네이버 스마트에디터의 실제 표여야 한다.

표 컬럼:

    모델명 | 연식 | 자사금융 할인(만원) | 현금/타사 할인(만원)

초기 문제:
- 클립보드에 탭 구분 텍스트를 넣고 붙여넣었지만 네이버 표로 변환되지 않았다.
- 사용자는 Playwright로 스마트에디터 표 기능을 직접 눌러 삽입하는 방식을 원했다.

확인된 셀렉터:

    cf.get_by_role("button", name="표 추가").click()
    cf.get_by_role("button", name="2열 다음에 열 추가").click()
    cf.get_by_role("button", name="2행 다음에 행 추가").click()
    cf.get_by_role("button", name="본문 추가").click()

cf는 mainFrame content frame이다.

    cf = page.locator('iframe[name="mainFrame"]').content_frame

테이블 생성 방식:
1. 표 추가 클릭.
2. 기본 3열 x 2행 표가 생성된다.
3. 2열 다음에 열 추가를 눌러 4열로 만든다.
4. 필요한 행 수만큼 {N}행 다음에 행 추가 버튼을 반복 클릭한다.
5. 첫 셀부터 데이터를 입력한다.
6. 표 입력 후 본문 추가를 눌러 표 밖으로 포커스를 이동한다.

중간 오류:
- 표에 들어갈 내용이 인용구 안에 섞였다.
- 원인: 인용구 종료 후 본문 포커스 복귀 전에 insert_table()이 호출되었다.

수정 방향:

    cf.get_by_role("button", name="본문 추가").click()
    page.wait_for_timeout(800)
    focus_body(page)
    page.wait_for_timeout(500)
    insert_table(...)

또 다른 오류:
- paragraph.nth() 방식으로 셀을 클릭하니 모델명이 3번째 열에 들어가는 등 컬럼 순서가 밀렸다.
- 원인: paragraph.nth()가 표 외부 paragraph까지 포함했다.

수정 방향:
- nth paragraph 방식 대신 실제 table cell만 선택한다.

    cells = cf.locator("table.se-table-content td").all()
    for idx, val in enumerate(flattened_values):
        cells[idx].click()
        page.keyboard.type(str(val), delay=5)
        page.wait_for_timeout(30)

데이터 flatten 순서:

    headers + rows

컬럼 순서:

    모델명 -> 연식 -> 자사금융 할인(만원) -> 현금/타사 할인(만원)

최종 상태:
- 사용자가 “지금 잘 작동해”라고 확인했다.

---

## 12. 네이버 업로드 관련 버그와 수정 이력

버그 1. 첫 인용구에 요약과 검색 안내가 같이 들어감
- 원인: 인용구 종료 처리 미흡.
- 수정: 첫 인용구에는 인트로 요약만 넣고, 검색 안내는 일반 본문 텍스트로 분리.

버그 2. 모델 그룹별 인용구 제목 누락
- 수정: 각 이미지 앞에 [인용구 2번] 브랜드 그룹제목 프로모션을 삽입.

버그 3. 럭키 프로모션 정보와 프로모션 쉽게 검색하기가 한 인용구에 합쳐짐
- 수정: 각각 별도 인용구로 삽입.
- 각 인용구 후 본문 포커스를 확실히 이동하고 800ms 정도 대기.

버그 4. 표 데이터가 인용구에 섞임
- 수정: insert_table() 호출 전 본문 추가, focus_body(), 대기 로직을 추가.

버그 5. 표 컬럼 순서가 밀림
- 수정: paragraph.nth() 대신 table.se-table-content td 셀 직접 선택.

---

## 13. 월별 운영 프로세스

매월 실행 순서:

1. 이번 달 엑셀 파일을 raw 폴더에 넣는다.

    C:\Users\카피아\Desktop\마케팅\블로그 자동화\프로모션 자동화\raw\
    ├── 2026_05_아우디.xlsx
    ├── 2026_05_벤츠.xlsx
    └── 2026_05_BMW.xlsx

2. 터미널에서 작업 폴더로 이동한다.

    cd "C:\Users\카피아\Desktop\마케팅\블로그 자동화\프로모션 자동화"

3. 콘텐츠를 먼저 생성하고 결과를 확인한다.

    python naverblog_promotion.py --file 2026_05_아우디.xlsx --no-upload
    python naverblog_promotion.py --file 2026_05_벤츠.xlsx --no-upload
    python naverblog_promotion.py --file 2026_05_BMW.xlsx --no-upload

4. output/2026_05/브랜드/ 폴더에서 HTML, 이미지, 엑셀을 눈으로 확인한다.

5. 이상 없으면 업로드만 실행한다.

    python naverblog_promotion.py --file 2026_05_아우디.xlsx --upload-only
    python naverblog_promotion.py --file 2026_05_벤츠.xlsx --upload-only
    python naverblog_promotion.py --file 2026_05_BMW.xlsx --upload-only

6. 네이버 블로그 임시저장 글을 확인한 뒤 수동 발행한다.

수정 후 재생성이 필요할 때:

    python naverblog_promotion.py --file 2026_05_아우디.xlsx --no-upload --force
    python naverblog_promotion.py --file 2026_05_아우디.xlsx --upload-only --force

세션 만료 시:

    python naverblog_promotion.py --save-session

---

## 14. 다른 PC로 이전하는 방법

사용자가 질문한 내용:
- 이 자동화 시스템을 다른 컴퓨터에서 똑같이 구동하고 싶다.
- 파일 자체를 붙여넣어 Claude가 읽게 하는 게 나은지, 프롬프트로 전달하는 게 나은지 물었다.

결론:
- 프롬프트로 재생성시키기보다 파일 자체를 복사하는 것이 훨씬 낫다.

이유:
- 정확성: 파일 복사가 가장 정확하다.
- 속도: 재생성 시간이 필요 없다.
- 토큰: 프롬프트 방식은 대량 토큰을 사용한다.
- 세션/설정: 파일 구조를 그대로 유지할 수 있다.

옮길 것:

    프로모션 자동화/
    ├── naverblog_promotion.py
    ├── core/
    ├── raw/
    ├── output/
    ├── requirements.txt
    ├── package.json
    ├── package-lock.json
    └── node_modules/   # 있으면 복사, 없으면 npm install

보안/환경 종속으로 제외할 것:

    naver_state.json
    status.json
    03_carfia_sheet_to_naver.py

새 PC 세팅:

    cd "새 PC의 프로모션 자동화 폴더"
    pip install -r requirements.txt
    playwright install chromium
    npm install
    python naverblog_promotion.py --save-session
    python naverblog_promotion.py --file 2026_05_아우디.xlsx --no-upload

추천 이전 방식:
1. 원본 폴더를 ZIP으로 압축한다.
2. USB 또는 클라우드로 이동한다.
3. 새 PC에서 압축 해제한다.
4. 위 세팅 순서를 실행한다.

---

## 15. 전체 자동 처리 흐름 요약

엑셀 업로드 후 자동 처리:

1. 엑셀 읽기
   - 파일명에서 연월과 브랜드명 추출.
   - 모델별 연식, 가격, 자사금융, 현금/타사 데이터 수집.
   - 프로모션 없는 모델 제외.

2. HTML 생성
   - output/YYYY_MM/브랜드/ 아래 HTML 생성.
   - 헤더, 인트로, 요약 하이라이트, 모델별 테이블, CTA, 해시태그 포함.

3. 정리 엑셀 생성
   - 전체 데이터 시트.
   - 카테고리별 요약 시트.

4. 섹션별 PNG 이미지 생성
   - Playwright로 HTML 렌더링.
   - 2000px 뷰포트에서 캡처.
   - data-section 기준으로 crop.

5. 네이버 블로그 자동 업로드
   - Playwright로 네이버 블로그 글쓰기 진입.
   - 제목, 인사말, 인용구, 이미지, 설명문, 표, 해시태그 입력.
   - 임시저장.

6. 완료 기록
   - status.json에 DONE 기록.
   - 중복 실행 방지.

최종 결과:
- 네이버 블로그에 임시저장 글이 생성된다.
- 사용자가 직접 확인 후 발행한다.

---

## 16. 마지막 미해결 요청: HTML SEO 구조화

대화 마지막에 사용자가 요청한 내용:

    HTML을 형성할 때, 각 내용들이 seo 최적화 용도로 작성이 되어야해.
    h1,h2, h3등의 구조로 생성되어야해.
    html 형식에서 seo 최적화 형태로 구현할 수 있도록 생성 할 수 있는 프롬프트를 전달해줘.
    그리고 그 내용은 폴더 내용 중 어디서 반영되어야하는지도 세세하게 프롬프팅 해줘.

이 요청은 아직 답변되지 않은 상태로 끝났다.

다음 Claude는 아래 프롬프트를 사용자가 Claude Code CLI에 바로 붙여넣을 수 있도록 전달하면 된다.

---

## 17. Claude Code CLI 전달용 프롬프트: HTML SEO 구조화

아래 프롬프트를 그대로 전달하면 된다.

    작업 폴더:
    C:\Users\카피아\Desktop\마케팅\블로그 자동화\프로모션 자동화

    현재 naverblog_promotion.py와 core/ 폴더 전체를 읽고, 엑셀 기반 네이버 블로그 프로모션 HTML 생성 로직을 SEO 최적화 구조로 수정해줘.

    목표:
    HTML이 단순 디자인 캡처용이 아니라 검색엔진과 AI가 이해하기 쉬운 문서 구조가 되도록 h1, h2, h3, p, table, thead, tbody, caption, summary/FAQ 구조를 명확히 반영한다.

    반영 위치:
    1. HTML 본문을 생성하는 파일을 먼저 찾아라.
       예상 위치: core/html_generator.py 또는 naverblog_promotion.py 내부 HTML 생성 함수 또는 core/template 관련 파일
    2. 섹션별 문구를 생성하는 설정 파일이 있으면 함께 확인하라.
       예상 위치: core/config/templates.py
       브랜드/그룹 설정은 core/config/brands.py 참고
    3. PNG 캡처용 HTML과 네이버 본문용 HTML이 분리되어 있다면 둘 다 수정하되, SEO 구조는 원본 HTML에 우선 반영한다.
    4. 스크린샷 전용 HTML에서 section-comment를 숨기는 기존 동작은 유지한다.

    필수 HTML 구조:
    1. 페이지 최상단에는 h1을 1개만 사용한다.
       예: &lt;h1&gt;2026년 4월 BMW 프로모션 총정리&lt;/h1&gt;
    2. 인트로 영역에는 핵심 요약 p를 넣는다. 첫 문장은 검색 의도에 바로 답하는 문장으로 작성한다.
    3. 전체 요약 섹션은 h2로 만든다.
       예: &lt;h2&gt;2026년 4월 BMW 프로모션 핵심 요약&lt;/h2&gt;
    4. 각 모델 라인 섹션은 h2로 만든다.
       예: &lt;h2&gt;BMW 3시리즈 프로모션&lt;/h2&gt;
    5. 각 모델 라인 안에서 세부 설명이 필요하면 h3를 사용한다.
       예: &lt;h3&gt;자사금융 할인 조건&lt;/h3&gt;
    6. 각 테이블에는 caption, thead, tbody를 반드시 넣는다.
    7. th에는 scope="col"을 넣는다.
    8. 금액 단위는 화면에 명확히 표시한다. 자사금융 할인(만원), 현금/타사 할인(만원).
    9. 프로모션 없는 모델 섹션이 있으면 h2를 사용한다.
    10. 하단에 FAQ 섹션을 추가한다. h2는 자주 묻는 질문, h3는 개별 질문으로 구성한다.
    11. 가능하면 JSON-LD도 추가한다. BlogPosting, FAQPage, BreadcrumbList를 우선한다. 네이버 업로드 본문에서 문제가 생기면 HTML 파일에만 유지하고 업로드 본문에서는 제외할 수 있게 옵션화한다.

    SEO 문장 규칙:
    1. 제목과 h1에는 연도, 월, 브랜드명, 프로모션 키워드를 포함한다.
    2. h2에는 브랜드명 + 모델 라인 + 프로모션을 포함한다.
    3. 첫 문단은 감성문이 아니라 검색 의도에 답하는 직답형 문장으로 시작한다.
    4. 각 모델 섹션 설명에는 자사금융, 현금, 타사금융 키워드를 자연스럽게 포함한다.
    5. 과장 표현은 피하고, 엑셀에 있는 금액 기준으로만 작성한다.
    6. 할인 금액은 확정 혜택처럼 단정하지 말고 “조건 기준”, “확인 필요”, “상담 시 변동 가능” 문맥을 유지한다.

    유지해야 할 것:
    1. 기존 PNG 디자인이 깨지면 안 된다.
    2. 기존 data-section 구조는 유지해야 한다.
    3. 기존 Playwright crop 로직이 참조하는 section 이름과 순서를 바꾸지 마라.
    4. 기존 네이버 업로드 이미지 삽입 범위는 유지한다. 00_header 제외, 01_intro 제외, 02_부터 삽입, 11_CTA 제외.
    5. section-comment가 네이버 본문 텍스트로 들어가는 기존 흐름은 유지한다.

    완료 후 확인:
    1. 2026_04_BMW.xlsx 또는 raw 폴더에 있는 테스트 파일로 --no-upload 실행
    2. output HTML에서 h1이 1개인지 확인
    3. h2가 요약, 모델 라인, FAQ 섹션에 들어갔는지 확인
    4. table에 caption, thead, tbody가 있는지 확인
    5. 기존 PNG 이미지가 정상 생성되는지 확인

    실행 예:
    python naverblog_promotion.py --file 2026_04_BMW.xlsx --no-upload --force

---

## 18. 새 Claude 이식용 요약 프롬프트

아래는 새 Claude에게 이 주제를 이어받게 할 때 사용할 수 있는 축약 프롬프트다.

    너는 네이버 블로그 프로모션 자동화 프로젝트를 이어받는다.

    현재 자동화는 아래 폴더에 있다.
    C:\Users\카피아\Desktop\마케팅\블로그 자동화\프로모션 자동화

    핵심 실행 파일은 naverblog_promotion.py이며, core/ 폴더에 엑셀 파싱, HTML 생성, 이미지 생성, 설정 파일이 있을 가능성이 높다.

    목표는 raw/ 폴더의 월별 브랜드 엑셀 파일을 읽어 네이버 블로그용 HTML, 섹션별 PNG, 정리 엑셀을 만들고 Playwright로 네이버 블로그에 임시저장 글을 자동 작성하는 것이다.

    운영 명령:
    python naverblog_promotion.py --file 2026_05_아우디.xlsx --no-upload
    python naverblog_promotion.py --file 2026_05_아우디.xlsx --upload-only
    python naverblog_promotion.py --file 2026_05_아우디.xlsx --no-upload --force
    python naverblog_promotion.py --save-session

    파일명 규칙은 YYYY_MM_브랜드명.xlsx다.
    예: 2026_05_아우디.xlsx, 2026_05_BMW.xlsx

    엑셀 파싱은 컬럼명 고정이 아니라 키워드 기반이어야 한다.
    자사금융: 자사금융 또는 자사할인 포함
    현금/타사: 현금 또는 타사 포함, 둘 다 있으면 타사조건 우선
    차량가격: 차량가격 또는 가격 포함
    모델명: 모델명 포함
    연식: 연식 포함

    HTML은 data-section 기준으로 나누고 Playwright 전체 스크린샷 후 PIL crop으로 PNG를 만든다. page.screenshot clip 직접 사용은 피한다. 2000px 폭 기준이며, 네이버 모바일 가독성을 위해 이미지 내부 폰트는 크게 유지한다.

    네이버 업로드 구조:
    고정 인사말
    [인용구2] 인트로 요약
    검색 안내 텍스트
    섹션 루프: [인용구2] 브랜드 그룹제목 프로모션 -> 이미지 -> section-comment
    [인용구2] 럭키 프로모션 정보 -> 본문
    [인용구2] 프로모션 쉽게 검색하기 -> 네이버 실제 표 삽입
    카피아였습니다 -> 해시태그 -> 임시저장

    이미지는 00_header, 01_intro, 11_CTA를 제외하고 02_부터 삽입한다.

    네이버 표는 실제 SmartEditor 표로 삽입한다. 컬럼은 모델명, 연식, 자사금융 할인(만원), 현금/타사 할인(만원)이다. 표 데이터가 인용구에 섞이지 않도록 insert_table() 전 본문 추가 버튼 클릭, focus_body(), 대기 처리를 한다. 셀 입력은 paragraph nth 방식이 아니라 table.se-table-content td 셀 직접 선택 방식으로 한다.

    사용자는 최소 토큰으로 Claude Code CLI에 바로 붙여넣을 수 있는 프롬프트를 선호한다. 따라서 수정 요청을 받으면 긴 설명보다 “어떤 파일을 읽고, 어디를 수정하고, 무엇을 유지하고, 어떻게 검증할지”가 들어간 실행 지시문을 작성해라.

    현재 마지막 미해결 요청은 HTML 생성 결과를 SEO 최적화 구조로 바꾸는 것이다. h1은 1개만 사용하고, h2는 요약/모델 라인/FAQ, h3는 세부 조건 설명에 사용한다. table에는 caption, thead, tbody, th scope를 넣는다. 가능하면 BlogPosting, FAQPage, BreadcrumbList JSON-LD를 추가하되 네이버 업로드 본문에서 문제가 생기면 옵션화한다. 기존 data-section, PNG 디자인, crop 로직, 이미지 삽입 범위는 유지해야 한다.
