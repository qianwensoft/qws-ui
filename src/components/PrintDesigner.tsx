import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
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
  type: 'text' | 'image' | 'barcode' | 'qrcode';
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

    // 监听对象修改
    if (!readOnly) {
      canvas.on('object:modified', () => {
        saveTemplate();
      });
      canvas.on('object:added', () => {
        saveTemplate();
      });
      canvas.on('object:removed', () => {
        saveTemplate();
      });
    }

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [readOnly]);

  // 保存模板
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

    const newTemplate: PrintTemplate = {
      ...currentTemplate,
      elements,
    };

    setCurrentTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  }, [currentTemplate, onTemplateChange, pxToMm]);

  // 渲染模板元素
  const renderElements = useCallback(() => {
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

      if (element.type === 'text') {
        const text = new fabric.Textbox(displayValue, {
          left: mmToPx(element.left),
          top: mmToPx(element.top),
          width: element.width ? mmToPx(element.width) : 200,
          fontSize: element.fontSize || 14,
          fontFamily: element.fontFamily || 'Arial',
          fill: element.fill || '#000000',
          fontWeight: element.fontWeight || 'normal',
          textAlign: element.textAlign || 'left',
          selectable: !readOnly,
          editable: !readOnly,
        });

        (text as any).customData = element;
        canvas.add(text);
      }
    });

    canvas.renderAll();
  }, [currentTemplate.elements, data, mmToPx, readOnly]);

  // 当模板或数据变化时重新渲染
  useEffect(() => {
    renderElements();
  }, [renderElements]);

  // 当纸张大小变化时调整画布
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const paperSize = getPaperSize();
    fabricCanvasRef.current.setDimensions(paperSize);
    renderElements();
  }, [currentTemplate.paper, getPaperSize, renderElements]);

  // 添加文本元素
  const addTextElement = () => {
    if (!fabricCanvasRef.current) return;

    const newElement: DataBindingElement = {
      id: `text_${Date.now()}`,
      type: 'text',
      left: 20,
      top: 20,
      binding: '{{productName}}',
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#000000',
    };

    const text = new fabric.Textbox('双击编辑', {
      left: mmToPx(newElement.left),
      top: mmToPx(newElement.top),
      fontSize: newElement.fontSize,
      fontFamily: newElement.fontFamily,
      fill: newElement.fill,
      width: 200,
    });

    (text as any).customData = newElement;
    fabricCanvasRef.current.add(text);
    saveTemplate();
  };

  // 删除选中元素
  const deleteSelected = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      saveTemplate();
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
            <button onClick={addTextElement}>添加文本</button>
            <button onClick={deleteSelected}>删除选中</button>
          </div>

          <div className="toolbar-section">
            <button onClick={handlePrint} className="print-button">
              打印预览
            </button>
          </div>
        </div>
      )}

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>

      {showToolbar && !readOnly && (
        <div className="print-properties">
          <h3>数据绑定说明</h3>
          <div className="binding-help">
            <p>支持以下格式：</p>
            <ul>
              <li><code>{'{{fieldName}}'}</code> - 直接绑定字段</li>
              <li><code>{'{{qty}}*100+"元"'}</code> - 计算并拼接</li>
              <li><code>{'{{price}}+"/"+"{{unit}}"'}</code> - 字段拼接</li>
            </ul>
            <p>可用字段：{Object.keys(data).join(', ') || '无'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintDesigner;

