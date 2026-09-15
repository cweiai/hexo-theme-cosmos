# Cosmos

[English](README.md) · [简体中文](README.zh-CN.md)

一款适合个人写作、项目介绍和 About 页的 Hexo 主题，使用纸张色调、本地字体和宽松排版。

[在线预览](https://cweiai.io) · [主题截图（800×500 PNG）](docs/images/Cosmos.png)

[配置](docs/configuration.zh-CN.md) · [写作](docs/content.zh-CN.md) · [帮助](docs/usage.zh-CN.md#常见问题) · [GitHub](https://github.com/cweiai/hexo-theme-cosmos)

![Cosmos 桌面首页](docs/images/home-desktop.png)

## 功能

- 封面或文章列表首页，支持归档、分类、标签和自定义页面。
- 可编辑标签和联系方式的 About 侧栏，以及自定义 HTML。
- 本地搜索、文章目录、阅读进度和代码复制。
- 可调整配色、字体、阅读宽度、导航、页脚和移动端字号。
- 字体随主题提供，默认无需外部账号、统计服务或字体 CDN。

## 安装

需要 **Hexo 7–8**、**Node.js 20+**、npm 和 Git，推荐 Node.js 24。

在 **Hexo 博客根目录**运行：

```sh
git clone https://github.com/cweiai/hexo-theme-cosmos.git themes/cosmos
cd themes/cosmos
npm install
cd ../..
```

在博客的 `_config.yml` 中启用 Cosmos：

```yaml
theme: cosmos
index_generator:
  path: blog
  per_page: 10
  order_by: -date
```

在博客根目录新建 `_config.cosmos.yml` 保存个人主题设置，然后预览：

```sh
npx hexo clean
npx hexo generate
npx hexo server
```

打开 Hexo 打印的地址，通常是 `http://localhost:4000/`。从零创建博客或使用主题安装包，参见[安装说明](docs/usage.zh-CN.md#安装)。

## 文档

| 内容 | 直接查看 |
| --- | --- |
| 配置项、示例和默认值 | [配置文档](docs/configuration.zh-CN.md) |
| About 标签、个人信息和联系方式 | [About 配置](docs/configuration.zh-CN.md#about) |
| 颜色、字体和阅读宽度 | [样式配置](docs/configuration.zh-CN.md#样式详情) |
| 写作、作品集等现成方案 | [配置方案](docs/configuration.zh-CN.md#现成配置方案) |
| 文章、About HTML 和自定义页面 | [内容写作](docs/content.zh-CN.md) |
| RSS、评论、公式与图表 | [可选接入](docs/content.zh-CN.md#可选接入) |
| 更新主题与恢复旧版本 | [更新与回滚](docs/usage.zh-CN.md#更新与回滚) |
| 配置、路由和资源加载问题 | [常见问题](docs/usage.zh-CN.md#常见问题) |

![Cosmos 桌面文章页](docs/images/article-desktop.png)

## 反馈

[报告问题](https://github.com/cweiai/hexo-theme-cosmos/issues/new?template=bug.zh-CN.yml) · [提出功能需求](https://github.com/cweiai/hexo-theme-cosmos/issues/new?template=feature.zh-CN.yml)

报告问题时请附上主题、Hexo、Node 版本、第一条错误和最小复现步骤。

## 许可证

Cosmos 原创代码采用 [MIT](docs/license.zh-CN.md)，字体和图标保留[第三方声明](THIRD_PARTY_NOTICES.zh-CN.md)中的许可。
