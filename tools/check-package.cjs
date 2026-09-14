'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { pack, npm } = require('./package.cjs');
const { userFiles } = require('./check-docs.cjs');
const root = path.resolve(__dirname, '..');

async function verify() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cosmos-package-'));
  try {
    const metadata = pack(directory);
    assert.ok(metadata.files.some(file => file.path === 'LICENSE'));
    assert.ok(metadata.files.some(file => file.path === 'source/fonts/Hanken-LICENSE.txt'));
    for (const file of userFiles) assert.ok(metadata.files.some(entry => entry.path === file), `Missing user document: ${file}`);
    assert.ok(!metadata.files.some(file => /\/README(?:\.zh-CN)?\.md$/.test(file.path)), 'Module documentation must stay out of installation archives');
    for (const file of metadata.files) assert.ok(!/^(node_modules|tools|test|examples|\.github|dist)\//.test(file.path) && !/^(AGENTS|CONTRIBUTING)(?:\.zh-CN)?\.md$/.test(file.path) && !/(^|\/)\.env/.test(file.path), `Unexpected package file: ${file.path}`);
    const site = path.join(directory, 'site');
    fs.mkdirSync(site);
    fs.writeFileSync(path.join(site, 'package.json'), JSON.stringify({ name: 'cosmos-package-check', private: true, hexo: { version: process.env.COSMOS_HEXO_VERSION || '8.1.2' } }));
    console.log('[Cosmos] Installing the packed theme in a clean site (no source symlinks).');
    npm(['install', '--no-audit', '--no-fund', path.join(directory, metadata.filename), `hexo@${process.env.COSMOS_HEXO_VERSION || '8.1.2'}`], site);
    const installed = path.join(site, 'node_modules/hexo-theme-cosmos');
    const manifest = JSON.parse(fs.readFileSync(path.join(installed, 'package.json'), 'utf8'));
    assert.equal(manifest.scripts, undefined);
    assert.equal(manifest.devDependencies, undefined);
    assert.equal(manifest.repository.url, 'git+https://github.com/cweiai/hexo-theme-cosmos.git');
    fs.cpSync(path.join(root, 'examples'), site, { recursive: true });
    const Hexo = require(path.join(site, 'node_modules/hexo'));
    const hexo = new Hexo(site, { silent: true });
    const errors = [];
    hexo.log.error = (...args) => errors.push(args.map(String).join(' '));
    try {
      await hexo.init();
      assert.equal(fs.realpathSync(hexo.theme_dir), fs.realpathSync(installed));
      await hexo.call('generate', {});
      assert.deepEqual(errors, [], 'The installed theme must build without rendering errors');
      for (const file of ['index.html', 'blog/index.html', 'about/index.html', '404.html', 'search.json', 'css/style.css']) assert.ok(fs.existsSync(path.join(site, 'public', file)), file);
      assert.ok(!fs.readFileSync(path.join(site, 'public/index.html'), 'utf8').includes('/__cosmos__/'));
      assert.ok(!fs.existsSync(path.join(site, 'public/README.html')));
      assert.ok(!fs.existsSync(path.join(site, 'public/README.zh-CN.html')));
      console.log(`[Cosmos] Package installation and rendering passed on Hexo ${Hexo.version}, Node ${process.version}.`);
    } finally { await hexo.exit(); }
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

verify().catch(error => { console.error(error); process.exitCode = 1; });
