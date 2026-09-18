# 内容写作

[English](content.md) · [简体中文](content.zh-CN.md)

## 文章与普通页面

在博客中使用标准 Hexo 命令：

```sh
npx hexo new post "A title"
npx hexo new page "projects"
```

文章位于 `source/_posts/`，普通页面使用 `layout: page`。Markdown 渲染器负责标题、代码高亮、表格、链接和嵌入 HTML。LaTeX 与 Mermaid 需要下文介绍的可选接入。

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

使用 `<!-- more -->` 标记摘要，或用 `description` 指定自定义摘要。`demo: true` 添加演示内容标记。`noindex: true` 添加 robots 指令，并将文章排除在本地搜索之外；它不是访问控制。草稿和未来日期文章遵循标准 Hexo 设置。源文章或页面的 HTML 包含类似模板的文本时，可用 `{% raw %}` / `{% endraw %}` 包裹。

### 无标题文章

文章标题缺失、为空或仅有空白时，会按文章语言显示 `Untitled` 或 `无标题`。文章标题、文档元数据、所有文章列表、相邻文章导航和本地搜索使用相同的回退文字。已填写的非空标题和文章 URL 保持原样。可在主题覆盖配置中用 `labels.untitled` 自定义文字。

### 图片图库

在 Hexo 头部配置中使用 `photos`，即可在正文前按顺序纵向显示图片：

```yaml
photos:
  - /images/notebook.jpg
  - /images/sketch.jpg
```

本地路径遵循博客的 `root`，也支持 HTTP(S) URL。空列表不会生成图库。可执行协议、data、协议相对地址、邮箱、电话和片段链接会被忽略。图片保持原始比例并适应阅读栏宽度，无需 JavaScript。

Hexo 将 `photos` 存为 URL 字符串列表。图库图片的替代文字由 `labels.photo` 加序号生成。若要为每张图片提供描述性的替代文字或说明，请改用正文中的 Markdown 图片，例如 `![一棵树的铅笔素描](/images/sketch.jpg)`。

### 代码行标记

使用 Hexo 的 `highlight.js` 高亮器时，`mark` 选项会用主题的蜂蜜色和强调色突出指定代码行。强调色竖线与代码保持间隔，标记行和普通行的代码保持对齐：

```text
{% codeblock lang:js mark:1,3 %}
const first = 1;
const second = 2;
const total = first + second;
{% endcodeblock %}
```

该样式作用于 Hexo 生成的 `.line.marked`，不会改变代码文字，也不会把行号加入复制结果。

## About 的两种编写方式

1. **自动页面：**在 `_config.cosmos.yml` 填写 `about.content`，或设置 `about.file: _content/about.md`。下划线目录可防止片段同时生成独立页面。支持普通 Markdown 和 HTML。配置或文件片段直接渲染；需要 Hexo 标签插件语法时，使用普通的 `source/about/index.md` 页面。
2. **源页面：**创建 `source/about/index.md` 并设置 `layout: about`，它优先于同一路径的自动页面。支持标准头部配置、Markdown、原始 HTML 和 Hexo 标签。修改 `routes.about` 时，相应移动这个源页面。

在 About 源页面中设置 `profile: false` 可移除默认个人资料；显式提供的 `sidebar_html` 优先。头部配置的 `about` 或 `profile` 对象可覆盖当前页面的细节。`source/_data/about.yml` 使用与 `about` 设置相同的键。

## About 各区域的 HTML

标题、侧栏和正文都可以使用任意 HTML。

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

在 `source/_content/about.html` 编写 HTML，它会作为右侧正文渲染。也可在 `about.content` 直接填写 HTML 或 Markdown。`about.header: false` 隐藏整个标题。`about.sidebar_html` 留空时使用配置生成的个人资料。若要使用通栏正文，还需设置 `about.profile.enabled: false`；非空的自定义侧栏 HTML 在个人资料关闭后仍会显示。各区域都可通过自己的 `custom.css` 调整样式。

## 可选个人资料配置

偏好结构化数据时，可以使用个人资料配置。下列示例值均为虚构：

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

