# QWS-UI

> 企业级 React 数据管理组件库 - 由 AI 全程辅助开发

<div align="center">

[![AI Powered](https://img.shields.io/badge/🤖_AI_Powered-Claude_Code-blue?style=for-the-badge)](https://claude.ai/code)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**[📖 在线文档](http://qws-ui.rs.ink/?path=/docs/components-advancedtable--docs)** | **[🚀 快速开始](#快速开始)** | **[📦 安装组件](#安装组件)**

### 🌍 仓库镜像

[![Gitee](https://img.shields.io/badge/Gitee-qws--ui-C71D23?style=flat-square&logo=gitee)](https://gitee.com/qianwensoft/qws-ui)
[![GitHub](https://img.shields.io/badge/GitHub-qws--ui-181717?style=flat-square&logo=github)](https://github.com/qianwensoft/qws-ui)

</div>

---

## 项目简介

QWS-UI 是一个专注于**数据管理和打印**场景的企业级 React 组件库，采用 shadcn/ui 风格设计，支持 CLI 一键安装。

**🤖 特别说明**：本项目由 [Claude Code](https://claude.ai/code) AI 辅助完成（95%+ 代码由 AI 生成），展示了 AI 在现代前端开发中的实际应用能力。

### ✨ 核心特性

- 🎨 **shadcn/ui 风格** - 美观现代的 UI 组件基础
- 📦 **CLI 安装** - 支持 `shadcn add` 一键安装组件
- 🔧 **TypeScript** - 完整的类型支持和智能提示
- 📖 **Storybook** - 15+ 交互式示例和完整文档
- 🧪 **测试覆盖** - 84+ 单元测试，确保质量
- 🚀 **开箱即用** - 无需额外配置，安装即用

---

## 🔷 核心组件

### 1. AdvancedTable - 高级表格

功能丰富的企业级表格组件，提供类 Excel 交互体验：

**📝 编辑功能**
- 单击/双击编辑模式 + 自动保存
- 行级编辑控制（数据属性 + 回调函数）
- Excel 数据粘贴，自动创建新行
- 列级别编辑权限控制

**🎯 列管理**
- 拖拽排序、调整宽度、显示/隐藏
- **列固定配置**：动态配置列固定（左/右/不固定）⭐
- 列设置弹窗（可拖拽移动）

**🔍 数据操作**
- 12 种过滤操作符，支持多条件筛选
- 客户端/服务端分页
- 导出到 Excel（保留样式）

**🎨 视觉效果**
- 斑马纹、交叉高亮
- 多选单元格
- 自定义工具栏按钮

### 2. PrintDesigner - 打印设计器

基于 fabric.js 的可视化打印模板设计器：

**🖼️ 元素支持**
- 文本、图片、条形码、二维码
- 线条、矩形、循环表格

**📐 设计辅助**
- 拖拽式设计界面
- 标尺、网格、对齐辅助线
- 缩放控制和精确定位

**📄 页面管理**
- 多种纸张尺寸（A4/A5/B5/Letter）+ 自定义
- 页眉页脚独立控制
- 数据绑定：`{{fieldName}}`，支持表达式

---

## 📦 安装使用

### 前置条件

- React 18+ | TypeScript | Tailwind CSS | shadcn/ui

### 安装组件

**直接安装（推荐）：**
```bash
npx shadcn@latest add https://gitee.com/qianwensoft/qws-ui/raw/prd/r/advanced-table
```

**配置 Registry：**
```json
// components.json
{
  "registries": {
    "qws-ui": "https://gitee.com/qianwensoft/qws-ui/raw/prd/r"
  }
}
```
```bash
npx shadcn@latest add qws-ui/advanced-table
```

### 基础示例

```tsx
import { AdvancedTable } from '@/components/advanced-table';

const columns = [
  { id: 'name', accessorKey: 'name', header: '姓名' },
  { id: 'age', accessorKey: 'age', header: '年龄' },
];

<AdvancedTable
  data={data}
  columns={columns}
  enableEditing={true}
  enablePaste={true}
/>
```

> 💡 详细文档: [在线文档](http://qws-ui.rs.ink) | [PUBLISHING.md](./PUBLISHING.md)

---

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
# 方式 1: Vite 开发服务器
npm run dev

# 方式 2: Storybook（推荐，可查看所有组件示例）
npm run storybook
# 访问 http://localhost:6006
```

### 构建

```bash
# 生产构建
npm run build

# 构建 Storybook
npm run build-storybook
```

### 测试

```bash
# 运行测试
npm test

# 测试 UI 模式
npm test:ui

# 测试覆盖率
npm test:coverage
```

---

## 🌿 分支策略

| 分支 | 用途 | 访问地址 |
|------|------|---------|
| **main** | 主开发分支 | 完整源代码 |
| **prd** | 组件注册表 | [Gitee](https://gitee.com/qianwensoft/qws-ui/raw/prd/r) \| [GitHub](https://raw.githubusercontent.com/qianwensoft/qws-ui/prd/r) |
| **storybook-pages** | 在线文档 | [Gitee Pages](https://qianwensoft.gitee.io/qws-ui) \| [GitHub Pages](https://qianwensoft.github.io/qws-ui) |

**发布命令：**
```bash
npm run deploy:registry    # 发布组件到 prd 分支
npm run deploy:storybook   # 发布文档到 storybook-pages 分支
```

---

## 技术栈

- React 18 + TypeScript + Vite 5
- shadcn/ui + Tailwind CSS 4
- @tanstack/react-table + @dnd-kit
- fabric.js + ExcelJS
- Storybook 10 + Vitest

---

## 📚 Storybook 示例

### AdvancedTable (13 个示例)
- Basic, EditMode, DoubleClickEdit
- ExcelPaste, Filtering, Pagination
- ColumnManagement（含列固定配置 ⭐）
- FixedColumns ⭐, CustomStyling
- FullFeatured, LargeDataset
- ToolbarButtons, RowLevelEditControl

### PrintDesigner (3 个示例)
- Basic, ProductLabel, Invoice

运行 `npm run storybook` 查看完整演示

---

## 项目结构

```
qws-ui/
├── src/
│   ├── components/
│   │   ├── AdvancedTable.tsx      # 高级表格（~2300行）
│   │   ├── PrintDesigner.tsx      # 打印设计器（~4200行）
│   │   ├── AdvancedForm.tsx
│   │   └── ui/                    # shadcn/ui 组件
│   ├── stories/                   # Storybook 示例
│   └── lib/utils.ts
├── registry/                      # shadcn Registry
│   ├── default/                   # 组件源文件
│   └── registry.json
├── scripts/build-registry.mjs
└── public/r/                      # Registry JSON 输出
```

---

## 开发指南

```bash
# 添加 shadcn/ui 组件
npx shadcn@latest add <component-name>

# 构建 Registry
npm run build:registry

# 路径别名
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

---

## 相关文档

- [在线文档](http://qws-ui.rs.ink) - Storybook 组件示例
- [历史 README](./README_HISTORY.md) - 详细 API 文档
- [PUBLISHING.md](./PUBLISHING.md) - 安装使用指南
- [TESTING.md](./TESTING.md) - 测试配置指南

---

## 🤖 AI 开发说明

本项目 95%+ 代码由 [Claude Code](https://claude.ai/code) 生成，包括所有组件（~6500 行）、84 个测试用例、完整工程化配置和文档。

**开发方式：** 自然语言驱动开发 - 用中文描述需求，AI 自动生成代码、测试和文档

**开发效率：** 5 天完成完整项目，Token 成本约 50 USD

---

## 致谢

- [Claude Code](https://claude.ai/code) - AI 编程助手
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [React](https://react.dev/) / [TypeScript](https://www.typescriptlang.org/) / [Vite](https://vitejs.dev/)

---

<div align="center">

**🤖 Built with AI • ❤️ Made with Claude Code • 🚀 Powered by React**

[![Gitee](https://img.shields.io/badge/Gitee-qws--ui-red?style=flat-square&logo=gitee)](https://gitee.com/qianwensoft/qws-ui)
[![Claude Code](https://img.shields.io/badge/Generated_by-Claude_Code-5865F2?style=flat-square)](https://claude.ai/code)

**如果觉得这个项目有趣，欢迎 Star ⭐️**

_让 AI 改变软件开发的方式_

</div>

