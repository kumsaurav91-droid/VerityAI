'use strict';
/* The Practice page: the Spot the Scam quiz. {{double braces}} mark the telling phrases that are highlighted after an answer. */
const QUIZ = [
  { scam: true, m: 'Congratulations! You are selected for Data Entry at a top MNC. Salary {{Rs 45,000 per month}}, work from home, {{no interview}}. Pay a {{Rs 1,800 registration fee}} today to confirm. Contact HR only on {{WhatsApp}}.',
    why: 'Real employers do not charge you to hire you. No interview, high pay for easy work and WhatsApp-only contact are classic fake-offer signs.' },
  { scam: false, m: 'Hi Riya, thank you for interviewing with us on Tuesday. We are pleased to offer you the Junior Analyst role at 4.8 LPA. Your offer letter is attached, sent from careers@acmecorp.com, our company domain. Please reply by Friday. {{No fees}} are needed at any stage.',
    why: 'It follows a real interview, comes from a company email domain, gives a clear deadline and says no fee is needed. You should still check the company on its official website.' },
  { scam: true, m: 'Become a Full Stack developer in 3 months! {{100% placement guarantee}} in top MNCs, {{50 LPA average package}}. Only {{5 seats left}}, pay in the next 24 hours. {{Advance of Rs 10,000 is non-refundable.}}',
    why: 'No one can guarantee a job, and a 50 LPA average for freshers is not realistic. Fake scarcity and non-refundable advances are meant to rush you.' },
  { scam: false, m: 'Our 12-week data analysis course costs Rs 6,000. You build {{three projects}} with mentor feedback. We {{do not promise jobs}}: in our last batch, 40% of students got interviews within three months. {{7-day refund}}, and the full syllabus is free on our website.',
    why: 'It states the price, the refund rule and realistic outcomes, and it does not promise a job.' },
  { scam: true, m: 'Internship at a top global company, work from home. You were chosen from 2 lakh applicants. {{Send Rs 3,000 as a laptop security deposit}}, refunded after one month. {{Reply with your Aadhaar and bank details}} to get your joining kit. Email: {{global.careers.hr@gmail.com}}',
    why: 'A deposit, a request for Aadhaar and bank details, and a free email address pretending to be a big company are all signs of a scam.' },
  { scam: false, m: 'Hello, this is Neha from the HR team at Acme Systems. You applied for our summer internship. We would like to schedule a 30-minute interview. Please pick a slot from the link on our official careers page. {{We never ask for payment or documents before an interview.}}',
    why: 'It asks for an interview first, points to the official careers page and clearly says it never asks for payment.' },
  { scam: true, m: 'Join my mastermind and become a millionaire at 20. {{Quit college}}, put your savings in {{crypto}}. Everyone who followed my plan {{earned 10 lakh in 30 days}}. DM me for the {{secret group}}, only Rs 25,000.',
    why: 'Income claims without proof, advice to quit college and risk your savings, and a paid secret group are signs of a sales funnel.' },
  { scam: false, m: 'Getting your first tech job usually takes a few months of steady work. {{Build two or three small projects}}, put them on GitHub, ask for feedback, and apply to roles that fit your level. {{Some weeks will feel slow}}, and that is normal.',
    why: 'It gives a realistic timeline, admits that progress is uneven and sells nothing.' },
];
const quiz = { order: [], i: 0, score: 0, answered: null };
const box = $('#quiz');

function start() {
  quiz.order = QUIZ.map((_, k) => k);
  for (let i = quiz.order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [quiz.order[i], quiz.order[j]] = [quiz.order[j], quiz.order[i]]; }
  Object.assign(quiz, { i: 0, score: 0, answered: null }); draw();
}
function draw() {
  const n = QUIZ.length;
  if (quiz.i >= n) {
    const msg = quiz.score >= 7 ? 'Sharp eyes. You would spot most of these in real life.'
      : quiz.score >= 4 ? 'Not bad. Read the explanations again, and check anything that asks for money.'
        : 'These are hard to spot, and that is the point. Check every offer before you act.';
    box.innerHTML = `<div class="q-card q-end"><p class="q-count">Your score</p><p class="q-score">${quiz.score}<span> / ${n}</span></p><p>${esc(msg)}</p>
      <div class="q-actions"><button class="btn primary" data-q="again">Play again</button><button class="btn secondary" data-q="share">Share my score on WhatsApp</button><a class="btn quiet" href="/check">Check your own message</a></div></div>`;
    return;
  }
  const item = QUIZ[quiz.order[quiz.i]], done = quiz.answered !== null, right = quiz.answered === item.scam;
  const body = item.m.split(/\{\{|\}\}/).map((p, k) => (k % 2 && done ? `<mark class="${item.scam ? 'high' : 'good'}">${esc(p)}</mark>` : esc(p))).join('');
  const foot = done
    ? `<div class="q-res ${right ? 'ok' : 'bad'}"><b>${right ? 'Correct.' : 'Not quite.'}</b> ${item.scam ? 'This one is risky.' : 'This one looks genuine.'}<p>${esc(item.why)}</p>
       <button class="btn primary small" data-q="next">${quiz.i === n - 1 ? 'See my score' : 'Next message'}</button></div>`
    : '<div class="q-actions"><button class="btn secondary" data-q="ok">Looks genuine</button><button class="btn secondary" data-q="bad">Looks risky</button></div>';
  box.innerHTML = `<div class="q-card"><p class="q-count">Message ${quiz.i + 1} of ${n}</p><p class="paper q-msg">${body}</p>${foot}</div>`;
}
box.onclick = (e) => {
  const b = e.target.closest('[data-q]'); if (!b) return;
  const a = b.dataset.q;
  if (a === 'ok' || a === 'bad') { quiz.answered = a === 'bad'; if (quiz.answered === QUIZ[quiz.order[quiz.i]].scam) quiz.score++; }
  else if (a === 'next') { quiz.i++; quiz.answered = null; }
  else if (a === 'again') return start();
  else if (a === 'share') return whatsapp(`I scored ${quiz.score} of ${QUIZ.length} in the VerityAI spot-the-scam quiz. Can you beat me? ${siteUrl()}/practice`);
  draw(); $('button', box)?.focus({ preventScroll: true });
};
start();
