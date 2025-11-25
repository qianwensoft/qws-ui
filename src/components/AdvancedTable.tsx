import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  ColumnResizeMode,
  VisibilityState,
  RowData,
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Settings, Filter, Plus, Trash2, Check, X as XIcon, ChevronUp, ChevronDown, Download } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import './AdvancedTable.css';

// 扩展 @tanstack/react-table 的 ColumnMeta 类型
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: boolean;  // 列级别的编辑开关，默认 true
  }
}

// 过滤操作符类型
export type FilterOperator = 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty';

// 过滤条件接口
export interface FilterCondition {
  id: string;
  operator: FilterOperator;
  value?: string | number; // 空/非空操作符不需要值
}

// 列的过滤条件集合
export interface ColumnFilters {
  [columnId: string]: FilterCondition[];
}

// 过滤回调函数类型（用于接口调用）
export type OnFilterChange<T> = (columnId: string, filters: FilterCondition[], allFilters: ColumnFilters) => void | Promise<void>;

// 操作符选项
const operatorOptions: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: '等于' },
  { value: 'notEquals', label: '不等于' },
  { value: 'greaterThan', label: '大于' },
  { value: 'lessThan', label: '小于' },
  { value: 'greaterThanOrEqual', label: '大于等于' },
  { value: 'lessThanOrEqual', label: '小于等于' },
  { value: 'contains', label: '包含' },
  { value: 'notContains', label: '不包含' },
  { value: 'startsWith', label: '开头是' },
  { value: 'endsWith', label: '结尾是' },
  { value: 'isEmpty', label: '为空' },
  { value: 'isNotEmpty', label: '非空' },
];

// 判断操作符是否需要值输入
const operatorRequiresValue = (operator: FilterOperator): boolean => {
  return operator !== 'isEmpty' && operator !== 'isNotEmpty';
};

// 可自动扩展的输入框组件
interface AutoExpandInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  autoFocus?: boolean;
}

