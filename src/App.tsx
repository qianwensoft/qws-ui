import React from 'react';
import { AdvancedTable, type OnFilterChange, type DataChangeInfo } from './components/AdvancedTable';
import type { ColumnDef } from '@tanstack/react-table';
import './App.css';

// 示例数据类型
interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
  department: string;
  salary: number;
  status: string;
}

// 示例数据
const initialData: Person[] = [
  {
    id: '1',
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    department: '技术部',
    salary: 15000,
    status: '在职',
  },
  {
    id: '2',
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    department: '产品部',
    salary: 18000,
    status: '在职',
  },
  {
    id: '3',
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    department: '设计部',
    salary: 12000,
    status: '在职',
  },
  {
    id: '4',
    name: '赵六',
    age: 35,
    email: 'zhaoliu@example.com',
    department: '技术部',
    salary: 20000,
    status: '在职',
  },
  {
    id: '5',
    name: '钱七',
    age: 29,
    email: 'qianqi@example.com',
    department: '运营部',
    salary: 13000,
    status: '在职',
  },
];

// 列定义
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
  {
    id: 'email',
    accessorKey: 'email',
    header: '邮箱',
    meta: {
      editable: false,  // 禁用该列的编辑功能
    },
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
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return `¥${value.toLocaleString()}`;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '状态',
  },
];

function App() {
  const [data, setData] = React.useState<Person[]>(initialData);

  // 数据变更回调（包含详细变更信息）
  const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
    setData(newData);
    
    if (changeInfo) {
      console.log('数据变更详情:', {
        type: changeInfo.type,                    // 变更类型：'edit' 或 'paste'
        changes: changeInfo.changes,               // 变更的单元格列表
        affectedRows: changeInfo.affectedRows,     // 受影响的行数据
        affectedRowIndices: changeInfo.affectedRowIndices,  // 受影响的行索引
      });

      // 示例：调用接口保存变更
      // try {
      //   await fetch('/api/save', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       type: changeInfo.type,
      //       changes: changeInfo.changes,
      //       affectedRows: changeInfo.affectedRows,
      //     }),
      //   });
      // } catch (error) {
      //   console.error('保存失败:', error);
      // }
    } else {
      console.log('数据已更新:', newData);
    }
  };

  // 过滤变化回调（可用于接口调用）
  const handleFilterChange: OnFilterChange<Person> = async (columnId, filters, allFilters) => {
    console.log('过滤条件变化:', {
      columnId,
      filters,
      allFilters,
    });

    // 示例：调用接口进行服务端过滤
    // try {
    //   const response = await fetch('/api/filter', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       columnId,
    //       filters,
    //       allFilters,
    //     }),
    //   });
    //   const filteredData = await response.json();
    //   setData(filteredData);
    // } catch (error) {
    //   console.error('过滤请求失败:', error);
    // }
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>高级表格组件演示</h1>
        <div className="features">
          <div className="feature-item">
            <strong>功能 1:</strong> Excel 粘贴自动填充 - 从 Excel/Google Sheets 复制数据，点击单元格后按 Ctrl+V (Mac: Cmd+V) 粘贴
          </div>
          <div className="feature-item">
            <strong>功能 2:</strong> 列拖拽排序 - 拖动列头左侧的 ⋮⋮ 图标
          </div>
          <div className="feature-item">
            <strong>功能 3:</strong> 调整列宽 - 拖动列头右侧的边界线
          </div>
          <div className="feature-item">
            <strong>功能 4:</strong> 显示/隐藏列 - 点击右上角"列设置"按钮
          </div>
          <div className="feature-item">
            <strong>功能 5:</strong> 列过滤 - 点击表头右侧的过滤器图标，支持多条过滤条件和多种操作符（大于、小于、等于、包含等）
          </div>
          <div className="feature-item">
            <strong>功能 6:</strong> 导出 Excel - 点击"导出"按钮，支持导出当前数据、当前页或全部数据（所见即所得）
          </div>
        </div>
      </div>
      <div className="app-content">
        <AdvancedTable
          data={data}
          columns={columns}
          onDataChange={handleDataChange}
          onFilterChange={handleFilterChange}
          enableFiltering={false}
          enableEditing={false}
          enablePaste={false}
          enableExport={true}
          enableColumnReorder={true}
          exportFilename="员工数据"
        />
      </div>
    </div>
  );
}

export default App;

