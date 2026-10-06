/* ===================== demos.js : interactive demos (mounted by page.js on [data-demo]) ===================== */
const DEMOS = {};
const bdt = (n) => (Math.round(n) || 0).toLocaleString('en-IN');
function demoBox(title, sub, ...kids) { return h('div', { class: 'demo' }, h('h3', null, title), sub ? h('p', { class: 'sub' }, sub) : null, ...kids); }
function scoreGame(root, title, sub, items, choices, explainKey) {
  /* items: [{t, a, w}] ; choices: [{v, l}] */
  let score = 0, done = 0;
  const head = h('div', { class: 'qhead' }), list = h('div', { class: 'game' });
  const paint = () => { head.textContent = ''; head.append(h('span', null, `${done} of ${items.length} answered`), h('span', null, `Score ${score}`)); };
  items.forEach((it) => {
    const why = h('div', { class: 'gwhy' });
    const btns = choices.map((c) => h('button', { type: 'button', class: 'btn sm', onclick: () => {
      if (row.dataset.done) return; row.dataset.done = '1'; done++;
      const ok = c.v === it.a; if (ok) score++;
      btns.forEach((b, i) => { b.disabled = true; if (choices[i].v === it.a) b.classList.add('right'); else if (b === btns[choices.indexOf(c)]) b.classList.add('wrong'); });
      why.append(h('b', null, ok ? 'Correct. ' : 'Not quite: ' + choices.find((x) => x.v === it.a).l + '. '), it.w || '');
      paint();
    } }, c.l));
    const row = h('div', { class: 'grow' }, h('div', { class: 'gq' }, it.t), h('div', { class: 'row tight' }, btns), why);
    list.append(row);
  });
  paint();
  root.append(demoBox(title, sub, head, list, h('div', { class: 'row gap' }, h('button', { type: 'button', class: 'btn', onclick: () => { clear(root); scoreGame(root, title, sub, items, choices, explainKey); } }, 'Start again'))));
}

/* ================= Topic 1: planning ================= */
DEMOS['gantt'] = (root) => {
  let tasks = [
    { n: 'Planning & proposal', s: 1, d: 3, p: 'Whole team' }, { n: 'Requirements (SRS)', s: 2, d: 2, p: 'Analyst' }, { n: 'Design (DFD, UML, UI)', s: 3, d: 3, p: 'Designer' },
    { n: 'Coding', s: 6, d: 3, p: 'Developers' }, { n: 'Testing', s: 7, d: 3, p: 'Tester' }, { n: 'Delivery & report', s: 10, d: 1, p: 'Leader' }
  ];
  const tbl = h('div'), chart = h('div', { class: 'gantt' }), info = h('div', { class: 'out' });
  function draw() {
    clear(tbl); clear(chart);
    const rows = tasks.map((t, i) => {
      const up = (k, v) => { t[k] = k === 'n' || k === 'p' ? v : Math.max(1, Math.min(30, parseInt(v, 10) || 1)); drawChart(); };
      return h('tr', null,
        h('td', null, textInput(t.n, { oninput: (e) => up('n', e.target.value), 'aria-label': 'Task name', style: { width: '100%' } })),
        h('td', null, numInput(t.s, { min: 1, max: 30, oninput: (e) => up('s', e.target.value), 'aria-label': 'Start week', style: { width: '70px' } })),
        h('td', null, numInput(t.d, { min: 1, max: 30, oninput: (e) => up('d', e.target.value), 'aria-label': 'Duration in weeks', style: { width: '70px' } })),
        h('td', null, textInput(t.p, { oninput: (e) => up('p', e.target.value), 'aria-label': 'Responsible', style: { width: '100%' } })),
        h('td', null, h('button', { type: 'button', class: 'btn sm', 'aria-label': 'Remove task', onclick: () => { tasks.splice(i, 1); draw(); } }, '✕')));
    });
    tbl.append(h('div', { class: 'scrollx' }, h('table', { class: 'doc edit' }, h('thead', null, h('tr', null, ['Task', 'Start week', 'Weeks', 'Responsible', ''].map((x) => h('th', null, x)))), h('tbody', null, rows))),
      h('div', { class: 'row gap' }, h('button', { type: 'button', class: 'btn', onclick: () => { tasks.push({ n: 'New task', s: 1, d: 1, p: '' }); draw(); } }, '+ Add task'),
        h('button', { type: 'button', class: 'btn', onclick: () => { tasks = tasks.slice().sort((a, b) => a.s - b.s); draw(); } }, 'Sort by start')));
    drawChart();
  }
  function drawChart() {
    clear(chart);
    const end = Math.max(10, ...tasks.map((t) => t.s + t.d - 1));
    chart.style.setProperty('--wk', end);
    chart.append(h('div', { class: 'g-lab g-head' }, 'Week →'), ...range(end).map((w) => h('div', { class: 'g-wk g-head' }, String(w + 1))));
    tasks.forEach((t, i) => {
      chart.append(h('div', { class: 'g-lab' }, t.n || '(unnamed)'));
      chart.append(h('div', { class: 'g-track', style: { gridColumn: `2 / span ${end}` } },
        h('div', { class: 'g-bar c' + (i % 4), style: { gridColumn: `${t.s} / span ${t.d}` }, title: `${t.n}: weeks ${t.s}–${t.s + t.d - 1}` }, t.d > 1 ? `W${t.s}–${t.s + t.d - 1}` : `W${t.s}`)));
    });
    const last = Math.max(0, ...tasks.map((t) => t.s + t.d - 1));
    const busy = range(last).map((w) => tasks.filter((t) => w + 1 >= t.s && w + 1 < t.s + t.d).length);
    const peak = Math.max(0, ...busy), gaps = busy.map((b, w) => (b ? 0 : w + 1)).filter(Boolean);
    info.innerHTML = `Project length: <b>${last} weeks</b> · busiest week: <b>week ${busy.indexOf(peak) + 1}</b> with <b>${peak}</b> tasks running in parallel` + (gaps.length ? ` · idle weeks: <b>${gaps.join(', ')}</b>` : ' · no idle weeks');
  }
  draw();
  root.append(demoBox('Gantt chart builder', 'Edit a task’s start week or length and the chart redraws. Overlapping bars are tasks that run in parallel; the summary shows the total length and the busiest week.', tbl, chart, info));
};

DEMOS['budget'] = (root) => {
  const rows = [
    ['Office cost', 'Team meeting', 25000, 20000], ['Office cost', 'Project meeting', 25000, 20000], ['Office cost', 'First aid', 1000, 500],
    ['Website cost', 'Website maintenance', 2000, 1500],
    ['Office equipment', 'Computer', 1000000, 950000], ['Office equipment', 'Laptop', 200000, 150000], ['Office equipment', 'ATM machine', 300000, 250000], ['Office equipment', 'CC camera', 100000, 100000],
    ['Salary', 'Team leader', 200000, 250000], ['Salary', 'System designer', 80000, 70000], ['Salary', 'Software engineer', 100000, 100000], ['Salary', 'Animator', 60000, 60000], ['Salary', 'Developer', 50000, 50000], ['Salary', 'Officer', 40000, 38000], ['Salary', 'Sentry', 10000, 9000]
  ].map(([c, i, e, n]) => ({ c, i, e, n }));
  const body = h('div'), sum = h('div');
  function draw() {
    clear(body);
    let cat = null;
    const trs = [];
    rows.forEach((r, k) => {
      if (r.c !== cat) { cat = r.c; const sub = rows.filter((x) => x.c === cat); trs.push(h('tr', { class: 'cat' }, h('td', { colspan: 2 }, cat), h('td', { class: 'm' }, bdt(sub.reduce((a, x) => a + x.e, 0))), h('td', { class: 'm' }, bdt(sub.reduce((a, x) => a + x.n, 0))), h('td'))); }
      const num = (key) => numInput(r[key], { min: 0, step: 500, 'aria-label': r.i + (key === 'e' ? ' existing' : ' new'), style: { width: '120px' }, oninput: (e) => { r[key] = +e.target.value || 0; paintSum(); } });
      trs.push(h('tr', null, h('td'), h('td', null, textInput(r.i, { oninput: (e) => { r.i = e.target.value; }, 'aria-label': 'Item' })), h('td', null, num('e')), h('td', null, num('n')), h('td', null, h('button', { type: 'button', class: 'btn sm', 'aria-label': 'Remove row', onclick: () => { rows.splice(k, 1); draw(); } }, '✕'))));
    });
    const catSel = selectEl(['Office cost', 'Website cost', 'Office equipment', 'Salary', 'Software licences', 'Training', 'Contingency'], 'Salary');
    body.append(h('div', { class: 'scrollx' }, h('table', { class: 'doc edit budget' }, h('thead', null, h('tr', null, ['Criteria', 'Cost item', 'Existing system (Tk)', 'New system (Tk)', ''].map((x) => h('th', null, x)))), h('tbody', null, trs))),
      h('div', { class: 'row gap' }, catSel, h('button', { type: 'button', class: 'btn', onclick: () => { const i = rows.map((r) => r.c).lastIndexOf(catSel.value); const r = { c: catSel.value, i: 'New item', e: 0, n: 0 }; if (i < 0) rows.push(r); else rows.splice(i + 1, 0, r); draw(); } }, '+ Add item')));
    paintSum();
  }
  function paintSum() {
    const E = rows.reduce((a, r) => a + r.e, 0), N = rows.reduce((a, r) => a + r.n, 0), s = E - N;
    sum.innerHTML = `<div class="kvrow"><span class="kv"><small>Existing total</small><b>${bdt(E)} Tk</b></span><span class="kv"><small>New system total</small><b>${bdt(N)} Tk</b></span><span class="kv ${s >= 0 ? 'ok' : 'bad'}"><small>${s >= 0 ? 'Saving' : 'Extra cost'}</small><b>${bdt(Math.abs(s))} Tk (${E ? (Math.abs(s) / E * 100).toFixed(1) : 0}%)</b></span></div>`;
    body.querySelectorAll('tr.cat').forEach((tr) => { const c = tr.firstChild.textContent, sub = rows.filter((x) => x.c === c); tr.children[1].textContent = bdt(sub.reduce((a, x) => a + x.e, 0)); tr.children[2].textContent = bdt(sub.reduce((a, x) => a + x.n, 0)); });
  }
  draw();
  root.append(demoBox('Budget table: existing vs new system', 'The figures from the lab manual’s ATM budget (Table I.1). Change any cost to see category subtotals, totals and the saving update. Amounts use Bangladeshi grouping (lakh: 21,93,000).', body, sum));
};

