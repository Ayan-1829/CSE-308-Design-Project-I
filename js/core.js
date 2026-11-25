/* ===================== core.js : shared helpers ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ---------- light/dark theme toggle, shared by every page ---------- */
(function () {
  const KEY = 'dp-theme';
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage unavailable */ }
  function effective() {
    if (saved === 'dark' || saved === 'light') return saved;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  function apply() {
    if (saved === 'dark' || saved === 'light') document.documentElement.setAttribute('data-theme', saved);
    else document.documentElement.removeAttribute('data-theme');
  }
  const SUN = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"></path>';
  const MOON = '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"></path>';
  function paint(btn) {
    const dark = effective() === 'dark', label = btn.querySelector('span'), icon = btn.querySelector('.btn-ic');
    if (label) label.textContent = dark ? 'Light mode' : 'Dark mode'; else btn.textContent = dark ? 'Light mode' : 'Dark mode';
    if (icon) icon.innerHTML = dark ? SUN : MOON;
    btn.setAttribute('aria-pressed', String(dark));
  }
  apply();
  const btn = document.getElementById('btn-theme');
  if (btn) {
    paint(btn);
    btn.addEventListener('click', () => {
      saved = effective() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, saved); } catch (e) { /* storage unavailable */ }
      apply(); paint(btn);
    });
  }
})();

function mk(ns, tag, attrs, kids) {
  const e = ns ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'html') e.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') { for (const p in v) { if (p.slice(0, 2) === '--') e.style.setProperty(p, v[p]); else e.style[p] = v[p]; } }
    else if (k.slice(0, 2) === 'on' && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    e.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return e;
}
const h = (tag, attrs, ...kids) => mk(false, tag, attrs, kids);
const sv = (tag, attrs, ...kids) => mk(true, tag, attrs, kids);
const clear = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };

const App = {
  cleanups: [],
  onCleanup(fn) { this.cleanups.push(fn); },
  timer(fn, ms) { const id = setInterval(fn, ms); this.onCleanup(() => clearInterval(id)); return id; }
};

/* ---------- storage (localStorage guarded by try/catch) ---------- */
const Store = (() => {
  const KEY = 'dp-slides-v1';
  let mem = {};
  try { const raw = localStorage.getItem(KEY); if (raw) mem = JSON.parse(raw) || {}; } catch (e) { mem = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* storage unavailable */ } };
  return {
    get(k, d) { return mem[k] === undefined ? d : mem[k]; },
    set(k, v) { mem[k] = v; save(); },
    sub(k, id) { return (mem[k] || {})[id]; },
    setSub(k, id, v) { mem[k] = mem[k] || {}; mem[k][id] = v; save(); }
  };
})();
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }

