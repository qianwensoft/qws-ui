# AdvancedTable Usage Examples

## Basic Examples

### Example 1: Simple Read-only Table
```typescript
import { AdvancedTable } from '@/components/AdvancedTable';
import { ColumnDef } from '@tanstack/react-table';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const ProductList = () => {
  const columns: ColumnDef<Product>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: '产品名称' },
    { accessorKey: 'price', header: '价格' },
    { accessorKey: 'stock', header: '库存' }
  ];

  const products: Product[] = [
    { id: 1, name: 'MacBook Pro', price: 15999, stock: 10 },
    { id: 2, name: 'iPhone 15', price: 6999, stock: 25 },
    { id: 3, name: 'AirPods Pro', price: 1999, stock: 50 }
  ];

  return <AdvancedTable data={products} columns={columns} />;
};
```

### Example 2: Editable Table with Change Tracking
```typescript
import { useState } from 'react';
import { AdvancedTable } from '@/components/AdvancedTable';

const EditableProductList = () => {
  const [products, setProducts] = useState(initialProducts);
  const [changeLog, setChangeLog] = useState([]);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      meta: { editable: false }
    },
    {
      accessorKey: 'name',
      header: '产品名称',
      meta: { editable: true }
    },
    {
      accessorKey: 'price',
      header: '价格',
      meta: { editable: true }
    },
    {
      accessorKey: 'stock',
      header: '库存',
      meta: { editable: true }
    }
  ];

  const handleDataChange = (newData, changeInfo) => {
    setProducts(newData);
    setChangeLog(prev => [...prev, changeInfo]);

    // Save to server
    if (changeInfo.type === 'edit') {
      saveToServer(changeInfo.changes[0]);
    }
  };

  return (
    <>
      <AdvancedTable
        data={products}
        columns={columns}
        editMode="doubleClick"
        onDataChange={handleDataChange}
      />
      <div className="mt-4">
        <h3>Change Log:</h3>
        <pre>{JSON.stringify(changeLog, null, 2)}</pre>
      </div>
    </>
  );
};
```

## Advanced Examples

### Example 3: Excel Paste Support
```typescript
import { useState } from 'react';
import { AdvancedTable } from '@/components/AdvancedTable';
import { toast } from 'sonner';

const BulkImportTable = () => {
  const [data, setData] = useState([]);

  const columns: ColumnDef<OrderItem>[] = [
    { accessorKey: 'sku', header: 'SKU', meta: { editable: true } },
    { accessorKey: 'quantity', header: '数量', meta: { editable: true } },
    { accessorKey: 'price', header: '单价', meta: { editable: true } },
    { accessorKey: 'total', header: '总价', meta: { editable: false } }
  ];

  const handleDataChange = (newData, changeInfo) => {
    // Calculate totals
    const updatedData = newData.map(row => ({
      ...row,
      total: (row.quantity || 0) * (row.price || 0)
    }));

    setData(updatedData);

    if (changeInfo.type === 'paste') {
      toast.success(`粘贴了 ${changeInfo.changes.length} 个单元格`);
    }
  };

  return (
    <div>
      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p>💡 提示：从 Excel 复制数据，然后点击单元格粘贴（Ctrl+V / Cmd+V）</p>
      </div>
      <AdvancedTable
        data={data}
        columns={columns}
        editMode="click"
        enableExcelPaste={true}
        onDataChange={handleDataChange}
      />
    </div>
  );
};
```

### Example 4: Server-side Filtering and Pagination
```typescript
import { useState, useEffect } from 'react';
import { AdvancedTable } from '@/components/AdvancedTable';

const ServerSideTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([]);

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: '姓名' },
    { accessorKey: 'email', header: '邮箱' },
    { accessorKey: 'role', header: '角色' },
    { accessorKey: 'status', header: '状态' }
  ];

  const fetchData = async (filterParams) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters: filterParams })
      });
      const result = await response.json();
      setData(result.data);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchData(newFilters);
  };

  useEffect(() => {
    fetchData([]);
  }, []);

  return (
    <div>
      {loading && <div>加载中...</div>}
      <AdvancedTable
        data={data}
        columns={columns}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};
```

### Example 5: Custom Cell Rendering
```typescript
import { AdvancedTable } from '@/components/AdvancedTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CustomCellTable = () => {
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: '订单号'
    },
    {
      accessorKey: 'customer',
      header: '客户'
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ getValue }) => {
        const status = getValue();
        const variants = {
          pending: 'warning',
          shipped: 'info',
          delivered: 'success',
          cancelled: 'destructive'
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
      }
    },
    {
      accessorKey: 'total',
      header: '总额',
      cell: ({ getValue }) => {
        return `¥${getValue().toLocaleString()}`;
      }
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => viewOrder(row.original)}>
            查看
          </Button>
          <Button size="sm" variant="outline" onClick={() => editOrder(row.original)}>
            编辑
          </Button>
        </div>
      )
    }
  ];

  return <AdvancedTable data={orders} columns={columns} />;
};
```

