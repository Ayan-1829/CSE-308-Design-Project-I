/* ===================== art.js : one decorative illustration per topic ===================== */
/* Shown on each topic's title slide and as a thumbnail in the topic list.
   Mount with <span class="topic-art" data-art="3" aria-hidden="true"></span>; colours come from the
   theme variables, so the drawings follow light and dark mode. */
const TOPIC_ART = (() => {
  const bg = '<circle cx="200" cy="165" r="142" class="ta-bg"/>';
  const head = (id) => `<defs><marker id="ta${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ta-fill-ink"/></marker></defs>`;
  const arrow = (id) => `marker-end="url(#ta${id})"`;
  const person = (x, y, cls) => `<circle cx="${x}" cy="${y}" r="20" class="${cls}"/><path d="M${x - 32},${y + 64} Q${x - 32},${y + 26} ${x},${y + 26} Q${x + 32},${y + 26} ${x + 32},${y + 64} Z" class="${cls}"/>`;
  return {
    /* 0. Worked project: a clinic appointment calendar */
    0: `${bg}
      <rect x="92" y="72" width="216" height="190" rx="16" class="ta-card"/>
      <rect x="92" y="72" width="216" height="44" rx="16" class="ta-ac"/><rect x="92" y="100" width="216" height="16" class="ta-ac"/>
      <path d="M140,58 V86 M260,58 V86" class="ta-handle"/>
      ${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${110 + c * 46}" y="${130 + r * 40}" width="34" height="28" rx="6" class="${r === 1 && c === 2 ? 'ta-acc' : 'ta-faint'}"/>`).join('')).join('')}
      <circle cx="318" cy="246" r="34" class="ta-soft2"/><path d="M318,228 V264 M300,246 H336" class="ta-stroke-acc-thin"/>`,
    /* 1. Team formation and planning: a team and a Gantt chart */
    1: `${bg}
      ${person(96, 74, 'ta-ac')}${person(150, 64, 'ta-acc')}${person(204, 74, 'ta-ok')}
      <rect x="62" y="168" width="276" height="112" rx="14" class="ta-card"/>
      <rect x="82" y="184" width="96" height="18" rx="9" class="ta-ac"/>
      <rect x="150" y="212" width="110" height="18" rx="9" class="ta-acc"/>
      <rect x="226" y="240" width="92" height="18" rx="9" class="ta-ok"/>
      <path d="M262,96 l18,18 l36,-42" class="ta-check"/>`,
    /* 2. LaTeX report writing: a typeset page with an equation */
    2: `${bg}
      <path d="M120,52 H254 L290,88 V276 H120 Z" class="ta-card"/><path d="M254,52 V88 H290" class="ta-line"/>
      <rect x="142" y="78" width="96" height="14" rx="7" class="ta-ac"/>
      ${[0, 1, 2].map((i) => `<rect x="142" y="${108 + i * 20}" width="${i === 2 ? 90 : 126}" height="9" rx="4" class="ta-faint"/>`).join('')}
      <text x="205" y="202" class="ta-m">E = mc²</text>
      ${[0, 1].map((i) => `<rect x="142" y="${224 + i * 20}" width="${126 - i * 40}" height="9" rx="4" class="ta-faint"/>`).join('')}
      <rect x="276" y="200" width="88" height="52" rx="14" class="ta-acc"/><text x="320" y="234" class="ta-m ta-on-ac">TeX</text>`,
    /* 3. IEEE SRS: a requirements document with ticked items */
    3: `${bg}
      <rect x="108" y="54" width="184" height="224" rx="14" class="ta-card"/>
      <text x="200" y="92" class="ta-t">SRS</text>
      ${[0, 1, 2, 3].map((i) => `<rect x="130" y="${114 + i * 38}" width="22" height="22" rx="5" class="ta-soft1"/><path d="M134,${125 + i * 38} l6,6 l10,-12" class="${i < 3 ? 'ta-check-thin' : 'ta-none'}"/><rect x="164" y="${120 + i * 38}" width="${[100, 84, 106, 70][i]}" height="10" rx="5" class="ta-faint"/>`).join('')}
      <rect x="252" y="236" width="102" height="40" rx="20" class="ta-ac"/><text x="303" y="262" class="ta-s ta-on-ac">REQ-1</text>`,
    /* 4. SDLC model selection: a development cycle */
    4: `${head(4)}${bg}
      <circle cx="200" cy="165" r="92" class="ta-ring-thin"/>
      ${[['Plan', 200, 73, 'ta-ac'], ['Design', 292, 165, 'ta-acc'], ['Build', 200, 257, 'ta-ok'], ['Test', 108, 165, 'ta-soft2']].map(([t, x, y, c]) => `<rect x="${x - 46}" y="${y - 20}" width="92" height="40" rx="20" class="${c}"/><text x="${x}" y="${y + 6}" class="ta-s ${c === 'ta-soft2' ? '' : 'ta-on-ac'}">${t}</text>`).join('')}
      <path d="M256,92 Q284,112 290,136" class="ta-line" ${arrow(4)}/>
      <path d="M284,206 Q268,238 246,248" class="ta-line" ${arrow(4)}/>
      <path d="M150,250 Q124,236 112,196" class="ta-line" ${arrow(4)}/>
      <path d="M116,132 Q126,98 152,82" class="ta-line" ${arrow(4)}/>`,
    /* 5. Data flow diagrams: entity, process and data store */
    5: `${head(5)}${bg}
      <rect x="46" y="128" width="88" height="62" rx="4" class="ta-soft2"/><text x="90" y="166" class="ta-s">User</text>
      <circle cx="232" cy="159" r="52" class="ta-soft1"/><text x="232" y="152" class="ta-s">1.0</text><text x="232" y="174" class="ta-s">Process</text>
      <path d="M180,252 H330 M180,292 H330 M200,252 V292" class="ta-line"/><text x="266" y="279" class="ta-s">D1 Store</text>
      <path d="M134,150 H174" class="ta-line" ${arrow(5)}/>
      <path d="M232,211 V246" class="ta-line" ${arrow(5)}/>
      <path d="M284,148 Q330,120 344,80" class="ta-line" ${arrow(5)}/>`,
    /* 6. Use case diagrams: an actor and use cases in a system box */
    6: `${bg}
      <circle cx="74" cy="118" r="18" class="ta-paper ta-outline"/>
      <path d="M74,136 V196 M44,158 H104 M74,196 L50,240 M74,196 L98,240" class="ta-line"/>
      <rect x="146" y="56" width="216" height="218" rx="14" class="ta-card"/>
      <text x="254" y="84" class="ta-s">System</text>
      <ellipse cx="254" cy="134" rx="84" ry="30" class="ta-soft1"/><text x="254" y="140" class="ta-s">Log in</text>
      <ellipse cx="254" cy="218" rx="84" ry="30" class="ta-soft2"/><text x="254" y="224" class="ta-s">Book</text>
      <path d="M104,166 L170,136 M104,170 L170,212" class="ta-line"/>`,
    /* 7. Sequence diagrams: lifelines and messages */
    7: `${head(7)}${bg}
      ${[100, 200, 300].map((x, i) => `<rect x="${x - 40}" y="54" width="80" height="38" rx="8" class="${['ta-soft1', 'ta-soft2', 'ta-soft1'][i]}"/><text x="${x}" y="79" class="ta-s">${[':User', ':App', ':DB'][i]}</text><path d="M${x},92 V284" class="ta-dash"/>`).join('')}
      <rect x="192" y="122" width="16" height="120" rx="3" class="ta-ac"/>
      <path d="M100,130 H190" class="ta-line" ${arrow(7)}/>
      <path d="M208,168 H298" class="ta-line" ${arrow(7)}/>
      <path d="M298,200 H210" class="ta-dash" ${arrow(7)}/>
      <path d="M190,236 H102" class="ta-dash" ${arrow(7)}/>`,
    /* 8. Class diagrams: two classes and a composition */
    8: `${bg}
      <rect x="54" y="80" width="130" height="152" rx="8" class="ta-card"/>
      <rect x="54" y="80" width="130" height="36" rx="8" class="ta-ac"/><text x="119" y="104" class="ta-s ta-on-ac">Schedule</text>
      <path d="M54,160 H184" class="ta-line-thin"/>
      ${[0, 1].map((i) => `<rect x="68" y="${128 + i * 16}" width="${90 - i * 20}" height="8" rx="4" class="ta-faint"/><rect x="68" y="${174 + i * 18}" width="${80 + i * 14}" height="8" rx="4" class="ta-faint"/>`).join('')}
      <rect x="236" y="98" width="118" height="116" rx="8" class="ta-card"/>
      <rect x="236" y="98" width="118" height="36" rx="8" class="ta-acc"/><text x="295" y="122" class="ta-s ta-on-ac">Slot</text>
      <rect x="250" y="148" width="80" height="8" rx="4" class="ta-faint"/><rect x="250" y="170" width="64" height="8" rx="4" class="ta-faint"/>
      <path d="M184,156 L198,146 L212,156 L198,166 Z" class="ta-fill-ink"/><path d="M212,156 H236" class="ta-line"/>
      <text x="224" y="146" class="ta-s">1..*</text>`,
    /* 9. UI/UX and Figma: a phone wireframe and a cursor */
    9: `${bg}
      <rect x="128" y="40" width="144" height="252" rx="22" class="ta-card"/>
      <rect x="146" y="70" width="108" height="56" rx="8" class="ta-soft1"/>
      <rect x="146" y="138" width="108" height="10" rx="5" class="ta-faint"/><rect x="146" y="156" width="80" height="10" rx="5" class="ta-faint"/>
      <rect x="146" y="180" width="50" height="44" rx="8" class="ta-faint"/><rect x="204" y="180" width="50" height="44" rx="8" class="ta-faint"/>
      <rect x="146" y="240" width="108" height="30" rx="15" class="ta-acc"/>
      <path d="M262,214 L262,286 L280,268 L294,298 L306,292 L292,262 L318,262 Z" class="ta-cursor"/>
      ${[0, 1, 2].map((i) => `<circle cx="${70 + (i % 2) * 22}" cy="${100 + i * 34}" r="11" class="${['ta-ac', 'ta-acc', 'ta-ok'][i]}"/>`).join('')}`,
  };
})();

(function mountTopicArt() {
  document.querySelectorAll('[data-art]').forEach((el) => {
    const art = TOPIC_ART[el.getAttribute('data-art')];
    if (art) el.innerHTML = `<svg viewBox="0 0 400 320" class="ta-svg" focusable="false">${art}</svg>`;
  });
})();
