'use strict';
/* The Results page for /results/<id>. Results are read from this browser's history. Needs common.js and layout.js. */
const SEV = ['low', 'medium', 'high'];
const entry = store.find(location.pathname.split('/').pop());
const r = entry?.result;
const show = (which) => { $('#rLoading').hidden = which !== 'loading'; $('#rMissing').hidden = which !== 'missing'; $('#rContent').hidden = which !== 'content'; };

const sev = (f) => (SEV.includes(f.severity) ? f.severity : 'medium');
function markUp(text, flags) {
  const low = text.toLowerCase(), found = [];
  flags.forEach((f, i) => {
    const q = (f.quote || '').trim().toLowerCase(), at = q.length > 2 ? low.indexOf(q) : -1;
    if (at >= 0) found.push({ s: at, e: at + q.length, f, i });
  });
  found.sort((a, b) => a.s - b.s);
  let out = '', pos = 0;
  for (const m of found) {
    if (m.s < pos) continue;
    out += esc(text.slice(pos, m.s)) + `<mark class="${sev(m.f)}" data-flag="${m.i}" title="${esc(m.f.reason)}">${esc(text.slice(m.s, m.e))}</mark>`;
    pos = m.e;
  }
  return out + esc(text.slice(pos));
}
function radarSVG(s) {
  const axes = [['Hype', s.hype], ['Burnout risk', s.burnout_risk], ['Hidden selling', s.hidden_selling], ['Weak evidence', 100 - s.evidence_quality]];
  const cx = 200, cy = 145, R = 80;
  const pt = (i, v) => { const a = -Math.PI / 2 + (i * Math.PI) / 2; return [cx + Math.cos(a) * R * v / 100, cy + Math.sin(a) * R * v / 100]; };
  const poly = (f) => axes.map((_, i) => pt(i, f(axes[i])).map((n) => n.toFixed(1)).join(',')).join(' ');
  const rings = [25, 50, 75, 100].map((v) => `<polygon class="ring" points="${poly(() => v)}"/>`).join('');
  const lines = axes.map((_, i) => `<line class="axis" x1="${cx}" y1="${cy}" x2="${pt(i, 100)[0]}" y2="${pt(i, 100)[1]}"/>`).join('');
  const dots = axes.map((a, i) => `<circle class="dot" r="3.5" cx="${pt(i, a[1])[0]}" cy="${pt(i, a[1])[1]}"/>`).join('');
  const anchor = ['middle', 'start', 'middle', 'end'];
  const labels = axes.map((a, i) => { const [x, y] = pt(i, 128); return `<text x="${x}" y="${y + 4}" text-anchor="${anchor[i]}">${a[0]} ${a[1]}</text>`; }).join('');
  return `<svg viewBox="-30 0 460 290" role="img" aria-label="Risk profile: ${axes.map((a) => a[0] + ' ' + a[1]).join(', ')}">${rings}${lines}<polygon class="shape" points="${poly((a) => a[1])}"/>${dots}${labels}</svg>`;
}

