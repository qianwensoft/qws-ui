import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AdvancedTable, type DataChangeInfo, type OnFilterChange } from '../components/AdvancedTable';
import type { ColumnDef } from '@tanstack/react-table';
import '../components/AdvancedTable.css';

// 示例数据类型
interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
  department: string;
  salary: number;
  status: string;
  joinDate: string;
}

// 生成测试数据
const generateData = (count: number): Person[] => {
  const departments = ['技术部', '产品部', '设计部', '运营部', '市场部', '人力资源部', '财务部'];
  const statuses = ['在职', '试用期', '离职'];
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
    age: 22 + (i % 30),
    email: `user${i + 1}@example.com`,
    department: departments[i % departments.length],
    salary: 10000 + (i % 20) * 1000,
    status: statuses[i % statuses.length],
    joinDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  }));
};

// 基础列定义
const baseColumns: ColumnDef<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: '姓名',
    size: 120,
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: '年龄',
    size: 80,
    meta: {
      type: 'number',
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: '邮箱',
    size: 200,
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: '部门',
    size: 120,
  },
  {
    id: 'salary',
    accessorKey: 'salary',
    header: '薪资',
    size: 120,
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return `¥${value.toLocaleString()}`;
    },
    meta: {
      type: 'number',
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '状态',
    size: 100,
  },
  {
    id: 'joinDate',
    accessorKey: 'joinDate',
    header: '入职日期',
    size: 120,
  },
];

const meta: Meta<typeof AdvancedTable> = {
  title: 'Components/AdvancedTable',
  component: AdvancedTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# 高级表格组件 (AdvancedTable)

功能强大的企业级 React 表格组件，基于 \`@tanstack/react-table\` 和 \`@dnd-kit\` 构建。

## ✨ 核心特性

### 📝 数据编辑
- **单击编辑模式**：点击单元格直接进入编辑状态
- **双击编辑模式**：双击进入编辑，显示确认/取消按钮
- **自动保存**：失焦时自动保存编辑内容（可选）
- **列级编辑控制**：通过 \`meta.editable\` 单独禁用某些列的编辑

### 📋 Excel 粘贴
- 支持从 Excel、Google Sheets 等工具复制多行多列数据
- 按所见即所得顺序填充（先横向填充，再纵向填充）
- 超出行数时自动创建新行
- 提供详细的变更信息回调

### 🔍 列过滤
支持 12 种过滤操作符：
- **比较操作**：等于、不等于、大于、小于、大于等于、小于等于
- **文本操作**：包含、不包含、开头是、结尾是
- **空值操作**：为空、非空

### 📊 导出功能
- 导出为 Excel (.xlsx) 格式
- 三种导出范围：当前页、过滤后数据、全部数据
- 自动保留表格样式（表头、斑马纹、边框等）

### 🎯 列管理
- **拖拽排序**：拖动列头左侧的 ⋮⋮ 图标调整列顺序
- **调整宽度**：拖动列头右侧边界线
- **显示/隐藏**：通过列设置弹窗控制列的可见性

### 📄 分页
- 完整的分页导航（首页、上一页、下一页、末页）
- 自定义每页条数选择
- 快速跳转到指定页码

### 🎨 视觉效果
- **斑马纹**：交替行背景色，提升可读性
- **交叉高亮**：鼠标悬停时高亮当前行和列
- **多选单元格**：拖拽选择多个单元格
- **自定义颜色**：支持自定义各种颜色主题

## 🚀 快速开始

\`\`\`tsx
import { AdvancedTable } from './components/AdvancedTable';
import type { ColumnDef } from '@tanstack/react-table';

interface Person {
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
  { name: '张三', age: 28, email: 'zhangsan@example.com' },
  { name: '李四', age: 32, email: 'lisi@example.com' },
];

function App() {
  return (
    <AdvancedTable
      data={data}
      columns={columns}
      enableEditing={true}
      enablePaste={true}
      enableFiltering={true}
      enableExport={true}
    />
  );
}
\`\`\`

## 📚 示例列表

浏览下方的示例了解各种功能的使用方法。每个示例都包含详细的说明和可交互的演示。

## 🎯 最佳实践

- **性能优化**：大数据集（>1000 行）建议启用分页
- **数据管理**：使用 \`onDataChange\` 回调同步数据到后端
- **用户体验**：根据场景选择合适的编辑模式（单击 vs 双击）
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: '表格数据数组',
      control: false,
    },
    columns: {
      description: '列定义数组，遵循 @tanstack/react-table 的 ColumnDef 格式',
      control: false,
    },
    onDataChange: {
      description: '数据变更回调函数，包含详细的变更信息（类型、变更单元格、受影响行等）',
      control: false,
    },
    onFilterChange: {
      description: '过滤条件变更回调函数，可用于实现服务端过滤',
      control: false,
    },
    onSelectionChange: {
      description: '单元格选择变更回调函数',
      control: false,
    },
    enableEditing: {
      description: '是否启用单元格编辑功能',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    editTriggerMode: {
      description: '编辑触发模式：click（单击）或 doubleClick（双击）',
      control: 'radio',
      options: ['click', 'doubleClick'],
      table: {
        type: { summary: "'click' | 'doubleClick'" },
        defaultValue: { summary: "'doubleClick'" },
      },
    },
    autoSave: {
      description: '是否在失焦时自动保存（不显示确认/取消按钮）',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    enablePaste: {
      description: '是否启用 Excel 粘贴功能',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    enableFiltering: {
      description: '是否启用列过滤功能',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    enableExport: {
      description: '是否启用 Excel 导出功能',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    enableColumnReorder: {
      description: '是否启用列拖拽排序功能',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    enablePagination: {
      description: '是否启用分页功能',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    enableZebraStripes: {
      description: '是否启用斑马纹（交替行背景色）',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    enableCrossHighlight: {
      description: '是否启用交叉高亮（鼠标悬停时高亮行和列）',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    zebraStripeColor: {
      description: '斑马纹背景色',
      control: 'color',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'#fafafa'" },
      },
    },
    crossHighlightColor: {
      description: '交叉高亮背景色',
      control: 'color',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'#e6f7ff'" },
      },
    },
    selectedBorderColor: {
      description: '选中单元格的边框颜色',
      control: 'color',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'#1890ff'" },
      },
    },
    exportFilename: {
      description: '导出文件名（不含扩展名）',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'表格数据'" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 基础示例
export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 基础表格

最简单的表格用法，仅用于数据展示，禁用了所有交互功能。

**特点：**
- ✅ 数据展示
- ❌ 编辑功能
- ❌ 过滤功能
- ❌ 粘贴功能
- ❌ 导出功能
- ❌ 列管理

**适用场景：** 纯数据展示，不需要任何交互。
        `,
      },
    },
  },
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(5));

    return (
      <div style={{ padding: '20px' }}>
        <h2>基础表格</h2>
        <p>最简单的用法，仅显示数据，禁用所有交互功能。</p>
        <AdvancedTable
          data={data}
          columns={baseColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      </div>
    );
  },
};

