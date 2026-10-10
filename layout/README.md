# Page Templates

[English](README.md) · [简体中文](README.zh-CN.md)

## Overview

EJS layouts for all standard pages and reusable editorial components.

## Main Interfaces / Implementations

| Name | Kind | Description |
| --- | --- | --- |
| layout.ejs | Document | Metadata, assets, header/footer switches, and raw extension slots. |
| home.ejs | Cover | Static image or typography-only full-screen cover. |
| about.ejs | About | HTML-customizable heading, sidebar, and biography; optional data-driven profile. |
| index.ejs | Listing | Blog/archive/category/tag post listings and search. |
| post.ejs | Article | Configurable reading controls, metadata, front-matter photo galleries, and navigation. |
| page.ejs | Page | Generic Markdown/HTML content. |
| categories.ejs / tags.ejs | Taxonomy indexes | All category/tag navigation. |
| _partial/ | Components | Profile, entry, navigation, footer, and taxonomy rows. |

Article headings, document metadata, listing entries, and adjacent-post links share the localized `entry_title` fallback. Gallery URLs pass through `post_photos` before escaped attributes are rendered; ordinary body content retains its renderer output.

The footer's `text` setting is a trusted site-authored inline HTML slot; other footer metadata remains escaped.

`layout.ejs` opts into cover entry before paint when `motion.enabled` is true, storage is available, and reduced motion is off. Cross-document transitions require both `motion.enabled` and `motion.page_transitions`. The root-scoped visit check uses `cosmos_json` for safe inline serialization. The header's decorative two-line SVG morphs with the semantic menu button's `aria-expanded` state; the navigation remains ordinary links without JavaScript.