const AutoExpandInput: React.FC<AutoExpandInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  minWidth = 80,
  maxWidth = 300,
  className = '',
  onKeyDown,
  onBlur,
  inputRef: externalInputRef,
  autoFocus = false,
}) => {
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(minWidth);

  // 根据内容计算宽度
  React.useEffect(() => {
    if (measureRef.current) {
      const text = String(value || '');
      const placeholderText = placeholder || '';
      const displayText = text || placeholderText;
      
      measureRef.current.textContent = displayText || 'M'; // 至少一个字符来测量
      const measuredWidth = measureRef.current.offsetWidth;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, measuredWidth + 20)); // 加上padding
      setWidth(newWidth);
    }
  }, [value, placeholder, minWidth, maxWidth]);

  // 自动聚焦
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus, inputRef]);

  return (
    <div className="auto-expand-input-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
      <span
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          fontSize: '13px',
          padding: '6px 8px',
          fontFamily: 'inherit',
        }}
      />
      <input
        ref={inputRef}
        type={type}
        className={`auto-expand-input ${className}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          width: `${width}px`,
          minWidth: `${minWidth}px`,
          maxWidth: `${maxWidth}px`,
        }}
      />
    </div>
  );
};

// 过滤条件面板组件
interface FilterPanelProps {
  columnId: string;
  columnHeader: string;
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  columnId,
  columnHeader,
  filters,
  onFiltersChange,
  onClose,
  position,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = React.useState(position);

  // 智能定位：确保面板不超出视口
  React.useEffect(() => {
    if (!panelRef.current) return;

    const panel = panelRef.current;
    const rect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 8; // 距离边缘的最小距离

    let newTop = position.top;
    let newLeft = position.left;

    // 检查右侧是否超出
    if (rect.right > viewportWidth - padding) {
      newLeft = viewportWidth - rect.width - padding;
    }

    // 检查左侧是否超出
    if (rect.left < padding) {
      newLeft = padding;
    }

    // 检查底部是否超出
    if (rect.bottom > viewportHeight - padding) {
      // 尝试向上移动，但至少保留一些空间在顶部
      const maxTop = viewportHeight - rect.height - padding;
      const minTop = padding;
      newTop = Math.max(minTop, Math.min(maxTop, position.top - rect.height - 8));
    }

    // 检查顶部是否超出
    if (rect.top < padding) {
      newTop = padding;
    }

    if (newTop !== position.top || newLeft !== position.left) {
      setAdjustedPosition({ top: newTop, left: newLeft });
    } else {
      setAdjustedPosition(position);
    }
  }, [position]);

  // 点击外部关闭
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // 添加过滤条件
  const handleAddCondition = () => {
    const newCondition: FilterCondition = {
      id: `filter-${Date.now()}-${Math.random()}`,
      operator: 'equals',
      value: '',
    };
    onFiltersChange([...filters, newCondition]);
  };

  // 删除过滤条件
  const handleRemoveCondition = (id: string) => {
    onFiltersChange(filters.filter((f) => f.id !== id));
  };

  // 更新过滤条件
  const handleUpdateCondition = (id: string, updates: Partial<FilterCondition>) => {
    onFiltersChange(
      filters.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  // 清除所有过滤条件
  const handleClearAll = () => {
    onFiltersChange([]);
  };

  return (
    <div
      ref={panelRef}
      className="filter-panel"
      style={{
        position: 'fixed',
        top: `${adjustedPosition.top}px`,
        left: `${adjustedPosition.left}px`,
        zIndex: 1001,
      }}
    >
      <div className="filter-panel-header">
        <span className="filter-panel-title">过滤: {columnHeader}</span>
        <button className="filter-close-button" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="filter-panel-body">
        {filters.length === 0 ? (
          <div className="filter-empty-state">
            <p>暂无过滤条件</p>
            <button className="filter-add-button" onClick={handleAddCondition}>
              <Plus size={14} />
              添加条件
            </button>
          </div>
        ) : (
          <>
            <div className="filter-conditions">
              {filters.map((condition, index) => (
                <div key={condition.id} className="filter-condition-item">
                  {index > 0 && <div className="filter-connector">且</div>}
                  <div className="filter-condition-content">
                    <select
                      className="filter-operator-select"
                      value={condition.operator}
                      onChange={(e) =>
                        handleUpdateCondition(condition.id, {
                          operator: e.target.value as FilterOperator,
                        })
                      }
                    >
                      {operatorOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {operatorRequiresValue(condition.operator) ? (
                      <AutoExpandInput
                        value={condition.value || ''}
                        onChange={(value) =>
                          handleUpdateCondition(condition.id, { value })
                        }
                        placeholder="输入值"
                        minWidth={80}
                        maxWidth={250}
                        className="filter-value-input"
                      />
                    ) : (
                      <div className="filter-value-placeholder">
                        {condition.operator === 'isEmpty' ? '为空' : '非空'}
                      </div>
                    )}
                    <button
                      className="filter-remove-button"
                      onClick={() => handleRemoveCondition(condition.id)}
                      title="删除条件"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="filter-panel-actions">
              <button className="filter-add-condition-button" onClick={handleAddCondition}>
                <Plus size={14} />
                添加条件
              </button>
              <button className="filter-clear-button" onClick={handleClearAll}>
                清除全部
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 可拖拽的列头组件
interface DraggableColumnHeaderProps {
  column: any;
  children: React.ReactNode;
  hasFilters: boolean;
  onFilterClick: (e: React.MouseEvent) => void;
  filterButtonRef?: (el: HTMLButtonElement | null) => void;
  onColumnResize?: (columnId: string, size: number) => void;
  showFilter?: boolean;  // 是否显示过滤按钮
  showDragHandle?: boolean;  // 是否显示拖拽手柄
}

const DraggableColumnHeader: React.FC<DraggableColumnHeaderProps> = ({
  column,
  children,
  hasFilters,
  onFilterClick,
  filterButtonRef,
  onColumnResize,
  showFilter = true,
  showDragHandle = true,
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
        {showDragHandle && (
          <button
            className="drag-handle"
            {...attributes}
            {...listeners}
            title="拖拽排序"
          >
            <GripVertical size={16} />
          </button>
        )}
        <div className="header-title" style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
        {showFilter && (
          <button
            ref={filterButtonRef}
            className={`filter-button ${hasFilters ? 'filter-active' : ''}`}
            onClick={onFilterClick}
            title="过滤"
            style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}
          >
            <Filter size={14} />
          </button>
        )}
        <div
          className="resize-handle"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const startX = e.pageX;
            const startWidth = column.getSize();
            const columnId = column.id;
            
            const handleMouseMove = (e: MouseEvent) => {
              e.preventDefault();
              const diff = e.pageX - startX;
              const newWidth = Math.max(50, startWidth + diff);
              if (onColumnResize) {
                onColumnResize(columnId, newWidth);
              }
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

// 可拖拽的列设置项组件
interface SortableColumnItemProps {
  column: any;
  columnVisibility: VisibilityState;
  columnOrder: string[];
  index: number;
  onToggleColumn: (columnId: string) => void;
  onMoveUp: (columnId: string) => void;
  onMoveDown: (columnId: string) => void;
  enableReorder?: boolean;  // 是否启用排序功能
}

const SortableColumnItem: React.FC<SortableColumnItemProps> = ({
  column,
  columnVisibility,
  columnOrder,
  index,
  onToggleColumn,
  onMoveUp,
  onMoveDown,
  enableReorder = false,
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

  const isFirst = index === 0;
  const isLast = index === columnOrder.length - 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`column-settings-item ${isDragging ? 'dragging' : ''}`}
    >
      {enableReorder && (
        <button
          className="column-drag-handle"
          {...attributes}
          {...listeners}
          title="拖拽排序"
        >
          <GripVertical size={16} />
        </button>
      )}
      <label className="column-checkbox">
        <input
          type="checkbox"
          checked={columnVisibility[column.id] !== false}
          onChange={() => onToggleColumn(column.id)}
        />
        <span>{column.columnDef.header as string}</span>
      </label>
      {enableReorder && (
        <div className="column-order-controls">
          <button
            className="column-move-button"
            onClick={() => onMoveUp(column.id)}
            disabled={isFirst}
            title="上移"
          >
            <ChevronUp size={16} />
          </button>
          <button
            className="column-move-button"
            onClick={() => onMoveDown(column.id)}
            disabled={isLast}
            title="下移"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// 列设置弹窗组件
interface ColumnVisibilityModalProps {
  columns: any[];
  columnVisibility: VisibilityState;
  columnOrder: string[];
  onToggleColumn: (columnId: string) => void;
  onColumnOrderChange: (newOrder: string[]) => void;
  onClose: () => void;
  enableReorder?: boolean;  // 是否启用排序功能，默认 false
}

const ColumnVisibilityModal: React.FC<ColumnVisibilityModalProps> = ({
  columns,
  columnVisibility,
  columnOrder,
  onToggleColumn,
  onColumnOrderChange,
  onClose,
  enableReorder = false,
}) => {
  // 根据 columnOrder 排序列
  const orderedColumns = useMemo(() => {
    const columnMap = new Map(columns.map((col) => [col.id, col]));
    return columnOrder
      .map((id) => columnMap.get(id))
      .filter(Boolean) as any[];
  }, [columns, columnOrder]);

  // 拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
      onColumnOrderChange(newOrder);
    }
  };

  // 上移列
  const handleMoveUp = (columnId: string) => {
    const index = columnOrder.indexOf(columnId);
    if (index > 0) {
      const newOrder = arrayMove(columnOrder, index, index - 1);
      onColumnOrderChange(newOrder);
    }
  };

  // 下移列
  const handleMoveDown = (columnId: string) => {
    const index = columnOrder.indexOf(columnId);
    if (index < columnOrder.length - 1) {
      const newOrder = arrayMove(columnOrder, index, index + 1);
      onColumnOrderChange(newOrder);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content column-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>列设置</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {enableReorder && (
            <div className="column-settings-hint">
              <p>拖拽左侧图标或使用上下箭头调整列顺序</p>
            </div>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
              {orderedColumns.map((column, index) => (
                <SortableColumnItem
                  key={column.id}
                  column={column}
                  columnVisibility={columnVisibility}
                  columnOrder={columnOrder}
                  index={index}
                  onToggleColumn={onToggleColumn}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  enableReorder={enableReorder}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

// 可编辑单元格组件
interface EditableCellProps {
  value: any;
  rowIndex: number;
  columnId: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (value: any) => void;
  onCancel: () => void;
  columnType?: 'text' | 'number' | 'email' | 'date';
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  rowIndex,
  columnId,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  columnType = 'text',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editValue, setEditValue] = useState<string>(String(value || ''));

  // 当进入编辑模式时，聚焦输入框
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // 当值变化时更新编辑值
  React.useEffect(() => {
    setEditValue(String(value || ''));
  }, [value]);

  const isSavingRef = useRef(false);

  const handleSave = () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    let finalValue: any = editValue;
    
    // 根据类型转换值
    if (columnType === 'number') {
      finalValue = editValue === '' ? null : Number(editValue);
      if (isNaN(finalValue)) {
        // 如果转换失败，恢复原值
        setEditValue(String(value || ''));
        isSavingRef.current = false;
        return;
      }
    }
    
    onSave(finalValue);
    setTimeout(() => {
      isSavingRef.current = false;
    }, 100);
  };

  const handleCancel = () => {
    setEditValue(String(value || ''));
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // 如果焦点移动到保存/取消按钮，不触发保存
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && (
      relatedTarget.classList.contains('editable-cell-save') ||
      relatedTarget.classList.contains('editable-cell-cancel')
    )) {
      return;
    }
    
    // 延迟执行，避免与按钮点击冲突
    setTimeout(() => {
      if (!isSavingRef.current) {
        handleSave();
      }
    }, 200);
  };

  if (isEditing) {
    return (
      <div className="editable-cell-wrapper">
        <AutoExpandInput
          value={editValue}
          onChange={setEditValue}
          type={columnType === 'number' ? 'number' : columnType === 'email' ? 'email' : columnType === 'date' ? 'date' : 'text'}
          minWidth={60}
          maxWidth={400}
          className="editable-cell-input"
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus={isEditing}
        />
        <div className="editable-cell-actions">
          <button
            className="editable-cell-save"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSave();
            }}
            onMouseDown={(e) => e.preventDefault()}
            title="保存 (Enter)"
          >
            <Check size={14} />
          </button>
          <button
            className="editable-cell-cancel"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCancel();
            }}
            onMouseDown={(e) => e.preventDefault()}
            title="取消 (Esc)"
          >
            <XIcon size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="editable-cell-display"
      onDoubleClick={onStartEdit}
      title="双击编辑"
    >
      {value !== null && value !== undefined ? String(value) : ''}
    </div>
  );
};

// 导出选项类型
export type ExportScope = 'current' | 'all' | 'filtered';

export interface ExportOptions {
  filename?: string;
  scope?: ExportScope;
  sheetName?: string;
}

// 分页配置接口
export interface PaginationConfig {
  pageIndex: number;      // 当前页码（从0开始）
  pageSize: number;       // 每页条数
  totalCount: number;     // 总条数
}

// 分页回调接口
export interface PaginationCallbacks {
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

// 分页组件 Props
interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

// 分页组件
const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalCount);

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // 显示的页码数量
    
    if (totalPages <= showPages + 2) {
      // 总页数较少，全部显示
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 总页数较多，显示省略号
      pages.push(0); // 第一页
      
      let start = Math.max(1, pageIndex - Math.floor(showPages / 2));
      let end = Math.min(totalPages - 2, pageIndex + Math.floor(showPages / 2));
      
      // 调整范围
      if (start <= 1) {
        end = Math.min(showPages, totalPages - 2);
        start = 1;
      }
      if (end >= totalPages - 2) {
        start = Math.max(1, totalPages - showPages - 1);
        end = totalPages - 2;
      }
      
      if (start > 1) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(totalPages - 1); // 最后一页
    }
    
    return pages;
  };

  if (totalCount === 0) {
    return (
      <div className="pagination-container">
        <span className="pagination-info">暂无数据</span>
      </div>
    );
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        显示 {startItem}-{endItem} 条，共 {totalCount} 条
      </div>
      
      <div className="pagination-controls">
        <div className="pagination-size-selector">
          <span>每页</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="pagination-size-select"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>条</span>
        </div>

        <div className="pagination-buttons">
          <button
            className="pagination-button"
            onClick={() => onPageChange(0)}
            disabled={pageIndex === 0}
            title="首页"
          >
            «
          </button>
          <button
            className="pagination-button"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            title="上一页"
          >
            ‹
          </button>
          
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                className={`pagination-button ${page === pageIndex ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page + 1}
              </button>
            ) : (
              <span key={index} className="pagination-ellipsis">
                {page}
              </span>
            )
          ))}
          
          <button
            className="pagination-button"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
            title="下一页"
          >
            ›
          </button>
          <button
            className="pagination-button"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
            title="末页"
          >
            »
          </button>
        </div>

        <div className="pagination-jumper">
          <span>跳至</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            className="pagination-jumper-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = parseInt((e.target as HTMLInputElement).value, 10);
                if (value >= 1 && value <= totalPages) {
                  onPageChange(value - 1);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
          <span>页</span>
        </div>
      </div>
    </div>
  );
};

