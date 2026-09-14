# 仓库维护工具

[English](README.md) · [简体中文](README.zh-CN.md)

## 概览

用于自动测试、文档检查和主题分发的通用仓库工具，不进入主题运行时安装包。通过 npm scripts 运行，以便在各平台找到正确的 npm CLI。

## 主要接口与实现

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| site.cjs | 测试站点构造器 | 创建只链接主题运行文件的临时 Hexo 站点。 |
| check-docs.cjs | Markdown 检查 | 检查译文配对、本地链接和章节锚点，AGENTS.md 仅英文可豁免配对；提供安装包检查所用的用户文档列表。 |
| reference.cjs | 参考生成器 | 由默认配置生成中英文默认值表和 JSON Schema，检查同步状态和示例有效性。 |
| package.cjs | 分发构建器 | 只暂存用户文件和运行时清单，再创建安装包。 |
| check-package.cjs | 分发验证 | 在独立站点安装打包主题，不使用源码符号链接。 |

参见[贡献指南](../CONTRIBUTING.zh-CN.md)。
