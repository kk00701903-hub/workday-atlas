import { useState } from 'react'
import { PageHeader } from '../components/Layout'
import { weeklyWorks } from '../data/mock'
import { useAtlas } from '../hooks/useAtlas'

export function WeeklyPage() {
  const { showToast } = useAtlas()
  const [filter, setFilter] = useState<'all' | 'mine'>('all')
  const list = filter === 'mine' ? weeklyWorks.filter((w) => w.owner === '김희찬프로') : weeklyWorks
  const days = [...new Set(list.map((w) => w.day))]

  return (
    <>
      <PageHeader crumb="업무 / 주간 업무" title="이번 주 업무 보드">
        <button className="btn ghost" type="button">
          3월 10일 – 3월 16일
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => showToast('새 업무 추가는 데모에서 목록에만 반영됩니다')}
        >
          + 업무 추가
        </button>
      </PageHeader>

      <div className="tabs">
        <button
          type="button"
          className={`tab${filter === 'all' ? ' on' : ''}`}
          onClick={() => setFilter('all')}
        >
          전체 업무
        </button>
        <button
          type="button"
          className={`tab${filter === 'mine' ? ' on' : ''}`}
          onClick={() => setFilter('mine')}
        >
          내 업무
        </button>
      </div>

      <div className="layout-main-side">
        <section className="card">
          <div className="title">
            <h3>주간 타임라인</h3>
            <b style={{ color: '#2563EB', fontSize: 14 }}>완료율 70%</b>
          </div>
          {days.map((day) => (
            <div key={day} style={{ marginBottom: 18 }}>
              <div className="muted" style={{ fontWeight: 800, marginBottom: 8 }}>
                {day}
              </div>
              {list
                .filter((w) => w.day === day)
                .map((w) => (
                  <div className="task" key={w.id}>
                    <i
                      className="dot"
                      style={{
                        background: w.status === '완료' ? '#059669' : '#F97316',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong>{w.title}</strong>
                      <small>
                        {w.owner} · {w.team} · 오후 {w.due} 마감
                      </small>
                    </div>
                    <span className="tag">{w.tag}</span>
                  </div>
                ))}
            </div>
          ))}
        </section>

        <div className="stack">
          <section className="card">
            <div className="title">
              <h3>주간 요약</h3>
            </div>
            <div className="metric">
              <div className="mini">
                <b>7 / 10</b>
                <span>완료</span>
              </div>
              <div className="mini">
                <b>2건</b>
                <span>마감 임박</span>
              </div>
            </div>
            <div className="progress" style={{ marginTop: 14 }}>
              <i style={{ width: '70%' }} />
            </div>
          </section>
          <section className="card claim">
            <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>도움이 필요한 업무</h3>
            <p style={{ fontSize: 13, color: '#6d4b36', margin: '0 0 12px' }}>
              신규 입사자 온보딩 자료 업데이트가 검토 대기 중입니다.
            </p>
            <button className="btn outline sm" type="button" onClick={() => showToast('리뷰어로 배정되었습니다')}>
              리뷰 참여
            </button>
          </section>
        </div>
      </div>
    </>
  )
}