/* ---------- Evidence confidence: how well the claims could be verified. Separate from the risk score. ---------- */
function confidence(c) {
  const n = c.claims.length;
  if (!n) return ['none', 'No claims to verify', 'No specific, checkable claims were found, so there was nothing to verify against sources.'];
  const verified = c.claims.filter((x) => x.verdict !== 'unverified').length, withSources = c.sources.length;
  const level = verified / n >= 0.75 && withSources >= 2 ? 'high' : verified / n >= 0.5 && withSources >= 1 ? 'medium' : 'low';
  const unverified = n - verified;
  return [level, `${level[0].toUpperCase() + level.slice(1)} confidence`,
    `${verified} of ${n} claims could be checked against sources.${unverified ? ` ${unverified} could not be verified, which does not mean they are false.` : ''}`];
}
function renderClaims(c) {
  $('#claims').innerHTML = c.claims.length
    ? c.claims.map((x) => { const [txt, tone] = VERDICT[x.verdict] || VERDICT.unverified; return `<li class="${tone}"><span class="vtag">${esc(txt)}</span><div><q>${esc(x.claim)}</q><p>${esc(x.explanation)}</p></div></li>`; }).join('')
    : '<li class="none">No specific checkable claims were found.</li>';
  const src = c.sources.filter((s) => /^https:\/\//.test(s.url));
  $('#srcTitle').hidden = !src.length;
  $('#sources').innerHTML = src.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></li>`).join('');
  const [level, title, text] = confidence(c);
  $('#conf').dataset.level = level; $('#confLevel').textContent = title; $('#confText').textContent = text;
  $('#claimsHint').textContent = 'AI-assisted search. Open the sources and check them yourself.';
}

/* ---------- Page ---------- */
function render() {
  const tone = TONE[r.category] || 'warn', K = kindOf(r), risk = riskOf(r);
  document.title = `${verdictLabel(r)} | VerityAI`;
  $('#verdict').className = `verdict ${tone}`;
  $('#badge').textContent = verdictLabel(r);
  $('#summary').textContent = r.summary;
  const srcs = { text: 'Pasted text', url: r.source_title ? `Link: ${r.source_title}` : 'Link', image: 'Screenshot', pdf: 'PDF document', video: r.source_title ? `YouTube video: ${r.source_title}` : 'YouTube video' };
  $('#metaLine').textContent = `${K.name} · ${srcs[r.source] || ''} · ${fmtDate(entry.ts ?? entry.id)}`;
  $('#demoNote').hidden = !r.demo;

  const gf = $('#gaugeFill'); gf.style.strokeDashoffset = 326.7; $('#scoreNum').textContent = '0';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    gf.style.strokeDashoffset = 326.7 * (1 - risk / 100);
    const t0 = performance.now();
    (function tick(now) { const p = Math.min(1, (now - t0) / 900); $('#scoreNum').textContent = Math.round(risk * p); if (p < 1) requestAnimationFrame(tick); })(t0);
  }));

  const doms = r.domain_checks || [], flags = r.red_flags || [], facts = r.facts || [], checks = r.checklist || [];
  $('#domainWrap').hidden = !doms.length;
  $('#domains').innerHTML = doms.map((d) => {
    const [txt, level] = DOMAIN[d.status] || DOMAIN.unknown;
    return `<li class="dom ${level}"><b>${esc(d.domain)}</b><span>${esc(txt)}${d.age_days != null && !/free|short/.test(d.status) ? ` (${esc(ageText(d.age_days))})` : ''}</span></li>`;
  }).join('');
  $('#annotated').innerHTML = r.extracted_text ? markUp(r.extracted_text, flags) : '<em>No text could be read from the file.</em>';
  $('#flags').innerHTML = flags.length
    ? flags.map((f, i) => `<li id="flag-${i}"><span class="sev ${sev(f)}">${sev(f)}</span><div><q>${esc(f.quote)}</q><p>${esc(f.reason)}</p></div></li>`).join('')
    : `<li class="none">${esc(K.none)}</li>`;
  $('#radar').innerHTML = radarSVG(r.scores);
  $('#findings').innerHTML = (r.key_findings || []).map((x) => `<li>${esc(x)}</li>`).join('');
  $('#questions').innerHTML = (r.questions_to_ask || []).map((x) => `<li>${esc(x)}</li>`).join('');
  $('#factsWrap').hidden = !facts.length; $('#factsTitle').textContent = K.facts;
  $('#facts').innerHTML = facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd${/^(not stated|missing|none)/i.test(f.value) ? ' class="missing"' : ''}>${esc(f.value)}</dd></div>`).join('');
  $('#checkWrap').hidden = !checks.length; $('#checkTitle').textContent = K.check;
  $('#checklist').innerHTML = checks.map((c) => `<li><label><input type="checkbox"><span>${esc(c)}</span></label></li>`).join('');
  $('#rewriteTitle').textContent = K.rewrite; $('#askTitle').textContent = K.ask;
  $('#rewrite').textContent = r.realistic_rewrite; $('#recommendation').textContent = r.recommendation;
  $('#helpBox').hidden = !(r.kind === 'job' && r.category !== 'Realistic');
  $('#claimsBtn').disabled = !r.extracted_text;
  if (!r.extracted_text) { $('#claimsHint').textContent = 'There is no readable text to fact-check.'; $('#confText').textContent = 'There is no readable text to verify.'; }
  if (entry.claims) renderClaims(entry.claims);
  show('content');
}

