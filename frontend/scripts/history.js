'use strict';
/* The History page. Everything shown here is read from this browser. Needs common.js and layout.js. */
const filters = { q: '', kind: '', category: '' };
const VERDICT_FILTER = { Realistic: 'Few warning signs', Exaggerated: 'Exaggerated or suspicious', Misleading: 'High risk' };

function render() {
  const all = store.all(), q = filters.q.trim().toLowerCase();
  const list = all.filter((h) => (!filters.kind || (h.result.kind || 'advice') === filters.kind) && (!filters.category || h.result.category === filters.category)
    && (!q || `${h.title} ${verdictLabel(h.result)} ${kindOf(h.result).name}`.toLowerCase().includes(q)));
  $('#hCount').textContent = all.length ? `Showing ${list.length} of ${all.length} saved ${all.length === 1 ? 'check' : 'checks'}` : '';
  $('#hTools').hidden = !all.length; $('#hEmpty').hidden = !!all.length; $('#hNone').hidden = !all.length || !!list.length;
  $('#hList').innerHTML = list.map((h) => {
    const r = h.result, tone = TONE[r.category] || 'warn';
    return `<li class="h-item"><div class="h-risk ${tone}"><b>${riskOf(r)}</b><span>risk</span></div>
      <div class="h-main"><div class="h-meta"><span class="h-verdict ${tone}">${esc(verdictLabel(r))}</span><span>${esc(kindOf(r).name)}</span><time>${esc(fmtDate(h.ts ?? h.id))}</time></div>
        <p class="h-title">${esc(h.title || 'Untitled check')}</p></div>
      <div class="h-actions"><a class="btn secondary small" href="/results/${h.id}">View result</a><button class="btn quiet small" type="button" data-del="${h.id}" aria-label="Delete this result">Delete</button></div></li>`;
  }).join('');
}
$('#hSearch').oninput = (e) => { filters.q = e.target.value; render(); };
$('#hKind').onchange = (e) => { filters.kind = e.target.value; render(); };
$('#hCategory').onchange = (e) => { filters.category = e.target.value; render(); };
$('#hReset').onclick = () => { Object.assign(filters, { q: '', kind: '', category: '' }); $('#hSearch').value = $('#hKind').value = $('#hCategory').value = ''; render(); };
$('#hList').onclick = (e) => { const b = e.target.closest('[data-del]'); if (b) { store.remove(b.dataset.del); render(); toast('Result deleted'); } };
$('#hClear').onclick = () => { if (confirm('Delete all saved checks from this browser?')) { store.clear(); render(); } };
$('#hCategory').innerHTML = '<option value="">All verdicts</option>' + Object.entries(VERDICT_FILTER).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
render();
