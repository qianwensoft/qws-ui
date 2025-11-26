import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PrintDesigner, type PrintTemplate, PAPER_SIZES } from '../components/PrintDesigner';
import '../components/PrintDesigner.css';

// Story 元数据
const meta: Meta<typeof PrintDesigner> = {
  title: 'Components/PrintDesigner',
  component: PrintDesigner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PrintDesigner>;

// 示例数据 - 产品信息
const productData = {
  productName: '苹果 iPhone 15 Pro',
  productCode: 'IP15PRO-256-BLK',
  price: 7999,
  originalPrice: 8999,
  unit: '台',
  qty: 150,
  warehouse: '北京仓',
  category: '数码产品',
  brand: 'Apple',
  supplier: '苹果授权经销商',
  date: '2024-11-26',
  barcode: '1234567890123',
};

// 示例数据 - 订单信息
const orderData = {
  orderNo: 'ORD20241126001',
  customerName: '张三',
  phone: '13800138000',
  address: '北京市朝阳区xx街道xx号',
  totalAmount: 15998,
  discount: 500,
  finalAmount: 15498,
  orderDate: '2024-11-26',
  deliveryDate: '2024-11-28',
  items: 2,
  paymentMethod: '微信支付',
};

// 基础模板
const basicTemplate: PrintTemplate = {
  name: '产品标签',
  paper: { size: 'A4', orientation: 'portrait' },
  elements: [
    {
      id: 'title',
      type: 'text',
      left: 20,
      top: 20,
      binding: '{{productName}}',
      fontSize: 24,
      fontWeight: 'bold',
      fill: '#000000',
    },
    {
      id: 'code',
      type: 'text',
      left: 20,
      top: 55,
      binding: '"商品编码: "+{{productCode}}',
      fontSize: 14,
      fill: '#595959',
    },
    {
      id: 'price',
      type: 'text',
      left: 20,
      top: 85,
      binding: '"￥"+{{price}}',
      fontSize: 32,
      fontWeight: 'bold',
      fill: '#ff4d4f',
    },
    {
      id: 'qty',
      type: 'text',
      left: 20,
      top: 130,
      binding: '"库存: "+{{qty}}+"件"',
      fontSize: 16,
      fill: '#000000',
    },
  ],
};

// 复杂模板（带计算）
const advancedTemplate: PrintTemplate = {
  name: '价格标签',
  paper: { size: 'A5', orientation: 'portrait' },
  elements: [
    {
      id: 'product',
      type: 'text',
      left: 15,
      top: 15,
      binding: '{{productName}}',
      fontSize: 20,
      fontWeight: 'bold',
    },
    {
      id: 'original',
      type: 'text',
      left: 15,
      top: 50,
      binding: '"原价: ￥"+{{originalPrice}}',
      fontSize: 14,
      fill: '#8c8c8c',
    },
    {
      id: 'current',
      type: 'text',
      left: 15,
      top: 75,
      binding: '"现价: ￥"+{{price}}',
      fontSize: 20,
      fontWeight: 'bold',
      fill: '#ff4d4f',
    },
    {
      id: 'discount',
      type: 'text',
      left: 15,
      top: 110,
      binding: '"立省 ￥"+({{originalPrice}}-{{price}})',
      fontSize: 16,
      fill: '#52c41a',
    },
    {
      id: 'unit',
      type: 'text',
      left: 15,
      top: 140,
      binding: '"单位: "+{{unit}}',
      fontSize: 12,
      fill: '#595959',
    },
  ],
};

// 订单模板
const orderTemplate: PrintTemplate = {
  name: '订单详情',
  paper: { size: 'A4', orientation: 'portrait' },
  elements: [
    {
      id: 'header',
      type: 'text',
      left: 80,
      top: 20,
      binding: '"订单详情"',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    {
      id: 'orderNo',
      type: 'text',
      left: 20,
      top: 70,
      binding: '"订单编号: "+{{orderNo}}',
      fontSize: 14,
    },
    {
      id: 'customer',
      type: 'text',
      left: 20,
      top: 95,
      binding: '"客户姓名: "+{{customerName}}',
      fontSize: 14,
    },
    {
      id: 'phone',
      type: 'text',
      left: 20,
      top: 120,
      binding: '"联系电话: "+{{phone}}',
      fontSize: 14,
    },
    {
      id: 'address',
      type: 'text',
      left: 20,
      top: 145,
      binding: '"收货地址: "+{{address}}',
      fontSize: 14,
      width: 170,
    },
    {
      id: 'total',
      type: 'text',
      left: 20,
      top: 185,
      binding: '"总金额: ￥"+{{totalAmount}}',
      fontSize: 16,
      fontWeight: 'bold',
    },
    {
      id: 'final',
      type: 'text',
      left: 20,
      top: 215,
      binding: '"实付金额: ￥"+{{finalAmount}}',
      fontSize: 18,
      fontWeight: 'bold',
      fill: '#ff4d4f',
    },
  ],
};

// Story 1: 基础示例
export const Basic: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>(basicTemplate);

    return (
      <PrintDesigner
        template={template}
        data={productData}
        onTemplateChange={(newTemplate) => {
          setTemplate(newTemplate);
          console.log('模板已更新:', newTemplate);
        }}
        readOnly={false}
        showToolbar={true}
      />
    );
  },
};