// 2. 编辑模式示例
export const EditMode: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 单击编辑模式

单击单元格即可直接进入编辑状态，失焦时自动保存，提供最流畅的编辑体验。

**配置：**
- \`editTriggerMode="click"\` - 单击触发编辑
- \`autoSave={true}\` - 失焦自动保存
- 邮箱列设置 \`meta.editable = false\` 禁用编辑

**操作方式：**
1. 单击任意可编辑单元格
2. 输入新内容
3. 点击其他位置或按 Tab 键自动保存
4. 按 Esc 键取消编辑

**适用场景：** 需要快速编辑大量数据的场景，如数据录入、批量修改等。
        `,
      },
    },
  },
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(5));

    const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
      setData(newData);
      if (changeInfo) {
        console.log('数据变更:', changeInfo);
      }
    };

    // 列定义：部分列不可编辑
    const editColumns: ColumnDef<Person>[] = [
      ...baseColumns.slice(0, -2),
      {
        id: 'email',
        accessorKey: 'email',
        header: '邮箱 (不可编辑)',
        size: 200,
        meta: {
          editable: false,  // 禁用编辑
        },
      },
      ...baseColumns.slice(-2),
    ];

    return (
      <div style={{ padding: '20px' }}>
        <h2>编辑模式</h2>
        <p><strong>单击模式：</strong>单击单元格直接进入编辑，失焦自动保存。</p>
        <p><strong>提示：</strong>邮箱列设置为不可编辑。</p>
        <AdvancedTable
          data={data}
          columns={editColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          editTriggerMode="click"
          autoSave={true}
          enableFiltering={false}
          enablePaste={true}
          enableExport={false}
          enableColumnReorder={false}
        />
      </div>
    );
  },
};

// 3. 双击编辑模式示例
export const DoubleClickEdit: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 双击编辑模式

双击单元格进入编辑状态，显示确认和取消按钮，适合需要谨慎确认的编辑场景。

