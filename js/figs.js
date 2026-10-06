/* ===================== figs.js : the course figures (drawn with diagram.js) ===================== */
const FIGS = {};
const L = D.line, R = D.rect, C = D.circle, TX = D.T;

/* ---------- Topic 1: planning ---------- */
FIGS['atm-states'] = () => {
  const bx = 230, bw = 200, bh = 36, k = [];
  [['Reading card', 40], ['Reading PIN', 120], ['Choosing transaction', 200], ['Performing transaction', 280], ['Ejecting card', 380]]
    .forEach(([l, y]) => k.push(R(bx, y - bh / 2, bw, bh, l, { rx: 14, cls: 'dg-fill1' })));
  k.push(D.startDot(80, 40), L([[89, 40], [bx, 40]], { end: 'arrow' }));
  k.push(L([[330, 58], [330, 102]], { end: 'arrow', label: 'card read', at: .5, dx: 8, anchor: 'start' }));
  k.push(L([[330, 138], [330, 182]], { end: 'arrow', label: 'PIN accepted', dx: 8, anchor: 'start' }));
  k.push(L([[330, 218], [330, 262]], { end: 'arrow', label: 'transaction chosen', dx: 8, anchor: 'start' }));
  k.push(L([[330, 298], [330, 362]], { end: 'arrow', label: 'customer finished', dx: 8, anchor: 'start' }));
  k.push(L([[430, 40], [610, 40], [610, 372], [430, 372]], { end: 'arrow', label: 'card not readable', at: .13 }));
  k.push(L([[430, 120], [570, 120], [570, 380], [430, 380]], { end: 'arrow', label: 'cancel', at: .13 }));
  k.push(L([[430, 200], [530, 200], [530, 388], [430, 388]], { end: 'arrow', label: 'cancel', at: .12 }));
  k.push(L([[230, 272], [200, 272], [200, 208], [230, 208]], { end: 'arrow' }), TX(192, 240, 'another\ntransaction', 'dg-s', 'end'));
  k.push(L([[230, 288], [100, 288], [100, 368]], { end: 'arrow' }), TX(108, 328, '3 wrong PINs:\ncard retained', 'dg-s', 'start'));
  k.push(L([[230, 380], [113, 380]], { end: 'arrow' }), D.endDot(100, 380));
  return D.svg(640, 410, 'State diagram of an ATM session', k);
};

FIGS['team-roles'] = () => {
  const k = [R(250, 14, 180, 46, 'Project manager\n(team leader)', { cls: 'dg-fill2' })];
  const roles = [['Analyst', 'requirements, SRS'], ['Designer', 'DFD, UML, UI'], ['Developer', 'code, database'], ['Tester / QA', 'test cases'], ['Documenter', 'LaTeX report']];
  roles.forEach(([r, d], i) => {
    const x = 10 + i * 134;
    k.push(L([[340, 60], [340, 84], [x + 60, 84], [x + 60, 104]], { end: 'arrow', cls: 'dg-thin' }));
    k.push(R(x, 104, 120, 60, r + '\n' + d, { cls: 'dg-fill1', tcls: 'dg-t2' }));
  });
  return D.svg(680, 176, 'A typical student project team: one leader and five roles', k);
};

/* ---------- Topic 2: LaTeX ---------- */
FIGS['latex-flow'] = () => {
  const k = [
    R(10, 20, 150, 40, 'report.tex', { cls: 'dg-fill1', tcls: 'dg-m' }), R(10, 80, 150, 40, 'refs.bib', { cls: 'dg-fill1', tcls: 'dg-m' }), R(10, 140, 150, 40, 'figures/*.png', { cls: 'dg-fill1', tcls: 'dg-m' }),
    R(250, 50, 170, 100, 'pdfLaTeX\n+ biber\n(run 2–3 times)', { cls: 'dg-fill2' }),
    R(510, 70, 130, 60, 'report.pdf', { cls: 'dg-fill1', tcls: 'dg-m' }),
    L([[160, 40], [250, 80]], { end: 'arrow' }), L([[160, 100], [250, 100]], { end: 'arrow' }), L([[160, 160], [250, 120]], { end: 'arrow' }),
    L([[420, 100], [510, 100]], { end: 'arrow', label: 'compile', dy: -12 }),
    TX(335, 192, '.aux  .log  .bbl  (helper files: labels, errors, bibliography)', 'dg-s')
  ];
  return D.svg(660, 205, 'LaTeX build: source files are compiled into a PDF', k);
};

/* ---------- Topic 3: SRS ---------- */
FIGS['nfr-tree'] = () => {
  const k = [], box = (x, y, w, t, c) => R(x, y, w, 40, t, { cls: c || 'dg-fill3', tcls: 'dg-t2' });
  k.push(box(290, 8, 160, 'Non-functional\nrequirements', 'dg-fill2'));
  const mids = [[70, 'Product'], [300, 'Process /\norganisational'], [560, 'External']];
  mids.forEach(([x, t]) => { k.push(L([[370, 48], [370, 62], [x + 70, 62], [x + 70, 76]], { cls: 'dg-thin' })); k.push(box(x, 76, 140, t, 'dg-fill1')); });
  const leaves = [
    [0, ['Usability', 'Efficiency', 'Reliability', 'Portability']],
    [1, ['Delivery', 'Implementation', 'Standards']],
    [2, ['Interoperability', 'Ethical', 'Legislative']]
  ];
  leaves.forEach(([mi, arr]) => {
    const mx = mids[mi][0];
    arr.forEach((t, i) => {
      const y = 140 + i * 50, x = mx + 22;
      k.push(L([[mx + 10, 116], [mx + 10, y + 20], [x, y + 20]], { cls: 'dg-thin' }));
      k.push(box(x, y, 120, t));
    });
  });
  k.push(L([[222, 180], [240, 180], [240, 322]], { cls: 'dg-thin' }), R(160, 322, 90, 34, 'Performance', { cls: 'dg-fill3', tcls: 'dg-s' }), R(258, 322, 70, 34, 'Space', { cls: 'dg-fill3', tcls: 'dg-s' }));
  k.push(L([[240, 322], [240, 312], [293, 312], [293, 322]], { cls: 'dg-thin' }), L([[205, 312], [205, 322]], { cls: 'dg-thin' }), L([[205, 312], [240, 312]], { cls: 'dg-thin' }));
  k.push(L([[702, 280], [716, 280], [716, 322]], { cls: 'dg-thin' }), R(610, 322, 80, 34, 'Privacy', { cls: 'dg-fill3', tcls: 'dg-s' }), R(696, 322, 70, 34, 'Safety', { cls: 'dg-fill3', tcls: 'dg-s' }));
  k.push(L([[650, 312], [731, 312]], { cls: 'dg-thin' }), L([[650, 312], [650, 322]], { cls: 'dg-thin' }), L([[731, 312], [731, 322]], { cls: 'dg-thin' }));
  return D.svg(780, 366, 'Types of non-functional requirement (after Sommerville)', k);
};

FIGS['req-levels'] = () => {
  const k = [
    R(10, 30, 200, 90, 'User requirement\n“The customer can\nwithdraw cash.”', { cls: 'dg-fill2' }),
    R(270, 10, 250, 130, 'System requirements\nR1 The system shall accept\nwithdrawals in multiples of 500 Tk.\nR2 The system shall reject a\nwithdrawal above the balance.', { cls: 'dg-fill1', tcls: 'dg-s' }),
    R(580, 30, 170, 90, 'Design\n& code', { cls: 'dg-fill3' }),
    L([[210, 75], [270, 75]], { end: 'arrow', label: 'refine', dy: -12 }), L([[520, 75], [580, 75]], { end: 'arrow', label: 'build', dy: -12 }),
    TX(110, 140, 'customers, managers', 'dg-s'), TX(395, 158, 'developers, testers', 'dg-s'), TX(665, 140, 'programmers', 'dg-s')
  ];
  return D.svg(760, 170, 'User requirements are refined into precise system requirements', k);
};

