# Authoring Content

[English](content.md) · [简体中文](content.zh-CN.md)

## Posts and ordinary pages

Use standard Hexo commands in your site:

```sh
npx hexo new post "A title"
npx hexo new page "projects"
```

Articles live in `source/_posts/`. Ordinary pages use `layout: page`. The Markdown renderer controls headings, code highlighting, tables, links, and embedded HTML. LaTeX and Mermaid require the optional integrations described below.

```yaml
---
title: An article
date: 2024-06-12 12:00:00
author: Example Author
description: An optional short description.
categories: [Notes]
tags: [Writing]
cover: /images/social-card.png
toc: true
comments: false
search: true
post_options:
  updated: true
  signoff: Thanks for reading.
---
```

Use `<!-- more -->` for an excerpt, or `description` for a custom summary. `demo: true` adds an explicit demonstration label. `noindex: true` adds a robots directive and excludes the post from local search; it is not access control. Drafts and future publishing follow standard Hexo settings. For raw HTML with template-like text, use `{% raw %}` / `{% endraw %}` in source posts/pages.

### Untitled posts

Missing, empty, and whitespace-only post titles display as `Untitled` or `无标题`, following the post's language. This applies to the article heading, document metadata, all post lists, adjacent-post navigation, and local search. Nonempty authored titles and post URLs stay unchanged. Customize the fallback with `labels.untitled` in the theme overrides.

### Photo galleries

Use Hexo's `photos` front matter to display an ordered column of images before the article body:

```yaml
photos:
  - /images/notebook.jpg
  - /images/sketch.jpg
```

Local paths follow the blog's `root`; HTTP(S) URLs are also supported. Empty lists add no gallery. Executable, data, protocol-relative, mail, telephone, and fragment URLs are omitted. Images retain their proportions and fit the reading column without JavaScript.

Hexo stores `photos` as URL strings. Gallery images receive numbered alternative text from `labels.photo`. For descriptive alternative text or captions for each image, use Markdown images in the article body instead, such as `![A pencil sketch of a tree](/images/sketch.jpg)`.

### Marked code lines

With Hexo's `highlight.js` highlighter, the `mark` option highlights selected code lines using the theme's honey and accent colors:

```text
{% codeblock lang:js mark:1,3 %}
const first = 1;
const second = 2;
const total = first + second;
{% endcodeblock %}
```

This styles Hexo's `.line.marked` output. It does not change the code text or add line numbers to copied code.

With `post.copy_code` enabled, the copy button sits beside the first code line. Long lines scroll horizontally within the code area, leaving the button visible. Keyboard users can focus the code area and use the arrow keys to scroll. Code remains readable without JavaScript.

## Two native ways to author About

1. **Automatic page:** fill `about.content` or `about.file: _content/about.md` in `_config.cosmos.yml`. The underscore folder keeps a content fragment from also becoming a standalone page. Plain Markdown and HTML are accepted. Configuration/file fragments are rendered directly; Hexo tag-plugin syntax belongs in a normal `source/about/index.md` page instead.
2. **Source page:** create `source/about/index.md` with `layout: about`. It takes precedence over the automatic page at that route. This supports standard front matter, Markdown, raw HTML, and Hexo tags. When changing `routes.about`, move this source page to match.

Use `profile: false` in a source About page to remove the default configured profile. An explicitly supplied `sidebar_html` takes precedence. Use `about` or `profile` objects in front matter to override page-specific details. `source/_data/about.yml` has the same keys as the `about` setting.

## HTML in every About region

The heading, sidebar, and body can all contain arbitrary HTML.

```yaml
about:
  header_html: |
    <h1>A custom <em>About title</em></h1>
  sidebar_html: |
    <section>
      <h2>Example Author</h2>
      <p>Your own markup and contact links.</p>
    </section>
  file: _content/about.html
```

Place any HTML in `source/_content/about.html`. It is rendered as the right-hand body. `about.content` accepts inline HTML or Markdown as an alternative. Use `about.header: false` to omit the heading entirely. Leave `about.sidebar_html` empty to use the configured profile. For a full-width body, also set `about.profile.enabled: false`; nonempty custom sidebar HTML is still shown even when the profile is disabled. Both regions can be styled through your own `custom.css`.

## Optional profile configuration

The convenience profile remains available if you prefer data to HTML. These example values are fictional:

```yaml
about:
  profile:
    name: Example Author
    facts:
      - { label: Hometown, value: Example Town }
      - { label: Based in, value: Example City }
    email: hello@example.org
    contacts:
      - label: GitHub
        url: https://github.com/example
        value: '@example'
      - label: Work profile
        icon: linkedin
        url: https://example.org/profile
        value: Example Author
      - label: WeChat
        value: ''
```

