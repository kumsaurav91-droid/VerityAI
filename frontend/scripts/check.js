'use strict';
/* The Check Something page. Needs common.js and layout.js. A finished check is saved, then /results/<id> opens. */
let MAX_CHARS = 8000;
const MAX_FILE = 4 * 1024 * 1024;
const EX = {
  advice: [
    ['Realistic', 'Getting your first tech job usually takes 3 to 9 months of steady effort. Build two or three small projects, put them on GitHub, ask for feedback, and apply to roles that match your level. Some weeks will feel slow, and that is normal.'],
    ['Hustle culture', 'Wake up at 4 AM every single day. Sleep is for the weak. Work 18 hours, learn 5 programming languages at once, and you will be a senior engineer in one year. Comfort is the enemy.'],
    ['Get-rich-quick', 'You are wasting your life if you are not earning $10k/month by 20! Drop out of college, put all your savings in crypto, and join my mastermind. Success is 100% guaranteed, limited seats left!'],
    ['Hinglish', 'Bhai 3 mahine mein 50 LPA ki job chahiye? Bas mera course le lo, roz 16 ghante code karo, neend chhod do. Guaranteed placement, warna paisa wapas!'],
  ],
  course: [
    ['Placement promise', 'Join our 6-month Full Stack program for just Rs 35,000! 100% placement guarantee in top MNCs, 50 LPA average package. Seats filling fast, enroll in the next 24 hours. Advance of Rs 5,000 is non-refundable. Refer 3 friends and earn Rs 5,000 commission each.'],
    ['Fair pitch', 'Our 12-week data analysis course costs Rs 6,000. You build three projects with mentor feedback. We do not promise jobs: in our last batch, 40% of students got interviews within three months. 7-day refund, full syllabus and sample lessons are free on our site.'],
  ],
  job: [
    ['Fee scam', 'Congratulations! You are selected for Data Entry at Infosys, Rs 45,000/month, work from home. No interview needed. Pay Rs 1,800 registration fee, refundable after joining. Contact HR only on WhatsApp: hr.infosys.jobs@gmail.com. Reply within 2 hours or the offer is cancelled.'],
    ['Genuine-looking', 'Hi Riya, thanks for interviewing on Tuesday. We are pleased to offer you the Junior Analyst role at 4.8 LPA. Your offer letter is attached, sent from careers@company-domain.com. Please review and reply by Friday. Joining date is 3 Nov. No fees are required at any stage.'],
  ],
};
const PAGE = {
  advice: ['Check something', 'Paste a post, add a link, or upload a screenshot or PDF. You will get a clear verdict, the reasons and your next steps.'],
  course: ['Course verification', 'Test a course pitch for placement promises, refund terms, fake urgency and income claims before you pay.'],
  job: ['Job offer verification', 'Test a job or internship offer for fee requests, free email addresses, missing interviews and other scam signs.'],
};
const FILE_TEXT = { image: 'Drop a screenshot here, click to choose, or paste an image with Ctrl+V', pdf: 'Drop a PDF here or click to choose one' };
const FILE_TYPES = { image: 'image/jpeg,image/png,image/webp', pdf: 'application/pdf' };
const PATH_KIND = { '/check/job-offer': 'job', '/check/course': 'course' };
const state = { mode: 'text', kind: 'advice', image: null, busy: false };
const textEl = $('#text');

function notice(msg, info = false) {
  const n = $('#notice'); n.hidden = !msg; n.textContent = msg || ''; n.classList.toggle('info', info);
}

/* ---------- Kind and input mode ---------- */
const updateAnalyzeLabel = () => ($('#analyzeLabel').textContent = state.busy ? 'Reading it closely' : KIND[state.kind].btn);
function setKind(k) {
  state.kind = k; const c = KIND[k];
  $(`input[name=kind][value=${k}]`).checked = true;
  textEl.placeholder = c.ph; $('#url').placeholder = c.url; updateAnalyzeLabel();
  $('#pageTitle').textContent = PAGE[k][0]; $('#pageLead').textContent = PAGE[k][1]; $('#crumbName').textContent = PAGE[k][0];
  document.title = `${PAGE[k][0]} | VerityAI`;
  $('#examples').innerHTML = '<span>Try a sample:</span>' + EX[k].map((e, i) => `<button type="button" data-i="${i}">${esc(e[0])}</button>`).join('');
}
function setMode(mode) {
  state.mode = mode;
  $$('.tabs [role=tab]').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.mode === mode)));
  const file = mode === 'image' || mode === 'pdf';
  $$('.pane').forEach((p) => (p.hidden = p.dataset.pane !== (file ? 'file' : mode)));
  if (file) {
    if (state.image && (mode === 'pdf') !== (state.image.mime === 'application/pdf')) clearImage();
    $('#file').accept = FILE_TYPES[mode]; if (!state.image) $('#dropText').textContent = FILE_TEXT[mode];
  }
  notice('');
}
$$('.tabs [role=tab]').forEach((x) => (x.onclick = () => setMode(x.dataset.mode)));
$$('input[name=kind]').forEach((r) => (r.onchange = () => { setKind(r.value); notice(''); }));
$('#examples').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  setMode('text'); textEl.value = EX[state.kind][b.dataset.i][1]; updateCounter(); textEl.focus();
});
function updateCounter() {
  const n = textEl.value.length;
  $('#counter').textContent = `${n.toLocaleString()} / ${MAX_CHARS.toLocaleString()}`;
  $('#counter').parentElement.classList.toggle('over', n >= MAX_CHARS);
}
textEl.addEventListener('input', updateCounter);

