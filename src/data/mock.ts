export type ClaimStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'need_info'
export type LicenseStatus = 'normal' | 'renewal' | 'review' | 'seat_short'

export interface Member {
  id: string
  name: string
  team: string
  role: string
  initial: string
}

export interface MealClaim {
  id: string
  restaurant: string
  amount: number
  claimAmount: number
  discount: number
  date: string
  claimant: string
  team: string
  attendees: string[]
  reason: string
  linkedWork: string
  useLocalCurrency: boolean
  status: ClaimStatus
}

export interface License {
  id: string
  name: string
  vendor: string
  category: string
  plan: string
  seats: number
  active: number
  monthlyCost: number
  renewDate: string
  daysLeft: number
  owner: string
  status: LicenseStatus
  description: string
}

export interface BudgetItem {
  id: string
  team: string
  category: string
  allocated: number
  used: number
  pending: number
  remaining: number
  rate: number
  status: 'normal' | 'over' | 'warn'
}

export interface WorkItem {
  id: string
  title: string
  owner: string
  team: string
  due: string
  day: string
  status: string
  tag: string
}

export interface Restaurant {
  id: string
  name: string
  category: string
  avgPrice: number
  distance: string
  rating: number
  localCurrency: boolean
  tags: string[]
  lunchers?: number
  time?: string
  seatsLeft?: number
}

export type BucketStatus = 'active' | 'done' | 'planned'

export interface BucketGoal {
  id: string
  title: string
  description: string
  progress: number
  target: string
  status: BucketStatus
}

export const bucketStatusLabel: Record<BucketStatus, string> = {
  planned: '예정',
  active: '진행',
  done: '완료',
}

export const currentUser: Member = {
  id: 'u1',
  name: '김희찬프로',
  team: '정보전략팀',
  role: '프로',
  initial: '김',
}

export const members: Member[] = [
  currentUser,
  { id: 'u2', name: '방민식프로', team: '정보전략팀', role: '프로', initial: '방' },
  { id: 'u3', name: '한성민프로', team: '정보전략팀', role: '프로', initial: '한' },
  { id: 'u4', name: '오준열프로', team: '정보전략팀', role: '프로', initial: '오' },
  { id: 'u5', name: '송민준프로', team: '정보전략팀', role: '팀장', initial: '송' },
  { id: 'u6', name: '박서연프로', team: '디자인팀', role: '프로', initial: '박' },
]

export const initialClaims: MealClaim[] = [
  {
    id: 'c1',
    restaurant: '성수국밥',
    amount: 99000,
    claimAmount: 90000,
    discount: 9900,
    date: '2025-05-16',
    claimant: '김희찬프로',
    team: '정보전략팀',
    attendees: ['김희찬프로', '방민식프로', '한성민프로', '오준열프로', '송민준프로', '박서연프로'],
    reason: '팀 점심 식사',
    linkedWork: '봄 프로모션 킥오프 회의',
    useLocalCurrency: true,
    status: 'pending',
  },
  {
    id: 'c2',
    restaurant: '을지로 보리밥',
    amount: 13000,
    claimAmount: 11700,
    discount: 1300,
    date: '2025-05-16',
    claimant: '한성민프로',
    team: '정보전략팀',
    attendees: ['한성민프로'],
    reason: '개인 식대',
    linkedWork: '',
    useLocalCurrency: true,
    status: 'approved',
  },
  {
    id: 'c3',
    restaurant: '샐러디 성수점',
    amount: 11000,
    claimAmount: 9900,
    discount: 1100,
    date: '2025-05-14',
    claimant: '김희찬프로',
    team: '정보전략팀',
    attendees: ['김희찬프로'],
    reason: '개인 식대',
    linkedWork: '',
    useLocalCurrency: true,
    status: 'approved',
  },
  {
    id: 'c4',
    restaurant: '담소정',
    amount: 48000,
    claimAmount: 48000,
    discount: 0,
    date: '2025-05-16',
    claimant: '방민식프로',
    team: '정보전략팀',
    attendees: ['방민식프로', '송민준프로', '오준열프로'],
    reason: '팀 회식',
    linkedWork: '주간 회고',
    useLocalCurrency: false,
    status: 'need_info',
  },
]