## Education as ordinary HTML

Write the timeline directly in your About content. Use the optional CSS classes below to style an education timeline. You may also use entirely different markup and your own CSS.

```html
<section class="about-education" aria-labelledby="education-heading">
  <h2 id="education-heading">Education</h2>
  <ol class="education-timeline" role="list">
    <li class="education-current">
      <div class="education-copy">
        <p class="education-period">2021 — Present</p>
        <h3>Example University</h3>
        <p class="education-details">Major in an area of study<br>Minor in another subject</p>
      </div>
      <img class="education-art" src="/images/campus.png" alt="A campus illustration" width="900" height="600" loading="lazy">
    </li>
  </ol>
</section>
```

In a source Markdown page, wrap the section in `{% raw %}` / `{% endraw %}` when needed. A plain `.html` fragment needs no wrapper. Remove the image and add `education-without-image` to the list item for a text-only timeline. `education-current` changes the marker. The classes impose no required dates, subjects, institutions, or number of entries.

Place images in the site's `source/images/`. Transparent PNG/WebP assets blend with the paper background; opaque images are not automatically cut out. Intrinsic dimensions avoid layout shifts. Literal image URLs in HTML must include your deployment subdirectory if one is used.

## Automatic custom pages

```yaml
pages:
  custom:
    - path: projects
      title: Projects
      file: _content/projects.md
    - path: links
      title: Links
      content: |
        A few places worth visiting.

        - [Hexo](https://hexo.io/)
```

Add a matching `{url: /projects/, label: Projects}` navigation item when you want a visible entrance. Custom pages are deliberately not inserted into navigation automatically. `file` paths must stay inside the site `source/` directory. Source-authored pages take precedence at the same output path.

## Optional integrations

Cosmos provides a theme and extension slots. A service account, renderer, or plugin must be installed/configured separately when an integration needs one. The following are recipes and boundaries, not claims that every third-party service has been live-tested. Start with a minimal blog and check its generated output after adding a plugin.

| Need | Theme responsibility | External responsibility |
| --- | --- | --- |
| RSS | Link to the feed through `seo.rss` | A feed generator creates the file. |
| Sitemap | Standard canonical URLs and site routing | A sitemap generator creates the sitemap. |
| Comments | `custom.after_post` slot and per-post `comments` switch | Provider account, embed code, initialization, and styling. |
| Mathematics | Preserve rendered article HTML and load optional resources | Compatible Markdown renderer/plugin and math engine. |
| Mermaid | Preserve rendered content and load custom JS/CSS | Diagram renderer/plugin and initialization. |
| Analytics | `custom.head` / `custom.body_end` insertion slots | Service configuration and verification. |

### RSS and sitemap

In the **blog root**:

```sh
npm install hexo-generator-feed hexo-generator-sitemap
```

In the blog's `_config.cosmos.yml`:

```yaml
seo:
  rss: /atom.xml
```

Configure the feed plugin in the blog's `_config.yml` if you need a different output path. Generate the site and confirm the actual feed and sitemap files exist. Sources: [feed generator](https://github.com/hexojs/hexo-generator-feed), [sitemap generator](https://github.com/hexojs/hexo-generator-sitemap).

### Comment providers

Obtain the provider's embed code and place its markup in `custom.after_post`. Load any required resources using its documented embed or `custom.js`. Do not put a private API key in a static theme configuration. Use `comments: false` in a post's front matter to omit the slot for that article.

`post.comments: true` alone does not install comments. Provider-specific initialization and theme styling remain your responsibility. [Giscus setup](https://giscus.app/) is one possible starting point; its repository/category configuration must belong to your site.

### Mathematics and diagrams

Choose one compatible Markdown renderer and follow the plugin's installation instructions. A renderer replacement can change Markdown behavior; retest tables, code blocks, raw HTML, and existing posts. Native MathML can be embedded without a JavaScript math engine, but `$...$` and Mermaid code fences require additional rendering.

Use `custom.css` and `custom.js` for site-owned integration assets when needed. For performance, a site plugin can load resources only on the pages that use them. Sources: [Hexo rendering](https://hexo.io/docs/syntax-highlight), [KaTeX](https://katex.org/docs/autorender), [Mermaid](https://mermaid.js.org/intro/).

### Validate the integration

Generate the blog, inspect one page with the feature and one without it, check asset requests and browser errors, then test under the actual deployment root. Verify service access and provider configuration using your own blog.