/* ---------- small utils ---------- */
const range = (n) => Array.from({ length: n }, (_, i) => i);
const rnd = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rnd(a.length)];
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- widgets ---------- */
function tsw(label, init, onChange) {
  let v = init ? 1 : 0;
  const el = h('button', { type: 'button', class: 'tsw' + (v ? ' on' : ''), role: 'switch', 'aria-checked': String(!!v), 'aria-label': label },
    h('span', { class: 'track' }, h('span', { class: 'knob' })), label ? h('span', null, label) : null);
  const api = {
    el, get: () => v,
    set(x, silent) { v = x ? 1 : 0; el.classList.toggle('on', !!v); el.setAttribute('aria-checked', String(!!v)); if (!silent && onChange) onChange(v); }
  };
  el.addEventListener('click', () => api.set(v ? 0 : 1));
  return api;
}
function seg(options, value, onChange) {
  const opts = options.map((o) => (typeof o === 'object' ? o : { v: o, l: String(o) }));
  let cur = value;
  const btns = opts.map((o) => h('button', { type: 'button', class: o.v === cur ? 'on' : '', onclick: () => api.set(o.v) }, o.l));
  const el = h('div', { class: 'seg', role: 'group' }, btns);
  const api = {
    el, get: () => cur,
    set(v, silent) { cur = v; opts.forEach((o, i) => btns[i].classList.toggle('on', o.v === v)); if (!silent && onChange) onChange(v); }
  };
  return api;
}
function tabs(items, initial, render) {
  const body = h('div');
  const bar = h('div', { class: 'tabs', role: 'tablist' });
  let cl = [];
  const reg = (fn) => cl.push(fn);
  const closeAll = () => { cl.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); cl = []; };
  const btns = items.map((it) => h('button', { type: 'button', role: 'tab', onclick: () => sel(it.id) }, it.label));
  btns.forEach((b) => bar.append(b));
  function sel(id) {
    closeAll();
    items.forEach((it, i) => btns[i].classList.toggle('on', it.id === id));
    clear(body); render(id, body, reg);
  }
  const el = h('div', null, bar, body);
  sel(initial || items[0].id);
  return { el, sel };
}
function tableEl(headers, rows, cls) {
  return h('table', { class: cls || 'tt' },
    h('thead', null, h('tr', null, headers.map((x) => h('th', null, x)))),
    h('tbody', null, rows.map((r) => h('tr', null, r.map((c) => (c && c.nodeType ? h('td', null, c) : h('td', null, c)))))));
}
function field(label, input) { return h('label', { class: 'fld' }, label, input); }
function numInput(value, attrs) { return h('input', Object.assign({ type: 'number', value: String(value), style: { width: '110px' } }, attrs || {})); }
function textInput(value, attrs) { return h('input', Object.assign({ type: 'text', value: String(value), autocomplete: 'off', spellcheck: 'false' }, attrs || {})); }
function selectEl(options, value, onChange) {
  const s = h('select', { onchange: () => onChange && onChange(s.value) }, options.map((o) => {
    const v = typeof o === 'object' ? o.v : o, l = typeof o === 'object' ? o.l : o;
    return h('option', { value: v, selected: String(v) === String(value) }, l);
  }));
  return s;
}
/* a small console panel: api.set(text) */
function consoleEl(label) {
  const pre = h('pre', { class: 'console-body' });
  const el = h('div', { class: 'console' }, h('div', { class: 'console-h' }, label || 'Output'), pre);
  return { el, set(t) { pre.textContent = t; }, get: () => pre.textContent };
}

/* steady:begin -- GUB/_tools/scrollfix/steady.js, added by install.py; edit there, not here.
   Clicking a control inside a slide or a demo must not move the page. Demos often re-render and replace
   the clicked button, and the browser may then scroll: a focus() call, focus moving to a new element,
   or content shrinking for a moment. For a short while after such a click, every scrollable box that
   contains the control is put back where it was, unless the reader scrolls in the meantime.
   Links, slide navigation and anything marked data-scroll-ok are left alone. */
(function () {
  if (window.__steady) return;
  window.__steady = true;
  var SKIP = 'a[href], [data-scroll-ok], .deck-nav, .deck-top, .topbar, #slide-menu, .slide-menu, .toc, nav';
  var CONTROL = 'button, [role="button"], [role="switch"], [role="tab"], summary, select, input, label, ' +
                '[data-demo], [data-fig], [data-trace], .demo, .fig, .tracer';
  var held = null, until = 0, raf = 0;

  function boxes(el) {
    var out = [];
    for (var e = el && el.parentElement; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      var s = getComputedStyle(e);
      if (/(auto|scroll)/.test(s.overflowY + s.overflowX) && (e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth)) out.push(e);
    }
    out.push(document.scrollingElement || document.documentElement);
    return out.map(function (b) { return { b: b, top: b.scrollTop, left: b.scrollLeft }; });
  }
  function hold(ev) {
    var t = ev.target && ev.target.closest ? ev.target.closest(CONTROL) : null;
    if (!t || t.closest(SKIP)) { if (ev.type === 'pointerdown') held = null; return; }   // e.g. grabbing a scrollbar
    if (held && performance.now() < until) { until = performance.now() + 700; return; }   // same gesture: keep the first position
    held = boxes(t);
    until = performance.now() + 700;
    if (!raf) raf = requestAnimationFrame(keep);
  }
  function restore() {
    if (held) held.forEach(function (h) {
      if (h.b.scrollTop !== h.top) h.b.scrollTop = h.top;
      if (h.b.scrollLeft !== h.left) h.b.scrollLeft = h.left;
    });
  }
  function keep() {
    raf = 0;
    if (!held) return;
    restore();
    if (performance.now() < until) raf = requestAnimationFrame(keep); else held = null;
  }
  function release() { held = null; }
  ['pointerdown', 'click', 'change'].forEach(function (t) { document.addEventListener(t, hold, true); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') hold(e);
    else if (/^(Arrow|Page|Home|End)/.test(e.key)) release();
  }, true);
  ['wheel', 'touchmove'].forEach(function (t) { document.addEventListener(t, release, { capture: true, passive: true }); });
  /* restore synchronously too, so a scroll caused inside the click handler is undone before paint */
  document.addEventListener('click', restore, false);
})();
/* steady:end */

