import React from 'react';
import { AdvancedTable } from './components/AdvancedTable';
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
    size: 120,
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: '年龄',
    size: 80,
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
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '状态',
    size: 100,
  },
];

function App() {
  const [data, setData] = React.useState<Person[]>(initialData);

  const handleDataChange = (newData: Person[]) => {
    setData(newData);
    console.log('数据已更新:', newData);
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
        </div>
      </div>
      <div className="app-content">
        <AdvancedTable
          data={data}
          columns={columns}
          onDataChange={handleDataChange}
        />
      </div>
    </div>
  );
}

export default App;

