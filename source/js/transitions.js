(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function remember(key) {
    try {
      if (key) sessionStorage.setItem('cosmos-entry', key);
      else sessionStorage.removeItem('cosmos-entry');
    } catch { /* Normal links remain available without storage. */ }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || reducedMotion.matches) return;
    if (link.origin !== location.origin || link.target === '_blank' || link.pathname === location.pathname) return;
    const title = link.matches('[data-entry]') ? link : link.matches('.article-back') ? document.querySelector('h1[data-entry]') : null;
    remember(title?.dataset.entry);
  });
  window.addEventListener('pageswap', event => {
    if (!event.viewTransition || reducedMotion.matches) return;
    let key;
    try { key = sessionStorage.getItem('cosmos-entry'); } catch { return; }
    const title = key && document.querySelector(`[data-entry="${CSS.escape(key)}"]`);
    if (title) {
      title.style.viewTransitionName = 'entry-open';
      event.viewTransition.finished.finally(() => title.style.removeProperty('view-transition-name'));
    }
  });
  window.addEventListener('pagereveal', event => {
    if (!event.viewTransition || reducedMotion.matches) return;
    let key;
    try { key = sessionStorage.getItem('cosmos-entry'); } catch { return; }
    const title = key && document.querySelector(`[data-entry="${CSS.escape(key)}"]`);
    if (title) {
      title.style.viewTransitionName = 'entry-open';
      event.viewTransition.finished.finally(() => title.style.removeProperty('view-transition-name'));
    }
    remember(null);
  });
})();
