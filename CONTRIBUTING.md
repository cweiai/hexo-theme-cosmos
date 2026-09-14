# Contributing to Cosmos

[English](CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-CN.md)

## Overview

Contributions to [Cosmos](https://github.com/cweiai/hexo-theme-cosmos) are welcome, including bug fixes, documentation, translations, and configuration examples. Report reproducible problems through the [bug form](https://github.com/cweiai/hexo-theme-cosmos/issues/new?template=bug.yml), and discuss substantial changes in an issue before opening a pull request.

## Main Interfaces / Implementations

| Area | Files |
| --- | --- |
| Theme | `_config.yml`, `layout/`, `scripts/`, `lib/`, `languages/`, `source/` |
| User documentation | README files and the configuration, writing, and usage guides in `docs/` |
| Verification | `test/`, `tools/check-docs.cjs`, `tools/check-package.cjs` |
| Packaging and CI | `tools/package.cjs`, `.github/workflows/ci.yml` |

## Submit a change

Fork the repository and create a branch for your change. Use Node.js 24 and install dependencies with `npm ci`. In this guide, **MUST** is required, **SHOULD** is the default unless a concrete reason warrants a different approach, and **MAY** is optional.

Run `npm run check` before opening a pull request. Changes to dependencies, installation, packaging, or generators also require `npm run check:package`. Integration tests build temporary Hexo sites using fictional examples. For visual changes, test the theme in a Hexo blog at desktop and mobile widths and include screenshots in the pull request.

Describe the problem, resulting behavior, verification, and compatibility impact in the pull request. Update the affected documentation in both languages, including configuration changes and migration steps. Contributions to original code use the [MIT license](LICENSE); preserve third-party notices.

## Code conventions

- Changes **MUST** follow [.editorconfig](.editorconfig): UTF-8, LF, two-space indentation, and a final newline. Avoid unrelated formatting changes.
- JavaScript **MUST** use the existing CommonJS format for Node/Hexo modules. New code **SHOULD** use `const`, single-quoted strings, semicolons, and `'use strict';`, following the surrounding file. Code comments **MUST** be in English and **SHOULD** explain intent or constraints.
- Templates **MUST** escape plain text and attributes. Preserve the existing URL/path handling, subdirectory support, configuration precedence, and intentionally trusted HTML slots. Extend the existing EJS, plain CSS, and browser JavaScript structure.
- Changes **MUST** preserve keyboard access and reduced-motion behavior. New dependencies **SHOULD** have a clear need; contributors **MAY** add focused helpers or tests when they make behavior easier to maintain.

## Commit conventions

Commit subjects **MUST** use English Conventional Commits: `<type>(<scope>): <imperative summary>`. The scope is optional. Use `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`; for example, `fix(search): preserve subdirectory URLs`.

Subjects **SHOULD** stay within 72 characters and omit a final period. Each commit **SHOULD** describe one coherent change. Breaking changes **MUST** use `!` after the type/scope and a `BREAKING CHANGE:` footer explaining migration. A body **MAY** explain motivation, tradeoffs, and validation.

## Documentation

English is the default: use `name.md` for English and `name.zh-CN.md` for Simplified Chinese. Link directly between corresponding translations and keep their structure aligned. Update both module READMEs when documented interfaces or behavior change. The English-only [agent guide](AGENTS.md), original third-party licenses, canonical JSON schema, and sample blog posts are exceptions to translation pairing.

Keep the README focused on introduction, screenshots, quick installation, and direct documentation links. Put configuration details in the configuration guide. User guides describe using Cosmos in a blog; contributor commands belong here. Keep documentation as Markdown files, without a documentation site or personal preview/push shortcuts. Update the generated default tables and schema with `npm run docs:reference`. `npm run docs:check` validates examples, generated references, translation pairs, local links, and section anchors, including links in the agent guide.

## Package the theme

When changing the package version, update package.json and package-lock.json together with `npm version patch --no-git-tag-version` (or minor/major). Record user-visible changes and migration steps in the pull request and affected user guides.

Run `npm run check` and `npm run check:package` before preparing an archive. Then `npm run theme:pack` creates a local `.tgz` in `dist/`. It includes theme runtime files, user guides, presets, and licenses. Agent/contributor documents, tests, and repository tooling are excluded.

CI checks Node 20/22/24 on Linux, macOS, and Windows, with separate clean-package installation jobs for Hexo 7.3.0 and 8.1.2. Review the actual workflow results before merging. Workflows perform validation only; local packaging does not upload files anywhere.
