import { NavLink } from 'react-router-dom'
import { currentUser } from '../data/mock'

const groups = [
  {
    label: 'WORKSPACE',
    items: [
      { to: '/', label: '홈', icon: 'home' },
      { to: '/weekly', label: '주간 업무', icon: 'weekly' },
      { to: '/meal-claim', label: '식대 청구', icon: 'meal' },
    ],
  },
  {
    label: 'COMPANY LIFE',
    items: [
      { to: '/restaurants', label: '오늘의 식당', icon: 'food' },
      { to: '/budget', label: '팀 예산', icon: 'budget' },
      { to: '/calendar', label: '팀 캘린더', icon: 'cal' },
      { to: '/bucketlist', label: '버킷리스트', icon: 'bucket' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { to: '/licenses', label: '라이선스', icon: 'license' },
      { to: '/ops', label: '운영 요약', icon: 'ops' },
    ],
  },
]

function Icon({ name }: { name: string }) {
  switch (name) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5.5 9.5V20h13V9.5" />
          <path d="M10 20v-5h4v5" />
        </svg>
      )
    case 'weekly':
      return (
        <svg viewBox="0 0 24 24">
          <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
          <path d="M8 3v3M16 3v3M8 12l2.5 2.5L16 9" />
        </svg>
      )
    case 'meal':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M5 4.5h11.5a2 2 0 0 1 2 2V20l-2.2-1.4L14 20l-2.2-1.4L9.6 20l-2.2-1.4L5 20z" />
          <path d="M8.5 9h7M8.5 13h4.5" />
        </svg>
      )
    case 'food':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M6 3v7a2.5 2.5 0 0 0 5 0V3" />
          <path d="M8.5 10v11" />
          <path d="M17 3c-1.7 1.4-2.5 3.2-2.5 5.5S15.3 12 17 12.5V21" />
        </svg>
      )
    case 'budget':
      return (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="6" width="18" height="13" rx="3" />
          <path d="M3 10h18" />
          <path d="M16.5 14.5h1.5" />
        </svg>
      )
    case 'cal':
      return (
        <svg viewBox="0 0 24 24">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
          <path d="M3.5 10h17M8.5 3v4M15.5 3v4" />
        </svg>
      )
    case 'bucket':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M5 7h14l-1.4 12.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z" />
          <path d="M9 4.5h6" />
          <path d="M10 11.5v5M14 11.5v5" />
        </svg>
      )
    case 'license':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="8" cy="12" r="3.5" />
          <path d="M11.5 12H21l-1.5 2.5" />
          <path d="M17 12v3" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.6 1 .97 1.69.97H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
  }
}

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="side">
      <div className="brand">
        <span className="bmark">JT</span>
        <span className="btext">
          JT workday <b>atlas</b>
          <em>정보전략팀</em>
        </span>
      </div>
      <nav className="sidenav">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="navgroup">{g.label}</div>
            {g.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `navitem${isActive ? ' on' : ''}`}
                onClick={() => onNavigate?.()}
              >
                <Icon name={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="me">
        <div className="av">{currentUser.initial}</div>
        <div>
          <b>{currentUser.name}</b>
          <span>{currentUser.team}</span>
        </div>
      </div>
    </aside>
  )
}