DEMOS['econ'] = (root) => {
  const v = { dev: 2069000, run: 300000, ben: 1100000, yrs: 5, rate: 8 };
  const out = h('div');
  const inp = (k, l, step) => field(l, numInput(v[k], { step: step || 1000, min: 0, oninput: (e) => { v[k] = +e.target.value || 0; calc(); } }));
  function calc() {
    const net = v.ben - v.run, total = v.dev + v.run * v.yrs, gain = v.ben * v.yrs;
    let npv = -v.dev; for (let y = 1; y <= v.yrs; y++) npv += net / Math.pow(1 + v.rate / 100, y);
    const pay = net > 0 ? v.dev / net : Infinity, roi = total ? (gain - total) / total * 100 : 0;
    const ok = net > 0 && pay <= v.yrs && npv > 0;
    out.innerHTML = `<div class="kvrow"><span class="kv"><small>Net benefit / year</small><b>${bdt(net)} Tk</b></span><span class="kv"><small>Payback period</small><b>${isFinite(pay) ? pay.toFixed(1) + ' years' : 'never'}</b></span><span class="kv"><small>ROI over ${v.yrs} years</small><b>${roi.toFixed(1)}%</b></span><span class="kv"><small>NPV at ${v.rate}%</small><b>${bdt(npv)} Tk</b></span></div>
      <div class="verdict ${ok ? 'ok' : 'bad'}">${ok ? 'Economically feasible: the project pays for itself within the period and the NPV is positive.' : 'Not economically feasible with these figures: ' + (net <= 0 ? 'running costs eat the whole benefit.' : pay > v.yrs ? 'it does not pay back within ' + v.yrs + ' years.' : 'the discounted value is negative.')}</div>
      <div class="formula">payback = development cost ÷ (annual benefit − annual running cost)<br>ROI = (total benefit − total cost) ÷ total cost × 100%<br>NPV = −cost + Σ net benefit ÷ (1 + r)<sup>t</sup></div>`;
  }
  calc();
  root.append(demoBox('Economic feasibility calculator', 'A project is economically feasible when its benefits outweigh its costs within a sensible time. Try making the running cost larger than the benefit.',
    h('div', { class: 'row' }, inp('dev', 'Development cost (Tk)', 10000), inp('run', 'Running cost per year (Tk)'), inp('ben', 'Benefit per year (Tk)'), inp('yrs', 'Years', 1), inp('rate', 'Discount rate (%)', 1)), h('div', { class: 'gap' }, out)));
};

DEMOS['risk'] = (root) => {
  const risks = [
    ['A team member drops the course', 2, 4], ['Requirements change late', 4, 3], ['Team is new to LaTeX / UML tools', 4, 2],
    ['Laptop failure loses work (no backup)', 2, 5], ['Schedule underestimated', 4, 4]
  ].map(([n, p, i]) => ({ n, p, i }));
  const tb = h('div'), grid = h('div', { class: 'rmatrix' }), plan = h('div');
  const level = (s) => (s >= 15 ? ['High', 'hi'] : s >= 8 ? ['Medium', 'md'] : ['Low', 'lo']);
  const RESP = { hi: 'Act now: reduce the probability or the impact, and assign an owner.', md: 'Plan a response and monitor weekly.', lo: 'Accept and keep an eye on it.' };
  function draw() {
    clear(tb); clear(grid); clear(plan);
    tb.append(h('div', { class: 'scrollx' }, h('table', { class: 'doc edit' }, h('thead', null, h('tr', null, ['#', 'Risk', 'Probability (1–5)', 'Impact (1–5)', 'Score', 'Level', ''].map((x) => h('th', null, x)))),
      h('tbody', null, risks.map((r, k) => {
        const [lv, c] = level(r.p * r.i);
        return h('tr', null, h('td', null, String(k + 1)), h('td', null, textInput(r.n, { oninput: (e) => { r.n = e.target.value; }, 'aria-label': 'Risk', style: { width: '100%' } })),
          h('td', null, selectEl([1, 2, 3, 4, 5], r.p, (x) => { r.p = +x; draw(); })), h('td', null, selectEl([1, 2, 3, 4, 5], r.i, (x) => { r.i = +x; draw(); })),
          h('td', { class: 'm' }, String(r.p * r.i)), h('td', null, h('span', { class: 'rl ' + c }, lv)),
          h('td', null, h('button', { type: 'button', class: 'btn sm', 'aria-label': 'Remove risk', onclick: () => { risks.splice(k, 1); draw(); } }, '✕')));
      })))), h('div', { class: 'row gap' }, h('button', { type: 'button', class: 'btn', onclick: () => { risks.push({ n: 'New risk', p: 3, i: 3 }); draw(); } }, '+ Add risk')));
    grid.append(h('div', { class: 'rm-y' }, 'Probability →'));
    for (let p = 5; p >= 1; p--) {
      grid.append(h('div', { class: 'rm-lab' }, String(p)));
      for (let i = 1; i <= 5; i++) grid.append(h('div', { class: 'rm-cell ' + level(p * i)[1] }, risks.map((r, k) => (r.p === p && r.i === i ? h('span', { class: 'rm-dot', title: r.n }, String(k + 1)) : null))));
    }
    grid.append(h('div'), ...[1, 2, 3, 4, 5].map((i) => h('div', { class: 'rm-lab' }, String(i))), h('div', { class: 'rm-x' }, 'Impact →'));
    const top = risks.map((r, k) => ({ r, k, s: r.p * r.i })).sort((a, b) => b.s - a.s);
    plan.append(h('ol', { class: 'small' }, top.map(({ r, k, s }) => h('li', null, h('b', null, `#${k + 1} ${r.n}`), ` (score ${s}): ` + RESP[level(s)[1]]))));
  }
  draw();
  root.append(demoBox('Risk register and matrix', 'Score = probability × impact. The 5 × 5 matrix places each numbered risk; the list below ranks them and suggests a response.', tb, h('div', { class: 'cols gap' }, grid, plan)));
};

