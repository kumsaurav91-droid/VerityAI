'use strict';
/* One list of features drives the landing preview, the Features page and the Planned pages. Needs common.js. */
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  scales: '<path d="M12 4v16M6 20h12M5 8h14"/><path d="m5 8-3 7a3 3 0 0 0 6 0zM19 8l-3 7a3 3 0 0 0 6 0z"/>',
  coins: '<circle cx="12" cy="12" r="9"/><path d="M9 9.5c0-1 1.3-2 3-2s3 1 3 2-1.3 2-3 2-3 1-3 2 1.3 2 3 2 3-1 3-2M12 6v1.5M12 16.5V18"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="m7 15 4-5 3 3 5-7"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};
const GROUPS = ['Claim Verification', 'Career and Education', 'Scam Detection', 'Evidence and Reports', 'Learning and Practice'];
const FEATURES = [
  { id: 'claim-checker', group: GROUPS[0], name: 'AI Claim Checker', icon: 'search', status: 'available', path: '/check',
    desc: 'Paste advice, a post or a link and see which claims look exaggerated, with the exact phrases marked.' },
  { id: 'evidence', group: GROUPS[0], name: 'Evidence-Based Verification', icon: 'shield', status: 'available', path: '/how-it-works#evidence',
    desc: 'Check specific claims against web sources and see which ones could not be verified.' },
  { id: 'file-input', group: GROUPS[0], name: 'Screenshot, PDF and Video Input', icon: 'image', status: 'available', path: '/check',
    desc: 'Upload a screenshot or PDF, or paste a YouTube link, and check what it says.' },
  { id: 'job-offer', group: GROUPS[1], name: 'Job Offer Verification', icon: 'briefcase', status: 'available', path: '/check/job-offer',
    desc: 'Spot fee requests, free email addresses, missing interviews and other fake-offer signs.' },
  { id: 'course', group: GROUPS[1], name: 'Course Verification', icon: 'cap', status: 'available', path: '/check/course',
    desc: 'Test placement promises, refund terms, fake urgency and income claims before you pay.' },
  { id: 'internship', group: GROUPS[1], name: 'Internship Verification', icon: 'briefcase', status: 'planned', path: '/check/internship',
    desc: 'A checker made for internship offers, stipends and certificate promises.',
    will: ['Whether an unpaid or "paid to join" internship is a red flag', 'Stipend and certificate claims', 'Whether the company contact details look genuine'],
    today: { text: 'Internship offers can already be checked as job offers.', href: '/check/job-offer', label: 'Open the job offer checker' } },
  { id: 'scholarship', group: GROUPS[1], name: 'Scholarship Verification', icon: 'doc', status: 'planned', path: '/check/scholarship',
    desc: 'Check scholarship messages for application fees and pressure tactics.',
    will: ['Requests for application or processing fees', 'Whether the sender is the awarding body', 'Deadlines designed to rush you'],
    today: { text: 'Paste the message into the advice checker to find fee requests and pressure tactics.', href: '/check', label: 'Open the checker' } },
  { id: 'college-placement', group: GROUPS[1], name: 'College Placement Checker', icon: 'cap', status: 'planned', path: '/check/college-placement',
    desc: 'Test the placement numbers a college or coaching centre advertises.',
    will: ['Average and highest package claims', 'Whether the placement rate is explained or just stated', 'What the figures leave out'],
    today: { text: 'Placement promises in a course or college pitch can be checked with the course checker.', href: '/check/course', label: 'Open the course checker' } },
  { id: 'salary', group: GROUPS[1], name: 'Salary Reality Check', icon: 'coins', status: 'planned', path: '/check/salary',
    desc: 'See whether a promised salary looks realistic for the role and experience.',
    will: ['Whether a salary is far above typical ranges', 'Which sources the comparison uses', 'How confident the comparison is'],
    today: { text: 'Salary claims in a message or pitch are already picked up by the claim check on a result page.', href: '/check', label: 'Open the checker' } },
  { id: 'compare-courses', group: GROUPS[1], name: 'Compare Courses', icon: 'scales', status: 'planned', path: '/compare-courses',
    desc: 'Put two course pitches side by side and compare price, promises and refund terms.',
    will: ['Price and refund terms next to each other', 'Which pitch makes bigger promises', 'Which has more evidence behind it'],
    today: { text: 'Check each course on its own, then compare the two results in your History.', href: '/check/course', label: 'Open the course checker' } },
  { id: 'scam-message', group: GROUPS[2], name: 'Scam Message Detector', icon: 'chat', status: 'planned', path: '/check/scam-message',
    desc: 'A detector for suspicious SMS and WhatsApp messages of any kind.',
    will: ['Messages beyond jobs and courses, such as prizes and fees', 'Suspicious links and urgent requests', 'Plain-language advice on what to do'],
    today: { text: 'Job-related messages can be checked today with the job offer checker.', href: '/check/job-offer', label: 'Open the job offer checker' } },
  { id: 'sender-check', group: GROUPS[2], name: 'Sender and Link Check', icon: 'link', status: 'available', path: '/check/job-offer',
    desc: 'See how old an email or link domain is and whether it is a free email or a link shortener.' },
  { id: 'scam-intel', group: GROUPS[2], name: 'Scam Intelligence', icon: 'globe', status: 'planned', path: '/scam-intelligence',
    desc: 'A view of common scam patterns that students report.',
    will: ['Which scam patterns appear most often', 'Reports reviewed before they are shown', 'No naming of individuals without verification'],
    today: { text: 'Practise the common patterns with the Spot the Scam quiz.', href: '/practice', label: 'Play the quiz' } },
  { id: 'risk-profile', group: GROUPS[3], name: 'Risk Profile and Red Flags', icon: 'chart', status: 'available', path: '/how-it-works#risk',
    desc: 'Hype, burnout risk, hidden selling and weak evidence are scored separately, with reasons.' },
  { id: 'rewrite', group: GROUPS[3], name: 'Honest Rewrite and Next Steps', icon: 'pen', status: 'available', path: '/how-it-works#interpret',
    desc: 'A realistic rewrite, questions to ask and a checklist for what to do next.' },
  { id: 'share-export', group: GROUPS[3], name: 'Share and Export', icon: 'share', status: 'available', path: '/how-it-works#interpret',
    desc: 'Share a result on WhatsApp, save a share image, or export it as a PDF through your browser.' },
  { id: 'ask-ai', group: GROUPS[3], name: 'Ask AI Follow-up', icon: 'spark', status: 'planned', path: '/features/ask-ai',
    desc: 'Ask follow-up questions about a result.',
    will: ['Questions about a specific red flag', 'Help writing a reply to a recruiter or seller', 'Answers that stay tied to the result you are viewing'],
    today: { text: 'Each result already lists questions to ask the creator, seller or employer.', href: '/check', label: 'Open the checker' } },
  { id: 'quiz', group: GROUPS[4], name: 'Spot the Scam Quiz', icon: 'target', status: 'available', path: '/practice',
    desc: 'Eight real-looking messages. Decide which are risky, then see what gave them away.' },
  { id: 'history', group: GROUPS[4], name: 'Check History', icon: 'clock', status: 'available', path: '/history',
    desc: 'Find, search and revisit your earlier checks. They stay in your own browser.' },
  { id: 'app', group: GROUPS[4], name: 'Install as an App', icon: 'phone', status: 'available', path: '/faq#faq-app',
    desc: 'Add VerityAI to your phone and share messages to it straight from WhatsApp on Android.' },
];
const LANDING_IDS = ['claim-checker', 'job-offer', 'course', 'college-placement', 'scam-message', 'evidence'];