export const licenses: License[] = [
  {
    id: 'l1',
    name: 'Claude Team',
    vendor: 'Anthropic',
    category: 'AI',
    plan: 'Team',
    seats: 25,
    active: 21,
    monthlyCost: 1920000,
    renewDate: '2025-06-28',
    daysLeft: 18,
    owner: '한성민프로',
    status: 'renewal',
    description: 'AI · Anthropic · 연간 계약',
  },
  {
    id: 'l2',
    name: 'Figma Organization',
    vendor: 'Figma',
    category: '디자인',
    plan: 'Organization',
    seats: 40,
    active: 37,
    monthlyCost: 1480000,
    renewDate: '2025-07-03',
    daysLeft: 23,
    owner: '방민식프로',
    status: 'seat_short',
    description: '디자인 · Figma',
  },
  {
    id: 'l3',
    name: 'Notion Plus',
    vendor: 'Notion',
    category: '생산성',
    plan: 'Plus',
    seats: 55,
    active: 48,
    monthlyCost: 820000,
    renewDate: '2025-07-15',
    daysLeft: 35,
    owner: '오준열프로',
    status: 'review',
    description: '생산성 · Notion',
  },
  {
    id: 'l4',
    name: 'Notion AI',
    vendor: 'Notion',
    category: '생산성',
    plan: 'AI Add-on',
    seats: 36,
    active: 34,
    monthlyCost: 720000,
    renewDate: '2025-05-23',
    daysLeft: 7,
    owner: '송민준프로',
    status: 'renewal',
    description: '팀 위키·문서 자동화',
  },
  {
    id: 'l5',
    name: 'Figma Professional',
    vendor: 'Figma',
    category: '디자인',
    plan: 'Professional',
    seats: 20,
    active: 18,
    monthlyCost: 480000,
    renewDate: '2025-06-09',
    daysLeft: 24,
    owner: '김희찬프로',
    status: 'normal',
    description: '제품 디자인 협업',
  },
  {
    id: 'l6',
    name: 'Slack Business+',
    vendor: 'Slack',
    category: '협업',
    plan: 'Business+',
    seats: 75,
    active: 72,
    monthlyCost: 1280000,
    renewDate: '2025-07-01',
    daysLeft: 46,
    owner: '방민식프로',
    status: 'normal',
    description: '사내 커뮤니케이션',
  },
  {
    id: 'l7',
    name: 'GitHub Team',
    vendor: 'GitHub',
    category: '개발',
    plan: 'Team',
    seats: 30,
    active: 26,
    monthlyCost: 360000,
    renewDate: '2025-06-03',
    daysLeft: 18,
    owner: '송민준프로',
    status: 'review',
    description: '소스 코드 협업',
  },
  {
    id: 'l8',
    name: 'Miro',
    vendor: 'Miro',
    category: '협업',
    plan: 'Business',
    seats: 20,
    active: 9,
    monthlyCost: 360000,
    renewDate: '2025-08-20',
    daysLeft: 71,
    owner: '박서연프로',
    status: 'normal',
    description: '협업 · Miro',
  },
]

export const budgets: BudgetItem[] = [
  {
    id: 'b1',
    team: '정보전략팀',
    category: '식대',
    allocated: 1500000,
    used: 1020000,
    pending: 180000,
    remaining: 300000,
    rate: 80,
    status: 'normal',
  },
  {
    id: 'b2',
    team: '디자인팀',
    category: '식대',
    allocated: 900000,
    used: 612000,
    pending: 72000,
    remaining: 216000,
    rate: 76,
    status: 'normal',
  },
  {
    id: 'b3',
    team: '정보전략팀',
    category: '회의비',
    allocated: 700000,
    used: 682000,
    pending: 48000,
    remaining: -30000,
    rate: 104,
    status: 'over',
  },
  {
    id: 'b4',
    team: '마케팅팀',
    category: '식대',
    allocated: 1000000,
    used: 882000,
    pending: 138000,
    remaining: -20000,
    rate: 102,
    status: 'warn',
  },
]

export const weeklyWorks: WorkItem[] = [
  {
    id: 'w1',
    title: '주간 업무 킥오프',
    owner: '김희찬프로',
    team: '정보전략팀',
    due: '10:00',
    day: '월 10',
    status: '완료',
    tag: '완료',
  },
  {
    id: 'w2',
    title: '랜딩 카피 A/B 테스트 설계',
    owner: '김희찬프로',
    team: '정보전략팀',
    due: '15:00',
    day: '화 11',
    status: '진행 중',
    tag: '진행 중',
  },
  {
    id: 'w3',
    title: '신규 입사자 온보딩 자료 업데이트',
    owner: '오준열프로',
    team: '정보전략팀',
    due: '17:00',
    day: '화 11',
    status: '검토',
    tag: '검토',
  },
  {
    id: 'w4',
    title: '봄 프로모션 랜딩 페이지 검토',
    owner: '김희찬프로',
    team: '정보전략팀',
    due: '16:00',
    day: '수 12',
    status: '검토 요청',
    tag: '검토 요청',
  },
  {
    id: 'w5',
    title: '킥오프 회의 후속 액션 정리',
    owner: '한성민프로',
    team: '정보전략팀',
    due: '18:00',
    day: '수 12',
    status: '진행 중',
    tag: '진행 중',
  },
  {
    id: 'w6',
    title: '3월 식대 정산 리스트',
    owner: '한성민프로',
    team: '정보전략팀',
    due: '17:00',
    day: '목 13',
    status: '진행 중',
    tag: '진행 중',
  },
  {
    id: 'w7',
    title: 'A사 제안서 수정',
    owner: '방민식프로',
    team: '정보전략팀',
    due: '14:00',
    day: '금 14',
    status: '진행 중',
    tag: '진행 중',
  },
  {
    id: 'w8',
    title: '캠페인 성과 리포트 초안',
    owner: '김희찬프로',
    team: '정보전략팀',
    due: '18:00',
    day: '금 14',
    status: '진행 중',
    tag: '진행 중',
  },
]

