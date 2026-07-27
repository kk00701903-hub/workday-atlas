import { Component, type ErrorInfo, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AtlasProvider } from './hooks/useAtlas'
import { HomePage } from './pages/HomePage'
import { MealClaimPage } from './pages/MealClaimPage'
import { MealStatusPage } from './pages/MealStatusPage'
import { MealOpsPage } from './pages/MealOpsPage'
import { LicensesPage } from './pages/LicensesPage'
import {
  LicenseCatalogPage,
  LicenseDetailPage,
  LicenseSubscriptionsPage,
} from './pages/LicenseExtraPages'
import { WeeklyPage } from './pages/WeeklyPage'
import { BudgetAdminPage, BudgetPage, BudgetViewPage } from './pages/BudgetPages'
import {
  BucketlistPage,
  CalendarPage,
  OpsPage,
  RestaurantsPage,
} from './pages/LifePages'
import './styles/global.css'

class DebugErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // #region debug log: render crash
    fetch('http://127.0.0.1:7656/ingest/16acb816-a479-458d-9dbc-b0c2d53810b1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '536872',
      },
      body: JSON.stringify({
        sessionId: '536872',
        runId: 'pre',
        hypothesisId: 'H3-render-crash',
        location: 'App.tsx',
        message: 'error_boundary_catch',
        data: {
          error: error.message,
          stack: error.stack,
          componentStack: info.componentStack,
          pathname: window.location.pathname,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'Pretendard, sans-serif' }}>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>앱 초기화 오류</h1>
          <p style={{ color: '#718096', marginBottom: 12 }}>
            런타임 에러를 수집 중입니다.
          </p>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: '#f7f8fc',
              padding: 12,
              borderRadius: 8,
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <DebugErrorBoundary>
      <AtlasProvider>
        <BrowserRouter basename={routerBasename}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="weekly" element={<WeeklyPage />} />
              <Route path="meal-claim" element={<MealClaimPage />} />
              <Route path="meal-status" element={<MealStatusPage />} />
              <Route path="meal-ops" element={<MealOpsPage />} />
              <Route path="restaurants" element={<RestaurantsPage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="budget/admin" element={<BudgetAdminPage />} />
              <Route path="budget/view" element={<BudgetViewPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="bucketlist" element={<BucketlistPage />} />
              <Route path="licenses" element={<LicensesPage />} />
              <Route path="licenses/subscriptions" element={<LicenseSubscriptionsPage />} />
              <Route path="licenses/catalog" element={<LicenseCatalogPage />} />
              <Route path="licenses/:id" element={<LicenseDetailPage />} />
              <Route path="ops" element={<OpsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AtlasProvider>
    </DebugErrorBoundary>
  )
}