/* ---------- Topic 4: SDLC ---------- */
FIGS['sdlc-cycle'] = () => {
  const st = ['Planning &\nrequirement\nanalysis', 'Defining\nrequirements\n(SRS)', 'Designing\narchitecture\n(DDS)', 'Building /\ndeveloping', 'Testing', 'Deployment &\nmaintenance'];
  const k = [];
  st.forEach((t, i) => { const x = 10 + i * 130; k.push(R(x, 20, 114, 66, t, { cls: i % 2 ? 'dg-fill3' : 'dg-fill1', tcls: 'dg-t2' })); k.push(TX(x + 57, 10, 'Stage ' + (i + 1), 'dg-s')); if (i) k.push(L([[x - 16, 53], [x, 53]], { end: 'arrow' })); });
  k.push(L([[717, 86], [717, 116], [67, 116], [67, 86]], { end: 'arrow', dash: true, label: 'feedback and the next release start the cycle again', at: .5 }));
  return D.svg(784, 132, 'The six stages of the SDLC', k);
};
FIGS['waterfall'] = () => {
  const st = ['Requirements', 'System design', 'Implementation', 'Testing', 'Deployment &\nmaintenance'], k = [];
  st.forEach((t, i) => {
    const x = 20 + i * 112, y = 16 + i * 60;
    k.push(R(x, y, 160, 42, t, { cls: 'dg-fill1' }));
    if (i < 4) k.push(L([[x + 160, y + 21], [x + 192, y + 21], [x + 192, y + 60]], { end: 'arrow' }));
  });
  k.push(TX(150, 290, 'Each phase is signed off before the next begins.', 'dg-s'));
  return D.svg(640, 305, 'The waterfall model', k);
};
FIGS['iterative'] = () => {
  const k = [R(16, 140, 130, 46, 'Requirements', { cls: 'dg-fill2' }), L([[146, 163], [172, 163]]), L([[172, 50], [172, 276]])];
  [50, 163, 276].forEach((y, i) => {
    k.push(L([[172, y], [200, y]], { end: 'arrow' }));
    k.push(TX(270, y - 32, 'Build ' + (i + 1), 'dg-s dg-b'));
    k.push(R(200, y - 22, 150, 44, 'Design &\ndevelop', { cls: 'dg-fill1', tcls: 'dg-t2' }), L([[350, y], [376, y]], { end: 'arrow' }));
    k.push(R(376, y - 22, 110, 44, 'Test', { cls: 'dg-fill3' }), L([[486, y], [512, y]], { end: 'arrow' }));
    k.push(R(512, y - 22, 140, 44, 'Deliver\nincrement', { cls: 'dg-fill1', tcls: 'dg-t2' }));
    k.push(TX(664, y, ['v1: core', 'v2: + more', 'v3: full system'][i], 'dg-s', 'start'));
  });
  return D.svg(770, 305, 'The iterative (incremental) model', k);
};
FIGS['vmodel'] = () => {
  const k = [], b = (x, y, t, c) => k.push(R(x, y, 170, 40, t, { cls: c, tcls: 'dg-t2' }));
  b(30, 20, 'Requirements', 'dg-fill1'); b(70, 95, 'System design', 'dg-fill1'); b(110, 170, 'Architecture design', 'dg-fill1'); b(150, 245, 'Module design', 'dg-fill1');
  b(275, 318, 'Coding', 'dg-fill2');
  b(400, 245, 'Unit testing', 'dg-fill3'); b(440, 170, 'Integration testing', 'dg-fill3'); b(480, 95, 'System testing', 'dg-fill3'); b(520, 20, 'Acceptance testing', 'dg-fill3');
  [[[115, 60], [155, 95]], [[155, 135], [195, 170]], [[195, 210], [235, 245]], [[235, 285], [300, 318]]].forEach((p) => k.push(L(p, { end: 'arrow' })));
  [[[420, 318], [485, 285]], [[485, 245], [525, 210]], [[525, 170], [565, 135]], [[565, 95], [605, 60]]].forEach((p) => k.push(L(p, { end: 'arrow' })));
  [[40, 'acceptance test plan'], [115, 'system test plan'], [190, 'integration tests'], [265, 'unit tests']].forEach(([y, t], i) => {
    const x1 = 200 + i * 40, x2 = 520 - i * 40;
    k.push(L([[x1, y], [x2, y]], { end: 'open', dash: true, label: t, cls: 'dg-thin' }));
  });
  k.push(TX(70, 355, 'Verification ↓', 'dg-s dg-b'), TX(640, 355, 'Validation ↑', 'dg-s dg-b'));
  return D.svg(710, 372, 'The V-model: each design phase is paired with a test phase', k);
};
FIGS['spiral'] = () => {
  const cx = 300, cy = 265, k = [];
  k.push(L([[cx, 36], [cx, 500]], { cls: 'dg-thin' }), L([[36, cy], [566, cy]], { cls: 'dg-thin' }));
  const pts = [];
  for (let t = 0; t <= 7 * Math.PI; t += 0.08) { const a = -Math.PI + t, r = 14 + t * 9.6; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  k.push(L(pts, { end: 'arrow', cls: 'dg-hlpath' }));
  for (let i = 1; i <= 3; i++) { const t = 3 * Math.PI / 4 + 2 * Math.PI * i, a = -Math.PI + t, r = 14 + t * 9.6, p = [cx + r * Math.cos(a), cy + r * Math.sin(a)]; k.push(sv('circle', { cx: p[0], cy: p[1], r: 5, class: 'dg-solid' }), TX(p[0] + 8, p[1] - 10, i < 3 ? 'prototype ' + i : 'operational prototype', 'dg-s', 'start')); }
  k.push(TX(60, 40, '1. Determine objectives,\nalternatives, constraints', 'dg-t2', 'start'));
  k.push(TX(560, 40, '2. Identify and\nresolve risks', 'dg-t2', 'end'));
  k.push(TX(560, 492, '3. Develop and test\nthe next version', 'dg-t2', 'end'));
  k.push(TX(60, 492, '4. Plan the\nnext iteration', 'dg-t2', 'start'));
  k.push(TX(cx + 8, 26, 'cumulative cost ↑', 'dg-s', 'start'), TX(40, cy - 12, '← review', 'dg-s', 'start'));
  return D.svg(600, 520, 'The spiral model: every loop passes through four quadrants', k);
};
FIGS['agile'] = () => {
  const cx = 300, cy = 200, Rr = 150, names = ['Plan', 'Design', 'Develop', 'Test', 'Deploy', 'Review'], k = [];
  names.forEach((n, i) => {
    const a = -90 + i * 60, a2 = a + 60;
    k.push(L(D.arcPts(cx, cy, Rr, a + 17, a2 - 17, 10), { end: 'arrow' }));
    const p = [cx + Rr * Math.cos(a * Math.PI / 180), cy + Rr * Math.sin(a * Math.PI / 180)];
    k.push(R(p[0] - 52, p[1] - 19, 104, 38, n, { cls: i % 2 ? 'dg-fill3' : 'dg-fill1', rx: 19 }));
  });
  k.push(TX(cx, cy - 10, 'One sprint', 'dg-t'), TX(cx, cy + 14, '(1–4 weeks)', 'dg-s'));
  k.push(R(520, 176, 110, 48, 'working\nincrement', { cls: 'dg-fill2', tcls: 'dg-t2' }), L([[480, 200], [520, 200]], { end: 'arrow', dash: true }));
  return D.svg(640, 400, 'The agile model: short repeated sprints', k);
};
FIGS['prototype'] = () => {
  const k = [
    R(240, 20, 170, 44, 'Requirement\ngathering', { cls: 'dg-fill1', tcls: 'dg-t2' }), R(450, 110, 150, 44, 'Quick design', { cls: 'dg-fill1' }),
    R(450, 230, 150, 44, 'Build prototype', { cls: 'dg-fill1' }), R(250, 300, 150, 44, 'User evaluation', { cls: 'dg-fill2' }),
    R(50, 230, 150, 44, 'Refine prototype', { cls: 'dg-fill1' }), R(50, 110, 150, 44, 'Engineer product', { cls: 'dg-fill3' }),
    L([[325, 0], [325, 20]], { end: 'arrow' }), TX(335, 8, 'start', 'dg-s', 'start'),
    L([[410, 42], [525, 42], [525, 110]], { end: 'arrow' }), L([[525, 154], [525, 230]], { end: 'arrow' }),
    L([[525, 274], [525, 322], [400, 322]], { end: 'arrow' }), L([[250, 322], [125, 322], [125, 274]], { end: 'arrow' }),
    L([[200, 240], [450, 146]], { end: 'arrow', label: 'not good enough yet', at: .45 }),
    L([[125, 230], [125, 154]], { end: 'arrow', label: 'approved', dx: 8, anchor: 'start' }),
    L([[125, 110], [125, 76]], { end: 'arrow' }), TX(135, 70, 'stop', 'dg-s', 'start')
  ];
  return D.svg(640, 356, 'The prototyping model', k);
};

/* ---------- Topic 5: DFD ---------- */
FIGS['dfd-notation'] = () => {
  const k = [TX(200, 18, 'Gane & Sarson', 'dg-t'), TX(420, 18, 'Yourdon & DeMarco', 'dg-t'), L([[310, 8], [310, 330]], { cls: 'dg-thin' })];
  [['Process', 70], ['Data store', 150], ['External\nentity', 226], ['Data flow', 300]].forEach(([t, y]) => k.push(TX(16, y, t, 'dg-t', 'start')));
  k.push(sv('rect', { x: 140, y: 38, width: 120, height: 64, rx: 10, class: 'dg-box dg-fill1' }), L([[140, 58], [260, 58]]), TX(200, 48, '1.0', 'dg-s'), TX(200, 80, 'Process', 'dg-t'));
  k.push(C(420, 70, 34, '1.0\nProcess', { cls: 'dg-fill1' }));
  k.push(D.store(140, 134, 130, 34, 'D1', 'Store'), D.store2(360, 134, 120, 34, 'Data store'));
  k.push(R(150, 204, 100, 44, 'Entity', { cls: 'dg-fill2', rx: 0 }), R(370, 204, 100, 44, 'Entity', { cls: 'dg-fill2', rx: 0 }));
  k.push(L([[140, 300], [260, 300]], { end: 'arrow', label: 'data name', dy: -12 }), L([[360, 300], [480, 300]], { end: 'arrow', label: 'data name', dy: -12 }));
  return D.svg(510, 330, 'DFD symbols in the two common notations', k);
};
FIGS['dfd-l0'] = () => {
  const k = [
    R(30, 110, 140, 56, 'Customer', { cls: 'dg-fill2', rx: 0 }),
    C(430, 138, 70, '0\nATM system', { cls: 'dg-fill1' }),
    L([[100, 110], [100, 50], [430, 50], [430, 68]], { end: 'arrow', label: 'transaction request (type, amount)', at: .45 }),
    L([[170, 138], [360, 138]], { end: 'arrow', label: 'card number, PIN' }),
    L([[430, 208], [430, 236], [100, 236], [100, 166]], { end: 'arrow', label: 'cash, receipt', at: .5 })
  ];
  return D.svg(530, 256, 'Level 0 DFD (context diagram) of the ATM system', k);
};
FIGS['dfd-l1'] = () => {
  const k = [
    R(20, 196, 130, 60, 'Customer', { cls: 'dg-fill2', rx: 0 }),
    C(330, 80, 48, '1.0\nVerify\ncard & PIN', { cls: 'dg-fill1', tcls: 'dg-t2' }),
    C(330, 240, 48, '2.0\nProcess\ntransaction', { cls: 'dg-fill1', tcls: 'dg-t2' }),
    C(330, 396, 48, '3.0\nDispense cash\n& receipt', { cls: 'dg-fill1', tcls: 'dg-t2' }),
    D.store(540, 60, 190, 40, 'D1', 'Customer accounts'), D.store(540, 220, 190, 40, 'D2', 'Transactions'),
    L([[110, 196], [110, 80], [282, 80]], { end: 'arrow', label: 'card no., PIN', at: .7 }),
    L([[540, 80], [378, 80]], { end: 'arrow', label: 'stored PIN' }),
    L([[330, 128], [330, 192]], { end: 'arrow', label: 'verified account no.', dx: 10, anchor: 'start' }),
    L([[150, 240], [282, 240]], { end: 'arrow', label: 'request, amount' }),
    L([[560, 100], [354, 198]], { end: 'arrow', label: 'balance', at: .35 }),
    L([[375, 224], [660, 100]], { end: 'arrow', label: 'new balance', at: .65 }),
    L([[378, 240], [540, 240]], { end: 'arrow', label: 'transaction record' }),
    L([[330, 288], [330, 348]], { end: 'arrow', label: 'approved amount', dx: 10, anchor: 'start' }),
    L([[282, 396], [85, 396], [85, 256]], { end: 'arrow', label: 'cash, receipt', at: .3 }),
    L([[620, 260], [620, 396], [378, 396]], { end: 'arrow', label: 'transaction details', at: .62 })
  ];
  return D.svg(750, 458, 'Level 1 DFD of the ATM system', k);
};
FIGS['dfd-l2'] = () => {
  const k = [
    R(20, 50, 130, 56, 'Customer', { cls: 'dg-fill2', rx: 0, dash: true }), C(85, 270, 40, '1.0\nVerify', { dash: true, tcls: 'dg-t2' }),
    C(280, 170, 48, '2.1\nRead\nrequest', { cls: 'dg-fill1', tcls: 'dg-t2' }), C(500, 170, 48, '2.2\nCheck\nbalance', { cls: 'dg-fill1', tcls: 'dg-t2' }),
    C(500, 360, 48, '2.3\nUpdate &\nrecord', { cls: 'dg-fill1', tcls: 'dg-t2' }), C(280, 370, 40, '3.0\nDispense', { dash: true, tcls: 'dg-t2' }),
    D.store(600, 245, 160, 40, 'D1', 'Customer accounts'), D.store(600, 395, 160, 36, 'D2', 'Transactions'),
    L([[150, 78], [280, 78], [280, 122]], { end: 'arrow', label: 'request, amount', at: .4 }),
    L([[125, 270], [185, 270], [185, 170], [232, 170]], { end: 'arrow', label: 'account no.', at: .2 }),
    L([[328, 170], [452, 170]], { end: 'arrow', label: 'type, amount' }),
    L([[640, 245], [545, 186]], { end: 'arrow', label: 'balance' }),
    L([[500, 218], [500, 312]], { end: 'arrow', label: 'approved amount', dx: 10, anchor: 'start' }),
    L([[545, 344], [640, 285]], { end: 'arrow', label: 'new balance' }),
    L([[542, 382], [600, 413]], { end: 'arrow' }), TX(548, 420, 'record', 'dg-s', 'end'),
    L([[452, 366], [320, 370]], { end: 'arrow', label: 'cash to pay' })
  ];
  return D.svg(770, 440, 'Level 2 DFD: process 2.0 broken down', k);
};
FIGS['dfd-wrong'] = () => {
  const k = [], row = (y, a, b, bad, why) => {
    k.push(a, b, L([[150, y], [300, y]], { end: 'arrow', cls: bad ? 'dg-bad' : '' }));
    k.push(TX(470, y, why, 'dg-s ' + (bad ? 'dg-badt' : 'dg-okt'), 'start'));
  };
  row(40, R(30, 18, 120, 44, 'Customer', { cls: 'dg-fill2', rx: 0 }), R(300, 18, 120, 44, 'Bank', { cls: 'dg-fill2', rx: 0 }), true, '✗ entity → entity (no process)');
  row(110, R(30, 88, 120, 44, 'Customer', { cls: 'dg-fill2', rx: 0 }), D.store2(300, 92, 120, 36, 'Accounts'), true, '✗ entity → store (no process)');
  row(180, D.store2(30, 162, 120, 36, 'Accounts'), D.store2(300, 162, 120, 36, 'Backup'), true, '✗ store → store (no process)');
  row(250, R(30, 228, 120, 44, 'Customer', { cls: 'dg-fill2', rx: 0 }), C(360, 250, 30, '1.0', { cls: 'dg-fill1' }), false, '✓ entity → process');
  return D.svg(720, 290, 'Every data flow must start or end at a process', k);
};

/* ---------- Topic 6: use cases ---------- */
FIGS['uc-notation'] = () => {
  const k = [D.actor(60, 14, 'Actor'), D.ellipse(230, 44, 80, 28, 'Use case'), R(360, 10, 150, 90, null, { cls: 'dg-fill3', rx: 0 }), TX(435, 26, 'System boundary', 'dg-t')];
  const rows = [['association', {}], ['generalization', { end: 'tri' }], ['«include»', { end: 'open', dash: true }], ['«extend»', { end: 'open', dash: true }]];
  rows.forEach(([t, o], i) => { const y = 140 + i * 36; k.push(L([[30, y], [210, y]], o)); k.push(TX(230, y, t, 'dg-t', 'start')); });
  k.push(TX(360, 140, 'base ⇢ included (always runs)', 'dg-s', 'start'), TX(360, 212, 'extension ⇢ base (sometimes)', 'dg-s', 'start'));
  return D.svg(560, 270, 'Use case diagram symbols', k);
};
FIGS['uc-atm'] = () => {
  const k = [R(160, 10, 450, 420, null, { cls: 'dg-fill3', rx: 2 }), TX(385, 28, 'ATM system', 'dg-t')];
  k.push(D.actor(70, 160, 'Customer'), D.actor(700, 160, 'Bank server'));
  const uc = [[300, 80, 'Withdraw cash', 'extension point:\nexcess amount'], [300, 175, 'Check balance'], [300, 260, 'Print mini\nstatement'], [300, 350, 'Transfer funds']];
  uc.forEach(([x, y, t, ep]) => {
    if (ep) { k.push(D.ellipse(x, y, 100, 36, null)); k.push(TX(x, y - 14, t, 'dg-t')); k.push(L([[x - 92, y - 2], [x + 92, y - 2]], { cls: 'dg-thin' })); k.push(TX(x, y + 16, ep, 'dg-s')); }
    else k.push(D.ellipse(x, y, 92, 28, t));
    k.push(L([[86, 200], [x - (ep ? 100 : 92), y]]));
    k.push(L([[684, 200], [x + (ep ? 100 : 92), y]], { cls: 'dg-thin' }));
  });
  k.push(D.ellipse(500, 400, 90, 24, 'Authenticate', { cls: 'dg-fill2' }));
  k.push(D.ellipse(510, 60, 88, 26, 'Handle excess\namount', { cls: 'dg-fill2', tcls: 'dg-t2' }));
  k.push(L([[422, 60], [400, 66]], { end: 'open', dash: true }), TX(468, 98, '«extend»', 'dg-s'));
  [[300, 116], [340, 202], [340, 288], [330, 377]].forEach(([x, y], i) => k.push(L([[x + (i ? 0 : 40), y], [470, 377]], { end: 'open', dash: true, cls: 'dg-thin' })));
  k.push(TX(440, 330, '«include»', 'dg-s'));
  return D.svg(760, 440, 'Use case diagram of the ATM system', k);
};
FIGS['uc-relations'] = () => {
  const k = [];
  k.push(TX(120, 16, 'include: always', 'dg-t'), D.ellipse(120, 60, 80, 24, 'Withdraw cash'), D.ellipse(120, 160, 80, 24, 'Authenticate', { cls: 'dg-fill2' }), L([[120, 84], [120, 136]], { end: 'open', dash: true, label: '«include»', dx: 8, anchor: 'start' }));
  k.push(TX(360, 16, 'extend: optional', 'dg-t'), D.ellipse(360, 60, 80, 24, 'Withdraw cash'), D.ellipse(360, 160, 80, 24, 'Print receipt', { cls: 'dg-fill2' }), L([[360, 136], [360, 84]], { end: 'open', dash: true, label: '«extend»', dx: 8, anchor: 'start' }));
  k.push(TX(600, 16, 'generalization', 'dg-t'), D.actor(600, 28, null), TX(624, 60, 'Customer', 'dg-t', 'start'), D.actor(555, 140, null), D.actor(645, 140, null), TX(555, 220, 'Student', 'dg-s'), TX(645, 220, 'Staff', 'dg-s'),
    L([[555, 138], [594, 94]], { end: 'tri' }), L([[645, 138], [606, 94]], { end: 'tri' }));
  return D.svg(720, 232, 'The three relationships between use cases and actors', k);
};

/* ---------- Topic 7: sequence and communication ---------- */
const SEQ_ATM = {
  w: 760, parts: [{ id: 'c', label: 'Customer', actor: true, x: 60 }, { id: 'a', label: ':ATM', x: 250 }, { id: 'b', label: ':BankServer', x: 470, w: 130 }, { id: 'ac', label: ':Account', x: 670 }],
  items: [
    { m: ['c', 'a', 'insertCard()'] }, { m: ['a', 'c', 'requestPIN()'] }, { m: ['c', 'a', 'enterPIN(pin)'] },
    { m: ['a', 'b', 'verifyPIN(card, pin)'] }, { m: ['b', 'a', 'valid', 'reply'] },
    { m: ['c', 'a', 'withdraw(amount)'] }, { m: ['a', 'b', 'withdraw(acct, amount)'] }, { m: ['b', 'ac', 'getBalance()'] }, { m: ['ac', 'b', 'balance', 'reply'] },
    { frag: 'alt', guard: '[amount ≤ balance]', x1: 150, x2: 745 },
    { m: ['b', 'ac', 'debit(amount)'] }, { m: ['b', 'a', 'approved', 'reply'] }, { m: ['a', 'a', 'dispenseCash()', 'self'] }, { m: ['a', 'c', 'cash, receipt', 'reply'] },
    { els: '[else]' },
    { m: ['b', 'a', 'insufficient funds', 'reply'] }, { m: ['a', 'c', 'showError()'] },
    { end: true },
    { m: ['a', 'c', 'ejectCard()'] }
  ]
};
FIGS['seq-atm'] = () => seqDiagram(SEQ_ATM, null, 'Sequence diagram: withdraw cash at an ATM');
FIGS['seq-messages'] = () => seqDiagram({
  w: 700, parts: [{ id: 'c', label: 'c:Customer', x: 110, w: 120 }, { id: 'b', label: 'b:Bank', x: 380 }, { id: 'i', label: ':Receipt', x: 600, noAct: true }],
  items: [{ m: ['c', 'b', 'synchronous (caller waits)'] }, { m: ['b', 'c', 'reply / return', 'reply'] }, { m: ['c', 'b', 'asynchronous (no wait)', 'async'] }, { m: ['b', 'b', 'self message', 'self'] },
    { m: ['b', 'i', '«create»', 'create'] }, { m: ['b', 'i', 'delete', 'destroy'] }, { m: [null, 'c', 'found message', 'found'] }, { m: ['b', null, 'lost message', 'lost'] }]
}, null, 'Sequence diagram message types');
FIGS['seq-frags'] = () => seqDiagram({
  w: 640, numbered: false, parts: [{ id: 'u', label: ':Librarian', x: 110, w: 120 }, { id: 's', label: ':LibrarySystem', x: 360, w: 150 }, { id: 'd', label: ':Database', x: 560 }],
  items: [{ frag: 'loop', guard: '[for each book returned]', x1: 20, x2: 625 }, { m: ['u', 's', 'scan(bookId)'] }, { m: ['s', 'd', 'markReturned(bookId)'] },
    { frag: 'opt', guard: '[book is overdue]', x1: 40, x2: 610 }, { m: ['s', 's', 'computeFine()', 'self'] }, { m: ['s', 'u', 'showFine(amount)'] }, { end: true }, { end: true }]
}, null, 'Combined fragments: loop and opt');
FIGS['comm-atm'] = () => {
  const k = [];
  const node = (x, y, t, w) => k.push(R(x - (w || 120) / 2, y - 20, w || 120, 40, t, { cls: 'dg-fill1', rx: 3, tcls: 'dg-t dg-u' }));
  k.push(D.actor(80, 150, 'Customer'));
  node(360, 180, ':ATM'); node(360, 40, ':BankServer', 140); node(650, 40, ':Account');
  k.push(L([[100, 190], [300, 185]]), L([[360, 160], [360, 60]]), L([[430, 40], [590, 40]]));
  k.push(L([[235, 200], [285, 200]], { end: 'arrow' }), TX(120, 226, '1: insertCard()\n3: enterPIN(pin)\n6: withdraw(amount)', 'dg-m', 'start'));
  k.push(L([[165, 170], [115, 170]], { end: 'arrow' }), TX(118, 120, '2: requestPIN()\n12: cash, receipt\n13: ejectCard()', 'dg-m', 'start'));
  k.push(L([[378, 140], [378, 100]], { end: 'arrow' }), TX(388, 118, '4: verifyPIN(card, pin)\n7: withdraw(acct, amt)', 'dg-m', 'start'));
  k.push(L([[342, 90], [342, 130]], { end: 'arrow' }), TX(334, 112, '5: valid\n11: approved', 'dg-m', 'end'));
  k.push(L([[470, 22], [540, 22]], { end: 'arrow' }), TX(505, 4 + 70, '8: getBalance()\n9: debit(amount)', 'dg-m'));
  k.push(L([[540, 58], [470, 58]], { end: 'arrow' }), TX(505, 100, '8.1: balance', 'dg-m'));
  k.push(sv('path', { d: 'M410 200 C470 200 470 240 410 236', class: 'dg-ln' }), TX(478, 222, '10: dispenseCash()', 'dg-m', 'start'));
  return D.svg(740, 290, 'Communication diagram of the same withdrawal', k);
};

/* ---------- Topic 8: class diagrams ---------- */
FIGS['class-box'] = () => {
  const c = D.umlClass(200, 14, 290, { name: 'Account', attrs: ['- accountNo : String', '- balance : double = 0', '# owner : Customer'], ops: ['+ deposit(amount : double) : void', '+ withdraw(amount : double) : boolean', '+ getBalance() : double'] });
  const k = [c.el];
  k.push(L([[190, 28], [130, 28]], { cls: 'dg-acc' }), TX(122, 28, 'class name', 'dg-t dg-acct', 'end'));
  k.push(L([[190, 76], [130, 76]], { cls: 'dg-acc' }), TX(122, 76, 'attributes', 'dg-t dg-acct', 'end'));
  k.push(L([[190, 140], [130, 140]], { cls: 'dg-acc' }), TX(122, 140, 'operations', 'dg-t dg-acct', 'end'));
  k.push(TX(500, 60, 'visibility  name : type', 'dg-s', 'start'), TX(500, 150, 'name(params) : return type', 'dg-s', 'start'));
  return D.svg(700, c.h + 30, 'A UML class has three compartments', k);
};
FIGS['class-rels'] = () => {
  const k = [], rows = [
    ['Dependency', 'Student', 'Library', { end: 'open', dash: true }, '“uses” for a while (parameter, local variable)'],
    ['Association', 'Customer', 'Account', { label: 'owns' }, 'a lasting link; both know each other'],
    ['Directed association', 'Order', 'Product', { end: 'open' }, 'only Order knows about Product'],
    ['Aggregation', 'Department', 'Teacher', { start: 'odia' }, 'whole–part; parts can live on their own'],
    ['Composition', 'House', 'Room', { start: 'dia' }, 'strong ownership; parts die with the whole'],
    ['Generalization', 'SavingsAccount', 'Account', { end: 'tri' }, 'is-a (inheritance)'],
    ['Realization', 'Card', '«interface» Payable', { end: 'tri', dash: true }, 'class implements an interface']
  ];
  rows.forEach(([n, a, b, o, why], i) => {
    const y = 22 + i * 54;
    k.push(TX(10, y + 14, n, 'dg-t', 'start'));
    k.push(R(180, y, 120, 30, a, { cls: 'dg-fill1', rx: 2, tcls: 'dg-t2' }), R(400, y, 150, 30, b, { cls: 'dg-fill1', rx: 2, tcls: 'dg-t2' }));
    k.push(L([[300, y + 15], [400, y + 15]], Object.assign({ dy: -11 }, o)));
    k.push(TX(180, y + 42, why, 'dg-s', 'start'));
  });
  return D.svg(570, 400, 'The class-diagram relationships from weakest to strongest', k);
};
FIGS['multiplicity'] = () => {
  const k = [R(40, 30, 130, 40, 'Company', { cls: 'dg-fill1', rx: 2 }), R(40, 180, 130, 40, 'Employee', { cls: 'dg-fill1', rx: 2 }), L([[105, 70], [105, 180]], { label: 'employs', dx: 8, anchor: 'start' }),
    TX(95, 84, '1', 'dg-m', 'end'), TX(95, 166, '1..*', 'dg-m', 'end')];
  [['1', 'exactly one'], ['0..1', 'zero or one (optional)'], ['*  or  0..*', 'zero or more'], ['1..*', 'one or more'], ['2..4', 'between two and four']].forEach(([m, t], i) => {
    k.push(TX(260, 40 + i * 40, m, 'dg-m dg-b', 'start'), TX(380, 40 + i * 40, t, 'dg-t2', 'start'));
  });
  return D.svg(600, 240, 'Multiplicity: how many objects take part in a link', k);
};
FIGS['telephone'] = () => {
  const line = D.umlClass(20, 14, 150, { name: 'Line', attrs: ['- busy : boolean'], ops: ['+ dial(n : int)', '+ offHook()', '+ onHook()'] });
  const tel = D.umlClass(20, 200, 220, { name: 'Telephone', attrs: ['- hook : boolean = true', '- connection : int = 0'], ops: ['+ onHook()', '+ offHook()', '+ dial(n : int)', '+ setCallerId(s : boolean)'] });
  const ring = D.umlClass(360, 14, 150, { name: 'Ringer', attrs: ['- status : boolean'], ops: ['+ ring()', '+ reset()'] });
  const cid = D.umlClass(360, 150, 170, { name: 'CallerId', attrs: ['- id : int'], ops: ['+ display(n : int)', '+ reset()'] });
  const am = D.umlClass(360, 290, 170, { name: 'AnsweringMachine', attrs: ['- status : boolean'], ops: ['+ playback()', '+ record()'] });
  const msg = D.umlClass(620, 310, 150, { name: 'Message', attrs: ['- content : AudioStream'], ops: [] });
  const k = [line.el, tel.el, ring.el, cid.el, am.el, msg.el,
    L([line.bottom(.5), tel.top(.35)], { label: '', }), TX(106, line.y + line.h + 12, '0..1', 'dg-m', 'start'), TX(106, tel.y - 10, '0..*', 'dg-m', 'start'),
    L([tel.right(.2), [300, tel.y + tel.h * .2], [300, ring.cy], ring.left()], { start: 'odia' }),
    L([tel.right(.45), cid.left()], { start: 'odia' }), TX(350, cid.cy + 12, '1', 'dg-m', 'end'),
    L([tel.right(.75), [300, tel.y + tel.h * .75], [300, am.cy], am.left()], { start: 'odia' }), TX(350, am.cy + 12, '1', 'dg-m', 'end'),
    L([am.right(.55), msg.left(.5)], { start: 'dia', label: 'recordedMsgs', dy: -12 }), TX(612, msg.cy + 12, '*', 'dg-m', 'end')];
  return D.svg(790, 420, 'Class diagram of a telephone', k);
};
FIGS['gen-abstract'] = () => {
  const p = D.umlClass(210, 10, 190, { name: 'Person', abstract: true, attrs: ['- name : String', '- address : String'], ops: ['~+ printInfo() : void'] });
  const e = D.umlClass(60, 190, 190, { name: 'Employee', attrs: ['- salary : double'], ops: ['+ getSalary() : double', '+ printInfo() : void'] });
  const c = D.umlClass(360, 190, 190, { name: 'Customer', attrs: ['- balance : double'], ops: ['+ printBalance() : void', '+ printInfo() : void'] });
  const k = [p.el, e.el, c.el, L([e.top(), [155, 160], [305, 160], p.bottom()], { end: 'tri' }), L([c.top(), [455, 160], [305, 160]])];
  k.push(TX(410, 36, 'italic name =\nabstract class', 'dg-s dg-acct', 'start'), TX(410, 100, 'italic = abstract\nmethod', 'dg-s dg-acct', 'start'));
  return D.svg(600, 300, 'Generalization with an abstract class', k);
};
FIGS['realization'] = () => {
  const i = D.umlClass(195, 10, 250, { name: 'Payable', stereo: 'interface', ops: ['+ pay(amount : double) : boolean', '+ refund(id : String) : void'] });
  const a = D.umlClass(10, 190, 250, { name: 'DebitCard', attrs: ['- cardNo : String'], ops: ['+ pay(amount : double) : boolean', '+ refund(id : String) : void'] });
  const b = D.umlClass(380, 190, 250, { name: 'MobileWallet', attrs: ['- phone : String'], ops: ['+ pay(amount : double) : boolean', '+ refund(id : String) : void'] });
  return D.svg(640, 300, 'Realization: two classes implement one interface', [i.el, a.el, b.el, L([a.top(), [135, 160], [320, 160], i.bottom()], { end: 'tri', dash: true }), L([b.top(), [505, 160], [320, 160]], { dash: true })]);
};
FIGS['code-house-dept'] = () => {   // the UML that the House / Department Java code corresponds to
  const house = D.umlClass(10, 20, 190, { name: 'House', ops: ['+ House()'] });
  const room = D.umlClass(390, 13.5, 200, { name: 'Room', attrs: ['- name : String'], ops: ['+ Room(name : String)'] });
  const dept = D.umlClass(10, 140, 190, { name: 'Department', ops: ['+ add(t : Teacher)'] });
  const tch = D.umlClass(390, 140, 200, { name: 'Teacher', attrs: ['- name : String'] });
  const k = [house.el, room.el, dept.el, tch.el,
    L([house.right(), room.left()], { start: 'dia', label: 'rooms', dy: -10, at: .78 }), TX(382, house.cy + 15, '1..*', 'dg-m', 'end'), TX(214, house.cy + 15, '1', 'dg-m', 'start'),
    L([dept.right(), tch.left()], { start: 'odia', label: 'teachers', dy: -10, at: .78 }), TX(382, dept.cy + 15, '*', 'dg-m', 'end'),
    TX(295, 112, 'composition: House creates its Rooms', 'dg-s', 'middle'), TX(295, 226, 'aggregation: Teachers come from outside', 'dg-s', 'middle')];
  return D.svg(600, 236, 'UML class diagram for the House and Department code', k);
};
FIGS['atm-class'] = () => {
  const bank = D.umlClass(30, 34, 170, { name: 'Bank', attrs: ['+ code : String', '+ address : String'], ops: ['+ manages()', '+ maintains()'], g: 'cx-bank' });
  const atm = D.umlClass(560, 34, 180, { name: 'ATM', attrs: ['+ location : String', '+ managedBy : String'], ops: ['+ identifies()', '+ transactions()'], g: 'cx-atm' });
  const card = D.umlClass(30, 200, 170, { name: 'DebitCard', attrs: ['+ cardNo : String', '+ ownedBy : String'], ops: ['+ access()'], g: 'cx-card' });
  const cust = D.umlClass(300, 200, 160, { name: 'Customer', attrs: ['+ name : String', '+ address : String', '+ dob : Date'], ops: ['+ owns()'], g: 'cx-cust' });
  const acc = D.umlClass(150, 390, 180, { name: 'Account', attrs: ['+ type : String', '+ owner : String'], ops: ['+ checkBalance()'], g: 'cx-acc' });
  const tr = D.umlClass(560, 250, 180, { name: 'ATMTransaction', attrs: ['+ transactionId : String', '+ date : Date', '+ type : String'], ops: ['+ update()'], g: 'cx-tr' });
  const sav = D.umlClass(20, 580, 170, { name: 'SavingAccount', attrs: ['+ accountNo : String'], ops: ['+ debit()', '+ credit()'], g: 'cx-sav' });
  const chk = D.umlClass(230, 580, 170, { name: 'CheckingAccount', attrs: ['+ accountNo : String'], ops: ['+ debit()', '+ credit()'], g: 'cx-chk' });
  const wd = D.umlClass(470, 460, 150, { name: 'Withdrawal', attrs: ['+ amount : double'], ops: ['+ withdraw()'], g: 'cx-wd' });
  const tf = D.umlClass(650, 460, 150, { name: 'Transfer', attrs: ['+ amount : double', '+ accountNo : String'], ops: [], g: 'cx-tf' });
  const m = (t, x, y, a) => TX(x, y, t, 'dg-m', a || 'start');
  const k = [bank, atm, card, cust, acc, tr, sav, chk, wd, tf].map((c) => c.el);
  k.push(sv('g', { class: 'cx-e', 'data-a': 'Bank', 'data-b': 'ATM' }, L([bank.top(.5), [115, 12], [650, 12], atm.top(.5)], { label: 'maintains', at: .5 }), m('1', 121, 26), m('1..*', 656, 26)));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'Bank', 'data-b': 'DebitCard' }, L([bank.bottom(.5), card.top(.5)], { label: 'manages', dx: 8, anchor: 'start' }), m('1', 120, bank.y + bank.h + 12), m('1..*', 120, card.y - 10)));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'Bank', 'data-b': 'Customer' }, L([bank.right(.7), [380, bank.y + bank.h * .7], cust.top(.5)], { label: 'has', at: .35 }), m('1', 206, bank.y + bank.h * .7 - 10), m('1..*', 386, cust.y - 10)));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'Customer', 'data-b': 'DebitCard' }, L([cust.left(.4), card.right(.4)], { label: 'owns', dy: -12 }), m('1', 290, cust.y + cust.h * .4 + 12, 'end'), m('0..*', 206, card.y + card.h * .4 + 12)));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'DebitCard', 'data-b': 'Account' }, L([card.bottom(.5), [115, 360], [200, 360], acc.top(.25)], { label: 'gives access to', at: .45 }), m('*', 122, card.y + card.h + 12), m('1..*', 210, acc.y - 10)));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'Customer', 'data-b': 'Account' }, L([cust.bottom(.5), [380, 360], [290, 360], acc.top(.75)], { label: 'owns', at: .4 }), m('1..*', 386, cust.y + cust.h + 12), m('1..*', 296, acc.y - 10)));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'ATM', 'data-b': 'ATMTransaction' }, L([atm.bottom(.5), tr.top(.5)], { label: 'identifies', dx: 8, anchor: 'start' }), m('1', 656, atm.y + atm.h + 12), m('*', 656, tr.y - 10)));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'ATMTransaction', 'data-b': 'Account' }, L([tr.left(.6), [470, tr.y + tr.h * .6], [470, acc.cy], acc.right(.5)], { end: 'open', label: 'modifies', at: .25 }), m('*', 552, tr.y + tr.h * .6 - 10, 'end'), m('1', 338, acc.cy - 10)));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'SavingAccount', 'data-b': 'Account' }, L([sav.top(.5), [105, 555], [240, 555], acc.bottom(.5)], { end: 'tri' })));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'CheckingAccount', 'data-b': 'Account' }, L([chk.top(.5), [315, 555], [240, 555]])));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'Withdrawal', 'data-b': 'ATMTransaction' }, L([wd.top(.5), [545, 440], [650, 440], tr.bottom(.5)], { end: 'tri' })));
  k.push(sv('g', { class: 'cx-e', 'data-a': 'Transfer', 'data-b': 'ATMTransaction' }, L([tf.top(.5), [725, 440], [650, 440]])));
  return D.svg(810, 690, 'Class diagram of the ATM system', k, { scale: 1.1 });
};

