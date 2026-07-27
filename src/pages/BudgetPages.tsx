import { Link } from 'react-router-dom'
import { PageHeader } from '../components/Layout'
import { budgets, formatWon } from '../data/mock'

export function BudgetPage() {
  const total = budgets.reduce((s, b) => s + b.allocated, 0)
  const used = budgets.reduce((s, b) => s + b.used, 0)
  const pending = budgets.reduce((s, b) => s + b.pending, 0)

  return (
    <>
      <PageHeader crumb="팀 예산 / 2025년 5월" title="이번 달 예산 운영 현황">
        <Link className="btn ghost" to="/budget/admin">
          예산 관리
        </Link>
        <Link className="btn" to="/meal-status">
          식대 현황
        </Link>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>총 팀 예산</small>
          <b>{formatWon(total)}</b>
          <span>전월 대비 +4.8%</span>
        </article>
        <article className="kpi">
          <small>사용 완료 금액</small>
          <b>{formatWon(used)}</b>
          <span>{Math.round((used / total) * 100)}% 집행</span>
        </article>
        <article className="kpi">
          <small>승인 대기 반영액</small>
          <b>{formatWon(pending)}</b>
          <span>청구 {budgets.length * 10}건</span>
        </article>
        <article className="kpi">
          <small>지역화폐 절감액</small>
          <b>1,286,000원</b>
          <span>할인 정책 효과</span>
        </article>
      </section>

      <div className="layout-main-side">
        <section className="card">
          <div className="title">
            <h3>팀·카테고리별 예산 현황</h3>
            <Link className="link" to="/budget/view">
              상세 조회
            </Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>팀 / 항목</th>
                  <th>배정</th>
                  <th>사용</th>
                  <th>잔여</th>
                  <th>사용률</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b) => (
                  <tr key={b.id}>
                    <td className="product">
                      <b>
                        {b.team} · {b.category}
                      </b>
                    </td>
                    <td>{formatWon(b.allocated)}</td>
                    <td>{formatWon(b.used)}</td>
                    <td>{formatWon(b.remaining)}</td>
                    <td>
                      <div className="progress" style={{ margin: '0 0 4px', width: 90 }}>
                        <i
                          style={{
                            width: `${Math.min(b.rate, 100)}%`,
                            background: b.status === 'over' ? '#dc2626' : undefined,
                          }}
                        />
                      </div>
                      {b.rate}%
                    </td>
                    <td>
                      <span
                        className={
                          b.status === 'normal' ? 'badge' : b.status === 'over' ? 'badge danger' : 'badge warn'
                        }
                      >
                        {b.status === 'over' ? '초과' : b.status === 'warn' ? '주의' : '정상'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="stack">
          <section className="card">
            <div className="title">
              <h3>이번 달 확인할 항목</h3>
            </div>
            <div className="alert" style={{ marginBottom: 10 }}>
              <b>정보전략팀 식대 한도 96% 근접</b>
              이번 달 팀 회식 2건까지 반영하면 한도에 근접합니다.
            </div>
            <div className="alert">
              <b>정보전략팀 회의비 초과 위험</b>
              대기 48,000원을 승인하면 30,000원 초과입니다.
            </div>
          </section>
          <section className="card">
            <div className="title">
              <h3>최근 예산 조정</h3>
            </div>
            <div className="task">
              <div className="bubble">+</div>
              <div>
                <strong>정보전략팀 · 식대 +200,000원</strong>
                <small>신규입사 3명 반영 · 5월 14일</small>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export function BudgetAdminPage() {
  return (
    <>
      <PageHeader crumb="팀 예산 / 예산 관리자" title="예산 배정 관리">
        <Link className="btn ghost" to="/budget">
          현황 홈
        </Link>
        <button className="btn" type="button">
          일괄 저장
        </button>
      </PageHeader>

      <section className="card">
        <div className="title">
          <h3>2025년 5월 예산 배정</h3>
          <span className="muted">확정 후에는 관리자만 수정할 수 있습니다.</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>팀 / 항목</th>
                <th>기본 배정</th>
                <th>조정</th>
                <th>최종 배정</th>
                <th>사용</th>
                <th>대기</th>
                <th>잔여</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => (
                <tr key={b.id}>
                  <td className="product">
                    <b>
                      {b.team} · {b.category}
                    </b>
                  </td>
                  <td>{formatWon(b.allocated - (b.id === 'b1' ? 200000 : 0))}</td>
                  <td>{b.id === 'b1' ? '+200,000원' : '-'}</td>
                  <td>
                    <b>{formatWon(b.allocated)}</b>
                  </td>
                  <td>{formatWon(b.used)}</td>
                  <td>{formatWon(b.pending)}</td>
                  <td>{formatWon(b.remaining)}</td>
                  <td>
                    <span className={b.rate > 100 ? 'badge danger' : 'badge'}>
                      {b.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export function BudgetViewPage() {
  const mine = budgets.find((b) => b.team === '정보전략팀' && b.category === '식대')!

  return (
    <>
      <PageHeader crumb="팀 예산 / 팀원 조회" title="정보전략팀 예산 조회">
        <Link className="btn" to="/meal-claim">
          식대 청구하기
        </Link>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>식대 예산</small>
          <b>{formatWon(mine.allocated)}</b>
          <span>정보전략팀</span>
        </article>
        <article className="kpi">
          <small>사용 완료</small>
          <b>{formatWon(mine.used)}</b>
          <span>{Math.round((mine.used / mine.allocated) * 100)}% 사용</span>
        </article>
        <article className="kpi">
          <small>승인 대기 반영</small>
          <b>{formatWon(mine.pending)}</b>
          <span>14건 반영 예정</span>
        </article>
        <article className="kpi">
          <small>잔여 예산</small>
          <b>{formatWon(mine.remaining)}</b>
          <span>한도 96% 근접</span>
        </article>
      </section>

      <div className="grid-2">
        <section className="card">
          <div className="title">
            <h3>주차별 식대 사용</h3>
          </div>
          {[
            ['1주', 215000],
            ['2주', 286000],
            ['3주', 411000],
            ['4주', 488000],
          ].map(([week, amount]) => (
            <div key={week as string} style={{ marginBottom: 12 }}>
              <div className="title" style={{ marginBottom: 6 }}>
                <span className="muted">{week}</span>
                <b style={{ fontSize: 13 }}>{formatWon(amount as number)}</b>
              </div>
              <div className="progress">
                <i style={{ width: `${((amount as number) / 500000) * 100}%` }} />
              </div>
            </div>
          ))}
        </section>
        <section className="card">
          <div className="title">
            <h3>카테고리 비교</h3>
          </div>
          {budgets
            .filter((b) => b.team === '정보전략팀')
            .map((b) => (
              <div className="task" key={b.id}>
                <div style={{ flex: 1 }}>
                  <strong>{b.category}</strong>
                  <small>
                    {formatWon(b.used)} / {formatWon(b.allocated)}
                  </small>
                </div>
                <span className={b.rate > 100 ? 'badge danger' : 'badge'}>{b.rate}%</span>
              </div>
            ))}
        </section>
      </div>
    </>
  )
}
