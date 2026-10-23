# toolkit-template

> 篝火出品 · 篝火 App 应用区开源工具的统一模板

campfire-code 开源工具箱的桌面工具模板（Tauri 2 + React + TypeScript）。仓库里自带一个能直接运行的样例工具「图片批量压缩」。

## 结构

- `src/kit/`：所有工具共用的界面框架。包括 6 套布局（A 侧边导航、B 三栏工作台、C 向导步骤、D 预览为主、E 极简单窗、F 顶部标签卡片）、7 种配色、亮色与暗色、批量任务调度、大模型设置页、处理记录和关于页。
- `src/tool/`：工具自己的逻辑。工具只需要声明三件事，界面由 kit 按 `tool.json` 里的 `ui.layout` 和 `ui.palette` 渲染：
  - 接收什么文件；
  - 有哪些参数；
  - 每个文件怎么处理，或者怎么生成内容。
- `tool.json`：工具信息与界面抽签结果。抽签由汇总仓库 `toolkit-hub` 按工具编号完成。
- `sidecar/`（可选）：需要 Python 库时放 `main.py` 和 `requirements.txt`。出包流程会自动用 PyInstaller 打成内置程序，工具代码通过 `ctx.sidecar(args)` 调用。

## 新建工具

在汇总仓库里执行 `node scripts/new-tool.mjs <编号> --push`。不要直接点 GitHub 上的「Use this template」，那样不会填写工具信息，也不会做界面抽签。

## 开发

```bash
pnpm install
pnpm test
pnpm tauri dev
```

布局预览（开发用，不需要启动桌面应用）：`pnpm dev` 后打开 `http://localhost:1420/preview.html?layout=a&palette=blue&mode=light&state=running`。

## 归属

用这个模板生成的每个工具都属于「篝火」App，归属信息集中在 `src/kit/brand.ts`，会出现在软件界面、「关于」页、安装包信息、README 与发布说明里。

## 许可证

MIT，版权方为篝火（campfire-code）
