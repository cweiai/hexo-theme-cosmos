'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');

const root = path.resolve(__dirname, '..');
const repository = require('../package.json').repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
const slash = value => value.split(path.sep).join('/');
const language = file => file.endsWith('.zh-CN.md') ? 'zh-CN' : 'en';
const counterpart = file => language(file) === 'en' ? file.replace(/\.md$/, '.zh-CN.md') : file.replace(/\.zh-CN\.md$/, '.md');
const englishFiles = ['README.md', 'docs/configuration.md', 'docs/content.md', 'docs/usage.md', 'THIRD_PARTY_NOTICES.md', 'docs/license.md'];
const userFiles = englishFiles.flatMap(file => [file, counterpart(file)]);

function files(directory = root) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (['node_modules', '.git', 'dist'].includes(entry.name)) return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file) : file.endsWith('.md') ? [slash(path.relative(root, file))] : [];
  });
}

function inspect(file) {
  let source = fs.readFileSync(path.join(root, file), 'utf8');
  if (/^scripts\/README(?:\.zh-CN)?\.md$/.test(file)) source = source.replace(/^\/\*\s*\n/, '').replace(/\n\*\/\s*$/, '');
  const ids = new Set();
  const headings = [];
  const renderer = new marked.Renderer();
  renderer.heading = function (token) {
    const text = this.parser.parseInline(token.tokens);
    const base = text.replace(/<[^>]*>/g, '').toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-') || 'section';
    let id = base;
    for (let i = 1; ids.has(id); i++) id = `${base}-${i}`;
    ids.add(id);
    headings.push({ depth: token.depth, id, text: text.replace(/<[^>]*>/g, '') });
    return `<h${token.depth}>${text}</h${token.depth}>`;
  };
  const html = marked.parse(source, { renderer });
  const links = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match => match[1]);
  return { file, links, ids, headings };
}

function check(pages) {
  const errors = [];
  const byFile = new Map(pages.map(page => [page.file, page]));
  for (const page of pages) for (const link of page.links) {
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(link)) continue;
    const [rawPath, rawHash] = link.split('#');
    if (rawPath.includes('?')) continue;
    let target, hash;
    try {
      target = rawPath ? slash(path.normalize(path.join(path.dirname(page.file), decodeURIComponent(rawPath)))) : page.file;
      hash = rawHash && decodeURIComponent(rawHash);
    } catch { errors.push(`${page.file}: invalid URL ${link}`); continue; }
    if (target.startsWith('../') || path.isAbsolute(target) || !fs.existsSync(path.join(root, target))) {
      errors.push(`${page.file}: missing local target ${link}`);
    } else if (hash && byFile.has(target) && !byFile.get(target).ids.has(hash)) {
      errors.push(`${page.file}: missing section ${link}`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
}

function checkTranslations(pages = files().map(inspect)) {
  const documents = pages.filter(page => page.file !== 'AGENTS.md' && !page.file.startsWith('examples/source/'));
  const byFile = new Map(documents.map(page => [page.file, page]));
  const errors = [];
  for (const page of documents) {
    const other = byFile.get(counterpart(page.file));
    if (!other) { errors.push(`${page.file}: missing translation ${counterpart(page.file)}`); continue; }
    const languageLinks = [path.posix.basename(other.file), `${repository}/blob/main/${other.file}`];
    if (!languageLinks.some(link => page.links.includes(link))) errors.push(`${page.file}: missing direct language switch`);
    if (page.headings.map(h => h.depth).join(',') !== other.headings.map(h => h.depth).join(',')) errors.push(`${page.file}: translation heading structure differs`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
}

module.exports = { check, checkTranslations, files, inspect, userFiles };
if (require.main === module) {
  try {
    const pages = files().map(inspect);
    check(pages);
    checkTranslations(pages);
    console.log(`[Cosmos] Checked translation pairs, local links, and section anchors in ${pages.length} Markdown files.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