/* ================= Topic 2: LaTeX ================= */
const TEX_SAMPLES = {
  hello: [
    '\\documentclass{article}',
    '\\begin{document}',
    'Hello World! % your content goes here...',
    '',
    'Words are separated by one or more spaces.',
    'Paragraphs are separated by one or more blank lines.',
    '',
    "Single quotes: `text'. Double quotes: ``text''.",
    'Special characters must be escaped: \\$ \\% \\& \\# \\_ \\{ \\}',
    '\\end{document}'].join('\n'),
  exercise1: String.raw`\documentclass{article}
\begin{document}
% Exercise 1: fix the errors (hint: special characters!)
In March 2006, Congress raised that ceiling an additional $0.79
trillion to $8.97 trillion, which is approximately 68% of GDP. As of
October 4, 2008, the "Emergency Economic Stabilization Act of
2008" raised the current debt ceiling to $11.3 trillion.
\end{document}`,
  math: String.raw`\documentclass{article}
\usepackage{amsmath}
\begin{document}
Let $a$ and $b$ be distinct positive integers, and let $c = a - b + 1$.
The roots of a quadratic equation are given by
\begin{equation}
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\label{eq:quad}
\end{equation}
where $a$, $b$ and $c$ are the coefficients; see \eqref{eq:quad}.
\begin{align*}
(x+1)^3 &= (x+1)(x+1)(x+1) \\
        &= (x+1)(x^2 + 2x + 1) \\
        &= x^3 + 3x^2 + 3x + 1
\end{align*}
\end{document}`,
  exercise2: String.raw`\documentclass{article}
\usepackage{amsmath}
\begin{document}
% Exercise 2: make the maths match the target (hint: $...$ and \infty)
Let $X_1, X_2, \ldots, X_n$ be a sequence of independent and identically
distributed random variables with \operatorname{E}[X_i] = \mu and
$\operatorname{Var}[X_i] = \sigma^2 < infinity$, and let
S_n = \frac{1}{n}\sum_{i=1}^{n} X_i
denote their mean. Then as $n$ approaches infinity, the random variables
\sqrt{n}(S_n - \mu) converge in distribution to a normal $N(0, \sigma^2)$.
\end{document}`,
  report: String.raw`\documentclass[12pt]{article}
\usepackage{amsmath}
\usepackage{graphicx}
\title{Smart Library Management System}
\author{Team Alpha, CSE 308}
\date{\today}
\begin{document}
\maketitle
\begin{abstract}
We propose a web-based system that lets students search, reserve and renew books.
\end{abstract}
\tableofcontents

\section{Introduction}\label{sec:intro}
Libraries still track loans on paper. Section~\ref{sec:method} explains our approach.

\subsection{Objectives}
\begin{itemize}
  \item Let students \textbf{search} and \emph{reserve} books online.
  \item Calculate fines automatically.
\end{itemize}

\section{Methodology}\label{sec:method}
We follow the iterative model shown in Figure~\ref{fig:model}.
\begin{figure}[h]
  \centering
  \includegraphics[width=0.5\textwidth]{iterative-model.png}
  \caption{The iterative development model.}
  \label{fig:model}
\end{figure}
\end{document}`,
  figtab: String.raw`\documentclass{article}
\usepackage{graphicx}
\usepackage{caption}
\usepackage{subcaption}
\begin{document}
Table~\ref{tab:budget} lists the cost; Figure~\ref{fig:three} shows three graphs.
\begin{table}[h]
\centering
\caption{Budget of the new system}
\label{tab:budget}
\begin{tabular}{|l|r|}
\hline
Item & Cost (Tk) \\ \hline
Laptop & 1,50,000 \\
Developer & 50,000 \\ \hline
\end{tabular}
\end{table}

\begin{figure}[h]
  \centering
  \begin{subfigure}[b]{0.3\textwidth}
    \centering
    \includegraphics[width=\textwidth]{graph1}
    \caption{$y=x$}
  \end{subfigure}
  \hfill
  \begin{subfigure}[b]{0.3\textwidth}
    \centering
    \includegraphics[width=\textwidth]{graph2}
    \caption{$y=3\sin x$}
  \end{subfigure}
  \caption{Three simple graphs}
  \label{fig:three}
\end{figure}
\end{document}`,
  algo: String.raw`\documentclass{article}
\usepackage{algorithm}
\usepackage{algpseudocode}
\begin{document}
\begin{algorithm}
\caption{Withdraw cash}
\begin{algorithmic}[1]
\Require PIN is verified
\State $b \gets$ balance of the account
\If{$amount \leq b$}
    \State $b \gets b - amount$
    \State dispense cash
\Else
    \State show an error: insufficient funds
\EndIf
\Return $b$
\end{algorithmic}
\end{algorithm}
\end{document}`,
  cite: String.raw`\documentclass{article}
\usepackage{biblatex}
\addbibresource{citation.bib}
\begin{document}
ATMs were first studied as self-service systems~\cite{batiz2008}.
Requirements should follow the IEEE recommended practice~\cite{ieee830}.

\printbibliography
\end{document}`
};
/* exercises: the corrected source is compiled as the target page shown beside the student's own output */
const TEX_TARGETS = {
  exercise1: [   // an array, not String.raw: the LaTeX quotes `` would end a template literal
    '\\documentclass{article}',
    '\\begin{document}',
    'In March 2006, Congress raised that ceiling an additional \\$0.79',
    'trillion to \\$8.97 trillion, which is approximately 68\\% of GDP. As of',
    "October 4, 2008, the ``Emergency Economic Stabilization Act of",
    "2008'' raised the current debt ceiling to \\$11.3 trillion.",
    '\\end{document}'].join('\n'),
  exercise2: String.raw`\documentclass{article}
\usepackage{amsmath}
\begin{document}
Let $X_1, X_2, \ldots, X_n$ be a sequence of independent and identically
distributed random variables with $\operatorname{E}[X_i] = \mu$ and
$\operatorname{Var}[X_i] = \sigma^2 < \infty$, and let
\begin{equation*}
S_n = \frac{1}{n}\sum_{i=1}^{n} X_i
\end{equation*}
denote their mean. Then as $n$ approaches infinity, the random variables
$\sqrt{n}(S_n - \mu)$ converge in distribution to a normal $N(0, \sigma^2)$.
\end{document}`
};
const TEX_TASKS = {
  exercise1: 'The source has mistakes with special characters. Edit it until <b>Your output</b> (right) looks exactly like the <b>Target</b> (left). Start with the first error in the log.',
  exercise2: 'Some of the maths is written as plain text. Edit the source until <b>Your output</b> (right) looks exactly like the <b>Target</b> (left): put maths inside <code>$…$</code>, give the big formula its own <code>equation*</code>, and write ∞ as <code>\\infty</code>.'
};
DEMOS['tex-play'] = (root) => {
  const pick = root.getAttribute('data-sample') || 'hello';
  const names = { hello: 'Hello world', exercise1: 'Exercise 1', math: 'Maths', exercise2: 'Exercise 2', report: 'Report', figtab: 'Tables & figures', algo: 'Algorithm', cite: 'Citations' };
  const show = (root.getAttribute('data-list') || pick).split(',');
  const ta = h('textarea', { class: 'tex-src', spellcheck: 'false', 'aria-label': 'LaTeX source' });
  const view = h('div', { class: 'tex-page' }), log = h('div', { class: 'tex-log' }), status = h('span', { class: 'small muted' });
  const target = h('div', { class: 'tex-page target', 'aria-label': 'Target output' }), match = h('div', { class: 'tex-match', 'aria-live': 'polite' }), task = h('p', { class: 'tex-task' });
  const area = h('div');
  let timer = 0, cur = pick;
  /* the visible text of a page, ignoring spacing and KaTeX's hidden MathML copy */
  const looks = (el) => { const c = el.cloneNode(true); c.querySelectorAll('.katex-mathml').forEach((x) => x.remove()); return c.textContent.replace(/\s+/g, ''); };
  function build() {
    const r = TeX.compile(ta.value, { bib: TEX_BIB });
    view.innerHTML = r.html || '<p class="tx-note">(empty page)</p>';
    clear(log);
    if (!r.errors.length && !r.warnings.length) log.append(h('div', { class: 'tl-ok' }, '✓ Compiled with no errors.'));
    r.errors.forEach((e) => log.append(h('div', { class: 'tl-err' }, h('b', null, `! l.${e.line} `), e.msg)));
    r.warnings.forEach((w) => log.append(h('div', { class: 'tl-warn' }, h('b', null, 'Warning: '), w)));
    if (!TEX_TARGETS[cur]) return;
    target.innerHTML = TeX.compile(TEX_TARGETS[cur], { bib: TEX_BIB }).html;
    const ok = !r.errors.length && looks(view) === looks(target);
    area.querySelector('.tex-split').classList.toggle('matched', ok);
    match.className = 'tex-match ' + (ok ? 'ok' : 'no');
    match.textContent = ok ? '✓ Your output matches the target. Well done!'
      : r.errors.length ? `✗ Not matching yet: ${r.errors.length} error${r.errors.length > 1 ? 's' : ''} in the log. Fix the first one, then compare the two pages again.`
        : '✗ It compiles, but your output still differs from the target. Compare the two pages word by word.';
  }
  function layout() {
    clear(area);
    if (TEX_TARGETS[cur]) {
      task.innerHTML = TEX_TASKS[cur];
      ta.classList.add('ex-src');
      view.classList.add('mine');
      ta.style.height = (TEX_SAMPLES[cur].split('\n').length * 1.55 + 1.4) + 'em';
      area.append(task, h('div', { class: 'gap' }, ta, log), match,
        h('div', { class: 'tex-split tx-exm' },
          h('div', null, h('div', { class: 'tex-lab tgt' }, 'Target ', h('i', null, '· what it should look like')), target),
          h('div', null, h('div', { class: 'tex-lab' }, 'Your output ', h('i', null, '· updates as you type')), view)));
    } else {
      ta.classList.remove('ex-src');
      view.classList.remove('mine');
      ta.style.height = '';
      area.append(h('div', { class: 'tex-split' }, h('div', null, ta, log), view));
    }
  }
  const load = (k) => { cur = k; ta.value = TEX_SAMPLES[k]; layout(); build(); };
  ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(build, 250); });
  ta.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('  ', s, ta.selectionEnd, 'end'); build(); } });
  const bar = h('div', { class: 'row tight' }, show.length > 1 ? seg(show.map((k) => ({ v: k, l: names[k] })), pick, load).el : null, h('button', { type: 'button', class: 'btn sm', onclick: () => load(cur) }, 'Reset'), status);
  load(pick);
  TeX.loadKatex((ok) => { status.textContent = ok ? 'Maths: KaTeX' : 'Maths shown as source (offline)'; build(); });
  root.append(demoBox('LaTeX playground', TEX_TARGETS[pick] ? 'An exercise: the page on the left is the target, the page on the right is what your source produces. Errors appear in the log with the line number and LaTeX’s own wording.'
    : 'Edit the source on the left; the page on the right updates as you type. Errors appear in the log with the line number and LaTeX’s own wording. This previewer knows the commands in this course, not all of LaTeX — use Overleaf for real reports.',
  bar, area));
};