/* zoom:begin -- a zoom button on every figure and diagram image, opening it full screen */
(function FIGZOOM() {
  var SEL = 'figure.fig, .uml-out';
  var ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6"/></svg>';
  function media(box) { return box.querySelector('svg.dg') || box.querySelector('img'); }
  function addButtons(root) {
    (root || document).querySelectorAll(SEL).forEach(function (box) {
      if (box.querySelector(':scope > .fz-btn') || !media(box) || box.closest('.fz-ov')) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'fz-btn no-print'; b.innerHTML = ICON;
      b.setAttribute('aria-label', 'Zoom in on this figure'); b.title = 'Zoom';
      b.addEventListener('click', function (e) { e.stopPropagation(); open(box, b); });
      box.classList.add('fz-has'); box.insertBefore(b, box.firstChild);
    });
  }
  var ov, stage, inner, pct, item, natW, natH, fit, k, opener, pointers = {}, pinch = null, drag = null;
  function build() {
    ov = document.createElement('div'); ov.className = 'fz-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = '<div class="fz-bar"><span class="fz-cap"></span><span class="fz-tools">' +
      '<button type="button" class="fz-t" data-z="out" aria-label="Zoom out">−</button><span class="fz-pct" aria-live="polite"></span>' +
      '<button type="button" class="fz-t" data-z="in" aria-label="Zoom in">+</button><button type="button" class="fz-t fz-w" data-z="fit">Fit</button>' +
      '<button type="button" class="fz-t" data-z="close" aria-label="Close">✕</button></span></div><div class="fz-stage"><div class="fz-inner"></div></div>';
    document.body.appendChild(ov);
    stage = ov.querySelector('.fz-stage'); inner = ov.querySelector('.fz-inner'); pct = ov.querySelector('.fz-pct');
    ov.querySelector('.fz-tools').addEventListener('click', function (e) {
      var z = e.target.closest('[data-z]'); if (!z) return; z = z.getAttribute('data-z');
      if (z === 'close') close(); else if (z === 'fit') setK(fit); else zoomAt(z === 'in' ? 1.25 : 0.8);
    });
    stage.addEventListener('wheel', function (e) { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY); }, { passive: false });
    stage.addEventListener('dblclick', function (e) { e.preventDefault(); if (k > fit * 1.05) setK(fit); else zoomAt(2, e.clientX, e.clientY); });
    stage.addEventListener('pointerdown', function (e) {
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pointers);
      if (ids.length === 2) { var a = pointers[ids[0]], c = pointers[ids[1]]; pinch = { d: Math.hypot(a.x - c.x, a.y - c.y), k: k }; drag = null; }
      else if (ids.length === 1) drag = { x: e.clientX, y: e.clientY, l: stage.scrollLeft, t: stage.scrollTop, moved: false, onBg: e.target === stage || e.target === inner };
      try { stage.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pointers);
      if (pinch && ids.length === 2) {
        var a = pointers[ids[0]], c = pointers[ids[1]];
        setK(pinch.k * Math.hypot(a.x - c.x, a.y - c.y) / (pinch.d || 1), (a.x + c.x) / 2, (a.y + c.y) / 2);
      } else if (drag) {
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) { drag.moved = true; stage.classList.add('fz-drag'); }
        stage.scrollLeft = drag.l - dx; stage.scrollTop = drag.t - dy;
      }
    });
    function up(e) {
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) pinch = null;
      if (drag && !drag.moved && drag.onBg && e.type === 'pointerup') close();   /* a click on the dark area closes */
      drag = null; stage.classList.remove('fz-drag');
    }
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    window.addEventListener('keydown', function (e) {
      if (!ov.classList.contains('on')) return;
      var key = e.key;
      if (key === 'Escape') close();
      else if (key === '+' || key === '=') zoomAt(1.25);
      else if (key === '-' || key === '_') zoomAt(0.8);
      else if (key === '0') setK(fit);
      else if (key === 'Tab') { var f = ov.querySelectorAll('button'); if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } return; }
      else if (key.indexOf('Arrow') === 0 || key === ' ' || key === 'PageUp' || key === 'PageDown' || key === 'Home' || key === 'End') { /* scroll the figure, not the slides */ }
      else return;
      e.stopPropagation(); if (key !== 'Tab' && key.indexOf('Arrow') !== 0) e.preventDefault();
    }, true);
    window.addEventListener('resize', function () { if (ov.classList.contains('on')) { var was = k / fit; measureFit(); setK(fit * was); } });
  }
  function measureFit() {
    var w = stage.clientWidth - 82, hh = stage.clientHeight - 82;
    fit = Math.min(w / natW, hh / natH);
  }
  function setK(nk, cx, cy) {
    nk = Math.max(fit * 0.5, Math.min(nk, Math.max(fit * 8, 4)));
    var r = stage.getBoundingClientRect();
    var px = cx == null ? r.width / 2 : cx - r.left, py = cy == null ? r.height / 2 : cy - r.top;
    var oldW = inner.offsetWidth || 1, oldH = inner.offsetHeight || 1;
    var fx = (stage.scrollLeft + px - inner.offsetLeft) / oldW, fy = (stage.scrollTop + py - inner.offsetTop) / oldH;
    k = nk;
    item.style.width = Math.round(natW * k) + 'px'; item.style.height = Math.round(natH * k) + 'px';
    stage.scrollLeft = inner.offsetLeft + fx * inner.offsetWidth - px; stage.scrollTop = inner.offsetTop + fy * inner.offsetHeight - py;
    pct.textContent = Math.round(k / fit * 100) + '%';
  }
  function zoomAt(f, cx, cy) { setK(k * f, cx, cy); }
  function open(box, btn) {
    if (!ov) build();
    var src = media(box); opener = btn;
    if (src.tagName.toLowerCase() === 'svg') {
      var vb = (src.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
      natW = vb[2] || src.getBoundingClientRect().width; natH = vb[3] || src.getBoundingClientRect().height;
      item = src.cloneNode(true); item.removeAttribute('style'); item.classList.add('fz-item');
    } else {
      var r = src.getBoundingClientRect();
      natW = src.naturalWidth || r.width; natH = src.naturalHeight || r.height;
      if (natW < r.width * 1.5) { natH = natH * (r.width * 1.5 / natW); natW = r.width * 1.5; }   /* vector images: allow a bigger start */
      item = src.cloneNode(true); item.removeAttribute('loading'); item.className = 'fz-item'; item.removeAttribute('style');
    }
    inner.replaceChildren(item);
    inner.classList.toggle('fz-white', !!box.closest('.uml-out') || box.classList.contains('uml-out'));
    var cap = box.querySelector('figcaption'), label = cap ? cap.textContent.trim() : (src.getAttribute('aria-label') || src.getAttribute('alt') || 'Figure');
    ov.querySelector('.fz-cap').textContent = label; ov.setAttribute('aria-label', 'Zoomed figure: ' + label);
    document.documentElement.classList.add('fz-lock');
    ov.classList.add('on');
    measureFit(); k = fit; setK(fit);
    ov.querySelector('[data-z="close"]').focus();
  }
  function close() {
    ov.classList.remove('on'); document.documentElement.classList.remove('fz-lock'); inner.replaceChildren();
    pointers = {}; pinch = drag = null;
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { addButtons(); });
  else addButtons();
  window.addEventListener('load', function () { addButtons(); });
  window.FIGZOOM = { add: addButtons };
})();
/* zoom:end */
