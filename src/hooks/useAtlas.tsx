import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  initialClaims,
  licenses as seedLicenses,
  restaurants,
  type MealClaim,
  type License,
  type ClaimStatus,
  type Restaurant,
} from '../data/mock'

export interface RestaurantVoteState {
  votes: Record<string, number>
  myVoteId: string | null
  selectedId: string | null
  voterCount: number
}

interface AtlasStore {
  claims: MealClaim[]
  licenses: License[]
  restaurantVotes: RestaurantVoteState
  recentRestaurants: Restaurant[]
  addClaim: (claim: Omit<MealClaim, 'id' | 'status'> & { status?: ClaimStatus }) => void
  updateClaimStatus: (id: string, status: ClaimStatus) => void
  addLicense: (license: Omit<License, 'id'>) => void
  voteRestaurant: (restaurantId: string) => void
  selectTodayRestaurant: (restaurantId: string | null) => void
  toast: string | null
  showToast: (msg: string) => void
}

const StoreContext = createContext<AtlasStore | null>(null)

const initialVotes: RestaurantVoteState = {
  votes: {
    r1: 4,
    r2: 2,
    r3: 3,
    r4: 1,
    r5: 2,
  },
  myVoteId: null,
  selectedId: null,
  voterCount: 12,
}

function restaurantsFromClaims(claims: MealClaim[]): Restaurant[] {
  const seen = new Set<string>()
  const result: Restaurant[] = []
  for (const claim of claims) {
    if (seen.has(claim.restaurant)) continue
    seen.add(claim.restaurant)
    const matched = restaurants.find((r) => r.name === claim.restaurant)
    if (matched) {
      result.push(matched)
    } else {
      result.push({
        id: `claim-${claim.id}`,
        name: claim.restaurant,
        category: '기타',
        avgPrice: claim.amount,
        distance: '-',
        rating: 0,
        localCurrency: claim.useLocalCurrency,
        tags: ['최근 청구'],
      })
    }
  }
  return result
}

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState(initialClaims)
  const [licenses, setLicenses] = useState(seedLicenses)
  const [restaurantVotes, setRestaurantVotes] = useState(initialVotes)
  const [toast, setToast] = useState<string | null>(null)

  const recentRestaurants = useMemo(() => {
    const fromClaims = restaurantsFromClaims(claims)
    const selected = restaurantVotes.selectedId
      ? restaurants.find((r) => r.id === restaurantVotes.selectedId)
      : null
    const merged: Restaurant[] = []
    const seen = new Set<string>()
    if (selected) {
      merged.push(selected)
      seen.add(selected.name)
    }
    for (const r of fromClaims) {
      if (seen.has(r.name)) continue
      seen.add(r.name)
      merged.push(r)
    }
    for (const r of restaurants) {
      if (merged.length >= 5) break
      if (seen.has(r.name)) continue
      seen.add(r.name)
      merged.push(r)
    }
    return merged
  }, [claims, restaurantVotes.selectedId])

  const value = useMemo<AtlasStore>(
    () => ({
      claims,
      licenses,
      restaurantVotes,
      recentRestaurants,
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
      voteRestaurant: (restaurantId) => {
        setRestaurantVotes((prev) => {
          if (prev.myVoteId === restaurantId) return prev
          const votes = { ...prev.votes }
          if (prev.myVoteId && votes[prev.myVoteId] != null) {
            votes[prev.myVoteId] = Math.max(0, (votes[prev.myVoteId] ?? 0) - 1)
          }
          votes[restaurantId] = (votes[restaurantId] ?? 0) + 1
          return {
            ...prev,
            votes,
            myVoteId: restaurantId,
            voterCount: prev.myVoteId ? prev.voterCount : prev.voterCount + 1,
          }
        })
      },
      selectTodayRestaurant: (restaurantId) => {
        setRestaurantVotes((prev) => ({
          ...prev,
          selectedId: restaurantId || null,
        }))
      },
    }),
    [claims, licenses, restaurantVotes, recentRestaurants, toast],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useAtlas() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useAtlas must be used within AtlasProvider')
  return ctx
}

export function getLeadingRestaurantId(votes: Record<string, number>) {
  let bestId: string | null = null
  let best = -1
  for (const [id, count] of Object.entries(votes)) {
    if (count > best) {
      best = count
      bestId = id
    }
  }
  return bestId
}
