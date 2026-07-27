import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/Layout'
import {
  bucketStatusLabel,
  calendarEvents,
  formatWon,
  restaurants,
  type BucketGoal,
  type BucketStatus,
} from '../data/mock'
import { getLeadingRestaurantId, useAtlas } from '../hooks/useAtlas'

export function RestaurantsPage() {
  const { restaurantVotes, voteRestaurant, selectTodayRestaurant, showToast } = useAtlas()
  const [category, setCategory] = useState('전체')
  const cats = ['전체', '한식', '샐러드', '아시안']

  const list = useMemo(() => {
    const base =
      category === '전체' ? restaurants : restaurants.filter((r) => r.category === category)
    return [...base].sort(
      (a, b) => (restaurantVotes.votes[b.id] ?? 0) - (restaurantVotes.votes[a.id] ?? 0),
    )
  }, [category, restaurantVotes.votes])

  const leadingId = getLeadingRestaurantId(restaurantVotes.votes)
  const selected = restaurants.find((r) => r.id === restaurantVotes.selectedId) ?? null
  const leading = restaurants.find((r) => r.id === leadingId) ?? null
  const totalVotes = Object.values(restaurantVotes.votes).reduce((s, n) => s + n, 0)

  const onVote = (id: string) => {
    voteRestaurant(id)
    showToast('투표가 반영되었습니다')
  }

  const onSelectToday = (id: string) => {
    selectTodayRestaurant(id)
    const name = restaurants.find((r) => r.id === id)?.name ?? '선정 식당'
    showToast(`오늘의 식당으로 ${name}이(가) 선정되었습니다`)
  }

  const clearSelection = () => {
    selectTodayRestaurant(null)
    showToast('선정을 해제했습니다. 다시 투표·선정할 수 있어요.')
  }

  return (
    <>
      <PageHeader crumb="오늘의 식당 / 투표" title="오늘 뭐 먹을까요?">
        {selected ? (
          <Link
            className="btn"
            to="/meal-claim"
            state={{
              restaurant: selected.name,
              amount: selected.avgPrice,
              useLocalCurrency: selected.localCurrency,
            }}
          >
            선정 식당으로 청구
          </Link>
        ) : (
          <button
            className="btn"
            type="button"
            disabled={!leading}
            onClick={() => leading && onSelectToday(leading.id)}
          >
            1등 식당 선정하기
          </button>
        )}
      </PageHeader>

      <section className="hero" style={{ marginBottom: 20 }}>
        <div>
          <h2>추천 식당에 투표하고, 오늘 한 곳을 선정하세요</h2>
          <p>
            팀원 투표로 오늘의 점심 장소를 결정합니다. 선정된 식당은 식대 청구에서 바로 불러올 수
            있어요.
          </p>
        </div>
        <div className="statline">
          <div>
            <b>{restaurantVotes.voterCount}</b>
            <span>참여 인원</span>
          </div>
          <div>
            <b>{totalVotes}</b>
            <span>총 투표 수</span>
          </div>
          <div>
            <b>{selected ? '확정' : '진행중'}</b>
            <span>선정 상태</span>
          </div>
        </div>
      </section>

      {selected ? (
        <section className="card claim" style={{ marginBottom: 20 }}>
          <div className="title">
            <h3>오늘 선정된 식당</h3>
            <span className="badge ok">확정</span>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800 }}>{selected.name}</p>
          <p className="muted" style={{ marginTop: 0 }}>
            {selected.distance} · 평균 {formatWon(selected.avgPrice)} · 득표{' '}
            {restaurantVotes.votes[selected.id] ?? 0}표
          </p>
          <div className="topright" style={{ marginTop: 12, justifyContent: 'flex-start' }}>
            <Link
              className="btn outline sm"
              to="/meal-claim"
              state={{
                restaurant: selected.name,
                amount: selected.avgPrice,
                useLocalCurrency: selected.localCurrency,
              }}
            >
              이 식당으로 식대 청구
            </Link>
            <button className="btn ghost sm" type="button" onClick={clearSelection}>
              선정 해제
            </button>
          </div>
        </section>
      ) : leading ? (
        <section className="card" style={{ marginBottom: 20 }}>
          <div className="title">
            <h3>현재 1위</h3>
            <span className="badge">{restaurantVotes.votes[leading.id] ?? 0}표</span>
          </div>
          <p style={{ margin: 0, fontWeight: 800 }}>{leading.name}</p>
          <p className="muted">투표가 끝나면 이 식당을 오늘의 장소로 확정할 수 있어요.</p>
        </section>
      ) : null}

      <div className="tabs">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            className={`tab${category === c ? ' on' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {list.map((r) => {
          const votes = restaurantVotes.votes[r.id] ?? 0
          const isMine = restaurantVotes.myVoteId === r.id
          const isSelected = restaurantVotes.selectedId === r.id
          const isLeading = leadingId === r.id
          return (
            <article className="card" key={r.id}>
              <div className="title">
                <h3>{r.name}</h3>
                <span className="badge">{r.category}</span>
              </div>
              <p className="muted" style={{ marginTop: 0 }}>
                {r.distance} · 평균 {formatWon(r.avgPrice)} · ★ {r.rating}
              </p>
              <div className="chips">
                {r.tags.map((t) => (
                  <span className={`chip${t.includes('지역') ? ' on' : ''}`} key={t}>
                    {t}
                  </span>
                ))}
                {isLeading ? <span className="chip on">1위</span> : null}
                {isSelected ? <span className="chip on">오늘 선정</span> : null}
              </div>
              <div style={{ marginTop: 14 }}>
                <div className="progress" style={{ marginBottom: 10 }}>
                  <i
                    style={{
                      width: `${totalVotes ? Math.round((votes / totalVotes) * 100) : 0}%`,
                    }}
                  />
                </div>
                <div className="title" style={{ marginBottom: 10 }}>
                  <b style={{ fontSize: 18 }}>{votes}표</b>
                  <span className="muted">
                    {totalVotes ? Math.round((votes / totalVotes) * 100) : 0}%
                  </span>
                </div>
                <div className="topright" style={{ justifyContent: 'flex-start', gap: 8 }}>
                  <button
                    className={`btn sm${isMine ? ' outline' : ''}`}
                    type="button"
                    onClick={() => onVote(r.id)}
                  >
                    {isMine ? '투표 변경' : '투표하기'}
                  </button>
                  {isMine ? <span className="badge">선택됨</span> : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

export function CalendarPage() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <>
      <PageHeader crumb="팀 운영 / 정보전략팀" title="팀 캘린더">
        <button className="btn ghost" type="button">
          2025년 5월
        </button>
        <button className="btn" type="button">
          + 일정 추가
        </button>
      </PageHeader>

      <div className="layout-main-side">
        <section className="card">
          <div className="calendar-scroll">
            <div className="calendar-grid">
              {weekdays.map((d) => (
                <div className="cal-head" key={d}>
                  {d}
                </div>
              ))}
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="cal-cell muted" key={`pad-${i}`}>
                  <div className="day">{27 + i}</div>
                </div>
              ))}
              {days.map((day) => {
                const events = calendarEvents.filter((e) => e.day === day)
                return (
                  <div className="cal-cell" key={day}>
                    <div className="day">{day}</div>
                    {events.map((e) => (
                      <div
                        className={`cal-event${e.type === 'accent' ? ' accent' : ''}`}
                        key={e.title}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="card">
          <div className="title">
            <h3>다가오는 일정</h3>
          </div>
          {[
            ['5/16', '프로젝트 준비 회의', '14:00–15:00 · 3층 회의실'],
            ['5/19', '클라이언트 회의', '10:00–11:00 · 온라인'],
            ['5/21', '정보전략팀 점심', '12:10 · 을지로 보리밥'],
          ].map(([date, title, meta]) => (
            <div className="task" key={title}>
              <div className="bubble">{date.slice(2)}</div>
              <div>
                <strong>{title}</strong>
                <small>
                  {date} · {meta}
                </small>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}

export function BucketlistPage() {
  const { bucketGoals, saveBucketGoals, showToast } = useAtlas()
  const [drafts, setDrafts] = useState<BucketGoal[]>(() =>
    bucketGoals.map((g) => ({ ...g })),
  )

  useEffect(() => {
    setDrafts(bucketGoals.map((g) => ({ ...g })))
  }, [bucketGoals])

  const dirty = useMemo(
    () =>
      drafts.some((d) => {
        const saved = bucketGoals.find((g) => g.id === d.id)
        return !saved || saved.status !== d.status || saved.progress !== d.progress
      }),
    [drafts, bucketGoals],
  )

  const stats = useMemo(() => {
    const active = drafts.filter((g) => g.status === 'active').length
    const done = drafts.filter((g) => g.status === 'done').length
    const avg =
      drafts.length === 0
        ? 0
        : Math.round(drafts.reduce((sum, g) => sum + g.progress, 0) / drafts.length)
    const focus = drafts.find((g) => g.status === 'active') ?? drafts[0]
    return { active, done, avg, focus }
  }, [drafts])

  const updateDraft = (id: string, patch: Partial<Pick<BucketGoal, 'status' | 'progress'>>) => {
    setDrafts((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g
        const next = { ...g, ...patch }
        if (patch.status === 'done' && patch.progress == null) next.progress = 100
        if (patch.progress != null) {
          next.progress = Math.min(100, Math.max(0, Math.round(patch.progress)))
        }
        return next
      }),
    )
  }

  const handleSave = () => {
    saveBucketGoals(drafts.map((g) => ({ ...g })))
    showToast('버킷리스트 상태가 저장되었습니다')
  }

  const handleReset = () => {
    setDrafts(bucketGoals.map((g) => ({ ...g })))
    showToast('변경 사항을 되돌렸습니다')
  }

  return (
    <>
      <PageHeader crumb="성장 목표 / 2025" title="2025 버킷리스트">
        <button className="btn outline" type="button" disabled={!dirty} onClick={handleReset}>
          되돌리기
        </button>
        <button className="btn" type="button" disabled={!dirty} onClick={handleSave}>
          저장
        </button>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>전체 목표</small>
          <b>{drafts.length}</b>
          <span>활성 {stats.active} · 완료 {stats.done}</span>
        </article>
        <article className="kpi">
          <small>완료율</small>
          <b>
            {drafts.length === 0 ? 0 : Math.round((stats.done / drafts.length) * 100)}%
          </b>
          <span>
            {stats.done}/{drafts.length} 완료
          </span>
        </article>
        <article className="kpi">
          <small>평균 진행</small>
          <b>{stats.avg}%</b>
          <span>상태 변경 후 저장하세요</span>
        </article>
        <article className="kpi">
          <small>포커스</small>
          <b style={{ fontSize: 18 }}>{stats.focus?.title ?? '-'}</b>
          <span>{stats.focus ? `${stats.focus.progress}% 진행` : '목표 없음'}</span>
        </article>
      </section>

      <div className="grid-2">
        {drafts.map((g) => (
          <article className="card" key={g.id}>
            <div className="title">
              <h3>{g.title}</h3>
              <span className={g.status === 'done' ? 'badge ok' : 'badge'}>
                {bucketStatusLabel[g.status]}
              </span>
            </div>
            <p className="muted">{g.description}</p>
            <div className="progress accent">
              <i style={{ width: `${g.progress}%` }} />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginTop: 14,
              }}
            >
              <div className="field">
                <label htmlFor={`bucket-status-${g.id}`}>상태</label>
                <select
                  id={`bucket-status-${g.id}`}
                  value={g.status}
                  onChange={(e) =>
                    updateDraft(g.id, { status: e.target.value as BucketStatus })
                  }
                >
                  {(Object.keys(bucketStatusLabel) as BucketStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {bucketStatusLabel[key]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor={`bucket-progress-${g.id}`}>진행률 (%)</label>
                <input
                  id={`bucket-progress-${g.id}`}
                  type="number"
                  min={0}
                  max={100}
                  value={g.progress}
                  onChange={(e) =>
                    updateDraft(g.id, { progress: Number(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <b style={{ display: 'block', marginTop: 10, fontSize: 12, color: '#F97316' }}>
              {g.progress}% · {g.target}
            </b>
          </article>
        ))}
      </div>
    </>
  )
}

export function OpsPage() {
  const { claims, licenses, restaurantVotes, showToast } = useAtlas()
  const pendingClaims = claims.filter(
    (c) => c.status === 'pending' || c.status === 'need_info',
  ).length
  const renewSoon = licenses.filter((l) => l.daysLeft <= 30).length
  const todaySelected = restaurants.find((r) => r.id === restaurantVotes.selectedId)

  return (
    <>
      <PageHeader crumb="SYSTEM / 운영 요약" title="운영 요약">
        <button className="btn" type="button" onClick={() => showToast('운영 리포트를 준비했습니다')}>
          리포트 내보내기
        </button>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>식대 승인 대기</small>
          <b>{pendingClaims}건</b>
          <span>우선 처리 필요</span>
        </article>
        <article className="kpi">
          <small>30일 이내 갱신</small>
          <b>{renewSoon}건</b>
          <span className="warn">라이선스 검토</span>
        </article>
        <article className="kpi">
          <small>오늘 식당</small>
          <b>{todaySelected ? '확정' : '미정'}</b>
          <span>{todaySelected?.name ?? '투표 진행 중'}</span>
        </article>
        <article className="kpi">
          <small>활성 라이선스</small>
          <b>{licenses.length}개</b>
          <span>관리 대상</span>
        </article>
      </section>

      <div className="grid-3">
        <Link className="card" to="/meal-ops">
          <div className="title">
            <h3>식대 운영</h3>
            <span className="link">바로가기</span>
          </div>
          <p className="muted">승인 대기 {pendingClaims}건을 처리합니다.</p>
        </Link>
        <Link className="card" to="/licenses">
          <div className="title">
            <h3>라이선스</h3>
            <span className="link">바로가기</span>
          </div>
          <p className="muted">갱신 임박 {renewSoon}건을 확인합니다.</p>
        </Link>
        <Link className="card" to="/budget">
          <div className="title">
            <h3>팀 예산</h3>
            <span className="link">바로가기</span>
          </div>
          <p className="muted">팀별 집행률과 한도를 확인합니다.</p>
        </Link>
      </div>
    </>
  )
}
