# 个人资料图标

[English](README.md) · [简体中文](README.zh-CN.md)

## 概览

本地打包的 Tabler 线框图标子集，用于 About 联系方式列表。图标继承主题前景色，作为平台文字旁的装饰，不需要运行时 CDN 请求。

## 主要接口与实现

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `icons.json` | 资源映射 | 以规范化平台名称索引完整 SVG 标记。 |
| `sources.json` | 来源记录 | 每个内置图标的上游名称与固定提交版本。 |
| `../../scripts/profile-icons.js` | Hexo 辅助函数 | 注册 `profile_icon(name)`，支持名称别名和通用链接回退。 |
| `LICENSE` | 许可证 | Tabler 原始 MIT 许可证。 |

来源：[Tabler Icons](https://github.com/tabler/tabler-icons/tree/55f87a73f45cf1d9eaf16d7da705065483a9e4f9/icons/outline)，固定提交 `55f87a73f45cf1d9eaf16d7da705065483a9e4f9`。

渲染器添加装饰性无障碍属性和 CSS 类，CSS 决定显示尺寸与描边宽度。抖音使用 TikTok 标记；小红书使用通用书本符号，不代表官方品牌标记。`mail`、`rednote`、`twitter` 分别映射到 `email`、`xiaohongshu`、`x`。未知名称使用通用链接图标。