// 数据变更类型
export type DataChangeType = 'edit' | 'paste';

// 单个变更项
export interface DataChangeItem<T> {
  rowIndex: number;       // 数据行索引
  columnId: string;       // 列ID
  oldValue: any;          // 旧值
  newValue: any;          // 新值
  rowData: T;             // 变更后的整行数据
}

// 数据变更信息
export interface DataChangeInfo<T> {
  type: DataChangeType;           // 变更类型
  changes: DataChangeItem<T>[];   // 变更的单元格列表
  affectedRows: T[];              // 受影响的行数据
  affectedRowIndices: number[];   // 受影响的行索引
}

// 选中单元格信息
export interface SelectedCellInfo {
  rowIndex: number;
  columnIndex: number;
  columnId: string;
}

// 选择范围信息
export interface SelectionRangeInfo {
  start: { rowIndex: number; columnIndex: number };
  end: { rowIndex: number; columnIndex: number };
  cells: SelectedCellInfo[];
}

// 主表格组件
export interface AdvancedTableProps<T extends Record<string, any>> {
  data: T[];
  columns: ColumnDef<T>[];
  onDataChange?: (data: T[], changeInfo?: DataChangeInfo<T>) => void;
  onFilterChange?: OnFilterChange<T>;
  onSelectionChange?: (selection: SelectionRangeInfo | null) => void;  // 选择变化回调
  enableFiltering?: boolean;
  enableEditing?: boolean;
  enablePaste?: boolean;  // 是否启用粘贴功能，默认 true
  enableZebraStripes?: boolean;
  enableCrossHighlight?: boolean;
  zebraStripeColor?: string;
  crossHighlightColor?: string;
  selectedBorderColor?: string;  // 选中单元格边框颜色，默认 #1890ff
  enableExport?: boolean;
  exportFilename?: string;
  enableColumnReorder?: boolean; // 是否启用列设置中的排序功能，默认 false
  // 分页相关
  enablePagination?: boolean;  // 是否启用分页，默认 false
  pagination?: PaginationConfig;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];  // 每页条数选项
  allData?: T[]; // 用于分页时导出全部数据
}

