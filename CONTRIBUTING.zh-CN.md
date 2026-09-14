# 参与 Cosmos

[English](CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-CN.md)

## 概览

欢迎为 [Cosmos](https://github.com/cweiai/hexo-theme-cosmos) 贡献问题修复、文档、翻译和示例配置。可复现的问题通过[问题表单](https://github.com/cweiai/hexo-theme-cosmos/issues/new?template=bug.zh-CN.yml)提交；较大的变更请先在 Issue 中讨论，再提交 PR。

## 主要接口与实现

| 范围 | 文件 |
| --- | --- |
| 主题 | `_config.yml`、`layout/`、`scripts/`、`lib/`、`languages/`、`source/` |
| 用户文档 | README 及 `docs/` 中的配置、写作和使用指南 |
| 验证 | `test/`、`tools/check-docs.cjs`、`tools/check-package.cjs` |
| 打包与 CI | `tools/package.cjs`、`.github/workflows/ci.yml` |

## 提交修改

Fork 仓库并为修改创建分支。使用 Node.js 24，通过 `npm ci` 安装依赖。本指南中的 **MUST** 表示必须，**SHOULD** 表示默认应遵守、有具体理由时可采用其他方案，**MAY** 表示可选。

提交 PR 前运行 `npm run check`。修改依赖、安装方式、打包或生成器时，还需运行 `npm run check:package`。集成测试使用虚构示例构建临时 Hexo 站点。涉及视觉变化时，在 Hexo 博客中检查桌面和移动端布局，并在 PR 中附上截图。

在 PR 中说明具体问题、修改后的行为、验证和兼容性影响。同步更新受影响的中英文文档，包括配置变化和迁移步骤。原创代码贡献使用 [MIT 许可证](LICENSE)，并保留第三方声明。

## 代码规范

- 修改 **MUST** 遵守 [.editorconfig](.editorconfig)：UTF-8、LF、两空格缩进、文件末尾换行。避免无关的格式调整。
- Node/Hexo 模块中的 JavaScript **MUST** 沿用 CommonJS。新代码 **SHOULD** 使用 `const`、单引号字符串、分号和 `'use strict';`，并与周围代码保持一致。代码注释 **MUST** 使用英文，**SHOULD** 说明意图或约束。
- 模板 **MUST** 转义纯文字和属性。保留现有 URL/路径处理、子目录支持、配置优先级及明确允许可信 HTML 的插槽。基于现有 EJS、普通 CSS 和浏览器 JavaScript 结构扩展。
- 修改 **MUST** 保留键盘可访问性和减少动态效果的行为。新增依赖 **SHOULD** 有明确必要性；有助于维护行为时，贡献者 **MAY** 添加职责明确的辅助函数或测试。

## 提交规范

提交标题 **MUST** 使用英文 Conventional Commits：`<type>(<scope>): <祈使句摘要>`，范围可省略。类型使用 `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore` 或 `revert`，例如 `fix(search): preserve subdirectory URLs`。

标题 **SHOULD** 不超过 72 个字符且不以句号结尾。每个提交 **SHOULD** 对应一项完整、明确的修改。不兼容变更 **MUST** 在类型或范围后加 `!`，并在 `BREAKING CHANGE:` 尾注中说明迁移方式。正文 **MAY** 补充动机、取舍和验证结果。

## 文档

默认英文：英文使用 `name.md`，简体中文使用 `name.zh-CN.md`。对应译文之间直接链接，保持结构一致。模块的文档接口或行为发生变化时，同步更新两种语言的模块 README。仅英文的 [Agent 指南](AGENTS.md)、第三方许可证原文、标准 JSON Schema 和示例博文不要求译文配对。

README 只介绍主题、展示截图、提供快速安装和直达文档链接，配置详情放在配置指南。用户指南说明如何在博客中使用 Cosmos，贡献者命令集中在本文件。文档保持为 Markdown 文件，不增加文档站或个人预览、推送快捷入口。通过 `npm run docs:reference` 更新自动生成的默认值表和 Schema。`npm run docs:check` 验证示例、生成的参考内容、译文配对、本地链接和章节锚点，也检查 Agent 指南中的链接。

## 打包主题

调整包版本时，使用 `npm version patch --no-git-tag-version`（或 minor/major）同步更新 package.json 和 package-lock.json。用户可见变化和迁移步骤记录在 PR 及受影响的用户指南中。

准备安装包前运行 `npm run check` 和 `npm run check:package`，再通过 `npm run theme:pack` 在本地 `dist/` 生成 `.tgz`。安装包包含主题运行文件、用户指南、预设和许可证，排除 Agent/贡献者文档、测试和仓库工具。

CI 检查 Linux、macOS、Windows 上的 Node 20/22/24，并单独验证 Hexo 7.3.0 和 8.1.2 的安装包。合并前应查看工作流的实际结果。工作流只执行验证，本地打包不会向任何位置上传文件。
