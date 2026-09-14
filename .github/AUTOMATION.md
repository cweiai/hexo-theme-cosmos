# Repository Automation

[English](AUTOMATION.md) · [简体中文](AUTOMATION.zh-CN.md)

## Overview

GitHub validation and contribution forms for [cweiai/hexo-theme-cosmos](https://github.com/cweiai/hexo-theme-cosmos). Validation runs on pushes, pull requests, and manual dispatches. Keep this guide named `AUTOMATION.md` so GitHub displays the theme's root README on the repository homepage.

## Main Interfaces / Implementations

| File | Kind | Description |
| --- | --- | --- |
| `workflows/ci.yml` | Validation | Node 20/22/24 on Linux, macOS, and Windows; clean package builds on Hexo 7.3.0 and 8.1.2. |
| `ISSUE_TEMPLATE/` | Forms | English and Chinese bug reports and feature requests. |
| `PULL_REQUEST_TEMPLATE.md` | Review form | English-default problem, validation, documentation, and compatibility information, with a Chinese edition. |

Workflows perform validation only. For local archive creation, see [packaging instructions](../CONTRIBUTING.md#package-the-theme).
