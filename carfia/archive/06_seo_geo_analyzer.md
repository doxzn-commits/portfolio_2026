# SEO/GEO 분석기 히스토리 인계서

원본 공유 링크: https://claude.ai/share/5c153be3-261e-460a-a7fb-36623d29ec17

## 1. 주제와 최종 목표
SEO와 GEO를 정량적으로 측정하고, 특정 질문에 대해 AI 답변에 사이트가 노출될 수 있도록 진단/개선 방향을 제시하는 분석기 서비스 기획 및 초기 구축 이력이다.

초기 목표:
- SEO와 GEO의 평가 기준을 100점 만점으로 정의한다.
- 어떤 웹사이트에도 적용 가능한 공용 기준표를 만든다.
- 이후 측정 툴을 만들고, 궁극적으로는 특정 질문에 AI가 우리 사이트를 답변/출처로 쓰게 만드는 서비스로 확장한다.

## 2. SEO/GEO 개념 구분
SEO:
- 기존 검색엔진에서 특정 키워드 검색 시 상위 노출되도록 최적화하는 작업.
- 기술 구조, 콘텐츠 품질, 온페이지 요소, 백링크, 사용자 경험을 본다.

GEO:
- ChatGPT, Perplexity, Gemini, Claude 등 생성형 AI가 특정 질문에 답변할 때 해당 사이트를 출처로 인용하거나 답변 내용에 포함하도록 최적화하는 작업.
- 인용 가능성, 권위/신뢰성, AI 친화적 구조, 답변 일치도, 멀티소스 노출을 본다.

핵심 차이:
- SEO는 색인과 랭킹 중심이다.
- GEO는 AI가 신뢰하고 인용할 수 있는 답변 구조 중심이다.
- SEO가 높아도 GEO가 낮을 수 있고, 반대도 가능하다.

## 3. SEO 평가 모델
가중치:
- 기술적 SEO 25%
- 콘텐츠 품질 30%
- 온페이지 최적화 20%
- 백링크 권위 15%
- 사용자 경험 10%

영역별 항목:

기술적 SEO:
- Core Web Vitals: LCP, CLS, INP.
- 크롤러 접근성: robots.txt, sitemap.xml, noindex 여부.
- 모바일 최적화: viewport, 모바일 PageSpeed.
- 구조화 데이터: Schema.org JSON-LD 종류 수.
- HTTPS/보안: SSL, Mixed Content.

콘텐츠 품질:
- 콘텐츠 깊이: 본문 글자 수, 얕은 콘텐츠 여부.
- 키워드 전략: H1/H2/H3, 검색 의도 일치, 키워드 매핑.

온페이지 최적화:
- 타이틀/메타디스크립션 길이.
- URL 구조.
- 내부 링크 구조.

백링크 권위:
- 백링크 프로필: DA/DR, 참조 도메인, 스팸 비율.
- 링크 다양성: 앵커텍스트, 관련 출처 비율.

사용자 경험:
- 이탈률.
- 평균 세션 시간.
- 페이지/세션 수.

## 4. GEO 평가 모델
가중치:
- 인용 가능성 25%
- 권위/신뢰성 25%
- AI 친화적 구조 20%
- 답변 일치도 20%
- 멀티소스 노출 10%

영역별 항목:

인용 가능성:
- 인용 빈도: AI 답변에서 사이트가 출처로 인용되는 횟수.
- 수치/통계 증거: %, 금액, 연도, 순위 등 검증 가능한 수치 밀도.

권위/신뢰성:
- 브랜드 권위: 언론 보도, Wikipedia, 권위 사이트 언급.
- E-E-A-T: 저자, 날짜, 전문가 검수, 외부 출처 링크.

AI 친화적 구조:
- 콘텐츠 구조: H1/H2/H3, 정의형 문장.
- FAQ 구조: FAQPage, Q/A 패턴, 질문형 헤딩.
- 언어 명확성: 평균 문장 길이, 수동태 비율.

답변 일치도:
- 콘텐츠 신선도: 날짜 메타, 최근 업데이트.
- 직접 답변 구조: 타깃 질문 키워드가 헤딩/첫 문단에 등장하는지.

멀티소스 노출:
- Reddit, Quora, 네이버 블로그, YouTube, 커뮤니티 등 외부 플랫폼 언급.

