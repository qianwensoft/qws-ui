import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  ColumnResizeMode,
  VisibilityState,
} from '@tanstack/react-table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Settings } from 'lucide-react';
import './AdvancedTable.css';

// 可拖拽的列头组件
interface DraggableColumnHeaderProps {
  column: any;
  children: React.ReactNode;
}

const DraggableColumnHeader: React.FC<DraggableColumnHeaderProps> = ({
  column,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="table-header-cell"
      colSpan={column.columnDef.meta?.colSpan}
    >
      <div className="header-content">
        <button
          className="drag-handle"
          {...attributes}
          {...listeners}
          title="拖拽排序"
        >
          <GripVertical size={16} />
        </button>
        {children}
        <div
          className="resize-handle"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.pageX;
            const startWidth = column.getSize();
            
            const handleMouseMove = (e: MouseEvent) => {
              const diff = e.pageX - startX;
              const newWidth = Math.max(50, startWidth + diff);
              column.setSize(newWidth);
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
      </div>
    </th>
  );
};

// 列设置弹窗组件
interface ColumnVisibilityModalProps {
  columns: any[];
  columnVisibility: VisibilityState;
  onToggleColumn: (columnId: string) => void;
  onClose: () => void;
}

const ColumnVisibilityModal: React.FC<ColumnVisibilityModalProps> = ({
  columns,
  columnVisibility,
  onToggleColumn,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>列设置</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {columns.map((column) => (
            <label key={column.id} className="column-checkbox">
              <input
                type="checkbox"
                checked={columnVisibility[column.id] !== false}
                onChange={() => onToggleColumn(column.id)}
              />
              <span>{column.columnDef.header as string}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// 主表格组件
export interface AdvancedTableProps<T extends Record<string, any>> {
  data: T[];
  columns: ColumnDef<T>[];
  onDataChange?: (data: T[]) => void;
}

export function AdvancedTable<T extends Record<string, any>>({
  data,
  columns,
  onDataChange,
}: AdvancedTableProps<T>) {
  const [tableData, setTableData] = useState<T[]>(data);
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map((col, index) => col.id || `col-${index}`)
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);

  // 更新数据
  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  // 当 columns 变化时，更新 columnOrder
  React.useEffect(() => {
    const newColumnIds = columns.map((col, index) => col.id || `col-${index}`);
    setColumnOrder((prevOrder) => {
      // 保留现有的顺序，添加新列到末尾
      const existingIds = new Set(prevOrder);
      const newIds = newColumnIds.filter((id) => !existingIds.has(id));
      return [...prevOrder.filter((id) => newColumnIds.includes(id)), ...newIds];
    });
  }, [columns]);

  // 通知外部数据变化
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(tableData);
    }
  }, [tableData, onDataChange]);

  // 根据 columnOrder 重新排列列
  const orderedColumns = useMemo(() => {
    const columnMap = new Map(
      columns.map((col, index) => [col.id || `col-${index}`, col])
    );
    return columnOrder
      .map((id) => columnMap.get(id))
      .filter(Boolean) as ColumnDef<T>[];
  }, [columns, columnOrder]);

  // 拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 处理列拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 表格实例
  const table = useReactTable({
    data: tableData,
    columns: orderedColumns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange' as ColumnResizeMode,
    state: {
      columnVisibility,
      columnSizing,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    defaultColumn: {
      size: 150,
      minSize: 50,
      maxSize: 500,
    },
  });

  // 处理 Excel 粘贴
  const handlePaste = useCallback(
    (e: React.ClipboardEvent, rowIndex: number, columnId: string) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text');
      
      if (!pastedData) return;

      // 解析粘贴的数据（支持制表符分隔的多行多列）
      const rows = pastedData
        .split('\n')
        .map((row) => row.split('\t').map((cell) => cell.trim()))
        .filter((row) => row.some((cell) => cell));

      if (rows.length === 0) return;

      // 找到起始列索引
      const columnIds = columnOrder.filter(
        (id) => columnVisibility[id] !== false
      );
      const startColumnIndex = columnIds.indexOf(columnId);
      
      if (startColumnIndex === -1) return;

      // 更新数据
      setTableData((prevData) => {
        const newData = [...prevData];
        
        rows.forEach((row, rowOffset) => {
          const targetRowIndex = rowIndex + rowOffset;
          
          if (targetRowIndex >= newData.length) {
            // 如果超出范围，创建新行
            const newRow = { ...newData[newData.length - 1] } as T;
            row.forEach((cell, colOffset) => {
              const targetColumnId = columnIds[startColumnIndex + colOffset];
              if (targetColumnId) {
                (newRow as any)[targetColumnId] = cell;
              }
            });
            newData.push(newRow);
          } else {
            // 更新现有行
            const targetRow = { ...newData[targetRowIndex] };
            row.forEach((cell, colOffset) => {
              const targetColumnId = columnIds[startColumnIndex + colOffset];
              if (targetColumnId) {
                (targetRow as any)[targetColumnId] = cell;
              }
            });
            newData[targetRowIndex] = targetRow;
          }
        });
        
        return newData;
      });
    },
    [columnOrder, columnVisibility]
  );

  // 处理单元格点击
  const handleCellClick = (rowIndex: number, columnId: string) => {
    setSelectedCell({ rowIndex, columnId });
  };

  // 处理单元格键盘事件
  const handleCellKeyDown = (
    e: React.KeyboardEvent,
    rowIndex: number,
    columnId: string
  ) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      // 粘贴事件会在 onPaste 中处理
      return;
    }
  };

  // 添加全局粘贴事件监听
  React.useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (!selectedCell) return;
      
      const activeElement = document.activeElement;
      if (activeElement && tableRef.current?.contains(activeElement)) {
        const pastedData = e.clipboardData?.getData('text');
        if (!pastedData) return;

        e.preventDefault();

        // 解析粘贴的数据（支持制表符分隔的多行多列）
        const rows = pastedData
          .split('\n')
          .map((row) => row.split('\t').map((cell) => cell.trim()))
          .filter((row) => row.some((cell) => cell));

        if (rows.length === 0) return;

        // 找到起始列索引
        const columnIds = columnOrder.filter(
          (id) => columnVisibility[id] !== false
        );
        const startColumnIndex = columnIds.indexOf(selectedCell.columnId);
        
        if (startColumnIndex === -1) return;

        // 更新数据
        setTableData((prevData) => {
          const newData = [...prevData];
          
          rows.forEach((row, rowOffset) => {
            const targetRowIndex = selectedCell.rowIndex + rowOffset;
            
            if (targetRowIndex >= newData.length) {
              // 如果超出范围，创建新行
              const newRow = { ...newData[newData.length - 1] } as T;
              row.forEach((cell, colOffset) => {
                const targetColumnId = columnIds[startColumnIndex + colOffset];
                if (targetColumnId) {
                  (newRow as any)[targetColumnId] = cell;
                }
              });
              newData.push(newRow);
            } else {
              // 更新现有行
              const targetRow = { ...newData[targetRowIndex] };
              row.forEach((cell, colOffset) => {
                const targetColumnId = columnIds[startColumnIndex + colOffset];
                if (targetColumnId) {
                  (targetRow as any)[targetColumnId] = cell;
                }
              });
              newData[targetRowIndex] = targetRow;
            }
          });
          
          return newData;
        });
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [selectedCell, columnOrder, columnVisibility]);

  // 切换列显示/隐藏
  const toggleColumn = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: prev[columnId] === false,
    }));
  };

  return (
    <div className="advanced-table-container">
      <div className="table-toolbar">
        <button
          className="column-settings-button"
          onClick={() => setShowColumnModal(true)}
          title="列设置"
        >
          <Settings size={16} />
          <span>列设置</span>
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="table-wrapper">
          <table ref={tableRef} className="advanced-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableColumnHeader
                        key={header.id}
                        column={header.column}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </DraggableColumnHeader>
                    ))}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.id;
                    const isSelected =
                      selectedCell?.rowIndex === rowIndex &&
                      selectedCell?.columnId === columnId;

                    return (
                      <td
                        key={cell.id}
                        className={`table-cell ${isSelected ? 'selected' : ''}`}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                        }}
                        onClick={() => handleCellClick(rowIndex, columnId)}
                        onPaste={(e) => handlePaste(e, rowIndex, columnId)}
                        onKeyDown={(e) => handleCellKeyDown(e, rowIndex, columnId)}
                        tabIndex={0}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DndContext>

      {showColumnModal && (
        <ColumnVisibilityModal
          columns={table.getAllColumns()}
          columnVisibility={columnVisibility}
          onToggleColumn={toggleColumn}
          onClose={() => setShowColumnModal(false)}
        />
      )}
    </div>
  );
}

