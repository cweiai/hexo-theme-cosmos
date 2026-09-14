# Theme Tests

[English](README.md) · [简体中文](README.zh-CN.md)

## Overview

Real temporary Hexo sites verify theme behavior. Temporary fixtures are removed after each test.

`npm test` uses Node's built-in test discovery without shell glob expansion, including on Windows with Node.js 20.

## Main Interfaces / Implementations

| Name | Kind | Description |
| --- | --- | --- |
| integration.test.cjs | Build tests | Routes, content, override precedence, subdirectories, localization, switches, empty states, About HTML, and exclusion of both module-guide editions while preserving site-owned README pages in both languages. |
| settings.test.cjs | Unit tests | Array replacement, URL safety, paths, and serialized script content. |
| documentation.test.cjs | Support checks | Markdown links/anchors, translation pairing with an English-only agent-guide exception, English defaults, direct topic links, user-document boundaries, configuration schema, and CI runtime targets. |
| reference.test.cjs | Reference regression tests | Runs the reference tool in temporary fixtures with LF/CRLF/mixed line endings; checks read-only validation, detection of stale documents/schema/defaults, and LF regeneration. |

`npm run check:package` separately installs a real packed archive in a fresh site. `COSMOS_HEXO_VERSION` selects the Hexo version for that installation test. This network-dependent check is separate from the regular test suite.
