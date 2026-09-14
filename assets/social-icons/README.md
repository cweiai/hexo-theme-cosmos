# Profile Icons

[English](README.md) · [简体中文](README.zh-CN.md)

## Overview

A locally bundled subset of Tabler's outline icons for the About contact list. Icons inherit the theme foreground color and are decorative beside visible platform labels. No runtime CDN request is needed.

## Main Interfaces / Implementations

| Name | Kind | Description |
| ---- | ---- | ----------- |
| `icons.json` | Asset map | Complete SVG markup indexed by normalized platform name. |
| `sources.json` | Provenance | Upstream names and pinned revision for each vendored icon. |
| `../../scripts/profile-icons.js` | Hexo helper | Registers `profile_icon(name)` with normalized aliases and a generic link fallback. |
| `LICENSE` | License | Original Tabler MIT license. |

Source: [Tabler Icons](https://github.com/tabler/tabler-icons/tree/55f87a73f45cf1d9eaf16d7da705065483a9e4f9/icons/outline), revision `55f87a73f45cf1d9eaf16d7da705065483a9e4f9`.

The renderer adds decorative accessibility attributes and a CSS class. CSS sets the display size and stroke width. Douyin uses the TikTok mark; Xiaohongshu uses a generic book symbol, not an official brand mark. `mail`, `rednote`, and `twitter` alias `email`, `xiaohongshu`, and `x` respectively. Unrecognized names use the generic link icon.