## 用 HTML 编写教育经历

直接在 About 正文编写时间线。下面的可选 CSS 类可用于教育经历样式，也可以完全使用自己的 HTML 和 CSS。

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

在 Markdown 源页面中，按需用 `{% raw %}` / `{% endraw %}` 包裹此段；普通 `.html` 片段无需包裹。纯文字时间线可移除图片，并给列表项添加 `education-without-image`。`education-current` 改变时间线标记。日期、专业、院校和条目数量都不受这些类名限制。

图片放在博客的 `source/images/`。透明 PNG/WebP 可以融入纸张背景；不透明图片不会自动抠图。填写原始图片尺寸可减少布局跳动。部署到子目录时，HTML 中直接填写的图片 URL 需要包含该前缀。

## 自动生成自定义页面

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

需要导航入口时，添加对应的 `{url: /projects/, label: Projects}`。自定义页面不会自动插入导航。`file` 必须位于博客 `source/` 内。同一输出路径上，用户编写的源页面优先。

## 可选接入

Cosmos 提供主题和扩展插槽。接入需要账号、渲染器或插件时，需另行安装和配置。以下内容说明接入方式和职责，不表示每项第三方服务都经过在线验证。建议从最小博客开始，添加插件后检查生成结果。

| 需求 | 主题负责 | 外部组件负责 |
| --- | --- | --- |
| RSS | 通过 `seo.rss` 链接订阅文件 | 订阅生成器创建文件。 |
| 站点地图 | 标准 canonical URL 和站点路由 | 站点地图生成器创建文件。 |
| 评论 | `custom.after_post` 插槽和文章级 `comments` 开关 | 服务账号、嵌入代码、初始化和样式。 |
| 数学公式 | 保留文章渲染后的 HTML，加载可选资源 | 兼容的 Markdown 渲染器或插件及数学引擎。 |
| Mermaid | 保留渲染结果，加载自定义 JS/CSS | 图表渲染器或插件及初始化。 |
| 访问统计 | `custom.head` / `custom.body_end` 插槽 | 服务配置与验证。 |

### RSS 与站点地图

在**博客根目录**运行：

```sh
npm install hexo-generator-feed hexo-generator-sitemap
```

在博客 `_config.cosmos.yml` 中设置：

```yaml
seo:
  rss: /atom.xml
```

需要改变输出路径时，在博客 `_config.yml` 配置订阅插件。生成站点后确认实际存在订阅和站点地图文件。参考：[订阅生成器](https://github.com/hexojs/hexo-generator-feed)、[站点地图生成器](https://github.com/hexojs/hexo-generator-sitemap)。

### 评论服务

从服务方获取嵌入代码，放进 `custom.after_post`。按其文档使用嵌入代码或 `custom.js` 加载所需资源。不要将私有 API 密钥写进静态主题配置。文章头部设置 `comments: false` 后，该文章不会输出此插槽。

仅设置 `post.comments: true` 不会安装评论服务。服务初始化和相应主题样式需要自行配置。[Giscus 设置](https://giscus.app/) 是一个可选入口；仓库和分类配置应属于你的站点。

### 数学公式与图表

选择一个兼容的 Markdown 渲染器，并遵循插件安装说明。替换渲染器可能改变 Markdown 行为，需要重新检查表格、代码块、原始 HTML 和已有文章。原生 MathML 可以不依赖 JavaScript 数学引擎直接嵌入，但 `$...$` 和 Mermaid 代码围栏需要额外渲染。

按需用 `custom.css`、`custom.js` 加载站点自己的接入资源。为了性能，可通过站点插件仅在需要的页面加载资源。参考：[Hexo 渲染](https://hexo.io/docs/syntax-highlight)、[KaTeX](https://katex.org/docs/autorender)、[Mermaid](https://mermaid.js.org/intro/)。

### 验证接入

生成博客，分别检查启用和未启用该功能的页面，检查资源请求与浏览器错误，再按实际部署根路径测试。使用自己的博客验证服务访问权限和服务方配置。
