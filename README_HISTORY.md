# QWS-UI

基于 React + TypeScript 的企业级数据管理平台，包含高级表格组件和打印设计器。

## 📦 组件列表

### 1. 高级表格组件 (AdvancedTable)
基于 `@tanstack/react-table` 和 `@dnd-kit` 实现的功能丰富的表格组件。

### 2. 打印设计器 (PrintDesigner)
基于 `fabric.js` 实现的可视化打印模板设计器。

---

## ✨ 高级表格 - 主要特性

### 📝 数据编辑
- **单击编辑模式**：单击单元格直接进入编辑
- **双击编辑模式**：双击进入编辑，显示确认/取消按钮
- **自动保存**：失焦自动保存（可选）
- **列级编辑控制**：可单独禁用某些列的编辑功能

### 📋 Excel 粘贴
- 支持从 Excel、Google Sheets 等复制多行多列数据
- 按所见即所得的顺序填充（先横向后纵向）
- 自动创建新行（当粘贴数据超出现有行数时）
- 实时变更追踪和回调

### 🔍 列过滤
- 12 种过滤操作符（等于、大于、小于、包含等）
- 支持多条件过滤（AND 逻辑）
- 客户端过滤或服务端过滤（通过回调实现）

### 📊 导出功能
- 导出到 Excel（.xlsx 格式）
- 三种导出范围：当前页、过滤后数据、全部数据
- 保留表格样式（表头、斑马纹、边框等）

### 🎯 列管理
- **拖拽排序**：拖动列头左侧图标调整列顺序
- **调整宽度**：拖动列头右侧边界线
- **显示/隐藏**：通过列设置弹窗控制

### 📄 分页功能
- 页码导航（首页、上一页、下一页、末页）
- 每页条数选择
- 快速跳转到指定页

### 🎨 视觉效果
- 斑马纹行（可自定义颜色）
- 交叉高亮（行列交叉点突出显示）
- 多选单元格（拖拽选择）
- 可自定义选中边框颜色

### 🛠️ 工具栏
- **自定义按钮**：在工具栏左侧添加业务相关的操作按钮
- **系统按钮**：导出和列设置固定在工具栏右侧
- **灵活配置**：支持图标、文本、禁用状态、点击事件等

## 🚀 快速开始

### 安装依赖

```bash
yarn install
# 或
npm install
```

### 运行 Storybook（推荐）

#### 方式 1：开发模式（推荐）

```bash
yarn storybook
# 或
npm run storybook
```

然后在浏览器中打开 http://localhost:6006

> **注意**：如果遇到网络接口错误，请使用方式 2。

#### 方式 2：构建静态版本

```bash
# 构建静态文件
yarn build-storybook
# 或
npm run build-storybook

# 使用任意静态服务器查看，例如：
npx serve storybook-static
```

### 运行开发环境

```bash
yarn dev
# 或
npm run dev
```

## 📚 Storybook 示例

项目已配置完整的 Storybook，包含 10 个示例：

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
11. **Toolbar Buttons** ⭐ - 工具栏自定义按钮（新增）

每个示例都有详细的说明和交互演示。

## 💻 使用示例

### 基础用法

```tsx
import { AdvancedTable } from './components/AdvancedTable';
import type { ColumnDef } from '@tanstack/react-table';

interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
}

const columns: ColumnDef<Person>[] = [
  { id: 'name', accessorKey: 'name', header: '姓名' },
  { id: 'age', accessorKey: 'age', header: '年龄' },
  { id: 'email', accessorKey: 'email', header: '邮箱' },
];

const data: Person[] = [
  { id: '1', name: '张三', age: 28, email: 'zhangsan@example.com' },
  { id: '2', name: '李四', age: 32, email: 'lisi@example.com' },
];

function App() {
  const [tableData, setTableData] = useState(data);

  return (
    <AdvancedTable
      data={tableData}
      columns={columns}
      onDataChange={setTableData}
      enableEditing={true}
      enablePaste={true}
      enableFiltering={true}
      enableExport={true}
    />
  );
}
```

### 完整功能配置

