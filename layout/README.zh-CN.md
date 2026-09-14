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
| post.ejs | 文章 | 可配置的阅读控件、元数据和导航。 |
| page.ejs | 页面 | 通用 Markdown/HTML 内容。 |
| categories.ejs / tags.ejs | 分类索引 | 所有分类和标签的导航。 |
| _partial/ | 组件 | 个人资料、文章条目、导航、页脚和分类条目。 |
