# 页面模板

[English](README.md) · [简体中文](README.zh-CN.md)

## 概览

标准页面和可复用排版组件的 EJS 布局。

## 主要接口与实现

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| layout.ejs | 文档 | 元数据、资源、页眉页脚开关和原始扩展插槽。 |
| home.ejs | 封面 | 静态图片或纯排版的全屏封面。 |
| about.ejs | About | 可用 HTML 自定义的标题、侧栏和介绍，可选数据驱动资料区。 |
| index.ejs | 列表 | 博客、归档、分类、标签文章列表及搜索。 |
| post.ejs | 文章 | 可配置的阅读控件、元数据、头部配置图库和导航。 |
| page.ejs | 页面 | 通用 Markdown/HTML 内容。 |
| categories.ejs / tags.ejs | 分类索引 | 所有分类和标签的导航。 |
| _partial/ | 组件 | 个人资料、文章条目、导航、页脚和分类条目。 |

文章标题、文档元数据、列表条目和相邻文章链接共用 `entry_title` 的本地化回退文字。图库 URL 经 `post_photos` 处理后以转义属性输出；普通正文保留渲染器的输出。

`layout.ejs` 在 `motion.enabled` 为 `true`、存储可用且未开启减少动态效果时，在绘制前启用封面入场。跨页面切换要求同时启用 `motion.enabled` 和 `motion.page_transitions`。按根路径区分的访问检查使用 `cosmos_json` 安全序列化内联脚本。页眉的装饰性双线 SVG 随语义化菜单按钮的 `aria-expanded` 状态变化；关闭 JavaScript 后，导航仍是普通链接。
