# 高级表格组件

基于 `@tanstack/react-table` 和 `@dnd-kit` 实现的高级表格组件，具备以下功能：

## 功能特性

### 🎯 功能 1：Excel 粘贴自动填充
- 从 Excel/Google Sheets 复制多行多列数据
- 点击任意单元格并粘贴（Ctrl+V 或 Cmd+V）
- 自动解析制表符分隔的数据并填充到表格中

### 📏 功能 2：列拖拽排序
- 拖动列头左侧的 ⋮⋮ 图标
- 使用 `@dnd-kit` 实现流畅的拖拽体验

### 🔧 功能 3：调整列宽
- 拖动列头右侧的边界线调整宽度
- 实时预览列宽变化

### 👁️ 功能 4：显示/隐藏列
- 点击右上角"列设置"按钮
- 通过复选框控制列的显示/隐藏

## 安装依赖

```bash
npm install
```

## 运行项目

```bash
npm run dev
```

## 使用示例

```tsx
import { AdvancedTable } from './components/AdvancedTable';
import type { ColumnDef } from '@tanstack/react-table';

interface Person {
  id: string;
  name: string;
  age: number;
}

const columns: ColumnDef<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: '姓名',
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: '年龄',
  },
];

const data: Person[] = [
  { id: '1', name: '张三', age: 28 },
  { id: '2', name: '李四', age: 32 },
];

function App() {
  return (
    <AdvancedTable
      data={data}
      columns={columns}
      onDataChange={(newData) => console.log('数据更新:', newData)}
    />
  );
}
```

## 技术栈

- React 18
- TypeScript
- Vite
- @tanstack/react-table
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities

