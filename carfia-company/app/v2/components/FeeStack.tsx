/**
 * 도식 3 — 금리가 왜 내려가는지.
 *
 * "채널이 단순해져서 금리가 낮아진다"는 말은 읽어도 그림이 안 그려진다.
 * 블록을 쌓아 보여 주면 "거치는 곳이 줄어드니 얹히는 것도 줄어든다"가 한눈에 보인다.
 *
 * 주의 — 블록의 개수는 구조를 설명하는 그림이고, 특정 요율을 주장하는 것이 아니다.
 * 사업계획서에 각 단계의 수수료율이 적혀 있지 않으므로 숫자를 붙이지 않는다.
 */

export default function FeeStack() {
  return (
    <div className="x-fee">
      <div className="x-fee__col x-fee__col--bad">
        <p className="x-fee__h">딜러를 거칠 때</p>
        <div className="x-bars">
          <div className="x-feebar x-feebar--base">
            <span>기본 금리</span>
            <span>금융사가 정하는 값</span>
          </div>
          <div className="x-feebar x-feebar--fee">
            <span>+ 중간 수수료</span>
            <span>연결해 준 대가</span>
          </div>
          <div className="x-feebar x-feebar--fee">
            <span>+ 대행 수수료</span>
            <span>서류·실행을 맡긴 대가</span>
          </div>
        </div>
        <p className="x-fee__total">
          <span>내가 내는 이자</span>
          <span>기본 금리보다 높음</span>
        </p>
      </div>

      <div className="x-fee__col x-fee__col--good">
        <p className="x-fee__h">카피아를 거칠 때</p>
        <div className="x-bars">
          <div className="x-feebar x-feebar--base">
            <span>기본 금리</span>
            <span>14곳 중 가장 낮은 값</span>
          </div>
          <div className="x-feebar x-feebar--fee-sm">
            <span>+ 중개 수수료</span>
            <span>금융사가 카피아에 지급</span>
          </div>
        </div>
        <p className="x-fee__total">
          <span>내가 내는 이자</span>
          <span>기본 금리에 가까움</span>
        </p>
      </div>
    </div>
  );
}
