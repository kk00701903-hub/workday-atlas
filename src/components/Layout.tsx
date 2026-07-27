import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { SideNav } from './SideNav'
import { useAtlas } from '../hooks/useAtlas'

export function Layout() {
  const { toast } = useAtlas()

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