const iconSvg = (n, cls = '') => `<svg class="i lg ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
const statusPill = (s) => `<span class="status ${s}">${s === 'available' ? 'Available' : 'Planned'}</span>`;
function featureCard(f, cta) {
  return `<article class="fcard" id="${f.id}"><div class="fc-top"><span class="fc-icon">${iconSvg(f.icon)}</span>${statusPill(f.status)}</div>
    <h3>${esc(f.name)}</h3><p>${esc(f.desc)}</p><a class="btn secondary small" href="${f.path}">${cta || (f.status === 'available' ? 'Explore' : 'Learn more')}<span class="sr"> about ${esc(f.name)}</span></a></article>`;
}

const preview = $('[data-features-preview]');
if (preview) preview.innerHTML = LANDING_IDS.map((id) => featureCard(FEATURES.find((f) => f.id === id), 'Learn more')).join('');

const grid = $('[data-features-grid]');
if (grid) {
  grid.innerHTML = GROUPS.map((g, gi) => {
    const items = FEATURES.filter((f) => f.group === g);
    const avail = items.filter((f) => f.status === 'available').length;
    return `<section class="fgroup" aria-labelledby="g-${gi}"><h2 id="g-${gi}">${g}</h2>
      <p class="fg-count">${avail} available, ${items.length - avail} planned</p>
      <div class="fgrid">${items.map((f) => featureCard(f)).join('')}</div></section>`;
  }).join('');
  if (location.hash) $(location.hash)?.scrollIntoView();
}

const root = $('#featureRoot');
if (root) {
  const p = location.pathname.replace(/\/$/, '');
  const f = FEATURES.find((x) => x.path === p || p === '/features/' + x.id);
  if (!f) {
    document.title = 'Page not found | VerityAI';
    root.innerHTML = `<div class="state"><h1>We could not find that page</h1><p>It may have moved, or it may not exist yet.</p><a class="btn primary" href="/features">See all features</a></div>`;
  } else {
    document.title = `${f.name} | VerityAI`;
    $('#crumbName').textContent = f.name;
    root.innerHTML = `
      <div class="fp-head"><span class="fc-icon big">${iconSvg(f.icon)}</span><div><h1 class="page-title">${esc(f.name)}</h1>${statusPill(f.status)}</div></div>
      <p class="lead">${esc(f.desc)}</p>
      ${f.status === 'planned' ? `<div class="notice info">This feature is planned. It is not available yet, and there is no release date.</div>
        <h2>What it is meant to check</h2><ul class="plain">${(f.will || []).map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
        <div class="today"><b>What you can do today</b><p>${esc(f.today.text)}</p><a class="btn primary" href="${f.today.href}">${esc(f.today.label)}</a></div>`
        : `<a class="btn primary" href="${f.path}">Open ${esc(f.name)}</a>`}
      <p><a class="btn quiet" href="/features">Back to all features</a></p>`;
  }
}
