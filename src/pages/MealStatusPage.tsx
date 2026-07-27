import { Link } from 'react-router-dom'
import { PageHeader } from '../components/Layout'
import { useAtlas } from '../hooks/useAtlas'
import { formatWon, statusLabel, type ClaimStatus } from '../data/mock'

const badgeClass = (s: ClaimStatus) => {
  if (s === 'approved') return 'badge ok'
  if (s === 'need_info' || s === 'rejected') return 'badge warn'
  return 'badge'
}

export function MealStatusPage() {
  const { claims } = useAtlas()
  const allocated = 1500000
  const used = claims
    .filter((c) => c.status === 'approved')
    .reduce((sum, c) => sum + c.claimAmount, 0)
  const pending = claims
    .filter((c) => c.status === 'pending' || c.status === 'need_info')
    .reduce((sum, c) => sum + c.claimAmount, 0)
  const remaining = allocated - used - pending

  return (
    <>
      <PageHeader crumb="팀 예산 / 팀 식대 현황" title="정보전략팀 식대 현황">
        <Link className="btn ghost" to="/meal-ops">
          식대 운영 관리
        </Link>
        <Link className="btn" to="/meal-claim">
          청구하기
        </Link>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>5월 식대 예산</small>
          <b>{formatWon(allocated)}</b>
          <span>정보전략팀</span>
        </article>
        <article className="kpi">
          <small>승인 완료</small>
          <b>{formatWon(used)}</b>
          <span>{Math.round((used / allocated) * 100)}% 사용</span>
        </article>
        <article className="kpi">
          <small>승인 대기</small>
          <b>{formatWon(pending)}</b>
          <span className="warn">처리 필요</span>
        </article>
        <article className="kpi">
          <small>잔여 예산</small>
          <b>{formatWon(remaining)}</b>
          <span>한도 {Math.round((remaining / allocated) * 100)}% 여유</span>
        </article>
      </section>

      <div className="layout-main-side">
        <section className="card">
          <div className="title">
            <h3>최근 식대 청구</h3>
            <span className="link">전체 보기</span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>일자</th>
                  <th>식당</th>
                  <th>청구자</th>
                  <th>금액</th>
                  <th>할인</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c.id}>
                    <td>{c.date}</td>
                    <td className="product">
                      <b>{c.restaurant}</b>
                      <small>{c.reason}</small>
                    </td>
                    <td>{c.claimant}</td>
                    <td>
                      <b>{formatWon(c.claimAmount)}</b>
                    </td>
                    <td>{c.discount ? `-${formatWon(c.discount)}` : '-'}</td>
                    <td>
                      <span className={badgeClass(c.status)}>{statusLabel[c.status]}</span>
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
              <h3>이번 달 이용 랭킹</h3>
            </div>
            <div className="stack-sm">
              {[
                { name: '성수국밥', count: 23, avg: 10840 },
                { name: '을지로 보리밥', count: 17, avg: 9900 },
                { name: '샐러디 성수점', count: 12, avg: 11200 },
              ].map((r, i) => (
                <div className="task" key={r.name}>
                  <div className="bubble">{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <strong>{r.name}</strong>
                    <small>
                      {r.count}회 · 평균 {formatWon(r.avg)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="card">
            <div className="title">
              <h3>식대 운영 안내</h3>
            </div>
            <p className="muted">
              지역화폐 사용률 78% · 할인된 금액은 팀 예산에 반영됩니다. 승인 대기 건은 3영업일
              내 자동 전환됩니다.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
