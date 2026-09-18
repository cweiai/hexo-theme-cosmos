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
| screenshots/ | 视觉验证 | 无标题文章、中性图库图片、代码行标记，以及复制按钮对齐和长行独立滚动的桌面与手机截图。 |

`npm run check:package` 单独在新站点安装真实压缩包。`COSMOS_HEXO_VERSION` 指定该检查的 Hexo 版本。此检查依赖网络，与普通测试套件分开。

检查代码标记行间距时，在桌面和手机宽度下验证 2px 强调色竖线后留有 8px 间隔、代码行首对齐、缩进保留且复制文字不变。同时检查长行、隐藏行号、禁用复制和关闭 JavaScript 后的阅读。`screenshots/code-mark-spacing-desktop.png` 与 `screenshots/code-mark-spacing-mobile.png` 记录了生成的 Hexo 文章中的间距修复效果。

文章回归测试覆盖无标题文章的元数据、列表、相邻链接和搜索，包括文章语言和标签覆盖。图库用例经过真实 Hexo 头部配置解析，验证 URL 转义、协议过滤、顺序、空列表、旧式 `photo` 和子目录根路径。修改代码高亮样式时，需要在浏览器中检查 `.line.marked`；仅验证生成的 HTML 无法证明高亮颜色和复制行为正确。

修改代码复制功能时，在桌面和手机宽度下检查 Highlight.js 与 Prism 代码框，包括首行超长、单行片段、标题、标记行和本地化按钮文案。验证横向滚动时按钮位置不变、键盘焦点和方向键滚动可用，以及复制结果保留代码文字且不含行号。同时检查剪贴板失败反馈、禁用复制、关闭 JavaScript 后的阅读和打印效果。
