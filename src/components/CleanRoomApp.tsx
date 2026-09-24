import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'


// Safely parses a fetch Response as JSON. If the server returned something
// that isn't valid JSON (an HTML error page, an empty body, a proxy/404
// page when the backend isn't reachable, etc.), this throws a readable
// error instead of letting `JSON.parse` crash with
// "unexpected character at line 1 column 1".
async function parseJsonResponse(res: Response) {
  const text = await res.text()
  const looksHtml = /<!DOCTYPE|<html[\s>]|Bad Gateway|502 Bad Gateway/i.test(text)
  try {
    if (looksHtml) throw new Error('html')
    return text ? JSON.parse(text) : {}
  } catch {
    if (looksHtml || res.status === 502 || res.status === 503 || res.status === 504) {
      console.error('[cleanroom] HTTP', res.status, res.url, 'HTML/error page body suppressed')
      throw new Error(
        res.status === 502 || res.status === 503 || res.status === 504
          ? 'Unable to connect to CleanRoom. The server is temporarily unavailable. Please try again in a moment.'
          : `CleanRoom server returned an error (${res.status}). Please try again.`
      )
    }
    console.error('[cleanroom] HTTP', res.status, res.url, 'non-JSON body')
    throw new Error(
      res.ok
        ? 'CleanRoom returned an unexpected response.'
        : `Request failed (${res.status}${res.statusText ? ' ' + res.statusText : ''}).`.trim()
    )
  }
}


