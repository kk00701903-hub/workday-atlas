import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/Layout'
import { useAtlas } from '../hooks/useAtlas'
import {
  formatWon,
  licenseStatusLabel,
  members,
  type LicenseStatus,
} from '../data/mock'

type Tab = 'all' | 'renewal' | 'review'

export function LicensesPage() {
  const { licenses, addLicense, showToast } = useAtlas()
  const [tab, setTab] = useState<Tab>('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    vendor: '',
    category: '생산성',
    plan: '',
    seats: 10,
    active: 8,
    monthlyCost: 300000,
    renewDate: '2025-08-01',
    daysLeft: 30,
    owner: members[0].name,
    status: 'normal' as LicenseStatus,
    description: '',
  })

  const filtered = useMemo(() => {
    if (tab === 'renewal') return licenses.filter((l) => l.daysLeft <= 30 || l.status === 'renewal')
    if (tab === 'review')
      return licenses.filter((l) => l.status === 'review' || l.status === 'seat_short')
    return licenses
  }, [licenses, tab])

  const monthly = licenses.reduce((s, l) => s + l.monthlyCost, 0)
  const renewSoon = licenses.filter((l) => l.daysLeft <= 30).length
  const seats = licenses.reduce((s, l) => s + l.seats, 0)
  const active = licenses.reduce((s, l) => s + l.active, 0)

  const submit = () => {
    if (!form.name.trim()) {
      showToast('제품명을 입력해 주세요')
      return
    }
    addLicense({
      ...form,
      description: form.description || `${form.category} · ${form.vendor}`,
    })
    setOpen(false)
    showToast('라이선스가 등록되었습니다')
  }

  return (
    <>
      <PageHeader crumb="워크스페이스 / 라이선스" title="라이선스 개요">
        <Link className="btn ghost" to="/licenses/subscriptions">
          구독 알림
        </Link>
        <button className="btn" type="button" onClick={() => setOpen(true)}>
          + 라이선스·계약 등록
        </button>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>활성 라이선스</small>
          <b>{licenses.length}개 서비스</b>
          <span>관리 대상 전체</span>
        </article>
        <article className="kpi">
          <small>이번 달 비용</small>
          <b>{formatWon(monthly)}</b>
          <span>전월 대비 +3.2%</span>
        </article>
        <article className="kpi">
          <small>30일 이내 갱신</small>
          <b>{renewSoon}건</b>
          <span className="warn">결정 필요</span>
        </article>
        <article className="kpi">
          <small>좌석 사용</small>
          <b>
            {active} / {seats}
          </b>
          <span>평균 {Math.round((active / seats) * 100)}%</span>
        </article>
      </section>

      <div className="tabs">
        {(
          [
            ['all', '전체'],
            ['renewal', '갱신 예정'],
            ['review', '비용·좌석 검토'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`tab${tab === key ? ' on' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="layout-main-side">
        <section className="card">
          <div className="title">
            <h3>주의가 필요한 갱신 일정</h3>
            <Link className="link" to="/licenses/catalog">
              전체 카탈로그
            </Link>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
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
                      <span
                        className={
                          l.status === 'normal' ? 'badge' : 'badge warn'
                        }
                      >
                        {licenseStatusLabel[l.status]}
                      </span>
                    </td>
                    <td>
                      <Link className="link" to={`/licenses/${l.id}`}>
                        {l.status === 'renewal' ? '검토 시작' : '상세'}
                      </Link>
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
              <h3>운영 인사이트</h3>
            </div>
            <div className="alert" style={{ marginBottom: 10 }}>
              <b>Claude Team 미사용 좌석 2석</b>
              45일 이상 사용 기록이 없어 2석 감석을 제안합니다.
            </div>
            <div className="alert" style={{ marginBottom: 10 }}>
              <b>Figma 대기 요청 2건</b>
              잔여 3석입니다. 미사용 좌석 회수를 검토하세요.
            </div>
            <div className="alert">
              <b>Miro 활성 사용률 45%</b>
              20석 중 최근 활성 사용자는 9명입니다.
            </div>
          </section>
          <section className="card">
            <div className="title">
              <h3>운영 권한 사용자</h3>
            </div>
            {members.slice(0, 4).map((m) => (
              <div className="member" key={m.id}>
                <div className="av">{m.initial}</div>
                <div>
                  <b>
                    {m.name} · {m.role}
                  </b>
                  <small>{m.team}</small>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {open ? (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>라이선스·계약 등록</h2>
            <p>신규 구독 또는 계약을 등록하면 갱신 알림이 자동으로 생성됩니다.</p>
            <div className="form-grid">
              <div className="field">
                <label>제품명</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>벤더</label>
                <input
                  value={form.vendor}
                  onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                />
              </div>
              <div className="field">
                <label>카테고리</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {['AI', '디자인', '생산성', '협업', '개발'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>플랜</label>
                <input
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                />
              </div>
              <div className="field">
                <label>좌석 수</label>
                <input
                  type="number"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label>월 비용</label>
                <input
                  type="number"
                  value={form.monthlyCost}
                  onChange={(e) =>
                    setForm({ ...form, monthlyCost: Number(e.target.value) })
                  }
                />
              </div>
              <div className="field">
                <label>갱신일</label>
                <input
                  type="date"
                  value={form.renewDate}
                  onChange={(e) => setForm({ ...form, renewDate: e.target.value })}
                />
              </div>
              <div className="field">
                <label>담당자</label>
                <select
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                >
                  {members.map((m) => (
                    <option key={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn ghost" type="button" onClick={() => setOpen(false)}>
                취소
              </button>
              <button className="btn" type="button" onClick={submit}>
                등록
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
