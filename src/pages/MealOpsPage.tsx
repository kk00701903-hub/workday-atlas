import { Link } from 'react-router-dom'
import { PageHeader } from '../components/Layout'
import { useAtlas } from '../hooks/useAtlas'
import { formatWon, statusLabel } from '../data/mock'

export function MealOpsPage() {
  const { claims, updateClaimStatus, showToast } = useAtlas()
  const queue = claims.filter((c) => c.status === 'pending' || c.status === 'need_info')

  return (
    <>
      <PageHeader crumb="팀 예산 / 팀 식대 현황" title="식대 운영 관리">
        <Link className="btn ghost" to="/meal-status">
          식대 현황 조회
        </Link>
        <button className="btn" type="button" onClick={() => showToast('정책 설정은 데모에서 읽기 전용입니다')}>
          정책 설정
        </button>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>정보전략팀 사용</small>
          <b>1,020,000 / 1,500,000원</b>
          <span>승인 대기 14건 · 180,000원</span>
        </article>
        <article className="kpi">
          <small>디자인팀 사용</small>
          <b>540,000 / 900,000원</b>
          <span>지역화폐 적용률 91%</span>
        </article>
        <article className="kpi">
          <small>마케팅팀 확인 필요</small>
          <b>882,000 / 1,000,000원</b>
          <span className="warn">한도 102% 초과 위험</span>
        </article>
        <article className="kpi">
          <small>대기 큐</small>
          <b>{queue.length}건</b>
          <span>즉시 처리 권장</span>
        </article>
      </section>

      <section className="card">
        <div className="title">
          <h3>승인 대기 청구 큐</h3>
          <span className="muted">정책 위반 · 한도 초과 · 보완 요청 우선</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>청구자 / 팀</th>
                <th>식당 · 사유</th>
                <th>영수증</th>
                <th>할인</th>
                <th>청구액</th>
                <th>상태</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((c) => (
                <tr key={c.id}>
                  <td className="product">
                    <b>{c.claimant}</b>
                    <small>{c.team}</small>
                  </td>
                  <td className="product">
                    <b>{c.restaurant}</b>
                    <small>{c.reason}</small>
                  </td>
                  <td>{formatWon(c.amount)}</td>
                  <td>{c.discount ? `-${formatWon(c.discount)}` : '-'}</td>
                  <td>
                    <b>{formatWon(c.claimAmount)}</b>
                  </td>
                  <td>
                    <span className={c.status === 'need_info' ? 'badge warn' : 'badge'}>
                      {statusLabel[c.status]}
                    </span>
                  </td>
                  <td>
                    <div className="topright" style={{ gap: 6 }}>
                      <button
                        className="btn sm"
                        type="button"
                        onClick={() => {
                          updateClaimStatus(c.id, 'approved')
                          showToast('청구가 승인되었습니다')
                        }}
                      >
                        승인
                      </button>
                      <button
                        className="btn ghost sm"
                        type="button"
                        onClick={() => {
                          updateClaimStatus(c.id, 'need_info')
                          showToast('보완 요청을 보냈습니다')
                        }}
                      >
                        보완
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!queue.length ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty">대기 중인 청구가 없습니다.</div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
