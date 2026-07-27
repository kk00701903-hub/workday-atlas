import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SideNav } from './SideNav'
import { useAtlas } from '../hooks/useAtlas'

export function Layout() {
  const { toast } = useAtlas()
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  return (
    <div className={`app-shell${navOpen ? ' nav-open' : ''}`}>
      <button
        type="button"
        className="nav-toggle"
        aria-label={navOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={navOpen}
        onClick={() => setNavOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {navOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </>
          )}
        </svg>
      </button>
      {navOpen ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="메뉴 닫기"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
      <SideNav onNavigate={() => setNavOpen(false)} />
      <main className="page">
        <Outlet />
      </main>
      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  )
}

export function PageHeader({
  crumb,
  title,
  children,
}: {
  crumb: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className="top">
      <div>
        <div className="crumb">{crumb}</div>
        <h1>{title}</h1>
      </div>
      {children ? <div className="topright">{children}</div> : null}
    </header>
  )
}
