'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const documents = ['configuration.md', 'configuration.zh-CN.md', 'theme.schema.json'];

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cosmos-reference-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  for (const file of ['tools/reference.cjs', '_config.yml', 'examples/_config.cosmos.yml', ...documents.map(name => `docs/${name}`)]) {
    const target = path.join(directory, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, file), target);
  }
  fs.cpSync(path.join(root, 'presets'), path.join(directory, 'presets'), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'junction');
  return {
    directory,
    run: (...args) => spawnSync(process.execPath, ['tools/reference.cjs', ...args], { cwd: directory, encoding: 'utf8' })
  };
}

test('reference checks accept LF, CRLF, and mixed line endings without modifying files', t => {
  const { directory, run } = fixture(t);
  const originals = Object.fromEntries(documents.map(name => [name, fs.readFileSync(path.join(directory, 'docs', name), 'utf8').replace(/\r\n/g, '\n')]));
  for (const style of ['LF', 'CRLF', 'mixed']) {
    const expected = new Map();
    for (const [name, original] of Object.entries(originals)) {
      let newline = 0;
      const content = original.replace(/\n/g, () => style === 'CRLF' || (style === 'mixed' && newline++ % 2 === 0) ? '\r\n' : '\n');
      const filename = path.join(directory, 'docs', name);
      fs.writeFileSync(filename, content);
      expected.set(filename, content);
    }
    const result = run('--check');
    assert.equal(result.status, 0, `${style}: ${result.stderr || result.stdout}`);
    for (const [filename, content] of expected) assert.equal(fs.readFileSync(filename, 'utf8'), content, 'Checking must not rewrite documentation');
  }
});

test('reference checks reject real content drift and regeneration writes current LF documents', t => {
  const { directory, run } = fixture(t);
  for (const name of documents) {
    const filename = path.join(directory, 'docs', name);
    const original = fs.readFileSync(filename, 'utf8');
    const changed = name.endsWith('.md')
      ? original.replace('<!-- cosmos:defaults:start -->', '<!-- cosmos:defaults:start -->\nOutdated generated content.')
      : JSON.stringify({ ...JSON.parse(original), title: 'Outdated schema title' }, null, 2);
    fs.writeFileSync(filename, changed.replace(/\r?\n/g, '\r\n'));
    const result = run('--check');
    assert.equal(result.status, 1);
    assert.ok(result.stderr.includes(`${name} is stale.`), result.stderr);
    fs.writeFileSync(filename, original);
  }

  for (const name of documents) {
    const filename = path.join(directory, 'docs', name);
    fs.writeFileSync(filename, fs.readFileSync(filename, 'utf8').replace(/\r?\n/g, '\r\n'));
  }
  const configuration = path.join(directory, '_config.yml');
  const defaults = yaml.load(fs.readFileSync(configuration, 'utf8'));
  defaults.home.mode = defaults.home.mode === 'cover' ? 'blog' : 'cover';
  fs.writeFileSync(configuration, yaml.dump(defaults));
  assert.equal(run('--check').status, 1, 'Changed defaults must invalidate the generated reference');

  const generated = run();
  assert.equal(generated.status, 0, generated.stderr || generated.stdout);
  for (const name of documents) assert.ok(!fs.readFileSync(path.join(directory, 'docs', name), 'utf8').includes('\r'), name);
  const schema = JSON.parse(fs.readFileSync(path.join(directory, 'docs/theme.schema.json'), 'utf8'));
  assert.equal(schema.properties.home.properties.mode.default, defaults.home.mode);
  const checked = run('--check');
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
});