/* ---------- Screenshot and PDF ---------- */
function clearImage() {
  state.image = null; $('#preview').hidden = true; $('#removeImg').hidden = true; $('#file').value = '';
  $('#dropText').textContent = FILE_TEXT[state.mode] || FILE_TEXT.image;
}
const readB64 = (file) => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.onerror = no; r.readAsDataURL(file); });
async function loadFile(file) {
  if (!file || !/^(image\/(jpeg|png|webp)|application\/pdf)$/.test(file.type)) return notice('Use a JPG, PNG or WebP image, or a PDF.');
  const pdf = file.type === 'application/pdf';
  setMode(pdf ? 'pdf' : 'image');
  try {
    if (pdf) {
      if (file.size > MAX_FILE) return notice('That file is too large. Keep it under 4 MB.');
      state.image = { b64: await readB64(file), mime: 'application/pdf' }; $('#preview').hidden = true;
      $('#dropText').textContent = `${file.name}. Click to choose a different file`;
    } else {
      const bmp = await createImageBitmap(file), k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp, 0, 0, c.width, c.height);
      const url = c.toDataURL('image/jpeg', 0.85);
      state.image = { b64: url.split(',')[1], mime: 'image/jpeg' }; $('#preview').src = url; $('#preview').hidden = false;
      $('#dropText').textContent = 'Click to choose a different file';
    }
    $('#removeImg').hidden = false; notice('');
  } catch { notice('That file could not be opened. Try another one.'); }
}
$('#file').onchange = (e) => loadFile(e.target.files[0]);
$('#removeImg').onclick = clearImage;
const drop = $('#drop');
['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, () => drop.classList.remove('over')));
drop.addEventListener('drop', (e) => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); });
document.addEventListener('paste', (e) => {
  const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith('image/'));
  if (f) loadFile(f);
});
$('#clearBtn').onclick = () => { textEl.value = ''; $('#url').value = ''; clearImage(); updateCounter(); notice(''); };

/* ---------- Check ---------- */
function buildPayload() {
  if (state.mode === 'text') {
    const content = textEl.value.trim();
    if (content.length < 20) throw new Error('Paste at least a sentence or two (20+ characters).');
    return { content };
  }
  if (state.mode === 'url') {
    const url = $('#url').value.trim();
    if (!/^https?:\/\/\S+\.\S+/.test(url)) throw new Error('Enter a full link that starts with http:// or https://.');
    return { url };
  }
  if (!state.image) throw new Error(state.mode === 'pdf' ? 'Choose a PDF first.' : 'Choose a screenshot first.');
  return { image: state.image.b64, image_mime: state.image.mime };
}
function setBusy(b) {
  state.busy = b; const btn = $('#analyzeBtn');
  btn.disabled = b; btn.classList.toggle('busy', b); updateAnalyzeLabel();
}
async function analyze() {
  if (state.busy) return;
  let payload;
  try { payload = buildPayload(); } catch (e) { return notice(e.message); }
  payload.kind = state.kind; notice(''); setBusy(true);
  try {
    const entry = store.add(await post('/analyze', payload));
    if (!entry) throw new Error('Your browser blocked saving the result, so it cannot open. Allow site data for this page and try again.');
    location.href = `/results/${entry.id}`;
  } catch (e) { notice(netError(e)); setBusy(false); }
}
$('#analyzeBtn').onclick = analyze;
textEl.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') analyze(); });

/* ---------- Shared content (PWA share target) and start-up ---------- */
function prefillFromShare() {
  const p = new URLSearchParams(location.search), text = (p.get('text') || '').trim(), url = (p.get('url') || '').trim(), title = (p.get('title') || '').trim();
  if (!text && !url) return;
  const m = text.match(/https?:\/\/\S+/), link = url || (m && text.replace(m[0], '').trim().length < 5 ? m[0] : '');
  if (link) { setMode('url'); $('#url').value = link; }
  else { textEl.value = [title, text].filter(Boolean).join('\n\n').slice(0, MAX_CHARS); updateCounter(); }
  history.replaceState(null, '', location.pathname);
  toast('Shared content added. Choose what it is and press Check.');
}
const typeParam = new URLSearchParams(location.search).get('type');
setKind(PATH_KIND[location.pathname] || (KIND[typeParam] ? typeParam : 'advice'));
setMode('text'); updateCounter(); prefillFromShare();
fetch(`${API}/health`).then((r) => r.json()).then((h) => {
  if (h.max_chars) { MAX_CHARS = h.max_chars; textEl.maxLength = MAX_CHARS; updateCounter(); }
  if (h.mode === 'unconfigured') notice('The server has no Gemini API key yet. Add GEMINI_API_KEY to backend/.env and restart it.', true);
  else if (h.mode === 'demo') notice('Demo mode is on: results come from a simple keyword check, not real AI.', true);
}).catch(() => { /* server offline: the error shows when the person tries to check */ });
