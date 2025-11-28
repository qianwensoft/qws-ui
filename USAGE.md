# QWS-UI 组件使用指南

QWS-UI 是一个企业级 React 组件库，提供高质量的表格、打印设计器等组件。所有组件都可以通过 shadcn CLI 快速安装到您的项目中。

## 🚀 快速开始

### 前置要求

确保您的项目已初始化 shadcn/ui：

```bash
npx shadcn@latest init
```

### 安装组件

#### Advanced Table - 功能丰富的表格组件

```bash
# 1. 先安装依赖的基础组件
npx shadcn@latest add button input select dialog dropdown-menu

# 2. 安装 Advanced Table
npx shadcn@latest add https://gitee.com/qianwensoft/qws-ui/raw/main/public/r/advanced-table
```

**功能特性：**
- ✅ Excel 风格的单元格编辑（单击/双击模式）
- ✅ 拖拽列排序
- ✅ 强大的过滤系统（12 种操作符）
- ✅ Excel 数据粘贴（自动创建行）
- ✅ 导出到 Excel
- ✅ 多单元格选择
- ✅ 分页和页面大小控制
- ✅ 列可见性控制

#### Print Designer - 可视化打印模板设计器

```bash
# 1. 先安装依赖的基础组件
npx shadcn@latest add button input select card

# 2. 安装 Print Designer
npx shadcn@latest add https://gitee.com/qianwensoft/qws-ui/raw/main/public/r/print-designer
```

**功能特性：**
- ✅ 基于 fabric.js 的画布渲染
- ✅ 支持文本、图片、条形码、二维码
- ✅ 数据绑定语法 `{{fieldName}}`
- ✅ 表达式支持（如 `{{qty}}*100+"元"`）
- ✅ 多种纸张尺寸（A4、A5、B5、Letter、自定义）
- ✅ 横向/纵向布局
- ✅ 页眉页脚支持
- ✅ 标尺和辅助线
- ✅ 缩放控制

#### Advanced Form - 高级表单组件

```bash
# 1. 先安装依赖的基础组件
npx shadcn@latest add button input card

# 2. 安装 Advanced Form
npx shadcn@latest add https://gitee.com/qianwensoft/qws-ui/raw/main/public/r/advanced-form
```

**功能特性：**
- ✅ 基于 TanStack Form 构建
- ✅ 类型安全的表单验证
- ✅ 灵活的字段配置

## 📖 使用示例

### Advanced Table 基础用法

```tsx
import { AdvancedTable } from '@/components/advanced-table';
import type { ColumnDef } from '@tanstack/react-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: '姓名',
    meta: { editable: true }
  },
  {
    accessorKey: 'email',
    header: '邮箱',
    meta: { editable: true }
  },
  {
    accessorKey: 'role',
    header: '角色',
    meta: { editable: false }
  }
];

const data: User[] = [
  { id: 1, name: '张三', email: 'zhang@example.com', role: 'admin' },
  { id: 2, name: '李四', email: 'li@example.com', role: 'user' }
];

function MyTable() {
  return (
    <AdvancedTable
      columns={columns}
      data={data}
      enableFiltering
      enablePagination
      enableExport
      onDataChange={(newData, changeInfo) => {
        console.log('数据变更:', changeInfo);
        // 保存数据到后端
      }}
    />
  );
}
```

### Print Designer 基础用法

```tsx
import { PrintDesigner } from '@/components/print-designer';
import type { PrintTemplate } from '@/components/print-designer';

function MyDesigner() {
  const [template, setTemplate] = useState<PrintTemplate>({
    name: '发货单',
    paperSize: 'A4',
    orientation: 'portrait',
    elements: []
  });

  const sampleData = {
    orderNo: 'ORD-2025-001',
    customer: '客户名称',
    items: [
      { name: '商品A', qty: 10, price: 100 },
      { name: '商品B', qty: 5, price: 200 }
    ]
  };

  return (
    <PrintDesigner
      template={template}
      data={sampleData}
      onChange={setTemplate}
      onPrint={(svgContent) => {
        // 处理打印逻辑
        console.log('打印内容:', svgContent);
      }}
    />
  );
}
```

## 🔧 配置要求

### package.json 依赖

安装组件后，以下依赖会自动添加到您的项目：

#### Advanced Table 依赖
```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.10.7",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^7.0.2",
    "@dnd-kit/utilities": "^3.2.1",
    "exceljs": "^4.4.0",
    "file-saver": "^2.0.5",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@types/file-saver": "^2.0.7"
  }
}
```

#### Print Designer 依赖
```json
{
  "dependencies": {
    "fabric": "^6.9.0",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@types/fabric": "^5.3.10"
  }
}
```

#### Advanced Form 依赖
```json
{
  "dependencies": {
    "@tanstack/react-form": "^1.26.0",
    "lucide-react": "latest"
  }
}
```

### Tailwind CSS 配置

确保您的 `tailwind.config.js` 包含组件路径：

```js
module.exports = {
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  // ... 其他配置
}
```

## 📚 完整文档

- **Storybook 演示**: 运行 `npm run storybook` 查看所有组件的交互式示例
- **源码仓库**: https://gitee.com/qianwensoft/qws-ui
- **问题反馈**: https://gitee.com/qianwensoft/qws-ui/issues

## 🛠️ 开发者信息

### 注册表地址

```
https://gitee.com/qianwensoft/qws-ui/raw/main/public/r
```

### 手动下载组件

如果您不使用 shadcn CLI，也可以直接下载组件文件：

```bash
# Advanced Table
curl -O https://gitee.com/qianwensoft/qws-ui/raw/main/registry/default/advanced-table/advanced-table.tsx
curl -O https://gitee.com/qianwensoft/qws-ui/raw/main/registry/default/advanced-table/advanced-table.css

# Print Designer
curl -O https://gitee.com/qianwensoft/qws-ui/raw/main/registry/default/print-designer/print-designer.tsx
curl -O https://gitee.com/qianwensoft/qws-ui/raw/main/registry/default/print-designer/print-designer.css
```

### 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui
- @tanstack/react-table
- fabric.js
- TanStack Form

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
