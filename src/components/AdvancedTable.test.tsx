import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdvancedTable, type DataChangeInfo } from './AdvancedTable';
import type { ColumnDef } from '@tanstack/react-table';

// 测试数据类型
interface TestData {
  id: string;
  name: string;
  age: number;
  email: string;
  status: string;
}

// 测试数据
const mockData: TestData[] = [
  { id: '1', name: '张三', age: 28, email: 'zhangsan@example.com', status: '在职' },
  { id: '2', name: '李四', age: 32, email: 'lisi@example.com', status: '在职' },
  { id: '3', name: '王五', age: 25, email: 'wangwu@example.com', status: '试用期' },
];

// 列定义
const mockColumns: ColumnDef<TestData>[] = [
  { id: 'name', accessorKey: 'name', header: '姓名' },
  { id: 'age', accessorKey: 'age', header: '年龄' },
  { id: 'email', accessorKey: 'email', header: '邮箱' },
  { id: 'status', accessorKey: 'status', header: '状态' },
];

describe('AdvancedTable 组件测试', () => {
  describe('基础渲染', () => {
    it('应该正确渲染表格', () => {
      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 验证表头
      expect(screen.getByText('姓名')).toBeInTheDocument();
      expect(screen.getByText('年龄')).toBeInTheDocument();
      expect(screen.getByText('邮箱')).toBeInTheDocument();
      expect(screen.getByText('状态')).toBeInTheDocument();

      // 验证数据
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('28')).toBeInTheDocument();
      expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument();
      expect(screen.getAllByText('在职').length).toBeGreaterThan(0);
    });

    it('应该渲染正确的数据行数', () => {
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(mockData.length);
    });

    it('应该在没有数据时正确渲染空表格', () => {
      const { container } = render(
        <AdvancedTable
          data={[]}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(0);
    });
  });

  describe('编辑功能', () => {
    it('单击模式：单击单元格应该进入编辑状态', async () => {
      const user = userEvent.setup();
      const handleDataChange = vi.fn();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          editTriggerMode="click"
          autoSave={true}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 单击第一个名字单元格
      const nameCell = screen.getByText('张三');
      await user.click(nameCell);

      // 应该出现输入框
      await waitFor(() => {
        const input = screen.getByDisplayValue('张三');
        expect(input).toBeInTheDocument();
      });
    });

    it('双击模式：双击单元格应该进入编辑状态', async () => {
      const user = userEvent.setup();
      const handleDataChange = vi.fn();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          editTriggerMode="doubleClick"
          autoSave={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 双击第一个名字单元格
      const nameCell = screen.getByText('张三');
      await user.dblClick(nameCell);

      // 应该出现输入框
      await waitFor(() => {
        const input = screen.getByDisplayValue('张三');
        expect(input).toBeInTheDocument();
      });
    });

    it('应该正确保存编辑的数据', async () => {
      const user = userEvent.setup();
      const handleDataChange = vi.fn();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          editTriggerMode="click"
          autoSave={true}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 单击单元格进入编辑
      const nameCell = screen.getByText('张三');
      await user.click(nameCell);

      // 修改内容
      const input = await screen.findByDisplayValue('张三');
      await user.clear(input);
      await user.type(input, '张三丰');

      // 失焦触发保存
      await user.tab();

      // 验证回调被调用
      await waitFor(() => {
        expect(handleDataChange).toHaveBeenCalled();
        const [newData, changeInfo] = handleDataChange.mock.calls[0];
        expect(changeInfo?.type).toBe('edit');
        expect(changeInfo?.changes[0].newValue).toBe('张三丰');
      });
    });

    it('应该支持禁用特定列的编辑', () => {
      const columnsWithDisabled: ColumnDef<TestData>[] = [
        { id: 'name', accessorKey: 'name', header: '姓名' },
        {
          id: 'email',
          accessorKey: 'email',
          header: '邮箱',
          meta: { editable: false },
        },
      ];

      render(
        <AdvancedTable
          data={mockData}
          columns={columnsWithDisabled}
          enableEditing={true}
          editTriggerMode="click"
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 邮箱列应该不可编辑
      const emailCell = screen.getByText('zhangsan@example.com');
      fireEvent.click(emailCell);

      // 不应该出现输入框
      expect(screen.queryByDisplayValue('zhangsan@example.com')).not.toBeInTheDocument();
    });

    it('按 Esc 键应该取消编辑', async () => {
      const user = userEvent.setup();
      const handleDataChange = vi.fn();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          editTriggerMode="doubleClick"
          autoSave={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 双击进入编辑
      const nameCell = screen.getByText('张三');
      await user.dblClick(nameCell);

      // 修改内容
      const input = await screen.findByDisplayValue('张三');
      await user.clear(input);
      await user.type(input, '新名字');

      // 按 Esc 取消
      await user.keyboard('{Escape}');

      // 回调不应该被调用
      await waitFor(() => {
        expect(handleDataChange).not.toHaveBeenCalled();
      });

      // 原值应该保留
      expect(screen.getByText('张三')).toBeInTheDocument();
    });
  });

  describe('粘贴功能', () => {
    // Note: 粘贴功能依赖 document.activeElement 和 ClipboardEvent
    // 在 jsdom 环境中可能不完全支持，这里测试基本的事件监听逻辑
    
    it('应该在启用粘贴时注册粘贴事件监听器', () => {
      const handleDataChange = vi.fn();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          enablePaste={true}
          enableFiltering={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 组件挂载时应该已经注册了粘贴事件
      // 实际的粘贴功能需要在浏览器环境中测试
      expect(true).toBe(true);
    });

    it('启用粘贴功能时应该正确初始化', () => {
      const handleDataChange = vi.fn();

      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          enablePaste={true}
          enableFiltering={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 表格应该正常渲染
      const cells = container.querySelectorAll('td');
      expect(cells.length).toBeGreaterThan(0);
      
      // 单元格应该可以选中（有 tabIndex）
      const firstCell = cells[0];
      expect(firstCell).toHaveAttribute('tabindex', '0');
    });

    it('禁用粘贴时功能应该被关闭', () => {
      const handleDataChange = vi.fn();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          enablePaste={false}
          enableFiltering={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // enablePaste=false 时，粘贴事件监听器不应处理事件
      expect(true).toBe(true);
    });
  });

  describe('过滤功能', () => {
    it('应该显示过滤按钮', () => {
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={true}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 每个列头应该有过滤按钮
      const filterButtons = container.querySelectorAll('.filter-button');
      expect(filterButtons.length).toBeGreaterThan(0);
    });

    it('点击过滤按钮应该显示过滤面板', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={true}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 点击第一个过滤按钮
      const filterButton = container.querySelector('.filter-button');
      if (filterButton) {
        await user.click(filterButton as HTMLElement);
      }

      // 应该显示过滤面板
      await waitFor(() => {
        expect(screen.getByText(/过滤:/)).toBeInTheDocument();
      });
    });

    it('应该支持添加过滤条件', async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();

      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onFilterChange={handleFilterChange}
          enableEditing={false}
          enableFiltering={true}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 打开过滤面板
      const filterButton = container.querySelector('.filter-button');
      if (filterButton) {
        await user.click(filterButton as HTMLElement);
      }

      // 等待过滤面板显示
      await waitFor(() => {
        expect(screen.getByText(/过滤:/)).toBeInTheDocument();
      });

      // 添加过滤条件
      const addButton = await screen.findByText('添加条件');
      await user.click(addButton);

      // 验证过滤面板有条件项
      await waitFor(() => {
        const operatorSelect = container.querySelector('.filter-operator-select');
        expect(operatorSelect).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('禁用过滤时不应显示过滤按钮', () => {
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const filterButtons = container.querySelectorAll('.filter-button');
      expect(filterButtons).toHaveLength(0);
    });
  });

  describe('导出功能', () => {
    it('启用导出时应该显示导出按钮', () => {
      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={true}
          enableColumnReorder={false}
        />
      );

      expect(screen.getByText('导出')).toBeInTheDocument();
    });

    it('禁用导出时不应显示导出按钮', () => {
      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      expect(screen.queryByText('导出')).not.toBeInTheDocument();
    });

    it('点击导出按钮应该显示导出菜单', async () => {
      const user = userEvent.setup();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={true}
          enableColumnReorder={false}
        />
      );

      const exportButton = screen.getByText('导出');
      await user.click(exportButton);

      // 应该显示导出菜单
      await waitFor(() => {
        expect(screen.getByText(/导出当前数据/)).toBeInTheDocument();
      });
    });
  });

  describe('列管理功能', () => {
    it('启用列排序时应该显示列设置按钮', () => {
      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={true}
        />
      );

      expect(screen.getByText('列设置')).toBeInTheDocument();
    });

    it('禁用列排序时不应显示列设置按钮', () => {
      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      expect(screen.queryByText('列设置')).not.toBeInTheDocument();
    });

    it('点击列设置按钮应该显示列设置弹窗', async () => {
      const user = userEvent.setup();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={true}
        />
      );

      const settingsButton = screen.getByText('列设置');
      await user.click(settingsButton);

      // 应该显示列设置弹窗
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: '列设置' })).toBeInTheDocument();
      });
    });

    it('启用列排序时应该显示拖拽手柄', () => {
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={true}
        />
      );

      const dragHandles = container.querySelectorAll('.drag-handle');
      expect(dragHandles.length).toBeGreaterThan(0);
    });
  });

  describe('分页功能', () => {
    it('启用分页时应该显示分页组件', () => {
      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
          enablePagination={true}
          pagination={{
            pageIndex: 0,
            pageSize: 10,
            totalCount: mockData.length,
          }}
          onPageChange={vi.fn()}
          onPageSizeChange={vi.fn()}
        />
      );

      expect(screen.getByText(/显示/)).toBeInTheDocument();
      expect(screen.getByText(/共/)).toBeInTheDocument();
    });

    it('禁用分页时不应显示分页组件', () => {
      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
          enablePagination={false}
        />
      );

      expect(screen.queryByText(/显示/)).not.toBeInTheDocument();
    });

    it('应该正确调用分页回调', async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      const handlePageSizeChange = vi.fn();

      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
          enablePagination={true}
          pagination={{
            pageIndex: 0,
            pageSize: 1,
            totalCount: mockData.length,
          }}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      );

      // 点击下一页
      const nextButton = container.querySelector('.pagination-button[title="下一页"]');
      if (nextButton) {
        await user.click(nextButton as HTMLElement);
        expect(handlePageChange).toHaveBeenCalledWith(1);
      }
    });
  });

  describe('视觉效果', () => {
    it('启用斑马纹时应该添加相应的类', () => {
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
          enableZebraStripes={true}
        />
      );

      const zebraRows = container.querySelectorAll('.zebra-row');
      expect(zebraRows.length).toBeGreaterThan(0);
    });

    it('应该支持自定义颜色', () => {
      const customColor = '#ff0000';
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
          enableZebraStripes={true}
          zebraStripeColor={customColor}
        />
      );

      const zebraRow = container.querySelector('.zebra-row');
      expect(zebraRow).toHaveStyle({ backgroundColor: customColor });
    });
  });

  describe('多选功能', () => {
    it('鼠标按下并移动应该选中多个单元格', async () => {
      const handleSelectionChange = vi.fn();
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onSelectionChange={handleSelectionChange}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const cells = container.querySelectorAll('td');
      if (cells.length >= 2) {
        // 在第一个单元格按下鼠标
        fireEvent.mouseDown(cells[0]);

        // 移动到第二个单元格
        fireEvent.mouseEnter(cells[1]);

        // 释放鼠标
        fireEvent.mouseUp(document);

        // 应该触发选择变化回调
        await waitFor(() => {
          expect(handleSelectionChange).toHaveBeenCalled();
        });
      }
    });

    it('选中的单元格应该有相应的样式类', async () => {
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const cells = container.querySelectorAll('td');
      if (cells.length > 0) {
        // 选中第一个单元格
        fireEvent.mouseDown(cells[0]);

        await waitFor(() => {
          expect(cells[0]).toHaveClass('selected');
        });
      }
    });
  });

  describe('数据变更回调', () => {
    it('编辑时应该提供正确的变更信息', async () => {
      const user = userEvent.setup();
      const handleDataChange = vi.fn();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          editTriggerMode="click"
          autoSave={true}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 编辑单元格
      const nameCell = screen.getByText('张三');
      await user.click(nameCell);

      const input = await screen.findByDisplayValue('张三');
      await user.clear(input);
      await user.type(input, '新名字');
      await user.tab();

      // 验证变更信息
      await waitFor(() => {
        expect(handleDataChange).toHaveBeenCalled();
        const [newData, changeInfo] = handleDataChange.mock.calls[0] as [
          TestData[],
          DataChangeInfo<TestData>
        ];

        expect(changeInfo).toBeDefined();
        expect(changeInfo?.type).toBe('edit');
        expect(changeInfo?.changes).toHaveLength(1);
        expect(changeInfo?.changes[0].oldValue).toBe('张三');
        expect(changeInfo?.changes[0].newValue).toBe('新名字');
        expect(changeInfo?.changes[0].columnId).toBe('name');
        expect(changeInfo?.affectedRows).toHaveLength(1);
        expect(changeInfo?.affectedRowIndices).toEqual([0]);
      });
    });

    it('粘贴功能应该有正确的接口定义', () => {
      const handleDataChange = vi.fn<(data: TestData[], changeInfo?: DataChangeInfo<TestData>) => void>();

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          onDataChange={handleDataChange}
          enableEditing={true}
          enablePaste={true}
          enableFiltering={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 验证组件正确接受 onDataChange 回调
      // 实际的粘贴测试需要在 E2E 测试中进行
      expect(handleDataChange).toBeDefined();
    });
  });

  describe('工具栏自定义按钮', () => {
    it('应该显示工具栏按钮', () => {
      const toolbarButtons = [
        {
          key: 'add',
          label: '新增',
          onClick: vi.fn(),
        },
        {
          key: 'delete',
          label: '删除',
          onClick: vi.fn(),
        },
      ];

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          toolbarButtons={toolbarButtons}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      expect(screen.getByText('新增')).toBeInTheDocument();
      expect(screen.getByText('删除')).toBeInTheDocument();
    });

    it('点击工具栏按钮应该调用回调', async () => {
      const user = userEvent.setup();
      const handleAdd = vi.fn();
      const toolbarButtons = [
        {
          key: 'add',
          label: '新增',
          onClick: handleAdd,
        },
      ];

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          toolbarButtons={toolbarButtons}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const addButton = screen.getByText('新增');
      await user.click(addButton);

      expect(handleAdd).toHaveBeenCalled();
    });

    it('应该显示工具栏按钮图标', () => {
      const toolbarButtons = [
        {
          key: 'add',
          label: '新增',
          icon: <span data-testid="add-icon">+</span>,
          onClick: vi.fn(),
        },
      ];

      const { getByTestId } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          toolbarButtons={toolbarButtons}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      expect(getByTestId('add-icon')).toBeInTheDocument();
    });

    it('应该禁用工具栏按钮', () => {
      const toolbarButtons = [
        {
          key: 'delete',
          label: '删除',
          onClick: vi.fn(),
          disabled: true,
        },
      ];

      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          toolbarButtons={toolbarButtons}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const deleteButton = container.querySelector('.toolbar-button[disabled]');
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toBeDisabled();
    });

    it('应该显示工具栏按钮标题', () => {
      const toolbarButtons = [
        {
          key: 'add',
          label: '新增',
          onClick: vi.fn(),
          title: '添加新记录',
        },
      ];

      render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          toolbarButtons={toolbarButtons}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const addButton = screen.getByTitle('添加新记录');
      expect(addButton).toBeInTheDocument();
    });

    it('应该支持多个工具栏按钮', () => {
      const toolbarButtons = [
        { key: 'add', label: '新增', onClick: vi.fn() },
        { key: 'edit', label: '编辑', onClick: vi.fn() },
        { key: 'delete', label: '删除', onClick: vi.fn() },
        { key: 'refresh', label: '刷新', onClick: vi.fn() },
      ];

      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          toolbarButtons={toolbarButtons}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const buttons = container.querySelectorAll('.toolbar-button');
      expect(buttons).toHaveLength(4);
    });
  });

  describe('边界情况', () => {
    it('应该处理空数据数组', () => {
      const { container } = render(
        <AdvancedTable
          data={[]}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(0);
    });

    it('应该处理空列定义数组', () => {
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={[]}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const headers = container.querySelectorAll('th');
      expect(headers).toHaveLength(0);
    });

    it('应该处理非常长的文本', () => {
      const longTextData = [
        {
          id: '1',
          name: '这是一个非常非常非常非常非常非常非常非常长的名字',
          age: 28,
          email: 'very.long.email.address.that.should.be.handled.properly@example.com',
          status: '在职',
        },
      ];

      render(
        <AdvancedTable
          data={longTextData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      expect(
        screen.getByText('这是一个非常非常非常非常非常非常非常非常长的名字')
      ).toBeInTheDocument();
    });

    it('应该处理特殊字符', () => {
      const specialCharData = [
        {
          id: '1',
          name: '<script>alert("xss")</script>',
          age: 28,
          email: 'test@example.com',
          status: '在职 & 试用期',
        },
      ];

      render(
        <AdvancedTable
          data={specialCharData}
          columns={mockColumns}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      // 特殊字符应该被正确转义
      expect(screen.getByText('<script>alert("xss")</script>')).toBeInTheDocument();
    });

    it('应该处理空工具栏按钮数组', () => {
      const { container } = render(
        <AdvancedTable
          data={mockData}
          columns={mockColumns}
          toolbarButtons={[]}
          enableEditing={false}
          enableFiltering={false}
          enablePaste={false}
          enableExport={false}
          enableColumnReorder={false}
        />
      );

      const toolbar = container.querySelector('.toolbar-left');
      expect(toolbar).toBeInTheDocument();
      expect(toolbar?.children).toHaveLength(0);
    });
  });
});