**配置：**
- \`editTriggerMode="doubleClick"\` - 双击触发编辑
- \`autoSave={false}\` - 显示确认/取消按钮

**操作方式：**
1. 双击单元格进入编辑
2. 输入新内容
3. 点击 ✓ 按钮或按 Enter 保存
4. 点击 ✕ 按钮或按 Esc 取消

**适用场景：** 重要数据修改，需要用户明确确认的场景。
        `,
      },
    },
  },
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(5));

    const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
      setData(newData);
      if (changeInfo) {
        console.log('数据变更:', changeInfo);
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>双击编辑模式</h2>
        <p><strong>双击模式：</strong>双击单元格进入编辑，显示确认/取消按钮。</p>
        <p><strong>快捷键：</strong>Enter 保存，Esc 取消。</p>
        <AdvancedTable
          data={data}
          columns={baseColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          editTriggerMode="doubleClick"
          autoSave={false}
          enableFiltering={false}
          enablePaste={true}
          enableExport={false}
          enableColumnReorder={false}
        />
      </div>
    );
  },
};

// 4. Excel 粘贴示例
export const ExcelPaste: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Excel 粘贴功能

支持从 Excel、Google Sheets 等工具直接粘贴多行多列数据，极大提升数据录入效率。

**功能特点：**
- 支持多行多列同时粘贴
- 按所见即所得顺序填充（先横向后纵向）
- 自动创建新行（当粘贴数据超出现有行数）
- 提供详细的变更信息回调

**使用步骤：**
1. 在 Excel 或 Google Sheets 中选择并复制数据（Ctrl+C / Cmd+C）
2. 在表格中单击起始单元格
3. 粘贴数据（Ctrl+V / Cmd+V）
4. 数据会自动填充到对应位置

**变更回调：**
\`onDataChange\` 回调会提供详细信息：
- \`type: 'paste'\` - 变更类型
- \`changes\` - 所有变更的单元格列表
- \`affectedRows\` - 受影响的行数据
- \`affectedRowIndices\` - 受影响的行索引

**适用场景：** 从其他系统导入数据、批量数据录入等。
        `,
      },
    },
  },
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(3));

    const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
      setData(newData);
      if (changeInfo && changeInfo.type === 'paste') {
        console.log('粘贴了数据:', changeInfo);
        alert(`成功粘贴 ${changeInfo.changes.length} 个单元格的数据！`);
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>Excel 粘贴功能</h2>
        <div style={{ 
          background: '#f0f7ff', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #91caff' 
        }}>
          <h3 style={{ marginTop: 0 }}>使用方法：</h3>
          <ol style={{ marginBottom: 0 }}>
            <li>从 Excel 或 Google Sheets 复制数据（支持多行多列）</li>
            <li>单击表格中的某个单元格</li>
            <li>按 <kbd>Ctrl+V</kbd> (Mac: <kbd>Cmd+V</kbd>) 粘贴</li>
            <li>数据会按所见即所得的顺序填充（先横向后纵向）</li>
            <li>如果超出行数，会自动创建新行</li>
          </ol>
        </div>
        <AdvancedTable
          data={data}
          columns={baseColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          editTriggerMode="click"
          autoSave={true}
          enablePaste={true}
          enableFiltering={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      </div>
    );
  },
};