DEMOS['tex-escape'] = (root) => {
  const inp = h('textarea', { rows: 3, 'aria-label': 'Plain text', class: 'full' }), out = h('pre', { class: 'code tex nonum' }), notes = h('ul', { class: 'small' });
  const page = h('div', { class: 'tex-page tex-out' });
  const MAP = { '\\': '\\textbackslash{}', '%': '\\%', '$': '\\$', '&': '\\&', '#': '\\#', '_': '\\_', '{': '\\{', '}': '\\}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' };
  const WHY = { '%': 'starts a comment', '$': 'starts maths mode', '&': 'separates table columns', '#': 'marks macro parameters', '_': 'makes a subscript in maths', '{': 'opens a group', '}': 'closes a group', '\\': 'starts a command', '~': 'is a non-breaking space', '^': 'makes a superscript in maths', '"': "gives a straight quote; use ``…'' for curly quotes" };
  function go() {
    let s = inp.value, seen = {};
    let r = s.replace(/[\\%$&#_{}~^]/g, (c) => { seen[c] = (seen[c] || 0) + 1; return MAP[c]; });
    r = r.replace(/"([^"]*)"/g, (m, x) => { seen['"'] = (seen['"'] || 0) + 1; return '``' + x + "''"; });
    out.textContent = r; TeX.render(out);
    page.innerHTML = TeX.compile('\\documentclass{article}\n\\begin{document}\n' + r + '\n\\end{document}').html || '<p class="tx-note">(empty page)</p>';
    clear(notes);
    Object.keys(seen).forEach((c) => notes.append(h('li', null, h('code', null, c), ` × ${seen[c]} — ${WHY[c]}, so it was written as `, h('code', null, c === '"' ? "``…''" : MAP[c]))));
    if (!Object.keys(seen).length) notes.append(h('li', null, 'Nothing to escape.'));
  }
  inp.value = 'Profit rose 68% to $8.97 trillion for R&D in file_v2 #1 "final"';
  inp.addEventListener('input', go); go();
  root.append(demoBox('Special-character escaper', 'Type ordinary text; the tool shows how to write it safely in LaTeX and explains each change.', inp, h('div', { class: 'co-h' }, 'LaTeX source'), out, h('div', { class: 'co-h' }, 'Output'), page, notes));
};

DEMOS['tex-table'] = (root) => {
  let R = 3, Cc = 3, align = ['l', 'c', 'r'], border = 'grid';
  let data = [['Item', 'Qty', 'Cost (Tk)'], ['Laptop', '2', '1,50,000'], ['Printer', '1', '20,000']];
  const cap = textInput('Equipment budget', { 'aria-label': 'Caption' }), lab = textInput('tab:budget', { 'aria-label': 'Label' });
  const grid = h('div'), code = h('pre', { class: 'code tex' }), prev = h('div', { class: 'tex-page small-page' });
  function fix() { while (data.length < R) data.push(range(Cc).map(() => '')); data.length = R; data = data.map((r) => { r = r.slice(0, Cc); while (r.length < Cc) r.push(''); return r; }); while (align.length < Cc) align.push('l'); align.length = Cc; }
  function draw() {
    fix(); clear(grid);
    grid.append(h('div', { class: 'scrollx' }, h('table', { class: 'tgrid-edit' },
      h('tr', null, range(Cc).map((c) => h('td', null, selectEl([{ v: 'l', l: 'left' }, { v: 'c', l: 'centre' }, { v: 'r', l: 'right' }], align[c], (v) => { align[c] = v; gen(); })))),
      data.map((row, r) => h('tr', null, row.map((v, c) => h('td', null, textInput(v, { 'aria-label': `Row ${r + 1} column ${c + 1}`, oninput: (e) => { data[r][c] = e.target.value; gen(); } }))))))));
    gen();
  }
  const esc = (s) => s.replace(/[\\%$&#_{}]/g, (c) => (c === '\\' ? '\\textbackslash{}' : '\\' + c));
  function gen() {
    const spec = border === 'grid' ? '|' + align.join('|') + '|' : align.join('');
    const H = border === 'none' ? '' : ' \\hline';
    const lines = ['\\begin{table}[h]', '  \\centering', '  \\caption{' + esc(cap.value) + '}', '  \\label{' + lab.value + '}', '  \\begin{tabular}{' + spec + '}' + (border === 'none' ? '' : ' \\hline')];
    data.forEach((row, r) => lines.push('    ' + row.map(esc).join(' & ') + ' \\\\' + (border === 'grid' || (border === 'booktabs' && (r === 0 || r === R - 1)) ? H : '')));
    lines.push('  \\end{tabular}', '\\end{table}');
    code.textContent = lines.join('\n'); TeX.render(code);
    prev.innerHTML = TeX.compile('\\documentclass{article}\n\\begin{document}\nTable~\\ref{' + lab.value + '} shows:\n' + lines.join('\n') + '\n\\end{document}').html;
  }
  cap.addEventListener('input', gen); lab.addEventListener('input', gen);
  const spin = (l, get, set) => field(l, numInput(get(), { min: 1, max: 8, style: { width: '70px' }, oninput: (e) => { set(Math.max(1, Math.min(8, +e.target.value || 1))); draw(); } }));
  root.append(demoBox('Table generator', 'Fill the grid; the tabular code and a preview are written for you. Notice how & separates columns and \\\\ ends each row.',
    h('div', { class: 'row' }, spin('Rows', () => R, (v) => { R = v; }), spin('Columns', () => Cc, (v) => { Cc = v; }), field('Borders', seg([{ v: 'grid', l: 'grid' }, { v: 'booktabs', l: 'top & bottom' }, { v: 'none', l: 'none' }], border, (v) => { border = v; gen(); }).el), field('Caption', cap), field('Label', lab)),
    h('div', { class: 'gap' }, grid), h('div', { class: 'cols gap' }, code, prev)));
  draw();
};

DEMOS['bibtex'] = (root) => {
  const f = { type: 'article', author: 'Boehm, Barry W.', title: 'A spiral model of software development and enhancement', journal: 'Computer', booktitle: '', publisher: '', volume: '21', number: '5', pages: '61--72', year: '1988', doi: '10.1109/2.59' };
  const code = h('pre', { class: 'code bib' }), ref = h('div', { class: 'out' }), use = h('pre', { class: 'code tex nonum' });
  const key = () => ((f.author.split(',')[0] || 'anon').toLowerCase().replace(/[^a-z]/g, '') + f.year + ((f.title.split(/\s+/).find((w) => w.length > 3) || '').toLowerCase().replace(/[^a-z]/g, '')));
  const need = { article: ['journal', 'volume', 'number', 'pages'], inproceedings: ['booktitle', 'pages'], book: ['publisher'], misc: [] };
  const box = h('div', { class: 'row' });
  function gen() {
    const k = key(), fields = ['author', 'title'].concat(need[f.type], ['year', 'doi']).filter((x) => f[x]);
    code.textContent = '@' + f.type + '{' + k + ',\n' + fields.map((x) => '  ' + x + ' = {' + f[x] + '}').join(',\n') + '\n}'; TeX.render(code);
    ref.innerHTML = '<b>[1]</b> ' + TeX.fmtBib(f) + (f.doi ? ' doi: ' + TeX.escH(f.doi) + '.' : '');
    use.textContent = 'as described by Boehm~\\cite{' + k + '}'; TeX.render(use);
  }
  function inputs() {
    clear(box);
    box.append(field('Entry type', selectEl(['article', 'inproceedings', 'book', 'misc'], f.type, (v) => { f.type = v; inputs(); gen(); })));
    ['author', 'title'].concat(need[f.type], ['year', 'doi']).forEach((x) => box.append(field(x, textInput(f[x], { oninput: (e) => { f[x] = e.target.value; gen(); }, style: { width: x === 'title' ? '320px' : x === 'author' ? '220px' : '120px' } }))));
  }
  inputs(); gen();
  root.append(demoBox('BibTeX entry builder', 'Google Scholar’s “Cite → BibTeX” gives you text like this. Authors are written “Last, First” and joined with “and”. The citation key (first line) is what you pass to \\cite.',
    box, h('div', { class: 'cols gap' }, h('div', null, h('p', { class: 'small muted' }, 'citation.bib'), code), h('div', null, h('p', { class: 'small muted' }, 'In the text'), use, h('p', { class: 'small muted' }, 'In the reference list (IEEE style)'), ref))));
};

/* ================= Topic 3: SRS ================= */
DEMOS['req-sort'] = (root) => scoreGame(root, 'Functional or non-functional?', 'A functional requirement says what the system does; a non-functional one says how well, or under what constraint.', [
  { t: 'The system shall let a customer withdraw cash in multiples of 500 Tk.', a: 'F', w: 'A service the system provides.' },
  { t: 'The ATM shall respond to any key press within 2 seconds.', a: 'N', w: 'Performance: how fast, not what.' },
  { t: 'The system shall lock the card after three wrong PIN attempts.', a: 'F', w: 'A behaviour the system must carry out (it supports security, but it is a function).' },
  { t: 'All data between the ATM and the bank server shall be encrypted with TLS 1.3.', a: 'N', w: 'Security constraint on how data travels.' },
  { t: 'A librarian shall be able to delete the record of a student who has graduated.', a: 'F', w: 'A service for the librarian user class.' },
  { t: 'The system shall be available 99.5% of the time, measured monthly.', a: 'N', w: 'Reliability / availability.' },
  { t: 'The system shall calculate a fine of 10 Tk per day for an overdue book.', a: 'F', w: 'A calculation the system performs.' },
  { t: 'A new user shall be able to borrow a book within 5 minutes of first use, without training.', a: 'N', w: 'Usability, and it is measurable.' },
  { t: 'The software shall run on Windows 10+, macOS 13+ and Ubuntu 22.04.', a: 'N', w: 'Portability / operating environment.' },
  { t: 'The system shall print a mini statement of the last 10 transactions.', a: 'F', w: 'A service.' },
  { t: 'Customer data shall be stored in line with the Bangladesh Bank ICT security guideline.', a: 'N', w: 'External (legislative / regulatory) requirement.' }
], [{ v: 'F', l: 'Functional' }, { v: 'N', l: 'Non-functional' }]);

DEMOS['req-check'] = (root) => {
  const VAGUE = ['fast', 'quick', 'quickly', 'user-friendly', 'user friendly', 'easy', 'easily', 'simple', 'efficient', 'flexible', 'robust', 'high performing', 'high performance', 'adequate', 'appropriate', 'as much as possible', 'as soon as possible', 'several', 'many', 'some', 'minimal', 'maximize', 'minimise', 'minimize', 'state-of-the-art', 'improved', 'better', 'best', 'good', 'nice', 'normal', 'approximately', 'etc', 'and/or', 'tbd', 'very', 'high', 'real time', 'secure', 'reliable', 'seamless', 'intuitive', 'modern', 'every aspect', 'if possible'];
  const inp = h('textarea', { rows: 2, class: 'full', 'aria-label': 'Requirement' }), out = h('div'), fixv = h('div', { class: 'note' });
  function check() {
    const t = inp.value.trim(), low = ' ' + t.toLowerCase() + ' ';
    clear(out);
    if (!t) return;
    const issues = [];
    const found = VAGUE.filter((w) => new RegExp('[^a-z]' + w.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '[^a-z]').test(low));
    if (found.length) issues.push(['Vague words', 'These cannot be tested: ' + found.map((w) => '“' + w + '”').join(', ') + '. Replace each with a number or an observable behaviour.']);
    if (!/\bshall\b|\bmust\b/.test(low)) issues.push(['No “shall”', 'Write each requirement as “The system shall …” so it reads as a binding statement.']);
    if ((low.match(/\band\b/g) || []).length >= 2 || /;/.test(t)) issues.push(['Maybe several requirements', 'A requirement should state one thing. Split sentences that join several abilities with “and”.']);
    if (!/\d/.test(t) && /(time|respond|load|fast|speed|avail|user|perform|reliab|secur|quality)/.test(low)) issues.push(['Not measurable', 'A quality requirement needs a number: a time, a percentage, a count, a size.']);
    if (/24\s*\/\s*30|24\/7\/365/.test(low)) issues.push(['Unclear availability', '“24/30/365” is not a real measure. Write, for example: “available 99.5% of each calendar month, excluding a 2-hour weekly maintenance window”.']);
    if (/\b(he|she|it|they|this|that)\b/.test(low) && t.split(' ').length < 9) issues.push(['Unclear subject', 'Name the actor or the system explicitly.']);
    out.append(issues.length ? h('div', null, h('div', { class: 'verdict bad' }, `${issues.length} problem${issues.length > 1 ? 's' : ''} found`), h('ul', null, issues.map(([a, b]) => h('li', null, h('b', null, a + ': '), b))))
      : h('div', { class: 'verdict ok' }, 'Looks testable: it uses “shall”, one idea and no vague words. Ask: could a tester write a pass/fail test for it?'));
  }
  const ex = [
    ['Adaptability will be very high performing.', 'The system shall allow a new transaction type to be added by changing configuration only, without changing source code.'],
    ['System must maintain an improved quality in every aspects.', 'The system shall pass all acceptance test cases in Appendix B with no severity-1 defects open.'],
    ['This system will work 24/30/365.', 'The ATM service shall be available 99.5% of each calendar month, excluding a 2-hour scheduled weekly maintenance window.'],
    ['The system should be fast and user-friendly.', 'The system shall show the account balance within 2 seconds of the request for 95% of requests.']
  ];
  inp.addEventListener('input', check);
  inp.value = ex[0][0]; check();
  root.append(demoBox('Requirement quality checker', 'Paste or type a requirement. The checker looks for the most common faults: vague words, no “shall”, several requirements in one, and no measurable value. Try the examples taken from real student reports.', inp,
    h('div', { class: 'row tight gap' }, ex.map(([bad, good], i) => h('button', { type: 'button', class: 'btn sm', onclick: () => { inp.value = bad; check(); fixv.innerHTML = '<b>A better version:</b> ' + good; } }, 'Example ' + (i + 1)))),
    out, fixv));
  fixv.innerHTML = '<b>A better version:</b> ' + ex[0][1];
};

/* ================= Topic 4: SDLC ================= */
DEMOS['sdlc-matrix'] = (root) => {
  const models = ['Waterfall', 'V-shaped', 'Iterative', 'Spiral', 'Agile', 'Prototype'];
  const crit = [
    ['Well-known requirements', 5, [1, 1, 0, 0, 0, 0]], ['Technological knowledge', 3, [1, 1, 0, 0, 0, 0]], ['Efficiency', 6, [0, 1, 1, 1, 0, 1]],
    ['Risk analysis', 3, [0, 0, 0, 1, 0, 0]], ['User testing ability', 5, [0, 0, 1, 1, 1, 1]], ['Dependability and security', 5, [0, 1, 0, 1, 0, 0]], ['Time consuming', 3, [1, 1, 0, 1, 0, 0]]
  ].map(([n, p, y]) => ({ n, p, y }));
  const wrap = h('div'), res = h('div');
  function draw() {
    clear(wrap);
    const tot = models.map((_, m) => crit.reduce((a, c) => a + (c.y[m] ? c.p : 0), 0));
    const best = Math.max(...tot), winners = models.filter((_, m) => tot[m] === best);
    wrap.append(h('div', { class: 'scrollx' }, h('table', { class: 'doc edit matrix' },
      h('thead', null, h('tr', null, h('th', null, 'Priority'), h('th', null, 'Criterion'), models.map((m) => h('th', null, m)), h('th'))),
      h('tbody', null, crit.map((c, i) => h('tr', null,
        h('td', null, numInput(c.p, { min: 0, max: 10, style: { width: '64px' }, 'aria-label': 'Priority of ' + c.n, oninput: (e) => { c.p = +e.target.value || 0; draw(); } })),
        h('td', null, textInput(c.n, { 'aria-label': 'Criterion', oninput: (e) => { c.n = e.target.value; } })),
        models.map((m, j) => h('td', null, h('button', { type: 'button', class: 'yn' + (c.y[j] ? ' on' : ''), 'aria-pressed': String(!!c.y[j]), 'aria-label': m + ' supports ' + c.n, onclick: () => { c.y[j] = c.y[j] ? 0 : 1; draw(); } }, c.y[j] ? 'Yes' : 'No'))),
        h('td', null, h('button', { type: 'button', class: 'btn sm', 'aria-label': 'Remove criterion', onclick: () => { crit.splice(i, 1); draw(); } }, '✕'))))),
      h('tfoot', null, h('tr', null, h('td', { class: 'm' }, 'Σ ' + crit.reduce((a, c) => a + c.p, 0)), h('td', null, h('b', null, 'Total score')), tot.map((t) => h('td', { class: 'm' + (t === best ? ' win' : '') }, String(t))), h('td'))))));
    wrap.append(h('div', { class: 'row gap' }, h('button', { type: 'button', class: 'btn', onclick: () => { crit.push({ n: 'New criterion', p: 3, y: [0, 0, 0, 0, 0, 0] }); draw(); } }, '+ Add criterion')));
    clear(res);
    res.append(h('div', { class: 'verdict ' + (winners.length > 1 ? 'bad' : 'ok') }, winners.length > 1
      ? `Tie: ${winners.join(' and ')} both score ${best}. Break the tie with the criterion that matters most, or add a criterion that separates them.`
      : `Best fit: ${winners[0]} with ${best} of ${crit.reduce((a, c) => a + c.p, 0)} points.`));
  }
  draw();
  root.append(demoBox('Weighted SDLC selection matrix', 'Each criterion has a priority (weight). A model earns that weight wherever it says “Yes”. Click Yes/No to toggle and edit the priorities. Pre-filled with the ticks from the lab manual’s Table V.1.', wrap, res));
};

DEMOS['sdlc-advisor'] = (root) => {
  const Q = [
    ['Are the requirements clear and unlikely to change?', { Waterfall: 3, 'V-model': 3, Iterative: 0, Spiral: 0, Agile: -2, Prototyping: -2 }, { Waterfall: -3, 'V-model': -2, Iterative: 2, Spiral: 1, Agile: 3, Prototyping: 3 }],
    ['Is the project large or high-risk (money, safety, new technology)?', { Waterfall: -1, 'V-model': 1, Iterative: 1, Spiral: 3, Agile: 0, Prototyping: 0 }, { Waterfall: 1, 'V-model': 1, Iterative: 0, Spiral: -2, Agile: 1, Prototyping: 1 }],
    ['Will the customer be available for frequent feedback?', { Waterfall: -1, 'V-model': -1, Iterative: 1, Spiral: 1, Agile: 3, Prototyping: 2 }, { Waterfall: 2, 'V-model': 2, Iterative: 0, Spiral: 0, Agile: -3, Prototyping: -2 }],
    ['Do users need to see a working version early?', { Waterfall: -2, 'V-model': -2, Iterative: 2, Spiral: 1, Agile: 2, Prototyping: 3 }, { Waterfall: 1, 'V-model': 1, Iterative: 0, Spiral: 0, Agile: 0, Prototyping: -1 }],
    ['Must every stage be verified and documented (e.g. banking, medical)?', { Waterfall: 1, 'V-model': 3, Iterative: 0, Spiral: 1, Agile: -1, Prototyping: -2 }, { Waterfall: 0, 'V-model': -1, Iterative: 1, Spiral: 0, Agile: 2, Prototyping: 1 }]
  ];
  const ans = Q.map(() => null), out = h('div');
  const WHY = { Waterfall: 'simple, linear, suits fixed requirements', 'V-model': 'pairs each phase with a test phase; strong verification', Iterative: 'delivers the system in growing versions', Spiral: 'repeats a risk-analysis loop; for big risky projects', Agile: 'short sprints with constant customer feedback', Prototyping: 'builds a quick model to discover requirements' };
  function calc() {
    clear(out);
    const s = { Waterfall: 0, 'V-model': 0, Iterative: 0, Spiral: 0, Agile: 0, Prototyping: 0 };
    ans.forEach((a, i) => { if (a == null) return; const t = Q[i][a ? 1 : 2]; for (const k in t) s[k] += t[k]; });
    const rank = Object.keys(s).sort((a, b) => s[b] - s[a]), max = Math.max(1, ...Object.values(s).map(Math.abs));
    out.append(h('div', { class: 'bars2' }, rank.map((k) => h('div', { class: 'b2' }, h('span', { class: 'b2l' }, k), h('span', { class: 'b2t' }, h('i', { style: { width: Math.max(0, s[k]) / max * 100 + '%' } })), h('span', { class: 'b2v' }, String(s[k]))))));
    if (ans.every((a) => a != null)) out.append(h('p', { class: 'verdict ok' }, `Suggested: ${rank[0]} — ${WHY[rank[0]]}. Runner-up: ${rank[1]}. Confirm the choice with a weighted matrix in your report.`));
  }
  root.append(demoBox('Which model fits?', 'Answer five questions about your own project. This is a rule of thumb to start a discussion, not a replacement for the comparison matrix.',
    h('div', { class: 'qs' }, Q.map((q, i) => h('div', { class: 'grow' }, h('div', { class: 'gq' }, `${i + 1}. ${q[0]}`), seg([{ v: 1, l: 'Yes' }, { v: 0, l: 'No' }], null, (v) => { ans[i] = v; calc(); }).el))), out));
  calc();
};

/* ================= Topic 5: DFD ================= */
DEMOS['dfd-rules'] = (root) => {
  const T = [{ v: 'E', l: 'External entity' }, { v: 'P', l: 'Process' }, { v: 'S', l: 'Data store' }];
  let a = 'E', b = 'S';
  const out = h('div'), pic = h('div', { class: 'fig-box' });
  const RULE = {
    EE: [false, 'Two entities cannot exchange data inside your DFD: that exchange is outside the system. Remove the flow, or put a process between them.'],
    EP: [true, 'Legal: an entity sends input to a process (e.g. Customer → 1.0 Verify PIN: card no., PIN).'],
    ES: [false, 'An entity cannot write straight into a data store. Add a process that validates and saves the data.'],
    PE: [true, 'Legal: a process sends output to an entity (e.g. 3.0 Dispense → Customer: cash, receipt).'],
    PP: [true, 'Legal: one process passes data to another (e.g. 1.0 → 2.0: verified account no.).'],
    PS: [true, 'Legal: a process writes to a store (e.g. 2.0 → D2 Transactions: transaction record).'],
    SE: [false, 'An entity cannot read a store directly. A process must fetch the data and send it on.'],
    SP: [true, 'Legal: a process reads from a store (e.g. D1 Accounts → 2.0: balance).'],
    SS: [false, 'Data cannot move from one store to another by itself. Put a process (e.g. “Back up records”) between them.']
  };
  const shape = (t, x) => (t === 'E' ? D.rect(x, 20, 130, 50, 'Entity', { cls: 'dg-fill2', rx: 0 }) : t === 'P' ? D.circle(x + 65, 45, 36, 'Process', { cls: 'dg-fill1' }) : D.store2(x, 28, 130, 34, 'Data store'));
  function draw() {
    const [ok, why] = RULE[a + b];
    clear(pic); pic.append(D.svg(460, 90, 'Flow from ' + a + ' to ' + b, [shape(a, 10), shape(b, 320), D.line([[a === 'P' ? 112 : 140, 45], [b === 'P' ? 348 : 320, 45]], { end: 'arrow', cls: ok ? '' : 'dg-bad', label: ok ? 'data' : '✗', dy: -12 })]));
    clear(out); out.append(h('div', { class: 'verdict ' + (ok ? 'ok' : 'bad') }, why));
  }
  root.append(demoBox('DFD flow checker', 'Pick where a data flow starts and ends. The rule behind every answer: data can only be created, changed or stored by a process.',
    h('div', { class: 'row' }, field('From', seg(T, a, (v) => { a = v; draw(); }).el), field('To', seg(T, b, (v) => { b = v; draw(); }).el)), pic, out));
  draw();
};
DEMOS['dfd-levels'] = (root) => {
  const txt = {
    l0: 'Level 0 (context diagram): the whole system is one process. Only external entities and the flows that cross the boundary are shown. No data stores.',
    l1: 'Level 1: the single process is split into its main sub-processes (1.0, 2.0, 3.0) and the data stores appear. The flows to and from the Customer are exactly those of Level 0 — the diagrams are balanced.',
    l2: 'Level 2: one Level-1 process (here 2.0) is split again into 2.1, 2.2, 2.3. Dashed shapes are outside this diagram; the flows entering and leaving match process 2.0 in Level 1.'
  };
  const t = tabs([{ id: 'l0', label: 'Level 0' }, { id: 'l1', label: 'Level 1' }, { id: 'l2', label: 'Level 2' }], 'l0', (id, body) => {
    body.append(h('p', { class: 'sub' }, txt[id]), h('div', { class: 'fig-box' }, FIGS['dfd-' + id]()));
  });
  root.append(demoBox('ATM system: zooming through the levels', null, t.el));
};

/* ================= Topic 6: use cases ================= */
DEMOS['uc-scenario'] = (root) => {
  const opt = { card: false, bank: false, pin: 0, funds: false };
  const list = h('ol', { class: 'scn' }), note = h('div', { class: 'note' });
  let steps = [], cur = -1;
  function build() {
    const s = [];
    s.push(['m', 'The customer inserts the card.'], ['m', 'The system reads the magnetic strip / chip.']);
    if (opt.card) { s.push(['a', 'Scenario 1: the card cannot be read → the card is returned. End of transaction.']); return s; }
    s.push(['m', 'The system asks the bank’s central computer for the card and account details.']);
    if (opt.bank) { s.push(['a', 'Scenario 2: the bank computer cannot be reached → the card is returned. End of transaction.']); return s; }
    s.push(['m', 'The system asks for the PIN.']);
    for (let i = 0; i < Math.min(opt.pin, 3); i++) s.push(['a', `Scenario 3: PIN attempt ${i + 1} is wrong` + (i < 2 ? ' → the customer may try again.' : ' → three failures: the card is kept and the transaction ends.')]);
    if (opt.pin >= 3) return s;
    s.push(['m', 'The PIN is authenticated («include» Authenticate).'], ['m', 'The customer enters the amount.'], ['m', 'The system checks the balance with the bank’s central computer.']);
    if (opt.funds) { s.push(['a', 'Scenario 4: insufficient funds → the customer may enter a smaller amount (resume) or cancel (card returned).']); s.push(['m', 'The customer enters a smaller amount and the check passes.']); }
    s.push(['m', 'Cash is dispensed and the account is debited.'], ['m', 'The card is returned and a receipt is printed. End of transaction.']);
    return s;
  }
  function paint() {
    clear(list);
    steps.forEach(([k, t], i) => list.append(h('li', { class: (k === 'a' ? 'alt ' : '') + (i === cur ? 'cur' : i < cur ? 'done' : 'todo') }, t)));
    note.textContent = cur < 0 ? 'Press Next step to walk through the scenario.' : cur >= steps.length - 1 ? 'Scenario finished. Change the switches to explore another path.' : `Step ${cur + 1} of ${steps.length}.`;
  }
  const reset = () => { steps = build(); cur = -1; paint(); };
  const sw = (l, k) => tsw(l, false, (v) => { opt[k] = !!v; reset(); }).el;
  root.append(demoBox('Walk through “Withdraw cash”', 'The main (success) scenario, and the alternative scenarios from the use-case description. Turn on a problem and step through to see where the flow branches.',
    h('div', { class: 'row' }, sw('card unreadable', 'card'), sw('bank offline', 'bank'), field('wrong PINs', selectEl([0, 1, 2, 3], 0, (v) => { opt.pin = +v; reset(); })), sw('insufficient funds', 'funds')),
    h('div', { class: 'row gap' }, h('button', { type: 'button', class: 'btn pri', onclick: () => { if (cur < steps.length - 1) cur++; paint(); } }, 'Next step'), h('button', { type: 'button', class: 'btn', onclick: () => { cur = steps.length - 1; paint(); } }, 'Show all'), h('button', { type: 'button', class: 'btn', onclick: reset }, 'Reset')),
    list, note));
  reset();
};
DEMOS['uc-game'] = (root) => scoreGame(root, 'Include, extend or generalization?', 'Decide which relationship fits each sentence.', [
  { t: 'Every withdrawal, balance check and transfer must first authenticate the customer.', a: 'inc', w: 'Common behaviour that always runs → «include» from each base use case to Authenticate.' },
  { t: 'While withdrawing, the customer may choose to print a receipt.', a: 'ext', w: 'Optional behaviour at an extension point → Print receipt «extend» Withdraw cash.' },
  { t: 'A Premium customer can do everything a Customer can, plus request a cheque book.', a: 'gen', w: 'Actor generalization: Premium customer —▷ Customer.' },
  { t: 'If a book is returned late, the system charges a fine.', a: 'ext', w: 'Only under a condition → Pay fine «extend» Return book.' },
  { t: 'Issuing a book always checks that the member’s card is valid.', a: 'inc', w: 'Always → Issue book «include» Validate card.' },
  { t: 'Pay by card and Pay by mobile wallet are both kinds of Pay.', a: 'gen', w: 'Use-case generalization: the specific use cases inherit from Pay.' },
  { t: 'Placing an order can apply a discount code when the customer has one.', a: 'ext', w: 'Conditional, optional → Apply discount «extend» Place order.' }
], [{ v: 'inc', l: '«include»' }, { v: 'ext', l: '«extend»' }, { v: 'gen', l: 'generalization' }]);

/* ================= Topic 7: sequence ================= */
DEMOS['seq-step'] = (root) => {
  const WHY = ['The customer starts the interaction by inserting a card into the ATM object.', 'The ATM answers by asking for the PIN (a message back to the actor).', 'The customer types the PIN.', 'The ATM cannot check the PIN itself; it sends a synchronous request to the bank server and waits.', 'A reply (dashed arrow) returns the result: the PIN is valid.',
    'The customer asks to withdraw an amount.', 'The ATM forwards the request to the bank server.', 'The bank server asks the Account object for its balance.', 'The balance is returned.',
    'alt, first operand [amount ≤ balance]: the account is debited…', '…and the server tells the ATM the withdrawal is approved.', 'A self-message: the ATM runs its own dispenseCash() operation.', 'Cash and receipt go back to the customer.',
    '[else] operand: only one operand of an alt runs. Here the server replies “insufficient funds”…', '…and the ATM shows an error to the customer.', 'Whatever happened, the card is ejected at the end.'];
  const box = h('div', { class: 'fig-box' }), note = h('div', { class: 'note' }), total = WHY.length;
  let s = 1;
  const sl = h('input', { type: 'range', min: 1, max: total, value: 1, 'aria-label': 'Message number', oninput: (e) => { s = +e.target.value; draw(); } });
  function draw() { clear(box); box.append(seqDiagram(SEQ_ATM, s, 'Sequence diagram, message ' + s)); note.innerHTML = '<b>Message ' + s + ':</b> ' + WHY[s - 1]; sl.value = s; }
  root.append(demoBox('Step through the withdrawal', 'Move one message at a time. Time runs downward; the highlighted arrow is the current message.',
    h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn', onclick: () => { s = Math.max(1, s - 1); draw(); } }, '◀ Back'), h('button', { type: 'button', class: 'btn pri', onclick: () => { s = Math.min(total, s + 1); draw(); } }, 'Next ▶'), sl), note, box));
  draw();
};

/* ================= Topic 8: class diagrams ================= */
DEMOS['uml-parse'] = (root) => {
  const inp = textInput('- balance : double = 0.0', { style: { width: '100%' }, 'aria-label': 'UML attribute or operation' });
  const out = h('div');
  const VIS = { '+': ['public', 'any class'], '-': ['private', 'only this class'], '#': ['protected', 'this class and subclasses'], '~': ['package', 'classes in the same package'] };
  const JT = (t) => ({ Integer: 'int', integer: 'int', Boolean: 'boolean', Real: 'double', String: 'String' }[t] || t || 'void');
  function go() {
    clear(out);
    const s = inp.value.trim();
    const m = /^([+\-#~])?\s*(\/)?\s*([A-Za-z_]\w*)\s*(\(([^)]*)\))?\s*(?::\s*([^=\s{]+(?:\[\])?))?\s*(?:=\s*([^{]+?))?\s*(\{[^}]*\})?\s*$/.exec(s);
    if (!m) { out.append(h('div', { class: 'verdict bad' }, 'Not a valid UML line. Attributes: visibility name : type = default. Operations: visibility name(param : type) : returnType.')); return; }
    const [, v, der, name, isOp, params, type, def, prop] = m;
    const parts = [];
    parts.push(['Visibility', v ? `${v} → ${VIS[v][0]} (${VIS[v][1]})` : 'not shown (the modeller left it open)']);
    if (der) parts.push(['Derived', '/ means the value is calculated from other data']);
    parts.push([isOp ? 'Operation' : 'Attribute', name]);
    let java;
    if (isOp) {
      const ps = params.split(',').map((p) => p.trim()).filter(Boolean).map((p) => { const q = /^(in |out |inout )?\s*(\w+)\s*:\s*(\S+)/.exec(p); return q ? [q[2], q[3]] : [p, '?']; });
      parts.push(['Parameters', ps.length ? ps.map(([a, b]) => a + ' of type ' + b).join(', ') : 'none']);
      parts.push(['Returns', type || 'nothing (void)']);
      java = `${v ? VIS[v][0] === 'package' ? '' : VIS[v][0] + ' ' : ''}${JT(type)} ${name}(${ps.map(([a, b]) => JT(b) + ' ' + a).join(', ')}) { … }`;
    } else {
      parts.push(['Type', type || 'not given']);
      if (def) parts.push(['Initial value', def]);
      java = `${v ? VIS[v][0] === 'package' ? '' : VIS[v][0] + ' ' : ''}${JT(type)} ${name}${def ? ' = ' + def : ''};`;
    }
    if (prop) parts.push(['Property', prop + (/readOnly/i.test(prop) ? ' → cannot change after creation (final in Java)' : '')]);
    out.append(tableEl(['Part', 'Meaning'], parts, 'doc'), h('p', { class: 'small muted gap' }, 'In Java:'), h('pre', { class: 'out' }, java));
  }
  inp.addEventListener('input', go); go();
  root.append(demoBox('UML attribute and operation decoder', 'Type one line from a class box and see what each part means.', inp,
    h('div', { class: 'row tight gap' }, ['- balance : double = 0.0', '+ withdraw(amount : double) : boolean', '# owner : Customer', '+ getBalance() : double', '- accountNo : String {readOnly}', '/ age : int', '~ log(msg : String)'].map((x) => h('button', { type: 'button', class: 'btn sm mono', onclick: () => { inp.value = x; go(); } }, x))), h('div', { class: 'gap' }, out)));
};
DEMOS['multiplicity'] = (root) => {
  const st = { a: 'Customer', b: 'Account', ma: '1', mb: '1..*', verb: 'owns', kind: 'assoc' };
  const pic = h('div', { class: 'fig-box' }), out = h('div', { class: 'out' });
  const M = ['1', '0..1', '*', '0..*', '1..*', '2..4'];
  const say = (m) => ({ '1': 'exactly one', '0..1': 'at most one', '*': 'any number of', '0..*': 'zero or more', '1..*': 'one or more', '2..4': 'two to four' }[m] || m);
  function draw() {
    const o = { assoc: {}, agg: { start: 'odia' }, comp: { start: 'dia' } }[st.kind];
    clear(pic); pic.append(D.svg(520, 110, 'Association', [D.rect(10, 34, 130, 40, st.a, { cls: 'dg-fill1', rx: 2 }), D.rect(380, 34, 130, 40, st.b, { cls: 'dg-fill1', rx: 2 }),
      D.line([[140, 54], [380, 54]], Object.assign({ label: st.verb + ' ▸', dy: -14 }, o)), D.T(150, 72, st.ma, 'dg-m', 'start'), D.T(370, 72, st.mb, 'dg-m', 'end')]));
    out.innerHTML = `Each <b>${st.a}</b> ${st.verb} <b>${say(st.mb)}</b> ${st.b}${st.mb === '1' || st.mb === '0..1' ? '' : '(s)'}.<br>Each <b>${st.b}</b> belongs to <b>${say(st.ma)}</b> ${st.a}${st.ma === '1' || st.ma === '0..1' ? '' : '(s)'}.` +
      (st.kind === 'comp' && st.ma !== '1' && st.ma !== '0..1' ? '<br><span class="bad">Composition: a part can belong to only one whole, so the whole’s end should be 1 or 0..1.</span>' : '');
  }
  const t = (k) => textInput(st[k], { style: { width: '130px' }, oninput: (e) => { st[k] = e.target.value; draw(); } });
  root.append(demoBox('Reading multiplicity', 'Read each end from the far side: the number next to Account says how many Accounts one Customer has.',
    h('div', { class: 'row' }, field('Class A', t('a')), field('mult. at A', selectEl(M, st.ma, (v) => { st.ma = v; draw(); })), field('verb', t('verb')), field('mult. at B', selectEl(M, st.mb, (v) => { st.mb = v; draw(); })), field('Class B', t('b')),
      field('kind', seg([{ v: 'assoc', l: 'association' }, { v: 'agg', l: 'aggregation' }, { v: 'comp', l: 'composition' }], st.kind, (v) => { st.kind = v; draw(); }).el)), pic, out));
  draw();
};
DEMOS['rel-game'] = (root) => scoreGame(root, 'Name the relationship', 'Choose the UML relationship between the two classes.', [
  { t: 'SavingsAccount and Account', a: 'gen', w: 'A savings account is an account → generalization (inheritance).' },
  { t: 'House and Room (rooms cannot exist without the house)', a: 'comp', w: 'Strong ownership, shared lifetime → composition (filled diamond at House).' },
  { t: 'Department and Teacher (a teacher still exists if the department closes)', a: 'agg', w: 'Whole–part, independent lifetime → aggregation (hollow diamond at Department).' },
  { t: 'ReportPrinter.print(Invoice inv) uses an Invoice only as a parameter', a: 'dep', w: 'Temporary use → dependency (dashed arrow).' },
  { t: 'DebitCard and the interface Payable', a: 'real', w: 'The class implements the interface → realization (dashed line, hollow triangle).' },
  { t: 'Customer and Account (a customer owns accounts; each account has an owner)', a: 'assoc', w: 'A structural link between independent classes → association.' },
  { t: 'Order and OrderLine (lines are created and deleted with the order)', a: 'comp', w: 'Parts live and die with the whole → composition.' },
  { t: 'Librarian and Member are both kinds of Person', a: 'gen', w: 'is-a → generalization.' }
], [{ v: 'dep', l: 'dependency' }, { v: 'assoc', l: 'association' }, { v: 'agg', l: 'aggregation' }, { v: 'comp', l: 'composition' }, { v: 'gen', l: 'generalization' }, { v: 'real', l: 'realization' }]);

DEMOS['atm-explore'] = (root) => {
  const S = {
    'Bank|ATM': 'One Bank maintains one or more ATMs; each ATM is maintained by exactly one Bank.',
    'Bank|DebitCard': 'One Bank manages many debit cards; each card is managed by one Bank.',
    'Bank|Customer': 'A Bank has one or more Customers.',
    'Customer|DebitCard': 'A Customer owns zero or more debit cards; each card has one owner.',
    'DebitCard|Account': 'A debit card gives access to one or more Accounts.',
    'Customer|Account': 'A Customer owns one or more Accounts (joint accounts allow several owners).',
    'ATM|ATMTransaction': 'An ATM identifies (records) many transactions; each happens at one ATM.',
    'ATMTransaction|Account': 'Each transaction modifies exactly one Account (directed: the account does not keep a link back).',
    'SavingAccount|Account': 'Generalization: a SavingAccount is an Account and inherits type, owner and checkBalance().',
    'CheckingAccount|Account': 'Generalization: a CheckingAccount is an Account.',
    'Withdrawal|ATMTransaction': 'Generalization: a Withdrawal is an ATMTransaction.',
    'Transfer|ATMTransaction': 'Generalization: a Transfer is an ATMTransaction.'
  };
  const box = h('div', { class: 'fig-box atm-x' }), info = h('div', { class: 'note' }, 'Click a class in the diagram.');
  const svgEl = FIGS['atm-class'](); box.append(svgEl);
  svgEl.querySelectorAll('.dg-class').forEach((g) => {
    g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', 'Show relationships of ' + g.getAttribute('data-name'));
    const act = () => {
      const n = g.getAttribute('data-name');
      svgEl.querySelectorAll('.dg-class').forEach((x) => x.classList.toggle('sel', x === g));
      const rel = [];
      svgEl.querySelectorAll('.cx-e').forEach((e) => { const on = e.dataset.a === n || e.dataset.b === n; e.classList.toggle('on', on); e.classList.toggle('off', !on); if (on) rel.push(S[e.dataset.a + '|' + e.dataset.b]); });
      clear(info); info.append(h('b', null, n + ': '), h('ul', null, rel.map((r) => h('li', null, r))));
    };
    g.addEventListener('click', act); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  });
  root.append(demoBox('Explore the ATM class diagram', 'Select any class to highlight its relationships and read them as sentences.', info, box));
};

/* ================= Topic 9: UI/UX ================= */
DEMOS['contrast'] = (root) => {
  let fg = '#1F2937', bg = '#FFFFFF';
  const out = h('div'), sample = h('div', { class: 'cc-sample' });
  const lum = (hex) => { const n = hex.replace('#', ''); const c = [0, 2, 4].map((i) => parseInt(n.length === 3 ? n[i / 2] + n[i / 2] : n.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  function calc() {
    const a = lum(fg), b = lum(bg), r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    sample.style.color = fg; sample.style.background = bg;
    const pf = (x) => (x ? '<b class="ok">pass</b>' : '<b class="bad">fail</b>');
    out.innerHTML = `<div class="eqbig">${r.toFixed(2)} : 1</div><table class="doc"><tr><th>Check</th><th>Needs</th><th>Result</th></tr>
      <tr><td>Normal text, AA</td><td>4.5 : 1</td><td>${pf(r >= 4.5)}</td></tr><tr><td>Large text (≥ 24px, or 18.5px bold), AA</td><td>3 : 1</td><td>${pf(r >= 3)}</td></tr>
      <tr><td>Normal text, AAA</td><td>7 : 1</td><td>${pf(r >= 7)}</td></tr><tr><td>Buttons, icons, input borders (non-text)</td><td>3 : 1</td><td>${pf(r >= 3)}</td></tr></table>`;
  }
  const ci = (get, set, l) => { const c = h('input', { type: 'color', value: get(), 'aria-label': l }); const t = textInput(get(), { style: { width: '100px' }, 'aria-label': l + ' hex' }); c.addEventListener('input', () => { set(c.value); t.value = c.value; calc(); }); t.addEventListener('input', () => { if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t.value)) { set(t.value); c.value = t.value.length === 4 ? '#' + t.value.slice(1).split('').map((x) => x + x).join('') : t.value; calc(); } }); return field(l, h('span', { class: 'row tight' }, c, t)); };
  const pre = [['#1F2937', '#FFFFFF', 'dark on white'], ['#9CA3AF', '#FFFFFF', 'light grey on white'], ['#FFFFFF', '#17694A', 'white on green'], ['#FFD400', '#FFFFFF', 'yellow on white'], ['#E5E7EB', '#1F2937', 'light on dark']];
  sample.innerHTML = '<div style="font-size:24px;font-weight:700">Withdraw cash</div><div>Enter the amount in multiples of 500 Tk.</div>';
  const inputs = h('div', { class: 'row' });
  function mountInputs() { clear(inputs); inputs.append(ci(() => fg, (v) => { fg = v; }, 'Text colour'), ci(() => bg, (v) => { bg = v; }, 'Background colour')); }
  mountInputs(); calc();
  root.append(demoBox('Colour contrast checker (WCAG 2.2)', 'Low contrast is the most common accessibility failure. Pick a text and background colour and check them against the WCAG thresholds.',
    inputs, h('div', { class: 'row tight gap' }, pre.map(([f, b, l]) => h('button', { type: 'button', class: 'btn sm', onclick: () => { fg = f; bg = b; mountInputs(); calc(); } }, l))), h('div', { class: 'cols gap' }, sample, out)));
};
DEMOS['heuristics'] = (root) => scoreGame(root, 'Which heuristic is broken?', 'Each problem was found on a real ATM or library screen. Pick the one of Nielsen’s ten heuristics it violates most.', [
  { t: 'After pressing Withdraw, the screen stays the same for 8 seconds with no message or spinner.', a: 1, w: '#1 Visibility of system status: always show that something is happening.' },
  { t: 'The menu says “Initiate debit transaction” instead of “Withdraw cash”.', a: 2, w: '#2 Match between system and the real world: use the user’s words.' },
  { t: 'There is no Cancel button once you start a transfer.', a: 3, w: '#3 User control and freedom: provide a clearly marked exit.' },
  { t: 'One screen calls it “Account balance”, the next calls it “Available funds”, and the OK button moves position.', a: 4, w: '#4 Consistency and standards.' },
  { t: 'The amount field accepts “12,5O0” (letter O) and only fails at the bank.', a: 5, w: '#5 Error prevention: stop the error before it happens (digits-only keypad).' },
  { t: 'Users must remember a 12-digit account number from the previous screen to type it again.', a: 6, w: '#6 Recognition rather than recall: show it, don’t make them remember.' },
  { t: 'An error says only “ERR 0x1F”.', a: 9, w: '#9 Help users recognize, diagnose and recover from errors: plain language plus a way forward.' },
  { t: 'The home screen shows 20 buttons, adverts and a news ticker at once.', a: 8, w: '#8 Aesthetic and minimalist design: every extra element competes with the important ones.' },
  { t: 'Frequent users must go through four screens to withdraw their usual 2,000 Tk.', a: 7, w: '#7 Flexibility and efficiency of use: add a shortcut such as “Fast cash 2,000”.' }
], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ v: n, l: '#' + n })));

DEMOS['fidelity'] = (root) => {
  const t = tabs([{ id: 'lo', label: 'Low-fidelity wireframe' }, { id: 'mid', label: 'Mid-fidelity' }, { id: 'hi', label: 'High-fidelity mockup' }], 'lo', (id, body) => {
    const scr = h('div', { class: 'phone ' + id });
    const btn = (l, k) => h('button', { type: 'button', class: 'pbtn' + (k ? ' ' + k : '') }, id === 'lo' ? '' : l);
    scr.append(h('div', { class: 'p-top' }, id === 'lo' ? h('span', { class: 'ph' }) : h('span', null, 'GUB Bank ATM')),
      h('div', { class: 'p-title' }, id === 'lo' ? h('span', { class: 'ph w60' }) : 'Choose a transaction'),
      h('div', { class: 'p-sub' }, id === 'lo' ? h('span', { class: 'ph w80 thin' }) : 'Card ending 4821 · Available 12,500 Tk'),
      h('div', { class: 'p-grid' }, btn('Withdraw cash', 'main'), btn('Fast cash 2,000'), btn('Check balance'), btn('Transfer'), btn('Mini statement'), btn('Change PIN')),
      h('div', { class: 'p-foot' }, btn('Cancel', 'ghost')));
    const notes = { lo: 'Boxes and lines only. It answers: what is on the screen and where? Fast to change — sketch several before choosing one.', mid: 'Real labels, grey tones, true spacing. Good for checking content, wording and flow with the team and users.', hi: 'Final colours, type, icons and states. Used for a clickable Figma prototype and as the hand-off to developers.' };
    body.append(h('div', { class: 'cols' }, scr, h('div', null, h('p', null, notes[id]), h('ul', { class: 'small' }, (id === 'lo' ? ['Layout and hierarchy', 'No colour or real text', 'Minutes to make'] : id === 'mid' ? ['Real copy (text)', 'Grid and spacing', 'Greyscale on purpose'] : ['Brand colours, icons', 'Accessible contrast', 'Hover/pressed/error states']).map((x) => h('li', null, x))))));
  });
  root.append(demoBox('One screen, three fidelities', 'The ATM home screen at each stage of design.', t.el));
};
