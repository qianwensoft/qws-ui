import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as fabric from 'fabric';
import { Type, Image, Barcode, QrCode, Minus, Square, Table, ZoomIn, ZoomOut, Ruler as RulerIcon, Settings, X, Circle, Triangle, Pentagon, Star, Plus, Trash2 } from 'lucide-react';
import { DndContext, DragEndEvent, useDraggable, useDroppable, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { AdvancedTable, type ColumnDef } from './AdvancedTable';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import './PrintDesigner.css';

// 可拖动模态窗组件
interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
}

const DraggableModal: React.FC<DraggableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 600,
  height = 700,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // 初始化位置（居中）
  useEffect(() => {
    if (isOpen && position.x === 0 && position.y === 0) {
      setPosition({
        x: (window.innerWidth - width) / 2,
        y: Math.max(50, (window.innerHeight - height) / 2),
      });
    }
  }, [isOpen, width, height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.modal-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${width}px`,
          maxHeight: `${height}px`,
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        <div
          className="modal-header"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'grab',
            userSelect: 'none',
            background: '#fafafa',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
            {title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            style={{
              padding: '4px',
            }}
          >
            <X size={20} />
          </Button>
        </div>
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// 纸张尺寸定义（单位：mm）
export const PAPER_SIZES = {
  A4: { width: 210, height: 297, label: 'A4 (210×297mm)' },
  A5: { width: 148, height: 210, label: 'A5 (148×210mm)' },
  B5: { width: 176, height: 250, label: 'B5 (176×250mm)' },
  LETTER: { width: 215.9, height: 279.4, label: 'Letter (8.5×11")' },
  CUSTOM: { width: 210, height: 297, label: '自定义' },
} as const;

export type PaperSizeKey = keyof typeof PAPER_SIZES;

// 纸张配置
export interface PaperConfig {
  size: PaperSizeKey;
  width?: number;  // 自定义宽度（mm）
  height?: number; // 自定义高度（mm）
  orientation: 'portrait' | 'landscape';  // 纵向/横向
  headerHeight?: number;  // 页眉高度（mm）
  footerHeight?: number;  // 页脚高度（mm）
}

// 表格列配置
export interface TableColumn {
  field: string;        // 字段名，如 'productName'
  title: string;        // 列标题，如 '商品名称'
  width?: number;       // 列宽（mm），不设置则平均分配
  align?: 'left' | 'center' | 'right';  // 对齐方式
  formatter?: string;   // 格式化表达式，如 '{{value}}*100+"元"'
}

// 表格配置
export interface TableConfig {
  dataSource: string;   // 数据源字段名，如 'products' 对应 data.products 数组
  columns: TableColumn[];  // 列配置
  rowHeight: number;    // 行高（mm）
  headerHeight: number; // 表头高度（mm）
  showHeader: boolean;  // 是否显示表头
  headerRepeat: boolean; // 表头是否在每页重复
  borderWidth: number;  // 边框宽度
  borderColor: string;  // 边框颜色
  headerBgColor?: string;  // 表头背景色
  headerTextColor?: string; // 表头文字颜色
  evenRowBgColor?: string;  // 偶数行背景色
  oddRowBgColor?: string;   // 奇数行背景色
}

// 数据绑定元素
export interface DataBindingElement {
  id: string;
  type: 'text' | 'image' | 'barcode' | 'qrcode' | 'line' | 'rect' | 'table' | 'circle' | 'ellipse' | 'triangle' | 'polygon' | 'star';
  left: number;
  top: number;
  width?: number;
  height?: number;
  // 数据绑定
  binding?: string;  // 例如：{{productName}} 或 {{productQty}}*100+"元"
  // 样式
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  fontWeight?: string | number;
  textAlign?: string;
  // 线条样式
  stroke?: string;
  strokeWidth?: number;
  strokeDashArray?: number[];  // 虚线样式，例如 [5, 5] 表示 5px 实线 + 5px 间隔
  // 特殊形状属性
  radius?: number;  // 圆形半径
  rx?: number;      // 椭圆 x 轴半径
  ry?: number;      // 椭圆 y 轴半径
  points?: number;  // 星形/多边形的点数
  // 特殊标记
  isHeader?: boolean;  // 是否为页眉
  isFooter?: boolean;  // 是否为页脚
  printVisible?: boolean;  // 打印时是否显示（默认 true，对于辅助线可设为 false）
  // 表格循环配置
  isLoopTable?: boolean;  // 是否为循环表格
  tableConfig?: TableConfig;  // 表格配置
}

// 打印模板
export interface PrintTemplate {
  name: string;
  paper: PaperConfig;
  elements: DataBindingElement[];
}

// 打印组件 Props
export interface PrintDesignerProps {
  template?: PrintTemplate;
  data?: Record<string, any>;  // 数据源
  onTemplateChange?: (template: PrintTemplate) => void;
  readOnly?: boolean;  // 只读模式（不可编辑）
  showToolbar?: boolean;  // 是否显示工具栏
}

// 标尺组件
interface RulerProps {
  type: 'horizontal' | 'vertical';
  length: number;  // 长度（px）
  zoom: number;    // 缩放比例
}

const Ruler: React.FC<RulerProps> = ({ type, length, zoom }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸 - length 已经是缩放后的尺寸了
    if (type === 'horizontal') {
      canvas.width = length;
      canvas.height = 20;
    } else {
      canvas.width = 20;
      canvas.height = length;
    }

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制刻度
    ctx.strokeStyle = '#8c8c8c';
    ctx.fillStyle = '#595959';
    ctx.font = '10px Arial';

    // 基础步长（像素），不受缩放影响
    const baseStep = 10;  // 每10px一个小刻度（在原始尺寸下）
    const baseBigStep = 50;  // 每50px一个大刻度（在原始尺寸下）

    // 缩放后的步长
    const step = baseStep * zoom;
    const bigStep = baseBigStep * zoom;

    // 计算最大毫米数
    const maxMm = Math.round((length / zoom / 96) * 25.4);

    // 智能选择标签显示间隔，避免文字重叠
    // 估计每个标签需要约35px空间
    const labelWidth = 35;
    let labelInterval = baseBigStep;  // 默认每50px显示一个标签

    // 根据缩放级别动态调整标签间隔
    if (zoom < 0.5) {
      // 缩小很多时，增加间隔
      labelInterval = baseBigStep * 4;  // 每200px（相当于每200mm）
    } else if (zoom < 0.75) {
      labelInterval = baseBigStep * 2;  // 每100px
    } else if (zoom >= 1.5) {
      // 放大时，可以显示更密集的标签
      labelInterval = baseBigStep;  // 每50px
    } else {
      labelInterval = baseBigStep;  // 每50px
    }

    const labelStep = labelInterval * zoom;

    // 绘制所有小刻度
    for (let i = 0; i <= length; i += step) {
      const isBig = Math.abs(i % bigStep) < 0.1;  // 浮点数比较
      const lineLength = isBig ? 10 : 5;

      if (type === 'horizontal') {
        ctx.beginPath();
        ctx.moveTo(i, 20);
        ctx.lineTo(i, 20 - lineLength);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(20, i);
        ctx.lineTo(20 - lineLength, i);
        ctx.stroke();
      }
    }

    // 绘制标签（智能间隔，避免重叠）
    const positions = [];

    // 1. 始终显示起点 0mm
    positions.push(0);

    // 2. 添加中间的标签位置
    for (let i = labelStep; i < length - labelStep / 2; i += labelStep) {
      positions.push(i);
    }

    // 3. 始终显示终点
    if (length > labelStep / 2) {
      positions.push(length);
    }

    // 4. 检测并移除会与终点标签重叠的标签
    if (positions.length > 2) {
      const endPos = positions[positions.length - 1];
      const endMm = Math.round((endPos / zoom / 96) * 25.4);
      const endLabel = endMm + 'mm';
      const endLabelWidth = ctx.measureText(endLabel).width + 4; // 加上一些边距

      // 从倒数第二个开始往前检查
      for (let idx = positions.length - 2; idx >= 1; idx--) {
        const pos = positions[idx];
        const mm = Math.round((pos / zoom / 96) * 25.4);
        const label = mm + 'mm';
        const labelWidth = ctx.measureText(label).width + 4;

        // 检查是否与终点标签重叠
        const gap = endPos - pos;
        const minGap = endLabelWidth + labelWidth; // 需要的最小间距

        if (gap < minGap) {
          // 标记为需要移除
          positions[idx] = -1;
        } else {
          // 如果不重叠，后面的都不会重叠，停止检查
          break;
        }
      }

      // 移除标记为 -1 的位置
      const filteredPositions = positions.filter(p => p >= 0);
      positions.length = 0;
      positions.push(...filteredPositions);
    }

    // 绘制标签
    positions.forEach((i) => {
      const mm = i === length ? maxMm : Math.round((i / zoom / 96) * 25.4);
      const label = mm + 'mm';

      if (type === 'horizontal') {
        // 终点标签右对齐
        if (i === length) {
          const textWidth = ctx.measureText(label).width;
          ctx.fillText(label, i - textWidth - 2, 10);
        } else {
          ctx.fillText(label, i + 2, 10);
        }
      } else {
        ctx.save();
        // 终点标签需要特殊处理，避免超出画布
        if (i === length) {
          // 测量文本宽度以确保不超出
          const textWidth = ctx.measureText(label).width;
          // 向上对齐，确保标签在画布内
          ctx.translate(10, i - textWidth - 2);
        } else {
          ctx.translate(10, i - 2);
        }
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      }
    });
  }, [type, length, zoom]);

  return (
    <canvas
      ref={canvasRef}
      className={`ruler ruler-${type}`}
      style={{
        display: 'block',
      }}
    />
  );
};

// 公式解析器：支持 {{field}} 和简单计算
const parseBinding = (binding: string, data: Record<string, any>): string => {
  try {
    // 替换所有 {{field}} 为实际值
    let result = binding.replace(/\{\{(\w+)\}\}/g, (match, fieldName) => {
      const value = data[fieldName];
      return value !== undefined ? String(value) : '';
    });

    // 如果包含运算符，尝试计算
    if (/[+\-*/]/.test(result)) {
      try {
        // 安全计算（仅允许数字和基本运算符）
        const sanitized = result.replace(/[^0-9+\-*/(). "元%]/g, '');
        // 提取字符串部分
        const stringParts: string[] = [];
        let temp = sanitized;
        temp = temp.replace(/"([^"]*)"/g, (match, str) => {
          stringParts.push(str);
          return `__STR${stringParts.length - 1}__`;
        });
        
        // 计算数值部分
        const numericPart = temp.replace(/__STR\d+__/g, '');
        if (numericPart.trim()) {
          const calculated = Function(`"use strict"; return (${numericPart})`)();
          result = String(calculated);
          // 添加回字符串部分
          stringParts.forEach((str, idx) => {
            if (temp.includes(`__STR${idx}__`)) {
              result += str;
            }
          });
        }
      } catch (e) {
        // 计算失败，返回替换后的结果
      }
    }

    return result;
  } catch (error) {
    console.error('绑定解析错误:', error);
    return binding;
  }
};

// 渲染循环表格（创建 Fabric.js 对象，仅渲染第一页）
const renderLoopTable = (
  element: DataBindingElement,
  data: Record<string, any>,
  mmToPx: (mm: number) => number,
  paperConfig?: { size: string; orientation: 'portrait' | 'landscape'; headerHeight?: number; footerHeight?: number },
  footerLineY?: number  // 实际页脚线位置（mm），如果没有传入则使用 paperConfig.footerHeight
): fabric.Group | null => {
  if (!element.isLoopTable || !element.tableConfig) {
    return null;
  }

  const config = element.tableConfig;
  const tableWidth = mmToPx(element.width || 180);
  const dataSource = data[config.dataSource] || [];

  if (!Array.isArray(dataSource)) {
    console.warn(`数据源 ${config.dataSource} 不是数组`);
    return null;
  }

  const elements: fabric.Object[] = [];
  const rowHeight = mmToPx(config.rowHeight);
  const headerHeight = mmToPx(config.headerHeight);
  const borderWidth = config.borderWidth;
  const borderColor = config.borderColor;

  // 获取纸张尺寸和页眉页脚高度
  const paperSizes: Record<string, { width: number; height: number }> = {
    A4: { width: 210, height: 297 },
    A5: { width: 148, height: 210 },
    B5: { width: 176, height: 250 },
  };

  const paperSize = paperSizes[paperConfig?.size || 'A4'] || paperSizes.A4;
  const pageHeight = mmToPx(paperConfig?.orientation === 'landscape' ? paperSize.width : paperSize.height);

  // 第一页底部边界（使用实际页脚线位置或默认值）
  const firstPageBottom = footerLineY !== undefined
    ? mmToPx(footerLineY)  // 使用实际页脚线位置
    : pageHeight - mmToPx(paperConfig?.footerHeight || 0);  // 使用默认值

  console.log('🎨 画布渲染表格（第一页预览）:', {
    footerLineY: footerLineY !== undefined ? footerLineY + 'mm' : '未指定',
    firstPageBottom: firstPageBottom + 'px',
    tableStartY: element.top + 'mm',
    totalRows: dataSource.length
  });

  // 表格起始位置
  const tableStartY = mmToPx(element.top);

  // 计算列宽
  const totalCustomWidth = config.columns.reduce((sum, col) => sum + (col.width || 0), 0);
  const autoWidthCount = config.columns.filter(col => !col.width).length;
  const autoWidth = autoWidthCount > 0
    ? (mmToPx(element.width || 180) - mmToPx(totalCustomWidth)) / autoWidthCount
    : 0;

  const columnWidths = config.columns.map(col => col.width ? mmToPx(col.width) : autoWidth);

  // 渲染表头的辅助函数
  const renderHeader = (currentY: number) => {
    const headerElements: fabric.Object[] = [];

    // 表头背景
    if (config.headerBgColor) {
      headerElements.push(new fabric.Rect({
        left: 0,
        top: currentY,
        width: tableWidth,
        height: headerHeight,
        fill: config.headerBgColor,
        stroke: 'transparent',
        strokeWidth: 0,
      }));
    }

    // 表头文本和边框
    let x = 0;
    config.columns.forEach((col, colIndex) => {
      const colWidth = columnWidths[colIndex];

      // 表头文本
      headerElements.push(new fabric.Text(col.title, {
        left: x + colWidth / 2,
        top: currentY + headerHeight / 2,
        fontSize: 12,
        fill: config.headerTextColor || '#000000',
        fontWeight: 'bold',
        originX: 'center',
        originY: 'center',
      }));

      // 垂直线
      headerElements.push(new fabric.Line(
        [x, currentY, x, currentY + headerHeight],
        { stroke: borderColor, strokeWidth: borderWidth }
      ));

      x += colWidth;
    });

    // 最后一条垂直线
    headerElements.push(new fabric.Line(
      [tableWidth, currentY, tableWidth, currentY + headerHeight],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    // 表头底部水平线
    headerElements.push(new fabric.Line(
      [0, currentY + headerHeight, tableWidth, currentY + headerHeight],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    // 表头顶部水平线
    headerElements.push(new fabric.Line(
      [0, currentY, tableWidth, currentY],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    return headerElements;
  };

  let currentY = 0;  // 相对于表格起始位置的Y坐标

  // 渲染表头
  if (config.showHeader) {
    elements.push(...renderHeader(currentY));
    currentY += headerHeight;
  }

  // 绘制数据行（只渲染能放入第一页的行）
  for (let rowIndex = 0; rowIndex < dataSource.length; rowIndex++) {
    const row = dataSource[rowIndex];

    // 检查是否会超出第一页
    const absoluteY = tableStartY + currentY;
    if (absoluteY + rowHeight > firstPageBottom) {
      // 超出第一页，停止渲染
      console.log(`表格在第 ${rowIndex} 行停止渲染（遇到页脚线）`);
      break;
    }

    // 斑马纹背景
    const bgColor = rowIndex % 2 === 0 ? config.evenRowBgColor : config.oddRowBgColor;
    if (bgColor) {
      elements.push(new fabric.Rect({
        left: 0,
        top: currentY,
        width: tableWidth,
        height: rowHeight,
        fill: bgColor,
        stroke: 'transparent',
        strokeWidth: 0,
      }));
    }

    let x = 0;
    config.columns.forEach((col, colIndex) => {
      const colWidth = columnWidths[colIndex];

      // 支持字段名或计算公式
      let cellValue = '';
      if (/[+\-*/]/.test(col.field)) {
        // 字段名包含运算符，作为公式处理
        try {
          // 将公式中的字段名替换为实际值
          const formula = col.field.replace(/([a-zA-Z_]\w*)/g, (match) => {
            const value = row[match];
            return value !== undefined ? String(value) : '0';
          });
          // 计算公式结果
          const result = Function(`"use strict"; return (${formula})`)();
          cellValue = String(result);
        } catch (e) {
          console.error('公式计算错误:', col.field, e);
          cellValue = '';
        }
      } else {
        // 简单字段名
        cellValue = row[col.field] !== undefined ? String(row[col.field]) : '';
      }

      // 如果有格式化表达式，应用格式化
      if (col.formatter) {
        const formatterWithValue = col.formatter.replace(/\{\{value\}\}/g, cellValue);
        cellValue = parseBinding(formatterWithValue, row);
      }

      // 单元格文本
      const textAlign = col.align || 'left';
      let textLeft = x + 4; // 默认左对齐，加4px内边距
      let originX: 'left' | 'center' | 'right' = 'left';

      if (textAlign === 'center') {
        textLeft = x + colWidth / 2;
        originX = 'center';
      } else if (textAlign === 'right') {
        textLeft = x + colWidth - 4;
        originX = 'right';
      }

      elements.push(new fabric.Text(cellValue, {
        left: textLeft,
        top: currentY + rowHeight / 2,
        fontSize: 11,
        fill: '#000000',
        originX,
        originY: 'center',
      }));

      // 垂直线
      elements.push(new fabric.Line(
        [x, currentY, x, currentY + rowHeight],
        { stroke: borderColor, strokeWidth: borderWidth }
      ));

      x += colWidth;
    });

    // 最后一条垂直线
    elements.push(new fabric.Line(
      [tableWidth, currentY, tableWidth, currentY + rowHeight],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    // 行底部水平线
    elements.push(new fabric.Line(
      [0, currentY + rowHeight, tableWidth, currentY + rowHeight],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    currentY += rowHeight;
  }

  if (elements.length === 0) {
    return null;
  }

  return new fabric.Group(elements, {
    left: mmToPx(element.left),
    top: mmToPx(element.top),
    selectable: true,
  });
};

// 计算循环表格需要的页数和每页数据分配
const calculateTablePages = (
  element: DataBindingElement,
  data: Record<string, any>,
  mmToPx: (mm: number) => number,
  paperConfig: { size: string; orientation: 'portrait' | 'landscape'; headerHeight?: number; footerHeight?: number },
  footerLineY: number  // 实际页脚线位置（mm）
): { pageCount: number; rowsPerPage: number[] } => {
  if (!element.isLoopTable || !element.tableConfig) {
    return { pageCount: 1, rowsPerPage: [] };
  }

  const config = element.tableConfig;
  const dataSource = data[config.dataSource] || [];

  if (!Array.isArray(dataSource) || dataSource.length === 0) {
    return { pageCount: 1, rowsPerPage: [] };
  }

  const rowHeight = mmToPx(config.rowHeight);
  const headerHeight = mmToPx(config.headerHeight);

  // 获取纸张尺寸
  const paperSizes: Record<string, { width: number; height: number }> = {
    A4: { width: 210, height: 297 },
    A5: { width: 148, height: 210 },
    B5: { width: 176, height: 250 },
  };

  const paperSize = paperSizes[paperConfig.size] || paperSizes.A4;
  const pageHeight = mmToPx(paperConfig.orientation === 'landscape' ? paperSize.width : paperSize.height);
  const headerArea = mmToPx(paperConfig.headerHeight || 0);
  const footerArea = mmToPx(paperConfig.footerHeight || 0);

  const tableStartY = mmToPx(element.top);

  // 使用实际页脚线位置（mm转px）
  const firstPageBottom = mmToPx(footerLineY);

  console.log('📊 计算表格分页:', {
    tableStartY: element.top + 'mm',
    footerLineY: footerLineY + 'mm',
    firstPageBottom: firstPageBottom + 'px',
    rowHeight: config.rowHeight + 'mm',
    totalRows: dataSource.length
  });

  // 第一页可用高度（从表格起始位置到页脚线位置）
  let availableHeight = firstPageBottom - tableStartY;
  if (config.showHeader) {
    availableHeight -= headerHeight;
  }

  const firstPageRows = Math.max(0, Math.floor(availableHeight / rowHeight));
  let remainingRows = dataSource.length - firstPageRows;

  console.log(`  第一页可容纳 ${firstPageRows} 行，剩余 ${remainingRows} 行`);

  const rowsPerPage: number[] = [firstPageRows];
  let currentPage = 1;

  // 计算后续页面
  while (remainingRows > 0) {
    const pageContentHeight = pageHeight - headerArea - footerArea;
    let pageAvailableHeight = pageContentHeight;

    if (config.showHeader && config.headerRepeat) {
      pageAvailableHeight -= headerHeight;
    }

    const rowsThisPage = Math.floor(pageAvailableHeight / rowHeight);
    const actualRows = Math.min(rowsThisPage, remainingRows);
    rowsPerPage.push(actualRows);
    remainingRows -= actualRows;
    currentPage++;

    console.log(`  第 ${currentPage} 页可容纳 ${actualRows} 行，剩余 ${remainingRows} 行`);
  }

  console.log(`  总共需要 ${currentPage} 页，每页行数:`, rowsPerPage);

  return { pageCount: currentPage, rowsPerPage };
};

// 为指定页面渲染表格数据（支持多页）
const renderTableForPage = (
  element: DataBindingElement,
  data: Record<string, any>,
  mmToPx: (mm: number) => number,
  paperConfig: { size: string; orientation: 'portrait' | 'landscape'; headerHeight?: number; footerHeight?: number },
  pageIndex: number,
  rowsPerPage: number[]
): fabric.Object[] => {
  if (!element.isLoopTable || !element.tableConfig) {
    return [];
  }

  const config = element.tableConfig;
  const dataSource = data[config.dataSource] || [];

  if (!Array.isArray(dataSource)) {
    return [];
  }

  const elements: fabric.Object[] = [];
  const tableWidth = mmToPx(element.width || 180);
  const rowHeight = mmToPx(config.rowHeight);
  const headerHeight = mmToPx(config.headerHeight);
  const borderWidth = config.borderWidth;
  const borderColor = config.borderColor;

  // 获取纸张尺寸
  const paperSizes: Record<string, { width: number; height: number }> = {
    A4: { width: 210, height: 297 },
    A5: { width: 148, height: 210 },
    B5: { width: 176, height: 250 },
  };

  const paperSize = paperSizes[paperConfig.size] || paperSizes.A4;
  const headerArea = mmToPx(paperConfig.headerHeight || 0);

  // 计算列宽
  const totalCustomWidth = config.columns.reduce((sum, col) => sum + (col.width || 0), 0);
  const autoWidthCount = config.columns.filter(col => !col.width).length;
  const autoWidth = autoWidthCount > 0
    ? (mmToPx(element.width || 180) - mmToPx(totalCustomWidth)) / autoWidthCount
    : 0;

  const columnWidths = config.columns.map(col => col.width ? mmToPx(col.width) : autoWidth);

  // 渲染表头的辅助函数
  const renderHeader = (currentY: number) => {
    const headerElements: fabric.Object[] = [];

    if (config.headerBgColor) {
      headerElements.push(new fabric.Rect({
        left: 0,
        top: currentY,
        width: tableWidth,
        height: headerHeight,
        fill: config.headerBgColor,
        stroke: 'transparent',
        strokeWidth: 0,
      }));
    }

    let x = 0;
    config.columns.forEach((col, colIndex) => {
      const colWidth = columnWidths[colIndex];

      headerElements.push(new fabric.Text(col.title, {
        left: x + colWidth / 2,
        top: currentY + headerHeight / 2,
        fontSize: 12,
        fill: config.headerTextColor || '#000000',
        fontWeight: 'bold',
        originX: 'center',
        originY: 'center',
      }));

      headerElements.push(new fabric.Line(
        [x, currentY, x, currentY + headerHeight],
        { stroke: borderColor, strokeWidth: borderWidth }
      ));

      x += colWidth;
    });

    headerElements.push(new fabric.Line(
      [tableWidth, currentY, tableWidth, currentY + headerHeight],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    headerElements.push(new fabric.Line(
      [0, currentY + headerHeight, tableWidth, currentY + headerHeight],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    headerElements.push(new fabric.Line(
      [0, currentY, tableWidth, currentY],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    return headerElements;
  };

  // 确定本页起始位置
  let tableTop = pageIndex === 0 ? mmToPx(element.top) : headerArea;
  let currentY = 0;

  // 渲染表头
  if (config.showHeader && (pageIndex === 0 || config.headerRepeat)) {
    elements.push(...renderHeader(currentY));
    currentY += headerHeight;
  }

  // 计算本页要渲染的数据行范围
  let startRowIndex = 0;
  for (let i = 0; i < pageIndex; i++) {
    startRowIndex += rowsPerPage[i];
  }
  const endRowIndex = startRowIndex + rowsPerPage[pageIndex];

  // 绘制本页的数据行
  for (let rowIndex = startRowIndex; rowIndex < endRowIndex && rowIndex < dataSource.length; rowIndex++) {
    const row = dataSource[rowIndex];
    const displayRowIndex = rowIndex - startRowIndex;

    const bgColor = rowIndex % 2 === 0 ? config.evenRowBgColor : config.oddRowBgColor;
    if (bgColor) {
      elements.push(new fabric.Rect({
        left: 0,
        top: currentY,
        width: tableWidth,
        height: rowHeight,
        fill: bgColor,
        stroke: 'transparent',
        strokeWidth: 0,
      }));
    }

    let x = 0;
    config.columns.forEach((col, colIndex) => {
      const colWidth = columnWidths[colIndex];

      let cellValue = '';
      if (/[+\-*/]/.test(col.field)) {
        try {
          const formula = col.field.replace(/([a-zA-Z_]\w*)/g, (match) => {
            const value = row[match];
            return value !== undefined ? String(value) : '0';
          });
          const result = Function(`"use strict"; return (${formula})`)();
          cellValue = String(result);
        } catch (e) {
          console.error('公式计算错误:', col.field, e);
          cellValue = '';
        }
      } else {
        cellValue = row[col.field] !== undefined ? String(row[col.field]) : '';
      }

      if (col.formatter) {
        const formatterWithValue = col.formatter.replace(/\{\{value\}\}/g, cellValue);
        cellValue = parseBinding(formatterWithValue, row);
      }

      const textAlign = col.align || 'left';
      let textLeft = x + 4;
      let originX: 'left' | 'center' | 'right' = 'left';

      if (textAlign === 'center') {
        textLeft = x + colWidth / 2;
        originX = 'center';
      } else if (textAlign === 'right') {
        textLeft = x + colWidth - 4;
        originX = 'right';
      }

      elements.push(new fabric.Text(cellValue, {
        left: textLeft,
        top: currentY + rowHeight / 2,
        fontSize: 11,
        fill: '#000000',
        originX,
        originY: 'center',
      }));

      elements.push(new fabric.Line(
        [x, currentY, x, currentY + rowHeight],
        { stroke: borderColor, strokeWidth: borderWidth }
      ));

      x += colWidth;
    });

    elements.push(new fabric.Line(
      [tableWidth, currentY, tableWidth, currentY + rowHeight],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    elements.push(new fabric.Line(
      [0, currentY + rowHeight, tableWidth, currentY + rowHeight],
      { stroke: borderColor, strokeWidth: borderWidth }
    ));

    currentY += rowHeight;
  }

  // 调整所有元素位置
  elements.forEach(el => {
    el.set({
      left: (el.left || 0) + mmToPx(element.left),
      top: (el.top || 0) + tableTop,
    });
  });

  return elements;
};

// 组件工具定义
interface ComponentTool {
  type: DataBindingElement['type'];
  label: string;
  icon: React.ReactNode;
  defaultProps: Partial<DataBindingElement>;
}

// 可拖拽的组件项
const DraggableComponentItem: React.FC<{ tool: ComponentTool; isDragging?: boolean }> = ({ tool, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tool.type,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="component-item"
      title={`拖拽添加${tool.label}`}
    >
      <div className="component-icon">{tool.icon}</div>
      <div className="component-label">{tool.label}</div>
    </div>
  );
};

// 可放置的画布区域
const DroppableCanvas: React.FC<{ children: React.ReactNode; zoom: number }> = ({ children, zoom }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`canvas-wrapper ${isOver ? 'drag-over' : ''}`}
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',  // 从左上角缩放，而不是中心
        display: 'inline-block',
      }}
    >
      {children}
    </div>
  );
};

// 属性面板组件
const PropertyPanel: React.FC<{
  element: DataBindingElement;
  data: Record<string, any>;
  onUpdate: (property: string, value: any) => void;
  onClose: () => void;
}> = ({ element, data, onUpdate, onClose }) => {
  const availableFields = Object.keys(data);

  return (
    <div className="property-panel">
      <div className="panel-header">
        <h3>属性设置</h3>
        <button className="panel-toggle" onClick={onClose} title="关闭">
          <X size={18} />
        </button>
      </div>
      <div className="property-content">
        <div className="property-section">
          <h4>位置和大小</h4>
          <div className="property-row">
            <label>X (mm)</label>
            <input
              type="number"
              value={Math.round(element.left * 10) / 10}
              onChange={(e) => onUpdate('left', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="property-row">
            <label>Y (mm)</label>
            <input
              type="number"
              value={Math.round(element.top * 10) / 10}
              onChange={(e) => onUpdate('top', parseFloat(e.target.value) || 0)}
            />
          </div>
          {element.width !== undefined && (
            <div className="property-row">
              <label>宽度 (mm)</label>
              <input
                type="number"
                value={Math.round(element.width * 10) / 10}
                onChange={(e) => onUpdate('width', parseFloat(e.target.value) || 0)}
              />
            </div>
          )}
          {element.height !== undefined && (
            <div className="property-row">
              <label>高度 (mm)</label>
              <input
                type="number"
                value={Math.round(element.height * 10) / 10}
                onChange={(e) => onUpdate('height', parseFloat(e.target.value) || 0)}
              />
            </div>
          )}
        </div>

        {(element.type === 'text' || element.type === 'barcode' || element.type === 'qrcode') && (
          <>
            <div className="property-section">
              <h4>数据绑定</h4>
              <div className="property-row">
                <label>绑定表达式</label>
                <textarea
                  value={element.binding || ''}
                  onChange={(e) => onUpdate('binding', e.target.value)}
                  placeholder="例如: {{productName}} 或 {{qty}}*100+&quot;元&quot;"
                  rows={3}
                />
              </div>
              {availableFields.length > 0 && (
                <div className="property-row">
                  <label>可用字段</label>
                  <div className="field-tags">
                    {availableFields.map((field) => (
                      <span
                        key={field}
                        className="field-tag"
                        onClick={() => {
                          const current = element.binding || '';
                          onUpdate('binding', current + (current ? '+' : '') + `{{${field}}}`);
                        }}
                        title="点击插入"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {element.type === 'text' && (
              <div className="property-section">
                <h4>文本样式</h4>
                <div className="property-row">
                  <label>字体大小</label>
                  <input
                    type="number"
                    value={element.fontSize || 14}
                    onChange={(e) => onUpdate('fontSize', parseInt(e.target.value) || 14)}
                  />
                </div>
                <div className="property-row">
                  <label>字体</label>
                  <select
                    value={element.fontFamily || 'Arial'}
                    onChange={(e) => onUpdate('fontFamily', e.target.value)}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="SimSun">宋体</option>
                    <option value="SimHei">黑体</option>
                  </select>
                </div>
                <div className="property-row">
                  <label>颜色</label>
                  <input
                    type="color"
                    value={element.fill || '#000000'}
                    onChange={(e) => onUpdate('fill', e.target.value)}
                  />
                </div>
                <div className="property-row">
                  <label>对齐</label>
                  <select
                    value={element.textAlign || 'left'}
                    onChange={(e) => onUpdate('textAlign', e.target.value)}
                  >
                    <option value="left">左对齐</option>
                    <option value="center">居中</option>
                    <option value="right">右对齐</option>
                  </select>
                </div>
                <div className="property-row">
                  <label>粗体</label>
                  <input
                    type="checkbox"
                    checked={element.fontWeight === 'bold' || element.fontWeight === 700}
                    onChange={(e) => onUpdate('fontWeight', e.target.checked ? 'bold' : 'normal')}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {(element.type === 'line' || element.type === 'rect') && (
          <div className="property-section">
            <h4>线条样式</h4>
            <div className="property-row">
              <label>颜色</label>
              <input
                type="color"
                value={element.stroke || '#000000'}
                onChange={(e) => onUpdate('stroke', e.target.value)}
              />
            </div>
            <div className="property-row">
              <label>线宽</label>
              <input
                type="number"
                value={element.strokeWidth || 1}
                onChange={(e) => onUpdate('strokeWidth', parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            {(element.isHeader || element.isFooter) && (
              <div className="property-row">
                <label>打印时显示</label>
                <input
                  type="checkbox"
                  checked={element.printVisible !== false}
                  onChange={(e) => onUpdate('printVisible', e.target.checked)}
                />
              </div>
            )}
            {element.type === 'rect' && (
              <div className="property-row">
                <label>填充颜色</label>
                <input
                  type="color"
                  value={element.fill || '#ffffff'}
                  onChange={(e) => onUpdate('fill', e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 工具栏组件列表
const COMPONENT_TOOLS: ComponentTool[] = [
  {
    type: 'text',
    label: '文本',
    icon: <Type size={20} />,
    defaultProps: {
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#000000',
      binding: '双击编辑',
    },
  },
  {
    type: 'image',
    label: '图片',
    icon: <Image size={20} />,
    defaultProps: {
      width: 100,
      height: 100,
    },
  },
  {
    type: 'barcode',
    label: '条形码',
    icon: <Barcode size={20} />,
    defaultProps: {
      width: 150,
      height: 50,
      binding: '{{barcode}}',
    },
  },
  {
    type: 'qrcode',
    label: '二维码',
    icon: <QrCode size={20} />,
    defaultProps: {
      width: 80,
      height: 80,
      binding: '{{qrcode}}',
    },
  },
  {
    type: 'line',
    label: '横线',
    icon: <Minus size={20} />,
    defaultProps: {
      width: 150,
      height: 1,
      stroke: '#000000',
      strokeWidth: 1,
    },
  },
  {
    type: 'rect',
    label: '矩形',
    icon: <Square size={20} />,
    defaultProps: {
      width: 100,
      height: 60,
      stroke: '#000000',
      strokeWidth: 1,
      fill: 'transparent',
    },
  },
  {
    type: 'table',
    label: '循环表格',
    icon: <Table size={20} />,
    defaultProps: {
      width: 180,
      height: 120,
      stroke: '#000000',
      strokeWidth: 1,
      isLoopTable: true,
      tableConfig: {
        dataSource: 'items',  // 默认数据源字段名
        columns: [
          { field: 'name', title: '名称', align: 'left' },
          { field: 'qty', title: '数量', align: 'center' },
          { field: 'price', title: '单价', align: 'right' },
        ],
        rowHeight: 8,
        headerHeight: 10,
        showHeader: true,
        headerRepeat: true,  // 表头在每页重复
        borderWidth: 1,
        borderColor: '#000000',
        headerBgColor: '#f0f0f0',
        headerTextColor: '#000000',
      },
    },
  },
  {
    type: 'circle',
    label: '圆形',
    icon: <Circle size={20} />,
    defaultProps: {
      radius: 30,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1,
    },
  },
  {
    type: 'ellipse',
    label: '椭圆',
    icon: <Circle size={20} style={{ transform: 'scaleX(1.5)' }} />,
    defaultProps: {
      rx: 50,
      ry: 30,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1,
    },
  },
  {
    type: 'triangle',
    label: '三角形',
    icon: <Triangle size={20} />,
    defaultProps: {
      width: 60,
      height: 60,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1,
    },
  },
  {
    type: 'polygon',
    label: '多边形',
    icon: <Pentagon size={20} />,
    defaultProps: {
      radius: 30,
      points: 6,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1,
    },
  },
  {
    type: 'star',
    label: '星形',
    icon: <Star size={20} />,
    defaultProps: {
      radius: 30,
      points: 5,
      fill: 'transparent',
      stroke: '#000000',
      strokeWidth: 1,
    },
  },
];

export const PrintDesigner: React.FC<PrintDesignerProps> = ({
  template,
  data = {},
  onTemplateChange,
  readOnly = false,
  showToolbar = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<PrintTemplate>(
    template || {
      name: '打印模板',
      paper: { size: 'A4', orientation: 'portrait' },
      elements: [],
    }
  );
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);  // 属性面板
  const [leftPanelTab, setLeftPanelTab] = useState<'components' | 'properties' | 'data' | 'layers'>('components');  // 左侧面板标签页
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string } | null>(null);  // 右键菜单
  const [zoom, setZoom] = useState(1);  // 缩放比例
  const [showRuler, setShowRuler] = useState(true);  // 是否显示标尺
  const [showGuides, setShowGuides] = useState(true);  // 是否显示对齐线
  const [selectedElement, setSelectedElement] = useState<DataBindingElement | null>(null);  // 选中的元素
  const [activeId, setActiveId] = useState<string | null>(null);  // 拖拽中的组件ID
  const [draggedTool, setDraggedTool] = useState<ComponentTool | null>(null);  // 正在拖拽的工具
  const [printHeaderFooter, setPrintHeaderFooter] = useState(true);  // 打印时是否显示页眉页脚
  const isAddingElementRef = useRef(false);  // 标记是否正在添加元素，避免被 clear 清除
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);  // 画布容器 ref
  const [isTableConfigModalOpen, setIsTableConfigModalOpen] = useState(false);  // 表格配置模态窗状态

  // 同步外部传入的模版数据（用于初始化/重新加载模版）
  useEffect(() => {
    if (!template) return;

    setCurrentTemplate((prev) => {
      if (prev === template) return prev;

      return {
        ...template,
        paper: template.paper || prev.paper,
        elements: template.elements || [],
      };
    });
  }, [template]);

  // 拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 滚轮缩放功能
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container || readOnly) return;

    const handleWheel = (e: WheelEvent) => {
      // 检查是否按住 Ctrl/Cmd 键（标准的缩放手势）
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        // deltaY < 0 表示向上滚动（放大），> 0 表示向下滚动（缩小）
        const delta = -e.deltaY;
        const zoomDelta = delta > 0 ? 0.07 : -0.07;  // 减慢30%: 0.1 * 0.7 = 0.07

        setZoom(prev => {
          const newZoom = prev + zoomDelta;
          // 限制在 0.25 到 2 之间
          return Math.max(0.25, Math.min(2, newZoom));
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [readOnly]);

  // 画布平移/拖拽功能（空格键+拖拽 或 中键拖拽）
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    let isPanning = false;
    let isSpacePressed = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isPanning) {
        isSpacePressed = true;
        container.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressed = false;
        if (!isPanning) {
          container.style.cursor = 'default';
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // 空格键+左键 或 中键
      if ((isSpacePressed && e.button === 0) || e.button === 1) {
        e.preventDefault();
        isPanning = true;
        startX = e.clientX;
        startY = e.clientY;
        startScrollLeft = container.scrollLeft;
        startScrollTop = container.scrollTop;
        container.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      container.scrollLeft = startScrollLeft - deltaX;
      container.scrollTop = startScrollTop - deltaY;
    };

    const handleMouseUp = () => {
      if (isPanning) {
        isPanning = false;
        container.style.cursor = isSpacePressed ? 'grab' : 'default';
      }
    };

    const handleMouseLeave = () => {
      if (isPanning) {
        isPanning = false;
        container.style.cursor = isSpacePressed ? 'grab' : 'default';
      }
    };

    // 添加事件监听
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // 点击外部关闭右键菜单
  useEffect(() => {
    if (!contextMenu) return;

    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu]);

  // mm 转 px（假设 96 DPI）
  const mmToPx = useCallback((mm: number) => {
    return (mm / 25.4) * 96;
  }, []);

  // px 转 mm
  const pxToMm = useCallback((px: number) => {
    return (px / 96) * 25.4;
  }, []);

  // 获取纸张尺寸（px）
  const getPaperSize = useCallback(() => {
    const { size, width, height, orientation } = currentTemplate.paper;
    let paperWidth = size === 'CUSTOM' && width ? width : PAPER_SIZES[size].width;
    let paperHeight = size === 'CUSTOM' && height ? height : PAPER_SIZES[size].height;

    // 横向时交换宽高
    if (orientation === 'landscape') {
      [paperWidth, paperHeight] = [paperHeight, paperWidth];
    }

    return {
      width: mmToPx(paperWidth),
      height: mmToPx(paperHeight),  // 单页高度
    };
  }, [currentTemplate.paper, mmToPx]);

  // 初始化 fabric.js 画布
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    console.log('🎨 初始化 Fabric.js 画布...');
    const paperSize = getPaperSize();
    console.log('📄 纸张尺寸:', paperSize);

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: paperSize.width,
      height: paperSize.height,
      backgroundColor: '#ffffff',
      selection: !readOnly,
      renderOnAddRemove: true,       // 添加/删除对象时立即渲染
      enableRetinaScaling: true,     // 支持高清屏
      skipOffscreen: false,          // 不跳过屏幕外的对象
    });

    // 关键配置：禁用交互画布，强制所有内容渲染到主画布
    // 这样即使 upper-canvas 设置 opacity: 0，选中框也能显示
    if (canvas.contextTop) {
      // 重写交互层的渲染方法
      canvas.renderTop = function() {
        // 将交互层的内容渲染到主画布
        const ctx = this.contextContainer; // 主画布的 context
        const v = this.viewportTransform;

        ctx.save();
        ctx.setTransform(v[0], v[1], v[2], v[3], v[4], v[5]);

        // 绘制选中对象的控制框
        this._renderOverlay(ctx);

        ctx.restore();
        return this;
      };
    }

    // 强制所有内容（包括选中框）都渲染到 lower-canvas
    canvas.renderOnAddRemove = true;

    // 自定义选中边框样式 - 精致、优雅的控制点
    fabric.Object.prototype.set({
      borderColor: '#1890ff',           // 边框颜色为蓝色
      borderScaleFactor: 1,             // 边框粗细（1px）
      cornerColor: '#ffffff',           // 控制点颜色为白色
      cornerStyle: 'circle',            // 控制点样式为圆形
      cornerSize: 8,                    // 控制点大小（8px，小而醒目）
      transparentCorners: false,        // 控制点不透明
      borderOpacityWhenMoving: 0.8,     // 移动时边框透明度
      cornerStrokeColor: '#1890ff',     // 控制点边框颜色为蓝色
      borderDashArray: null,            // 实线边框
      padding: 0,                       // 控制点与对象边缘的间距
    });

    fabricCanvasRef.current = canvas;
    console.log('✅ Fabric画布初始化完成:', canvas);

    // 监听选中事件
    if (!readOnly) {
      canvas.on('selection:created', (e) => {
        const obj = e.selected?.[0] as any;
        if (obj?.customData) {
          setSelectedElement(obj.customData);
          setLeftPanelTab('properties');  // 自动切换到属性标签页
        }
        // 在主画布上绘制选中框
        canvas.renderAll();
        canvas.calcOffset();
      });

      canvas.on('selection:updated', (e) => {
        const obj = e.selected?.[0] as any;
        if (obj?.customData) {
          setSelectedElement(obj.customData);
          setLeftPanelTab('properties');  // 自动切换到属性标签页
        }
        // 在主画布上绘制选中框
        canvas.renderAll();
      });

      canvas.on('selection:cleared', () => {
        setSelectedElement(null);
        // 重新渲染主画布
        canvas.renderAll();
      });

      // 监听对象修改事件
      canvas.on('object:modified', () => {
        saveTemplate();
        canvas.renderAll();
      });

      // 监听对象移动、缩放、旋转事件，在主画布实时渲染
      canvas.on('object:moving', () => {
        canvas.requestRenderAll();
      });

      canvas.on('object:scaling', () => {
        canvas.requestRenderAll();
      });

      canvas.on('object:rotating', () => {
        canvas.requestRenderAll();
      });

      // 监听双击事件，打开表格配置
      canvas.on('mouse:dblclick', (e) => {
        const obj = e.target as any;
        if (obj?.customData?.type === 'table' && obj?.customData?.isLoopTable) {
          setSelectedElement(obj.customData);
          setLeftPanelTab('properties');
          setIsTableConfigModalOpen(true);
        }
      });

      // 监听右键菜单
      canvas.on('mouse:down', (e) => {
        if (e.button === 3 && e.target) {  // 右键点击
          e.e.preventDefault();
          const obj = e.target as any;
          if (obj?.customData) {
            // 显示删除确认
            if (window.confirm(`确定要删除这个${obj.customData.type === 'text' ? '文本' : obj.customData.type === 'table' ? '表格' : '元素'}吗？`)) {
              canvas.remove(obj);
              setSelectedElement(null);
              saveTemplate();
              canvas.renderAll();
            }
          }
        }
      });

      // 键盘删除功能
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === 'Delete' || e.key === 'Backspace') && !readOnly) {
          const activeObject = canvas.getActiveObject();
          if (activeObject && (activeObject as any).customData) {
            if (window.confirm('确定要删除选中的元素吗？')) {
              canvas.remove(activeObject);
              setSelectedElement(null);
              saveTemplate();
              canvas.renderAll();
            }
            e.preventDefault();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // 清理函数
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    // 启用对齐辅助线和吸附功能
    if (!readOnly && showGuides) {
      const SNAP_DISTANCE = 5; // 吸附距离（px）
      let verticalLine: fabric.Line | null = null;
      let horizontalLine: fabric.Line | null = null;

      // 对象移动时显示辅助线
      canvas.on('object:moving', (e) => {
        const obj = e.target;
        if (!obj) return;

        const objects = canvas.getObjects().filter(o => o !== obj);
        const objLeft = obj.left || 0;
        const objTop = obj.top || 0;
        const objWidth = (obj.width || 0) * (obj.scaleX || 1);
        const objHeight = (obj.height || 0) * (obj.scaleY || 1);
        const objCenterX = objLeft + objWidth / 2;
        const objCenterY = objTop + objHeight / 2;
        const objRight = objLeft + objWidth;
        const objBottom = objTop + objHeight;

        let snapX: number | null = null;
        let snapY: number | null = null;

        // 检查与画布边缘的对齐
        const canvasWidth = canvas.width || 0;
        const canvasHeight = canvas.height || 0;

        // 左边缘
        if (Math.abs(objLeft) < SNAP_DISTANCE) snapX = 0;
        // 右边缘
        if (Math.abs(objRight - canvasWidth) < SNAP_DISTANCE) snapX = canvasWidth - objWidth;
        // 水平居中
        if (Math.abs(objCenterX - canvasWidth / 2) < SNAP_DISTANCE) snapX = canvasWidth / 2 - objWidth / 2;

        // 上边缘
        if (Math.abs(objTop) < SNAP_DISTANCE) snapY = 0;
        // 下边缘
        if (Math.abs(objBottom - canvasHeight) < SNAP_DISTANCE) snapY = canvasHeight - objHeight;
        // 垂直居中
        if (Math.abs(objCenterY - canvasHeight / 2) < SNAP_DISTANCE) snapY = canvasHeight / 2 - objHeight / 2;

        // 检查与其他对象的对齐
        objects.forEach((other) => {
          const otherLeft = other.left || 0;
          const otherTop = other.top || 0;
          const otherWidth = (other.width || 0) * (other.scaleX || 1);
          const otherHeight = (other.height || 0) * (other.scaleY || 1);
          const otherCenterX = otherLeft + otherWidth / 2;
          const otherCenterY = otherTop + otherHeight / 2;
          const otherRight = otherLeft + otherWidth;
          const otherBottom = otherTop + otherHeight;

          // 左对齐
          if (Math.abs(objLeft - otherLeft) < SNAP_DISTANCE) snapX = otherLeft;
          // 右对齐
          if (Math.abs(objRight - otherRight) < SNAP_DISTANCE) snapX = otherRight - objWidth;
          // 中心对齐（水平）
          if (Math.abs(objCenterX - otherCenterX) < SNAP_DISTANCE) snapX = otherCenterX - objWidth / 2;

          // 上对齐
          if (Math.abs(objTop - otherTop) < SNAP_DISTANCE) snapY = otherTop;
          // 下对齐
          if (Math.abs(objBottom - otherBottom) < SNAP_DISTANCE) snapY = otherBottom - objHeight;
          // 中心对齐（垂直）
          if (Math.abs(objCenterY - otherCenterY) < SNAP_DISTANCE) snapY = otherCenterY - objHeight / 2;
        });

        // 应用吸附
        if (snapX !== null) obj.set({ left: snapX });
        if (snapY !== null) obj.set({ top: snapY });

        // 绘制辅助线
        if (snapX !== null || snapY !== null) {
          // 移除旧的辅助线
          if (verticalLine) canvas.remove(verticalLine);
          if (horizontalLine) canvas.remove(horizontalLine);

          if (snapX !== null) {
            verticalLine = new fabric.Line([snapX, 0, snapX, canvasHeight], {
              stroke: '#1890ff',
              strokeWidth: 1,
              strokeDashArray: [5, 5],
              selectable: false,
              evented: false,
            });
            canvas.add(verticalLine);
          }

          if (snapY !== null) {
            horizontalLine = new fabric.Line([0, snapY, canvasWidth, snapY], {
              stroke: '#1890ff',
              strokeWidth: 1,
              strokeDashArray: [5, 5],
              selectable: false,
              evented: false,
            });
            canvas.add(horizontalLine);
          }

          canvas.renderAll();
        }
      });

      // 对象移动结束时移除辅助线
      canvas.on('mouse:up', () => {
        if (verticalLine) {
          canvas.remove(verticalLine);
          verticalLine = null;
        }
        if (horizontalLine) {
          canvas.remove(horizontalLine);
          horizontalLine = null;
        }
        canvas.renderAll();
      });
    }

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [readOnly, getPaperSize, showGuides]);

  // 保存模板（避免循环依赖）
  const saveTemplate = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const elements: DataBindingElement[] = [];

    canvas.getObjects().forEach((obj: any) => {
      if (obj.customData) {
        // 保存完整的 customData，包括 tableConfig
        elements.push({
          ...obj.customData,  // 保留所有原始配置
          // 更新位置和尺寸
          left: pxToMm(obj.left || 0),
          top: pxToMm(obj.top || 0),
          width: obj.width ? pxToMm(obj.width * (obj.scaleX || 1)) : obj.customData.width,
          height: obj.height ? pxToMm(obj.height * (obj.scaleY || 1)) : obj.customData.height,
          // 更新样式属性（如果对象有这些属性）
          ...(obj.fontSize && { fontSize: obj.fontSize }),
          ...(obj.fontFamily && { fontFamily: obj.fontFamily }),
          ...(obj.fill && { fill: obj.fill }),
          ...(obj.fontWeight && { fontWeight: obj.fontWeight }),
          ...(obj.textAlign && { textAlign: obj.textAlign }),
        });
      }
    });

    // 使用 prevState 避免依赖 currentTemplate
    setCurrentTemplate((prev) => {
      const newTemplate: PrintTemplate = {
        ...prev,
        elements,
      };
      
      // 延迟回调，避免在渲染期间更新状态
      setTimeout(() => {
        onTemplateChange?.(newTemplate);
      }, 0);
      
      return newTemplate;
    });
  }, [onTemplateChange, pxToMm]);

  // 渲染模板元素
  useEffect(() => {
    if (!fabricCanvasRef.current) {
      console.log('⏭️  fabricCanvasRef为空，跳过模板渲染');
      return;
    }

    // 如果正在添加元素，跳过这次渲染，避免清空刚添加的对象
    if (isAddingElementRef.current) {
      console.log('⏭️  正在添加元素，跳过模板渲染');
      return;
    }

    console.log('🔄 渲染模板元素，元素数量:', currentTemplate.elements.length);
    const canvas = fabricCanvasRef.current;

    // 先清空画布
    canvas.clear();
    canvas.backgroundColor = '#ffffff';

    console.log('🧹 画布已清空，准备渲染', currentTemplate.elements.length, '个元素');

    // 查找页脚线位置（用于限制循环表格的渲染）
    const footerLineElements = currentTemplate.elements.filter(el => el.isFooter);
    const footerLineY = footerLineElements.length > 0
      ? Math.min(...footerLineElements.map(el => el.top))
      : undefined;

    console.log('🎨 画布渲染 - 页脚线位置:', footerLineY !== undefined ? footerLineY + 'mm' : '未找到');

    currentTemplate.elements.forEach((element) => {
      let displayValue = element.binding || '';

      // 解析数据绑定
      if (element.binding) {
        displayValue = parseBinding(element.binding, data);
      }

      let fabricObj: fabric.Object | null = null;

      switch (element.type) {
        case 'text':
          fabricObj = new fabric.Textbox(displayValue, {
            left: mmToPx(element.left),
            top: mmToPx(element.top),
            width: element.width ? mmToPx(element.width) : 200,
            fontSize: element.fontSize || 14,
            fontFamily: element.fontFamily || 'Arial',
            fill: element.fill || '#000000',
            fontWeight: (element.fontWeight as any) || 'normal',
            textAlign: element.textAlign || 'left',
            selectable: !readOnly,
            editable: !readOnly,
          });
          break;

        case 'line':
          fabricObj = new fabric.Line(
            [
              mmToPx(element.left),
              mmToPx(element.top),
              mmToPx(element.left) + mmToPx(element.width || 100),
              mmToPx(element.top),
            ],
            {
              stroke: element.stroke || '#000000',
              strokeWidth: element.strokeWidth || 1,
              strokeDashArray: element.strokeDashArray,  // 应用虚线样式（如果有）
              selectable: !readOnly,
            }
          );
          break;

        case 'rect':
          fabricObj = new fabric.Rect({
            left: mmToPx(element.left),
            top: mmToPx(element.top),
            width: mmToPx(element.width || 100),
            height: mmToPx(element.height || 60),
            fill: element.fill || 'transparent',
            stroke: element.stroke || '#000000',
            strokeWidth: element.strokeWidth || 1,
            selectable: !readOnly,
          });
          break;

        case 'barcode':
        case 'qrcode':
          // 暂时用文本占位
          fabricObj = new fabric.Textbox(`[${element.type}]\n${displayValue}`, {
            left: mmToPx(element.left),
            top: mmToPx(element.top),
            width: mmToPx(element.width || 100),
            height: mmToPx(element.height || 50),
            fontSize: 12,
            fill: '#8c8c8c',
            textAlign: 'center',
            selectable: !readOnly,
            editable: false,
          });
          break;

        case 'image':
          // 图片占位符（使用矩形）
          const imageRect = new fabric.Rect({
            left: 0,
            top: 0,
            width: mmToPx(element.width || 100),
            height: mmToPx(element.height || 100),
            fill: '#f0f0f0',
            stroke: '#d9d9d9',
            strokeWidth: 2,
            strokeDashArray: [5, 5],
          });
          // 添加图片图标文字
          const imageText = new fabric.Text('📷 图片', {
            left: mmToPx(element.width || 100) / 2,
            top: mmToPx(element.height || 100) / 2,
            fontSize: 16,
            fill: '#8c8c8c',
            originX: 'center',
            originY: 'center',
          });
          // 将矩形和文本组合
          fabricObj = new fabric.Group([imageRect, imageText], {
            left: mmToPx(element.left),
            top: mmToPx(element.top),
            selectable: !readOnly,
          });
          break;

        case 'table':
          // 循环表格渲染
          if (element.isLoopTable) {
            fabricObj = renderLoopTable(element, data, mmToPx, template.paper, footerLineY);
          } else {
            // 普通表格占位符（使用网格）
            const tableWidth = mmToPx(element.width || 180);
            const tableHeight = mmToPx(element.height || 120);
            const rows = 3;
            const cols = 3;
            const cellWidth = tableWidth / cols;
            const cellHeight = tableHeight / rows;

            const tableElements: fabric.Object[] = [];

            // 绘制表格线
            for (let i = 0; i <= rows; i++) {
              const y = i * cellHeight;
              tableElements.push(new fabric.Line(
                [0, y, tableWidth, y],
                { stroke: '#000000', strokeWidth: 1 }
              ));
            }
            for (let j = 0; j <= cols; j++) {
              const x = j * cellWidth;
              tableElements.push(new fabric.Line(
                [x, 0, x, tableHeight],
                { stroke: '#000000', strokeWidth: 1 }
              ));
            }

            // 添加表格标签
            tableElements.push(new fabric.Text('表格', {
              left: tableWidth / 2,
              top: tableHeight / 2,
              fontSize: 14,
              fill: '#8c8c8c',
              originX: 'center',
              originY: 'center',
            }));

            fabricObj = new fabric.Group(tableElements, {
              left: mmToPx(element.left),
              top: mmToPx(element.top),
              selectable: !readOnly,
            });
          }
          break;

        case 'circle':
          fabricObj = new fabric.Circle({
            left: mmToPx(element.left),
            top: mmToPx(element.top),
            radius: mmToPx(element.radius || 30),
            fill: element.fill || 'transparent',
            stroke: element.stroke || '#000000',
            strokeWidth: element.strokeWidth || 1,
            selectable: !readOnly,
          });
          break;

        case 'ellipse':
          fabricObj = new fabric.Ellipse({
            left: mmToPx(element.left),
            top: mmToPx(element.top),
            rx: mmToPx(element.rx || 50),
            ry: mmToPx(element.ry || 30),
            fill: element.fill || 'transparent',
            stroke: element.stroke || '#000000',
            strokeWidth: element.strokeWidth || 1,
            selectable: !readOnly,
          });
          break;

        case 'triangle':
          fabricObj = new fabric.Triangle({
            left: mmToPx(element.left),
            top: mmToPx(element.top),
            width: mmToPx(element.width || 60),
            height: mmToPx(element.height || 60),
            fill: element.fill || 'transparent',
            stroke: element.stroke || '#000000',
            strokeWidth: element.strokeWidth || 1,
            selectable: !readOnly,
          });
          break;

        case 'polygon':
          // 创建正多边形
          const polygonPoints = element.points || 6;
          const polygonRadius = mmToPx(element.radius || 30);
          const polygonVertices = [];
          for (let i = 0; i < polygonPoints; i++) {
            const angle = (i * 2 * Math.PI) / polygonPoints - Math.PI / 2;
            polygonVertices.push({
              x: polygonRadius * Math.cos(angle),
              y: polygonRadius * Math.sin(angle),
            });
          }
          fabricObj = new fabric.Polygon(polygonVertices, {
            left: mmToPx(element.left),
            top: mmToPx(element.top),
            fill: element.fill || 'transparent',
            stroke: element.stroke || '#000000',
            strokeWidth: element.strokeWidth || 1,
            selectable: !readOnly,
          });
          break;

        case 'star':
          // 创建星形
          const starPoints = element.points || 5;
          const starRadius = mmToPx(element.radius || 30);
          const innerRadius = starRadius * 0.5;
          const starVertices = [];
          for (let i = 0; i < starPoints * 2; i++) {
            const angle = (i * Math.PI) / starPoints - Math.PI / 2;
            const radius = i % 2 === 0 ? starRadius : innerRadius;
            starVertices.push({
              x: radius * Math.cos(angle),
              y: radius * Math.sin(angle),
            });
          }
          fabricObj = new fabric.Polygon(starVertices, {
            left: mmToPx(element.left),
            top: mmToPx(element.top),
            fill: element.fill || 'transparent',
            stroke: element.stroke || '#000000',
            strokeWidth: element.strokeWidth || 1,
            selectable: !readOnly,
          });
          break;
      }

      if (fabricObj) {
        (fabricObj as any).customData = element;
        canvas.add(fabricObj);
        console.log('✅ 已添加元素到画布:', element.type, element.id);
      } else {
        console.warn('⚠️ 无法创建Fabric对象，类型:', element.type);
      }
    });

    console.log('🎨 所有元素已添加，画布对象总数:', canvas.getObjects().length);
    canvas.renderAll();
  }, [currentTemplate.elements, data, mmToPx, readOnly]);

  // 当数据变化时，更新所有绑定元素的显示值
  useEffect(() => {
    if (!fabricCanvasRef.current || readOnly) return;

    const canvas = fabricCanvasRef.current;
    canvas.getObjects().forEach((obj: any) => {
      if (obj.customData && obj.customData.binding) {
        const displayValue = parseBinding(obj.customData.binding, data);
        if (obj.type === 'textbox' || obj.type === 'text') {
          obj.set('text', displayValue);
        }
      }
    });
    canvas.renderAll();
  }, [data, readOnly]);

  // 更新选中元素的属性
  const updateElementProperty = useCallback((property: string, value: any) => {
    if (!fabricCanvasRef.current || !selectedElement) return;

    const canvas = fabricCanvasRef.current;
    const activeObject = canvas.getActiveObject() as any;
    if (!activeObject || !activeObject.customData) return;

    // 更新 fabric 对象
    if (property === 'left' || property === 'top') {
      activeObject.set(property === 'left' ? 'left' : 'top', mmToPx(value));
    } else if (property === 'fontSize' || property === 'fontFamily' || property === 'fill' ||
        property === 'fontWeight' || property === 'textAlign') {
      activeObject.set(property, value);
    } else if (property === 'width' || property === 'height') {
      const currentSize = activeObject[property] * (activeObject[`scale${property === 'width' ? 'X' : 'Y'}`] || 1);
      const newSize = mmToPx(value);
      const scale = newSize / activeObject[property];
      activeObject.set(`scale${property === 'width' ? 'X' : 'Y'}`, scale);
    } else if (property === 'stroke' || property === 'strokeWidth') {
      activeObject.set(property, value);
    } else if (property === 'binding') {
      // 更新绑定，重新渲染文本
      if (activeObject.type === 'textbox' || activeObject.type === 'text') {
        const displayValue = parseBinding(value, data);
        activeObject.set('text', displayValue);
      }
    }

    // 更新 customData
    const updatedData = {
      ...activeObject.customData,
      [property]: value,
    };
    if (property === 'left' || property === 'top') {
      updatedData[property] = value;
    } else if (property === 'width' || property === 'height') {
      updatedData[property] = value;
    }
    activeObject.customData = updatedData;

    // 如果是表格配置更新，需要重新渲染整个表格
    if (property === 'tableConfig' && updatedData.type === 'table' && updatedData.isLoopTable) {
      // 移除旧的表格对象
      canvas.remove(activeObject);

      // 查找页脚线位置
      const footerLineElements = currentTemplate.elements.filter(el => el.isFooter);
      const footerLineY = footerLineElements.length > 0
        ? Math.min(...footerLineElements.map(el => el.top))
        : undefined;

      // 重新渲染表格
      const newTableObj = renderLoopTable(updatedData, data, mmToPx, template.paper, footerLineY);
      if (newTableObj) {
        newTableObj.customData = updatedData;
        canvas.add(newTableObj);
        canvas.setActiveObject(newTableObj);
      }
    }

    // 更新 selectedElement
    setSelectedElement(updatedData);
    canvas.renderAll();

    // 延迟保存模板，避免频繁触发
    // saveTemplate();
  }, [selectedElement, data, mmToPx, template.paper]);

  // 当纸张大小变化时调整画布
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const paperSize = getPaperSize();
    fabricCanvasRef.current.setDimensions(paperSize);
  }, [currentTemplate.paper, getPaperSize]);

  // 通用添加元素方法（支持拖拽位置）
  const addElement = (tool: ComponentTool, dropX?: number, dropY?: number) => {
    console.log('🔧 addElement 被调用:', { tool: tool.type, dropX, dropY });
    console.log('🔧 fabricCanvasRef.current 存在:', !!fabricCanvasRef.current);

    if (!fabricCanvasRef.current) {
      console.error('❌ fabricCanvasRef.current 为空，无法添加元素');
      return;
    }

    // 标记正在添加元素，防止 useEffect 清空画布
    isAddingElementRef.current = true;
    console.log('🔒 设置 isAddingElementRef = true');

    const canvas = fabricCanvasRef.current;
    console.log('🔧 Canvas 对象:', canvas);

    // 查找页脚线位置（从当前画布对象中查找）
    let footerLineY: number | undefined;
    canvas.getObjects().forEach((obj: any) => {
      if (obj.customData && obj.customData.isFooter) {
        const objTop = obj.customData.top;
        if (footerLineY === undefined || objTop < footerLineY) {
          footerLineY = objTop;
        }
      }
    });
    console.log('🎨 addElement - 页脚线位置:', footerLineY !== undefined ? footerLineY + 'mm' : '未找到');

    let left: number, top: number;

    if (dropX !== undefined && dropY !== undefined) {
      console.log('📍 添加元素 - 使用拖拽位置（像素坐标）:', { dropX, dropY });
      // dropX 和 dropY 已经是相对于画布的像素坐标，直接使用
      // 确保位置在画布范围内
      const clampedX = Math.max(0, Math.min(dropX, canvas.width!));
      const clampedY = Math.max(0, Math.min(dropY, canvas.height!));
      // 转换为 mm
      left = pxToMm(clampedX);
      top = pxToMm(clampedY);
      console.log('📍 位置计算结果:', {
        input: { x: dropX, y: dropY },
        clamped: { x: clampedX, y: clampedY },
        mm: { left, top },
      });
    } else {
      const centerX = pxToMm(canvas.width! / 2);
      const centerY = pxToMm(canvas.height! / 2);
      left = centerX - 50;
      top = centerY - 20;
      console.log('📍 添加元素 - 使用默认中心位置:', { left, top });
    }

    const newElement: DataBindingElement = {
      id: `${tool.type}_${Date.now()}`,
      type: tool.type,
      left,
      top,
      ...tool.defaultProps,
    };

    console.log('创建新元素:', newElement);

    let fabricObj: fabric.Object | null = null;

    // 解析数据绑定，获取显示值
    const getDisplayValue = (binding?: string) => {
      if (!binding) return '';
      return parseBinding(binding, data);
    };

    switch (tool.type) {
      case 'text':
        const textValue = getDisplayValue(newElement.binding) || '双击编辑';
        fabricObj = new fabric.Textbox(textValue, {
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          fontSize: newElement.fontSize || 14,
          fontFamily: newElement.fontFamily || 'Arial',
          fill: newElement.fill || '#000000',
          fontWeight: (newElement.fontWeight as any) || 'normal',
          textAlign: newElement.textAlign || 'left',
          width: newElement.width ? mmToPx(newElement.width) : 200,
          editable: true,
        });
        break;

      case 'line':
        fabricObj = new fabric.Line(
          [mmToPx(newElement.left), mmToPx(newElement.top), mmToPx(newElement.left) + mmToPx(newElement.width || 150), mmToPx(newElement.top)],
          {
            stroke: newElement.stroke || '#000000',
            strokeWidth: newElement.strokeWidth || 1,
            strokeDashArray: newElement.strokeDashArray,  // 应用虚线样式（如果有）
          }
        );
        break;

      case 'rect':
        fabricObj = new fabric.Rect({
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          width: mmToPx(newElement.width || 100),
          height: mmToPx(newElement.height || 60),
          fill: newElement.fill || 'transparent',
          stroke: newElement.stroke || '#000000',
          strokeWidth: newElement.strokeWidth || 1,
        });
        break;

      case 'barcode':
      case 'qrcode':
        // 暂时用文本占位
        const codeValue = getDisplayValue(newElement.binding);
        fabricObj = new fabric.Textbox(`[${tool.label}]\n${codeValue}`, {
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          width: mmToPx(newElement.width || 100),
          fontSize: 12,
          fill: '#8c8c8c',
          textAlign: 'center',
        });
        break;

      case 'image':
        // 图片占位符（使用矩形）
        fabricObj = new fabric.Rect({
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          width: mmToPx(newElement.width || 100),
          height: mmToPx(newElement.height || 100),
          fill: '#f0f0f0',
          stroke: '#d9d9d9',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
        });
        // 添加图片图标文字
        const imageText = new fabric.Text('📷 图片', {
          left: mmToPx(newElement.left) + mmToPx(newElement.width || 100) / 2,
          top: mmToPx(newElement.top) + mmToPx(newElement.height || 100) / 2,
          fontSize: 16,
          fill: '#8c8c8c',
          originX: 'center',
          originY: 'center',
        });
        // 将矩形和文本组合
        fabricObj = new fabric.Group([fabricObj, imageText], {
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
        });
        break;

      case 'table':
        // 循环表格渲染
        if (newElement.isLoopTable) {
          fabricObj = renderLoopTable(newElement, data, mmToPx, template.paper, footerLineY);
        } else {
          // 普通表格占位符（使用网格）
          const tableWidth = mmToPx(newElement.width || 180);
          const tableHeight = mmToPx(newElement.height || 120);
          const rows = 3;
          const cols = 3;
          const cellWidth = tableWidth / cols;
          const cellHeight = tableHeight / rows;

          const tableElements: fabric.Object[] = [];

          // 绘制表格线
          for (let i = 0; i <= rows; i++) {
            const y = i * cellHeight;
            tableElements.push(new fabric.Line(
              [0, y, tableWidth, y],
              { stroke: '#000000', strokeWidth: 1 }
            ));
          }
          for (let j = 0; j <= cols; j++) {
            const x = j * cellWidth;
            tableElements.push(new fabric.Line(
              [x, 0, x, tableHeight],
              { stroke: '#000000', strokeWidth: 1 }
            ));
          }

          // 添加表格标签
          tableElements.push(new fabric.Text('循环表格', {
            left: tableWidth / 2,
            top: tableHeight / 2,
            fontSize: 14,
            fill: '#8c8c8c',
            originX: 'center',
            originY: 'center',
          }));

          fabricObj = new fabric.Group(tableElements, {
            left: mmToPx(newElement.left),
            top: mmToPx(newElement.top),
          });
        }
        break;

      case 'circle':
        fabricObj = new fabric.Circle({
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          radius: mmToPx(newElement.radius || 30),
          fill: newElement.fill || 'transparent',
          stroke: newElement.stroke || '#000000',
          strokeWidth: newElement.strokeWidth || 1,
        });
        break;

      case 'ellipse':
        fabricObj = new fabric.Ellipse({
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          rx: mmToPx(newElement.rx || 50),
          ry: mmToPx(newElement.ry || 30),
          fill: newElement.fill || 'transparent',
          stroke: newElement.stroke || '#000000',
          strokeWidth: newElement.strokeWidth || 1,
        });
        break;

      case 'triangle':
        fabricObj = new fabric.Triangle({
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          width: mmToPx(newElement.width || 60),
          height: mmToPx(newElement.height || 60),
          fill: newElement.fill || 'transparent',
          stroke: newElement.stroke || '#000000',
          strokeWidth: newElement.strokeWidth || 1,
        });
        break;

      case 'polygon':
        // 创建正多边形
        const polygonPoints = newElement.points || 6;
        const polygonRadius = mmToPx(newElement.radius || 30);
        const polygonVertices = [];
        for (let i = 0; i < polygonPoints; i++) {
          const angle = (i * 2 * Math.PI) / polygonPoints - Math.PI / 2;
          polygonVertices.push({
            x: polygonRadius * Math.cos(angle),
            y: polygonRadius * Math.sin(angle),
          });
        }
        fabricObj = new fabric.Polygon(polygonVertices, {
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          fill: newElement.fill || 'transparent',
          stroke: newElement.stroke || '#000000',
          strokeWidth: newElement.strokeWidth || 1,
        });
        break;

      case 'star':
        // 创建星形
        const starPoints = newElement.points || 5;
        const starRadius = mmToPx(newElement.radius || 30);
        const innerRadius = starRadius * 0.5;
        const starVertices = [];
        for (let i = 0; i < starPoints * 2; i++) {
          const angle = (i * Math.PI) / starPoints - Math.PI / 2;
          const radius = i % 2 === 0 ? starRadius : innerRadius;
          starVertices.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
          });
        }
        fabricObj = new fabric.Polygon(starVertices, {
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          fill: newElement.fill || 'transparent',
          stroke: newElement.stroke || '#000000',
          strokeWidth: newElement.strokeWidth || 1,
        });
        break;
    }

    if (fabricObj) {
      console.log('✅ Fabric对象创建成功:', fabricObj);
      (fabricObj as any).customData = newElement;
      canvas.add(fabricObj);
      console.log('✅ 对象已添加到画布，当前对象数量:', canvas.getObjects().length);
      canvas.setActiveObject(fabricObj);
      console.log('✅ 对象已设置为激活状态');
      canvas.renderAll();
      console.log('✅ 画布已重新渲染');
      
      // 延迟保存和重置标志，确保渲染完成
      setTimeout(() => {
        console.log('💾 延迟保存模板');
        saveTemplate();

        // 如果是循环表格，自动添加页脚线（在 225mm 位置）
        if (tool.type === 'table' && newElement.isLoopTable) {
          const paperWidth = canvas.width!;
          const footerLineElement: DataBindingElement = {
            id: `footer_${Date.now()}`,
            type: 'line',
            left: pxToMm(10),
            top: 225,  // 默认在 225mm 位置
            width: pxToMm(paperWidth - 20),
            stroke: '#999999',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            isFooter: true,
            printVisible: false,  // 默认不打印（辅助线）
          };

          const footerLine = new fabric.Line(
            [10, mmToPx(225), paperWidth - 10, mmToPx(225)],
            {
              stroke: footerLineElement.stroke,
              strokeWidth: footerLineElement.strokeWidth,
              strokeDashArray: footerLineElement.strokeDashArray,
            }
          );

          (footerLine as any).customData = footerLineElement;
          canvas.add(footerLine);
          canvas.renderAll();
          console.log('✅ 自动添加页脚线到 225mm 位置');
          saveTemplate();
        }

        // 再延迟重置标志
        setTimeout(() => {
          isAddingElementRef.current = false;
          console.log('🔓 重置 isAddingElementRef = false');
        }, 50);
      }, 50);
    } else {
      console.error('❌ Fabric对象创建失败，类型:', tool.type);
      // 即使失败也要重置标志
      isAddingElementRef.current = false;
    }
  };

  // 处理拖拽开始
  const handleDragStart = (event: any) => {
    try {
      const { active } = event;
      const tool = COMPONENT_TOOLS.find(t => t.type === active.id);
      if (tool) {
        console.log('🎬 拖拽开始:', tool.label);
        setActiveId(active.id);
        setDraggedTool(tool);
      }
    } catch (error) {
      console.error('❌ 拖拽开始错误:', error);
    }
  };

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    try {
      const { active, over } = event;
      console.log('🎯 拖拽结束:', { activeId: active.id, overId: over?.id });

      setActiveId(null);
      setDraggedTool(null);

      if (over && over.id === 'canvas-drop-zone') {
        const tool = COMPONENT_TOOLS.find(t => t.type === active.id);
        if (tool && fabricCanvasRef.current) {
          // 从 @dnd-kit 的 active.rect 获取当前拖拽元素的位置
          const activeRect = (active as any).rect?.current?.translated;

          if (activeRect) {
            // 获取画布容器的边界（包含标尺）
            const canvasContainer = canvasContainerRef.current;
            const canvasElement = fabricCanvasRef.current.getElement();
            
            if (canvasContainer && canvasElement) {
              const canvasRect = canvasElement.getBoundingClientRect();

              // 计算拖拽元素中心点的屏幕坐标
              const dragCenterX = activeRect.left + activeRect.width / 2;
              const dragCenterY = activeRect.top + activeRect.height / 2;

              // 转换为相对于画布的坐标（考虑缩放）
              const relativeX = (dragCenterX - canvasRect.left) / zoom;
              const relativeY = (dragCenterY - canvasRect.top) / zoom;

              console.log('📍 拖拽位置计算:', {
                activeRect,
                canvasRect,
                dragCenter: { x: dragCenterX, y: dragCenterY },
                relative: { x: relativeX, y: relativeY },
                zoom,
                canvasSize: { width: fabricCanvasRef.current.width, height: fabricCanvasRef.current.height }
              });

              // 检查是否在画布范围内
              const canvas = fabricCanvasRef.current;
              if (relativeX >= 0 && relativeX <= canvas.width! &&
                  relativeY >= 0 && relativeY <= canvas.height!) {
                // 使用像素坐标添加元素（addElement会转换为mm）
                console.log('✅ 在画布范围内，添加元素到像素位置:', { x: relativeX, y: relativeY });
                addElement(tool, relativeX, relativeY);
              } else {
                // 如果超出范围，添加到画布中心
                console.log('⚠️ 超出画布范围，添加到中心');
                addElement(tool);
              }
            } else {
              console.log('⚠️ 无法获取画布元素，添加到中心');
              addElement(tool);
            }
          } else {
            // 如果无法获取位置信息，添加到画布中心
            console.log('⚠️ 无法获取位置信息，添加到中心');
            addElement(tool);
          }
        }
      }
    } catch (error) {
      console.error('❌ 拖拽结束错误:', error);
      setActiveId(null);
      setDraggedTool(null);
    }
  };

  // 添加页眉线
  const addHeaderLine = () => {
    if (!fabricCanvasRef.current) return;

    // 标记正在添加元素
    isAddingElementRef.current = true;

    const canvas = fabricCanvasRef.current;
    const paperWidth = canvas.width!;

    const newElement: DataBindingElement = {
      id: `header_${Date.now()}`,
      type: 'line',
      left: pxToMm(10),
      top: pxToMm(30),
      width: pxToMm(paperWidth - 20),
      stroke: '#999999',
      strokeWidth: 1,
      strokeDashArray: [5, 5],  // 虚线样式
      isHeader: true,
      printVisible: false,  // 默认不打印（辅助线）
    };

    const line = new fabric.Line(
      [10, 30, paperWidth - 10, 30],
      {
        stroke: newElement.stroke,
        strokeWidth: newElement.strokeWidth,
        strokeDashArray: newElement.strokeDashArray,  // 应用虚线样式
      }
    );

    (line as any).customData = newElement;
    canvas.add(line);
    canvas.renderAll();
    saveTemplate();

    // 延迟重置标志
    setTimeout(() => {
      isAddingElementRef.current = false;
    }, 100);
  };

  // 添加页脚线
  const addFooterLine = () => {
    if (!fabricCanvasRef.current) return;

    // 标记正在添加元素
    isAddingElementRef.current = true;

    const canvas = fabricCanvasRef.current;
    const paperWidth = canvas.width!;
    const paperHeight = canvas.height!;

    const newElement: DataBindingElement = {
      id: `footer_${Date.now()}`,
      type: 'line',
      left: pxToMm(10),
      top: pxToMm(paperHeight - 30),
      width: pxToMm(paperWidth - 20),
      stroke: '#999999',
      strokeWidth: 1,
      strokeDashArray: [5, 5],  // 虚线样式
      isFooter: true,
      printVisible: false,  // 默认不打印（辅助线）
    };

    const line = new fabric.Line(
      [10, paperHeight - 30, paperWidth - 10, paperHeight - 30],
      {
        stroke: newElement.stroke,
        strokeWidth: newElement.strokeWidth,
        strokeDashArray: newElement.strokeDashArray,  // 应用虚线样式
      }
    );

    (line as any).customData = newElement;
    canvas.add(line);
    canvas.renderAll();
    saveTemplate();

    // 延迟重置标志
    setTimeout(() => {
      isAddingElementRef.current = false;
    }, 100);
  };

  // 删除选中元素
  const deleteSelected = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
      saveTemplate();
    }
  };

  // 根据 ID 删除元素
  const deleteElementById = (elementId: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const targetObject = objects.find((obj: any) => obj.customData?.id === elementId);

    if (targetObject) {
      canvas.remove(targetObject);
      canvas.renderAll();
      saveTemplate();
      setSelectedElement(null);
    }
  };

  // 根据 ID 选中元素
  const selectElementById = (elementId: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const targetObject = objects.find((obj: any) => obj.customData?.id === elementId);

    if (targetObject) {
      canvas.discardActiveObject();
      canvas.setActiveObject(targetObject);
      canvas.renderAll();
      const customData = (targetObject as any).customData;
      if (customData) {
        setSelectedElement(customData);
        setLeftPanelTab('properties');
      }
    }
  };

  // 修改纸张配置
  const changePaperSize = (size: PaperSizeKey) => {
    setCurrentTemplate((prev) => ({
      ...prev,
      paper: { ...prev.paper, size },
    }));
  };

  // 切换纸张方向
  const toggleOrientation = () => {
    setCurrentTemplate((prev) => ({
      ...prev,
      paper: {
        ...prev.paper,
        orientation: prev.paper.orientation === 'portrait' ? 'landscape' : 'portrait',
      },
    }));
  };

  // 打印 - 支持多页输出
  const handlePrint = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const paperSize = getPaperSize();
    const paperWidthMm = pxToMm(paperSize.width);
    const paperHeightMm = pxToMm(paperSize.height);

    // 检测是否有循环表格
    const loopTables = currentTemplate.elements.filter(e => e.type === 'table' && e.isLoopTable);

    if (loopTables.length === 0) {
      // 没有循环表格，使用单页打印
      const svgString = canvas.toSVG({
        viewBox: {
          x: 0,
          y: 0,
          width: canvas.width!,
          height: canvas.height!,
        },
        encoding: 'UTF-8',
      });

      openPrintWindow([svgString], paperWidthMm, paperHeightMm);
      return;
    }

    // 找到页脚线的位置（查找标记为 isFooter 的元素）
    const footerLineElements = currentTemplate.elements.filter(el => el.isFooter);
    const footerLineY = footerLineElements.length > 0
      ? Math.min(...footerLineElements.map(el => el.top))  // 取最小的 top 值作为页脚线位置
      : paperHeightMm;  // 如果没有页脚线，使用纸张高度

    console.log('📏 页脚线位置信息:', {
      footerLineElements: footerLineElements.map(el => ({ id: el.id, top: el.top })),
      footerLineY,
      paperHeightMm
    });

    // 有循环表格，计算需要的页数（传入实际页脚线位置）
    const tableElement = loopTables[0]; // 假设只有一个循环表格
    const { pageCount, rowsPerPage } = calculateTablePages(tableElement, data, mmToPx, currentTemplate.paper, footerLineY);

    console.log(`📄 需要打印 ${pageCount} 页`, rowsPerPage);

    // 为每一页生成SVG
    const pageSVGs: string[] = [];

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
      console.log(`\n📄 渲染第 ${pageIndex + 1} 页，共 ${pageCount} 页`);
      // 创建临时canvas
      const tempCanvas = new fabric.Canvas(document.createElement('canvas'), {
        width: paperSize.width,
        height: paperSize.height,
        backgroundColor: '#ffffff',
      });

      // 渲染非表格元素（页眉、页脚、其他元素）
      currentTemplate.elements.forEach((element) => {
        // 跳过循环表格（单独处理）
        if (element.type === 'table' && element.isLoopTable) {
          return;
        }

        // 检查是否在打印时显示（对于辅助线，printVisible 可能为 false）
        if (element.printVisible === false) {
          console.log(`  元素 ${element.id} - 跳过（printVisible=false）`);
          return;
        }

        // 判断元素是否在页眉/页脚区域
        const headerHeight = currentTemplate.paper.headerHeight || 0;
        const footerHeight = currentTemplate.paper.footerHeight || 0;
        const isInHeader = element.isHeader || (element.top < headerHeight);
        const isInFooter = element.isFooter || (element.top > paperHeightMm - footerHeight);

        // 如果不打印页眉页脚，则跳过页眉页脚元素
        if (!printHeaderFooter && (isInHeader || isInFooter)) {
          return;
        }

        // 判断元素是否在页脚线下方（作为页脚在每一页显示）
        const isBelowFooterLine = !isInHeader && !isInFooter && element.top >= footerLineY;

        console.log(`  元素 ${element.id} (${element.type}):`, {
          top: element.top,
          isInHeader,
          isInFooter,
          isBelowFooterLine,
          footerLineY,
          pageIndex,
          pageCount,
          willRender: '判断中...'
        });

        // 页眉在所有页显示
        // 页脚线下方的元素在所有页显示（作为页脚）
        // 其他元素只在第一页显示
        if (!isInHeader && !isBelowFooterLine) {
          // 页脚线上方的普通元素只在第一页显示
          if (pageIndex > 0) {
            console.log(`    ❌ 跳过（页脚线上方元素只在第一页显示）`);
            return;
          }
        }

        console.log(`    ✅ 渲染该元素`);

        // 渲染元素
        let displayValue = element.binding || '';
        if (element.binding) {
          displayValue = parseBinding(element.binding, data);
        }

        let fabricObj: fabric.Object | null = null;

        switch (element.type) {
          case 'text':
            fabricObj = new fabric.Textbox(displayValue, {
              left: mmToPx(element.left),
              top: mmToPx(element.top),
              width: element.width ? mmToPx(element.width) : 200,
              fontSize: element.fontSize || 14,
              fontFamily: element.fontFamily || 'Arial',
              fill: element.fill || '#000000',
              fontWeight: (element.fontWeight as any) || 'normal',
              textAlign: element.textAlign || 'left',
              selectable: false,
            });
            break;

          case 'line':
            fabricObj = new fabric.Line(
              [
                mmToPx(element.left),
                mmToPx(element.top),
                mmToPx(element.left) + mmToPx(element.width || 100),
                mmToPx(element.top),
              ],
              {
                stroke: element.stroke || '#000000',
                strokeWidth: element.strokeWidth || 1,
                selectable: false,
              }
            );
            break;

          case 'rect':
            fabricObj = new fabric.Rect({
              left: mmToPx(element.left),
              top: mmToPx(element.top),
              width: mmToPx(element.width || 100),
              height: mmToPx(element.height || 60),
              fill: element.fill || 'transparent',
              stroke: element.stroke || '#000000',
              strokeWidth: element.strokeWidth || 1,
              selectable: false,
            });
            break;
        }

        if (fabricObj) {
          tempCanvas.add(fabricObj);
        }
      });

      // 渲染当前页的表格数据
      const tableObjects = renderTableForPage(
        tableElement,
        data,
        mmToPx,
        currentTemplate.paper,
        pageIndex,
        rowsPerPage
      );

      tableObjects.forEach(obj => {
        tempCanvas.add(obj);
      });

      // 生成SVG
      const svgString = tempCanvas.toSVG({
        viewBox: {
          x: 0,
          y: 0,
          width: paperSize.width,
          height: paperSize.height,
        },
        encoding: 'UTF-8',
      });

      pageSVGs.push(svgString);

      // 清理临时canvas
      tempCanvas.dispose();
    }

    // 打开打印窗口
    openPrintWindow(pageSVGs, paperWidthMm, paperHeightMm);
  };

  // 打开打印窗口的辅助函数
  const openPrintWindow = (pageSVGs: string[], paperWidthMm: number, paperHeightMm: number) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const pagesHTML = pageSVGs.map((svg, index) => `
      <div class="page" style="page-break-after: ${index < pageSVGs.length - 1 ? 'always' : 'auto'};">
        ${svg}
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>打印预览 - ${pageSVGs.length} 页</title>
          <style>
            @page {
              size: ${paperWidthMm}mm ${paperHeightMm}mm;
              margin: 0;
            }
            @media print {
              html, body {
                margin: 0;
                padding: 0;
              }
              .page {
                width: ${paperWidthMm}mm;
                height: ${paperHeightMm}mm;
                margin: 0;
                padding: 0;
                page-break-after: always;
              }
              .page:last-child {
                page-break-after: auto;
              }
              svg {
                width: 100%;
                height: 100%;
                display: block;
              }
              .no-print {
                display: none;
              }
            }
            @media screen {
              body {
                margin: 0;
                padding: 20px;
                background: #f0f0f0;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
              }
              .page {
                max-width: 100%;
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                background: white;
                padding: 0;
                margin-bottom: 20px;
              }
              svg {
                display: block;
                max-width: 100%;
                height: auto;
              }
              .print-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
                z-index: 1000;
              }
              button {
                padding: 10px 20px;
                background: #1890ff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
              }
              button:hover {
                background: #40a9ff;
              }
              .close-btn {
                background: #ff4d4f;
              }
              .close-btn:hover {
                background: #ff7875;
              }
              .quality-badge {
                position: fixed;
                top: 20px;
                left: 20px;
                padding: 8px 16px;
                background: #52c41a;
                color: white;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 1000;
              }
              .page-counter {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 8px 16px;
                background: #1890ff;
                color: white;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 1000;
              }
            }
          </style>
        </head>
        <body>
          <div class="quality-badge no-print">✓ 矢量图 · 无损打印</div>
          <div class="page-counter no-print">共 ${pageSVGs.length} 页</div>
          <div class="print-controls no-print">
            <button onclick="window.print()">🖨️ 打印</button>
            <button class="close-btn" onclick="window.close()">✕ 关闭</button>
          </div>
          ${pagesHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="print-designer-container">
      {showToolbar && !readOnly && (
        <div className="print-toolbar">
          <div className="toolbar-section">
            <label>纸张大小：</label>
            <Select value={currentTemplate.paper.size} onValueChange={(value) => changePaperSize(value as PaperSizeKey)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAPER_SIZES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="toolbar-section">
            <Button variant="outline" onClick={toggleOrientation}>
              {currentTemplate.paper.orientation === 'portrait' ? '纵向' : '横向'}
            </Button>
          </div>

          <div className="toolbar-section">
            <Button variant="outline" onClick={deleteSelected}>删除选中</Button>
            <Button variant="outline" onClick={saveTemplate}>保存模板</Button>
          </div>

          <div className="toolbar-section">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={printHeaderFooter}
                onChange={(e) => setPrintHeaderFooter(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>打印页眉页脚</span>
            </label>
          </div>

          <div className="toolbar-section">
            <Button onClick={handlePrint} className="print-button">
              打印预览
            </Button>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="print-content">
          {/* 左侧面板（带标签页） */}
          {!readOnly && showLeftPanel && (
            <div className="component-panel">
              <div className="panel-header">
                <div className="panel-tabs">
                  <Button
                    variant={leftPanelTab === 'components' ? "default" : "ghost"}
                    className={`tab-button ${leftPanelTab === 'components' ? 'active' : ''}`}
                    onClick={() => setLeftPanelTab('components')}
                  >
                    组件库
                  </Button>
                  <Button
                    variant={leftPanelTab === 'properties' ? "default" : "ghost"}
                    className={`tab-button ${leftPanelTab === 'properties' ? 'active' : ''}`}
                    onClick={() => setLeftPanelTab('properties')}
                    disabled={!selectedElement}
                  >
                    组件配置
                  </Button>
                  <Button
                    variant={leftPanelTab === 'data' ? "default" : "ghost"}
                    className={`tab-button ${leftPanelTab === 'data' ? 'active' : ''}`}
                    onClick={() => setLeftPanelTab('data')}
                  >
                    业务数据
                  </Button>
                  <Button
                    variant={leftPanelTab === 'layers' ? "default" : "ghost"}
                    className={`tab-button ${leftPanelTab === 'layers' ? 'active' : ''}`}
                    onClick={() => setLeftPanelTab('layers')}
                  >
                    组件列表
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="panel-toggle"
                  onClick={() => setShowLeftPanel(false)}
                  title="收起"
                >
                  «
                </Button>
              </div>

              {/* 组件库标签页 */}
              {leftPanelTab === 'components' && (
                <>
                  <div className="component-list">
                    <div className="component-category">
                      <h4>基础组件（拖拽到画布）</h4>
                      {COMPONENT_TOOLS.map((tool) => (
                        <DraggableComponentItem
                          key={tool.type}
                          tool={tool}
                          isDragging={activeId === tool.type}
                        />
                      ))}
                    </div>

                    <div className="component-category">
                      <h4>页面元素</h4>
                      <div
                        className="component-item"
                        onClick={addHeaderLine}
                        title="添加页眉线"
                      >
                        <div className="component-icon">
                          <Minus size={20} />
                        </div>
                        <div className="component-label">页眉线</div>
                      </div>
                      <div
                        className="component-item"
                        onClick={addFooterLine}
                        title="添加页脚线"
                      >
                        <div className="component-icon">
                          <Minus size={20} />
                        </div>
                        <div className="component-label">页脚线</div>
                      </div>
                    </div>
                  </div>

                  <div className="panel-footer">
                    <h4>数据绑定</h4>
                    <div className="binding-help-mini">
                      <p><code>{'{{field}}'}</code> - 字段值</p>
                      <p><code>{'{{qty}}*100+"元"'}</code> - 计算</p>
                      <p className="available-fields">
                        可用: {Object.keys(data).slice(0, 3).join(', ')}
                        {Object.keys(data).length > 3 && '...'}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* 组件配置标签页 */}
              {leftPanelTab === 'properties' && selectedElement && (
                <div className="property-content">
                  <div className="property-section">
                    <h4>位置和大小</h4>
                    <div className="property-row">
                      <label>X (mm)</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.left * 10) / 10}
                        onChange={(e) => updateElementProperty('left', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="property-row">
                      <label>Y (mm)</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.top * 10) / 10}
                        onChange={(e) => updateElementProperty('top', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    {selectedElement.width !== undefined && (
                      <div className="property-row">
                        <label>宽度 (mm)</label>
                        <input
                          type="number"
                          value={Math.round(selectedElement.width * 10) / 10}
                          onChange={(e) => updateElementProperty('width', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    )}
                    {selectedElement.height !== undefined && (
                      <div className="property-row">
                        <label>高度 (mm)</label>
                        <input
                          type="number"
                          value={Math.round(selectedElement.height * 10) / 10}
                          onChange={(e) => updateElementProperty('height', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    )}
                  </div>

                  {selectedElement.type === 'text' && (
                    <div className="property-section">
                      <h4>文本样式</h4>
                      <div className="property-row">
                        <label>字体大小</label>
                        <input
                          type="number"
                          value={selectedElement.fontSize || 14}
                          onChange={(e) => updateElementProperty('fontSize', parseInt(e.target.value) || 14)}
                        />
                      </div>
                      <div className="property-row">
                        <label>字体</label>
                        <select
                          value={selectedElement.fontFamily || 'Arial'}
                          onChange={(e) => updateElementProperty('fontFamily', e.target.value)}
                        >
                          <option value="Arial">Arial</option>
                          <option value="宋体">宋体</option>
                          <option value="微软雅黑">微软雅黑</option>
                          <option value="黑体">黑体</option>
                        </select>
                      </div>
                      <div className="property-row">
                        <label>颜色</label>
                        <input
                          type="color"
                          value={selectedElement.fill || '#000000'}
                          onChange={(e) => updateElementProperty('fill', e.target.value)}
                        />
                      </div>
                      <div className="property-row">
                        <label>粗细</label>
                        <select
                          value={selectedElement.fontWeight || 'normal'}
                          onChange={(e) => updateElementProperty('fontWeight', e.target.value)}
                        >
                          <option value="normal">正常</option>
                          <option value="bold">粗体</option>
                        </select>
                      </div>
                      <div className="property-row">
                        <label>对齐</label>
                        <select
                          value={selectedElement.textAlign || 'left'}
                          onChange={(e) => updateElementProperty('textAlign', e.target.value)}
                        >
                          <option value="left">左对齐</option>
                          <option value="center">居中</option>
                          <option value="right">右对齐</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 循环表格配置 */}
                  {selectedElement.type === 'table' && selectedElement.isLoopTable && (
                    <>
                      <div className="property-section">
                        <h4>数据源</h4>
                        <div className="property-row">
                          <label>数据源字段</label>
                          <input
                            type="text"
                            value={selectedElement.tableConfig?.dataSource || ''}
                            onChange={(e) => {
                              const newConfig = { ...selectedElement.tableConfig!, dataSource: e.target.value };
                              updateElementProperty('tableConfig', newConfig);
                            }}
                            placeholder="例如: items"
                          />
                        </div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', marginBottom: '12px' }}>
                          从数据中选择一个数组字段作为数据源
                        </div>

                        {/* 配置列按钮 */}
                        <button
                          onClick={() => setIsTableConfigModalOpen(true)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            background: '#1890ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <Settings size={16} />
                          配置表格列 ({selectedElement.tableConfig?.columns.length || 0} 列)
                        </button>
                      </div>

                      <div className="property-section">
                        <h4>表格样式</h4>
                        <div className="property-row">
                          <label>行高 (mm)</label>
                          <input
                            type="number"
                            value={selectedElement.tableConfig?.rowHeight || 8}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                rowHeight: parseFloat(e.target.value) || 8
                              });
                            }}
                          />
                        </div>

                        <div className="property-row">
                          <label>表头高度 (mm)</label>
                          <input
                            type="number"
                            value={selectedElement.tableConfig?.headerHeight || 10}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                headerHeight: parseFloat(e.target.value) || 10
                              });
                            }}
                          />
                        </div>

                        <div className="property-row">
                          <label>显示表头</label>
                          <input
                            type="checkbox"
                            checked={selectedElement.tableConfig?.showHeader !== false}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                showHeader: e.target.checked
                              });
                            }}
                          />
                        </div>

                        <div className="property-row">
                          <label>表头重复</label>
                          <input
                            type="checkbox"
                            checked={selectedElement.tableConfig?.headerRepeat !== false}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                headerRepeat: e.target.checked
                              });
                            }}
                          />
                        </div>

                        <div className="property-row">
                          <label>边框宽度</label>
                          <input
                            type="number"
                            value={selectedElement.tableConfig?.borderWidth || 1}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                borderWidth: parseFloat(e.target.value) || 1
                              });
                            }}
                          />
                        </div>

                        <div className="property-row">
                          <label>边框颜色</label>
                          <input
                            type="color"
                            value={selectedElement.tableConfig?.borderColor || '#000000'}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                borderColor: e.target.value
                              });
                            }}
                          />
                        </div>

                        <div className="property-row">
                          <label>表头背景色</label>
                          <input
                            type="color"
                            value={selectedElement.tableConfig?.headerBgColor || '#f0f0f0'}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                headerBgColor: e.target.value
                              });
                            }}
                          />
                        </div>

                        <div className="property-row">
                          <label>表头文字色</label>
                          <input
                            type="color"
                            value={selectedElement.tableConfig?.headerTextColor || '#000000'}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                headerTextColor: e.target.value
                              });
                            }}
                          />
                        </div>

                        <div className="property-row">
                          <label>偶数行背景色</label>
                          <input
                            type="color"
                            value={selectedElement.tableConfig?.evenRowBgColor || '#ffffff'}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                evenRowBgColor: e.target.value
                              });
                            }}
                          />
                        </div>

                        <div className="property-row">
                          <label>奇数行背景色</label>
                          <input
                            type="color"
                            value={selectedElement.tableConfig?.oddRowBgColor || '#fafafa'}
                            onChange={(e) => {
                              updateElementProperty('tableConfig', {
                                ...selectedElement.tableConfig!,
                                oddRowBgColor: e.target.value
                              });
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(selectedElement.type === 'line' || selectedElement.type === 'rect') && (
                    <div className="property-section">
                      <h4>边框样式</h4>
                      <div className="property-row">
                        <label>边框颜色</label>
                        <input
                          type="color"
                          value={selectedElement.stroke || '#000000'}
                          onChange={(e) => updateElementProperty('stroke', e.target.value)}
                        />
                      </div>
                      <div className="property-row">
                        <label>边框宽度</label>
                        <input
                          type="number"
                          value={selectedElement.strokeWidth || 1}
                          onChange={(e) => updateElementProperty('strokeWidth', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      {selectedElement.type === 'rect' && (
                        <div className="property-row">
                          <label>填充颜色</label>
                          <input
                            type="color"
                            value={selectedElement.fill || 'transparent'}
                            onChange={(e) => updateElementProperty('fill', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="property-section">
                    <h4>数据绑定</h4>
                    <div className="property-row">
                      <label>绑定表达式</label>
                      <textarea
                        value={selectedElement.binding || ''}
                        onChange={(e) => updateElementProperty('binding', e.target.value)}
                        placeholder='例如: {{productName}} 或 {{price}}*100+"元"'
                      />
                    </div>
                    <div className="field-tags">
                      {Object.keys(data).map((field) => (
                        <span
                          key={field}
                          className="field-tag"
                          onClick={() => {
                            const currentBinding = selectedElement.binding || '';
                            updateElementProperty('binding', currentBinding + `{{${field}}}`);
                          }}
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 业务数据标签页 */}
              {leftPanelTab === 'data' && (
                <div className="component-list">
                  <div className="component-category">
                    <h4>数据字段说明</h4>
                    <div style={{ padding: '12px', fontSize: '13px', color: '#595959' }}>
                      <p style={{ marginBottom: '8px' }}>可用数据字段：</p>
                      {Object.keys(data).length === 0 ? (
                        <p style={{ color: '#8c8c8c', fontStyle: 'italic' }}>暂无数据</p>
                      ) : (
                        Object.entries(data).map(([key, value]) => (
                          <div key={key} style={{ marginBottom: '12px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 'bold', color: '#262626', marginBottom: '4px' }}>
                              <code style={{ background: '#e6f7ff', padding: '2px 6px', borderRadius: '2px' }}>
                                {`{{${key}}}`}
                              </code>
                            </div>
                            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                              当前值: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="panel-footer">
                    <h4>使用说明</h4>
                    <div className="binding-help-mini">
                      <p><code>{'{{field}}'}</code> - 字段值</p>
                      <p><code>{'"￥"+{{price}}'}</code> - 拼接</p>
                      <p><code>{'{{qty}}*100'}</code> - 计算</p>
                      <p><code>{'{{price}}*{{qty}}'}</code> - 混合</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 组件列表标签页 */}
              {leftPanelTab === 'layers' && (
                <div className="component-list" style={{ position: 'relative' }}>
                  <div className="component-category">
                    <h4>画布组件 ({currentTemplate.elements.length})</h4>
                    {currentTemplate.elements.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#8c8c8c', fontSize: '13px' }}>
                        暂无组件，从左侧拖拽添加
                      </div>
                    ) : (
                      <div style={{ padding: '4px' }}>
                        {currentTemplate.elements.map((element, index) => {
                          const icon = COMPONENT_TOOLS.find(t => t.type === element.type)?.icon;
                          const label = COMPONENT_TOOLS.find(t => t.type === element.type)?.label || element.type;
                          const isSelected = selectedElement?.id === element.id;

                          return (
                            <div
                              key={element.id}
                              className={`component-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => selectElementById(element.id)}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setContextMenu({ x: e.clientX, y: e.clientY, elementId: element.id });
                              }}
                              style={{
                                cursor: 'pointer',
                                background: isSelected ? '#e6f7ff' : '#fafafa',
                                borderLeft: isSelected ? '3px solid #1890ff' : '3px solid transparent',
                                transition: 'all 0.2s',
                              }}
                            >
                              <div className="component-icon">
                                {icon}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div className="component-label">
                                  {label}
                                  {element.isHeader && ' (页眉)'}
                                  {element.isFooter && ' (页脚)'}
                                </div>
                                {element.binding && (
                                  <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '2px' }}>
                                    {element.binding.length > 20
                                      ? element.binding.substring(0, 20) + '...'
                                      : element.binding
                                    }
                                  </div>
                                )}
                              </div>
                              <div style={{ fontSize: '11px', color: '#bfbfbf' }}>
                                #{index + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="panel-footer">
                    <h4>操作提示</h4>
                    <div className="binding-help-mini">
                      <p>• 点击项目可选中组件</p>
                      <p>• 右键点击可删除组件</p>
                      <p>• 选中后自动跳转到配置页</p>
                    </div>
                  </div>

                  {/* 右键菜单 */}
                  {contextMenu && (
                    <div
                      style={{
                        position: 'fixed',
                        left: contextMenu.x,
                        top: contextMenu.y,
                        background: 'white',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        minWidth: '120px',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: '#ff4d4f',
                          transition: 'background 0.2s',
                        }}
                        onClick={() => {
                          deleteElementById(contextMenu.elementId);
                          setContextMenu(null);
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fff1f0'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        🗑️ 删除组件
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {/* 画布区域 */}
        <div className="canvas-area">
          {!showLeftPanel && !readOnly && (
            <button
              className="panel-show-button"
              onClick={() => setShowLeftPanel(true)}
              title="显示组件面板"
            >
              »
            </button>
          )}

          {/* 缩放和工具控制 */}
          <div className="canvas-controls">
            <div className="zoom-controls">
              <button
                onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                disabled={zoom <= 0.25}
                title="缩小"
              >
                <ZoomOut size={16} />
              </button>
              <span className="zoom-value">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                disabled={zoom >= 2}
                title="放大"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoom(1)}
                title="重置缩放"
              >
                1:1
              </button>
            </div>

            <div className="view-controls">
              <button
                className={showRuler ? 'active' : ''}
                onClick={() => setShowRuler(!showRuler)}
                title="标尺"
              >
                <RulerIcon size={16} />
              </button>
              <button
                className={showGuides ? 'active' : ''}
                onClick={() => setShowGuides(!showGuides)}
                title="对齐辅助线"
              >
                对齐
              </button>
            </div>
          </div>

          {/* 画布容器（包含标尺） */}
          <div className="canvas-container" ref={canvasContainerRef}>
            <div className="canvas-with-rulers">
              {showRuler && (
                <div className="ruler-row">
                  <div className="ruler-corner" />
                  <div className="ruler-top">
                    <Ruler
                      type="horizontal"
                      length={getPaperSize().width * zoom}
                      zoom={zoom}
                    />
                  </div>
                </div>
              )}
              <div className="ruler-row">
                {showRuler && (
                  <div className="ruler-left">
                    <Ruler
                      type="vertical"
                      length={getPaperSize().height * zoom}
                      zoom={zoom}
                    />
                  </div>
                )}
                <DroppableCanvas zoom={zoom}>
                  <canvas ref={canvasRef} />
                </DroppableCanvas>
              </div>
            </div>
          </div>
        </div>
        {/* canvas-area结束 */}
      </div>
      {/* print-content结束 */}

        <DragOverlay>
          {draggedTool && (
            <div className="component-item dragging-overlay">
              <div className="component-icon">{draggedTool.icon}</div>
              <div className="component-label">{draggedTool.label}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* 表格列配置模态窗 */}
      {selectedElement?.type === 'table' && selectedElement?.isLoopTable && (
        <DraggableModal
          isOpen={isTableConfigModalOpen}
          onClose={() => setIsTableConfigModalOpen(false)}
          title="配置表格列"
          width={900}
          height={650}
        >
          <div>
            {/* 使用 AdvancedTable 配置列 */}
            <AdvancedTable
              data={selectedElement.tableConfig?.columns || []}
              columns={[
                {
                  id: 'title',
                  header: '列标题',
                  accessorKey: 'title',
                  size: 120,
                  meta: { editable: true },
                },
                {
                  id: 'field',
                  header: '字段名/公式',
                  accessorKey: 'field',
                  size: 150,
                  meta: { editable: true },
                },
                {
                  id: 'width',
                  header: '列宽(mm)',
                  accessorKey: 'width',
                  size: 100,
                  meta: { editable: true },
                  cell: ({ getValue }) => {
                    const value = getValue();
                    return value || '自动';
                  },
                },
                {
                  id: 'align',
                  header: '对齐',
                  accessorKey: 'align',
                  size: 100,
                  meta: { editable: true },
                  cell: ({ getValue }) => {
                    const value = getValue() as string;
                    const alignMap: Record<string, string> = {
                      left: '左对齐',
                      center: '居中',
                      right: '右对齐',
                    };
                    return alignMap[value] || value;
                  },
                },
                {
                  id: 'formatter',
                  header: '格式化公式',
                  accessorKey: 'formatter',
                  size: 220,
                  meta: { editable: true },
                },
                {
                  id: 'actions',
                  header: '操作',
                  size: 80,
                  cell: ({ row }) => (
                    <button
                      onClick={() => {
                        const newColumns = selectedElement.tableConfig!.columns.filter((_, i) => i !== row.index);
                        updateElementProperty('tableConfig', { ...selectedElement.tableConfig!, columns: newColumns });
                      }}
                      style={{
                        padding: '4px 12px',
                        background: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={14} />
                      删除
                    </button>
                  ),
                },
              ] as ColumnDef<TableColumn>[]}
              onDataChange={(newData) => {
                updateElementProperty('tableConfig', { ...selectedElement.tableConfig!, columns: newData });
              }}
              toolbarButtons={[
                {
                  key: 'add-column',
                  label: '添加列',
                  icon: <Plus size={16} />,
                  onClick: () => {
                    const newColumns = [
                      ...(selectedElement.tableConfig?.columns || []),
                      {
                        field: 'field' + ((selectedElement.tableConfig?.columns.length || 0) + 1),
                        title: '新列',
                        align: 'left' as const,
                        width: undefined,
                        formatter: '',
                      }
                    ];
                    updateElementProperty('tableConfig', { ...selectedElement.tableConfig!, columns: newColumns });
                  },
                }
              ]}
              enableEditing={true}
              editTriggerMode="doubleClick"
              autoSave={true}
              enableFiltering={false}
              enableExport={false}
              enableZebraStripes={true}
              enableCrossHighlight={true}
              enablePaste={true}
            />

            {/* 提示信息 */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#e6f7ff',
              borderRadius: '6px',
              border: '1px solid #91d5ff',
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0050b3', fontWeight: 600 }}>
                💡 使用提示
              </h4>
              <div style={{ fontSize: '12px', color: '#595959', lineHeight: '2' }}>
                <div><strong>字段名/公式：</strong>可以是数据源字段（如 name, price），也可以是计算公式（如 price*qty）</div>
                <div style={{ paddingLeft: '16px', marginTop: '4px' }}>
                  <div>• <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>name</code> - 直接显示字段值</div>
                  <div>• <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>price*qty</code> - 计算总价（价格×数量）</div>
                  <div>• <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>amount-discount</code> - 计算优惠后金额</div>
                </div>
                <div style={{ marginTop: '8px' }}><strong>列宽：</strong>留空则自动平均分配宽度</div>
                <div><strong>对齐：</strong>输入 left / center / right</div>
                <div><strong>格式化公式：</strong>对计算结果进一步格式化</div>
                <div style={{ paddingLeft: '16px', marginTop: '4px' }}>
                  <div>• <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>￥{`{{value}}`}</code> - 添加货币符号</div>
                  <div>• <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>{`{{value}}`}*100+"%"</code> - 转为百分比</div>
                  <div>• <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>{`{{value}}`}.toFixed(2)</code> - 保留2位小数</div>
                </div>
              </div>
            </div>
          </div>
        </DraggableModal>
      )}
    </div>
  );
};

export default PrintDesigner;