## 5. 등급 체계
- S: 90-100. AI 검색 및 일반 검색 모두 최상위 노출 가능.
- A: 75-89. 주요 키워드 상위권, AI 인용 빈번.
- B: 60-74. 보완 시 단기 성과 기대 가능.
- C: 45-59. 구조적 개선 필요, AI 채택 거의 없음.
- D: 44 이하. 전면 재설계 수준의 개입 필요.

## 6. 서비스 전략
A안:
- SEO/GEO 측정 툴.
- 구현이 더 쉽고 결과가 바로 점수로 나온다.
- 단독 SaaS로 팔면 Ahrefs, Semrush 등과 경쟁한다.

B안:
- 특정 질문에 AI 답변 노출을 달성하도록 진단/콘텐츠/구조 개선을 실행하는 서비스.
- 구현과 성과 예측은 어렵지만 수요와 지불 의향이 높다.

최종 전략:
- A안을 먼저 만든다.
- A안을 B안의 백엔드이자 성과 증빙 도구로 쓴다.
- 외부에는 B안, 즉 AI가 고객 질문에 우리 사이트를 답으로 내놓게 만드는 서비스를 판다.

## 7. B안 성과 측정 기준
핵심 성과:
- 원하는 질문에 대해 AI 답변에 사이트가 등장했는가.

세부 지표:
- 인용 달성 여부.
- 인용까지 소요 기간.
- 인용 안정성: 동일 질문 10회 입력 시 7회 이상이면 안정.
- 인용 위치: 본문 언급, 출처 링크, 미인용.
- 인용 AI 범위: ChatGPT, Perplexity, Gemini, Claude 중 몇 개에서 인용되는지.
- 오가닉 트래픽 증감.
- AI 레퍼러 유입.
- 타깃 페이지 유입.
- 질문 선정 적합성: 검색량, 상업적 의도, 경쟁 강도.

성과 등급:
- 완전 성과: 인용 달성 + 유입 증가 + 8주 이내.
- 부분 성과: 인용 달성 + 유입 미확인 또는 8주 초과.
- 기술 성과: 인용 미달성 + 오가닉 트래픽 증가.
- 미성과: 인용 미달성 + 유입 변화 없음.

## 8. 개발 타임라인과 방향 전환
초기 장기 타임라인:
1. 측정 툴 개발 8-10주.
2. 진단 리포트 설계 4-5주.
3. 파일럿 클라이언트 실전 검증 8주.
4. AI 노출 최적화 서비스 개발 6-8주.
5. 상용화 및 판매 4주.

이후 내부 사용 우선으로 조정했다.

내부 우선순위:
1. 카피아 사이트에 먼저 적용한다.
2. 점수 산출 로직이 현실적인지 본다.
3. HTML 리포트가 내부 공유용으로 쓸 만한지 확인한다.
4. 개선 방향 문서를 자동 생성한다.
5. 클라이언트용 가이드는 나중에 만든다.

## 9. 현재 구축된 툴 상태
사용자가 공유한 CLI 결과:
- seo-geo-tool 디렉토리에 22개 TypeScript 파일로 구성된 측정 툴 완성.

구성:
- src/index.ts: CLI 진입점.
- src/types.ts: 전체 타입 정의.
- src/modules/seo: technical, onpage, content, backlink, ux.
- src/modules/geo: quotability, authority, structure, alignment, presence.
- src/scorer: SEO/GEO 가중치 합산 및 등급 산출.
- src/reporter: CLI, JSON, HTML 리포트 생성.

특징:
- API 키 없이 동작.
- PageSpeed/Ahrefs 미설정 시 Mock 점수 반환.
- output 폴더에 JSON + HTML 저장.
- --questions 옵션으로 GEO 직접 답변 정밀 측정 가능.

## 10. 내부 카피아 테스트
테스트 URL:
- https://www.carfia.co.kr

타깃 질문:
- 수입차 리스 금리 비교
- BMW 장기렌트 추천
- 수입차 할부 금리 낮은 곳
- 자동차 금융 리스 할부 차이
- 수입차 운용리스 금융리스 차이

SaaS 확장성을 위해 추가할 필드:
- clientId
- clientName
- memo

CLI 옵션:
- --client-name
- --memo

출력 파일명:
- {clientName}_{YYYYMMDD}_{SEO점수}_{GEO점수}.json/html

## 11. PageSpeed API 결정
결론:
- 내부 방향 문서화 단계에서는 PageSpeed API가 꼭 필요하지 않다.