export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: '을지로 보리밥',
    category: '한식',
    avgPrice: 11500,
    distance: '도보 6분',
    rating: 4.7,
    localCurrency: true,
    tags: ['지역화폐', '점심 추천'],
    lunchers: 5,
    time: '12:20',
    seatsLeft: 2,
  },
  {
    id: 'r2',
    name: '샐러디 성수점',
    category: '샐러드',
    avgPrice: 10000,
    distance: '도보 3분',
    rating: 4.5,
    localCurrency: true,
    tags: ['혼밥', '지역화폐'],
    lunchers: 1,
    time: '12:10',
    seatsLeft: 1,
  },
  {
    id: 'r3',
    name: '성수국밥',
    category: '한식',
    avgPrice: 13000,
    distance: '도보 8분',
    rating: 4.6,
    localCurrency: true,
    tags: ['팀 식사', '지역화폐'],
    lunchers: 0,
    time: '',
  },
  {
    id: 'r4',
    name: '담소정',
    category: '한식',
    avgPrice: 16000,
    distance: '도보 10분',
    rating: 4.4,
    localCurrency: false,
    tags: ['회식'],
  },
  {
    id: 'r5',
    name: '포케하우스',
    category: '아시안',
    avgPrice: 13500,
    distance: '도보 5분',
    rating: 4.3,
    localCurrency: true,
    tags: ['점심', '지역화폐'],
  },
]

export const bucketGoals: BucketGoal[] = [
  {
    id: 'g1',
    title: '발표 세션 1회 진행하기',
    description: '사내 지식 공유 시간을 열고 자동화 사례를 발표해요.',
    progress: 60,
    target: '6월 목표',
    status: 'active',
  },
  {
    id: 'g2',
    title: '동료와 점심 미팅 월 2회',
    description: '다른 팀 동료와 교류하며 협업 포인트를 찾아가요.',
    progress: 67,
    target: '연간 목표',
    status: 'active',
  },
  {
    id: 'g3',
    title: '자동화 템플릿 3개 만들기',
    description: '반복되는 운영 업무를 줄일 수 있는 템플릿을 완성해요.',
    progress: 100,
    target: '완료',
    status: 'done',
  },
  {
    id: 'g4',
    title: '오피스 리트리트 다녀오기',
    description: '새로운 환경에서 한 주를 보내며 리듬을 바꿔보세요.',
    progress: 10,
    target: 'Q4',
    status: 'planned',
  },
]

export const calendarEvents = [
  { day: 1, title: '근로자의 날', type: 'accent' as const },
  { day: 5, title: '어린이날', type: 'accent' as const },
  { day: 7, title: '주간 킥오프', type: 'normal' as const },
  { day: 9, title: 'Q2 OKR 중간 점검', type: 'normal' as const },
  { day: 12, title: '정보전략팀 회식', type: 'accent' as const },
  { day: 14, title: '예산 검토', type: 'normal' as const },
  { day: 16, title: '프로젝트 준비 회의', type: 'normal' as const },
  { day: 19, title: '클라이언트 회의', type: 'normal' as const },
  { day: 21, title: '팀 점심', type: 'accent' as const },
  { day: 27, title: '월간 성과 리뷰', type: 'normal' as const },
]

export function formatWon(n: number) {
  return `${n.toLocaleString('ko-KR')}원`
}

export function calcClaimAmount(amount: number, useLocalCurrency: boolean) {
  const discount = useLocalCurrency ? Math.round(amount * 0.1) : 0
  const calculated = amount - discount
  const rounded = Math.ceil(calculated / 1000) * 1000
  const roundingAdj = rounded - calculated
  return { discount, calculated, roundingAdj, finalAmount: rounded }
}

export const statusLabel: Record<ClaimStatus, string> = {
  draft: '작성 중',
  pending: '승인 대기',
  approved: '승인 완료',
  rejected: '반려',
  need_info: '보완 요청',
}

export const licenseStatusLabel: Record<LicenseStatus, string> = {
  normal: '정상',
  renewal: '갱신 검토',
  review: '비용 검토',
  seat_short: '좌석 부족',
}
