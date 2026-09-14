# 仓库自动化

[English](AUTOMATION.md) · [简体中文](AUTOMATION.zh-CN.md)

## 概览

[cweiai/hexo-theme-cosmos](https://github.com/cweiai/hexo-theme-cosmos) 的 GitHub 验证流程和贡献表单。推送、PR 和手动运行都会触发验证。本指南保留 `AUTOMATION.md` 文件名，让 GitHub 在仓库首页展示主题根目录的 README。

## 主要接口与实现

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `workflows/ci.yml` | 验证 | Linux/macOS/Windows 上的 Node 20/22/24，以及 Hexo 7.3.0/8.1.2 独立安装构建。 |
| `ISSUE_TEMPLATE/` | 表单 | 中英文问题报告与功能需求。 |
| `PULL_REQUEST_TEMPLATE.md` | 审查模板 | 默认英文的问题描述、验证、文档和兼容性信息；另有中文版本。 |

工作流只执行验证。本地生成安装包见[打包说明](../CONTRIBUTING.zh-CN.md#打包主题)。
