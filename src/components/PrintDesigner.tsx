import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { Type, Image, Barcode, QrCode, Minus, Square, Table, ZoomIn, ZoomOut, Ruler } from 'lucide-react';
import './PrintDesigner.css';

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
}

// 数据绑定元素
export interface DataBindingElement {
  id: string;
  type: 'text' | 'image' | 'barcode' | 'qrcode' | 'line' | 'rect' | 'table';
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
  // 特殊标记
  isHeader?: boolean;  // 是否为页眉
  isFooter?: boolean;  // 是否为页脚
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

    // 设置canvas尺寸
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

    const step = 10 * zoom; // 每10px一个小刻度
    const bigStep = 50 * zoom; // 每50px一个大刻度

    for (let i = 0; i <= length; i += step) {
      const isBig = i % bigStep === 0;
      const lineLength = isBig ? 10 : 5;

      if (type === 'horizontal') {
        ctx.beginPath();
        ctx.moveTo(i, 20);
        ctx.lineTo(i, 20 - lineLength);
        ctx.stroke();

        if (isBig && i > 0) {
          const mm = Math.round((i / zoom / 96) * 25.4);
          ctx.fillText(mm + 'mm', i + 2, 10);
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(20, i);
        ctx.lineTo(20 - lineLength, i);
        ctx.stroke();

        if (isBig && i > 0) {
          const mm = Math.round((i / zoom / 96) * 25.4);
          ctx.save();
          ctx.translate(10, i - 2);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(mm + 'mm', 0, 0);
          ctx.restore();
        }
      }
    }
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

// 组件工具定义
interface ComponentTool {
  type: DataBindingElement['type'];
  label: string;
  icon: React.ReactNode;
  defaultProps: Partial<DataBindingElement>;
}

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
    label: '表格',
    icon: <Table size={20} />,
    defaultProps: {
      width: 180,
      height: 120,
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
  const [zoom, setZoom] = useState(1);  // 缩放比例
  const [showRuler, setShowRuler] = useState(true);  // 是否显示标尺
  const [showGuides, setShowGuides] = useState(true);  // 是否显示对齐线

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
      height: mmToPx(paperHeight),
    };
  }, [currentTemplate.paper, mmToPx]);

  // 初始化 fabric.js 画布
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const paperSize = getPaperSize();
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: paperSize.width,
      height: paperSize.height,
      backgroundColor: '#ffffff',
      selection: !readOnly,
    });

    fabricCanvasRef.current = canvas;

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
        elements.push({
          id: obj.customData.id,
          type: obj.customData.type,
          left: pxToMm(obj.left || 0),
          top: pxToMm(obj.top || 0),
          width: obj.width ? pxToMm(obj.width * (obj.scaleX || 1)) : undefined,
          height: obj.height ? pxToMm(obj.height * (obj.scaleY || 1)) : undefined,
          binding: obj.customData.binding,
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily,
          fill: obj.fill,
          fontWeight: obj.fontWeight,
          textAlign: obj.textAlign,
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
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';

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
      }

      if (fabricObj) {
        (fabricObj as any).customData = element;
        canvas.add(fabricObj);
      }
    });

    canvas.renderAll();
  }, [currentTemplate.elements, data, mmToPx, readOnly]);

  // 当纸张大小变化时调整画布
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const paperSize = getPaperSize();
    fabricCanvasRef.current.setDimensions(paperSize);
  }, [currentTemplate.paper, getPaperSize]);

  // 通用添加元素方法
  const addElement = (tool: ComponentTool) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const centerX = pxToMm(canvas.width! / 2);
    const centerY = pxToMm(canvas.height! / 2);

    const newElement: DataBindingElement = {
      id: `${tool.type}_${Date.now()}`,
      type: tool.type,
      left: centerX - 50,
      top: centerY - 20,
      ...tool.defaultProps,
    };

    let fabricObj: fabric.Object | null = null;

    switch (tool.type) {
      case 'text':
        fabricObj = new fabric.Textbox('双击编辑', {
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          fontSize: newElement.fontSize || 14,
          fontFamily: newElement.fontFamily || 'Arial',
          fill: newElement.fill || '#000000',
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
        fabricObj = new fabric.Textbox(`[${tool.label}]\n${newElement.binding || ''}`, {
          left: mmToPx(newElement.left),
          top: mmToPx(newElement.top),
          width: mmToPx(newElement.width || 100),
          fontSize: 12,
          fill: '#8c8c8c',
          textAlign: 'center',
        });
        break;
    }

    if (fabricObj) {
      (fabricObj as any).customData = newElement;
      canvas.add(fabricObj);
      canvas.renderAll();
    }
  };

  // 添加页眉线
  const addHeaderLine = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const paperWidth = canvas.width!;

    const newElement: DataBindingElement = {
      id: `header_${Date.now()}`,
      type: 'line',
      left: pxToMm(10),
      top: pxToMm(30),
      width: pxToMm(paperWidth - 20),
      stroke: '#000000',
      strokeWidth: 1,
      isHeader: true,
    };

    const line = new fabric.Line(
      [10, 30, paperWidth - 10, 30],
      {
        stroke: newElement.stroke,
        strokeWidth: newElement.strokeWidth,
      }
    );

    (line as any).customData = newElement;
    canvas.add(line);
    canvas.renderAll();
  };

  // 添加页脚线
  const addFooterLine = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const paperWidth = canvas.width!;
    const paperHeight = canvas.height!;

    const newElement: DataBindingElement = {
      id: `footer_${Date.now()}`,
      type: 'line',
      left: pxToMm(10),
      top: pxToMm(paperHeight - 30),
      width: pxToMm(paperWidth - 20),
      stroke: '#000000',
      strokeWidth: 1,
      isFooter: true,
    };

    const line = new fabric.Line(
      [10, paperHeight - 30, paperWidth - 10, paperHeight - 30],
      {
        stroke: newElement.stroke,
        strokeWidth: newElement.strokeWidth,
      }
    );

    (line as any).customData = newElement;
    canvas.add(line);
    canvas.renderAll();
  };

  // 删除选中元素
  const deleteSelected = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
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

  // 打印
  const handlePrint = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const dataUrl = canvas.toDataURL({ format: 'png', quality: 1 });

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>打印</title>
            <style>
              @media print {
                body { margin: 0; }
                img { width: 100%; height: auto; }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" />
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="print-designer-container">
      {showToolbar && !readOnly && (
        <div className="print-toolbar">
          <div className="toolbar-section">
            <label>纸张大小：</label>
            <select
              value={currentTemplate.paper.size}
              onChange={(e) => changePaperSize(e.target.value as PaperSizeKey)}
            >
              {Object.entries(PAPER_SIZES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-section">
            <button onClick={toggleOrientation}>
              {currentTemplate.paper.orientation === 'portrait' ? '纵向' : '横向'}
            </button>
          </div>

          <div className="toolbar-section">
            <button onClick={deleteSelected}>删除选中</button>
            <button onClick={saveTemplate}>保存模板</button>
          </div>

          <div className="toolbar-section">
            <button onClick={handlePrint} className="print-button">
              打印预览
            </button>
          </div>
        </div>
      )}

      <div className="print-content">
        {/* 左侧组件面板 */}
        {!readOnly && showLeftPanel && (
          <div className="component-panel">
            <div className="panel-header">
              <h3>组件库</h3>
              <button
                className="panel-toggle"
                onClick={() => setShowLeftPanel(false)}
                title="收起"
              >
                «
              </button>
            </div>

            <div className="component-list">
              <div className="component-category">
                <h4>基础组件</h4>
                {COMPONENT_TOOLS.map((tool) => (
                  <div
                    key={tool.type}
                    className="component-item"
                    onClick={() => addElement(tool)}
                    title={`添加${tool.label}`}
                  >
                    <div className="component-icon">{tool.icon}</div>
                    <div className="component-label">{tool.label}</div>
                  </div>
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
                <Ruler size={16} />
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
          <div className="canvas-container">
            {showRuler && (
              <>
                <div className="ruler-corner" />
                <div className="ruler-top">
                  <Ruler
                    type="horizontal"
                    length={getPaperSize().width * zoom}
                    zoom={zoom}
                  />
                </div>
                <div className="ruler-left">
                  <Ruler
                    type="vertical"
                    length={getPaperSize().height * zoom}
                    zoom={zoom}
                  />
                </div>
              </>
            )}
            <div className="canvas-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintDesigner;

