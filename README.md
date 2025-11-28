# QWS-UI

> 基于 React + TypeScript 的企业级数据管理平台

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
├── .storybook/                    # Storybook 配置
├── public/                        # 静态资源
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

