/**
 * Cleanroom vanilla bridge — same logic as your app.js, runs after React mounts.
 * Loaded by main.tsx once #file-input and #run-button exist.
 */
(function () {

(function injectExtremeUI(){
  if (document.getElementById('cr-extreme-ui')) return;
  var st = document.createElement('style');
  st.id = 'cr-extreme-ui';
  st.textContent = `
/* === CLEANROOM EXTREME UI (visual only) === */
.theme-dark {
  --cr-bg: #08080c;
  --cr-surface: #111116;
  --cr-elevated: #16161d;
  --cr-border: rgba(255,255,255,0.09);
  --cr-accent: #f06a1d;
  --cr-ink: #f4f4f5;
  --cr-muted: #a1a1aa;
}
.theme-light {
  --cr-bg: #f4f2ee;
  --cr-surface: #ffffff;
  --cr-elevated: #faf9f7;
  --cr-border: rgba(0,0,0,0.08);
  --cr-accent: #e85d12;
  --cr-ink: #16120f;
  --cr-muted: #5c534a;
}
.theme-dark, .theme-dark.dashboard-container, .theme-dark .cr-main {
  background: var(--cr-bg) !important;
  background-image:
    radial-gradient(ellipse 70% 45% at 100% -5%, rgba(240,106,29,0.09), transparent 55%),
    radial-gradient(ellipse 40% 30% at 0% 100%, rgba(80,60,140,0.05), transparent 50%) !important;
}
.theme-light, .theme-light.dashboard-container, .theme-light .cr-main {
  background: var(--cr-bg) !important;
  background-image: none !important;
  color: var(--cr-ink) !important;
}
.theme-dark .glass-panel,
.theme-dark .chart-block,
.theme-dark .eda-card,
.theme-dark .ov-card,
.theme-dark .ov-kpi,
.theme-dark .metric {
  background: var(--cr-surface) !important;
  border: 1px solid var(--cr-border) !important;
  border-radius: 14px !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.3) !important;
  backdrop-filter: none !important;
}
.theme-light .glass-panel,
.theme-light .chart-block,
.theme-light .eda-card {
  background: #fff !important;
  border: 1px solid var(--cr-border) !important;
  border-radius: 14px !important;
  box-shadow: 0 8px 28px rgba(0,0,0,0.06) !important;
  color: var(--cr-ink) !important;
}
.theme-dark .glass-panel::before { display: none !important; }
.theme-dark .cr-sidebar {
  background: #0c0c10 !important;
  border-right: 1px solid var(--cr-border) !important;
}
.theme-light .cr-sidebar {
  background: #fff !important;
  border-right: 1px solid var(--cr-border) !important;
}
.theme-dark .cr-topbar {
  background: rgba(8,8,12,0.9) !important;
  backdrop-filter: blur(14px) !important;
  border-bottom: 1px solid var(--cr-border) !important;
}
.theme-light .cr-topbar {
  background: rgba(255,255,255,0.95) !important;
  border-bottom: 1px solid var(--cr-border) !important;
}
/* Selects — theme correct */
.theme-dark select,
.theme-dark input:not([type=checkbox]):not([type=range]),
.theme-dark textarea {
  background: #0c0c10 !important;
  color: #f4f4f5 !important;
  border: 1px solid var(--cr-border) !important;
  border-radius: 10px !important;
}
.theme-dark select option {
  background: #111116 !important;
  color: #f4f4f5 !important;
}
.theme-light select,
.theme-light input:not([type=checkbox]):not([type=range]),
.theme-light textarea {
  background: #fff !important;
  color: #16120f !important;
  border: 1px solid var(--cr-border) !important;
  border-radius: 10px !important;
}
.theme-light select option {
  background: #fff !important;
  color: #16120f !important;
}
.theme-dark select:focus,
.theme-dark input:focus,
.theme-light select:focus,
.theme-light input:focus {
  border-color: rgba(240,106,29,0.5) !important;
  box-shadow: 0 0 0 3px rgba(240,106,29,0.15) !important;
  outline: none !important;
}
/* Primary CTA */
#run-button {
  background: linear-gradient(135deg, #f06a1d, #ff8a3d) !important;
  color: #1a0d04 !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  box-shadow: 0 10px 32px rgba(240,106,29,0.35) !important;
  transition: transform .2s, box-shadow .2s !important;
}
#run-button:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 14px 36px rgba(240,106,29,0.45) !important;
}
/* One download bar */
.cr-download-bar { width: 100%; }
a#download-link.cr-download-btn,
a#download-link {
  /* only the primary bar link should look primary; hide extras */
}
/* Tables */
.theme-dark thead th {
  position: sticky; top: 0; z-index: 1;
  background: #14141a !important;
  font-size: 0.7rem; letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--cr-muted) !important;
  border-bottom: 1px solid var(--cr-border) !important;
}
.theme-light thead th {
  background: #f4f2ee !important;
  color: var(--cr-muted) !important;
}
.theme-dark tbody tr:hover td { background: rgba(240,106,29,0.05) !important; }
.theme-light tbody tr:hover td { background: rgba(232,93,18,0.06) !important; }
/* Charts density */
#graphs-content .eda-grid,
#graphs-content .charts-grid {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 0.75rem !important;
  width: 100% !important;
}
@media (min-width: 1200px) {
  #graphs-content .eda-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  }
}
#graphs-content .chart-block {
  min-height: 200px !important;
  transition: border-color .2s;
}
#graphs-content .chart-block:hover {
  border-color: rgba(240,106,29,0.25) !important;
}
/* Typography */
.theme-dark h1, .theme-dark h2, .theme-dark h3 {
  letter-spacing: -0.03em;
}
.theme-dark .chart-heading span,
.theme-dark .muted-copy {
  color: var(--cr-accent) !important;
}
/* EDA tabs */
.eda-tab {
  transition: all .2s !important;
  border-radius: 9px !important;
}
.eda-tab.active {
  background: rgba(240,106,29,0.16) !important;
  border-color: rgba(240,106,29,0.4) !important;
  color: #f06a1d !important;
}
/* Scrollbar */
.theme-dark ::-webkit-scrollbar { width: 8px; height: 8px; }
.theme-dark ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
/* Motion */
@media (prefers-reduced-motion: no-preference) {
  .glass-panel, .chart-block {
    animation: crUp .35s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes crUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: none; }
  }
}
/* Hide any leftover duplicate download text links in results except bar */
#metric-grid + a#download-link,
.results-stack a#download-link:not(.cr-download-btn) {
  /* keep first primary only if classed */
}
`;
  document.head.appendChild(st);
})();



(function injectPremiumUI(){
  if (document.getElementById('cr-premium-ui')) return;
  var st = document.createElement('style');
  st.id = 'cr-premium-ui';
  st.textContent = [
    /* Design tokens */
    '.theme-dark{--cr-bg:#08080c;--cr-surface:#111116;--cr-surface-2:#16161d;--cr-border:rgba(255,255,255,0.09);--cr-accent:#f06a1d;--cr-ink:#f4f4f5;--cr-muted:#a1a1aa}',
    '.theme-dark,.theme-dark.dashboard-container,.theme-dark .cr-main{background:var(--cr-bg)!important;background-image:radial-gradient(ellipse 80% 50% at 100% -10%,rgba(240,106,29,0.07),transparent 55%)!important}',
    /* Panels */
    '.theme-dark .glass-panel,.theme-dark .chart-block,.theme-dark .eda-card,.theme-dark .ov-card,.theme-dark .ov-kpi{',
    'background:var(--cr-surface)!important;background-color:var(--cr-surface)!important;',
    'border:1px solid var(--cr-border)!important;border-radius:14px!important;',
    'box-shadow:0 12px 40px rgba(0,0,0,0.35)!important;',
    'backdrop-filter:none!important;-webkit-backdrop-filter:none!important;',
    'transition:border-color .2s ease,box-shadow .25s ease}',
    '.theme-dark .glass-panel:hover{border-color:rgba(255,255,255,0.14)!important}',
    '.theme-dark .glass-panel::before{display:none!important}',
    /* Sidebar / topbar */
    '.theme-dark .cr-sidebar{background:#0c0c10!important;border-right:1px solid var(--cr-border)!important}',
    '.theme-dark .cr-topbar{background:rgba(8,8,12,0.92)!important;backdrop-filter:blur(12px)!important;border-bottom:1px solid var(--cr-border)!important}',
    /* Typography */
    '.theme-dark h1,.theme-dark h2,.theme-dark h3{letter-spacing:-0.025em}',
    '.theme-dark .chart-heading strong{font-weight:650;color:var(--cr-ink)!important}',
    '.theme-dark .chart-heading span,.theme-dark .muted-copy{color:var(--cr-accent)!important;opacity:0.9}',
    /* Primary button */
    '#run-button,.theme-dark button.primary{',
    'background:linear-gradient(135deg,#f06a1d,#ff8a3d)!important;',
    'color:#1a0d04!important;border:none!important;border-radius:10px!important;',
    'font-weight:650!important;box-shadow:0 8px 28px rgba(240,106,29,0.32)!important;',
    'transition:transform .2s ease,box-shadow .2s ease!important}',
    '#run-button:hover{transform:translateY(-1px)!important;box-shadow:0 12px 32px rgba(240,106,29,0.42)!important}',
    /* Upload zone */
    '.theme-dark [class*="drop"],.theme-dark .upload-zone,.theme-dark #drop-zone{',
    'border:1.5px dashed rgba(240,106,29,0.35)!important;border-radius:14px!important;',
    'transition:border-color .2s,background .2s}',
    /* Tables */
    '.theme-dark table{border-collapse:separate;border-spacing:0;width:100%}',
    '.theme-dark thead th{position:sticky;top:0;background:#14141a!important;z-index:1;',
    'font-size:0.72rem;letter-spacing:0.04em;text-transform:uppercase;color:var(--cr-muted)!important;',
    'border-bottom:1px solid var(--cr-border)!important;padding:0.55rem 0.65rem!important}',
    '.theme-dark tbody td{padding:0.45rem 0.65rem!important;border-bottom:1px solid rgba(255,255,255,0.04)!important;',
    'font-size:0.82rem;font-variant-numeric:tabular-nums}',
    '.theme-dark tbody tr:hover td{background:rgba(240,106,29,0.04)!important}',
    /* Inputs */
    '.theme-dark select,.theme-dark input:not([type=checkbox]):not([type=range]){',
    'background:#0a0a0e!important;border:1px solid var(--cr-border)!important;border-radius:8px!important;',
    'color:var(--cr-ink)!important;transition:border-color .2s,box-shadow .2s}',
    '.theme-dark select:focus,.theme-dark input:focus{border-color:rgba(240,106,29,0.5)!important;',
    'box-shadow:0 0 0 3px rgba(240,106,29,0.15)!important;outline:none!important}',
    /* EDA tabs */
    '.eda-tab{transition:background .2s,border-color .2s,color .2s!important}',
    '.eda-tab.active{box-shadow:0 0 0 1px rgba(240,106,29,0.3)!important}',
    /* Density */
    '.eda-grid{gap:0.75rem!important}',
    '.charts-grid{gap:0.75rem!important}',
    /* Micro motion */
    '@media (prefers-reduced-motion:no-preference){',
    '.glass-panel,.chart-block,.eda-card{animation:crFadeUp .4s cubic-bezier(.22,1,.36,1) both}',
    '@keyframes crFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '}',
    /* Scrollbar */
    '.theme-dark ::-webkit-scrollbar{width:8px;height:8px}',
    '.theme-dark ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px}',
    '.theme-dark ::-webkit-scrollbar-track{background:transparent}'
  ].join('');
  document.head.appendChild(st);
})();



(function(){
  function paintBlack(){
    var id = 'cr-pure-black';
    var old = document.getElementById(id);
    if (old) old.remove();
    var st = document.createElement('style');
    st.id = id;
    st.textContent = [
      '.theme-dark{--bg:#000!important;--surface:#000!important;--surface-2:#000!important;--surface-3:#050505!important;--glass:#000!important;--glass-strong:#000!important;--card:#000!important}',
      'html.theme-dark,body.theme-dark,.theme-dark,html:has(.theme-dark),body:has(.theme-dark),',
      '.theme-dark.dashboard-container,.dashboard-container.theme-dark,',
      '.theme-dark .cr-main,.theme-dark .cr-page,.theme-dark section,',
      '.theme-dark #workspace,.theme-dark #results,.theme-dark #plans,',
      '.theme-dark main,.theme-dark .cr-content{background:#000!important;background-color:#000!important;background-image:none!important}',
      '.theme-dark .glass-panel,.theme-dark .glass-panel *,',
      '.theme-dark [class*="glass"],.theme-dark [class*="panel"],',
      '.theme-dark .chart-block,.theme-dark .eda-card,.theme-dark .ov-card,.theme-dark .ov-kpi,',
      '.theme-dark .metric,.theme-dark .cr-sidebar,.theme-dark .cr-topbar,',
      '.theme-dark select,.theme-dark input,.theme-dark textarea,',
      '.theme-dark .hist-card,.theme-dark .eda-tab,',
      '.theme-dark div[style*="background"]{background-color:inherit}',
      '.theme-dark .glass-panel,.theme-dark .chart-block,.theme-dark .eda-card,',
      '.theme-dark .ov-card,.theme-dark .ov-kpi,.theme-dark .metric,',
      '.theme-dark .cr-sidebar,.theme-dark .cr-topbar,',
      '.theme-dark #results .glass-panel,.theme-dark #workspace .glass-panel,',
      '.theme-dark .plans-teaser,.theme-dark .ba-dashboard > *,',
      '.theme-dark .compare-grid > *{background:#000!important;background-color:#000!important;',
      'backdrop-filter:none!important;-webkit-backdrop-filter:none!important;',
      'box-shadow:none!important;border-color:rgba(255,255,255,0.12)!important}',
      '.theme-dark .glass-panel::before,.theme-dark .glass-panel::after{display:none!important;content:none!important;opacity:0!important;background:none!important}',
      '.theme-dark select,.theme-dark input[type="text"],.theme-dark input:not([type="checkbox"]):not([type="range"]){',
      'background:#000!important;background-color:#000!important;border-color:rgba(255,255,255,0.15)!important}',
      '.theme-dark #run-button{background:linear-gradient(135deg,#f06a1d,#f5a623)!important}'
    ].join('');
    document.head.appendChild(st);
  }
  paintBlack();
  setInterval(paintBlack, 1500);
  document.addEventListener('DOMContentLoaded', paintBlack);
})();


  "use strict";

  function authHeaders() {
    try {
      var t = localStorage.getItem('cleanroom_token');
      if (t) return { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' };
    } catch (e) {}
    return { 'Content-Type': 'application/json' };
  }
  function currentToken() {
    try { return localStorage.getItem('cleanroom_token') || ''; } catch (e) { return ''; }
  }
  // Capture token from Google OAuth redirect #token=
  try {
    var hash = window.location.hash || '';
    var m = hash.match(/token=([^&]+)/);
    if (m && m[1]) {
      localStorage.setItem('cleanroom_token', decodeURIComponent(m[1]));
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  } catch (e) {}


  if (window.__cleanroomAppJsBound) return;
  window.__cleanroomAppJsBound = true;

  const planLimits = { free: 5000, basic: 100000, normal: 500000, premium: 2000000 };
  const planPrices = { free: 0, basic: 1500, normal: 3500, premium: 6000 };
  // Always sync free-plan limits from backend so UI cannot stay stuck on old 1K/10
  try {
    fetch('/api/plans').then(function (r) { return r.json(); }).then(function (d) {
      var plans = (d && d.plans) || {};
      Object.keys(plans).forEach(function (k) {
        if (plans[k] && plans[k].limit != null) planLimits[k] = plans[k].limit;
        if (plans[k] && plans[k].price_pkr != null) planPrices[k] = plans[k].price_pkr;
      });
      try { updatePlan(); } catch (e) {}
      if (planSelect) {
        var labels = {
          free: 'Free · ' + (planLimits.free >= 1000 ? Math.round(planLimits.free/1000) + 'K' : planLimits.free) + ' rows · Rs 0',
          basic: 'Basic · 100K rows · Rs 1,500/mo',
          normal: 'Normal · 500K rows · Rs 3,500/mo',
          premium: 'Premium · 2M rows · Rs 6,000/mo',
        };
        Array.prototype.forEach.call(planSelect.options, function (opt) {
          if (labels[opt.value]) opt.text = labels[opt.value];
        });
      }
    }).catch(function () {});
  } catch (e) {}
  const planFeatures = {
    free: ['fill_missing', 'deduplicate_rows'],
    basic: ['fill_missing', 'deduplicate_rows', 'gender_as_binary', 'combine_names'],
    normal: ['fill_missing', 'deduplicate_rows', 'gender_as_binary', 'combine_names', 'one_hot_encode', 'label_encode_countries', 'drop_metadata_flags', 'run_eda', 'drop_constant'],
    premium: ['fill_missing', 'deduplicate_rows', 'gender_as_binary', 'combine_names', 'one_hot_encode', 'label_encode_countries', 'drop_metadata_flags', 'run_eda', 'drop_constant', 'handle_outliers', 'ml_ready', 'scale_features', 'computer_vision'],
  };
  window.__crUser = null;

  const planSelect = document.querySelector('#plan');
  const limitText = document.querySelector('#limit-text');
  const fileInput = document.querySelector('#file-input');
  const dropzone = document.querySelector('#dropzone');
  const fileName = document.querySelector('#file-name');
  const runButton = document.querySelector('#run-button');
  const message = document.querySelector('#message');
  const results = document.querySelector('#results');
  const featureText = document.querySelector('#feature-text');
  const checkoutLink = document.querySelector('#checkout-link');
  const cvInput = document.querySelector('#cv-input');
  const cvMessage = document.querySelector('#cv-message');

  function formatNumber(value) { return new Intl.NumberFormat().format(value ?? 0); }
  
  /** Never surface HTML error pages (502 etc.) into the UI. */
  function safeErrorMessage(status, text, fallback) {
    var raw = (text == null ? '' : String(text)).trim();
    var looksHtml = /<!DOCTYPE|<html[\s>]|<head[\s>]|<body[\s>]|Bad Gateway|502 Bad Gateway|503 Service|Cloudflare/i.test(raw);
    if (looksHtml || (status >= 500 && raw.length > 280)) {
      console.error('[cleanroom] HTTP', status, 'non-JSON/HTML body length', raw.length);
      if (status === 502 || status === 503 || status === 504) {
        return 'Unable to connect to CleanRoom. The server is temporarily unavailable. Please try again in a moment.';
      }
      if (status >= 500) {
        return 'CleanRoom hit a server error (' + status + '). Please try again shortly.';
      }
      return fallback || 'Something went wrong. Please try again.';
    }
    // Try JSON detail
    try {
      var j = JSON.parse(raw);
      var d = j && (j.detail != null ? j.detail : j.message);
      if (typeof d === 'string' && d.trim()) return d.trim().slice(0, 400);
      if (Array.isArray(d) && d[0]) {
        var m = d[0].msg || d[0].message || d[0];
        if (typeof m === 'string') return m.slice(0, 400);
      }
    } catch (e) {}
    if (raw && raw.length < 400 && !looksHtml) return raw;
    return fallback || ('Request failed (' + (status || '?') + ')');
  }

  async function readResponseSafe(response) {
    var text = '';
    try { text = await response.text(); } catch (e) { text = ''; }
    var data = {};
    var ct = (response.headers && response.headers.get('content-type')) || '';
    var looksHtml = /<!DOCTYPE|<html[\s>]/i.test(text);
    if (!looksHtml && text && (ct.indexOf('json') >= 0 || text.charAt(0) === '{' || text.charAt(0) === '[')) {
      try { data = JSON.parse(text); } catch (e) { data = {}; }
    }
    return { text: text, data: data, looksHtml: looksHtml };
  }

  function setMessage(text, kind = '') {
    var safe = text;
    if (kind === 'error' && typeof text === 'string' && /<!DOCTYPE|<html[\s>]|Bad Gateway/i.test(text)) {
      safe = safeErrorMessage(502, text, 'Unable to connect to CleanRoom. Please try again.');
    }
    if (message) { message.textContent = safe; message.className = `message ${kind}`; }
  }
  function selectedFile() { return fileInput?.files?.[0] || window.__cleanroomSelectedFile || null; }

  function updatePlan() {
    if (!planSelect || !limitText || !featureText) return;
    const plan = planSelect.value;
    const dailyText = plan === 'free' ? ' · 3 attempts per day' : '';  // free: 5K rows / 3 tries
    const price = planPrices[plan] || 0;
    limitText.textContent = `Up to ${formatNumber(planLimits[plan])} rows per run${dailyText}` + (price ? ` · Rs ${formatNumber(price)}/mo` : '');
    const features = planFeatures[plan] || [];
    if (checkoutLink) {
      checkoutLink.href = '#';
      checkoutLink.onclick = function (e) {
        e.preventDefault();
        startCheckout(plan === 'free' ? 'basic' : plan);
      };
    }
    const labels = {
      free: 'Free: fill missing + dedupe (5K rows)',
      basic: 'Basic: missing, dedupe, gender text, combine names (100K)',
      normal: 'Normal: + one-hot, countries, metadata drop, EDA (500K)',
      premium: 'Premium: everything enabled (2M rows)',
    };
    featureText.textContent = labels[plan] || plan;
    // Enable/disable settings by plan features
    const gateNames = ['fill_missing','deduplicate_rows','combine_names','one_hot_encode','label_encode_countries','drop_constant','handle_outliers','ml_ready','scale_features','drop_metadata_flags','run_eda'];
    document.querySelectorAll('.setting-list input, input[name]').forEach(input => {
      const n = input.name;
      if (!n) return;
      if (n === 'gender_mode' || n === 'gender_as_binary') {
        input.disabled = !features.includes('gender_as_binary');
        return;
      }
      if (gateNames.includes(n)) {
        input.disabled = !features.includes(n);
      }
    });
  }

  /** Start Stripe / Payment Link checkout for a paid plan. */
  function startCheckout(planKey) {
    const emailInput = document.querySelector('#billing-email');
    const email = (emailInput && emailInput.value || '').trim();
    setMessage('Opening secure checkout…', 'info');
    fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey, email: email || undefined }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error((res.d && res.d.detail) || 'Checkout unavailable');
        if (res.d && res.d.url) {
          window.open(res.d.url, '_blank', 'noopener');
          setMessage('Checkout opened in a new tab. Complete payment there, then return.', 'ok');
        } else {
          throw new Error('No checkout URL returned');
        }
      })
      .catch(function (err) {
        setMessage(String(err.message || err), 'error');
      });
  }

  function ensureBillingPanel() {
    if (document.getElementById('billing-panel')) return;
    const planCard = planSelect && planSelect.closest('.glass-panel');
    if (!planCard) return;
    const panel = document.createElement('div');
    panel.id = 'billing-panel';
    panel.style.cssText = 'margin-top:1rem;padding-top:0.9rem;border-top:1px solid var(--border, #243044);';
    panel.innerHTML =
      '<div style="font-size:0.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3,#8b9bb0);margin-bottom:.55rem">Payment methods</div>' +
      '<input id="billing-email" type="email" placeholder="you@email.com (for saved cards)" ' +
      'style="width:100%;padding:.5rem .65rem;border-radius:8px;border:1px solid var(--border,#243044);background:var(--surface-2,#1a2233);color:inherit;font-size:.82rem;margin-bottom:.55rem" />' +
      '<div id="providers-row" style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.55rem"></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.45rem">' +
      '<button type="button" id="btn-pay-basic" class="pay-btn" data-plan="basic" style="flex:1;min-width:90px;padding:.45rem .5rem;border-radius:8px;border:1px solid var(--border);background:transparent;color:inherit;cursor:pointer;font-size:.78rem;font-weight:650">Basic $19</button>' +
      '<button type="button" id="btn-pay-normal" class="pay-btn" data-plan="normal" style="flex:1;min-width:90px;padding:.45rem .5rem;border-radius:8px;border:1px solid var(--border);background:transparent;color:inherit;cursor:pointer;font-size:.78rem;font-weight:650">Normal $39</button>' +
      '<button type="button" id="btn-pay-premium" class="pay-btn" data-plan="premium" style="flex:1;min-width:90px;padding:.45rem .5rem;border-radius:8px;border:1px solid var(--border);background:transparent;color:inherit;cursor:pointer;font-size:.78rem;font-weight:650">Premium $50</button>' +
      '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.45rem">' +
      '<button type="button" id="btn-save-card" style="flex:1;padding:.45rem .55rem;border-radius:8px;border:1px solid var(--accent,#3dd6c6);color:var(--accent,#3dd6c6);background:transparent;cursor:pointer;font-size:.78rem;font-weight:650">Save Visa / card</button>' +
      '<button type="button" id="btn-portal" style="flex:1;padding:.45rem .55rem;border-radius:8px;border:1px solid var(--border);color:inherit;background:transparent;cursor:pointer;font-size:.78rem;font-weight:650">Manage cards</button>' +
      '</div>' +
      '<div style="display:flex;gap:.4rem;margin-bottom:.35rem">' +
      '<select id="wallet-provider" style="flex:1;padding:.4rem;border-radius:8px;border:1px solid var(--border);background:var(--surface-2,#1a2233);color:inherit;font-size:.78rem">' +
      '<option value="easypaisa">EasyPaisa</option><option value="jazzcash">JazzCash / Earn</option></select>' +
      '<input id="wallet-label" type="text" placeholder="03xx-xxxxxxx" style="flex:1.2;padding:.4rem .5rem;border-radius:8px;border:1px solid var(--border);background:var(--surface-2,#1a2233);color:inherit;font-size:.78rem" />' +
      '</div>' +
      '<button type="button" id="btn-save-wallet" style="width:100%;padding:.45rem;border-radius:8px;border:1px dashed var(--border);background:transparent;color:var(--ink-3,#8b9bb0);cursor:pointer;font-size:.76rem;font-weight:600;margin-bottom:.4rem">Store EasyPaisa / JazzCash for later</button>' +
      '<div id="saved-methods" style="font-size:.75rem;color:var(--ink-3,#8b9bb0);line-height:1.45"></div>' +
      '<p style="font-size:.7rem;color:var(--ink-3,#8b9bb0);margin-top:.4rem;line-height:1.35">Cards charge via Stripe. EasyPaisa & JazzCash slots are ready — enable when you add merchant credentials.</p>';
    planCard.appendChild(panel);

    panel.querySelectorAll('.pay-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { startCheckout(btn.getAttribute('data-plan')); });
    });
    var saveCard = document.getElementById('btn-save-card');
    if (saveCard) saveCard.addEventListener('click', function () {
      var email = (document.getElementById('billing-email') || {}).value || '';
      if (!email || email.indexOf('@') < 0) { setMessage('Enter your email first to save a card.', 'error'); return; }
      fetch('/api/payments/setup-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error((res.d && res.d.detail) || 'SetupIntent failed');
          setMessage('SetupIntent ready. Connect Stripe.js on the frontend with client_secret to collect the card (test mode works now). Portal also manages cards.', 'ok');
          if (res.d && res.d.publishable_key) {
            console.log('Stripe SetupIntent', res.d);
          }
        }).catch(function (err) { setMessage(String(err.message || err), 'error'); });
    });
    var portalBtn = document.getElementById('btn-portal');
    if (portalBtn) portalBtn.addEventListener('click', function () {
      var email = (document.getElementById('billing-email') || {}).value || '';
      if (!email || email.indexOf('@') < 0) { setMessage('Enter your email to open the billing portal.', 'error'); return; }
      fetch('/api/payments/portal', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error((res.d && res.d.detail) || 'Portal unavailable');
          if (res.d && res.d.url) window.open(res.d.url, '_blank', 'noopener');
        }).catch(function (err) { setMessage(String(err.message || err), 'error'); });
    });
    var saveWallet = document.getElementById('btn-save-wallet');
    if (saveWallet) saveWallet.addEventListener('click', function () {
      var email = (document.getElementById('billing-email') || {}).value || '';
      var provider = (document.getElementById('wallet-provider') || {}).value || 'easypaisa';
      var label = (document.getElementById('wallet-label') || {}).value || '';
      if (!email || email.indexOf('@') < 0) { setMessage('Enter email to store a wallet method.', 'error'); return; }
      if (!label.trim()) { setMessage('Enter your EasyPaisa / JazzCash mobile number.', 'error'); return; }
      fetch('/api/payments/methods/manual', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), provider: provider, label: label.trim() }),
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error((res.d && res.d.detail) || 'Could not store method');
          setMessage('Saved ' + provider + ' for later. Live wallet charge will use your merchant credentials when set.', 'ok');
          refreshSavedMethods();
        }).catch(function (err) { setMessage(String(err.message || err), 'error'); });
    });
    var emailEl = document.getElementById('billing-email');
    if (emailEl) emailEl.addEventListener('change', refreshSavedMethods);

    fetch('/api/payments/providers').then(function (r) { return r.json(); }).then(function (data) {
      var row = document.getElementById('providers-row');
      if (!row || !data.providers) return;
      row.innerHTML = data.providers.map(function (p) {
        var color = p.enabled ? 'var(--accent,#3dd6c6)' : 'var(--ink-3,#8b9bb0)';
        var tag = p.enabled ? 'ready' : 'later';
        return '<span style="font-size:.72rem;padding:.25rem .5rem;border-radius:999px;border:1px solid ' + color + ';color:' + color + '">' + p.name + ' · ' + tag + '</span>';
      }).join('');
    }).catch(function () {});
  }

  function refreshSavedMethods() {
    var email = (document.getElementById('billing-email') || {}).value || '';
    var box = document.getElementById('saved-methods');
    if (!box) return;
    if (!email || email.indexOf('@') < 0) { box.textContent = ''; return; }
    fetch('/api/payments/methods?email=' + encodeURIComponent(email.trim()))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var methods = data.methods || [];
        if (!methods.length) {
          box.textContent = 'No saved methods yet for this email. Plan on file: ' + (data.plan || 'free');
          return;
        }
        box.innerHTML = '<strong style="color:inherit">Saved · plan ' + (data.plan || 'free') + '</strong><br>' +
          methods.map(function (m) {
            return (m.label || m.provider) + (m.last4 ? ' •••• ' + m.last4 : '');
          }).join('<br>');
      }).catch(function () {});
  }

  function chooseFile(file) {
    if (!file) return;
    const extension = (file.name.split('.').pop() || '').toLowerCase();
    const accepted = ['csv', 'tsv', 'txt', 'xlsx', 'xls', 'json', 'parquet', 'zip'];
    if (!accepted.includes(extension)) {
      setMessage('Please choose a supported data file.', 'error');
      return;
    }
    window.__cleanroomSelectedFile = file;
    try {
      if (fileInput && typeof DataTransfer !== 'undefined') {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
      }
    } catch (e) { /* keep fallback object */ }
    if (fileName) {
      fileName.textContent = `${file.name} · ${formatNumber(Math.round(file.size / 1024))} KB`;
    }
    if (runButton) {
      runButton.disabled = false;
      runButton.removeAttribute('disabled');
    }
    setMessage(`${formatNumber(Math.round(file.size / 1024))} KB ready to inspect.`);
  }

  if (planSelect) {
    // Fair PKR prices on the dropdown
    var labels = {
      free: 'Free · 5K rows · Rs 0',
      basic: 'Basic · 100K rows · Rs 1,500/mo',
      normal: 'Normal · 500K rows · Rs 3,500/mo',
      premium: 'Premium · 2M rows · Rs 6,000/mo',
    };
    Array.prototype.forEach.call(planSelect.options, function (opt) {
      if (labels[opt.value]) opt.text = labels[opt.value];
    });
    planSelect.addEventListener('change', function () {
      var u = window.__crUser;
      if (u && !u.is_admin) {
        // Non-admin cannot change plan
        planSelect.value = u.effective_plan || u.plan_key || 'free';
        setMessage('Only admin can switch plans. Upgrade via payment to change your plan.', 'error');
        return;
      }
      updatePlan();
    });
  }

  updatePlan();

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const f = fileInput.files?.[0];
      if (f) chooseFile(f);
    });
  }

  if (dropzone) {
    // Click is already handled by React onClick on the dropzone; still support drag/drop here.
    ['dragenter', 'dragover'].forEach(eventName =>
      dropzone.addEventListener(eventName, event => {
        event.preventDefault();
        event.stopPropagation();
        dropzone.classList.add('dragging');
      })
    );
    ['dragleave', 'drop'].forEach(eventName =>
      dropzone.addEventListener(eventName, event => {
        event.preventDefault();
        event.stopPropagation();
        dropzone.classList.remove('dragging');
      })
    );
    dropzone.addEventListener('drop', event => {
      const file = event.dataTransfer?.files?.[0];
      if (file) chooseFile(file);
    });
  }

  // Prevent browser from opening dropped files as navigation
  ;['dragover', 'drop'].forEach(ev => {
    document.addEventListener(ev, e => e.preventDefault());
  });

  if (runButton) {
    runButton.addEventListener('click', async () => {
      const file = selectedFile();
      if (!file) {
        setMessage('Please choose a file first.', 'error');
        return;
      }
      runButton.disabled = true;
      runButton.innerHTML = 'Reading signal <span class="spinner">◌</span>';
      setMessage('Profiling, cleaning, and checking readiness...');
      const settings = {};
      document.querySelectorAll('.setting-list input').forEach(input => {
        settings[input.name] = input.checked;
      });
      // Also pick up other named controls from the glossy form
      document.querySelectorAll('input[name], select[name]').forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (el.checked) settings[el.name] = el.type === 'checkbox' ? true : el.value;
        } else if (el.name && el.name !== 'file') {
          settings[el.name] = el.value;
        }
      });
      const targetEl = document.querySelector('#target');
      const target = targetEl ? targetEl.value.trim() : '';
      if (target) settings.target_column = target;
      // Map UI names to API names when needed
      if (settings.scale_for_export) settings.scale_features = true;
      if (settings.scaler_choice) settings.scaler = settings.scaler_choice;
      if (settings.missing_threshold != null) {
        settings.missing_threshold = Number(settings.missing_threshold);
      }
      // Gender encoding dropdown
      {
        var gm = String(settings.gender_mode || 'keep_text').toLowerCase();
        if (gm.indexOf('onehot') >= 0 || gm.indexOf('one-hot') >= 0) {
          settings.gender_one_hot = true;
          settings.gender_as_binary = false;
          settings.gender_mode = 'onehot';
        } else if (gm.indexOf('binary') >= 0 || gm.indexOf('0/1') >= 0) {
          settings.gender_as_binary = true;
          settings.gender_one_hot = false;
          settings.gender_mode = 'binary';
        } else {
          settings.gender_as_binary = false;
          settings.gender_one_hot = false;
          settings.gender_mode = 'keep_text';
        }
      }
      // Country encoding dropdown
      {
        var cm = String(settings.country_mode || 'keep_text').toLowerCase();
        if (cm.indexOf('onehot') >= 0 || cm.indexOf('one-hot') >= 0) {
          settings.country_mode = 'onehot';
          settings.label_encode_countries = false;
        } else if (cm.indexOf('label') >= 0) {
          settings.country_mode = 'label';
          settings.label_encode_countries = true;
        } else {
          settings.country_mode = 'keep_text';
          settings.label_encode_countries = false;
        }
      }
      if (settings.outlier_method) {
        // already correct names: clip|winsorize|remove|flag
      }
      if (settings.scaler_choice) settings.scaler = settings.scaler_choice;

      const body = new FormData();
      body.append('file', file, file.name || 'upload.csv');
      body.append('plan', planSelect ? planSelect.value : 'normal');
      body.append('settings', JSON.stringify(settings));
      try {
        const response = await fetch('/api/clean', { method: 'POST', body, credentials: 'include' });
        const packed = await readResponseSafe(response);
        const text = packed.text;
        const data = packed.data || {};
        if (!response.ok) {
          let msg = safeErrorMessage(response.status, text, 'The data could not be processed.');
          if (response.status === 413 && data && typeof data.detail === 'string') {
            msg = data.detail;
          } else if (data && typeof data.detail === 'string' && !packed.looksHtml) {
            msg = data.detail;
          }
          console.error('[cleanroom] /api/clean failed', response.status, msg);
          throw new Error(msg);
        }
        if (packed.looksHtml || !data || (typeof data !== 'object')) {
          throw new Error(safeErrorMessage(response.status, text, 'Invalid response from CleanRoom server.'));
        }
        renderResults(data);
        if (results) {
          results.classList.remove('hidden');
          results.style.display = '';
          try { forceDarkSurfaces();
    try { var _b=document.getElementById("cr-all-black"); if(_b){ _b.remove(); } } catch(e){}
    try { (function(){ var id="cr-all-black"; var st=document.createElement("style"); st.id=id; st.textContent="html,body,.theme-dark,.theme-dark .dashboard-container,.theme-dark .cr-main,.theme-dark .cr-page,.theme-dark section,.theme-dark #results,.theme-dark #workspace{background:#000!important;background-color:#000!important;background-image:none!important}.theme-dark .glass-panel,.theme-dark .chart-block,.theme-dark .eda-card,.theme-dark .ov-card,.theme-dark .ov-kpi,.theme-dark .cr-sidebar,.theme-dark .cr-topbar,.theme-dark .metric{background:#0a0a0a!important;background-color:#0a0a0a!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}.theme-dark .glass-panel::before{display:none!important}"; document.head.appendChild(st); })(); } catch(e){} } catch(e) {}
          results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const attempts = data.attempts_remaining === null || data.attempts_remaining === undefined
          ? ''
          : ` ${data.attempts_remaining} Free attempts remain today.`;
        setMessage(`Your cleaned dataset is ready.${attempts}`, 'success');
      } catch (error) {
        setMessage(error.message || String(error), 'error');
      } finally {
        runButton.disabled = !selectedFile();
        runButton.innerHTML = 'Clean & profile <span>→</span>';
      }
    });
  }

  function formatStat(value) {
    return value === null || value === undefined ? '—' : Number(value).toLocaleString(undefined, { maximumFractionDigits: 3 });
  }
  function escapeHtml(value) {
    return String(value ?? '—').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }
  function renderTable(rows) {
    rows = rows || [];
    if (!rows.length) return '<p class="muted-copy">No rows to preview.</p>';
    var colSet = {};
    rows.forEach(function(row) {
      Object.keys(row || {}).forEach(function(k) { colSet[k] = true; });
    });
    var columns = Object.keys(colSet);
    if (!columns.length) columns = Object.keys(rows[0] || {});
    return '<div class="table-wrap" style="overflow-x:auto;max-height:none"><table style="width:100%;border-collapse:collapse;font-size:0.75rem"><thead><tr>' +
      columns.map(function(c){ return '<th style="padding:0.3rem 0.45rem;text-align:left;color:#f06a1d;border-bottom:1px solid rgba(255,255,255,0.1);white-space:nowrap">' + escapeHtml(c) + '</th>'; }).join('') +
      '</tr></thead><tbody>' +
      rows.map(function(row){
        return '<tr>' + columns.map(function(c){
          var v = row[c];
          var shown = (v === null || v === undefined || v === '') ? '—' : String(v);
          return '<td style="padding:0.3rem 0.45rem;border-bottom:1px solid rgba(255,255,255,0.06);white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis" title="' + escapeHtml(shown) + '">' + escapeHtml(shown) + '</td>';
        }).join('') + '</tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  
  
  
(function(){
  if (document.getElementById('cr-theme-solid')) return;
  var st = document.createElement('style');
  st.id = 'cr-theme-solid';
  st.textContent = [
    '.theme-dark.dashboard-container,.theme-dark .cr-main{background-color:#0a0a0c!important;background-image:none!important}',
    '.theme-dark .glass-panel,.theme-dark .glass-panel.plans-teaser{background:#121216!important;background-color:#121216!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border:1px solid rgba(255,255,255,0.1)!important;box-shadow:0 8px 28px rgba(0,0,0,0.45)!important}',
    '.theme-dark .glass-panel::before{display:none!important;opacity:0!important}',
    '.theme-dark .cr-page,.theme-dark .cr-main>section{background:transparent!important}',
    '.theme-light.dashboard-container{background-color:#f5f3ef!important;background-image:none!important}',
    '.theme-light .glass-panel,.theme-light .glass-panel.plans-teaser{background:#fff!important;background-color:#fff!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border:1px solid rgba(0,0,0,0.08)!important;box-shadow:0 8px 28px rgba(0,0,0,0.06)!important}',
    '.theme-light .glass-panel::before{display:none!important}',
    '.theme-light .cr-sidebar{background:#fff!important;border-right:1px solid rgba(0,0,0,0.08)}',
    '.theme-light .cr-topbar{background:rgba(255,255,255,0.95)!important;border-bottom:1px solid rgba(0,0,0,0.08)}'
  ].join('');
  document.head.appendChild(st);
})();

  
  
(function forceAllBlack(){
  var id = 'cr-all-black';
  var el = document.getElementById(id);
  if (el) el.remove();
  var st = document.createElement('style');
  st.id = id;
  st.textContent = [
    'html,body,.theme-dark,.theme-dark body,.dashboard-container.theme-dark,.theme-dark .dashboard-container,',
    '.theme-dark .cr-main,.theme-dark .cr-page,.theme-dark section,.theme-dark #workspace,.theme-dark #results,',
    '.theme-dark #plans{background:#000!important;background-color:#000!important;background-image:none!important}',
    '.theme-dark .glass-panel,.theme-dark .glass-panel.plans-teaser,.theme-dark .chart-block,.theme-dark .eda-card,',
    '.theme-dark .ov-card,.theme-dark .ov-kpi,.theme-dark .cr-sidebar,.theme-dark .cr-topbar,',
    '.theme-dark #results .glass-panel,.theme-dark .ba-dashboard,.theme-dark .metric,.theme-dark .hist-card{',
    'background:#0a0a0a!important;background-color:#0a0a0a!important;backdrop-filter:none!important;',
    '-webkit-backdrop-filter:none!important;box-shadow:none!important}',
    '.theme-dark .glass-panel::before{display:none!important;opacity:0!important}',
    '.theme-dark [style*="background"]{background-color:transparent}',
    '.theme-dark .glass-panel[style],.theme-dark div.glass-panel{background:#0a0a0a!important}'
  ].join('');
  document.head.appendChild(st);
})();

  function forceDarkSurfaces() {
    var id = 'cr-theme-solid-v2';
    var old = document.getElementById(id);
    if (old) old.remove();
    var st = document.createElement('style');
    st.id = id;
    st.textContent = [
      /* After clean — keep true black, kill grey wash */
      '.theme-dark, .theme-dark body, .theme-dark .dashboard-container, .theme-dark .cr-main { background:#0a0a0c!important; background-color:#0a0a0c!important; background-image:none!important; }',
      '.theme-dark #results, .theme-dark #results .glass-panel, .theme-dark #workspace .glass-panel, .theme-dark .ba-dashboard, .theme-dark .compare-grid, .theme-dark .chart-block, .theme-dark .eda-card, .theme-dark .ov-card, .theme-dark .ov-kpi { background:#121216!important; background-color:#121216!important; backdrop-filter:none!important; -webkit-backdrop-filter:none!important; }',
      '.theme-dark .glass-panel::before, .theme-dark #results .glass-panel::before { display:none!important; content:none!important; opacity:0!important; }',
      '.theme-dark .glass-panel { border-color:rgba(255,255,255,0.1)!important; box-shadow:0 8px 24px rgba(0,0,0,0.4)!important; }',
      '.theme-dark #graphs-content, .theme-dark #overview-content, .theme-dark #profile-content, .theme-dark #eda-content, .theme-dark #raw-content { background:transparent!important; }',
      '.theme-dark .hist-bars-labeled, .theme-dark .hist-bar-track { background:transparent!important; }',
      '.theme-light #results .glass-panel, .theme-light .chart-block, .theme-light .eda-card { background:#fff!important; }',
      '.theme-light.dashboard-container { background:#f5f3ef!important; }'
    ].join('');
    document.head.appendChild(st);
  }
  forceDarkSurfaces();

  function ensureHistBarStyles() {
    var ids = ['cr-hist-bar-styles','cr-hist-bar-styles-v2','cr-hist-bar-styles-v3','cr-medium-dash'];
    ids.forEach(function(id){ var el=document.getElementById(id); if(el) el.remove(); });
    var st = document.createElement('style');
    st.id = 'cr-medium-dash';
    st.textContent = [
      '#results,#graphs-content,#overview-content,#profile-content,#eda-content{max-height:none!important;overflow:visible!important}','#graphs-content .charts-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0.75rem!important;align-items:stretch!important}','#graphs-content .chart-block{min-height:210px!important;max-height:none!important;overflow:visible!important;height:auto!important}','.results-mid-grid .glass-panel{max-height:none!important;overflow:visible!important}','.ba-dashboard,.compare-grid{max-height:none!important}','#raw-content .table-wrap{max-height:none!important;overflow-x:auto!important;overflow-y:visible!important}',
      '.charts-grid,#graphs-content .charts-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0.65rem!important;width:100%!important}',
      '.chart-block,#graphs-content .chart-block{padding:0.75rem!important;min-height:200px!important;max-height:none!important;overflow:visible!important;box-sizing:border-box!important;height:100%}',
      '.chart-block svg,#graphs-content .chart-block svg{max-width:100%!important;max-height:160px!important;width:100%!important;height:auto!important}',
      '.chart-heading{display:flex!important;align-items:baseline!important;justify-content:space-between!important;gap:0.5rem!important;margin-bottom:0.5rem!important;flex-wrap:wrap}',
      '.chart-heading strong{font-size:0.88rem!important;color:var(--ink,#f3f4f6)!important}',
      '.chart-heading span{font-size:0.72rem!important;color:#9ca3af!important;white-space:nowrap}',
      /* histogram bars only — no under-bar numbers */
      '.hist-bars-labeled{display:flex!important;align-items:flex-end!important;gap:3px!important;height:100px!important;width:100%!important;padding:0 2px}',
      '.hist-bar-wrap{flex:1 1 0;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-end!important;height:100px!important;min-width:6px;max-width:28px;cursor:default}',
      '.hist-bar-track{width:100%;max-width:18px;height:100%;display:flex!important;align-items:flex-end!important}',
      '.hist-bar-fill{width:100%!important;min-height:2px!important;border-radius:3px 3px 0 0!important;background:linear-gradient(180deg,#ff9a4a,#f06a1d)!important;display:block!important}',
      '.hist-bar-n{display:none!important}',
      '.hist-bars > i{display:none!important}',
      /* category horizontal bars */
      '.chart-row{display:flex!important;align-items:center!important;gap:0.65rem!important;margin:0.4rem 0!important}',
      '.chart-row > span{min-width:0;flex:0 1 38%;font-size:0.78rem!important}',
      '.chart-row > i{flex:1 1 auto!important;height:10px!important;min-width:40px!important;background:rgba(255,255,255,0.12)!important;border-radius:99px!important;overflow:hidden!important;display:block!important}',
      '.chart-row > i > b{display:block!important;height:100%!important;min-width:2px;background:linear-gradient(90deg,#f06a1d,#ff9a4a)!important;border-radius:99px!important}',
      '.chart-row > strong{flex:0 0 auto;font-size:0.82rem!important;min-width:2.5rem;text-align:right}',
      '#metric-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))!important;gap:0.5rem!important}',
      '#metric-grid .metric{padding:0.65rem 0.75rem!important;min-height:72px!important}',
      '#metric-grid .metric strong{font-size:1.15rem!important}',
      '#graphs-content .charts-grid{align-items:stretch!important}','#graphs-content .chart-block{min-height:220px!important;max-height:none!important;overflow:visible!important}','@media (max-width:900px){.charts-grid,#graphs-content .charts-grid{grid-template-columns:1fr!important}}'
    ].join('');
    document.head.appendChild(st);
  }

  
  function svgLineFromSeries(values, labels) {
    var vals = (values || []).map(function(v){ return Number(v) || 0; });
    if (!vals.length) return '<div class="ov-na">No series data.</div>';
    var W = 400, H = 160, padL = 44, padR = 16, padT = 22, padB = 28;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var maxV = Math.max.apply(null, vals.concat([1]));
    var minV = 0;
    var span = maxV - minV || 1;
    var pts = vals.map(function(v, i) {
      var x = padL + (i / Math.max(vals.length - 1, 1)) * plotW;
      var y = padT + plotH - ((v - minV) / span) * plotH;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    var dots = vals.map(function(v, i) {
      var x = padL + (i / Math.max(vals.length - 1, 1)) * plotW;
      var y = padT + plotH - ((v - minV) / span) * plotH;
      var lab = (labels && labels[i]) != null ? labels[i] : ('bin ' + (i+1));
      return '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="3.2" fill="#f06a1d"><title>'+lab+': '+v+'</title></circle>' +
        '<text x="'+x.toFixed(1)+'" y="'+(y-8).toFixed(1)+'" text-anchor="middle" fill="#e8e4dc" font-size="9" font-weight="600">'+v+'</text>';
    }).join('');
    return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" height="160" style="display:block">' +
      '<text x="6" y="'+(padT+4)+'" fill="#9ca3af" font-size="10">'+maxV+'</text>' +
      '<text x="6" y="'+(padT+plotH)+'" fill="#9ca3af" font-size="10">0</text>' +
      '<line x1="'+padL+'" y1="'+padT+'" x2="'+padL+'" y2="'+(padT+plotH)+'" stroke="rgba(255,255,255,0.12)"/>' +
      '<line x1="'+padL+'" y1="'+(padT+plotH)+'" x2="'+(padL+plotW)+'" y2="'+(padT+plotH)+'" stroke="rgba(255,255,255,0.12)"/>' +
      '<polyline fill="none" stroke="#f06a1d" stroke-width="2.2" points="'+pts+'"/>' + dots +
      '</svg>';
  }

  function qualityPieSvg(score, labelComplete, labelMissing) {
    var s = Math.max(0, Math.min(100, Number(score) || 0));
    var r = 42, cx = 60, cy = 60;
    var c = 2 * Math.PI * r;
    var dash = (s / 100) * c;
    var color = s >= 80 ? '#3ecf8e' : (s >= 50 ? '#f06a1d' : '#f07178');
    return '<svg class="quality-pie-svg" viewBox="0 0 120 120" width="130" height="130">' +
      '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="12"/>' +
      '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="12" ' +
      'stroke-linecap="round" stroke-dasharray="'+dash.toFixed(2)+' '+(c).toFixed(2)+'" ' +
      'transform="rotate(-90 '+cx+' '+cy+')" style="transition:stroke-dasharray 0.4s"/>' +
      '<text x="'+cx+'" y="'+(cy+2)+'" text-anchor="middle" class="quality-pie-label" style="font-size:18px;font-weight:700;fill:var(--ink, #f3f4f6)">'+Math.round(s)+'%</text>' +
      '<text x="'+cx+'" y="'+(cy+18)+'" text-anchor="middle" style="font-size:9px;fill:var(--ink-3,#9ca3af)">complete</text>' +
      '</svg>' +
      '<div style="display:flex;gap:0.75rem;margin-top:0.4rem;font-size:0.7rem;color:var(--ink-3)">' +
      '<span><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+color+';margin-right:4px"></i>'+labelComplete+'</span>' +
      '<span><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.15);margin-right:4px"></i>'+labelMissing+'</span>' +
      '</div>';
  }

  function completenessScore(rows, cols, missingCells) {
    var total = Math.max(1, (Number(rows) || 0) * (Number(cols) || 0));
    var miss = Math.max(0, Number(missingCells) || 0);
    return Math.max(0, Math.min(100, (1 - miss / total) * 100));
  }

  function renderResults(data) {
    ensureHistBarStyles();
    forceDarkSurfaces();
    const report = data.report || {};
    const readiness = data.readiness || {};
    const cards = [
      ['Quality status', readiness.status || '—', 'accent'],
      ['Rows after', formatNumber((data.cleaned || {}).rows), 'accent'],
      ['Cells repaired', formatNumber(report.cells_changed), ''],
      ['ML readiness', `${readiness.score != null ? readiness.score : '—'}/100`, 'accent'],
    ];
    const metricGrid = document.querySelector('#metric-grid');
    if (metricGrid) {
      metricGrid.innerHTML = cards.map(([label, value, style]) =>
        `<div class="metric"><small>${label}</small><strong class="${style}">${value}</strong></div>`
      ).join('');
      metricGrid.style.display = 'grid';
      metricGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';
      metricGrid.style.gap = '0.5rem';
      metricGrid.style.gap = '0.85rem';
    }
    const dl = document.querySelector('#download-link');
    if (dl && data.result_id) dl.href = `/api/download/${data.result_id}`;
    try { window.__CR_RESULT_ID = data.result_id; } catch (e) {}

    const rows = data.preview || [];
    var colSet = {};
    rows.forEach(function(row){ Object.keys(row || {}).forEach(function(k){ colSet[k] = true; }); });
    const columns = Object.keys(colSet);
    const th = document.querySelector('#table-head');
    const tb = document.querySelector('#table-body');
    if (th) th.innerHTML = '<tr>' + columns.map(function(c){ return '<th>' + escapeHtml(c) + '</th>'; }).join('') + '</tr>';
    if (tb) tb.innerHTML = rows.map(function(row){
      return '<tr>' + columns.map(function(c){
        var v = row[c];
        return '<td title="' + escapeHtml(v) + '">' + escapeHtml(v === null || v === undefined || v === '' ? '—' : v) + '</td>';
      }).join('') + '</tr>';
    }).join('');

    const raw = data.raw || {};
    const rawProf = data.raw_profile || {};
    const rawEl = document.querySelector('#raw-content');
    if (rawEl) {
      rawEl.innerHTML = `<div class="snapshot-stats">
        <div><small>Rows</small><strong>${formatNumber(raw.rows)}</strong></div>
        <div><small>Columns</small><strong>${formatNumber(raw.columns)}</strong></div>
        <div><small>Missing cells</small><strong>${formatNumber(rawProf.missing_cells)}</strong></div>
        <div><small>Duplicate rows</small><strong>${formatNumber(rawProf.duplicate_rows)}</strong></div>
      </div>${renderTable(data.raw_preview)}`;
    }

    // Before / After quality pie charts (real completeness from profiles)
    try {
      const cleanedMeta = data.cleaned || {};
      const prof = data.profile || {};
      const beforeScore = completenessScore(raw.rows, raw.columns, rawProf.missing_cells);
      const afterMiss = prof.missing_cells != null ? prof.missing_cells : 0;
      const afterRows = cleanedMeta.rows != null ? cleanedMeta.rows : (raw.rows || 0);
      const afterCols = cleanedMeta.columns != null ? cleanedMeta.columns : (raw.columns || 0);
      const afterScore = completenessScore(afterRows, afterCols, afterMiss);
      const beforePie = document.querySelector('#quality-before-pie');
      const afterPie = document.querySelector('#quality-after-pie');
      const beforeStats = document.querySelector('#quality-before-stats');
      const afterStats = document.querySelector('#quality-after-stats');
      if (beforePie) {
        beforePie.innerHTML = qualityPieSvg(beforeScore, 'Present', 'Missing');
      }
      if (afterPie) {
        afterPie.innerHTML = qualityPieSvg(afterScore, 'Present', 'Missing');
      }
      if (beforeStats) {
        beforeStats.innerHTML = `<div>Rows <strong style="color:var(--ink)">${formatNumber(raw.rows)}</strong> · Cols <strong style="color:var(--ink)">${formatNumber(raw.columns)}</strong></div>
          <div>Missing <strong style="color:var(--ink)">${formatNumber(rawProf.missing_cells)}</strong> · Dupes <strong style="color:var(--ink)">${formatNumber(rawProf.duplicate_rows)}</strong></div>`;
      }
      if (afterStats) {
        afterStats.innerHTML = `<div>Rows <strong style="color:var(--ink)">${formatNumber(afterRows)}</strong> · Cols <strong style="color:var(--ink)">${formatNumber(afterCols)}</strong></div>
          <div>Missing <strong style="color:var(--ink)">${formatNumber(afterMiss)}</strong> · Status <strong style="color:var(--accent)">${escapeHtml((data.readiness || {}).status || '—')}</strong></div>`;
      }
    } catch (e) { /* keep placeholders */ }

    const profile = data.profile || {};
    const statusClass = String(readiness.status || '').toLowerCase().replaceAll(' ', '-');
    const profileEl = document.querySelector('#profile-content');
    if (profileEl) {
      const dtypeLines = (profile.dtype_lines || []).flatMap((line) => {
        // Backend sometimes returns one long line; split into "name = type" pairs
        const parts = String(line).split(/(?<=\S)\s+(?=[A-Za-z_][\w]*\s*=)/);
        return parts.length ? parts : [line];
      });
      const dtypeHtml = dtypeLines.map((line) => {
        const m = String(line).match(/^\s*([\w.]+)\s*=\s*(.+)$/);
        if (m) {
          return `<div class="dtype-line"><span class="col-name">${escapeHtml(m[1])}</span> <span class="col-type">= ${escapeHtml(m[2].trim())}</span></div>`;
        }
        return `<div class="dtype-line">${escapeHtml(line)}</div>`;
      }).join('');
      profileEl.innerHTML = `<div class="profile-status ${statusClass}"><span class="status-check">✓</span><div><strong>Profile complete · ${escapeHtml(readiness.status)}</strong><p>Cleaned frame analyzed for structure, missingness, duplicates, and model readiness.</p></div></div>${[
        ['Memory footprint', `${profile.memory_mb ?? '—'} MB`],
        ['Duplicate rows', formatNumber(profile.duplicate_rows)],
        ['Missing cells', formatNumber(profile.missing_cells)],
        ['Numeric features', formatNumber(profile.numeric_columns)],
        ['Identifier signals', formatNumber(profile.identifier_columns)],
        ['Cleaned columns', formatNumber((data.cleaned_columns || []).length)],
      ].map(([label, value]) => `<div class="profile-row"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}<div class="dtype-list"><div class="chart-heading"><strong>Column dtypes</strong><span>optimized safely</span></div>${dtypeHtml}</div>`;
    }

    const dataset = data.eda?.dataset || {};
    const recommendations = data.eda?.recommendations || [];
    const missing = Object.entries(data.eda?.missingness?.per_column || {})
      .sort((a, b) => (b[1].missing_percentage || 0) - (a[1].missing_percentage || 0)).slice(0, 8);
    const maxMissing = Math.max(...missing.map(([, item]) => item.missing_percentage || 0), 1);
    const missingChart = missing.length
      ? missing.map(([name, item]) => `<div class="chart-row"><span>${escapeHtml(name)}</span><i><b style="width:${((item.missing_percentage || 0) / maxMissing) * 100}%"></b></i><strong>${item.missing_percentage || 0}%</strong></div>`).join('')
      : '<p class="muted-copy">No missingness remains in the cleaned frame.</p>';
    const edaEl = document.querySelector('#eda-content');
    if (edaEl) {
      edaEl.innerHTML = `<div class="eda-grid"><div><strong>Dataset shape</strong><p>${formatNumber(dataset.rows || data.cleaned?.rows)} × ${formatNumber(dataset.columns || data.cleaned?.columns)}</p></div><div><strong>Numeric / categorical</strong><p>${formatNumber((dataset.numeric_columns || []).length)} / ${formatNumber((dataset.categorical_columns || []).length)}</p></div></div><div class="chart-block" style="margin-top:1rem"><div class="chart-heading"><strong>Missingness after clean</strong></div>${missingChart}</div>${recommendations.length ? `<div class="chart-block" style="margin-top:1rem"><div class="chart-heading"><strong>Recommendations</strong></div><ul>${recommendations.slice(0, 8).map(r => `<li><strong>${escapeHtml(r.priority || '')}</strong> ${escapeHtml(r.message || r)}</li>`).join('')}</ul></div>` : ''}`;
    }

    const graphs = data.graphs || {};
    const miss = graphs.missingness || [];
    const outliers = graphs.outliers || [];
    const stats = graphs.statistics || [];
    const maxM = Math.max(...miss.map(item => item.percentage || 0), 1);
    const missingHtml = miss.slice().sort((a, b) => (b.percentage || 0) - (a.percentage || 0)).slice(0, 10)
      .map(item => `<div class="chart-row"><span style="color:var(--accent);font-weight:600">${escapeHtml(item.column)}</span><i><b style="width:${((item.percentage || 0) / maxM) * 100}%"></b></i><strong>${item.percentage}%</strong></div>`).join('')
      || '<p class="muted-copy">No missingness remains.</p>';
    const outlierHtml = outliers.length
      ? outliers.slice(0, 10).map(item => `<div class="chart-row"><span style="color:var(--accent);font-weight:600">${escapeHtml(item.column)}</span><i><b class="outlier-bar" style="width:${Math.min(item.percentage || 0, 100)}%"></b></i><strong>${item.count ?? 0}</strong></div>`).join('')
      : '<p class="muted-copy">No IQR outliers detected.</p>';
    const statsHtml = stats.length
      ? `<div class="stats-wrap"><table><thead><tr><th>Column</th><th>Mean</th><th>Median</th><th>Min</th><th>Max</th><th>Std</th><th>Outliers</th></tr></thead><tbody>${stats.map(item => `<tr><td style="color:var(--accent);font-weight:600">${escapeHtml(item.column)}</td><td>${formatStat(item.mean)}</td><td>${formatStat(item.median)}</td><td>${formatStat(item.min)}</td><td>${formatStat(item.max)}</td><td>${formatStat(item.std)}</td><td>${item.outliers ?? 0}</td></tr>`).join('')}</tbody></table></div>`
      : '<p class="muted-copy">No numeric columns available for descriptive statistics.</p>';

    const hists = graphs.histograms || [];
    const histHtml = hists.length
      ? hists.map(h => {
          const counts = (h.counts || []).map(c => Number(c) || 0);
          const total = counts.reduce((a, b) => a + b, 0) || 1;
          const maxC = Math.max.apply(null, counts.concat([1]));
          const bars = counts.map((n, idx) => {
            const hPct = Math.max(3, Math.round((n / maxC) * 100));
            return '<div class="hist-bar-wrap" title="Bin ' + (idx + 1) + ': ' + n + ' rows">' +
              '<div class="hist-bar-track"><div class="hist-bar-fill" style="height:' + hPct + '%"></div></div></div>';
          }).join('');
          return '<div class="chart-block hist-card">' +
            '<div class="chart-heading"><strong>' + escapeHtml(h.column) + '</strong>' +
            '<span>n=' + total.toLocaleString() + '</span></div>' +
            '<div class="hist-bars hist-bars-labeled">' + bars + '</div></div>';
        }).join('')
      : '<div class="chart-block"><p class="muted-copy">No numeric histograms available.</p></div>';

    const skew = graphs.skewness || [];
    const skewHtml = skew.length
      ? skew.slice(0, 10).map(s => {
          const abs = Math.min(Math.abs(s.skewness || 0), 3);
          return `<div class="chart-row"><span style="color:var(--accent);font-weight:600">${escapeHtml(s.column)}</span><i><b style="width:${(abs / 3) * 100}%"></b></i><strong>${formatStat(s.skewness)}</strong></div>`;
        }).join('')
      : '<p class="muted-copy">No skewness scores available.</p>';

    function niceNum(v) {
      if (v == null || Number.isNaN(Number(v))) return '—';
      const n = Number(v);
      if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    function svgSingleBox(b) {
      const W = 220, H = 170, padL = 42, padR = 12, padT = 14, padB = 28;
      const plotH = H - padT - padB, plotW = W - padL - padR;
      const yMin = b.min, yMax = b.max, span = (yMax - yMin) || 1;
      const yScale = (v) => padT + plotH - ((v - yMin) / span) * plotH;
      const cx = padL + plotW / 2, boxW = 30;
      const ticks = [b.min, b.q1, b.median, b.q3, b.max];
      const tickSvg = ticks.map(t => {
        const y = yScale(t);
        return `<line x1="${padL - 4}" y1="${y}" x2="${padL}" y2="${y}" stroke="var(--accent)" stroke-width="1"/><text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="var(--accent)" font-size="8">${niceNum(t)}</text>`;
      }).join('');
      const y0 = yScale(b.whisker_max), y1 = yScale(b.whisker_min);
      const yQ3 = yScale(b.q3), yQ1 = yScale(b.q1), yMed = yScale(b.median);
      return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:100%;height:170px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid var(--border)">
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="var(--accent)" stroke-opacity="0.45" stroke-width="1"/>
        <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="var(--accent)" stroke-opacity="0.45" stroke-width="1"/>
        ${tickSvg}
        <line x1="${cx}" y1="${y0}" x2="${cx}" y2="${y1}" stroke="var(--accent)" stroke-width="1.5"/>
        <line x1="${cx - 10}" y1="${y0}" x2="${cx + 10}" y2="${y0}" stroke="var(--accent)" stroke-width="1.5"/>
        <line x1="${cx - 10}" y1="${y1}" x2="${cx + 10}" y2="${y1}" stroke="var(--accent)" stroke-width="1.5"/>
        <rect x="${cx - boxW/2}" y="${yQ3}" width="${boxW}" height="${Math.max(2, yQ1 - yQ3)}" fill="rgba(240,106,29,0.35)" stroke="var(--accent)" stroke-width="1.5" rx="3"/>
        <line x1="${cx - boxW/2}" y1="${yMed}" x2="${cx + boxW/2}" y2="${yMed}" stroke="var(--accent)" stroke-width="2.5"/>
        <text x="${cx}" y="${H - 12}" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="700">${escapeHtml(b.column)}</text>
        <text x="${padL + plotW}" y="${padT + 10}" text-anchor="end" fill="var(--accent)" font-size="9">${b.outliers || 0} outliers</text>
      </svg>`;
    }

    function svgGroupedBox(plot) {
      const groups = plot.groups || [];
      if (!groups.length) return '';
      const W = Math.min(420, Math.max(240, 60 + groups.length * 55)), H = 180;
      const padL = 52, padR = 16, padT = 20, padB = 44;
      const plotH = H - padT - padB, plotW = W - padL - padR;
      const yMin = plot.y_min, yMax = plot.y_max, span = (yMax - yMin) || 1;
      const yScale = (v) => padT + plotH - ((v - yMin) / span) * plotH;
      const tickVals = [yMin, yMin + span * 0.25, yMin + span * 0.5, yMin + span * 0.75, yMax];
      const tickSvg = tickVals.map(t => {
        const y = yScale(t);
        return `<line x1="${padL - 4}" y1="${y}" x2="${padL}" y2="${y}" stroke="var(--accent)"/><text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="var(--accent)" font-size="8">${niceNum(t)}</text>`;
      }).join('');
      const slot = plotW / groups.length;
      const boxes = groups.map((g, i) => {
        const cx = padL + slot * (i + 0.5);
        const boxW = Math.min(40, slot * 0.45);
        const y0 = yScale(g.whisker_max), y1 = yScale(g.whisker_min);
        const yQ3 = yScale(g.q3), yQ1 = yScale(g.q1), yMed = yScale(g.median);
        return `
          <line x1="${cx}" y1="${y0}" x2="${cx}" y2="${y1}" stroke="var(--accent)" stroke-width="1.5"/>
          <line x1="${cx - 8}" y1="${y0}" x2="${cx + 8}" y2="${y0}" stroke="var(--accent)" stroke-width="1.5"/>
          <line x1="${cx - 8}" y1="${y1}" x2="${cx + 8}" y2="${y1}" stroke="var(--accent)" stroke-width="1.5"/>
          <rect x="${cx - boxW/2}" y="${yQ3}" width="${boxW}" height="${Math.max(2, yQ1 - yQ3)}" fill="rgba(91,140,255,0.45)" stroke="#5b8cff" stroke-width="1.5" rx="3"/>
          <line x1="${cx - boxW/2}" y1="${yMed}" x2="${cx + boxW/2}" y2="${yMed}" stroke="#fff" stroke-width="2"/>
          <text x="${cx}" y="${H - 14}" text-anchor="middle" fill="var(--accent)" font-size="10" font-weight="700">${escapeHtml(g.group)}</text>
          <text x="${cx}" y="${H - 2}" text-anchor="middle" fill="var(--accent)" font-size="8" opacity="0.85">n=${g.n}</text>
        `;
      }).join('');
      return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid var(--border);margin-top:0.5rem">
        <text x="${padL}" y="12" fill="var(--accent)" font-size="11" font-weight="700">${escapeHtml(plot.numeric)}</text>
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="var(--accent)" stroke-opacity="0.45"/>
        <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="var(--accent)" stroke-opacity="0.45"/>
        ${tickSvg}${boxes}
        <text x="${padL + plotW / 2}" y="${H - 0}" text-anchor="middle" fill="var(--accent)" font-size="10" font-weight="600">${escapeHtml(plot.category)}</text>
      </svg>`;
    }

    const boxes = graphs.boxplots || [];
    const boxHtml = boxes.length
      ? `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.65rem">${boxes.slice(0, 6).map(b => `<div><div class="chart-heading"><strong>${escapeHtml(b.column)}</strong><span>min ${niceNum(b.min)} · med ${niceNum(b.median)} · max ${niceNum(b.max)}</span></div>${svgSingleBox(b)}</div>`).join('')}</div>`
      : '<p class="muted-copy">No box-plot summaries available.</p>';

    const groupedBoxes = graphs.grouped_boxplots || [];
    const groupedHtml = groupedBoxes.length
      ? groupedBoxes.map(p => `<div class="chart-block" style="margin-top:0.85rem"><div class="chart-heading"><strong>${escapeHtml(p.numeric)} by ${escapeHtml(p.category)}</strong><span>grouped box plot · axis values from your file</span></div>${svgGroupedBox(p)}</div>`).join('')
      : '<p class="muted-copy">No numeric × category pairs found for grouped box plots (need a low-cardinality column like gender).</p>';

    const pies = graphs.categorical_pies || [];
    const catHtml = pies.length
      ? pies.map(p => {
          const maxV = Math.max(...(p.values || [1]), 1);
          const rows = (p.labels || []).map((lab, i) => {
            const v = (p.values || [])[i] || 0;
            return `<div class="chart-row"><span style="color:var(--accent);font-weight:600">${escapeHtml(lab)}</span><i><b style="width:${(v / maxV) * 100}%"></b></i><strong>${v}</strong></div>`;
          }).join('');
          return `<div class="chart-block"><div class="chart-heading"><strong>${escapeHtml(p.column)}</strong><span>category counts</span></div>${rows}</div>`;
        }).join('')
      : '<div class="chart-block"><p class="muted-copy">No low-cardinality categorical columns for count plots.</p></div>';

    const corr = graphs.correlation || {};
    const corrCols = corr.columns || [];
    const corrMatrix = corr.matrix || [];
    let corrHtml = '<p class="muted-copy">Not enough numeric features for a correlation heatmap.</p>';
    if (corrCols.length >= 2) {
      const lookup = {};
      corrMatrix.forEach(cell => {
        if (!cell) return;
        const xv = cell.x != null ? cell.x : cell.column_x;
        const yv = cell.y != null ? cell.y : cell.column_y;
        const vv = cell.v != null ? cell.v : cell.value;
        if (xv != null && yv != null) lookup[String(yv) + '||' + String(xv)] = vv;
      });
      // also support raw 2d matrix if present
      if (!corrMatrix.length && Array.isArray(corr.matrix) && Array.isArray(corr.matrix[0])) {
        corr.matrix.forEach(function(row, i) {
          row.forEach(function(v, j) {
            lookup[corrCols[i] + '||' + corrCols[j]] = v;
          });
        });
      }
      const cellSize = Math.max(36, Math.min(56, Math.floor(320 / corrCols.length)));
      const cells = corrCols.map(y => corrCols.map(x => {
        let v = lookup[y + '||' + x];
        if (v == null) v = lookup[x + '||' + y];
        if (v == null && x === y) v = 1;
        if (v == null) {
          return '<div class="corr-cell" style="width:'+cellSize+'px;height:'+cellSize+'px;background:#2a2a32;display:flex;align-items:center;justify-content:center;font-size:10px;color:#6b7280" title="'+escapeHtml(y)+' vs '+escapeHtml(x)+'">—</div>';
        }
        v = Number(v);
        // diverging: blue (neg) → dark gray (0) → orange (pos)
        let bg, fg = '#f3f4f6';
        if (v >= 0) {
          const t = Math.min(1, v);
          bg = 'rgb(' + Math.round(42 + (240-42)*t) + ',' + Math.round(42 + (106-42)*t) + ',' + Math.round(50 + (29-50)*t) + ')';
          if (t < 0.35) fg = '#e5e7eb';
        } else {
          const t = Math.min(1, -v);
          bg = 'rgb(' + Math.round(42 + (56-42)*t) + ',' + Math.round(42 + (120-42)*t) + ',' + Math.round(50 + (200-50)*t) + ')';
        }
        return '<div class="corr-cell" style="width:'+cellSize+'px;height:'+cellSize+'px;background:'+bg+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:'+fg+';border-radius:4px" title="'+escapeHtml(y)+' vs '+escapeHtml(x)+': '+v.toFixed(3)+'">' + v.toFixed(2) + '</div>';
      }).join('')).join('');
      corrHtml = '<div style="overflow:auto;width:100%"><div class="corr-grid" style="display:grid;grid-template-columns:repeat('+corrCols.length+', '+cellSize+'px);gap:3px;width:max-content">' + cells + '</div>' +
        '<div style="margin-top:0.55rem;font-size:0.72rem;display:flex;flex-wrap:wrap;gap:0.45rem">' +
        corrCols.map(c => '<span style="color:var(--accent)">' + escapeHtml(c) + '</span>').join('') +
        '</div><div class="muted-copy" style="margin-top:0.25rem">Orange = positive · Blue = negative · values shown on every cell</div></div>';
    }

    const scatters = graphs.scatter_pairs || [];
    const scatterHtml = scatters.length
      ? scatters.slice(0, 4).map(pair => {
          const pts = pair.points || [];
          if (!pts.length) return '';
          const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
          const minX = Math.min(...xs), maxX = Math.max(...xs);
          const minY = Math.min(...ys), maxY = Math.max(...ys);
          const W = 280, H = 180, padL = 42, padR = 12, padT = 14, padB = 32;
          const plotW = W - padL - padR, plotH = H - padT - padB;
          const sx = (v) => padL + ((v - minX) / ((maxX - minX) || 1)) * plotW;
          const sy = (v) => padT + plotH - ((v - minY) / ((maxY - minY) || 1)) * plotH;
          const dots = pts.map(p => `<circle cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="2.4" fill="var(--accent)" opacity="0.8"/>`).join('');
          const xTicks = [minX, (minX + maxX) / 2, maxX];
          const yTicks = [minY, (minY + maxY) / 2, maxY];
          const xTickSvg = xTicks.map(t => {
            const x = sx(t);
            return `<line x1="${x}" y1="${padT + plotH}" x2="${x}" y2="${padT + plotH + 4}" stroke="var(--accent)"/><text x="${x}" y="${padT + plotH + 16}" text-anchor="middle" fill="var(--accent)" font-size="8">${niceNum(t)}</text>`;
          }).join('');
          const yTickSvg = yTicks.map(t => {
            const y = sy(t);
            return `<line x1="${padL - 4}" y1="${y}" x2="${padL}" y2="${y}" stroke="var(--accent)"/><text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="var(--accent)" font-size="8">${niceNum(t)}</text>`;
          }).join('');
          return `<div class="chart-block"><div class="chart-heading"><strong>${escapeHtml(pair.x)} vs ${escapeHtml(pair.y)}</strong><span>r = ${pair.correlation}</span></div>
            <svg viewBox="0 0 ${W} ${H}" width="100%" style="background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid var(--border)">
              <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="var(--accent)" stroke-opacity="0.5"/>
              <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="var(--accent)" stroke-opacity="0.5"/>
              ${yTickSvg}${xTickSvg}${dots}
              <text x="${padL + plotW / 2}" y="${H - 4}" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="700">${escapeHtml(pair.x)} (x)</text>
              <text x="12" y="${padT + plotH / 2}" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="700" transform="rotate(-90 12 ${padT + plotH / 2})">${escapeHtml(pair.y)} (y)</text>
            </svg></div>`;
        }).join('')
      : '<div class="chart-block"><p class="muted-copy">Need at least two numeric features for scatter pairs.</p></div>';

    const target = graphs.target || {};
    let targetHtml = '<p class="muted-copy">Set a target column to see class / regression target distribution.</p>';
    if (target.distribution) {
      const labels = target.distribution.labels || [];
      const counts = target.distribution.counts || [];
      const maxC = Math.max(...counts, 1);
      targetHtml = `<div class="chart-heading"><strong>${escapeHtml(target.target || 'target')}</strong><span>${escapeHtml(target.type || '')}</span></div>` +
        labels.map((lab, i) => `<div class="chart-row"><span style="color:var(--accent);font-weight:600">${escapeHtml(lab)}</span><i><b style="width:${(counts[i] / maxC) * 100}%"></b></i><strong>${counts[i]}</strong></div>`).join('');
    }

    const ts = graphs.time_series || {};
    let tsHtml = '<p class="muted-copy">No datetime + numeric measure pair detected for a time-series chart.</p>';
    if (ts.points && ts.points.length) {
      const vals = ts.points.map(p => p.value);
      const minV = Math.min(...vals), maxV = Math.max(...vals);
      const n = ts.points.length;
      const W = 360, H = 200, padL = 48, padR = 14, padT = 14, padB = 40;
      const plotW = W - padL - padR, plotH = H - padT - padB;
      const sx = (i) => padL + (i / Math.max(n - 1, 1)) * plotW;
      const sy = (v) => padT + plotH - ((v - minV) / ((maxV - minV) || 1)) * plotH;
      const poly = ts.points.map((p, i) => `${sx(i).toFixed(1)},${sy(p.value).toFixed(1)}`).join(' ');

      // denser Y ticks (5 levels) + light horizontal grid
      const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => minV + (maxV - minV) * t);
      const yTickSvg = yTicks.map(t => {
        const y = sy(t);
        return `<line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" stroke="var(--accent)" stroke-opacity="0.12"/>
          <line x1="${padL - 4}" y1="${y}" x2="${padL}" y2="${y}" stroke="var(--accent)"/>
          <text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="var(--accent)" font-size="10">${niceNum(t)}</text>`;
      }).join('');

      // Many evenly spaced date labels (~8–12), never skip years awkwardly
      const targetLabels = Math.min(12, Math.max(6, Math.floor(n / 8)));
      const step = Math.max(1, Math.floor((n - 1) / (targetLabels - 1)));
      const dateIdx = [];
      for (let i = 0; i < n; i += step) dateIdx.push(i);
      if (dateIdx[dateIdx.length - 1] !== n - 1) dateIdx.push(n - 1);

      function formatDateLabel(raw) {
        const s = String(raw || '');
        // Prefer YYYY-MM or Mon YYYY style when possible
        if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
          const [y, m] = s.split('-');
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          const mi = Math.max(0, Math.min(11, parseInt(m, 10) - 1));
          return months[mi] + ' ' + y;
        }
        if (/^\d{4}-\d{2}/.test(s)) return s;
        return s.slice(0, 12);
      }

      const dateSvg = dateIdx.map((i, k) => {
        const x = sx(i);
        const label = escapeHtml(formatDateLabel(ts.points[i].date));
        const rotate = dateIdx.length > 8;
        const text = rotate
          ? `<text x="${x}" y="${padT + plotH + 18}" text-anchor="end" fill="var(--accent)" font-size="9" transform="rotate(-35 ${x} ${padT + plotH + 18})">${label}</text>`
          : `<text x="${x}" y="${padT + plotH + 18}" text-anchor="middle" fill="var(--accent)" font-size="10">${label}</text>`;
        return `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + plotH}" stroke="var(--accent)" stroke-opacity="0.1"/>
          <line x1="${x}" y1="${padT + plotH}" x2="${x}" y2="${padT + plotH + 4}" stroke="var(--accent)"/>${text}`;
      }).join('');

      tsHtml = `<div class="chart-heading"><strong>${escapeHtml(ts.measure)} over ${escapeHtml(ts.date_column)}</strong><span>time series</span></div>
        <svg viewBox="0 0 ${W} ${H}" width="100%" style="background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid var(--border)">
          <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="var(--accent)" stroke-opacity="0.55"/>
          <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="var(--accent)" stroke-opacity="0.55"/>
          ${yTickSvg}${dateSvg}
          <polyline fill="none" stroke="var(--accent)" stroke-width="2.2" points="${poly}"/>
          <text x="${padL + plotW / 2}" y="${H - 6}" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="700">${escapeHtml(ts.date_column)}</text>
          <text x="14" y="${padT + plotH / 2}" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="700" transform="rotate(-90 14 ${padT + plotH / 2})">${escapeHtml(ts.measure)}</text>
        </svg>`;
    }

    const missCmp = graphs.missing_compare || [];
    const missCmpHtml = missCmp.length
      ? missCmp.slice(0, 10).map(r => `<div class="chart-row"><span style="color:var(--accent);font-weight:600">${escapeHtml(r.column)}</span><i><b style="width:${Math.min(r.before || 0, 100)}%;opacity:0.45"></b></i><strong>${formatStat(r.before)}% → ${formatStat(r.after)}%</strong></div>`).join('')
      : '<p class="muted-copy">No missingness comparison rows.</p>';

    const card = graphs.cardinality || [];
    const cardHtml = card.length
      ? card.slice(0, 12).map(r => `<div class="profile-row"><span style="color:var(--accent);font-weight:600">${escapeHtml(r.column)}</span><strong>${formatNumber(r.unique)} unique (${formatStat(r.unique_pct)}%)</strong></div>`).join('')
      : '<p class="muted-copy">No cardinality stats.</p>';


    // --- Overview dashboard cards (REAL data only from this clean response) ---
    function naCard(title, reason) {
      return '<div class="ov-card"><div class="ov-card-h">' + title + '</div>' +
        '<div class="ov-na">Not applicable — ' + reason + '</div></div>';
    }
    function ovCard(title, body) {
      return '<div class="ov-card"><div class="ov-card-h">' + title + '</div>' + body + '</div>';
    }

    // Inject overview styles once
    if (!document.getElementById('cr-overview-dash')) {
      var ost = document.createElement('style');
      ost.id = 'cr-overview-dash';
      ost.textContent = [
        '.ov-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.65rem;margin-bottom:0.75rem}',
        '.ov-card{background:rgba(18,18,24,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:0.85rem 0.95rem;min-height:160px}',
        '.ov-card.ov-span2{grid-column:span 2}',
        '.ov-line{width:100%;height:120px}',
        '.ov-table{width:100%;border-collapse:collapse;font-size:0.75rem}',
        '.ov-table th,.ov-table td{padding:0.35rem 0.45rem;border-bottom:1px solid rgba(255,255,255,0.08);text-align:left}',
        '.ov-table th{color:#9ca3af;font-weight:600;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.05em}',
        '.ov-card-h{font-family:ui-monospace,Menlo,monospace;font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;margin-bottom:0.55rem}',
        '.ov-na{font-size:0.82rem;color:#6b7280;line-height:1.45;padding:0.5rem 0}',
        '.ov-kpi-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:0.5rem;margin-bottom:0.75rem}',
        '.ov-kpi{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.65rem 0.75rem}',
        '.ov-kpi small{display:block;font-size:0.65rem;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.25rem}',
        '.ov-kpi strong{font-size:1.2rem;font-weight:700;color:#f3f4f6}',
        '.ov-kpi strong.accent{color:#f06a1d}',
        '@media (max-width:1100px){.ov-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}','@media (max-width:700px){.ov-grid{grid-template-columns:1fr!important}.ov-card.ov-span2{grid-column:span 1}}'
      ].join('');
      document.head.appendChild(ost);
    }

    // reuse report, readiness, raw, profile from earlier in renderResults
    var cleanedMeta = data.cleaned || {};

    // KPI strip — all values from API response
    const kpiHtml = [
      ['Rows (raw)', formatNumber(raw.rows), ''],
      ['Rows (cleaned)', formatNumber(cleanedMeta.rows), 'accent'],
      ['Columns', formatNumber(cleanedMeta.columns != null ? cleanedMeta.columns : raw.columns), ''],
      ['Cells repaired', formatNumber(report.cells_changed), 'accent'],
      ['Missing left', formatNumber(report.remaining_missing != null ? report.remaining_missing : profile.missing_cells), ''],
      ['ML readiness', (readiness.score != null ? readiness.score : '—') + '/100', 'accent'],
      ['Quality', readiness.status || '—', 'accent'],
      ['Rows removed', formatNumber(report.rows_removed), '']
    ].map(function(c) {
      return '<div class="ov-kpi"><small>' + c[0] + '</small><strong class="' + c[2] + '">' + c[1] + '</strong></div>';
    }).join('');

    // Missing values card — horizontal bars from graphs.missingness or eda
    const missSrc = (data.graphs && data.graphs.missingness) || [];
    let missBody = '';
    if (missSrc.length) {
      const maxM = Math.max.apply(null, missSrc.map(function(x){ return Number(x.percentage) || 0; }).concat([1]));
      missBody = missSrc.slice().sort(function(a,b){ return (b.percentage||0)-(a.percentage||0); }).slice(0, 8).map(function(item) {
        const pct = Number(item.percentage) || 0;
        return '<div class="chart-row"><span style="color:var(--accent);font-weight:600">' + escapeHtml(item.column) +
          '</span><i><b style="width:' + ((pct / maxM) * 100) + '%"></b></i><strong>' + pct + '%</strong></div>';
      }).join('');
    } else {
      missBody = '<div class="ov-na">No column missingness in this result.</div>';
    }

    // Data health — part-to-whole from real cell counts
    const afterRows = Number(cleanedMeta.rows) || 0;
    const afterCols = Number(cleanedMeta.columns) || 0;
    const totalCells = Math.max(1, afterRows * afterCols);
    const missCells = Number(report.remaining_missing != null ? report.remaining_missing : (profile.missing_cells || 0));
    const presentCells = Math.max(0, totalCells - missCells);
    const healthPct = Math.round((presentCells / totalCells) * 100);
    const healthBody = qualityPieSvg(healthPct, 'Present cells', 'Missing cells') +
      '<div style="margin-top:0.5rem;font-size:0.75rem;color:#9ca3af">Present ' + formatNumber(presentCells) +
      ' · Missing ' + formatNumber(missCells) + ' of ' + formatNumber(totalCells) + ' cells</div>';

    // Cleaning impact — real before/after
    const impactBody = '<div class="ov-kpi-row" style="margin:0">' +
      [['Before rows', formatNumber(report.rows_before || raw.rows)],
       ['After rows', formatNumber(report.rows_after || cleanedMeta.rows)],
       ['Cols removed', formatNumber(report.columns_removed)],
       ['Cells changed', formatNumber(report.cells_changed)]
      ].map(function(x){ return '<div class="ov-kpi"><small>'+x[0]+'</small><strong>'+x[1]+'</strong></div>'; }).join('') +
      '</div>';

    // Outliers — from graphs
    const outSrc = (data.graphs && data.graphs.outliers) || data.outliers || [];
    let outBody = '';
    if (outSrc.length) {
      outBody = outSrc.slice(0, 8).map(function(item) {
        const pct = Math.min(Number(item.percentage) || 0, 100);
        return '<div class="chart-row"><span style="color:var(--accent);font-weight:600">' + escapeHtml(item.column) +
          '</span><i><b class="outlier-bar" style="width:' + pct + '%"></b></i><strong>' + (item.count != null ? item.count : 0) + '</strong></div>';
      }).join('');
    } else {
      outBody = '<div class="ov-na">No IQR outliers detected in this result.</div>';
    }

    // Distribution line from first real histogram (bin counts — not fake time series)
    var distLineBody = '<div class="ov-na">No numeric distribution available.</div>';
    var ovHists = (data.graphs && data.graphs.histograms) || [];
    if (ovHists.length && ovHists[0].counts && ovHists[0].counts.length) {
      var h0 = ovHists[0];
      distLineBody = '<div style="font-size:0.72rem;color:#9ca3af;margin-bottom:0.35rem">' + escapeHtml(h0.column) + ' · bin frequencies</div>' +
        svgLineFromSeries(h0.counts, (h0.counts || []).map(function(_, i){ return 'bin ' + (i+1); }));
    }

    // Scatter summary — real pairs if present
    var scatterBody = '<div class="ov-na">Need ≥2 numeric columns for scatter.</div>';
    var ovScatters = (data.graphs && data.graphs.scatter) || (data.graphs && data.graphs.scatter_pairs) || [];
    if (ovScatters.length) {
      scatterBody = '<div style="font-size:0.75rem;color:#9ca3af">Showing in Analytics charts below · ' + ovScatters.length + ' pair(s)</div>';
    }

    // Cleaning status donut from real row retention
    var rowsBefore = Number(report.rows_before || (data.raw || {}).rows || 0);
    var rowsAfter = Number(report.rows_after || cleanedMeta.rows || 0);
    var rowsRemoved = Number(report.rows_removed || Math.max(0, rowsBefore - rowsAfter));
    var keepPct = rowsBefore > 0 ? Math.round((rowsAfter / rowsBefore) * 100) : 0;
    var cleanStatusBody = qualityPieSvg(keepPct, 'Retained rows', 'Removed rows') +
      '<div style="font-size:0.75rem;color:#9ca3af;margin-top:0.4rem">Kept ' + formatNumber(rowsAfter) +
      ' of ' + formatNumber(rowsBefore) + ' rows</div>';

    // Error / quality status from readiness + warnings
    var warns = (report.warnings || []).length;
    var errBody = '<div class="ov-kpi-row" style="margin:0">' +
      '<div class="ov-kpi"><small>Status</small><strong class="accent">' + escapeHtml(readiness.status || '—') + '</strong></div>' +
      '<div class="ov-kpi"><small>Score</small><strong>' + (readiness.score != null ? readiness.score : '—') + '/100</strong></div>' +
      '<div class="ov-kpi"><small>Warnings</small><strong>' + warns + '</strong></div>' +
      '<div class="ov-kpi"><small>Cells fixed</small><strong class="accent">' + formatNumber(report.cells_changed) + '</strong></div>' +
      '</div>';

    const overviewHtml =
      '<div class="ov-kpi-row">' + kpiHtml + '</div>' +
      '<div class="ov-grid">' +
        '<div class="ov-card ov-span2"><div class="ov-card-h">Distribution profile (real bins)</div>' + distLineBody + '</div>' +
        ovCard('Error / quality status', errBody) +
        ovCard('Missing values (by column)', missBody) +
        ovCard('Data health (cell completeness)', healthBody) +
        ovCard('Cleaning impact', impactBody) +
        ovCard('Outliers (IQR)', outBody) +
        ovCard('Row retention', cleanStatusBody) +
        naCard('Data volume trend (30d)', 'no multi-day run history is stored yet') +
        naCard('Pipeline run history', 'pipeline runs are not persisted in the database') +
      '</div>';



    // Prefer dedicated overview panel; else prepend into graphs-content later
    const overviewPanel = document.querySelector('#overview-content');
    if (overviewPanel) {
      overviewPanel.innerHTML = overviewHtml;
      overviewPanel.style.display = 'block';
    }

    const graphsEl = document.querySelector('#graphs-content');
    if (graphsEl) {
      // --- 3-tab EDA dashboard (3-column grid, real data only) ---
      var dtypeRows = Object.entries(graphs.dtypes || {}).map(function(pair) {
        return '<div class="profile-row"><span style="color:var(--accent);font-weight:700">' + escapeHtml(pair[0]) + '</span><strong>' + pair[1] + '</strong></div>';
      }).join('') || '<p class="muted-copy">No dtype data.</p>';

      var tabCss = [
        '#graphs-content{width:100%!important;max-width:100%!important}',
        '.eda-tabs{display:flex;gap:0.35rem;margin-bottom:0.75rem;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:0.5rem}',
        '.eda-tab{background:transparent;border:1px solid rgba(255,255,255,0.12);color:#c8c4bc;padding:0.45rem 0.9rem;border-radius:8px;cursor:pointer;font-size:0.78rem;font-weight:600}',
        '.eda-tab.active{background:rgba(240,106,29,0.18);border-color:#f06a1d;color:#f06a1d}',
        '.eda-panel{display:none;width:100%}',
        '.eda-panel.active{display:block}',
        '.eda-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:0.7rem!important;width:100%!important}','.eda-grid > *{min-width:0!important;width:100%!important;box-sizing:border-box!important}','.eda-grid > .chart-block{min-height:200px!important}',
        '.eda-grid .chart-block,.eda-grid .eda-card{min-height:0;height:100%;margin:0!important;width:100%;box-sizing:border-box;overflow:visible;padding:0.75rem}',
        '.eda-grid .chart-block svg{width:100%;max-width:100%;height:auto;display:block}',
        '.eda-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:12px}',
        '.eda-card h4{margin:0 0 0.5rem;font-size:0.78rem;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em}',
        '.eda-kpi{font-size:1.35rem;font-weight:700;color:#f3f4f6}',
        '.eda-kpi.accent{color:#f06a1d}',
        '.eda-span2{grid-column:span 2}',
        '.eda-span3{grid-column:span 3}','.eda-grid > .chart-block{min-height:200px}','.eda-grid .hist-card,.eda-grid > .chart-block.hist-card{min-height:200px}','.corr-grid{display:grid;gap:3px}','.corr-cell{border-radius:4px}','.cr-ov-layout{display:grid;grid-template-columns:1.4fr 1.4fr 1fr;grid-template-rows:auto auto;gap:0.75rem;width:100%}','.cr-ov-trend{grid-column:1/3;grid-row:1;min-height:200px}','.cr-ov-quality{grid-column:3;grid-row:1;min-height:200px}','.cr-ov-health{grid-column:1;grid-row:2;min-height:180px}','.cr-ov-pipe{grid-column:2;grid-row:2;min-height:180px}','.cr-ov-metrics{grid-column:3;grid-row:2;min-height:180px}','@media (max-width:1100px){.cr-ov-layout{grid-template-columns:1fr 1fr}.cr-ov-trend{grid-column:1/-1}.cr-ov-quality{grid-column:1/-1}}','@media (max-width:700px){.cr-ov-layout{grid-template-columns:1fr}.cr-ov-trend,.cr-ov-quality,.cr-ov-health,.cr-ov-pipe,.cr-ov-metrics{grid-column:1}}',
        '@media (max-width:1100px){.eda-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.eda-span2,.eda-span3{grid-column:span 1}}',
        '@media (max-width:700px){.eda-grid{grid-template-columns:1fr!important}}'
      ].join('');

      var r = data.report || {};
      var rd = data.readiness || {};
      var rawM = data.raw || {};
      var clM = data.cleaned || {};
      var pr = data.profile || {};

      // Reference layout proportions:
      // [  LARGE TREND (2 cols)  | QUALITY SCORE ]
      // [ HEALTH | PIPELINES     | KEY METRICS   ]
      var ovHealthPct = (function(){
        var rows = Number(clM.rows)||0, cols = Number(clM.columns)||0;
        var total = Math.max(1, rows*cols);
        var miss = Number(r.remaining_missing != null ? r.remaining_missing : (pr.missing_cells||0));
        return Math.round(((total-miss)/total)*100);
      })();
      var volumeBars = '';
      var ovH = (data.graphs && data.graphs.histograms) || [];
      if (ovH.length && ovH[0].counts) {
        var counts = ovH[0].counts.map(function(c){ return Number(c)||0; });
        var maxC = Math.max.apply(null, counts.concat([1]));
        volumeBars = '<div style="display:flex;align-items:flex-end;gap:3px;height:140px;width:100%;padding:0.25rem 0">' +
          counts.map(function(n){
            var h = Math.max(4, Math.round((n/maxC)*100));
            return '<div title="'+n+'" style="flex:1;height:'+h+'%;min-width:6px;background:linear-gradient(180deg,#ff9a4a,#f06a1d);border-radius:3px 3px 0 0"></div>';
          }).join('') + '</div>' +
          '<div class="muted-copy" style="margin-top:0.35rem">' + escapeHtml(ovH[0].column || 'distribution') + ' · bin frequencies from this clean run</div>';
      } else {
        volumeBars = '<p class="muted-copy">Not applicable — no distribution bins for volume profile.</p>';
      }
      var qScore = rd.score != null ? rd.score : '—';
      var overviewGrid =
        '<div class="cr-ov-layout">' +
          '<div class="cr-ov-trend eda-card">' +
            '<h4>Data volume profile</h4>' +
            volumeBars +
          '</div>' +
          '<div class="cr-ov-quality eda-card">' +
            '<h4>Data quality score</h4>' +
            '<div class="eda-kpi accent" style="font-size:2rem">' + qScore + '<span style="font-size:0.9rem;color:#9ca3af">/100</span></div>' +
            '<div class="muted-copy" style="margin-top:0.4rem">Status: <strong style="color:var(--accent)">' + escapeHtml(rd.status || '—') + '</strong></div>' +
            '<div class="muted-copy">Cells repaired: ' + formatNumber(r.cells_changed) + '</div>' +
            '<div class="muted-copy">Missing left: ' + formatNumber(r.remaining_missing != null ? r.remaining_missing : pr.missing_cells) + '</div>' +
          '</div>' +
          '<div class="cr-ov-health eda-card">' +
            '<h4>Data health overview</h4>' +
            (typeof qualityPieSvg === 'function' ? qualityPieSvg(healthPct, 'Present cells', 'Missing cells') : '') +
            '<div class="muted-copy" style="margin-top:0.35rem">Completeness ' + healthPct + '%</div>' +
          '</div>' +
          '<div class="cr-ov-pipe eda-card">' +
            '<h4>Active pipelines</h4>' +
            '<p class="muted-copy">Not applicable — pipeline runs are not persisted in the database.</p>' +
            '<div class="muted-copy" style="margin-top:0.5rem">This clean run: <strong style="color:#f3f4f6">' + escapeHtml(data.file_name || 'dataset') + '</strong></div>' +
            '<div class="muted-copy">Plan: ' + escapeHtml((data.plan && data.plan.name) || '—') + '</div>' +
          '</div>' +
          '<div class="cr-ov-metrics eda-card">' +
            '<h4>Key metrics</h4>' +
            '<div class="profile-row"><span>Rows (raw)</span><strong>' + formatNumber(rawM.rows) + '</strong></div>' +
            '<div class="profile-row"><span>Rows (cleaned)</span><strong style="color:var(--accent)">' + formatNumber(clM.rows) + '</strong></div>' +
            '<div class="profile-row"><span>Columns</span><strong>' + formatNumber(clM.columns != null ? clM.columns : rawM.columns) + '</strong></div>' +
            '<div class="profile-row"><span>Duplicates</span><strong>' + formatNumber(pr.duplicate_rows) + '</strong></div>' +
            '<div class="profile-row"><span>Rows removed</span><strong>' + formatNumber(r.rows_removed) + '</strong></div>' +
            '<div class="profile-row"><span>Cols removed</span><strong>' + formatNumber(r.columns_removed) + '</strong></div>' +
          '</div>' +
        '</div>';


      // Flat 3-column grid: each real chart is a direct cell (no empty shells)
      function stripOuterBlocks(html) {
        // histHtml/catHtml may already be multiple .chart-block roots — use as-is
        return html || '';
      }
      var edaParts = [];
      // Missingness
      edaParts.push('<div class="chart-block"><div class="chart-heading"><strong>Missingness by column</strong></div>' + (missingHtml || '<p class="muted-copy">No missingness in this result.</p>') + '</div>');
      // Outliers
      edaParts.push('<div class="chart-block"><div class="chart-heading"><strong>Outliers (IQR)</strong></div>' + (outlierHtml || '<p class="muted-copy">No outliers detected.</p>') + '</div>');
      // Skewness
      edaParts.push('<div class="chart-block"><div class="chart-heading"><strong>Skewness</strong></div>' + (skewHtml || '<p class="muted-copy">No skewness data.</p>') + '</div>');
      // Histograms — each hist is already a chart-block; inject directly into grid
      if (histHtml && histHtml.indexOf('chart-block') >= 0) {
        edaParts.push(histHtml);
      } else {
        edaParts.push('<div class="chart-block"><div class="chart-heading"><strong>Numerical distributions</strong></div>' + (histHtml || '<p class="muted-copy">No histograms.</p>') + '</div>');
      }
      // Category counts — each is already chart-block
      if (catHtml && catHtml.indexOf('chart-block') >= 0) {
        edaParts.push(catHtml);
      } else {
        edaParts.push('<div class="chart-block"><div class="chart-heading"><strong>Category counts</strong></div>' + (catHtml || '<p class="muted-copy">No categories.</p>') + '</div>');
      }
      // Box plots
      edaParts.push('<div class="chart-block"><div class="chart-heading"><strong>Box plots</strong></div>' + (boxHtml || '<p class="muted-copy">No box plots.</p>') + '</div>');
      // Stats
      edaParts.push('<div class="chart-block"><div class="chart-heading"><strong>Descriptive statistics</strong></div>' + (statsHtml || '<p class="muted-copy">No stats.</p>') + '</div>');
      // Fill remaining cells if fewer than 3 in last row so no empty look — skip blank fillers
      var edaGrid = '<div class="eda-grid">' + edaParts.join('') + '</div>';


      var advGrid =
        '<div class="eda-grid">' +
          '<div class="chart-block eda-span3"><div class="chart-heading"><strong>Correlation heatmap</strong><span>Pearson</span></div>' + (corrHtml || '<p class="muted-copy">Not applicable — need multiple numeric columns.</p>') + '</div>' +
          '<div class="chart-block eda-span3"><div class="chart-heading"><strong>Scatter relationships</strong></div><div class="eda-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">' + (scatterHtml || '<p class="muted-copy">Not applicable — need ≥2 numeric columns.</p>') + '</div></div>' +
          '<div class="chart-block"><div class="chart-heading"><strong>Grouped box plots</strong></div>' + (groupedHtml || '<p class="muted-copy">Not applicable for this dataset.</p>') + '</div>' +
          '<div class="chart-block"><div class="chart-heading"><strong>Target health</strong></div>' + (targetHtml || '<p class="muted-copy">No target analysis.</p>') + '</div>' +
          '<div class="chart-block"><div class="chart-heading"><strong>Missingness before → after</strong></div>' + (missCmpHtml || '<p class="muted-copy">No comparison data.</p>') + '</div>' +
          '<div class="chart-block"><div class="chart-heading"><strong>Cardinality</strong></div>' + (cardHtml || '<p class="muted-copy">No cardinality data.</p>') + '</div>' +
          '<div class="chart-block eda-span2"><div class="chart-heading"><strong>Time series</strong></div>' + (tsHtml || '<p class="muted-copy">Not applicable — no datetime columns detected.</p>') + '</div>' +
          '<div class="eda-card"><h4>Pipeline history</h4><p class="muted-copy">Not applicable — runs are not persisted.</p></div>' +
        '</div>';

      graphsEl.innerHTML = (overviewPanel ? '' : (typeof overviewHtml !== 'undefined' ? overviewHtml : '')) +
        '<style>' + tabCss + '</style>' +
        '<div class="eda-tabs">' +
          '<button type="button" class="eda-tab active" data-eda-tab="overview">Data Overview</button>' +
          '<button type="button" class="eda-tab" data-eda-tab="eda">Exploratory Analysis</button>' +
          '<button type="button" class="eda-tab" data-eda-tab="advanced">Advanced Analytics</button>' +
        '</div>' +
        '<div class="eda-panel active" data-eda-panel="overview">' + overviewGrid + '</div>' +
        '<div class="eda-panel" data-eda-panel="eda">' + edaGrid + '</div>' +
        '<div class="eda-panel" data-eda-panel="advanced">' + advGrid + '</div>';

      graphsEl.querySelectorAll('.eda-tab').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var id = btn.getAttribute('data-eda-tab');
          graphsEl.querySelectorAll('.eda-tab').forEach(function(b){ b.classList.toggle('active', b === btn); });
          graphsEl.querySelectorAll('.eda-panel').forEach(function(p){
            p.classList.toggle('active', p.getAttribute('data-eda-panel') === id);
          });
        });
      });

    }

  }

  if (cvInput) {
    cvInput.addEventListener('change', async () => {
      const file = cvInput.files?.[0];
      if (!file) return;
      if (!planSelect || planSelect.value !== 'premium') {
        if (cvMessage) cvMessage.textContent = 'Select Premium to prepare image ZIPs for CNN.';
        return;
      }
      if (cvMessage) cvMessage.textContent = 'Preparing RGB 224×224 image metadata...';
      const body = new FormData();
      body.append('file', file);
      body.append('plan', 'premium');
      try {
        const response = await fetch('/api/cv/prepare', { method: 'POST', body, credentials: 'include' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'CV prepare failed');
        if (cvMessage) cvMessage.textContent = `${data.images_processed || 0} images prepared for CNN metadata.`;
      } catch (error) {
        if (cvMessage) cvMessage.textContent = error.message;
      }
    });
  }

  // Result tab buttons if present
  document.querySelectorAll('[data-result-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-result-tab');
      document.querySelectorAll('[data-result-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('[data-tab-panel]').forEach(panel => {
        panel.style.display = panel.getAttribute('data-tab-panel') === tab ? 'block' : 'none';
      });
    });
  });

  
  function ensureAuthAndPayPanel() {
    if (document.getElementById('cr-auth-pay')) return;
    var planCard = planSelect && planSelect.closest('.glass-panel');
    if (!planCard) return;
    var panel = document.createElement('div');
    panel.id = 'cr-auth-pay';
    panel.style.cssText = 'margin-top:1rem;padding-top:0.9rem;border-top:1px solid var(--border, #243044);font-size:0.82rem';
    panel.innerHTML =
      '<div id="cr-user-line" style="margin-bottom:.55rem;color:var(--ink-3,#8b9bb0)"></div>' +
      '<div style="font-size:0.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3,#8b9bb0);margin-bottom:.45rem">Upgrade (direct pay)</div>' +
      '<select id="cr-pay-method" style="width:100%;padding:.4rem;border-radius:8px;border:1px solid var(--border);background:var(--surface-2,#1a2233);color:inherit;margin-bottom:.4rem">' +
      '<option value="bank_transfer">Bank transfer / Meezan</option>' +
      '<option value="easypaisa">EasyPaisa</option>' +
      '<option value="jazzcash">JazzCash / Earn</option>' +
      '<option value="meezan">Meezan Bank account</option></select>' +
      '<div style="display:flex;gap:.35rem;margin-bottom:.4rem;flex-wrap:wrap">' +
      '<button type="button" class="cr-buy" data-plan="basic" style="flex:1;min-width:70px;padding:.4rem;border-radius:8px;border:1px solid var(--border);background:transparent;color:inherit;cursor:pointer;font-size:.75rem;font-weight:650">Basic</button>' +
      '<button type="button" class="cr-buy" data-plan="normal" style="flex:1;min-width:70px;padding:.4rem;border-radius:8px;border:1px solid var(--border);background:transparent;color:inherit;cursor:pointer;font-size:.75rem;font-weight:650">Normal</button>' +
      '<button type="button" class="cr-buy" data-plan="premium" style="flex:1;min-width:70px;padding:.4rem;border-radius:8px;border:1px solid var(--border);background:transparent;color:inherit;cursor:pointer;font-size:.75rem;font-weight:650">Premium</button>' +
      '</div>' +
      '<div id="cr-pay-instructions" style="font-size:.72rem;color:var(--ink-3,#8b9bb0);line-height:1.4;margin-bottom:.4rem;white-space:pre-wrap"></div>' +
      '<input id="cr-order-id" type="hidden" />' +
      '<input id="cr-txn" type="text" placeholder="Paste Transaction ID after payment" style="width:100%;padding:.45rem .55rem;border-radius:8px;border:1px solid var(--border);background:var(--surface-2,#1a2233);color:inherit;font-size:.78rem;margin-bottom:.35rem" />' +
      '<button type="button" id="cr-submit-txn" style="width:100%;padding:.45rem;border-radius:8px;border:1px solid var(--accent,#3dd6c6);color:var(--accent,#3dd6c6);background:transparent;cursor:pointer;font-size:.78rem;font-weight:650;margin-bottom:.35rem">Submit payment proof</button>' +
      '<a href="/login" style="font-size:.75rem;color:var(--accent,#3dd6c6)">Login / Sign up</a>' +
      ' · <button type="button" id="cr-logout" style="font-size:.75rem;background:none;border:none;color:var(--ink-3);cursor:pointer;text-decoration:underline">Log out</button>';
    planCard.appendChild(panel);

    function refreshUser() {
      if (!currentToken()) {
        document.getElementById('cr-user-line').innerHTML = 'Not logged in — <a href="/login" style="color:var(--accent)">create account</a> to buy a plan';
        if (planSelect) { planSelect.disabled = true; planSelect.value = 'free'; try { updatePlan(); } catch (e) {} }
        window.__crUser = null;
        return;
      }
      fetch('/api/auth/me', { headers: authHeaders(), credentials: 'include' })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var u = d.user;
          if (!u) {
            document.getElementById('cr-user-line').textContent = 'Session expired — please log in again';
            return;
          }
          window.__crUser = u;
          var exp = u.subscription_expires_iso ? (' · expires ' + u.subscription_expires_iso.slice(0, 10)) : '';
          var adminTag = u.is_admin
            ? ' <span style="color:#3ecf8e;font-weight:700">ADMIN</span>'
            : ' <span style="color:var(--ink-3)">(not admin)</span>';
          document.getElementById('cr-user-line').innerHTML =
            '<div><strong style="color:var(--ink)">' + (u.name || u.email) + '</strong>' + adminTag + '</div>' +
            '<div style="font-size:.72rem;color:var(--ink-3);margin:.15rem 0">' + (u.email || '') + '</div>' +
            '<div>plan: <span style="color:var(--accent)">' + (u.effective_plan || u.plan_key || 'free') + '</span>' + exp +
            ' · <button type="button" id="cr-logout-top" style="margin-left:.15rem;padding:.25rem .55rem;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--ink-2);cursor:pointer;font-size:.72rem;font-weight:650">Log out</button></div>';
          var lo = document.getElementById('cr-logout-top');
          if (lo) lo.onclick = function () {
            fetch('/api/auth/logout', { method: 'POST', headers: authHeaders(), credentials: 'include' }).finally(function () {
              try { localStorage.removeItem('cleanroom_token'); } catch (e) {}
              window.location.href = '/login';
            });
          };
          if (planSelect) {
            var ep = u.effective_plan || u.plan_key || 'free';
            planSelect.value = ep;
            // Only admin can change plan dropdown; others locked to their subscription
            planSelect.disabled = !u.is_admin;
            if (u.is_admin) {
              planSelect.title = 'Admin: you can switch plans for testing';
            } else {
              planSelect.title = 'Plan locked to your subscription. Upgrade via payment below.';
            }
            try { updatePlan(); } catch (e) {}
          }
        }).catch(function () {});
    }
    refreshUser();

    fetch('/api/payments/instructions').then(function (r) { return r.json(); }).then(function (ins) {
      window.__crPayIns = ins;
    }).catch(function () {});

    panel.querySelectorAll('.cr-buy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!currentToken()) { setMessage('Please log in first (/login)', 'error'); return; }
        var plan = btn.getAttribute('data-plan');
        var method = (document.getElementById('cr-pay-method') || {}).value || 'bank_transfer';
        fetch('/api/payments/order', {
          method: 'POST', headers: authHeaders(),
          body: JSON.stringify({ plan: plan, method: method }),
        }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
          .then(function (res) {
            if (!res.ok) throw new Error(res.d.detail || 'Order failed');
            document.getElementById('cr-order-id').value = res.d.order.id;
            var ins = res.d.instructions || window.__crPayIns || {};
            var m = ins[method] || ins.bank_transfer || {};
            var lines = [
              'Pay Rs ' + res.d.order.amount_pkr + ' for ' + plan,
              m.bank ? ('Bank: ' + m.bank) : '',
              m.title ? ('Title: ' + m.title) : (m.account_name ? ('Name: ' + m.account_name) : ''),
              m.account ? ('Account: ' + m.account) : '',
              m.iban ? ('IBAN: ' + m.iban) : '',
              m.mobile ? ('Mobile: ' + m.mobile) : '',
              m.note || '',
              'Then paste the Transaction ID below and submit.',
              'Test codes: TEST-BASIC-2026 / TEST-NORMAL-2026 / TEST-PREMIUM-2026 / TEST-ANY-2026',
            ].filter(Boolean);
            document.getElementById('cr-pay-instructions').textContent = lines.join('\n');
            setMessage('Order created — send payment then submit TXN ID.', 'ok');
          }).catch(function (err) { setMessage(String(err.message || err), 'error'); });
      });
    });

        document.getElementById('cr-submit-txn').addEventListener('click', function () {
      function showPayMsg(text, kind) {
        try { setMessage(text, kind || ''); } catch (e) {}
        var box = document.getElementById('cr-pay-instructions');
        if (box) {
          box.style.color = kind === 'error' ? '#e05a62' : (kind === 'ok' ? 'var(--accent,#f06a1d)' : 'var(--ink-2)');
          box.textContent = text;
        }
      }
      function parseJsonSafe(r) {
        return r.text().then(function (text) {
          var d = null;
          try {
            if (/<!DOCTYPE|<html[\s>]|Bad Gateway/i.test(text || '')) throw new Error('html');
            d = text ? JSON.parse(text) : {};
          } catch (e) {
            throw new Error(safeErrorMessage(r.status, text, 'Server returned an unexpected response.'));
          }
          return { ok: r.ok, d: d, status: r.status };
        });
      }
      if (!currentToken()) {
        showPayMsg('Please log in first (/login).', 'error');
        return;
      }
      var txn = ((document.getElementById('cr-txn') || {}).value || '').trim();
      if (!txn || txn.length < 4) {
        showPayMsg('Paste a transaction ID first (e.g. TEST-BASIC-2026).', 'error');
        return;
      }
      var method = (document.getElementById('cr-pay-method') || {}).value || 'bank_transfer';
      var planGuess = 'basic';
      var tUp = txn.toUpperCase();
      if (tUp.indexOf('PREMIUM') >= 0) planGuess = 'premium';
      else if (tUp.indexOf('NORMAL') >= 0) planGuess = 'normal';
      else if (tUp.indexOf('BASIC') >= 0) planGuess = 'basic';

      showPayMsg('Activating ' + planGuess + ' with test code…', 'info');
      fetch('/api/payments/redeem-test', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ txn_id: txn, plan: planGuess, method: method }),
      })
        .then(parseJsonSafe)
        .then(function (res) {
          if (!res.ok) {
            var detail = res.d && res.d.detail;
            throw new Error(typeof detail === 'string' ? detail : (detail ? JSON.stringify(detail) : ('HTTP ' + res.status)));
          }
          var st = res.d.order && res.d.order.status;
          if (st === 'verified') {
            showPayMsg('Payment verified — ' + planGuess + ' activated for 30 days.', 'ok');
          } else {
            showPayMsg('Submitted (status: ' + (st || 'unknown') + '). Waiting for admin if not a test code.', 'ok');
          }
          var oidEl = document.getElementById('cr-order-id');
          if (oidEl && res.d.order) oidEl.value = res.d.order.id;
          refreshUser();
        })
        .catch(function (err) { showPayMsg(String(err.message || err), 'error'); });
    });

    document.getElementById('cr-logout').addEventListener('click', function () {
      fetch('/api/auth/logout', { method: 'POST', headers: authHeaders(), credentials: 'include' }).finally(function () {
        try { localStorage.removeItem('cleanroom_token'); } catch (e) {}
        window.location.href = '/login';
      });
    });
  }



  // Fix gender/country dropdown option values (works even if React bundle has old labels)
  function normalizeEncodingSelects() {
    var g = document.querySelector('select[name="gender_mode"]');
    if (g && !g.dataset.crFixed) {
      g.dataset.crFixed = '1';
      g.innerHTML = ''
        + '<option value="keep_text">Keep text (male / female)</option>'
        + '<option value="binary">Binary (0/1 single column)</option>'
        + '<option value="onehot">One-hot (gender_female / gender_male)</option>';
      g.value = 'keep_text';
    }
    var c = document.querySelector('select[name="country_mode"]');
    if (!c) {
      // insert country select next to gender if missing (old React build)
      var gsel = document.querySelector('select[name="gender_mode"]');
      if (gsel && gsel.parentElement) {
        var wrap = document.createElement('div');
        wrap.style.marginTop = '0.75rem';
        wrap.innerHTML = '<label style="display:block;font-size:0.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);margin-bottom:0.35rem">Country encoding</label>'
          + '<select name="country_mode" style="width:100%;padding:0.55rem 0.7rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2,#1a2233);color:inherit">'
          + '<option value="keep_text">Keep text (country names)</option>'
          + '<option value="label">Label-encode (1, 2, 3…)</option>'
          + '<option value="onehot">One-hot encode countries</option>'
          + '</select>';
        gsel.parentElement.insertAdjacentElement('afterend', wrap);
      }
    } else if (!c.dataset.crFixed) {
      c.dataset.crFixed = '1';
      c.innerHTML = ''
        + '<option value="keep_text">Keep text (country names)</option>'
        + '<option value="label">Label-encode (1, 2, 3…)</option>'
        + '<option value="onehot">One-hot encode countries</option>';
      c.value = 'keep_text';
    }
  }
  // run after React paints
  setTimeout(normalizeEncodingSelects, 50);
  setTimeout(normalizeEncodingSelects, 400);
  setTimeout(normalizeEncodingSelects, 1200);

  try { ensureAuthAndPayPanel(); } catch (e) { console.warn('auth panel', e); }
  try { updatePlan(); } catch (e) {}
  // Re-apply free-plan labels after React hydration (avoids stale 1K text)
  ;[100, 400, 1000, 2000].forEach(function (ms) {
    setTimeout(function () {
      try {
        if (planSelect) {
          var labels = {
            free: 'Free · 5K rows · Rs 0',
            basic: 'Basic · 100K rows · Rs 1,500/mo',
            normal: 'Normal · 500K rows · Rs 3,500/mo',
            premium: 'Premium · 2M rows · Rs 6,000/mo',
          };
          Array.prototype.forEach.call(planSelect.options, function (opt) {
            if (labels[opt.value]) opt.text = labels[opt.value];
          });
        }
        updatePlan();
      } catch (e) {}
    }, ms);
  });


  // FE_HINT_INJECT — note near Ask Gemini + persist key via account
  (function () {
    function ensureGeminiHint() {
      var panels = document.querySelectorAll('div');
      panels.forEach(function (div) {
        if (div.dataset.crFeHint) return;
        var txt = (div.textContent || '');
        if (txt.indexOf('Ask Gemini') >= 0 && txt.indexOf('aistudio.google.com') >= 0 && div.querySelector('input[type="password"]')) {
          div.dataset.crFeHint = '1';
          var tip = document.createElement('div');
          tip.style.cssText = 'font-size:0.7rem;color:var(--accent,#f06a1d);margin-top:6px;line-height:1.35';
          tip.innerHTML = '💡 Paste <strong>your own</strong> Gemini key once — saved on your account only, never shared.';
          var keyBox = div.querySelector('input[type="password"]');
          if (keyBox && keyBox.parentElement) keyBox.parentElement.appendChild(tip);
          // Save key on change → THIS logged-in user only
          keyBox.addEventListener('change', function () {
            var k = keyBox.value.trim();
            if (!k) return;
            var tok = '';
            try { tok = localStorage.getItem('cleanroom_token') || ''; } catch (e) {}
            if (!tok) return;
            fetch('/api/auth/gemini-key', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
              body: JSON.stringify({ api_key: k }),
            }).then(function () {
              return fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + tok } });
            }).then(function (r) { return r.json(); }).then(function (d) {
              var uid = d && d.user && (d.user.id || d.user.email);
              if (uid) {
                try { localStorage.setItem('cleanroom_gemini_key_' + uid, k); } catch (e) {}
              }
              try { localStorage.removeItem('cleanroom_gemini_key'); } catch (e) {}
            }).catch(function () {});
          });
        }
      });
    }
    setInterval(ensureGeminiHint, 1500);
    // Remove legacy shared key that leaked admin key across accounts
    try { localStorage.removeItem('cleanroom_gemini_key'); } catch (e) {}
    // Prefill from THIS user's scoped localStorage only (server no longer returns raw key)
    try {
      var tok = localStorage.getItem('cleanroom_token');
      if (tok) {
        fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + tok } })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            var uid = d && d.user && (d.user.id || d.user.email);
            if (!uid) return;
            var k = '';
            try { k = localStorage.getItem('cleanroom_gemini_key_' + uid) || ''; } catch (e) {}
            if (!k) return;
            document.querySelectorAll('input[type="password"]').forEach(function (inp) {
              var ph = (inp.placeholder || '').toLowerCase();
              if (ph.indexOf('api') >= 0 || ph.indexOf('aiza') >= 0) {
                if (!inp.value) {
                  inp.value = k;
                  inp.dispatchEvent(new Event('input', { bubbles: true }));
                }
              }
            });
          }).catch(function () {});
      }
    } catch (e) {}
  })();


  // Readable text boost (~10% size + higher contrast secondary text)
  (function () {
    if (document.getElementById('cr-readable-css')) return;
    var s = document.createElement('style');
    s.id = 'cr-readable-css';
    s.textContent = [
      'html { font-size: 110% !important; }',
      '.theme-dark, .theme-dark .glass-panel { --ink: #faf7f2; --ink-2: #e2d9ce; --ink-3: #c4b8a8; }',
      '.theme-light, .theme-light .glass-panel { --ink: #16120f; --ink-2: #3d3832; --ink-3: #5c534a; }',
      'body, .dashboard-container, .glass-panel { color: var(--ink) !important; }',
      '.theme-dark .glass-panel, .theme-dark .glass-panel p, .theme-dark .glass-panel span, .theme-dark .glass-panel label, .theme-dark .glass-panel div { color: var(--ink-2); }',
      '.theme-dark .glass-panel strong, .theme-dark .glass-panel h1, .theme-dark .glass-panel h2, .theme-dark .glass-panel h3 { color: var(--ink) !important; }',
      '#limit-text, #feature-text, #cr-user-line, #cr-pay-instructions, #message { color: var(--ink-2) !important; opacity: 1 !important; }',
      'select, input, button, textarea { font-size: 1em !important; }',
      '.metric small { color: var(--ink-2) !important; opacity: 1 !important; }',
    ].join('\\n');
    document.head.appendChild(s);
  })();


  // Extra cleaning / method controls (feature parity UI)
  (function injectExtraSettings() {
    function once() {
      var list = document.querySelector('.setting-list');
      if (!list || list.dataset.crExtra) return;
      list.dataset.crExtra = '1';
      var extraClean = [
        ['strict_type_coercion', 'Strict type coercion', true, 'Cast $1,200 / 15% style strings to numbers'],
        ['boolean_normalize', 'Boolean normalization', true, 'Yes/No, Y/N, 1/0 → true/false'],
        ['extract_date_features', 'Extract date features', false, 'year, month, day_of_week, is_weekend, quarter'],
        ['strip_whitespace', 'Strip whitespace & control chars', true, ''],
        ['missingness_indicators', 'Missingness indicator flags', false, 'Add column_is_na before imputing'],
        ['fuzzy_dedupe_text', 'Fuzzy text dedupe', false, 'Merge near-identical categories'],
        ['group_rare_categories', 'Group rare categories → Other', false, ''],
        ['parse_names_addresses', 'Parse full names / addresses', false, ''],
        ['drop_high_correlation', 'Drop high-correlation features', false, '|r| > 0.90'],
        ['log_transform_skewed', 'Log-transform skewed numerics', false, 'log1p on skewed columns'],
        ['flatten_json', 'Flatten nested JSON / structs', false, ''],
        ['export_audit_trail', 'Include audit trail in report', true, ''],
      ];
      extraClean.forEach(function (row) {
        var name = row[0], label = row[1], on = row[2], help = row[3];
        if (list.querySelector('input[name="' + name + '"]')) return;
        var lab = document.createElement('label');
        lab.style.cssText = 'display:flex;align-items:flex-start;gap:0.625rem;cursor:pointer;padding:0.45rem 0.625rem;border-radius:7px';
        lab.title = help || label;
        lab.innerHTML = '<input type="checkbox" name="' + name + '" ' + (on ? 'checked' : '') +
          ' style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer;flex-shrink:0;margin-top:2px" />' +
          '<span style="font-size:0.85rem;color:var(--ink-2);line-height:1.4">' + label +
          (help ? '<span style="display:block;font-size:0.75rem;color:var(--ink-3);margin-top:1px">' + help + '</span>' : '') +
          '</span>';
        // insert before scale / run_eda if present
        var anchor = list.querySelector('input[name="run_eda"]');
        if (anchor && anchor.closest('label')) list.insertBefore(lab, anchor.closest('label'));
        else list.appendChild(lab);
      });

      // Thresholds panel extras
      var panels = document.querySelectorAll('.glass-panel');
      var thresh = null;
      panels.forEach(function (p) {
        if ((p.textContent || '').indexOf('Thresholds') >= 0 && (p.textContent || '').indexOf('Missing') >= 0) thresh = p;
      });
      if (thresh && !thresh.dataset.crExtraMethods) {
        thresh.dataset.crExtraMethods = '1';
        function addSelect(label, name, options, defVal, hint) {
          if (thresh.querySelector('[name="' + name + '"]')) return;
          var wrap = document.createElement('div');
          wrap.style.marginTop = '0.75rem';
          var opts = options.map(function (o) {
            return '<option value="' + o[0] + '"' + (o[0] === defVal ? ' selected' : '') + '>' + o[1] + '</option>';
          }).join('');
          wrap.innerHTML = '<label style="display:block;font-size:0.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);margin-bottom:0.35rem">' + label + '</label>' +
            '<select name="' + name + '" style="width:100%;padding:0.55rem 0.7rem;border-radius:10px;border:1px solid var(--border);background:var(--surface-2,#1a2233);color:inherit">' + opts + '</select>' +
            (hint ? '<p style="font-size:0.75rem;color:var(--ink-3);margin-top:0.3rem">' + hint + '</p>' : '');
          // before data modality if possible
          var mod = null;
          thresh.querySelectorAll('label').forEach(function (l) {
            if ((l.textContent || '').indexOf('Data modality') >= 0) mod = l.parentElement;
          });
          if (mod) thresh.insertBefore(wrap, mod);
          else thresh.appendChild(wrap);
        }
        addSelect('Numeric imputation', 'numeric_impute', [['median','Median'],['mean','Mean'],['mode','Mode'],['zero','Zero'],['knn','KNN (k=5)']], 'median', 'Used when Fill missing is on');
        addSelect('Categorical imputation', 'categorical_impute', [['mode','Mode'],['missing_label','Explicit "Missing" label'],['empty','Leave as NA']], 'mode', '');
        addSelect('Boolean imputation', 'boolean_impute', [['mode','Mode (most common)'],['false','Fill with False'],['true','Fill with True'],['missing_class','Create "Missing" class'],['delete_rows','Delete rows with missing'],['empty','Leave as NA']], 'mode', 'For True/False columns when Fill missing is on');
        addSelect('Text case standardisation', 'text_case', [['none','Keep as-is'],['lower','lowercase'],['upper','UPPERCASE'],['title','Title Case']], 'none', '');
        addSelect('Outlier detection', 'outlier_engine', [['iqr','IQR'],['zscore','Z-score'],['modified_z','Modified Z-score'],['isolation_forest','Isolation Forest']], 'iqr', '');
        addSelect('High-cardinality encoding', 'high_card_encoding', [['onehot_limit','One-hot (top categories)'],['frequency','Frequency encoding'],['ordinal','Ordinal / label']], 'onehot_limit', '');
        // extend outlier action options
        var om = thresh.querySelector('select[name="outlier_method"]');
        if (om && !om.querySelector('option[value="to_nan"]')) {
          var o = document.createElement('option');
          o.value = 'to_nan'; o.textContent = 'Set to NaN (then impute)';
          om.appendChild(o);
        }
      }
    }
    setTimeout(once, 200);
    setTimeout(once, 800);
    setTimeout(once, 2000);
  })();


  // Dashboard UI polish (frontend-only): side-by-side before/after + nav look
  // IMAGE-1 composition: side-by-side before/after + orange arrow
  
  (function densifyCharts(){
    if (document.getElementById('cr-dense-style')) return;
    var st = document.createElement('style');
    st.id = 'cr-dense-style';
    st.textContent = [
      '.charts-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0.4rem!important;width:100%!important}',
      '.chart-block{padding:0.45rem!important;min-height:180px}',
      '.hist-bars{height:80px!important}',
      '.chart-section{margin:0.35rem 0!important}',
      '.chart-section-title{margin:0.25rem 0 0.35rem!important;font-size:0.7rem!important}',
      '#metric-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0.4rem!important;width:100%!important}',
      '.metric{padding:0.45rem 0.55rem!important}',
      '#results{max-width:none!important;width:100%!important;padding:0.5rem!important}',
      '.cr-page,section#workspace,section#plans,section#results{max-width:none!important;width:100%!important}',
      '#profile-content .profile-row{padding:0.25rem 0.5rem!important;margin:0 0 0.2rem!important;font-size:0.75rem!important}',
      '#profile-content .dtype-list{display:grid!important;grid-template-columns:1fr 1fr!important;gap:0.25rem!important}',
      'body .dashboard-container{overflow-x:hidden}'
    ].join('');
    document.head.appendChild(st);
  })();

  (function polishDashboardUI() {
    function run() {
      try {
        var rawEl = document.getElementById('raw-content');
        var table = document.getElementById('preview-table');
        if (!rawEl || !table) return;
        var rawPanel = rawEl.closest('.glass-panel');
        var cleanPanel = table.closest('.glass-panel');
        if (!rawPanel || !cleanPanel || rawPanel === cleanPanel) return;
        if (rawPanel.parentElement && rawPanel.parentElement.classList.contains('compare-grid')) return;
        var wrap = document.createElement('div');
        wrap.className = 'compare-grid';
        wrap.style.cssText = 'display:grid;grid-template-columns:1fr auto 1fr;gap:0.75rem;align-items:stretch;';
        var parent = rawPanel.parentElement;
        parent.insertBefore(wrap, rawPanel);
        wrap.appendChild(rawPanel);
        var arrow = document.createElement('div');
        arrow.className = 'compare-arrow';
        arrow.innerHTML = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="rgba(240,106,29,0.15)" stroke="#f06a1d" strokeWidth="1.5"/><path d="M8 12h8M13 8l4 4-4 4" stroke="#f06a1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>';
        wrap.appendChild(arrow);
        wrap.appendChild(cleanPanel);
        rawPanel.style.minWidth = '0';
        cleanPanel.style.minWidth = '0';
        if (!document.getElementById('cr-compare-style')) {
          var st = document.createElement('style');
          st.id = 'cr-compare-style';
          st.textContent = '@media(max-width:900px){.compare-grid{grid-template-columns:1fr!important}.compare-arrow{transform:rotate(90deg)}}';
          document.head.appendChild(st);
        }
      } catch (e) {}
    }
    setTimeout(run, 400);
    setTimeout(run, 1500);
    setTimeout(run, 3000);
    var obs = new MutationObserver(function(){ run(); });
    try { obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  })();

  console.info('[cleanroom] app.js bridge bound to React DOM');


  
  // The legacy bridge expects this hook. The live code sandbox is intentionally excluded.
  function ensurePandasGeminiPanels() {}

  function updateCleanedPreviewFromRows(rows, cols) {
    function esc(v) {
      return String(v == null || v === '' ? '—' : v)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    if (!cols || !cols.length) {
      cols = [];
      (rows || []).forEach(function (r) { Object.keys(r || {}).forEach(function (k) { if (cols.indexOf(k) < 0) cols.push(k); }); });
    }
    var th = document.getElementById('table-head');
    var tb = document.getElementById('table-body');
    if (th) th.innerHTML = '<tr>' + cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>';
    if (tb) {
      tb.innerHTML = (rows || []).map(function (row) {
        return '<tr>' + cols.map(function (c) { return '<td title="' + esc(row[c]) + '">' + esc(row[c]) + '</td>'; }).join('') + '</tr>';
      }).join('');
    }
    // Also any AFTER cleaned table bodies
    document.querySelectorAll('#results table').forEach(function (tbl) {
      var thead = tbl.querySelector('thead');
      var tbody = tbl.querySelector('tbody');
      if (!tbody || tbody.id === 'table-body') return;
      // skip raw table if marked
      var parent = tbl.closest('[id]');
      if (parent && (parent.id === 'raw-content' || (parent.id || '').indexOf('raw') >= 0)) return;
    });
  }

  function renderGeminiCharts(charts) {
    if (!charts || !charts.length) return;
    ensurePandasGeminiPanels();
    var box = document.getElementById('cr-gemini-charts');
    var empty = document.getElementById('cr-gemini-charts-empty');
    if (empty) empty.style.display = 'none';
    if (!box) return;
    charts.slice().reverse().forEach(function (ch) {
      var card = document.createElement('div');
      card.style.cssText = 'border:1px solid var(--border,rgba(255,255,255,.1));border-radius:12px;padding:0.75rem;background:var(--surface-2,#161616)';
      var title = document.createElement('div');
      title.style.cssText = 'font-size:0.82rem;font-weight:700;margin-bottom:0.25rem;color:var(--ink,#eee)';
      title.textContent = ch.title || ch.type || 'Chart';
      card.appendChild(title);
      var meta = document.createElement('div');
      meta.style.cssText = 'font-size:0.7rem;color:var(--ink-3,#a1a1aa);margin-bottom:0.5rem';
      var bits = [];
      if (ch.type) bits.push('type: ' + ch.type);
      if (ch.column) bits.push('column: ' + ch.column);
      if (ch.x) bits.push('x: ' + ch.x);
      if (ch.y) bits.push('y: ' + ch.y);
      if (ch.agg) bits.push('agg: ' + ch.agg);
      meta.textContent = bits.join(' · ');
      card.appendChild(meta);
      if (!ch.ok) {
        var err = document.createElement('p');
        err.style.cssText = 'font-size:0.75rem;color:#e05a62';
        err.textContent = ch.error || 'Could not build chart';
        card.appendChild(err);
      } else if (ch.type === 'pie' && ch.labels && ch.values) {
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;gap:0.85rem;align-items:center;flex-wrap:wrap';
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('width', '130');
        svg.setAttribute('height', '130');
        var total = ch.values.reduce(function (a, b) { return a + b; }, 0) || 1;
        var acc = 0;
        var colors = ['#f06a1d', '#f5a623', '#3dd6c6', '#818cf8', '#f472b6', '#34d399', '#a78bfa', '#fb7185'];
        ch.values.forEach(function (v, i) {
          var start = acc / total; acc += v; var end = acc / total;
          var a0 = start * Math.PI * 2 - Math.PI / 2;
          var a1 = end * Math.PI * 2 - Math.PI / 2;
          var x0 = 50 + 40 * Math.cos(a0), y0 = 50 + 40 * Math.sin(a0);
          var x1 = 50 + 40 * Math.cos(a1), y1 = 50 + 40 * Math.sin(a1);
          var large = (end - start) > 0.5 ? 1 : 0;
          var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          p.setAttribute('d', 'M50,50 L' + x0 + ',' + y0 + ' A40,40 0 ' + large + ' 1 ' + x1 + ',' + y1 + ' Z');
          p.setAttribute('fill', colors[i % colors.length]);
          svg.appendChild(p);
        });
        wrap.appendChild(svg);
        var leg = document.createElement('div');
        leg.style.cssText = 'font-size:0.72rem;color:var(--ink-2);max-height:130px;overflow:auto';
        ch.labels.forEach(function (lb, i) {
          var row = document.createElement('div');
          row.style.cssText = 'display:flex;gap:6px;align-items:center;margin-bottom:3px';
          row.innerHTML = '<span style="width:9px;height:9px;border-radius:2px;background:' + colors[i % colors.length] + ';display:inline-block;flex-shrink:0"></span>' +
            '<span><strong>' + String(lb) + '</strong>: ' + ch.values[i] + ' (' + Math.round(100 * ch.values[i] / total) + '%)</span>';
          leg.appendChild(row);
        });
        wrap.appendChild(leg);
        card.appendChild(wrap);
      } else if (ch.labels && ch.values) {
        var max = Math.max.apply(null, ch.values.concat([1]));
        var axis = document.createElement('div');
        axis.style.cssText = 'font-size:0.68rem;color:var(--accent);margin-bottom:0.35rem';
        axis.textContent = (ch.x ? ('X: ' + ch.x) : '') + (ch.y ? ('  ·  Y: ' + ch.y) : '') + (ch.agg ? ('  ·  ' + ch.agg) : '');
        card.appendChild(axis);
        var bars = document.createElement('div');
        bars.style.cssText = 'display:flex;align-items:flex-end;gap:5px;height:140px';
        ch.values.slice(0, 18).forEach(function (v, i) {
          var col = document.createElement('div');
          col.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%';
          col.title = (ch.labels[i] || '') + ': ' + v;
          var num = document.createElement('span');
          num.style.cssText = 'font-size:9px;color:var(--accent);margin-bottom:2px;font-weight:700';
          num.textContent = v;
          var bar = document.createElement('div');
          bar.style.cssText = 'width:100%;max-width:32px;height:' + Math.max(6, (v / max) * 100) + '%;background:linear-gradient(180deg,#f06a1d,#ff8a3d);border-radius:4px 4px 0 0';
          var lab = document.createElement('span');
          lab.style.cssText = 'font-size:8px;color:var(--ink-3);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;text-align:center';
          lab.textContent = ch.labels[i] || '';
          col.appendChild(num); col.appendChild(bar); col.appendChild(lab);
          bars.appendChild(col);
        });
        card.appendChild(bars);
      } else if (ch.points && ch.points.length) {
        var axis2 = document.createElement('div');
        axis2.style.cssText = 'font-size:0.68rem;color:var(--accent);margin-bottom:0.35rem';
        axis2.textContent = 'X: ' + (ch.x || 'x') + '  ·  Y: ' + (ch.y || 'y') + '  ·  n=' + ch.points.length;
        card.appendChild(axis2);
        var svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg2.setAttribute('viewBox', '0 0 220 140');
        svg2.setAttribute('width', '100%');
        svg2.setAttribute('height', '140');
        svg2.style.background = 'rgba(0,0,0,0.2)';
        svg2.style.borderRadius = '8px';
        var xs = ch.points.map(function (p) { return p.x; });
        var ys = ch.points.map(function (p) { return p.y; });
        var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
        var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
        ch.points.slice(0, 400).forEach(function (p) {
          var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          var cx = 20 + ((p.x - minX) / ((maxX - minX) || 1)) * 180;
          var cy = 120 - ((p.y - minY) / ((maxY - minY) || 1)) * 100;
          c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', 2.8);
          c.setAttribute('fill', '#f06a1d'); c.setAttribute('opacity', '0.8');
          svg2.appendChild(c);
        });
        card.appendChild(svg2);
      }
      box.insertBefore(card, box.firstChild);
    });
    try { document.getElementById('gemini-charts-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
  }

  (function hookGeminiCharts() {
    if (window.__cr_gemini_hooked) return;
    window.__cr_gemini_hooked = true;
    var orig = window.fetch.bind(window);
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      return orig.apply(this, arguments).then(function (res) {
        if (String(url).indexOf('/api/chat') >= 0 && (!init || String(init.method || 'GET').toUpperCase() === 'POST')) {
          res.clone().json().then(function (data) {
            if (data && data.charts && data.charts.length) renderGeminiCharts(data.charts);
            if (data && data.result_id) try { window.__CR_RESULT_ID = data.result_id; } catch (e) {}
          }).catch(function () {});
        }
        return res;
      });
    };
  })();

  document.addEventListener('DOMContentLoaded', function () { try { ensurePandasGeminiPanels(); } catch (e) {} });
  setTimeout(function () { try { ensurePandasGeminiPanels(); } catch (e) {} }, 600);

})();