// Story 2: A5 横向
export const A5Landscape: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      ...basicTemplate,
      paper: { size: 'A5', orientation: 'landscape' },
    });

    return (
      <PrintDesigner
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
    );
  },
};

// Story 3: 复杂计算公式
export const AdvancedFormula: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>(advancedTemplate);

    return (
      <PrintDesigner
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
    );
  },
};

// Story 4: 订单打印
export const OrderPrint: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>(orderTemplate);

    return (
      <PrintDesigner
        template={template}
        data={orderData}
        onTemplateChange={setTemplate}
      />
    );
  },
};

// Story 5: 只读模式（预览）
export const ReadOnly: Story = {
  render: () => {
    return (
      <PrintDesigner
        template={basicTemplate}
        data={productData}
        readOnly={true}
        showToolbar={false}
      />
    );
  },
};

// Story 6: B5 纸张
export const B5Paper: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      ...basicTemplate,
      paper: { size: 'B5', orientation: 'portrait' },
    });

    return (
      <PrintDesigner
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
    );
  },
};

// Story 7: 空模板（从零开始设计）
export const EmptyTemplate: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      name: '新模板',
      paper: { size: 'A4', orientation: 'portrait' },
      elements: [],
    });

    return (
      <PrintDesigner
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
    );
  },
};

// Story 8: 多种数据源
export const MultipleDataSources: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      name: '综合信息',
      paper: { size: 'A4', orientation: 'portrait' },
      elements: [
        {
          id: 'header',
          type: 'text',
          left: 20,
          top: 20,
          binding: '"商品信息卡"',
          fontSize: 24,
          fontWeight: 'bold',
        },
        {
          id: 'product',
          type: 'text',
          left: 20,
          top: 60,
          binding: '"产品: "+{{productName}}',
          fontSize: 16,
        },
        {
          id: 'brand',
          type: 'text',
          left: 20,
          top: 85,
          binding: '"品牌: "+{{brand}}',
          fontSize: 14,
        },
        {
          id: 'category',
          type: 'text',
          left: 20,
          top: 110,
          binding: '"类别: "+{{category}}',
          fontSize: 14,
        },
        {
          id: 'calculation',
          type: 'text',
          left: 20,
          top: 140,
          binding: '"总价值: ￥"+({{price}}*{{qty}})',
          fontSize: 18,
          fontWeight: 'bold',
          fill: '#1890ff',
        },
        {
          id: 'supplier',
          type: 'text',
          left: 20,
          top: 175,
          binding: '"供应商: "+{{supplier}}',
          fontSize: 12,
          fill: '#8c8c8c',
        },
      ],
    });

    return (
      <PrintDesigner
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
    );
  },
};

