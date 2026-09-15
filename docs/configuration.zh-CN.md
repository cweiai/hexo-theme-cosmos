# 配置

[English](configuration.md) · [简体中文](configuration.zh-CN.md)

编辑 Hexo **博客根目录**中的 `_config.cosmos.yml`，这样更新主题目录时不会覆盖个人设置。主题内部的 `_config.yml` 提供带注释的默认配置。

本页下方的[全部默认值](#全部默认值)列出所有配置项。[JSON Schema](theme.schema.json) 可用于博客 YAML 编辑器的补全和校验。

## 配置优先级

主题默认值 < 博客 `_config.cosmos.yml` < 博客内联 `theme_config`。对象递归合并，列表整体替换默认列表，`[]` 也会生效。Cosmos 会在 Hexo 原生合并之后重新应用内联配置，保证空列表确实清空导航或联系方式。About 还会依次叠加 `source/_data/about.yml` 和页面头部配置。使用普通 Hexo 命令时，修改根配置或主题脚本后需重启 Hexo；禁用或移动生成页面后执行 `hexo clean && hexo generate`。

开关使用布尔值。分组设置保持对象结构，例如使用 `search: { enabled: false }`，而不是 `search: false`。

## 站点设置与主题设置

`title`、`author`、`description`、`url`、`root`、`language`、`timezone`、`permalink`、`date_format`、分页和生成器设置放在博客的 `_config.yml`。Cosmos 直接使用这些值，不在主题中维护另一份个人身份信息。

部署到子目录时：

```yaml
url: https://example.org/notebook
root: /notebook/
```

`/images/cover.png` 等主题配置 URL 会自动加上 `root` 前缀。自己写的 HTML 中的 URL 需要自行添加前缀，或使用 Hexo URL 标签。路径尽量不含空格，或进行 URL 编码。个人资料和导航链接接受本地路径、HTTP(S)、邮箱、电话和片段链接；可执行 URL 协议会被拒绝。

## 页面与路由

| 配置项 | 默认值 | 作用 |
| --- | --- | --- |
| `home.mode` | `cover` | `cover` 使用全屏封面；`blog` 将文章列表放在 `/`。 |
| `home.header`, `home.footer` | `false` | 在封面显示普通页眉和页脚。 |
| `home.title`, `home.aside` | 通用笔记本标题 | 无衬线标题主体与可选斜体结尾。 |
| `home.description` | 空 | 可选封面介绍段落。 |
| `home.image` | 图片地址为空 | 包含 `src`、`alt`、`width`、`height`。图片始终静态显示，不生成占位图或动画。 |
| `home.links` | Blog、About | 有序导航列表；空列表隐藏链接。 |
| `routes.blog` | `blog` | 封面模式下，`index_generator.path` 为空时使用的文章列表路径。显式站点列表路径优先。 |
| `routes.about` | `about` | 自动 About 页路径及其命名导航路由。 |
| `pages.about/categories/tags/not_found` | `true` | 启用主题生成的页面。这些开关不会删除用户编写的源页面。 |
| `pages.custom` | `[]` | 每项含 `path`、`title`，可选 `layout`（默认 `page`）、`content` 或 `file`，以及可选 `enabled`。 |

文章列表首页模式会将列表生成器路径设为 `/`；封面模式会将原本冲突的根目录列表移到 `routes.blog`。封面模式不要添加 `source/index.md`，它会与生成的封面冲突并触发明确的构建错误。

归档及分类、标签的**详情页**使用 `hexo-generator-archive`、`hexo-generator-category`、`hexo-generator-tag`。路径遵循博客的 `archive_dir`、`category_dir`、`tag_dir`、`category_map` 和 `tag_map`。在站点配置中设置分页，例如：

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

空站点仍会生成文章列表和归档总览，不会生成没有内容的年份或月份归档。

## 站点标识、导航与页脚

`brand.title` 为空时使用站点标题。`brand.aside` 用封面的衬线字体显示标题结尾；如果标题尚未以该文字结尾，则将其追加。`brand.favicon` 为可选项。

已知路由的导航项使用 `{route, label, icon}`，自定义地址使用 `{url, label, icon}`。已知路由有 `home`、`about`、`blog`、`archives`、`categories`、`tags`。标签为空时使用当前语言的默认文字。`about`、`categories`、`tags` 对应的 `pages` 开关为 `false` 时，其命名导航入口会隐藏；如需链接到自行维护的源页面，使用 `url`。图标名称包括 `arrow`、`diagonal`、`back`、`up`、`search`、`close`、`menu`；未知名称使用箭头。页眉导航忽略可选的 `icon` 字段。

`footer.enabled` 控制整个页脚；`copyright`、`since`、`author`、`back_to_top`、`text`、`links` 控制各部分。页脚作者为空时使用站点作者。没有强制主题署名、社交链接或宣传文字。

## About

| 配置项 | 行为 |
| --- | --- |
| `about.header` | 显示或隐藏整个标题区域。 |
| `about.header_html` | 用可信 HTML 替换标题区域。 |
| `about.sidebar_html` | 用可信 HTML 替换配置生成的个人资料侧栏。 |
| `about.title`, `aside`, `introduction` | 未提供自定义标题 HTML 时使用的纯文字标题和可选介绍行。 |
| `about.content` / `about.file` | Markdown/HTML 内容，或相对于 `source/` 的文件；文件优先。 |
| `about.profile.enabled` | 显示或隐藏配置生成的个人资料。若要使用通栏正文，设为 `false` 并清空 `about.sidebar_html`；自定义侧栏 HTML 优先。 |
| `about.profile.name` | 为空时使用站点作者。 |
| `about.profile.avatar`, `avatar_alt` | 可选头像及其替代文字。 |
| `about.profile.facts` | 有序的 `{label, value}` 信息条目；不完整的条目隐藏。 |
| `about.profile.email` | 第一行邮箱图标与地址；为空时隐藏。 |
| `about.profile.contacts` | 有序的 `{label, url, value, icon}` 条目。URL 和显示值可省略其一，至少填写一个。 |

默认配置保留 GitHub、LinkedIn、X、WeChat、QQ、Weibo、Zhihu、Bilibili、Xiaohongshu、Douyin、YouTube、Instagram、Facebook、TikTok、Threads、Telegram、Discord、Bluesky、Mastodon、Website 的空条目。可用 `icon` 或通用回退图标添加其他平台。只有 `value` 的条目显示为可选中文字，不会伪装成链接。教育经历等个人介绍直接写在 About 内容的 HTML 中，无需独立配置模块。参见[内容示例](content.zh-CN.md)。

侧栏名字下面是任意信息列表，没有固定身份字段。“Based In”等标签可以替换成任意文字，也可以增删条目或调整顺序：

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

使用 `facts: []`、`contacts: []`、`email: ''` 清空对应区域。需要完全自定义侧栏结构时，使用 `about.sidebar_html`。

## 列表与文章详情

| 分组 | 控制项 |
| --- | --- |
| `listing` | `title`、`title_period`、分类筛选 `categories`、`counts`、`excerpts`、`excerpt_length`、`date`、`category`、`reading_time`、`aside`、`aside_note`、`signoff`。 |
| `post` | `back_link`、`description`、`author`、`date`、`updated`、`categories`、`reading_time`、`toc`、`toc_depth`、`toc_numbers`、`reading_note`、`progress`、`copy_code`、`tags`、`signoff`、`navigation`、`comments`。 |
| `search` | `enabled`、本地 JSON 的 `path`、结果数量 `limit`。匹配已发布文章的标题、正文、第一个分类和标签。设置 `search: false` 或 `noindex: true` 的文章会被排除；普通页面不参与索引。 |
| `motion` | `enabled` 关闭主题主动添加的所有动态效果；`page_transitions` 独立控制页面切换。始终尊重系统的减少动态效果偏好。 |
| `seo` | 默认分享图 `image`、`twitter_card`、`noindex` 和可选的 `rss` 地址。 |

可选的侧栏文字和结语默认均为空。阅读提示和列表旁注中的换行会保留。文章的 `post_options` 可覆盖任意 `post` 设置，标准头部配置 `toc: false` 和 `comments: false` 也有效。较旧文章的入口显示在右侧，即使没有较新文章也是如此。空标签和结语不会产生空白的文章结尾区域。

## 样式详情

`style` 会输出 CSS 自定义属性，不需要编译器。尺寸使用 CSS 单位；行高可使用无单位数字或 CSS 字符串。

| 分组 | 控制项 |
| --- | --- |
| `style.colors` | `paper`、`paper_low`、`ink`、`muted`、`accent`、`honey`、`rule`。 |
| `style.fonts` | `sans`、`serif` 字体栈，以及内置字体的 `preload`。自定义字体通过自己的 CSS 加载。 |
| `style.layout` | `max_width`、`prose_width`、`profile_width`、`about_gap`、`toc_width`、`article_gap`。列布局会响应屏幕宽度收起。 |
| `style.typography` | `body_size`、`body_mobile_size`、`body_line_height`、`body_mobile_line_height`、`quote_size`、`quote_mobile_size`、`quote_line_height`。 |
| `style.hero` | `title_size`、`title_mobile_size`、`title_small_size`、`aside_indent`、`image_width`。 |
| `style.variables` | 不含前缀 `--` 的其他 CSS 变量名，例如 `ease`。 |

示例：

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

将 CSS 放在 `source/css/my-theme.css`，它会在主题样式和配置样式之后加载。布局类名都可作为普通 CSS 选择器使用，便于调整单个标题、断点或装饰。自定义配色不会自动校正对比度，需要自行检查。

## 语言与扩展

设置博客 `language: en` 或 `zh-CN`。内置界面文字（包括搜索和代码复制反馈）来自 `languages/`。可在 `labels` 中覆盖单个键，例如 `labels: {blog: Journal, back_blog: Back to writing}`。页面头部的 `lang` 可以覆盖当前页的界面语言。自定义导航标签和作者内容按原样显示。

未填写标题的文章在标题、元数据、列表、相邻文章链接和搜索中使用 `labels.untitled`（英文为 `Untitled`，中文为 `无标题`），回退文字遵循文章的语言。请保留非空标签，让链接可读。图库图片使用带 `{number}` 占位符的 `labels.photo`，例如 `labels: {untitled: 未命名笔记, photo: '第 {number} 张图片'}`。图库和代码块语法见[文章内容](content.zh-CN.md#文章与普通页面)。

`custom.css`、`custom.js` 是有序 URL 列表，脚本以 `defer` 加载。原始 HTML 插槽 `head`、`body_start`、`body_end`、`before_content`、`after_content`、`after_about`、`after_post` 默认均为空。`after_post` 遵循评论开关，可用于放置评论组件。需要通过代码插入内容时，可在站点插件中使用 Hexo 原生 injector API。

这些插槽会执行站点作者提供的可信代码，不要填入不可信的访客输入。元数据和普通配置文字会单独转义。默认不开启外部统计、评论平台、字体 CDN 或账号标识。

## 现成配置方案

将所需设置合并到博客根目录 `_config.cosmos.yml`，保留个人内容。导航等列表会替换现有列表。

| 配置方案 | 效果 |
| --- | --- |
| [minimal-cover.yml](../presets/minimal-cover.yml) | 静态封面、精简导航和页脚，以及阅读旁注。将 `home.image.src` 设置为自己的图片。 |
| [writing.yml](../presets/writing.yml) | 文章列表位于 `/`，阅读宽度为 70 个字符，显示更新日期和带编号的目录。 |
| [portfolio.yml](../presets/portfolio.yml) | 项目入口、笔记导航、示例 Projects 页和通栏 About 正文。 |

写作首页无需额外创建冲突的 `source/index.md`。替换作品集页面内容，或将其 `file` 指向博客 `source/` 中的内容片段。

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

## 编辑器补全

使用安装了 YAML 扩展的 VS Code 时，目录安装可在博客工作区设置中加入：

```json
{
  "yaml.schemas": {
    "./themes/cosmos/docs/theme.schema.json": ["/_config.cosmos.yml"]
  }
}
```

包安装则改用 `./node_modules/hexo-theme-cosmos/docs/theme.schema.json`。Schema 检查配置名和类型；自定义 CSS、脚本仍需在浏览器中验证。

## 全部默认值

博客 `_config.cosmos.yml` 中的所有设置均可省略。下表列出应用个人覆盖配置之前的主题默认值。

<!-- cosmos:defaults:start -->

### brand 默认值

作用范围: 页眉与元数据.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `brand.title` | 字符串 | `""` |  |
| `brand.aside` | 字符串 | `""` |  |
| `brand.favicon` | 字符串 | `""` |  |

### home 默认值

作用范围: 封面首页.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `home.mode` | 字符串 | `"cover"` | cover 生成全屏封面；blog 将文章列表放在根目录。 |
| `home.header` | 布尔值 | `false` |  |
| `home.footer` | 布尔值 | `false` |  |
| `home.title` | 字符串 | `"An open"` |  |
| `home.aside` | 字符串 | `"notebook."` |  |
| `home.description` | 字符串 | `""` |  |
| `home.image.src` | 字符串 | `""` |  |
| `home.image.alt` | 字符串 | `""` |  |
| `home.image.width` | 数字 | `1254` |  |
| `home.image.height` | 数字 | `1254` |  |
| `home.links` | 列表 | `[{"route":"blog","label":"","icon":"arrow"},{"route":"about","label":"","icon":"diagonal"}]` |  |

### routes 默认值

作用范围: 生成页面的路由.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `routes.blog` | 字符串 | `"blog"` |  |
| `routes.about` | 字符串 | `"about"` |  |

### navigation 默认值

作用范围: 页眉导航.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `navigation` | 列表 | `[{"route":"home","label":""},{"route":"about","label":""},{"route":"blog","label":""},{"route":"archives","label":""}]` |  |

### pages 默认值

作用范围: 生成页面.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `pages.about` | 布尔值 | `true` |  |
| `pages.categories` | 布尔值 | `true` |  |
| `pages.tags` | 布尔值 | `true` |  |
| `pages.not_found` | 布尔值 | `true` |  |
| `pages.custom` | 列表 | `[]` | 有序的自动生成页面列表；相同路由的源页面优先。 |

### about 默认值

作用范围: About 页面.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `about.header` | 布尔值 | `true` |  |
| `about.header_html` | 字符串 | `""` | 替换整个 About 标题的可信 HTML。 |
| `about.sidebar_html` | 字符串 | `""` | 替换默认个人资料侧栏的可信 HTML。 |
| `about.title` | 字符串 | `""` |  |
| `about.aside` | 字符串 | `""` |  |
| `about.introduction` | 字符串 | `""` |  |
| `about.content` | 字符串 | `""` |  |
| `about.file` | 字符串 | `""` | 相对于博客 source 目录的文件，优先于 about.content。 |
| `about.profile.enabled` | 布尔值 | `true` | 显示配置生成的个人资料；若要移除侧栏及其列，还需清空 about.sidebar_html。 |
| `about.profile.name` | 字符串 | `""` |  |
| `about.profile.avatar` | 字符串 | `""` |  |
| `about.profile.avatar_alt` | 字符串 | `""` |  |
| `about.profile.facts` | 列表 | `[]` |  |
| `about.profile.email` | 字符串 | `""` |  |
| `about.profile.contacts` | 列表 | <details><summary>查看全部条目</summary><code>[{"label":"GitHub","url":""},{"label":"LinkedIn","url":""},{"label":"X","url":""},{"label":"WeChat","value":""},{"label":"QQ","value":""},{"label":"Weibo","url":""},{"label":"Zhihu","url":""},{"label":"Bilibili","url":""},{"label":"Xiaohongshu","url":""},{"label":"Douyin","url":""},{"label":"YouTube","url":""},{"label":"Instagram","url":""},{"label":"Facebook","url":""},{"label":"TikTok","url":""},{"label":"Threads","url":""},{"label":"Telegram","url":""},{"label":"Discord","url":""},{"label":"Bluesky","url":""},{"label":"Mastodon","url":""},{"label":"Website","url":""}]</code></details> | 有序联系方式，空条目隐藏；仅有 value 的条目显示为可选中文字。 |

### listing 默认值

作用范围: 文章、归档、分类和标签列表.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `listing.title` | 字符串 | `""` |  |
| `listing.title_period` | 布尔值 | `true` |  |
| `listing.categories` | 布尔值 | `true` |  |
| `listing.counts` | 布尔值 | `true` |  |
| `listing.excerpts` | 布尔值 | `true` |  |
| `listing.excerpt_length` | 数字 | `150` |  |
| `listing.date` | 布尔值 | `true` |  |
| `listing.category` | 布尔值 | `true` |  |
| `listing.reading_time` | 布尔值 | `true` |  |
| `listing.aside` | 字符串 | `""` |  |
| `listing.aside_note` | 字符串 | `""` |  |
| `listing.signoff` | 字符串 | `""` |  |

### post 默认值

作用范围: 文章页面.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `post.back_link` | 布尔值 | `true` |  |
| `post.description` | 布尔值 | `true` |  |
| `post.author` | 布尔值 | `true` |  |
| `post.date` | 布尔值 | `true` |  |
| `post.updated` | 布尔值 | `false` |  |
| `post.categories` | 布尔值 | `false` |  |
| `post.reading_time` | 布尔值 | `true` |  |
| `post.toc` | 布尔值 | `true` |  |
| `post.toc_depth` | 整数 | `3` | 文章目录中显示的最大标题级别，取 1 至 6 的整数。 |
| `post.toc_numbers` | 布尔值 | `false` |  |
| `post.reading_note` | 字符串 | `""` |  |
| `post.progress` | 布尔值 | `true` |  |
| `post.copy_code` | 布尔值 | `true` |  |
| `post.tags` | 布尔值 | `true` |  |
| `post.signoff` | 字符串 | `""` |  |
| `post.navigation` | 布尔值 | `true` |  |
| `post.comments` | 布尔值 | `true` | 显示 custom.after_post；该开关不会安装评论服务。 |

### search 默认值

作用范围: 本地文章搜索.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `search.enabled` | 布尔值 | `true` |  |
| `search.path` | 字符串 | `"search.json"` | 生成的本地搜索 JSON 路径，遵循站点根路径。 |
| `search.limit` | 整数 | `30` | 最多显示的搜索结果数，取正整数；索引保持本地生成。 |

### footer 默认值

作用范围: 页脚.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `footer.enabled` | 布尔值 | `true` |  |
| `footer.copyright` | 布尔值 | `true` |  |
| `footer.since` | 字符串 | `""` |  |
| `footer.author` | 字符串 | `""` |  |
| `footer.back_to_top` | 布尔值 | `true` |  |
| `footer.text` | 字符串 | `""` |  |
| `footer.links` | 列表 | `[]` |  |

### style 默认值

作用范围: 站点外观.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `style.colors.paper` | 字符串 | `"#f4eedf"` |  |
| `style.colors.paper_low` | 字符串 | `"#eae1d0"` |  |
| `style.colors.ink` | 字符串 | `"#342c24"` |  |
| `style.colors.muted` | 字符串 | `"#6c6052"` |  |
| `style.colors.accent` | 字符串 | `"#a6402c"` |  |
| `style.colors.honey` | 字符串 | `"#eccc77"` |  |
| `style.colors.rule` | 字符串 | `"#d4c7b1"` |  |
| `style.fonts.sans` | 字符串 | `"\"Hanken Grotesk\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"` |  |
| `style.fonts.serif` | 字符串 | `"Petrona, \"Songti SC\", \"Noto Serif CJK SC\", Georgia, serif"` |  |
| `style.fonts.preload` | 布尔值 | `true` |  |
| `style.layout.max_width` | 字符串 | `"1280px"` |  |
| `style.layout.prose_width` | 字符串 | `"none"` |  |
| `style.layout.profile_width` | 字符串 | `"270px"` |  |
| `style.layout.about_gap` | 字符串 | `"108px"` |  |
| `style.layout.toc_width` | 字符串 | `"230px"` |  |
| `style.layout.article_gap` | 字符串 | `"72px"` |  |
| `style.typography.body_size` | 字符串 | `"17px"` |  |
| `style.typography.body_mobile_size` | 字符串 | `"16px"` |  |
| `style.typography.body_line_height` | 数字或字符串 | `1.9` |  |
| `style.typography.body_mobile_line_height` | 数字或字符串 | `1.85` |  |
| `style.typography.quote_size` | 字符串 | `"21px"` |  |
| `style.typography.quote_mobile_size` | 字符串 | `"19px"` |  |
| `style.typography.quote_line_height` | 数字或字符串 | `1.65` |  |
| `style.hero.title_size` | 字符串 | `"clamp(72px, 7.5vw, 96px)"` |  |
| `style.hero.title_mobile_size` | 字符串 | `"clamp(54px, 15vw, 76px)"` |  |
| `style.hero.title_small_size` | 字符串 | `"clamp(48px, 15vw, 58px)"` |  |
| `style.hero.aside_indent` | 字符串 | `"64px"` |  |
| `style.hero.image_width` | 字符串 | `"min(68vw, 92svh, 980px)"` |  |
| `style.variables` | 对象 | `{}` | 额外的 CSS 自定义属性，不含开头的 --；键名必须是 CSS 标识符。 |

### motion 默认值

作用范围: 浏览器交互.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `motion.enabled` | 布尔值 | `true` |  |
| `motion.page_transitions` | 布尔值 | `true` |  |

### seo 默认值

作用范围: 元数据与订阅链接.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `seo.image` | 字符串 | `""` |  |
| `seo.twitter_card` | 字符串 | `"summary_large_image"` |  |
| `seo.noindex` | 布尔值 | `false` |  |
| `seo.rss` | 字符串 | `""` | 由独立插件生成的现有订阅文件 URL。 |

### labels 默认值

作用范围: 内置界面文字.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `labels` | 对象 | `{}` | 界面译文覆盖值；空字符串可移除构建时渲染的可选文字，浏览器交互提示请保留非空文字。 |

### custom 默认值

作用范围: 站点自定义扩展.

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `custom.css` | 列表 | `[]` | 有序样式表 URL，加载于主题样式之后。 |
| `custom.js` | 列表 | `[]` | 有序脚本 URL，以 defer 加载。 |
| `custom.head` | 字符串 | `""` |  |
| `custom.body_start` | 字符串 | `""` |  |
| `custom.body_end` | 字符串 | `""` |  |
| `custom.before_content` | 字符串 | `""` |  |
| `custom.after_content` | 字符串 | `""` |  |
| `custom.after_about` | 字符串 | `""` |  |
| `custom.after_post` | 字符串 | `""` | 受评论开关控制的可信文章末尾 HTML。 |

<!-- cosmos:defaults:end -->
