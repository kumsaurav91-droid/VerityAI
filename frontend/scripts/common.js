'use strict';
/* Helpers, shared data and browser storage used by every VerityAI page.
   Hosting the frontend elsewhere? Set window.VERITY_API_URL before this script loads. */
const API = window.VERITY_API_URL ?? (location.protocol === 'file:' || ['3000', '5500', '5501'].includes(location.port)
  ? 'http://localhost:8000' : '');
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (n) => Math.max(0, Math.min(100, Number(n) | 0));

/* ---------- What each kind of check is called ---------- */
const TONE = { Realistic: 'ok', Exaggerated: 'warn', Misleading: 'bad' };
const KIND = {
  advice: { name: 'Advice or post', ph: 'Paste a LinkedIn post, a reel caption, a thread...', url: 'https://example.com/how-i-got-hired-in-30-days', btn: 'Check this advice',
    labels: { Realistic: 'Realistic', Exaggerated: 'Exaggerated', Misleading: 'Misleading' }, facts: 'Claims and details',
    rewrite: 'The honest version', check: 'Before you trust it', ask: 'Ask the creator', none: 'No red flags found. This advice looks sound.' },
  course: { name: 'Course or program', ph: 'Paste the course page, webinar pitch or the messages the seller sent you...', url: 'https://example.com/placement-guarantee-course', btn: 'Check this course',
    labels: { Realistic: 'Fair pitch', Exaggerated: 'Oversold', Misleading: 'High risk' }, facts: 'What the pitch actually says',
    rewrite: 'What an honest pitch would say', check: 'Before you pay', ask: 'Ask the seller', none: 'No red flags found in this pitch. Still verify the seller before paying.' },
  job: { name: 'Job offer or message', ph: 'Paste the WhatsApp, Telegram or email message, including the sender address if you have it...', url: 'https://example.com/job-posting', btn: 'Check this offer',
    labels: { Realistic: 'Few warning signs', Exaggerated: 'Suspicious', Misleading: 'High scam risk' }, facts: 'What the message actually says',
    rewrite: 'What a genuine employer would do', check: 'Before you reply or pay', ask: 'Verify it yourself', none: 'No red flags found. Still verify the company on its official website.' },
};
const kindOf = (r) => KIND[r.kind] || KIND.advice;
const verdictLabel = (r) => kindOf(r).labels[r.category] || r.category;
/* The server returns a trust score (higher is safer). The site shows risk, so higher means riskier. */
const riskOf = (r) => 100 - clamp(r.truth_score);
const DOMAIN = {
  free_email: ['Free email address, not a company domain', 'medium'], shortener: ['Link shortener that hides the real address', 'medium'],
  new: ['Registered under 3 months ago', 'high'], recent: ['Registered under a year ago', 'medium'],
  established: ['Registered over a year ago', 'low'], unknown: ['Could not check this domain', 'unknown'],
};
const VERDICT = {
  supported: ['Supported', 'ok'], disputed: ['Disputed', 'bad'], misleading: ['Misleading', 'bad'], unverified: ['Could not verify', 'warn'],
};
const ageText = (d) => (d < 60 ? `${d} days ago` : d < 730 ? `${Math.round(d / 30)} months ago` : `${Math.floor(d / 365)} years ago`);
const fmtDate = (ts) => new Date(ts).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/* ---------- Small helpers ---------- */
function toast(msg) {
  const el = $('#toast'); if (!el) return;
  el.textContent = msg; el.hidden = false;
  clearTimeout(toast.id); toast.id = setTimeout(() => (el.hidden = true), 2400);
}
async function copy(text, done) {
  try { await navigator.clipboard.writeText(text); toast(done); } catch { toast('Copy failed. Select the text and copy it manually.'); }
}
const siteUrl = () => (location.protocol.startsWith('http') ? location.origin : '');
const whatsapp = (msg) => window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
async function post(path, body) {
  const res = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'The request was rejected. Check your input and try again.');
  return data;
}
const netError = (e) => (e instanceof TypeError ? 'Cannot reach the server. Start it with "python main.py" in the backend folder.' : e.message);

/* ---------- History (saved only in this browser) ---------- */
const HISTORY_KEY = 'verity.history', HISTORY_MAX = 30;
function historyTitle(r) {
  if (r.source === 'url' || r.source === 'video') return r.source_title || 'Link';
  if (r.source === 'image' || r.source === 'pdf') return r.source === 'pdf' ? 'PDF document' : 'Screenshot';
  return (r.extracted_text || '').slice(0, 90);
}
const store = {
  all() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; } },
  write(list) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); return true; } catch { return false; } },
  find(id) { return this.all().find((h) => String(h.id) === String(id)); },
  add(result) {
    const now = Date.now(), entry = { id: now, ts: now, title: historyTitle(result), result };
    return this.write([entry, ...this.all()].slice(0, HISTORY_MAX)) ? entry : null;
  },
  patch(id, changes) { this.write(this.all().map((h) => (String(h.id) === String(id) ? { ...h, ...changes } : h))); },
  remove(id) { this.write(this.all().filter((h) => String(h.id) !== String(id))); },
  clear() { this.write([]); },
};
