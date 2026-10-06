/* ===================== page.js : mounts code blocks, figures, demos and quizzes ===================== */
function mountPage(root) {
  root = root || document;
  const fail = (ph, what, e) => { ph.append(h('p', { class: 'bad' }, `This ${what} could not start: ${e.message}`)); if (window.console) console.error(e); };
  root.querySelectorAll('pre.code:not([data-hl])').forEach((pre) => { try { TeX.render(pre); } catch (e) { /* leave plain text */ } });
  try { TeX.mountOutputs(root); } catch (e) { /* outputs stay empty */ }
  root.querySelectorAll('figure.fig[data-fig]').forEach((fig) => {
    const id = fig.getAttribute('data-fig');
    try { fig.insertBefore(h('div', { class: 'fig-box' }, FIGS[id]()), fig.querySelector('figcaption')); } catch (e) { fail(fig, 'figure', e); }
  });
  root.querySelectorAll('[data-demo]').forEach((ph) => {
    const id = ph.getAttribute('data-demo');
    try { DEMOS[id](ph); } catch (e) { fail(ph, 'demo', e); }
  });
  root.querySelectorAll('.quiz-host').forEach((ph) => {
    const j = ph.parentNode.querySelector('script.quiz-json');
    if (j) mountQuiz(ph, JSON.parse(j.textContent), ph.getAttribute('data-quiz-key'));
  });
  root.querySelectorAll('button.copy-btn').forEach((b) => b.addEventListener('click', () => {
    const src = document.getElementById(b.getAttribute('data-target'));
    const txt = src ? (src.getAttribute('data-raw') || src.textContent) : '';
    const done = () => { const o = b.textContent; b.textContent = 'Copied ✓'; setTimeout(() => { b.textContent = o; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, () => {}); else { const t = h('textarea', null, txt); document.body.append(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ } t.remove(); }
  }));
}
