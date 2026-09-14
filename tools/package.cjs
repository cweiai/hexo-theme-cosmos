'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');

function npm(args, cwd) {
  if (!process.env.npm_execpath) throw new Error('Run package tools through npm scripts.');
  const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024
  });
  if (result.error || result.status !== 0) throw result.error || new Error(result.stderr || result.stdout);
  return result.stdout;
}

function pack(destination = path.join(root, 'dist')) {
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'cosmos-distribution-'));
  try {
    const source = JSON.parse(npm(['pack', '--dry-run', '--json', '--ignore-scripts'], root))[0];
    for (const file of source.files) {
      if (/\/README(?:\.zh-CN)?\.md$/.test(file.path)) continue;
      const target = path.join(stage, file.path);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, file.path), target);
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(stage, 'package.json'), 'utf8'));
    for (const key of ['scripts', 'devDependencies', 'files']) delete manifest[key];
    fs.writeFileSync(path.join(stage, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
    fs.mkdirSync(destination, { recursive: true });
    return JSON.parse(npm(['pack', '--json', '--ignore-scripts', '--pack-destination', path.resolve(destination)], stage))[0];
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
}

module.exports = { pack, npm };
if (require.main === module) {
  try {
    const metadata = pack();
    console.log(`[Cosmos] User installation archive: ${path.join(root, 'dist', metadata.filename)}`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