function GeminiPie({ labels, values }: { labels: string[]; values: number[] }) {
  const total = values.reduce((a, b) => a + b, 0) || 1
  let acc = 0
  const colors = ['#f06a1d', '#f5a623', '#3dd6c6', '#818cf8', '#f472b6', '#34d399', '#a78bfa', '#fb7185']
  const parts = values.map((v, i) => {
    const start = acc / total
    acc += v
    const end = acc / total
    const a0 = start * Math.PI * 2 - Math.PI / 2
    const a1 = end * Math.PI * 2 - Math.PI / 2
    const x0 = 50 + 40 * Math.cos(a0), y0 = 50 + 40 * Math.sin(a0)
    const x1 = 50 + 40 * Math.cos(a1), y1 = 50 + 40 * Math.sin(a1)
    const large = end - start > 0.5 ? 1 : 0
    const d = `M50,50 L${x0},${y0} A40,40 0 ${large} 1 ${x1},${y1} Z`
    return <path key={i} d={d} fill={colors[i % colors.length]} opacity={0.9} />
  })
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <svg viewBox="0 0 100 100" width={120} height={120}>{parts}</svg>
      <div style={{ fontSize: '0.72rem', color: 'var(--ink-2)', maxHeight: 120, overflowY: 'auto' }}>
        {labels.slice(0, 8).map((lb, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[i % colors.length], display: 'inline-block' }} />
            <span>{lb}: {values[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GeminiBars({ labels, values, kind }: { labels: string[]; values: number[]; kind?: string }) {
  const max = Math.max(...values, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, paddingTop: 8 }}>
      {values.slice(0, 16).map((v, i) => (
        <div key={i} title={`${labels[i]}: ${v}`} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
          <span style={{ fontSize: 9, color: 'var(--accent)', marginBottom: 2 }}>{v}</span>
          <div style={{ width: '100%', maxWidth: 28, height: `${Math.max(4, (v / max) * 90)}%`, background: kind === 'line' ? 'rgba(240,106,29,0.5)' : 'linear-gradient(180deg,#f06a1d,#ff8a3d)', borderRadius: '4px 4px 0 0' }} />
          <span style={{ fontSize: 8, color: 'var(--ink-3)', marginTop: 2, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function GeminiScatter({ points, x, y }: { points: { x: number; y: number }[]; x?: string; y?: string }) {
  const xs = points.map(p => p.x), ys = points.map(p => p.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys)
  const sx = (v: number) => 10 + ((v - minX) / ((maxX - minX) || 1)) * 180
  const sy = (v: number) => 110 - ((v - minY) / ((maxY - minY) || 1)) * 100
  return (
    <svg viewBox="0 0 200 120" width="100%" height={120} style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
      {points.slice(0, 300).map((p, i) => (
        <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={2.5} fill="#f06a1d" opacity={0.75} />
      ))}
      <text x={100} y={118} textAnchor="middle" fill="#a1a1aa" fontSize={8}>{x} vs {y}</text>
    </svg>
  )
}


type ResultTab = 'preview' | 'raw' | 'profile' | 'eda' | 'graphs'

const TASK_OPTIONS: Record<string, string[]> = {
  'Supervised Learning': [
    'Binary Classification',
    'Multi-Class Classification',
    'Multi-Label Classification',
    'Linear Regression',
    'Polynomial Regression',
  ],
  'Unsupervised Learning': [
    'Clustering',
    'Dimensionality Reduction',
    'Anomaly Detection',
    'Association Rule Learning',
  ],
  'Reinforcement Learning': ['Model-Free Learning', 'Model-Based Learning'],
  'Hybrid (Semi / Self-Supervised)': [
    'Semi-Supervised Learning',
    'Self-Supervised Learning',
  ],
  'Computer Vision (Images / CNN)': [
    'Image Classification (CNN)',
    'Object Detection',
    'Image Segmentation',
    'Tabular + Image multimodal',
  ],
}

const LABEL_STYLE: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.65rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: 'var(--ink-3)',
  display: 'block',
  marginBottom: '0.45rem',
}

const SELECT_STYLE: CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-bright)',
  borderRadius: '12px',
  padding: '0.65rem 0.95rem',
  color: 'var(--ink)',
  fontSize: '0.875rem',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)',
}

function SettingCheck({
  name,
  label,
  defaultChecked = false,
  help,
}: {
  name: string
  label: string
  defaultChecked?: boolean
  help?: string
}) {
  return (
    <label
      title={help}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
        cursor: 'pointer',
        padding: '0.45rem 0.625rem',
        borderRadius: '7px',
        transition: 'background 0.12s',
      }}
      onMouseOver={e => (e.currentTarget.style.background = 'var(--surface-3)')}
      onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
    >
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        style={{ width: '15px', height: '15px', accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}
      />
      <span style={{ fontSize: '0.85rem', color: 'var(--ink-2)', userSelect: 'none', lineHeight: 1.4 }}>
        {label}
        {help && (
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '1px' }}>{help}</span>
        )}
      </span>
    </label>
  )
}

function CardHeading({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ink-3)', marginBottom: '0.9rem', paddingBottom: '0.7rem', borderBottom: '1px solid var(--border)' }}>
      {children}
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [activeTab, setActiveTab] = useState<ResultTab>('preview')
  const [mlFamily, setMlFamily] = useState('Supervised Learning')
  const [scaleForExport, setScaleForExport] = useState(false)
  const [geminiOpen, setGeminiOpen] = useState(false)
  const [geminiInput, setGeminiInput] = useState('')
  const [geminiBusy, setGeminiBusy] = useState(false)
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [geminiStatus, setGeminiStatus] = useState('loading…')
  const [lastResultId, setLastResultId] = useState<string | null>(null)
  const [geminiCharts, setGeminiCharts] = useState<any[]>([])

  const [geminiMessages, setGeminiMessages] = useState<{ role: 'user' | 'assistant'; content: string; err?: boolean }[]>([
    { role: 'assistant', content: 'Ask me what to change for cleaning, encoding, scaling, or ML-ready.' },
  ])
  const [cvFamily, setCvFamily] = useState('Image Classification (CNN)')
  const [cvBusy, setCvBusy] = useState(false)
  const [cvDefaultClass, setCvDefaultClass] = useState('')
  const [cvLabelsText, setCvLabelsText] = useState('')
  const [runProgress, setRunProgress] = useState<{ active: boolean; pct: number; label: string; eta: string }>({
    active: false, pct: 0, label: '', eta: '',
  })
  const [cvMeta, setCvMeta] = useState<{
    images_processed?: number
    images_discovered?: number
    images_failed?: number
    image_size?: number[]
    message?: string
    result_id?: string
    download_url?: string
    task?: string
    ready_for_training?: boolean
    missing_for_training?: string[]
    guidance?: string[]
    classes?: string[]
    train_count?: number
    val_count?: number
    annotation_files_found?: number
    manifest_preview?: { columns?: string[]; rows?: Record<string, unknown>[] }
    preview_images?: { name: string; original_path: string; width: number; height: number; data_url: string }[]
  } | null>(null)

  useEffect(() => {
    try {
      // Clear legacy shared key so accounts never inherit another user's key
      try { localStorage.removeItem('cleanroom_gemini_key') } catch {}
      setGeminiApiKey('')
      // Load THIS user's key only (scoped by user id in localStorage + server DB)
      try {
        const tok = localStorage.getItem('cleanroom_token')
        if (tok) {
          fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + tok } })
            .then(r => r.json())
            .then(d => {
              const uid = d?.user?.id || d?.user?.email || ''
              if (!uid) return
              let k = ''
              try { k = localStorage.getItem('cleanroom_gemini_key_' + uid) || '' } catch {}
              // Prefer server-side has_gemini_key signal; actual key stays server-only
              // unless this browser previously saved it under this user id.
              if (k) setGeminiApiKey(k)
              else setGeminiApiKey('')
              if (d?.user?.has_gemini_key && k) {
                setGeminiStatus('your key saved')
              } else if (d?.user?.has_gemini_key) {
                setGeminiStatus('key on account — paste again only if you changed it')
              } else {
                setGeminiStatus('paste your own Gemini API key')
              }
            })
            .catch(() => {})
        }
      } catch {}
      const savedTheme = localStorage.getItem('cleanroom_theme')
      if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme)
      else setTheme('dark')
    } catch {}
    fetch('/api/chat/status')
      .then(parseJsonResponse)
      .then((s: { configured?: boolean; model?: string; requires_user_key?: boolean }) => {
        setGeminiStatus(s.configured ? 'server key ready' : 'paste your own Gemini API key')
      })
      .catch(() => setGeminiStatus('paste your own Gemini API key'))
    // Chat stays closed until the user clicks Ask Gemini
  }, [])

  useEffect(() => {
    const pick = () => {
      const dl = document.getElementById('download-link') as HTMLAnchorElement | null
      const href = dl?.getAttribute('href') || ''
      const m = href.match(/\/api\/download\/([a-f0-9]+)/i)
      if (m?.[1]) setLastResultId(m[1])
    }
    pick()
    const t = window.setInterval(pick, 1500)
    return () => window.clearInterval(t)
  }, [])


  function toggleTheme() {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      try { localStorage.setItem('cleanroom_theme', next) } catch {}
      return next
    })
  }

  async function sendGemini() {
    const msg = geminiInput.trim()
    if (!msg || geminiBusy) return
    // Key may be saved on the user account — allow empty input if logged in
    setGeminiInput('')
    setGeminiMessages(prev => [...prev, { role: 'user', content: msg }])
    setGeminiBusy(true)
    if (geminiApiKey.trim()) {
      // Persist to THIS user account only (never a shared browser key)
      try {
        const tok = localStorage.getItem('cleanroom_token') || ''
        if (tok) {
          void fetch('/api/auth/gemini-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
            body: JSON.stringify({ api_key: geminiApiKey.trim() }),
          }).then(() => {
            // After save, also scope localStorage by user id from /me
            return fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + tok } })
              .then(r => r.json())
              .then(d => {
                const uid = d?.user?.id || d?.user?.email || ''
                if (uid) {
                  try { localStorage.setItem('cleanroom_gemini_key_' + uid, geminiApiKey.trim()) } catch {}
                  try { localStorage.removeItem('cleanroom_gemini_key') } catch {}
                }
              })
          }).catch(() => {})
        }
      } catch {}
    }
    const history = geminiMessages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-12)
      .map(m => ({ role: m.role, content: m.content }))
    try {
      const targetEl = document.getElementById('target') as HTMLInputElement | null
      const planEl = document.getElementById('plan') as HTMLSelectElement | null
      const fileNameEl = document.getElementById('file-name')
      const metricGrid = document.getElementById('metric-grid')
      const settings: Record<string, boolean | string> = {}
      document.querySelectorAll('.setting-list input, input[name], select[name]').forEach((el) => {
        const input = el as HTMLInputElement | HTMLSelectElement
        if (!input.name) return
        if (input instanceof HTMLInputElement && input.type === 'checkbox') settings[input.name] = input.checked
        else settings[input.name] = (input as HTMLInputElement).value
      })
      const tok = (() => { try { return localStorage.getItem('cleanroom_token') || '' } catch { return '' } })()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tok ? { Authorization: 'Bearer ' + tok } : {}),
        },
        body: JSON.stringify({
          message: msg,
          history,
          api_key: geminiApiKey.trim(),
          result_id: lastResultId || undefined,
          context: {
            result_id: lastResultId || undefined,
            target: targetEl?.value || null,
            plan: planEl?.value || null,
            file: fileNameEl?.textContent || null,
            settings,
            summary: metricGrid?.innerText?.slice(0, 500) || null,
          },
        }),
      })
      const data = await parseJsonResponse(res)
      if (!res.ok) {
        const d = data.detail
        const errMsg = typeof d === 'string' ? d : (Array.isArray(d) ? JSON.stringify(d) : (data.message || 'Chat failed'))
        throw new Error(errMsg)
      }
      setGeminiMessages(prev => [...prev, { role: 'assistant', content: data.reply || '(empty reply)' }])
      if (data.model) setGeminiStatus('connected · ' + data.model)
      if (data.result_id) setLastResultId(String(data.result_id))
      if (Array.isArray(data.charts) && data.charts.length) {
        setGeminiCharts(prev => [...data.charts, ...prev].slice(0, 12))
        // scroll charts panel into view
        setTimeout(() => {
          const el = document.getElementById('gemini-charts-panel')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }, 200)
      }
      if (data.edit && data.edit.applied) {
        const edit = data.edit
        const dl = document.getElementById('download-link') as HTMLAnchorElement | null
        if (dl && edit.download_url) {
          dl.href = edit.download_url
          dl.textContent = 'Download updated CSV'
        }
        // Refresh cleaned preview table on the page
        const rows = (edit.preview || []) as Record<string, unknown>[]
        const columns = (edit.cleaned_columns || (rows[0] ? Object.keys(rows[0]) : [])) as string[]
        const esc = (v: unknown) => {
          const s = v == null ? '—' : String(v)
          return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        }
        const th = document.getElementById('table-head')
        const tb = document.getElementById('table-body')
        if (th) {
          th.innerHTML = '<tr>' + columns.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr>'
        }
        if (tb) {
          tb.innerHTML = rows.map(row =>
            '<tr>' + columns.map(c => '<td>' + esc(row[c]) + '</td>').join('') + '</tr>'
          ).join('')
        }
        // Update metric cards if present
        const metrics = document.getElementById('metric-grid')
        if (metrics && (edit.rows != null || edit.columns != null)) {
          const strongs = metrics.querySelectorAll('.metric strong')
          // common layout: status, rows after, cells, readiness — update rows after when we can
          strongs.forEach((el) => {
            const label = el.parentElement?.querySelector('small')?.textContent?.toLowerCase() || ''
            if (label.includes('row') && edit.rows != null) el.textContent = Number(edit.rows).toLocaleString()
          })
        }
        // Flash results panel so user notices refresh
        const results = document.getElementById('results')
        if (results) {
          results.classList.remove('hidden')
          results.style.outline = '2px solid var(--accent)'
          window.setTimeout(() => { results.style.outline = '' }, 1200)
          results.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        setGeminiMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Site preview updated. Column count: ' + (edit.columns ?? columns.length) + '. Download: ' + (edit.download_url || ''),
          },
        ])
      }
    } catch (e) {
      setGeminiMessages(prev => [
        ...prev,
        { role: 'assistant', content: e instanceof Error ? e.message : String(e), err: true },
      ])
    } finally {
      setGeminiBusy(false)
    }
  }



  // Keep result_id in sync after Clean & profile (bridge sets window.__CR_RESULT_ID)
  useEffect(() => {
    const id = window.setInterval(() => {
      try {
        const rid = (window as any).__CR_RESULT_ID
        if (rid && rid !== lastResultId) setLastResultId(String(rid))
      } catch {}
    }, 1500)
    return () => window.clearInterval(id)
  }, [lastResultId])

  // Progress / ETA while Clean & profile runs (hooks into #run-button + /api/clean)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    let started = 0
    const stages = [
      { t: 0.08, label: 'Uploading file…' },
      { t: 0.18, label: 'Profiling columns…' },
      { t: 0.35, label: 'Semantic type detection…' },
      { t: 0.55, label: 'Cleaning & imputation…' },
      { t: 0.72, label: 'Encoding / scaling…' },
      { t: 0.88, label: 'Building report…' },
      { t: 0.96, label: 'Finalizing…' },
    ]

    function estimateSeconds(file?: File | null) {
      if (!file) return 25
      const mb = file.size / (1024 * 1024)
      // Large messy CSVs spend time in datetime/profiling — be generous on ETA
      // ~8s base + ~4s per MB, min 15s, max 180s
      return Math.min(180, Math.max(15, Math.round(8 + mb * 4)))
    }

    function startProgress(file?: File | null) {
      started = Date.now()
      const total = estimateSeconds(file)
      setRunProgress({ active: true, pct: 3, label: 'Starting…', eta: `~${total}s remaining` })
      if (timer) clearInterval(timer)
      timer = setInterval(() => {
        const elapsed = (Date.now() - started) / 1000
        // Soft-cap at 95% until the real request finishes (then jumps to 100%)
        const ratio = Math.min(0.95, elapsed / total)
        let label = 'Working…'
        for (const s of stages) {
          if (ratio >= s.t) label = s.label
        }
        if (elapsed >= total) label = 'Still finalizing large dataset…'
        const left = Math.max(1, Math.ceil(total - elapsed))
        setRunProgress({
          active: true,
          pct: Math.round(ratio * 100),
          label,
          eta: elapsed >= total ? 'Please wait — datetime/profile still running' : `~${left}s remaining`,
        })
      }, 250)
    }

    function finishProgress(ok: boolean) {
      if (timer) clearInterval(timer)
      timer = null
      setRunProgress({
        active: true,
        pct: 100,
        label: ok ? 'Complete' : 'Finished with errors',
        eta: ok ? 'Done' : 'Check message above',
      })
      setTimeout(() => setRunProgress({ active: false, pct: 0, label: '', eta: '' }), 1800)
    }

    // Intercept fetch to detect /api/clean
    const origFetch = window.fetch.bind(window)
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      const isClean = url.includes('/api/clean')
      if (isClean) {
        const fileInput = document.getElementById('file-input') as HTMLInputElement | null
        startProgress(fileInput?.files?.[0] || null)
      }
      try {
        const res = await origFetch(input, init)
        if (isClean) finishProgress(res.ok)
        return res
      } catch (e) {
        if (isClean) finishProgress(false)
        throw e
      }
    }

    // Also start on run-button click (covers non-fetch paths)
    const btn = document.getElementById('run-button')
    const onClick = () => {
      const fileInput = document.getElementById('file-input') as HTMLInputElement | null
      // slight delay so disabled state checks can run first
      setTimeout(() => {
        if (btn && !(btn as HTMLButtonElement).disabled) {
          startProgress(fileInput?.files?.[0] || null)
        }
      }, 0)
    }
    btn?.addEventListener('click', onClick)

    return () => {
      if (timer) clearInterval(timer)
      window.fetch = origFetch
      btn?.removeEventListener('click', onClick)
    }
  }, [])

  async function convertCv() {
    const input = document.getElementById('cv-input') as HTMLInputElement | null
    const file = input?.files?.[0]
    if (!file) {
      setCvMeta({ message: 'Choose an image ZIP first.' })
      return
    }
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setCvMeta({ message: 'Please upload a .zip file of images.' })
      return
    }
    setCvBusy(true)
    setCvMeta(null)
    try {
      const planEl = document.getElementById('plan') as HTMLSelectElement | null
      const fd = new FormData()
      fd.append('file', file)
      // Prefer selected plan; fall back to premium so CV is not blocked
      fd.append('plan', planEl?.value || 'premium')
      fd.append('cv_task', cvFamily)
      if (cvDefaultClass.trim()) fd.append('default_class', cvDefaultClass.trim())
      if (cvLabelsText.trim()) fd.append('labels_csv', cvLabelsText.trim())
      const res = await fetch('/api/cv/prepare', { method: 'POST', body: fd })
      const data = await parseJsonResponse(res)
      if (!res.ok) {
        const detail = data?.detail
        const msg =
          typeof detail === 'string'
            ? detail
            : Array.isArray(detail)
              ? detail.map((d: { msg?: string } | string) => (typeof d === 'string' ? d : d?.msg || JSON.stringify(d))).join('; ')
              : data?.message || `CV prepare failed (${res.status})`
        throw new Error(msg)
      }
      setCvMeta(data)
    } catch (e) {
      setCvMeta({ message: e instanceof Error ? e.message : String(e) })
    } finally {
      setCvBusy(false)
    }
  }

  return (
    <div
      className={`min-h-screen dashboard-container theme-${theme}`}
      style={{
        color: 'var(--ink)',
        minHeight: '100vh',
      }}
    >
      {/* iOS Liquid Glass + Light/Dark theme – visual only. Original variables / IDs / logic preserved. */}
      <style>{`
        /* ===== LIGHT THEME (half-white) – default ===== */
        .theme-light {
          --bg: #f5f3ef;
          --ink: #16120f;
          --ink-2: #3d3832;
          --ink-3: #6b635a;
          --surface: #ffffff;
          --surface-2: #faf9f7;
          --surface-3: #f0eeea;
          --border: rgba(0, 0, 0, 0.08);
          --border-bright: rgba(0, 0, 0, 0.14);
          --accent: #e85d12;
          --accent-dim: rgba(232, 93, 18, 0.12);
          --glass: #ffffff;
          --glass-strong: #ffffff;
          --card: #ffffff;
        }
        /* ===== DARK THEME ===== */
        .theme-dark {
          --bg: #000000;
          --ink: #f3f4f6;
          --ink-2: #d1d5db;
          --ink-3: #9ca3af;
          --surface: #000000;
          --surface-2: #000000;
          --surface-3: #000000;
          --border: rgba(255, 255, 255, 0.09);
          --border-bright: rgba(255, 255, 255, 0.16);
          --accent: #f06a1d;
          --accent-dim: rgba(240, 106, 29, 0.16);
          --glass: #000000;
          --glass-strong: #000000;
          --card: #000000;
          --sidebar-w: 64px;
          --topbar-h: 56px;
        }

        * { box-sizing: border-box; }
        body {
          margin: 0;
          color: var(--ink);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          /* ~10% larger base type for readability */
          font-size: 110%;
        }



        /* PURE BLACK — zero grey */
        .theme-dark,
        .theme-dark.dashboard-container,
        .theme-dark .cr-main,
        .theme-dark .cr-page,
        .theme-dark section,
        .theme-dark #results,
        .theme-dark #workspace,
        .theme-dark #plans {
          background: #000000 !important;
          background-color: #000000 !important;
          background-image: none !important;
        }
        .theme-dark .glass-panel,
        .theme-dark .chart-block,
        .theme-dark .eda-card,
        .theme-dark .ov-card,
        .theme-dark .ov-kpi,
        .theme-dark .metric,
        .theme-dark .cr-sidebar,
        .theme-dark .cr-topbar,
        .theme-dark select,
        .theme-dark input:not([type="checkbox"]):not([type="range"]),
        .theme-dark .plans-teaser {
          background: #000000 !important;
          background-color: #000000 !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          box-shadow: none !important;
        }
        .theme-dark .glass-panel::before { display: none !important; }

        /* After clean keep black */
        .theme-dark #results,
        .theme-dark #results .glass-panel {
          background: #121216 !important;
          background-color: #121216 !important;
        }
        .theme-dark #results {
          background: transparent !important;
        }

        /* Solid cards — no muddy grey wash */
        .theme-dark .glass-panel,
        .theme-dark .glass-panel.plans-teaser {
          background: #121216 !important;
          background-color: #121216 !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: 0 8px 28px rgba(0,0,0,0.45) !important;
        }
        .theme-dark .glass-panel::before {
          display: none !important;
          opacity: 0 !important;
        }
        .theme-dark.dashboard-container,
        .theme-dark .cr-main {
          background-color: #0a0a0c !important;
        }
        .theme-dark .cr-main > section,
        .theme-dark .cr-page {
          background: transparent !important;
        }
        .theme-light .glass-panel,
        .theme-light .glass-panel.plans-teaser {
          background: #ffffff !important;
          background-color: #ffffff !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border: 1px solid rgba(0,0,0,0.08) !important;
          box-shadow: 0 8px 28px rgba(0,0,0,0.06) !important;
        }
        .theme-light .glass-panel::before {
          display: none !important;
        }
        .theme-light.dashboard-container {
          background-color: #f5f3ef !important;
          background-image: none !important;
        }
        .theme-light .cr-sidebar {
          background: #ffffff !important;
          border-right: 1px solid rgba(0,0,0,0.08);
        }
        .theme-light .cr-topbar {
          background: rgba(255,255,255,0.95) !important;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        /* Keep secondary labels readable (not washed-out grey) */
        .theme-dark .glass-panel,
        .theme-dark .glass-panel * {
          color: inherit;
        }
        .theme-dark [style*="ink-3"],
        .theme-light [style*="ink-3"] {
          color: var(--ink-2) !important;
        }

        /* Half-white (light) background */
        .theme-light.dashboard-container {
          background-color: #f2f0ec;
          background-image:
            radial-gradient(ellipse 110% 70% at 80% -10%, rgba(232,93,18,0.10), transparent 55%),
            radial-gradient(ellipse 60% 40% at 10% 100%, rgba(120,90,200,0.06), transparent 50%),
            linear-gradient(180deg, #f7f5f1 0%, #f2f0ec 40%, #efece7 100%);
          background-attachment: fixed;
        }
        /* Dark background */
        .theme-dark.dashboard-container {
          background-color: #0b0b0f;
          background-image:
            radial-gradient(ellipse 90% 50% at 100% 0%, rgba(240,106,29,0.10), transparent 50%),
            linear-gradient(180deg, #0d0d12 0%, #0b0b0f 100%);
          background-attachment: fixed;
        }
        /* App shell: left icon rail + main */
        .cr-shell { display: flex; min-height: 100vh; }
        .cr-sidebar {
          width: var(--sidebar-w, 64px);
          flex-shrink: 0;
          background: #0e0e12;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.85rem 0;
          gap: 0.35rem;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 50;
        }
        .cr-sidebar .cr-side-btn {
          width: 40px; height: 40px; border-radius: 10px;
          display: grid; place-items: center;
          color: var(--ink-3); background: transparent; border: none; cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }
        .cr-sidebar .cr-side-btn:hover { color: var(--ink); background: rgba(255,255,255,0.05); }
        .cr-sidebar .cr-side-btn.active {
          color: var(--accent);
          background: var(--accent-dim);
          box-shadow: 0 0 0 1px rgba(240,106,29,0.35);
        }
        .cr-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .cr-topbar {
          height: var(--topbar-h, 56px);
          border-bottom: 1px solid var(--border);
          background: rgba(14,14,18,0.95);
          backdrop-filter: blur(16px);
          position: sticky; top: 0; z-index: 40;
          display: flex; align-items: center;
        }
        .cr-card {
          background: var(--card, #121218);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.35);
        }
        .theme-dark .glass-panel {
          background: #121218 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 28px rgba(0,0,0,0.35) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        .theme-dark .glass-panel::before { display: none !important; }
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0.75rem;
          align-items: stretch;
        }
        .compare-arrow {
          display: flex; align-items: center; justify-content: center;
          color: var(--accent);
          font-size: 1.75rem;
          align-self: center;
        }
        .upload-zone-ref {
          border: 1.5px dashed rgba(240,106,29,0.55) !important;
          background: rgba(240,106,29,0.06) !important;
          border-radius: 12px !important;
          min-height: 180px;
        }
        .dashboard-metrics-row {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 1rem;
        }
        .dashboard-bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 1100px) {
          .dashboard-metrics-row, .dashboard-bottom-row, .compare-grid {
            grid-template-columns: 1fr !important;
          }
          .compare-arrow { transform: rotate(90deg); padding: 0.25rem 0; }
        }
        @media (max-width: 720px) {
          .cr-sidebar { display: none; }
        }
        .ba-dashboard { width: 100%; }


        #results, #graphs-content, #overview-content {
          width: 100% !important;
          max-width: 100% !important;
        }
        #graphs-content .charts-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 0.75rem !important;
          width: 100% !important;
        }
        #graphs-content .chart-block {
          min-height: 220px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }


        /* 3-tab EDA grid */
        .eda-tabs { display: flex; gap: 0.35rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
        .eda-tab {
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          color: #c8c4bc; padding: 0.45rem 0.9rem; border-radius: 8px; cursor: pointer;
          font-size: 0.78rem; font-weight: 600;
        }
        .eda-tab.active { background: rgba(240,106,29,0.18); border-color: #f06a1d; color: #f06a1d; }
        .eda-panel { display: none; width: 100%; }
        .eda-panel.active { display: block; }
        .eda-grid {
          display: grid !important;
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          gap: 0.7rem !important;
          width: 100% !important;
        }
        .eda-span2 { grid-column: span 2; }
        .eda-span3 { grid-column: span 3; }
        @media (max-width: 1100px) {
          .eda-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .eda-span2, .eda-span3 { grid-column: span 1; }
        }
        @media (max-width: 700px) {
          .eda-grid { grid-template-columns: 1fr !important; }
        }

        /* No nested scroll traps — full dashboard expand */
        #results, #results .glass-panel, #graphs-content, #overview-content,
        #profile-content, #eda-content, #raw-content {
          max-height: none !important;
        }
        #profile-content, #eda-content, #graphs-content {
          overflow: visible !important;
        }
        #graphs-content .charts-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 0.75rem !important;
        }
        #graphs-content .chart-block {
          min-height: 210px !important;
          max-height: none !important;
          overflow: visible !important;
        }
        #raw-content .table-wrap, #preview-table {
          max-height: none !important;
        }
        .results-mid-grid .glass-panel {
          max-height: none !important;
          overflow: visible !important;
        }

        #raw-content table, #preview-table {
          font-size: 0.75rem !important;
        }
        #raw-content table th, #preview-table th,
        #raw-content table td, #preview-table td {
          padding: 0.28rem 0.45rem !important;
          white-space: nowrap;
        }


        /* === Consistent medium dashboard sizing === */
        #metric-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
          gap: 0.5rem !important;
        }
        #metric-grid .metric {
          padding: 0.65rem 0.75rem !important;
          min-height: 72px;
        }
        #metric-grid .metric small {
          font-size: 0.68rem !important;
        }
        #metric-grid .metric strong {
          font-size: 1.15rem !important;
          font-weight: 700 !important;
        }
        #graphs-content .charts-grid,
        .charts-grid {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 0.65rem !important;
          width: 100% !important;
        }
        #graphs-content .chart-block,
        .chart-block {
          padding: 0.65rem 0.75rem !important;
          min-height: 180px !important;
          max-height: none !important;
          overflow: auto !important;
          box-sizing: border-box !important;
        }
        #graphs-content .chart-block svg,
        .chart-block svg {
          max-width: 100% !important;
          max-height: none !important;
          width: 100% !important;
          height: auto !important;
        }
        #graphs-content .hist-bars,
        .hist-bars,
        .hist-bars-labeled {
          height: 110px !important;
        }
        .chart-heading,
        .chart-section-title {
          font-size: 0.78rem !important;
          margin-bottom: 0.4rem !important;
        }
        .chart-heading strong {
          font-size: 0.85rem !important;
        }
        .chart-heading span {
          font-size: 0.7rem !important;
        }
        #graphs-content .chart-section {
          margin: 0.5rem 0 !important;
        }
        .results-mid-grid {
          grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.15fr) !important;
        }
        .results-mid-grid .glass-panel {
          max-height: none !important;
        }
        #profile-content, #eda-content {
          max-height: none !important;
        }
        .ba-dashboard {
          grid-template-columns: minmax(140px, 180px) minmax(0, 1fr) minmax(140px, 180px) !important;
        }
        .quality-pie-svg {
          width: 110px !important;
          height: 110px !important;
        }
        #raw-content, #preview-table {
          max-height: none !important;
        }
        @media (max-width: 1100px) {
          #graphs-content .charts-grid,
          .charts-grid {
            grid-template-columns: 1fr !important;
          }
          .results-mid-grid {
            grid-template-columns: 1fr !important;
          }
          .ba-dashboard {
            grid-template-columns: 1fr !important;
          }
        }


        .results-mid-grid { width: 100%; }
        #profile-content .profile-row,
        #profile-content .dtype-list > div {
          padding: 0.28rem 0.55rem !important;
          margin-bottom: 0.25rem !important;
          font-size: 0.78rem !important;
        }
        #profile-content .snapshot-stats,
        #raw-content .snapshot-stats {
          display: grid !important;
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 0.35rem !important;
          margin-bottom: 0.4rem !important;
        }
        #profile-content .snapshot-stats > div,
        #raw-content .snapshot-stats > div {
          padding: 0.35rem 0.45rem !important;
        }
        #graphs-content .charts-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
          gap: 0.45rem !important;
        }
        #graphs-content .chart-block {
          padding: 0.5rem !important;
          min-height: 120px !important;
        }
        #graphs-content .hist-bars { height: 90px !important; }
        #graphs-content .chart-section-title {
          font-size: 0.72rem !important;
          margin: 0.35rem 0 0.4rem !important;
        }
        @media (max-width: 960px) {
          .results-mid-grid { grid-template-columns: 1fr !important; }
          .results-mid-grid .glass-panel { max-height: none !important; }
        }

        @media (max-width: 1100px) {
          .ba-dashboard {
            grid-template-columns: 1fr 1fr !important;
          }
          .ba-dashboard > .compare-grid {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 720px) {
          .ba-dashboard {
            grid-template-columns: 1fr !important;
          }
        }
        .quality-pie-svg { width: 130px; height: 130px; }
        .quality-pie-label {
          font-family: "JetBrains Mono", monospace;
          font-size: 1.15rem;
          font-weight: 700;
          fill: var(--ink);
        }


        #graphs-content .charts-grid,
        #graphs-content {
          width: 100%;
        }
        #graphs-content .chart-block {
          min-height: 180px;
        }
        #profile-content, #eda-content, #raw-content {
          width: 100%;
        }
        .glass-panel {
          width: 100%;
        }
        /* Fill main area — no narrow centered column */
        .cr-main > section,
        .cr-main .cr-page {
          width: 100%;
          max-width: none !important;
        }


        .hidden { display: none !important; }

        /* ===== Extra-glossy iOS Liquid Glass ===== */
        .glass-panel {
          position: relative;
          background: var(--glass);
          backdrop-filter: blur(32px) saturate(190%) brightness(108%);
          -webkit-backdrop-filter: blur(32px) saturate(190%) brightness(108%);
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
          border-right: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 24px;
          box-shadow:
            0 18px 48px rgba(0, 0, 0, 0.12),
            inset 0 1px 2px rgba(255, 255, 255, 0.75),
            inset 0 -2px 6px rgba(0, 0, 0, 0.04);
          color: var(--ink);
          overflow: hidden;
        }
        .theme-dark .glass-panel {
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          border-right: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 18px 48px rgba(0, 0, 0, 0.32),
            inset 0 1px 2px rgba(255, 255, 255, 0.5),
            inset 0 -2px 6px rgba(0, 0, 0, 0.1);
        }
        .glass-panel::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.55) 0%,
            rgba(255, 255, 255, 0.12) 35%,
            transparent 55%
          );
          pointer-events: none;
          z-index: 0;
        }
        .theme-dark .glass-panel::before {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0.05) 40%,
            transparent 60%
          );
        }
        .glass-panel > * {
          position: relative;
          z-index: 1;
        }

        /* Liquid glass chips / tags */
        .glass-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 0.38rem 0.85rem;
          border-radius: 999px;
          background: var(--accent-dim);
          border: 1px solid rgba(232,93,18,0.35);
          color: var(--accent);
          backdrop-filter: blur(14px) saturate(170%);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.5);
        }

        /* Buttons – glossy liquid glass treatment */
        button, #run-button {
          transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease;
        }
        #run-button {
          background: linear-gradient(135deg, #f06a1d, #f5a623) !important;
          border: 1px solid rgba(255,255,255,0.45) !important;
          box-shadow:
            0 8px 28px rgba(240,106,29,0.38),
            inset 0 1px 2px rgba(255,255,255,0.55) !important;
          border-radius: 12px !important;
        }
        #run-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none !important;
        }
        #run-button:not(:disabled):hover {
          transform: translateY(-2px) scale(1.015);
          box-shadow:
            0 14px 40px rgba(240,106,29,0.48),
            inset 0 1px 3px rgba(255,255,255,0.65) !important;
        }
        #run-button:not(:disabled):active {
          transform: translateY(0) scale(0.99);
        }

        .message { margin-top: 0.75rem; font-size: 0.875rem; }
        .message.error { color: #e05a62; }
        .message.success { color: var(--accent); }
        .setting-list { display: flex; flex-direction: column; gap: 0.15rem; }
        .settings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
        .workspace-top { display: grid; grid-template-columns: 260px 1fr; gap: 0.85rem; align-items: stretch; }
        .cv-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .table-wrap { overflow-x: auto; border-radius: 10px; }
        .plans-teaser { padding: 1rem 1.15rem; }
        .cr-page {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0.75rem 1rem 1.25rem;
          box-sizing: border-box;
        }
        .results-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem !important;
        }
        .results-analytics-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        @media (max-width: 900px) {
          .results-analytics-row { grid-template-columns: 1fr !important; }
        }

        /* Results area – dense, full-width */
        #results {
          margin-top: 0.85rem;
          padding: 0.85rem;
          background: var(--glass);
          backdrop-filter: blur(34px) saturate(190%) brightness(108%);
          -webkit-backdrop-filter: blur(34px) saturate(190%) brightness(108%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 28px;
          box-shadow:
            0 22px 55px rgba(0, 0, 0, 0.12),
            inset 0 1px 3px rgba(255, 255, 255, 0.7),
            inset 0 -2px 5px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
        }
        .theme-dark #results {
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          border-right: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 22px 55px rgba(0, 0, 0, 0.35),
            inset 0 1px 2px rgba(255, 255, 255, 0.45),
            inset 0 -2px 5px rgba(0, 0, 0, 0.08);
        }
        #results::before {
          content: "";
          position: absolute;
          top: -40%;
          left: -40%;
          width: 180%;
          height: 180%;
          background: linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 38%, transparent 55%);
          pointer-events: none;
        }
        .theme-dark #results::before {
          background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 40%, transparent 55%);
        }

        #metric-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.15rem;
          margin-bottom: 1.6rem;
        }
        .metric, .profile-row, .chart-block, .eda-grid > div, .snapshot-stats {
          background: var(--glass);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 18px;
          backdrop-filter: blur(18px) saturate(170%);
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.55);
        }
        .theme-dark .metric,
        .theme-dark .profile-row,
        .theme-dark .chart-block,
        .theme-dark .eda-grid > div,
        .theme-dark .snapshot-stats {
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.3);
        }
        .metric { padding: 0.7rem 0.85rem; }
        .metric small {
          display: block;
          font-size: 0.7rem;
          color: var(--ink-3);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }
        .metric strong { font-size: 1.4rem; font-weight: 700; color: var(--ink); }
        .metric strong.accent { color: var(--accent); }

        /* Force readable secondary text (was too grey on dark glass) */
        .metric small,
        .theme-dark .metric small,
        .snapshot-stats small,
        .chart-heading span,
        .chart-section-title,
        .muted-copy,
        label[style*="ink-3"],
        .theme-toggle {
          color: var(--accent) !important;
          opacity: 0.95;
        }
        #metric-grid .metric small {
          color: var(--accent) !important;
          font-weight: 700;
          letter-spacing: 0.06em;
        }


        /* Readable snapshot / profile rows */
        .snapshot-stats {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          padding: 1rem 1.1rem !important;
          margin-bottom: 1.1rem;
        }
        .snapshot-stats > div {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem 0.9rem;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
        }
        .snapshot-stats small {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .snapshot-stats strong {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: -0.02em;
        }

        .profile-row {
          display: flex !important;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 1rem !important;
          margin: 0.45rem 0;
        }
        .profile-row > span {
          color: var(--ink-2);
          font-size: 0.88rem;
          flex: 1;
        }
        .profile-row > strong {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--accent);
          text-align: right;
          white-space: nowrap;
        }

        .dtype-list {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .dtype-list .chart-heading {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.35rem;
        }
        .dtype-list code, .dtype-line {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.45;
          padding: 0.45rem 0.7rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          color: var(--ink-2);
          word-break: break-word;
        }
        .dtype-line .col-name {
          color: var(--accent);
          font-weight: 700;
        }
        .dtype-line .col-type {
          color: var(--ink-2);
        }

        /* Table column headers in orange */
        table th {
          color: var(--accent) !important;
          font-weight: 700 !important;
        }

        .eda-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }
        .eda-grid > div {
          padding: 1rem 1.1rem !important;
        }
        .eda-grid strong {
          display: block;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-3);
          margin-bottom: 0.35rem;
        }
        .eda-grid p {
          margin: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--accent);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .chart-block {
          padding: 0.85rem;
          margin-bottom: 0.35rem;
        }
        .chart-heading {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.45rem 0.65rem;
          margin-bottom: 0.85rem;
        }
        .chart-heading strong {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--ink);
          margin-right: 0.15rem;
        }
        .chart-heading span {
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 500;
          opacity: 0.9;
        }
        .muted-copy {
          color: var(--accent) !important;
          opacity: 0.85;
        }
        .gemini-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          display: inline-block;
          animation: gemini-bounce 1.2s infinite ease-in-out;
        }
        .gemini-dot:nth-child(2) { animation-delay: 0.15s; }
        .gemini-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes gemini-bounce {
          0%, 80%, 100% { opacity: 0.35; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }

        .chart-section-title {
          color: var(--accent) !important;
        }
        .chart-section {
          margin-top: 1.35rem;
          padding-top: 0.25rem;
        }
        .chart-section-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 1.5rem 0 0.85rem;
        }
        .hist-bars { display: flex; align-items: flex-end; gap: 3px; height: 120px; margin-top: 0.35rem; }
        .hist-bars i { display: none; }
        .hist-bar-wrap {
          flex: 1 1 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 120px;
          min-width: 0;
          max-width: 30px;
        }
        .hist-bar-track {
          flex: 1 1 auto;
          width: 100%;
          display: flex;
          align-items: flex-end;
          min-height: 0;
        }
        .hist-bar-fill {
          width: 100%;
          min-height: 3px;
          border-radius: 3px 3px 0 0;
          background: linear-gradient(180deg, #ff9a4a, #f06a1d);
          display: block;
        }
        .hist-bar-n {
          display: block;
          width: 100%;
          margin-top: 4px;
          font-size: 9px;
          line-height: 1.15;
          font-weight: 600;
          color: #f0ebe3;
          font-family: ui-monospace, Menlo, monospace;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
        }
        .hist-bar-track {
          width: 70%;
          max-width: 22px;
        }
        .box-row {
          display: grid;
          grid-template-columns: 140px 1fr 70px;
          gap: 0.6rem;
          align-items: center;
          margin: 0.55rem 0;
          font-size: 0.82rem;
        }
        .box-track {
          position: relative;
          height: 12px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
        }
        .box-iqr {
          position: absolute;
          top: 0; bottom: 0;
          background: rgba(240,106,29,0.45);
          border-radius: 4px;
        }
        .box-med {
          position: absolute;
          top: -3px; bottom: -3px;
          width: 3px;
          background: var(--accent);
          border-radius: 2px;
        }
        .corr-grid {
          display: grid;
          gap: 2px;
          margin-top: 0.5rem;
        }
        .corr-cell {
          aspect-ratio: 1;
          border-radius: 3px;
          font-size: 0.58rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a0d04;
          font-weight: 600;
        }
        .scatter-canvas {
          width: 100%;
          height: 160px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border: 1px solid var(--border);
        }
        .chart-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin: 0.55rem 0;
          font-size: 0.85rem;
        }
        .chart-row i {
          flex: 1 1 auto;
          height: 10px;
          min-width: 40px;
          background: rgba(255,255,255,0.12);
          border-radius: 99px;
          overflow: hidden;
          display: block;
        }
        .theme-dark .chart-row i { background: rgba(255,255,255,0.14); }
        .chart-row i b {
          display: block;
          height: 100%;
          min-width: 2px;
          background: linear-gradient(90deg, #f06a1d, #ff9a4a);
          border-radius: 99px;
        }
        .chart-row i b.outlier-bar {
          background: linear-gradient(90deg, #f07178, #f5a623);
        }
        .retention-bar {
          height: 10px;
          background: rgba(0,0,0,0.06);
          border-radius: 99px;
          overflow: hidden;
          margin-top: 0.55rem;
        }
        .theme-dark .retention-bar { background: rgba(255,255,255,0.1); }
        .retention-bar b {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, var(--accent), #f5a623);
          border-radius: 99px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        th, td {
          padding: 0.65rem 0.9rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        th {
          color: var(--ink-3);
          font-weight: 600;
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .muted-copy { color: var(--ink-3); font-size: 0.875rem; }

        /* Selects & inputs – soft glass */
        .theme-dark select option {
          background: #111116 !important;
          color: #f4f4f5 !important;
        }
        .theme-light select option {
          background: #ffffff !important;
          color: #16120f !important;
        }

select, input[type="text"], input[type="password"], textarea {
          background: var(--surface-2) !important;
          border: 1px solid var(--border-bright) !important;
          border-radius: 12px !important;
          backdrop-filter: blur(12px);
          color: var(--ink) !important;
        }

        /* Theme toggle button */
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          border: 1px solid var(--border-bright);
          background: var(--glass);
          backdrop-filter: blur(16px) saturate(170%);
          color: var(--ink);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.5);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .theme-toggle:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.6);
        }

        @media (max-width: 1100px) {
          .settings-grid { grid-template-columns: repeat(2, 1fr) !important; }
          #metric-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .workspace-top { grid-template-columns: 1fr !important; }
          .settings-grid { grid-template-columns: 1fr !important; }
          .cv-controls { grid-template-columns: 1fr !important; }
          .charts-grid { grid-template-columns: 1fr; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .cr-top-nav { display: none !important; }
        }
        @media (max-width: 540px) {
          .plans-grid { grid-template-columns: 1fr !important; }
          #metric-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      {/* ── Nav ─────────────────────────────────────────────── */}
      {/* ── App shell: left icon rail + main (IMAGE 1 composition) ── */}
      <div className="cr-shell">
        {/* Left icon sidebar */}
        <aside className="cr-sidebar" aria-label="Primary">
          <a href="#workspace" className="cr-side-btn active" title="Overview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
          </a>
          <a href="#workspace" className="cr-side-btn" title="Pipelines / Upload">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h10"/></svg>
          </a>
          <a href="#results" className="cr-side-btn" title="Monitoring">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </a>
          <a href="#results" className="cr-side-btn" title="Analytics">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          </a>
          <a href="#plans" className="cr-side-btn" title="Settings / Plans" style={{ marginTop: 'auto' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          </a>
        </aside>

        <div className="cr-main">
      {/* Top navigation */}
      <header className="cr-topbar">
        <div
          style={{
            width: '100%',
            maxWidth: 'none',
            margin: 0,
            padding: '0 1rem',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: 0 }}>
            <a href="#workspace" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f06a1d 0%, #ff8a3d 100%)',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  color: '#1a0d04',
                  boxShadow: '0 4px 14px rgba(240,106,29,0.35)',
                }}
              >
                CR
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                CleanRoom
              </span>
            </a>
            <nav className="cr-top-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
              {[
                { href: '#workspace', label: 'Overview', active: true },
                { href: '#workspace', label: 'Pipelines' },
                { href: '#results', label: 'Monitoring' },
                { href: '#results', label: 'Analytics' },
                { href: '#plans', label: 'Settings' },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: item.active ? 600 : 500,
                    color: item.active ? 'var(--ink)' : 'var(--ink-3)',
                    textDecoration: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    background: item.active ? 'rgba(240,106,29,0.14)' : 'transparent',
                    border: item.active ? '1px solid rgba(240,106,29,0.3)' : '1px solid transparent',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            <button type="button" className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}>
              {theme === 'light' ? '◐ Dark' : '◑ Light'}
            </button>
            <a
              href="#results"
              id="export-report-btn"
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1a0d04',
                textDecoration: 'none',
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f06a1d, #ff8a3d)',
                boxShadow: '0 4px 14px rgba(240,106,29,0.3)',
                whiteSpace: 'nowrap' as const,
              }}
            >
              Export Report
            </a>
            <a href="/pricing" style={{ fontSize: '0.78rem', color: 'var(--ink-3)', textDecoration: 'none' }}>Pricing</a>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3d3d4a, #1a1a22)',
                border: '1px solid var(--border-bright)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--ink-2)',
              }}
              title="Account"
            >
              AC
            </div>
          </div>
        </div>
      </header>


      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="cr-page"
        style={{
          padding: '0.85rem 1rem 0.5rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            background: 'var(--accent-dim)',
            border: '1px solid rgba(240,106,29,0.2)',
            padding: '0.375rem 0.75rem',
            borderRadius: '50px',
            marginBottom: '0.5rem',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              background: 'var(--accent)',
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--accent)',
            }}
          />
          Cleanroom data workspace
        </div>

        <h1
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(1.35rem, 2.4vw, 1.85rem)',
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-0.035em',
            color: 'var(--ink)',
            marginBottom: '1.25rem',
            maxWidth: '800px',
          }}
        >
          CleanRoom — Your Data.
          <br />
          <span style={{ color: 'var(--accent)' }}>Cleaned. Prepared. Ready for ML.</span>

        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--ink-2)',
            lineHeight: 1.65,
            maxWidth: '560px',
            marginBottom: '2.5rem',
          }}
        >
          Semantic cleaning, exploratory analysis, and ML readiness in one
          calm workspace. Upload a file, tune the rules, and export a dataset
          your team can use.
        </p>

        <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
          <a
            href="#workspace"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: 'var(--accent)',
              color: '#1a0d04',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              textDecoration: 'none',
              transition: 'all 0.15s',
              boxShadow: '0 4px 24px rgba(240,106,29,0.25)',
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            Start cleaning
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#plans"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 500,
              fontSize: '0.9rem',
              color: 'var(--ink-2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              textDecoration: 'none',
              border: '1px solid var(--border-bright)',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'var(--ink-3)'
              e.currentTarget.style.color = 'var(--ink)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'var(--border-bright)'
              e.currentTarget.style.color = 'var(--ink-2)'
            }}
          >
            View plans
          </a>
        </div>
      </section>

      {/* ── Plans teaser ─────────────────────────────────────── */}
      <section
        id="plans"
        className="cr-page" style={{ padding: '0.5rem 1rem' }}
      >
        <div className="glass-panel plans-teaser" style={{ padding: '1.75rem 2rem' }}>
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                marginBottom: '0.6rem',
              }}
            >
              Pricing
            </div>
            <h2
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '1.6rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--ink)',
                marginBottom: '0.6rem',
              }}
            >
              Simple, transparent plans
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: '460px' }}>
              Start free with 5,000 rows a run. Scale to 500,000 rows, full EDA,
              ML-ready exports and computer-vision prep.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Free · $0', 'Basic · $19', 'Normal · $39', 'Premium · $50'].map(p => (
                <span key={p} className="glass-chip">{p}</span>
              ))}
            </div>
            <a
              href="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600,
                fontSize: '0.9rem',
                background: 'var(--accent)',
                color: '#1a0d04',
                padding: '0.7rem 1.4rem',
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(240,106,29,0.25)',
              }}
            >
              See all plans
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>


      {/* ── Workspace ────────────────────────────────────────── */}
      <section
        id="workspace"
        className="cr-page"
        style={{
          padding: '0.5rem 1rem 1.5rem',
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '1rem',
            marginBottom: '0.65rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                marginBottom: '0.2rem',
              }}
            >
              Workspace
            </div>
            <h2
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '1.75rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--ink)',
              }}
            >
              Dataset Zone
            </h2>
          </div>
        </div>

        {/* Row 1: Plan selector + Upload */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 260px) 1fr', gap: '0.75rem', marginBottom: '0.75rem' }} className="workspace-top">

          {/* Plan card */}
          <div className="glass-panel" style={{ padding: '0.9rem' }}>
            <CardHeading>Workspace plan</CardHeading>
            <label style={LABEL_STYLE}>Active plan</label>
            <select id="plan" defaultValue="free" style={{ ...SELECT_STYLE, marginBottom: '0.875rem', fontWeight: 500, fontSize: '0.9rem' }}>
              <option value="free">Free · 5K rows · Rs 0</option>
              <option value="basic">Basic · 100K rows · Rs 1,500/mo</option>
              <option value="normal">Normal · 500K rows · Rs 3,500/mo</option>
              <option value="premium">Premium · 2M rows · Rs 6,000/mo</option>
            </select>
            <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span id="limit-text" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: 'var(--ink-2)' }} />
              <span id="feature-text" style={{ fontSize: '0.8rem', color: 'var(--ink-3)', lineHeight: 1.5 }} />
            </div>
            <a id="checkout-link" href="#plans" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', transition: 'opacity 0.15s' }} onMouseOver={e => (e.currentTarget.style.opacity = '0.7')} onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
              Upgrade plan
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>

          {/* Upload dropzone */}
          <div className="glass-panel" style={{ padding: '0.9rem' }}>
            <CardHeading>Dataset Zone</CardHeading>
            <div
              id="dropzone"
              className="upload-zone-ref"
              style={{ border: '1.5px dashed rgba(240,106,29,0.55)', borderRadius: '14px', padding: '1.25rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease', background: 'rgba(240,106,29,0.06)', minHeight: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input id="file-input" type="file" accept=".csv,.tsv,.txt,.xlsx,.xls,.json,.parquet,.zip" style={{ display: 'none' }} />
              <div style={{ width: '44px', height: '44px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.875rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.75">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.925rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.3rem' }}>Drop your file here</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)' }}>CSV, TSV, Excel, JSON, Parquet, ZIP — or <span style={{ color: 'var(--accent)', fontWeight: 600 }}>click to browse</span></p>
              <div id="file-name" style={{ marginTop: '0.75rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 500 }} />
            </div>
          </div>
        </div>

        {/* Message + primary action near plan/upload */}
        <div id="message" className="message" style={{ marginBottom: '0.75rem' }} />
        <button
          id="run-button"
          disabled
          style={{
            width: '100%',
            padding: '0.875rem',
            background: 'var(--accent)',
            color: '#1a0d04',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1rem',
            fontWeight: 700,
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.15s',
            boxShadow: '0 4px 20px rgba(240,106,29,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          Clean &amp; profile <span>→</span>
        </button>

        {runProgress.active && (
          <div
            id="run-progress"
            style={{
              marginBottom: '1rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--ink-2)', fontWeight: 600 }}>{runProgress.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: 'var(--ink-3)' }}>
                {runProgress.pct}% · {runProgress.eta}
              </span>
            </div>
            <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${runProgress.pct}%`,
                  background: 'linear-gradient(90deg, var(--accent), #f5a623)',
                  borderRadius: 999,
                  transition: 'width 0.25s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Row 2: All settings — 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }} className="settings-grid">

          {/* ── Col 1: Data cleaning booleans ── */}
          <div className="glass-panel" style={{ padding: '0.9rem' }}>
            <CardHeading>Cleaning options</CardHeading>
            <div className="setting-list" style={{ display: 'flex', flexDirection: 'column' }}>
              <SettingCheck name="strict_type_coercion" label="Strict type coercion" help="Cast $1,200 / 15% style strings to numbers" defaultChecked={true} />
              <SettingCheck name="boolean_normalize" label="Boolean normalization" help="Yes/No, Y/N, 1/0 → true/false" defaultChecked={true} />
              <SettingCheck name="extract_date_features" label="Extract date features" help="year, month, day_of_week, is_weekend, quarter" />
              <SettingCheck name="strip_whitespace" label="Strip whitespace & control chars" defaultChecked={true} />
              <SettingCheck name="drop_high_missing" label="Drop high-missing columns" defaultChecked={true} />
              <SettingCheck name="drop_constant" label="Drop constant / near-zero variance" defaultChecked={true} />
              <SettingCheck name="fill_missing" label="Fill missing values" defaultChecked={true} />
              <SettingCheck name="missingness_indicators" label="Missingness indicator flags" help="Add column_is_na before imputing" />
              <SettingCheck name="deduplicate_rows" label="Remove exact duplicate rows" defaultChecked={true} />
              <SettingCheck name="fuzzy_dedupe_text" label="Fuzzy text dedupe" help="Merge near-identical categories (New York / new york)" />
              <SettingCheck name="one_hot_encode" label="One-hot encode categoricals" />
              <SettingCheck name="group_rare_categories" label="Group rare categories → Other" />
              <SettingCheck name="combine_names" label="Combine first + last → full_name" />
              <SettingCheck name="parse_names_addresses" label="Parse full names / addresses" help="Split name & address into structured parts" />
              <SettingCheck name="handle_outliers" label="Handle numeric outliers" defaultChecked={true} />
              <SettingCheck name="drop_high_correlation" label="Drop high-correlation features" help="|r| > 0.90 pairwise" />
              <SettingCheck name="log_transform_skewed" label="Log-transform skewed numerics" help="log1p on heavily skewed columns" />
              <SettingCheck name="ml_ready" label="ML-ready mode" help="Drop IDs, flatten JSON, days_since dates, clip negatives" />
              <SettingCheck name="flatten_json" label="Flatten nested JSON / structs" />
              <SettingCheck name="drop_metadata_flags" label="Drop metadata / quality-flag columns" help="Drops notes_*, *_flag, is_outlier_flag columns" />
              <label
                title="On for Linear/SVM/KNN/NN. Off for trees."
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer', padding: '0.45rem 0.625rem', borderRadius: '7px', transition: 'background 0.12s' }}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--surface-3)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                <input
                  type="checkbox"
                  name="scale_for_export"
                  style={{ width: '15px', height: '15px', accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0, marginTop: '2px' }}
                  onChange={e => setScaleForExport(e.target.checked)}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-2)', userSelect: 'none', lineHeight: 1.4 }}>Scale continuous features on export</span>
              </label>
              <SettingCheck name="run_eda" label="Run EDA after cleaning" defaultChecked={true} />
              <SettingCheck name="export_audit_trail" label="Include audit trail in report" help="Every cleaning step listed for reproducibility" defaultChecked={true} />
            </div>
          </div>

          {/* ── Col 2: Thresholds & methods ── */}
          <div className="glass-panel" style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <CardHeading>Thresholds &amp; methods</CardHeading>

            {/* Missing threshold slider */}
            <div>
              <label style={LABEL_STYLE}>Missing % threshold</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="range" name="missing_threshold" min={50} max={95} defaultValue={70}
                  style={{ flex: 1, accentColor: 'var(--accent)', cursor: 'pointer' }}
                  onInput={e => {
                    const el = e.currentTarget.nextElementSibling as HTMLElement
                    if (el) el.textContent = e.currentTarget.value + '%'
                  }}
                />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: 'var(--accent)', minWidth: '36px', textAlign: 'right' }}>70%</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>Columns above this threshold are dropped</p>
            </div>

            {/* Gender encoding */}
            <div>
              <label style={LABEL_STYLE}>Gender encoding</label>
              <select name="gender_mode" style={SELECT_STYLE} defaultValue="keep_text">
                <option value="keep_text">Keep text (male / female)</option>
                <option value="binary">Binary (0/1 single column)</option>
                <option value="onehot">One-hot (gender_female / gender_male)</option>
              </select>
            </div>

            {/* Country encoding */}
            <div>
              <label style={LABEL_STYLE}>Country encoding</label>
              <select name="country_mode" style={SELECT_STYLE} defaultValue="keep_text">
                <option value="keep_text">Keep text (country names)</option>
                <option value="label">Label-encode (1, 2, 3…)</option>
                <option value="onehot">One-hot encode countries</option>
              </select>
            </div>

            {/* Numeric imputation */}
            <div>
              <label style={LABEL_STYLE}>Numeric imputation</label>
              <select name="numeric_impute" style={SELECT_STYLE} defaultValue="median">
                <option value="median">Median</option>
                <option value="mean">Mean</option>
                <option value="mode">Mode</option>
                <option value="zero">Zero / constant 0</option>
                <option value="knn">KNN (k=5)</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>Used when Fill missing values is on</p>
            </div>

            {/* Categorical imputation */}
            <div>
              <label style={LABEL_STYLE}>Categorical imputation</label>
              <select name="categorical_impute" style={SELECT_STYLE} defaultValue="mode">
                <option value="mode">Mode (most frequent)</option>
                <option value="missing_label">Explicit &quot;Missing&quot; label</option>
                <option value="empty">Leave as empty / NA</option>
              </select>
            </div>

            {/* Boolean imputation */}
            <div>
              <label style={LABEL_STYLE}>Boolean imputation</label>
              <select name="boolean_impute" style={SELECT_STYLE} defaultValue="mode">
                <option value="mode">Mode (most common True/False)</option>
                <option value="false">Fill with False</option>
                <option value="true">Fill with True</option>
                <option value="missing_class">Create &quot;Missing&quot; class</option>
                <option value="delete_rows">Delete rows with missing boolean</option>
                <option value="empty">Leave as NA</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>For True/False columns when Fill missing is on</p>
            </div>

            {/* Text case */}
            <div>
              <label style={LABEL_STYLE}>Text case standardisation</label>
              <select name="text_case" style={SELECT_STYLE} defaultValue="none">
                <option value="none">Keep as-is</option>
                <option value="lower">lowercase</option>
                <option value="upper">UPPERCASE</option>
                <option value="title">Title Case</option>
              </select>
            </div>

            {/* Outlier detection engine */}
            <div>
              <label style={LABEL_STYLE}>Outlier detection</label>
              <select name="outlier_engine" style={SELECT_STYLE} defaultValue="iqr">
                <option value="iqr">IQR (interquartile range)</option>
                <option value="zscore">Z-score</option>
                <option value="modified_z">Modified Z-score</option>
                <option value="isolation_forest">Isolation Forest</option>
              </select>
            </div>

            {/* Outlier method / action */}
            <div>
              <label style={LABEL_STYLE}>Outlier action</label>
              <select name="outlier_method" style={SELECT_STYLE}>
                <option value="clip">Clip / cap</option>
                <option value="winsorize">Winsorize</option>
                <option value="remove">Remove rows</option>
                <option value="flag">Flag only</option>
                <option value="to_nan">Set to NaN (then impute)</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>Growth/return % columns prefer winsorize when clipping</p>
            </div>

            {/* Scaler */}
            <div>
              <label style={LABEL_STYLE}>Scaler</label>
              <select name="scaler_choice" style={{ ...SELECT_STYLE, opacity: scaleForExport ? 1 : 0.4, cursor: scaleForExport ? 'pointer' : 'not-allowed' }} disabled={!scaleForExport}>
                <option value="standard">Standard (Z-score)</option>
                <option value="minmax">Min-Max [0, 1]</option>
                <option value="robust">Robust (IQR)</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>Enable &quot;Scale features on export&quot; above to activate</p>
            </div>

            {/* Encoding extras */}
            <div>
              <label style={LABEL_STYLE}>High-cardinality encoding</label>
              <select name="high_card_encoding" style={SELECT_STYLE} defaultValue="onehot_limit">
                <option value="onehot_limit">One-hot (top categories only)</option>
                <option value="frequency">Frequency encoding</option>
                <option value="ordinal">Ordinal / label encode</option>
              </select>
            </div>

            {/* Data modality */}
            <div>
              <label style={LABEL_STYLE}>Data modality</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {['Tabular (CSV / Excel)', 'Images (folder paths / zip metadata)', 'Mixed tabular + image paths'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--ink-2)' }}>
                    <input type="radio" name="data_modality" value={opt} defaultChecked={opt === 'Tabular (CSV / Excel)'} style={{ accentColor: 'var(--accent)' }} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 3: ML task + EDA target ── */}
          <div className="glass-panel" style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <CardHeading>ML task &amp; model</CardHeading>

            <div>
              <label style={LABEL_STYLE}>Learning type</label>
              <select
                name="ml_family"
                style={SELECT_STYLE}
                value={mlFamily}
                onChange={e => setMlFamily(e.target.value)}
              >
                {Object.keys(TASK_OPTIONS).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={LABEL_STYLE}>Specific task</label>
              <select name="ml_task" style={SELECT_STYLE}>
                {(TASK_OPTIONS[mlFamily] ?? []).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={LABEL_STYLE}>Model family</label>
              <select name="model_family" style={SELECT_STYLE}>
                {[
                  'Tree ensembles (XGBoost / LightGBM / Random Forest)',
                  'Linear / Logistic / Ridge / Lasso',
                  'SVM / KNN',
                  'Neural Networks (MLP / deep tabular)',
                  'Unsupervised (K-Means / PCA / Isolation Forest)',
                  'Not sure yet',
                ].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>Affects scaling advice in the ML checklist</p>
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />

            <div>
              <label style={LABEL_STYLE}>Target column (EDA / ML)</label>
              <input
                id="target"
                type="text"
                placeholder="e.g. is_active, price, label…"
                style={{ ...SELECT_STYLE, fontFamily: "'JetBrains Mono', monospace", cursor: 'text' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>Required for supervised tasks. Leave blank for unsupervised / exploratory.</p>
            </div>
          </div>
        </div>

        {/* Message area */}
        


        {/* ── Results ─────────────────────────────────────────── */}
        <section
          id="results"
          className="hidden"
          style={{ marginTop: '0.75rem' }}
        >
          {/* Results divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}
            >
              Results
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Top-level metrics — kept outside the preview panels so they never collapse with a tab. */}
          {/* Download */}
          <div className="cr-download-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(240,106,29,0.25)', background: 'linear-gradient(90deg, rgba(240,106,29,0.08), transparent)' }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.2rem' }}>Cleaned dataset ready</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-2)' }}>One export of your cleaned CSV — primary download action</div>
            </div>
            <a
              id="download-link"
              href="#"
              className="cr-download-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                fontSize: '0.875rem',
                background: 'linear-gradient(135deg, #f06a1d, #ff8a3d)',
                color: '#1a0d04',
                padding: '0.7rem 1.35rem',
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(240,106,29,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                flexShrink: 0,
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(240,106,29,0.45)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 28px rgba(240,106,29,0.35)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download clean dataset
            </a>
          </div>

          {/*
            IMPORTANT:
            There are deliberately NO result tabs here.
            Every result container stays in normal document flow so the page cannot
            collapse into a single tiny/hidden panel. The existing JS hooks/IDs are
            preserved exactly for compatibility.
          */}
          <div className="results-stack" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            {/* Before vs After dashboard: pie | tables | pie */}
            <div
              className="ba-dashboard"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(150px, 200px) minmax(0, 1fr) minmax(150px, 200px)',
                gap: '0.65rem',
                alignItems: 'stretch',
              }}
            >
              {/* LEFT: Before quality pie (filled by bridge from real raw_profile) */}
              <div className="glass-panel" style={{ padding: '0.75rem', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ ...LABEL_STYLE, marginBottom: '0.35rem', color: 'var(--ink-3)' }}>Before quality</div>
                <div id="quality-before-pie" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <p className="muted-copy" style={{ fontSize: '0.78rem', color: 'var(--ink-3)', textAlign: 'center' }}>Run clean to see raw data quality</p>
                </div>
                <div id="quality-before-stats" style={{ fontSize: '0.72rem', color: 'var(--ink-3)', marginTop: '0.35rem' }} />
              </div>

              {/* CENTER: Before table → After table */}
              <div
                className="compare-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '0.5rem',
                  alignItems: 'stretch',
                  minWidth: 0,
                }}
              >
                <div className="glass-panel" style={{ overflow: 'hidden', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <div>
                      <div style={{ ...LABEL_STYLE, marginBottom: '0.1rem', color: 'var(--ink-3)' }}>Before · Raw</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)' }}>Original upload</div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--ink-3)', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.45rem', borderRadius: '5px' }}>SOURCE</span>
                  </div>
                  <div id="raw-content" style={{ display: 'block', padding: '0.55rem 0.65rem', overflowX: 'auto', overflowY: 'visible', minWidth: 0, flex: 1 }} />
                </div>

                <div className="compare-arrow" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="rgba(240,106,29,0.15)" stroke="#f06a1d" strokeWidth="1.5"/>
                    <path d="M8 12h8M13 8l4 4-4 4" stroke="#f06a1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="glass-panel" style={{ overflow: 'hidden', minWidth: 0, display: 'flex', flexDirection: 'column', borderColor: 'rgba(240,106,29,0.35)' }}>
                  <div style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', background: 'rgba(240,106,29,0.06)' }}>
                    <div>
                      <div style={{ ...LABEL_STYLE, marginBottom: '0.1rem', color: 'var(--accent)' }}>After · Cleaned</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ink-3)' }}>Post-processing</div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace", background: 'var(--accent-dim)', padding: '0.2rem 0.45rem', borderRadius: '5px' }}>PROCESSED</span>
                  </div>
                  <div style={{ padding: '0.55rem 0.65rem', overflowX: 'auto', overflowY: 'visible', minWidth: 0, flex: 1 }}>
                    <div className="table-wrap" style={{ width: '100%', overflowX: 'auto' }}>
                      <table id="preview-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '360px' }}>
                        <thead id="table-head" />
                        <tbody id="table-body" />
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: After quality pie */}
              <div className="glass-panel" style={{ padding: '0.75rem', minWidth: 0, display: 'flex', flexDirection: 'column', borderColor: 'rgba(240,106,29,0.3)' }}>
                <div style={{ ...LABEL_STYLE, marginBottom: '0.35rem', color: 'var(--accent)' }}>After quality</div>
                <div id="quality-after-pie" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                  <p className="muted-copy" style={{ fontSize: '0.78rem', color: 'var(--ink-3)', textAlign: 'center' }}>Run clean to see cleaned quality</p>
                </div>
                <div id="quality-after-stats" style={{ fontSize: '0.72rem', color: 'var(--ink-3)', marginTop: '0.35rem' }} />
              </div>
            </div>

            {/* KPI strip from real readiness / report */}
            <div className="glass-panel" style={{ padding: '0.65rem 0.85rem', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>
                  Run summary
                </div>
              </div>
              <div id="metric-grid" style={{ width: '100%' }} />
            </div>

            {/* Profile + EDA side-by-side (dense analytics row) */}
            {/* Profile + EDA (left, height-capped) | Charts (right, fills empty space) */}

            {/* Overview analytics — filled by bridge from real /api/clean payload */}
            <div id="overview-content" style={{ display: 'none', marginBottom: '0.75rem', width: '100%' }} />

            <div
              className="results-mid-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.65rem',
                alignItems: 'stretch',
                width: '100%',
              }}
            >
              <div className="glass-panel" style={{ overflow: 'visible', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.45rem 0.7rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                  <div style={{ ...LABEL_STYLE, marginBottom: 0 }}>Data profile</div>
                </div>
                <div id="profile-content" style={{ display: 'block', padding: '0.5rem 0.65rem', minWidth: 0, overflow: 'visible', flex: 1 }} />
              </div>
              <div className="glass-panel" style={{ overflow: 'visible', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.45rem 0.7rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                  <div style={{ ...LABEL_STYLE, marginBottom: 0 }}>EDA summary</div>
                </div>
                <div id="eda-content" style={{ display: 'block', padding: '0.5rem 0.65rem', minWidth: 0, overflow: 'visible', flex: 1 }} />
              </div>
            </div>

            <div className="glass-panel" style={{ overflow: 'visible', minWidth: 0, marginTop: '0.65rem', width: '100%' }}>
              <div style={{ padding: '0.45rem 0.7rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ ...LABEL_STYLE, marginBottom: 0 }}>Analytics · charts</div>
                <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
              </div>
              <div
                id="graphs-content"
                style={{
                  display: 'block',
                  padding: '0.65rem',
                  minWidth: 0,
                  overflow: 'visible',
                  width: '100%',
                }}
              />
            </div>
          </div>
        </section>

        {/* ── Computer Vision (Premium) ─────────────────────── */}
        <div
          className="glass-panel"
          style={{
            marginTop: '2rem',
            padding: '0.9rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-3)',
                  marginBottom: '0.25rem',
                }}
              >
                Computer vision
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--ink-2)', margin: 0 }}>
                Separate from tabular cleaning. Upload an image ZIP → RGB 224×224 metadata for CNN training.
              </p>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'var(--surface-3)',
                color: 'var(--ink-3)',
                border: '1px solid var(--border-bright)',
                padding: '0.25rem 0.625rem',
                borderRadius: '5px',
              }}
            >
              Premium only
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="cv-controls">
            <div>
              <label style={LABEL_STYLE}>CV model / task family</label>
              <select
                value={cvFamily}
                onChange={e => setCvFamily(e.target.value)}
                style={SELECT_STYLE}
              >
                {(TASK_OPTIONS['Computer Vision (Images / CNN)'] ?? [
                  'Image Classification (CNN)',
                  'Object Detection',
                  'Image Segmentation',
                  'Tabular + Image multimodal',
                ]).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>
                Independent from the tabular ML task above.
              </p>
            </div>
            <div>
              <label style={LABEL_STYLE}>Image dataset (ZIP)</label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1rem',
                  background: 'var(--surface-2)',
                  border: '1px dashed var(--border-bright)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                  minHeight: '42px',
                }}
                onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--ink-3)')}
                onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ fontSize: '0.875rem', color: 'var(--ink-3)' }} id="cv-file-label">
                  Choose image ZIP…
                </span>
                <input
                  id="cv-input"
                  type="file"
                  accept=".zip"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const name = e.target.files?.[0]?.name
                    const el = document.getElementById('cv-file-label')
                    if (el) el.textContent = name || 'Choose image ZIP…'
                  }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="cv-controls">
            <div>
              <label style={LABEL_STYLE}>Default class label (optional)</label>
              <input
                type="text"
                value={cvDefaultClass}
                onChange={e => setCvDefaultClass(e.target.value)}
                placeholder="e.g. drafter_1 — applied when no folder/CSV label"
                style={{ ...SELECT_STYLE, cursor: 'text' }}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>
                Every image gets a class_label. Folders, labels.csv, or filename prefixes win first.
              </p>
            </div>
            <div>
              <label style={LABEL_STYLE}>labels.csv text (optional)</label>
              <textarea
                value={cvLabelsText}
                onChange={e => setCvLabelsText(e.target.value)}
                placeholder={"filename,class\nimg001.jpg,good\nimg002.jpg,bad"}
                rows={3}
                style={{ ...SELECT_STYLE, cursor: 'text', resize: 'vertical', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem' }}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--ink-3)', marginTop: '0.3rem' }}>
                Or put labels.csv inside the ZIP (columns: filename, class).
              </p>
            </div>
          </div>

          <button
            type="button"
            id="cv-convert-button"
            disabled={cvBusy}
            onClick={() => void convertCv()}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: cvBusy ? 'var(--surface-3)' : 'linear-gradient(135deg, #f5a623, #f06a1d)',
              color: '#1a0d04',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.95rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '10px',
              cursor: cvBusy ? 'wait' : 'pointer',
              marginBottom: '1rem',
              opacity: cvBusy ? 0.7 : 1,
            }}
          >
            {cvBusy ? 'Converting…' : 'Convert to metadata for CNN training →'}
          </button>

          <div
            id="cv-message"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.78rem',
              color: 'var(--ink-3)',
              marginBottom: cvMeta ? '0.75rem' : 0,
            }}
          >
            {cvMeta?.message}
            {typeof cvMeta?.images_processed === 'number' && (
              <span>
                {' '}· {cvMeta.images_processed} processed
                {typeof cvMeta.images_failed === 'number' ? ` / ${cvMeta.images_failed} failed` : ''}
                {cvMeta.image_size ? ` · ${cvMeta.image_size[0]}×${cvMeta.image_size[1]}` : ''}
              </span>
            )}
          </div>

          {cvMeta && (typeof cvMeta.ready_for_training === 'boolean') && (
            <div
              id="cv-readiness"
              style={{
                marginBottom: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: `1px solid ${cvMeta.ready_for_training ? 'rgba(240,106,29,0.35)' : 'rgba(240,113,120,0.35)'}`,
                background: cvMeta.ready_for_training ? 'rgba(240,106,29,0.08)' : 'rgba(240,113,120,0.08)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: cvMeta.ready_for_training ? 'var(--accent)' : '#f07178', marginBottom: '0.35rem' }}>
                {cvMeta.ready_for_training ? 'Ready for training' : 'Not ready for training yet'}
                {cvMeta.task ? ` · ${cvMeta.task}` : ''}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ink-2)', fontFamily: "'JetBrains Mono', monospace" }}>
                {typeof cvMeta.train_count === 'number' && (
                  <span>train={cvMeta.train_count} · val={cvMeta.val_count ?? 0} · </span>
                )}
                {cvMeta.classes && cvMeta.classes.length > 0 && (
                  <span>classes=[{cvMeta.classes.join(', ')}] · </span>
                )}
                {typeof cvMeta.annotation_files_found === 'number' && (
                  <span>annotations={cvMeta.annotation_files_found}</span>
                )}
              </div>
              {cvMeta.guidance && cvMeta.guidance.length > 0 && (
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem', color: 'var(--ink-2)', fontSize: '0.8rem' }}>
                  {cvMeta.guidance.map((g, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{g}</li>
                  ))}
                </ul>
              )}
              {cvMeta.missing_for_training && cvMeta.missing_for_training.length > 0 && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#f07178' }}>
                  Missing: {cvMeta.missing_for_training.join(', ')}
                </div>
              )}
            </div>
          )}

          {cvMeta?.download_url && (
            <a
              id="cv-download-link"
              href={cvMeta.download_url}
              download="cleanroom-cv-224.zip"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: 'var(--accent)',
                color: '#1a0d04',
                padding: '0.7rem 1.15rem',
                borderRadius: '10px',
                textDecoration: 'none',
                marginBottom: '1rem',
                boxShadow: '0 4px 16px rgba(240,106,29,0.2)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV dataset (ZIP · 224×224 + metadata.csv)
            </a>
          )}

          {cvMeta?.preview_images && cvMeta.preview_images.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ ...LABEL_STYLE, marginBottom: '0.6rem' }}>224×224 RGB previews</div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {cvMeta.preview_images.filter((img) => {
                  const url = img.data_url || ''
                  if (!url.startsWith('data:image/')) return false
                  const n = (img.name || img.original_path || '').toLowerCase()
                  // allow if named like an image OR data-url is present (processed files are always images)
                  return true
                }).map((img, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ background: '#3d332a', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img
                        src={img.data_url}
                        alt={img.name}
                        width={224}
                        height={224}
                        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', imageRendering: 'auto' }}
                      />
                    </div>
                    <div
                      style={{
                        padding: '0.35rem 0.45rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.62rem',
                        color: 'var(--ink-3)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={img.original_path || img.name}
                    >
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cvMeta?.manifest_preview?.rows && cvMeta.manifest_preview.rows.length > 0 && (
            <div>
              <div style={{ ...LABEL_STYLE, marginBottom: '0.6rem' }}>Metadata manifest (preview)</div>
              <div className="table-wrap" style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      {(cvMeta.manifest_preview.columns || Object.keys(cvMeta.manifest_preview.rows[0] || {})).map(col => (
                        <th
                          key={col}
                          style={{
                            textAlign: 'left',
                            padding: '0.5rem 0.65rem',
                            borderBottom: '1px solid var(--border)',
                            color: 'var(--ink-3)',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cvMeta.manifest_preview.rows.slice(0, 10).map((row, ri) => (
                      <tr key={ri}>
                        {(cvMeta.manifest_preview?.columns || Object.keys(row)).map(col => (
                          <td
                            key={col}
                            style={{
                              padding: '0.45rem 0.65rem',
                              borderBottom: '1px solid var(--border)',
                              color: 'var(--ink-2)',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.72rem',
                            }}
                          >
                            {String((row as Record<string, unknown>)[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.72rem',
            color: 'var(--ink-3)',
            letterSpacing: '0.04em',
          }}
        >
          Cleanroom · data quality workspace · plan selection is local preview only
        </p>
      </footer>


      {/* Gemini-generated charts */}
      <section id="gemini-tools" className="cr-page" style={{ paddingTop: 0, paddingBottom: '1.5rem' }}>
        <div className="glass-panel" id="gemini-charts-panel" style={{ padding: '1rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.35rem' }}>Gemini charts</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-3)', marginBottom: '0.55rem' }}>Ask Gemini for a pie, bar, line, scatter, or histogram of real columns.</p>
          {geminiCharts.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', padding: '1.5rem 0', textAlign: 'center' }}>No charts yet. Ask Gemini to visualize a column after cleaning.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '0.75rem' }}>
              {geminiCharts.map((ch, idx) => (
                <div key={idx} className="chart-block" style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '0.65rem', background: 'var(--surface-2)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 650, marginBottom: '0.4rem', color: 'var(--ink)' }}>{ch.title || ch.type || 'Chart'}</div>
                  {!ch.ok ? <p style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{ch.error || 'Could not build chart'}</p> : ch.type === 'pie' ? <GeminiPie labels={ch.labels || []} values={ch.values || []} /> : ch.type === 'scatter' ? <GeminiScatter points={ch.points || []} x={ch.x} y={ch.y} /> : <GeminiBars labels={ch.labels || []} values={ch.values || []} kind={ch.type} />}
                </div>
              ))}
            </div>
          )}
          {geminiCharts.length > 0 && <button type="button" onClick={() => setGeminiCharts([])} style={{ marginTop: '0.75rem', fontSize: '0.72rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--ink-3)', borderRadius: 8, padding: '0.35rem 0.65rem', cursor: 'pointer' }}>Clear charts</button>}
        </div>
      </section>

      {/* Grok chat */}
      <button
        type="button"
        onClick={() => setGeminiOpen(v => !v)}
        title="Ask Gemini"
        style={{
          position: 'fixed', right: 18, bottom: 18, zIndex: 10000,
          height: 52, padding: '0 1.1rem', borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #f06a1d, #f5a623)', color: '#1a0d04',
          fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 8px 28px rgba(240,106,29,0.35)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        ✦ Ask Gemini
      </button>
      {geminiOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed', right: 18, bottom: 84, zIndex: 10000,
            width: 'min(380px, calc(100vw - 24px))', height: 'min(520px, 70vh)',
            borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)' }}>
            <div>
              <strong style={{ fontSize: '0.92rem' }}>Ask Gemini</strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent)', marginLeft: 6 }}>· {geminiStatus}</span>
            </div>
            <button type="button" onClick={() => setGeminiOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ padding: '0.55rem 0.85rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
            <label style={{ fontSize: '0.68rem', color: 'var(--accent)', display: 'block', marginBottom: 4 }}>Your Gemini API key (saved to your account)</label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={e => setGeminiApiKey(e.target.value)}
              placeholder="AIza... from aistudio.google.com/apikey"
              style={{ width: '100%', padding: '0.4rem 0.55rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--ink)', fontSize: '0.8rem' }}
            />
            <div style={{ fontSize: '0.68rem', color: 'var(--ink-3)', marginTop: 4 }}>
              Get a free key at aistudio.google.com/apikey · saved per user when logged in
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: 6, lineHeight: 1.35 }}>
              💡 For feature engineering (e.g. add <strong>Total_revenue</strong> = quantity × price), ask Gemini — Normal/Premium plans.
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {geminiMessages.map((m, i) => (
              <div
                key={i}
                style={{
                  maxWidth: '92%',
                  padding: '0.55rem 0.7rem',
                  borderRadius: 12,
                  fontSize: '0.84rem',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.err ? 'rgba(240,113,120,0.12)' : m.role === 'user' ? 'rgba(240,106,29,0.12)' : 'var(--surface-2)',
                  border: m.err ? '1px solid rgba(240,113,120,0.3)' : '1px solid var(--border)',
                  color: m.err ? '#f07178' : 'var(--ink)',
                }}
              >
                {m.content}
              </div>
            ))}
            {geminiBusy && (
              <div
                style={{
                  maxWidth: '92%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 12,
                  fontSize: '0.84rem',
                  alignSelf: 'flex-start',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    gap: 4,
                    alignItems: 'center',
                  }}
                  aria-label="Gemini is typing"
                >
                  <span className="gemini-dot" />
                  <span className="gemini-dot" />
                  <span className="gemini-dot" />
                </span>
                <span style={{ fontWeight: 600 }}>Gemini is typing…</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', padding: '0.65rem', borderTop: '1px solid var(--border)' }}>
            <textarea
              value={geminiInput}
              onChange={e => setGeminiInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void sendGemini()
                }
              }}
              rows={2}
              placeholder="e.g. Add Total_revenue = quantity * price"
              style={{ flex: 1, resize: 'none', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--ink)', padding: '0.5rem 0.65rem', font: 'inherit' }}
            />
            <button type="button" disabled={geminiBusy} onClick={() => void sendGemini()} style={{ border: 'none', borderRadius: 10, background: 'var(--accent)', color: '#1a0d04', fontWeight: 750, padding: '0 0.9rem', cursor: 'pointer', opacity: geminiBusy ? 0.5 : 1 }}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 1100px) {
          .settings-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .workspace-top { grid-template-columns: 1fr !important; }
          .settings-grid { grid-template-columns: 1fr !important; }
          .cv-controls { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .plans-grid { grid-template-columns: 1fr !important; }
        }
        #run-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }
        #run-button:not(:disabled):hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(240,106,29,0.3);
        }
        #run-button:not(:disabled):active {
          transform: translateY(0);
        }
      `}</style>
        </div>{/* cr-main */}
      </div>{/* cr-shell */}
    </div>
  )
}
