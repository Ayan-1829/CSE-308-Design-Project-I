/* ===================== latex.js : LaTeX/BibTeX highlighter and a small LaTeX previewer ===================== */
/* The previewer understands the subset of LaTeX taught in this course (sections, lists, maths, tables,
   figures, cross-references, citations, algorithms) and reports errors with the same wording LaTeX uses.
   Maths is typeset with KaTeX when it can be loaded from the CDN; offline, the maths source is shown instead. */
const TeX = (() => {
  const escH = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ---------------- syntax highlighting ---------------- */
  function hlTexLine(l) {
    let out = '', i = 0;
    while (i < l.length) {
      const c = l[i], rest = l.slice(i);
      let m;
      if (c === '%') { out += '<span class="tk-com">' + escH(rest) + '</span>'; break; }
      if ((m = /^\\(begin|end)(\{)([^}]*)(\})/.exec(rest))) { out += '<span class="tk-kw">\\' + m[1] + '</span><span class="tk-op">{</span><span class="tk-ty">' + escH(m[3]) + '</span><span class="tk-op">}</span>'; i += m[0].length; continue; }
      if ((m = /^\\[A-Za-z@]+\*?/.exec(rest))) { out += '<span class="tk-kw">' + escH(m[0]) + '</span>'; i += m[0].length; continue; }
      if ((m = /^\\./.exec(rest))) { out += '<span class="tk-cst">' + escH(m[0]) + '</span>'; i += 2; continue; }
      if ((m = /^\$[^$]*\$/.exec(rest))) { out += '<span class="tk-str">' + escH(m[0]) + '</span>'; i += m[0].length; continue; }
      if ('{}[]&'.includes(c)) { out += '<span class="tk-op">' + escH(c) + '</span>'; i++; continue; }
      if ((m = /^\d+(\.\d+)?/.exec(rest))) { out += '<span class="tk-num">' + m[0] + '</span>'; i += m[0].length; continue; }
      out += escH(c); i++;
    }
    return out;
  }
  function hlBibLine(l) {
    let m;
    if ((m = /^(\s*)(@\w+)(\{)([^,]*)(,?)(.*)$/.exec(l))) return m[1] + '<span class="tk-kw">' + escH(m[2]) + '</span><span class="tk-op">{</span><span class="tk-cst">' + escH(m[4]) + '</span>' + escH(m[5] + m[6]);
    if ((m = /^(\s*)(\w+)(\s*=\s*)(.*)$/.exec(l))) return m[1] + '<span class="tk-fn">' + escH(m[2]) + '</span><span class="tk-op">' + escH(m[3]) + '</span><span class="tk-str">' + escH(m[4]) + '</span>';
    return escH(l);
  }
  function render(pre) {
    const bib = pre.classList.contains('bib'), nonum = pre.classList.contains('nonum'), plain = pre.classList.contains('plain');
    const src = pre.textContent.replace(/^\n/, '').replace(/\s+$/, '');
    const marks = (pre.getAttribute('data-mark') || '').split(',').map(Number);
    pre.innerHTML = src.split('\n').map((l, i) => '<span class="cl' + (marks.includes(i + 1) ? ' mk' : '') + '">' + (nonum ? '' : '<span class="cn">' + (i + 1) + '</span>') + ((plain ? escH(l) : bib ? hlBibLine(l) : hlTexLine(l)) || ' ') + '</span>').join('');
    pre.setAttribute('data-hl', '1');
  }

  /* ---------------- KaTeX (optional) ---------------- */
  let kState = 0; const kWait = [];
  function loadKatex(cb) {
    if (window.katex) { cb(true); return; }
    if (kState === 2) { cb(false); return; }
    kWait.push(cb);
    if (kState === 1) return;
    kState = 1;
    const base = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/';
    document.head.append(h('link', { rel: 'stylesheet', href: base + 'katex.min.css' }));
    const s = h('script', { src: base + 'katex.min.js' });
    s.onload = () => { kState = 3; kWait.splice(0).forEach((f) => f(true)); };
    s.onerror = () => { kState = 2; kWait.splice(0).forEach((f) => f(false)); };
    document.head.append(s);
    setTimeout(() => { if (kState === 1) { kState = 2; kWait.splice(0).forEach((f) => f(false)); } }, 6000);
  }
  function math(tex, display, tag) {
    if (window.katex) {
      try { return katex.renderToString(tex + (tag ? '\\tag{' + tag + '}' : ''), { displayMode: display, throwOnError: false }); } catch (e) { /* fall through */ }
    }
    return (display ? '<div class="tx-mathsrc">' : '<code class="tx-mathsrc">') + escH(tex) + (tag ? '   (' + tag + ')' : '') + (display ? '</div>' : '</code>');
  }

  /* ---------------- the previewer ---------------- */
  const SECT = { section: 1, subsection: 2, subsubsection: 3 };
  const NEEDS = {
    includegraphics: 'graphicx', eqref: 'amsmath', text: 'amsmath', url: 'url|hyperref', href: 'hyperref', addbibresource: 'biblatex', printbibliography: 'biblatex',
    align: 'amsmath', 'align*': 'amsmath', 'equation*': 'amsmath', gather: 'amsmath', 'gather*': 'amsmath', algorithmic: 'algpseudocode', algorithm: 'algorithm',
    lstlisting: 'listings', subfigure: 'subcaption', tabularx: 'tabularx', multirow: 'multirow'
  };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const today = () => { const d = new Date(); return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); };

  function compile(source, opts) {
    opts = opts || {};
    const bibdb = opts.bib || {};
    /* strip comments, keep line breaks so line numbers stay right */
    const text = source.split('\n').map((l) => {
      let o = '';
      for (let i = 0; i < l.length; i++) { if (l[i] === '\\') { o += l[i] + (l[i + 1] || ''); i++; continue; } if (l[i] === '%') break; o += l[i]; }
      return o;
    }).join('\n');
    const lineOf = (pos) => text.slice(0, Math.max(0, pos)).split('\n').length;
    let labels = {}, sectionsSeen = [];

    function run(final) {
      const ctx = { errors: [], warnings: [], newLabels: {}, cur: '', sec: [0, 0, 0], eq: 0, fig: 0, tab: 0, alg: 0, fn: [], cites: [], citeNum: {}, bibitems: [], secs: [], pkgs: {}, meta: {}, final };
      const err = (pos, msg) => { if (ctx.errors.length < 30 && !ctx.errors.some((e) => e.msg === msg && e.line === lineOf(pos))) ctx.errors.push({ line: lineOf(pos), msg }); };
      const warn = (msg) => { if (!ctx.warnings.includes(msg)) ctx.warnings.push(msg); };
      const has = (need) => need.split('|').some((p) => ctx.pkgs[p]);

      /* ----- argument readers ----- */
      function group(s, j) { // s[j] must be '{' (after optional spaces) -> [content, next]
        let k = j; while (k < s.length && /[ \t\n]/.test(s[k])) k++;
        if (s[k] !== '{') { if (k < s.length && s[k] !== '\\' && !/\s/.test(s[k])) return [s[k], k + 1]; return [null, j]; }
        let d = 0;
        for (let q = k; q < s.length; q++) {
          if (s[q] === '\\') { q++; continue; }
          if (s[q] === '{') d++;
          else if (s[q] === '}') { d--; if (!d) return [s.slice(k + 1, q), q + 1]; }
        }
        return [s.slice(k + 1), s.length, true];
      }
      function opt(s, j) {
        let k = j; while (k < s.length && /[ \t]/.test(s[k])) k++;
        if (s[k] !== '[') return [null, j];
        const e = s.indexOf(']', k); if (e < 0) return [null, j];
        return [s.slice(k + 1, e), e + 1];
      }
      function envEnd(s, j, name) { // j: just after \begin{name}; -> [bodyEnd, afterEnd]
        const re = /\\(begin|end)\{([^}]*)\}/g; re.lastIndex = j; let d = 1, m;
        while ((m = re.exec(s))) { if (m[2] !== name) continue; if (m[1] === 'begin') d++; else if (!--d) return [m.index, re.lastIndex]; }
        return [s.length, s.length, true];
      }
      function splitTop(s, sep) { // split at top level (outside braces and nested environments)
        const out = []; let d = 0, env = 0, last = 0;
        for (let q = 0; q < s.length; q++) {
          if (s.startsWith('\\begin{', q)) env++;
          else if (s.startsWith('\\end{', q)) env--;
          if (s[q] === '\\' && !(sep === '\\\\' && s[q + 1] === '\\')) { if (sep !== '\\item' || !s.startsWith('\\item', q)) { q++; continue; } }
          if (s[q] === '{') d++; else if (s[q] === '}') d--;
          if (!d && !env && s.startsWith(sep, q) && !(sep === '\\item' && /[A-Za-z]/.test(s[q + 5] || ''))) { out.push([s.slice(last, q), last]); q += sep.length - 1; last = q + 1; }
        }
        out.push([s.slice(last), last]);
        return out;
      }

      /* ----- inline text ----- */
      function inline(s, base) {
        let out = '', i = 0;
        const sp = () => { if (out && !/\s$/.test(out) && !/<br>$/.test(out)) out += ' '; };
        while (i < s.length) {
          const c = s[i];
          if (c === '\\') {
            const nx = s[i + 1];
            if (nx === undefined) { i++; continue; }
            if (!/[A-Za-z]/.test(nx)) {
              i += 2;
              if ('%$&#_{}'.includes(nx)) out += escH(nx);
              else if (nx === '\\') { const [, j2] = opt(s, i); i = j2; out += '<br>'; }
              else if (nx === ' ' || nx === ',' || nx === ';') out += nx === ' ' ? ' ' : '&thinsp;';
              else if (nx === '(') { const e = s.indexOf('\\)', i); if (e < 0) { err(base + i, 'Missing $ inserted.'); } else { out += math(s.slice(i, e), false); i = e + 2; } }
              else if (nx === '-' || nx === '/') { /* discretionary hyphen, italic correction */ }
              else if (nx === '[') { const e = s.indexOf('\\]', i); out += math(s.slice(i, e < 0 ? s.length : e), true); i = e < 0 ? s.length : e + 2; }
              else err(base + i - 2, 'Undefined control sequence \\' + nx + '.');
              continue;
            }
            const m = /^[A-Za-z]+\*?/.exec(s.slice(i + 1)); const raw = m[0], name = raw.replace('*', '');
            const at = i; i += 1 + raw.length;
            const arg = () => { const [a, j2, bad] = group(s, i); if (a == null) { err(base + at, 'Missing argument for \\' + name + '.'); return ''; } if (bad) err(base + at, 'File ended while scanning use of \\' + name + '.'); i = j2; return a; };
            const optArg = () => { const [a, j2] = opt(s, i); i = j2; return a; };
            const wrap = (tag, cls) => { const a = arg(); out += '<' + tag + (cls ? ' class="' + cls + '"' : '') + '>' + inline(a, base + i - a.length - 1) + '</' + tag + '>'; };
            if (NEEDS[name] && !has(NEEDS[name])) { err(base + at, 'Undefined control sequence \\' + name + '.  (Did you forget \\usepackage{' + NEEDS[name].split('|')[0] + '}?)'); arg(); continue; }
            switch (name) {
              case 'textbf': wrap('b'); break;
              case 'textit': case 'emph': case 'textsl': wrap('i'); break;
              case 'underline': wrap('u'); break;
              case 'texttt': wrap('code', 'tx-tt'); break;
              case 'textsc': wrap('span', 'tx-sc'); break;
              case 'textsf': wrap('span', 'tx-sf'); break;
              case 'text': wrap('span'); break;
              case 'textcolor': { const col = arg(); const a = arg(); out += '<span style="color:' + escH(col) + '">' + inline(a, base + i) + '</span>'; break; }
              case 'LaTeX': out += '<span class="tx-logo">L<sup>a</sup>T<sub>e</sub>X</span>'; if (s[i] === '{' && s[i + 1] === '}') i += 2; break;
              case 'TeX': out += '<span class="tx-logo">T<sub>e</sub>X</span>'; if (s[i] === '{' && s[i + 1] === '}') i += 2; break;
              case 'today': out += today(); break;
              case 'ldots': case 'dots': out += '…'; break;
              case 'textbackslash': out += '\\'; break;
              case 'newline': case 'linebreak': out += '<br>'; break;
              case 'noindent': case 'par': case 'centering': case 'raggedright': case 'small': case 'large': case 'Large': case 'footnotesize': case 'normalsize': case 'bfseries': case 'itshape': case 'hfill': case 'quad': case 'qquad': case 'medskip': case 'bigskip': case 'smallskip': case 'protect': case 'nonumber': sp(); break;
              case 'vspace': case 'hspace': arg(); break;
              case 'label': { const key = arg(); ctx.newLabels[key] = ctx.cur || '??'; break; }
              case 'ref': case 'pageref': { const key = arg(); const v = name === 'pageref' ? '1' : labels[key]; if (v == null) { if (final) warn("Reference `" + key + "' on page 1 undefined."); out += '<b>??</b>'; } else out += '<a class="tx-ref">' + escH(v) + '</a>'; break; }
              case 'eqref': { const key = arg(); const v = labels[key]; if (v == null) { if (final) warn("Reference `" + key + "' on page 1 undefined."); out += '(<b>??</b>)'; } else out += '(<a class="tx-ref">' + escH(v) + '</a>)'; break; }
              case 'cite': {
                optArg(); const keys = arg().split(',').map((k) => k.trim()).filter(Boolean);
                const nums = keys.map((k) => {
                  if (!(k in ctx.citeNum)) { if (bibdb[k] || ctx.bibKeys && ctx.bibKeys.includes(k)) { ctx.cites.push(k); ctx.citeNum[k] = ctx.cites.length; } }
                  const n = ctx.citeNum[k] || (labels['bib:' + k]);
                  if (!n) { if (final) warn("Citation `" + k + "' on page 1 undefined."); return '<b>?</b>'; }
                  return n;
                });
                out += '[' + nums.join(', ') + ']'; break;
              }
              case 'footnote': { const a = arg(); ctx.fn.push(inline(a, base + i)); out += '<sup class="tx-fn">' + ctx.fn.length + '</sup>'; break; }
              case 'url': { const a = arg(); out += '<code class="tx-tt">' + escH(a) + '</code>'; break; }
              case 'href': { const u = arg(); const a = arg(); out += '<a class="tx-ref" title="' + escH(u) + '">' + inline(a, base + i) + '</a>'; break; }
              case 'verb': { const d = s[i], e = s.indexOf(d, i + 1); out += '<code class="tx-tt">' + escH(s.slice(i + 1, e < 0 ? s.length : e)) + '</code>'; i = e < 0 ? s.length : e + 1; break; }
              case 'includegraphics': { const o = optArg() || ''; const f = arg(); const wm = /width\s*=\s*([\d.]+)\s*\\(textwidth|linewidth)/.exec(o); const ang = /angle\s*=\s*(-?\d+)/.exec(o); out += '<span class="tx-img" style="width:' + (wm ? Math.min(100, +wm[1] * 100) : 60) + '%' + (ang ? ';transform:rotate(' + ang[1] + 'deg)' : '') + '"><span>🖼 ' + escH(f) + '</span></span>'; break; }
              case 'caption': case 'maketitle': case 'section': case 'subsection': case 'subsubsection': arg(); break;
              case 'item': err(base + at, 'LaTeX Error: Lonely \\item--perhaps a missing list environment.'); break;
              case 'hline': case 'toprule': case 'midrule': case 'bottomrule': case 'cline': if (name === 'cline') arg(); break;
              case 'multicolumn': { arg(); arg(); const a = arg(); out += inline(a, base + i); break; }
              case 'alpha': case 'beta': case 'gamma': case 'pi': case 'mu': case 'sigma': case 'infty': err(base + at, 'Missing $ inserted.  (\\' + name + ' only works in maths mode: write $\\' + name + '$.)'); break;
              default: err(base + at, 'Undefined control sequence \\' + name + '.');
                out += '<span class="tx-bad">\\' + escH(raw) + '</span>';
            }
            continue;
          }
          if (c === '$') {
            const dbl = s[i + 1] === '$';
            const e = dbl ? s.indexOf('$$', i + 2) : s.indexOf('$', i + 1);
            let ee = e; while (ee > 0 && s[ee - 1] === '\\' && !dbl) ee = s.indexOf('$', ee + 1);
            if (ee < 0) { err(base + i, 'Missing $ inserted.  (A $ opens maths mode but nothing closes it.)'); out += escH(s.slice(i + 1)); break; }
            out += math(s.slice(i + (dbl ? 2 : 1), ee), dbl); i = ee + (dbl ? 2 : 1); continue;
          }
          if (c === '{' || c === '}') { i++; continue; }
          if (c === '&') { err(base + i, 'Misplaced alignment tab character &.  (Write \\& for an ampersand.)'); out += '&amp;'; i++; continue; }
          if (c === '#') { err(base + i, "You can't use `macro parameter character #' in horizontal mode.  (Write \\#.)"); out += '#'; i++; continue; }
          if (c === '_' || c === '^') { err(base + i, 'Missing $ inserted.  (' + c + ' only works in maths mode; write \\' + (c === '_' ? '_' : '^{}') + ' for the character.)'); out += c; i++; continue; }
          if (c === '~') { out += '&nbsp;'; i++; continue; }
          if (c === '`') { if (s[i + 1] === '`') { out += '“'; i += 2; } else { out += '‘'; i++; } continue; }
          if (c === "'") { if (s[i + 1] === "'") { out += '”'; i += 2; } else { out += '’'; i++; } continue; }
          if (c === '-' && s[i + 1] === '-') { if (s[i + 2] === '-') { out += '—'; i += 3; } else { out += '–'; i += 2; } continue; }
          if (c === '"') { out += '"'; i++; continue; }
          if (/\s/.test(c)) { sp(); i++; continue; }
          out += escH(c); i++;
        }
        return out.trim();
      }

      /* ----- environments ----- */
      function envHTML(name, body, base, optv, argv, at) {
        if (NEEDS[name] && !has(NEEDS[name])) { err(at, 'LaTeX Error: Environment ' + name + ' undefined.  (Did you forget \\usepackage{' + NEEDS[name].split('|')[0] + '}?)'); return ''; }
        switch (name) {
          case 'itemize': case 'enumerate': case 'description': {
            const parts = splitTop(body, '\\item');
            if (parts[0][0].trim()) err(base, 'LaTeX Error: Something\'s wrong--perhaps a missing \\item.');
            const tag = name === 'enumerate' ? 'ol' : 'ul';
            return '<' + tag + ' class="tx-list' + (name === 'description' ? ' tx-desc' : '') + '">' + parts.slice(1).map(([p, off]) => {
              let lab = '', q = p;
              const o = /^\s*\[([^\]]*)\]/.exec(q); if (o) { lab = o[1]; q = q.slice(o[0].length); }
              return '<li>' + (lab ? '<b>' + inline(lab, base + off) + '</b> ' : '') + blocks(q, base + off + 5, true) + '</li>';
            }).join('') + '</' + tag + '>';
          }
          case 'equation': case 'equation*': case 'displaymath': {
            let tag = null;
            if (name === 'equation') { ctx.eq++; tag = String(ctx.eq); ctx.cur = tag; }
            const b = body.replace(/\\label\{([^}]*)\}/g, (m0, k) => { ctx.newLabels[k] = tag || '??'; return ''; });
            if (/\n\s*\n/.test(b)) err(at, 'Missing $ inserted.  (Blank lines are not allowed inside maths.)');
            return '<div class="tx-disp">' + math(b.trim(), true, tag) + '</div>';
          }
          case 'align': case 'align*': case 'gather': case 'gather*': {
            const rows = splitTop(body, '\\\\').map((r) => r[0]).filter((r) => r.trim());
            const numbered = !name.endsWith('*');
            if (!numbered) return '<div class="tx-disp">' + math('\\begin{' + (name.startsWith('align') ? 'aligned' : 'gathered') + '}' + body.replace(/\\label\{[^}]*\}/g, '') + '\\end{' + (name.startsWith('align') ? 'aligned' : 'gathered') + '}', true) + '</div>';
            return rows.map((r) => {
              let tag = null;
              if (!/\\nonumber|\\notag/.test(r)) { ctx.eq++; tag = String(ctx.eq); ctx.cur = tag; }
              const b = r.replace(/\\nonumber|\\notag/g, '').replace(/\\label\{([^}]*)\}/g, (m0, k) => { ctx.newLabels[k] = tag || '??'; return ''; });
              return '<div class="tx-disp">' + math('\\begin{aligned}' + b + '\\end{aligned}', true, tag) + '</div>';
            }).join('');
          }
          case 'center': return '<div class="tx-center">' + blocks(body, base) + '</div>';
          case 'flushright': return '<div style="text-align:right">' + blocks(body, base) + '</div>';
          case 'flushleft': return '<div style="text-align:left">' + blocks(body, base) + '</div>';
          case 'quote': case 'quotation': return '<blockquote class="tx-quote">' + blocks(body, base) + '</blockquote>';
          case 'abstract': return '<div class="tx-abs"><div class="tx-abs-h">Abstract</div>' + blocks(body, base) + '</div>';
          case 'verbatim': case 'lstlisting': return '<pre class="tx-verb">' + escH(body.replace(/^\n/, '').replace(/\s+$/, '')) + '</pre>';
          case 'tabular': case 'tabularx': {
            const spec = (name === 'tabularx' ? argv[1] : argv[0]) || '';
            const cols = (spec.replace(/\{[^}]*\}/g, '').match(/[lcrpXm]/g) || []);
            const vbars = spec.replace(/\{[^}]*\}/g, '');
            const rows = splitTop(body, '\\\\');
            const out = []; let pending = false;
            rows.forEach(([r, off]) => {
              const rules = (r.match(/\\(hline|toprule|midrule|bottomrule)/g) || []).length;
              const rr = r.replace(/\\(hline|toprule|midrule|bottomrule)/g, '');
              if (!rr.trim()) { if (rules && out.length) out[out.length - 1].rb = true; else if (rules) pending = true; return; }
              const lead = /^\s*\\(hline|toprule|midrule)/.test(r);
              const cells = splitTop(rr, '&');
              if (cells.length > cols.length) err(base + off, 'Extra alignment tab has been changed to \\cr.  (This row has more cells than the column spec {' + spec + '} allows.)');
              if ((lead || pending) && out.length) out[out.length - 1].rb = true;
              out.push({ rt: (lead || pending) && !out.length, cells: cells.map(([cc, o2], ci) => '<td style="text-align:' + (cols[ci] === 'c' ? 'center' : cols[ci] === 'r' ? 'right' : 'left') + '">' + inline(cc, base + off + o2) + '</td>').join('') });
              pending = false;
            });
            let html = '<table class="tx-tab' + (/\|/.test(vbars) ? ' vb' : '') + '">' + out.map((r) => '<tr class="' + (r.rt ? 'rt ' : '') + (r.rb ? 'rb' : '') + '">' + r.cells + '</tr>').join('');
            return html + '</table>';
          }
          case 'figure': case 'table': case 'algorithm': case 'subfigure': {
            const sub = name === 'subfigure';
            let cap = null, capPos = 0; const inner = body.replace(/\\caption\{/g, '\\caption{');
            const ci = inner.indexOf('\\caption');
            let rest = inner;
            let num;
            if (sub) { ctx.subN = (ctx.subN || 0) + 1; num = String.fromCharCode(96 + ctx.subN); }
            else if (name === 'figure') { ctx.fig++; num = String(ctx.fig); ctx.subN = 0; }
            else if (name === 'table') { ctx.tab++; num = String(ctx.tab); }
            else { ctx.alg++; num = String(ctx.alg); }
            const saved = ctx.cur; ctx.cur = sub ? (ctx.fig + 1) + num : num;
            if (ci >= 0) { const [a, j2] = group(inner, ci + 8); cap = a; capPos = ci; rest = inner.slice(0, ci) + inner.slice(j2); }
            // a label after the caption refers to this float
            rest = rest.replace(/\\label\{([^}]*)\}/g, (m0, k) => { ctx.newLabels[k] = sub ? (ctx.fig + 1) + num : num; return ''; });
            const content = blocks(rest, base);
            ctx.cur = saved;
            const w = sub && argv[0] ? /([\d.]+)\\(textwidth|linewidth)/.exec(argv[0]) : null;
            const capHTML = cap != null ? '<div class="tx-cap">' + (sub ? '(' + num + ') ' : '<b>' + (name === 'figure' ? 'Figure' : name === 'table' ? 'Table' : 'Algorithm') + ' ' + num + ':</b> ') + inline(cap, base + capPos) + '</div>' : '';
            if (name === 'table' || name === 'algorithm') return '<div class="tx-float">' + capHTML + content + '</div>';
            return '<div class="tx-float' + (sub ? ' tx-sub' : '') + '"' + (w ? ' style="width:' + (+w[1] * 100) + '%"' : '') + '>' + content + capHTML + '</div>';
          }
          case 'algorithmic': {
            const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
            let depth = 0, n = 0;
            const numbered = optv === '1';
            const kw = (t) => '<b>' + t + '</b>';
            return '<div class="tx-alg">' + lines.map((l) => {
              let m, txt = '', d = depth;
              const mth = (x) => inline('$' + x + '$', base);
              if ((m = /^\\State\s*(.*)$/.exec(l))) txt = inline(m[1], base);
              else if ((m = /^\\If\{(.*)\}\s*$/.exec(l))) { txt = kw('if') + ' ' + inline(m[1], base) + ' ' + kw('then'); depth++; }
              else if ((m = /^\\ElsIf\{(.*)\}\s*$/.exec(l))) { d = depth - 1; txt = kw('else if') + ' ' + inline(m[1], base) + ' ' + kw('then'); }
              else if (/^\\Else/.test(l)) { d = depth - 1; txt = kw('else'); }
              else if (/^\\EndIf/.test(l)) { depth--; d = depth; txt = kw('end if'); }
              else if ((m = /^\\For\{(.*)\}\s*$/.exec(l))) { txt = kw('for') + ' ' + inline(m[1], base) + ' ' + kw('do'); depth++; }
              else if (/^\\EndFor/.test(l)) { depth--; d = depth; txt = kw('end for'); }
              else if ((m = /^\\While\{(.*)\}\s*$/.exec(l))) { txt = kw('while') + ' ' + inline(m[1], base) + ' ' + kw('do'); depth++; }
              else if (/^\\EndWhile/.test(l)) { depth--; d = depth; txt = kw('end while'); }
              else if ((m = /^\\Return\s*(.*)$/.exec(l))) txt = kw('return') + ' ' + inline(m[1], base);
              else if ((m = /^\\Require\s*(.*)$/.exec(l))) { txt = kw('Require:') + ' ' + inline(m[1], base); return '<div class="tx-algl">' + txt + '</div>'; }
              else if ((m = /^\\Ensure\s*(.*)$/.exec(l))) { txt = kw('Ensure:') + ' ' + inline(m[1], base); return '<div class="tx-algl">' + txt + '</div>'; }
              else txt = inline(l, base);
              void mth; n++;
              return '<div class="tx-algl">' + (numbered ? '<span class="tx-algn">' + n + ':</span>' : '') + '<span style="padding-left:' + (Math.max(0, d) * 1.4) + 'em">' + txt + '</span></div>';
            }).join('') + '</div>';
          }
          case 'thebibliography': {
            const items = splitTop(body, '\\bibitem').slice(1);
            ctx.bibKeys = [];
            return '<div class="tx-bib"><h4 class="tx-h1">References</h4><ol>' + items.map(([p, off], k) => {
              const [key, j2] = group(p, 0); ctx.bibKeys.push(key); ctx.newLabels['bib:' + key] = String(k + 1);
              return '<li>' + inline(p.slice(j2), base + off) + '</li>';
            }).join('') + '</ol></div>';
          }
          case 'document': err(at, 'LaTeX Error: Can be used only in preamble.'); return '';
          default: err(at, 'LaTeX Error: Environment ' + name + ' undefined.'); return '';
        }
      }

      /* ----- block level ----- */
      function blocks(s, base, tight) {
        let out = '', para = '', pStart = 0, i = 0;
        const flush = () => { if (para.trim()) { const t = inline(para, base + pStart); if (t.replace(/&nbsp;/g, '').trim()) out += tight && !out ? t : '<p>' + t + '</p>'; } para = ''; };
        const add = (t) => { if (!para) pStart = i; para += t; };
        while (i < s.length) {
          const c = s[i];
          if (c === '\n') { const m = /^\n[ \t]*\n\s*/.exec(s.slice(i)); if (m) { flush(); i += m[0].length; continue; } add(' '); i++; continue; }
          if (c === '$' && s[i + 1] === '$') { const e = s.indexOf('$$', i + 2); if (e >= 0) { flush(); out += '<div class="tx-disp">' + math(s.slice(i + 2, e), true) + '</div>'; i = e + 2; continue; } }
          if (c === '\\') {
            const nx = s[i + 1];
            if (nx === '[') { flush(); const e = s.indexOf('\\]', i + 2); out += '<div class="tx-disp">' + math(s.slice(i + 2, e < 0 ? s.length : e), true) + '</div>'; if (e < 0) err(base + i, 'Missing $ inserted.  (\\[ has no matching \\].)'); i = e < 0 ? s.length : e + 2; continue; }
            const m = /^\\([A-Za-z]+)(\*?)/.exec(s.slice(i));
            if (!m) { add(s.slice(i, i + 2)); i += 2; continue; }
            const name = m[1], star = m[2], at = i;
            if (name === 'begin') {
              flush();
              const [env, j2] = group(s, i + 6);
              if (env == null) { err(base + at, 'Missing \\begin argument.'); i += 6; continue; }
              let j = j2, optv = null, argv = [];
              if (['tabular', 'tabularx', 'thebibliography', 'subfigure', 'minipage'].includes(env)) {
                const [o, j3] = opt(s, j); optv = o; j = j3;
                const [a1, j4] = group(s, j); argv.push(a1); j = j4;
                if (env === 'tabularx') { const [a2, j5] = group(s, j); argv.push(a2); j = j5; }
              } else { const [o, j3] = opt(s, j); optv = o; j = j3; }
              const [be, ae, missing] = envEnd(s, j, env);
              if (missing) err(base + at, 'LaTeX Error: \\begin{' + env + '} on input line ' + lineOf(base + at) + ' ended by \\end{document}.');
              out += env === 'minipage' ? '<div class="tx-mini">' + blocks(s.slice(j, be), base + j) + '</div>' : envHTML(env, s.slice(j, be), base + j, optv, argv, base + at);
              i = ae; continue;
            }
            if (name === 'end') { const [env, j2] = group(s, i + 4); err(base + at, 'LaTeX Error: \\end{' + env + '} without a matching \\begin{' + env + '}.'); i = j2; continue; }
            if (SECT[name]) {
              flush();
              const [t, j2] = group(s, i + m[0].length);
              const lvl = SECT[name];
              let num = '';
              if (!star) { ctx.sec[lvl - 1]++; for (let q = lvl; q < 3; q++) ctx.sec[q] = 0; num = ctx.sec.slice(0, lvl).join('.'); ctx.cur = num; }
              ctx.secs.push({ lvl, num, t: inline(t || '', base + i) });
              out += '<h' + (lvl + 3) + ' class="tx-h' + lvl + '">' + (num ? '<span class="tx-num">' + num + '</span>' : '') + inline(t || '', base + i) + '</h' + (lvl + 3) + '>';
              i = j2; continue;
            }
            if (name === 'maketitle') {
              flush();
              const M = ctx.meta;
              if (M.title == null) err(base + at, 'LaTeX Error: No \\title given.');
              out += '<div class="tx-title"><div class="tx-t">' + (M.title || '') + '</div>' + (M.author ? '<div class="tx-a">' + M.author + '</div>' : '') + (M.date !== '' ? '<div class="tx-d">' + (M.date == null ? today() : M.date) + '</div>' : '') + '</div>';
              i += m[0].length; continue;
            }
            if (name === 'tableofcontents') {
              flush();
              out += '<div class="tx-toc"><h4 class="tx-h1">Contents</h4>' + (sectionsSeen.length ? sectionsSeen.map((q) => '<div class="tx-toc' + q.lvl + '">' + (q.num ? '<span class="tx-num">' + q.num + '</span>' : '') + q.t + '</div>').join('') : '<p class="tx-note">(Compile again to fill in the contents.)</p>') + '</div>';
              i += m[0].length; continue;
            }
            if (name === 'printbibliography' || name === 'bibliography') {
              flush();
              if (name === 'bibliography') group(s, i + m[0].length);
              if (name === 'printbibliography' && !has('biblatex')) { err(base + at, 'Undefined control sequence \\printbibliography.  (Did you forget \\usepackage{biblatex}?)'); i += m[0].length; continue; }
              const keys = ctx.cites;
              out += '<div class="tx-bib"><h4 class="tx-h1">References</h4>' + (keys.length ? '<ol>' + keys.map((k) => '<li>' + fmtBib(bibdb[k]) + '</li>').join('') + '</ol>' : '<p class="tx-note">Nothing is cited yet, so the list is empty.</p>') + '</div>';
              i += m[0].length; if (name === 'bibliography') i = group(s, i)[1]; continue;
            }
            if (name === 'newpage' || name === 'clearpage') { flush(); out += '<hr class="tx-page">'; i += m[0].length; continue; }
            if (name === 'item') { flush(); err(base + at, 'LaTeX Error: Lonely \\item--perhaps a missing list environment.'); i += 5; continue; }
            if (name === 'documentclass' || name === 'usepackage') { err(base + at, 'LaTeX Error: Can be used only in preamble.'); i += m[0].length; const [, j3] = opt(s, i); const [, j4] = group(s, j3); i = j4; continue; }
            // any other command: part of the paragraph (inline handles it)
            add(s.slice(i, i + m[0].length)); i += m[0].length; continue;
          }
          add(c); i++;
        }
        flush();
        return out;
      }

      /* ----- preamble ----- */
      const bd = text.indexOf('\\begin{document}');
      const dc = /\\documentclass(\[[^\]]*\])?\{([^}]*)\}/.exec(text);
      if (!dc) err(0, 'LaTeX Error: Missing \\documentclass.  (Every document starts with \\documentclass{article}.)');
      if (bd < 0) { err(text.length, 'LaTeX Error: Missing \\begin{document}.'); }
      const pre = bd < 0 ? '' : text.slice(0, bd);
      pre.replace(/\\usepackage(\[[^\]]*\])?\{([^}]*)\}/g, (m0, o, p) => { p.split(',').forEach((x) => { ctx.pkgs[x.trim()] = true; }); return ''; });
      const metaArg = (cmd) => { const q = pre.indexOf('\\' + cmd + '{'); if (q < 0) return null; const [a] = group(pre, q + cmd.length + 1); return a; };
      ['title', 'author', 'date'].forEach((k) => { const v = metaArg(k); if (v != null) ctx.meta[k] = inline(v.replace(/\\and/g, ', '), pre.indexOf('\\' + k)); });
      if (pre.indexOf('\\date{}') >= 0) ctx.meta.date = '';
      const pm = /\\(addbibresource)\{/.exec(pre); if (pm && !ctx.pkgs.biblatex) err(pre.indexOf(pm[0]), 'Undefined control sequence \\addbibresource.  (Did you forget \\usepackage{biblatex}?)');
      // stray text in the preamble
      const stray = pre.replace(/\\[A-Za-z]+\*?(\[[^\]]*\])?(\{[^{}]*(\{[^{}]*\}[^{}]*)*\})*/g, '').replace(/[\s{}]/g, '');
      if (stray.length > 0 && bd >= 0) err(0, 'LaTeX Error: Missing \\begin{document}.  (There is text before \\begin{document}.)');
      const ed = text.indexOf('\\end{document}');
      const body = bd < 0 ? text : text.slice(bd + 16, ed < 0 ? text.length : ed);
      if (bd >= 0 && ed < 0) err(text.length, '*** (job aborted, no legal \\end found)  (Add \\end{document}.)');
      // stray closing braces
      let depth = 0;
      for (let q = 0; q < body.length; q++) { if (body[q] === '\\') { q++; continue; } if (body[q] === '{') depth++; else if (body[q] === '}') { depth--; if (depth < 0) { err(bd + 16 + q, "Too many }'s."); depth = 0; } } }
      if (depth > 0) err(ed < 0 ? text.length : ed, 'Missing } inserted.  (A { was opened but never closed.)');
      let html = blocks(body, bd < 0 ? 0 : bd + 16);
      if (ctx.fn.length) html += '<div class="tx-fns">' + ctx.fn.map((f, k) => '<div><sup>' + (k + 1) + '</sup> ' + f + '</div>').join('') + '</div>';
      return { html, ctx };
    }

    const first = run(false);
    labels = first.ctx.newLabels; sectionsSeen = first.ctx.secs;
    const second = run(true);
    return { html: second.html, errors: second.ctx.errors.sort((a, b) => a.line - b.line), warnings: second.ctx.warnings, meta: second.ctx.meta };
  }

  function fmtBib(e) {
    if (!e) return '<b>?</b>';
    const au = (e.author || '').split(/\s+and\s+/).map((a) => { const p = a.split(',').map((x) => x.trim()); return p.length > 1 ? p[1].split(/\s+/).map((x) => x[0] + '.').join(' ') + ' ' + p[0] : a; }).join(', ');
    return escH(au) + ', “' + escH(e.title || '') + ',” ' + (e.journal ? '<i>' + escH(e.journal) + '</i>' : e.booktitle ? 'in <i>' + escH(e.booktitle) + '</i>' : e.publisher ? escH(e.publisher) : '') + (e.volume ? ', vol. ' + escH(e.volume) : '') + (e.number ? ', no. ' + escH(e.number) : '') + (e.pages ? ', pp. ' + escH(e.pages.replace('--', '–')) : '') + (e.year ? ', ' + escH(e.year) : '') + '.';
  }

  return { render, compile, loadKatex, fmtBib, hlTexLine, escH };
})();
