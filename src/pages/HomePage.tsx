import { Link } from 'react-router-dom'
import { PageHeader } from '../components/Layout'
import { useAtlas } from '../hooks/useAtlas'
import { restaurants, weeklyWorks } from '../data/mock'

function formatKoreanDate(date: Date) {
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}`
}

export function HomePage() {
  const { claims, bucketGoals } = useAtlas()
  const today = new Date()
  const todayLabel = formatKoreanDate(today)
  const todayWorks = weeklyWorks
    .filter((w) => w.tag === '검토 요청' || w.status === '진행 중' || w.tag === '마감 임박')
    .slice(0, 2)
  const highlightGoal =
    bucketGoals.find((g) => g.status === 'active') ?? bucketGoals[0]
  const pending = claims.filter((c) => c.status === 'need_info' || c.status === 'pending').length
  const reviewCount = weeklyWorks.filter((w) => w.tag === '검토 요청').length

  return (
    <>
      <PageHeader crumb="홈 / 오늘의 업무" title="좋은 아침이에요, 김희찬프로 님">
        <button className="iconbtn" type="button" aria-label="알림">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#172033" strokeWidth="1.8">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
            <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
          </svg>
        </button>
        <Link className="btn" to="/weekly">
          새 업무
        </Link>
      </PageHeader>

      <section className="hero">
        <div>
          <h2>{todayLabel}, 오늘의 리듬</h2>
          <p>
            {reviewCount > 0
              ? `검토 요청 ${reviewCount}건을 마무리하면 이번 주 목표에 한 걸음 더 가까워져요.`
              : '오늘 마감 업무를 확인하고 리듬을 맞춰보세요.'}
          </p>
        </div>
        <div className="statline">
          <div>
            <b>
              7<span style={{ fontSize: 14 }}>/10</span>
            </b>
            <span>이번 주 완료</span>
          </div>
          <div>
            <b>{todayWorks.length}</b>
            <span>오늘 우선</span>
          </div>
          <div>
            <b>90%</b>
            <span>식대 한도 여유</span>
          </div>
        </div>
      </section>

      <div className="grid-3">
        <div className="stack">
          <section className="card">
            <div className="title">
              <h3>오늘 우선 업무</h3>
              <Link className="link" to="/weekly">
                전체 보기
              </Link>
            </div>
            {todayWorks.map((w, i) => (
              <div className="task" key={w.id}>
                <i className="dot" style={i ? { background: '#2563EB' } : undefined} />
                <div style={{ flex: 1 }}>
                  <strong>{w.title}</strong>
                  <small>
                    {w.team} · 오후 {w.due} 마감
                  </small>
                </div>
                <span className="tag">{w.tag}</span>
              </div>
            ))}
          </section>
          <section className="card">
            <div className="title">
              <h3>이번 주 진행률</h3>
              <b style={{ color: '#2563EB', fontSize: 14 }}>70%</b>
            </div>
            <div className="progress">
              <i style={{ width: '70%' }} />
            </div>
            <div className="metric">
              <div className="mini">
                <b>7건</b>
                <span>완료한 업무</span>
              </div>
              <div className="mini">
                <b>{todayWorks.length}건</b>
                <span>우선 확인</span>
              </div>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="card claim">
            <h3 style={{ margin: '0 0 7px', fontSize: 16 }}>식대 청구가 필요하신가요?</h3>
            <p style={{ fontSize: 13, color: '#6d4b36', margin: '0 0 14px' }}>
              영수증을 올리고 지역화폐 혜택까지 한 번에 적용하세요. 대기 {pending}건
            </p>
            <Link className="btn outline sm" to="/meal-claim">
              영수증으로 청구하기
            </Link>
          </section>
          <section className="card">
            <div className="title">
              <h3>최근 알림</h3>
              <Link className="link" to="/meal-status">
                모두 보기
              </Link>
            </div>
            <div className="task">
              <div className="bubble">식</div>
              <div>
                <strong>식대 청구 보완 요청</strong>
                <small>담소정 영수증의 참석자를 확인해 주세요.</small>
              </div>
            </div>
            <div className="task">
              <div className="bubble">멘</div>
              <div>
                <strong>방민식프로 님이 멘션했어요</strong>
                <small>A사 제안서 수정 · 18분 전</small>
              </div>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="card">
            <div className="title">
              <h3>오늘의 식당</h3>
              <Link className="link" to="/restaurants">
                투표하기
              </Link>
            </div>
            <p className="muted" style={{ margin: '0 0 13px' }}>
              추천 식당에 투표해 오늘 한 곳을 선정하세요
            </p>
            {restaurants
              .filter((r) => r.lunchers)
              .map((r) => (
                <div className="rest" key={r.id}>
                  <div className="bubble">맛</div>
                  <div>
                    <b>{r.name}</b>
                    <span>
                      {r.time} · {r.lunchers}명 방문 예정
                      {r.seatsLeft ? ` · 동행 ${r.seatsLeft}자리` : ''}
                    </span>
                  </div>
                </div>
              ))}
          </section>
          <section className="card">
            <div className="title">
              <h3>올해의 버킷리스트</h3>
              <Link className="link" to="/bucketlist">
                보기
              </Link>
            </div>
            {highlightGoal ? (
              <>
                <h4 style={{ margin: 0, fontSize: 14 }}>{highlightGoal.title}</h4>
                <p className="muted">{highlightGoal.description}</p>
                <div className="progress accent">
                  <i style={{ width: `${highlightGoal.progress}%` }} />
                </div>
                <b style={{ fontSize: 12, color: '#F97316' }}>{highlightGoal.progress}% 진행</b>
              </>
            ) : (
              <p className="muted">등록된 버킷리스트가 없습니다.</p>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
