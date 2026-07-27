import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  initialClaims,
  licenses as seedLicenses,
  type MealClaim,
  type License,
  type ClaimStatus,
} from '../data/mock'

interface AtlasStore {
  claims: MealClaim[]
  licenses: License[]
  addClaim: (claim: Omit<MealClaim, 'id' | 'status'> & { status?: ClaimStatus }) => void
  updateClaimStatus: (id: string, status: ClaimStatus) => void
  addLicense: (license: Omit<License, 'id'>) => void
  toast: string | null
  showToast: (msg: string) => void
}

const StoreContext = createContext<AtlasStore | null>(null)

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState(initialClaims)
  const [licenses, setLicenses] = useState(seedLicenses)
  const [toast, setToast] = useState<string | null>(null)

  const value = useMemo<AtlasStore>(
    () => ({
      claims,
      licenses,
      toast,
      showToast: (msg) => {
        setToast(msg)
        window.setTimeout(() => setToast(null), 2400)
      },
      addClaim: (claim) => {
        const next: MealClaim = {
          ...claim,
          id: `c${Date.now()}`,
          status: claim.status ?? 'pending',
        }
        setClaims((prev) => [next, ...prev])
      },
      updateClaimStatus: (id, status) => {
        setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
      },
      addLicense: (license) => {
        setLicenses((prev) => [{ ...license, id: `l${Date.now()}` }, ...prev])
      },
    }),
    [claims, licenses, toast],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useAtlas() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useAtlas must be used within AtlasProvider')
  return ctx
}
