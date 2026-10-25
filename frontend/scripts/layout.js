'use strict';
/* Shared header and footer, so every page has the same navigation. Needs common.js. */
const NAV = [['Home', '/'], ['Features', '/features'], ['How It Works', '/how-it-works'], ['Practice', '/practice'], ['FAQ', '/faq'], ['History', '/history']];
const LOGO = '<svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 4 7v8c0 8 5 13 12 15 7-2 12-7 12-15V7z" fill="currentColor"/><path d="m10 16 4 4 8-9" stroke="var(--paper)" stroke-width="3" fill="none"/></svg>';
const REPO = 'https://github.com/kumsaurav91-droid/VerityAI';

function isActive(href) {
  const p = location.pathname.replace(/\/$/, '') || '/';
  if (href === '/') return p === '/';
  return p === href || p.startsWith(href + '/') || (href === '/history' && p.startsWith('/results'));
}

$('#site-header').outerHTML = `
<a class="skip" href="#main">Skip to content</a>
<header class="topbar"><div class="wrap bar">
  <a class="brand" href="/" aria-label="VerityAI home">${LOGO}<span>Verity<b>AI</b></span></a>
  <nav class="links" id="mainNav" aria-label="Main">
    ${NAV.map(([n, h]) => `<a href="${h}"${isActive(h) ? ' aria-current="page"' : ''}>${n}</a>`).join('')}
    <a class="mobile-only" href="/check">Start Checking</a>
  </nav>
  <div class="bar-actions">
    <button class="btn quiet small" id="installBtn" type="button" hidden>Install app</button>
    <button class="btn quiet icon" id="themeBtn" type="button" aria-label="Switch light or dark theme"><svg class="i" viewBox="0 0 24 24"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg></button>
    <a class="btn primary small cta" href="/check">Start Checking</a>
    <button class="btn quiet icon menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mainNav"><svg class="i" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  </div>
</div></header>`;

const link = (h, t, ext) => `<li><a href="${h}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a></li>`;
$('#site-footer').outerHTML = `
<footer class="footer"><div class="wrap">
  <div class="f-grid">
    <div class="f-brand">
      <a class="brand" href="/">${LOGO}<span>Verity<b>AI</b></span></a>
      <p>A second opinion for students on career advice, courses and job offers.</p>
    </div>
    <nav aria-label="Explore"><h4>Explore</h4><ul>${[['Check something', '/check'], ['Features', '/features'], ['How It Works', '/how-it-works'], ['Practice', '/practice'], ['FAQ', '/faq'], ['History', '/history']].map(([t, h]) => link(h, t)).join('')}</ul></nav>
    <nav aria-label="Company"><h4>VerityAI</h4><ul>${link('/about', 'About VerityAI')}${link('/privacy', 'Privacy Policy')}${link('/terms', 'Terms of Service')}${link(REPO + '/issues', 'Contact and feedback', 1)}${link(REPO, 'Source Code', 1)}</ul></nav>
    <div class="f-col"><nav aria-label="Stay safe"><h4>Stay safe</h4><ul><li>Cyber crime helpline: <b>1930</b></li>${link('https://cybercrime.gov.in', 'cybercrime.gov.in', 1)}</ul></nav><nav aria-label="Connect" style="margin-top:1.5rem"><h4>Connect</h4><ul>${link('https://github.com/kumsaurav91-droid', 'GitHub', 1)}${link('https://www.linkedin.com/in/kumsaurav91', 'LinkedIn', 1)}</ul></nav></div>

  </div>
  <div class="f-bottom">
    <p>&copy; 2026 VerityAI. Built for students, by students.</p>
    <p>VerityAI is an AI second opinion. It is not legal, financial or career counselling, and it can make mistakes.</p>
  </div>
</div></footer>`;

$('#themeBtn').onclick = () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('verity.theme', next); } catch { /* ignore */ }
};
const menu = $('#menuBtn'), nav = $('#mainNav');
const setMenu = (open) => { nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); };
menu.onclick = () => setMenu(!nav.classList.contains('open'));
nav.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

let installEvent = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvent = e; $('#installBtn').hidden = false; });
$('#installBtn').onclick = async () => { if (!installEvent) return; installEvent.prompt(); await installEvent.userChoice; installEvent = null; $('#installBtn').hidden = true; };
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('/sw.js').catch(() => { /* offline support is optional */ });