```tsx
// 工具栏自定义按钮
const toolbarButtons = [
  {
    key: 'add',
    label: '新增',
    icon: <PlusIcon />,
    onClick: () => {
      // 添加新记录
      const newRecord = { /* ... */ };
      setData([...data, newRecord]);
    },
  },
  {
    key: 'delete',
    label: '删除',
    icon: <TrashIcon />,
    onClick: () => {
      // 删除选中的记录
    },
    disabled: selectedRows.length === 0,
  },
];

<AdvancedTable
  data={data}
  columns={columns}
  // 工具栏按钮
  toolbarButtons={toolbarButtons}
  // 数据变更回调
  onDataChange={(newData, changeInfo) => {
    console.log('变更类型:', changeInfo?.type); // 'edit' 或 'paste'
    console.log('变更的单元格:', changeInfo?.changes);
    setData(newData);
  }}
  // 过滤回调
  onFilterChange={(columnId, filters, allFilters) => {
    console.log('过滤条件:', allFilters);
  }}
  // 选择变化回调
  onSelectionChange={(selection) => {
    console.log('选中的单元格:', selection?.cells);
  }}
  // 编辑功能
  enableEditing={true}
  editTriggerMode="click"  // 'click' 或 'doubleClick'
  autoSave={true}
  // 其他功能
  enablePaste={true}
  enableFiltering={true}
  enableExport={true}
  enableColumnReorder={true}
  // 分页配置
  enablePagination={true}
  pagination={{
    pageIndex: 0,
    pageSize: 10,
    totalCount: data.length,
  }}
  onPageChange={setPageIndex}
  onPageSizeChange={setPageSize}
  // 样式定制
  enableZebraStripes={true}
  enableCrossHighlight={true}
  zebraStripeColor="#fafafa"
  crossHighlightColor="#e6f7ff"
  selectedBorderColor="#1890ff"
/>
```

### 禁用某列的编辑

```tsx
const columns: ColumnDef<Person>[] = [
  { id: 'name', accessorKey: 'name', header: '姓名' },
  {
    id: 'email',
    accessorKey: 'email',
    header: '邮箱',
    meta: {
      editable: false,  // 禁用此列的编辑
    },
  },
];
```

### 工具栏自定义按钮

```tsx
import { Plus, Trash2, RefreshCw } from 'lucide-react';

const toolbarButtons = [
  {
    key: 'add',
    label: '新增',
    icon: <Plus size={16} />,
    onClick: () => {
      // 添加新记录
      const newRecord = { /* ... */ };
      setData([...data, newRecord]);
    },
    title: '添加新记录',
  },
  {
    key: 'delete',
    label: '删除',
    icon: <Trash2 size={16} />,
    onClick: () => {
      // 删除选中的记录
      if (confirm('确定删除？')) {
        // 删除逻辑
      }
    },
    disabled: selectedRows.length === 0,
    title: '删除选中的记录',
  },
  {
    key: 'refresh',
    label: '刷新',
    icon: <RefreshCw size={16} />,
    onClick: () => {
      // 刷新数据
      fetchData();
    },
    title: '刷新数据',
  },
];

<AdvancedTable
  data={data}
  columns={columns}
  toolbarButtons={toolbarButtons}  // 添加工具栏按钮
  enableEditing={true}
  enableExport={true}
  enableColumnReorder={true}
/>
```

**ToolbarButton 接口：**
```typescript
interface ToolbarButton {
  key: string;              // 唯一键
  label: React.ReactNode;   // 按钮文本
  onClick: () => void;      // 点击事件
  icon?: React.ReactNode;   // 图标（可选）
  disabled?: boolean;       // 禁用状态（可选）
  title?: string;           // 悬停提示（可选）
}
```

## 📦 技术栈

- **React 18+**
- **TypeScript**
- **Vite**
- **@tanstack/react-table** - 表格状态管理
- **@dnd-kit** - 拖拽功能
- **ExcelJS** - Excel 导出
- **lucide-react** - 图标库
- **Storybook** - 组件文档和示例

