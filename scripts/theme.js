'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { stripHTML } = require('hexo-util');
const core = require('../lib/settings.cjs');
const english = require('../languages/en.json');
const chinese = require('../languages/zh-CN.json');
const plain = value => stripHTML(String(value || '').replace(/<\/(?:p|div|h[1-6]|li|pre|blockquote|section)>|<br\s*\/?>/gi, ' ')).replace(/\s+/g, ' ').trim();
let inlineConfig = {};
const get = () => core.merge(core.settings(hexo), inlineConfig);
hexo.extend.filter.register('after_init', () => {
  if (hexo.config_path && fs.existsSync(hexo.config_path)) {
    inlineConfig = hexo.render.renderSync({path:hexo.config_path})?.theme_config || {};
  }
});
function language(context) {
  const value = context?.page?.lang || context?.page?.language || hexo.config.language || 'en';
  return Array.isArray(value) ? value[0] : value;
}
function dictionary(context) { return { ...english, ...(/^zh(?:-|$)/i.test(language(context)) ? chinese : {}), ...get().labels }; }
function translate(context, key, values = {}) {
  return String(dictionary(context)[key] ?? key).replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}
function entryTitle(post) {
  const title = String(post.title ?? '');
  return title.trim() ? title : translate({ page:post }, 'untitled');
}
function blogPath() { return String(hexo.config.index_generator.path || '').replace(/^\/+|\/+$/g, ''); }
function routes() {
  const c = get();
  return { home:'/', blog:`/${blogPath()}/`.replace(/\/+/g,'/'), about:`/${core.path(c.routes.about)}/`, archives:`/${hexo.config.archive_dir}/`, categories:`/${hexo.config.category_dir}/`, tags:`/${hexo.config.tag_dir}/` };
}
function content(spec) {
  if (spec.file) {
    const filename = path.resolve(hexo.source_dir, spec.file);
    const relative = path.relative(hexo.source_dir, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Cosmos: content files must be inside source/.');
    if (!fs.existsSync(filename)) throw new Error(`Cosmos: content file not found: ${spec.file}`);
    return hexo.render.renderSync({ path: filename });
  }
  return spec.content ? hexo.render.renderSync({ text: String(spec.content), engine:'md' }) : '';
}
hexo.extend.filter.register('before_generate', () => {
  const c = get();
  if (!['cover','blog'].includes(c.home.mode)) throw new Error('Cosmos: home.mode must be cover or blog.');
  if (!hexo.extend.generator.get('index')) throw new Error('Cosmos requires hexo-generator-index. See README.md.');
  if (c.home.mode === 'cover' && !hexo.config.index_generator.path) hexo.config.index_generator.path = core.path(c.routes.blog);
  if (c.home.mode === 'blog') hexo.config.index_generator.path = '';
  return Promise.all(['README.md', 'README.zh-CN.md'].map(name => {
    const guideId = path.relative(hexo.base_dir, path.join(hexo.theme_dir, 'source', name)).replace(/\\/g, '/');
    return hexo.model('Asset').findById(guideId)?.remove();
  }));
});
hexo.extend.helper.register('cosmos', get);
hexo.extend.helper.register('cosmos_language', function () { return language(this); });
hexo.extend.helper.register('cx', function (key, values) { return translate(this, key, values); });
hexo.extend.helper.register('cosmos_json', core.json);
hexo.extend.helper.register('cosmos_css', () => core.css(get()));
hexo.extend.helper.register('cosmos_client', function () { return { labels:dictionary(this), search:get().search, post:get().post, listing:get().listing, motion:get().motion }; });
hexo.extend.helper.register('cosmos_url', function (value) {
  const url = core.safeUrl(value);
  return url && (/^(https?:|mailto:|tel:|#)/i.test(url) ? url : this.url_for(url));
});
hexo.extend.helper.register('cosmos_route', function (key) { return this.url_for(routes()[key] || '/'); });
hexo.extend.helper.register('cosmos_links', function (items) {
  const c = get();
  return (Array.isArray(items) ? items : []).filter(item => item && (item.url || routes()[item.route]))
    .filter(item => item.url || !['about','categories','tags'].includes(item.route) || c.pages[item.route])
    .map(item => ({ ...item, href:this.cosmos_url(item.url || routes()[item.route]), label:item.label || translate(this,item.route || 'home') }))
    .filter(item => item.href);
});
hexo.extend.helper.register('cosmos_active', function (link) {
  const target = new URL(link.href, hexo.config.url).pathname.replace(/\/+$/,'');
  const current = new URL(this.url_for(this.page.path || ''), hexo.config.url).pathname.replace(/\/index\.html$/,'').replace(/\/+$/,'');
  return target === current || (target && target !== hexo.config.root.replace(/\/+$/,'') && current.startsWith(target+'/')) || (link.route === 'blog' && this.is_post());
});
hexo.extend.helper.register('cosmos_about', function () {
  const result = core.merge(get().about, this.site.data.about, this.page.about);
  if (this.page.profile === false) result.profile.enabled = false;
  else if (this.page.profile) result.profile = core.merge(result.profile, this.page.profile);
  return result;
});
hexo.extend.helper.register('cosmos_post', function () {
  const c = core.merge(get().post, this.page.post_options);
  for (const key of ['toc','comments']) if (typeof this.page[key] === 'boolean') c[key] = this.page[key];
  return c;
});
hexo.extend.helper.register('cosmos_listing_title', function () {
  const p = this.page;
  return p.category || (p.tag ? translate(this,'tag_title',{tag:p.tag}) : p.month ? translate(this,'archive_month',{year:p.year,month:String(p.month).padStart(2,'0')}) : p.year ? translate(this,'archive_year',{year:p.year}) : p.archive ? translate(this,'archives') : get().listing.title || translate(this,'all_writing'));
});
hexo.extend.helper.register('excerpt_text', (post, limit = 160) => {
  const text = plain(post.description || post.excerpt || post.content);
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
});
hexo.extend.helper.register('reading_minutes', post => {
  const text = plain(post.content);
  const cjk = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = text.replace(/[\u3400-\u9fff]/g,'').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words/220 + cjk/400));
});
hexo.extend.helper.register('post_topic', function (post) { return post.categories?.length ? post.categories.first().name : translate(this,'notes'); });
hexo.extend.helper.register('entry_title', entryTitle);
hexo.extend.helper.register('post_photos', function (post) {
  return (Array.isArray(post.photos) ? post.photos : [])
    .map(value => typeof value === 'string' ? this.cosmos_url(value) : '')
    .filter(src => src && !/^(mailto:|tel:|#)/i.test(src))
    .map((src, index) => ({ src, alt:translate(this, 'photo', { number:index + 1 }) }));
});
hexo.extend.helper.register('entry_key', post => `entry-${Buffer.from(post.path || '').toString('hex')}`);
hexo.extend.helper.register('icon', name => {
  const paths = {
    arrow:'<path d="M4 12h15M13 5l7 7-7 7"/>', diagonal:'<path d="M5 19 19 5M5 5h14v14"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>', close:'<path d="m6 6 12 12M6 18 18 6"/>',
    menu:'<path d="M4 8h16M4 16h16"/>', back:'<path d="M20 12H4M11 5l-7 7 7 7"/>', up:'<path d="M12 20V4M5 11l7-7 7 7"/>'
  };
  return `<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
});
hexo.extend.generator.register('cosmos-pages', locals => {
  const c = get();
  const output = [];
  const occupied = new Set(locals.pages.map(page => page.path));
  function add(route, layout, data) {
    if (occupied.has(route)) return;
    occupied.add(route);
    output.push({ path:route, layout:[layout], data:{...data, cosmos_kind:layout} });
  }
  if (c.home.mode === 'cover') {
    if (occupied.has('index.html')) throw new Error('Cosmos: a source index page conflicts with cover mode. Remove it or choose home.mode: blog.');
    add('index.html','home',{journal_home:true});
  }
  if (!locals.posts.length) {
    add(blogPath() ? `${blogPath()}/index.html` : 'index.html','index',{posts:locals.posts,total:1,__index:true});
    add(`${hexo.config.archive_dir}/index.html`,'archive',{posts:locals.posts,total:1,archive:true});
  }
  if (c.pages.about) add(`${core.path(c.routes.about)}/index.html`,'about',{title:c.about.title || translate(null,'about'), content:content(core.merge(c.about, locals.data.about))});
  if (c.pages.categories) add(`${hexo.config.category_dir}/index.html`,'categories',{title:translate(null,'categories')});
  if (c.pages.tags) add(`${hexo.config.tag_dir}/index.html`,'tags',{title:translate(null,'tags')});
  if (c.pages.not_found) add('404.html','404',{title:translate(null,'not_found'), noindex:true});
  for (const spec of c.pages.custom || []) {
    if (spec.enabled === false) continue;
    const route = `${core.path(spec.path)}/index.html`;
    if ([`${blogPath()}/index.html`,`${hexo.config.archive_dir}/index.html`].includes(route)) throw new Error(`Cosmos: custom page conflicts with a listing: ${spec.path}`);
    add(route, spec.layout || 'page', {...spec, content:content(spec)});
  }
  return output;
});
hexo.extend.generator.register('cosmos-search', locals => {
  const c = get();
  if (!c.search.enabled) return [];
  return { path:core.path(c.search.path), data:JSON.stringify(locals.posts.filter(post => post.search !== false && !post.noindex).sort('-date').map(post => ({
    title:entryTitle(post), path:post.path, key:`entry-${Buffer.from(post.path).toString('hex')}`,
    description:plain(post.description || post.excerpt || post.content).slice(0,c.listing.excerpt_length),
    content:plain(post.content), topic:post.categories.length ? post.categories.first().name : translate(null,'notes'),
    tags:post.tags.map(tag => tag.name), date:post.date.format(hexo.config.date_format), demo:Boolean(post.demo)
  }))) };
});
