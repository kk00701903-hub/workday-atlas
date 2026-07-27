import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Tesseract from 'tesseract.js'
import { PageHeader } from '../components/Layout'
import { useAtlas } from '../hooks/useAtlas'
import {
  calcClaimAmount,
  currentUser,
  formatWon,
  members,
  restaurants,
} from '../data/mock'

export function MealClaimPage() {
  const { addClaim, showToast } = useAtlas()
  const location = useLocation()
  const preset = location.state as
    | { restaurant?: string; amount?: number; useLocalCurrency?: boolean }
    | undefined
  const [entryMode, setEntryMode] = useState<'manual' | 'ocr'>(
    preset?.restaurant || preset?.amount ? 'manual' : 'ocr',
  )
  const [restaurant, setRestaurant] = useState(restaurants[2].name)
  const [amount, setAmount] = useState(99000)
  const [reason, setReason] = useState('팀 점심 식사')
  const [linkedWork, setLinkedWork] = useState('봄 프로모션 킥오프 회의')
  const [useLocalCurrency, setUseLocalCurrency] = useState(true)
  const [receiptFileName, setReceiptFileName] = useState('')
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrPreviewText, setOcrPreviewText] = useState('')
  const [selected, setSelected] = useState<string[]>([
    '김희찬프로',
    '방민식프로',
    '한성민프로',
    '오준열프로',
  ])
  const claimMembers = members.filter((m) => m.name !== '박서연프로')

  useEffect(() => {
    if (!preset) return
    if (preset.restaurant) setRestaurant(preset.restaurant)
    if (preset.amount) setAmount(preset.amount)
    if (typeof preset.useLocalCurrency === 'boolean') {
      setUseLocalCurrency(preset.useLocalCurrency)
    }
  }, [preset])

  const calc = useMemo(
    () => calcClaimAmount(amount || 0, useLocalCurrency),
    [amount, useLocalCurrency],
  )

  const toggleMember = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    )
  }

  const normalizeForSearch = (s: string) =>
    s.replace(/[\s·,._\-()]/g, '').toLowerCase()

  const extractWonAmount = (text: string): number | null => {
    const matches = Array.from(
      text.matchAll(/(\d{1,3}(?:,\d{3})*|\d+)\s*원/g),
    )
    if (!matches.length) return null

    // 영수증 총액이 보통 마지막으로 등장하므로 마지막 매치를 우선 사용합니다.
    const last = matches[matches.length - 1]?.[1]
    if (!last) return null
    const value = Number(last.replace(/,/g, ''))
    return Number.isFinite(value) && value > 0 ? value : null
  }

  const findRestaurantFromText = (text: string) => {
    const normText = normalizeForSearch(text)
    return restaurants.find((r) =>
      normText.includes(normalizeForSearch(r.name)),
    )
  }

  const runOcr = async (file: File) => {
    setOcrLoading(true)
    setOcrPreviewText('')
    try {
      const result = await Tesseract.recognize(file, 'kor+eng')
      const ocrText = result?.data?.text ?? ''
      setOcrPreviewText(ocrText.slice(0, 800))

      const foundRestaurant = findRestaurantFromText(ocrText)
      const extractedAmount = extractWonAmount(ocrText)

      const notes: string[] = []
      if (foundRestaurant) {
        setRestaurant(foundRestaurant.name)
        setUseLocalCurrency(foundRestaurant.localCurrency)
      } else {
        notes.push('식당명을 찾지 못했습니다. 식당명은 직접 선택해 주세요.')
      }

      if (extractedAmount) {
        setAmount(extractedAmount)
      } else {
        setAmount(0)
        notes.push('금액을 찾지 못했습니다. 금액은 직접 입력해 주세요.')
      }

      showToast(notes.length ? `OCR 인식 완료. ${notes.join(' ')}` : '영수증 OCR 인식이 완료되었습니다')
    } catch {
      setAmount(0)
      showToast('OCR 인식에 실패했습니다. 다른 사진으로 다시 시도해 주세요.')
    } finally {
      setOcrLoading(false)
    }
  }

  const onReceiptSelected = (file: File | null) => {
    if (!file) return
    setReceiptFileName(file.name)
    void runOcr(file)
  }

  const submit = () => {
    if (!restaurant || !amount) {
      showToast('식당명과 금액을 입력해 주세요')
      return
    }
    addClaim({
      restaurant,
      amount,
      claimAmount: calc.finalAmount,
      discount: calc.discount,
      date: new Date().toISOString().slice(0, 10),
      claimant: currentUser.name,
      team: currentUser.team,
      attendees: selected.length ? selected : [currentUser.name],
      reason,
      linkedWork,
      useLocalCurrency,
      status: 'pending',
    })
    showToast('식대 청구가 제출되었습니다')
  }

  return (
    <>
      <PageHeader crumb="식대 · 영수증으로 청구하기" title="식대 청구 등록" />

      <div className="layout-claim">
        <div className="stack">
          <article className="card">
            <div className="title">
              <h3>1. 제출 방식 선택</h3>
            </div>
            <p className="muted">오늘의 식당 정보로 바로 입력하거나, 영수증 사진 OCR로 인식할 수 있어요.</p>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <button
                type="button"
                className={`tab${entryMode === 'manual' ? ' on' : ''}`}
                onClick={() => setEntryMode('manual')}
              >
                직접 입력
              </button>
              <button
                type="button"
                className={`tab${entryMode === 'ocr' ? ' on' : ''}`}
                onClick={() => setEntryMode('ocr')}
              >
                영수증 OCR
              </button>
            </div>
          </article>

          <article className="card">
            <div className="title">
              <h3>2. 식사 정보</h3>
            </div>
            <p className="muted">
              {entryMode === 'manual'
                ? '오늘의 식당 정보나 평균 금액을 기준으로 바로 입력하세요.'
                : '영수증 사진을 올리면 식당명과 금액을 자동으로 채웁니다.'}
            </p>
            {entryMode === 'ocr' ? (
              <div className="stack-sm" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>영수증 사진 업로드</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onReceiptSelected(e.target.files?.[0] ?? null)}
                  />
                </div>
                <div className="muted">
                  {ocrLoading
                    ? 'OCR 인식 중...'
                    : receiptFileName
                      ? `${receiptFileName} 파일을 기준으로 OCR 인식값을 적용했어요.`
                      : '예: 성수국밥.jpg, 을지로 보리밥.png 처럼 식당명이 포함되면 더 정확히 채워집니다.'}
                  {!ocrLoading && ocrPreviewText ? (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 11,
                        color: '#718096',
                        wordBreak: 'break-word',
                      }}
                    >
                      인식 텍스트 미리보기: {ocrPreviewText.slice(0, 120)}
                      {ocrPreviewText.length > 120 ? '...' : ''}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            <div className="form-grid" style={{ marginTop: 12 }}>
              <div className="field">
                <label>식당명</label>
                <select value={restaurant} onChange={(e) => setRestaurant(e.target.value)}>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{entryMode === 'ocr' ? 'OCR 인식 금액' : '직접 입력 금액'}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label>청구자</label>
                <b>
                  {currentUser.name} · {currentUser.team}
                </b>
              </div>
              <div className="field">
                <label>청구 사유</label>
                <input value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
            </div>
          </article>

          <article className="card">
            <div className="title">
              <h3>3. 참석자</h3>
            </div>
            <p className="muted">
              참석자 {selected.length || 1}명 · 균등 분할 기준
            </p>
            <div className="chips">
              {claimMembers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`chip selectable${selected.includes(m.name) ? ' on' : ''}`}
                  onClick={() => toggleMember(m.name)}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </article>

          <article className="card">
            <div className="title">
              <h3>4. 할인 정책 적용</h3>
            </div>
            <div
              className={`check${useLocalCurrency ? '' : ' off'}`}
              onClick={() => setUseLocalCurrency((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setUseLocalCurrency((v) => !v)
              }}
            >
              <div className="box">✓</div>
              <div>
                <b>지역화폐 사용</b>
                <small>성남사랑상품권 식대 정산 할인 · 할인율 10%</small>
              </div>
            </div>
            <div className="field" style={{ marginTop: 13 }}>
              <label>연결 업무</label>
              <input value={linkedWork} onChange={(e) => setLinkedWork(e.target.value)} />
            </div>
          </article>
        </div>

        <aside className="calc">
          <h2>청구 금액 미리보기</h2>
          <p>정산 정책과 계산 근거를 제출 전에 확인하세요.</p>
          <div className="policy">
            {useLocalCurrency ? '지역화폐 10% · ' : ''}1,000원 단위 반올림
          </div>
          <div className="line">
            <span>영수증 금액</span>
            <b>{formatWon(amount || 0)}</b>
          </div>
          <div className="line">
            <span>지역화폐 할인 (10%)</span>
            <b>- {formatWon(calc.discount)}</b>
          </div>
          <div className="line">
            <span>계산 금액</span>
            <b>{formatWon(calc.calculated)}</b>
          </div>
          <div className="line">
            <span>정산 단위 적용</span>
            <b>+ {formatWon(calc.roundingAdj)}</b>
          </div>
          <div className="total">
            <small>{currentUser.name} 님의 최종 청구 금액</small>
            <strong>{formatWon(calc.finalAmount)}</strong>
          </div>
          <div className="note">
            할인율과 반올림 규칙은 제출 시점의 회사 정책으로 기록됩니다. 승인 후 지급 예정일을
            안내해 드려요.
          </div>
          <button className="btn" style={{ width: '100%' }} type="button" onClick={submit}>
            청구 제출하기
          </button>
        </aside>
      </div>
    </>
  )
}
