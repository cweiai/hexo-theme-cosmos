# Repository Maintenance Tools

[English](README.md) · [简体中文](README.zh-CN.md)

## Overview

Shared tools for automated tests, documentation checks, and theme distribution, excluded from the installed runtime package. Run them through npm scripts so the correct npm CLI is available on each platform.

## Main Interfaces / Implementations

| Name | Kind | Description |
| --- | --- | --- |
| site.cjs | Fixture builder | Creates a disposable Hexo site with runtime-only theme links. |
| check-docs.cjs | Markdown validation | Checks translation pairs, local links, and section anchors, with an English-only exception for AGENTS.md; defines the user-document list for package checks. |
| reference.cjs | Reference generator | Generates bilingual option tables and an English JSON schema from defaults using LF line endings; checks freshness and example validity while treating LF/CRLF as equivalent. Check mode never rewrites files. |
| package.cjs | Distribution builder | Stages bilingual user documents, theme files, and a runtime manifest, then creates an installation archive. |
| check-package.cjs | Distribution verification | Installs a packed theme into a fresh site and generates it without source symlinks. |

See the [contribution guide](../CONTRIBUTING.md).