if (!r) show('missing');
else {
  render();
  $('#annotated').addEventListener('click', (e) => {
    const m = e.target.closest('mark'), li = m && $(`#flag-${m.dataset.flag}`); if (!li) return;
    li.scrollIntoView({ behavior: 'smooth', block: 'center' }); li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash');
  });

  /* Claim check */
  $('#claimsBtn').onclick = async () => {
    const btn = $('#claimsBtn'); btn.disabled = true; btn.classList.add('busy');
    $('#claimsHint').textContent = 'Searching the web. This can take up to 20 seconds.';
    try {
      const data = await post('/claims', { text: r.extracted_text });
      entry.claims = data; store.patch(entry.id, { claims: data }); renderClaims(data);
    } catch (e) { $('#claimsHint').textContent = netError(e); }
    btn.disabled = false; btn.classList.remove('busy');
  };

  /* Copy, share, export */
  const summaryText = () => {
    const flags = (r.red_flags || []).map((f) => `- "${f.quote}": ${f.reason}`).join('\n') || '- None';
    return `VerityAI: ${verdictLabel(r)} (Risk score ${riskOf(r)}/100)\n${r.summary}\n\nRed flags:\n${flags}\n\nNext step: ${r.recommendation}`;
  };
  $('#copyBtn').onclick = () => copy(summaryText(), 'Summary copied');
  $('#copyRewrite').onclick = () => copy(r.realistic_rewrite, 'Rewrite copied');
  $('#waBtn').onclick = () => whatsapp(`*VerityAI*: ${verdictLabel(r)} (Risk score ${riskOf(r)}/100)\n${r.summary}\n\nCheck yours: ${siteUrl()}/check`);
  $('#pdfBtn').onclick = () => window.print();
  $('#shareBtn').onclick = async () => {
    await document.fonts.ready;
    const sans = '"Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif', serif = '"Source Serif 4", "Noto Serif Devanagari", Georgia, serif';
    const c = document.createElement('canvas'); c.width = c.height = 1080;
    const g = c.getContext('2d'), color = { ok: '#4ade80', warn: '#fbbf24', bad: '#ff8a80' }[TONE[r.category]];
    g.fillStyle = '#0a1017'; g.fillRect(0, 0, 1080, 1080); g.fillStyle = color; g.fillRect(0, 0, 18, 1080);
    g.fillStyle = '#e9eef5'; g.font = `600 40px ${sans}`; g.fillText('VerityAI', 90, 120);
    g.fillStyle = color; g.font = `800 300px ${sans}`; g.fillText(String(riskOf(r)), 90, 440);
    g.fillStyle = '#98a7b9'; g.font = `500 36px ${sans}`; g.fillText('Risk score out of 100', 96, 500);
    g.fillStyle = color; g.font = `800 90px ${sans}`; g.fillText(verdictLabel(r), 90, 650);
    g.fillStyle = '#e9eef5'; g.font = `400 42px ${serif}`;
    const words = r.summary.split(/\s+/); let line = '', y = 740, n = 0;
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (g.measureText(test).width > 900 && line) { if (++n === 5) { line = line.replace(/\s*\S*$/, '') + '…'; break; } g.fillText(line, 90, y); y += 60; line = w; } else line = test;
    }
    g.fillText(line, 90, y);
    g.fillStyle = '#98a7b9'; g.font = `500 32px ${sans}`; g.fillText('Checked with VerityAI', 90, 1010);
    const a = document.createElement('a'); a.download = `verityai-${r.kind || 'advice'}-${r.category.toLowerCase()}.png`; a.href = c.toDataURL('image/png'); a.click();
    toast('Image saved');
  };

  /* Feedback */
  const sendFeedback = async (rating, comment) => {
    try { await post('/feedback', { rating, kind: r.kind || 'advice', category: r.category, score: clamp(r.truth_score), comment: comment || null }); } catch { /* feedback is best effort */ }
    $$('[data-fb]').forEach((b) => (b.disabled = true)); $('#fbMore').hidden = true; $('#fbThanks').hidden = false;
  };
  $$('[data-fb]').forEach((b) => (b.onclick = () => (b.dataset.fb === 'wrong' ? ($('#fbMore').hidden = false, $('#fbText').focus()) : sendFeedback(b.dataset.fb))));
  $('#fbSend').onclick = () => sendFeedback('wrong', $('#fbText').value.trim());
}
