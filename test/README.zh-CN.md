# 主题测试

[English](README.md) · [简体中文](README.zh-CN.md)

## 概览

通过真实临时 Hexo 站点验证主题行为，每次测试后移除临时数据。

`npm test` 使用 Node 内置的测试发现机制，不依赖 Shell 展开通配符，兼容 Windows 上的 Node.js 20。

## 主要接口与实现

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| integration.test.cjs | 构建测试 | 路由、内容、覆盖优先级、子目录、语言、开关、空状态、About HTML，并排除主题模块说明同时保留站点自己的 README。 |
| settings.test.cjs | 单元测试 | 列表替换、URL 安全、路径及脚本内容序列化。 |
| documentation.test.cjs | 周边检查 | Markdown 链接与锚点、双语配对及 Agent 指南仅英文的例外、默认英文、主题章节直达链接、用户文档范围、配置 Schema 和 CI 运行环境。 |
| reference.test.cjs | 参考文档回归测试 | 在临时副本中运行参考工具，覆盖 LF/CRLF/混合换行、只读校验、文档与 Schema 过期和默认值变化检测，以及 LF 格式重新生成。 |

`npm run check:package` 单独在新站点安装真实压缩包。`COSMOS_HEXO_VERSION` 指定该检查的 Hexo 版本。此检查依赖网络，与普通测试套件分开。
