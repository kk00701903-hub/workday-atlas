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

export default function App() {
  return (
    <AtlasProvider>
      <BrowserRouter>
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
  )
}
