(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const settings = JSON.parse(document.querySelector('#cosmos-settings').textContent);
  const t = (key, values = {}) => String(settings.labels[key] || key).replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = { get matches() { return !settings.motion.enabled || motionPreference.matches; } };
  const root = new URL(document.body.dataset.root, location.origin);
  try { sessionStorage.setItem(`cosmos-visited:${root.pathname}`, '1'); } catch { /* Reading works without storage. */ }
  const blog = new URL(document.body.dataset.blog, location.origin);
  const menu = document.querySelector('.site-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const input = document.querySelector('#post-search');
  const desktopMenu = matchMedia('(min-width: 721px)');

  function menuState(open, instant = false) {
    menu?.classList.toggle('is-instant', instant);
    menuToggle?.classList.toggle('is-instant', instant);
    menu?.classList.toggle('is-open', open);
    // A closing wipe stays visible briefly, but its links must stop receiving focus immediately.
    if (menu) menu.inert = !open && !desktopMenu.matches;
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? t('close_navigation') : t('open_navigation'));
  }

  function closeMenu(restoreFocus = false) {
    menuState(false, restoreFocus);
    if (restoreFocus) menuToggle?.focus();
  }
  menuToggle?.addEventListener('click', event => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuState(open, event.detail === 0);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') || event.target.closest('.site-nav a')) closeMenu();
  });
  desktopMenu.addEventListener('change', () => closeMenu());
  closeMenu();

  function focusSearch() {
    if (input) {
      input.scrollIntoView({ block: 'center', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      input.focus({ preventScroll: true });
    } else location.href = new URL('#search', blog).href;
  }
  document.addEventListener('keydown', event => {
    const typing = event.target.closest('input, textarea, select, [contenteditable="true"]');
    if (settings.search.enabled && ((event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey))) {
      event.preventDefault();
      focusSearch();
    }
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.querySelector('.back-top')?.addEventListener('click', () => {
    scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    document.querySelector('.brand')?.focus({ preventScroll: true });
  });

  if (input) {
    const form = input.closest('form');
    const clear = form.querySelector('.clear-search');
    const status = document.querySelector('.search-status');
    const results = document.querySelector('.search-results');
    const original = document.querySelector('[data-default-list]');
    const pagination = document.querySelector('[data-default-pagination]');
    let indexPromise;
    let queryVersion = 0;
    let debounce;
    motionPreference.addEventListener('change', () => {
      if (reducedMotion.matches) results.querySelectorAll('.entry').forEach(item => item.getAnimations().forEach(animation => animation.cancel()));
    });

    function loadIndex() {
      if (!indexPromise) indexPromise = fetch(new URL(settings.search.path.replace(/^\/+/, ''), root)).then(response => {
        if (!response.ok) throw new Error('Search unavailable');
        return response.json();
      }).catch(error => { indexPromise = null; throw error; });
      return indexPromise;
    }
    function showOriginal() {
      original.hidden = false;
      if (pagination) pagination.hidden = false;
      results.setAttribute('aria-busy', 'false');
      status.hidden = true;
      results.hidden = true;
      results.replaceChildren();
    }
    function entryElement(post) {
      const article = document.createElement('article');
      article.className = 'entry';
      const body = document.createElement('div');
      body.className = 'entry-content';
      const title = document.createElement('h3');
      const link = document.createElement('a');
      link.className = 'entry-title';
      link.href = new URL(post.path, root).href;
      link.dataset.entry = post.key;
      link.textContent = post.title;
      title.append(link);
      const description = document.createElement('p');
      description.textContent = post.description;
      const meta = document.createElement('div');
      meta.className = 'entry-meta';
      [settings.listing.category ? post.topic : null, settings.listing.date ? post.date : null, post.demo ? t('demo') : null].filter(Boolean).forEach((text, index) => {
        const item = document.createElement('span');
        item.textContent = text;
        if (!index) item.className = 'entry-topic';
        if (text === t('demo')) item.className = 'demo-note';
        meta.append(item);
      });
      body.append(title);
      if (settings.listing.excerpts && post.description) body.append(description);
      body.append(meta);
      article.append(body);
      return article;
    }
    async function search() {
      const version = ++queryVersion;
      const query = input.value.trim().toLocaleLowerCase();
      clear.hidden = !input.value;
      const url = new URL(location.href);
      if (query) url.searchParams.set('q', input.value.trim());
      else url.searchParams.delete('q');
      history.replaceState(null, '', url.href);
      if (!query) { showOriginal(); return; }
      original.hidden = true;
      if (pagination) pagination.hidden = true;
      status.hidden = false;
      results.hidden = false;
      results.setAttribute('aria-busy', 'true');
      status.textContent = t('searching');
      try {
        const posts = await loadIndex();
        if (version !== queryVersion) return;
        const words = query.split(/\s+/).filter(Boolean);
        const matches = posts.filter(post => words.every(word => [post.title, post.content, post.topic, ...post.tags].join(' ').toLocaleLowerCase().includes(word)));
        matches.sort((a,b) => Number(b.title.toLocaleLowerCase().includes(query)) - Number(a.title.toLocaleLowerCase().includes(query)));
        const limit = Math.max(1, Number(settings.search.limit) || 30);
        status.textContent = matches.length ? t(matches.length === 1 ? 'search_found_one' : 'search_found', { count: matches.length }) + (matches.length > limit ? ' ' + t('search_truncated', { limit }) : '') : t('search_empty');
        const previous = new Map([...results.querySelectorAll('.entry')].map(item => [item.querySelector('[data-entry]').dataset.entry, { item, top: item.getBoundingClientRect().top + scrollY }]));
        const fragment = document.createDocumentFragment();
        let fresh = 0;
        matches.slice(0,limit).forEach(post => {
          const item = previous.get(post.key)?.item || entryElement(post);
          if (previous.has(post.key)) {
            item.classList.remove('is-new');
            item.style.removeProperty('--result-delay');
          }
          if (!previous.has(post.key) && !reducedMotion.matches) {
            item.classList.add('is-new');
            item.style.setProperty('--result-delay', `${Math.min(fresh++, 4) * 32}ms`);
            item.addEventListener('animationend', () => item.classList.remove('is-new'), { once: true });
          }
          fragment.append(item);
        });
        results.replaceChildren(fragment);
        if (!reducedMotion.matches) {
          const easing = getComputedStyle(document.documentElement).getPropertyValue('--ease').trim();
          for (const { item, top } of previous.values()) {
            if (!item.isConnected || typeof item.animate !== 'function') continue;
            item.getAnimations().forEach(animation => animation.cancel());
            const shift = top - (item.getBoundingClientRect().top + scrollY);
            if (shift) item.animate([{ transform: `translateY(${shift}px)` }, { transform: 'none' }], { duration: 240, easing });
          }
        }
      } catch {
        if (version !== queryVersion) return;
        status.textContent = t('search_error');
        const retry = document.createElement('button');
        retry.className = 'search-retry';
        retry.type = 'button';
        retry.textContent = t('retry');
        retry.addEventListener('click', search);
        results.replaceChildren(retry);
      } finally {
        if (version === queryVersion) results.setAttribute('aria-busy', 'false');
      }
    }
    form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(debounce); search(); });
    input.addEventListener('input', () => {
      ++queryVersion;
      clear.hidden = !input.value;
      clearTimeout(debounce);
      debounce = setTimeout(search, 140);
    });
    clear.addEventListener('click', () => { clearTimeout(debounce); input.value = ''; search(); input.focus(); });
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') { clearTimeout(debounce); input.value = ''; search(); }
      if (event.key === 'ArrowDown' && results.querySelector('a')) { event.preventDefault(); results.querySelector('a').focus(); }
    });
    input.value = new URL(location.href).searchParams.get('q') || '';
    if (input.value) search();
    if (location.hash === '#search') focusSearch();
    window.addEventListener('hashchange', () => { if (location.hash === '#search') focusSearch(); });
  }

  const content = document.querySelector('[data-reading-content]');
  if (content) {
    const progress = document.querySelector('.reading-progress>span');
    const headings = [...content.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]')];
    const links = [...document.querySelectorAll('.contents a')];
    let frame = 0;
    function updateReading() {
      frame = 0;
      const bounds = content.getBoundingClientRect();
      const start = scrollY + bounds.top - innerHeight * .2;
      const end = scrollY + bounds.bottom - innerHeight * .7;
      const fraction = Math.max(0, Math.min(1, (scrollY-start) / Math.max(1,end-start)));
      if (progress) progress.style.transform = `scaleX(${fraction})`;
      let current = headings[0]?.id;
      headings.forEach(heading => { if (heading.getBoundingClientRect().top < innerHeight*.3) current = heading.id; });
      links.forEach(link => {
        if (decodeURIComponent(link.hash.slice(1)) === current) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(updateReading); };
    addEventListener('scroll',schedule,{passive:true});
    addEventListener('resize',schedule,{passive:true});
    document.fonts.ready.then(schedule);
    updateReading();
  }
  if (document.body.dataset.copyCode !== 'false') document.querySelectorAll('.prose .highlight, .prose pre[class*=language-]').forEach(block => {
    let container = block;
    let scroll = block;
    if (block.matches('pre')) {
      container = document.createElement('div');
      block.before(container);
      container.append(block);
      const caption = block.querySelector(':scope > .caption');
      if (caption) {
        caption.classList.add('code-caption');
        container.prepend(caption);
      }
    } else {
      const table = block.querySelector('table');
      if (!table) return;
      scroll = document.createElement('div');
      table.before(scroll);
      scroll.append(table);
    }
    container.classList.add('code-block');
    scroll.classList.add('code-scroll');
    scroll.tabIndex = 0;
    const button = document.createElement('button');
    button.className = 'code-copy';
    button.type = 'button';
    button.setAttribute('aria-label', t('copy_code'));
    const labels = {};
    for (const [state, text] of [['copy', t('copy')], ['done', t('copied')], ['error', t('copy_select')]]) {
      const label = document.createElement('span');
      label.dataset.label = state;
      label.setAttribute('aria-hidden', 'true');
      if (state === 'done') label.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
      label.append(text);
      labels[state] = label;
    }
    labels.copy.classList.add('is-current');
    button.append(labels.copy, labels.done, labels.error);
    const wash = document.createElement('span');
    wash.className = 'code-wash';
    wash.setAttribute('aria-hidden', 'true');
    const status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('role','status');
    let reset;
    let copyVersion = 0;
    let washAnimation;
    function show(state) {
      const next = labels[state];
      const previous = button.querySelector('.is-current');
      if (previous === next) return;
      next.classList.remove('is-leaving');
      next.style.transition = 'none';
      next.getBoundingClientRect();
      next.style.removeProperty('transition');
      previous.classList.replace('is-current', 'is-leaving');
      next.classList.add('is-current');
    }
    button.addEventListener('click', async event => {
      const version = ++copyVersion;
      clearTimeout(reset);
      button.classList.toggle('is-instant', event.detail === 0);
      if (event.detail === 0) washAnimation?.cancel();
      try {
        await navigator.clipboard.writeText(block.querySelector('.code pre')?.innerText || block.querySelector('code')?.innerText || block.innerText);
        if (version !== copyVersion) return;
        show('done');
        status.textContent = t('code_copied');
        if (event.detail !== 0 && !reducedMotion.matches && typeof wash.animate === 'function') {
          const current = getComputedStyle(wash);
          const easing = getComputedStyle(document.documentElement).getPropertyValue('--ease').trim();
          const start = { clipPath: current.clipPath, opacity: current.opacity, easing };
          washAnimation?.cancel();
          washAnimation = wash.animate([start, { clipPath: 'inset(0)', opacity: .55, offset: .4, easing: 'ease' }, { clipPath: 'inset(0)', opacity: 0 }], { duration: 800 });
        }
      } catch {
        if (version !== copyVersion) return;
        show('error');
        status.textContent = t('clipboard_error');
      }
      reset = setTimeout(() => { show('copy'); status.textContent = ''; }, 1800);
    });
    motionPreference.addEventListener('change', () => { if (reducedMotion.matches) washAnimation?.cancel(); });
    container.append(button, status, wash);
  });
})();
