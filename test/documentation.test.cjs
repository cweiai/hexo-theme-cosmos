'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const { inspect, check, checkTranslations, userFiles, files } = require('../tools/check-docs.cjs');

test('documentation checker catches missing local files and missing section anchors', () => {
  const page = inspect('docs/configuration.md');
  check([page]);
  assert.throws(() => check([{ ...page, links: ['not-a-cosmos-guide.md'] }]), /missing local target/);
  assert.throws(() => check([{ ...page, links: ['#not-a-real-section'] }]), /missing section/);
  assert.ok(page.links.includes('content.md'));
  assert.ok(page.ids.has('all-default-values'));
});

test('project documents have matching translations, with an English-only agent guide', () => {
  checkTranslations(files().map(inspect));
  const english = inspect('docs/configuration.md');
  const chinese = inspect('docs/configuration.zh-CN.md');
  checkTranslations([english, chinese]);
  assert.throws(() => checkTranslations([english]), /missing translation/);
  assert.throws(() => checkTranslations([english, { ...chinese, links: [] }]), /missing direct language switch/);
  assert.throws(() => checkTranslations([english, { ...chinese, headings: chinese.headings.slice(1) }]), /translation heading structure differs/);
  const agent = inspect('AGENTS.md');
  checkTranslations([agent]);
  assert.throws(() => check([{ ...agent, links: ['missing-agent-reference.md'] }]), /missing local target/);
});

test('user Markdown documents provide English defaults and direct topic links without developer entries', () => {
  check(userFiles.map(inspect));
  for (const file of userFiles) {
    const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.doesNotMatch(content, /npm (run|test)\b/);
    assert.match(content, /\[English\]\([^)]+\.md\) · \[简体中文\]\([^)]+\.zh-CN\.md\)/);
  }
  const readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
  assert.match(readme, /https:\/\/github.com\/cweiai\/hexo-theme-cosmos/);
  assert.match(readme, /\[Configuration\]\(docs\/configuration.md\)/);
  assert.ok(inspect('README.zh-CN.md').links.includes('docs/configuration.zh-CN.md#about'));
});

test('configuration schema accepts shipped examples and rejects common override mistakes', () => {
  const validate = new Ajv({ strict: false }).compile(require('../docs/theme.schema.json'));
  for (const file of ['_config.yml', 'examples/_config.cosmos.yml', 'presets/writing.yml', 'presets/portfolio.yml']) {
    assert.ok(validate(yaml.load(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'))), `${file}: ${JSON.stringify(validate.errors)}`);
  }
  assert.ok(validate({ navigation: [], labels: { blog: 'Journal' }, style: { variables: { 'custom-width': '10px' } } }));
  assert.equal(validate({ search: false }), false);
  assert.equal(validate({ home: { mode: 'portfolio' } }), false);
  assert.equal(validate({ post: { toc_depth: 9 } }), false);
  assert.equal(validate({ search: { limti: 10 } }), false);
});

test('CI declares the documented runtime targets', () => {
  const read = name => yaml.load(fs.readFileSync(path.join(__dirname, '../.github/workflows', name), 'utf8'));
  const ci = read('ci.yml');
  assert.deepEqual(ci.jobs.check.strategy.matrix.node, [20, 22, 24]);
  assert.deepEqual(ci.jobs.package.strategy.matrix.hexo, ['7.3.0', '8.1.2']);
});