/* ---------- Topic 9: UI/UX ---------- */
FIGS['ux-process'] = () => {
  const st = ['Research\nusers', 'Define\nproblem', 'Sketch &\nwireframe', 'Prototype\n(Figma)', 'Test with\nusers'], k = [];
  st.forEach((t, i) => { const x = 10 + i * 140; k.push(R(x, 20, 118, 60, t, { cls: i === 2 || i === 3 ? 'dg-fill2' : 'dg-fill1', rx: 30, tcls: 'dg-t2' })); if (i) k.push(L([[x - 22, 50], [x, 50]], { end: 'arrow' })); });
  k.push(L([[629, 80], [629, 108], [69, 108], [69, 80]], { end: 'arrow', dash: true, label: 'iterate: what you learn in testing changes the design', at: .5 }));
  return D.svg(700, 124, 'A user-centred design loop', k);
};
FIGS['fidelity'] = () => {
  const k = [], W = 160, H = 230, cols = [['Sketch', 'paper, 5 minutes'], ['Wireframe', 'grey boxes, layout'], ['Mockup', 'colour, type, images'], ['Prototype', 'clickable, flows']];
  cols.forEach(([t, s], i) => {
    const x = 14 + i * 186, y = 36;
    k.push(TX(x + W / 2, 12, t, 'dg-t'), TX(x + W / 2, y + H + 16, s, 'dg-s'));
    k.push(sv('rect', { x, y, width: W, height: H, rx: 16, class: 'dg-box ' + (i === 0 ? 'dg-sketch' : '') }));
    const bx = x + 16, bw = W - 32;
    if (i === 0) {
      k.push(sv('path', { d: `M${bx} ${y + 30} q20 -6 40 0 t40 0 t40 0`, class: 'dg-ln dg-sketchln' }), sv('path', { d: `M${bx} ${y + 70} h${bw} v34 h-${bw} z M${bx} ${y + 120} h${bw} v34 h-${bw} z M${bx} ${y + 170} h${bw} v34 h-${bw} z`, class: 'dg-ln dg-sketchln' }));
    } else {
      const fill = i === 1 ? 'dg-wf' : 'dg-mk';
      k.push(sv('rect', { x: bx, y: y + 18, width: bw * .7, height: 12, rx: 3, class: i === 1 ? 'dg-wf2' : 'dg-mkt' }), sv('rect', { x: bx, y: y + 38, width: bw, height: 8, rx: 3, class: 'dg-wf2' }));
      ['Withdraw', 'Balance', 'Transfer'].forEach((b, j) => {
        const yy = y + 66 + j * 48;
        k.push(sv('rect', { x: bx, y: yy, width: bw, height: 36, rx: 8, class: fill + (i === 3 && j === 0 ? ' dg-press' : '') }));
        if (i > 1) k.push(TX(bx + bw / 2, yy + 18, b, 'dg-t2 dg-onfill'));
      });
      if (i === 3) k.push(L([[x + W - 10, y + 84], [x + W + 34, y + 84]], { end: 'arrow', cls: 'dg-acc' }), TX(x + W + 14, y + 70, 'tap', 'dg-s dg-acct'));
    }
  });
  return D.svg(760, 290, 'From low to high fidelity: the same ATM menu four ways', k);
};

