import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// #region debug log (404)
const DEBUG_LOG_ENDPOINT =
  'http://127.0.0.1:7656/ingest/16acb816-a479-458d-9dbc-b0c2d53810b1'
const DEBUG_SESSION_ID = '536872'
const DEBUG_RUN_ID = 'pre'
// #endregion

// #region debug log: boot path/base
fetch(DEBUG_LOG_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Debug-Session-Id': DEBUG_SESSION_ID,
  },
  body: JSON.stringify({
    sessionId: DEBUG_SESSION_ID,
    runId: DEBUG_RUN_ID,
    hypothesisId: 'H1-H2',
    location: 'main.tsx',
    message: 'app_boot',
    data: {
      pathname: window.location.pathname,
      href: window.location.href,
      baseUrl: (import.meta as any).env?.BASE_URL,
      documentBaseURI: document.baseURI,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {})
// #endregion

// #region debug log: window error (asset/JS 404)
window.addEventListener('error', (e) => {
  const target: any = e.target
  const hint =
    target?.src || target?.href || (e as any)?.filename || (e as any)?.message

  fetch(DEBUG_LOG_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': DEBUG_SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION_ID,
      runId: DEBUG_RUN_ID,
      hypothesisId: 'H2-asset-404',
      location: 'main.tsx',
      message: 'window_error',
      data: {
        hint: hint ? String(hint) : '',
        message: e.message ? String(e.message) : '',
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {})
})
// #endregion

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