이유:
- 카피아의 핵심 문제는 Core Web Vitals가 아니라 SPA 구조로 인한 콘텐츠 노출 부족과 GEO 구조 미흡이다.
- PageSpeed는 SEO 100점 중 10점짜리 항목이다.
- Mock 항목은 PageSpeed 외에도 백링크, GA4, 언론 크롤링, 멀티소스 등 많이 남아 있다.

필요해지는 시점:
- 외부 클라이언트가 GSC 권한을 주지 않을 때.
- 경쟁사 속도 비교가 필요할 때.
- 외부 판매용 SaaS로 전환할 때.

## 12. 개선 방향 리포트 기능
다음 핵심 기능은 IMPROVEMENT-REPORT 자동 생성이다.

파일:
- src/reporter/improvement-reporter.ts

입력:
- 기존 Report 타입.

출력:
- Markdown.
- HTML.

포함 섹션:
1. 종합 진단 요약.
2. Easy Win.
3. Dev Required.
4. Mock 항목 안내.
5. 개선 후 예상 점수.
6. 재측정 안내.

Easy Win 예:
- 타이틀/메타디스크립션.
- 정의형 문장.
- 수치/통계.
- 날짜 메타데이터.
- FAQ 텍스트.
- H1/H2 구조.

Dev Required 예:
- Schema.org JSON-LD 삽입.
- 모바일 최적화.
- 크롤러 접근성.
- SPA 콘텐츠 노출 개선.

CLI 옵션:
- --improvement

출력 파일:
- output/{clientName}_{YYYYMMDD}_improvement.md
- output/{clientName}_{YYYYMMDD}_improvement.html

## 13. 단일 HTML UX/UI 앱
사용자는 output 파일 여러 개보다 매끄러운 HTML UX에서 확인하고 싶어 했다.

제안 구조:
- Express 서버가 CLI 측정 모듈을 API로 감싼다.
- public/index.html 단일 HTML 앱.
- npm run serve 하나로 실행.

API:
- GET /api/health.
- POST /api/measure.
- GET /api/report/:filename.
- GET /api/measure/stream. SSE로 진행률 전송.

포트:
- 3030.

프론트 플로우:
1. URL 입력.
2. 질문 선택.
3. 분석 중 화면.
4. 분석 결과 화면.

디자인:
- 모바일 우선.
- 최대 너비 480px.
- Toss 스타일 카드 UI.
- Pretendard.
- Primary #111827.
- Accent Blue #3B82F6.
- Success #10B981.
- Warning #F59E0B.
- Danger #EF4444.

실행:
- cd seo-geo-tool
- npm run serve
- 브라우저에서 http://localhost:3030 접속.

## 14. 신규 AI 학습용 기준 프롬프트
마지막 요청은 신규 AI에게 학습시킬 SEO/GEO 측정 기준 프롬프트였다.

포함해야 할 내용:
- System Role: SEO/GEO 전문 분석 AI.
- SEO/GEO 개념 정의.
- SEO 평가 모델.
- GEO 평가 모델.
- 등급 체계.
- 점수 조합별 진단 문구.
- Easy Win과 Dev Required 분류.
- 개선 우선순위 공식.
- 예상 점수 계산 방법.
- Mock 처리 기준.
- 출력 형식.

Mock 기준:
- Core Web Vitals: 5/10, PageSpeed API 필요.
- 백링크 프로필: 5/10, Ahrefs API 필요.
- 링크 다양성: 2/5, Ahrefs API 필요.
- 브랜드 권위: 5/15, 언론 크롤링 필요.
- 인용 빈도: 3/15, Perplexity/OpenAI API 필요.
- 플랫폼 존재감: 3/10, 외부 플랫폼 크롤링 필요.
- 사용자 행동: 4/10, GA4 API 필요.

Mock 비율이 30%를 초과하면 절대 점수보다 항목별 구조 분석에 집중하라는 경고를 표시한다.

## 15. 다음 AI 주의사항
- 이 서비스의 핵심은 점수표가 아니라 특정 질문에 답변으로 걸리게 하는 실행 서비스다.
- 측정 툴은 실행 서비스의 백엔드와 증빙 도구다.
- 내부 사용 단계에서는 클라이언트용 PILOT-GUIDE보다 카피아 내부 측정과 개선 방향 문서화가 먼저다.
- PageSpeed API는 지금 당장 필수는 아니다.
- 다음 핵심 개발은 improvement reporter와 단일 HTML UX다.
- 공용 기준이어야 하며 카피아 전용 기준으로 좁히면 안 된다.