export function AdvancedTable<T extends Record<string, any>>({
  data,
  columns,
  onDataChange,
  onFilterChange,
  onSelectionChange,
  enableFiltering = true,
  enableEditing = true,
  enablePaste = true,
  enableZebraStripes = true,
  enableCrossHighlight = true,
  zebraStripeColor = '#fafafa',
  crossHighlightColor = '#e6f7ff',
  selectedBorderColor = '#1890ff',
  enableExport = true,
  exportFilename = '表格数据',
  enableColumnReorder = false,
  enablePagination = false,
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  allData,
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
    columnIndex: number;  // 列的显示索引（从0开始）
  } | null>(null);
  // 多选区域：起始和结束单元格
  const [selectionRange, setSelectionRange] = useState<{
    start: { rowIndex: number; columnIndex: number };
    end: { rowIndex: number; columnIndex: number };
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);  // 是否正在拖拽选择
  const [hoveredCell, setHoveredCell] = useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({});
  const [openFilterPanel, setOpenFilterPanel] = useState<{
    columnId: string;
    position: { top: number; left: number };
  } | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);
  const filterButtonRefs = useRef<Record<string, HTMLButtonElement>>({});

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

  // 应用过滤条件
  const applyFilter = useCallback((row: T, filters: FilterCondition[], columnId: string): boolean => {
    if (filters.length === 0) return true;

    // 过滤掉无效条件：对于需要值的操作符，值不能为空；对于空/非空操作符，不需要值
    const validFilters = filters.filter((condition) => {
      // 空/非空操作符始终有效
      if (condition.operator === 'isEmpty' || condition.operator === 'isNotEmpty') {
        return true;
      }
      // 其他操作符需要值
      const filterValue = condition.value;
      return filterValue !== null && filterValue !== undefined && String(filterValue).trim() !== '';
    });

    // 如果没有有效条件，不进行过滤
    if (validFilters.length === 0) return true;

    // 所有条件必须满足（AND逻辑）
    return validFilters.every((condition) => {
      const cellValue = (row as any)[columnId];
      const filterValue = condition.value;

      // 处理空/非空操作符
      if (condition.operator === 'isEmpty') {
        return cellValue === null || cellValue === undefined || cellValue === '' || String(cellValue).trim() === '';
      }
      if (condition.operator === 'isNotEmpty') {
        return cellValue !== null && cellValue !== undefined && cellValue !== '' && String(cellValue).trim() !== '';
      }

      // 处理数值类型
      const isNumeric = typeof cellValue === 'number' || !isNaN(Number(cellValue));
      const cellNum = isNumeric ? Number(cellValue) : null;
      const filterNum = isNumeric && filterValue !== '' && filterValue !== undefined ? Number(filterValue) : null;

      const cellStr = String(cellValue || '').toLowerCase();
      const filterStr = String(filterValue || '').toLowerCase();

      switch (condition.operator) {
        case 'equals':
          if (isNumeric && cellNum !== null && filterNum !== null) {
            return cellNum === filterNum;
          }
          return cellStr === filterStr;
        case 'notEquals':
          if (isNumeric && cellNum !== null && filterNum !== null) {
            return cellNum !== filterNum;
          }
          return cellStr !== filterStr;
        case 'greaterThan':
          if (isNumeric && cellNum !== null && filterNum !== null) {
            return cellNum > filterNum;
          }
          return cellStr > filterStr;
        case 'lessThan':
          if (isNumeric && cellNum !== null && filterNum !== null) {
            return cellNum < filterNum;
          }
          return cellStr < filterStr;
        case 'greaterThanOrEqual':
          if (isNumeric && cellNum !== null && filterNum !== null) {
            return cellNum >= filterNum;
          }
          return cellStr >= filterStr;
        case 'lessThanOrEqual':
          if (isNumeric && cellNum !== null && filterNum !== null) {
            return cellNum <= filterNum;
          }
          return cellStr <= filterStr;
        case 'contains':
          return cellStr.includes(filterStr);
        case 'notContains':
          return !cellStr.includes(filterStr);
        case 'startsWith':
          return cellStr.startsWith(filterStr);
        case 'endsWith':
          return cellStr.endsWith(filterStr);
        default:
          return true;
      }
    });
  }, []);

  // 过滤后的数据（仅用于显示）- 基于内部状态 tableData
  const filteredData = useMemo(() => {
    let result = [...tableData];

    // 应用每个列的过滤条件
    Object.keys(columnFilters).forEach((columnId) => {
      const filters = columnFilters[columnId];
      if (filters && filters.length > 0) {
        result = result.filter((row) => applyFilter(row, filters, columnId));
      }
    });

    return result;
  }, [tableData, columnFilters, applyFilter]);

  // 使用过滤后的数据进行渲染，但保持原始数据用于编辑
  const displayData = useMemo(() => {
    // 如果有过滤条件，使用过滤后的数据；否则使用内部状态数据
    const hasActiveFilters = Object.keys(columnFilters).some(
      (key) => columnFilters[key] && columnFilters[key].length > 0
    );
    return hasActiveFilters ? filteredData : tableData;
  }, [tableData, filteredData, columnFilters]);

  // 处理过滤条件变化
  const handleFiltersChange = useCallback(
    async (columnId: string, filters: FilterCondition[]) => {
      const newColumnFilters: ColumnFilters = { ...columnFilters };
      
      if (filters.length > 0) {
        newColumnFilters[columnId] = filters;
      } else {
        // 移除空数组的列
        delete newColumnFilters[columnId];
      }

      setColumnFilters(newColumnFilters);

      // 调用外部回调（可用于接口调用）
      if (onFilterChange) {
        await onFilterChange(columnId, filters, newColumnFilters);
      }
    },
    [columnFilters, onFilterChange]
  );

  // 处理过滤器按钮点击
  const handleFilterButtonClick = useCallback((columnId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const button = filterButtonRefs.current[columnId];
    if (button) {
      const rect = button.getBoundingClientRect();
      setOpenFilterPanel({
        columnId,
        position: {
          top: rect.bottom + 4,
          left: rect.left,
        },
      });
    }
  }, []);

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

  // 表格实例（使用显示数据）
  const table = useReactTable({
    data: displayData,
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

  // 处理 Excel 粘贴（按照所见即所得的顺序：先横向后纵向填充）
  // startRowIndex: 显示行索引，startColumnIndex: 显示列索引（从0开始）
  const handlePaste = useCallback(
    (e: React.ClipboardEvent, startRowIndex: number, startColumnIndex: number) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text');
      
      if (!pastedData) return;

      // 解析粘贴的数据（支持制表符分隔的多行多列）
      // 处理 Windows (\r\n) 和 Mac (\n) 换行符
      const pastedRows = pastedData
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map((row) => row.split('\t').map((cell) => cell.trim()))
        .filter((row) => row.some((cell) => cell));

      if (pastedRows.length === 0) return;

      // 获取当前可见列顺序（从第一行的可见单元格获取）
      const rows = table.getRowModel().rows;
      if (rows.length === 0) return;
      
      const visibleCells = rows[0].getVisibleCells();
      const visibleColumnIds = visibleCells.map((cell) => cell.column.id);

      // 在回调外部预先计算：显示行索引 -> 原始数据行索引的映射
      const displayToDataIndexMap: Map<number, number> = new Map();
      displayData.forEach((displayRow, displayIndex) => {
        const dataIndex = tableData.findIndex((row) => row === displayRow);
        if (dataIndex !== -1) {
          displayToDataIndexMap.set(displayIndex, dataIndex);
        }
      });

      // 收集变更信息
      const changes: DataChangeItem<T>[] = [];
      const affectedRowIndices: Set<number> = new Set();

      // 按照显示顺序更新数据
      setTableData((prevData) => {
        const newData = [...prevData];
        
        // 遍历粘贴的每一行（纵向）
        pastedRows.forEach((pastedRow, rowOffset) => {
          // 计算目标行在 displayData 中的索引
          const targetDisplayRowIndex = startRowIndex + rowOffset;
          
          // 获取目标行在原始数据中的索引
          const targetDataIndex = displayToDataIndexMap.get(targetDisplayRowIndex);
          
          if (targetDataIndex !== undefined && targetDataIndex < newData.length) {
            // 更新现有行：按可见列顺序横向填充
            const oldRow = newData[targetDataIndex];
            const updatedRow = { ...oldRow };
            pastedRow.forEach((cellValue, colOffset) => {
              // 使用列索引直接定位目标列
              const targetColumnId = visibleColumnIds[startColumnIndex + colOffset];
              if (targetColumnId) {
                const oldValue = (oldRow as any)[targetColumnId];
                (updatedRow as any)[targetColumnId] = cellValue;
                // 记录变更
                changes.push({
                  rowIndex: targetDataIndex,
                  columnId: targetColumnId,
                  oldValue,
                  newValue: cellValue,
                  rowData: updatedRow,
                });
              }
            });
            newData[targetDataIndex] = updatedRow;
            affectedRowIndices.add(targetDataIndex);
          } else if (targetDisplayRowIndex >= displayData.length) {
            // 如果超出显示范围，在数据末尾创建新行
            const templateRow = newData[newData.length - 1];
            const newRow = templateRow ? { ...templateRow } : ({} as T);
            const newRowIndex = newData.length;
            pastedRow.forEach((cellValue, colOffset) => {
              const targetColumnId = visibleColumnIds[startColumnIndex + colOffset];
              if (targetColumnId) {
                (newRow as any)[targetColumnId] = cellValue;
                // 记录变更（新行的 oldValue 为 undefined）
                changes.push({
                  rowIndex: newRowIndex,
                  columnId: targetColumnId,
                  oldValue: undefined,
                  newValue: cellValue,
                  rowData: newRow,
                });
              }
            });
            newData.push(newRow);
            affectedRowIndices.add(newRowIndex);
          }
        });

        // 构建变更信息并回调
        if (onDataChange && changes.length > 0) {
          const affectedIndices = Array.from(affectedRowIndices).sort((a, b) => a - b);
          const changeInfo: DataChangeInfo<T> = {
            type: 'paste',
            changes,
            affectedRows: affectedIndices.map((idx) => newData[idx]),
            affectedRowIndices: affectedIndices,
          };
          onDataChange(newData, changeInfo);
        }
        
        return newData;
      });
    },
    [table, displayData, tableData, onDataChange]
  );

  // 检查单元格是否在选中范围内
  const isCellInSelectionRange = useCallback((rowIndex: number, columnIndex: number): boolean => {
    if (!selectionRange) return false;
    const { start, end } = selectionRange;
    const minRow = Math.min(start.rowIndex, end.rowIndex);
    const maxRow = Math.max(start.rowIndex, end.rowIndex);
    const minCol = Math.min(start.columnIndex, end.columnIndex);
    const maxCol = Math.max(start.columnIndex, end.columnIndex);
    return rowIndex >= minRow && rowIndex <= maxRow && columnIndex >= minCol && columnIndex <= maxCol;
  }, [selectionRange]);

  // 获取选中的单元格范围（包含列 ID）
  const getSelectedCells = useCallback((): SelectedCellInfo[] => {
    if (!selectionRange) return [];
    const { start, end } = selectionRange;
    const minRow = Math.min(start.rowIndex, end.rowIndex);
    const maxRow = Math.max(start.rowIndex, end.rowIndex);
    const minCol = Math.min(start.columnIndex, end.columnIndex);
    const maxCol = Math.max(start.columnIndex, end.columnIndex);
    
    const visibleCells = table.getRowModel().rows[0]?.getVisibleCells();
    const cells: SelectedCellInfo[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const columnId = visibleCells?.[c]?.column.id || '';
        cells.push({ rowIndex: r, columnIndex: c, columnId });
      }
    }
    return cells;
  }, [selectionRange, table]);

  // 处理单元格鼠标按下（开始选择）
  const handleCellMouseDown = (rowIndex: number, columnId: string, columnIndex: number, e: React.MouseEvent) => {
    // 忽略右键
    if (e.button !== 0) return;
    
    setSelectedCell({ rowIndex, columnId, columnIndex });
    setSelectionRange({
      start: { rowIndex, columnIndex },
      end: { rowIndex, columnIndex },
    });
    setIsSelecting(true);
  };

  // 处理单元格鼠标移动（扩展选择）
  const handleCellMouseEnter = (rowIndex: number, columnIndex: number) => {
    if (isSelecting && selectionRange) {
      setSelectionRange({
        ...selectionRange,
        end: { rowIndex, columnIndex },
      });
    }
    if (enableCrossHighlight) {
      const visibleCells = table.getRowModel().rows[0]?.getVisibleCells();
      const columnId = visibleCells?.[columnIndex]?.column.id || '';
      setHoveredCell({ rowIndex, columnId });
    }
  };

  // 处理鼠标抬起（结束选择）
  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false);
      // 触发选择变化回调
      if (onSelectionChange && selectionRange) {
        const cells = getSelectedCells();
        onSelectionChange({
          start: selectionRange.start,
          end: selectionRange.end,
          cells,
        });
      }
    }
  }, [isSelecting, onSelectionChange, selectionRange, getSelectedCells]);

  // 全局鼠标抬起监听
  React.useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);


  // 开始编辑单元格
  const handleStartEdit = (rowIndex: number, columnId: string) => {
    if (enableEditing) {
      setEditingCell({ rowIndex, columnId });
    }
  };

  // 保存编辑
  const handleSaveEdit = (rowIndex: number, columnId: string, value: any) => {
    // 获取当前显示行对应的原始数据行
    const displayRow = displayData[rowIndex];
    if (!displayRow) return;

    // 在内部状态数据中找到对应的行索引
    const originalRowIndex = tableData.findIndex((row) => row === displayRow);
    if (originalRowIndex === -1) return;

    // 获取旧值
    const oldValue = (displayRow as any)[columnId];

    // 更新数据
    setTableData((prevData) => {
      const newData = [...prevData];
      const updatedRow = { ...newData[originalRowIndex] };
      (updatedRow as any)[columnId] = value;
      newData[originalRowIndex] = updatedRow;

      // 构建变更信息
      const changeInfo: DataChangeInfo<T> = {
        type: 'edit',
        changes: [
          {
            rowIndex: originalRowIndex,
            columnId,
            oldValue,
            newValue: value,
            rowData: updatedRow,
          },
        ],
        affectedRows: [updatedRow],
        affectedRowIndices: [originalRowIndex],
      };

      // 回调通知
      if (onDataChange) {
        onDataChange(newData, changeInfo);
      }

      return newData;
    });

    setEditingCell(null);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingCell(null);
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

  // 添加全局粘贴事件监听（按照所见即所得的顺序：先横向后纵向填充）
  React.useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (!enablePaste) return;  // 检查是否启用粘贴
      if (!selectedCell) return;
      
      const activeElement = document.activeElement;
      if (activeElement && tableRef.current?.contains(activeElement)) {
        const pastedData = e.clipboardData?.getData('text');
        if (!pastedData) return;

        e.preventDefault();

        // 解析粘贴的数据（支持制表符分隔的多行多列）
        // 处理 Windows (\r\n) 和 Mac (\n) 换行符
        const pastedRows = pastedData
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split('\n')
          .map((row) => row.split('\t').map((cell) => cell.trim()))
          .filter((row) => row.some((cell) => cell));

        if (pastedRows.length === 0) return;

        // 获取当前可见列顺序（从第一行的可见单元格获取）
        const rows = table.getRowModel().rows;
        if (rows.length === 0) return;
        
        const visibleCells = rows[0].getVisibleCells();
        const visibleColumnIds = visibleCells.map((cell) => cell.column.id);

        // 直接使用存储的列索引
        const startColumnIndex = selectedCell.columnIndex;
        const startRowIndex = selectedCell.rowIndex;

        // 预先计算：显示行索引 -> 原始数据行索引的映射
        const displayToDataIndexMap: Map<number, number> = new Map();
        displayData.forEach((displayRow, displayIndex) => {
          const dataIndex = tableData.findIndex((row) => row === displayRow);
          if (dataIndex !== -1) {
            displayToDataIndexMap.set(displayIndex, dataIndex);
          }
        });

        // 按照显示顺序更新数据
        setTableData((prevData) => {
          const newData = [...prevData];
          
          // 遍历粘贴的每一行（纵向）
          pastedRows.forEach((pastedRow, rowOffset) => {
            // 计算目标行在 displayData 中的索引
            const targetDisplayRowIndex = startRowIndex + rowOffset;
            
            // 获取目标行在原始数据中的索引
            const targetDataIndex = displayToDataIndexMap.get(targetDisplayRowIndex);
            
            if (targetDataIndex !== undefined && targetDataIndex < newData.length) {
              // 更新现有行：按可见列顺序横向填充
              const updatedRow = { ...newData[targetDataIndex] };
              pastedRow.forEach((cellValue, colOffset) => {
                // 使用列索引直接定位目标列
                const targetColumnId = visibleColumnIds[startColumnIndex + colOffset];
                if (targetColumnId) {
                  (updatedRow as any)[targetColumnId] = cellValue;
                }
              });
              newData[targetDataIndex] = updatedRow;
            } else if (targetDisplayRowIndex >= displayData.length) {
              // 如果超出显示范围，在数据末尾创建新行
              const templateRow = newData[newData.length - 1];
              const newRow = templateRow ? { ...templateRow } : ({} as T);
              pastedRow.forEach((cellValue, colOffset) => {
                const targetColumnId = visibleColumnIds[startColumnIndex + colOffset];
                if (targetColumnId) {
                  (newRow as any)[targetColumnId] = cellValue;
                }
              });
              newData.push(newRow);
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
  }, [selectedCell, table, displayData, tableData, enablePaste]);

  // 切换列显示/隐藏
  const toggleColumn = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: prev[columnId] === false,
    }));
  };

  // 处理列大小调整
  const handleColumnResize = useCallback((columnId: string, size: number) => {
    setColumnSizing((prev) => ({
      ...prev,
      [columnId]: size,
    }));
  }, []);

  // 获取可见列（按顺序）
  const getVisibleColumns = useCallback(() => {
    return columnOrder
      .filter((id) => columnVisibility[id] !== false)
      .map((id) => {
        const col = columns.find((c) => c.id === id);
        return col ? {
          id,
          header: typeof col.header === 'string' ? col.header : id,
          accessorKey: (col as any).accessorKey || id,
        } : null;
      })
      .filter(Boolean) as { id: string; header: string; accessorKey: string }[];
  }, [columnOrder, columnVisibility, columns]);

  // 导出 Excel
  const handleExport = useCallback(async (scope: ExportScope = 'filtered') => {
    const visibleColumns = getVisibleColumns();
    
    // 根据导出范围选择数据
    let exportData: T[];
    switch (scope) {
      case 'current':
        // 当前页数据（如果有分页）
        exportData = displayData;
        break;
      case 'all':
        // 全部原始数据（忽略过滤和分页）
        exportData = allData || data;
        break;
      case 'filtered':
      default:
        // 过滤后的数据（所见即所得，但包含所有过滤后的数据）
        exportData = displayData;
        break;
    }

    // 创建工作簿
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'AdvancedTable';
    workbook.created = new Date();
    
    // 创建工作表
    const worksheet = workbook.addWorksheet('数据', {
      views: [{ state: 'frozen', ySplit: 1 }], // 冻结首行
    });

    // 设置列定义
    worksheet.columns = visibleColumns.map((col) => {
      // 计算列宽
      const headerLength = col.header.length;
      const maxContentLength = Math.max(
        ...exportData.slice(0, 100).map((row) => {
          const value = String((row as any)[col.accessorKey] || '');
          return value.length;
        }),
        headerLength
      );
      const width = Math.min(Math.max(maxContentLength * 1.5 + 4, 12), 50);
      
      return {
        header: col.header,
        key: col.accessorKey,
        width,
      };
    });

    // 设置表头样式
    const headerRow = worksheet.getRow(1);
    headerRow.height = 28; // 表头行高
    headerRow.eachCell((cell) => {
      // 字体样式
      cell.font = {
        name: '微软雅黑',
        size: 12,
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      // 填充背景色
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1890FF' }, // 蓝色背景
      };
      // 对齐方式
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      // 边框
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      };
    });

    // 添加数据行
    exportData.forEach((rowData, rowIndex) => {
      const values = visibleColumns.map((col) => {
        const value = (rowData as any)[col.accessorKey];
        return value !== null && value !== undefined ? value : '';
      });
      const row = worksheet.addRow(values);
      
      // 设置数据行样式
      row.height = 24; // 数据行高
      row.eachCell((cell) => {
        // 字体样式
        cell.font = {
          name: '微软雅黑',
          size: 11,
          color: { argb: 'FF333333' },
        };
        // 对齐方式
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: false,
        };
        // 边框
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE8E8E8' } },
          left: { style: 'thin', color: { argb: 'FFE8E8E8' } },
          bottom: { style: 'thin', color: { argb: 'FFE8E8E8' } },
          right: { style: 'thin', color: { argb: 'FFE8E8E8' } },
        };
        // 斑马线背景色
        if (rowIndex % 2 === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF5F5F5' },
          };
        }
      });
    });

    // 生成文件名
    const timestamp = new Date().toISOString().slice(0, 10);
    const scopeText = scope === 'current' ? '_当前页' : scope === 'all' ? '_全部' : '';
    const filename = `${exportFilename}${scopeText}_${timestamp}.xlsx`;

    // 导出文件
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, filename);
  }, [getVisibleColumns, displayData, data, allData, exportFilename]);

  // 显示导出菜单
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportButtonRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭导出菜单
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportButtonRef.current && !exportButtonRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  return (
    <div className="advanced-table-container">
      <div className="table-toolbar">
        {enableExport && (
          <div className="export-dropdown" ref={exportButtonRef}>
            <button
              className="export-button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="导出 Excel"
            >
              <Download size={16} />
              <span>导出</span>
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <button
                  className="export-menu-item"
                  onClick={() => {
                    handleExport('filtered');
                    setShowExportMenu(false);
                  }}
                >
                  导出当前数据
                  <span className="export-menu-hint">（所见即所得）</span>
                </button>
                {pagination && allData && (
                  <>
                    <button
                      className="export-menu-item"
                      onClick={() => {
                        handleExport('current');
                        setShowExportMenu(false);
                      }}
                    >
                      仅导出当前页
                      <span className="export-menu-hint">（第 {pagination.pageIndex + 1} 页）</span>
                    </button>
                    <button
                      className="export-menu-item"
                      onClick={() => {
                        handleExport('all');
                        setShowExportMenu(false);
                      }}
                    >
                      导出全部数据
                      <span className="export-menu-hint">（共 {allData.length} 条）</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
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
                    {headerGroup.headers.map((header) => {
                      const columnId = header.column.id;
                      const hasFilters = columnFilters[columnId] && columnFilters[columnId].length > 0;
                      return (
                        <DraggableColumnHeader
                          key={header.id}
                          column={header.column}
                          hasFilters={hasFilters || false}
                          showFilter={enableFiltering}
                          showDragHandle={enableColumnReorder}
                          onFilterClick={(e) => {
                            if (enableFiltering) {
                              handleFilterButtonClick(columnId, e);
                            }
                          }}
                          filterButtonRef={(el) => {
                            if (el) {
                              filterButtonRefs.current[columnId] = el;
                            }
                          }}
                          onColumnResize={handleColumnResize}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </DraggableColumnHeader>
                      );
                    })}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => {
                const isRowHovered = enableCrossHighlight && hoveredCell?.rowIndex === rowIndex;
                const isZebraRow = enableZebraStripes && rowIndex % 2 === 1;
                
                return (
                  <tr
                    key={row.id}
                    className={`table-row ${isZebraRow ? 'zebra-row' : ''} ${isRowHovered ? 'row-highlighted' : ''}`}
                    style={{
                      ...(isZebraRow && !isRowHovered ? { backgroundColor: zebraStripeColor } : {}),
                      ...(isRowHovered ? { backgroundColor: crossHighlightColor } : {}),
                    }}
                  >
                    {row.getVisibleCells().map((cell, columnIndex) => {
                      const columnId = cell.column.id;
                      const isSelected =
                        selectedCell?.rowIndex === rowIndex &&
                        selectedCell?.columnId === columnId;
                      const isInRange = isCellInSelectionRange(rowIndex, columnIndex);
                      const isEditing =
                        editingCell?.rowIndex === rowIndex &&
                        editingCell?.columnId === columnId;
                      const isColumnHovered = enableCrossHighlight && hoveredCell?.columnId === columnId;
                      const isCellHovered = isRowHovered && isColumnHovered;
                      
                      // 获取单元格的原始值（用于编辑）
                      const cellValue = (row.original as any)[columnId];
                      
                      // 检测列类型（从列定义中获取，或根据值推断）
                      const columnDef = cell.column.columnDef;
                      const columnType = (columnDef.meta as any)?.type || 
                        (typeof cellValue === 'number' ? 'number' : 'text');

                      // 计算单元格背景色
                      let cellBgColor = 'white';
                      if (isZebraRow) cellBgColor = zebraStripeColor;
                      if (isRowHovered || isColumnHovered) cellBgColor = crossHighlightColor;
                      if (isCellHovered) cellBgColor = '#bae7ff'; // 交叉点更深的颜色
                      if (isInRange) cellBgColor = '#e6f7ff'; // 选中范围背景色

                      return (
                        <td
                          key={cell.id}
                          className={`table-cell ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''} ${isEditing ? 'editing' : ''} ${isColumnHovered ? 'column-highlighted' : ''} ${isCellHovered ? 'cross-highlighted' : ''}`}
                          style={{
                            width: cell.column.getSize(),
                            minWidth: cell.column.columnDef.minSize,
                            maxWidth: cell.column.columnDef.maxSize,
                            ...(enableCrossHighlight && (isRowHovered || isColumnHovered) ? { backgroundColor: cellBgColor } : {}),
                            ...(isInRange ? { backgroundColor: cellBgColor } : {}),
                            ...(isSelected ? { 
                              '--selected-border-color': selectedBorderColor,
                              boxShadow: `inset 0 0 0 2px ${selectedBorderColor}`,
                            } as React.CSSProperties : {}),
                          }}
                          onMouseDown={(e) => {
                            if (!isEditing) {
                              handleCellMouseDown(rowIndex, columnId, columnIndex, e);
                            }
                          }}
                          onMouseEnter={() => {
                            handleCellMouseEnter(rowIndex, columnIndex);
                          }}
                          onMouseLeave={() => {
                            if (enableCrossHighlight && !isSelecting) {
                              setHoveredCell(null);
                            }
                          }}
                          onPaste={(e) => {
                            if (enablePaste && !isEditing) {
                              // 传递列索引而不是列ID，确保所见即所得
                              handlePaste(e, rowIndex, columnIndex);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (!isEditing) {
                              handleCellKeyDown(e, rowIndex, columnId);
                            }
                          }}
                          tabIndex={0}
                        >
                          {/* 编辑条件：全局开启 + 列级别未禁用（editable 默认 true，显式设为 false 才禁用） */}
                          {enableEditing && columnDef.meta?.editable !== false ? (
                            <EditableCell
                              value={cellValue}
                              rowIndex={rowIndex}
                              columnId={columnId}
                              isEditing={isEditing}
                              onStartEdit={() => handleStartEdit(rowIndex, columnId)}
                              onSave={(value) => handleSaveEdit(rowIndex, columnId, value)}
                              onCancel={handleCancelEdit}
                              columnType={columnType}
                            />
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DndContext>

      {/* 分页组件 */}
      {enablePagination && pagination && onPageChange && onPageSizeChange && (
        <Pagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          totalCount={pagination.totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}

      {showColumnModal && (
        <ColumnVisibilityModal
          columns={table.getAllColumns()}
          columnVisibility={columnVisibility}
          columnOrder={columnOrder}
          onToggleColumn={toggleColumn}
          onColumnOrderChange={setColumnOrder}
          onClose={() => setShowColumnModal(false)}
          enableReorder={enableColumnReorder}
        />
      )}

      {openFilterPanel && enableFiltering && (
        <FilterPanel
          columnId={openFilterPanel.columnId}
          columnHeader={
            columns.find((col) => col.id === openFilterPanel.columnId)?.header as string ||
            openFilterPanel.columnId
          }
          filters={columnFilters[openFilterPanel.columnId] || []}
          onFiltersChange={(filters) =>
            handleFiltersChange(openFilterPanel.columnId, filters)
          }
          onClose={() => setOpenFilterPanel(null)}
          position={openFilterPanel.position}
        />
      )}
    </div>
  );
}