/* ---------- Worked project: CampusCare (university medical-centre appointments) ---------- */
FIGS['cc-dfd0'] = () => {
  const k = [
    R(10, 122, 110, 56, 'Patient', { cls: 'dg-fill2', rx: 0 }), R(500, 30, 130, 50, 'Receptionist', { cls: 'dg-fill2', rx: 0 }),
    R(500, 220, 130, 50, 'Doctor', { cls: 'dg-fill2', rx: 0 }), R(120, 250, 130, 44, 'SMS gateway', { cls: 'dg-fill2', rx: 0 }),
    C(330, 150, 70, '0\nCampusCare\nsystem', { cls: 'dg-fill1' }),
    L([[120, 138], [261, 138]], { end: 'arrow', label: 'sign-up, booking', dy: -12 }),
    L([[261, 162], [120, 162]], { end: 'arrow', label: 'confirmation', dy: 12 }),
    L([[500, 62], [392, 118]], { end: 'arrow', label: 'doctor schedules' }),
    L([[500, 238], [392, 182]], { end: 'arrow', label: 'visit notes' }),
    L([[282, 200], [222, 250]], { end: 'arrow', label: 'reminder' })
  ];
  return D.svg(640, 300, 'Level 0 DFD of CampusCare', k);
};
FIGS['cc-dfd1'] = () => {
  const P = (x, y, t) => C(x, y, 46, t, { cls: 'dg-fill1', tcls: 'dg-t2' });
  const k = [
    R(20, 222, 120, 56, 'Patient', { cls: 'dg-fill2', rx: 0 }), R(20, 445, 140, 50, 'SMS gateway', { cls: 'dg-fill2', rx: 0 }),
    R(600, 20, 130, 50, 'Receptionist', { cls: 'dg-fill2', rx: 0 }), R(660, 500, 120, 50, 'Doctor', { cls: 'dg-fill2', rx: 0 }),
    P(260, 80, '1.0\nRegister\n& log in'), P(260, 250, '2.0\nBook\nappointment'), P(665, 150, '3.0\nManage\nschedules'), P(260, 470, '4.0\nSend\nreminders'), P(580, 470, '5.0\nRecord\nvisit'),
    D.store(380, 62, 160, 36, 'D1', 'Patients'), D.store(380, 232, 170, 36, 'D2', 'Doctor schedules'), D.store(380, 352, 200, 36, 'D3', 'Appointments'),
    L([[80, 222], [80, 80], [214, 80]], { end: 'arrow', label: 'registration details', at: .62 }),
    L([[306, 80], [380, 80]], { end: 'arrow', label: 'patient record', dy: -14 }),
    L([[420, 98], [293, 218]], { end: 'arrow', label: 'patient details' }),
    L([[140, 242], [214, 242]], { end: 'arrow', label: 'booking request', dy: -13 }),
    L([[214, 262], [140, 262]], { end: 'arrow', label: 'confirmation', dy: 13 }),
    L([[380, 250], [306, 250]], { end: 'arrow', label: 'free slots', dy: -13 }),
    L([[293, 283], [380, 362]], { end: 'arrow', label: 'new appointment', at: .45 }),
    L([[665, 70], [665, 104]], { end: 'arrow', label: 'doctor schedules', dx: 10, anchor: 'start' }),
    L([[626, 181], [550, 240]], { end: 'arrow', label: 'schedule', at: .45 }),
    L([[400, 388], [300, 447]], { end: 'arrow', label: 'next-day list' }),
    L([[214, 470], [160, 470]], { end: 'arrow', label: 'reminder', dy: -13 }),
    L([[555, 388], [555, 431]], { end: 'arrow', label: 'today’s list', dx: -8, anchor: 'end' }),
    L([[600, 429], [600, 388]], { end: 'arrow', label: 'visit record', dx: 8, anchor: 'start' }),
    L([[660, 515], [620, 492]], { end: 'arrow' }), TX(700, 562, 'visit notes', 'dg-s')
  ];
  return D.svg(800, 575, 'Level 1 DFD of CampusCare', k);
};
FIGS['cc-uc'] = () => {
  const k = [R(150, 8, 510, 440, null, { cls: 'dg-fill3', rx: 2 }), TX(250, 26, 'CampusCare system', 'dg-t')];
  k.push(D.actor(80, 60, 'Patient'), D.actor(80, 280, 'Receptionist'), D.actor(730, 80, 'Doctor'), D.actor(730, 270, 'SMS gateway'));
  const uc = (x, y, t, o) => { k.push(D.ellipse(x, y, (o && o.rx) || 88, (o && o.ry) || 26, t, Object.assign({ tcls: 'dg-t2' }, o || {}))); };
  uc(280, 70, 'Book appointment'); uc(280, 150, 'Cancel or\nreschedule'); uc(280, 230, 'View my\nappointments'); uc(280, 330, 'Manage doctor\nschedules');
  uc(540, 45, 'Join waiting list', { rx: 80, ry: 22, cls: 'dg-fill2' }); uc(540, 125, 'View patient\nqueue'); uc(540, 210, 'Record visit\nnotes'); uc(540, 305, 'Send reminder');
  uc(405, 405, 'Log in', { rx: 62, ry: 24, cls: 'dg-fill2' });
  [[192, 70], [192, 150], [192, 230]].forEach((p) => k.push(L([[96, 105], p])));
  k.push(L([[96, 325], [192, 330]]), L([[714, 125], [628, 125]]), L([[714, 125], [628, 210]]), L([[714, 315], [628, 305]]));
  [[368, 70, 398], [368, 150, 401], [368, 230, 404], [368, 330, 407], [452, 215, 415]].forEach(([x, y, x2]) => k.push(L([[x, y], [x2, 381]], { end: 'open', dash: true, cls: 'dg-thin' })));
  k.push(TX(470, 368, '«include»', 'dg-s', 'start'));
  k.push(L([[460, 48], [368, 64]], { end: 'open', dash: true }), TX(430, 76, '«extend»', 'dg-s'));
  return D.svg(790, 460, 'Use case diagram of CampusCare', k);
};
const SEQ_CC = {
  w: 830, parts: [{ id: 'p', label: 'Patient', actor: true, x: 55 }, { id: 's', label: ':BookingScreen', x: 225, w: 140 }, { id: 'c', label: ':BookingController', x: 425, w: 160 }, { id: 'h', label: ':Schedule', x: 610 }, { id: 'a', label: ':Appointment', x: 760, w: 120 }],
  items: [
    { m: ['p', 's', 'selectDoctor(d, date)'] }, { m: ['s', 'c', 'getFreeSlots(d, date)'] }, { m: ['c', 'h', 'freeSlots(date)'] }, { m: ['h', 'c', 'slots', 'reply'] }, { m: ['c', 's', 'slots', 'reply'] },
    { m: ['s', 'p', 'showSlots(slots)'] }, { m: ['p', 's', 'choose(slot)'] }, { m: ['s', 'c', 'book(p, slot)'] }, { m: ['c', 'h', 'reserve(slot)'] },
    { frag: 'alt', guard: '[slot still free]', x1: 145, x2: 820 },
    { m: ['h', 'c', 'reserved', 'reply'] }, { m: ['c', 'a', 'create(p, slot)'] }, { m: ['c', 's', 'confirmation(ref)', 'reply'] }, { m: ['s', 'p', 'showConfirmation()'] },
    { els: '[slot taken meanwhile]' },
    { m: ['h', 'c', 'slotTaken', 'reply'] }, { m: ['c', 's', 'full', 'reply'] }, { m: ['s', 'p', 'offerWaitingList()'] },
    { end: true }]
};
FIGS['cc-seq'] = () => seqDiagram(SEQ_CC, null, 'Sequence diagram: book an appointment');
FIGS['cc-comm'] = () => {
  const k = [];
  const node = (x, y, t, w) => k.push(R(x - w / 2, y - 20, w, 40, t, { cls: 'dg-fill1', rx: 3, tcls: 'dg-t dg-u' }));
  k.push(D.actor(60, 120, 'Patient'));
  node(270, 160, ':BookingScreen', 150); node(520, 160, ':BookingController', 170); node(760, 60, ':Schedule', 120); node(760, 260, ':Appointment', 130);
  k.push(L([[80, 160], [195, 160]]), L([[345, 160], [435, 160]]), L([[605, 150], [700, 70]]), L([[605, 170], [695, 250]]));
  k.push(L([[110, 146], [160, 146]], { end: 'arrow' }), TX(84, 110, '1: selectDoctor(d, date)\n7: choose(slot)', 'dg-m', 'start'));
  k.push(L([[160, 176], [110, 176]], { end: 'arrow' }), TX(118, 236, '6: showSlots(slots)\n13: showConfirmation()\n16: offerWaitingList()', 'dg-m', 'start'));
  k.push(L([[365, 146], [415, 146]], { end: 'arrow' }), TX(390, 110, '2: getFreeSlots(d, date)\n8: book(p, slot)', 'dg-m'));
  k.push(L([[630, 108], [668, 76]], { end: 'arrow' }), TX(610, 58, '3: freeSlots(date)\n9: reserve(slot)', 'dg-m', 'end'));
  k.push(L([[630, 214], [668, 246]], { end: 'arrow' }), TX(612, 262, '11: create(p, slot)', 'dg-m', 'end'));
  return D.svg(840, 300, 'Communication diagram: book an appointment', k);
};
FIGS['cc-class'] = () => {
  const user = D.umlClass(275, 10, 270, { name: 'User', abstract: true, attrs: ['- userId : String', '- name : String', '- phone : String'], ops: ['+ logIn(password : String) : boolean'] });
  const pat = D.umlClass(20, 190, 245, { name: 'Patient', attrs: ['- universityId : String'], ops: ['+ book(slot : Slot) : Appointment', '+ cancel(a : Appointment) : void'] });
  const doc = D.umlClass(290, 190, 280, { name: 'Doctor', attrs: ['- specialty : String'], ops: ['+ viewQueue(date : Date) : List', '+ recordVisit(a : Appointment) : void'] });
  const rec = D.umlClass(595, 190, 235, { name: 'Receptionist', attrs: [], ops: ['+ setSchedule(d : Doctor) : void'] });
  const app = D.umlClass(20, 370, 245, { name: 'Appointment', attrs: ['- ref : String', '- status : Status'], ops: ['+ confirm() : void', '+ cancel() : void'] });
  const slot = D.umlClass(330, 390, 190, { name: 'Slot', attrs: ['- start : Time', '- end : Time', '- isFree : boolean'], ops: ['+ reserve() : boolean'] });
  const sch = D.umlClass(590, 390, 230, { name: 'Schedule', attrs: ['- date : Date'], ops: ['+ freeSlots() : List'] });
  const note = D.umlClass(20, 560, 245, { name: 'VisitNote', attrs: ['- diagnosis : String', '- prescription : String'], ops: [] });
  const m = (t, x, y, a) => TX(x, y, t, 'dg-m', a || 'start');
  const k = [user, pat, doc, rec, app, slot, sch, note].map((c) => c.el);
  k.push(L([[410, 160], user.bottom()], { end: 'tri' }), L([pat.top(.5), [142, 160], [705, 160], rec.top(.5)]), L([doc.top(.5), [430, 160]]));
  k.push(L([pat.bottom(.5), app.top(.5)], { label: 'books', dx: 8, anchor: 'start' }), m('1', 150, pat.y + pat.h + 12), m('0..*', 150, app.y - 10));
  k.push(L([[265, 430], [330, 430]], { label: 'occupies', dy: -12 }), m('0..1', 270, 446), m('1', 322, 446, 'end'));
  k.push(L([[590, 430], [520, 430]], { start: 'dia' }), m('1..*', 526, 446), m('1', 582, 446, 'end'));
  k.push(L([doc.bottom(.5), [430, 330], [650, 330], [650, 390]], { label: 'works on', at: .45 }), m('1', 438, doc.y + doc.h + 12), m('0..*', 656, 380));
  k.push(L([rec.bottom(.75), [762, 390]], { end: 'open', dash: true, label: 'manages', dx: 8, anchor: 'start' }));
  k.push(L([app.bottom(.5), note.top(.5)], { start: 'dia' }), m('0..1', 150, note.y - 10));
  return D.svg(840, 660, 'Class diagram of CampusCare', k, { scale: 1.12 });
};
FIGS['cc-wire'] = () => {
  const k = [], ph = (x, title) => { k.push(sv('rect', { x, y: 10, width: 210, height: 390, rx: 22, class: 'dg-box' }), sv('rect', { x: x + 12, y: 24, width: 186, height: 14, rx: 3, class: 'dg-wf2' }), TX(x + 18, 60, title, 'dg-t', 'start')); };
  const btn = (x, y, w, t, pri) => k.push(sv('rect', { x, y, width: w, height: 36, rx: 8, class: pri ? 'dg-mk' : 'dg-wf' }), TX(x + w / 2, y + 18, t, 'dg-t2' + (pri ? ' dg-onfill' : '')));
  const fieldR = (x, y, lab, val) => { k.push(TX(x, y, lab, 'dg-s', 'start'), sv('rect', { x, y: y + 8, width: 186, height: 32, rx: 6, class: 'dg-wf' }), TX(x + 10, y + 24, val, 'dg-t2', 'start')); };
  ph(20, 'Book appointment'); fieldR(32, 88, 'Doctor', 'Dr. Rahman (GP)  ▾'); fieldR(32, 148, 'Date', '14 Oct 2026  ▾'); btn(32, 340, 186, 'Show free slots', true);
  ph(300, 'Free slots · 14 Oct');
  ['09:00', '09:20', '09:40', '10:00', '10:20', '10:40'].forEach((t, i) => { const x = 312 + (i % 3) * 63, y = 84 + Math.floor(i / 3) * 46; k.push(sv('rect', { x, y, width: 56, height: 36, rx: 8, class: i === 2 ? 'dg-wf2' : i === 4 ? 'dg-mk' : 'dg-wf' }), TX(x + 28, y + 18, t, 'dg-t2' + (i === 4 ? ' dg-onfill' : ''))); });
  k.push(TX(312, 196, '09:40 is taken (greyed out)', 'dg-s', 'start'));
  btn(312, 294, 186, 'Book 10:20', true); btn(312, 340, 186, 'Back', false);
  ph(580, 'Booked!');
  k.push(sv('circle', { cx: 685, cy: 120, r: 30, class: 'dg-mk' }), TX(685, 120, '✓', 'dg-t dg-onfill'));
  k.push(TX(685, 176, 'Ref CC-2291', 'dg-t'), TX(685, 200, 'Dr. Rahman · 14 Oct · 10:20', 'dg-s'), TX(685, 222, 'SMS reminder the day before', 'dg-s'));
  btn(592, 294, 186, 'Add to calendar', false); btn(592, 340, 186, 'Done', true);
  k.push(L([[232, 200], [298, 200]], { end: 'arrow', cls: 'dg-acc' }), TX(265, 186, 'tap', 'dg-s dg-acct'), L([[512, 200], [578, 200]], { end: 'arrow', cls: 'dg-acc' }), TX(545, 186, 'tap', 'dg-s dg-acct'));
  return D.svg(810, 410, 'Mid-fidelity wireframes: the booking flow', k);
};
