import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SideNav } from './SideNav'
import { useAtlas } from '../hooks/useAtlas'

export function Layout() {
  const { toast } = useAtlas()
  const location = useLocation()

  // #region debug log: router match/mismatch
  useEffect(() => {
    const DEBUG_LOG_ENDPOINT =
      'http://127.0.0.1:7656/ingest/16acb816-a479-458d-9dbc-b0c2d53810b1'
    const DEBUG_SESSION_ID = '536872'
    const DEBUG_RUN_ID = 'pre'

    fetch(DEBUG_LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': DEBUG_SESSION_ID,
      },
      body: JSON.stringify({
        sessionId: DEBUG_SESSION_ID,
        runId: DEBUG_RUN_ID,
        hypothesisId: 'H1-router-mismatch',
        location: 'Layout.tsx',
        message: 'route_matches',
        data: {
          pathname: location.pathname,
          baseUrl: (import.meta as any).env?.BASE_URL,
          rendered: true,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
  }, [location.pathname])
  // #endregion

  return (
    <div className="app-shell">
      <SideNav />
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
