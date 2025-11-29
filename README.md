# QWS-UI

> 基于 React + TypeScript 的企业级数据管理平台

<div align="center">

[![AI Powered](https://img.shields.io/badge/🤖_AI_Powered-Claude_Code-blue?style=for-the-badge)](https://claude.ai/code)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**[📖 在线文档](https://qianwensoft.gitee.io/qws-ui)** | **[🚀 快速开始](#-快速开始)** | **[📦 安装组件](#-安装组件)**

### 🌍 仓库镜像

[![Gitee](https://img.shields.io/badge/Gitee-qws--ui-C71D23?style=flat-square&logo=gitee)](https://gitee.com/qianwensoft/qws-ui)
[![GitHub](https://img.shields.io/badge/GitHub-qws--ui-181717?style=flat-square&logo=github)](https://github.com/qianwensoft/qws-ui)

</div>

---

## 🤖 关于本项目

### AI 编程实践

**本项目是 AI 辅助编程的完整实践案例**，由 **[Claude Code](https://claude.ai/code)** (Anthropic 的 AI 编程助手) 全程参与开发。

这不仅仅是一个组件库，更是一次探索 **AI 如何改变软件开发方式** 的实验：

- 🎯 **需求到代码**：从业务需求直接转化为可运行的代码
- 🏗️ **架构设计**：AI 协助完成整体架构设计和技术选型
- ✍️ **代码实现**：核心组件、测试用例、文档全部由 AI 生成
- 🔄 **迭代优化**：通过对话不断优化代码质量和功能
- 📚 **文档完善**：自动生成详细的技术文档和使用指南

### 项目目的

本项目致力于展示和验证以下理念：

**1. AI 编程的可行性**
- ✅ 证明 AI 可以独立完成复杂的前端项目
- ✅ 展示 AI 在组件设计、测试、文档等全流程的能力
- ✅ 验证 AI 生成代码的质量和可维护性

**2. 企业级组件的标准实践**
- ✅ 提供高质量、可复用的 React 组件
- ✅ 遵循现代前端工程化最佳实践
- ✅ 完整的测试覆盖和文档体系

**3. shadcn/ui 生态扩展**
- ✅ 采用 shadcn-style 组件注册表
- ✅ 支持通过 CLI 一键安装组件
- ✅ 无缝集成到任何 React 项目

**4. 开发流程创新**
- ✅ 自然语言驱动开发
- ✅ 快速原型到生产代码
- ✅ AI 辅助的代码审查和优化

### 技术亮点

- 🎨 **shadcn/ui** - 美观现代的 UI 组件基础
- 🧪 **完整测试** - 84+ 单元测试，覆盖核心功能
- 📖 **Storybook** - 10+ 交互式组件示例
- 🔧 **类型安全** - 严格的 TypeScript 类型检查
- 📦 **组件注册表** - 支持 CLI 一键安装
- 🤖 **AI 生成** - 90%+ 代码由 Claude Code 生成

### 成果展示

**代码量统计**:
- AdvancedTable: ~2,300 行 TypeScript
- PrintDesigner: ~4,200 行 TypeScript
- 测试用例: 84 个测试，全部通过
- 文档: 6 个完整的 Markdown 文档

**开发时间**: 约 5 天（从零到完整项目）
**AI 参与度**: 约 95%（包括代码、测试、文档）
**代码质量**: 通过所有测试，零运行时错误
**Token 成本**: ~50 USD（约 350 元人民币）

---

## 项目简介

QWS-UI 是一个功能强大的企业级组件库，专注于数据展示和打印场景。项目包含两个核心组件：

### 🔷 核心组件

#### 1. **AdvancedTable - 高级表格组件**
功能丰富的表格组件，提供类似 Excel 的交互体验：
- 📝 单击/双击编辑模式，支持自动保存
- 📋 Excel 数据粘贴，自动创建新行
- 🔍 12种过滤操作符，支持多条件筛选
- 📊 导出到 Excel（支持样式）
- 🎯 列拖拽排序、调整宽度、显示/隐藏
- 📄 分页导航与自定义页码
- 🎨 斑马纹、交叉高亮、多选单元格
- 🛠️ 自定义工具栏按钮

#### 2. **PrintDesigner - 打印设计器**
可视化打印模板设计器，基于 fabric.js 实现：
- 🖼️ 拖拽式设计界面
- 📐 标尺、网格、对齐辅助线
- 🔤 文本、图片、条形码、二维码、线条、矩形、表格
- 📊 循环表格支持（动态数据打印）
- 📄 页眉页脚独立控制
- 📏 多种纸张尺寸（A4、A5、B5、Letter）+ 自定义尺寸
- 🔄 数据绑定：`{{fieldName}}`，支持计算表达式
- 🔍 缩放控制和精确定位

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

项目采用三分支策略管理代码和部署，**同时支持 Gitee 和 GitHub 双平台**：

### 分支说明

| 分支 | 用途 | 内容 | Gitee | GitHub |
|------|------|------|-------|--------|
| **main** | 主开发分支 | 完整源代码、配置、文档 | ✅ | ✅ |
| **prd** | 生产发布分支 | 仅包含组件注册表文件 | [Raw URL](https://gitee.com/qianwensoft/qws-ui/raw/prd/r) | [Raw URL](https://raw.githubusercontent.com/qianwensoft/qws-ui/prd/r) |
| **storybook-pages** | 文档分支 | Storybook 静态站点 | [Gitee Pages](https://qianwensoft.gitee.io/qws-ui) | [GitHub Pages](https://qianwensoft.github.io/qws-ui) |

### 工作流程

**日常开发**：
```bash
# 在 main 分支开发
git checkout main
# 开发、测试、提交
git add .
git commit -m "feat: 新功能"
# 一次推送，同时更新 Gitee 和 GitHub
git push origin main
```

**发布组件注册表**：
```bash
# 部署到 prd 分支（自动推送到双平台）
npm run deploy:registry
```

**发布 Storybook 文档**：
```bash
# 部署到 storybook-pages 分支（自动推送到双平台）
npm run deploy:storybook
```

### 双平台配置

项目已配置自动推送到 Gitee 和 GitHub：

**远程仓库配置**：
- 🔹 Gitee: `git@gitee.com:qianwensoft/qws-ui.git`
- 🔹 GitHub: `git@github.com:qianwensoft/qws-ui.git`

**一键双推**：执行 `git push origin <branch>` 会同时推送到两个平台

### 服务部署

#### Gitee Pages
1. **组件注册表**（prd 分支）
   - URL: `https://gitee.com/qianwensoft/qws-ui/raw/prd/r`
   - 用途: shadcn CLI 安装组件

2. **在线文档**（storybook-pages 分支）
   - URL: `https://qianwensoft.gitee.io/qws-ui`
   - 用途: 查看组件演示和使用文档

#### GitHub Pages（可选配置）
1. **组件注册表**（prd 分支）
   - URL: `https://raw.githubusercontent.com/qianwensoft/qws-ui/prd/r`
   - 用途: 国际用户访问

2. **在线文档**（storybook-pages 分支）
   - URL: `https://qianwensoft.github.io/qws-ui`（需在 GitHub 设置中启用）
   - 用途: 国际用户访问

---

## 📦 作为 shadcn Registry 使用

QWS-UI 现在支持作为 shadcn-style 组件注册表使用，您可以在任何项目中通过 shadcn CLI 安装组件！

### 配置 Registry

在您的项目中的 `components.json` 文件中添加 QWS-UI registry：

```json
{
  "registries": {
    "qws": "https://gitee.com/qianwensoft/qws-ui/raw/prd/r"
  }
}
```

### 安装组件

使用 shadcn CLI 安装 QWS-UI 组件：

```bash
# 安装高级表格组件
npx shadcn@latest add @qws/advanced-table

# 安装打印设计器组件
npx shadcn@latest add @qws/print-designer

# 安装高级表单组件
npx shadcn@latest add @qws/advanced-form
```

CLI 会自动：
- ✅ 下载组件文件到您的项目
- ✅ 安装所有必需的依赖
- ✅ 安装 registry 依赖（shadcn/ui 基础组件）

### 可用组件

| 组件 | 名称 | 描述 |
|------|------|------|
| 📊 | `advanced-table` | 功能丰富的表格组件，支持编辑、过滤、导出 |
| 🖨️ | `print-designer` | 可视化打印模板设计器 |
| 📝 | `advanced-form` | 高级表单组件 |

详细文档请查看 [registry/README.md](./registry/README.md)

---

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **UI 框架**: shadcn/ui + Tailwind CSS 4
- **表格引擎**: @tanstack/react-table v8
- **拖拽**: @dnd-kit
- **Canvas**: fabric.js v6
- **Excel 导出**: ExcelJS
- **图标**: lucide-react
- **组件文档**: Storybook 10
- **测试**: Vitest + @testing-library/react

---

## 使用示例

### AdvancedTable 基础用法

```tsx
import { AdvancedTable } from './components/AdvancedTable';
import type { ColumnDef } from '@tanstack/react-table';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const columns: ColumnDef<Product>[] = [
  { id: 'name', accessorKey: 'name', header: '产品名称' },
  { id: 'price', accessorKey: 'price', header: '价格' },
  { id: 'stock', accessorKey: 'stock', header: '库存' },
];

function App() {
  const [data, setData] = useState<Product[]>([]);

  return (
    <AdvancedTable
      data={data}
      columns={columns}
      onDataChange={setData}
      enableEditing={true}
      enablePaste={true}
      enableFiltering={true}
      enableExport={true}
      enableColumnReorder={true}
      enablePagination={true}
    />
  );
}
```

### PrintDesigner 基础用法

```tsx
import { PrintDesigner } from './components/PrintDesigner';

const template = {
  name: '产品标签',
  paper: { size: 'A4', orientation: 'portrait' },
  elements: [
    {
      id: 'title',
      type: 'text',
      left: 20,
      top: 20,
      binding: '{{productName}}',
      fontSize: 20,
      fontWeight: 'bold',
    },
    {
      id: 'price',
      type: 'text',
      left: 20,
      top: 50,
      binding: '{{price}}+"元"',
      fontSize: 16,
    },
  ],
};

const data = {
  productName: '苹果手机',
  price: 5999,
};

function App() {
  return (
    <PrintDesigner
      template={template}
      data={data}
      onTemplateChange={(newTemplate) => {
        console.log('模板已更新:', newTemplate);
      }}
    />
  );
}
```

---

## 版本更新记录

### PrintDesigner 主要更新

**v10 (2025-11-27)** - 自定义纸张尺寸与 UI 组件升级
- ✨ 支持自定义纸张尺寸（宽度、高度）
- 🎨 升级为 shadcn/ui 组件库
- 🔧 优化 UI 交互体验

**v9 (2025-11-27)** - 页眉页脚打印控制与虚线支持
- ✨ 页眉页脚打印独立开关
- ✨ 线条支持虚线样式
- 🐛 修复打印预览问题

**v8 (2025-11-26)** - 完全恢复循环表格功能
- ✨ 恢复循环表格完整功能
- ✨ 支持 LoopTable 示例
- 🔧 代码结构优化

**v6-v7 (2025-11-26)** - 循环表格增强与优化
- ✨ 循环表格分页计算与渲染
- ✨ 多页打印支持
- ✨ 标尺、缩放、对齐辅助线
- ✨ 左侧组件工具栏
- 🐛 修复 fabric.js 加载问题

**初始版本 (2025-11-26)**
- 🎉 打印设计器组件上线
- ✨ 基于 fabric.js 的可视化设计
- ✨ 数据绑定与动态渲染

### AdvancedTable 主要更新

**v6 (2025-11-26)** - 编辑模式优化
- 🐛 修复编辑模式下 input 边框超出单元格宽度
- 🐛 修复单元格多选功能失效问题
- 🎨 改进单元格编辑体验

**v5 (2025-11-26)** - 性能优化与分页
- ⚡ 性能优化，支持大数据集
- ✨ 完善分页功能示例
- 🧪 添加完整测试用例

**v4 (2025-11-26)** - 单元格选择增强
- ✨ 多单元格拖拽选择
- ✨ 选中区域高亮显示
- 🎨 自定义选中边框颜色

**v3 (2025-11-26)** - 功能增强
- ✨ 工具栏自定义按钮
- ✨ 列级别编辑控制
- ✨ 数据变更追踪优化

**v2 (2025-11-26)** - Excel 粘贴优化
- ✨ 支持所见即所得的行列填充
- ✨ 自动创建新行
- 🐛 修复粘贴数据顺序问题

**初始版本 (2025-11-25)**
- 🎉 高级表格组件上线
- ✨ 基础编辑、过滤、导出功能
- ✨ 列管理与拖拽排序

### 项目级更新

**2025-11-28** - shadcn Registry 支持
- 🎉 改造为 shadcn-style 组件注册表
- 📦 支持通过 shadcn CLI 安装组件
- 🔧 添加 `build:registry` 构建脚本
- 📚 完善 registry 文档和使用指南

**2025-11-26** - UI 框架升级
- 🎨 集成 shadcn/ui 作为统一 UI 框架
- ✨ 新增 AdvancedForm 组件
- 📚 Storybook 项目结构改造（10+ 示例）

---

## Storybook 示例

项目包含丰富的 Storybook 示例，展示各组件的功能：

### AdvancedTable 示例
1. **Basic** - 基础表格
2. **Edit Mode** - 单击编辑模式
3. **Double Click Edit** - 双击编辑模式
4. **Excel Paste** - Excel 粘贴功能
5. **Filtering** - 列过滤功能
6. **Pagination** - 分页功能
7. **Column Management** - 列管理功能
8. **Custom Styling** - 自定义样式
9. **Full Featured** - 完整功能示例
10. **Large Dataset** - 大数据集示例
11. **Toolbar Buttons** - 工具栏自定义按钮

### PrintDesigner 示例
1. **Basic** - 基础打印设计器
2. **Product Label** - 产品标签模板
3. **Invoice** - 发票模板

运行 `npm run storybook` 查看所有示例。

---

## 项目结构

```
qws-ui/
├── src/
│   ├── components/
│   │   ├── AdvancedTable.tsx      # 高级表格组件（~2300行）
│   │   ├── AdvancedTable.css      # 表格样式
│   │   ├── PrintDesigner.tsx      # 打印设计器（~4200行）
│   │   ├── PrintDesigner.css      # 设计器样式
│   │   ├── AdvancedForm.tsx       # 高级表单组件
│   │   └── ui/                    # shadcn/ui 组件
│   ├── stories/                   # Storybook 示例
│   ├── lib/
│   │   └── utils.ts               # 工具函数
│   └── test/                      # 测试配置
├── registry/                      # shadcn Registry
│   ├── default/                   # 组件源文件
│   │   ├── advanced-table/
│   │   ├── print-designer/
│   │   └── advanced-form/
│   ├── registry.json              # Registry 配置
│   └── README.md                  # Registry 文档
├── scripts/
│   └── build-registry.mjs         # Registry 构建脚本
├── .storybook/                    # Storybook 配置
├── public/
│   └── r/                         # Registry JSON 输出
└── package.json
```

---

## API 文档

详细的 API 文档请参考 Storybook 或查看 [历史文档](./README_HISTORY.md)。

---

## 开发指南

### 添加 shadcn/ui 组件

```bash
npx shadcn@latest add <component-name>
# 示例: npx shadcn@latest add dropdown-menu
```

### 构建 Registry

更新组件后重新构建 registry：

```bash
npm run build:registry
```

这会：
- 📦 复制组件从 `src/components` 到 `registry/default`
- 📝 生成 JSON 配置到 `public/r/`
- ✨ 更新 registry 索引文件

### 路径别名

项目配置了路径别名 `@/*` 指向 `./src/*`：

```tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

### 代码风格

- TypeScript 严格模式
- 使用函数式组件 + Hooks
- 优先使用 `useMemo` 和 `useCallback` 优化性能
- CSS Modules 或 Tailwind CSS

---

## 许可证

MIT License

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## 相关文档

- [历史 README](./README_HISTORY.md) - 详细的功能说明和 API 文档
- [Storybook](http://localhost:6006) - 组件示例和文档
- [测试配置文档](./TESTING.md) - 完整的测试配置指南
- [Registry 测试报告](./REGISTRY_TEST_REPORT.md) - Registry 功能测试报告

---

## 🤖 AI 编程声明

### 关于代码生成

本项目的绝大部分代码（约 95%）由 **[Claude Code](https://claude.ai/code)** 生成，包括但不限于：

**组件开发**
- ✨ AdvancedTable 组件（~2,300 行）
- ✨ PrintDesigner 组件（~4,200 行）
- ✨ AdvancedForm 组件
- ✨ 所有 shadcn/ui 基础组件集成

**测试体系**
- 🧪 84 个单元测试用例
- 🧪 测试配置和设置文件
- 🧪 Storybook 集成测试

**工程化配置**
- ⚙️ TypeScript 配置
- ⚙️ Vite 和 Vitest 配置
- ⚙️ Storybook 配置
- ⚙️ ESLint 和代码规范

**文档编写**
- 📚 README.md 和所有技术文档
- 📚 组件 API 文档
- 📚 测试文档和使用指南
- 📚 Storybook 故事和示例

**架构设计**
- 🏗️ shadcn-style Registry 架构
- 🏗️ 组件库整体设计
- 🏗️ 测试策略和覆盖率规划

### 开发流程

本项目采用 **自然语言驱动开发（Natural Language Driven Development）** 方式：

1. **需求描述** → 用自然语言描述功能需求
2. **AI 理解** → Claude Code 理解需求并设计方案
3. **代码生成** → 自动生成高质量的 TypeScript/React 代码
4. **测试编写** → 同步生成完整的测试用例
5. **文档生成** → 自动生成详细的技术文档
6. **迭代优化** → 通过对话持续改进代码质量

### AI 编程的优势

通过本项目的实践，我们验证了 AI 编程在以下方面的显著优势：

**开发效率** 🚀
- 从零到完整项目仅需 5 天
- 无需手写样板代码和配置
- 自动生成测试和文档
- Token 成本约 50 USD，远低于人工开发成本

**代码质量** ✨
- 严格的 TypeScript 类型检查
- 完整的测试覆盖（84 个测试）
- 遵循最佳实践和设计模式

**学习成本** 📖
- 降低技术栈学习门槛
- 自动适配最新技术标准
- 内置最佳实践指导

**可维护性** 🔧
- 清晰的代码结构
- 完善的注释和文档
- 易于理解和扩展

### 未来展望

本项目将继续作为 AI 编程实践的实验场：

- 🔮 探索更复杂的组件开发
- 🔮 验证 AI 在代码重构中的能力
- 🔮 研究 AI 辅助的性能优化
- 🔮 实践 AI 驱动的技术演进

---

## 致谢

**技术支持**
- [Claude Code](https://claude.ai/code) - AI 编程助手
- [Anthropic](https://www.anthropic.com/) - Claude 的创造者
- [shadcn/ui](https://ui.shadcn.com/) - 优秀的 UI 组件库
- [React](https://react.dev/) - 强大的前端框架

**开源社区**
- 感谢所有开源项目的贡献者
- 感谢 React、TypeScript、Vite 等工具的开发团队
- 感谢 shadcn/ui 生态的所有参与者

**特别鸣谢**
- 🤖 **Claude Code** - 本项目的主要开发者
- 👨‍💻 **人类开发者** - 提供需求、反馈和指导
- 🌟 **开源精神** - 让技术进步惠及所有人

---

<div align="center">

**🤖 Built with AI • ❤️ Made with Claude Code • 🚀 Powered by React**

[![Gitee](https://img.shields.io/badge/Gitee-qws--ui-red?style=flat-square&logo=gitee)](https://gitee.com/qianwensoft/qws-ui)
[![Claude Code](https://img.shields.io/badge/Generated_by-Claude_Code-5865F2?style=flat-square)](https://claude.ai/code)

**如果觉得这个项目有趣，欢迎 Star ⭐️**

_让 AI 改变软件开发的方式_

</div>

