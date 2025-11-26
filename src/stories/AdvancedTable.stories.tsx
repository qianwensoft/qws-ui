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
        component: '功能丰富的高级表格组件，支持编辑、粘贴、过滤、导出等功能。',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 基础示例
export const Basic: Story = {
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

