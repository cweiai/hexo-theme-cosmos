# 安装、更新与排错

[English](usage.md) · [简体中文](usage.zh-CN.md)

## 安装

需要 **Hexo 7 或 8**、**Node.js 20+**、npm 和 Git，推荐 Node.js 24。

还没有博客时，先创建一个：

```sh
npx hexo-cli init my-blog
cd my-blog
npm install
```

在 **Hexo 博客根目录**运行：

```sh
git clone https://github.com/cweiai/hexo-theme-cosmos.git themes/cosmos
cd themes/cosmos
npm install
cd ../..
```

编辑博客的 `_config.yml`，保留其他站点配置，设置以下字段：

```yaml
title: 我的笔记本
author: 你的名字
url: https://example.com
root: /
language: zh-CN
theme: cosmos
index_generator:
  path: blog
  per_page: 10
  order_by: -date
```

将 `url` 换成你的博客地址。在 **博客根目录**新建 `_config.cosmos.yml`，与上面的 `_config.yml` 放在一起：

```yaml
home:
  title: 我的
  aside: 笔记本。
about:
  profile:
    name: 你的名字
    facts:
      - { label: 目前专注, value: 写作与设计 }
  content: |
    ## 你好
    欢迎来到我的笔记本。
```

运行博客预览：

```sh
npx hexo clean
npx hexo generate
npx hexo server
```

打开 Hexo 打印的地址，通常是 `http://localhost:4000/`。首页位于 `/`，文章列表位于 `/blog/`，About 位于 `/about/`。

**也可以使用主题安装包：**如果已有 Cosmos 的 `.tgz` 文件，在博客根目录执行 `npm install "/路径/hexo-theme-cosmos-<版本>.tgz"`，所需依赖会自动安装。仍使用上面的 `theme: cosmos` 和配置；目录安装与包安装选择一种即可。

## 更新与回滚

先查看[最近的修改](https://github.com/cweiai/hexo-theme-cosmos/commits/main/)，备份博客配置、`source/`、package 文件与锁文件，并记录当前主题提交：

```sh
cd themes/cosmos
git rev-parse HEAD
git pull --ff-only
npm install
cd ../..
npx hexo clean
npx hexo generate
npx hexo server
```

发布博客前检查首页、About、文章、搜索和手机排版。若 Git 提示本地修改或历史分叉，先保留并处理这些修改，不要直接覆盖。未修改主题文件时，可执行 `git -C themes/cosmos checkout <之前的提交>`，在 `themes/cosmos` 重新执行 `npm install`，再返回博客根目录清理并生成来回滚；以后恢复跟随分支时执行 `git -C themes/cosmos switch <分支名>`。

主题包安装则使用 `npm install "/路径/主题包.tgz"` 更新，保留旧包以便回滚。如果也要恢复依赖版本，恢复备份中的博客锁文件并执行 `npm ci`。

**从其他主题迁移：**验证 Cosmos 前保留旧主题。保留文章的原始日期和永久链接，将图片放在博客的 `source/`，个人主题配置放在 `_config.cosmos.yml`。部署到子目录时检查自定义 HTML 中的链接前缀。

## 常见问题

| 问题 | 处理方法 |
| --- | --- |
| 改配置没反应 | 确认 `theme: cosmos`，修改的是博客根目录 `_config.cosmos.yml`。内联 `theme_config`、About 数据或页面头部配置可能覆盖它；重启 Hexo，再 clean 和 generate。 |
| 找不到主题或渲染器 | Git 安装检查 `themes/cosmos/layout/`，在 `themes/cosmos` 执行 `npm install`。通过 npm 安装主题包则检查 `node_modules/hexo-theme-cosmos/layout/`，在博客根目录执行 `npm install`。Hexo 命令始终在博客根目录运行。 |
| 首页路由冲突 | 封面模式下移走自己的 `source/index.md`，或使用 `home.mode: blog`。 |
| About 内容不更新 | 已有的 `source/about/index.md` 会覆盖自动页面，修改它或将其内容迁入配置指定的 About 文件。 |
| 图片或 CSS 404 | 文件放在博客 `source/`，公开 URL 不带 `/source/`；核对大小写，部署生成的 `public/`。 |
| 部署在子目录 | 站点配置同时设置 `url: https://example.com/notebook` 和 `root: /notebook/`；自己的 HTML 链接也要包含前缀。 |
| 搜索漏掉文章 | 检查 `search.json`；文章设置 `search: false` 或 `noindex: true` 会被排除。 |
| 评论、公式或 Mermaid 没出现 | 需要配置对应服务或渲染器；`post.comments` 只控制文章末尾 HTML 插槽。参见[可选接入](content.zh-CN.md#可选接入)。 |
| 改路由后旧页面仍存在 | 执行 `npx hexo clean` 后重新生成，并替换部署产物。 |

仍有问题时，[提交 Issue](https://github.com/cweiai/hexo-theme-cosmos/issues/new?template=bug.zh-CN.yml)，附上主题、Hexo、Node 版本、第一条错误、最小配置和复现步骤。也欢迎[提出功能需求](https://github.com/cweiai/hexo-theme-cosmos/issues/new?template=feature.zh-CN.yml)。支持按维护者可用时间处理；外部服务和自定义脚本可能需要单独排查。
