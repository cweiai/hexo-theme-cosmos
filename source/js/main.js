(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const settings = JSON.parse(document.querySelector('#cosmos-settings').textContent);
  const t = (key, values = {}) => String(settings.labels[key] || key).replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = { get matches() { return !settings.motion.enabled || motionPreference.matches; } };
  const root = new URL(document.body.dataset.root, location.origin);
  const blog = new URL(document.body.dataset.blog, location.origin);
  const menu = document.querySelector('.site-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const input = document.querySelector('#post-search');

  function closeMenu(restoreFocus = false) {
    menu?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', t('open_navigation'));
    if (restoreFocus) menuToggle?.focus();
  }
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? t('close_navigation') : t('open_navigation'));
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') || event.target.closest('.site-nav a')) closeMenu();
  });
  matchMedia('(min-width: 721px)').addEventListener('change', () => closeMenu());

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
      results.replaceChildren();
      status.textContent = t('searching');
      try {
        const posts = await loadIndex();
        if (version !== queryVersion) return;
        const words = query.split(/\s+/).filter(Boolean);
        const matches = posts.filter(post => words.every(word => [post.title, post.content, post.topic, ...post.tags].join(' ').toLocaleLowerCase().includes(word)));
        matches.sort((a,b) => Number(b.title.toLocaleLowerCase().includes(query)) - Number(a.title.toLocaleLowerCase().includes(query)));
        const limit = Math.max(1, Number(settings.search.limit) || 30);
        status.textContent = matches.length ? t(matches.length === 1 ? 'search_found_one' : 'search_found', { count: matches.length }) + (matches.length > limit ? ' ' + t('search_truncated', { limit }) : '') : t('search_empty');
        const fragment = document.createDocumentFragment();
        matches.slice(0,limit).forEach(post => fragment.append(entryElement(post)));
        results.replaceChildren(fragment);
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
    const button = document.createElement('button');
    button.className = 'code-copy';
    button.type = 'button';
    button.textContent = t('copy');
    button.setAttribute('aria-label', t('copy_code'));
    const status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('role','status');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(block.querySelector('.code pre')?.innerText || block.querySelector('code')?.innerText || block.innerText);
        button.textContent = t('copied');
        status.textContent = t('code_copied');
      } catch {
        button.textContent = t('copy_select');
        status.textContent = t('clipboard_error');
      }
      setTimeout(() => { button.textContent = t('copy'); status.textContent = ''; }, 1800);
    });
    block.append(button,status);
  });
})();
