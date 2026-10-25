'use strict';
/* The FAQ page: categories and search. */
const FAQ = [
  ['Basics', 'faq-what', 'What is VerityAI, and who is it for?', 'VerityAI is a free second-opinion tool for students and early-career job seekers. It reviews career advice, course pitches and job offers and explains what looks exaggerated, risky or fair.'],
  ['Basics', 'faq-check', 'What can I check?', 'Advice or posts (reels, LinkedIn posts, threads), courses or programs (sales pages, webinar pitches, placement promises), and job offers or recruiter messages. You can paste text, add a link or YouTube video, or upload a screenshot or PDF such as an offer letter.'],
  ['Basics', 'faq-free', 'Is it free, and what is it built with?', 'It has no price. It is built with Python (FastAPI), Google Gemini and plain JavaScript. To keep it available for everyone, each person can run up to 10 checks per minute.'],
  ['Basics', 'faq-app', 'Can I use it like an app?', 'Yes. In your phone browser choose Install or Add to Home Screen. On Android you can then share a message or link from WhatsApp straight to VerityAI.'],
  ['Results', 'faq-result', 'What will I see in a result?', 'A verdict and risk score, an evidence confidence panel, a table of key details such as price and refund terms, your text with risky phrases highlighted, a risk profile, questions to ask, a checklist, an honest rewrite, and a claim check with sources on request.'],
  ['Results', 'faq-score', 'What is the risk score, and what do the verdicts mean?', 'The risk score runs from 0 to 100, and higher means more warning signs. 0 to 30 means few warning signs, 31 to 60 means exaggerated or suspicious, and 61 to 100 means high risk.'],
  ['Results', 'faq-confidence', 'What is evidence confidence?', 'It shows how well the specific claims in a text could be checked against web sources. It is separate from the risk score, and it only appears after you run the claim check on a result page.'],
  ['Results', 'faq-unverified', 'What does "Could not verify" mean?', 'The search did not find enough reliable sources to confirm or reject that claim. It does not mean the claim is false. Treat it as unproven and ask the sender for proof.'],
  ['Results', 'faq-safe', 'Does a good score mean it is safe?', 'No. A good score means few warning signs were found in what you pasted. VerityAI cannot confirm that a company or person is real, so verify on the official website, and never pay to get a job.'],
  ['Results', 'faq-wrong', 'Can the AI be wrong? What should I do if a result looks wrong?', 'Yes. Treat every result as a second opinion that shows its reasoning. Check the quoted phrases yourself, and use the "This looks wrong" button under a result to tell us what was off.'],
  ['Safety', 'faq-paid', 'I already paid or shared my details. What now?', 'Call the national cyber crime helpline 1930 right away and report at cybercrime.gov.in. Keep screenshots and payment receipts, and do not pay more to "release" a refund.'],
  ['Safety', 'faq-job', 'How can I tell a fake job offer?', 'Warning signs include any request for money, no interview, a very high salary for easy work, a free email address for a company, contact only on WhatsApp or Telegram, and pressure to reply fast. Check the company on its official website before replying.'],
  ['Privacy', 'faq-data', 'Where does my data go?', 'Your input is sent to this app\'s server and then to Google\'s Gemini API for analysis. See the Privacy Policy for the full details.'],
  ['Privacy', 'faq-saved', 'Are my results saved?', 'Results are saved only in your own browser, so they appear on the History page of this device. You can delete one result or all of them at any time. Clearing your browser data also removes them.'],
  ['Technical', 'faq-files', 'Which files and links work?', 'Pasted text up to 8,000 characters, public web pages, public YouTube videos (the first 10 minutes), JPG, PNG or WebP screenshots, and PDFs up to 4 MB. Pages that need a login, such as Instagram or X, cannot be read, so paste the text or use a screenshot.'],
  ['Technical', 'faq-limit', 'Why did I get "Too many requests"?', 'Each visitor can run 10 requests a minute. Wait a minute and try again.'],
];
const CATS = ['All', ...new Set(FAQ.map((f) => f[0]))];
const state = { cat: 'All', q: '' };
$('#fCats').innerHTML = CATS.map((c) => `<button class="chip" type="button" aria-pressed="${c === 'All'}" data-cat="${c}">${c}</button>`).join('');

function render() {
  const q = state.q.trim().toLowerCase();
  const items = FAQ.filter(([c, , qu, a]) => (state.cat === 'All' || c === state.cat) && (!q || `${qu} ${a}`.toLowerCase().includes(q)));
  $('#fList').innerHTML = items.map(([c, id, qu, a]) => `<details id="${id}"><summary>${esc(qu)}</summary><p>${esc(a)}</p><span class="f-cat">${c}</span></details>`).join('');
  $('#fNone').hidden = !!items.length;
}
$('#fCats').onclick = (e) => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  state.cat = b.dataset.cat; $$('#fCats .chip').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); render();
};
$('#fSearch').oninput = (e) => { state.q = e.target.value; render(); };
function resetFilters() {
  state.q = ''; state.cat = 'All'; $('#fSearch').value = '';
  $$('#fCats .chip').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.cat === 'All')));
}
$('#fReset').onclick = () => { resetFilters(); render(); };
function openFromHash() {
  if (!location.hash) return;
  resetFilters(); render();
  const item = $(location.hash); if (item) { item.open = true; item.scrollIntoView(); }
}
render(); openFromHash();
addEventListener('hashchange', openFromHash);

