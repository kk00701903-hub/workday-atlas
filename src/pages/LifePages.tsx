import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/Layout'
import { calendarEvents, formatWon, restaurants } from '../data/mock'
import { useAtlas } from '../hooks/useAtlas'
import { bucketGoals } from '../data/mock'

export function RestaurantsPage() {
  const [category, setCategory] = useState('전체')
  const cats = ['전체', '한식', '샐러드', '아시안']
  const list =
    category === '전체' ? restaurants : restaurants.filter((r) => r.category === category)

  return (
    <>
      <PageHeader crumb="오늘의 식당 / 추천" title="오늘 뭐 먹을까요?">
        <Link className="btn" to="/meal-claim">
          식대 청구로 이어가기
        </Link>
      </PageHeader>

      <section className="hero" style={{ marginBottom: 20 }}>
        <div>
          <h2>혼밥·팀밥 모두, 회사가 관리하는 식당 목록에서 고르세요</h2>
          <p>지역화폐 가능 · 평균가 · 거리 기준으로 빠르게 골라보세요.</p>
        </div>
        <div className="statline">
          <div>
            <b>38</b>
            <span>등록 식당</span>
          </div>
          <div>
            <b>18</b>
            <span>오늘 점심 등록</span>
          </div>
        </div>
      </section>

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
        {list.map((r) => (
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
            </div>
            {r.lunchers ? (
              <p className="muted" style={{ marginTop: 12 }}>
                {r.time} 방문 예정 · {r.lunchers}명
                {r.seatsLeft ? ` · 동행 ${r.seatsLeft}자리` : ''}
              </p>
            ) : null}
            <div style={{ marginTop: 14 }}>
              <Link className="btn outline sm" to="/meal-claim">
                이 식당으로 청구
              </Link>
            </div>
          </article>
        ))}
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
  return (
    <>
      <PageHeader crumb="성장 목표 / 2025" title="2025 버킷리스트">
        <button className="btn" type="button">
          목표 추가
        </button>
      </PageHeader>

      <section className="kpis">
        <article className="kpi">
          <small>팀 목표</small>
          <b>6</b>
          <span>활성 목표 3</span>
        </article>
        <article className="kpi">
          <small>개인 목표</small>
          <b>5</b>
          <span>완료율 67%</span>
        </article>
        <article className="kpi">
          <small>마일스톤</small>
          <b>8 / 12</b>
          <span>남은 기간 294일</span>
        </article>
        <article className="kpi">
          <small>올해 진행</small>
          <b>60%</b>
          <span>발표 세션 준비 중</span>
        </article>
      </section>

      <div className="grid-2">
        {bucketGoals.map((g) => (
          <article className="card" key={g.id}>
            <div className="title">
              <h3>{g.title}</h3>
              <span className={g.status === 'done' ? 'badge ok' : 'badge'}>
                {g.status === 'done' ? '완료' : g.status === 'planned' ? '예정' : '진행'}
              </span>
            </div>
            <p className="muted">{g.description}</p>
            <div className="progress accent">
              <i style={{ width: `${g.progress}%` }} />
            </div>
            <b style={{ fontSize: 12, color: '#F97316' }}>
              {g.progress}% · {g.target}
            </b>
          </article>
        ))}
      </div>
    </>
  )
}

export function OpsPage() {
  const { claims, licenses, showToast } = useAtlas()
  const [tab, setTab] = useState<'meal' | 'license' | 'budget'>('meal')

  return (
    <>
      <PageHeader crumb="SYSTEM / 운영 관리" title="운영 관리 콘솔">
        <button className="btn" type="button" onClick={() => showToast('운영 리포트를 준비했습니다')}>
          리포트 내보내기
        </button>
      </PageHeader>

      <div className="tabs">
        {(
          [
            ['meal', '식대 운영'],
            ['license', '라이선스'],
            ['budget', '예산'],
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

      {tab === 'meal' ? (
        <div className="grid-2">
          <section className="card">
            <div className="title">
              <h3>식대 승인 대기</h3>
              <Link className="link" to="/meal-ops">
                운영 화면
              </Link>
            </div>
            <b style={{ fontSize: 28 }}>
              {claims.filter((c) => c.status === 'pending' || c.status === 'need_info').length}건
            </b>
            <p className="muted">보완 요청·한도 초과 건을 우선 처리하세요.</p>
          </section>
          <section className="card">
            <div className="title">
              <h3>정책 요약</h3>
            </div>
            <div className="task">
              <i className="dot" />
              <div>
                <strong>지역화폐 할인 10%</strong>
                <small>1,000원 단위 반올림</small>
              </div>
            </div>
            <div className="task">
              <i className="dot" style={{ background: '#2563EB' }} />
              <div>
                <strong>팀 식대 월 한도</strong>
                <small>정보전략팀 1,500,000원</small>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {tab === 'license' ? (
        <section className="card">
          <div className="title">
            <h3>갱신 임박 라이선스</h3>
            <Link className="link" to="/licenses">
              라이선스 관리
            </Link>
          </div>
          {licenses
            .filter((l) => l.daysLeft <= 30)
            .map((l) => (
              <div className="task" key={l.id}>
                <div className="bubble">L</div>
                <div style={{ flex: 1 }}>
                  <strong>{l.name}</strong>
                  <small>
                    {l.renewDate} · {l.daysLeft}일 남음 · {formatWon(l.monthlyCost)}
                  </small>
                </div>
                <span className="badge warn">검토</span>
              </div>
            ))}
        </section>
      ) : null}

      {tab === 'budget' ? (
        <section className="card">
          <div className="title">
            <h3>예산 운영 바로가기</h3>
          </div>
          <div className="grid-3">
            <Link className="mini" to="/budget">
              <b>예산 현황</b>
              <span>팀별 집행률</span>
            </Link>
            <Link className="mini" to="/budget/admin">
              <b>배정 관리</b>
              <span>관리자 조정</span>
            </Link>
            <Link className="mini" to="/meal-ops">
              <b>식대 승인</b>
              <span>대기 큐 처리</span>
            </Link>
          </div>
        </section>
      ) : null}
    </>
  )
}
