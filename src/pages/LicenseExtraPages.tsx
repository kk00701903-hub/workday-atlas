import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/Layout'
import { useAtlas } from '../hooks/useAtlas'
import { formatWon, licenseStatusLabel } from '../data/mock'

export function LicenseDetailPage() {
  const { id } = useParams()
  const { licenses, showToast } = useAtlas()
  const license = licenses.find((l) => l.id === id) ?? licenses[0]

  const optionA = license.monthlyCost
  const optionB = Math.round(license.monthlyCost * 0.92)

  return (
    <>
      <PageHeader
        crumb={`라이선스 / ${license.name} / 갱신 검토`}
        title={`${license.name} 갱신 검토`}
      >
        <Link className="btn ghost" to="/licenses">
          목록으로
        </Link>
        <button
          className="btn"
          type="button"
          onClick={() => showToast('갱신 승인 요청을 보냈습니다')}
        >
          승인 요청
        </button>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>갱신까지</small>
          <b>{license.daysLeft}일 남음</b>
          <span className="warn">{license.renewDate}</span>
        </article>
        <article className="kpi">
          <small>현재 월 비용</small>
          <b>{formatWon(license.monthlyCost)}</b>
          <span>{license.plan} · 자동 갱신</span>
        </article>
        <article className="kpi">
          <small>좌석 / 활성</small>
          <b>
            {license.seats} / {license.active}
          </b>
          <span>사용률 {Math.round((license.active / license.seats) * 100)}%</span>
        </article>
        <article className="kpi">
          <small>상태</small>
          <b>{licenseStatusLabel[license.status]}</b>
          <span>{license.owner}</span>
        </article>
      </section>

      <div className="layout-main-side">
        <div className="stack">
          <section className="card">
            <div className="title">
              <h3>좌석 최적화 추천</h3>
            </div>
            <p className="muted">
              최근 30일 활성 사용자 {license.active}명과 신규 요청을 반영해{' '}
              {Math.max(license.active + 2, Math.round(license.seats * 0.9))}석 유지를
              권장합니다. 45일 이상 미사용 좌석은 회수 후보입니다.
            </p>
            <div className="grid-2" style={{ marginTop: 16 }}>
              <div className="mini">
                <span>현재 유지</span>
                <b>{license.seats}석</b>
                <span>월 {formatWon(optionA)}</span>
              </div>
              <div className="mini" style={{ borderColor: '#2563EB' }}>
                <span>권장 감석</span>
                <b>{Math.max(license.active + 2, Math.round(license.seats * 0.92))}석</b>
                <span>월 {formatWon(optionB)} · 약 8% 절감</span>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="title">
              <h3>검토 체크리스트</h3>
            </div>
            {[
              '활성 사용자·미사용 좌석 확인 완료',
              '예산 담당자 월 비용 한도 확인',
              '자동 갱신 유지 여부 결정',
              '결제 수단·계약서 버전 확인',
            ].map((item) => (
              <div className="task" key={item}>
                <i className="dot" style={{ background: '#2563EB' }} />
                <div>
                  <strong>{item}</strong>
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="stack">
          <section className="card">
            <div className="alert">
              <b>자동 갱신 마감 알림</b>
              계약 종료일은 {license.renewDate}입니다. 자동 갱신 유지 또는 조건 변경을
              사전에 벤더에 통보해야 합니다.
            </div>
          </section>
          <section className="card">
            <div className="title">
              <h3>빠른 작업</h3>
            </div>
            <p className="muted" style={{ marginBottom: 12 }}>
              {license.name} 갱신 검토를 시작하고, 오준열프로 · 워크스페이스 관리자에게 최종
              승인을 요청하세요.
            </p>
            <button
              className="btn"
              style={{ width: '100%' }}
              type="button"
              onClick={() => showToast('검토 워크플로가 시작되었습니다')}
            >
              검토 시작
            </button>
          </section>
        </div>
      </div>
    </>
  )
}

export function LicenseSubscriptionsPage() {
  const { licenses } = useAtlas()
  const monthly = licenses.reduce((s, l) => s + l.monthlyCost, 0)

  return (
    <>
      <PageHeader crumb="운영 관리 / 소프트웨어 라이선스" title="소프트웨어 구독 알림">
        <Link className="btn ghost" to="/licenses">
          라이선스 개요
        </Link>
        <Link className="btn" to="/licenses">
          구독 추가
        </Link>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>월 구독 비용</small>
          <b>{formatWon(monthly)}</b>
          <span>전월 대비 +2.1%</span>
        </article>
        <article className="kpi">
          <small>30일 이내 갱신</small>
          <b>{licenses.filter((l) => l.daysLeft <= 30).length}건</b>
          <span className="warn">우선 확인 필요</span>
        </article>
        <article className="kpi">
          <small>활성 라이선스</small>
          <b>{licenses.length}개</b>
          <span>{licenses.reduce((s, l) => s + l.seats, 0)}개 좌석</span>
        </article>
        <article className="kpi">
          <small>평균 좌석 사용률</small>
          <b>
            {Math.round(
              (licenses.reduce((s, l) => s + l.active, 0) /
                licenses.reduce((s, l) => s + l.seats, 0)) *
                100,
            )}
            %
          </b>
          <span>미사용 좌석 관리</span>
        </article>
      </section>

      <section className="card">
        <div className="title">
          <h3>구독 및 갱신 현황</h3>
          <span className="link">비용 보고서</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>소프트웨어</th>
                <th>다음 갱신일</th>
                <th>좌석</th>
                <th>월 비용</th>
                <th>담당자</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((l) => (
                <tr key={l.id}>
                  <td className="product">
                    <b>{l.name}</b>
                    <small>{l.description}</small>
                  </td>
                  <td>
                    {l.renewDate}
                    <br />
                    <span className={l.daysLeft <= 18 ? 'badge warn' : 'badge'}>
                      {l.daysLeft}일 남음
                    </span>
                  </td>
                  <td>
                    {l.active} / {l.seats}
                  </td>
                  <td>
                    <b>{formatWon(l.monthlyCost)}</b>
                  </td>
                  <td>{l.owner}</td>
                  <td>
                    <span className={l.status === 'normal' ? 'badge' : 'badge warn'}>
                      {licenseStatusLabel[l.status]}
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

export function LicenseCatalogPage() {
  const { licenses } = useAtlas()

  return (
    <>
      <PageHeader crumb="워크스페이스 / 라이선스" title="라이선스 카탈로그">
        <Link className="btn" to="/licenses">
          + 새 라이선스 등록
        </Link>
      </PageHeader>

      <section className="card">
        <div className="title">
          <h3>전체 {licenses.length}개 서비스</h3>
          <span className="muted">좌석 · 비용 · 갱신일 기준</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>제품</th>
                <th>카테고리</th>
                <th>플랜</th>
                <th>좌석 / 활성</th>
                <th>갱신일</th>
                <th>월 비용</th>
                <th>담당</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((l) => (
                <tr key={l.id}>
                  <td className="product">
                    <b>{l.name}</b>
                    <small>
                      {l.vendor} · {l.description}
                    </small>
                  </td>
                  <td>{l.category}</td>
                  <td>{l.plan}</td>
                  <td>
                    {l.seats}석 · {l.active} 활성
                  </td>
                  <td>
                    {l.renewDate}
                    <br />
                    <span className="badge">{l.daysLeft}일 남음</span>
                  </td>
                  <td>
                    <b>{formatWon(l.monthlyCost)}</b>
                  </td>
                  <td>{l.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
