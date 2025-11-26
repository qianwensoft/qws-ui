import React, { useState } from 'react';
import { PrintDesigner, type PrintTemplate } from './components/PrintDesigner';
import './App.css';

function PrintDemo() {
  const [template, setTemplate] = useState<PrintTemplate>({
    name: '产品标签',
    paper: { size: 'A4', orientation: 'portrait' },
    elements: [
      {
        id: 'title',
        type: 'text',
        left: 20,
        top: 20,
        binding: '{{productName}}',
        fontSize: 20,
        fontWeight: 'bold',
      },
      {
        id: 'price',
        type: 'text',
        left: 20,
        top: 50,
        binding: '{{price}}+"元/"+{{unit}}',
        fontSize: 16,
      },
      {
        id: 'qty',
        type: 'text',
        left: 20,
        top: 80,
        binding: '"库存: "+{{qty}}+"件"',
        fontSize: 14,
      },
    ],
  });

  const [data] = useState({
    productName: '苹果手机',
    price: 5999,
    unit: '台',
    qty: 100,
    description: '最新款智能手机',
  });

  const handleTemplateChange = (newTemplate: PrintTemplate) => {
    setTemplate(newTemplate);
    console.log('模板已更新:', newTemplate);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>打印设计器演示</h1>
        <div className="features">
          <div className="feature-item">
            <strong>功能 1:</strong> 支持多种纸张尺寸 - A4, A5, B5, Letter, 自定义
          </div>
          <div className="feature-item">
            <strong>功能 2:</strong> 数据绑定 - 使用 {'{{fieldName}}'} 语法绑定数据
          </div>
          <div className="feature-item">
            <strong>功能 3:</strong> 公式计算 - 支持 {'{{qty}}*100+"元"'} 等计算和拼接
          </div>
        </div>
      </div>

      <PrintDesigner
        template={template}
        data={data}
        onTemplateChange={handleTemplateChange}
        readOnly={false}
        showToolbar={true}
      />
    </div>
  );
}

export default PrintDemo;