### Example 6: Column Reordering
```typescript
import { AdvancedTable } from '@/components/AdvancedTable';

const ReorderableTable = () => {
  const columns: ColumnDef<Employee>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: '姓名' },
    { accessorKey: 'department', header: '部门' },
    { accessorKey: 'position', header: '职位' },
    { accessorKey: 'salary', header: '薪资' }
  ];

  return (
    <div>
      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p>💡 拖动列标题可以重新排序</p>
      </div>
      <AdvancedTable
        data={employees}
        columns={columns}
        enableColumnReordering={true}
      />
    </div>
  );
};
```

### Example 7: With Pagination
```typescript
import { AdvancedTable } from '@/components/AdvancedTable';

const PaginatedTable = () => {
  const columns: ColumnDef<Transaction>[] = [
    { accessorKey: 'id', header: '交易ID' },
    { accessorKey: 'date', header: '日期' },
    { accessorKey: 'description', header: '描述' },
    { accessorKey: 'amount', header: '金额' },
    { accessorKey: 'balance', header: '余额' }
  ];

  return (
    <AdvancedTable
      data={transactions}
      columns={columns}
      pageSize={20}
      pageSizeOptions={[10, 20, 50, 100]}
    />
  );
};
```

### Example 8: Complete CRUD Example
```typescript
import { useState } from 'react';
import { AdvancedTable } from '@/components/AdvancedTable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CRUDTable = () => {
  const [data, setData] = useState(initialData);

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      meta: { editable: false }
    },
    {
      accessorKey: 'name',
      header: '名称',
      meta: { editable: true }
    },
    {
      accessorKey: 'category',
      header: '分类',
      meta: { editable: true }
    },
    {
      accessorKey: 'price',
      header: '价格',
      meta: { editable: true }
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(row.original.id)}
        >
          删除
        </Button>
      )
    }
  ];

  const handleDataChange = async (newData, changeInfo) => {
    setData(newData);

    try {
      // Update server
      for (const change of changeInfo.changes) {
        const item = newData[change.rowIndex];
        await updateItem(item.id, {
          [change.columnId]: change.newValue
        });
      }
      toast.success('保存成功');
    } catch (error) {
      toast.error('保存失败');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setData(data.filter(item => item.id !== id));
      toast.success('删除成功');
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      name: '新项目',
      category: '',
      price: 0
    };
    setData([...data, newItem]);
  };

  return (
    <div>
      <div className="mb-4">
        <Button onClick={handleAdd}>添加新项目</Button>
      </div>
      <AdvancedTable
        data={data}
        columns={columns}
        editMode="doubleClick"
        enableExcelPaste={true}
        onDataChange={handleDataChange}
        pageSize={10}
      />
    </div>
  );
};
```

## Integration Examples

### Example 9: With React Query
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdvancedTable } from '@/components/AdvancedTable';

const ReactQueryTable = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems
  });

  const updateMutation = useMutation({
    mutationFn: (changes) => updateItems(changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });

  const handleDataChange = (newData, changeInfo) => {
    updateMutation.mutate(changeInfo.changes);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <AdvancedTable
      data={data}
      columns={columns}
      onDataChange={handleDataChange}
    />
  );
};
```

### Example 10: With Form Dialog
```typescript
import { useState } from 'react';
import { AdvancedTable } from '@/components/AdvancedTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdvancedForm } from '@/components/AdvancedForm';

const TableWithFormDialog = () => {
  const [data, setData] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns: ColumnDef<Item>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: '名称' },
    { accessorKey: 'description', header: '描述' },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <Button onClick={() => {
          setSelectedItem(row.original);
          setDialogOpen(true);
        }}>
          编辑
        </Button>
      )
    }
  ];

  const handleFormSubmit = (formData) => {
    const updatedData = data.map(item =>
      item.id === selectedItem.id ? { ...item, ...formData } : item
    );
    setData(updatedData);
    setDialogOpen(false);
  };

  return (
    <>
      <AdvancedTable data={data} columns={columns} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑项目</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <AdvancedForm
              initialData={selectedItem}
              onSubmit={handleFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
```

## Common Patterns

### Pattern: Conditional Editing
```typescript
const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'status',
    header: '状态',
    meta: {
      editable: (row) => row.status !== 'locked'
    }
  }
];
```

### Pattern: Optimistic Updates
```typescript
const handleDataChange = async (newData, changeInfo) => {
  // Update UI immediately
  setData(newData);

  try {
    // Send to server
    await updateServer(changeInfo.changes);
  } catch (error) {
    // Rollback on error
    setData(previousData);
    toast.error('更新失败，已回滚');
  }
};
```

### Pattern: Batch Operations
```typescript
const [selectedRows, setSelectedRows] = useState([]);

const handleBatchDelete = async () => {
  await deleteMultiple(selectedRows);
  setData(data.filter(item => !selectedRows.includes(item.id)));
  setSelectedRows([]);
};
```
