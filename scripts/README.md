/*
# Hexo Extensions

[English](README.md) · [简体中文](README.zh-CN.md)

## Overview

Automatically loaded Hexo scripts. Personal content is read from the site, not stored here.

## Main Interfaces / Implementations

| Name | Kind | Description |
| --- | --- | --- |
| theme.js | Extension | Page/search generators, configuration, routes, localized UI text, template helpers, and exclusion of both language editions of the theme's asset-module guide from public output. |
| profile-icons.js | Helper | Decorative local icons for configured profile rows. |

`entry_title` keeps authored titles and supplies a localized fallback for blank post titles in templates and the search index. `post_photos` accepts Hexo's normalized photo URL list, applies existing URL/root handling, and returns numbered alternative text for article galleries. Neither helper changes post data or routes.
*/