## 📖 API 文档

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | `T[]` | 必填 | 表格数据 |
| `columns` | `ColumnDef<T>[]` | 必填 | 列定义 |
| `onDataChange` | `(data: T[], changeInfo?: DataChangeInfo<T>) => void` | - | 数据变更回调 |
| `onFilterChange` | `OnFilterChange` | - | 过滤变更回调 |
| `onSelectionChange` | `(selection: SelectionRangeInfo \| null) => void` | - | 选择变更回调 |
| `enableEditing` | `boolean` | `true` | 启用编辑功能 |
| `editTriggerMode` | `'click' \| 'doubleClick'` | `'doubleClick'` | 编辑触发模式 |
| `autoSave` | `boolean` | `false` | 自动保存（失焦保存） |
| `enablePaste` | `boolean` | `true` | 启用粘贴功能 |
| `enableFiltering` | `boolean` | `true` | 启用过滤功能 |
| `enableExport` | `boolean` | `true` | 启用导出功能 |
| `enableColumnReorder` | `boolean` | `false` | 启用列排序功能 |
| `toolbarButtons` | `ToolbarButton[]` | `[]` | 工具栏左侧的自定义按钮 |
| `enablePagination` | `boolean` | `false` | 启用分页功能 |
| `enableZebraStripes` | `boolean` | `true` | 启用斑马纹 |
| `enableCrossHighlight` | `boolean` | `true` | 启用交叉高亮 |
| `zebraStripeColor` | `string` | `'#fafafa'` | 斑马纹颜色 |
| `crossHighlightColor` | `string` | `'#e6f7ff'` | 交叉高亮颜色 |
| `selectedBorderColor` | `string` | `'#1890ff'` | 选中边框颜色 |

更多详细的 API 文档请参考 Storybook。

## 🎯 最佳实践

### 性能优化
- 对于大数据集（>1000 行），建议启用分页
- 使用 `React.memo` 包裹表格组件
- 服务端过滤和分页可进一步提升性能

### 数据管理
- 使用 `onDataChange` 回调实时同步数据到后端
- `changeInfo` 参数包含详细的变更信息
- 支持批量更新（粘贴多个单元格）

### 用户体验
- 单击编辑 + 自动保存：适合快速数据录入场景
- 双击编辑 + 确认按钮：适合需要谨慎确认的场景
- 启用斑马纹和交叉高亮可提升可读性

## 🔧 开发

### 构建

```bash
yarn build
# 或
npm run build
```

### 构建 Storybook

```bash
yarn build-storybook
# 或
npm run build-storybook
```

---

## 🖨️ 打印设计器组件

### 功能特性

1. **纸张尺寸支持**
   - 预设尺寸：A4、A5、B5、Letter
   - 自定义尺寸
   - 纵向/横向切换

2. **数据绑定**
   - 支持 `{{fieldName}}` 语法绑定数据
   - 支持计算公式：`{{qty}}*100+"元"`
   - 支持字段拼接：`{{price}}+"/"+"{{unit}}"`

3. **可视化设计**
   - 拖拽调整元素位置
   - 调整元素大小
   - 文本样式设置（字体、大小、颜色等）

### 使用示例

```tsx
import { PrintDesigner, type PrintTemplate } from './components/PrintDesigner';

const template: PrintTemplate = {
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
  qty: 100,
};

function App() {
  return (
    <PrintDesigner
      template={template}
      data={data}
      onTemplateChange={(newTemplate) => {
        console.log('模板已更新:', newTemplate);
      }}
      readOnly={false}
      showToolbar={true}
    />
  );
}
```

### 数据绑定语法

| 语法 | 示例 | 说明 |
|------|------|------|
| 简单绑定 | `{{productName}}` | 直接显示字段值 |
| 计算 | `{{qty}}*100` | 数值计算 |
| 拼接 | `{{price}}+"元"` | 字符串拼接 |
| 组合 | `{{qty}}*100+"元/件"` | 计算后拼接 |

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `template` | `PrintTemplate` | - | 打印模板 |
| `data` | `Record<string, any>` | `{}` | 数据源 |
| `onTemplateChange` | `(template: PrintTemplate) => void` | - | 模板变更回调 |
| `readOnly` | `boolean` | `false` | 只读模式 |
| `showToolbar` | `boolean` | `true` | 显示工具栏 |

---

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系

如有问题或建议，请通过 Issue 联系我们。