// 5. 过滤功能示例
export const Filtering: Story = {
  render: () => {
    const [data] = useState<Person[]>(generateData(20));

    const handleFilterChange: OnFilterChange = async (columnId, filters, allFilters) => {
      console.log('过滤条件变化:', { columnId, filters, allFilters });
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>列过滤功能</h2>
        <p>点击列头右侧的过滤图标，支持多种过滤操作符。</p>
        <div style={{ 
          background: '#fff7e6', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ffd591' 
        }}>
          <h3 style={{ marginTop: 0 }}>支持的操作符：</h3>
          <ul style={{ marginBottom: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <li>等于 / 不等于</li>
            <li>大于 / 小于</li>
            <li>大于等于 / 小于等于</li>
            <li>包含 / 不包含</li>
            <li>开头是 / 结尾是</li>
            <li>为空 / 非空</li>
          </ul>
        </div>
        <AdvancedTable
          data={data}
          columns={baseColumns}
          onFilterChange={handleFilterChange}
          enableFiltering={true}
          enableEditing={false}
          enablePaste={false}
          enableExport={true}
          enableColumnReorder={false}
        />
      </div>
    );
  },
};

// 6. 分页示例
export const Pagination: Story = {
  render: () => {
    const [data] = useState<Person[]>(generateData(50));
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const handlePageChange = (newPageIndex: number) => {
      setPageIndex(newPageIndex);
      console.log('页码变化:', newPageIndex + 1);
    };

    const handlePageSizeChange = (newPageSize: number) => {
      setPageSize(newPageSize);
      setPageIndex(0);
      console.log('每页条数变化:', newPageSize);
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>分页功能</h2>
        <p>支持页码导航、每页条数选择、快速跳转。</p>
        <AdvancedTable
          data={data}
          columns={baseColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={true}
          enableColumnReorder={false}
          enablePagination={true}
          pagination={{
            pageIndex,
            pageSize,
            totalCount: data.length,
          }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    );
  },
};

// 7. 列拖拽和显示隐藏
export const ColumnManagement: Story = {
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(5));

    return (
      <div style={{ padding: '20px' }}>
        <h2>列管理功能</h2>
        <div style={{ 
          background: '#f6ffed', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #b7eb8f' 
        }}>
          <h3 style={{ marginTop: 0 }}>功能说明：</h3>
          <ul style={{ marginBottom: 0 }}>
            <li><strong>列拖拽排序：</strong>拖动列头左侧的 ⋮⋮ 图标调整列顺序</li>
            <li><strong>调整列宽：</strong>拖动列头右侧的边界线</li>
            <li><strong>显示/隐藏列：</strong>点击右上角"列设置"按钮</li>
          </ul>
        </div>
        <AdvancedTable
          data={data}
          columns={baseColumns}
          onDataChange={setData}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={true}
        />
      </div>
    );
  },
};

// 8. 自定义样式
export const CustomStyling: Story = {
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(10));

    return (
      <div style={{ padding: '20px' }}>
        <h2>自定义样式</h2>
        <p>自定义斑马纹、交叉高亮、选中边框等颜色。</p>
        <AdvancedTable
          data={data}
          columns={baseColumns}
          onDataChange={setData}
          enableEditing={true}
          editTriggerMode="click"
          autoSave={true}
          enableFiltering={false}
          enablePaste={true}
          enableExport={false}
          enableColumnReorder={false}
          enableZebraStripes={true}
          enableCrossHighlight={true}
          zebraStripeColor="#fff7e6"
          crossHighlightColor="#e6fffb"
          selectedBorderColor="#52c41a"
        />
      </div>
    );
  },
};

// 9. 完整功能示例
export const FullFeatured: Story = {
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(30));
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
      setData(newData);
      if (changeInfo) {
        console.log('数据变更详情:', {
          type: changeInfo.type,
          changes: changeInfo.changes,
          affectedRows: changeInfo.affectedRows,
        });
      }
    };

    const handleFilterChange: OnFilterChange = async (columnId, filters, allFilters) => {
      console.log('过滤条件变化:', { columnId, filters, allFilters });
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>完整功能示例</h2>
        <div style={{ 
          background: '#fff0f6', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ffadd2' 
        }}>
          <h3 style={{ marginTop: 0 }}>启用的功能：</h3>
          <ul style={{ 
            marginBottom: 0, 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '10px' 
          }}>
            <li>✅ 单元格编辑（单击模式）</li>
            <li>✅ Excel 粘贴</li>
            <li>✅ 列过滤</li>
            <li>✅ 导出 Excel</li>
            <li>✅ 列拖拽排序</li>
            <li>✅ 列显示/隐藏</li>
            <li>✅ 调整列宽</li>
            <li>✅ 分页功能</li>
            <li>✅ 斑马纹和交叉高亮</li>
            <li>✅ 多选单元格</li>
          </ul>
        </div>
        <AdvancedTable
          data={data}
          columns={baseColumns}
          onDataChange={handleDataChange}
          onFilterChange={handleFilterChange}
          enableEditing={true}
          editTriggerMode="click"
          autoSave={true}
          enablePaste={true}
          enableFiltering={true}
          enableExport={true}
          exportFilename="员工数据表"
          enableColumnReorder={true}
          enableZebraStripes={true}
          enableCrossHighlight={true}
          enablePagination={true}
          pagination={{
            pageIndex,
            pageSize,
            totalCount: data.length,
          }}
          onPageChange={setPageIndex}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageIndex(0);
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          allData={data}
        />
      </div>
    );
  },
};

// 10. 大数据集示例
export const LargeDataset: Story = {
  render: () => {
    const [data] = useState<Person[]>(generateData(200));
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(20);

    return (
      <div style={{ padding: '20px' }}>
        <h2>大数据集示例</h2>
        <p>200 条数据，每页显示 20 条。</p>
        <AdvancedTable
          data={data}
          columns={baseColumns}
          enableEditing={true}
          editTriggerMode="click"
          autoSave={true}
          enablePaste={true}
          enableFiltering={true}
          enableExport={true}
          enableColumnReorder={true}
          enablePagination={true}
          pagination={{
            pageIndex,
            pageSize,
            totalCount: data.length,
          }}
          onPageChange={setPageIndex}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageIndex(0);
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          allData={data}
        />
      </div>
    );
  },
};

