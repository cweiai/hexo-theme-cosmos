'use strict';
const blocked = new Set(['__proto__', 'prototype', 'constructor']);
const object = value => value && typeof value === 'object' && !Array.isArray(value);
function merge(...sources) {
  const output = {};
  for (const source of sources) {
    if (!object(source)) continue;
    for (const [key, value] of Object.entries(source)) {
      if (blocked.has(key)) continue;
      output[key] = Array.isArray(value) ? value.map(item => object(item) ? merge(item) : item)
        : object(value) ? merge(output[key], value) : value;
    }
  }
  return output;
}
function settings(hexo) { return merge(hexo.theme.config, hexo.config.theme_config); }
function safeUrl(value) {
  const url = String(value || '').trim();
  if (!url || /[\u0000-\u0020\u007f\\]/.test(url) || /^\/\//.test(url)) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !/^(https?:|mailto:|tel:)/i.test(url)) return '';
  return url;
}
function path(value) {
  const route = String(value || '').replace(/^\/+|\/+$/g, '');
  if (!route || route.split('/').some(part => part === '.' || part === '..') || /[:?#\\]/.test(route)) {
    throw new Error(`Cosmos: invalid page path "${route}". Use a local path such as "about".`);
  }
  return route;
}
function json(value) { return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'); }
function css(settings) {
  const style = settings.style;
  const vars = {};
  for (const [key, value] of Object.entries(style.colors)) vars[key.replaceAll('_', '-')] = value;
  Object.assign(vars, { sans:style.fonts.sans, serif:style.fonts.serif, container:style.layout.max_width,
    'prose-width':style.layout.prose_width, 'profile-width':style.layout.profile_width,
    'about-gap':style.layout.about_gap, 'toc-width':style.layout.toc_width, 'article-gap':style.layout.article_gap,
    'body-size':style.typography.body_size, 'body-mobile-size':style.typography.body_mobile_size,
    'body-line-height':style.typography.body_line_height, 'body-mobile-line-height':style.typography.body_mobile_line_height, 'quote-size':style.typography.quote_size,
    'quote-mobile-size':style.typography.quote_mobile_size, 'quote-line-height':style.typography.quote_line_height,
    'hero-title-size':style.hero.title_size, 'hero-title-mobile-size':style.hero.title_mobile_size,
    'hero-title-small-size':style.hero.title_small_size,
    'hero-aside-indent':style.hero.aside_indent, 'hero-image-width':style.hero.image_width }, style.variables);
  return ':root{' + Object.entries(vars).filter(([key, value]) => /^[a-z][a-z0-9-]*$/i.test(key) && value != null && !/[{};<>]/.test(String(value)))
    .map(([key,value]) => `--${key}:${value}`).join(';') + '}';
}
module.exports = { merge, settings, safeUrl, path, json, css };
