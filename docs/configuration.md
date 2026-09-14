# Configuration

[English](configuration.md) · [简体中文](configuration.zh-CN.md)

Edit the Hexo **site root** `_config.cosmos.yml`. Theme updates can then replace the theme directory without overwriting personal settings. `_config.yml` inside the theme is the annotated reference.

The [default values](#all-default-values) below list every option on this page. The [JSON schema](theme.schema.json) supports completion and validation in your blog's YAML editor.

## Precedence

Theme defaults < site `_config.cosmos.yml` < the site's inline `theme_config`. Objects merge recursively; arrays replace their defaults, including `[]`. Cosmos reapplies inline settings after Hexo's native merge so an empty array really clears navigation or contacts. About adds `source/_data/about.yml` and then page front matter on top. When running ordinary Hexo commands in a blog, restart Hexo after changing root configuration or theme scripts and run `hexo clean && hexo generate` after disabling or moving generated pages.

Use booleans for switches. Keep grouped settings as objects: use `search: { enabled: false }`, not `search: false`.

## Site settings versus theme settings

Keep `title`, `author`, `description`, `url`, `root`, `language`, `timezone`, `permalink`, `date_format`, pagination, and generator configuration in the site's `_config.yml`. Cosmos uses these values; it does not store a second private identity in the theme.

For a subdirectory deployment:

```yaml
url: https://example.org/notebook
root: /notebook/
```

Configurable theme URLs such as `/images/cover.png` are automatically prefixed with `root`. Literal URLs inside your own HTML remain your responsibility; use the correct prefix or Hexo URL tags. Prefer paths without spaces, or URL-encode them. Profile/navigation links accept local, HTTP(S), mail, telephone, and fragment URLs; executable URL schemes are rejected.

## Pages and routing

| Setting | Default | Effect |
| --- | --- | --- |
| `home.mode` | `cover` | `cover` creates a full-screen homepage; `blog` places the post index at `/`. |
| `home.header`, `home.footer` | `false` | Enable ordinary site chrome on the cover. |
| `home.title`, `home.aside` | Generic notebook title | Sans-serif lead and optional italic ending. |
| `home.description` | Empty | Optional cover paragraph. |
| `home.image` | Empty source | `src`, `alt`, `width`, `height`. The artwork is always static; no fabricated placeholder or animation. |
| `home.links` | Blog, About | Ordered navigation objects; empty list removes them. |
| `routes.blog` | `blog` | Fallback post-index path in cover mode when `index_generator.path` is empty. An explicit site index path wins. |
| `routes.about` | `about` | Automatic About path and named navigation route. |
| `pages.about/categories/tags/not_found` | `true` | Enable the theme-generated pages. Source-authored pages are not deleted by these switches. |
| `pages.custom` | `[]` | Objects with `path`, `title`, optional `layout` (default `page`), `content` or `file`, and optional `enabled`. |

Blog mode deliberately resets the index-generator path to `/`; cover mode automatically moves an otherwise conflicting root index to `routes.blog`. Do not add `source/index.md` in cover mode: it conflicts with the generated cover and produces an actionable build error.

Archives and category/tag **detail** pages use `hexo-generator-archive`, `hexo-generator-category`, and `hexo-generator-tag`. Their paths follow the site's `archive_dir`, `category_dir`, `tag_dir`, `category_map`, and `tag_map`. Configure pagination in the site config, for example:

```yaml
index_generator:
  path: blog
  per_page: 8
  order_by: -date
archive_generator:
  yearly: true
  monthly: true
  per_page: 20
category_generator:
  per_page: 10
tag_generator:
  per_page: 10
```

An empty site still gets its blog and archive overview routes. No empty year/month archives are fabricated.

## Brand, navigation, and footer

`brand.title` falls back to the site title. `brand.aside` styles an ending in the cover's serif face; if it is not already the ending of the title, it is appended. `brand.favicon` is optional.

Navigation objects have `{route, label, icon}` for a known route or `{url, label, icon}` for a custom destination. Known routes: `home`, `about`, `blog`, `archives`, `categories`, `tags`. Empty labels use translated defaults. Named `about`, `categories`, and `tags` links are hidden when their corresponding `pages` switch is false; use `url` to link to a source page you maintain separately. Icon names are `arrow`, `diagonal`, `back`, `up`, `search`, `close`, and `menu`; unknown names use the arrow. Header navigation ignores the optional icon field.

`footer.enabled` controls the whole footer. `copyright`, `since`, `author`, `back_to_top`, `text`, and `links` control its pieces. The footer author falls back to the site author. There is no compulsory theme credit, social link, or promotional sentence.

## About

| Setting | Behavior |
| --- | --- |
| `about.header` | Show or hide the entire heading region. |
| `about.header_html` | Trusted HTML replacing the title region. |
| `about.sidebar_html` | Trusted HTML replacing the configured profile sidebar. |
| `about.title`, `aside`, `introduction` | Plain-text fallback heading and optional lines when no custom header HTML is supplied. |
| `about.content` / `about.file` | Markdown/HTML content or a file relative to `source/`; file wins. |
| `about.profile.enabled` | Shows or hides the configured profile. For a full-width body, set it to `false` and leave `about.sidebar_html` empty; custom sidebar HTML takes precedence. |
| `about.profile.name` | Falls back to site author. |
| `about.profile.avatar`, `avatar_alt` | Optional profile image. |
| `about.profile.facts` | Ordered `{label, value}` pairs, hidden if incomplete. |
| `about.profile.email` | First icon row; empty hides it. |
| `about.profile.contacts` | Ordered `{label, url, value, icon}` entries. URL and value are optional; at least one is needed. |

The defaults retain empty GitHub, LinkedIn, X, WeChat, QQ, Weibo, Zhihu, Bilibili, Xiaohongshu, Douyin, YouTube, Instagram, Facebook, TikTok, Threads, Telegram, Discord, Bluesky, Mastodon, and Website entries. Add arbitrary platforms using `icon` or the generic fallback. Value-only contacts are selectable text, not fake links. Education and other biography sections are ordinary HTML in the About content, not separate configuration modules. See [content examples](content.md).

The lines below the sidebar name are arbitrary facts, not fixed identity fields. Labels such as “Based In” can be replaced with any text. Add, remove, rename, or reorder entries through the list:

```yaml
about:
  profile:
    name: Your name
    facts:
      - { label: Focus, value: Writing and design }
      - { label: Currently, value: Building a notebook }
    email: hello@example.com
    contacts:
      - { label: Website, url: 'https://example.com' }
      - { label: WeChat, value: your-account }
```

Use `facts: []`, `contacts: []`, and `email: ''` to clear these regions. Use `about.sidebar_html` when the entire layout needs custom HTML.

## Listing and article details

| Group | Controls |
| --- | --- |
| `listing` | `title`, `title_period`, category filter `categories`, `counts`, `excerpts`, `excerpt_length`, `date`, `category`, `reading_time`, `aside`, `aside_note`, `signoff`. |
| `post` | `back_link`, `description`, `author`, `date`, `updated`, `categories`, `reading_time`, `toc`, `toc_depth`, `toc_numbers`, `reading_note`, `progress`, `copy_code`, `tags`, `signoff`, `navigation`, `comments`. |
| `search` | `enabled`, local JSON `path`, result `limit`. Matches published post titles, bodies, first category, and tags. Posts with `search: false` or `noindex: true` are excluded; ordinary pages are not indexed. |
| `motion` | `enabled` disables all authored movement; `page_transitions` independently controls navigation transitions. Reduced-motion preferences are always honored. |
| `seo` | Default preview `image`, `twitter_card`, `noindex`, and optional `rss` URL. |

All optional sidebar/signoff strings default to empty. Newlines in reading-note or listing-aside strings are preserved. Article `post_options` can override any `post` option; standard front matter `toc: false` and `comments: false` work too. Older entries are on the right, including when there is no newer entry. Empty tags/signoff never create an empty closing block.

## Style details

The `style` tree emits CSS custom properties without requiring a compiler. Dimensions use CSS units; line heights may be unitless numbers or CSS strings.

| Group | Controls |
| --- | --- |
| `style.colors` | `paper`, `paper_low`, `ink`, `muted`, `accent`, `honey`, `rule`. |
| `style.fonts` | `sans`, `serif` font stacks and `preload` for bundled fonts. Load custom font faces in your own CSS. |
| `style.layout` | `max_width`, `prose_width`, `profile_width`, `about_gap`, `toc_width`, `article_gap`. Columns collapse responsively. |
| `style.typography` | `body_size`, `body_mobile_size`, `body_line_height`, `body_mobile_line_height`, `quote_size`, `quote_mobile_size`, `quote_line_height`. |
| `style.hero` | `title_size`, `title_mobile_size`, `title_small_size`, `aside_indent`, `image_width`. |
| `style.variables` | Additional CSS variable names without `--`, including `ease`. |

Example:

```yaml
style:
  colors:
    accent: '#97452f'
  layout:
    max_width: 1360px
    prose_width: 72ch
  typography:
    body_size: 18px
    quote_size: 20px
  fonts:
    sans: '"My Sans", sans-serif'
custom:
  css: [/css/my-theme.css]
```

Place that CSS at `source/css/my-theme.css`. It loads after theme CSS and settings. All layout classes are ordinary CSS hooks; use this escape hatch for an individual heading, breakpoint, or decoration rather than editing theme core. New colors are not automatically contrast-corrected; verify your chosen palette.

## Localization and extensions

Set site `language: en` or `zh-CN`. All built-in UI strings, including search and code-copy feedback, come from `languages/`. Override individual keys in `labels`, for example `labels: {blog: Journal, back_blog: Back to writing}`. Front-matter `lang` can override a page's UI language. Custom navigation labels and author content are displayed exactly as supplied.

`custom.css` and `custom.js` are ordered URL arrays. Scripts load with `defer`. The raw HTML slots `head`, `body_start`, `body_end`, `before_content`, `after_content`, `after_about`, and `after_post` are empty by default. `after_post` respects the comments switch, so it can host a comments widget. Use Hexo's native injector API from a site plugin if you prefer programmatic insertion.

These slots intentionally execute trusted code written by the site owner. Never populate them with untrusted visitor input. Metadata and ordinary config text are escaped separately. No external analytics, comment platform, font CDN, or account identifier is enabled by default.

## Ready-to-use configurations

Merge the settings you want into your blog-root `_config.cosmos.yml`. Preserve your personal content; lists such as navigation replace the existing list.

| Configuration | Result |
| --- | --- |
| [minimal-cover.yml](../presets/minimal-cover.yml) | Static cover, compact navigation/footer, and editorial reading details. Set `home.image.src` to your own artwork. |
| [writing.yml](../presets/writing.yml) | Article list at `/`, 70-character reading width, updated dates, and numbered contents. |
| [portfolio.yml](../presets/portfolio.yml) | Projects entrance, Notes navigation, a sample Projects page, and a full-width About body. |

A writing homepage needs no competing `source/index.md`. Replace portfolio page content or set its `file` to a fragment inside your blog's `source/`.

```yaml
home:
  mode: blog
style:
  layout:
    prose_width: 70ch
  typography:
    body_size: 18px
post:
  updated: true
  toc_numbers: true
```

## Editor completion

If you use VS Code with the YAML extension, add this to your blog workspace settings for a directory installation:

```json
{
  "yaml.schemas": {
    "./themes/cosmos/docs/theme.schema.json": ["/_config.cosmos.yml"]
  }
}
```

For a package installation, use `./node_modules/hexo-theme-cosmos/docs/theme.schema.json` instead. The schema checks option names and types; custom CSS and scripts still need to be checked in the browser.

## All default values

All settings are optional in the blog's `_config.cosmos.yml`. The tables below show theme defaults, before personal overrides.

<!-- cosmos:defaults:start -->

### brand defaults

Applies to: Header and metadata.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `brand.title` | string | `""` |  |
| `brand.aside` | string | `""` |  |
| `brand.favicon` | string | `""` |  |

### home defaults

Applies to: Cover homepage.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `home.mode` | string | `"cover"` | cover generates a full-screen homepage; blog places the article index at the root. |
| `home.header` | boolean | `false` |  |
| `home.footer` | boolean | `false` |  |
| `home.title` | string | `"An open"` |  |
| `home.aside` | string | `"notebook."` |  |
| `home.description` | string | `""` |  |
| `home.image.src` | string | `""` |  |
| `home.image.alt` | string | `""` |  |
| `home.image.width` | number | `1254` |  |
| `home.image.height` | number | `1254` |  |
| `home.links` | array | `[{"route":"blog","label":"","icon":"arrow"},{"route":"about","label":"","icon":"diagonal"}]` |  |

### routes defaults

Applies to: Generated routes.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `routes.blog` | string | `"blog"` |  |
| `routes.about` | string | `"about"` |  |

### navigation defaults

Applies to: Header navigation.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `navigation` | array | `[{"route":"home","label":""},{"route":"about","label":""},{"route":"blog","label":""},{"route":"archives","label":""}]` |  |

### pages defaults

Applies to: Generated pages.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `pages.about` | boolean | `true` |  |
| `pages.categories` | boolean | `true` |  |
| `pages.tags` | boolean | `true` |  |
| `pages.not_found` | boolean | `true` |  |
| `pages.custom` | array | `[]` | Ordered generated pages. An existing source page at the same route takes precedence. |

### about defaults

Applies to: About page.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `about.header` | boolean | `true` |  |
| `about.header_html` | string | `""` | Trusted HTML replacing the full About heading. |
| `about.sidebar_html` | string | `""` | Trusted HTML replacing the default profile sidebar. |
| `about.title` | string | `""` |  |
| `about.aside` | string | `""` |  |
| `about.introduction` | string | `""` |  |
| `about.content` | string | `""` |  |
| `about.file` | string | `""` | File relative to the blog source directory; takes precedence over about.content. |
| `about.profile.enabled` | boolean | `true` | Shows the configured profile. To remove the sidebar column, also leave about.sidebar_html empty. |
| `about.profile.name` | string | `""` |  |
| `about.profile.avatar` | string | `""` |  |
| `about.profile.avatar_alt` | string | `""` |  |
| `about.profile.facts` | array | `[]` |  |
| `about.profile.email` | string | `""` |  |
| `about.profile.contacts` | array | <details><summary>Show all entries</summary><code>[{"label":"GitHub","url":""},{"label":"LinkedIn","url":""},{"label":"X","url":""},{"label":"WeChat","value":""},{"label":"QQ","value":""},{"label":"Weibo","url":""},{"label":"Zhihu","url":""},{"label":"Bilibili","url":""},{"label":"Xiaohongshu","url":""},{"label":"Douyin","url":""},{"label":"YouTube","url":""},{"label":"Instagram","url":""},{"label":"Facebook","url":""},{"label":"TikTok","url":""},{"label":"Threads","url":""},{"label":"Telegram","url":""},{"label":"Discord","url":""},{"label":"Bluesky","url":""},{"label":"Mastodon","url":""},{"label":"Website","url":""}]</code></details> | Ordered contacts. Empty entries are hidden; value-only entries are selectable text. |

### listing defaults

Applies to: Blog, archives, categories and tags.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `listing.title` | string | `""` |  |
| `listing.title_period` | boolean | `true` |  |
| `listing.categories` | boolean | `true` |  |
| `listing.counts` | boolean | `true` |  |
| `listing.excerpts` | boolean | `true` |  |
| `listing.excerpt_length` | number | `150` |  |
| `listing.date` | boolean | `true` |  |
| `listing.category` | boolean | `true` |  |
| `listing.reading_time` | boolean | `true` |  |
| `listing.aside` | string | `""` |  |
| `listing.aside_note` | string | `""` |  |
| `listing.signoff` | string | `""` |  |

### post defaults

Applies to: Article pages.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `post.back_link` | boolean | `true` |  |
| `post.description` | boolean | `true` |  |
| `post.author` | boolean | `true` |  |
| `post.date` | boolean | `true` |  |
| `post.updated` | boolean | `false` |  |
| `post.categories` | boolean | `false` |  |
| `post.reading_time` | boolean | `true` |  |
| `post.toc` | boolean | `true` |  |
| `post.toc_depth` | integer | `3` | Maximum heading level shown in the article table of contents; integer from 1 to 6. |
| `post.toc_numbers` | boolean | `false` |  |
| `post.reading_note` | string | `""` |  |
| `post.progress` | boolean | `true` |  |
| `post.copy_code` | boolean | `true` |  |
| `post.tags` | boolean | `true` |  |
| `post.signoff` | string | `""` |  |
| `post.navigation` | boolean | `true` |  |
| `post.comments` | boolean | `true` | Shows custom.after_post. This switch does not install a comment provider. |

### search defaults

Applies to: Local article search.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `search.enabled` | boolean | `true` |  |
| `search.path` | string | `"search.json"` | Generated local search JSON path; respects the site root. |
| `search.limit` | integer | `30` | Maximum displayed search results; positive integer. Indexing remains local. |

### footer defaults

Applies to: Footer.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `footer.enabled` | boolean | `true` |  |
| `footer.copyright` | boolean | `true` |  |
| `footer.since` | string | `""` |  |
| `footer.author` | string | `""` |  |
| `footer.back_to_top` | boolean | `true` |  |
| `footer.text` | string | `""` |  |
| `footer.links` | array | `[]` |  |

### style defaults

Applies to: Site appearance.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `style.colors.paper` | string | `"#f4eedf"` |  |
| `style.colors.paper_low` | string | `"#eae1d0"` |  |
| `style.colors.ink` | string | `"#342c24"` |  |
| `style.colors.muted` | string | `"#6c6052"` |  |
| `style.colors.accent` | string | `"#a6402c"` |  |
| `style.colors.honey` | string | `"#eccc77"` |  |
| `style.colors.rule` | string | `"#d4c7b1"` |  |
| `style.fonts.sans` | string | `"\"Hanken Grotesk\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"` |  |
| `style.fonts.serif` | string | `"Petrona, \"Songti SC\", \"Noto Serif CJK SC\", Georgia, serif"` |  |
| `style.fonts.preload` | boolean | `true` |  |
| `style.layout.max_width` | string | `"1280px"` |  |
| `style.layout.prose_width` | string | `"none"` |  |
| `style.layout.profile_width` | string | `"270px"` |  |
| `style.layout.about_gap` | string | `"108px"` |  |
| `style.layout.toc_width` | string | `"230px"` |  |
| `style.layout.article_gap` | string | `"72px"` |  |
| `style.typography.body_size` | string | `"17px"` |  |
| `style.typography.body_mobile_size` | string | `"16px"` |  |
| `style.typography.body_line_height` | number or string | `1.9` |  |
| `style.typography.body_mobile_line_height` | number or string | `1.85` |  |
| `style.typography.quote_size` | string | `"21px"` |  |
| `style.typography.quote_mobile_size` | string | `"19px"` |  |
| `style.typography.quote_line_height` | number or string | `1.65` |  |
| `style.hero.title_size` | string | `"clamp(72px, 7.5vw, 96px)"` |  |
| `style.hero.title_mobile_size` | string | `"clamp(54px, 15vw, 76px)"` |  |
| `style.hero.title_small_size` | string | `"clamp(48px, 15vw, 58px)"` |  |
| `style.hero.aside_indent` | string | `"64px"` |  |
| `style.hero.image_width` | string | `"min(68vw, 92svh, 980px)"` |  |
| `style.variables` | object | `{}` | Extra CSS custom properties without the leading --. Keys must be CSS identifiers. |

### motion defaults

Applies to: Browser interactions.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `motion.enabled` | boolean | `true` |  |
| `motion.page_transitions` | boolean | `true` |  |

### seo defaults

Applies to: Metadata and feed link.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `seo.image` | string | `""` |  |
| `seo.twitter_card` | string | `"summary_large_image"` |  |
| `seo.noindex` | boolean | `false` |  |
| `seo.rss` | string | `""` | URL of an existing feed generated by a separate plugin. |

### labels defaults

Applies to: Built-in UI text.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `labels` | object | `{}` | UI translation overrides. Empty strings remove optional server-rendered wording; keep browser feedback labels nonempty. |

### custom defaults

Applies to: Site-authored extensions.

| Setting | Type | Default | Notes |
| --- | --- | --- | --- |
| `custom.css` | array | `[]` | Ordered stylesheet URLs loaded after theme styles. |
| `custom.js` | array | `[]` | Ordered script URLs loaded with defer. |
| `custom.head` | string | `""` |  |
| `custom.body_start` | string | `""` |  |
| `custom.body_end` | string | `""` |  |
| `custom.before_content` | string | `""` |  |
| `custom.after_content` | string | `""` |  |
| `custom.after_about` | string | `""` |  |
| `custom.after_post` | string | `""` | Trusted article-end HTML, controlled by the comments switch. |

<!-- cosmos:defaults:end -->
