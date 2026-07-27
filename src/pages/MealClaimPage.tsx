import { useMemo, useState } from 'react'
import { PageHeader } from '../components/Layout'
import { useAtlas } from '../hooks/useAtlas'
import {
  calcClaimAmount,
  currentUser,
  formatWon,
  members,
  restaurants,
} from '../data/mock'

export function MealClaimPage() {
  const { addClaim, showToast } = useAtlas()
  const [restaurant, setRestaurant] = useState(restaurants[2].name)
  const [amount, setAmount] = useState(99000)
  const [reason, setReason] = useState('팀 점심 식사')
  const [linkedWork, setLinkedWork] = useState('봄 프로모션 킥오프 회의')
  const [useLocalCurrency, setUseLocalCurrency] = useState(true)
  const [selected, setSelected] = useState<string[]>([
    '김희찬프로',
    '방민식프로',
    '한성민프로',
    '오준열프로',
  ])

  const calc = useMemo(
    () => calcClaimAmount(amount || 0, useLocalCurrency),
    [amount, useLocalCurrency],
  )

  const toggleMember = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    )
  }

  const submit = () => {
    if (!restaurant || !amount) {
      showToast('식당명과 금액을 입력해 주세요')
      return
    }
    addClaim({
      restaurant,
      amount,
      claimAmount: calc.finalAmount,
      discount: calc.discount,
      date: new Date().toISOString().slice(0, 10),
      claimant: currentUser.name,
      team: currentUser.team,
      attendees: selected.length ? selected : [currentUser.name],
      reason,
      linkedWork,
      useLocalCurrency,
      status: 'pending',
    })
    showToast('식대 청구가 제출되었습니다')
  }

  return (
    <>
      <PageHeader crumb="식대 · 영수증으로 청구하기" title="식대 청구 등록" />

      <div className="layout-claim">
        <div className="stack">
          <article className="card">
            <div className="title">
              <h3>1. 영수증 정보</h3>
            </div>
            <p className="muted">인식된 정보를 확인하고 필요하면 수정하세요.</p>
            <div className="form-grid" style={{ marginTop: 12 }}>
              <div className="field">
                <label>식당명</label>
                <select value={restaurant} onChange={(e) => setRestaurant(e.target.value)}>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>영수증 총액</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label>청구자</label>
                <b>
                  {currentUser.name} · {currentUser.team}
                </b>
              </div>
              <div className="field">
                <label>청구 사유</label>
                <input value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
            </div>
          </article>

          <article className="card">
            <div className="title">
              <h3>2. 참석자</h3>
            </div>
            <p className="muted">
              참석자 {selected.length || 1}명 · 균등 분할 기준
            </p>
            <div className="chips">
              {members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`chip selectable${selected.includes(m.name) ? ' on' : ''}`}
                  onClick={() => toggleMember(m.name)}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </article>

          <article className="card">
            <div className="title">
              <h3>3. 할인 정책 적용</h3>
            </div>
            <div
              className={`check${useLocalCurrency ? '' : ' off'}`}
              onClick={() => setUseLocalCurrency((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setUseLocalCurrency((v) => !v)
              }}
            >
              <div className="box">✓</div>
              <div>
                <b>지역화폐 사용</b>
                <small>성남사랑상품권 식대 정산 할인 · 할인율 10%</small>
              </div>
            </div>
            <div className="field" style={{ marginTop: 13 }}>
              <label>연결 업무</label>
              <input value={linkedWork} onChange={(e) => setLinkedWork(e.target.value)} />
            </div>
          </article>
        </div>

        <aside className="calc">
          <h2>청구 금액 미리보기</h2>
          <p>정산 정책과 계산 근거를 제출 전에 확인하세요.</p>
          <div className="policy">
            {useLocalCurrency ? '지역화폐 10% · ' : ''}1,000원 단위 반올림
          </div>
          <div className="line">
            <span>영수증 금액</span>
            <b>{formatWon(amount || 0)}</b>
          </div>
          <div className="line">
            <span>지역화폐 할인 (10%)</span>
            <b>- {formatWon(calc.discount)}</b>
          </div>
          <div className="line">
            <span>계산 금액</span>
            <b>{formatWon(calc.calculated)}</b>
          </div>
          <div className="line">
            <span>정산 단위 적용</span>
            <b>+ {formatWon(calc.roundingAdj)}</b>
          </div>
          <div className="total">
            <small>{currentUser.name} 님의 최종 청구 금액</small>
            <strong>{formatWon(calc.finalAmount)}</strong>
          </div>
          <div className="note">
            할인율과 반올림 규칙은 제출 시점의 회사 정책으로 기록됩니다. 승인 후 지급 예정일을
            안내해 드려요.
          </div>
          <button className="btn" style={{ width: '100%' }} type="button" onClick={submit}>
            청구 제출하기
          </button>
        </aside>
      </div>
    </>
  )
}
